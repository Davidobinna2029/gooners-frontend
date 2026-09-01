import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "info@arsenaltalks.com";
  const password = "David07065492029.";

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      password: hashedPassword,
      role: "OWNER",
    },
    create: {
      email,
      password: hashedPassword,
      role: "OWNER",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log("Owner account created/updated successfully.");
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
}

main()
  .catch((error) => {
    console.error("Failed to create owner account:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });