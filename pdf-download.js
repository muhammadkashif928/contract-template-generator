(function () {
  function slugify(value) {
    return String(value || "contract")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "contract";
  }

  async function downloadContractPdf(element, filename) {
    if (!element || !window.jspdf?.jsPDF) {
      window.print();
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdfWidth = 612;
    const margin = 36;
    const contentWidth = pdfWidth - margin * 2;
    const sourceWidth = Math.max(element.scrollWidth, element.offsetWidth, 720);
    const sourceHeight = Math.max(element.scrollHeight, element.offsetHeight, 1000);
    const scale = contentWidth / sourceWidth;
    const pdfHeight = Math.max(792, Math.ceil(sourceHeight * scale + margin * 2));
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight],
      compress: true
    });

    await doc.html(element, {
      x: margin,
      y: margin,
      width: contentWidth,
      windowWidth: sourceWidth,
      html2canvas: {
        scale: 1.3,
        backgroundColor: "#ffffff",
        useCORS: true
      }
    });
    doc.save(`${slugify(filename)}.pdf`);
  }

  window.downloadContractPdf = downloadContractPdf;
})();
