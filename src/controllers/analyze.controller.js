import validUrl from "valid-url";
import runLighthouse from "../services/lighthouse.service.js";
import runUIAudit from "../services/puppeteer.service.js";
import buildIssues from "../services/issueBuilder.service.js";

export const runAnalysis = async (req, res) => {
  const { url } = req.body;
  console.log("URL:", url);

  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const [lighthouseResult, uiIssues] = await Promise.all([
      runLighthouse(url),
      runUIAudit(url)
    ]);
    //console.log("Lighthouse and UI audit completed", lighthouseResult, uiIssues);
    

    const report = buildIssues(lighthouseResult, uiIssues);

    res.json({
      url,
      generatedAt: new Date(),
      ...report
    });
  } catch (err) {
    console.error("ANALYSIS ERROR:", err);
    res.status(500).json({
      error: "Website analysis failed",
      message: err.message
    });
  }
};
