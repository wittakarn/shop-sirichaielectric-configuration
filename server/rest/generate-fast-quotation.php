<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'server/business/ProductBusiness.php';
require_once DOCUMENT_ROOT . 'server/utils/String.php';

header('Content-Type: application/json; charset=utf-8');

$validPriceTypes = ['standard', 'capital', 'ss', 's', 'a', 'b', 'c', 'vb', 'vc', 'd', 'e', 'f'];
$noVatPriceTypes = ['a', 'b', 'c', 'd'];

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['quotaDetail']) || !isset($input['priceType'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields: quotaDetail and priceType']);
        exit;
    }

    $quotaDetail = $input['quotaDetail'];
    $priceType = $input['priceType'];

    if (!in_array($priceType, $validPriceTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid priceType. Must be one of: ' . implode(', ', $validPriceTypes)]);
        exit;
    }

    $priceField = $priceType . '_price';
    $productBusiness = new ProductBusiness();
    $detailResults = [];
    $totalPrice = 0;
    $sequence = 1;

    foreach ($quotaDetail as $item) {
        $productName = $item['productName'];
        $amount = floatval($item['amount']);

        $product = $productBusiness->searchProductByDisplayName($productName);

        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found: ' . $productName]);
            exit;
        }
        $unitPrice = floatval($product[$priceField]);
        $summaryPrice = $unitPrice * $amount;
        $totalPrice += $summaryPrice;

        $detailResults[] = [
            'product_id' => $product['product_id'],
            'product_name' => $product['product_name_display'] ?: $product['product_name'],
            'sequence' => $sequence,
            'quantity' => $amount,
            'unit_name' => $product['unit_name'],
            'price' => $unitPrice,
            'summary_price' => $summaryPrice,
            'capital_price' => floatval($product['capital_price']),
            'product' => $product,
        ];
        $sequence++;
    }

    // VAT logic: priceType a,b,c,d => no VAT, otherwise 7%
    $vatPrice = 0;
    if (!in_array($priceType, $noVatPriceTypes)) {
        $vatPrice = round($totalPrice * THAI_VAT / 100, 2);
    }
    $netPrice = $totalPrice + $vatPrice;

    $masterResult = [
        'total_price' => $totalPrice,
        'vat_price' => $vatPrice,
        'net_price' => $netPrice,
        'promotion_type' => 'N',
    ];
    $profitMargin = '';

    // Generate PDF
    $tempDir = DOCUMENT_ROOT . 'server/report/temp/';
    if (!is_dir($tempDir)) {
        mkdir($tempDir, 0755, true);
    }

    $filename = 'fast-quot-' . time() . '-' . mt_rand(1000, 9999) . '.pdf';
    $outputPath = $tempDir . $filename;

    require(DOCUMENT_ROOT . 'server/report/fast-quotation.php');

    $pdfUrl = WEB_ROOT . 'server/report/temp/' . $filename;
    echo json_encode(['pdfUrl' => $pdfUrl]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
