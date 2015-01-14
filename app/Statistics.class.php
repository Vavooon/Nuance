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
        $statistics = new PaymentStatistics;
        $response['statistics'] = $statistics->getStatistics();
    }

}