import { Product, ProductOption } from "./Product";

export interface ProductGroup {
    groupId?: number;
    groupNameDisplay: string;
    groupNameSearch: string;
    groupProductDetail: string;
    groupImageFileName: string;
    groupSpecificationImageFileName: string;
    groupSpecificationPdfFileName: string;
    displayType: string;
}

export interface ProductGroupForm extends ProductGroup {
    products: ProductOption[];
    productGroupImage?: File;
    groupSpecificationImage?: File;
    groupSpecificationPdf?: File;
    productDefaultImage?: File;
}

export interface ProductGroupSearchForm {
    productId: number | null;
    groupNameDisplay: string
}

export interface ProductGroupRequest {
    groupId: number | null;
    groupNameDisplay: string;
    groupNameSearch: string;
    displayType: string;
    productIds: number[];
    groupProductDetail: string;
    productGroupImage: File | null;
    groupSpecificationImage: File | null;
    groupSpecificationPdf: File | null;
    productDefaultImage: File | null;
}

export interface ProductGroupInformation {
    productGroup: ProductGroup;
    products: Product[];
}

export interface ProductGroupOption {
    groupId: number;
    groupNameDisplay: string;
}
