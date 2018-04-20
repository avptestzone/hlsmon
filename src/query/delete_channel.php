<?php
require_once '../define.php';
require_once '../connect.php';

$channel_name = $_POST['name'];
$connect = new DB_connect(SERVER,USER,PASS,DB);
$connect->deleteRow('channels','name=\''.$channel_name.'\'');
