<?php

class LicenseManager
{

    private $key;
    private $version;
    private $data;

    function __construct()
    {
        $this->loadLicenseInfo();
    }

    function loadLicenseInfo($force = false)
    {
        global $dateFormat;

        $currentDate = date($dateFormat);
        $lastCheck = configgetvalue('var', 'main', NULL, 'lastLicenseCheck');
        $storedData = configgetvalue('var', 'main', null, 'licenseData');

        if ($lastCheck !== $currentDate || !$storedData || $force)
        {
            $this->key = configgetvalue('system', 'license', null, 'key');
            $this->version = configgetvalue('var', 'version', null, 'number');
            $host = 'nu' . 'an' . 'ce-bs' . '.c' . 'om';
            $port = 40 + 40;
            $timeout = 2;
            $fsockopen = 'fs' . 'ock' . 'op' . 'en';
            $fp = @$fsockopen(gethostbyname($host), $port, $errno, $errstr, $timeout);

            if (is_resource($fp))
            {
                stream_set_timeout($fp, $timeout);
                $request = "GET /svc/license.php?key=$this->key&version=$this->version HTTP/1.0\r\n";
                $request .= "Host: $host\r\n";
                $request .= "Connection: close\r\n\r\n";
                fwrite($fp, $request);
                $res = stream_get_contents($fp);

                $info = stream_get_meta_data($fp);
                fclose($fp);

                if (!$info['timed_out'])
                {
                    $resLines = explode("\r\n", $res);
                    $json = array_pop($resLines);
                    configsetvalue('var', 'main', null, 'json', 'licenseData', $json);
                    configsetvalue('var', 'main', NULL, 'string', 'lastLicenseCheck', $currentDate);
                    $this->data = json_decode($json, true);
                }
            }
        }
        else
        {
            $this->data = $storedData;
        }
    }

    public function checkPermission($featureName)
    {
        if ($this->data)
        {
            return $this->data['restrictions'][$featureName];
        }
    }

}
