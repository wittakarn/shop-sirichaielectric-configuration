<?php

class InventoryInMenuRepository
{
	private $dbh;
	
	public function __construct($conn) {
		$this->dbh = $conn;
	}

    public function removeAssignedInventoryToMenu($menuId){
        $query = "DELETE FROM inventory_in_menu ";
        $where = "WHERE menu_id = :menuId";
        $stmt = $this->dbh->prepare($query . $where);

        $stmt->bindParam(":menuId", $menuId, PDO::PARAM_INT);

        $stmt->execute();
    }
	
	public function assignInventoryToMenu($order, $menuId, $productId, $category){
        $query = "INSERT INTO inventory_in_menu(
                        menu_id,
						inventory_id,
                        category,
                        `order`
                ) VALUES (
                        :menuId,
						:inventoryId,
                        :category,
                        :order
                )";
        $stmt = $this->dbh->prepare($query);

        $stmt->bindParam(":menuId", $menuId, PDO::PARAM_INT);
        $stmt->bindParam(":inventoryId", $productId, PDO::PARAM_INT);
        $stmt->bindParam(":category", $category, PDO::PARAM_STR);
        $stmt->bindParam(":order", $order, PDO::PARAM_INT);

        $stmt->execute();
    }

    public function getAssignedInventoryItems($menuId) {
        $query = 'SELECT * FROM inventory_in_menu iim ';
		$where = 'WHERE iim.menu_id = :menuId ';
        $orderBy = 'ORDER BY iim.order ';

		$stmt = $this->dbh->prepare($query . $where . $orderBy);
        $stmt->bindParam(':menuId', $menuId, PDO::PARAM_INT);
		$stmt->execute();

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>