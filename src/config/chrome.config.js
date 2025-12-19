const chromeConfig = {
  // Chrome launch flags (server + local safe)
  chromeFlags: [
    "--headless=new",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-features=TranslateUI",
    "--mute-audio"
  ],

  // Lighthouse throttling (stable & realistic)
  throttling: {
    cpuSlowdownMultiplier: 4,
    requestLatencyMs: 150,
    downloadThroughputKbps: 1638,
    uploadThroughputKbps: 675
  },

  // Screen emulation (mobile-first)
  screenEmulation: {
    mobile: true,
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    disabled: false
  },

  // Lighthouse settings
  lighthouseOptions: {
    output: "json",
    onlyCategories: [
      "performance",
      "seo",
      "accessibility",
      "best-practices"
    ],
    disableStorageReset: false,
    maxWaitForLoad: 45000
  },

  // Multi-run stability
  runs: 3
};

export default chromeConfig;
