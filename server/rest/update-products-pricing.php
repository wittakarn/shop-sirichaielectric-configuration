<?php
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/ProductBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");

try {
    $business = new ProductBusiness();
    $params = json_decode($_POST['data'], true);
    $result = $business->updateProductsPricing($params['products']);
    echo json_encode(convertObjectToCamelCase($result));
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
