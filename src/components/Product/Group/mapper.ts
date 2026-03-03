import { ProductGroupForm, ProductGroupInformation, ProductGroupRequest } from 'interfaces/ProductGroup'
import { imageUrlToFile } from 'services/ImageService';

export const mapGroupRequest = async (productGroupForm: ProductGroupForm): Promise<ProductGroupRequest> => {
    const productSpecImages = productGroupForm.groupSpecImages?.map(async spec => spec.file ?? await imageUrlToFile(`${application.shopUrl}image/specification-group/${spec.fileName}`, spec.fileName!)) ?? []

    return {
        groupId: productGroupForm.groupId ? Number(productGroupForm.groupId) : null,
        groupNameDisplay: productGroupForm.groupNameDisplay,
        groupNameSearch: productGroupForm.groupNameSearch,
        displayType: productGroupForm.displayType,
        productIds: productGroupForm.products.map(p => p.productId),
        groupProductDetail: productGroupForm.groupProductDetail,
        productGroupImage: productGroupForm.productGroupImage || null,
        productDefaultImage: productGroupForm.productDefaultImage || null,
        groupSpecImages: await Promise.all(productSpecImages),
    };
}
export const mapProductGroupForm = (productGroupInformation: ProductGroupInformation): ProductGroupForm => {
    return {
        groupProductDetail: productGroupInformation.productGroup.groupProductDetail,
        groupImageFileName: productGroupInformation.productGroup.groupImageFileName,
        groupNameSearch: productGroupInformation.productGroup.groupNameSearch,
        groupNameDisplay: productGroupInformation.productGroup.groupNameDisplay,
        displayType: productGroupInformation.productGroup.displayType,
        products: [
            ...(productGroupInformation.products || [])
        ],
        groupId: productGroupInformation.productGroup.groupId,
        groupSpecImages: productGroupInformation.productGroup.images?.filter(image => image.type === 'SPEC') ?? [],
    };
}