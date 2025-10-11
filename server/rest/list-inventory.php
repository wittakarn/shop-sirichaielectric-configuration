<?php
ini_set('display_errors', 1);
session_start();
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/MenuGroupBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");
$business = new MenuGroupBusiness();
$result = $business->getAssignedInventoryItems($_GET['id']);
if($result) {
    $jsonString = json_encode(convertObjectsToCamelCase($result));
    echo $jsonString;
} else {
    echo null;
}