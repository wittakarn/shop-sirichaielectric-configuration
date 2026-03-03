import { Product, ProductOption } from "./Product";
import { GroupImage } from "./GroupImage";

export interface ProductGroup {
    groupId?: number;
    groupNameDisplay: string;
    groupNameSearch: string;
    groupProductDetail: string;
    groupImageFileName: string;
    displayType: string;
}

export interface ProductGroupInfo {
    groupId: number;
    groupNameDisplay: string;
    groupNameSearch: string;
    groupProductDetail: string;
    groupImageFileName: string;
    displayType: string;
    images: GroupImage[];
}

export interface ProductGroupForm extends ProductGroup {
    products: ProductOption[];
    productGroupImage?: File;
    groupSpecificationImage?: File;
    groupSpecificationPdf?: File;
    productDefaultImage?: File;
    groupSpecImages?: GroupImage[];
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
    productDefaultImage: File | null;
    groupSpecImages?: File[];
}

export interface ProductGroupInformation {
    productGroup: ProductGroupInfo;
    products: Product[];
}

export interface ProductGroupOption {
    groupId: number;
    groupNameDisplay: string;
}
