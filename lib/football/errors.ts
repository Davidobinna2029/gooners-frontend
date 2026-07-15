// lib/football/errors.ts

export class FootballError extends Error {
  constructor(
    message: string,
    public readonly provider?: string
  ) {
    super(message);

    this.name = "FootballError";
  }
}

export class ProviderNotFoundError extends FootballError {
  constructor(provider: string) {
    super(
      `Football provider "${provider}" not found.`,
      provider
    );

    this.name = "ProviderNotFoundError";
  }
}

export class FootballApiError extends FootballError {
  constructor(
    provider: string,
    status: number
  ) {
    super(
      `${provider} API returned ${status}`,
      provider
    );

    this.name = "FootballApiError";
  }
}