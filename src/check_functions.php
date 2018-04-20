<?php
function check_tech_name($name) {
    $e ='';
    
    if ($name == ''){
        $e = 'Не указано техническое имя<br/>';
        return $e;
    }

    if (preg_match('/[^a-zA-z\d_]/', $name)){
        $e .= 'Техническое название может содержать только латинский алфавит, цифры и нижнее подчеркивание<br/>';
    }

    if (preg_match('/^[^a-zA-z].*/', $name)){
        $e .= 'Техническое название должно начинаться с буквы<br/>';
    }

    return $e;
}

function check_full_name($name) {
    $e ='';

    if ($name == ''){
        $e = 'Не указано название канала<br/>';
        return $e;
    }

    return $e;
}

function check_url($uri) {
    $e ='';
    
    if ($uri == ''){
        $e = 'Не указан URL<br/>';
        return $e;
    }

    if (!preg_match('/^(http|https|ftp):\/\/[A-Z0-9][A-Z0-9_\.()\/:-]*$/i', $uri)){
        $e .= 'Некорректный URL<br/>';
    }   
    
    return $e;  
}

function translit($s) {
  $s = (string) $s; 
  $s = strip_tags($s); 
  $s = trim($s); 
  $s = preg_replace("/\s+/", '_', $s); 
  $s = mb_strtolower($s,'UTF-8');  
  
  $s = strtr($s, array('а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'j','з'=>'z','и'=>'i','й'=>'y','к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f','х'=>'h','ц'=>'c','ч'=>'ch','ш'=>'sh','щ'=>'shch','ы'=>'y','э'=>'e','ю'=>'yu','я'=>'ya','ъ'=>'','ь'=>''));
  $s = preg_replace("/[^0-9a-z_]/i", "", $s); 
  $s = preg_replace("/^[^a-z]*/i", "", $s);
  return $s; // возвращаем результат
}
