<?php
class QuotationRepository
{
    private $dbh;

    public function __construct($conn)
    {
        $this->dbh = $conn;
    }

    public function getLatestQuotSequence()
    {
        $query = "SELECT year, sequence FROM quot_no WHERE year = (SELECT MAX(YEAR) FROM quot_no)";
        $stmt = $this->dbh->prepare($query);

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createQuotNo()
    {
        $date = new DateTime();
        $currentYear = $date->format('Y');
        $sequence = 1;
        $query = "INSERT INTO quot_no (year, sequence) VALUES (:year, :sequence)";
        $stmt = $this->dbh->prepare($query);
        $stmt->bindParam(":year", $currentYear, PDO::PARAM_INT);
        $stmt->bindParam(":sequence", $sequence, PDO::PARAM_INT);

        $stmt->execute();

        $createdResult['year'] = $currentYear;
        $createdResult['sequence'] = $sequence; 
        return $createdResult;
    }

    public function updateQuotNoSequence()
    {
        $query = "UPDATE quot_no SET sequence=sequence+1 WHERE year IN(SELECT max_year FROM(SELECT MAX(year) max_year FROM quot_no) AS arbitraryTableName)";
        $stmt = $this->dbh->prepare($query);

        $stmt->execute();
    }

    public function createQuotMast($params)
    {
        $customerId = $params['customer']['id'];
        $db = $this->dbh;
        $query = "INSERT INTO quot_mast(quot_no, customer_id, date, total_price, vat_price, net_price, promotion_type, create_user, create_datetime, update_count) VALUES (:quot_no, :customer_id, NOW(), :total_price, :vat_price, :net_price, :promotion_type, :create_user, NOW(), 0)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":quot_no", $params['quotNo'], PDO::PARAM_STR);
        $stmt->bindParam(":customer_id", $customerId, PDO::PARAM_INT);
        $stmt->bindValue(":total_price", str_replace(",", "", $params['totalPrice']), PDO::PARAM_STR);
        $stmt->bindValue(":vat_price", str_replace(",", "", $params['vatPrice']), PDO::PARAM_STR);
        $stmt->bindValue(":net_price", str_replace(",", "", $params['summedPrice']), PDO::PARAM_STR);
        $stmt->bindValue(":promotion_type", "", PDO::PARAM_STR);
        $stmt->bindParam(":create_user", $params['email'], PDO::PARAM_STR);

        $stmt->execute();
    }

    public function updateQuotMast($params)
    {
        $db = $this->dbh;
        $query = "UPDATE quot_mast SET total_price=:total_price,vat_price=:vat_price,net_price=:net_price,promotion_type=:promotion_type,update_user=:update_user,update_datetime=NOW(),update_count=update_count+1 WHERE quot_no=:quot_no";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":quot_no", $params['quotNo'], PDO::PARAM_STR);
        $stmt->bindValue(":total_price", str_replace(",", "", $params['totalPrice']), PDO::PARAM_STR);
        $stmt->bindValue(":vat_price", str_replace(",", "", $params['vatPrice']), PDO::PARAM_STR);
        $stmt->bindValue(":net_price", str_replace(",", "", $params['summedPrice']), PDO::PARAM_STR);
        $stmt->bindValue(":promotion_type", "", PDO::PARAM_STR);
        $stmt->bindParam(":update_user", $params['email'], PDO::PARAM_STR);

        $stmt->execute();
    }

    public function getQuotMast($quotNo)
    {
        $db = $this->dbh;
        $query = "SELECT * FROM quot_mast WHERE quot_no = :quot_no ";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":quot_no", $quotNo, PDO::PARAM_STR);

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getQuotMastsByCustomerId($customerId, $limit)
    {
        $db = $this->dbh;
        $query = "SELECT quot_no, date, net_price FROM quot_mast WHERE customer_id = :customer_id ";
        $order = "ORDER BY create_datetime DESC ";
        $limitClause = "LIMIT " . $limit;
        $stmt = $db->prepare($query . $order . $limitClause);
        $stmt->bindParam(":customer_id", $customerId, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPricesFromQuotationInThePast($customerId, $productId, $limit)
    {
        $db = $this->dbh;
        $query = "SELECT a.date, b.price FROM quot_mast a, quot_detail b WHERE a.quot_no = b.quot_no AND a.customer_id = :customer_id AND b.product_id = :product_id ";
        $order = "ORDER BY a.create_datetime DESC ";
        $limitClause = "LIMIT " . $limit;
        $stmt = $db->prepare($query . $order . $limitClause);
        $stmt->bindParam(":customer_id", $customerId, PDO::PARAM_INT);
        $stmt->bindParam(":product_id", $productId, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createQuotDetails($params)
    {
        $db = $this->dbh;
        $query = "INSERT INTO quot_detail(quot_no, product_id, sequence, product_name, quantity, unit_name, price, capital_price, summary_price) VALUES (:quot_no, :product_id, :sequence, :product_name, :quantity, :unit_name, :price, :capital_price, :summary_price)";
        $stmt = $db->prepare($query);

        foreach ($params["productsInQuotation"] as $index => $item) {
            $product = $item['product'];
            $stmt->bindParam(":quot_no", $params['quotNo'], PDO::PARAM_STR);
            $stmt->bindParam(":product_id", $product['productId'], PDO::PARAM_INT);
            $stmt->bindValue(":sequence", $index + 1, PDO::PARAM_INT);
            $stmt->bindParam(":product_name", $product['productName'], PDO::PARAM_STR);
            $stmt->bindParam(":quantity", $item['productAmount'], PDO::PARAM_STR);
            $stmt->bindParam(":unit_name", $product['unitName'], PDO::PARAM_STR);
            $stmt->bindValue(":price", str_replace(",", "", $item['productPrice']), PDO::PARAM_STR);
            $stmt->bindValue(":capital_price", str_replace(",", "", $product['capitalPrice']), PDO::PARAM_STR);
            $stmt->bindValue(":summary_price", str_replace(",", "", $item['summedProductPrice']), PDO::PARAM_STR);

            $stmt->execute();
        }
    }

    public function getQuotDetails($quotNo)
    {
        $db = $this->dbh;
        $query = "SELECT * FROM quot_detail WHERE quot_no = :quot_no ";
        $order = "ORDER BY sequence ASC";
        $stmt = $db->prepare($query . $order);
        $stmt->bindParam(":quot_no", $quotNo, PDO::PARAM_STR);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteQuotDetailsByQuotNo($quotNo){
		$db = $this->dbh;
		$query = "DELETE FROM quot_detail WHERE quot_no = :quot_no";
		$stmt = $db->prepare($query); 
		$stmt->bindParam(":quot_no", $quotNo, PDO::PARAM_STR); 

		$stmt->execute();
	}
}
