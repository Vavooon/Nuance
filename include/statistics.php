<?php



class PaymentStatistics
{


  //$data=array()

  private function calculateStatistics()
  {
  }

  private function getCoveredMonths()
  {
    $moneyflowTable=new table('moneyflow');

    $rows=$moneyflowTable->load('LIMIT 1');

    if ($rows && count($rows))
    {
      $coveredMonths=array();
      $firstEntry=$rows[0];
      $startDate=new DateTime($firstEntry['date']);
      $currentDate=new DateTime;

      $startDate->modify("midnight");
      $startDate->setDate($startDate->format('Y'), $startDate->format('m'), 1);
      $currentDate->modify("midnight");
      $currentDate->setDate($currentDate->format('Y'), $currentDate->format('m'), 1);

      do
      {
        $coveredMonths[]=clone $startDate;
        $startDate->modify('1 month');
      }
      while ($startDate<=$currentDate);

      return $coveredMonths;
    }
    else
    {
      return false;
    }
  }


  public function getStatistics()
  {
    
    global $sessionId;
    $data=array(
      "total" => 0,
      "bymonth" => array()
    );
    $masterTable=new table('master');
    $master=$masterTable->loadById($sessionId);
    $permittedCities = $master['city'];
    $permittedStreets = $master['street'];
    $permittedGroups = $master['usergroup'];
    
    foreach ($this->getCoveredMonths() as $month)
    {
      $monthAsText=$month->format('Y-m');
      
      $cacheFilename = 'paymentstats-'.$monthAsText;
      if (pluginExists('grouprestrict') && $permittedGroups) 
      {
        $cacheFilename .= '-group('.join($permittedGroups, '_').')';
      }
      $cacheFilename .= '.txt';
      $cache=new StatisticsCache($cacheFilename);
      $cache->month=$month;
      $monthData= json_decode($cache->get(), true);
      $data['total'] += $monthData['total'];
      $data['bymonth'][$monthAsText]=$monthData;


    }

    return $data;
  }
}

?>
