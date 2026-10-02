import { normalizeRawData } from "./services/normalizer.service";

const rawData = {
  url: "https://example.com/gate",
  contentType: "text/html",
  rawContent: `
    <html>
      <head>
        <title>GATE 2027</title>
        <style>
          body { color: red; }
        </style>
      </head>

      <body>
        <h1>GATE 2027</h1>

        <p>
          Graduate Aptitude Test in Engineering.
        </p>

        <p>
          Eligible candidates can apply online.
        </p>

        <script>
          console.log("ignore this");
        </script>
      </body>
    </html>
  `,
};

const result = normalizeRawData(rawData);

console.log("Normalized opportunity:");
console.dir(result, { depth: null });