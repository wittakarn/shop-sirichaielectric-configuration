import { Customer } from "./Customer";
import { Product } from "./Product";

export type ProductInQuotation = {
    product: Product;
    productAmount: number;
    productPrice: number;
    summedProductPrice: number;
}

export type QuotationFormValues = {
    quotNo?: string;
    productsInQuotation: ProductInQuotation[];
    customer: Customer | null;
    totalPrice: number;
    vatPrice: number;
    summedPrice: number;
    submitCount: number;
}

export type QuotMast = {
  quotNo: string;
  customerId: number;
  date: string;
  totalPrice: number;
  vatPrice: number;
  netPrice: number;
  promotionType: 'N' | 'S' | 'B';
  createUser: string | null;
  createDatetime: Date | null;
  updateUser: string | null;
  updateDatetime: Date | null;
  updateCount: number | null;
}

export type QuotDetail = {
  quotNo: string;
  productId: number;
  sequence: number;
  productName: string;
  quantity: number;
  unitName: string;
  price: number;
  capitalPrice: number | null;
  summaryPrice: number;
}

export type PriceHistory = {
    date: string;
    price: number;
}