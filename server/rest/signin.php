<?php
ini_set('display_errors', 1);
session_start();
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/UserBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");
$business = new UserBusiness();
$result = $business->verifySignin($_POST);
if($result) {
    $jsonString = json_encode(convertObjectsToCamelCase($result));
    $_SESSION['user'] = $jsonString;
    echo $jsonString;
} else {
    echo null;
}