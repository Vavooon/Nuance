<?php

include_once '../include/ucp.php';
if (!$user->isValid())
{
  redirect('login.php');
}
else if (!$user->isEnabled())
{
  redirect('disabled.php');
}
else
{
  loadPlugin('ucp', 'scratchcard');
  $sc=new ScratchCard();

  $currentDate = new DateTime('midnight');
  $startDate = new DateTime('first day of this month midnight'); 
  $endDate = new DateTime('first day of next month midnight'); 
  $withdrawalDay=configgetvalue('system', 'cash', NULL, 'withdrawalDay');
  $withdrawalDay-=1;
  if ($withdrawalDay)
  {
    $startDate->modify("+$withdrawalDay day");
    $endDate->modify("+$withdrawalDay day");
  }
  if ($currentDate<$startDate)
  {
    $startDate->modify("-1 month");
    $endDate->modify("-1 month");
  }

  $currency=configgetvalue('system', 'main', NULL, 'currency');
  $tariffPrice=smoneyf($user->calculateTariffPrice());
  $formattedTariffPrice= sprintf(_ngettext("%s $currency", "%s $currency", $tariffPrice), $tariffPrice);

  $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
  if (isset($_POST['code']))
  {
    $paySum=$sc->pay($_POST['code'], $user->getId());
    if ($paySum)
    {
      $currency=configgetvalue('system', 'main', NULL, 'currency');
      $formattedFundSum=sprintf(ngettext("%s $currency", "%s $currency", $paySum), $paySum);
      $tpl=array(
        "formattedFundSum" => $formattedFundSum
      );
      $fenom->display($theme->getTemplateLocation('goodcard.tpl'), $tpl);
    }
    else
    {
      $fenom->display($theme->getTemplateLocation('badcard.tpl'));
    }
  }
  else
  {
    $currentTariff=getCurrentTariff($user->getId());
    $selectedTariff=$user->getSelectedTariff();

    if (!$currentTariff && $selectedTariff)
    {
      $fenom->display($theme->getTemplateLocation('notification.tpl'), 
        array(
          "className" => "tip",
          "errorText" => sprintf( __( 'After updating service "%s" from %s to %s will be automatically paid for %s.'), 
            $selectedTariff['name'], 
            $currentDate->format($dateFormat), 
            $endDate->format($dateFormat),
            sprintf(_ngettext("%s $currency", "%s $currency", $tariffPrice), $tariffPrice)
          )
        )
      );
    }
    $fenom->display($theme->getTemplateLocation('paywithcard.tpl'));
  }
  $fenom->display($theme->getTemplateLocation('footer.tpl'));
}
?>
