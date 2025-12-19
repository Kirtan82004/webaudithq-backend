// services/issueBuilder.service.js
import impactMapper from "../utils/impactMapper.js";

/**
 * Builds a unified issues report from Lighthouse LHR and custom UI issues
 */
const buildIssues = (lhr, uiIssues = []) => {
  const issues = [...uiIssues];

  // Defensive: ensure audits exist
  const audits = lhr?.audits ? Object.values(lhr.audits) : [];

  audits.forEach((audit) => {
    // Include audits that didn't score perfectly (score !== 1) and have a numeric score
    const score = typeof audit.score === "number" ? audit.score : null;
    if (score !== null && score !== 1) {
      issues.push({
        type: audit.details?.type || "Lighthouse",
        title: audit.title,
        reason: audit.description,
        impact: impactMapper(score),
        fix: audit.helpText || "Refer Lighthouse documentation",
        helpUrl: audit.helpUrl || null,
      });
    }
  });

  // Category scores (default to 0 if missing)
  const categories = lhr?.categories || {};
  const getScorePct = (cat) =>
    Math.round((categories[cat]?.score || 0) * 100);

  return {
    summary: {
      performance: getScorePct("performance"),
      seo: getScorePct("seo"),
      accessibility: getScorePct("accessibility"),
      bestPractices: getScorePct("best-practices"),
      totalIssues: issues.length,
    },
    issues,
  };
};

export default buildIssues;