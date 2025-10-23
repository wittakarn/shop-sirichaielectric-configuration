<?php

class ProductGroupImageRepository
{
	private $dbh;

	public function __construct($conn)
	{
		$this->dbh = $conn;
	}

	public function deleteByGroupId($groupId)
	{
		$query = 'DELETE FROM product_group_image WHERE group_id = :groupId';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);
		$stmt->execute();
	}

	public function deleteByGroupIdAndType($groupId, $type)
	{
		$query = 'DELETE FROM product_group_image WHERE group_id = :groupId AND type = :type';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);
		$stmt->bindParam(':type', $type, PDO::PARAM_STR);
		$stmt->execute();
	}

	public function insert($groupId, $sequence, $type, $fileName)
	{
		$query = 'INSERT INTO product_group_image (group_id, sequence, type, file_name)
				  VALUES (:groupId, :sequence, :type, :fileName)';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);
		$stmt->bindParam(':sequence', $sequence, PDO::PARAM_INT);
		$stmt->bindParam(':type', $type, PDO::PARAM_STR);
		$stmt->bindParam(':fileName', $fileName, PDO::PARAM_STR);
		$stmt->execute();
	}

	public function getByGroupId($groupId)
	{
		$query = 'SELECT * FROM product_group_image WHERE group_id = :groupId ORDER BY sequence';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getByGroupIdAndType($groupId, $type)
	{
		$query = 'SELECT * FROM product_group_image WHERE group_id = :groupId AND type = :type ORDER BY sequence';
		$stmt = $this->dbh->prepare($query);
		$stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);
		$stmt->bindParam(':type', $type, PDO::PARAM_STR);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
