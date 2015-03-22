<?php

$default = '{
  "system" : 
  {
    "main" :
    {
      "companyName": "Nuance",
      "acpLocale" : "en_US",
      "ucpLocale" : "en_US",
      "acpTheme" : "default",
      "ucpTheme" : "default",
      "timezone": "Europe/Kiev",
      "currency": "UAH"
    },
    "license":
    {
      "key": ""
    },
    "cash" :
    {
      "typeOfCalculation": "advance",
      "creditMonths": 0,
      "newOrdersWithdrawalType": "full",
      "newUsersWithdrawalType": "full",
      "swapOrdersWithdrawalType": "daily",
      "refundOrdersType" : 2,
      "fractionalPart" : 2,
      "withdrawalDay" : 1,
      "showNotifications" : false,
      "notificationsOffset" : 3,
      "notificationsDuration" : 1,
      "referrerPercentage" : 25,
      "newUsersAutoFund" : false
    },
    "grid" :
    {
      "countryCode" : "+380",
      "user-idrenderer" : 0,
      "user-idrenderer-format" : "%05d",
      "scratchcard-idrenderer" : 0,
      "scratchcard-idrenderer-format" : "%010d",
      "trimUserName" : true,
      "stateUpdateInterval" : 5
    },
    "tariff":
    {
      "nightHourStart": "00:00:00",
      "nightHourEnd": "07:00:00"
    },
    "statistics":
    {
      "paymentsOffset": 0
    },
    "ucp" :
    {
      "showMoneyflow" : true,
      "showTariffs" : true,
      "groupTariffsByCities" : true,
      "showTariffsOnlyFromUsersCity" : false,
      "showDocuments" : true,
      "IPautoLogin" : true,
      "restrictUsersLoggedByIP" : false,
      "permitTariffChange" : true,
      "permitPasswordChange" : true,
      "mainPageText" : "",
      "documents" : [],
      "contactsPageText" : ""
    }
  },
  "user" :
  {
    "grid":
    {
      "user-hiddenCols": ["comment", "referrer"]
    },
    "widget":
    {
      "enabledWidgets": []
    }
  },
  "router" :
  {
    "main" :
    {
      "outInterface" : "wan",
      "inInterface" : "lan",
      "statPort" : 8080
    },
    "ip" :
    {
      "filterType": 0
    },
    "ppp" :
    {
      "disablePPPSecretsOfBlockedUsers": false
    }
  },
  "var":
  {
    "version" : 
    {
      "number" : "2.3",
      "branch" : "stable"
    }
  },
  "subscriber":
  {
    "main" :
    {
      "permitPasswordChange": true,
      "permitTariffChange": true
    }
  }
}';
$default = json_decode($default, true);
if (json_last_error())
{
    die("Cannot parse default config");
}
?>
