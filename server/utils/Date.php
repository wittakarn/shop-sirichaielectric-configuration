<?php  
    function formatToDmy($date) {
        return preg_replace("/(\d+)\D+(\d+)\D+(\d+)/","$3/$2/$1",$date);
    }

    function convertDmyToYmd($date) {
        $parts = explode('/', $date);
		return $parts[2] . '-' . $parts[1] . '-' . $parts[0];
    }

    function convertDateTimeStringToDbDate($dateTime) {
        return date('Y-m-d', strtotime($dateTime));
    }

    function getMonth($date) {
        $parts = explode('/', $date);
		return $parts[1];
    }

    function getYear($date) {
        $parts = explode('/', $date);
		return $parts[2];
    }
?>