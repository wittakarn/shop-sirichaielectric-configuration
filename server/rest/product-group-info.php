<?php
ini_set('display_errors', 1);
session_start();
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/ProductGroupBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");
$business = new ProductGroupBusiness();
$result = $business->getProductGroup($_GET['groupId']);
if($result) {
    $jsonString = json_encode(convertObjectsToCamelCase($result));
    echo $jsonString;
} else {
    echo null;
}