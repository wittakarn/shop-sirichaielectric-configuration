<?php
ini_set('display_errors', 1);
session_start();
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/MenuGroupBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");
$business = new MenuGroupBusiness();
$results = $business->getMenuInformation($_GET['menuGroupNameDisplay'], $_GET['productGroupNameDisplay'], $_GET['productName']);
if($results) {
    $jsonString = json_encode(convertObjectsToCamelCase($results));
    echo $jsonString;
} else {
    echo null;
}