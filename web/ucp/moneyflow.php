<?php

include_once '../../app/ucp.php';

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
    $moneyflowTable = new Table('moneyflow');

    $orderTable = new Table('order');
    $ordersRows = $orderTable->load("WHERE user=" . $user->getId());

    $orders = array();
    for ($i = 0; $i < count($ordersRows); $i++)
    {
        $orders[$ordersRows[$i]['id']] = $ordersRows[$i];
    }

    $tariffTable = new Table('tariff');
    $tariffsRows = $tariffTable->load();

    $tariffs = array();
    for ($i = 0; $i < count($tariffsRows); $i++)
    {
        $tariffs[$tariffsRows[$i]['id']] = $tariffsRows[$i];
    }

    $rows = $moneyflowTable->load("WHERE user=" . $user->getId() . " ORDER BY `id` DESC");

    $loadedUsers = array();

    foreach ($rows as $key => $row)
    {
        $paymentDate = new DateTime($row['date']);
        $rows[$key]['date'] = $paymentDate->format($timeDateFormat);
        $rows[$key]['sum'] = formatCash($row['sum']);
        if ($row['name'])
        {
            $rows[$key]['details'] = $row['name'];
        }
        else
        {
            switch ($row['detailsname'])
            {
                case 'scratchcard':
                    {
                        $rows[$key]['details'] = __('Fund with scratchcard');
                        break;
                    }
                case 'refund':
                    {
                        $rows[$key]['details'] = __('Refund operation');
                        break;
                    };
                case 'referrerpay':
                    {
                        $referrerId = $row['detailsid'];
                        if (!isset($loadedUsers[$referrerId]))
                        {
                            $loadedUsers[$referrerId] = new User("WHERE id=" . $referrerId);
                        }
                        $rows[$key]['details'] = sprintf(__('Referral charge from %s'), $loadedUsers[$referrerId]->getName());
                        break;
                    };
                case 'order':
                    {
                        $orderId = $row['detailsid'];
                        if (isset($orders[$orderId]))
                        {
                            $order = $orders[$orderId];
                            $tariffId = $order['detailsid'];
                            $startDate = new DateTime($order['startdate']);
                            $endDate = new DateTime($order['enddate']);
                            $endDate->modify('-1second');
                            $rows[$key]['details'] = sprintf(__("Order %s from %s to %s"), $tariffs[$tariffId]['name'], $startDate->format($dateFormat), $endDate->format($dateFormat));
                        }
                        /* var order=Nuance.stores.order.getById(detailsId);
                          if (order)
                          {
                          var ns=Nuance.stores.order.ns;
                          var startDate=order[ns.startdate] ? Date.parse(order[ns.startdate]).toString(dateFormat) : '';
                          var endDate=order[ns.enddate] ? Date.parse(order[ns.enddate]).toString(dateFormat) : '';
                          } */
                        else
                        {
                            $rows[$key]['details'] = __('Unknown order');
                        }
                        break;
                    };
                case 'adminpay':
                    {
                        $rows[$key]['details'] = __('Fund by cashier');
                        break;
                    };
                default:
                    $rows[$key]['details'] = '';
                    break;
            }
        }
    }

    $tpl = array(
        "rows" => $rows
    );
    $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
    $fenom->display($theme->getTemplateLocation('moneyflow.tpl'), $tpl);
    $fenom->display($theme->getTemplateLocation('footer.tpl'));
}