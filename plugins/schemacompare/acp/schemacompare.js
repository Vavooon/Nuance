function SchemaCompare()
{
  var bodyWrap=ce( 'div', {className: 'opts-tab schemacompare-tab'});

  var headerWrap=ce('div', {className: 'header-wrap'}, bodyWrap);
  ce('span', {className: 'current-table-name', innerHTML: _("Current table")}, headerWrap);
  ce('span', {className: 'dump-table-name', innerHTML: _("Dump table")}, headerWrap);
  ce('div', {innerHTML: _("Update"), id: 'schema-update-button', onclick: loadSchema }, headerWrap);
  var queryEl=ce('div', {className: 'query'}, bodyWrap);
  var result=ce('div', {className: 'result'}, bodyWrap);

  function loadSchema()
  {
    var lp=new Nuance.LoadingPopup;
    function onSuccess(resp)
    {
      lp.close();
      displaySchema(resp);
      compareSchema(resp);
    }
    Nuance.AjaxRequest("GET", "./ajax.php?action=getschema", null, onSuccess, null, true);
  }


  function columnToString(columnData)
  {
    var query = "`"+columnData.Field+"` "+columnData.Type+' ';
    if (columnData.Null==='YES' && columnData.Default===null)
    {
      query += 'DEFAULT NULL';
    }
    else if (columnData.Default)
    {
      query += 'DEFAULT '+columnData.Default;
    }
    else
    {
      query += 'NOT NULL';
    }
    
    if (columnData.Extra)
    {
      query += ' '+columnData.Extra;
    }

    if (columnData.Comment)
    {
      query += " COMMENT '"+columnData.Comment+"'";
    }
    return query;
  }


  function compareSchema(resp)
  {
    var data=JSON.parse(resp);
    var databasePrefix=data.header.databasePrefix;
    var currentSchema=data.data[0];
    var dumpSchema=data.data[1];
    var queries=[];

    for (var tableName in dumpSchema)
    {
      var dumpTable=dumpSchema[tableName];
      var currentTable=currentSchema[databasePrefix+tableName];
      if (!currentTable)
      {
        // TODO: Generate query for new table adding
        //console.warn ("Table not found: ", tableName);

        var query="CREATE TABLE `"+databasePrefix+tableName+"` (";
        for (var column in dumpTable)
        {
          var columnData=dumpTable[column];
          query+=columnToString(columnData);
          

          query += ',\n';
        }
        query += "PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
        queries.push(query);
        continue;
      }
      for (var column in dumpTable)
      {
        var dumpColumnName=dumpTable[column] ? dumpTable[column]['Field'] : false;
        var currentColumnName=currentTable[column] ? currentTable[column]['Field'] : false;

        if (dumpColumnName!==currentColumnName)
        {
          var columnPosition=-1;
          var columnData=dumpTable[column];

          for (var i=0; i<currentTable.length; i++)
          {
            if (currentTable[i]['Field']===dumpColumnName)
            {
              columnPosition=i;
              break;
            }
          }
          var query='ALTER TABLE `'+databasePrefix+tableName+'`';
          if (columnPosition!==-1)
          {
            //console.warn ("Column "+dumpColumnName+" have another position");
            query += ' CHANGE COLUMN `'+dumpColumnName+"` ";
            
            // ALTER TABLE `moneyflow` CHANGE COLUMN `refund` `refund` TINYINT(3) NULL DEFAULT NULL AFTER `date`;
          }
          else
          {
            //console.warn ("Column "+dumpColumnName+" not found");
            query += ' ADD COLUMN `'+dumpColumnName+"` ";
          }

          query += columnToString(columnData);
          if (column)
          {
            var previousColumnName=dumpTable[column-1]['Field'];
            query += " AFTER `"+previousColumnName+ "`;";
          }
          else
          {
            query += " FIRST;";
          }

          queries.push(query);
        }
        else
        {

          for (var prop in dumpTable[column])
          {
            if (dumpTable[column][prop])
            {
              if (prop!=='Collation' && currentTable[column][prop]!==dumpTable[column][prop])
              {
                //c ("Column properties are not equal", tableName, currentColumnName, prop, currentTable[column][prop], dumpTable[column][prop])
                var columnData=dumpTable[column];
                var query='ALTER TABLE `'+databasePrefix+tableName+'`';
                query += ' CHANGE COLUMN `'+dumpColumnName+"` ";
                query += columnToString(columnData);
                if (column)
                {
                  var previousColumnName=dumpTable[column-1]['Field'];
                  query += " AFTER `"+previousColumnName+ "`;";
                }
                else
                {
                  query += " FIRST;";
                }
                queries.push(query);
              }

            }
          }
        }
      }
    }
    queryEl.innerHTML = "<pre>"+(queries.join('\n\n') || _("Nothing to do"))+"</pre>";
  }

  function displaySchema(resp)
  {
    var data=JSON.parse(resp);
    var currentSchema=data.data[0];
    var dumpSchema=data.data[1];
    var databasePrefix=data.header.databasePrefix;
    result.innerHTML='';
    for (var tableName in dumpSchema)
    {
      var dumpTable=dumpSchema[tableName];
      var currentTable=currentSchema[databasePrefix+tableName];
      ce('div', {className: 'table-name', innerHTML: tableName}, result);
      var currentTableContent=ce('div', {className: 'current-table-content'}, result);
      var dumpTableContent=ce('div', {className: 'dump-table-content'}, result);
      for (var column in currentTable)
      {
        var currentColumnName=currentTable[column] ? currentTable[column]['Field'] : '&nbsp;';
        var dumpColumnName=dumpTable[column] ? dumpTable[column]['Field'] : '&nbsp;';

        if (currentColumnName===dumpColumnName)
        {
          var columnClassName='equal column-title';
        }
        else
        {
          var columnClassName='not-equal column-title';
        }

        var columnWrap=ce ('div', null, currentTableContent);
        ce ('div', {className: columnClassName, innerHTML: currentColumnName}, columnWrap);
        var columnWrap2=ce ('div', null, columnWrap);


        var DcolumnWrap=ce ('div', null, dumpTableContent);
        ce ('div', {className: columnClassName, innerHTML: dumpColumnName}, DcolumnWrap);
        var DcolumnWrap2=ce ('div', null, DcolumnWrap);

        if (currentTable[column])
        {
          delete currentTable[column]["Field"];
        }
        if (dumpTable[column])
        {
          delete dumpTable[column]["Field"];
        }

        for (var prop in dumpTable[column])
        {
          if (dumpTable[column][prop])
          {
            if (currentTable[column][prop]===dumpTable[column][prop])
            {
              var className='equal property';
            }
            else
            {
              var className='not-equal property';
            }
            ce('div', {className: className, innerHTML: prop+': '+currentTable[column][prop]}, columnWrap2);
            ce('div', {className: className, innerHTML: prop+': '+dumpTable[column][prop]}, DcolumnWrap2);
          }
        }
      }
    }
  }
  pluginsTabs.schemacompare={title: _("Schema compare"), name: 'schemacompare', content: bodyWrap};
}
pluginsLoaders.push(SchemaCompare);
