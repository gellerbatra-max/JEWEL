// Client-safe customer types (no fs/crypto). Store lives in ./customer-store.ts.

export type PublicCustomer = {
  id: string;
  name: string;
  email: string; // "" for WhatsApp accounts
  phone: string; // "" for email accounts
  via: "email" | "whatsapp";
  createdAt: string;
  savedCount: number;
  emailVerified: boolean;
};
