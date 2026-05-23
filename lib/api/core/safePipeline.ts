export async function safePipeline<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const result = await fn();
    return result ?? fallback;
  } catch (err) {
    console.error("Pipeline error:", err);
    return fallback;
  }
}