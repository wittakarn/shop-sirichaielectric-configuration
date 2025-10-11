import { CreateMenuGroupRequest, Inventory, MenuGroupForm, MenuInformation, UpdateMenuGroupRequest } from "interfaces/MenuGroup"

export const mapCreateMenuGroupRequest = (menuGroupForm: MenuGroupForm): CreateMenuGroupRequest => {
    return {
        groupNameDisplay: menuGroupForm.groupNameDisplay,
        groupNameSearch: menuGroupForm.groupNameSearch,
        groupParentId: menuGroupForm.groupParent?.id,
        menuImage: menuGroupForm.menuImage || null,
        inventoryItems: menuGroupForm.inventoryItems || [],
    };
}

export const mapUpdateMenuGroupRequest = (id: number, menuGroupForm: MenuGroupForm): UpdateMenuGroupRequest => {
    return {
        id,
        groupNameDisplay: menuGroupForm.groupNameDisplay,
        groupNameSearch: menuGroupForm.groupNameSearch,
        groupParentId: menuGroupForm.groupParent?.id,
        menuImage: menuGroupForm.menuImage || null,
        inventoryItems: menuGroupForm.inventoryItems || [],
    };
}

export const mapMenuGroupForm = (menuInformation: MenuInformation, inventoryItems: Inventory[]): MenuGroupForm => {
    return {
        groupNameDisplay: menuInformation.groupNameDisplay,
        groupNameSearch: menuInformation.groupNameSearch,
        menuImageFileName: menuInformation.menuImageFileName,
        inventoryItems: inventoryItems,
        groupParent: {
            id: menuInformation.groupParentId,
            groupNameDisplay: menuInformation.parentGroupNameDisplay,
            groupNameSearch: '',
            groupParentId: 0,
            menuImageFileName: '',
        },
    };
}