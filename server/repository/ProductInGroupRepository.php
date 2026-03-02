<?php

class ProductInGroupRepository
{
	private $dbh;
	
	public function __construct($conn) {
		$this->dbh = $conn;
	}

    
    public function getAllAssignedProducts(){
        $query = "SELECT DISTINCT(product_id) FROM product_in_group";
        $stmt = $this->dbh->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function removeAssignedProductToGroup($groupId){
        $query = "DELETE FROM product_in_group ";
        $where = "WHERE group_id = :groupId";
        $stmt = $this->dbh->prepare($query . $where);

        $stmt->bindParam(":groupId", $groupId, PDO::PARAM_INT);

        $stmt->execute();
    }
	
	public function assignProductToGroup($groupId, $productId){
        $query = "INSERT INTO product_in_group(
                        group_id,
						product_id
                ) VALUES (
                        :groupId,
						:productId
                )";
        $stmt = $this->dbh->prepare($query);

        $stmt->bindParam(":groupId", $groupId, PDO::PARAM_INT);
        $stmt->bindParam(":productId", $productId, PDO::PARAM_INT);

        $stmt->execute();
    }

    public function removeAssignedProductFromOtherGroup($productId){
        $query = "DELETE FROM product_in_group ";
        $where = "WHERE product_id = :productId";
        $stmt = $this->dbh->prepare($query . $where);

        $stmt->bindParam(":productId", $productId, PDO::PARAM_INT);

        $stmt->execute();
    }

    public function getAssignedProducts($groupId) {
        $query = 'SELECT p.* FROM product_in_group pig, product p  ';
		$where = 'WHERE pig.product_id = p.product_id ';
        $where .= 'AND pig.group_id = :groupId ';

		$stmt = $this->dbh->prepare($query . $where);
        $stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);
		$stmt->execute();

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>