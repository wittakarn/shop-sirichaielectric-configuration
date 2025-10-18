import { Product, ProductDisplayRequest, ProductForm, ProductRequest } from "interfaces/Product"

export const mapProductForm = (product: Product): ProductForm => {
    return {
        ...product,
        productNameDisplay: product.productNameDisplay ?? '',
        productUrlName: product.productUrlName ?? '',
        productSearch: product.productSearch ?? '',
        productDetail: product.productDetail ?? '',
        productSpecs: [],
    }
}

export const mapProductRequest = (product: ProductForm): ProductRequest => {
    return {
        productId: product.productId,
        productName: product.productName,
        productNameDisplay: product.productNameDisplay,
        productUrlName: product.productUrlName,
        productSearch: product.productSearch,
        standardPrice: product.standardPrice,
        bPrice: product.bPrice,
        productDetail: product.productDetail,
        productImage: product.productImage ?? null,
        productSpecImages: product.productSpecs?.map(spec => spec.specificationImageFile).filter((file): file is File => file !== undefined) ?? [],
    }
}


export const mapProductDisplayRequest = (products: Product[]): ProductDisplayRequest => {
    return {
        products: products.map(product => (
            {
                productId: product.productId,
                productName: product.productName,
                productNameDisplay: product.productNameDisplay,
            })
        )
    }
}