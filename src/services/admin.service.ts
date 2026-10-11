import { prisma } from "../lib/prisma";

export async function users() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      _count: { select: { accounts: true } }
    }
  });
}

export async function accounts() {
  return prisma.account.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      accountNumber: true,
      balance: true,
      currency: true,
      status: true,
      createdAt: true,
      user: { select: { id: true, email: true, name: true } }
    }
  });
}

export async function transactions() {
  return prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      type: true,
      status: true,
      amount: true,
      reference: true,
      createdAt: true,
      account: { select: { accountNumber: true } }
    }
  });
}
