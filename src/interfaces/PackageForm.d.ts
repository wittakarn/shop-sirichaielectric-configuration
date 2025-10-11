export interface ProductPackage {
    quantity: number;
    package_amount: number;
    weight: number;
}

export interface PackageCountRequest {
    products: ProductPackage[];
}

export interface PackageCountResponse {
    totalDhlPackageCount: number;
    totalJtPackageCount: number;
}
