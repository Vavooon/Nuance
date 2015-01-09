<?php

class PaymentStatistics
{
    
    private function getCoveredMonths()
    {
        $moneyflowTable = new Table('moneyflow');

        $rows = $moneyflowTable->load('LIMIT 1');

        if ($rows && count($rows))
        {
            $coveredMonths = array();
            $firstEntry = $rows[0];
            $startDate = new DateTime($firstEntry['date']);
            $currentDate = new DateTime;

            $startDate->modify("midnight");
            $startDate->setDate($startDate->format('Y'), $startDate->format('m'), 1);
            $currentDate->modify("midnight");
            $currentDate->setDate($currentDate->format('Y'), $currentDate->format('m'), 1);

            do
            {
                $coveredMonths[] = clone $startDate;
                $startDate->modify('1 month');
            }
            while ($startDate <= $currentDate);

            return $coveredMonths;
        }
        else
        {
            return false;
        }
    }

    public function getStatistics()
    {
        $data = array(
                "total" => 0,
                "bymonth" => array()
        );

        foreach ($this->getCoveredMonths() as $month)
        {
            $monthAsText = $month->format('Y-m');

            $cache = new StatisticsCache('paymentstats-' . $monthAsText . '.txt');
            $cache->month = $month;
            $monthData = json_decode($cache->get(), true);
            $data['total'] += $monthData['total'];
            $data['bymonth'][$monthAsText] = $monthData;
        }

        return $data;
    }

}

?>