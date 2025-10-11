<?php

class UserRepository
{
	private $dbh;
	
	public function __construct($conn) {
		$this->dbh = $conn;
	}
	
	public function getUser($userName){
        $query = "SELECT * FROM user u ";
		$where = "WHERE u.email = :email";
		$stmt = $this->dbh->prepare($query.$where); 
		$stmt->bindParam(":email", $userName, PDO::PARAM_STR);

		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>