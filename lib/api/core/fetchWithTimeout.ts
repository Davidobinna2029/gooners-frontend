
export class FetchTimeoutError extends Error {
  constructor(url: string, timeout: number) {
    super(
      `[FETCH TIMEOUT] Request exceeded ${timeout}ms: ${url}`
    );

    this.name = "FetchTimeoutError";
  }
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 8000
): Promise<Response> {
  const controller = new AbortController();
  const externalSignal = options.signal;

  let timedOut = false;

  const abortFromExternalSignal = () => {
    controller.abort(externalSignal?.reason);
  };

  if (externalSignal?.aborted) {
    abortFromExternalSignal();
  } else {
    externalSignal?.addEventListener(
      "abort",
      abortFromExternalSignal,
      { once: true }
    );
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) {
      throw new FetchTimeoutError(url, timeout);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);

    externalSignal?.removeEventListener(
      "abort",
      abortFromExternalSignal
    );
  }
}
