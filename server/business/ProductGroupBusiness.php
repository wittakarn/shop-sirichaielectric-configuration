<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'connection.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductGroupRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductInGroupRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductGroupImageRepository.php';
require_once DOCUMENT_ROOT . 'server/utils/File.php';
require_once DOCUMENT_ROOT . 'server/utils/String.php';

class ProductGroupBusiness
{
    private $dbh;

    public function __construct()
    {
        $this->dbh = DataBaseConnection::createConnect();
    }

    public function createProductGroup($params, $files)
    {
        try {
            $this->dbh->beginTransaction();
            $params['groupNameSearch'] = empty($params['groupNameSearch']) ? mapUrlName($params['groupNameDisplay']) : $params['groupNameSearch'];

            $groupImageFileName = null;
            if (isset($files['productGroupImage'])) {
                $groupImageFileName = writeFile(IMAGE_PATH . '/product-group/', $params['groupNameSearch'], $files['productGroupImage']);
            }

            $groupSpecImageNames = [];
            if (isset($files['groupSpecImages']) && !empty($files['groupSpecImages']['name'][0])) {
                $uploadedFiles = $files['groupSpecImages'];
                foreach ($uploadedFiles['name'] as $index => $name) {
                    $fileArray = [
                        'name' => $uploadedFiles['name'][$index],
                        'type' => $uploadedFiles['type'][$index],
                        'tmp_name' => $uploadedFiles['tmp_name'][$index],
                        'error' => $uploadedFiles['error'][$index],
                        'size' => $uploadedFiles['size'][$index],
                    ];
                    $groupSpecImageNames[] = writeFile(IMAGE_PATH . '/specification-group/', $params['groupNameSearch'] . '-specification-' . ($index + 1), $fileArray);
                }
            }

            $productGroupRepo = new ProductGroupRepository($this->dbh);
            $groupId = $productGroupRepo->createProductGroup($params, $groupImageFileName);

            // Save group spec images to product_group_image table
            if (!empty($groupSpecImageNames)) {
                $groupImageRepo = new ProductGroupImageRepository($this->dbh);

                foreach ($groupSpecImageNames as $sequence => $fileName) {
                    $groupImageRepo->insert($groupId, $sequence + 1, 'SPEC', $fileName);
                }
            }

            $productInGroupRepository = new ProductInGroupRepository($this->dbh);
            $totalProductInGroup = count($params['productIds']);
            foreach ($params['productIds'] as $index => $productId) {
                $productInGroupRepository->assignProductToGroup($groupId, $productId);

                if (isset($files['productDefaultImage'])) {
                    self::updateProductImage($productId, $files['productDefaultImage'], $index != $totalProductInGroup - 1);
                }
            }

            $this->dbh->commit();

            $result['createdId'] = $groupId;
            $result['status'] = 'success';
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function updateProductGroup($params, $files)
    {
        try {
            $this->dbh->beginTransaction();
            $params['groupNameSearch'] = empty($params['groupNameSearch']) ? mapUrlName($params['groupNameDisplay']) : $params['groupNameSearch'];

            $groupImageFileName = null;
            if (isset($files['productGroupImage'])) {
                $groupImageFileName = writeFile(IMAGE_PATH . '/product-group/', $params['groupNameSearch'], $files['productGroupImage']);
            }

            $groupSpecImageNames = [];
            if (isset($files['groupSpecImages'])) {
                $uploadedFiles = $files['groupSpecImages'];
                foreach ($uploadedFiles['name'] as $index => $name) {
                    $fileArray = [
                        'name' => $uploadedFiles['name'][$index],
                        'type' => $uploadedFiles['type'][$index],
                        'tmp_name' => $uploadedFiles['tmp_name'][$index],
                        'error' => $uploadedFiles['error'][$index],
                        'size' => $uploadedFiles['size'][$index],
                    ];
                    $groupSpecImageNames[] = writeFile(IMAGE_PATH . '/specification-group/', $params['groupNameSearch'] . '-specification-' . ($index + 1), $fileArray);
                }
            }

            $productGroupRepo = new ProductGroupRepository($this->dbh);
            $productGroupRepo->updateProductGroup($params, $groupImageFileName);

            $groupImageRepo = new ProductGroupImageRepository($this->dbh);
            // Delete existing SPEC images for this product_group
            $groupImageRepo->deleteByGroupIdAndType($params['groupId'], 'SPEC');
            // Save group spec images to product_group_image table
            if (!empty($groupSpecImageNames)) {

                foreach ($groupSpecImageNames as $sequence => $fileName) {
                    $groupImageRepo->insert($params['groupId'], $sequence + 1, 'SPEC', $fileName);
                }
            }

            $productInGroupRepository = new ProductInGroupRepository($this->dbh);
            $productInGroupRepository->removeAssignedProductToGroup($params['groupId']);

            $totalProductInGroup = count($params['productIds']);
            foreach ($params['productIds'] as $index => $productId) {
                $productInGroupRepository->assignProductToGroup($params['groupId'], $productId);

                if (isset($files['productDefaultImage'])) {
                    self::updateProductImage($productId, $files['productDefaultImage'], $index != $totalProductInGroup - 1);
                }
            }

            $this->dbh->commit();

            $result['updatedId'] = $params['groupId'];
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function deleteProductGroup($groupId)
    {
        try {
            $this->dbh->beginTransaction();

            $productGroupRepo = new ProductGroupRepository($this->dbh);
            $productGroupRepo->deleteProductGroup($groupId);

            $this->dbh->commit();

            $result['deletedId'] = $groupId;
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
    }

    private function updateProductImage($productId, $imageFile, $isLastProductInGroup)
    {
        $productRepo = new ProductRepository($this->dbh);
        $product = $productRepo->getProduct($productId);
        $imageName = empty($product['product_url_name']) ? mapUrlName($product['product_name']) : $product['product_url_name'];

        if ($isLastProductInGroup) {
            $productImageFileName = writeFileWithoutMove(IMAGE_PATH . '/product/', $imageName, $imageFile);
        } else {
            $productImageFileName = writeFile(IMAGE_PATH . '/product/', $imageName, $imageFile);
        }
        $productRepo->updateProductImage($productId, $productImageFileName, $productImageFileName);
    }

    public function getProductGroups($productId, $groupNameDisplay)
    {
        $productGroupRepository = new ProductGroupRepository($this->dbh);
        return $productGroupRepository->getProductGroups($productId, $groupNameDisplay);
    }

    public function getProductGroup($groupId)
    {
        $productGroupRepository = new ProductGroupRepository($this->dbh);
        $result['productGroup'] = $productGroupRepository->getProductGroup($groupId);

        // Fetch images for the group
        $groupImageRepo = new ProductGroupImageRepository($this->dbh);
        $result['productGroup']['images'] = $groupImageRepo->getByGroupId($groupId);

        $productInGroupRepository = new ProductInGroupRepository($this->dbh);
        $result['products'] = $productInGroupRepository->getAssignedProducts($groupId);

        return $result;
    }

    public function getAllProductGroups()
    {
        $productGroupRepository = new ProductGroupRepository($this->dbh);
        return $productGroupRepository->getAllProductGroups();
    }
}
