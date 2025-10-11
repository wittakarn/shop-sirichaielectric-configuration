<?php
ini_set('display_errors', 1);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/QuotationBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");
$business = new QuotationBusiness();
$result = $business->getPricesFromQuotationInThePast($_GET['customerId'], $_GET['productId'], $_GET['limit']);
if($result) {
    $jsonString = json_encode(convertObjectsToCamelCase($result), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
    echo $jsonString;
} else {
    echo null;
}