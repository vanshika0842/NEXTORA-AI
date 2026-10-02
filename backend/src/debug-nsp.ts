import prisma from "./lib/prisma";
import { collectFromSource } from "./services/collector.service";

async function main() {
  const sourceId = 2;

  const result = await collectFromSource(sourceId);

  if (!result.success || !result.content) {
    throw new Error(
      result.error ?? "Collection failed"
    );
  }

  const html = result.content;

  const target = "31-10-2026";

  const index = html.indexOf(target);

  console.log("HTML length:", html.length);
  console.log("Target index:", index);

  if (index === -1) {
    console.log(
      "31-10-2026 was NOT found in raw HTML."
    );

    /*
     * Try alternate representations.
     */
    for (const value of [
      "31/10/2026",
      "31.10.2026",
      "31-10-2026",
      "31&#45;10&#45;2026",
    ]) {
      const found = html.indexOf(value);

      console.log(
        `${value}:`,
        found
      );
    }

    return;
  }

  const start = Math.max(
    0,
    index - 1500
  );

  const end = Math.min(
    html.length,
    index + 2500
  );

  console.log("\n========== RAW HTML ==========\n");

  console.log(
    html.slice(start, end)
  );

  console.log(
    "\n========== END HTML ==========\n"
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });