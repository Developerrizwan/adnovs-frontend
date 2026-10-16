// Helpers for turning document numbers in report tables into links that open
// the underlying voucher, invoice or job in a new browser tab.
import React from "react";

const VOUCHER_SLUGS = {
  Payment: "payment",
  Receipt: "receipt",
  Journal: "journal",
  DebitNote: "debit",
  CreditNote: "credit",
};

export const voucherPath = (voucherType, id) => {
  if (!id) return null;
  const slug = VOUCHER_SLUGS[voucherType];
  return slug ? `/voucher/${slug}/${id}` : `/voucher/${id}`;
};

export const invoicePath = (invoiceType, template, id) => {
  if (!id) return null;
  if (invoiceType === "Purchase") return `/purchase-invoice/${id}`;
  // Sales invoices render through the company's chosen template, matching the
  // routing used by the invoice list page.
  if (template === "INV1") return `/tax-invoice-second/${id}`;
  if (template === "INV2") return `/tax-invoice/${id}`;
  return `/tax-invoice-third/${id}`;
};

export const jobPath = (id) => (id ? `/job/${id}` : null);

// Renders children as a new-tab link when a path is available, otherwise as
// plain text. stopPropagation keeps row click handlers from firing.
export const ReportLink = ({ path, title, children }) => {
  if (!path) return <>{children}</>;
  const href = `${process.env.PUBLIC_URL || ""}${path}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fw-medium text-primary text-decoration-underline"
      title={title || "Open in new tab"}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
};
