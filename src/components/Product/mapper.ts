import { Product, ProductDisplayRequest, ProductForm, ProductRequest } from "interfaces/Product"

export const mapProductForm = (product: Product): ProductForm => {
    return {
        ...product
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
        productImage: product.productImage || null,
        specificationPdf: product.specificationPdf || null,
        specificationImage: product.specificationImage || null,
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