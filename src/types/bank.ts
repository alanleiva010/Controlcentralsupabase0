export interface Bank {
  id: string;
  name: string;
  country: string | null;
  swift_code: string | null;
  created_by: string;
  created_at: string;
}

export interface BankFormData {
  name: string;
  country?: string;
  swift_code?: string;
}