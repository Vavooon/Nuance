manualpayment=function(o)
{
  function init()
  {
    var paymentsTab=(function()
      {
        var bodyWrap=ce( 'div', {className: 'opts-tab'}),
            bodyEl=ce( 'div', {}, bodyWrap),
            paymentBtn=new Nuance.input.Button({value: _("Get cash"), onclick:function()
            {
              var lp=new Nuance.LoadingPopup;
              var onsuccess=function()
              {
                lp.close();
                Nuance.stores.moneyflow.load();
                Nuance.stores.order.load();
                new Nuance.MessageBox({text: _("Payments done")});
              };
              Nuance.AjaxRequest("POST", "./ajax.php?action=payment", null, onsuccess, null, true);
            }, target: bodyEl}),
            showNotificationsButton=new Nuance.input.Button({value: _("Show notifications"), onclick:function()
            {
              var lp=new Nuance.LoadingPopup;
              var onsuccess=function()
              {
                lp.close();
                new Nuance.MessageBox({text: _("Notifications are displaying")});
              };
              Nuance.AjaxRequest("POST", "./ajax.php?action=shownotifications", null, onsuccess, null, true);
            }, target: bodyEl}),
            clearNotificationsButton=new Nuance.input.Button({value: _("Clear notifications"), onclick:function()
            {
              var lp=new Nuance.LoadingPopup;
              var onsuccess=function()
              {
                lp.close();
                new Nuance.MessageBox({text: _("Notifications aren`t displaying")});
              };
              Nuance.AjaxRequest("POST", "./ajax.php?action=clearnotifications", null, onsuccess, null, true);
            }, target: bodyEl});
        return bodyWrap;
      }()
    );
    pluginsTabs.manualpayment={title: _("Payments"), name: 'payment', content:paymentsTab};
  }
  pluginsLoaders.push(init);
}
new manualpayment;
