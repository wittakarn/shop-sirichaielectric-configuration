<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'server/business/CustomerBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $params = json_decode($_POST['data'], true);
    $customerBusiness = new CustomerBusiness();
    $result = $customerBusiness->createCustomer($params);
    echo json_encode(convertObjectsToCamelCase($result));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode($e->getMessage());
}
