<?php

class DB
{

    function __construct()
    {
        global $response;
        if (!isset($response['db']))
        {
            $response['db'] = array();
        }
        $this->response = $response;
        $this->blockedTables = array(
          "scratchcard",
          "moneyflow",
          "config",
          "order",
          "log"
        );
    }

    public function get($params)
    {
        global $sessionId, $db, $response;
        $name = $params['name'];
        if ($name == '*')
        {
            $tables = array();
            $query = "SHOW TABLES LIKE '" . DB_TABLE_PREFIX . "%'";
            $res = $db->query($query);
            if ($res)
            {
                $allTables = $res->fetchAll();
                foreach ($allTables as $tableName)
                {
                    if (!in_array(current($tableName), $this->blockedTables))
                    {
                        $tables[] = current($tableName);
                    }
                }
            }
        }
        else
        {
            if (tableExists($name))
            {
              $tables = array($name);
            }
        }

        foreach ($tables as $target )
        {
            $filter = isset($params['filter']) ? $params['filter'] : '';
            if (!checkPermission($sessionId, array('table', $target, 'read')))
            {
                $this->response[$target]['header'] = getFields($target);
                $this->response['errors'][] = 'deny';
            }
            else
            {
              $table = new Table($target);
              $filterQuery = '';

              // Apply filters for users
              $masterTable = new Table('master');
              $master = $masterTable->loadById($sessionId);

              $filterQuery = '';
              $filterObject = array();
              if ($filter )
              {
                  $filters = explode(';', $filter);
                  for ($i = 0; $i<count($filters); $i++)
                  {
                    $currentFilter = explode('^', $filters[$i]);
                    $filterName = $currentFilter[0];
                    $filterValues = explode(',', $currentFilter[1]);

                    $filterObject[$filterName] = $currentFilter[1];
                    for ($j = 0; $j < count($filterValues); $j++)
                    {
                      if (preg_match('/([<>]?=?)(.*)/', $filterValues[$j], $filterArray))
                      {
                        if ($i || $j)
                        {
                          $filterQuery .= " AND ";
                        }
                        $filterQuery .= "`" . $filterName . "`" . $filterArray[1] . "'" . $filterArray[2] . "'";
                      }
                    }
                  }
              }

              if (strlen($filterQuery))
              {
                  $filterQuery = "WHERE " . $filterQuery;
              }

              $table->load4AJAX($filterQuery);

              if ($filter)
              {
                  $res = $db->query("SELECT COUNT(*) FROM `" . DB_TABLE_PREFIX . $target . "` " . $filterQuery);
                  $row = $res->fetch();
                  $response['db'][$target]['length'] = intval($row['COUNT(*)']);
                  $response['db'][$target]['filter'] = $filterObject;

              }
              else
              {
                  $response['db'][$target]['length'] = count($response['db'][$target]['data']);
              }

              foreach ($response['db'][$target]['header'] as $key => $value)
              {
                  if ($value[1] === 'timestamp')
                  {
                      $columnName = $value[0];
                      $res = $db->query("SELECT `id` FROM `" . DB_TABLE_PREFIX . $target . "` ORDER BY `" . $columnName . "`");
                      $rows = $res->fetchAll();
                      $response['db'][$target]['sortOrder'][$columnName] = array();
                      for ($j = 0; $j < count($rows); $j++)
                      {
                          $response['db'][$target]['sortOrder'][$columnName][] = $rows[$j]['id'];
                      }
                  }
              }
              $response['errors'] = array_merge($response['errors']);
            }
        }
    }

    private function modify($action, $target)
    {
        global $db, $sessionId, $response;
        $methodAction = substr($action, 2);
        if ($target === 'moneyflow')
        {
            $aclTarget = 'order';
        }
        else
        {
            $aclTarget = $target;
        }
        if (
                tableExists($target) &&
                (isset($_POST['id']) || $action === 'dbadd') &&
                checkPermission($sessionId, array('table', $aclTarget, $methodAction))
        )
        {
            if ($action !== 'dbadd')
            {
                $id = intval($_POST['id']);
            }
            $table = new Table($target);


            $data = array();
            foreach ($_POST as $key => $value)
            {
                $data[$key] = $value;
            }
            // Additional permissions checks for every field
            if ($action === 'dbedit')
            {
                foreach ($data as $key => $value)
                {
                    if ($key !== 'id' && !checkPermission($sessionId, array('table', $target, 'edit', $key)))
                    {
                        unset($data[$key]);
                    }
                }
            }

            // Extract cash difference from user and proceed as moneflow
            if ($target == 'user' && ($action == 'dbedit' || $action == 'dbadd' ) && isset($data['cash']))
            {
                unset($data['cash']);
            }

            switch ($action)
            {
                case 'dbadd':
                    $id = $table->add($data);
                    break;
                case 'dbedit':
                    $id = $table->edit($data);
                    break;
                case 'dbremove':
                    $id = $table->delete($data);
                    break;
            }

            if ($target == 'user' && ($action == 'dbedit' || $action == 'dbadd' ) && isset($_POST['cash']) && checkPermission($sessionId, array('table', $target, 'edit', 'cash')))
            {
                if ($action === 'dbedit')
                {
                    $user = $table->loadById($id);

                    $sum = money($_POST['cash']) - money($user['cash']);
                }
                else
                {
                    $sum = money($_POST['cash']);
                }

                if ($sum)
                {
                    $moneyflowTable = new Table('moneyflow');
                    $moneyflowTable->add(
                            array(
                                "user" => $id,
                                "sum" => $sum,
                                "detailsname" => "adminpay",
                                "detailsid" => $sessionId,
                            )
                    );
                }
                payment(0, $id);
            }

            if ($id)
            {
                $table->load4AJAX(" WHERE id=$id");
            }

            $res = $db->query("SELECT COUNT(*) FROM `" . DB_TABLE_PREFIX . $target . "`");
            $row = $res->fetch();

            foreach ($table->header as $key => $value)
            {
                if ($value[1] === 'timestamp')
                {
                    $columnName = $value[0];
                    $res = $db->query("SELECT `id` FROM `" . DB_TABLE_PREFIX . $target . "` ORDER BY `" . $columnName . "`");
                    $rows = $res->fetchAll();
                    $response['db'][$target]['sortOrder'][$columnName] = array();
                    for ($i = 0; $i < count($rows); $i++)
                    {
                        $response['db'][$target]['sortOrder'][$columnName][] = $rows[$i]['id'];
                    }
                }
            }

            //$response->errors = array_merge($response->errors, $requestErrors);
        }
        else
        {
            if (!checkPermission($sessionId, array('table', $aclTarget, $methodAction)))
            {
                //$response->errors[] = 'deny';
            }
        }
    }

    public function add($params)
    {
        $this->modify('dbadd', $params['name']);
    }

    public function set($params)
    {
        $this->modify('dbedit', $params['name']);
    }

    public function del($params)
    {
        $this->modify('dbremove', $params['name']);
    }

}
