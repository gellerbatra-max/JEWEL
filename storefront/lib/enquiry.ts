// Client-safe enquiry types (no fs). Store lives in ./enquiry-store.ts.

export type EnquiryType = "hint" | "appointment" | "customise" | "general";

export type Enquiry = {
  id: string;
  type: EnquiryType;
  productTitle: string;
  productHandle: string;
  productSku: string;
  productUrl: string;
  name: string;
  contact: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  landingPath: string;
  createdAt: string;
  read: boolean;
};

export const ENQUIRY_LABEL: Record<EnquiryType, string> = {
  hint: "Drop a Hint",
  appointment: "Appointment",
  customise: "Customise",
  general: "Enquiry",
};
