export interface MenuGroupForm {
    groupNameDisplay: string;
    groupNameSearch: string;
    groupParent: MenuGroup | null;
    menuImageFileName: string;
    menuImage?: File;
    inventoryItems: Inventory[];
}

export interface Inventory {
    order: number;
    inventoryId: number;
    inventoryName: string;
    category: string;
}

export interface MenuGroup {
    id: number;
    sequence?: number;
    groupNameDisplay: string;
    groupNameSearch: string;
    menuImageFileName: string;
    groupParentId: number;
}

export interface MenuInformation extends MenuGroup {
    parentGroupNameDisplay: string;
}

export interface CreateMenuGroupRequest {
    groupNameDisplay: string;
    groupNameSearch: string;
    groupParentId?: number;
    menuImage: File | null;
    inventoryItems: Inventory[];
}

export interface UpdateMenuGroupRequest {
    id: number;
    groupNameDisplay: string;
    groupNameSearch: string;
    groupParentId?: number;
    menuImage: File | null;
    inventoryItems: Inventory[];
}

export interface MenuGroupSearchForm {
    menuGroupNameDisplay: string;
    productGroupNameDisplay: string;
    productName: string;
}