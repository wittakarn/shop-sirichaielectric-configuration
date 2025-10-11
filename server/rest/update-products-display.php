<?php
// foreach ($_POST as $key => $value) {
//     echo "Field " . htmlspecialchars($key) . " is " . htmlspecialchars($value) . "<br>";
// }

// foreach ($_FILES as $attrName => $valuesArray) {
//     foreach ($valuesArray as $key => $value) {
//         echo "File " . $attrName . " is " . $value . "<br>";
//     }
// }

ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/ProductBusiness.php';

header("Content-Type: application/json; charset=utf-8");
$business = new ProductBusiness();
$params = json_decode($_POST['data'], true);
$result = $business->updateProductsDisplay($params['products']);
echo json_encode(convertObjectsToCamelCase($result));
