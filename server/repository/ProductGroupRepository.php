<?php

class ProductGroupRepository
{
	private $dbh;
	
	public function __construct($conn) {
		$this->dbh = $conn;
	}

	public function createProductGroup($params, $groupImageFileName)
    {
        $query = 'INSERT INTO product_group(group_name_display,
						group_name_search,
						group_product_detail,
						group_image_file_name,
						display_type,
						status)
					VALUES (:groupNameDisplay,
						:groupNameSearch,
						:groupProductDetail,
						:groupImageFileName,
						:displayType,
						:status)';
        $stmt = $this->dbh->prepare($query);

        $stmt->bindParam(':groupNameDisplay', $params['groupNameDisplay'], PDO::PARAM_STR);
        $stmt->bindParam(':groupNameSearch', $params['groupNameSearch'], PDO::PARAM_STR);
		$stmt->bindParam(':displayType', $params['displayType'], PDO::PARAM_STR);
		$stmt->bindParam(':groupProductDetail', $params['groupProductDetail'], PDO::PARAM_STR);

		if($groupImageFileName) {
			$stmt->bindParam(':groupImageFileName', $groupImageFileName, PDO::PARAM_STR);
		} else {
			$stmt->bindValue(':groupImageFileName', null, PDO::PARAM_STR);
		}

		$stmt->bindValue(':status', 'A', PDO::PARAM_STR);

        $stmt->execute();

		return $this->dbh->lastInsertId();
    }

	public function updateProductGroup($params, $groupImageFileName) {
		$query = 'UPDATE product_group 
					SET group_name_display = :groupNameDisplay,
					group_name_search = :groupNameSearch,
					display_type = :displayType,
					group_product_detail = :groupProductDetail ';

		if($groupImageFileName) {
			$query .= ', group_image_file_name = :groupImageFileName ';
		}
		
		$where = 'WHERE group_id = :groupId';
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(':groupId', $params['groupId'], PDO::PARAM_INT);
		$stmt->bindParam(':groupNameDisplay', $params['groupNameDisplay'], PDO::PARAM_STR);
		$stmt->bindParam(':groupNameSearch', $params['groupNameSearch'], PDO::PARAM_STR);
		$stmt->bindParam(':displayType', $params['displayType'], PDO::PARAM_STR);
		$stmt->bindParam(':groupProductDetail', $params['groupProductDetail'], PDO::PARAM_STR);

		if($groupImageFileName) {
			$stmt->bindParam(':groupImageFileName', $groupImageFileName, PDO::PARAM_STR);
		}
		
		$stmt->execute();
    }

	public function getProductGroups($productId, $groupNameDisplay) {
		$query = 'SELECT pg.group_id, pg.group_name_display, pg.group_name_search FROM product_group pg ';
		$query .= 'LEFT JOIN product_in_group pig ON pg.group_id = pig.group_id ';
		$where = 'WHERE pg.group_name_display LIKE :groupNameDisplay ';

		if($productId != null) {
			$where .= 'AND pig.product_id = :productId ';
		}

		$where .= "AND pg.status = 'A' ";
		$groupBy = 'GROUP BY pg.group_id, pg.group_name_display, pg.group_name_search ';
		$stmt = $this->dbh->prepare($query . $where . $groupBy);

		$stmt->bindValue(':groupNameDisplay', '%' . $groupNameDisplay . '%', PDO::PARAM_STR);

		if($productId != null) {
			$stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
		}

		$stmt->execute();

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
	
	public function getProductGroup($groupId){
        $query = 'SELECT p.* FROM product_group p ';
		$where = 'WHERE p.group_id = :groupId ';
		$stmt = $this->dbh->prepare($query . $where); 
		$stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);

		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
    }

	public function getAllProductGroups(){
        $query = 'SELECT * FROM product_group p ';
		$where = "WHERE p.status = 'A' ";
		$stmt = $this->dbh->prepare($query . $where); 

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

	public function deleteProductGroup($groupId) {
		$query = "UPDATE product_group SET status = 'I' ";
		$where = 'WHERE group_id = :groupId';
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(':groupId', $groupId, PDO::PARAM_INT);
		$stmt->execute();
    }
}
