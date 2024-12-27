export interface Deduction {
  id: string;
  name: string;
  percentage: number;
  created_at: string;
}

export interface DeductionFormData {
  name: string;
  percentage: number;
}