import React, { useState } from "react";
import jsPDF from "jspdf";
import { Button } from "reactstrap";
import * as htmlToImage from "html-to-image";

const DownloadReport = () => {
  const [loading, setLoading] = useState(false);

  async function exportProjectToPdf() {
    setLoading(true);
    const doc = new jsPDF("p", "px");
    const elements = document.getElementsByClassName("reportdownproject");
    await creatPdf({ doc, elements });

    doc.save(`voucher.pdf`);
    setLoading(false);
  }

  async function creatPdf({ doc, elements }) {
    let top = 20;
    const padding = 10;

    for (let i = 0; i < elements.length; i++) {
      const el = elements.item(i);
      try {
        const imgData = await htmlToImage.toPng(el);
        let elHeight = el.offsetHeight;
        let elWidth = el.offsetWidth;
        const pageWidth = doc.internal.pageSize.getWidth();
        if (elWidth > pageWidth) {
          const ratio = pageWidth / elWidth;
          elHeight = elHeight * ratio - padding;
          elWidth = elWidth * ratio - padding;
        }
        const pageHeight = doc.internal.pageSize.getHeight();
        if (top + elHeight > pageHeight) {
          doc.addPage();
          top = 20;
        }
        doc.addImage(
          imgData,
          "PNG",
          padding,
          top,
          elWidth,
          elHeight,
          `image${i}`
        );
        top += elHeight;
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        marginBottom: "5px",
        marginRight: "5px",
      }}
    >
      <Button color="info" className="float-right" onClick={exportProjectToPdf}>
        {loading ? "Downloding..." : "Download"}
      </Button>
    </div>
  );
};

export default DownloadReport;
