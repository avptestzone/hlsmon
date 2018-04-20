<?php
require_once 'define.php';
require_once 'connect.php';
require_once 'twig.php';

if(isset($_GET['window'])){
   	$current_window=$_GET['window'];
}
else {
    $current_window=1000000; 
} 

$connect = new DB_connect(SERVER,USER,PASS,DB);
$windows_list = $connect->getRows('SELECT * FROM windows' );
$channels_list = $connect->getRows('SELECT name,full_name,url FROM channels WHERE window=? ORDER BY full_name',$current_window);
echo $twig->render('flash.html',array('channels_list' => $channels_list,'current_window' => $current_window,'windows_list' => $windows_list));
