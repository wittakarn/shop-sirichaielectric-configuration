<?php

function handlePermission()
{    
    $requestUrl = $_SERVER['REQUEST_URI'];
    if (strpos($requestUrl, '/mpa/') > 0) {
        return;
    }
    $signinLink = 'spa/login/signin';
    $re = strpos($requestUrl, $signinLink);
    if (!isset($_SESSION['user']) && strpos($requestUrl, $signinLink) == false) {
        header('Location: ' . WEB_ROOT . 'spa/login/signin');
        exit;
    }
}