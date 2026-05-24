(function () {
  function slugify(value) {
    return String(value || "contract")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "contract";
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.;:])/g, "$1")
      .trim();
  }

  function contractSections(data) {
    return [
      { heading: "Important Notice", paragraphs: [data.notice] },
      { heading: "1. Parties", rows: data.parties },
      { heading: "2. Background and Purpose", paragraphs: data.background },
      { heading: "3. Key Terms", rows: data.keyTerms, numbered: true },
      ...(data.sections || []),
      { heading: "Signatures", signatures: data.signatures || ["Party Signature", "Party Signature"] }
    ];
  }

  function createRenderer(doc, dryRun) {
    const pageWidth = 612;
    const margin = 54;
    const contentWidth = pageWidth - margin * 2;
    let y = 66;

    function setFont(name, style, size) {
      if (!dryRun) doc.setFont(name, style).setFontSize(size);
    }

    function text(value, x, yValue, options) {
      if (!dryRun) doc.text(value, x, yValue, options || {});
    }

    function line(x1, y1, x2, y2) {
      if (!dryRun) doc.line(x1, y1, x2, y2);
    }

    function writeParagraph(value, options = {}) {
      const size = options.size || 11;
      const leading = options.leading || 15;
      const indent = options.indent || 0;
      const font = options.font || "times";
      const style = options.style || "normal";
      setFont(font, style, size);
      const lines = doc.splitTextToSize(normalizeText(value), contentWidth - indent);
      text(lines, margin + indent, y);
      y += lines.length * leading + (options.after ?? 7);
    }

    function writeHeading(value) {
      y += 8;
      setFont("times", "bold", 13);
      text(normalizeText(value), margin, y);
      y += 20;
    }

    function writeRows(rows, numbered) {
      if (!rows || !rows.length) {
        writeParagraph("The parties will complete the relevant details before signing this agreement.");
        return;
      }
      rows.forEach((row, index) => {
        const prefix = numbered ? `${index + 1}. ` : "";
        const lineText = `${prefix}${row.label}: ${row.value}`;
        writeParagraph(lineText, { indent: numbered ? 12 : 0, after: 3 });
      });
      y += 6;
    }

    function writeSignatures(labels) {
      y += 28;
      const gap = 36;
      const lineWidth = (contentWidth - gap) / 2;
      labels.slice(0, 2).forEach((label, index) => {
        const x = margin + index * (lineWidth + gap);
        line(x, y, x + lineWidth, y);
        setFont("times", "normal", 10);
        text(normalizeText(label), x, y + 14);
        text("Date", x, y + 30);
      });
      y += 56;
    }

    function render(data) {
      const title = normalizeText(data.title || "Contract Agreement").toUpperCase();
      setFont("times", "bold", 20);
      const titleLines = doc.splitTextToSize(title, contentWidth);
      text(titleLines, pageWidth / 2, y, { align: "center" });
      y += titleLines.length * 22;
      const subtitle = normalizeText(data.subtitle);
      if (subtitle) {
        setFont("times", "italic", 11);
        text(subtitle, pageWidth / 2, y, { align: "center" });
        y += 28;
      } else {
        y += 14;
      }
      line(margin, y, pageWidth - margin, y);
      y += 28;

      contractSections(data).forEach((section) => {
        writeHeading(section.heading);
        if (section.paragraphs) section.paragraphs.forEach((paragraph) => writeParagraph(paragraph));
        if (section.rows) writeRows(section.rows, section.numbered);
        if (section.signatures) writeSignatures(section.signatures);
      });

      return y + 54;
    }

    return { render };
  }

  function downloadContractPdfFromData(data, filename) {
    if (!window.jspdf?.jsPDF) {
      window.print();
      return;
    }

    const { jsPDF } = window.jspdf;
    const measurementDoc = new jsPDF({ orientation: "portrait", unit: "pt", format: [612, 1200] });
    const measuredHeight = createRenderer(measurementDoc, true).render(data);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, Math.max(900, Math.ceil(measuredHeight))],
      compress: true
    });
    doc.setTextColor(17, 24, 39);
    doc.setDrawColor(17, 24, 39);
    createRenderer(doc, false).render(data);
    doc.save(`${slugify(filename || data?.title)}.pdf`);
  }

  function downloadContractPdf(element, filename) {
    const fallbackData = {
      title: filename || "Contract Agreement",
      subtitle: "",
      notice: "This document is a professionally structured template for informational purposes.",
      parties: [],
      background: [element?.textContent || ""],
      keyTerms: [],
      sections: [],
      signatures: ["Party Signature", "Party Signature"]
    };
    downloadContractPdfFromData(fallbackData, filename);
  }

  function splitLabelValue(text) {
    const parts = normalizeText(text).split(":");
    if (parts.length < 2) return null;
    return {
      label: parts.shift().replace(/^\d+\.\s*/, "").trim(),
      value: parts.join(":").trim()
    };
  }

  function downloadContractPdfFromElement(element, filename) {
    const article = element?.querySelector?.(".contract-document") || element;
    if (!article) {
      downloadContractPdf(null, filename);
      return;
    }

    const title = article.querySelector(".contract-title h1")?.textContent || filename || "Contract Agreement";
    const subtitle = article.querySelector(".contract-title p")?.textContent || "";
    const data = {
      title,
      subtitle,
      notice: "",
      parties: [],
      background: [],
      keyTerms: [],
      sections: [],
      signatures: ["Party Signature", "Party Signature"]
    };

    article.querySelectorAll("section").forEach((section) => {
      const heading = normalizeText(section.querySelector("h2")?.textContent || "");
      const paragraphs = Array.from(section.querySelectorAll("p")).map((node) => normalizeText(node.textContent)).filter(Boolean);
      if (/important notice/i.test(heading)) {
        data.notice = paragraphs.join(" ");
      } else if (/parties/i.test(heading)) {
        data.parties = paragraphs.map(splitLabelValue).filter(Boolean);
      } else if (/background/i.test(heading)) {
        data.background = paragraphs;
      } else if (/key terms/i.test(heading)) {
        data.keyTerms = paragraphs.map(splitLabelValue).filter(Boolean);
      } else if (/signature/i.test(heading)) {
        data.signatures = Array.from(section.querySelectorAll(".signature-grid span")).map((node) => normalizeText(node.textContent)).filter(Boolean);
      } else if (heading) {
        data.sections.push({ heading, paragraphs });
      }
    });

    downloadContractPdfFromData(data, filename || title);
  }

  window.downloadContractPdfFromData = downloadContractPdfFromData;
  window.downloadContractPdfFromElement = downloadContractPdfFromElement;
  window.downloadContractPdf = downloadContractPdf;
})();
