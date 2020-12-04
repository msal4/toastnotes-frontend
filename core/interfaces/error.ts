export interface ValidationError {
  field: string;
  reason: string;
}

export interface AuthError {
  errors?: ValidationError[];
  error?: string;
}
