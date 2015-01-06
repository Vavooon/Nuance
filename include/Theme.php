<?php

class Theme
{

    public $path;
    public $name;
    public $data;
    public $css;
    private $parentTheme;

    function __construct($name)
    {
        $runningFolder = explode('/', $_SERVER['DOCUMENT_ROOT']);
        $runningFolder = array_pop($runningFolder);
        if (!$runningFolder)
        {
            $runningFolder = 'acp';
        }

        $this->name = $name;
        $this->path = realpath(__DIR__ . "/../$runningFolder/themes/$name");

        $manifestFilePath = $this->path . "/manifest.json";
        if (file_exists($manifestFilePath))
        {
            $configJson = file_get_contents($this->path . "/manifest.json");
            if (strlen($configJson))
            {
                $tempThemeData = json_decode($configJson);
                if (!json_last_error())
                {
                    $this->data = $tempThemeData;
                }
            }
        }
        else
        {
            $this->data = false;
        }

        $files = getDirs($this->path);
        $allFiles = $files;
        if ($this->data)
        {

            $parentFiles = getDirs($this->path . "/../" . $this->data->parentTheme);

            $allFiles = array_merge($files, $parentFiles);
            sort($allFiles);
        }
        $this->css = array_filter($allFiles, function($filename)
        {
            return substr($filename, -3, 3) === 'css';
        }
        );

        $this->css = array_values($this->css);
        $this->css = array_unique($this->css);
        for ($i = 0; $i < count($this->css); $i++)
        {
            if (file_exists($this->path . "/" . $this->css[$i]))
            {
                $this->css[$i] = 'themes/' . $this->name . "/" . $this->css[$i];
            }
            else if ($this->data)
            {
                $this->css[$i] = 'themes/' . $this->data->parentTheme . "/" . $this->css[$i];
            }
        }
    }

    function getTemplateLocation($filename)
    {
        if (file_exists($this->path . "/" . $filename))
        {
            return $this->name . "/" . $filename;
        }
        else if ($this->data && $this->data->parentTheme && realpath($this->path . "/../" . $this->data->parentTheme . "/" . $filename))
        {
            return $this->data->parentTheme . "/" . $filename;
        }
    }

}

?>
