<?php
require_once '../define.php';
require_once '../connect.php';

$channel = $_GET['channel'];

$connect = new DB_connect(SERVER,USER,PASS,DB);
$log_query = $connect->getRows("SELECT * FROM log WHERE channel='$channel' ORDER BY time DESC LIMIT 100");

foreach ($log_query as $log_entry) {
	$t=$log_entry['time'];
	$n=$log_entry['note'];
    
    if(strstr($n,'Ошибка')){
        echo "<font color='red'>[$t]  $n</font></br>";	
    }
    else{

    }
    echo "[$t]  $n</br>";  	
}  