<?php

class User
{

    private $data = array();
    private $valid = false;
    private $table = false;
    public $isRestricted = false;

    function __construct($cond = false)
    {
        if ($cond !== false)
        {
            $this->table = new Table('user');
            $req = $this->table->load($cond . " LIMIT 1");
            if (count($req))
            {
                $this->data = $req[0];
                $this->valid = true;
            }
        }
    }

    function isEnabled()
    {
        return !intval($this->data['disabled']);
    }

    function isRestricted()
    {
        return $this->isRestricted;
    }

    function isValid()
    {
        return $this->valid;
    }

    function getName()
    {
        $fullName = $this->data['sname'];
        if ($this->data['fname'])
        {
            $fullName.=" " . strtoupper(my_mb_substr($this->data['fname'], 0, 2)) . ".";
            if ($this->data['pname'])
            {
                $fullName.=" " . strtoupper(my_mb_substr($this->data['pname'], 0, 2)) . ".";
            }
        }
        return $fullName;
    }

    function getDiscount()
    {
        return $this->data['discount'];
    }

    function getField($field)
    {
        return $this->data[$field];
    }

    function changeField($name, $value)
    {
        $this->table->edit(
                array(
                    'id' => $this->getId(),
                    $name => $value
                )
        );
    }

    function getId()
    {
        return $this->data['id'];
    }

    function getFormattedId()
    {
        $idrenderer = $config->getValue('system', 'grid', NULL, 'user-idrenderer');
        $idfunc = 'formatUserId' . $idrenderer;
        return $idfunc($this->data);
    }

    function getFullName()
    {
        return smoneyf($this->data['cash']);
    }

    function getCurrentTariff()
    {
        $tariff = getCurrentTariff($this->getId());
        if ($tariff)
        {
            $tariffTable = new Table('tariff');
            $row = $tariffTable->loadById($tariff['detailsid']);
            return $row;
        }
    }

    function getSelectedTariff()
    {
        $tariffId = $this->data['tariff'];
        if ($tariffId)
        {
            $tariffTable = new Table('tariff');
            $row = $tariffTable->loadById($tariffId);
            return $row;
        }
    }

    function getCash()
    {
        return smoneyf($this->data['cash']);
    }

    function calculateTariffPrice()
    {
        global $mysqlTimeDateFormat;

        return getCashToPay($this->getId());
    }

    function getCashToPay()
    {
        $tariffPrice = $this->calculateTariffPrice();
        $cash = money($this->data['cash']);
        $cashToPay = $tariffPrice - $cash;
        return smoneyf($cashToPay);
    }

    function getFormattedCash()
    {
        $currency = $config->getValue('system', 'main', NULL, 'currency');
        $cash = smoneyf($this->data['cash']);
        return sprintf(_ngettext("%s $currency", "%s $currency", $cash), $cash);
    }

    function getFormattedCashToPay()
    {
        $currency = $config->getValue('system', 'main', NULL, 'currency');
        $cashToPay = $this->getCashToPay();
        return sprintf(_ngettext("%s $currency", "%s $currency", $cashToPay), $cashToPay);
    }

    function getAvailableTariffs()
    {
        $tariffTable = new Table('tariff');
        $allTariffs = $tariffTable->load();
        $availableTariffs = array();
        $userCity = $this->data['city'];
        for ($i = 0; $i < count($allTariffs); $i++)
        {
            $tariff = $allTariffs[$i];
            if (in_array($userCity, $tariff['city']) && $tariff['public'] === 1)
            {
                $availableTariffs[$tariff['id']] = $tariff;
            }
        }
        return $availableTariffs;
    }

}
