<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ERROR | E_PARSE);
require_once "../config.php";
require_once DOCUMENT_ROOT . '/connection.php';
require_once DOCUMENT_ROOT . '/class/class.User.php';
require_once DOCUMENT_ROOT . '/class/class.Customer.php';
require_once DOCUMENT_ROOT . '/class/class.Product.php';
require_once DOCUMENT_ROOT . '/class/class.QuotMast.php';
require_once DOCUMENT_ROOT . '/class/class.QuotDetail.php';
require_once DOCUMENT_ROOT . '/report/class.QuotDetailPDF.php';
require_once DOCUMENT_ROOT . 'lib/tcpdf/tcpdf_config.php';
require_once DOCUMENT_ROOT . 'lib/tcpdf/tcpdf.php';

if (isset($_SESSION['user_id'])) {

    $conn = DataBaseConnection::createConnect();

    try {
        $user = User::get($conn, $_SESSION['user_id']);
        $masterResult = QuotMast::get($conn, $_REQUEST['quot_no']);
        $customerResult = Customer::get($conn, $masterResult['customer_id']);
        $detailResults = QuotDetail::getQuotationDetailAndCapitalPriceByQuotNo($conn, $_REQUEST['quot_no']);

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

        // print quotation master
        $pdf->generateQuotationMaster($customerResult, $masterResult);

        // print quotation detail table
        $pdf->generateQuotationDetailTable($detailResults);

        // print table footer
        $pdf->generateQuotationDetailTableFooter($user, $masterResult);

        // print all product images.
        $imageCount = 0;
        $paddingX = 0;
        $paddingY = 0;
        foreach ($detailResults as $details) {
            if ($imageCount % 16 == 0) {
                // add a page
                $pdf->AddPage();
                $imageCount = 0;
                $paddingX = 0;
                $paddingY = 0;
            }

            if ($imageCount > 0 && $imageCount % 4 == 0) {
                $paddingX = 0;
                $paddingY += 64;
                $pdf->Ln(64, false);
            }
            $pdf->generateProductImageByProductId($details["product_id"], $details['sequence'], $details['product_name'], $paddingX, $paddingY);
            $paddingX += 46;
            $imageCount++;
        }

		$pdfFileName = uniqid('quotation-');
        $pdfPath = REPORT_PATH . '/' . $pdfFileName . '.pdf';
        
        ob_end_clean();
        $pdf->Output($pdfPath, 'F');

        exec('gswin64c -dNOPAUSE -sDEVICE=jpeg -r300 -dJPEGQ=100 -sOutputFile=' . REPORT_PATH . '/' . $pdfFileName . '-%d.jpg ' . $pdfPath . ' -dBATCH');
        
        for ($x = 1; $x <= 10; $x++) {
            $imageName = $pdfFileName . '-' . $x . '.jpg';
            $imageFilePath = REPORT_PATH . '/' . $imageName;
            if(!file_exists($imageFilePath)) break;
            // Read image path, convert to base64 encoding
            $imageData = base64_encode(file_get_contents($imageFilePath));

            // Format the image SRC:  data:{mime};base64,{data};
            $src = 'data: image/jpg;base64,'.$imageData;

            // Echo out a sample image
            echo '<a href="' . $src . '" download="' . $imageName . '"><img src="' . $src . '"></a>';
        } 
    } catch (PDOException $e) {
        echo "Failed: " . $e->getMessage();
    }
    $conn = null;
}
