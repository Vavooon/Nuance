<?php

function starts_with_lower($str) {
    $chr = substr ($str, 0, 1);
    return strtoupper($chr) != $chr;
}

class schemacompare
{
  private $file;
  public function __construct($fileName="../db.sql")
  {
    if (file_exists($fileName))
    {
      $this->file=file_get_contents($fileName);
    }
  }
  public function getSchema()
  {
    global $db;
    $schemaArray=array();

    // Load current tables
    $query="SHOW TABLES LIKE '".DB_TABLE_PREFIX."%'";
    $res=$db->query($query);

    $rows=$res->fetchAll();
    
    $currentSchema=array();
    for ($i=0; $i<count($rows); $i++)
    {
      $tableName=$rows[$i][key($rows[$i])];
      $tableQuery="SHOW FULL FIELDS FROM `".$tableName."`";
      $tableRes=$db->query($tableQuery);
      $tableRows=$tableRes->fetchAll();
      $currentSchema[$tableName]=$tableRows;
    }
    array_push($schemaArray, $currentSchema);


    // Load dump


    $fileParts=explode( ";", $this->file);
    $createParts=array();
    for ($i=0; $i<count($fileParts); $i++)
    {
      if (strpos($fileParts[$i], "CREATE")===2)
      {
        array_push($createParts, $fileParts[$i]);
      }
    }

    $dumpSchema=array();
    // Enumerate tables
    for ($i=0; $i<count($createParts); $i++)
    {
      $rows=explode( "\n", $createParts[$i]);
      preg_match('/`(.+)`/', $rows[1], $res);
      $tableName=$res[1];
      $fields=array();
      // Enumerate columns
      for ($d=2; $d<count($rows)-2; $d++)
      {
        $field=array();
        $row=$rows[$d];
        $firstChar='';
        for ($c=0; $c<strlen($row); $c++)
        {
          if ($row[$c]!==' ')
          {
            $firstChar=$row[$c];
            break;
          }
        }
        if ($firstChar!=="`")
        {
          break;
        }

        preg_match('/`(.+)`/', $row, $fieldName);
        $fieldName=$fieldName[1];
        
        $fieldDetails=substr(strrchr($row, '`'), 2, -2);

        $details=explode(' ', $fieldDetails);

        $type=array();
        $extra=array();
        $comment='';
        $null="YES";
        $default=null;
        $collation=null;

        $typeAdded=false;

        $k=0;
        while ($word=array_shift($details))
        {
          if (starts_with_lower($word) && (!$typeAdded || $k==1) )
          {
            $typeAdded=true;
            $type[]=$word;
          }
          else if (strpos("NOT", $word)===0)
          {
            $word=array_shift($details);
            $null='NO';
          }
          else if (strpos("CHARACTER", $word)===0)
          {
            $word=array_shift($details);
            $word=array_shift($details);
            $collation=$word;
          }
          else if (strpos("NULL", $word)===0)
          {
            $null='YES';
          }
          else if (strpos("DEFAULT", $word)===0)
          {
            $word=array_shift($details);
            if (substr($word, 0, 1)==="'")
            {
              $default=substr($word, 1, -1);
            }
            else if ($word!=='NULL')
            {
              $default=$word;
            }
          }
          else if (strpos("COMMENT", $word)===0)
          {
            $word=array_shift($details);
            $comment=substr($word, 1, -1);
          }
          else if ($word==='ON')
          {
            $word=array_shift($details);
            $extra[]='on update';
          }
          else if ($word==='AUTO_INCREMENT')
          {
            $extra[]='auto_increment';
          }
          else
          {
            $extra[]=$word;
          }
          $k++;
        }

        $field['Field']=$fieldName;
        $field['Type']=join(' ', $type);
        $field['Extra']=join(' ', $extra);;
        $field['Null']=$null;
        $field['Collation']=$collation;
        $field['Default']=$default;
        $field['Comment']=$comment;



        array_push($fields, $field);
      }
      $dumpSchema[$tableName]=$fields;
      
    }
    array_push($schemaArray, $dumpSchema);

    return $schemaArray;
  }
	
}

?>
