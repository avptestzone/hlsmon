<?php
require_once '../define.php';
require_once '../connect.php';

$connect = new DB_connect(SERVER,USER,PASS,DB);
$windows_query = $connect->getRows("SELECT * FROM windows");
echo "<select>";

foreach ($windows_query as $window) {
    $id=$window['id'];
    $name=$window['name'];
    echo "<option value='$id'>$name</option>"; 
}  

echo "</select>";