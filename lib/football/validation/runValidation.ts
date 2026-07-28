// lib/football/validation/runValidation.ts
//
// Usage: npx tsx lib/football/validation/runValidation.ts <fixtureId>
//
// Requires API_FOOTBALL_KEY to be set (see client.ts). Prints the
// full stage-by-stage report to stdout for manual review against
// what actually happened in the match.

import { validateMatchPipeline } from "./validateMatchPipeline";
import { printReport } from "./validationReport";

const fixtureId = process.argv[2];

if (!fixtureId) {
  console.error("Usage: npx tsx lib/football/validation/runValidation.ts <fixtureId>");
  process.exit(1);
}

validateMatchPipeline(fixtureId)
  .then(printReport)
  .catch(error => {
    console.error("[runValidation] Unhandled error:", error);
    process.exit(1);
  });