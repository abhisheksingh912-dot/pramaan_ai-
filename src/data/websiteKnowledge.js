// Centralized Website Knowledge Base & Architecture Model for Pramaan AI

export const WEBSITE_KNOWLEDGE = {
  portalName: "Pramaan AI",
  fullName: "Bureau of Indian Standards & Next-Gen Standard Authority of India",
  parentMinistry: "Ministry of Consumer Affairs, Food & Public Distribution, Government of India",

  structure: {
    home: {
      name: "Home",
      route: "/",
      description: "Official landing page presenting Pramaan AI national quality overview, live statistics, quick action shortcuts, latest Gazette notifications, and popular standard categories."
    },
    about: {
      name: "About BIS",
      route: "/about",
      description: "Details statutory mandate under BIS Act 2016, 6 core pillars (Standardisation, Product Certification, Hallmarking, Laboratory Network, Consumer Protection, Management Systems), and 5 Regional / 38 Branch offices."
    },
    standards: {
      name: "Standards Explorer",
      route: "/standards",
      description: "Search and explore 21,000+ Indian Standards (IS Codes), filter by category (Food, Electronics, Hallmarking, Toys, Automotive, Construction), check mandatory ISI QCO lists, and view clause details."
    },
    verify: {
      name: "Verify a Product",
      route: "/verify",
      description: "Official verification portal for checking CM/L License Numbers, IS Standard Codes, 6-digit Gold HUID Hallmark codes, and CRS R-Numbers against official government registers."
    },
    labs: {
      name: "BIS Labs",
      route: "/labs",
      description: "Accredited Laboratory finder to locate NABL & BIS testing facilities across India (Delhi NCR, Mumbai, Kolkata, Chennai, Sahibabad) with category filters and distance calculation."
    },
    scanAMark: {
      name: "Scan a Mark",
      location: "Verification Portal / Home",
      tabs: {
        enterDetails: "Enter Product Name, IS Code (e.g. IS 14544), HUID (e.g. XY8921), CM/L (e.g. 8765432), or R-number into search box.",
        scanImage: "Upload or scan an image of product ISI mark / label.",
        qrCode: "Scan product QR code directly using device camera.",
        barcode: "Scan existing barcode printed on product packaging."
      },
      noteOnBarcode: "Note: Pramaan AI supports scanning existing product barcodes for lookup, but DOES NOT generate barcodes. Barcode generation is not available on the visible interface."
    },
    news: {
      name: "News & Notifications",
      route: "/news",
      description: "Real-time official Gazette QCO orders, quality standards enforcement news, and consumer safety advisories."
    },
    complaints: {
      name: "Consumer Complaints",
      route: "/complaints",
      description: "Portal for filing complaints regarding fake ISI marks, sub-standard products, or un-hallmarked gold."
    },
    industry: {
      name: "Industry Licensing",
      route: "/industry",
      description: "Application wizard for manufacturers applying for Scheme-I ISI Mark licenses, Foreign Manufacturers Certification Scheme (FMCS), and CRS registration."
    },
    chartboard: {
      name: "Chart Board / Admin Analytics",
      route: "/chartboard",
      description: "Executive analytics dashboard showing live scan statistics, regional distribution, and AI voice agent console."
    }
  },

  supportedCodes: [
    { code: "IS 14544", label: "Packaged Drinking Water", requirement: "Compulsory ISI Mark & 7-digit CM/L" },
    { code: "IS 1417", label: "Gold & Silver Hallmarking", requirement: "Mandatory 6-character HUID code" },
    { code: "IS 13252", label: "IT & Electronic Equipment Safety", requirement: "Compulsory Registration Scheme R-Number" },
    { code: "IS 9873", label: "Safety of Toys", requirement: "Compulsory ISI Mark QCO" },
    { code: "IS 4151", label: "Protective Helmets for Two Wheelers", requirement: "Compulsory ISI Mark" },
    { code: "IS 16046", label: "Secondary Cells / EV Batteries", requirement: "Compulsory Registration Scheme" }
  ]
};
