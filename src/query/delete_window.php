<?php
require_once '../define.php';
require_once '../connect.php';

$id = $_GET['id'];
$connect = new DB_connect(SERVER,USER,PASS,DB);
$connect->deleteRow('windows','id=\''.$id.'\'');
$connect->deleteRow('channels','window=\''.$id.'\'');