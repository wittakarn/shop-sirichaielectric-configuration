import { MenuGroup } from "./MenuGroup";
import { ProductSpec } from "./ProductSpec";

export interface Product {
    productId: number;
    productName: string;
    productNameDisplay: string;
    productUrlName: string;
    productSearch: string;
    standardPrice: number;
    capitalPrice: number;
    bPrice: number;
    productDetail: string;
    productGroupId: number;
    menuId: number;
    productImageFileName: string;
    specificationPdfFileName: string;
    specificationImageFileName: string;
    specificationImageFileNames: string[];
    productSpecs: ProductSpec[];
}

export interface ProductForm extends Product {
    productImage?: File;
    specificationPdf?: File;
    specificationImage?: File;
}

export interface ProductRequest {
    productId: number;
    productName: string;
    productNameDisplay: string;
    productUrlName: string;
    productSearch: string;
    standardPrice: number;
    bPrice: number;
    productDetail: string;
    productImage: File | null;
    productSpecImages: File[];
}

export interface ProductSearchResult extends Product {
    menuGroupNameG: string;
    menuGroupNameP: string;
    groupNameDisplay: string;
}

export interface ProductSearchForm {
    menuId: number | null;
    productName: string;
}

export interface ProductInformation {
    menu: MenuGroup;
    product: Product;
}

export interface ProductOption {
    productId: number;
    productName: string;
    productImageFileName: string | null;
}

export interface ProductOption {
    productId: number;
    productName: string;
    productImageFileName: string | null;
}

export interface ProductDisplay {
    productId: number;
    productName: string;
    productNameDisplay: string;
}

export interface ProductDisplayRequest {
    products: ProductDisplay[];
}