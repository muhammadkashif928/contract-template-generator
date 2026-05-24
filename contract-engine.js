(function () {
  function titleize(value) {
    return String(value || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function includesAny(text, terms) {
    return terms.some((term) => text.includes(term));
  }

  function roleLabel(role) {
    const labels = {
      party_a: "Party A",
      party_b: "Party B",
      parent_one: "Parent One",
      parent_two: "Parent Two",
      spouse_one: "Spouse One",
      spouse_two: "Spouse Two",
      roommate_one: "Roommate One",
      roommate_two: "Roommate Two",
      original_tenant: "Original Tenant",
      subtenant: "Subtenant",
      property_owner: "Property Owner",
      property_manager: "Property Manager",
      vehicle_owner: "Vehicle Owner",
      vehicle_renter: "Vehicle Renter",
      service_provider: "Service Provider",
      disclosing_party: "Disclosing Party",
      receiving_party: "Receiving Party"
    };
    return labels[role] || titleize(role);
  }

  function partyRoles(template) {
    const nameFields = template.fields
      .filter((field) => field.endsWith("_name"))
      .map((field) => field.replace(/_name$/, ""))
      .filter((role) => !["project", "event", "business", "software", "website", "venture"].includes(role));
    return [nameFields[0] || "party_a", nameFields[1] || "party_b"];
  }

  function renderHtml(template, getValue) {
    const used = new Set();
    const text = template.name.toLowerCase();
    const [firstRole, secondRole] = partyRoles(template);
    const firstLabel = roleLabel(firstRole);
    const secondLabel = roleLabel(secondRole);

    function has(field) {
      return template.fields.includes(field);
    }

    function value(field) {
      used.add(field);
      const raw = String(getValue(field) || "").trim();
      return raw ? escapeHtml(raw) : `<span class="contract-blank" data-field="${escapeHtml(field)}"></span>`;
    }

    function optional(field) {
      return has(field) ? value(field) : `<span class="contract-blank"></span>`;
    }

    function paragraph(body) {
      return `<p>${body}</p>`;
    }

    function section(heading, paragraphs) {
      return { heading, paragraphs: paragraphs.filter(Boolean) };
    }

    function extraTerms() {
      const ignored = new Set([
        `${firstRole}_name`,
        `${firstRole}_address`,
        `${secondRole}_name`,
        `${secondRole}_address`,
        "effective_date",
        "governing_state",
        "governing_law"
      ]);
      return template.fields
        .filter((field) => !used.has(field) && !ignored.has(field))
        .map((field) => paragraph(`The parties further agree that ${escapeHtml(titleize(field).toLowerCase())} will be handled as follows: ${value(field)}.`));
    }

    function partySection() {
      const firstName = `${firstRole}_name`;
      const firstAddress = `${firstRole}_address`;
      const secondName = `${secondRole}_name`;
      const secondAddress = `${secondRole}_address`;
      return section("1. Parties", [
        paragraph(`This ${escapeHtml(template.name)} (the "Agreement") is entered into as of ${optional("effective_date")} by and between ${value(firstName)}, located at ${value(firstAddress)} (the "${escapeHtml(firstLabel)}"), and ${value(secondName)}, located at ${value(secondAddress)} (the "${escapeHtml(secondLabel)}").`),
        `<div class="contract-party-grid">
          <div class="contract-party-card"><h3>${escapeHtml(firstLabel)}</h3><p><strong>Legal Name:</strong> ${value(firstName)}</p><p><strong>Notice Address:</strong> ${value(firstAddress)}</p></div>
          <div class="contract-party-card"><h3>${escapeHtml(secondLabel)}</h3><p><strong>Legal Name:</strong> ${value(secondName)}</p><p><strong>Notice Address:</strong> ${value(secondAddress)}</p></div>
        </div>`,
        paragraph(`The ${escapeHtml(firstLabel)} and the ${escapeHtml(secondLabel)} may be referred to individually as a "Party" and collectively as the "Parties."`)
      ]);
    }

    function legalBoilerplate(startIndex) {
      const governing = has("governing_law") ? "governing_law" : "governing_state";
      return [
        section(`${startIndex}. Records, Notices, and Cooperation`, [
          paragraph("Each Party will maintain records reasonably necessary to verify performance under this Agreement and will promptly provide information reasonably required for the other Party to perform its obligations."),
          paragraph(`Any formal notice under this Agreement must be delivered to the notice address listed for the applicable Party, or to another address later designated in writing.`)
        ]),
        section(`${startIndex + 1}. Default, Termination, and Survival`, [
          paragraph("A material failure to perform after written notice and a reasonable opportunity to cure will constitute default. Termination does not affect accrued payment obligations, confidentiality duties, ownership rights, dispute rights, or provisions that by their nature should survive."),
          has("termination_notice") ? paragraph(`A Party seeking ordinary termination must provide at least the following notice unless a different written amendment applies: ${value("termination_notice")}.`) : "",
          has("termination_rights") ? paragraph(`The Parties agree to the following termination rights and procedures: ${value("termination_rights")}.`) : "",
          has("termination_terms") ? paragraph(`The Parties agree to the following termination terms: ${value("termination_terms")}.`) : ""
        ]),
        section(`${startIndex + 2}. Governing Law and Entire Agreement`, [
          paragraph(`This Agreement will be governed by the laws of ${optional(governing)} without regard to conflict-of-law rules. This Agreement is the complete understanding between the Parties concerning its subject matter and may be amended only in a written document signed by the Parties.`)
        ])
      ];
    }

    function freelanceSections() {
      return [
        section("2. Engagement and Scope of Services", [
          paragraph(`The ${escapeHtml(firstLabel)} engages the ${escapeHtml(secondLabel)} to perform the services described in this Agreement for the project identified as ${optional("project_name")}.`),
          paragraph(`The services will include the following project description: ${optional("services_description")}. The agreed scope of work is: ${optional("scope_of_work")}.`)
        ]),
        section("3. Deliverables, Review, and Acceptance", [
          paragraph(`The ${escapeHtml(secondLabel)} will provide the following deliverables: ${optional("deliverables")}. The ${escapeHtml(firstLabel)} will review deliverables in good faith and provide approvals, comments, or requested changes through the following process: ${optional("client_approval_process")}.`),
          paragraph(`Included revisions and change handling will be governed by the following revision policy: ${optional("revision_policy")}. Work outside the agreed scope must be approved in writing before it becomes binding.`)
        ]),
        section("4. Schedule and Project Administration", [
          paragraph(`The project is expected to begin on ${optional("start_date")} and be completed by ${optional("completion_date")}, subject to timely approvals, access, content, feedback, and cooperation from the ${escapeHtml(firstLabel)}.`)
        ]),
        section("5. Fees and Payment", [
          paragraph(`The fee for the services is ${optional("service_fee")}. Payment will be made according to the following schedule and invoicing terms: ${optional("payment_schedule")}.`)
        ]),
        section("6. Work Product, Intellectual Property, and Confidentiality", [
          paragraph(`Ownership and usage rights in concepts, drafts, final files, source files, code, content, designs, and other work product will be governed by the following intellectual property terms: ${optional("intellectual_property_ownership")}.`),
          paragraph(`Each Party will protect non-public information received from the other Party and comply with the following confidentiality obligations: ${optional("confidentiality_obligations")}.`)
        ])
      ];
    }

    function ndaSections() {
      return [
        section("2. Confidential Information", [
          paragraph(`"Confidential Information" means non-public information disclosed by the ${escapeHtml(firstLabel)} to the ${escapeHtml(secondLabel)}, whether oral, written, electronic, visual, or otherwise, including the following categories: ${optional("confidential_information")}.`),
          paragraph(`Confidential Information does not include information described in the following exclusions: ${optional("excluded_information")}.`)
        ]),
        section("3. Permitted Purpose and Standard of Care", [
          paragraph(`The ${escapeHtml(secondLabel)} may use Confidential Information only for the following permitted purpose: ${optional("permitted_purpose")}. The ${escapeHtml(secondLabel)} must protect Confidential Information with at least reasonable care and may disclose it only to representatives with a legitimate need to know.`)
        ]),
        section("4. Duration, Return of Materials, and Remedies", [
          paragraph(`The confidentiality obligations will continue for the following period: ${optional("confidentiality_period")}. Upon request, the ${escapeHtml(secondLabel)} will return or destroy materials according to these requirements: ${optional("return_or_destroy_materials")}.`),
          paragraph(`The Parties acknowledge that unauthorized disclosure may cause irreparable harm. The following injunctive relief and remedies terms apply: ${optional("injunctive_relief")}.`)
        ])
      ];
    }

    function employmentSections() {
      return [
        section("2. Position, Duties, and Reporting", [
          paragraph(`The ${escapeHtml(secondLabel)} will serve as ${optional("job_title")} in the ${optional("department")} department and will report to or coordinate with ${optional("manager_name")}. The primary work location is ${optional("work_location")}.`),
          paragraph(`The ${escapeHtml(secondLabel)} will perform the duties reasonably associated with the role, follow lawful policies, and devote the working time and attention required for the position.`)
        ]),
        section("3. Compensation, Benefits, and Schedule", [
          paragraph(`Compensation will be ${optional("compensation")} and paid ${optional("pay_frequency")}. The normal working hours or schedule will be ${optional("working_hours")}.`),
          paragraph(`Benefits and related employment privileges will be provided as follows: ${optional("benefits")}. Any probationary or introductory period will be: ${optional("probation_period")}.`)
        ]),
        section("4. Confidentiality, Intellectual Property, and Company Property", [
          paragraph(`The ${escapeHtml(secondLabel)} will comply with the following confidentiality obligations: ${optional("confidentiality_obligations")}. Intellectual property, inventions, work product, records, and company materials will be governed by: ${optional("intellectual_property_obligations")}.`)
        ]),
        section("5. Notice and Separation", [
          paragraph(`Either Party must provide the following notice unless law or written policy requires otherwise: ${optional("notice_period")}. Final compensation, return of property, confidentiality, and surviving obligations will be handled according to applicable law and this Agreement.`)
        ])
      ];
    }

    function rentalSections() {
      return [
        section("2. Premises and Occupancy", [
          paragraph(`The ${escapeHtml(firstLabel)} leases to the ${escapeHtml(secondLabel)} the premises located at ${optional("property_address")}. The premises are further described as follows: ${optional("premises_description")}.`),
          paragraph(`The lease term begins on ${optional("lease_start")} and ends on ${optional("lease_end")}, unless renewed, extended, or terminated in accordance with this Agreement.`)
        ]),
        section("3. Rent, Deposit, and Late Charges", [
          paragraph(`Monthly rent is ${optional("monthly_rent")}. The security deposit is ${optional("security_deposit")}. Late fees and late payment handling will be as follows: ${optional("late_fee")}.`)
        ]),
        section("4. Utilities, Maintenance, Rules, and Pets", [
          paragraph(`Utilities will be handled as follows: ${optional("utilities_responsibility")}. Maintenance and repair responsibilities will be allocated as follows: ${optional("maintenance_responsibility")}.`),
          paragraph(`The ${escapeHtml(secondLabel)} must comply with the following property rules and regulations: ${optional("rules_and_regulations")}. Pet rights, restrictions, fees, or prohibitions are: ${optional("pet_policy")}.`)
        ]),
        section("5. Notices, Default, and Surrender", [
          paragraph(`Required notices must be provided according to the following notice period: ${optional("notice_period")}. Upon expiration or termination, the ${escapeHtml(secondLabel)} must surrender the premises in the condition required by this Agreement and applicable law.`)
        ])
      ];
    }

    function businessSections() {
      return [
        section("2. Purpose and Commercial Relationship", [
          paragraph(`The Parties enter into this Agreement for the following purpose: ${optional("agreement_purpose")}. The products, services, deliverables, or commercial relationship covered by this Agreement are: ${optional("products_or_services")}.`),
          paragraph(`The commercial terms are as follows: ${optional("commercial_terms")}.`)
        ]),
        section("3. Pricing, Payment, Delivery, and Performance", [
          paragraph(`Pricing will be as follows: ${optional("pricing")}. Payment terms will be as follows: ${optional("payment_terms")}. Delivery or implementation timing will be: ${optional("delivery_timeline")}.`),
          paragraph(`The Parties will comply with the following performance standards, service levels, acceptance expectations, or quality requirements: ${optional("performance_standards")}.`)
        ]),
        section("4. Confidentiality, Intellectual Property, Warranties, and Risk", [
          paragraph(`The Parties will comply with these confidentiality obligations: ${optional("confidentiality_obligations")}. Intellectual property rights, licenses, and ownership are allocated as follows: ${optional("intellectual_property_rights")}.`),
          paragraph(`Warranties, disclaimers, and service commitments are: ${optional("warranties")}. Liability limitations and risk allocation are: ${optional("liability_limit")}.`)
        ])
      ];
    }

    function ipSections() {
      return [
        section("2. Intellectual Property Covered", [
          paragraph(`This Agreement concerns the following intellectual property: ${optional("intellectual_property_description")}.`)
        ]),
        section("3. Grant, Transfer, Scope, and Restrictions", [
          paragraph(`The grant, assignment, license, transfer, or permission given under this Agreement is as follows: ${optional("grant_or_transfer_scope")}. Permitted uses are: ${optional("permitted_uses")}. The territory is ${optional("territory")} and the term is ${optional("term")}.`),
          paragraph(`Restrictions, reserved rights, brand controls, sublicensing limits, modification limits, or other use limits are: ${optional("restrictions")}. Ownership reservations are: ${optional("ownership_reservation")}.`)
        ]),
        section("4. Consideration, Royalties, Confidentiality, and Termination", [
          paragraph(`Consideration for the rights granted is ${optional("consideration")}. Royalties, revenue share, or continuing fees will be: ${optional("royalty_rate")}.`),
          paragraph(`Confidentiality obligations are: ${optional("confidentiality_obligations")}. Termination rights and post-termination obligations are: ${optional("termination_rights")}.`)
        ])
      ];
    }

    function personalSections() {
      return [
        section("2. Purpose and Obligations", [
          paragraph(`The Parties enter into this Agreement for the following purpose: ${optional("agreement_purpose")}. The amount, property, arrangement, or subject matter covered by this Agreement is: ${optional("amount_or_property")}.`),
          paragraph(`Each Party's responsibilities are as follows: ${optional("responsibilities")}. The applicable schedule, timing, parenting plan, repayment timeline, household schedule, or performance timeline is: ${optional("schedule")}.`)
        ]),
        section("3. Payment, Default, and Notices", [
          paragraph(`Payment or contribution terms are: ${optional("payment_terms")}. Default terms and consequences are: ${optional("default_terms")}. Required notice is: ${optional("notice_period")}.`)
        ])
      ];
    }

    function loanSections() {
      const defaultHeading = has("vehicle_make") ? "4. Collateral, Late Charges, and Default" : "3. Collateral, Late Charges, and Default";
      const sections = [
        section("2. Loan and Promise to Pay", [
          paragraph(`The ${escapeHtml(firstLabel)} agrees to lend, and the ${escapeHtml(secondLabel)} agrees to repay, the principal amount of ${optional("loan_amount")}. Interest will accrue or be handled as follows: ${optional("interest_rate")}.`),
          paragraph(`Repayment will begin on ${optional("repayment_start")} and the final maturity or payoff date will be ${optional("maturity_date")}. Payment terms are: ${optional("payment_terms")}.`)
        ]),
        section(defaultHeading, [
          paragraph(`Collateral or security for this obligation is: ${optional("collateral")}. Late charges, grace periods, and late payment handling are: ${optional("late_fee")}.`),
          paragraph(`Events of default, acceleration rights, collection rights, and cure procedures are: ${optional("default_terms")}.`)
        ])
      ];
      if (has("vehicle_make")) {
        sections.splice(1, 0, section("3. Vehicle Collateral", [
          paragraph(`The vehicle connected to this loan is a ${optional("vehicle_year")} ${optional("vehicle_make")} ${optional("vehicle_model")} with VIN ${optional("vin_number")} and mileage of ${optional("mileage")}.`),
          paragraph(`The current vehicle condition disclosure is: ${optional("condition_disclosure")}.`)
        ]));
      }
      return sections;
    }

    function constructionSections() {
      return [
        section("2. Project, Scope, and Site", [
          paragraph(`The project will be performed at ${optional("project_address")}. The project is described as follows: ${optional("project_description")}. The agreed scope of work is: ${optional("scope_of_work")}.`),
          paragraph(`Materials, selections, substitutions, storage, and responsibility for materials will be handled as follows: ${optional("materials_responsibility")}.`)
        ]),
        section("3. Schedule, Price, and Payment", [
          paragraph(`Work is expected to begin on ${optional("start_date")} and reach substantial completion by ${optional("completion_date")}. The contract price is ${optional("contract_price")}. Payment will be made as follows: ${optional("payment_schedule")}.`)
        ]),
        section("4. Change Orders, Permits, Insurance, and Warranty", [
          paragraph(`Change orders must follow this process: ${optional("change_order_process")}. Permit responsibilities are: ${optional("permits_responsibility")}. Insurance requirements are: ${optional("insurance_requirements")}.`),
          paragraph(`Warranty obligations, correction periods, and post-completion support will be: ${optional("warranty_period")}.`)
        ])
      ];
    }

    function eventSections() {
      return [
        section("2. Event and Services", [
          paragraph(`The event is a ${optional("event_type")} scheduled for ${optional("event_date")} at ${optional("event_location")} with an estimated guest count of ${optional("guest_count")}.`),
          paragraph(`The vendor will provide the following services: ${optional("services_description")}. Setup time will be ${optional("setup_time")} and performance or service hours will be ${optional("performance_hours")}.`)
        ]),
        section("3. Fees, Deposit, Cancellation, and Logistics", [
          paragraph(`The total fee is ${optional("total_fee")}. The required deposit is ${optional("deposit")}. Payment will be made according to the following schedule: ${optional("payment_schedule")}.`),
          paragraph(`Cancellation rights, refund handling, postponement terms, and related fees are: ${optional("cancellation_policy")}. Force majeure terms are: ${optional("force_majeure")}. Insurance requirements are: ${optional("insurance_requirements")}.`)
        ])
      ];
    }

    function vehicleSections() {
      return [
        section("2. Vehicle Description", [
          paragraph(`The vehicle covered by this Agreement is a ${optional("vehicle_year")} ${optional("vehicle_make")} ${optional("vehicle_model")} with VIN ${optional("vin_number")} and mileage of ${optional("mileage")}.`)
        ]),
        section("3. Transaction Terms, Payment, and Transfer", [
          paragraph(`The transaction price or agreed compensation is ${optional("transaction_price")}. Payment will be made by ${optional("payment_method")}. Transfer, delivery, rental start, or possession date will be ${optional("transfer_date")}.`),
          paragraph(`Insurance responsibilities are: ${optional("insurance_responsibility")}.`)
        ]),
        section("4. Condition, Odometer, and As-Is Terms", [
          paragraph(`The condition disclosure is: ${optional("condition_disclosure")}. The odometer statement is: ${optional("odometer_statement")}.`),
          paragraph(`As-is terms, warranty exclusions, inspection acknowledgments, and risk allocation are: ${optional("as_is_terms")}.`)
        ])
      ];
    }

    function categorySections() {
      if (includesAny(text, ["non-disclosure", "nda", "confidential"])) return ndaSections();
      if (includesAny(text, ["loan", "promissory", "iou", "debt repayment", "debt settlement", "payment plan"])) return loanSections();
      if (template.category === "freelance") return freelanceSections();
      if (template.category === "employment") return employmentSections();
      if (template.category === "rental") return rentalSections();
      if (template.category === "business") return businessSections();
      if (template.category === "ip") return ipSections();
      if (template.category === "personal") return personalSections();
      if (template.category === "construction") return constructionSections();
      if (template.category === "events") return eventSections();
      if (template.category === "vehicle") return vehicleSections();
      return businessSections();
    }

    const sections = [
      section("Important Notice", [
        paragraph("This template is provided for general informational purposes and should be reviewed for the governing jurisdiction, transaction value, industry requirements, and the Parties' specific facts before signature.")
      ]),
      partySection(),
      ...categorySections()
    ];

    const extra = extraTerms();
    if (extra.length) {
      sections.push(section(`${sections.length}. Additional Agreed Terms`, extra));
    }
    sections.push(...legalBoilerplate(sections.length));
    sections.push(section("Signatures", [
      `<div class="signature-grid"><div><span>${escapeHtml(firstLabel)} Signature</span><strong>Date</strong></div><div><span>${escapeHtml(secondLabel)} Signature</span><strong>Date</strong></div></div>`
    ]));

    return `<article class="contract-document">
      <div class="contract-title"><h1>${escapeHtml(template.name)}</h1></div>
      ${sections.map((item) => `<section><h2>${escapeHtml(item.heading)}</h2>${item.paragraphs.join("")}</section>`).join("")}
    </article>`;
  }

  window.ContractEngine = {
    renderHtml,
    titleize,
    escapeHtml
  };
})();
