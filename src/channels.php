<?php
require_once 'define.php';
require_once 'connect.php';
require_once 'twig.php';
require_once 'check_functions.php';


$connect = new DB_connect(SERVER,USER,PASS,DB);
$error='';
$done='';
if (isset($_GET['full_name']) and isset($_GET['ch_url']) and isset($_GET['ch_window'])){

    $error .= check_full_name($_GET['full_name']);
    $error .= check_url($_GET['ch_url']);
    
    if ($error == '') {
        $name = translit($_GET['full_name']);
        $name_query = $connect->getRows("SELECT * FROM channels WHERE name LIKE '$name%'");

        if (count($name_query) != 0) {
            $num = count($name_query)+1;
            $name = $name.$num; 
        }

        $values = array($name,$_GET['full_name'],$_GET['ch_url'],$_GET['ch_window']);
        $columns = array('name','full_name','url','window');
        $insert = $connect->insertRow('channels',$columns,$values);

        if ( $insert == 'done') {
            $done = 'Канал успешно добавлен<br/>';
        }
        else {
            $error=$insert;
        }
        
        header ('Location: channels.php');  
        exit();
    }

}

$windows_list = $connect->getRows('SELECT * FROM windows' );
$channels_list = $connect->getRows('SELECT * FROM channels ORDER BY window,full_name'); 
echo $twig->render('channels.html',array('channels_list' => $channels_list,'error' => $error,'done' => $done, 'windows_list' => $windows_list));
