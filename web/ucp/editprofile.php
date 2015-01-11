<?php

include_once '../../app/ucp.php';

if (!$user->isValid())
{
    redirect('login.php');
}
else
{
    $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);

    if ($_GET['target'] === 'password')
    {
        if (isset($_POST['password']) && !empty($_POST['password']))
        {
            $password = $_POST['password'];
            $user->changeField('password', $password);
            $fenom->display($theme->getTemplateLocation('notification.tpl'), array(
                "className" => "success",
                "errorText" => __("Your password was successfully changed.")
                    )
            );
        }
        else
        {
            $fenom->display($theme->getTemplateLocation('editpassword.tpl'));
        }
    }
    else if ($_GET['target'] === 'tariff')
    {
        if (isset($_POST['tariff']) && !empty($_POST['tariff']))
        {
            $tariff = $_POST['tariff'];
            $availableTariffs = $user->getAvailableTariffs();
            if (isset($availableTariffs[$tariff]))
            {
                $user->changeField('tariff', intval($tariff));
                if ($user->getCurrentTariff())
                {
                    $fenom->display($theme->getTemplateLocation('notification.tpl'), array(
                        "className" => "success",
                        "errorText" => __("Your tariff will be changed from the next month.")
                            )
                    );
                }
                else
                {
                    $fenom->display($theme->getTemplateLocation('notification.tpl'), array(
                        "className" => "success",
                        "errorText" => __("Your tariff has been changed.")
                            )
                    );
                }
            }
        }
        else
        {
            $currentTariff = $user->getSelectedTariff();
            if ($currentTariff)
            {
                $currentTariffId = $currentTariff['id'];
            }
            else
            {
                $currentTariffId = false;
            }
            $availableTariffs = $user->getAvailableTariffs();
            $tpl = array(
                "currentTariffId" => $currentTariffId,
                "availableTariffs" => $availableTariffs,
            );
            $fenom->display($theme->getTemplateLocation('edittariff.tpl'), $tpl);
        }
    }
    else
    {
        redirect('info.php');
    }

    $fenom->display($theme->getTemplateLocation('footer.tpl'));
}