export async function safeFetch(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 30 },
      });

      if (!res.ok) throw new Error("Bad response");

      return await res.json();
    } catch (err) {
      if (i === retries - 1) {
        console.error("FETCH FAILED FINAL:", url);
        return null;
      }
    }
  }

  return null;
}