<?php

class ConfigProxy
{

    public function get()
    {
        global $default, $response;
        global $config;
        $response['config']['defaults'] = $default;
        $response['config']['data'] = $config->getConfig();
        //$response->success=true;
    }

    public function set($params)
    {
        global $sessionId, $response, $config;
        $type = $_POST['type'];
        if (checkPermission($sessionId, array('preference', $type)) ||
                $type === 'user')
        {
            switch ($type)
            {
                case 'system':
                    $ownerid = 0;
                    break;

                case 'user':
                    $ownerid = $sessionId;
                    break;

                case 'router':
                case 'subscriber':
                    $ownerid = $_POST['ownerid'];
                    break;
            }
            $vartype = isset($_POST['vartype']) ? $_POST['vartype'] : 'string';
            $config->setValue($type, $_POST['path'], $ownerid, $vartype, $_POST['name'], $_POST['value']);
            $response['config']['data'] = array(
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
