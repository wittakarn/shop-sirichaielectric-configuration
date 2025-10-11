export interface Customer {
  id?: number;
  customerName: string;
  tin: string;
  customerAddress: string;
  customerGrade: string;
  remark?: string;
}

export interface CustomerOption {
  id: number;
  customerName: string;
}
