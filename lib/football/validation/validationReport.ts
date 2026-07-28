// lib/football/validation/validationReport.ts

export interface ValidationStage {
  name: string;
  output: unknown;
  timestamp: string;
}

export interface ValidationReport {
  fixtureId: string | number;
  generatedAt: string;
  success: boolean;
  stages: ValidationStage[];
  error?: {
    message: string;
    stack?: string;
  };
}

export function createEmptyReport(
  fixtureId: string | number
): ValidationReport {
  return {
    fixtureId,
    generatedAt: new Date().toISOString(),
    success: false,
    stages: [],
  };
}

export function recordStage(
  report: ValidationReport,
  name: string,
  output: unknown
): void {
  report.stages.push({
    name,
    output,
    timestamp: new Date().toISOString(),
  });
}

export function recordError(
  report: ValidationReport,
  error: unknown
): void {
  report.error = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };
}

/**
 * Pretty-prints a report stage by stage. This is NOT a pass/fail
 * assertion tool — it's meant to be read by a human comparing
 * output against what actually happened in the match (see
 * docs/football-validation.md Phase 3/4). A report with
 * success: true only means the pipeline ran without throwing, not
 * that the football analysis is correct.
 */
export function printReport(report: ValidationReport): void {

  console.log(`\n=== Validation Report: fixture ${report.fixtureId} ===`);
  console.log(`Generated: ${report.generatedAt}\n`);

  for (const stage of report.stages) {
    console.log(`--- ${stage.name} ---`);
    console.log(JSON.stringify(stage.output, null, 2));
    console.log("");
  }

  if (report.error) {
    console.log("--- ERROR ---");
    console.log(report.error.message);
    if (report.error.stack) {
      console.log(report.error.stack);
    }
  } else {
    console.log(`Pipeline completed without errors: ${report.success}`);
    console.log("(This does not mean the analysis is football-accurate — that's a human judgment call. See docs/football-validation.md.)");
  }

}