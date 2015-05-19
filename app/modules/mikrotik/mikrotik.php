<?php
	class mikrotik
	{
		private $connected=false;
		private $API;
		private $id;
    private $db;
		private $notificationaddrlist;
    private $allIpRes = array();
    private $allPppRes = array();
    public $supportQueue;
		public function __construct($ip, $port, $login, $pass, $id=false)
		{
      global $db;
		  if (!class_exists('routeros_api') )require_once('routeros_api.class.php');
      $this->API = new routeros_api();
      $this->messageAddressList='message';
      $this->notificationAddressList='notification';
      $this->API->attempts=2;
      $this->supportQueue=true;
      $this->API->timeout=5;
      $this->API->delay=2;
      $this->API->port=$port;
      $this->db=$db;
      $this->uniqueIdentifier = array(
        "/ip/firewall/address-list" => "address",
        "/ip/dhcp-server/lease" => "address",
        "/ip/arp" => "address"
      );
		  if ($this->API->connect($ip, $login, $pass))
		  {
		    $this->connected=true;
				$this->id=$id;
      }
      else
      {
        addRequestError('cannotconnect');
      }
        
		}
		function __destruct()
		{
      if ($this->connected) $this->API->disconnect();
    }
    public function checkConnection()
    {
      if ($this->connected) 
      {
        $addressList='online';
        $filterArray=array("?list" => $addressList, );
        $resp=$this->API->comm("/ip/firewall/address-list/print", $filterArray);
        $onlineaddr=array();
        foreach ($resp as $rkey => $rvalue) $onlineaddr[]=$rvalue['address'];

        $resp=$this->API->comm("/system/resource/print");
        $resp[0]['online']=$onlineaddr;
        return $resp[0];
      }
    }

    private function apiProxy($path, $data)
    {
        $result = $this->API->comm($path, $data);
        if (count($result))
        {
          d($path, $data, $result);
          //d($path);
        }
    }

    private function groupByField($array, $fieldName)
    {
      global $response;
        $groupedArray = array();
        for ($i=0; $i<count($array); $i++)
        {
          if (isset($groupedArray[ $array[$i][$fieldName] ]))
          {
            $response['errors'][] = 'Duplicate ids was found';
          }
          else 
          {
            $groupedArray[ $array[$i][$fieldName] ] = $array[$i];
          }

        }
        return $groupedArray;
    }

    private function checkRule($sectionKey, $billingRule, $routerRule, $i, $userId)
    {
      if (array_key_exists($i, $billingRule) && array_key_exists($i, $routerRule)) // Check and modify existing rules
      {
        $newRule=$billingRule[$i];
        $currentRule=$routerRule[$i];

        $ruleNeedsUpdate=false;
        $newProperties=array();

        // Compare every property in rule
        foreach ($newRule as $propertyKey => $propertyValue)
        {
          if ($newRule[$propertyKey]!==$currentRule[$propertyKey])
          {
            $ruleNeedsUpdate=true;
            $newProperties[$propertyKey]=$propertyValue;
          }
        }

        if ($ruleNeedsUpdate)
        {
          $newProperties['.id']=$currentRule['.id'];
          $this->apiProxy($sectionKey."/set", $newProperties);
        }

      }
      else if (array_key_exists($i, $routerRule)) // remove other rules
      {
        $currentRule=$routerRule[$i];
        $this->apiProxy($sectionKey."/remove", array('.id' => $currentRule['.id']));
      }
      else // Add new rules
      {
        $newRule=$billingRule[$i];
        $newRule['comment'] = $userId;
        $this->apiProxy($sectionKey."/add", $newRule);
      }
    }

    private function sync($sectionData)
    {
      foreach ($sectionData as $sectionKey => $sectionValue)
      {
        foreach ($sectionValue as $userId => $userData)
        {
					$response = $this->API->comm($sectionKey.'/print',array( '?comment' => $userId));

          if (isset($this->uniqueIdentifier[$sectionKey]))
          {
            $userData = $this->groupByField($userData, $this->uniqueIdentifier[$sectionKey]);
            $response = $this->groupByField($response, $this->uniqueIdentifier[$sectionKey]);

            $keys =  array_unique( array_merge( array_keys($userData), array_keys($response) ) );
            foreach ($keys as $i)
            {
              $this->checkRule( $sectionKey, $userData, $response, $i, $userId);
            }
          }
          else 
          {
            for ($i=0; ($i<count($userData) || $i<count($response)); $i++)
            {
              $this->checkRule( $sectionKey, $userData, $response, $i, $userId);
            }
          }


        }
      }
    }


    private function calculateMikrotikTime($time)
    {
      $timePostfix=array ('h', 'm', 's');
      $mikrotikTime='';

      $timeArray=explode(':', $time);
      for($i=0; $i<count($timeArray); $i++)
      {

        if (intval($timeArray[$i]))
        {
          $mikrotikTime .= intval($timeArray[$i]).$timePostfix[$i];
        }
      }
      if (!$mikrotikTime)
      {
        $mikrotikTime='0s';
      }
      return $mikrotikTime;


    }
    public function checkonline($userid)
    {
      if ($this->connected) return true;
    }
    public function shownotification($userid)
    {
      if ($this->connected)
      {
        if ($devuserres=$this->db->query("SELECT * FROM ".DB_TABLE_PREFIX."user WHERE id='$userid'")->fetchAll())
				{
					$ipRow = $devuserres[0];
					$useraddr=json_decode($ipRow['iplist'],true);
					if (empty($useraddr) || $useraddr==NULL) return false;
          $this->clearnotification($userid);
					foreach ($useraddr as $key => $value)
					{
            $this->API->comm("/ip/firewall/address-list/add", array("list" => $this->notificationAddressList, "address" => $key, "comment" => $ipRow['id'], "disabled" => "no", ));
					}
        }
        return true;
      }
    }
    public function clearnotification($userid=false)
    {
      if ($this->connected)
      {
        $filterArray=array("?list" => $this->notificationAddressList );
        if ($userid) $filterArray['?comment']=$userid;
        $resp=$this->API->comm("/ip/firewall/address-list/print", $filterArray);
        foreach ($resp as $rkey => $rvalue) $this->API->comm("/ip/firewall/address-list/remove", array(".id" => $rvalue['.id'],));
        return true;
      }
    }
    public function showmessage($userid)
    {
      if ($this->connected)
      {
        if ($devuserres=$this->db->query("SELECT * FROM ".DB_TABLE_PREFIX."user WHERE id='$userid'")->fetchAll())
				{
					$ipRow = $devuserres[0];
					$useraddr=json_decode($ipRow['iplist'],true);
					if (empty($useraddr) || $useraddr==NULL) return false;
          $this->hidemessage($userid);
					foreach ($useraddr as $key => $value)
					{
            $this->API->comm("/ip/firewall/address-list/add", array("list" => $this->messageAddressList, "address" => $key, "comment" => $ipRow['id'], "disabled" => "no", ));
					}
        }
        return true;
      }
    }
    public function hidemessage($userid=false)
    {
      if ($this->connected)
      {
        $filterArray=array("?list" => $this->messageAddressList );
        if ($userid) $filterArray['?comment']=$userid;
        $resp=$this->API->comm("/ip/firewall/address-list/print", $filterArray);
        foreach ($resp as $rkey => $rvalue) $this->API->comm("/ip/firewall/address-list/remove", array(".id" => $rvalue['.id'],));
        return true;
      }
    }
    public function getonline()
    {
      if ($this->connected)
      {
        $addressList='online';
        $filterArray=array("?list" => $addressList, );
        $resp=$this->API->comm("/ip/firewall/address-list/print", $filterArray);
        $onlineaddr=array();
        foreach ($resp as $rkey => $rvalue) $onlineaddr[]=$rvalue['address'];
        return $onlineaddr;
      }
    }
    public function getinterfaces()
    {
      if ($this->connected)
      {
        $resp=$this->API->comm("/interface/getall");
        //$response->header=array(array('id', 'varchar'));
        $onlineaddr=array();
        foreach ($resp as $rkey => $rvalue) $onlineaddr[$rvalue['name']]=array($rvalue['name'], $rvalue['name']);
        return $onlineaddr;
      }
    }

    private function getIpRows( $userId ) {
      if ( !isset( $this->allIpRes[ $userId ] ) ) {
        $ipTable = new Table( 'ip' );
        $this->allIpRes[ $userId ] = $ipTable->load( "WHERE `router`=$this->id AND `user`=$userId" );
      }
      return $this->allIpRes[ $userId ];
    }

    private function getPppRows( $userId ) {
      if ( !isset( $this->allPppRes[ $userId ] ) ) {
        $pppTable = new Table( 'ppp' );
        $this->allPppRes[ $userId ] = $pppTable->load( "WHERE `router`=$this->id AND `user`=$userId" );
      }
      return $this->allPppRes[ $userId ];
    }

    public function update( $userId ) {
      $this->updateIp( $userId );
      $this->updatePpp( $userId );
      $this->updateAddressList( $userId );
      return $this->updateQueue( $userId ); //Return connection state

    }


    public function updateAddressList( $userId ) {
    
      $syncData=array(
        "/ip/firewall/address-list" => array()
      );

      foreach ($syncData as $key => $value)
      {
        $syncData[$key][$userId] = array();
      }

      $currentTariff= getCurrentTariff( $userId );
      if ($currentTariff)
      {
        $currentTariff= $currentTariff['detailsid'];
      }
      if ( userIsDisabled( $userId ) )
      {
        $addressList = 'disabled';
      }
      else
      {
        $addressList = $currentTariff ? 'allow' : 'deny';
      }

      $allIpRes = $this->getIpRows( $userId );
      $allPppRes = $this->getPppRows( $userId );


      foreach ( $allIpRes as $ipRow ) {
        $syncData["/ip/firewall/address-list"][$userId][] = array(
          "list" => $addressList,
          "address" => $ipRow['ip']
        );
      }

      foreach ( $allPppRes as $pppRow ) {
        $syncData["/ip/firewall/address-list"][$userId][] = array(
          "list" => $addressList,
          "address" => $pppRow['remoteip']
        );
      }

      $this->sync($syncData);

      return $this->checkConnection();
    }

    public function updateQueue ( $userId ) {
      global $config;
      $resource=$this->checkConnection();
      $majorVersion=intval($resource['version'][0]);
      $allIpRes = $this->getIpRows( $userId );
      $allPppRes = $this->getPppRows( $userId );
      $ipList=array();
      foreach ($allIpRes as $allIpRow ) 
      {
        $ipList[]=$allIpRow['ip']."/32";
      }

      foreach ($allPppRes as $allPppRow ) 
      {
        $ipList[]=$allPppRow['remoteip']."/32";
      }

      $syncData=array(
        "/queue/simple" => array(
          $userId => array()
        )
      );

      $currentTariff= getCurrentTariff( $userId );
      if ($currentTariff)
      {
        $currentTariff= $currentTariff['detailsid'];
        $tariffTable=new Table('tariff');
        $utariffres=$tariffTable->load("WHERE id=$currentTariff");
        $utariffrow = $utariffres[0];
        if ($utariffrow)
        {
          // Normal / day
          if (pluginExists('night') &&( $utariffrow['nightupspeed']  || $utariffrow['nightdownspeed'] ) )
          {
            $dayTime  = $this->calculateMikrotikTime ( $config->getValue('system', 'tariff', NULL, 'nightHourEnd') );
            $dayTime .= '-1d';
            //$dayTime .= '-'.$this->calculateMikrotikTime ( $config->getValue('system', 'tariff', NULL, 'nightHourStart') );
            $dayTime .= ',sun,mon,tue,wed,thu,fri,sat';
          }
          else
          {
            $dayTime  = '0s-1d,sun,mon,tue,wed,thu,fri,sat';
          }
          // Burst
          if ( pluginExists('burst') &&
               $utariffrow['downburstlimit'] &&
               $utariffrow['upburstlimit'] &&
               $utariffrow['downburstthreshold'] &&
               $utariffrow['upburstthreshold'] &&
               $utariffrow['downbursttime'] &&
               $utariffrow['upbursttime'] 
             )
          {
            $burstLimit=$utariffrow['upburstlimit'].'/'.$utariffrow['downburstlimit'];
            $burstThreshold=$utariffrow['upburstthreshold'].'/'.$utariffrow['downburstthreshold'];
            $burstTime=$utariffrow['upbursttime'].'/'.$utariffrow['downbursttime'];
          }
          else
          {
            $burstLimit="0/0";
            $burstThreshold="0/0";
            $burstTime="0s/0s";
          }

          // Speed
          $speed= $utariffrow['upspeed']."/".$utariffrow['downspeed'];

          
          // Select right target addresses index
          if ($majorVersion===5)
          {
            $addressIndex='target-addresses';
          }
          else
          {
            $addressIndex='target';
          }

          $dbadrr=implode(',', $ipList);
          if (count($ipList))
          {
            $speed = toBytes($utariffrow['upspeed'], 1000)."/".toBytes($utariffrow['downspeed'], 1000);
            $syncData["/queue/simple"][$userId][] = array(
              "limit-at" => $speed,
              "max-limit" => $speed,
              $addressIndex => $dbadrr,
              "name" => $userId,
              "time" => $dayTime,
              "burst-limit"=> $burstLimit,
              "burst-threshold"=> $burstThreshold,
              "burst-time"=> $burstTime
            );
          }



          // Night

          if (pluginExists('night') &&( $utariffrow['nightupspeed']  || $utariffrow['nightdownspeed'] ) )
          {
            $nightSpeed = toBytes($utariffrow['nightupspeed'], 1000)."/".toBytes($utariffrow['nightdownspeed'], 1000);
            //$time  = $this->calculateMikrotikTime ( $config->getValue('system', 'tariff', NULL, 'nightHourStart') );
            $time  = '0s';
            $time .= '-'.$this->calculateMikrotikTime ( $config->getValue('system', 'tariff', NULL, 'nightHourEnd') );
            $time .= ',sun,mon,tue,wed,thu,fri,sat';

            if (count($ipList))
            {
              $syncData["/queue/simple"][$userId][] = array(
                "limit-at" => $nightSpeed,
                "max-limit" => $nightSpeed,
                $addressIndex => $dbadrr,
                "name" => $userId.'-night',
                "time" => $time,
                "burst-limit"=> $burstLimit,
                "burst-threshold"=> $burstThreshold,
                "burst-time"=> $burstTime
              );
            }
          }
        }
      }
      $this->sync($syncData);

      return $this->checkConnection();
    }

		public function updateIp( $userId )
		{
			if ($this->connected)
			{
        global $config;
        $resource=$this->checkConnection();
        $majorVersion=intval($resource['version'][0]);
        $ipRes = $this->getIpRows( $userId );

        $syncData=array(
          "/ip/firewall/filter" => array(),
          "/ip/firewall/mangle" => array(),
          "/ip/arp" => array(),
          //"/queue/simple" => array(),
          "/ip/dhcp-server/lease" => array()
        );

        foreach ($syncData as $key => $value)
        {
          $syncData[$key][$userId] = array();
        }

        foreach ($ipRes as $ipRow)
				{

          $ip = $ipRow[ 'ip' ];
          $mac = preg_replace('/..(?!$)/', '$0:', strtoupper($ipRow[ 'mac' ]));
        
					//	MAC-filter	section
          $macFilterType=$config->getValue('router', 'main', $this->id, 'filterType');
          switch ($macFilterType)
          {
            case 1: //Block by ARP
            {
              if (strlen($mac))
              {
                $syncData["/ip/arp"][$userId][] = array(
                  "mac-address" => $mac,
                  "address" => $ip,
                  "interface" => $ipRow['interface']
                );
              }
            }
            break;
            case 2: //Block by filter rule
            {
              if (strlen($mac))
              {
                $syncData["/ip/firewall/filter"][$userId][] = array(
                  "list" => $addressList,
                  "address" => $ip,
                  "action" => "drop",
                  "chain" => "forward",
                  "src-mac-address" => "!".$mac,
                  "src-address" => $ip
                );
              }
            }
            break;
            case 3: //Block by mangle
            {
              if (strlen($mac))
              {
                $syncData["/ip/firewall/mangle"][$userId][] = array(

                  "action" => "mark-connection",
                  "new-connection-mark" => "badmac",
                  "chain" => "prerouting",
                  "src-mac-address" => "!".$mac,
                  "src-address" => $ip
                );
              }
            }
            break;
          }
				
          
					//	DHCP section

          if (strlen($mac))
          {
            $syncData["/ip/dhcp-server/lease"][$userId][] = array(
              "address" => $ip, 
              "mac-address" => $mac
            );
          }

				}
        $this->sync($syncData);
        return $this->checkConnection();
			}
		}
	
    public function updatePpp( $userId )
		{
			if ($this->connected)
			{
        global $config;
        $resource=$this->checkConnection();
        $majorVersion=intval($resource['version'][0]);

        $pppRes = $this->getPppRows( $userId );

        $syncData=array(
          "/ppp/secret" => array()
        );
        
        foreach ($syncData as $key => $value)
        {
          $syncData[$key][$userId] = array();
        }

        foreach ($pppRes as $pppRow)
        {
          $id=''.$pppRow['id'];
          

          $login = $pppRow[ 'login' ];
          $password = $pppRow[ 'password' ];

          $localIp = $pppRow[ 'localip' ];
          $remoteIp = $pppRow[ 'remoteip' ];

          $pppService = $pppRow[ 'pppservice' ];
          if (!$pppService)
          {
            $pppService = 'any';
          }

          //	PPP section
          //	
          $disableSecretsForDisabledUsers=$config->getValue('router', 'ppp', $this->id, 'disablePPPSecretsOfBlockedUsers'); 
          $usersTable = new Table( 'user' );
          $user = $usersTable->loadById( $pppRow['user'] );
          $disabledState=( $user['disabled']=='1' && $disableSecretsForDisabledUsers) ? 'true' : 'false';
          
          $syncData["/ppp/secret"][$userId][] = array(
            "service" => $pppService,
            "profile" => "default",
            "local-address" => $localIp,
            "remote-address" => $remoteIp,
            "disabled" => $disabledState,
            "name" => $login,
            "password" => $password
          );


				}
        $this->sync($syncData);

        return $this->checkConnection();
			}
		}
	
	
		public function getmac($ip)
		{
			if ($this->connected)
			{
				$response = $this->API->comm('/ip/arp/print',array( '?address' => $ip, '?disabled' => 'false' ));
        if ( count($response) )
        {
          $row=$response[0];
          if ($row['dynamic']==='false')
          {
            // Disable static ARP entry in case it was created by billing
            // It will give possibility to detect current MAC from ARP
            $this->API->comm("/ip/arp/set", array(".id" => $row['.id'], "disabled" => 'yes' ) );
            sleep(9);
            $newResponse = $this->API->comm('/ip/arp/print',array( '?address' => $ip, '?disabled' => 'false' ));
            // Enable static ARP entry again
            $this->API->comm("/ip/arp/set", array(".id" => $row['.id'], "disabled" => 'no' ) );

            if ($newResponse)
            {
              $newRow=$newResponse[0];
              return strtoupper($newRow['mac-address']);
            }
          }
          else
          {
            return strtoupper($row['mac-address']);
          }
        }
			}
		}
		public function export()
		{
      if ($this->connected)
      {
        global $db;
        $reqStr = "SELECT DISTINCT(`user`) FROM `" . DB_TABLE_PREFIX . "ip` WHERE `router`=".$this->id;
        $ipRes = $db->query($reqStr)->fetchAll();
        $reqStr = "SELECT DISTINCT(`user`) FROM `" . DB_TABLE_PREFIX . "ppp` WHERE `router`=".$this->id;
        $pppRes = $db->query($reqStr)->fetchAll();

        $relatedUsers = array();
        foreach ($pppRes as $pppRow) {
          $relatedUsers[] = $pppRow['user'];
        }

        foreach ($ipRes as $ipRow) {
          $relatedUsers[] = $ipRow['user'];
        }
        $relatedUsers = array_unique($relatedUsers);

        foreach ($relatedUsers as $userId) {
          $this->update($userId);
        }
        return $this->checkConnection();
      }
		}
	}
?>
