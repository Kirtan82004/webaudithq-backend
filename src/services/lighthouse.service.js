// services/lighthouse.service.js
import lighthouse from "lighthouse";
import puppeteer from "puppeteer";

const runLighthouse = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
      "--remote-debugging-port=9222"
    ],
    executablePath: puppeteer.executablePath()
  });


  const options = {
    logLevel: "error",
    output: "json",
    onlyCategories: ["performance", "seo", "best-practices", "accessibility"],
    maxWaitForFcp: 60000,  // 60 sec
    maxWaitForLoad: 120000,
    port: new URL(browser.wsEndpoint()).port, // connect Lighthouse to Puppeteer’s Chrome
  };

  const { lhr } = await lighthouse(url, options);
  await browser.close();
  return lhr;
};

export default runLighthouse;