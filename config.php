<?php
define('HOST_NAME', 'localhost');
define('COOKIE_AVAILABLE_PATH', '/');
define('MAIN_APP_ROOT', '/sirichaielectric-configuration');
define('ROOT', '/sirichaielectric-configuration/');
define('DOCUMENT_ROOT', realpath($_SERVER['DOCUMENT_ROOT']).ROOT);
define('APP_DOMAIN', $_SERVER['HTTP_HOST']);
define('WEB_ROOT', 'http://'.APP_DOMAIN.ROOT);
define('SHOP_URL', WEB_ROOT);
define('SHOP_CONFIG_URL', WEB_ROOT);
define('MAIN_PATH', realpath($_SERVER['DOCUMENT_ROOT']).MAIN_APP_ROOT);
define('IMAGE_PATH', MAIN_PATH . '/image');
define('PDF_PATH', MAIN_PATH . '/pdf');
define('SHOW_HIDDEN_PAGE', 'true');
define('REFRESH_DELAY', 61);

//3600 is one hour.
define('SESSION_MAX_LIFE_TIME', 3600);

$tenDays = 60*60*24*10;
define('COOKIES_ALIVE', $tenDays);

define('THAI_VAT', 7);
define('QUOTATION_AVAILABLE', 'false');
?>