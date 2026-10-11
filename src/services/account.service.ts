import { prisma } from "../lib/prisma";
import { accountNumber, transactionReference } from "../utils/ids";

export async function createAccount(
  userId: string,
  currency: "INR" | "USD" | "EUR"
) {
  return prisma.account.create({
    data: {
      accountNumber: accountNumber(),
      userId,
      currency
    },
    select: {
      id: true,
      accountNumber: true,
      balance: true,
      currency: true,
      status: true,
      createdAt: true
    }
  });
}

export async function listMyAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      accountNumber: true,
      balance: true,
      currency: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function getMyAccount(userId: string, accountId: string) {
  return prisma.account.findFirst({
    where: { id: accountId, userId },
    select: {
      id: true,
      accountNumber: true,
      balance: true,
      currency: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function deposit(userId: string, accountId: string, amount: number, description?: string) {
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: { id: accountId, userId }
    });

    if (!account) throw new Error("ACCOUNT_NOT_FOUND");
    if (account.status !== "ACTIVE") throw new Error("ACCOUNT_NOT_ACTIVE");

    const newBalance = account.balance.plus(amount);

    const updated = await tx.account.update({
      where: { id: account.id },
      data: { balance: newBalance }
    });

    const transaction = await tx.transaction.create({
      data: {
        accountId: account.id,
        type: "DEPOSIT",
        status: "COMPLETED",
        amount,
        balanceAfter: newBalance,
        reference: transactionReference("DEP"),
        description
      }
    });

    return { account: updated, transaction };
  });
}

export async function withdraw(userId: string, accountId: string, amount: number, description?: string) {
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: { id: accountId, userId }
    });

    if (!account) throw new Error("ACCOUNT_NOT_FOUND");
    if (account.status !== "ACTIVE") throw new Error("ACCOUNT_NOT_ACTIVE");
    if (account.balance.lessThan(amount)) throw new Error("INSUFFICIENT_FUNDS");

    const newBalance = account.balance.minus(amount);

    const updated = await tx.account.update({
      where: { id: account.id },
      data: { balance: newBalance }
    });

    const transaction = await tx.transaction.create({
      data: {
        accountId: account.id,
        type: "WITHDRAWAL",
        status: "COMPLETED",
        amount,
        balanceAfter: newBalance,
        reference: transactionReference("WDL"),
        description
      }
    });

    return { account: updated, transaction };
  });
}
