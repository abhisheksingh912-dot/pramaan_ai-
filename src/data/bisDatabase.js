// Comprehensive BIS Indian Standards Knowledge Base & RAG Index for SIH26107

export const INDIAN_STANDARDS = [
  {
    isCode: "IS 14544 : 2016",
    title: "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
    category: "Food & Beverages",
    ministry: "Consumer Affairs",
    mandateStatus: "Compulsory ISI Mark",
    description: "Specifies requirements, sampling, and methods of test for packaged drinking water offer for sale.",
    keyClauses: [
      { clause: "Clause 4.1", title: "Physical Parameters", detail: "Color max 2 Hazen units, pH 6.5 to 8.5, TDS max 500 mg/L." },
      { clause: "Clause 5.3", title: "Microbiological Limits", detail: "E.coli, Coliforms, Salmonella, Enterococci must be Absent in 250ml." },
      { clause: "Clause 7.1", title: "Mandatory Marking", detail: "Must display BIS Standard Mark CM/L-XXXXXX and batch number." }
    ],
    testingMethods: ["Inductively Coupled Plasma (ICP) for Heavy Metals", "Membrane Filtration for Pathogens"],
    consumerTip: "Always check for 7-digit CM/L number below the ISI mark on the bottle neck."
  },
  {
    isCode: "IS 13252 (Part 1) : 2010",
    title: "Information Technology Equipment - Safety (Laptops, Adapters, Printers)",
    category: "Electronics & IT",
    ministry: "MeitY / Consumer Affairs",
    mandateStatus: "Compulsory Registration Scheme (CRS)",
    description: "Specifies safety requirements for mains-powered or battery-powered information technology equipment.",
    keyClauses: [
      { clause: "Clause 1.5", title: "Components Safety", detail: "Transformers, insulation, and outer casing must pass flame retardancy tests (UL 94-V0)." },
      { clause: "Clause 2.1", title: "Protection from Electric Shock", detail: "Double insulation or protective earthing mandatory for Class I equipment." },
      { clause: "Clause 4.2", title: "Thermal Testing", detail: "Max temperature rise must not exceed 65°C under maximum load." }
    ],
    testingMethods: ["High Voltage Insulation Withstand Test", "Drop & Impact Test"],
    consumerTip: "Look for the R-number (R-XXXXXXXX) registered under BIS CRS scheme."
  },
  {
    isCode: "IS 1417 : 2016",
    title: "Gold and Gold Alloys, Jewellery/Artefacts - Fineness and Marking",
    category: "Hallmarking & Precious Metals",
    ministry: "Consumer Affairs",
    mandateStatus: "Compulsory Hallmarking (HUID)",
    description: "Specifies grades of fineness for gold jewellery (22K, 18K, 14K) and 6-digit alphanumeric HUID marking.",
    keyClauses: [
      { clause: "Clause 3.2", title: "Fineness Grades", detail: "22K916 (91.6% pure), 18K750 (75.0% pure), 14K585 (58.5% pure)." },
      { clause: "Clause 5.1", title: "HUID Marking", detail: "Must contain 6-character alphanumeric code unique to each piece etched by laser." }
    ],
    testingMethods: ["Fire Assay Method (IS 1418)", "X-ray Fluorescence (XRF) Spectrometry"],
    consumerTip: "Verify the 6-digit HUID code using BIS Care App or our embedded verifier."
  },
  {
    isCode: "IS 9873 (Part 1) : 2019",
    title: "Safety of Toys - Mechanical and Physical Properties",
    category: "Consumer Toys & Child Safety",
    ministry: "Commerce & Industry / BIS",
    mandateStatus: "Compulsory Quality Control Order (QCO)",
    description: "Ensures toys intended for children under 14 years do not present sharp edges, choking hazards, or heavy metal toxicity.",
    keyClauses: [
      { clause: "Clause 4.4", title: "Small Parts Hazard", detail: "No detachable component must fit entirely within small parts cylinder (31.7mm diameter)." },
      { clause: "Clause 4.14", title: "Toxic Elements", detail: "Lead < 90 mg/kg, Cadmium < 75 mg/kg, Arsenic < 25 mg/kg." }
    ],
    testingMethods: ["Small Parts Test Cylinder", "Atomic Absorption Spectrophotometry for Metals"],
    consumerTip: "Never purchase non-ISI marked plastic or wooden toys for infants."
  },
  {
    isCode: "IS 4151 : 2015",
    title: "Protective Helmets for Two-Wheeler Motorcyclists",
    category: "Automotive Safety",
    ministry: "Road Transport & Highways / BIS",
    mandateStatus: "Compulsory ISI Certification",
    description: "Specifies requirements for helmets providing protection to riders of two-wheelers against impact energy.",
    keyClauses: [
      { clause: "Clause 6.2", title: "Impact Absorption", detail: "Peak acceleration transmitted to headform must not exceed 275g during drop test." },
      { clause: "Clause 6.4", title: "Retention System", detail: "Chin strap slip must not exceed 25mm under 500N tensile load." }
    ],
    testingMethods: ["Guided Free-Fall Impact Test Rig", "Dynamic Retention Test"],
    consumerTip: "Reject helmets without ISI mark engraved or stitched onto the outer shell and liner."
  },
  {
    isCode: "IS 269 : 2015",
    title: "Ordinary Portland Cement (OPC) 33, 43, and 53 Grade",
    category: "Civil Engineering & Construction",
    ministry: "Heavy Industries / BIS",
    mandateStatus: "Compulsory ISI Certification",
    description: "Specifies chemical composition, compressive strength, setting time, and sound properties of Portland Cement.",
    keyClauses: [
      { clause: "Clause 6.1", title: "Compressive Strength", detail: "53 Grade must achieve min 27 MPa (3 days), 37 MPa (7 days), 53 MPa (28 days)." },
      { clause: "Clause 5.2", title: "Initial & Final Setting", detail: "Initial setting time min 30 minutes; final setting time max 600 minutes." }
    ],
    testingMethods: ["Vicat Needle Apparatus for Setting Time", "Compression Testing Machine (CTM)"],
    consumerTip: "Verify week and year of manufacture on cement bags; cement older than 90 days requires re-testing."
  }
];

export const MOCK_LICENSES_DATABASE = {
  "CML-8765432": {
    cmlNo: "CM/L-8765432",
    manufacturer: "Himalayan Pure Aquatics Pvt Ltd",
    brandName: "AquaPure Crystal",
    product: "Packaged Drinking Water",
    isCode: "IS 14544 : 2016",
    status: "VALID",
    validUntil: "2028-04-30",
    address: "Plot 42, Industrial Area Phase II, Haridwar, Uttarakhand",
    testingLab: "BIS Central Laboratory, Sahibabad",
    grade: "Grade A Approved"
  },
  "CML-1234567": {
    cmlNo: "CM/L-1234567",
    manufacturer: "SafeRide Helmet Industries Ltd",
    brandName: "AeroShield Pro",
    product: "Protective Helmets for Motorcyclists",
    isCode: "IS 4151 : 2015",
    status: "VALID",
    validUntil: "2027-11-15",
    address: "Sector 58, Industrial Zone, Manesar, Haryana",
    testingLab: "Western Regional Laboratory, Mumbai",
    grade: "Grade A+ Certified"
  },
  "R-41009823": {
    cmlNo: "R-41009823",
    manufacturer: "Apex Tech Innovations Ltd",
    brandName: "ZenBook Power Charger 65W",
    product: "Power Adapter / IT Equipment",
    isCode: "IS 13252 (Part 1)",
    status: "VALID",
    validUntil: "2029-01-20",
    address: "Electronic City Phase 1, Bengaluru, Karnataka",
    testingLab: "SAMEER Electro-Magnetic Lab",
    grade: "CRS Certified"
  },
  "HUID-XY8921": {
    cmlNo: "HUID: XY8921",
    manufacturer: "Tanishq Jewellers (A Jeweller AHY-992)",
    brandName: "Royal Heritage Collection",
    product: "22K Gold Bangle Set (Purity 916)",
    isCode: "IS 1417 : 2016",
    status: "AUTHENTIC",
    validUntil: "Lifetime Verified",
    address: "BIS Hallmarking Centre AH-402, Connaught Place, New Delhi",
    testingLab: "BIS Recognized Assaying & Hallmarking Centre",
    grade: "22K Gold (91.6% Pure)"
  },
  "CML-9999999": {
    cmlNo: "CM/L-9999999",
    manufacturer: "Fake Tech Imports Corp",
    brandName: "Super Power Pack",
    product: "Power Adapter",
    isCode: "IS 13252",
    status: "EXPIRED / SUSPENDED",
    validUntil: "2023-01-01",
    address: "Unverified Premise",
    testingLab: "N/A",
    grade: "CANCELLED DUE TO NON-COMPLIANCE"
  }
};

export const INDIAN_LANGUAGES = [
  { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
  { code: "hi-IN", name: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "ta-IN", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "te-IN", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "kn-IN", name: "கன்னட (Kannada)", flag: "🇮🇳" },
  { code: "bn-IN", name: "বাংলা (Bengali)", flag: "🇮🇳" },
  { code: "mr-IN", name: "मराठी (Marathi)", flag: "🇮🇳" },
  { code: "gu-IN", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" }
];

export const SAMPLE_QUERIES = [
  "What are the mandatory quality checks for packaged drinking water under IS 14544?",
  "How can I verify a 6-digit HUID gold hallmark code on jewellery?",
  "I want to manufacture EV Batteries. What BIS license and IS code do I need?",
  "Verify license number CM/L-8765432 for AquaPure Crystal.",
  "What is the penalty for selling toys without ISI mark QCO compliance?"
];
