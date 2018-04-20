<?php
//mysql_set_charset('UTF-8');

class DB_connect {                        
    public $datab;

        public function __construct($host, $user, $pass, $db){
            $this->datab=new mysqli($host, $user, $pass, $db);            
            if ($this->datab->connect_error) {
            	die('connect_error : '.$this->datab->connect_error." Error Number : ".$this->datab->connect_errno); 
            }
        }
 
        public function getRows($query, $param='none'){
            $stmt = $this->datab->prepare($query);
            if ($param!='none'){
                $stmt->bind_param('i', $param);    
            }
            $stmt->execute();
            $result = $stmt->get_result();
            $rows=array();

            while ($row = $result->fetch_assoc()){
                $rows[]=$row;  
            }

            return $rows;
        }

        public function createTable($tableName,$values){
            $stmt = $this->datab->prepare('CREATE TABLE IF NOT EXISTS '.$tableName.'('.$values.')');
            $stmt->execute();
            return true;
        }

        public function insertRow($tableName,$columns,$values){
            $values =  implode("','",$values);
            $columns =  implode(",",$columns);

            $stmt = $this->datab->prepare('INSERT INTO '.$tableName.' ('.$columns.') VALUES ('.'\''.$values.'\')');
            $stmt->execute();
            
            if ($stmt->errno) {
                return 'Insert Error (' . $stmt->errno . ') ' . $stmt->error;
            }
            else {
                return 'done';	
            }
            
        }

        public function updateRow($tableName,$columns,$values,$condition){
            for($i=0; $i<count($columns); $i++)  {             
                $stmt = $this->datab->prepare('UPDATE '.$tableName.' SET '.$columns[$i].'=\''.$values[$i].'\' WHERE '.$condition);
                $stmt->execute(); 
            } 
            
            if ($stmt->errno) {
                return 'Insert Error (' . $stmt->errno . ') ' . $stmt->error;
            }
            else {
                return 'done';  
            }
        }

        public function deleteRow($tableName,$condition){
            $stmt = $this->datab->prepare("DELETE FROM ".$tableName." WHERE ".$condition);
            $stmt->execute(); return true;
        }

        public function dropTable($tableName){
            $stmt = $this->datab->prepare('DROP TABLE '.$tableName);
            $stmt->execute();
            echo $stmt->error;
            return true;
        }
}

?>
