<?php

require_once '../../config.php';
require_once DOCUMENT_ROOT.'server/business/SitemapsBusiness.php';

$response = array();
$business = new SitemapsBusiness();
echo $business->generateSitemaps();
