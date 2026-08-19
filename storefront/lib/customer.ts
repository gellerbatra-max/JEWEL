// Client-safe customer types (no fs/crypto). Store lives in ./customer-store.ts.

export type PublicCustomer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  savedCount: number;
  emailVerified: boolean;
};
