<?php
require_once '../define.php';
require_once '../connect.php';
require_once '../check_functions.php';


$name = translit($_GET['name']);
$connect = new DB_connect(SERVER,USER,PASS,DB);

$values = array($name);
$columns = array('name');
$insert = $connect->insertRow('windows',$columns,$values);

$id=$connect->getRows("SELECT last_insert_id()");
echo $id[0]['last_insert_id()'];