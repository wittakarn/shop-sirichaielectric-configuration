<?php
// This file expects the following variables to be set by the caller:
// $detailResults - array of quotation detail records
// $masterResult  - array with total_price, vat_price, net_price, promotion_type
// $profitMargin  - profit margin code
// $outputPath    - full file path to save the PDF (uses 'F' mode), or null to stream inline ('I' mode)

require_once(DOCUMENT_ROOT . 'server/library/tcpdf/tcpdf_config.php');
require_once(DOCUMENT_ROOT . 'server/library/tcpdf/tcpdf.php');
require_once(DOCUMENT_ROOT . 'server/report/QuotDetailPDF.php');
require_once(DOCUMENT_ROOT . 'server/business/ProductBusiness.php');

ob_start();
// create new PDF document
$pdf = new QuotDetailPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('SIRICHAIELECTRIC');
$pdf->SetTitle('Quotation detail');
$pdf->SetSubject('Quotation');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// add a page
$pdf->AddPage();

// print quotation detail table
$pdf->generateQuotationDetailTable($detailResults);

// print table footer
$pdf->generateQuotationDetailTableFooter(['name' => 'AI', 'contact' => '@350dekgu'], $masterResult);

// print all product images.
$imageCount = 0;
foreach ($detailResults as $detail) {
	if ($imageCount % 16 == 0) {
		// add a page
		$pdf->AddPage();
		$imageCount = 0;
	}

	if ($imageCount > 0 && $imageCount % 4 == 0) {
		$pdf->Ln(66, false);
	}

	$pdf->generateProductImageByProductId($detail["product_id"], $detail['sequence'], $detail['product_name']);
	$imageCount++;
}
// close and output PDF document
ob_end_clean();

if (isset($outputPath) && $outputPath) {
	$pdf->Output($outputPath, 'F');
} else {
	$pdf->Output('quotation-detail.pdf', 'I');
}
