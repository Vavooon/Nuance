scratchcard=function(o)
{
  var self=this,
    o=o || {};
  
  function init()
  {
    function emptyreturn(i){return i;};
    var idRendererValue=configProxy.getValue('system', 'grid','scratchcard-idrenderer') || 0;
    var idRendererPrintfFormat=configProxy.getValue('system', 'grid','scratchcard-idrenderer-format') || '%0d';
    var idRenderer=emptyreturn;
    var idSorter=emptyreturn;
    switch (idRendererValue)
    {
      case 0:
        idSorter=function(id){return parseInt(id);};
      break;
      case 1:
        idRenderer=function(id){return sprintf(idRendererPrintfFormat,id)};
      break;
    }

    var scStore=new Nuance.Store(
      {
        target: 'scratchcard',
        filter: location.hash.indexOf('scratchcard')!==1 ? 'id=0' : false,
        autoLoad: true
      }
    );
    tables.tabs.scratchcard=
    {
      title: _("Scratchcard"),
      name: 'scratchcard',
      grid: 
      {
        configProxy: configProxy,
        name: 'scratchcard',
        store: scStore,
        readOnly: true, toolbarButtons:
        [
          {
            value: _("Generate"),
            needSelection: false,
            onselectionchange: function(selectionId, grid)
            {
              this.setDisabled(!checkPermission ( ['table', 'scratchcard', 'add'] ) );
            },
            onclick: function()
            {
              var countField=new Nuance.input.TextField({name: 'count', title: _("Number of codes"), value: ""});
              var valueField=new Nuance.input.TextField({name: 'value', title: _("Values of codes"), value: ""});
              var showCodes=function(r)
              {
                new Nuance.LogPopup({title: _("Generated scratchcards"), text: r.data.join('\n')});
                scStore.load();
              }
              var sendRequest=function()
              {
                if (!countField.getValue() || !valueField.getValue())
                {
                  new Nuance.MessageBox({title: _("Error"), text: _("Please fill out all fields")});
                }
                else
                {
                  exportForm.close();
                  Nuance.AjaxRequest("GET", "./ajax.php?action=generatescratch&count="+countField.getValue()+"&value="+valueField.getValue(), null, showCodes);
                }
              }
    
              var exportForm=new Nuance.Popup({title: _("Export"), buttons: [{onclick: sendRequest, value: _("Generate codes")}], fields:[countField, valueField]});
            }
          }
        ]
      }
    };

    Nuance.stores.user.on('afterload', function()
      {
        if (Nuance.grids.scratchcard)
        {
          Nuance.grids.scratchcard.on('beforerender', function(formattingRows, data, ns, displayData, displayNs)
            {
              var idIndex=ns.id;
              for (var id in data)
              {
                // Common
                var row=data[id];
                displayData[id][idIndex]=idRenderer(row[idIndex]);
              }
            }
          );
        }
      }
    );
  }
  this.unload=function()
  {
    //code for plugin unload;
  }
  pluginsLoaders.push(init);
}
new scratchcard;
