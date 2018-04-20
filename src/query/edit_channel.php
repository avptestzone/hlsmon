<?php
require_once '../define.php';
require_once '../connect.php';
require_once '../check_functions.php';

$error='';

$error .= check_full_name($_POST['full_name']);
$error .= check_url($_POST['url']);

if ($error==''){

	$values = array($_POST['full_name'],$_POST['url'],$_POST['window']);
    $columns = array('full_name','url','window'); 
    $condition = 'name=\''.$_POST['old_name'].'\'';

    $connect = new DB_connect(SERVER,USER,PASS,DB);
    $error = $connect->updateRow('channels',$columns,$values,$condition);
    echo $error;
}
else {
	echo $error;
}


?>