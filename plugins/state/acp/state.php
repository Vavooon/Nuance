<?php

class state
{

    public function get()
    {
        global $response;
        if (isset($_GET['id']))
        {
            $cacheFileName = 'routerstate-' . $_GET['id'] . '.txt';
        }
        else
        {
            $cacheFileName = 'routersstate.txt';
        }

        $cache = new RouterStateCache($cacheFileName);
        $result = $cache->get((isset($_GET['force']) && $_GET['force'] === 'true'));
        if (gettype($result) === 'string')
        {
            $response['state'] = json_decode($result);
        }
        else
        {
            $response['state'] = $result;
        }
    }

}

$router->map('GET', '/state/get', function ($params)
{
    $db = new state($params);
    $db->get($params);
}
);