<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'connection.php';
require_once DOCUMENT_ROOT . 'server/repository/MenuGroupRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductGroupRepository.php';
require_once DOCUMENT_ROOT . 'server/repository/ProductRepository.php';

class SitemapsBusiness
{
    private $dbh;

    public function __construct()
    {
        $this->dbh = DataBaseConnection::createConnect();
    }

    public function generateSitemaps()
    {
        $urls = array();
        $menuGroupRepo = new MenuGroupRepository($this->dbh);

        foreach ($menuGroupRepo->getAllMenuGroups() as $menuGroup) {
            array_push($urls, '<![CDATA[' . SHOP_URL . 'category/' . $menuGroup['group_name_search'] . ']]>');
        }

        $productGroupRepo = new ProductGroupRepository($this->dbh);
        foreach ($productGroupRepo->getAllProductGroups() as $productGroup) {
            array_push($urls, '<![CDATA[' . SHOP_URL . 'category/' . $productGroup['group_name_search'] . ']]>');
        }

        $productRepo = new ProductRepository($this->dbh);
        foreach ($productRepo->getAvailableProducts() as $product) {
            array_push($urls, '<![CDATA[' . SHOP_URL . 'product/' . $product['product_url_name'] . ']]>');
        }

        $sitemapFile = fopen(MAIN_PATH . "/sitemaps.xml", "w") or die("Unable to open file!");
        fwrite($sitemapFile, "<?xml version='1.0' encoding='UTF-8'?>");
        fwrite($sitemapFile, "<sitemapindex xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>");

        $currentDate = date('Y-m-d');
        foreach ($urls as $url) {
            fwrite($sitemapFile, '<sitemap><loc>' . $url . '</loc><lastmod>' . $currentDate . '</lastmod></sitemap>');
        }

        fwrite($sitemapFile, "</sitemapindex>");
        fclose($sitemapFile);

        return "Sitemap has been updated";
    }
}
