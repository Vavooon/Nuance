<?php

class Statistics
{

    function __construct()
    {
        global $response;
        if (!isset($response['statistics']))
        {
            $response['statistics'] = array();
        }
        $this->response = $response;
    }

    public function get($params)
    {
        global $response;
        require_once '../../app/statistics.php';
        $statistics = new PaymentStatistics;
        $response['statistics'] = $statistics->getStatistics();
    }

}