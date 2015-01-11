<?php

namespace Nuance;

/**
 * Description of App
 *
 * @author aniv
 */
class App
{

    static public function autoload($class)
    {
        global $path;
        $filename = $path . "/" . $classname . ".class.php";
        if (file_exists($filename))
        {
            include_once($filename);
        }
    }

    static public function main()
    {
    }

}