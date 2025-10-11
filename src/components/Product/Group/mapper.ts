import { ProductGroupForm, ProductGroupInformation, ProductGroupRequest } from 'interfaces/ProductGroup'

export const mapGroupRequest = (productGroupForm: ProductGroupForm): ProductGroupRequest => {
    return {
        groupId: productGroupForm.groupId ? Number(productGroupForm.groupId) : null,
        groupNameDisplay: productGroupForm.groupNameDisplay,
        groupNameSearch: productGroupForm.groupNameSearch,
        displayType: productGroupForm.displayType,
        productIds: productGroupForm.products.map(p => p.productId),
        groupProductDetail: productGroupForm.groupProductDetail,
        productGroupImage: productGroupForm.productGroupImage || null,
        groupSpecificationImage: productGroupForm.groupSpecificationImage || null,
        groupSpecificationPdf: productGroupForm.groupSpecificationPdf || null,
        productDefaultImage: productGroupForm.productDefaultImage || null,
    };
}
export const mapProductGroupForm = (productGroupInformation: ProductGroupInformation): ProductGroupForm => {
    return {
        groupProductDetail: productGroupInformation.productGroup.groupProductDetail,
        groupImageFileName: productGroupInformation.productGroup.groupImageFileName,
        groupSpecificationImageFileName: productGroupInformation.productGroup.groupSpecificationImageFileName,
        groupSpecificationPdfFileName: productGroupInformation.productGroup.groupSpecificationPdfFileName,
        groupNameSearch: productGroupInformation.productGroup.groupNameSearch,
        groupNameDisplay: productGroupInformation.productGroup.groupNameDisplay,
        displayType: productGroupInformation.productGroup.displayType,
        products: [
            ...(productGroupInformation.products || [])
        ],
        groupId: productGroupInformation.productGroup.groupId,
    };
}