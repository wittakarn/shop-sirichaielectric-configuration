<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/MenuGroupBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header("Content-Type: application/json; charset=utf-8");
$business = new MenuGroupBusiness();
$params = json_decode($_POST['data'], true);
$result = $business->updateMenuGroup($params, $_FILES);
echo json_encode(convertObjectsToCamelCase($result));
