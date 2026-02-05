<?php

class ProductRepository
{
	private $dbh;

	public function __construct($conn)
	{
		$this->dbh = $conn;
	}

	public function getProducts($menuId, $productName)
	{
		$subNames = explode(" ", $productName);
		$subNamesSize = count($subNames);

		$query = 'SELECT gg.group_id, p.product_id, p.product_url_name, p.product_name, p.c_price, gg.group_name_display, pmg.group_name_display menu_group_name_p, gmg.group_name_display menu_group_name_g FROM product p ';
		$query .= "LEFT JOIN (SELECT g.*, pig.product_id FROM product_in_group pig, product_group g WHERE pig.group_id = g.group_id AND g.status = 'A') gg ON p.product_id = gg.product_id ";
		$query .= "LEFT JOIN inventory_in_menu pm ON p.product_id = pm.inventory_id AND pm.category = 'product' ";
		$query .= "LEFT JOIN inventory_in_menu gm ON gg.group_id = gm.inventory_id AND gm.category = 'group' ";
		$query .= 'LEFT JOIN menu_group pmg ON pm.menu_id = pmg.id ';
		$query .= 'LEFT JOIN menu_group gmg ON gm.menu_id = gmg.id ';
		$where = 'WHERE 1 = 1 ';

		if ($menuId != null) {
			$where .= 'AND (pmg.id = :menuId OR gmg.id = :menuId) ';
		}

		for ($i = 0; $i < $subNamesSize; $i++) {
			$where .= ' AND p.product_name LIKE :name' . $i;
		}

		$stmt = $this->dbh->prepare($query . $where);

		if ($menuId != null) {
			$stmt->bindValue(':menuId', $menuId, PDO::PARAM_INT);
		}
		
		for ($i = 0; $i < $subNamesSize; $i++) {
			$stmt->bindValue(":name" . $i, '%' . $subNames[$i] . '%', PDO::PARAM_STR);
		}

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getProductOptions($productName)
	{
		$subNames = explode(" ", $productName);
		$subNamesSize = count($subNames);

		$query = 'SELECT p.product_id, p.product_name FROM product p ';
		$where = 'WHERE 1 = 1 ';

		for ($i = 0; $i < $subNamesSize; $i++) {
			$where .= ' AND p.product_name LIKE :name' . $i;
		}
		$order = " ORDER BY p.product_name ";
		$limit = " LIMIT 30 ";

		$stmt = $this->dbh->prepare($query . $where . $order . $limit);

		for ($i = 0; $i < $subNamesSize; $i++) {
			$stmt->bindValue(":name" . $i, '%' . $subNames[$i] . '%', PDO::PARAM_STR);
		}

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function searchProducts($productName, $size)
	{
		$subNames = explode(" ", $productName);
		$subNamesSize = count($subNames);

		$query = 'SELECT p.* FROM product p ';
		$where = 'WHERE 1 = 1 ';

		for ($i = 0; $i < $subNamesSize; $i++) {
			$where .= ' AND p.product_name LIKE :name' . $i;
		}
		$order = " ORDER BY p.product_name ";
		$limit = " LIMIT :limit ";

		$stmt = $this->dbh->prepare($query . $where . $order . $limit);

		for ($i = 0; $i < $subNamesSize; $i++) {
			$stmt->bindValue(":name" . $i, '%' . $subNames[$i] . '%', PDO::PARAM_STR);
		}

		$stmt->bindValue(":limit", intval($size), PDO::PARAM_INT);

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getProduct($productId)
	{
		$query = 'SELECT * FROM product p ';
		$where = 'WHERE p.product_id = :productId ';
		$stmt = $this->dbh->prepare($query . $where);
		$stmt->bindValue(':productId', $productId, PDO::PARAM_STR);

		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function getAvailableProducts()
	{
		$query = 'SELECT * FROM product p ';
		$where = 'WHERE p.product_url_name IS NOT NULL ';
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getUnAvailableProducts()
	{
		$query = 'SELECT * FROM product p ';
		$where = 'WHERE p.product_url_name IS NULL ';
		$where .= 'OR p.product_name_display IS NULL ';
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function update($params, $productImageFileName)
	{
		$query = 'UPDATE product SET product_name = :productName,
						product_name_display = :productNameDisplay,
						product_url_name = :productUrlName,
						product_search = :productSearch,
						standard_price = :standardPrice,
                        b_price = :bPrice,
                        product_detail = :productDetail ';

		if ($productImageFileName) {
			$query .= ' ,product_image_file_name = :productImageFileName ';
		}

		$where = ' WHERE product_id = :productId';
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(':productName', $params['productName'], PDO::PARAM_STR);
		$stmt->bindParam(':productNameDisplay', $params['productNameDisplay'], PDO::PARAM_STR);
		$stmt->bindParam(':productUrlName', $params['productUrlName'], PDO::PARAM_STR);
		$stmt->bindParam(':productSearch', $params['productSearch'], PDO::PARAM_STR);
		$stmt->bindParam(':standardPrice', $params['standardPrice'], PDO::PARAM_STR);
		$stmt->bindParam(':bPrice', $params['bPrice'], PDO::PARAM_STR);
		$stmt->bindParam(':productDetail', $params['productDetail'], PDO::PARAM_STR);

		if ($productImageFileName) {
			$stmt->bindParam(':productImageFileName', $productImageFileName, PDO::PARAM_STR);
		}

		$stmt->bindParam(':productId', $params['productId'], PDO::PARAM_INT);

		$stmt->execute();
	}

	public function updateProductImage($productId, $productImageFileName)
	{
		$query = 'UPDATE product SET product_image_file_name = :productImageFileName';
		$where = ' WHERE product_id = :productId';
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(':productImageFileName', $productImageFileName, PDO::PARAM_STR);
		$stmt->bindParam(':productId', $productId, PDO::PARAM_INT);

		$stmt->execute();
	}

	public function createProduct($params)
	{
		$db = $this->dbh;
		$query = "INSERT INTO product(product_id, product_name, product_name_display, product_url_name, unit_name, standard_price, capital_price, ss_price, s_price, a_price, 
		b_price, c_price, vb_price, vc_price, d_price, e_price, f_price) 
		VALUES (:product_id, :product_name, :product_name_display, :product_url_name, :unit_name, :standard_price, :capital_price, :ss_price, :s_price, :a_price, 
		:b_price, :c_price, :vb_price, :vc_price, :d_price, :e_price, :f_price)";

		$stmt = $db->prepare($query);
		$stmt->bindParam(":product_id", $params['productId'], PDO::PARAM_INT);
		$stmt->bindParam(":product_name", $params['productName'], PDO::PARAM_STR);
		$stmt->bindParam(':product_name_display', $params['productNameDisplay'], PDO::PARAM_STR);
		$stmt->bindParam(':product_url_name', $params['productUrlName'], PDO::PARAM_STR);
		$stmt->bindParam(":unit_name", $params['unitName'], PDO::PARAM_STR);
		$stmt->bindParam(":standard_price", $params['standardPrice'], PDO::PARAM_STR);
		$stmt->bindParam(":capital_price", $params['capitalPrice'], PDO::PARAM_STR);
		$stmt->bindValue(":ss_price", $params['ssPrice']? str_replace(",", "", $params['ssPrice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":s_price", $params['sprice'] ? str_replace(",", "", $params['sprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":a_price", $params['aprice'] ? str_replace(",", "", $params['aprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":b_price", $params['bprice'] ? str_replace(",", "", $params['bprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":c_price", $params['cprice'] ? str_replace(",", "", $params['cprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":vb_price", $params['vbPrice'] ? str_replace(",", "", $params['vbPrice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":vc_price", $params['vcPrice'] ? str_replace(",", "", $params['vcPrice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":d_price", $params['dprice'] ? str_replace(",", "", $params['dprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":e_price", $params['eprice'] ? str_replace(",", "", $params['eprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":f_price", $params['fprice'] ? str_replace(",", "", $params['fprice']) : null, PDO::PARAM_STR);

		$stmt->execute();
	}

	public function updateProduct($params)
	{
		$db = $this->dbh;
		$query = "UPDATE product SET product_name=:product_name, product_name_display=:product_name_display, product_url_name=:product_url_name,unit_name=:unit_name,standard_price=:standard_price,
		capital_price=:capital_price,ss_price=:ss_price,s_price=:s_price,a_price=:a_price,b_price=:b_price,c_price=:c_price,
		vb_price=:vb_price,vc_price=:vc_price,d_price=:d_price,e_price=:e_price,f_price=:f_price WHERE product_id=:product_id";
		$stmt = $db->prepare($query);
		$stmt->bindParam(":product_id", $params['productId'], PDO::PARAM_INT);
		$stmt->bindParam(':product_name', $params['productName'], PDO::PARAM_STR);
		$stmt->bindParam(':product_name_display', $params['productNameDisplay'], PDO::PARAM_STR);
		$stmt->bindParam(':product_url_name', $params['productUrlName'], PDO::PARAM_STR);
		$stmt->bindParam(":unit_name", $params['unitName'], PDO::PARAM_STR);
		$stmt->bindParam(":standard_price", $params['standardPrice'], PDO::PARAM_STR);
		$stmt->bindParam(":capital_price", $params['capitalPrice'], PDO::PARAM_STR);
		$stmt->bindValue(":ss_price", $params['ssPrice']? str_replace(",", "", $params['ssPrice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":s_price", $params['sprice'] ? str_replace(",", "", $params['sprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":a_price", $params['aprice'] ? str_replace(",", "", $params['aprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":b_price", $params['bprice'] ? str_replace(",", "", $params['bprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":c_price", $params['cprice'] ? str_replace(",", "", $params['cprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":vb_price", $params['vbPrice'] ? str_replace(",", "", $params['vbPrice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":vc_price", $params['vcPrice'] ? str_replace(",", "", $params['vcPrice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":d_price", $params['dprice'] ? str_replace(",", "", $params['dprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":e_price", $params['eprice'] ? str_replace(",", "", $params['eprice']) : null, PDO::PARAM_STR);
		$stmt->bindValue(":f_price", $params['fprice'] ? str_replace(",", "", $params['fprice']) : null, PDO::PARAM_STR);

		$stmt->execute();
	}

	public function updateProductDisplay($productId, $productNameDisplay, $productUrlName)
	{
		$db = $this->dbh;
		$query = "UPDATE product SET product_name_display=:product_name_display, product_url_name=:product_url_name WHERE product_id=:product_id";
		$stmt = $db->prepare($query);
		$stmt->bindParam(":product_id", $productId, PDO::PARAM_INT);
		$stmt->bindParam(':product_name_display', $productNameDisplay, PDO::PARAM_STR);
		$stmt->bindParam(':product_url_name', $productUrlName, PDO::PARAM_STR);

		$stmt->execute();
	}

	public function updateProductPricing($productId, $pricing)
	{
		$db = $this->dbh;

		$updateFields = [];
		$allowedPriceFields = [
			'standardPrice' => 'standard_price',
			'capitalPrice' => 'capital_price',
			'ssPrice' => 'ss_price',
			'sPrice' => 's_price',
			'aPrice' => 'a_price',
			'bPrice' => 'b_price',
			'cPrice' => 'c_price',
			'vbPrice' => 'vb_price',
			'vcPrice' => 'vc_price',
			'dPrice' => 'd_price',
			'ePrice' => 'e_price',
			'fPrice' => 'f_price'
		];

		foreach ($allowedPriceFields as $camelCase => $snakeCase) {
			if (isset($pricing[$camelCase])) {
				$updateFields[] = "$snakeCase = :$camelCase";
			}
		}

		if (empty($updateFields)) {
			return;
		}

		$query = "UPDATE product SET " . implode(', ', $updateFields) . " WHERE product_id = :productId";
		$stmt = $db->prepare($query);

		foreach ($allowedPriceFields as $camelCase => $snakeCase) {
			if (isset($pricing[$camelCase])) {
				$value = $pricing[$camelCase] !== null ? str_replace(",", "", $pricing[$camelCase]) : null;
				$stmt->bindValue(":$camelCase", $value, PDO::PARAM_STR);
			}
		}

		$stmt->bindParam(":productId", $productId, PDO::PARAM_INT);
		$stmt->execute();
	}
}
