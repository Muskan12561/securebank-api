import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@securebank.local" },
    update: {},
    create: {
      email: "admin@securebank.local",
      name: "SecureBank Admin",
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  const customerPasswordHash = await bcrypt.hash("User@12345", 12);

  const customer = await prisma.user.upsert({
    where: { email: "user@securebank.local" },
    update: {},
    create: {
      email: "user@securebank.local",
      name: "Demo Customer",
      passwordHash: customerPasswordHash
    }
  });

  await prisma.account.upsert({
    where: { accountNumber: "1000000001" },
    update: {},
    create: {
      accountNumber: "1000000001",
      userId: customer.id,
      balance: 10000
    }
  });

  console.log("Seed complete.");
  console.log("Admin: admin@securebank.local / Admin@12345");
  console.log("Customer: user@securebank.local / User@12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
