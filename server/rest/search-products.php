<?php
ini_set('display_errors', 1);
session_start();
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'server/business/ProductBusiness.php';
require_once DOCUMENT_ROOT . 'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");
$business = new ProductBusiness();
$result = $business->searchProducts($_GET['productName'], $_GET['size']);
if ($result) {
    $jsonString = json_encode(convertObjectsToCamelCase($result), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
    echo $jsonString;
} else {
    echo null;
}
