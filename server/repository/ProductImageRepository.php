<?php

class ProductImageRepository
{
	private $dbh;

	public function __construct($conn)
	{
		$this->dbh = $conn;
	}

	public function deleteByProductId($productId)
	{
		$query = 'DELETE FROM product_image WHERE product_id = :productId';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
		$stmt->execute();
	}

	public function deleteByProductIdAndType($productId, $type)
	{
		$query = 'DELETE FROM product_image WHERE product_id = :productId AND type = :type';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
		$stmt->bindParam(':type', $type, PDO::PARAM_STR);
		$stmt->execute();
	}

	public function insert($productId, $sequence, $type, $fileName)
	{
		$query = 'INSERT INTO product_image (product_id, sequence, type, file_name)
				  VALUES (:productId, :sequence, :type, :fileName)';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
		$stmt->bindParam(':sequence', $sequence, PDO::PARAM_INT);
		$stmt->bindParam(':type', $type, PDO::PARAM_STR);
		$stmt->bindParam(':fileName', $fileName, PDO::PARAM_STR);
		$stmt->execute();
	}

	public function getByProductId($productId)
	{
		$query = 'SELECT * FROM product_image WHERE product_id = :productId ORDER BY sequence';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getByProductIdAndType($productId, $type)
	{
		$query = 'SELECT * FROM product_image WHERE product_id = :productId AND type = :type ORDER BY sequence';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
		$stmt->bindParam(':type', $type, PDO::PARAM_STR);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
