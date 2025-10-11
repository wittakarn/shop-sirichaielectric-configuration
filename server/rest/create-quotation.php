<?php
ini_set('display_errors', 1);
session_start();
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'server/business/QuotationBusiness.php';
require_once DOCUMENT_ROOT.'server/utils/String.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $user = json_decode($_SESSION['user'], true);
    $params = json_decode($_POST['data'], true);
    $params['email'] = $user['email'];
    $quotationBusiness = new QuotationBusiness();
    $result = $quotationBusiness->createQuotation($params);
    echo json_encode(convertObjectsToCamelCase($result));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode($e->getMessage());
}
