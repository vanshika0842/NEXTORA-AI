import assert from "node:assert/strict";

import { extractOpportunity } from "./extractors/opportunity.extractor";

const result = extractOpportunity({
  html: `
    <article>
      <h3>Example Merit Scholarship</h3>
      <p>This scholarship supports undergraduate students in technical programs.</p>
      <p>Scheme Open from : 01-06-2026</p>
      <p>Student Application Open till : 31-10-2026</p>
      <a href="https://portal.example.org/apply">Apply now</a>
    </article>
  `,
  sourceUrl: "https://portal.example.org/schemes",
  sourceName: "Example Scholarship Portal",
  officialUrl: "https://portal.example.org/guidelines/example.pdf",
});

assert.equal(result.title, "Example Merit Scholarship");
assert.equal(result.organization, "Example Scholarship Portal");
assert.equal(result.type, "SCHOLARSHIP");
assert.equal(result.applicationStartDate, "01-06-2026");
assert.equal(result.applicationDeadline, "31-10-2026");
assert.equal(result.officialUrl, "https://portal.example.org/guidelines/example.pdf");
assert.equal(result.applicationUrl, "https://portal.example.org/apply");
assert.equal(result.sourceUrl, "https://portal.example.org/schemes");

console.log("Detail extraction assertions passed.");
