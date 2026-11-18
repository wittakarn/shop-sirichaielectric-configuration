<?php
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'server/business/ProductBusiness.php';
require_once DOCUMENT_ROOT . 'server/business/QuotationBusiness.php';
require_once DOCUMENT_ROOT . 'server/utils/String.php';

header('Content-Type: application/json; charset=utf-8');

// Machine-to-machine: only the chatbot may call this (QUOTATION_TOKEN lives in config.php).
if (!hash_equals(QUOTATION_TOKEN, $_SERVER['HTTP_X_QUOTATION_TOKEN'] ?? '')) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

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
    // Contact note from the AI caller, e.g. Line ID or phone number.
    $remark = isset($input['remark']) && is_string($input['remark']) ? mb_substr(trim($input['remark']), 0, 500) : null;

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

    // Save to quot_mast / quot_detail (no customer; contact lives in remark).
    $quotationBusiness = new QuotationBusiness();
    $created = $quotationBusiness->createQuotation([
        'email' => 'AI',
        'remark' => $remark ?: null,
        'totalPrice' => $totalPrice,
        'vatPrice' => $vatPrice,
        'summedPrice' => $netPrice,
        'productsInQuotation' => array_map(function ($d) {
            return [
                'product' => [
                    'productId' => $d['product_id'],
                    'productName' => $d['product_name'],
                    'unitName' => $d['unit_name'],
                    'capitalPrice' => $d['capital_price'],
                ],
                'productAmount' => $d['quantity'],
                'productPrice' => $d['price'],
                'summedProductPrice' => $d['summary_price'],
            ];
        }, $detailResults),
    ]);
    $quotNo = $created['quotNo'];

    // Generate PDF
    $tempDir = DOCUMENT_ROOT . 'server/report/temp/';
    if (!is_dir($tempDir)) {
        mkdir($tempDir, 0755, true);
    }

    $filename = 'fast-quot-' . time() . '-' . mt_rand(1000, 9999) . '.pdf';
    $outputPath = $tempDir . $filename;

    require(DOCUMENT_ROOT . 'server/report/fast-quotation.php');

    $pdfUrl = WEB_ROOT . 'server/report/temp/' . $filename;
    echo json_encode(['quotNo' => $quotNo, 'pdfUrl' => $pdfUrl]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
