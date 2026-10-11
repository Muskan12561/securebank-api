import { prisma } from "../lib/prisma";

export async function listTransactions(
  userId: string,
  query: { page: number; limit: number; type?: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" }
) {
  const skip = (query.page - 1) * query.limit;

  const where = {
    account: { userId },
    ...(query.type ? { type: query.type } : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
      select: {
        id: true,
        type: true,
        status: true,
        amount: true,
        balanceAfter: true,
        reference: true,
        description: true,
        createdAt: true,
        account: {
          select: {
            accountNumber: true,
            currency: true
          }
        }
      }
    }),
    prisma.transaction.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit)
    }
  };
}
