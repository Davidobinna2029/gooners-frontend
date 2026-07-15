import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "info@arsenaltalks.com";

  const password = "David07065492029.";

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    console.log(
      "Owner account already exists."
    );

    console.log(
      `Email: ${email}`
    );

    return;
  }

  const user =
    await prisma.user.create({
      data: {
        email,
        password:
          hashedPassword,
        role: "OWNER",
      },
    });

  console.log(
    "Owner account created successfully."
  );

  console.log(
    `Email: ${user.email}`
  );

  console.log(
    "Role: OWNER"
  );
}

main()
  .catch((error) => {
    console.error(
      "Failed to create owner account:"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });