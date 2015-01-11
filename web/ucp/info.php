<?php

include_once '../../app/ucp.php';
include_once 'Fenom.class.php';

use Fenom\Provider;

$fenom = new Fenom(new Provider('../ucp/themes'));
$fenom->setCompileDir('../../cache');

if (defined('DEBUG'))
{
    $fenom->setOptions(Fenom::AUTO_RELOAD);
}

if (!$user->isValid())
{
    redirect('login.php');
}
else if (!$user->isEnabled())
{
    redirect('disabled.php');
}
else if ($user->isRestricted())
{
    redirect("/login.php?userisrestricted=true");
}
else
{
    $page = 'info';
    $selectedTariff = $user->getSelectedTariff();
    $currentTariff = $user->getCurrentTariff();

    $currentOrder = getCurrentTariff($user->getId());

    if ($currentOrder)
    {
        if ($user->getField('credit') || $currentOrder['temp'] == 1)
        {
            $state = __('Is on loan');
        }
        else
        {
            $state = __('Enabled');
        }
    }
    else
    {
        $state = __('Disabled');
    }

    $discount = $user->getDiscount();


    $permittedActions = array();

    if (configgetvalue('system', 'ucp', NULL, 'permitTariffChange') &&
            configgetvalue('subscriber', 'main', $user->getId(), 'permitTariffChange'))
    {
        $permittedActions['changetariff'] = true;
    }
    if (configgetvalue('system', 'ucp', NULL, 'permitPasswordChange') &&
            configgetvalue('subscriber', 'main', $user->getId(), 'permitPasswordChange') &&
            $user->getField('login'))
    {
        $permittedActions['changepassword'] = true;
    }

    $tariffIsChanging = $currentOrder && intval($currentOrder['detailsid']) !== intval($user->getField('tariff'));

    $tpl = array(
        "username" => $userName,
        "state" => $state,
        "permittedActions" => $permittedActions,
        "currentOrder" => $currentOrder,
        "currentTariff" => $currentTariff,
        "selectedTariff" => $selectedTariff,
        "tariffIsChanging" => $tariffIsChanging,
        "user" => $user,
    );
    $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
    $fenom->display($theme->getTemplateLocation('info.tpl'), $tpl);
    $fenom->display($theme->getTemplateLocation('footer.tpl'));
}