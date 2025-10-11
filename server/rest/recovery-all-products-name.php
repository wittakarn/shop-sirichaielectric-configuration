<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/ProductBusiness.php';

header("Content-Type: application/json; charset=utf-8");
$response = array();
$business = new ProductBusiness();
echo $business->recoveryAllProductsName();