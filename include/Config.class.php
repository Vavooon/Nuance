<?php

class Config
{
	public function get()
	{
    global $default, $response;
    $response['config']['defaults']=$default;
    $response['config']['data']=configlist();
    //$response->success=true;
	}
  public function set($params)
  { 
    global $sessionId, $response;
    d($params);
    $type=$_POST['type'];
    if ( checkPermission($sessionId,  array('preference', $type) ) ||
         $type==='user')
    {
      switch ($type)
      {
        case 'system':
        $ownerid=0;
        break;

        case 'user':
        $ownerid=$sessionId;
        break;

        case 'router':
        case 'subscriber':
        $ownerid=$_GET['ownerid'];
        break;
      }
      $vartype=isset($_POST['vartype']) ? $_POST['vartype'] : 'string';
      configsetvalue($type,  $_POST['path'], $ownerid,  $vartype, $_POST['name'], $_POST['value']);
      $response['config']['data'] =
      array(
        $type => 
        array(
          $ownerid =>
            array(
              $_POST['path'] =>
              array(
                $_POST['name'] => $_POST['value']
              )
            )
        )
      );
    }
  }
  public function remove()
  {
  }
}

?>
