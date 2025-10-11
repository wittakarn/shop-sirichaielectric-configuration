<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'connection.php';
require_once DOCUMENT_ROOT . 'server/repository/MenuGroupRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/InventoryInMenuRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductGroupRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductRepository.php';
require_once DOCUMENT_ROOT . 'server/utils/File.php';
require_once DOCUMENT_ROOT . 'server/utils/String.php';

class MenuGroupBusiness
{
    private $dbh;

    public function __construct()
    {
        $this->dbh = DataBaseConnection::createConnect();
    }

    public function createMenuGroup($params, $files)
    {
        $menuImageFileName = null;
        if (isset($files['menuImage'])) {
            $menuImageFileName = writeFile(IMAGE_PATH . '/menu/', $params['groupNameSearch'], $files['menuImage']);
        }

        $menuGroupRepo = new MenuGroupRepository($this->dbh);
        $createdId = $menuGroupRepo->createMenuGroup($params, $menuImageFileName);

        $inventoryInMenuRepo = new InventoryInMenuRepository($this->dbh);
        foreach ($params['inventoryItems'] as $index=>$inventoryItem) {
            $inventoryInMenuRepo->assignInventoryToMenu($index + 1, $createdId, $inventoryItem['inventoryId'], $inventoryItem['category']);
        }

        $result['createdId'] = $createdId;

        return $result;
    }

    public function updateMenuGroup($params, $files)
    {
        $menuImageFileName = null;
        if (isset($files['menuImage'])) {
            $menuImageFileName = writeFile(IMAGE_PATH . '/menu/', $params['groupNameSearch'], $files['menuImage']);
        }

        $menuGroupRepo = new MenuGroupRepository($this->dbh);
        $menuGroupRepo->updateMenuGroup($params, $menuImageFileName);

        $inventoryInMenuRepo = new InventoryInMenuRepository($this->dbh);
        $inventoryInMenuRepo->removeAssignedInventoryToMenu($params['id']);
        foreach ($params['inventoryItems'] as $index=>$inventoryItem) {
            $inventoryInMenuRepo->assignInventoryToMenu($index + 1, $params['id'], $inventoryItem['inventoryId'], $inventoryItem['category']);
        }

        $result['updatedId'] = $params['id'];

        return $result;
    }

    public function deleteMenuGroup($id)
    {
        $menuGroupRepo = new MenuGroupRepository($this->dbh);
        $subMenus = $menuGroupRepo->getSubMenuGroups($id);

        if (count($subMenus) > 0) {
            $result['error'] = 'ไม่สามารถลบเมนูได้เนื่องจากมี sub menu อยู่ภายใต้เมนูนี้';
        } else {
            $menuGroupRepo->deleteMenuGroup($id);
            $result['id'] = $id;
        }

        return $result;
    }

    public function updateMenuGroupsSequence($menuGroups)
    {
        $menuGroupRepo = new MenuGroupRepository($this->dbh);

        foreach($menuGroups as  $index=>$menuGroup) {
            $menuGroupRepo->updateMenuGroupSequence($menuGroup["id"], $index + 1);
        }

        return $menuGroups;
    }

    public function getMenuGroups($groupNameDisplay)
    {
        $menuGroupRepo = new MenuGroupRepository($this->dbh);
        $menuGroups = $menuGroupRepo->getMenuGroups($groupNameDisplay);
        return $menuGroups;
    }

    public function getMenuInformation($menuGroupNameDisplay, $productGroupNameDisplay, $productName)
    {
        $menuGroupRepo = new MenuGroupRepository($this->dbh);
        $menuInformation = $menuGroupRepo->getMenuInformation($menuGroupNameDisplay, $productGroupNameDisplay, $productName);
        return $menuInformation;
    }

    public function getSubMenuGroups($groupParentId)
    {
        $menuGroupRepo = new MenuGroupRepository($this->dbh);
        $menuGroups = $menuGroupRepo->getSubMenuGroups($groupParentId);
        return $menuGroups;
    }

    public function getAssignedInventoryItems($menuId)
    {
        $inventoryInMenuRepo = new InventoryInMenuRepository($this->dbh);
        $inventoryItems = $inventoryInMenuRepo->getAssignedInventoryItems($menuId);

        foreach ($inventoryItems as &$inventoryItem) {
            if ($inventoryItem['category'] == 'group') {
                $productGroupRepository = new ProductGroupRepository($this->dbh);
                $productGroup = $productGroupRepository->getProductGroup($inventoryItem['inventory_id']);
                $inventoryItem['inventoryName'] = $productGroup['group_name_display'];
            } else if ($inventoryItem['category'] == 'product') {
                $productRepo = new ProductRepository($this->dbh);
                $product = $productRepo->getProduct($inventoryItem['inventory_id']);
                $inventoryItem['inventoryName'] = $product['product_name'];
            }
        }

        return $inventoryItems;
    }
}
