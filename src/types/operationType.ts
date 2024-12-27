export interface OperationType {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface OperationTypeFormData {
  name: string;
  description?: string;
}