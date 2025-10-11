<?php

class MenuGroupRepository
{
	private $dbh;

	public function __construct($conn)
	{
		$this->dbh = $conn;
	}

	public function createMenuGroup($params, $menuImageFileName)
	{
		$query = "INSERT INTO menu_group(group_name_display,
						group_name_search,
						group_parent_id,
						menu_image_file_name,
						status)
					VALUES (:groupNameDisplay,
						:groupNameSearch,
						:groupParentId,
						:menuImageFileName,
						:status)";
		$stmt = $this->dbh->prepare($query);

		$stmt->bindParam(":groupNameDisplay", $params['groupNameDisplay'], PDO::PARAM_STR);
		$stmt->bindParam(":groupNameSearch", $params['groupNameSearch'], PDO::PARAM_STR);

		if (!isset($params['groupParentId']) || $params['groupParentId'] == null) {
			$stmt->bindValue(":groupParentId", null, PDO::PARAM_INT);
		} else {
			$stmt->bindParam(":groupParentId", $params['groupParentId'], PDO::PARAM_INT);
		}

		if ($menuImageFileName) {
			$stmt->bindParam(":menuImageFileName", $menuImageFileName, PDO::PARAM_STR);
		} else {
			$stmt->bindValue(":menuImageFileName", null, PDO::PARAM_STR);
		}

		$stmt->bindValue(":status", 'A', PDO::PARAM_STR);

		$stmt->execute();

		return $this->dbh->lastInsertId();
	}

	public function updateMenuGroup($params, $menuImageFileName)
	{
		$query = "UPDATE menu_group 
					SET group_name_display = :groupNameDisplay,
					group_name_search = :groupNameSearch,
					group_parent_id = :groupParentId ";

		if ($menuImageFileName) {
			$query .= ", menu_image_file_name = :menuImageFileName ";
		}


		$where = "WHERE id = :id";
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(":id", $params['id'], PDO::PARAM_INT);
		$stmt->bindParam(":groupNameDisplay", $params['groupNameDisplay'], PDO::PARAM_STR);
		$stmt->bindParam(":groupNameSearch", $params['groupNameSearch'], PDO::PARAM_STR);

		if (!isset($params['groupParentId']) || $params['groupParentId'] == null) {
			$stmt->bindValue(":groupParentId", null, PDO::PARAM_INT);
		} else {
			$stmt->bindParam(":groupParentId", $params['groupParentId'], PDO::PARAM_INT);
		}

		if ($menuImageFileName) {
			$stmt->bindParam(":menuImageFileName", $menuImageFileName, PDO::PARAM_STR);
		}

		$stmt->execute();
	}

	public function deleteMenuGroup($id)
	{
		$query = "UPDATE menu_group SET status = 'I' ";
		$where = "WHERE id = :id";
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
	}

	public function getMenuGroups($groupNameDisplay)
	{
		$query = "SELECT * FROM menu_group m ";
		$where = "WHERE m.group_name_display LIKE :groupNameDisplay ";
		$where .= "AND m.status = 'A' ";
		$stmt = $this->dbh->prepare($query . $where);
		$stmt->bindValue(":groupNameDisplay", '%' . $groupNameDisplay . '%', PDO::PARAM_STR);

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getAllMenuGroups()
	{
		$query = "SELECT * FROM menu_group m ";
		$where = "WHERE m.status = 'A' ";
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getMenuInformation($menuGroupNameDisplay, $productGroupNameDisplay, $productName)
	{
		$select = "SELECT s.id, s.group_name_display, s.group_name_search, s.group_parent_id, m.group_name_display parent_group_name_display from menu_group s ";
		$join = "LEFT JOIN menu_group m on s.group_parent_id = m.id ";
		$join .= "LEFT JOIN inventory_in_menu iim on s.id = iim.menu_id ";
		$join .= "LEFT JOIN product_group pg on iim.inventory_id = pg.group_id and iim.category = 'group' ";
		$join .= "LEFT JOIN product p on iim.inventory_id = p.product_id  and iim.category = 'product' ";
		$where = "WHERE s.group_name_display LIKE :menuGroupNameDisplay ";

		if ($productGroupNameDisplay) {
			$where .= "AND pg.group_name_display LIKE :productGroupNameDisplay ";
		}

		if ($productName) {
			$where .= "AND p.product_name LIKE :productName ";
		}

		$where .= "AND s.status = 'A' ";
		$groupBy = "GROUP BY s.id, s.group_name_display, s.group_name_search, m.group_name_display";
		$stmt = $this->dbh->prepare($select . $join . $where . $groupBy);

		$stmt->bindValue(":menuGroupNameDisplay", '%' . $menuGroupNameDisplay . '%', PDO::PARAM_STR);

		if ($productGroupNameDisplay) {
			$stmt->bindValue(":productGroupNameDisplay", '%' . $productGroupNameDisplay . '%', PDO::PARAM_STR);
		}

		if ($productName) {
			$stmt->bindValue(":productName", '%' . $productName . '%', PDO::PARAM_STR);
		}

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getSubMenuGroups($groupParentId)
	{
		$query = "SELECT * FROM menu_group m ";
		$where = "WHERE m.group_parent_id = :groupParentId ";
		$where .= "AND m.status = 'A' ";
		$order = " ORDER BY m.sequence";
		$stmt = $this->dbh->prepare($query . $where. $order);
		$stmt->bindParam(":groupParentId", $groupParentId, PDO::PARAM_INT);

		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function updateMenuGroupSequence($id, $sequence)
	{
		$query = "UPDATE menu_group SET sequence = :sequence ";
		$where = "WHERE id = :id";
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->bindParam(":sequence", $sequence, PDO::PARAM_INT);
		$stmt->execute();
	}
}
