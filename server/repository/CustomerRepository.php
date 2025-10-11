<?php

class CustomerRepository
{
    private $dbh;

    public function __construct($conn)
    {
        $this->dbh = $conn;
    }

    public function createCustomer($params)
    {
        $query = "INSERT INTO customer (
            customer_name,
            tin,
            customer_address,
            customer_grade,
            remark
        ) VALUES (
            :customerName,
            :tin,
            :customerAddress,
            :customerGrade,
            :remark
        )";
        $stmt = $this->dbh->prepare($query);

        $stmt->bindParam(":customerName", $params['customerName'], PDO::PARAM_STR);
        $stmt->bindParam(":tin", $params['tin'], PDO::PARAM_STR);
        $stmt->bindParam(":customerAddress", $params['customerAddress'], PDO::PARAM_STR);
        $stmt->bindParam(":customerGrade", $params['customerGrade'], PDO::PARAM_STR);
        if (isset($params['remark']) && $params['remark'] !== null) {
            $stmt->bindParam(":remark", $params['remark'], PDO::PARAM_STR);
        } else {
            $stmt->bindValue(":remark", null, PDO::PARAM_STR);
        }

        $stmt->execute();
        return $this->dbh->lastInsertId();
    }

    public function getCustomers($customerName)
    {
        $query = "SELECT * FROM customer c ";
        $where = "WHERE c.customer_name LIKE :customerName ";
        $where .= "AND c.status = 'A' ";
        $stmt = $this->dbh->prepare($query . $where);
        $stmt->bindValue(":customerName", '%' . $customerName . '%', PDO::PARAM_STR);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateCustomer($params)
    {
        $query = "UPDATE customer SET 
            customer_name = :customerName,
            tin = :tin,
            customer_address = :customerAddress,
            customer_grade = :customerGrade,
            remark = :remark ";
        $where = "WHERE id = :id";
        $stmt = $this->dbh->prepare($query . $where);

        $stmt->bindParam(":id", $params['id'], PDO::PARAM_INT);
        $stmt->bindParam(":customerName", $params['customerName'], PDO::PARAM_STR);
        $stmt->bindParam(":tin", $params['tin'], PDO::PARAM_STR);
        $stmt->bindParam(":customerAddress", $params['customerAddress'], PDO::PARAM_STR);
        $stmt->bindParam(":customerGrade", $params['customerGrade'], PDO::PARAM_STR);
        if (isset($params['remark']) && $params['remark'] !== null) {
            $stmt->bindParam(":remark", $params['remark'], PDO::PARAM_STR);
        } else {
            $stmt->bindValue(":remark", null, PDO::PARAM_STR);
        }

        $stmt->execute();
    }

    public function setInactive($id)
    {
        $query = "UPDATE customer SET status = 'I' ";
        $where = "WHERE id = :id";
		$stmt = $this->dbh->prepare($query . $where);

		$stmt->bindParam(":id", $id, PDO::PARAM_INT);
		$stmt->execute();
    }

    public function getCustomerOptions($customerName)
    {
        $query = "SELECT id, customer_name as customerName FROM customer ";
        $where = "WHERE customer_name LIKE :customerName ";
        $where .= "AND customer_name IS NOT NULL ";
        $order = "ORDER BY customer_name LIMIT 30";
        $stmt = $this->dbh->prepare($query . $where . $order);
        $stmt->bindValue(":customerName", '%' . $customerName . '%', PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCustomer($id)
    {
        $query = 'SELECT * FROM customer WHERE id = :id';
        $stmt = $this->dbh->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
