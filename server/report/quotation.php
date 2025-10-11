<?php
session_start();
ini_set('display_errors', 1); 
error_reporting(E_ALL);
require_once("../../config.php");
require_once(DOCUMENT_ROOT.'server/library/tcpdf/tcpdf_config.php');
require_once(DOCUMENT_ROOT.'server/library/tcpdf/tcpdf.php');
require_once(DOCUMENT_ROOT.'server/report/QuotDetailPDF.php');
require_once(DOCUMENT_ROOT.'server/business/UserBusiness.php');
require_once(DOCUMENT_ROOT.'server/business/CustomerBusiness.php');
require_once(DOCUMENT_ROOT.'server/business/ProductBusiness.php');
require_once(DOCUMENT_ROOT.'server/business/QuotationBusiness.php');

if (isset($_SESSION['user'])){
	try{
		$user = json_decode($_SESSION['user'], true);

		$userBusiness = new UserBusiness();
		$user = $userBusiness->getUser($user['email']);

		$quotBusiness = new QuotationBusiness();
		$quotation = $quotBusiness->getQuotation($_REQUEST['quotNo']);
		$masterResult = $quotation['quotMast'];
		$detailResults = $quotation['quotDetails'];

		$customerBusiness = new CustomerBusiness();
		$customerResult = $customerBusiness->getCustomer($masterResult['customer_id']);
		
		ob_start();
		// create new PDF document
		$pdf = new QuotDetailPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

		// set document information
		$pdf->SetCreator(PDF_CREATOR);
		$pdf->SetAuthor('Wittakarn Keeratichayakorn');
		$pdf->SetTitle('Quotation detail');
		$pdf->SetSubject('Quotation');

		// set default header data
		$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);

		// set header and footer fonts
		$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
		$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

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
		
		// print quotation master
		$pdf->generateQuotationMaster($customerResult, $masterResult);
		
		// print quotation detail table
		$pdf->generateQuotationDetailTable($detailResults);
		
		// print table footer
		$pdf->generateQuotationDetailTableFooter($user, $masterResult);
		
		// print all product images.
		$imageCount = 0;
		foreach($detailResults as $details) {
			// Use image from url instead
            /*
            $imageBlob = Product::getBlobImage($conn, $details['product_id']);
			$decodeImage = $imageBlob['image_blob'];
			if (!empty($decodeImage)){
				
				if($imageCount % 16 == 0){
					// add a page
					$pdf->AddPage();
					$imageCount = 0;
				}
				
				if($imageCount > 0 && $imageCount % 4 == 0){
					$pdf->Ln(64, false);
				}
				
				$pdf->generateProductImage($decodeImage, $details['sequence'], $details['product_name']);
				$imageCount++;
			}*/
			if($imageCount % 16 == 0){
				// add a page
				$pdf->AddPage();
				$imageCount = 0;
			}
			
			if($imageCount > 0 && $imageCount % 4 == 0){
				$pdf->Ln(66, false);
			}
			//echo $details["product_id"];
			//echo "<br/>";
			$pdf->generateProductImageByProductId($details["product_id"], $details['sequence'], $details['product_name']);
			$imageCount++;
        }
		// close and output PDF document
		ob_end_clean();
		$pdf->Output('quotation-detail.pdf', 'I');
	} catch (PDOException $e) {
		echo "Failed: " . $e->getMessage();
	}
	$conn = null;
}

?>
