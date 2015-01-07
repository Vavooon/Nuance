<?php

class Cache
{

    public $cacheTime = 5;
    public $fileName;
    public $path = CACHE_PATH;
    public $timeOfCaching;
    public $expireCheck;

    function __construct($fileName)
    {
        $this->fileName = $this->path . $fileName;
        $currentTime = new DateTime;
    }

    public function get($force = false)
    {
        global $mysqlTimeDateFormat;
        $currentTime = new DateTime;
        if (!$force &&
                $this->expireCheck() &&
                file_exists($this->fileName)
        )
        {
            $result = file_get_contents($this->fileName);
        }
        else
        {
            $result = $this->getData();
            if (gettype($result) === 'array')
            {
                $resultAsString = json_encode($result);
            }
            else
            {
                $resultAsString = $result;
            }
            file_put_contents($this->fileName, $resultAsString);
        }
        return $result;
    }

}
