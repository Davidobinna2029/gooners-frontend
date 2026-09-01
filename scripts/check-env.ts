console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);

  console.log("DATABASE host:", url.hostname);
  console.log("DATABASE port:", url.port || "5432");
  console.log("DATABASE name:", url.pathname);
}