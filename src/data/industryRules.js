// Industry MSME Compliance Rules & AI Risk Engine Scoring Parameters

export const INDUSTRY_ROADMAP_STEPS = [
  { step: 1, title: "IS Standard Identification", desc: "Locate applicable Indian Standard (IS Code) and Quality Control Orders (QCO) for target product." },
  { step: 2, title: "Mandatory vs Voluntary Certification Check", desc: "Determine if product falls under Compulsory ISI Mark, CRS, or Voluntary scheme." },
  { step: 3, title: "Testing Equipment & STI Setup", desc: "Install required calibration equipment & hire qualified Quality Assurance Chemist/Engineer." },
  { step: 4, title: "Recognized Lab Pre-Testing", desc: "Send prototype sample to NABL accredited BIS-recognized laboratory for initial test clearance." },
  { step: 5, title: "Document Preparation", desc: "Compile factory layout, machinery calibration certificates, and raw material test reports." },
  { step: 6, title: "Manakonline Application Submission", desc: "Submit digital application on Manakonline portal with Udyam MSME subsidy documentation." },
  { step: 7, title: "BIS Officer Factory Inspection", desc: "Host official BIS inspector for physical audit and random sample sealing." },
  { step: 8, title: "Grant of License & CM/L Number", desc: "Receive official CM/L license number and artwork approval for ISI mark printing." },
  { step: 9, title: "Surveillance & Renewal Monitoring", desc: "Maintain ongoing Scheme of Testing & Inspection (STI) logs for periodic audits." }
];

export function calculateAiRiskScore({ isLicenseActive, isStiLogComplete, isLabTestCleared, isLabelCompliant, hasExpiredAlert }) {
  let score = 100;
  let riskLevel = "LOW RISK";
  let factors = [];

  if (!isLicenseActive) {
    score -= 40;
    factors.push("License is either suspended, expired, or unverified.");
  }
  if (!isLabTestCleared) {
    score -= 25;
    factors.push("Latest 6-month lab sample testing report is missing or past due date.");
  }
  if (!isStiLogComplete) {
    score -= 20;
    factors.push("Scheme of Testing & Inspection (STI) daily batch logs are incomplete.");
  }
  if (!isLabelCompliant) {
    score -= 15;
    factors.push("Product label artwork does not meet exact font and CM/L placement rules.");
  }
  if (hasExpiredAlert) {
    score -= 10;
    factors.push("License renewal window expires within 30 days.");
  }

  if (score < 50) riskLevel = "HIGH RISK";
  else if (score < 80) riskLevel = "MEDIUM RISK";

  return {
    score: Math.max(0, score),
    riskLevel,
    factors,
    disclaimer: "AI Generated Risk Assessment for Internal Quality Audit. Not an official BIS decision."
  };
}
