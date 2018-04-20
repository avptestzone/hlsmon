<?php
require_once '../define.php';
require_once '../connect.php';

$channel = $_GET['channel'];
$note = $_GET['note'];

$connect = new DB_connect(SERVER,USER,PASS,DB);

$values = array($channel,$note);
$columns = array('channel','note');
$insert = $connect->insertRow('log',$columns,$values);

if ($insert == 'done') {
    $done = 'Канал успешно добавлен<br/>';
}
else {
    $error=$insert;
}        
