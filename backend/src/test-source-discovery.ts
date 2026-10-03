import assert from "node:assert/strict";

import {
  discoverOpportunities,
} from "./services/source-discovery.service";

const listingUrl = "https://opportunities.example.org/listing";
const html = `
  <main>
    <a href="/scholarships/example">Example Scholarship</a>
    <a href="/scholarships/example#summary">Example Scholarship duplicate</a>
    <a href="/internships/engineering">Engineering Internship</a>
    <a href="javascript:alert('no')">Scholarship</a>
    <a href="mailto:team@example.org">Scholarship contact</a>
    <a href="/login">Scholarship login</a>
    <a href="https://unrelated.example.net/scholarship">External Scholarship</a>
  </main>
`;

const links = discoverOpportunities(html, listingUrl);

assert.deepEqual(
  links.candidates.map((candidate) => candidate.url),
  [
    "https://opportunities.example.org/scholarships/example",
    "https://opportunities.example.org/internships/engineering",
  ]
);
assert.equal(links.candidates[0].kind, "DETAIL_PAGE");
assert.ok(links.ignoredLinks >= 4);

const inlineHtml = `
  <section class="card">
    <h3>Example Merit Scholarship</h3>
    <p>Scholarship support for undergraduate students.</p>
    <a href="/guidelines/example.pdf">Scheme Guidelines</a>
  </section>
  <section class="card">
    <h3>Example Merit Scholarship</h3>
    <p>Scholarship support for undergraduate students.</p>
    <a href="/guidelines/example.pdf">Scheme Guidelines</a>
  </section>
`;

const inline = discoverOpportunities(inlineHtml, listingUrl, {
  itemSelector: ".card",
  itemDetailLinkText: "guidelines",
});

assert.equal(inline.candidates.length, 1);
assert.equal(inline.candidates[0].kind, "INLINE_LISTING_ITEM");
assert.equal(
  inline.candidates[0].url,
  "https://opportunities.example.org/guidelines/example.pdf"
);
assert.ok(inline.candidates[0].html?.includes("Example Merit Scholarship"));

console.log("Source discovery assertions passed.");
