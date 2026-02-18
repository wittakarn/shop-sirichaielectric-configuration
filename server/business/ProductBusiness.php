<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'connection.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductInGroupRepository.php';
require_once DOCUMENT_ROOT . 'server/utils/File.php';
require_once DOCUMENT_ROOT . 'server/utils/String.php';

class ProductBusiness
{
    private $dbh;

    public function __construct()
    {
        $this->dbh = DataBaseConnection::createConnect();
    }

    public function getProducts($menuId, $productName)
    {
        $productRepo = new ProductRepository($this->dbh);
        $products = $productRepo->getProducts($menuId, $productName);
        return $products;
    }

    public function getProductOptions($productName)
    {
        $productRepo = new ProductRepository($this->dbh);
        $products = $productRepo->getProductOptions($productName);
        return $products;
    }

    public function searchProducts($productName, $size)
    {
        $productRepo = new ProductRepository($this->dbh);
        $products = $productRepo->searchProducts($productName, $size);
        return $products;
    }

    public function searchProductByDisplayName($displayName)
    {
        $productRepo = new ProductRepository($this->dbh);
        return $productRepo->searchProductByDisplayName($displayName);
    }

    public function getProduct($productId)
    {
        $productRepo = new ProductRepository($this->dbh);
        $product = $productRepo->getProduct($productId);
        return $product;
    }

    public function updateProduct($post, $files)
    {
        try {
            $this->dbh->beginTransaction();
            $params = json_decode($post['data'], true);

            $params['productNameDisplay'] = empty($params['productNameDisplay']) ? mapNameDisplay($params['productName']) : $params['productNameDisplay'];
            $params['productUrlName'] = empty($params['productUrlName']) ? mapUrlName($params['productName']) : mapUrlName($params['productUrlName']);

            $productImageFileName = null;
            if (isset($files['productImage'])) {
                $productImageFileName = writeFile(IMAGE_PATH . '/product/', $params['productUrlName'], $files['productImage']);
            }

            $specificationImageFileName = null;
            if (isset($files['specificationImage'])) {
                $specificationImageFileName = writeFile(IMAGE_PATH . '/specification/', $params['productUrlName'] . '-specification', $files['specificationImage']);
            }

            $specificationPdfFileName = null;
            if (isset($files['specificationPdf'])) {
                $specificationPdfFileName = writeFile(PDF_PATH . '/specification/', $params['productUrlName'] . '-specification', $files['specificationPdf']);
            }

            $productRepo = new ProductRepository($this->dbh);
            $productRepo->update($params, $productImageFileName, $specificationImageFileName, $specificationPdfFileName);

            $this->dbh->commit();

            $result['status'] = 'success';
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
        $this->dbh = null;
    }

    public function updateProducts($params)
    {
        $createCount = 0;
        $updateCount = 0;

        try {
            $this->dbh->beginTransaction();
            $productRepo = new ProductRepository($this->dbh);
            foreach ($params as $param) {
                $currentProduct = $this->getProduct($param['productId']);
                if ($currentProduct == null || $currentProduct == false) {
                    $param['productNameDisplay'] = mapNameDisplay($param['productName']);
                    $param['productUrlName'] = mapUrlName($param['productName']);

                    $productRepo->createProduct($param);
                    $createCount++;
                } else {
                    if (is_null($currentProduct['product_name_display'])) {
                        $param['productNameDisplay'] = mapNameDisplay($param['productName']);
                    } else {
                        $param['productNameDisplay'] = $currentProduct['product_name_display'];
                    }

                    if (is_null($currentProduct['product_url_name'])) {
                        $param['productUrlName'] = mapUrlName($param['productName']);
                    } else {
                        $param['productUrlName'] = $currentProduct['product_url_name'];
                    }

                    $productRepo->updateProduct($param);
                    $updateCount++;
                }
            }
            $this->dbh->commit();
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }

        return "Finish update product size: " . $updateCount . ", create product size: " . $createCount;
    }

    public function recoveryAllProductsName()
    {
        try {
            $this->dbh->beginTransaction();
            $productRepo = new ProductRepository($this->dbh);

            $availableProducts = $productRepo->getUnAvailableProducts();

            foreach ($availableProducts as $availableProduct) {
                $productNameDisplay = $availableProduct['product_name_display'] ? $availableProduct['product_name_display'] : mapNameDisplay($availableProduct['product_name']);
                $productUrlName = $availableProduct['product_url_name'] ? $availableProduct['product_url_name'] : mapUrlName($availableProduct['product_name']);
                $productRepo->updateProductDisplay($availableProduct['product_id'], $productNameDisplay, $productUrlName);
            }
            $this->dbh->commit();
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }

        return "Finish recovery product_name_display and product_url_name of all products";
    }

    public function updateProductsDisplay($products)
    {
        try {
            $this->dbh->beginTransaction();
            $productRepo = new ProductRepository($this->dbh);

            foreach ($products as $product) {
                $productNameDisplay = removeMultipleSpaceWithOneSpace($product['productNameDisplay']);
                $productUrlName = mapUrlName($productNameDisplay);
                $productRepo->updateProductDisplay($product['productId'], $productNameDisplay, $productUrlName);
            }
            $this->dbh->commit();
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }

        return $products;
    }

    public function updateProductsPricing($products)
    {
        $updatedCount = 0;
        $failedProducts = [];

        try {
            $this->dbh->beginTransaction();
            $productRepo = new ProductRepository($this->dbh);

            foreach ($products as $product) {
                try {
                    if (!isset($product['productId'])) {
                        $failedProducts[] = [
                            'product' => $product,
                            'error' => 'Missing productId'
                        ];
                        continue;
                    }

                    $currentProduct = $this->getProduct($product['productId']);
                    if ($currentProduct == null || $currentProduct == false) {
                        $failedProducts[] = [
                            'productId' => $product['productId'],
                            'error' => 'Product not found'
                        ];
                        continue;
                    }

                    $productRepo->updateProductPricing($product['productId'], $product);
                    $updatedCount++;
                } catch (Exception $e) {
                    $failedProducts[] = [
                        'productId' => $product['productId'] ? $product['productId'] : 'unknown',
                        'error' => $e->getMessage()
                    ];
                }
            }

            $this->dbh->commit();

            return [
                'status' => 'success',
                'updatedCount' => $updatedCount,
                'totalCount' => count($products),
                'failedProducts' => $failedProducts
            ];
        } catch (Exception $e) {
            $this->dbh->rollBack();
            throw new Exception("Failed to update products pricing: " . $e->getMessage());
        }
    }
}
