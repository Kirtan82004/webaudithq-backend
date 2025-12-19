// services/puppeteer.service.js
import { getBrowser } from "./browser.service.js";

const runUIAudit = async (url) => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  const issues = [];

  try {
    // Mobile viewport (iPhone X dimensions)
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });


    await page.goto(url, {
      waitUntil: ["domcontentloaded", "networkidle2"],
      timeout: 60000,
    });

    // Horizontal overflow check: visible scrollbars due to layout overflow
    const overflow = await page.evaluate(() => {
      const hasOverflow =
        document.documentElement.scrollWidth > document.documentElement.clientWidth ||
        document.body.scrollWidth > document.body.clientWidth;

      // Ignore if overflow is caused by off-screen or invisible elements
      const visibleOffenders = [...document.body.querySelectorAll("*")]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          const visible =
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            rect.width > 0 &&
            rect.height > 0;
          return visible && rect.right > window.innerWidth + 1;
        }).length;

      return hasOverflow && visibleOffenders > 0;
    });

    if (overflow) {
      issues.push({
        type: "UI",
        title: "Horizontal scroll detected",
        reason: "Content overflows viewport on mobile width",
        impact: "High",
        fix: "Audit layout widths/margins, check fixed positions, and set overflow-x: hidden if appropriate.",
      });
    }

    // Small text check: include common text elements
    const smallText = await page.evaluate(() => {
      const selectors = [
        "p",
        "span",
        "li",
        "a",
        "button",
        "label",
        "input",
        "textarea",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ];
      const elements = [...document.querySelectorAll(selectors.join(","))];

      // Consider minimum recommended mobile body text size ~ 14px
      const MIN_SIZE = 12; // conservative threshold
      return elements.some((el) => {
        const style = getComputedStyle(el);
        const size = parseFloat(style.fontSize); // computed pixels
        const visible =
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          parseFloat(style.opacity || "1") > 0;
        return visible && size > 0 && size < MIN_SIZE;
      });
    });

    if (smallText) {
      issues.push({
        type: "UI",
        title: "Text too small on mobile",
        reason: "Some text elements have computed font-size below 12px",
        impact: "Medium",
        fix: "Increase base font-size or adjust scaling for mobile; aim for 14–16px body text.",
      });
    }

    // Optional: add basic image alt check for accessibility
    const missingAltImages = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("img")];
      return imgs.filter((img) => !img.alt || img.alt.trim() === "").length;
    });

    if (missingAltImages > 0) {
      issues.push({
        type: "Accessibility",
        title: "Images missing alt text",
        reason: `${missingAltImages} image(s) without descriptive alt`,
        impact: "Low",
        fix: "Provide meaningful alt attributes for informative images.",
      });
    }

    return issues;
  } finally {
    // Always close the page to avoid leaks
    try {
      await page.close({ runBeforeUnload: false });
    } catch {}
  }
};

export default runUIAudit;