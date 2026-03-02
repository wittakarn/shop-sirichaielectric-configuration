<?php
// extend TCPF columnWidthith custom functions
class QuotDetailPdfWithoutLogo extends QuotDetailPDF
{
	//Page header
	public function Header()
	{
		$this->SetFont('', 'B', 36);
		$this->Cell(0, 36, 'ใบเสนอราคาชั่วคราว', 0, 2, 'C', 0, '', 0, false, 'M', 'B');
	}

	// Colored table
	public function generateQuotationDetailTable($data)
	{
		$rowLimit = 35;
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
		$this->MultiCell($this->columnWidth[3] + $this->columnWidth[4] + $this->columnWidth[5] + $this->columnWidth[6], $columnWidth, $user["contact"] ? 'ติดต่อ ' . $user["contact"] : "", 0, 'R', 0, 0, '', '', true, 0);
	}
}
