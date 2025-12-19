// services/browser.service.js
import puppeteer from "puppeteer";

let browser;

/**
 * Returns a connected singleton browser instance.
 * Auto-relaunches if disconnected and sets basic crash protection.
 */
export const getBrowser = async () => {
  const launch = async () =>
    puppeteer.launch({
      headless: true, // use true for stability; "new" can be flaky in some environments
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

  if (!browser) {
    browser = await launch();

    // Recreate on disconnect
    browser.on("disconnected", async () => {
      try {
        browser = await launch();
      } catch (e) {
        console.error("Failed to relaunch browser:", e);
        browser = null;
      }
    });
  } else if (!browser.isConnected()) {
    try {
      await browser.close();
    } catch {}
    browser = await launch();
  }

  return browser;
};

/**
 * Gracefully close the browser (optional, e.g., on process shutdown)
 */
export const closeBrowser = async () => {
  if (browser) {
    try {
      await browser.close();
    } catch (e) {
      console.error("Error closing browser:", e);
    } finally {
      browser = null;
    }
  }
};