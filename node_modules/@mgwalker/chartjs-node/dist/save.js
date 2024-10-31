import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright-chromium";
import { fileURLToPath, pathToFileURL } from "url";

const run = async ({
  cmd,
  deviceScaleFactor,
  height,
  path: savePath,
  width,
}) => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    deviceScaleFactor,
    viewport: { height, width },
  });

  const url = pathToFileURL(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "charts.html")
  ).href;

  await page.goto(url);

  try {
    // The output from the evaluated command is a data URL, which begins with a
    // MIME type and encoding statement. The actual data begins after the comma.
    const [, base64] = (await page.evaluate(cmd)).split(",");
    const buffer = Buffer.from(base64, "base64");

    if (savePath) {
      return await fs.writeFile(savePath, buffer);
    }
    return buffer;
  } finally {
    await browser.close();
  }
};

export default run;
