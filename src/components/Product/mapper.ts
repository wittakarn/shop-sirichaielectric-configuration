import { ProductInfo, ProductDisplayRequest, ProductForm, ProductRequest } from "interfaces/Product"
import { imageUrlToFile } from "services/ImageService"

export const mapProductForm = (product: ProductInfo): ProductForm => {
    return {
        ...product,
        productNameDisplay: product.productNameDisplay ?? '',
        productUrlName: product.productUrlName ?? '',
        productSearch: product.productSearch ?? '',
        productDetail: product.productDetail ?? '',
        productSpecs: product.images?.filter(image => image.type === 'SPEC') ?? [],
    }
}

export const mapProductRequest = async (product: ProductForm): Promise<ProductRequest> => {
    const productSpecImages = product.productSpecs?.map(async spec => spec.file ?? await imageUrlToFile(`${application.shopUrl}image/specification/${spec.fileName}`, spec.fileName!)) ?? []
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
        productSpecImages: await Promise.all(productSpecImages),
    }
}


export const mapProductDisplayRequest = (products: ProductInfo[]): ProductDisplayRequest => {
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