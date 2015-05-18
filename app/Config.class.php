<?php

class Config
{

    function __construct()
    {
        global $db;
        $this->db = $db;
        $this->data = $this->load();
    }



    public function getValue($typeAsStr, $path, $ownerid, $name)
    {
      $storedValue = $this->getStoredValue($typeAsStr, $path, $ownerid, $name);
      if ($storedValue!==NULL) {
        return $storedValue;
      }

      $defaultValue = $this->getDefaultValue($typeAsStr, $path, $ownerid, $name);
      if ($defaultValue !== NULL) {
        return $defaultValue;
      }

      return NULL;
    }
    private function getStoredValue($typeAsStr, $path, $ownerId, $name)
    {
      switch ($typeAsStr)
      {
          case 'system':
          case 'var':
              $ownerId = 0;
              break;
      }
      if (array_key_exists($typeAsStr, $this->data) &&
          array_key_exists($ownerId, $this->data[$typeAsStr]) &&
          array_key_exists($path, $this->data[$typeAsStr][$ownerId]) &&
          array_key_exists($name, $this->data[$typeAsStr][$ownerId][$path])) {
          return $this->data[$typeAsStr][$ownerId][$path][$name];
      }
      return NULL;
    }

    private function getDefaultValue($typeAsStr, $path, $ownerid, $name)
    {
      global $default;
      if (array_key_exists($typeAsStr, $default) &&
          array_key_exists($path, $default[$typeAsStr]) &&
          array_key_exists($name, $default[$typeAsStr][$path])) {
        return $default[$typeAsStr][$path][$name];
      }
      return NULL;
    }



    function setValue($typeAsStr, $path, $ownerId, $vartype, $name, $value)
    {
      global $db;
      $currentValue = $this->getStoredValue($typeAsStr, $path, $ownerId, $name);
      if ($currentValue !== $value) {
        $types = array('system', 'user', 'router', 'var', 'subscriber');
        $type = array_search($typeAsStr, $types);
        switch ($type)
        {
            case 0:
            case 3:
                $ownerId = 0;
                break;
        }
        if ($currentValue === NULL) { // Value is not in DB

          $this->setStoredValue($typeAsStr, $path, $ownerId, $vartype, $name, $value);
          $insertString = "INSERT INTO `" . DB_TABLE_PREFIX . "config` (type, path, ownerid, vartype, name, value) VALUES (?, ?, ?, ?, ?, ?)";
          $stmt = $db->prepare($insertString);
          $stmt->execute(array($type, $path, $ownerId, $vartype, $name, $value));
        }
        else if ($value === NULL) {
          //Skip this case
        }
        else { // Value exists in base and should be updated
          //$selStr = "SELECT * FROM `" . DB_TABLE_PREFIX . "config` WHERE type='$type' AND path='$path' AND name LIKE '".mres(mres($name))."' AND ownerid=$ownerId";
          //$updStr = "UPDATE `" . DB_TABLE_PREFIX . "config` SET value='?', vartype='?' WHERE id=?";
          $updStr = "UPDATE `" . DB_TABLE_PREFIX . "config` SET value=:value, vartype=:vartype WHERE type=:type AND path=:path AND name LIKE :name AND ownerid=:ownerid";
          $stmt = $db->prepare($updStr);
          $stmt->execute(
            array(
              'value' => $value, 
              'vartype' => $vartype, 
              'type' => $type, 
              'path' => $path,
              'name' => $name, 
              'ownerid' => $ownerId
          ));


          /*
          if (count($sqlResult) > 1) // Remove duplicates
          {
              for ($i = 1; $i < count($sqlResult); $i++)
              {
                  $remStr = "DELETE FROM `" . DB_TABLE_PREFIX . "config` WHERE id=" . $sqlResult[$i]['id'];
                  $db->query($remStr);
              }
          }
          */
        }
      }
    }

    private function setStoredValue($typeAsStr, $path, $ownerid, $valueType, $name, $value)
    {
      if (array_key_exists($typeAsStr, $this->data) &&
          array_key_exists($path, $this->data[$typeAsStr]) &&
          array_key_exists($name, $this->data[$typeAsStr][$path])) {

          $value = $this->convertValueToType($valueType, $value);
          $this->data[$typeAsStr][$path][$name] = $value;
      }
    }

/*
    function setValue($typeAsStr, $path, $ownerId, $vartype, $name, $value)
    {
        global $db;
        $success = false;
        $types = array('system', 'user', 'router', 'var', 'subscriber');
        $type = array_search($typeAsStr, $types);
        if ($type === false)
            return;
        switch ($type)
        {
            case 0:
            case 3:
                $ownerId = 0;
                break;
        }
        $selStr = "SELECT * FROM `" . DB_TABLE_PREFIX . "config` WHERE type='$type' AND path='$path' AND name LIKE '".mres(mres($name))."' AND ownerid=$ownerId";
        $resp = $db->query($selStr);
        $oldValue = NULL;
        if ($resp)
        {
            $sqlResult = $resp->fetchAll();
            if (count($sqlResult))
            {
                $configId = $sqlResult[0]['id'];
                $oldValue = $sqlResult[0]['value'];

                $updStr = "UPDATE `" . DB_TABLE_PREFIX . "config` SET value=?, vartype=? WHERE id=?";
                $stmt = $db->prepare($updStr);
                $stmt->execute(array($value, $vartype, $configId));
                if (count($sqlResult) > 1)
                {
                    for ($i = 1; $i < count($sqlResult); $i++)
                    {
                        $remStr = "DELETE FROM `" . DB_TABLE_PREFIX . "config` WHERE id=" . $sqlResult[$i]['id'];
                        $db->query($remStr);
                    }
                }
            }
            else
            {
                $insertString = "INSERT INTO `" . DB_TABLE_PREFIX . "config` (type, path, ownerid, vartype, name, value) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $db->prepare($insertString);
                $stmt->execute(array($type, $path, $ownerId, $vartype, $name, $value));
            }
            $success = true;
        }
        $configTree = array(
            $type =>
            array(
                $ownerId =>
                array(
                    $path =>
                    array(
                        $name => $value
                    )
                )
            )
        );
        if ($oldValue === NULL)
        {
            $oldValue = configgetdefaultvalue($typeAsStr, $path, $ownerId, $name);
        }
        $configPath = "$type/$ownerId/$path/$name";
        onConfigEdit($configPath, $value, $oldValue);
        return $success;
    }

 */

    public function set($params)
    {
    }

    public function remove()
    {
    }
    public function getConfig()
    {
      return $this->data;
    }
    private function convertValueToType($type, $value) {
      switch ($type)
      {
          case 'int': $value = intval($value);
              break;
          case 'json': $value = json_encode($value);
              break;
          case 'array': $value = implode(',', $value);
              break;
          case 'bool': $value = ($value == "true") ? true : false;
              break;
      }
      return $value;
    }

    private function load()
    {
      global $db;
        $types = array('system', 'user', 'router', 'var', 'subscriber');
        $reqStr = "SELECT * FROM `" . DB_TABLE_PREFIX . "config`";
        $res = $db->query($reqStr)->fetchAll();
        $data = array(
            "system" => array(),
            "user" => array(),
            "router" => array(),
            "var" => array(),
            "subscriber" => array()
        );
        foreach ($res as $row)
        {
            $type = $types[$row['type']];
            $path = $row['path'];
            $name = $row['name'];
            $value = $row['value'];
            $owner = $row['ownerid'];
            if (!array_key_exists($owner, $data[$type]))
                $data[$type][$owner] = array();
            if (!array_key_exists($path, $data[$type][$owner]))
                $data[$type][$owner][$path] = array();
            switch ($row['vartype'])
            {
                case 'int': $value = intval($value);
                    break;
                case 'json': $value = json_decode($value);
                    break;
                case 'array': $value = explode(',', $value);
                    break;
                case 'bool': $value = ($value == "true") ? true : false;
                    break;
            }
            $data[$type][$owner][$path][$name] = $value;
        }
        return $data;
    }

}
