import { prisma } from "../lib/prisma";
import { transactionReference } from "../utils/ids";

export async function transfer(
  userId: string,
  idempotencyKey: string,
  input: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description?: string;
  }
) {
  if (!idempotencyKey || idempotencyKey.length < 8 || idempotencyKey.length > 100) {
    throw new Error("INVALID_IDEMPOTENCY_KEY");
  }

  const existing = await prisma.transfer.findUnique({
    where: { idempotencyKey },
    include: { transactions: true }
  });

  if (existing) {
    if (existing.senderId !== userId) throw new Error("IDEMPOTENCY_KEY_IN_USE");
    return { transfer: existing, reused: true };
  }

  return prisma.$transaction(async (tx) => {
    const from = await tx.account.findFirst({
      where: { id: input.fromAccountId, userId }
    });

    if (!from) throw new Error("SOURCE_ACCOUNT_NOT_FOUND");
    if (from.status !== "ACTIVE") throw new Error("SOURCE_ACCOUNT_NOT_ACTIVE");

    const to = await tx.account.findUnique({
      where: { accountNumber: input.toAccountNumber }
    });

    if (!to) throw new Error("DESTINATION_ACCOUNT_NOT_FOUND");
    if (to.status !== "ACTIVE") throw new Error("DESTINATION_ACCOUNT_NOT_ACTIVE");
    if (from.id === to.id) throw new Error("SAME_ACCOUNT_TRANSFER");
    if (from.balance.lessThan(input.amount)) throw new Error("INSUFFICIENT_FUNDS");

    const sender = await tx.user.findUnique({ where: { id: userId } });
    if (!sender) throw new Error("USER_NOT_FOUND");

    const senderBalance = from.balance.minus(input.amount);
    const receiverBalance = to.balance.plus(input.amount);

    await tx.account.update({
      where: { id: from.id },
      data: { balance: senderBalance }
    });

    await tx.account.update({
      where: { id: to.id },
      data: { balance: receiverBalance }
    });

    const createdTransfer = await tx.transfer.create({
      data: {
        fromAccountId: from.id,
        toAccountId: to.id,
        senderId: sender.id,
        receiverId: to.userId,
        amount: input.amount,
        status: "COMPLETED",
        idempotencyKey,
        description: input.description
      }
    });

    await tx.transaction.create({
      data: {
        accountId: from.id,
        type: "TRANSFER",
        status: "COMPLETED",
        amount: input.amount,
        balanceAfter: senderBalance,
        reference: transactionReference("TRF-OUT"),
        description: input.description ?? `Transfer to ${to.accountNumber}`,
        transferId: createdTransfer.id
      }
    });

    await tx.transaction.create({
      data: {
        accountId: to.id,
        type: "TRANSFER",
        status: "COMPLETED",
        amount: input.amount,
        balanceAfter: receiverBalance,
        reference: transactionReference("TRF-IN"),
        description: input.description ?? `Transfer from ${from.accountNumber}`,
        transferId: createdTransfer.id
      }
    });

    return {
      transfer: createdTransfer,
      reused: false
    };
  }, { isolationLevel: "Serializable" });
}
