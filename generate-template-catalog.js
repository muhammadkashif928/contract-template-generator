const fs = require("fs");

const CATEGORY_LABELS = {
  all: "All Templates",
  featured: "Featured",
  freelance: "Freelance & Service",
  employment: "Employment",
  rental: "Real Estate & Rental",
  business: "Business",
  ip: "Intellectual Property",
  personal: "Personal & Loans",
  construction: "Construction & Trades",
  events: "Events",
  vehicle: "Vehicle"
};

const categoryConfig = {
  freelance: {
    icon: "💼",
    quota: 70,
    searches: [45, 35, 28, 40, 22, 30, 18, 15, 12, 10],
    fields: ["client_name", "client_company", "client_address", "contractor_name", "contractor_address", "project_name", "project_description", "scope_of_work", "deliverables", "start_date", "end_date", "payment_amount", "payment_schedule", "revision_rounds", "intellectual_property_rights", "confidentiality_terms", "termination_notice"],
    description: (name) => `Professional ${name.toLowerCase()} for defining project scope, deliverables, payment terms, ownership rights, confidentiality, revisions, and client approval obligations.`,
    names: [
      ["freelance-contract", "Freelance Service Contract", "💼", true, true],
      ["web-design-contract", "Web Design Contract", "🖥️", true],
      ["graphic-design-contract", "Graphic Design Contract", "🎨"],
      ["photography-contract", "Photography Contract", "📸", true, true],
      ["social-media-contract", "Social Media Management Contract", "📱"],
      ["consulting-contract", "Consulting Agreement", "🤝", true],
      ["video-production-contract", "Video Production Contract", "🎬"],
      ["copywriting-contract", "Copywriting Contract", "✍️"],
      "SEO Services Agreement", "Virtual Assistant Agreement", "Marketing Consultant Agreement", "Brand Strategy Agreement", "Logo Design Agreement", "UX Design Agreement", "UI Design Agreement", "Mobile App Design Agreement", "Software Development Services Agreement", "WordPress Development Agreement", "Shopify Development Agreement", "Ecommerce Consulting Agreement", "Content Marketing Agreement", "Email Marketing Agreement", "Podcast Production Agreement", "Voiceover Services Agreement", "Translation Services Agreement", "Editing and Proofreading Agreement", "Ghostwriting Agreement", "Technical Writing Agreement", "Grant Writing Agreement", "Public Relations Services Agreement", "Influencer Management Agreement", "Creator Collaboration Agreement", "Animation Services Agreement", "Illustration Commission Agreement", "Music Production Agreement", "Audio Engineering Agreement", "Event Photography Agreement", "Wedding Photography Agreement", "Commercial Photography Agreement", "Drone Photography Agreement", "Videography Services Agreement", "Product Photography Agreement", "Retainer Services Agreement", "Hourly Consulting Agreement", "Project-Based Services Agreement", "Creative Services Master Agreement", "Website Maintenance Agreement", "IT Support Services Agreement", "Data Entry Services Agreement", "Bookkeeping Services Agreement", "Tax Preparation Services Agreement", "Business Coaching Agreement", "Life Coaching Agreement", "Fitness Coaching Agreement", "Nutrition Coaching Agreement", "Tutoring Services Agreement", "Online Course Production Agreement", "Webinar Production Agreement", "Community Management Agreement", "Customer Support Services Agreement", "Recruiting Services Agreement", "Lead Generation Agreement", "Sales Consulting Agreement", "Market Research Agreement", "Survey Research Agreement", "Brand Ambassador Services Agreement", "Affiliate Marketing Services Agreement", "Freelance Retainer Renewal Agreement", "Rush Project Services Agreement", "Milestone-Based Services Agreement", "Fractional Executive Consulting Agreement"
    ]
  },
  employment: {
    icon: "👔",
    quota: 65,
    searches: [90, 80, 55, 40, 35, 25, 20, 18, 14],
    fields: ["employer_name", "employer_address", "employee_name", "employee_address", "job_title", "department", "manager_name", "start_date", "salary", "pay_frequency", "working_hours", "benefits", "probation_period", "confidentiality_clause", "intellectual_property_assignment", "notice_period", "governing_state"],
    description: (name) => `Professional ${name.toLowerCase()} for documenting role expectations, compensation, confidentiality, workplace obligations, termination terms, and compliance-focused employment provisions.`,
    names: [
      ["employment-contract", "Employment Contract", "👔", true, true],
      ["part-time-contract", "Part-Time Employment Contract", "⏰", true],
      ["independent-contractor", "Independent Contractor Agreement", "📋", true, true],
      ["nda-agreement", "Non-Disclosure Agreement (NDA)", "🔒", true, true],
      ["non-compete", "Non-Compete Agreement", "🚫"],
      ["internship-agreement", "Internship Agreement", "🎓"],
      ["severance-agreement", "Severance Agreement", "📝"],
      "Executive Employment Agreement", "Offer Letter Agreement", "Remote Work Agreement", "Hybrid Work Policy Agreement", "Commission Agreement", "Sales Compensation Plan Agreement", "Employee Confidentiality Agreement", "Employee IP Assignment Agreement", "Employee Handbook Acknowledgment", "Probationary Employment Agreement", "Fixed-Term Employment Agreement", "Temporary Employment Agreement", "Seasonal Employment Agreement", "On-Call Employment Agreement", "Consultant Employment Conversion Agreement", "Employee Relocation Agreement", "Training Repayment Agreement", "Tuition Reimbursement Agreement", "Bonus Plan Agreement", "Equity Compensation Agreement", "Stock Option Grant Agreement", "Restricted Stock Unit Agreement", "Employee Loan Agreement", "Work From Home Equipment Agreement", "Company Vehicle Use Agreement", "Employee Arbitration Agreement", "Mutual Separation Agreement", "Resignation Acceptance Agreement", "Garden Leave Agreement", "Non-Solicitation Agreement", "Employee Invention Assignment Agreement", "Workplace Confidentiality Policy", "Contractor Onboarding Agreement", "Volunteer Agreement", "Apprenticeship Agreement", "Mentorship Agreement", "Job Share Agreement", "Flexible Schedule Agreement", "Overtime Authorization Agreement", "Payroll Deduction Authorization", "Direct Deposit Authorization", "Performance Improvement Plan Agreement", "Employee Settlement Agreement", "Release of Claims Agreement", "Independent Sales Representative Agreement", "Staffing Agency Agreement", "Recruitment Fee Agreement", "Background Check Authorization", "Reference Check Authorization", "Employee Data Processing Agreement", "Workplace Safety Acknowledgment", "Remote Contractor Agreement", "International Contractor Agreement", "Freelancer Classification Agreement", "Non-Disparagement Agreement", "Employee Exit Agreement", "Confidentiality and Non-Solicit Agreement"
    ]
  },
  rental: {
    icon: "🏠",
    quota: 60,
    searches: [120, 45, 35, 30, 25, 20, 18, 16],
    fields: ["landlord_name", "landlord_address", "tenant_name", "tenant_address", "property_address", "property_description", "monthly_rent", "security_deposit", "lease_start", "lease_end", "late_fee", "utilities_included", "pets_allowed", "maintenance_responsibilities", "notice_period", "governing_state"],
    description: (name) => `Professional ${name.toLowerCase()} for documenting occupancy rights, rent, deposits, maintenance duties, property rules, notices, and landlord-tenant responsibilities.`,
    names: [
      ["residential-lease", "Residential Lease Agreement", "🏠", true, true],
      ["commercial-lease", "Commercial Lease Agreement", "🏢", true],
      ["month-to-month", "Month-to-Month Rental Agreement", "📅"],
      ["room-rental", "Room Rental Agreement", "🛏️"],
      ["sublease-agreement", "Sublease Agreement", "🔑"],
      ["property-management", "Property Management Agreement", "🏗️"],
      "Apartment Lease Agreement", "House Rental Agreement", "Condo Lease Agreement", "Duplex Rental Agreement", "Vacation Rental Agreement", "Short-Term Rental Agreement", "Airbnb Hosting Agreement", "Office Lease Agreement", "Retail Lease Agreement", "Warehouse Lease Agreement", "Industrial Lease Agreement", "Coworking Space Agreement", "Storage Unit Rental Agreement", "Parking Space Rental Agreement", "Garage Rental Agreement", "Land Lease Agreement", "Farm Lease Agreement", "Equipment Storage Lease", "Lease Renewal Agreement", "Lease Amendment Agreement", "Lease Termination Agreement", "Move-In Checklist Agreement", "Move-Out Settlement Agreement", "Security Deposit Return Agreement", "Pet Addendum", "Smoke-Free Property Addendum", "Utilities Addendum", "Maintenance Addendum", "Rent Increase Notice Agreement", "Late Rent Payment Plan", "Tenant Repair Request Agreement", "Landlord Entry Notice Agreement", "Guest Policy Addendum", "House Rules Addendum", "Furnished Rental Agreement", "Corporate Housing Agreement", "Student Housing Agreement", "Senior Housing Agreement", "Mobile Home Lot Lease", "Boat Slip Rental Agreement", "Marina Berth Agreement", "Hunting Land Lease", "Event Venue Rental Agreement", "Pop-Up Retail Lease", "Restaurant Lease Agreement", "Salon Suite Rental Agreement", "Medical Office Lease Agreement", "Shared Office Agreement", "Tenant Estoppel Certificate", "Lease Guaranty Agreement", "Co-Tenant Agreement", "Rental Application Agreement", "Property Inspection Agreement", "Rent-to-Own Agreement"
    ]
  },
  business: {
    icon: "🏢",
    quota: 80,
    searches: [70, 65, 50, 40, 30, 25, 22, 18],
    fields: ["company_name", "counterparty_name", "business_address", "effective_date", "services_description", "commercial_terms", "pricing", "payment_terms", "delivery_terms", "performance_standards", "confidentiality", "intellectual_property", "warranties", "liability_limit", "termination_clause", "governing_law"],
    description: (name) => `Professional ${name.toLowerCase()} for structuring commercial obligations, payment terms, performance standards, risk allocation, confidentiality, warranties, and termination rights.`,
    names: [
      ["partnership-agreement", "Business Partnership Agreement", "🤝", true, true],
      ["llc-operating", "LLC Operating Agreement", "🏛️", true, true],
      ["service-agreement", "Service Agreement", "⚙️", true],
      ["vendor-contract", "Vendor Contract", "📦"],
      ["purchase-agreement", "Purchase Agreement", "🛒"],
      ["joint-venture", "Joint Venture Agreement", "🔗"],
      ["distribution-agreement", "Distribution Agreement", "🚛"],
      "Master Services Agreement", "Statement of Work Agreement", "Sales Agreement", "Supply Agreement", "Manufacturing Agreement", "Private Label Agreement", "Wholesale Agreement", "Reseller Agreement", "Referral Agreement", "Affiliate Agreement", "Agency Agreement", "Franchise Agreement", "Business Sale Agreement", "Asset Purchase Agreement", "Stock Purchase Agreement", "Membership Interest Purchase Agreement", "Shareholder Agreement", "Founder Agreement", "Board Advisor Agreement", "Strategic Alliance Agreement", "Memorandum of Understanding", "Letter of Intent", "Term Sheet", "Confidential Business Sale NDA", "Data Processing Agreement", "SaaS Subscription Agreement", "Software as a Service Agreement", "Cloud Services Agreement", "Managed Services Agreement", "Support and Maintenance Agreement", "Service Level Agreement", "Implementation Services Agreement", "Beta Testing Agreement", "Pilot Program Agreement", "Procurement Agreement", "Consulting Master Agreement", "Professional Services Agreement", "Outsourcing Agreement", "Facilities Services Agreement", "Logistics Services Agreement", "Transportation Services Agreement", "Broker Agreement", "Commission Sales Agreement", "Channel Partner Agreement", "Exclusive Supply Agreement", "Non-Exclusive Supply Agreement", "Business Collaboration Agreement", "Co-Marketing Agreement", "Sponsorship Agreement", "Advertising Agreement", "Media Buying Agreement", "Influencer Campaign Agreement", "Customer Success Services Agreement", "White Label Services Agreement", "API Access Agreement", "Marketplace Seller Agreement", "Merchant Services Agreement", "Payment Processing Agreement", "Escrow Agreement", "Settlement Agreement", "Debt Settlement Agreement", "Commercial Loan Agreement", "Promissory Note for Business", "Convertible Note Agreement", "SAFE Agreement", "Investor Rights Agreement", "Subscription Agreement", "Operating Agreement Amendment", "Corporate Bylaws", "Board Consent Resolution", "Member Consent Resolution", "Business Continuity Agreement", "Succession Agreement", "Buy-Sell Agreement", "Non-Circumvention Agreement"
    ]
  },
  ip: {
    icon: "💡",
    quota: 50,
    searches: [28, 22, 20, 18, 15, 12],
    fields: ["owner_name", "recipient_name", "work_description", "ip_description", "effective_date", "license_type", "territory", "duration", "permitted_uses", "restrictions", "royalty_rate", "ownership_rights", "moral_rights", "confidentiality", "termination_terms"],
    description: (name) => `Professional ${name.toLowerCase()} for clarifying ownership, licenses, permitted uses, restrictions, royalties, transfer rights, confidentiality, and enforcement expectations.`,
    names: [
      ["ip-assignment", "IP Assignment Agreement", "💡", true],
      ["copyright-license", "Copyright License Agreement", "©️"],
      ["software-license", "Software License Agreement", "💻"],
      ["brand-ambassador", "Brand Ambassador Agreement", "⭐"],
      "Trademark License Agreement", "Patent License Agreement", "Trade Secret Agreement", "Invention Assignment Agreement", "Work Made for Hire Agreement", "Content License Agreement", "Image License Agreement", "Photo Release Agreement", "Model Release Agreement", "Music License Agreement", "Sync License Agreement", "Master Recording License", "Publishing Agreement", "Book Publishing Agreement", "Podcast Guest Release", "Video Appearance Release", "UGC Content License", "Influencer Content License", "Social Media Content Release", "Logo Usage Agreement", "Brand Guidelines Agreement", "Domain Name Transfer Agreement", "Website Content Assignment", "Software Source Code Assignment", "Open Source Contribution Agreement", "API License Agreement", "Dataset License Agreement", "AI Model Usage Agreement", "Training Data License Agreement", "NFT License Agreement", "Merchandising License Agreement", "Character License Agreement", "Design Rights Assignment", "Industrial Design License", "Trade Dress License Agreement", "IP Settlement Agreement", "Cease and Desist Response Agreement", "Royalty Agreement", "Revenue Share IP Agreement", "Co-Ownership IP Agreement", "Research IP Agreement", "University IP Assignment", "Employee IP Confirmation", "Contractor IP Transfer Agreement", "IP Due Diligence Checklist Agreement", "Confidential Idea Submission Agreement", "Prototype Ownership Agreement"
    ]
  },
  personal: {
    icon: "💰",
    quota: 60,
    searches: [60, 45, 35, 30, 28, 25, 20],
    fields: ["party1_name", "party2_name", "party1_address", "party2_address", "effective_date", "agreement_purpose", "amount_or_property", "payment_terms", "responsibilities", "schedule", "default_terms", "notice_period", "governing_state", "signature_date"],
    description: (name) => `Professional ${name.toLowerCase()} for documenting personal commitments, payments, responsibilities, property arrangements, family terms, notices, and signature-ready obligations.`,
    names: [
      ["loan-agreement", "Personal Loan Agreement", "💰", true, true],
      ["promissory-note", "Promissory Note", "📜", true],
      ["iou-template", "IOU Template", "✋"],
      ["roommate-agreement", "Roommate Agreement", "🏘️"],
      ["child-custody", "Child Custody Agreement", "👨‍👧", true],
      ["prenuptial", "Prenuptial Agreement", "💍"],
      "Postnuptial Agreement", "Separation Agreement", "Parenting Plan Agreement", "Child Support Agreement", "Pet Custody Agreement", "Elder Care Agreement", "Caregiver Agreement", "Family Loan Agreement", "Vehicle Loan Agreement", "Debt Repayment Agreement", "Payment Plan Agreement", "Bill of Sale", "General Release Agreement", "Personal Property Sale Agreement", "Household Goods Sale Agreement", "Gift Letter Agreement", "Personal Guarantee Agreement", "Co-Signer Agreement", "Permission to Travel Letter", "Medical Consent Agreement", "School Pickup Authorization", "Babysitting Agreement", "Nanny Agreement", "House Sitting Agreement", "Pet Sitting Agreement", "Dog Walking Agreement", "Personal Training Agreement", "Wedding Loan Agreement", "Shared Expense Agreement", "Roommate Move-Out Agreement", "Chore Agreement", "Utilities Sharing Agreement", "Storage Sharing Agreement", "Carpool Agreement", "Boat Sharing Agreement", "Vacation Home Sharing Agreement", "Family Settlement Agreement", "Inheritance Advance Agreement", "Estate Distribution Agreement", "Power of Attorney Preparation Agreement", "Personal Confidentiality Agreement", "Neighbor Fence Agreement", "Boundary Agreement", "Tree Removal Agreement", "Private Tutoring Agreement", "Music Lessons Agreement", "Sports Coaching Agreement", "Personal Services Agreement", "Private Sale Deposit Agreement", "Layaway Agreement", "Personal Equipment Loan Agreement", "Household Employment Agreement", "Domestic Worker Agreement", "Personal Assistant Agreement", "Home Care Services Agreement", "Companion Care Agreement"
    ]
  },
  construction: {
    icon: "🏗️",
    quota: 45,
    searches: [40, 30, 25, 18, 15, 12],
    fields: ["owner_name", "contractor_name", "project_address", "project_description", "scope_of_work", "materials_list", "start_date", "completion_date", "contract_price", "payment_schedule", "change_order_process", "permits_responsibility", "insurance_requirements", "warranty_period", "termination_terms"],
    description: (name) => `Professional ${name.toLowerCase()} for defining construction scope, materials, payment milestones, change orders, permits, insurance, warranties, and completion standards.`,
    names: [
      ["construction-contract", "Construction Contract", "🏗️", true],
      ["home-improvement", "Home Improvement Contract", "🔨", true],
      ["subcontractor", "Subcontractor Agreement", "👷"],
      ["landscaping-contract", "Landscaping Contract", "🌿"],
      "General Contractor Agreement", "Residential Construction Agreement", "Commercial Construction Agreement", "Renovation Contract", "Remodeling Contract", "Roofing Contract", "Plumbing Services Contract", "Electrical Services Contract", "HVAC Services Contract", "Painting Contract", "Flooring Installation Contract", "Tile Installation Contract", "Cabinet Installation Contract", "Kitchen Remodel Contract", "Bathroom Remodel Contract", "Deck Construction Contract", "Fence Installation Contract", "Pool Construction Contract", "Solar Installation Contract", "Concrete Services Contract", "Masonry Contract", "Drywall Contract", "Framing Contract", "Excavation Contract", "Demolition Contract", "Site Preparation Contract", "Architect Services Agreement", "Engineering Services Agreement", "Design-Build Agreement", "Construction Management Agreement", "Change Order Agreement", "Construction Warranty Agreement", "Materials Supply Agreement", "Equipment Rental for Construction", "Safety Compliance Agreement", "Lien Waiver Agreement", "Progress Payment Agreement", "Punch List Agreement", "Final Completion Certificate", "Maintenance Services Contract", "Snow Removal Contract"
    ]
  },
  events: {
    icon: "🎉",
    quota: 45,
    searches: [25, 22, 20, 18, 15, 12],
    fields: ["client_name", "vendor_name", "event_type", "event_date", "event_location", "guest_count", "services_description", "setup_time", "performance_hours", "total_fee", "deposit", "payment_schedule", "cancellation_policy", "force_majeure", "insurance_requirements"],
    description: (name) => `Professional ${name.toLowerCase()} for documenting event services, timing, venue logistics, payment schedules, deposits, cancellation rights, insurance, and service expectations.`,
    names: [
      ["event-planning", "Event Planning Contract", "🎉"],
      ["catering-contract", "Catering Contract", "🍽️"],
      ["dj-contract", "DJ Contract", "🎵"],
      ["wedding-contract", "Wedding Services Contract", "💒"],
      "Venue Rental Agreement", "Event Venue Contract", "Wedding Planner Agreement", "Day-of Coordinator Agreement", "Florist Services Agreement", "Event Decor Agreement", "Balloon Decor Agreement", "Photo Booth Rental Agreement", "Live Band Performance Agreement", "Musician Performance Agreement", "Speaker Agreement", "Keynote Speaker Agreement", "Conference Services Agreement", "Trade Show Booth Agreement", "Exhibitor Agreement", "Sponsorship Agreement for Event", "Event Security Agreement", "Event Staffing Agreement", "Bartending Services Agreement", "Food Truck Event Agreement", "Beverage Services Agreement", "Equipment Rental Event Agreement", "Tent Rental Agreement", "Lighting and Sound Agreement", "Stage Rental Agreement", "AV Services Agreement", "Ticketing Services Agreement", "Promoter Agreement", "Artist Performance Agreement", "Festival Vendor Agreement", "Charity Event Agreement", "Fundraising Event Agreement", "Corporate Retreat Agreement", "Private Party Agreement", "Birthday Party Services Agreement", "Graduation Party Agreement", "Workshop Facilitator Agreement", "Webinar Speaker Agreement", "Virtual Event Production Agreement", "Hybrid Event Agreement", "Event Cancellation Agreement"
    ]
  },
  vehicle: {
    icon: "🚗",
    quota: 45,
    searches: [50, 28, 24, 20, 18, 15],
    fields: ["seller_name", "buyer_name", "owner_name", "renter_name", "vehicle_make", "vehicle_model", "vehicle_year", "vin_number", "mileage", "sale_price", "rental_rate", "payment_method", "transfer_date", "condition_disclosure", "insurance_requirements", "as_is_clause"],
    description: (name) => `Professional ${name.toLowerCase()} for documenting vehicle details, ownership transfer, payment terms, condition disclosures, insurance, mileage, and as-is or rental obligations.`,
    names: [
      ["car-sale-contract", "Vehicle Sale Agreement", "🚗", true],
      ["car-rental", "Vehicle Rental Agreement", "🚙"],
      "Used Car Sale Agreement", "Motorcycle Sale Agreement", "Boat Sale Agreement", "RV Sale Agreement", "Trailer Sale Agreement", "ATV Sale Agreement", "Truck Sale Agreement", "Commercial Vehicle Sale Agreement", "Vehicle Bill of Sale", "As-Is Vehicle Sale Agreement", "Vehicle Deposit Agreement", "Vehicle Payment Plan Agreement", "Vehicle Lease Agreement", "Private Auto Lease Agreement", "Fleet Vehicle Lease Agreement", "Company Vehicle Agreement", "Employee Vehicle Use Agreement", "Vehicle Loan Agreement", "Vehicle Consignment Agreement", "Auto Broker Agreement", "Vehicle Storage Agreement", "Parking Permit Agreement", "Garage Parking Agreement", "Vehicle Repair Agreement", "Auto Detailing Agreement", "Mechanic Services Agreement", "Towing Services Agreement", "Roadside Assistance Agreement", "Vehicle Wrap Agreement", "Car Sharing Agreement", "Rideshare Vehicle Agreement", "Delivery Driver Vehicle Agreement", "Food Truck Rental Agreement", "Heavy Equipment Vehicle Rental", "Construction Vehicle Rental", "Luxury Vehicle Rental Agreement", "Classic Car Sale Agreement", "Salvage Vehicle Sale Agreement", "Vehicle Trade Agreement", "Lease Buyout Agreement", "Test Drive Agreement", "Vehicle Inspection Agreement", "Odometer Disclosure Agreement"
    ]
  }
};

function slugify(value) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeName(entry) {
  if (Array.isArray(entry)) return entry;
  return [slugify(entry), entry];
}

function volume(config, index) {
  const base = config.searches[index % config.searches.length];
  return `${Math.max(3, base - Math.floor(index / config.searches.length) * 2)}K/mo`;
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function partyRolesForTemplate(category, name) {
  const text = name.toLowerCase();
  if (includesAny(text, ["non-disclosure", "nda", "confidential"])) return ["disclosing_party", "receiving_party"];
  if (includesAny(text, ["license", "licence", "subscription", "saas"])) return ["licensor", "licensee"];
  if (includesAny(text, ["assignment", "transfer", "work made for hire"])) return ["assignor", "assignee"];
  if (includesAny(text, ["loan", "promissory", "iou", "debt", "payment plan"])) return ["lender", "borrower"];
  if (includesAny(text, ["custody", "parenting", "child support"])) return ["parent_one", "parent_two"];
  if (includesAny(text, ["prenuptial", "postnuptial", "separation"])) return ["spouse_one", "spouse_two"];
  if (includesAny(text, ["roommate", "shared expense", "utilities sharing", "co-tenant"])) return ["roommate_one", "roommate_two"];
  if (includesAny(text, ["lease", "rental", "rent", "tenant", "landlord", "housing", "apartment", "condo", "duplex", "storage", "parking", "garage"])) return ["landlord", "tenant"];
  if (includesAny(text, ["sublease"])) return ["original_tenant", "subtenant"];
  if (includesAny(text, ["property management"])) return ["property_owner", "property_manager"];
  if (includesAny(text, ["sale", "purchase", "bill of sale", "buy-sell", "asset", "stock", "vehicle trade"])) return ["seller", "buyer"];
  if (category === "vehicle" && includesAny(text, ["rental", "lease", "sharing"])) return ["vehicle_owner", "vehicle_renter"];
  if (category === "vehicle" && includesAny(text, ["repair", "detailing", "mechanic", "towing", "wrap", "inspection", "storage"])) return ["vehicle_owner", "service_provider"];
  if (category === "vehicle" && includesAny(text, ["loan", "payment"])) return ["lender", "borrower"];
  if (category === "employment" && includesAny(text, ["independent contractor", "contractor", "consultant", "freelancer"])) return ["client", "contractor"];
  if (category === "employment") return ["employer", "employee"];
  if (category === "freelance") return ["client", "contractor"];
  if (category === "construction" && includesAny(text, ["subcontractor"])) return ["contractor", "subcontractor"];
  if (category === "construction") return ["owner", "contractor"];
  if (category === "events") return ["client", "vendor"];
  if (category === "ip") return ["owner", "recipient"];
  if (category === "business" && includesAny(text, ["partnership", "joint venture", "collaboration", "alliance", "founder", "shareholder"])) return ["party_a", "party_b"];
  if (category === "business" && includesAny(text, ["service", "vendor", "supplier", "agency", "consulting", "outsourcing", "support", "maintenance", "logistics", "transportation"])) return ["client", "service_provider"];
  if (category === "business" && includesAny(text, ["distribution", "reseller", "supply", "manufacturing", "wholesale"])) return ["supplier", "buyer"];
  if (category === "business") return ["company", "counterparty"];
  return ["party_a", "party_b"];
}

function uniqueFields(fields) {
  return [...new Set(fields.filter(Boolean))];
}

function fieldsForTemplate(category, name) {
  const text = name.toLowerCase();
  const [firstRole, secondRole] = partyRolesForTemplate(category, name);
  const partyFields = [
    `${firstRole}_name`,
    `${firstRole}_address`,
    `${secondRole}_name`,
    `${secondRole}_address`,
    "effective_date"
  ];

  if (includesAny(text, ["non-disclosure", "nda", "confidential"])) {
    return uniqueFields([...partyFields, "confidential_information", "permitted_purpose", "excluded_information", "confidentiality_period", "return_or_destroy_materials", "injunctive_relief", "governing_state"]);
  }

  if (includesAny(text, ["loan", "promissory", "iou", "debt repayment", "debt settlement", "payment plan"])) {
    const vehicleFields = text.includes("vehicle") ? ["vehicle_make", "vehicle_model", "vehicle_year", "vin_number", "mileage", "condition_disclosure"] : [];
    return uniqueFields([...partyFields, ...vehicleFields, "loan_amount", "interest_rate", "repayment_start", "maturity_date", "payment_terms", "collateral", "late_fee", "default_terms", "governing_state"]);
  }

  if (category === "freelance") {
    return uniqueFields([...partyFields, "project_name", "services_description", "scope_of_work", "deliverables", "start_date", "completion_date", "service_fee", "payment_schedule", "revision_policy", "client_approval_process", "intellectual_property_ownership", "confidentiality_obligations", "termination_notice", "governing_state"]);
  }

  if (category === "employment") {
    return uniqueFields([...partyFields, "job_title", "department", "manager_name", "work_location", "start_date", "compensation", "pay_frequency", "working_hours", "benefits", "probation_period", "confidentiality_obligations", "intellectual_property_obligations", "notice_period", "governing_state"]);
  }

  if (category === "rental") {
    return uniqueFields([...partyFields, "property_address", "premises_description", "lease_start", "lease_end", "monthly_rent", "security_deposit", "late_fee", "utilities_responsibility", "maintenance_responsibility", "pet_policy", "rules_and_regulations", "notice_period", "governing_state"]);
  }

  if (category === "business") {
    return uniqueFields([...partyFields, "agreement_purpose", "products_or_services", "commercial_terms", "pricing", "payment_terms", "delivery_timeline", "performance_standards", "confidentiality_obligations", "intellectual_property_rights", "warranties", "liability_limit", "termination_rights", "governing_law"]);
  }

  if (category === "ip") {
    return uniqueFields([...partyFields, "intellectual_property_description", "grant_or_transfer_scope", "permitted_uses", "territory", "term", "consideration", "royalty_rate", "ownership_reservation", "restrictions", "confidentiality_obligations", "termination_rights", "governing_law"]);
  }

  if (category === "personal") {
    return uniqueFields([...partyFields, "agreement_purpose", "amount_or_property", "payment_terms", "responsibilities", "schedule", "default_terms", "notice_period", "governing_state"]);
  }

  if (category === "construction") {
    return uniqueFields([...partyFields, "project_address", "project_description", "scope_of_work", "materials_responsibility", "start_date", "completion_date", "contract_price", "payment_schedule", "change_order_process", "permits_responsibility", "insurance_requirements", "warranty_period", "termination_terms", "governing_state"]);
  }

  if (category === "events") {
    return uniqueFields([...partyFields, "event_type", "event_date", "event_location", "guest_count", "services_description", "setup_time", "performance_hours", "total_fee", "deposit", "payment_schedule", "cancellation_policy", "force_majeure", "insurance_requirements", "governing_state"]);
  }

  if (category === "vehicle") {
    return uniqueFields([...partyFields, "vehicle_make", "vehicle_model", "vehicle_year", "vin_number", "mileage", "transaction_price", "payment_method", "transfer_date", "condition_disclosure", "odometer_statement", "insurance_responsibility", "as_is_terms", "governing_state"]);
  }

  return uniqueFields([...partyFields, "agreement_purpose", "payment_terms", "responsibilities", "termination_rights", "governing_state"]);
}

const templates = [];
const ids = new Set();

for (const [category, config] of Object.entries(categoryConfig)) {
  const names = [...config.names];
  let filler = 1;
  while (names.length < config.quota) {
    names.push(`${CATEGORY_LABELS[category]} Premium Agreement ${filler}`);
    filler += 1;
  }

  names.slice(0, config.quota).forEach((entry, index) => {
    const [requestedId, name, icon, popular = false, featured = false] = normalizeName(entry);
    let id = requestedId;
    let suffix = 2;
    while (ids.has(id)) {
      id = `${requestedId}-${suffix}`;
      suffix += 1;
    }
    ids.add(id);
    const isPremium = index >= 8 && (index % 3 === 0 || name.includes("Master") || name.includes("Executive") || name.includes("Commercial"));
    templates.push({
      id,
      name,
      category,
      icon: icon || config.icon,
      searches: volume(config, index),
      description: config.description(name),
      fields: fieldsForTemplate(category, name),
      popular: Boolean(popular || index < 5),
      featured: Boolean(featured),
      premium: isPremium,
      tier: isPremium ? "premium" : "free"
    });
  });
}

const templatesJs = `const TEMPLATES = ${JSON.stringify(templates, null, 2)};\n\nconst CATEGORY_LABELS = ${JSON.stringify(CATEGORY_LABELS, null, 2)};\n`;

fs.writeFileSync("templates.js", templatesJs);
fs.writeFileSync("contract-templates.json", `${JSON.stringify(templates, null, 2)}\n`);

console.log(`Generated ${templates.length} professional templates.`);
console.log(Object.entries(categoryConfig).map(([key]) => `${key}: ${templates.filter((template) => template.category === key).length}`).join("\n"));
