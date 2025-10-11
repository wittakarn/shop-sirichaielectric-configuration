<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'connection.php';
require_once DOCUMENT_ROOT . 'server/repository/QuotationRepository.php';
require_once DOCUMENT_ROOT . 'server/utils/Quotation.php';

class QuotationBusiness
{
    private $dbh;

    public function __construct()
    {
        $this->dbh = DataBaseConnection::createConnect();
    }

    public function createQuotation($params)
    {
        try {
            $this->dbh->beginTransaction();
            $repo = new QuotationRepository($this->dbh);
            $latestQuotNo = $repo->getLatestQuotSequence();

            if (!$latestQuotNo || $latestQuotNo == null) {
                $latestQuotNo = $repo->createQuotNo();
                $nextSequence = $latestQuotNo['sequence'];
            } else {
                $nextSequence = $latestQuotNo['sequence'] + 1;
                $repo->updateQuotNoSequence();
            }

            $quotNo = generateQuotNo($latestQuotNo['year'], $nextSequence);
            $params['quotNo'] = $quotNo;
            $repo->createQuotMast($params);
            $repo->createQuotDetails($params);

            $this->dbh->commit();

            $result['quotNo'] = $quotNo;
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function updateQuotation($params)
    {
        try {
            $this->dbh->beginTransaction();
            $repo = new QuotationRepository($this->dbh);

            $repo->updateQuotMast($params);
            $repo->deleteQuotDetailsByQuotNo($params['quotNo']);
            $repo->createQuotDetails($params);

            $this->dbh->commit();

            $result['quotNo'] = $params['quotNo'];
            return $result;
        } catch (Exception $e) {
            $this->dbh->rollBack();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function getQuotMastsByCustomerId($customerId, $limit)
    {
        $repo = new QuotationRepository($this->dbh);
        $quotMasts = $repo->getQuotMastsByCustomerId($customerId, $limit);
        return $quotMasts;
    }

    public function getPricesFromQuotationInThePast($customerId, $productId, $limit)
    {
        $repo = new QuotationRepository($this->dbh);
        $priceList = $repo->getPricesFromQuotationInThePast($customerId, $productId, $limit);
        return $priceList;
    }

    public function getQuotation($quotNo)
    {
        $repo = new QuotationRepository($this->dbh);
        $quotMast = $repo->getQuotMast($quotNo);
        $quotDetails = $repo->getQuotDetails($quotNo);

        $result['quotMast'] = $quotMast;
        $result['quotDetails'] = $quotDetails;
        return $result;
    }
}
