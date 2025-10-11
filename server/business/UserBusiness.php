<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../../config.php';
require_once DOCUMENT_ROOT . 'connection.php';
require_once DOCUMENT_ROOT . 'server/repository/UserRepository.php';

class UserBusiness
{
    private $dbh;
    
    public function __construct()
    {
        $this->dbh = DataBaseConnection::createConnect();
    }

    public function verifySignin($post)
    {
        $param = json_decode($post['data'], true);
        $userRepo = new UserRepository($this->dbh);
        $user = $userRepo->getUser($param['username']);

        if ($user && $user['password'] == $param['password']) {
            $user['password'] = ''; // remove sensitive data.
            return $user;
        }
        return null;
    }

    public function getUser($email)
    {
        $userRepo = new UserRepository($this->dbh);
        return $userRepo->getUser($email);
    }
}
