<?php
// extend TCPF columnWidthith custom functions
class QuotDetailPDF extends TCPDF
{

	public $columnWidth = array(9, 11, 86, 17, 10, 18, 30);

	//Page header
	public function Header()
	{
		// Logo
		$image_file = K_PATH_IMAGES . 'te-logo.jpg';
		$this->Image($image_file, PDF_MARGIN_LEFT, 8, 115, '', 'JPEG', '', 'T', false, 300, '', false, false, 0, false, false, false);
		// Set font
		$this->SetFont('', 'B', 20);
		// Title
		$this->Cell(0, 16, 'ใบเสนอราคา', 0, 2, 'R', 0, '', 0, false, 'M', 'B');
	}

	// Page footer
	public function Footer()
	{
		// Position at 15 mm from bottom
		$this->SetY(-10);
		// Set font
		$this->SetFont('', 'I', 8);
		// Page number
		$this->Cell(0, 10, 'หน้า ' . $this->getAliasNumPage() . '/' . $this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
	}

	public function generateQuotationMaster($customerData, $quotMast)
	{

		$this->SetFont('', '', 14);
		$customerDetailheight = 4;
		$customerDetailBorder = 0;
		$customerDetailColumnHeight = 5;
		$isAddYourRef = false;
		$isAddDate = false;
		$strDate = $quotMast['date'];

		$this->MultiCell(30, 12, 'นามลูกค้า' . "\n" . 'CUSTOMER', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
		$this->MultiCell(100, 12, $customerData['customer_name'], $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
		$customerDetailheight = $customerDetailheight + 12;
		$this->MultiCell(8, 12, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
		$this->MultiCell(12, 12, 'เลขที่', $customerDetailBorder, 'R', 0, 0, '', '', true, 0);
		$this->MultiCell(25, 12, '.....' . $quotMast['quot_no'] . '.....', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
		$this->Ln();

		$customerAddress = $customerData['address'];

		$customerAddressHeight = $customerDetailColumnHeight;

		$customerAddressHeight = $customerAddressHeight * 2.5;
		$this->MultiCell(30, $customerAddressHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
		$this->MultiCell(100, $customerAddressHeight, strlen($customerAddress) == 0 ? '' : $customerAddress, $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
		$customerDetailheight = $customerDetailheight + $customerAddressHeight;

		if (!$isAddYourRef) {
			$this->MultiCell(8, $customerAddressHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$this->MultiCell(12, $customerAddressHeight, 'อ้างถึง', $customerDetailBorder, 'R', 0, 0, '', '', true, 0);
			$this->MultiCell(25, $customerAddressHeight, '.........................', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$isAddYourRef = true;
		}

		$this->Ln();

		$customerTel = $customerData['tel'];
		if ($customerTel != null && $customerTel != '') {
			$this->MultiCell(30, $customerDetailColumnHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$this->MultiCell(100, $customerDetailColumnHeight, 'โทรศัพท์ : ' . $customerTel, $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$customerDetailheight = $customerDetailheight + $customerDetailColumnHeight;

			$this->printRefAndDate($strDate, $isAddYourRef, $isAddDate, $customerDetailColumnHeight, $customerDetailBorder);

			$this->Ln();
		}

		$customerFax = $customerData['fax'];
		if ($customerFax != null && $customerFax != '') {
			$this->MultiCell(30, $customerDetailColumnHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$this->MultiCell(100, $customerDetailColumnHeight, 'โทรสาร : ' . $customerFax, $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$customerDetailheight = $customerDetailheight + $customerDetailColumnHeight;

			$this->printRefAndDate($strDate, $isAddYourRef, $isAddDate, $customerDetailColumnHeight, $customerDetailBorder);

			$this->Ln();
		}

		$customerContact = $customerData['contact'];
		if ($customerContact != null && $customerContact != '') {
			$this->MultiCell(30, $customerDetailColumnHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$this->MultiCell(100, $customerDetailColumnHeight, $customerContact, $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$customerDetailheight = $customerDetailheight + $customerDetailColumnHeight;

			$this->printRefAndDate($strDate, $isAddYourRef, $isAddDate, $customerDetailColumnHeight, $customerDetailBorder);

			$this->Ln();
		}

		$customerEmail = $customerData['email'];
		if ($customerEmail != null && $customerEmail != '') {
			$this->MultiCell(30, $customerDetailColumnHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$this->MultiCell(100, $customerDetailColumnHeight, $customerEmail, $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$customerDetailheight = $customerDetailheight + $customerDetailColumnHeight;

			$this->printRefAndDate($strDate, $isAddYourRef, $isAddDate, $customerDetailColumnHeight, $customerDetailBorder);

			$this->Ln();
		}

		if($customerDetailheight < 35) {
			$this->Ln();
		}

		// add rectangle
		$this->RoundedRect(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, 130, $customerDetailheight, 3.50, '1111');
	}

	// Colored table
	public function generateQuotationDetailTable($data)
	{
		$rowLimit = 25;
		// Colors, line columnWidthidth and bold font
		//$this->SetFillColor(255, 0, 0);
		//$this->SetTextColor(255);
		//$this->SetDracolumnWidthColor(128, 0, 0);
		$this->SetLineWidth(0.3);
		$this->SetFont('', 'B', 12);

		// Header
		// MultiCell($columnWidth, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)
		$this->MultiCell($this->columnWidth[0], 7, 'ลำดับ' . "\n" . 'ITEM', 1, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[1], 7, 'รหัส' . "\n" . 'ID', 1, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[2], 7, 'รายการ' . "\n" . 'DESCRIPTION', 1, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[3], 7, 'จำนวน' . "\n" . 'QUANTITY', 1, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[4], 7, 'หน่วย' . "\n" . 'UNIT', 1, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[5], 7, 'ราคา/หน่วย' . "\n" . 'UNIT PRICE', 1, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[6], 7, 'รวมเงิน' . "\n" . 'AMOUNT', 1, 'C', 0, 0, '', '', true, 0);

		$this->Ln();
		// Color and font restoration
		$this->SetFillColor(245, 205, 188);
		//$this->SetTextColor(0);
		$this->SetFont('', '', 12.3);
		// Data
		$fill = 0;

		$productBusiness = new ProductBusiness();

		foreach ($data as $quotDetail) {
			$product = $productBusiness->getProduct($quotDetail['product_id']);

			if ($rowLimit == 0) {
				$this->AddPage();
				$rowLimit = 25;
				$borderStyle = 'TLRB';
			} else {
				$borderStyle = 'LRB';
			}

			$productName = self::removeBlanket($quotDetail['product_name']);

			$adjustHeight = $this->getStringHeight($this->columnWidth[2], $productName);
			if ($quotDetail['capital_price'] != null && $quotDetail['capital_price'] > 0 && $quotDetail['price'] < $quotDetail['capital_price']) {
				$fill = 1;
			}

			$this->MultiCell($this->columnWidth[0], $adjustHeight, $quotDetail['sequence'], $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[1], $adjustHeight, $quotDetail['product_id'], $borderStyle, 'R', $fill, 0, '', '', true, 0);

			$productUrl = "<a style=\"color: black;text-decoration: none;\" href=\"" . self::generateProductImageUrl($product['product_url_name']) . "\">" . $productName . "</a>";
			$this->MultiCell($this->columnWidth[2], $adjustHeight, $productUrl, $borderStyle, 'L', $fill, 0, '', '', true, 0, true);
			$this->MultiCell($this->columnWidth[3], $adjustHeight, number_format($quotDetail['quantity'], 1), $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[4], $adjustHeight, $quotDetail['unit_name'], $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[5], $adjustHeight, number_format($quotDetail['price'], 2), $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[6], $adjustHeight, number_format($quotDetail['summary_price'], 2), $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->Ln();
			$rowLimit--;

			if ($fill = 1) {
				$fill = 0;
			}
			
			if ($this->checkPageBreak()) {
				$this->Ln();
			}
		}

		$defaultHeight = 4;

		while ($rowLimit > 0) {
			$this->MultiCell($this->columnWidth[0], $defaultHeight, '', $borderStyle, 'L', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[1], $defaultHeight, '', $borderStyle, 'L', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[2], $defaultHeight, '', $borderStyle, 'L', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[3], $defaultHeight, '', $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[4], $defaultHeight, '', $borderStyle, 'L', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[5], $defaultHeight, '', $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->MultiCell($this->columnWidth[6], $defaultHeight, '', $borderStyle, 'R', $fill, 0, '', '', true, 0);
			$this->Ln();
			$rowLimit--;
			
			if ($this->checkPageBreak()) {
				$this->Ln();
			}
		}


		//$this->Cell(array_sum($this->columnWidth), 0, '', 'T');
	}

	public function generateQuotationDetailTableFooter($user, $footerData)
	{
		$columnWidth = 5;
		$this->SetFont('', 'B', 11);
		$this->MultiCell($this->columnWidth[0], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[1], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[2], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[3], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[4], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[5], $columnWidth, 'จำนวนเงิน', 0, 'R', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[6], $columnWidth, number_format($footerData['total_price'], 2), 'LRB', 'R', 0, 0, '', '', true, 0);
		$this->Ln();

		$this->MultiCell($this->columnWidth[0] + $this->columnWidth[1] + $this->columnWidth[2] + $this->columnWidth[3] + $this->columnWidth[4], $columnWidth, '- ใบเสนอราคานี้ไม่ยืนราคา ก่อนสั่งสินค้ารบกวนเช็คสินค้า และราคาสินค้าใหม่ก่อนสั่งทุกครั้ง', 0, 'L', 0, 0, '', '', true, 0);

		$this->SetFont('', 'B', 11);
		$vatLabel = "";
		$vatValue = "";
		if ($footerData['vat_price'] > 0) {
			$vatLabel = 'VAT ' . THAI_VAT . ' %';
			$vatValue = number_format($footerData['vat_price'], 2);
		}

		$this->MultiCell($this->columnWidth[5], $columnWidth, $vatLabel, 0, 'R', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[6], $columnWidth, $vatValue, 'LRB', 'R', 0, 0, '', '', true, 0);
		$this->Ln();

		$this->MultiCell($this->columnWidth[0] + $this->columnWidth[1] + $this->columnWidth[2], $columnWidth, '- สินค้าสั่งพิเศษ, สายไฟสั่งตัด รบกวนโอนเงินก่อน และไม่สามารถเปลี่ยนหรือคืนเงินหรือสินค้าได้', 0, 'L', 0, 0, '', '', true, 0);
		
		$this->SetFont('', 'B', 15);
		$this->MultiCell($this->columnWidth[3] + $this->columnWidth[4] + $this->columnWidth[5], $columnWidth, 'รวมจำนวนเงิน(บาท)', 0, 'R', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[6], $columnWidth, number_format($footerData['net_price'], 2), 'LRB', 'R', 0, 0, '', '', true, 0);
		$this->Ln();

		$this->SetFont('', 'B', 11);
		$this->MultiCell($this->columnWidth[0] + $this->columnWidth[1] + $this->columnWidth[2], $columnWidth, '- ก่อนชำระเงินค่าสินค้า รบกวนให้ทางร้านตรวจสอบราคาและเช็คสินค้าก่อนทุกครั้ง', 0, 'L', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[3] + $this->columnWidth[4] + $this->columnWidth[5] + $this->columnWidth[6], $columnWidth, 'เสนอโดย ' . $user["name"], 0, 'R', 0, 0, '', '', true, 0);
		$this->Ln();

		$this->SetFont('', '', 11);
		if ($footerData['promotion_type'] == 'N') {
			$this->MultiCell($this->columnWidth[0] + $this->columnWidth[1] + $this->columnWidth[2], $columnWidth, '............................................................................................................................', 0, 'L', 0, 0, '', '', true, 0);
		} else {
			$this->MultiCell($this->columnWidth[0] + $this->columnWidth[1] + $this->columnWidth[2], $columnWidth, '**สินค้าส่วนลดพิเศษไม่ยืนราคา ต้องเช็คสต๊อกสินค้าก่อนสั่งซื้อทุกครั้ง..............', 0, 'L', 0, 0, '', '', true, 0);
		}
		$this->MultiCell($this->columnWidth[3] + $this->columnWidth[4] + $this->columnWidth[5] + $this->columnWidth[6], $columnWidth, 'ติดต่อ ' . $user["contact"], 0, 'R', 0, 0, '', '', true, 0);

		$this->Ln();
		$this->Cell(array_sum($this->columnWidth), 0, '', 'T');
		$this->Ln(0.3, false);
		$this->SetFont('', 'B', 13);
		$this->MultiCell($this->columnWidth[0], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[1], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[2], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[3], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[4], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[5] + $this->columnWidth[6], $columnWidth, 'บจ.ธนพรอิเล็คทริค', 0, 'L', 0, 0, '', '', true, 0);
		$this->Ln();
		$this->MultiCell($this->columnWidth[0], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[1], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[2], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[3], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[4], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[5] + $this->columnWidth[6], $columnWidth, 'TanapondElectric Co,Ltd.', 0, 'L', 0, 0, '', '', true, 0);
		$this->Ln();
		$this->MultiCell($this->columnWidth[0], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[1], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[2], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[3], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		$this->MultiCell($this->columnWidth[4], $columnWidth, '', 0, 'C', 0, 0, '', '', true, 0);
		//$this->MultiCell($this->columnWidth[4] + $this->columnWidth[5], $columnWidth, 'By : ', 0, 'L', 0, 0, '', '', true, 0);
	}

	public function generateProductImage($img, $productSequence, $productName, $paddingX, $paddingY)
	{
		$imageSquareWidth = 44;
		$descriptionHeight = 12;
		$positionX = PDF_MARGIN_LEFT + $paddingX;
		$positionY = PDF_MARGIN_TOP + $descriptionHeight + $paddingY;
		$this->MultiCell($imageSquareWidth, $descriptionHeight, $productSequence . ') ' . $productName, 1, 'L', 0, 0, '', '', true, 0);
		$this->MultiCell(2, $descriptionHeight, '', 0, 'L', 0, 0, '', '', true, 0);
		//echo $positionX.'/'.$positionY.',';
		$this->Image('@' . $img, $positionX, $positionY, $imageSquareWidth, $imageSquareWidth, '', '', '', false, 300, '', false, false, 0, false, false, false);
	}

	public function generateProductImageByProductId($id, $productSequence, $productName)
	{
		$imageSquareWidth = 44;
		$imageSquareHeight = 44;
		$imageDesc = $productSequence . ') ' . self::removeBlanket($productName);
		$descriptionHeight = 12;
		$positionX = $this->GetX();
		$positionY = $descriptionHeight + $this->GetY();
		$this->MultiCell($imageSquareWidth, $descriptionHeight, $imageDesc, 1, 'L', 0, 0, '', '', true, 0);
		$this->MultiCell(2, $descriptionHeight, '', 0, 'L', 0, 0, '', '', true, 0);
		//echo $positionX.'/'.$positionY.',';
		try {
			$imageUrl = "https://shop.sirichaielectric.com/services/product-image.php?productId=" . $id;
			$this->Image($imageUrl, $positionX, $positionY, $imageSquareWidth, $imageSquareHeight, '', '', '', false, 300, '', false, false, 1, false, false, false);
		} catch (Exception $e) {
			print_r($e);
		}
	}

	public function printRefAndDate($strDate, &$isAddYourRef, &$isAddDate, $customerDetailColumnHeight, $customerDetailBorder)
	{
		if (!$isAddYourRef) {
			$this->MultiCell(8, $customerDetailColumnHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$this->MultiCell(12, $customerDetailColumnHeight, 'อ้างถึง', $customerDetailBorder, 'R', 0, 0, '', '', true, 0);
			$this->MultiCell(25, $customerDetailColumnHeight, '.........................', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$isAddYourRef = true;
		}

		if ($isAddYourRef && !$isAddDate) {
			$this->MultiCell(8, $customerDetailColumnHeight, '', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$this->MultiCell(12, $customerDetailColumnHeight, 'วันที่', $customerDetailBorder, 'R', 0, 0, '', '', true, 0);
			$this->MultiCell(25, $customerDetailColumnHeight, '..' . self::formatDateThai($strDate) . '..', $customerDetailBorder, 'L', 0, 0, '', '', true, 0);
			$isAddDate = true;
		}
	}

	public static function formatDateThai($strDate)
	{
		$dmy = explode("-", $strDate);
		$y = $dmy[0];
		$m = $dmy[1];
		$d = $dmy[2];
		return $d . '/' . $m . '/' . $y;
	}

	public static function removeBlanket($str)
	{
		$patterns = array();
		$patterns[0] = "/\{([^}]+)\}/";
		$patterns[1] = "/\[([^]]+)\]/";
		$replacements = array();
		$replacements[2] = '';
		$replacements[1] = '';
		return preg_replace($patterns, $replacements, $str);
	}

	public static function generateProductImageUrl($productImageFileName)
	{
		return SHOP_URL . "product/" . $productImageFileName;
	}
}
