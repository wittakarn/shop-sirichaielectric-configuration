import { extend } from "lodash";
import { MenuGroup } from "./MenuGroup";
import { ProductImage } from "./ProductImage";

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
}

export interface ProductInfo extends Product {
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
    images: ProductImage[];
}

export interface ProductForm {
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
    productImage?: File;
    productSpecs: ProductImage[];
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