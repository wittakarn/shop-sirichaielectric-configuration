import { TwoLevelMenuProps } from 'interfaces/Menu';

export const menuMenu: TwoLevelMenuProps = {
    menuName: 'เมนู',
    subMenuDetails: [
        {
            name: 'จัดการเมนูหลัก',
            url: `${application.contextRoot}spa/menu/management`,
        },
        {
            name: 'จัดการกลุ่มสินค้า',
            url: `${application.contextRoot}spa/product-group/management`,
        },
    ],
};

export const customerMenu: TwoLevelMenuProps = {
    menuName: 'ลูกค้า',
    subMenuDetails: [
        {
            name: 'จัดการลูกค้า',
            url: `${application.contextRoot}spa/customer/management`,
        }
    ],
};

export const productMenu: TwoLevelMenuProps = {
    menuName: 'สินค้า',
    subMenuDetails: [
        {
            name: 'จัดการสินค้า',
            url: `${application.contextRoot}spa/product/search`,
        },
        {
            name: 'แก้ไขชื่อสินค้า',
            url: `${application.contextRoot}spa/product/edit-product-name`,
        },
    ],
};

export const quotationMenu: TwoLevelMenuProps = {
    menuName: 'เสนอราคา',
    subMenuDetails: [
        {
            name: 'สร้างใบเสนอราคา',
            url: `${application.contextRoot}spa/quotation/select-customer`,
        },
    ],
};

export const utilityMenu: TwoLevelMenuProps = {
    menuName: 'Utility',
    subMenuDetails: [
        {
            name: 'sitemaps',
            url: `${application.contextRoot}server/rest/sitemaps-generator.php`,
            openNewTab: true,
        }
    ],
};
