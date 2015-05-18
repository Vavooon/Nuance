<?php

class Table
{

    public $header = array();
    protected $name;
    private $logging;
    private $db;
    public $response;

    public function __construct($name)
    {
        global $db;
        global $loggedTables;
        global $response;
        $this->name = $name;
        $this->response = & $response;

        //if (!count($this->response['db'][$this->name]['header'])) $this->response['db'][$this->name]['header']=getFields($this->name);
        $this->header = getFields($this->name);
        if (array_key_exists($this->name, $loggedTables))
        {
            $this->logging = true;
        }
        $this->db = $db;
        $this->fields = getFieldsAssoc($this->name);
    }

    public function addSchemaToResponse()
    {
        if (!isset($this->response['db'][$this->name]))
        {
            $this->response['db'][$this->name] = array(
                'header' => $this->header,
                'data' => array(),
                'sortOrder' => array(),
                'deleted' => array()
            );
            $this->tableResponse = & $this->response['db'][$this->name];
        }
        //$this->tableResponse['data']=array();
    }

    public function setLogging($b)
    {
        $this->logging = !!$b;
    }

    public function load($filter = "")
    {
        global $timeDateFormat;
        global $dateFormat;
        if (substr($filter, -1) === '=')  //Check wrong ID condition like 'WHERE id='
        {
            throw new Exception("MYSQL: wrong request");
        }
        //$this->tableResponse['success']=true;
        $query = "SELECT * FROM `" . DB_TABLE_PREFIX . $this->name . "` $filter";
        $res = $this->db->query($query)->fetchAll();

        foreach ($res as $id => $row)
        {
            $datarow = array();
            $i = 0;
            foreach ($row as $key => $value)
            {
                switch ($this->header[$i][1])
                {
                    case 'id':
                    case 'int':
                    case 'link':
                    case 'tarifflink':
                    case 'tinyint':
                    case 'bit':
                        {
                            $preparedValue = (int) $value;
                        }
                        break;
                    case 'multilink':
                        {
                            if (strlen($value))
                            {
                                $preparedValue = explode(',', $value);
                            }
                            else
                            {
                                $preparedValue = array();
                            }
                        }
                        break;
                    case 'float':
                    case 'money':
                        {
                            $preparedValue = (float) $value;
                        }
                        break;
                    default:
                        {
                            $preparedValue = $value;
                        }
                        break;
                }
                $row[$key] = $preparedValue;
                $i++;
            }
            $res[$id] = $row;
        }
        return $res;
    }

    public function loadById($id)
    {
        $id = intval($id);
        $row = false;
        if ($id)
        {
            $res = $this->load("WHERE id=$id");
            if (count($res))
            {
                $row = $res[0];
            }
        }
        return $row;
    }

    public function load4AJAX($filter = "")
    {
        global $sessionId, $timeDateFormat, $dateFormat, $response;
        $res = $this->load($filter);
        $this->addSchemaToResponse();
        foreach ($res as $row)
        {
            $datarow = array();
            $i = 0;
            foreach ($row as $key => $value)
            {
                switch ($this->header[$i][1])
                {
                    case 'timestamp':
                        {
                            if ($timestamp = strtotime($value))
                            {
                                $value = date($timeDateFormat, $timestamp);
                            }
                            else
                            {
                                $value = '';
                            }
                        }
                        break;
                    case 'date':
                        {
                            if ($timestamp = strtotime($value))
                            {
                                $value = date($dateFormat, $timestamp);
                            }
                            else
                            {
                                $value = '';
                            }
                        }
                        break;
                }

                if (checkPermission($sessionId, array('table', $this->name, 'read', $key)) || $key === 'id')
                {
                    $datarow[] = $value;
                }
                else
                {
                    $datarow[] = '';
                }
                $i++;
            }
            $response['db'][$this->name]['data'][$row['id']] = $datarow;
        }
        if (isset($this->fields['date'])) {
          if ($filter)
          {
            $res = $this->load('LIMIT 1 ');
          }
          if (count($res)  ) {
            $response['db'][$this->name]['firstRowDate'] = $res[0]['date'];
          }
        }
    }

    private function convert($data)
    {
        foreach ($data as $key => $value)
        {
            $type = $this->fields[$key][1];
            switch ($type)
            {
                case 'tinyint':
                    {
                        if (filter_var($value, FILTER_VALIDATE_BOOLEAN))
                        {
                            $data[$key] = 1;
                        }
                        else
                        {
                            $data[$key] = 0;
                        }
                    }
                    break;
                case 'char':
                case 'varchar':
                case 'tinytext':
                case 'text':
                case 'mediumtext':
                case 'longtext':
                case 'timestamp':
                    {
                        $data[$key] = $value;
                    }
                    break;
            }
        }
        return $data;
    }

    private function toString($values)
    {
        foreach ($values as $key => $value)
        {
            $type = $this->fields[$key][3] OR $this->fields[$key][1];
            switch ($type)
            {
                case 'multilink':
                    {
                        $values[$key] = implode(',', $value);
                    }
                    break;
            }
        }
        return $values;
    }

    public function add($data)
    {
        global $addRenderers, $afterAddRenderers, $loggedTables;
        $namesarray = array();
        $valuesarray = array();
        unset($data['id']);
        foreach ($this->header as $key => $value)
        {
            $name = $value[0];
            if (isset($data[$name]) && !strlen($data[$name]))
                unset($data[$name]);
        }
        if (array_key_exists($this->name, $addRenderers))
        {
            $data = $addRenderers[$this->name]($data);
            if ($data === false)
                return false;
        }
        $data = $this->convert($data);
        foreach ($data as $name => $value)
        {
            $namesarray[] = $name;
            $valuesarray[] = ":$name";
        }
        $names = implode('`, `', $namesarray);
        $values = implode(', ', $valuesarray);
        $request = "INSERT INTO `" . DB_TABLE_PREFIX . $this->name . "` (`$names`) VALUES ($values)";
        $res = $this->db->prepare($request);
        $res->execute($data);
        $newId = $this->db->lastInsertId();
        $this->response['debug'][] = $request;
        $this->response['db'][$this->name]['updateMode'] = 'merge';

        if ($newId)
        {
            if ($this->logging)
            {
                if (is_array($loggedTables[$this->name]) && $newId)
                {
                    foreach ($loggedTables[$this->name] as $excludedField)
                    {
                        if (isset($data[$excludedField]))
                        {
                            unset($data[$excludedField]);
                        }
                    }
                }
                if (count($data))
                {
                    logInfo('db', 'add', $this->name, $newId, NULL, $data);
                }
            }

            if (array_key_exists($this->name, $afterAddRenderers))
                $afterAddRenderers[$this->name]($newId, $data);
            //$this->response->success=true;
        }
        $this->addSchemaToResponse();
        $this->load4AJAX("WHERE `id`=" . $newId);
        return $newId;
    }

    public function edit($data)
    {
        global $editRenderers, $afterEditRenderers, $loggedTables;
        $id = $data['id'];
        unset($data['id']);
        $query = '';
        $row = $this->loadById($id);
        if (!$row)
            return;
        $newFields = array();
        $oldFields = array();
        $changedOldFields = array();

        $currentDataAsString = $this->toString($row);
        //$newDataAsString=$this->toString($data);
        $newDataAsString = $data;
        foreach ($currentDataAsString as $key => $currentValue)
        {
            if (isset($newDataAsString[$key]) && $newDataAsString[$key] !== $currentValue)
            {
                $newFields[$key] = $data[$key];
                $changedOldFields[$key] = $currentValue;
            }
            $oldFields[$key] = $currentValue;
        }
        if (array_key_exists($this->name, $editRenderers))
            $newFields = $editRenderers[$this->name]($id, $newFields, $oldFields);
        foreach ($newFields as $key => $value)
        {
            if (!array_key_exists($key, $row))
                unset($newFields[$key]);
        }
        $newFields = $this->convert($newFields);
        foreach ($newFields as $key => $value)
        {
            $query .= "`$key` = :$key, ";
        }
        $query = substr($query, 0, -2);
        $request = "UPDATE `" . DB_TABLE_PREFIX . $this->name . "` SET {$query} WHERE id={$id}";
        $res = $this->db->prepare($request);
        $res->execute($newFields);
        $this->response['db'][$this->name]['updateMode'] = 'merge';

        //$this->response->success=true
        if ($this->logging)
        {
            if (is_array($loggedTables[$this->name]))
            {
                foreach ($loggedTables[$this->name] as $excludedField)
                {
                    if (isset($newFields[$excludedField]))
                    {
                        unset($changedOldFields[$excludedField]);
                        unset($newFields[$excludedField]);
                    }
                }
            }
            if (count($newFields))
            {
                logInfo('db', 'edit', $this->name, $id, $changedOldFields, $newFields);
            }
        }
        $this->addSchemaToResponse();
        $this->load4Ajax("WHERE `id`=" . $id);

        if (array_key_exists($this->name, $afterEditRenderers))
            $afterEditRenderers[$this->name]($id, $newFields, $oldFields);
        foreach ($oldFields as $key => $value)
        {
            if (!isset($newFields[$key]))
                unset($oldFields[$key]);
        }
        return $id;
    }

    public function delete($data)
    {
        global $removeRenderers, $afterRemoveRenderers;
        $id = $data['id'];
        $row = $this->loadById($id);
        $fields = array();
        if ($row)
        {
            foreach ($row as $key => $value)
            {
                $fields[$key] = $value;
            }
        }
        if (array_key_exists($this->name, $removeRenderers))
        {
            $removeRenderers[$this->name]($id, $fields);
        }
        $request = "DELETE FROM `" . DB_TABLE_PREFIX . $this->name . "` WHERE id=$id";
        $this->db->exec($request);
        $this->response['db'][$this->name]['updateMode'] = 'merge';
        if (array_key_exists($this->name, $afterRemoveRenderers))
        {
            $afterRemoveRenderers[$this->name]($id, $fields);
        }
        //$this->response->debug[]=$request;
        if ($this->logging)
        {
            logInfo('db', 'delete', $this->name, $id, $fields);
        }
        $this->addSchemaToResponse();
        $this->response['db'][$this->name]['deleted'][] = $id;
        return $id;
    }

}
