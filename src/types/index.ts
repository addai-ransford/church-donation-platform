export type Purpose = {
  id: string;
  label: string;
};

export type AdminPurpose = Purpose & {
  totalAmount: number;
  isActive: boolean; 
};

export * from "."
export * from  "./verses"