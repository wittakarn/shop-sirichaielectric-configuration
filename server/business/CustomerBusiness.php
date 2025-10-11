<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'connection.php';
require_once DOCUMENT_ROOT . 'server/repository/CustomerRepository.php';

class CustomerBusiness
{
    private $dbh;

    public function __construct()
    {
        $this->dbh = DataBaseConnection::createConnect();
    }

    public function createCustomer($params)
    {
        $customerRepo = new CustomerRepository($this->dbh);
        $createdId = $customerRepo->createCustomer($params);
        $result['createdId'] = $createdId;
        return $result;
    }

    public function getCustomers($customerName)
    {
        $customerRepo = new CustomerRepository($this->dbh);
        $customers = $customerRepo->getCustomers($customerName);
        return $customers;
    }

    public function updateCustomer($params)
    {
        try {
            $customerRepo = new CustomerRepository($this->dbh);
            $customerRepo->updateCustomer($params);

            $result['status'] = 'success';
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function deleteCustomer($id)
    {
        try {
            $customerRepo = new CustomerRepository($this->dbh);
            $customerRepo->setInactive($id);

            $result['inactiveId'] = $id;
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function getCustomerOptions($customerName)
    {
        $customerRepo = new CustomerRepository($this->dbh);
        $customers = $customerRepo->getCustomerOptions($customerName);
        return $customers;
    }

    public function getCustomer($id)
    {
        $customerRepo = new CustomerRepository($this->dbh);
        return $customerRepo->getCustomer($id);
    }
}
