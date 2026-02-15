
export interface RegionData {
  basePriceMultiplier: number;
  currency: string;
  aduPricing: {
    studio: { basePrice: string; rentalEstimate: string };
    oneBed: { basePrice: string; rentalEstimate: string };
    twoBed: { basePrice: string; rentalEstimate: string };
  };
  codes: string;
  incentives: string;
  policyUrl: string; // 新增：对应的政府政策链接
}

export const regionalKnowledge: Record<string, RegionData> = {
  ON: {
    basePriceMultiplier: 1.0,
    currency: "CAD",
    aduPricing: {
      studio: { basePrice: "$89,000 - $110,000", rentalEstimate: "$1,150 - $1,400" },
      oneBed: { basePrice: "$120,000 - $140,000", rentalEstimate: "$1,450 - $1,850" },
      twoBed: { basePrice: "$150,000 - $180,000", rentalEstimate: "$1,950 - $2,550" }
    },
    codes: "Compliance with local zoning and building standards for secondary suites.",
    incentives: "Qualifies for the Canada Greener Homes Grant and local secondary suite incentives.",
    policyUrl: "https://www.ontario.ca/page/add-second-unit-your-house"
  },
  BC: {
    basePriceMultiplier: 1.1,
    currency: "CAD",
    aduPricing: {
      studio: { basePrice: "$98,000 - $120,000", rentalEstimate: "$1,900 - $2,500" },
      oneBed: { basePrice: "$160,000 - $190,000", rentalEstimate: "$2,500 - $3,400" },
      twoBed: { basePrice: "$235,000 - $290,000", rentalEstimate: "$3,500 - $4,800" }
    },
    codes: "BC Building Code Step Code Level 3 minimum standards.",
    incentives: "CleanBC Better Homes rebates and municipal ADU programs.",
    policyUrl: "https://www.bchousing.org/housing-assistance/secondary-suite"
  },
  Default: {
    basePriceMultiplier: 1.0,
    currency: "CAD",
    aduPricing: {
      studio: { basePrice: "$89,000 - $110,000", rentalEstimate: "$1,300 - $1,600" },
      oneBed: { basePrice: "$120,000 - $140,000", rentalEstimate: "$1,600 - $2,100" },
      twoBed: { basePrice: "$150,000 - $180,000", rentalEstimate: "$2,200 - $2,900" }
    },
    codes: "National Building Code of Canada (NBC) framing and insulation standards.",
    incentives: "Federal Greener Homes Loan eligibility (up to $40,000 interest-free).",
    policyUrl: "https://natural-resources.canada.ca/energy-efficiency/homes/canada-greener-homes-initiative/24831"
  }
};

export const globalConstants = {
  companyName: "Power Solution Canada",
  materials: [
    "Sustainably harvested Canadian CLT and timber framing",
    "High-performance double-pane low-E glass vistas",
    "Architectural metal roofing and thermally treated wood cladding",
    "Eco-certified mineral wool insulation (R-32+)",
    "Silent air-source climate control systems"
  ],
  smartTech: {
    security: "Integrated perimeter monitoring and smart entry systems",
    energy: "Net-metering ready solar arrays with modular mounting",
    automation: "Whole-home environmental sensors and detection suite"
  }
};
