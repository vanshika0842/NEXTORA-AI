import { extractOpportunity } from "./extractors/opportunity.extractor";

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Google Summer Internship 2027</title>
  <meta
    name="description"
    content="Summer internship opportunities for students."
  />
  <meta property="og:site_name" content="Google" />
</head>

<body>
  <main>
    <h1>Google Summer Internship 2027</h1>

    <p>
      Google is offering internship opportunities for students.
    </p>

    <h2>Eligibility</h2>

    <p>
      Students currently pursuing a Bachelor's or Master's degree may apply.
    </p>

    <p>
      Location: Bengaluru, India
    </p>

    <p>
      Application Deadline: November 5, 2026
    </p>

    <a href="/careers/apply">Apply Now</a>
  </main>
</body>
</html>
`;

const result = extractOpportunity({
  html,
  sourceUrl: "https://careers.google.com/example",
  sourceName: "Google Careers",
});

console.dir(result, { depth: null });