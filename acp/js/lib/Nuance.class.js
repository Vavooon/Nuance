RegExp.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
Date.prototype.getJsTime=Date.prototype.getTime;
Date.prototype.getTime=function()
{
  return Math.round(this.getJsTime() / 1000);
}
var tabPanelDivider=0;

Array.prototype.pushUnique=function(value)
{
  if (this.indexOf(value)===-1)
  {
    this.push(value);
    return true;
  }
  else
  {
    return false;
  }
}
Object.defineProperty( Array.prototype, 'pushUnique', {
  value: function (value) 
  {
    if (this.indexOf(value)===-1)
    {
      this.push(value);
      return true;
    }
    else
    {
      return false;
    }
  },
  enumerable: false
});

Object.defineProperty( Array.prototype, 'compare', {
  value: function (array) 
  {
    // if the other array is a falsy value, return
    if (!array)
      return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
      return false;

    for (var i = 0; i < this.length; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].compare(array[i]))
              return false;
      }
      else if (this[i] != array[i]) {
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;
      }
    }
    return true;
  },
  enumerable: false
});

function inRange(start, end, needle)
{
  return (needle>=start && needle<=end);
}

HTMLElement.prototype.removeChilds=function()
{
  while (this.lastChild) 
  {
    this.removeChild(this.lastChild);
  }
}

Object.defineProperty( Array.prototype, 'remove', {
    value: function(value)
    {
      for (var i=0; i<this.length; i++)
      {
        if (value === this[i])
        {
          this.splice(i, 1);
          return true;
        }
      }
    },
    enumerable: false
});



URLParams=function(o)
{
  for (var attrname in o) { this[attrname] = o[attrname]; }
}
paramsToString=function()
{
  var paramsArr=[];
  for (var prop in this)
  {
    paramsArr.push(prop+'='+encodeURIComponent( this[prop] ) );
  }
  return paramsArr.join('&');
}

Object.defineProperty(URLParams.prototype, 'toString',
  {
    value: paramsToString,
    enumerable: false
  }
);
Object.defineProperty(URLParams.prototype, 'length',
  {
    get: function(){
      var i=0;
      for (var attrname in this) {if (this.hasOwnProperty(attrname)) i++;}
      return i;
    },
    enumerable: false
  }
);


function sprintf( ) {	// Return a formatted string
  // 
  // +   original by: Ash Searle (http://hexmen.com/blog/)
  // + namespaced by: Michael White (http://crestidg.com)

  var regex = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
  var a = arguments, i = 0, format = a[i++];

  // pad()
  var pad = function(str, len, chr, leftJustify) {
    var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function(value, prefix, leftJustify, minWidth, zeroPad) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, ' ', leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function(value, leftJustify, minWidth, precision, zeroPad) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad);
  };

  // finalFormat()
  var doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
    if (substring == '%%') return '%';

    // parse flags
    var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false;
    for (var j = 0; flags && j < flags.length; j++) switch (flags.charAt(j)) {
      case ' ': positivePrefix = ' '; break;
      case '+': positivePrefix = '+'; break;
      case '-': leftJustify = true; break;
      case '0': zeroPad = true; break;
      case '#': prefixBaseX = true; break;
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth == '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void(0);
    } else if (precision == '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    var value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
      case 's': return formatString(String(value), leftJustify, minWidth, precision, zeroPad);
      case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
      case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
      case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'i':
      case 'd': {
        var number = parseInt(+value);
        var prefix = number < 0 ? '-' : positivePrefix;
        value = prefix + pad(String(Math.abs(number)), precision, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
      }
      case 'e':
      case 'E':
      case 'f':
      case 'F':
      case 'g':
      case 'G':
                {
                  var number = +value;
                  var prefix = number < 0 ? '-' : positivePrefix;
                  var method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                  var textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                  value = prefix + Math.abs(number)[method](precision);
                  return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                }
      default: return substring;
    }
  };

  return format.replace(regex, doFormat);
}
var c = console.log.bind(console);

JSON.oldParse=JSON.parse;
JSON.parse=function(str)
{
  try
  {
    str=str.substr(str.lastIndexOf('\n')+1);
    return JSON.oldParse(str);
  }
  catch(e)
  {
    console.error("Error while parsing string: ");
    console.error(str);
  }
}

function ip2long(ip)
{
  ip=ip.split(".");
  if (ip.length!=4) return 0;
  else 
  {
    for (var i=0; i<ip.length; i++)
    {
      ip[i]=parseInt(ip[i]);
    }
    return ip[3]+ip[2]*256+ip[1]*65536+ip[0]*16777216;
  }
}
function getUrlParams(params)
{
  var pa=[];
  for (var i in params)
  {
    pa.push(i+"="+params[i]);
  }
  return pa.join('&');
}
var gt=new Gettext();
function _ (msgid) {
  var str=gt.gettext(msgid);
  if (str==msgid && debug)
  {
    console.warn("Found untranslated line: "+str);
    str && Nuance.AjaxRequest("GET", "./ajax.php?action=addtranslationline&line="+str);
  }
  return gt.gettext(msgid);
}

function ce(tagName, props, pNode, isFirst)
{
  var el= document.createElement(tagName);
  if (props)
  {
    for (prop in props)
    {
      el[prop]=props[prop];
    }
  }
  if (pNode)
  {
    if (isFirst && pNode.firstChild)
    {
      pNode.insertBefore(el, pNode.firstChild);
    }
    else
    {
      pNode.appendChild(el);
    }
  }
  return el;
}
function ge(id)
{
  return document.getElementById(id);
}

function falsefunc(){return false;};

function mergeProps(obj1, obj2, allowRewrite) 
{
  var obj3 = {};
  for (var p in obj1) 
  {
    try 
    {
      // Property in destination object set; update its value.
      if ( obj1[p] && obj1[p].constructor==Object )
      {
        obj3[p] = mergeProps(obj1[p], obj1[p]);
      }
      else 
      {
        obj3[p] = obj1[p];

      }
    }
    catch(e)
    {
      // Property in destination object not set; create it and set its value.
      obj3[p] = obj1[p];
    }
  }
  if (allowRewrite)
  {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor==Object ) 
        {
          obj3[p] = mergeProps(obj3[p], obj2[p], allowRewrite);

        } 
        else 
        {
          obj3[p] = obj2[p];

        }
      } 
      catch(e) 
      {
        // Property in destination object not set; create it and set its value.
        obj3[p] = obj2[p];
      }
    }
  }
  else
  {
    for (var p in obj2)
    {
      if (!obj3.hasOwnProperty(p))
      {
        try 
        {
          // Property in destination object set; update its value.
          if ( obj2[p].constructor==Object )
          {
            obj3[p] = MergeRecursive(obj3[p], obj2[p]);

          } 
          else
          {
            obj3[p] = obj2[p];
          }

        }
        catch(e) 
        {
          // Property in destination object not set; create it and set its value.
          obj3[p] = obj2[p];
        }
      }
    }
  }
  return obj3;
}
function cloneObject (object)
{
  return mergeProps(object, {}, true);
}

function cloneArray (array)
{
  var newArray=[];
  for (var i=0; i<array.length; i++)
  {
    newArray[i]=array[i];
  }
  return newArray;
}

function mergeProps_old(obj1,obj2, allowRewrite){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  if (allowRewrite)
  {
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  }
  else
  {
    for (var attrname in obj2) {if (!obj3.hasOwnProperty(attrname)) obj3[attrname] = obj2[attrname]; }
  }
  return obj3;
}


var Nuance = 
  {
    Event: function(o)
    {
      this.type='';
      this.defaultPrevented=false;
      for (var i in o)
      {
        this[i]=o[i];
      }
    },
    EventMixin: function()
    {
   
      this._eventHandlers={};
      this.on = function(eventName, handler, immediately) 
      {
        if (!this._eventHandlers) this._eventHandlers = [];
        if (!this._eventHandlers[eventName]) 
        {
          this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
        if (immediately)
        {
          handler();
        }
      };
     
      this.off = function(eventName, handler) 
      {
        var handlers = this._eventHandlers[eventName];
        if (!handlers) return;
        for(var i=0; i<handlers.length; i++) 
        {
          if (handlers[i] == handler) 
          {
            handlers.splice(i--, 1);
          }
        }
      };
     
      this.trigger = function(eventName) 
      {
        if (!this._eventHandlers[eventName]) 
        {
          return;
        }
     
        var handlers = this._eventHandlers[eventName];
        for (var i = 0; i < handlers.length; i++) 
        {
          handlers[i].apply(this, [].slice.call(arguments, 1));
        }
      };
    },
    ConfigProxy: function (o)
    {
      var self=this;
      this.__config={};
      this.__default={};
      var onedit=o.onedit || {};
      var defaultOwner = 0;
      var params=
      {
        ownerid: o.ownerid,
        path: '*'
      };
      Nuance.EventMixin.call(this, o);
      var saveParams=mergeProps(params, {action: 'configedit'});
      var loadPath="./ajax.php?action=configlist";
      var savePath="./ajax.php?"+getUrlParams(mergeProps(params, {action: 'configedit'}));
      o.onload && this.on('afterload', o.onload);
      this.load=function()
      {
        var onsuccess=function(resp)
        {
          self.__config=resp['data'] || {};
          self.__default=resp['default'] || {};
          var owner = (owner===undefined) ? defaultOwner : owner;
          for (var type in onedit)
          {
            for (var i in onedit[type])
            {
              if (onedit[type][i])
              {
                onedit[type][i]();
              }
            }
          }
          self.trigger('afterload');
        }
        Nuance.AjaxRequest("GET", loadPath, null, onsuccess);
      }
      this.save=function(type, path, name, value, owner)
      {
        var varType='string';
        switch (typeof value)
        {
          case 'boolean': varType='bool'; break;
          case 'number': varType='int'; break;
          case 'array': varType='array'; break;
          case 'object': 
            varType='json';
            value=JSON.stringify(value);
          break;
        }
        var reqParams=
        {
          path: path,
          name: name,
          vartype: varType,
          value: value,
          owner: owner
        }
        function onSuccess(o)
        {
          self.trigger('afteredit', o);
        }
        Nuance.AjaxRequest("POST", "./ajax.php?"+getUrlParams(mergeProps(params, {type: type, ownerid: owner, action: 'configedit'}, true)), reqParams, onSuccess);
      }
      this.getValue= function(type, path, name, owner)
      {
        var value;
        owner = owner || 0;
        if (self.__config[type][owner] && self.__config[type][owner][path] && self.__config[type][owner][path][name]!==undefined)
        {
          value=self.__config[type][owner][path][name];
        }
        else if (self.__default[type][path] && self.__default[type][path][name]!==undefined)
        {
          value=self.__default[type][path][name];
        }
        return value;
      }
      this.getConfigTree= function(type, owner)
      {
        self.trigger('beforeconfigread', type, owner, self.__config[type][owner]);
        return self.__config[type][owner];
      }
      this.getDefaults= function(type, owner)
      {
        var defaultConfig=cloneObject(self.__default[type]);
        self.trigger('beforeconfigdefaultsread', type, owner, defaultConfig);
        return defaultConfig;
      }
      this.getValues= function(type, path)
      {
        return self.__config[type][path];
      }
      this.setValue= function(type, path, name, value, owner)
      {
        owner = (owner===undefined) ? defaultOwner : owner;
        if (owner===undefined) return;
        if (!self.__config[type][owner]) self.__config[type][owner]={};
        if (!self.__config[type][owner][path]) self.__config[type][owner][path]={};
        self.__config[type][owner][path][name]=value;
        if (onedit[type] && onedit[type][path])
        {
          onedit[type][path](self.__config[type][owner][path]);
        }
        this.save(type, path, name, value, owner);
      }
      if (o.autoLoad) this.load();
    },
    AjaxRequest: function(method, path, post, onsuccess, onerror, simpleResponse)
    {
      if (!path) throw new Error(_("Path must be specified"));
      var xmlHttp=new XMLHttpRequest;
      xmlHttp.open(method, path, true);
      if (method==='POST')
      {
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      }
      xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xmlHttp.onreadystatechange = function()
      {
        if (xmlHttp.readyState == 4)
        {
          if (xmlHttp.status==200)
          {
            if (onsuccess)
            {
              try
              {
                var resp=simpleResponse ? xmlHttp.responseText : JSON.parse(xmlHttp.responseText);
                (typeof onsuccess=='function') && onsuccess(resp);
              }
              catch(e)
              {
                c(_("Error:"));
                c(e.stack);
                onerror && onerror(xmlHttp.status);
              }
            }
          }
          else
          {
            if (xmlHttp.status==401) location.href='auth.php';
            onerror && onerror(xmlHttp.status, xmlHttp.status ? JSON.parse(xmlHttp.responseText) : null);
          }
        }
      }
      var postString=false;
      if (typeof post==='object')
      {
        var postValues=[];
        for (var i in post)
        {
          postValues.push( i+'='+encodeURIComponent(post[i]) );
        }
        postString=postValues.join('&');
      }
      else if (typeof post==='string')
      {
        postString=post;
      }
      xmlHttp.send(postString);
      return xmlHttp;
    },
    TextLabel:function (o)
    {
      this.body=ce('span', {className: 'label', innerHTML: o.text || ''}, o.target);
      this.getName=function(){};
    },
    input:
    {
      __Field: function(o)
      {
        var name=o.name;
        this.getName=function(){return name;};
        this.form=o.form;
        if (o.value!==null && !o.doNotSetValue) this.setValue && this.setValue(o.value);
        if (this.el)
        {
          this.el.classList.add('selectable');
          this.addEventListener=function()
          {
            this.el.addEventListener.apply(this.el, arguments);
          };
          this.removeEventListener=function(){this.el.removeEventListener.apply(this.el, arguments)};
          for (var evt in o)
          {
            if (evt.indexOf('on')==0)
            {
              this.el[evt]=o[evt];
            }
          }
        }
        Nuance.EventMixin.call(this, o);
      },
      StretchField: function(o)
      {
        this.body=ce ('div',  {className: 'stretch-wrap'}, o.target);
      },
      Button: function(o)
      {
        this.body=ce ('div',  {className: 'button-wrap'}, o.target);
        var self=this,
            name=o.name,
            onclick=o.onclick,
            scope=o.scope,
            disabled,
            submitFired=false,
            onclickHandler=function(e)
            {
              if (onclick && !disabled)
              {
                onclick.call(scope || self.el, e);
              }
            };
        self.el=ce (
          'div',
          {
            onkeypress: onclickHandler,
            onclick: onclickHandler,
            tabIndex: 0,
            onselectstart: falsefunc,
            className: 'button',
            innerHTML: o.value || ""
          },
          this.body
        );
        if (o.id)
        {
          self.el.id=o.id;
        }
        if (o.iconClass)
        {
          this.el.classList.add('icon');
          this.el.classList.add(o.iconClass);
          this.el.classList.add(o.iconClass);
          if (!o.value)
          {
            this.el.classList.add('onlyicon');
          }
        }
        if (o.extraCls)
        {
          this.el.classList.add(o.extraCls);
        }
        function keySubmit(e)
        {
          if (e.which==13 && !submitFired)
          {
            submitFired=true,
              e.cancelBubble=true;
            e.stopPropagation();
            onclickHandler();
            document.removeEventListener('keyup',keySubmit);
          }
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.classList[disabled ? 'add' : 'remove']('disabled');
        }
        this.onselectionchange=o.onselectionchange;
        this.needSelection=o.needSelection;
        this.setValue=function(v)
        {
          self.el.value=v;
          this.el.classList[!!v ? 'add' : 'remove']('onlyicon');
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled(o.disabled);
        this.destroy=function()
        {
          document.removeEventListener('keyup',keySubmit);
        }
      },
      ButtonGroup: function (o)
      {
        this.body=ce (  'div',  {className: 'buttons-wrap buttons-group'}, o.target);
        if (o.mergeButtons) this.body.classList.add('button-group');
        if (o.btnLayout) this.body.classList.add(o.btnLayout);
        var buttons=o.buttons,
          retBtns=[];
        if (buttons)
        {
          for (var i=0; i<buttons.length; i++)
          {
            buttons[i].target=o.noWrap ? undefined : this.body;
            if (buttons[i].constructor!=Nuance.input.Button) 
            {
              var btn=new Nuance.input.Button(buttons[i]);
              buttons[i]=btn;
              retBtns.push(btn);
              o.noWrap && this.body.appendChild(btn.el);
            }
            else
            {
              retBtns.push(buttons[i]);
              this.body.appendChild(o.noWrap ? buttons[i].el : buttons[i].body);
            }
          }
        }
        this.getButtons=function()
        {
          return retBtns;
        }
      },
      ProgressBar: function(o)
      {
        this.body=ce ( 'div', {className: 'field-wrap', innerHTML: o.title+'<br />'}, o.target);
        var self=this;
        self.el=ce ( 'div', {className: 'progressbar field'}, this.body);
        var value=0,
            fraction=o.fraction || 0,
            indicator=ce ( 'div', {className: 'progressbar-indicator'}, self.el),
            text=ce ( 'div', {className: 'progressbar-text'}, self.el);

        this.setValue=function(v)
        {
          if (typeof v=='number')
          {
            value=v.toFixed(fraction);
            value = value>100 ? 100 : value;
            indicator.style.width=text.innerHTML=value+"%";
          }
        }
        this.setValue(o.value || 0);
        this.getValue=function()
        {
          return value;
        }
      },
      TextField: function(o)
      {
        this.body=ce ( 'div', {className: 'text-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        var self=this,
            disabled=o.disabled;
        self.el=ce ( 'input', {className: 'text field'}, this.body);
        if (o.name) self.el.name=o.name;
        var valueType='string';
        this.setValue=function(value)
        {
          valueType=typeof value;
          self.el.value=(typeof value!='undefined') ? value : '';
        }
        this.getValue=function()
        {
          var value=self.el.value;
          switch (valueType)
          {
            case 'number':
              value=parseFloat(value);
              break;
          }
          return value;
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        self.el.onchange=function()
        {
          self.trigger('change');
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.disabled=disabled;
          self.el.blur();
        }
        Nuance.input.__Field.call(this, o);
      },
      DiscountField: function(o)
      {
        this.body=ce ( 'div', {className: 'discount-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        this.wrap=ce ( 'div', {className: 'flex-wrap' }, this.body);
        var self=this,
            disabled=o.disabled;
        self.el=ce ( 'input', {className: 'text field discount'}, this.wrap);
        var speedPostfix=new Nuance.input.ComboBox({name: 'discount', store: discountTypeStore, value: '%'});
        speedPostfix.__el.classList.add('discount');
        this.wrap.appendChild(speedPostfix.body);
        if (o.name) self.el.name=o.name;
        var valueType='string';
        var postfixes=['%', 'm'];
        var postfixesInLowerCase=['%', 'm'];
        var digitsOnly = /[-1234567890]/g;
        self.el.onkeypress=function(e)
        {
          var code = e.which;
          var character = String.fromCharCode(code);
          // if they pressed esc... remove focus from field...
           if (!code) return true;
          if (code==27) 
          {
            this.blur();
            return false;
          }
          // ignore if they are press other keys
          // strange because code: 39 is the down key AND ' key...
          // and DEL also equals .
          if (!e.ctrlKey && code!=96 && code!=9 && code!=8 && code!=36 && code!=37 && code!=38 && (code!=39 || (code==39 && character=="'")) && code!=40)
          {
            var prefixIndex=postfixesInLowerCase.indexOf(character.toLowerCase());

            if (character.match(digitsOnly))
            {
              return true;
            }
            else if (prefixIndex!==-1)
            {
              speedPostfix.setValue(postfixes[prefixIndex]);
            }
            else if (character==='m')
            {
              speedPostfix.setValue('m');
            }
            return false;
          }        
        }
        this.setValue=function(value)
        {
          valueType=typeof value;
          if (value)
          {
            var lastChar=value[value.length-1];
            if (postfixes.indexOf(lastChar)!==-1)
            {
              speedPostfix.setValue(lastChar);
              self.el.value=value.substr(0, value.length-1);
            }
            else
            {
              speedPostfix.setValue('m');
              self.el.value=value;
            }
          }
          else
          {
            speedPostfix.setValue('m');
            self.el.value='';
          }
        }
        this.getValue=function()
        {
          var prefix=speedPostfix.getValue();
          if (prefix==='m')
          {
            prefix='';
          }
          if (parseInt(self.el.value))
          {
            return self.el.value+prefix;
          }
          else
          {
            return '0';
          }
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.disabled=disabled;
          speedPostfix.setDisabled(disabled);
          self.el.blur();
        }
        Nuance.input.__Field.call(this, o);
      },
      SpeedField: function(o)
      {
        this.body=ce ( 'div', {className: 'speed-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        this.wrap=ce ( 'div', {className: 'flex-wrap' }, this.body);
        var self=this,
            disabled=o.disabled;
        self.el=ce ( 'input', {className: 'text field speed'}, this.wrap);
        var speedPostfix=new Nuance.input.ComboBox({name: 'speed', store: prefixStore, value: 'b'});
        speedPostfix.__el.classList.add('speed');
        this.wrap.appendChild(speedPostfix.body);
        if (o.name) self.el.name=o.name;
        var valueType='string';
        var postfixes=['k', 'M', 'G'];
        var postfixesInLowerCase=['k', 'm', 'g'];
        var digitsOnly = /[1234567890]/g;
        self.el.onkeypress=function(e)
        {
          var code = e.which;
          var character = String.fromCharCode(code);
          // if they pressed esc... remove focus from field...
           if (!code) return true;
          if (code==27) 
          {
            this.blur();
            return false;
          }
          // ignore if they are press other keys
          // strange because code: 39 is the down key AND ' key...
          // and DEL also equals .
          if (!e.ctrlKey && code!=96 && code!=9 && code!=8 && code!=36 && code!=37 && code!=38 && (code!=39 || (code==39 && character=="'")) && code!=40)
          {
            var prefixIndex=postfixesInLowerCase.indexOf(character.toLowerCase());
            if (character.match(digitsOnly))
            {
              return true;
            }
            else if (prefixIndex!==-1)
            {
              speedPostfix.setValue(postfixes[prefixIndex]);
            }
            else if (character==='b')
            {
              speedPostfix.setValue('b');
            }
            return false;
          }        



        }
        this.setValue=function(value)
        {
          valueType=typeof value;
          if (value)
          {
            var lastChar=value[value.length-1];
            if (postfixes.indexOf(lastChar)!==-1)
            {
              speedPostfix.setValue(lastChar);
              self.el.value=value.substr(0, value.length-1);
            }
            else
            {
              speedPostfix.setValue('b');
              self.el.value=value;
            }
          }
          else
          {
            speedPostfix.setValue('b');
            self.el.value='';
          }
        }
        this.getValue=function()
        {
          var prefix=speedPostfix.getValue();
          if (prefix==='b')
          {
            prefix='';
          }
          return self.el.value+prefix;
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.disabled=disabled;
          speedPostfix.setDisabled(disabled);
          self.el.blur();
        }
        Nuance.input.__Field.call(this, o);
      },
      SearchField: function(o)
      {
        this.body=ce ( 'div', {className: 'field-wrap search-wrap', innerHTML: o.title ? o.title+'<br />' : ""}, o.target);
        var self=this,
            disabled=false,
            searchhandler=o.onvaluechange || function(){},
            canSearch=false;
        function handleSearch()
        {
          v=self.getValue();
          v && searchhandler(v);
        }
        function clearSearch()
        {
          self.setValue();
          self.el.onchange();
          searchhandler(self.getValue());
        }

        var clearButton=ce('div', {type: 'button', className: 'clear-button icon remove', disabled: true, onclick: clearSearch}, this.body);
        self.el=ce ( 'input', {className: 'text field', placeholder: _("Search…")}, this.body);
        var searchButton=ce('div', {type: 'button', className: 'search-button search icon', disabled: true, onclick: handleSearch}, this.body);
        self.el.onchange=self.el.onkeyup=function(e)
        {
          canSearch=!!this.value;
          if (canSearch)
          {
            clearButton.classList.remove('disabled');
            searchButton.classList.remove('disabled');
          }
          else
          {
            clearButton.classList.add('disabled');
            searchButton.classList.add('disabled');
          }
          if (e && e.type=='keyup' && e.which==13 && canSearch) searchhandler(self.getValue());
          if (e && e.type=='keyup' && e.which==27 && canSearch) clearSearch();
          if (e && !this.value) clearSearch();
        }
        if (o.name) self.el.name=o.name;
        this.setValue=function(value)
        {
          self.el.value=value || "";
          self.el.onkeyup.apply(self.el);
        }
        this.getValue=function()
        {
          return self.el.value;
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.disabled=disabled;
        }
        Nuance.input.__Field.call(this, o);
      },
      DateField: function(o)
      {

        /*
         *
         * yearsCount
         * yearsOffset
         *
         */


        this.body=ce ( 'div', {className: 'date-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        var self=this,
            yearsCount = o.yearsCount || 10,
            yearsOffset= o.yearsOffset || -9,
            disabled=false;
        self.el=ce ( 'div', {className: 'flex-wrap date field'}, this.body);
        var dayField=new Nuance.input.ComboBox({
          selectPlaceholder: _('Day'),
          store: dayStore,
          name: 'day',
          avoidSort: true,
          target: self.el
        });
        var monthStore=new Nuance.MemoryStore(
          {
            target: 'month', header: 
            [
              ['id', 'id'], 
              ['name', 'varchar']
            ],
            data: 
            {
              1: [1, gt.ngettext("january", "january", 2)],
              2: [2, gt.ngettext("february", "february", 2)],
              3: [3, gt.ngettext("march", "march", 2)],
              4: [4, gt.ngettext("april", "april", 2)],
              5: [5, gt.ngettext("may", "may", 2)],
              6: [6, gt.ngettext("june", "june", 2)], 
              7: [7, gt.ngettext("july", "july", 2)],
              8: [8, gt.ngettext("august", "august", 2)],
              9: [9, gt.ngettext("september", "september", 2)],
              10: [10, gt.ngettext("october", "october", 2)],
              11: [11, gt.ngettext("november", "november", 2)],
              12: [12, gt.ngettext("december", "december", 2)]
            }
          }
        );
        var yearStore=new Nuance.MemoryStore({target: 'year', header: [['id', 'id'], ['name', 'varchar']],
          data: 
          {
          }});
        for (var i=0; i<yearsCount; i++)
        {
          var year=date.getFullYear()+i+yearsOffset;
          yearStore.data[year]= [year, year];
        }

        var monthField=new Nuance.input.ComboBox({
          selectPlaceholder: _('Month'),
          store: monthStore,
          name: 'month',
          avoidSort: true,
          target: self.el
        });
        var yearField=new Nuance.input.ComboBox({
          store: yearStore,
          selectPlaceholder: _('Year'),
          name: 'year',
          target: self.el
        });
        function onMonthYearChange()
        {
          var daysInSelectedMonth=31;
          var selectedDay = dayField.getValue();
          var selectedMonth = monthField.getValue();
          var selectedYear = yearField.getValue();
          if (selectedMonth && selectedYear)
          {
            var selectedDate=new Date(selectedYear, selectedMonth, 0);
            var daysInSelectedMonth=selectedDate.getDate();
          }
          dayStore.data={};
          for (var i=1; i<=daysInSelectedMonth; i++)
          {
            dayStore.data[i]=[i, i];
          }
          dayField.load();
          dayField.setValue(selectedDay);
        }
        monthField.addEventListener('change', onMonthYearChange);
        yearField.addEventListener('change', onMonthYearChange);

        if (o.name) self.el.name=o.name;
        var hourValue=0, minuteValue=0, secondValue=0;
        this.setValue=function(value)
        {
          var date=Date.parseExact(value, dateFormat);
          if (date)
          {
            monthField.setValue( date.getMonth()+1 );
            yearField.setValue( date.getFullYear() );
            dayField.setValue( date.getDate() );
            hourValue=date.getHours();
            minuteValue=date.getMinutes();
            secondValue=date.getSeconds();
          }
          else
          {
            monthField.setValue( 0 );
            yearField.setValue( 0  );
            dayField.setValue( 0 );
            hourValue=0;
            minuteValue=0;
            secondValue=0;
          }
        }
        this.getValue=function()
        {
          var date;
          var selectedDay = dayField.getValue();
          var selectedMonth = monthField.getValue();
          var selectedYear = yearField.getValue();
          if (selectedMonth && selectedYear)
          {
            date=new Date(
                selectedYear,
                selectedMonth-1,
                selectedDay,
                hourValue,
                minuteValue,
                secondValue
                );
          }
          return date ? date.toString(dbDateTimeFormat) : "0000-00-00 00:00:00";
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          dayField.setDisabled(disabled);
          monthField.setDisabled(disabled);
          yearField.setDisabled(disabled);
        }
        Nuance.input.__Field.call(this, o);
      },
      PhoneNumberField: function(o)
      {
        this.body=ce ( 'div', {className: 'phone-field-wrap field-wrap', innerHTML: o.title ? o.title+'<br />' : ""}, o.target);
        var self=this,
            realValue,
            disabled=false,
            countryCode=configProxy.getValue('system', 'grid', 'countryCode');
        self.el=ce ( 'input', {type: 'tel', className: 'text field', value: countryCode}, this.body);
        if (o.name) self.el.name=o.name;
        this.setValue=function(value)
        {
          realValue=value;
          self.el.value=value || countryCode;
        }
        this.getValue=function()
        {
          return (self.el.value===countryCode) ? realValue : self.el.value;
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.disabled=disabled;
        }
        Nuance.input.__Field.call(this, o);
      },
      PasswordField: function(o)
      {
        this.body=ce ( 'div', {className: 'password-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        this.wrap=ce ( 'div', {className: 'flex-wrap' }, this.body);
        var self=this,
            disabled=false,
            realValue;
        self.el=ce ( 'input', {type: 'password', className: 'text password field', placeholder: o.value ? _("Type to change password") : ''}, this.wrap);

        if (o.name) self.el.name=o.name;
        this.setValue=function(value)
        {
          realValue=value;
          self.el.placeholder= value ? _("Type to change password") : '';
        }
        
        this.getRealValue=function()
        {
          return realValue;
        }
        this.getValue=function()
        {
          return self.el.value || self.getRealValue();
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.disabled=disabled;
        }
        Nuance.input.__Field.call(this, o);
      },
      ViewPasswordField: function(o)
      {
        this.body=ce ( 'div', {className: 'view-password-field-wrap password-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        this.wrap=ce ( 'div', {className: 'flex-wrap' }, this.body);
        var self=this,
            disabled=false,
            realValue;
        self.el=ce ( 'input', {type: 'password', className: 'text password field', placeholder: o.value ? _("Type to change password") : ''}, this.wrap);

        var toggleViewButton = ce ('div', {className: 'button icon onlyicon unlock view-password', onclick: toggleView}, this.wrap, true);
        self.el.classList.add('allowview');
        function toggleView()
        {
          toggleViewButton.classList.toggle('lock');
          toggleViewButton.classList.toggle('unlock');
          if (self.el.type==='password')
          {
            self.el.type='text';
          }
          else
          {
            self.el.type='password';
          }
        }
        this.toggleView= toggleView;

        if (o.name) self.el.name=o.name;
        this.setValue=function(value)
        {
          self.el.value=value;
        }
        
        this.getValue=function()
        {
          return self.el.value;
        }
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          self.el.disabled=disabled;
        }
        Nuance.input.__Field.call(this, o);
      },
      GenerateViewPasswordField: function(o)
      {
        Nuance.input.ViewPasswordField.call(this, o);

        var self=this,
            generateButton=ce ('div', {className: 'button icon onlyicon flash generate-password'}, this.wrap); 
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        self.el.classList.add('generate');
        generateButton.onclick=function()
        {
          var password='';
          for (var i=0; i<7; i++)
          {
            password += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          self.el.value=password;
          if (self.el.type==='password')
          {
            self.toggleView();
          }
        }
      },
      FileField: function(o)
      {
        o.doNotSetValue=true;
        this.body=ce ( 'div', {className: 'file-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        var self=this,
            value=o.value;
        this.setValue=function(value)
        {
          if (value) button.innerHTML=_("Select new file");
        }

        var el=ce('input', {type: 'file', name: o.name}, self.body);
        el.style.display="none";
        el.onchange=function()
        {
          if (this.value)
          {
            if (this.files[0].size>8000000)
            {
              new Nuance.MessageBox({text: _("File size should be less than 8M")});
            }
            else
            {
              button.innerHTML=_("File selected");
            }
          }
        }
        var button=ce('div', {className: 'button file-button', onclick: function(e){el.click.call(el,e);}, innerHTML: value ? _("Select new file") : _("Select file")}, self.body);
        this.el=el;
        Nuance.input.__Field.call(this, o);
      },
      CheckBox: function(o)
      {
        this.body=ce ( 'div', {className: 'checkbox-field-wrap field-wrap'}, o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        var self=this,
            checked=false,
            partial=false,
            disabled=false,
            onchange=o.onchange || falsefunc,
            onText=o.onText || _('on'),
            offText=o.offText || _('off'),
            partialText=o.onText || '',
            valueType='boolean',
            el=ce ( 'div', {className: 'checkbox field', tabIndex: 0}, this.body),
            switchEl=ce ( 'em', {innerHTML: _("off")}, el);
        Nuance.EventMixin.call(this, o);
        Nuance.input.__Field.call(this, o);
        this.el=el;
        el.onclick=function()
        {
          if (!disabled)
          {
            el.focus();
            checked=!checked;
            if (self.getPartial())
            {
              partial=false;
              el.classList.remove('partial');
            }
            el.classList[checked ? 'add' : 'remove']('checked');
            switchEl.innerHTML=checked ? onText : offText;
            onchange.call(self);
            self.trigger('change', checked);
          }
        }
        el.onkeypress=function(e)
        {
          if (e.which==32)
          {
            self.setValue(!self.getValue());
          }
          return false;
        }
        this.getPartial=function()
        {
          return partial;
        }
        this.setPartial=function()
        {
          partial=true;
          el.classList.add('partial');
          el.classList.remove('checked');
          switchEl.innerHTML=partialText;
        }
        switchEl.onselectstart=falsefunc;
        switchEl.onmousedown=falsefunc;
        this.setValue=function(value)
        {
          valueType=typeof value;
          checked=!!value;
          partial=false;
          el.classList.remove('partial');
          el.classList[checked ? 'add' : 'remove']('checked');
          switchEl.innerHTML=checked ? onText : offText;
        }
        this.getValue=function()
        {
          var value=checked;
          switch (valueType)
          {
            case 'number':
              value=0+value;
              break;
            case 'boolean':
              value=!!value;
              break;
          }
          return value;
        }
        if (o.value!==null) this.setValue(o.value);
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          el.classList[disabled ? 'add' : 'remove']('disabled');
        }
      },
      ComboBox: function(o)
      {
        this.body=ce ( 'div',  {className: 'combobox-field-wrap field-wrap'} , o.target);
        this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
        var el = ce ( 'div',  {className: 'combobox field'}, this.body);
        var activeVal=ce ( 'input',  {className: 'top-option option', onselectstart: falsefunc, onsmousedrag: falsefunc}, el);
        var arrowEl=ce ( 'div',  {className: 'arrow'}, el);
        var optionsContainer=ce ( 'div',  {className: 'options-list'}, el);
        var toolsContainer=ce ('div', {className: 'combobox-tools'}, el);
        if (o.multiple)
        {
          function selectAll()
          {
            self.setValue(values);
          }
          function unselectAll()
          {
            self.setValue();
          }
          var selectAllEl=ce ('div', {className: 'select', innerHTML: _("Select all"), onclick: selectAll}, toolsContainer);
          var unselectAllEl=ce ('div', {className: 'unselect', innerHTML: _("Unselect all"), onclick: unselectAll}, toolsContainer);
        }
        var self=this,
            pList=o.parentList,
            disabled=false,
            store=o.store,
            multiple=o.multiple,
            name=o.name,
            nullValue=0,
            opened=false,
            prevVal,
            valueType='string',
            foundItem=null,
            hoverEl,
            openEvent,
            selectedEls=[],
            pListSelected;

        if (typeof pList === 'string' && o.form)
        {
          var fields=o.form.getFields();
          pList = fields[pList];
        }
        Nuance.EventMixin.call(this, o);
        o.doNotSetValue=true;
        this.store=store;
        this.onchange=[];
        this.__el=el;
        this.getName=function()
        {
          return name;
        }
        function updateSelection()
        {
          var stringValues=[];
          var arrayValues=[];
          for (var i=0; i<selectedEls.length; i++)
          {
            stringValues.push(selectedEls[i].innerHTML);
            arrayValues.push(selectedEls[i].value);
          }
          if (arrayValues.length==1 && arrayValues[0]==0)
          {
            activeVal.value='';
          }
          else
          {
            activeVal.value=stringValues.join(', ');
          }
          activeVal.nValue=arrayValues;
          switch (valueType)
          {
            case 'number':
              prevVal=parseFloat(activeVal.nValue[0]);
              break;
            default: 
              prevVal=activeVal.nValue[0];
              break;
          }
          var event = new CustomEvent("change");
          el.dispatchEvent(event);
          self.trigger('change');
        }
        function selectOption()
        {
          selectedEls.push(this);
          this.classList.add('selected');
        }
        function unselectOption()
        {
          var index=selectedEls.indexOf(this);
          if (index!==-1)
          {
            selectedEls[index].classList.remove('selected');
            selectedEls.splice(index, 1);
          }
        }
        function toggleOption()
        {
          if (!multiple)
          {
            if (selectedEls.length)
            {
              selectedEls.pop().classList.remove('selected');
            }
            selectedEls.push(this);
            this.classList.add('selected');
          }
          else
          {
            var index=selectedEls.indexOf(this);
            if (index!==-1)
            {
              selectedEls[index].classList.remove('selected');
              selectedEls.splice(index, 1);
            }
            else
            {
              this.classList.add('selected');
              selectedEls.push(this);
            }
          }
          updateSelection();
        }
        var values=[];
        this.values=values;
        function setOpened(b)
        {
          if (!disabled)
          {
            opened=b;
            if (opened)
            {
              el.classList.add('open');
              selectedEls.length && scrollToOption(selectedEls[selectedEls.length-1]);
            }
            else
            {
              el.classList.remove('open');
              focus();
            }
          }
        }
        function scrollToOption(elem)
        {
          optionsContainer.scrollTop=elem.offsetTop-120;
        }
        function close(e)
        {
          setOpened(false,e);
          window.removeEventListener('click', onBlur);
          window.removeEventListener('dblclick', onBlur);
          window.removeEventListener('contextmenu', onBlur);
        };

        function onBlur(e)
        {
          // Do not close menu at focus or click on input field
          if (openEvent!==e && e.target!==activeVal)
          {
            if (multiple)
            {
              if(Array.prototype.indexOf.call(optionsContainer.children, e.target)===-1  && e.target!==selectAllEl  && e.target!==unselectAllEl)
              {
                close();
              }
            }
            else
            {
              close();
            }
          }
        }
        function open(e)
        {
          if (opened) return;
          setOpened(true,e);
          openEvent=e;
          activeVal.select();
          window.addEventListener('click', onBlur);
          window.addEventListener('dblclick', onBlur);
          window.addEventListener('contextmenu', onBlur);
        };
        function onItemMouseOver()
        {
          hoverEl && hoverEl.classList.remove('hover');
          this.classList.add('hover');
          hoverEl=this;
        }
        function onItemMouseOut()
        {
          this.classList.remove('hover');
        }

        activeVal.onclick=open;
        function searchItem(e)
        {
          if (e.which==13 && hoverEl) // Handle ENTER press
          {
            hoverEl.onclick();
            !multiple && close();
            return;
          }
          foundItem=nullValue;
          if (e.which==40 && !opened) // Open list at DOWN press
          {
            open();
            return;
          }
          if (e.which==38 || e.which==40) // Handle option selection with UP and DOWN keys
          {
            if (!hoverEl) hoverEl=(e.which==40) ? optionsContainer.children[1] : optionsContainer.lastChild;
            var newSelection=hoverEl[(e.which==40) ? 'nextSibling' : 'previousSibling'];
            if (newSelection)
            {
              foundItem=Array.prototype.indexOf.call(optionsContainer.children, newSelection);
              onItemMouseOver.call(newSelection);
              hoverEl=newSelection;
            }
            activeVal.select();
            return;
          }


          // Open if ComboBox is focused and search was started
          if (!opened && [9, 16, 17, 18].indexOf(e.which)==-1)
          {
            open();
          }
          //  Handle key press to search
          var count=0;
          var needle=activeVal.value.toLowerCase();
          for (var s=0; s<optionsContainer.children.length; s++)
          {
            if (optionsContainer.children[s].innerHTML.toLowerCase().indexOf(needle)!=-1)
            {
              count++;
              foundItem=s;
              onItemMouseOver.call(optionsContainer.children[s]);
              scrollToOption(optionsContainer.children[s]);
              break;
            }
          }
        }
        arrowEl.onclick=open;
        activeVal.onkeyup=searchItem;
        activeVal.onblur=function(e) // Close if ComboBox is focused and TAB was pressed
        {
          if (e.relatedTarget)
          {
            close();
          }
        }
        this.setValue=function(value)
        {
          valueType=typeof value;
          var foundItems=0;
          activeVal.value='';
          if (Array.isArray(value))
          {

          }
          else if (valueType=='number' || valueType=='string')
          {
            value=[value];
            values.indexOf(value.toString());
          }
          else
          {
            value=[];
          }
          var arrayValues=[];
          var stringValues=[];

          while (selectedEls.length)
          {
            unselectOption.call(selectedEls[0]);
          }
          for (var i=0; i<value.length; i++)
          {
            var index=values.indexOf(value[i].toString());
            if (o.showNotSelected) index++;
            var item=optionsContainer.children[index];
            if (item)
            {
              selectOption.call(item);
              foundItems++;
              scrollToOption(item);
            }
          }
          if (!foundItems || (value.length===1 && value[0]===0))
          {
            if (values.length)
            {
              activeVal.title=activeVal.placeholder=o.selectPlaceholder || _("Select "+self.getName());

            }
            else if (pList)
            {
              activeVal.title= activeVal.placeholder=pListSelected ? _("No options") : _("Select "+pList.getName()+" at first");
              if (pList && typeof pList.getValue()==='object' && pList.getValue.length!==1)
              {
                activeVal.title= activeVal.placeholder= _("Select only one "+pList.getName());
              }
            }
            else
            {
              activeVal.title= activeVal.placeholder=_("No options");
            }
            activeVal.nValue=[nullValue];
            if (store.getState()=='loading')
            {
              if (value)
              {
                activeVal.nValue=value;
              }
              activeVal.title= activeVal.placeholder=_("Loading");
            }
          }
          updateSelection();
        };
      this.getValue=function()
      {
        if (!multiple)
        {
          var value=activeVal.nValue[0];
          if (isFinite(value) && value!=='')
          {
            value=parseFloat(value);
          }
          return value;
        }
        else
        {
          var selectedValues=[];
          for (var i=0; i<selectedEls.length; i++)
          {
            selectedValues.push(selectedEls[i].value);
          }
          selectedValues.sort();
          return selectedValues;
        }
      };
        this.isDisabled=function()
        {
          return disabled;
        }
      this.setDisabled=function(d)
      {
        disabled=!!d;
        activeVal.disabled=disabled;
        el.classList[disabled ? 'add' : 'remove']('disabled');
      }
      function loadOptions(array)
      {
        values=[];
        optionsContainer.removeChilds();
        var elementsOptions=[];
        for (var s in array)
        {
          var text=store.getNameById(s);
          elementsOptions.push(
            {
              className: 'option',
              innerText: text,
              textContent: text,
              value: s,
              onclick: toggleOption,
              onmouseover: onItemMouseOver,
              onmouseout: onItemMouseOut,
              onselectstart: falsefunc,
              onsmousedrag: falsefunc
            }
          );
        }
        if (!o.avoidSort)
        {
          elementsOptions.sort(function(a, b) {return a.innerHTML<b.innerHTML ? -1 : 1} );
        }
        for (var i=0; i<elementsOptions.length; i++)
        {
          values.push(elementsOptions[i].value);
          ce ('div', elementsOptions[i], optionsContainer);
        }
        if (values.length && o.showNotSelected)
        {
          var notSelOpt=ce ('div', {className: 'option', innerHTML: _('Not selected'), value: 0, onclick: toggleOption, onselectstart: falsefunc, onsmousedrag: falsefunc}, optionsContainer, true);
        }
        if (values.length==1 && o.selectOnlyItem)
        {
          self.setValue(optionsContainer.lastChild.value);
        }
        else 
        {
          self.setValue(o.value);
        }

        self.setDisabled(!values.length);
        self.values=values;
      }
      if (pList)
      {
        function checkSelection()
        {
          values=[];
          var plName=pList.getName();
          var plValue=pList.getValue();
          var newOpts={};
          if (typeof plValue==='object' && plValue.length>1)
          {
            self.setValue(false);
          }
          else
          {
            if (typeof plValue==='object')
            {
              plValue=plValue[0];
            }
            if (this.children[0].nValue!=nullValue)
            {
              var row=store.ns[plName];
              pListSelected=true;
              for (var option in store.data)
              {
                var value=store.data[option][row];
                if (!Array.isArray(value))
                {
                  value=[value];
                }
                for (var i=0; i<value.length; i++)
                {
                  if (value[i]==plValue || value[i]==0) newOpts[option]=store.getNameById(option);
                }
              }
            }
            else 
            {
              pListSelected=false;
            }
            loadOptions(newOpts);
            self.setValue(prevVal || false);
          }
        }
        pList.addEventListener('change',checkSelection);
      }
      else
      {
        loadOptions(store.data);
        store.on('afterload', function()
          {
            el.classList.remove('loading');
            self.setDisabled(false);
            loadOptions(this.data);
          }
        );
        if (store.getState()=='idle')
        {
          store.load();
          self.setValue(self.getValue());
        }
        else if (store.getState()=='loading')
        {
          el.classList.add('loading');
          self.setDisabled(true);
        }
        else if (store.getState()=='loading')
        {
          loadOptions(store.data);
        }

      };

      this.load=function()
      {
        loadOptions(store.data);
      }
      this.addEventListener=function(event, callback)
      {
        el.addEventListener.call(el, event, callback);
        if (event=='change')
        {
          callback.call(el);
        }
      };
      function hover(e)
      {
        if (e.type=='mouseover' && !self.isDisabled()) el.classList.add('hover'); else el.classList.remove('hover');
      }
      function focus(e)
      {
        if (e && e.type=='focus' && !self.isDisabled())
        {
          el.classList.add('focus');
        }
        else
        {
          el.classList.remove('focus');
        }
      }
      activeVal.addEventListener("focus", focus);
      activeVal.addEventListener("blur", focus);
      Nuance.input.__Field.call(this, o);
    },
    TariffComboBox: function (o)
    {
      var self=this;
      this.form=o.form;
      this.body=ce ( 'div', {className: 'tariff-field-wrap field-wrap'}, o.target);
      this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
      this.wrap=ce ( 'div', {className: 'flex-wrap' }, this.body);
      var tariffCombobox=new Nuance.input.ComboBox({name: 'tariff', store: o.store, value: o.value, parentList: o.parentList, target: this.wrap});
      var changeButton = ce ('div', {className: 'change-tariff-button button icon onlyicon arrowright', onclick: changeButtonClick}, this.wrap);

      Nuance.input.__Field.call(this, o);

      this.getName=tariffCombobox.getName;
      this.setValue=tariffCombobox.setValue;
      this.getValue=tariffCombobox.getValue;
      this.setDisabled=function(disabled)
      {
        tariffCombobox.setDisabled(disabled);
        changeButton.style.display= disabled ? 'none' : '';
      }

      var userId=this.form.recordId;
      var fieldIndex=o.index;
      var order;
      var userStore=Nuance.stores.user;
      var moneyflowStore=Nuance.stores.moneyflow;
      function changeButtonClick()
      {
        if (changeButton.classList.contains('loading'))
        {
          return;
        }
        var selectedTariffId=self.getValue();
        var userFields=cloneArray(userStore.data[userId]);
        userFields[fieldIndex]=selectedTariffId;
        
        changeButton.classList.add('loading');
        changeButton.classList.remove('arrowright');
        changeButton.disabled=true;

        function changeTariff()
        {
          var moneyflowId;
          var orderId=activeOrder[userId][0];
          var ns=moneyflowStore.ns;
          moneyflowStore.setFilter();
          moneyflowStore.load(function()
            {
              for (var i in moneyflowStore.data)
              {
                if (moneyflowStore.data[i][ns.detailsname]=='order' && moneyflowStore.data[i][ns.detailsid]==orderId)
                {
                  moneyflowId=moneyflowStore.data[i][ns.id];
                  break;
                }
              }
              refund(moneyflowId, 
                function()
                {

                  Nuance.stores.user.load(function()
                  {
                    var userData=Nuance.stores.user.getById(userId, true);
                  });
                  Nuance.stores.activeorder.load(onChange);
                }
              );
            }
          );
        }
        if (userStore.data[userId][fieldIndex]!==selectedTariffId)
        {
          userStore.edit(userId, userFields, changeTariff);
        }
        else
        {
          changeTariff();
        }
      }
      function onChange()
      {
        changeButton.classList.add('arrowright');
        changeButton.disabled=false;
        changeButton.classList.remove('loading');
        var activeTariff=activeOrder[userId];
        var selectedTariffId=self.getValue();
        var ns=Nuance.stores.activeorder.ns;
        if ( activeTariff && selectedTariffId && activeTariff[ns.detailsid]!=selectedTariffId && tariffCombobox.values.length)
        {
          order=activeTariff[ns.id];
          self.body.classList.add('change-tariff');
        }
        else
        {
          order=false;
          self.body.classList.remove('change-tariff');
        }
      }
      tariffCombobox.addEventListener ('change', onChange);

    },
    Documents: function(o)
    {
      this.body=ce ( 'div', {className: 'documents opts-tab'});
      var self=this;

      var table=[];

      function getValue()
      {
        var documents=[];
        for (var i=0; i<table.length; i++)
        {
          documents.push( 
          {
            name: table[i].name,
            fileName: table[i].fileName,
            description:  table[i].description
          });
        }
        return documents;
      }

      function Document(o)
      {
        var self=this;
        this.body=ce ( 'div', {className: "button document-button document"}, o.target);
        var title=ce('em', {innerHTML: o.name, className: 'title'}, self.body);


        this.name=o.name;
        this.fileName=o.fileName;
        this.forceDownload=o.forceDownload;
        this.description=o.description;

        
        function removeDocument()
        {
          removeButton.el.classList.add('loading');
          removeButton.el.classList.remove('remove');
          table.splice(table.indexOf(self), 1);

          configProxy.setValue('system', 'ucp', 'documents', getValue() );
        }
        var renameButton=new Nuance.input.Button({onlyIcon: true, iconClass: 'edit', target: self.body, onclick: function()
          {
            docPopup({index: index});
          }
        });
        var removeButton=new Nuance.input.Button({onlyIcon: true, iconClass: 'remove', onclick: removeDocument, target: self.body});
        table.push(self);
      }
      var documents;
      function loadDocuments()
      {
        self.body.removeChilds();
        table=[];
        documents=configProxy.getValue('system', 'ucp', 'documents');
        for (var i=0; i<documents.length; i++)
        {
          new Document({index: i, name: documents[i].name, fileName: documents[i].fileName, description: documents[i].description, target: self.body});
        }
        new Nuance.input.Button({value: _("Add"), target: self.body, onclick: function()
          {
            docPopup({index: -1});
          }
        });
      }
      loadDocuments();
      configProxy.on('afteredit', loadDocuments);
      configProxy.on('afterload', loadDocuments);
      var popup;
      var form;
      var descriptionField;
      var forceDownloadField;
      function upload()
      {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "ajax.php?action=documentupload", true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        var formData=new FormData(form);
        formData.append('forceDownload', forceDownloadField.getValue() );
        formData.append('description', descriptionField.getValue() );
        popup.close();
        var loadingPopup=new Nuance.LoadingPopup({text: "Uploading..."});
        xhr.onload=function()
        {
          loadingPopup.close();
          configProxy.load();
        }
        xhr.send(formData);
      }
      function docPopup(o)
      {
        var index=o.index;
        form=ce('form', {className: 'popup-body', enctype: "multipart/form-data"});
        new Nuance.input.TextField({name: 'name', title: _("Name"), target: form, value: index!==-1 ? documents[index].name : null});
        new Nuance.input.FileField({name: 'file', title: _("File"), target: form, value: index!==-1 ? documents[index].name : null});
        forceDownloadField=new Nuance.input.CheckBox({name: 'forceDownload', title: _("Force download"), target: form, value: index!==-1 ? documents[index].forceDownload : null});
        descriptionField=new Nuance.input.TextArea({name: 'comment', title: _("Description"), target: form, value: index!==-1 ? documents[index].description : null});

        ce('input', {type: 'hidden', name: 'index', value: index}, form);
        popup=new Nuance.Popup(
        {
          title: index!==-1 ? _("Edit document") : _("Add document"),

          bodyLayout:'double',
          btnLayout:'double',
          winLayout:'double',
          body: form,
          buttons:
          [
            { value: index!==-1 ? _("Edit") : _("Add"), onclick: upload},
            { value: _("Cancel"), onclick: function(){popup.close()}}
          ]
        });
      }


    }, 
    TextArea: function (o)
    {
      this.body=ce ( 'div',  {className: 'textarea-field-wrap field-wrap double'}, o.target);
      this.title=ce ( 'span', {className: 'title', innerHTML: o.title || ""}, this.body);
      var el=ce ( 'textarea', {className: 'multitext field'}, this.body),
          self=this,
          disabled=false;
      this.el=el;
      el.onkeyup=function(e)
      {
        if (e.which==13)
        {
          e.stopPropagation();
        }
      }
      this.select=function(){el.select()};
      if (o.height) el.style.height=o.height+'px';
      this.getType=function(){return "TextArea";};
      this.setValue=function(value)
      {
        if (typeof value!=='undefined')
        {
          el.value=value;
        }
        else
        {
          el.value='';
        }
      }
      this.getValue=function()
      {
        return el.value;
      };
      this.isDisabled=function()
      {
        return disabled;
      }
      this.setDisabled=function(d)
      {
        disabled=!!d;
        el.disabled=disabled;
      }
      Nuance.input.__Field.call(this, o);
      self.el.onchange=function()
      {
        self.trigger('change');
      }
    },
    TariffList: function(o)
    {  
      this.body=ce ( 'div', {className: 'tariff-list field-wrap field-wrap'}, o.target);
      this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
      var self=this,
          disabled=false,
          addButton=new Nuance.input.Button({target: this.body, iconClass: 'add', onclick: function(){new TariffRow({target: table})}}),
          table=ce ( 'div', {className: 'tarifflist field'}, this.body),
          rows=[];
      function TariffRow(o)
      {
        var row=ce ( 'div',  {className: 'tarifflist-row'}, o.target),
            disabled=false,
            selfRow=this;
        var timeField=new Nuance.input.TextField({value: o.starttime ? o.starttime : '', target: row});
        timeField.el.classList.add('starttime');

        ce('div', {classList: date});

        var dlField=new Nuance.input.TextField({value: o.dl ? o.dl : '', target: row});
        var ulField=new Nuance.input.TextField({value: o.ul ? o.ul : '', target: row});
      }
      this.getName=function()
      {
        return o.name;
      }

      this.setValue=function(value)
      {
        table.removeChilds();
        value=JSON.parse(value) || {};
        for (var prop in value )
        {
          var row=value[prop];
          new TariffRow({target: table, ul: row.ul, dl: row.dl, starttime: prop});
          length++;
          if (length==maxLength) break;
        }
        new TariffRow({target: table});
      }
      new TariffRow({target: table});
    },
    IpList: function (o)
    {
      this.body=ce ( 'div', {className: 'iplist-field-wrap field-wrap double'}, o.target);
      this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
      var self=this,
          disabled=false,
          addButton=new Nuance.input.Button({target: this.body, iconClass: 'add', onclick: function(){new IpRow({target: table})}}),
          table=ce ( 'div', {className: 'iplist field'}, this.body),
          rows=[];
      addButton.body.classList.add('iplist-add');
      function detectScroll()
      {
        return table.offsetWidth>table.clientWidth;
      }
      function IpRow(o)
      {
        var row=ce ( 'div',  {className: 'iplist-row'}, o.target),
            disabled=false,
            selfRow=this;

        if (o.type=='mikrotikppp') ce ('div', {innerHTML: o.title}, row);
        var ipField=new Nuance.input.TextField({value: o.ip ? o.ip : '', target: row});
        var tRow=(o.type!='mikrotikppp') ? row : false;
        this.ipField=ipField;

        var toMacButton=new Nuance.input.Button({target: tRow, iconClass: 'pin'});
        var macField=new Nuance.input.TextField({target: tRow});
        var deleteButton=new Nuance.input.Button({target: tRow, onclick: this.remove, iconClass: 'remove'});

        
        function verifyIp(e)
        {
          var ip=ipField.getValue();
        }
        ipField.el.placeholder=_('Enter IP address');
        macField.el.placeholder=_('Enter MAC address');
        var setMacValue=function(mac)
        {
          if (typeof mac==='string' && mac)
          {
            mac=mac.replace(/:/g,'').toUpperCase().match(/.{1,2}/g).join(":");
            macField.setValue(mac);
          }
          else new Nuance.MessageBox({title: ":(", text: _("MAC address not found")});
        }
        o.mac && setMacValue(o.mac);
        this.remove=function()
        {
          row.parentNode.removeChild(row);
          rows.splice(rows.indexOf(selfRow),1);
        };
        deleteButton.el.onclick=this.remove;
        ipField.el.addEventListener('keyup', verifyIp);
        function macPress()
        {
          var routerId=self.form.getField('router').getValue();

          if (routerId)
          {
            function updMac(resp)
            {
              setMacValue(resp.data[0] ? resp.data[0][1] : "");
              toMacButton.el.classList.add('pin');
              toMacButton.el.classList.remove('loading');
              toMacButton.el.onclick=macPress;
            };
            // Set loading icon to MAC detect button
            toMacButton.el.classList.remove('pin');
            toMacButton.el.classList.add('loading');
            toMacButton.el.onclick=falsefunc;
            Nuance.AjaxRequest("POST", "./ajax.php?action=routergetmac", {router: routerId, ip: ipField.getValue()}, updMac);
          }
          else
          {
            new Nuance.MessageBox({title: "Error", text: _("Please select router")});
          }
        }

        this.getValue=function(){return [ipField.getValue(), macField.getValue().toLowerCase().replace(/[^0-9a-f]/g,'')]};
        this.isDisabled=function()
        {
          return disabled;
        }
        this.setDisabled=function(d)
        {
          disabled=!!d;
          ipField.setDisabled(disabled);
          toMacButton.setDisabled(disabled);
          macField.setDisabled(disabled);
          deleteButton.setDisabled(disabled);
        }

        toMacButton.el.onclick=macPress;
        rows.push(this);
      }


      this.setValue=function(value)
      {
        table.innerHTML='';
        if (typeof value!='object')
        {
          value=value.split(' ').join(''); //CRANCH
          value=value.split('\t').join('');//CRANCH
          value=JSON.parse(value || '{}');
        }
        for (var prop in value)
        {
          new IpRow({target: table, ip: prop, mac: value[prop]});
        }
      }
      this.getValue=function()
      {
        var tmpObj={};
        for (var e=0;e<rows.length; e++)
        {
          var tmpArr=rows[e].getValue();
          if (tmpArr[0]) tmpObj[tmpArr[0]]=tmpArr[1];
        }
        return JSON.stringify(tmpObj);
      };
      // Add one empty row for new records

      this.isDisabled=function()
      {
        return disabled;
      }
      this.setDisabled=function(d)
      {
        disabled=!!d;
        for (var i=0; i<rows.length; i++)
        {
          rows[i].setDisabled(disabled);
        }
        addButton.setDisabled(disabled);

      }


      Nuance.input.__Field.call(this, o);

      var routerField=o.form.getFields()['router'];
      function toggleMode()
      {
        var routerStore=Nuance.stores.router;
        var routerId=routerField.getValue();
        var minLength=1;
        var maxLength=0;
        var length=0;
        var routerType;
        if (routerId)
        {
          table.innerHTML='';
          routerType = routerStore.getById(routerId)[routerStore.ns.routertype];
          if (routerType==='mikrotikppp')
          {
            var minLength=2;
            var maxLength=2;
            self.body.classList.add('ppp');
            self.body.classList.remove('ipmac');
          }
          else
          {
            self.body.classList.add('ipmac');
            self.body.classList.remove('ppp');
          }
        }
        var value=JSON.parse(self.getValue());
        rows=[];
        for (var prop in value )
        {
          new IpRow({title: (length ? _('Remote IP') : _('Local IP')) , target: table, ip: prop, mac: value[prop], type: routerType});
          length++;
          if (length==maxLength) break;
        }

        if (routerType!='mikrotikppp')
        {
          new IpRow({target: table, ip: '', mac: '', type: routerType});
        }
        else
        {
          // Add missing row for PPP
          while (length<minLength)
          {
            new IpRow({title: (length ? _('Remote IP') : _('Local IP')) , target: table, ip: '', mac: '', type: routerType});
            length++;
          }
          rows[1].ipField.el.onblur=function()
          {
            var localIP=this.value.split('.');
            if (localIP.length===4 && !rows[0].ipField.el.value)
            {
              localIP[3]='1';
              rows[0].ipField.el.value=localIP.join('.');
            }
          }
        }

      }
      routerField.addEventListener('change', toggleMode);

    },
    PermissionList: function(o)
    {
      var self = this,
          disabled=false;
      this.body=ce ( 'div', {className: 'permissionlist-field-wrap field-wrap double'}, o.target);
      this.title=ce ( 'span', {className: 'title', innerHTML: o.title ? o.title : ""}, this.body);
      var el = ce ( 'div',  {className: 'acl field'}, this.body);

      function generateAclMap ()
      {
        var simpleTableAcl=
        {
          read: true,
          edit: true,
          add: true,
          remove: true,
          show: true
        };
        var aclMap=
        {
          table: 
          {
            order: simpleTableAcl
          },
          preference: 
          {
            system:
            {
            },
            user:
            {
            },
            router:
            {
            }
          },
          statistics: true,
          tools: true
        };
        for (var i=0 in Nuance.grids)
        {
          var grid=Nuance.grids[i],
              store=grid.store;
          if (!store.readOnly)
          {
            aclMap.table[store.name]=
            {
              read: {},
              edit: {},
              add: true,
              remove: true,
              show: true
            };
            for (var j=0; j<grid.store.header.length; j++)
            {
              grid.excludedFields.push('id');
              if (grid.excludedFields.indexOf(store.header[j][0])===-1)
              {
                aclMap.table[store.name].read[store.header[j][0]]=true;
                aclMap.table[store.name].edit[store.header[j][0]]=true;
              }
            }
          }
        }
        aclMap.table.log=simpleTableAcl;
        if (aclMap.table.scratchcard)
        {
          aclMap.table.scratchcard.edit=true;
        }
        return aclMap;
      };


      function onCheckboxChange()
      {
        var parentNode=this.parentNode;
        var value=this.getValue();
        while (parentNode.constructor===Nuance.input.CheckBox)
        {
          var hasTrueValues=false,
              hasFalseValues=false,
              hasPartialValues=false;

          for (var checkbox in parentNode)
          {
            if (typeof parentNode[checkbox]==='object' && checkbox!=='parentNode' && parentNode[checkbox].constructor===Nuance.input.CheckBox)
            {
              var item=parentNode[checkbox];
              if (item.getPartial())
              {
                hasPartialValues=true;
              }
              if (item.getValue())
              {
                hasTrueValues=true;
              }
              else
              {
                hasFalseValues=true;
              }
            }

          }

          if (hasPartialValues || (hasTrueValues && hasFalseValues))
          {
            parentNode.setPartial(true);
          }
          else
          {
            parentNode.setValue(hasTrueValues);
          }
          parentNode=parentNode.parentNode;
        }
        function updateChilds(parentNode)
        {
          for (var checkbox in parentNode)
          {
            if (typeof parentNode[checkbox]==='object' && checkbox!=='parentNode' && parentNode[checkbox].constructor===Nuance.input.CheckBox)
            {
              var item=parentNode[checkbox];
              item.setValue(value);
              updateChilds(item);
            }
          }
        }
        updateChilds(this);
      }

      function loadAcl (aclMap, aclChapter, child, chapter, level, parentValue, checkboxTree)
      {

        for (var i in aclMap)
        {
          if (typeof aclMap[i]==='object')
          {
            var newChild=ce ('div', {className: 'child acl-'+level+' acl-'+i}, child);

            if (typeof aclChapter==='object')
            {
              if (aclChapter[i])
              {
                var nextChapter=aclChapter[i];
              }
              else
              {
                var nextChapter=false;
              }
            }
            else
            {
              var nextChapter=aclChapter;
            }


            if (chapter==='table')
            {
              var title=_('table-'+i);
            }
            else
            {
              var title=_(i);
            }
            if (['read', 'edit', 'add', 'remove', 'show'].indexOf(i)!==-1)
            {
              title=i[0].toUpperCase();
            }
            var checkbox=new Nuance.input.CheckBox({ target: newChild, title: title, offText: ' ', onText: " ", partialText: " ", value: nextChapter, onchange: onCheckboxChange });
            
            checkboxTree[i]=checkbox;
            checkbox.parentNode=checkboxTree;

            if (typeof nextChapter==='object')
            {
              checkbox.setPartial();
            }
            checkbox.body.classList.add('checkbox-'+level);
            var container=ce ('div', {className: 'container'}, newChild);

            loadAcl(aclMap[i], nextChapter, container, i, level+1, parentValue, checkboxTree[i]);
          }
          else
          {
            var title=i;
            if (chapter=='edit' || chapter=='read')
            {
              title='';
            }
            else
            {
              title=_(i);
            }
            if (typeof aclChapter==='object')
            {
              var value=aclChapter[i];
            }
            else
            {
              var value=aclChapter;
            }
            if (chapter=='read')
            {
              ce('div', {className: 'left-title', innerHTML: _(i)}, child);
            }
            if (['read', 'edit', 'add', 'remove', 'show'].indexOf(i)!==-1)
            {
              if (i!=='remove')
              {
                title=i[0].toUpperCase();
              }
              else
              {
                title='D';
              }
            }

            var checkbox=new Nuance.input.CheckBox({ target: child, title: title, offText: ' ', onText: " ", partialText: " ", value: value, onchange: onCheckboxChange});
            checkbox.parentNode=checkboxTree;
            checkbox.body.classList.add('checkbox-'+level);
          }
          checkboxTree[i]=checkbox;
          if (['read', 'edit', 'add', 'remove', 'show'].indexOf(i)!==-1)
          {
            checkbox.title.title=_(i);
          }
        }
      }


      function getValues(aclMap, checkboxTree)
      {
        for (var i in aclMap)
        {
          if (checkboxTree[i].getPartial() && typeof aclMap[i]==='object')
          {
            getValues(aclMap[i], checkboxTree[i]);
          }
          else if (checkboxTree[i].getValue())
          {
            aclMap[i]=true;
          }
          else
          {
            delete aclMap[i];
          }
        }
        
      }

      this.getValue=function()
      {

        var aclMap=generateAclMap();
        getValues(aclMap, checkboxTree);
        return JSON.stringify(aclMap);
      }


      var checkboxTree={};

      this.setValue=function(value)
      {
        el.removeChilds();
        var aclMap=generateAclMap();
        var acl=JSON.parse(value) || {};
        checkboxTree={};
        loadAcl(aclMap, acl, el, false, 0, acl, checkboxTree);
      };
      this.isDisabled=function()
      {
        return disabled;
      }
      function setCheckboxDisabled(checkboxTree)
      {
        for (var i in checkboxTree)
        {
          if (typeof checkboxTree[i]==='object' && i!=='parentNode' && checkboxTree[i].constructor===Nuance.input.CheckBox)
          {
            checkboxTree[i].setDisabled(disabled);
            setCheckboxDisabled(checkboxTree[i]);
          }
        }
      }
      this.setDisabled=function(d)
      {
        disabled=!!d;
        setCheckboxDisabled(checkboxTree);
      }
      this.setValue( '{}' );
      Nuance.input.__Field.call(this, o);
    }
  },
  onallstoresloaded: new Array(),
  stores: new Object(),
  grids: new Object(),
  ContextMenu: function (o)
  {
    var event=o.event,
        options=o.options,
        x=o.x || event.clientX,
        y=o.y || event.clientY,
        self=this;
    this.el=ce ('div', 
      {
        className: 'context-menu'
      }
    );
    if (options && options.length)
    {
      for (var i=0; i<options.length; i++)
      {
        if (options[i].beforeshow)
        {
          options[i].beforeshow();
        }
        if (options[i].topSeparator && i)
        {
          ce('div', {className: 'context-separator', oncontextmenu: falsefunc}, this.el);
        }
        var itemEl=ce('div', {className: 'context-option', innerHTML: options[i].title, oncontextmenu: falsefunc}, this.el);
        if (options[i].disabled)
        {
          itemEl.classList.add('disabled');
        }
        else
        {
          itemEl.onclick= options[i].onclick;
        }
        if (options[i].bottomSeparator && (i+1)!==options.length)
        {
          ce('div', {className: 'context-separator', oncontextmenu: falsefunc}, this.el);
        }
      }
    }
    var onBlur=function(e)
    {
      if (event===e) return;
      window.removeEventListener('click', onBlur);
      window.removeEventListener('contextmenu', onBlur);
      document.body.removeChild(self.el);
      self.trigger('close');
    }
    window.addEventListener('click', onBlur);
    window.addEventListener('contextmenu', onBlur);
    this.close=onBlur;

    if (y < document.body.clientHeight/2)
    {
      this.el.style.top=y +'px';
    }
    else
    {
      this.el.style.bottom=document.body.clientHeight - y +'px';
    }
    if (o.floatSide)
    {
      if (o.floatSide==='left')
      {
        this.el.style.left=0;
      }
      else if (o.floatSide==='right')
      {
        this.el.style.right=0;
      }
    }
    else
    {
      if (x < document.body.clientWidth/2)
      {
        this.el.style.left=x+'px';
      }
      else
      {
        this.el.style.right=document.body.clientWidth - x + 'px';
      }
    }
    Nuance.EventMixin.call(this, o);

    document.body.appendChild(self.el);
  },
  Popup : function (o)
  {
    /*
       OPTIONS:

       title
       target
       buttons
       bodyLayout
       winLayout
       btnLayout
       closable
       fields

  */
    var self=this,
        buttons=[],
        closeAnimation=false,
        wasClosed=false;
    function addClasses()
    {
      var popups=document.getElementsByClassName('popups-wrap');
      for (var i=0; i<popups.length-1; i++)
      {
        popups[i].style.position='fixed';
      }
      if (popups.length) popups[popups.length-1].style.position='';
    }
    this.close = function()
    {
      if (closeAnimation)
      {
        self._popupWin.addEventListener('transitionend', function()
            {
              self._bigPopupWraps && self._bigPopupWraps.parentNode && self._bigPopupWraps.parentNode.removeChild(self._popupWraps);
              self._popupWraps && self._popupWraps.parentNode && self._popupWraps.parentNode.removeChild(self._popupWraps);
              self._popupWrap && self._popupWrap.parentNode && self._popupWrap.parentNode.removeChild(self._popupWrap);
              self._popupWin && self._popupWin.parentNode && self._popupWin.parentNode.removeChild(self._popupWin);
            });
        self._popupWraps.style.opacity=0;
        self._popupWin.style.opacity=0;
      }
      else
      {
        self._bigPopupWraps && self._bigPopupWraps.parentNode && self._bigPopupWraps.parentNode.removeChild(self._bigPopupWraps);
        self._popupWraps && self._popupWraps.parentNode && self._popupWraps.parentNode.removeChild(self._popupWraps);
        self._popupWrap && self._popupWrap.parentNode && self._popupWrap.parentNode.removeChild(self._popupWrap);
        self._popupWin && self._popupWin.parentNode && self._popupWin.parentNode.removeChild(self._popupWin);
      }
      addClasses();
      for (var i=0; i<buttons.length; i++)
      {
        buttons[i].destroy();
      }
      document.removeEventListener('keyup',keyClose);
      self.onclose && self.onclose();
    };
    this.setWidth=function(width)
    {
      self._popupWin.style.width=width+'px';
    }
    this.setHeight=function(height)
    {
      self._popupWin.style.height=height+'px';
    }
    if (o.target)
    {
      this._popupWin=o.target;
    }
    else
    {
      this._bigPopupWraps  = ce ( 'div', { className: 'big-popups-wrap' }, document.body);
      this._popupWraps = ce ( 'div', { className: 'popups-wrap' }, this._bigPopupWraps );
      this._popupWrap = ce ( 'div', { className: 'popup-wrap' }, this._popupWraps);
      this._popupWin = ce ( 'div',  { className: 'popup-window' },this._popupWrap);
      addClasses();
      if (o.winLayout) this._popupWin.classList.add(o.winLayout);
    }
    var popupTitle = ce (  'p',  { className: 'popup-caption', innerHTML: o.title}, this._popupWin, true);
    if (!o.target && o.closable!=false)
    {
      var closeBtn=new Nuance.input.Button({target: popupTitle , onclick: this.close, iconClass: 'remove'});
      closeBtn.el.classList.add('close-button');
    }

    if (o.width) this.setWidth(o.width);
    if (o.height) this.setHeight(o.height);
    function keyClose(e)
    {
      if (e.which==27 && !wasClosed)
      {
        e.cancelBubble=true;
        wasClosed=true;
        e.stopPropagation();
        self.close();
      }
    }
    document.addEventListener('keyup', keyClose);
    this.body= (o.body) ? this._popupWin.appendChild(o.body) : ce(  'div',  {className: 'popup-body', name: 'popup-body' }, this._popupWin);
    if (o.bodyLayout) this.body.classList.add(o.bodyLayout);
    var fieldsByName={};

    if (o.fields)
    {
      var fields=o.fields;
      for (var i=0; i<fields.length; i++)
      {
        this.body.appendChild(fields[i].body);
        fieldsByName[fields[i].getName()]=fields[i];
      }
    }
    this.getFields=function(){return fieldsByName;}
    if (o.buttons)
    {
      var buttons=o.buttons;
      for (var i=0; i<buttons; i++) buttons[i].scope=self;
      var buttons=new Nuance.input.ButtonGroup({buttons: buttons, btnLayout: o.btnLayout, target: this._popupWin}).getButtons();
    }
  },
  MessageBox : function (o)
  {
    /*
       OPTIONS:

       title
       buttons
       text

  */
    var self=this;
    o.title=o.title || "&nbsp;";
    o.buttons=o.buttons || [{value: "OK", scope: this, submit: true, onclick: function(){this.close()}}];
    Nuance.Popup.call(this, o);
    self._popupWin.classList.add('messagebox');
    ce("p", {innerHTML: o.text || ""}, this.body);
  },
  PreferencesActivity: function (o)
  {

    var self=this,
        changedOptions=[],
        configType=type=o.type,
        configProxy=o.configProxy,
        owner=(typeof o.owner!='undefined') ? o.owner : 0,
        config=configProxy.__config,
        defaults=configProxy.__default,
        currentOwnerConfig=mergeProps(defaults[type], config[type][owner], true);

    var tabPanel=new Nuance.TabPanel({
      name: 'preferences',
      target: o.target,
      prefix: 'preferences'
    });

    var saveMessage=ce('div', {className: 'save-message flex-wrap'}, tabPanel.contentEl);
    saveMessage.style.display='none';
    var saveMessageText=ce('div', {className: 'save-message-text', innerHTML: _("Some settings were changed. Do you want to save it?")}, saveMessage);
    function saveChanges()
    {
      for (var i=0; i<changedOptions.length; i++)
      {
        var option=changedOptions[i];
        option.initialValue=option.getValue();
        configProxy.setValue(configType, option.section, option.getName(), option.getValue());
      }
      changedOptions=[];
      saveMessage.style.display='none';
    }
    function discardChanges()
    {
      for (var i=0; i<changedOptions.length; i++)
      {
        changedOptions[i].setValue(changedOptions[i].initialValue);
      }
      changedOptions=[];
      saveMessage.style.display='none';
    }
    var saveButton=new Nuance.input.Button({value: _("Save"), iconClass: 'ok', target: saveMessage, onclick: saveChanges});
    var cancelButton=new Nuance.input.Button({value: _("Cancel"), iconClass: 'remove', target: saveMessage, onclick: discardChanges});

    var fields=[];
    var fieldsTree={};
    this.fields=fields;
    this.getValues=function()
    {
      var values=[];
      for (var i=0;i<fields.length; i++)
      {
        var index=fields[i].index;
        if (index != -1) values[index]=fields[i].getValue();
      }
      return values;
    };
    this.getField=function(fieldName)
    {
      for (var i=0; i<fields.length; i++)
      {
        if (fields[i].getName()==fieldName) return fields[i];
      }
    }
    var sections=[];
    for (var i in currentOwnerConfig)
    {
      sections.push(i);
    }
    var prevSection;
    function onChange()
    {
      if (this.getValue()!==this.initialValue)
      {
        changedOptions.push(this);
      }
      else
      {
        var index=changedOptions.indexOf(this);
        if (index!==-1)
        {
          changedOptions.splice(index, 1);
        }
      }
      saveMessage.style.display=changedOptions.length ? '' : 'none';
    }
    for (var n=0; n<sections.length; n++)
    {
      var i=sections[n];
      fieldsTree[i]={};
      var section=currentOwnerConfig[i];

      tabPanel.addTab(
        {
          title: _('optSection-'+i),
          name: i
        }
      );
      for (var name in section)
      {
        if (typeof defaults[configType][i]==='undefined' || 
            typeof defaults[configType][i][name]==='undefined')
        {
          continue;
        }
        var value=section[name];
        var customOptions=false;
        if (o.customOptions)
        {
          try
          {
            customOptions=o.customOptions[configType][i][name];
          }
          catch (e)
          {}
        };
        var field;
        var fieldOpts=
        {
          name: name,
          title: _([configType, i, name].join('-')),
          target: tabPanel.tabs[i],
          value: value,
          type: typeof value
        };
        if (customOptions)
        {
          fieldOpts=mergeProps(fieldOpts, customOptions, true);
        }
        var type=fieldOpts.type;
        delete fieldOpts.type;
        if (Nuance.stores[name]) type='link';
        switch (type)
        {
          case 'hidden' : 
          continue;

          case 'documents' :
            field=new Nuance.input.Documents(fieldOpts); 
          break;

          case 'multitext' : 
            field=new Nuance.input.TextArea(fieldOpts); 
          break;

          case 'boolean': 
            field=new Nuance.input.CheckBox(fieldOpts);
          break;

          case 'tarifflink':
          case 'link':
            if (!fieldOpts.store) fieldOpts.store=Nuance.stores[name];
            for (var d=0; d<fields.length; d++)
            {
              var field=fields[d];
              if (fieldOpts.store.ns && fieldOpts.store.ns.hasOwnProperty(field.getName()) && field.constructor==Nuance.input.ComboBox)
              {
                fieldOpts.parentList=field; break;
              };
            }
            field=new Nuance.input.ComboBox(fieldOpts);
          break;

          default:
            field=new Nuance.input.TextField(fieldOpts);
          break;
        };
        field.form=self;
        field.initialValue=value;
        field.section=i;
        fields.push(field);
        field.on('change', onChange);
        fieldsTree[i][name]=field;
      }
    }
    var focusIsSet=false;
    for (var i=0; i<fields.length; i++)
    {
      if (!focusIsSet && fields[i].el && typeof fields[i].el.focus=='function')
      {
        fields[i].el.focus();
        focusIsSet=false;
      }
      var field=fields[i];
    }

    // Cranch: disable some fields which depends on others
  
    fieldsTree.grid['user-idrenderer'].addEventListener('change',function()
    {
      fieldsTree.grid['user-idrenderer-format'].setDisabled(fieldsTree.grid['user-idrenderer'].getValue()!==1);
    });

    fieldsTree.grid['scratchcard-idrenderer'].addEventListener('change',function()
    {
      fieldsTree.grid['scratchcard-idrenderer-format'].setDisabled(fieldsTree.grid['scratchcard-idrenderer'].getValue()!==1);
    });

    var typeOfCalculationField=fieldsTree.cash['typeOfCalculation'];
    typeOfCalculationField.addEventListener('change',function()
    {
      switch (typeOfCalculationField.getValue())
      {
        case 'advance':
          fieldsTree.cash['creditMonths'].setDisabled(true);
          fieldsTree.cash['creditMonths'].setValue(0);
        break;
        case 'postpay':
          fieldsTree.cash['creditMonths'].setDisabled(true);
          fieldsTree.cash['creditMonths'].setValue(1);
        break;
        case 'other':
          fieldsTree.cash['creditMonths'].setDisabled(false);
        break;

      }
      onChange.call(fieldsTree.cash['creditMonths']);

    });

    fieldsTree.tariff['nightHourStart'].setValue('00:00:00');
    fieldsTree.tariff['nightHourStart'].setDisabled(true);


    var showNotificationsField=fieldsTree.cash['showNotifications'];
    showNotificationsField.on('change',function()
    {
      var hideNotificationsPreferencesValue=!showNotificationsField.getValue();
      fieldsTree.cash['notificationsOffset'].setDisabled(hideNotificationsPreferencesValue);
      fieldsTree.cash['notificationsDuration'].setDisabled(hideNotificationsPreferencesValue);
    }, true);


  },
  PreferencesPopup: function (o)
  {
    /*
     * OPTIONS:
     *
     * fenderers
     * settingsProxy
     * excludedFields
     * configProxy
     *
     */

    var self=this,
        configType=type=o.type,
        configProxy=o.configProxy,
        owner=(typeof o.owner!=='undefined') ? o.owner : 0,
        config=configProxy.getConfigTree(type, owner),
        defaults=configProxy.getDefaults(type, owner),
        currentOwnerConfig=mergeProps(defaults, config, true);

    o.winLayout='triple';
    o.bodyLayout='double';
    o.btnLayout='double';
    o.title=_('Preferences');
    var okClick=function()
    {
      self.close();
      for (var d=0; d<fields.length; d++)
      {
        var field=fields[d];
        if (field.index==-1) continue;
        var newValue=field.getValue();
        if (newValue !== currentOwnerConfig[field.section][field.getName()])
        {
          configProxy.setValue(configType, field.section, field.getName(), newValue, owner)
        }
      }
    }
    o.buttons=[{onclick: okClick, value: _("Save"), submit: true, iconClass: 'edit'}, {onclick: function(){self.close()}, value: _("Cancel"), iconClass: 'remove'}];
    Nuance.Popup.call(this, o);
    this.body.classList.add('preferences-popup');
    var fields=[];
    var fieldsTree={};
    this.fields=fields;
    this.getValues=function()
    {
      var values=[];
      for (var i=0;i<fields.length; i++)
      {
        var index=fields[i].index;
        if (index != -1) values[index]=fields[i].getValue();
      }
      return values;
    };
    this.getField=function(fieldName)
    {
      for (var i=0; i<fields.length; i++)
      {
        if (fields[i].getName()==fieldName) return fields[i];
      }
    }
    var sections=[];
    for (var i in currentOwnerConfig)
    {
      sections.push(i);
    }
    var prevSection;
    for (var n=0; n<sections.length; n++)
    {
      var i=sections[n];
      fieldsTree[i]={};
      var section=currentOwnerConfig[i];

      // Insert sectoin title
      var field=new Nuance.TextLabel({text: _('optSection-'+i), target: self.body});
      field.index= -1;
      fields.push(field);
      for (var name in section)
      {
        if (typeof defaults[i][name]==='undefined')
        {
          continue;
        }
        var value=section[name];
        var customOptions=false;
        if (o.customOptions)
        {
          try
          {
            customOptions=o.customOptions[configType][i][name];
          }
          catch (e)
          {}
        };
        var field;
        var fieldOpts=
        {
          name: name,
          title: _([configType, i, name].join('-')),
          target: self.body,
          value: value,
          type: typeof value
        };
        if (customOptions)
        {
          fieldOpts=mergeProps(fieldOpts, customOptions, true);
        }
        var type=fieldOpts.type;
        delete fieldOpts.type;
        if (Nuance.stores[name]) type='link';
        switch (type)
        {
          case 'hidden' : continue;
          case 'documents' : field=new Nuance.input.Documents(fieldOpts); break;
          case 'multitext' : field=new Nuance.input.TextArea(fieldOpts); break;
          case 'boolean': field=new Nuance.input.CheckBox(fieldOpts); break;
          case 'tarifflink':
          case 'link':
                          {
                            if (!fieldOpts.store) fieldOpts.store=Nuance.stores[name];
                            for (var d=0; d<fields.length; d++)
                            {
                              var field=fields[d];
                              if (fieldOpts.store.ns && fieldOpts.store.ns.hasOwnProperty(field.getName()) && field.constructor==Nuance.input.ComboBox)
                              {
                                fieldOpts.parentList=field; break;
                              };
                            }
                            field=new Nuance.input.ComboBox(fieldOpts);
                            break;
                          }
          default: field=new Nuance.input.TextField(fieldOpts); break;
        };
        field.form=self;
        field.section=i;
        fields.push(field);
        fieldsTree[i][name]=field;
      }
    }
    var focusIsSet=false;
    for (var i=0; i<fields.length; i++)
    {
      if (!focusIsSet && fields[i].el && typeof fields[i].el.focus=='function')
      {
        fields[i].el.focus();
        focusIsSet=false;
      }
      var field=fields[i];
      if (field.section==='grid' && field.getName()==='user-idrenderer')
      {
        
      }
    }

    // Cranch: disable some fields which depends on others
    
    if (configType==='system')
    {
      fieldsTree.grid['user-idrenderer'].addEventListener('change',function()
      {
        fieldsTree.grid['user-idrenderer-format'].setDisabled(fieldsTree.grid['user-idrenderer'].getValue()!==1);
      });

      fieldsTree.grid['scratchcard-idrenderer'].addEventListener('change',function()
      {
        fieldsTree.grid['scratchcard-idrenderer-format'].setDisabled(fieldsTree.grid['scratchcard-idrenderer'].getValue()!==1);
      });

      var typeOfCalculationField=fieldsTree.cash['typeOfCalculation'];
      typeOfCalculationField.addEventListener('change',function()
      {
        var typeOfCalculation=typeOfCalculationField.getValue();
        switch (typeOfCalculation)
        {
          case 'advance':
            fieldsTree.cash['creditMonths'].setDisabled(true);
            fieldsTree.cash['creditMonths'].setValue(0);
          break;
          case 'postpay':
            fieldsTree.cash['creditMonths'].setDisabled(true);
            fieldsTree.cash['creditMonths'].setValue(1);
          break;
          case 'other':
            fieldsTree.cash['creditMonths'].setDisabled(false);
          break;
        }

      });

      fieldsTree.tariff['nightHourStart'].setValue('00:00:00');
      fieldsTree.tariff['nightHourStart'].setDisabled(true);
    }

  },
  BroadcastChatPopup: function(o)
  {
    var self=this,
        o=o || {};

    o.title=_("Send broadcast message");
    function sendBroadcastMessage()
    {
      var fields=self.getFields();
      var values=
      {
        user: fields.user.getValue(),
        text: fields.text.getValue()
      };
      Nuance.stores.message.add(values, Nuance.stores.message.load);
      self.close();
    }
    o.fields=
    [
      new Nuance.input.ComboBox(
        {
          title: _("Users"),
          name: 'user',
          multiple: true,
          avoidSort: true,
          value: o.users,
          store: Nuance.stores.user
        }
      ),
      new Nuance.input.TextArea(
        {
          name: 'text',
          title: _("Message text")
        }
      )
    ];
    o.buttons=
    [
      {
        value: _("Cancel"),
        iconClass: 'remove',
        onclick: function()
        {
          self.close();
        }
      },
      {
        value: _("Send"),
        iconClass: 'mail',
        onclick: sendBroadcastMessage
      }
    ];


    Nuance.Popup.call(this, o);
    this._popupWin.classList.add('triple');
  },
  ChatPopup: function (o)
  {
    var self=this,
        userId=o.userId;
    
    o.title=_("Messages");

    Nuance.Popup.call(this, o);

    this._popupWin.classList.add('triple');
    this._popupWin.classList.add('message-window');

    var historyField=ce('div', {className: 'message-area'}, this.body);
    var newMessageField=new Nuance.input.TextArea({title: '', target: this.body});
    var buttonGroup=new Nuance.input.ButtonGroup({buttons: [{value: _("Mark all as read"), onclick: markAllAsRead, iconClass: 'tag'}, {value: _("Send"), onclick: sendMessage, iconClass: 'mail'}], target: this._popupWin});
    var sendButton=buttonGroup.getButtons()[1];

    sendButton.el.classList.add('primary');

    var newMessages=[];

    var messageStore=Nuance.stores.message;
    var ns=messageStore.ns;

    function markAllAsRead()
    {
      for (var i=0; i<newMessages.length; i++)
      {
        var id=newMessages[i];
        messageStore.edit(id, {is_new: 0, readdate: (new Date).toString(dbDateTimeFormat)});
      }
    }
    function sendMessage()
    {
      var text=newMessageField.getValue();
      if (text)
      {
        var message=
        {
          text: text,
          sender: window.userId,
          sender_is_admin: 1,
          recipient: userId,
          recipient_is_admin: 0,
          date: (new Date).toString(dbDateTimeFormat),
          is_new: 1
        };
        newMessageField.setValue('');
        messageStore.add(message);
      }
    }
    function renderMessage(text, sender, date, isNew, isIncoming)
    {
      var body=ce ('div', {className: 'message'}, historyField);
      if (isIncoming)
      {
        body.classList.add('incoming');
        if (isNew)
        {
          body.classList.add('new');
        }
      }
      ce('span', {className: 'sender', innerHTML: sender}, body);
      ce('span', {className: 'date', innerHTML: date}, body);
      ce('div', {className: 'text', innerHTML: text}, body);
    }

    function loadHistory()
    {
      for (var i in messageStore.data)
      {
        var message=messageStore.data[i];
        if ( (!message[ns.sender_is_admin] && message[ns.sender]==userId) ||
             (!message[ns.recipient_is_admin] && message[ns.recipient]==userId) )
        {
          if (message[ns.sender_is_admin])
          {
            var sender=Nuance.stores.master.getNameById(message[ns.sender]);
          }
          else
          {
            var sender=Nuance.stores.user.getNameById(message[ns.sender]);
          }
          if (message[ns.recipient_is_admin] && message[ns.is_new])
          {
            newMessages.push(i);
          }
          renderMessage(message[ns.text], sender, message[ns.date], message[ns.is_new], message[ns.recipient_is_admin])
        }

      }
      historyField.scrollTop=historyField.scrollHeight;
    }
    
    messageStore.on('afterload', loadHistory, true);
    messageStore.on('afteradd', loadHistory);
    messageStore.on('afteredit', loadHistory);


  },
  StatsPopup: function (o)
  {
    var infoWindow=new Nuance.Popup({
      closable: true, 
    title: o.title || ''
    });
    infoWindow._popupWin.classList.add('stat-window');
    var periods=['daily', 'weekly', 'monthly', 'yearly'];
    var path=encodeURI(o.path);
    var extraParams=o.extraParams;
    function loadContent()
    {
      infoWindow.body.innerHTML="";
      for (var i=0; i<4; i++)
      {
        var part=ce('div',{className: 'user-info'}, infoWindow.body);
        ce("p",{innerHTML: _("userstats-"+periods[i])}, part);
        var img=ce("img",{src: "ajax.php?action=getstatimage&path="+path+"/"+periods[i]+extraParams, className: 'image-transition'}, part);
        img.onload=function(){this.classList.add('image-loaded')};
      }
    }
    function refreshContent()
    {
      for (var i=0; i<4; i++)
      {
        infoWindow.body.children[i].lastChild.src="ajax.php?action=getstatimage&path="+path+"/"+periods[i]+extraParams+'&timestamp='+(new Date).getTime();
      }
    }

    loadContent();
    var timerId=setInterval(refreshContent, 10000);
    infoWindow.onclose=function(){clearTimeout(timerId);};
  },

  StorePopup : function(o)
  {
    /*
       OPTIONS:

       customFields
       includedFields
       excludedFields
       onlyIncludedFields=false
       store
       title
       buttons
       callback
       id

  */
    var self=this;
    var onlyIncludedFields=o.onlyIncludedFields,
        excludedFields=o.excludedFields || [],
        customFields=o.customFields || {},
        includedFields=o.includedFields || [];
    excludedFields.push('id');
    var fieldsByName={};
    if (onlyIncludedFields && !includedFields)
    {
      throw new Error('includedFields option must be specified wnen using onlyIncludedFields');
    }
    o.winLayout='double';
    o.bodyLayout='double';
    o.btnLayout='double';
    Nuance.Popup.call(this, o);
    var fields=[];
    this.fields=fields;
    this.recordId=o.recordId;
    this.getValues=function()
    {
      var values=cloneArray(o.store.data[o.recordId] || []);
      for (var i=0;i<fields.length; i++)
      {
        values[fields[i].index]=fields[i].getValue();
      }
      return values;
    };
    this.getField=function(fieldName)
    {
      for (var i=0; i<fields.length; i++)
      {
        if (fields[i].getName()==fieldName) return fields[i];
      }
    }
    this.getFields=function(){return fieldsByName;}

    for (var i=0;i<o.store.header.length; i++)
    {
      var hname=o.store.header[i][0];// header name
      var htype = o.store.header[i][1];
      if (onlyIncludedFields)
      {
        if (includedFields.indexOf(hname)==-1)
        {
          continue;
        }
      }
      else
      {
        if (excludedFields.indexOf(hname)!=-1)
        {
          continue;
        }
      }
      var field;
      var fieldOpts=
      {
        name: hname,
        form: self,
        recordId: o.recordId,
        index: i,
        title: _(o.store.header[i][0]),
        allowView: true,
        selectOnlyItem: true,
        target: self.body,
        value: (typeof o.store.data[o.recordId]!=='undefined') ? o.store.data[o.recordId][i] : null
      };
      if (customFields[hname])
      {
        fieldOpts=mergeProps(fieldOpts, customFields[hname], true);
      }
      switch (htype)
      {
        case 'id':
        case 'hidden': continue;
        case 'multitext' : field=new Nuance.input.TextArea(fieldOpts); break;
        case 'speed' : field=new Nuance.input.SpeedField(fieldOpts); break;
        case 'discount' : field=new Nuance.input.DiscountField(fieldOpts); break;
        case 'bit':
        case 'tinyint': field=new Nuance.input.CheckBox(fieldOpts); break;
        case 'acl': field=new Nuance.input.PermissionList(fieldOpts); break;
        case 'iplist': field=new Nuance.input.IpList(fieldOpts); break;
        case 'tarifflist': field=new Nuance.input.TariffList(fieldOpts); break;
        case 'md5password': field=new Nuance.input.PasswordField(fieldOpts); break;
        case 'password': field=new Nuance.input.ViewPasswordField(fieldOpts); break;
        case 'generatepassword': field=new Nuance.input.GenerateViewPasswordField(fieldOpts); break;
        case 'date':
        case 'timestamp':
          field=new Nuance.input.DateField(fieldOpts); 
          break;
        case 'phone': field=new Nuance.input.PhoneNumberField(fieldOpts); break;
        case 'charlink':
        case 'tarifflink':
        case 'multilink':
        case 'link':
          if (typeof o.store.header[i][2]=='string')
          {
            hname=o.store.header[i][2];
          }
          if (Nuance.stores[hname])
          {
            fieldOpts.store= Nuance.stores[hname];
            if (!fieldOpts.hasOwnProperty('parentList'))
            {
              for (var d=0; d<fields.length; d++)
              {
                var field=fields[d];
                if (fieldOpts.store.ns.hasOwnProperty(field.getName()) && field.constructor==Nuance.input.ComboBox)
                {
                  fieldOpts.parentList=field; break;
                }
              }
            }
            if (htype==='multilink')
            { 
              fieldOpts.multiple=true;
              field=new Nuance.input.ComboBox(fieldOpts);
            }
            else if (htype==='tarifflink')
            {
              field=new Nuance.input.TariffComboBox(fieldOpts);
            }
            else
            {
              field=new Nuance.input.ComboBox(fieldOpts);
            }
          }
        break;
        default: field=new Nuance.input.TextField(fieldOpts); break;
      };
      fieldsByName[hname]=field;
      field.index=i;
      fields.push(field);
    }
    for (var d=0; d<fields.length; d++)
    {
      if (fields[d].el && typeof fields[d].el.focus=='function' && typeof fields[d].isDisabled=='function' && !fields[d].isDisabled())
      {
        fields[d].el.focus();
        break;
      }
    }
  },
  LogPopup:function(opts)
  {
    var self=this;
    var defopts=
    {
      text: _("Empty response"),
      title: "",
      textHeight: 400
    };
    var o=mergeProps(defopts, opts, true);
    var targetopts=
    {
      buttons: 
        [
        {value: _("Select all"), onclick: function(){self.getFields().codes.select()}},
        {onclick: function(){self.close()}, value: _("Close")}
      ],
        title: o.title,
        winLayout:'double',
        bodyLayout:'double',
        btnLayout:'double',
        fields:
          [
          new Nuance.input.TextArea({name: 'codes', disabled: true, value: o.text, height: o.textHeight, title: _("Codes")})
          ]
    }
    Nuance.Popup.call(this, targetopts);
  },
  LoadingPopup: function (opts)
  {
    var defopts=
    {
      title: _("Loading"),
      text: _("Please wait..."),
      closable: false
    };
    var targetopts=mergeProps(defopts, opts, true);
    Nuance.Popup.call(this, targetopts);
    this._popupWin.classList.add('loading-window');
    var preloader=ce("div", {className: 'icon loading'}, this.body);
  },
  FreeInetPopup : function(o)
  {
    var self=this,
        orderStore=Nuance.stores.order,
        moneyflowStore=Nuance.stores.moneyflow,
        o=o || {};

    o.title=_("Free internet");
    o.winLayout='double';
    o.bodyLayout='double';
    o.btnLayout='double';
    o.fields=
    [
      new Nuance.input.TextField(
      {
        name: 'duration',
        title: _('Duration')
      }),
      new Nuance.input.CheckBox(
      {
        name: 'ispaid',
        title: _('Withdraw funds')
      })
    ];

    var okClick=function()
    {
      var fields=self.getFields();
      var duration=parseInt(fields.duration.getValue());
      if (/^[0-9]{1,3}$/.test(duration))
      {
        self.close();


        Nuance.grids.user.setState('loading');
        var newOrderValues=
        {
          user: o.user,
          detailsname: 'tariff',
          detailsid: o.tariff,
          startdate: Date.today().toString(dbDateTimeFormat),
          enddate: Date.today().addDays(duration).addSeconds(-1).toString(dbDateTimeFormat)
        }

        if (fields.ispaid.getValue())
        {
          newOrderValues.temp=0;
        }
        else
        {
          newOrderValues.temp=1;
        }

        orderStore.add(newOrderValues,
          function(response)
          {
            // Get added order id
            for (var i in response.data)
            {
              var orderId=i;
              break;
            }

            var newMoneyflowValues=
            {
              user: o.user,
              detailsid: orderId,
              date: Date.today().toString(dbDateTimeFormat)
            }

            if (fields.ispaid.getValue())
            {
              newMoneyflowValues.detailsname='order';

              var withdrawalDay=configProxy.getValue('system', 'cash', 'withdrawalDay');

              var midnightOptions={millisecond: 0, second: 0, minute: 0, hour: 0};

              var periodStartDate=Date.today();
              var periodEndDate = Date.today();
              var startDate = Date.today();
              var endDate = Date.today().addDays(duration);

              periodStartDate.set(midnightOptions);
              periodStartDate.setDate(withdrawalDay);

              periodEndDate.set(midnightOptions);
              periodEndDate.setDate(withdrawalDay);
              periodEndDate.addMonths(1);
              periodEndDate.addSeconds(-1);


              if (withdrawalDay)
              {
                periodStartDate.addDays(withdrawalDay);
                periodEndDate.addDays(withdrawalDay);
              }
              
              if (startDate<periodStartDate)
              {
                periodStartDate.addMonths(-1);
                periodEndDate.addMonths(-1);
              }


              var a=periodEndDate.getTime() - periodStartDate.getTime();
              var b=endDate.getTime() - startDate.getTime();

              var tariffStore=Nuance.stores.tariff;
              var tariffRow=tariffStore.getById(o.tariff, true);
              
              var tariffPrice=tariffRow.price;
              var percentage=b/a;
              newMoneyflowValues.sum=money(tariffPrice * percentage);
            }
            else
            {
              newMoneyflowValues.detailsname='temporder';
              newMoneyflowValues.sum=0;
            }
          
            moneyflowStore.add(newMoneyflowValues);
          }
        );
      }
      else
      {
        new Nuance.MessageBox({text: _("Incorrect value"), title: _("Error")});
      }
    };
    o.buttons=[{onclick: okClick, value: _("Activate"), submit: true, iconClass: 'add'}, {onclick: function(){self.close()}, value: _("Cancel"), iconClass: 'remove'}];
    Nuance.Popup.call(this, o);
  },
  FundPopup : function(o)
  {
    var self=this,
        userId=o.userId;
    o.title=_("Fund");
    o.winLayout='double';
    o.bodyLayout='double';
    o.btnLayout='double';
    var store=Nuance.stores.moneyflow;
    var userStore=Nuance.stores.user;

    a=self;
    o.fields=
    [
      new Nuance.input.ComboBox(
        {
          name:"user",
          title: _("User"),
          store: Nuance.stores.user,
          value: userId
        }
      ),
      new Nuance.input.TextField(
        {
          name:"sum",
          title: _("Payment sum")
        }
      ),
      new Nuance.input.TextField(
        {
          name:"name",
          title:_("name")
        }
      ),
      new Nuance.input.TextField(
        {
          name:"newcash",
          title: _("New cash")
        }
      ),
      new Nuance.input.TextArea(
        {
          name:"comment",
          title:_("Comment")
        }
      )
    ]
    var okClick=function()
    {
      var userId=fields.user.getValue();
      var sum=fields.sum.getValue();
      if (/^-?[0-9]{1,7}(?:\.[0-9]{1,2})?$/.test(sum) && userId)
      {
        var values=
        {
          user: userId,
          sum: money(sum),
          detailsname: 'adminpay',
          name: fields.name.getValue(),
          comment: fields.comment.getValue()
        };
        Nuance.grids.user.setState('loading');
        store.add(values, Nuance.stores.activeorder.load);
        self.close();
      }
      else
      {
        new Nuance.MessageBox({text: _("Incorrect value"), title: _("Error")});
      }
    };
    o.buttons=[{onclick: okClick, value: _("Fund"), submit: true, iconClass: 'add'}, {onclick: function(){self.close()}, value: _("Cancel"), iconClass: 'remove'}];
    Nuance.Popup.call(this, o);
    
    self._popupWin.classList.add('fund-popup');
    var fields=self.getFields();

    fields.name.el.placeholder=_("Not required");
    fields.comment.el.placeholder=_("Not required");

    function onSumFieldChange()
    {
      var userId=fields.user.getValue();
      var currentCash=money( userStore.getById(userId, true).cash);
      fields.sum.el.value=smoneyf(fields.sum.el.value);
      fields.newcash.el.value=smoneyf(money(fields.sum.getValue()) + currentCash);
    }
    function onNewCashFieldChange()
    {
      var userId=fields.user.getValue();
      var currentCash=money( userStore.getById(userId, true).cash);
      fields.newcash.el.value=smoneyf(fields.newcash.el.value);
      fields.sum.el.value=smoneyf(money(fields.newcash.getValue()) - currentCash);
    }
    function onUserFieldChange()
    {
      var userId=fields.user.getValue();
      if (userId)
      {
        var tariffID=userStore.getById(userId)[userStore.ns.tariff];
        if ( parseInt(tariffID) )
        {
          var tariffStore=Nuance.stores.tariff;
          var order=activeOrder[userId];
          var currentCash=money( userStore.getById(userId, true).cash);
          

          if (order && !order[Nuance.stores.order.ns.temp])  // User already have inet, propose to pay for next month
          {
            var fullMonthSum=true;
          }
          else
          {
            var fullMonthSum=false;
          }


          function onSuccess(response)
          {
            var newSumToPay=money(response.data.partial)-currentCash;
            if (newSumToPay<=0)
            {
              newSumToPay=response.data.full;
            }

            fields.sum.setValue(smoneyf(newSumToPay));
            fields.newcash.setValue(smoneyf(currentCash + newSumToPay));
            fields.sum.el.select();
          }
          Nuance.AjaxRequest("GET", "ajax.php?action=getcashtopay&id="+userId, null, onSuccess);
          //fields.user.setValue(userId);

        }
      }
    }

    fields.user.on('change', onUserFieldChange, true);
    fields.newcash.on('change', onNewCashFieldChange);
    fields.sum.on('change', onSumFieldChange);
  },
  AddPopup : function(o)
  {
    var self=this,
        store=o.store;
    o.title=_("Add");
    var okClick=function()
    {
      self.close();
      store.add(self.getValues());
    };
    o.buttons=[{onclick: okClick, value: _("Add"), submit: true, iconClass: 'add'}, {onclick: function(){self.close()}, value: _("Cancel"), iconClass: 'remove'}];
    Nuance.StorePopup.call(this, o);
  },
  EditPopup : function(o)
  {
    var self=this,
        store=o.store;
    o.title=_("Edit");

    var okClick=function()
    {
      self.close();
      store.edit(o.recordId, self.getValues());
    }
    o.buttons=[{onclick: okClick, value: _("Save"), submit: true, iconClass: 'ok'}, {onclick: function(){self.close()}, value: _("Cancel"), iconClass: 'remove'}];
    Nuance.StorePopup.call(this, o);
    // Disable some fields which are not allowed to change
    var fields=this.getFields();
    for (var i in fields)
    {
      if (!checkPermission ( ['table', o.store.name, 'edit', fields[i].getName()] ) && typeof fields[i].setDisabled==='function')
      {
        fields[i].setDisabled(true);
      }
    }

  },
  DeletePopup : function(o)
  {
    var self=this,
        store=o.store,
        selectedItems = o.recordId;
    o.winLayout='double';
    o.bodyLayout='double';
    o.btnLayout='double';
    o.title=_("Deleting");
    var okClick=function()
    {
      self.close();
      store.del(selectedItems);
    }
    var store=o.store;
    var storeName=store.name;
    var id=o.recordId;

    if (storeName==='user')
    {
      var formattedIdsArray=[];
      for (var i=0; i<selectedItems.length; i++)
      {
        formattedIdsArray.push( idRenderer (selectedItems[i], store.getById(selectedItems[i]), store.ns) );
      }
      var formattedIds = formattedIdsArray.join(', ');
    }
    else 
    {
      var formattedIds = selectedItems.join(', ');
    }

    if (selectedItems.length === 1)
    {
      var removeText=sprintf (_("Are you sure you want to delete "+storeName+" %s?"), formattedIds);
    }
    else if (selectedItems.length > 1)
    {
      var removeText=sprintf (gt.ngettext("Are you sure you want to delete %d "+storeName+": %s?", "Are you sure you want to delete %d "+storeName+": %s?", selectedItems.length), selectedItems.length, formattedIds );
    }
    o.buttons=[{onclick: okClick, value: _("Delete"), submit: true, iconClass: 'trash'}, {onclick: function(){self.close()}, value: _("Cancel"), iconClass: 'remove'}];
    o.body=ce(  'div',  {className: 'popup-body', name: 'popup-body', innerHTML: removeText});
    Nuance.Popup.call(this, o);
  },
  TabPanel : function(o)
  {
    var prefix = o.prefix ? o.prefix+'-' : '',
        self=this,
        tabPanelBody = this.tabPanelBody || ce( 'div',  { id: prefix+'tabpanel-body' }, o.target );
    var tabPanelSwitch = this.tabPanelSwitch || ce( 'ul',  { id: prefix+'tabpanel-switch' }, tabPanelBody );
    var tabPanelContent = this.tabPanelContent || ce ( 'div',  { id: prefix+'tabpanel-content' },tabPanelBody);
    var groups={};
    var selectedTab,
        tabsSwitchesByIndex=[],
        selectedTabId,
        master=o.master;
    var scrollWidth=40;
    this.contentEl=tabPanelContent;
    this.tabs ={};
    this.body=tabPanelBody;
    this.selectTabById=function(index)
    {
      if (selectedTab)
      {
        var oldIndex=selectedTab.index;
        selectedTab.classList.remove('selected');
      }
      else
      {
        var oldIndex=null;
      }
      if (oldIndex)
      {
        tabPanelContent.children[oldIndex].style.display='none';
      }
      selectedTab=tabsSwitchesByIndex[index];
      if (oldIndex!==null && tabsSwitchesByIndex[oldIndex].parentNode.parentNode.classList.contains('group'))
      {
        tabsSwitchesByIndex[oldIndex].parentNode.parentNode.classList.remove('selected')
      }
      if (tabsSwitchesByIndex[index].parentNode.parentNode.classList.contains('group'))
      {
        tabsSwitchesByIndex[index].parentNode.parentNode.classList.add('selected')
      }
      selectedTab.classList.add('selected');
      if (oldIndex!==null)
      {
        tabPanelContent.children[oldIndex].style.display='none';
      }
      tabPanelContent.children[index].style.display='';
      selectedTab.style.display='';
      self.trigger('tabchange', selectedTab.name, selectedTab);
    };
    this.getSelectedTab=function()
    {
      return selectedTab;
    }
    this.getSelectedTabId=function()
    {
      return selectedTabId;
    }
    Nuance.EventMixin.call(this, o);
    this.selectTabByName=function(name)
    {
      self.tabs[name] && self.selectTabById(self.tabs[name].index);
    }
    function createGroup(name)
    {
      var groupWrapEl=ce('li', {className: 'group'}, tabPanelSwitch);
      var groupTitleEl=ce('span', {innerHTML: _(name)}, groupWrapEl);
      var groupContainerEl=ce('ul', null, groupWrapEl);
      groups[name]=groupContainerEl;
      return groupContainerEl;
    }

    var tabFound=false;
    this.addTab = function(o, doNotSelect)
    {
      if (typeof o=='object')
      {
        var index=tabPanelContent.children.length;
        if (o.group)
        {
          if (groups[o.group])
          {
            var switchTarget=groups[o.group];
          }
          else
          {
            var switchTarget=createGroup(o.group);
          }
        }
        else
        {
          var switchTarget=tabPanelSwitch;
        }
        var tabSwitch = ce( 'li',
            {
              onselectstart: function() {return false;},
              onmousedown: function() {return false;}, 
              onclick: function(){self.selectTabById(this.index)},
              index: index,
              id: 'tabswitch-'+o.name, 
              className: 'item', 
              name: o.name,
              innerHTML: o.title 
            },
            switchTarget);
        if (o.grid)
        {
          var tabContent = (new Nuance.Grid(o.grid)).el;
        }
        else if (o.content)
        {
          var tabContent = o.content;
        }
        else
        {
          var tabContent = ce('div');
        }
        tabsSwitchesByIndex[index]=tabSwitch;
        tabContent.tabId=o.name;
        tabContent.index=index;
        tabContent.style.display='none';
        tabPanelContent.appendChild(tabContent);
        self.tabs[o.name]=tabContent;

        var tabSwitch=tabPanelSwitch.children[0];
        if (!doNotSelect && !selectedTab) { selectedTab=tabSwitch; this.selectTabById(tabSwitch.index); }

        return tabContent;
      }
      else if (o===tabPanelDivider)
      {
        var tabSwitch = ce( 'li',  { className: 'stretch'}, tabPanelSwitch);
        return false;
      }
    };
    if (o.tabs)
    {
      var i=0;
      for (var s in o.tabs)
      {
        var tabOptions=o.tabs[s];
        this.addTab(tabOptions, true);
        i++;
      }
    }
    if (o.selectedTab)
    {
      self.selectTabByName(o.selectedTab);
    }
    var tabSwitch=tabPanelSwitch.children[0];
    if (!selectedTab && tabPanelSwitch.children.length) { tabFound=true; selectedTab=tabSwitch; this.selectTabById(tabSwitch.index); }
  },
  MemoryStore : function(o)
  {
    var self=this,
        callbacks=[],
        target=o.target;
    this.getState=function()
    {
      return state;
    }
    this.readOnly=true;
    this.getState=function()
    {
      return 'loaded';
    }
    this.owner = o.owner;
    this.name=o.name || o.target;
    Nuance.stores[this.name]=this;
    this.data=o.data;
    this.header=o.header;
    this.getNameById=((typeof o.getNameByIdFn!='function') ? function(id)
        {
          return (this.data[id]) ? this.data[id][this.ns.name] : "";
        } : o.getNameByIdFn);

    this.getById=function(id, asObject)
    {
      if (asObject && this.data[id])
      {
        var rowObject={};
        for (var i in self.ns)
        {
          rowObject[i]=self.data[id][self.ns[i]];
        }
        return rowObject;
      }
      else
      {
        return this.data[id];
      }
    }
    this.on=function(eventName, callback)
    {
      if (!Array.isArray(callbacks[eventName]))
      {
        callbacks[eventName]=[callback];
      }
      else
        callbacks[eventName].push(callback);
    }
    this.fireEvent=function(eventName, args)
    {
      if (Array.isArray(callbacks[eventName]))
      {
        for (var i=0; i<callbacks[eventName].length; i++)
        {
          callbacks[eventName][i].apply(self, args);
        }
      }
      firstLoad=false;
    }
    var createNs=function()
    {
      var arr={};
      for (var i=0; i<self.header.length; i++)
      {
        arr[self.header[i][0]]=i;
      }
      return arr;
    };
    self.ns=createNs();
    this.load=function()
    {
    };
    this.send=function(action, id, values)
    {
    };
    this.add=function(values)
    {
    };
    this.edit=function(id, values)
    {
    };
    this.del=function(id)
    {
    };
  },
  Store: function(o)
  {
    var xmlHttp = false,
        self=this,
        state='idle',
        lastLoadTime,
        callbacks=[],
        filterStr='*',
        firstLoad=true,
        target=o.target;
    Nuance.EventMixin.call(this, o);
    this.setState=function(newState)
    {
      state=newState;
    }
    this.getState=function()
    {
      return state;
    }
    this.setFilter=function(value)
    {
      filterStr=value ? value : '*';
    }
    this.getFilter=function()
    {
      return filterStr;
    }
    this.readOnly=o.readOnly;
    this.owner = o.owner;
    this.name=o.name || o.target;
    this.data={};
    this.sortOrder={};
    this.length=null;
    this.errors=[];
    if (typeof o.getNameByIdFn!=='function')
    {
      this.getNameById=function(id)
      {
        return this.data[id] ? this.data[id][this.ns.name] : "";
      };
    }
    else
    {
      this.getNameById=o.getNameByIdFn;
    }

    this.getById=function(id, asObject)
    {
      if (asObject && this.data[id])
      {
        var rowObject={};
        for (var i in self.ns)
        {
          rowObject[i]=self.data[id][self.ns[i]];
        }
        return rowObject;
      }
      else
      {
        return this.data[id];
      }
    }
    var createNs=function()
    {
      var arr={};
      for (var i=0; i<self.header.length; i++)
      {
        arr[self.header[i][0]]=i;
      }
      return arr;
    };
    this.getLastLoadTime=function()
    {
      return lastLoadTime;
    }
    var loadData = function(r)
    {
      lastLoadTime=(new Date).getTime();
      var response= r|| {};
      var data=response.data|| [];
      if (response.length)
      {
        self.length=response.length;
      }
      var deleted=response.deleted|| [];
      var errors=response.errors|| [];
      self.errors=errors;
      if (!self.header) self.header = response.header|| [];
      if (!self.ns) self.ns=createNs();
      self.sortOrder=response.sortOrder;
      if (!self.data)
      {
        self.data = data;
      }
      else
      {
        for (var i=0; i<deleted.length; i++)
        {
          delete self.data[deleted[i]];
        }
        for (var id in data)
        {
          self.data[id]=data[id];
        }
      }
    };
    this.load=function(callback)
    {
      state='loading';
      self.trigger('beforeload');
      var onSuccess = function(json) 
      {
        loadData(json);
        state='loaded';
        self.trigger('afterload');
        if (typeof callback==='function') callback();
      }

      var path=o.path ?  o.path:"./ajax.php?action=dblist&target="+o.target+'&filter='+filterStr;
      Nuance.AjaxRequest("GET", path, null, onSuccess);
    };
    this.on('afterload', function()
    {
      firstLoad=false;
    });
    this.send=function(action, id, postData, cb)
    {
      var callback = cb || falsefunc;

      var beforeEvent=new Nuance.Event({type: "before"+action});
      self.trigger('before'+action, beforeEvent, id, postData);

      function onerror()
      {
        var errorEvent=new Nuance.Event({type: action+'error'});
        self.trigger(action+'error', errorEvent, id, postData);
      }
      var onsuccess=function(response, postDada)
      {
        loadData(response);
        var afterEvent=new Nuance.Event({type: "after"+action});
        self.trigger('after'+action, afterEvent, id, postData);
        callback(response, postData);
      }

      Nuance.AjaxRequest("POST", "./ajax.php?action=db"+action+"&target="+target, (postData ? postData.toString() : null), onsuccess, onerror);

    };
    this.add=function(values, callback)
    {
      if (values)
      {
        if (Array.isArray(values))
        {
          var postData=new URLParams;
          for (var i=0;i<values.length;i++)
          {
            if (typeof values[i]!=='undefined')
            {
              postData[self.header[i][0]]=values[i];
            }
          }
        }
        else
        {
          var postData=new URLParams(values);
        }
        this.send('add', null, postData, callback);
      }
      else
      {
        throw new Error ('Please provide values to store.add');
      }
    };
    this.edit=function(id, values, callback)
    {
      var postData=new URLParams;
      if (values)
      {
        if (Array.isArray(values))
        {
          var postData=new URLParams;
          for (var i=0;i<values.length;i++)
          {
            if (typeof values[i]!=='undefined' && (!self.data[id] || values[i]!==self.data[id][i]))
            {
              postData[self.header[i][0]]=values[i];
            }
          }
        }
        else
        {
          var postData=new URLParams(values);
        }
      }
      if (postData.length)
      {
        postData.id=id;
        this.send('edit', id, postData, callback);
      }
      else
      {
        callback && callback();
      }
    };
    this.del=function(id, callback)
    { 
      var postData=new URLParams({id: id.join(',')});
      this.send('remove', id, postData, callback);
    };
    this.remove=this.del;

    this.setFilter(o.filter);
    o.autoLoad && this.load();

    // Add self to the global stores list
    if (!Nuance.stores[this.name])
    {
      Nuance.stores[this.name]=this;
    }
    else
    {
      throw new Error("Store with name '"+this.name+"' already exists");
    }

  },
  WidgetPanel: function(o)
  {
    var self=this;
    var defaultOptions=
    {
      enabledWidgets: []
    };
    var o=mergeProps(defaultOptions, o, true);
    this.body=ce('div', {className: 'widget-panel-wrap'}, o.target);
    this.el=ce('div', {className: 'widget-panel'}, this.body);


    this.availableWidget={};

    this.registerWidget=function(o)
    {
      this.availableWidgets[o.name]=o;
    }


    this.enabledWidgets=
    [
      {
        type: Nuance.widget.UserStatisticsWidget
      },
      {
        type: Nuance.widget.CityStatisticsWidget
      },
      {
        type: Nuance.widget.TariffStatisticsWidget
      },
      {
        type: Nuance.widget.PaymentsStatisticsWidget
      },
      {
        type: Nuance.widget.PotentialPaymentsStatisticsWidget
      }
    ];
    
    

    this.initWidgets=function(o)
    {
      for (var i=0; i<self.enabledWidgets.length; i++)
      {
        var widgetOptions=self.enabledWidgets[i];
        widgetOptions.target=self.el;
        new widgetOptions.type(widgetOptions);
      }
    }


  },
  widget:
  {
    __Widget: function(o)
    {
      var self=this;
      this.body=ce('div', {className: 'widget-wrap'}, o.target);
      this.el=ce('div', {className: 'widget'}, this.body);

      var titleEl=ce('div', {className: 'widget-title', innerHTML: o.title}, this.el);
      this.content=ce('div', {className: 'widget-content'}, this.el);

      this.addRow=function(text, value)
      {
        var adminPaymentsRow=ce('p', {className: 'widget-row'}, self.content);
        ce('span', {className: 'widget-option', innerHTML: _("Sum of cashier payments")}, adminPaymentsRow);
        var adminPaymentsValue=ce('span', {className: 'widget-value'}, adminPaymentsRow);
      }
    },
    WidgetRow: function(o)
    {
      var row=ce('p', {className: 'widget-row'}, o.target);
      ce('span', {className: 'widget-option', innerHTML: o.title || ''}, row);
      var valueEl=ce('span', {className: 'widget-value'}, row);

      this.setValue=function(value)
      {
        valueEl.innerHTML=value;
        valueEl.classList.remove('loading');
      }

      if (o.loading)
      {
        valueEl.classList.add('loading');
      }

    },
    PaymentsStatisticsWidget: function (o)
    {
      var self=this;
      var response, monthSelector;
      var options=
      {
        title:_('Payments statistics')
      }
      o=mergeProps(o, options, true);
      Nuance.widget.__Widget.call(this, o);


      var adminPaymentsRow = new Nuance.widget.WidgetRow(
        {
          title: _("Sum of cashier payments"),
          target: self.content,
          loading: true
        }
      );
      var scratchcardPaymentsRow = new Nuance.widget.WidgetRow(
        {
          title: _("Sum of scratchcard payments"),
          target: self.content,
          loading: true
        }
      );

      ce('p', {className: 'widget-divider'}, self.content);

      var allPaymentsRow = new Nuance.widget.WidgetRow(
        {
          title: _("Sum of all payments"),
          target: self.content,
          loading: true
        }
      );

      function displayStatistics()
      {
        var selectedValue=monthSelector.store.getById(monthSelector.getValue(), true);
        if (selectedValue)
        {
          var selectedMonth=selectedValue.year+'-'+sprintf('%02d', selectedValue.month);
          if (response)
          {
            adminPaymentsRow.setValue(formatMoney(response.bymonth[selectedMonth].adminpay.total));
            scratchcardPaymentsRow.setValue(formatMoney(response.bymonth[selectedMonth].scratchcard));
            allPaymentsRow.setValue(formatMoney(response.bymonth[selectedMonth].total));
          }
        }
      }
      function onLoad(r)
      {

        var months={};
        response=r;
        var currentDate=new Date;
        var n=0;
        for (var i in response.bymonth)
        {
          var monthName=_(currentDate.getMonthName());
          months[++n]=[n, currentDate.getMonth()+1, currentDate.getFullYear(), monthName+' '+currentDate.getFullYear()];
          currentDate.add({month: -1});
        }
        monthSelector=new Nuance.input.ComboBox(
          {
            store: new Nuance.MemoryStore(
              {
                header: 
                [
                  ['id', 'id'], 
                  ['month', 'int'],
                  ['year', 'int'],
                  ['name', 'varchar']
                ],
                data: months
              }
            ),
            avoidSort: true,
            value: 1,
            name: 'month'
          }
        );
        self.el.insertBefore(monthSelector.body, self.content);


        displayStatistics();
        monthSelector.on('change', displayStatistics);
      }
      Nuance.AjaxRequest('GET', 'ajax.php?action=getstatistics', null, onLoad);
    },
    PotentialPaymentsStatisticsWidget: function (o)
    {
      var self=this;
      var options=
      {
        title:_('Potential payments statistics')
      }
      o=mergeProps(o, options, true);
      Nuance.widget.__Widget.call(this, o);

      var userStore=Nuance.stores.user;
      var tariffStore=Nuance.stores.tariff;

      function onLoad()
      {
        self.content.removeChilds();
        if (userStore.getState()==='loaded' && tariffStore.getState()==='loaded')
        {
          var price=[0];
          var potentionalPayments=0;
          for (var i in tariffStore.data)
          {
            var tariff=tariffStore.getById(i, true);
            price[i]=tariff.price;
          }

          for (var n in userStore.data)
          {
            var user=userStore.getById(n, true);
            if (price[user.tariff] && !user.disabled)
            {
              if (user.discount!=='0')
              {
                var discount=user.discount;
                if (discount[discount.length-1]==='%')
                {
                  discount=1-parseFloat(discount.substr(0, discount.length-1))/100;
                  potentionalPayments += price[user.tariff] * discount;
                }
                else
                {
                  discount=parseFloat(discount);
                  potentionalPayments += price[user.tariff] - discount;
                }
              }
              else
              {
                potentionalPayments += price[user.tariff];
              }
            }
          }
          var row=ce('p', {className: 'widget-row'}, self.content);
          var title = ce('span', {className: 'widget-option', innerHTML: _("Sum")}, row);
          var count = ce('span', {className: 'widget-value', innerHTML: smoneyf(potentionalPayments)}, row );
        }
      }

      userStore.on('afterload', onLoad, true);
      tariffStore.on('afterload', onLoad, true);
    },
    CityStatisticsWidget: function (o)
    {
      var self=this;
      var options=
      {
        title:_('Settlements statistics')
      }
      o=mergeProps(o, options, true);
      Nuance.widget.__Widget.call(this, o);

      this.el.classList.add('city-statistics-widget');
      var userStore=Nuance.stores.user;
      var cityStore=Nuance.stores.city;

      function onLoad()
      {
        self.content.removeChilds();
        if (userStore.getState()==='loaded' && cityStore.getState()==='loaded')
        {
          var order=[];
          var usersByCity={};
          var usersCount=Nuance.stores.user.length;
          for (var i in cityStore.data)
          {
            usersByCity[i]=0;
            order.push(i);
          }

          for (var n in userStore.data)
          {
            var user=userStore.getById(n, true);
            if (user.city)
            {
              usersByCity[user.city]++;
            }
          }
          order=order.sort(
            function(a,b)
            {
              if (usersByCity[a]<usersByCity[b])
              {
                return 1;
              }
              else if (usersByCity[a]>usersByCity[b])
              {
                return -1;
              }
              else
              {
                return 0;
              }

            }
          );
          for (var i=0; i<order.length; i++)
          {
            var n=order[i];

            var row=ce('p', {className: 'widget-row'}, self.content);
            var title = ce('span', {className: 'widget-option', innerHTML: cityStore.getNameById(n)}, row);
            var count = ce('span', {className: 'widget-value', innerHTML: usersByCity[n] + ' ('+ Math.round( usersByCity[n] /usersCount * 100  ) + '%)'}, row );
          }
        }
      }

      userStore.on('afterload', onLoad, true);
      cityStore.on('afterload', onLoad, true);
    },
    TariffStatisticsWidget: function (o)
    {
      var self=this;
      var options=
      {
        title:_('Tariff statistics')
      }
      o=mergeProps(o, options, true);
      Nuance.widget.__Widget.call(this, o);

      this.el.classList.add('tariff-statistics-widget');
      var userStore=Nuance.stores.user;
      var tariffStore=Nuance.stores.tariff;

      function onLoad()
      {
        self.content.removeChilds();
        if (userStore.getState()==='loaded' && tariffStore.getState()==='loaded')
        {
          var usersByTariff={};
          var order=[];
          var usersCount=Nuance.stores.user.length;
          for (var i in tariffStore.data)
          {
            usersByTariff[i]=0;
            order.push(i);
          }

          for (var i in userStore.data)
          {
            var user=userStore.getById(i, true);
            if (user.tariff)
            {
              usersByTariff[user.tariff]++;
            }
          }
          
          order=order.sort(
            function(a,b)
            {
              if (usersByTariff[a]<usersByTariff[b])
              {
                return 1;
              }
              else if (usersByTariff[a]>usersByTariff[b])
              {
                return -1;
              }
              else
              {
                return 0;
              }

            }
          );


          for (var i=0; i<order.length; i++)
          {
            var n=order[i];
            var row=ce('p', {className: 'widget-row'}, self.content);
            var title = ce('span', {className: 'widget-option', innerHTML: tariffStore.getNameById(n)}, row);
            var count = ce('span', {className: 'widget-value', innerHTML: usersByTariff[n] + ' ('+ Math.round( usersByTariff[n] /usersCount * 100  ) + '%)'}, row );
          }
        }

      }


      userStore.on('afterload', onLoad, true);
      tariffStore.on('afterload', onLoad, true);
    },
    UserStatisticsWidget: function (o)
    {
      var self=this;
      var options=
      {
        title:_('Subscribers statistics')
      }
      o=mergeProps(o, options, true);
      Nuance.widget.__Widget.call(this, o);
      var userStore=Nuance.stores.user;
      var orderStore=Nuance.stores.activeorder;
      var routerStore=Nuance.stores.router;

      var activeUsersCountRow = new Nuance.widget.WidgetRow(
        {
          title: _("Number of active subscribers"),
          target: self.content,
          loading: true
        }
      );

      var inactiveUsersCountRow = new Nuance.widget.WidgetRow(
        {
          title: _("Number of inactive subscribers"),
          target: self.content,
          loading: true
        }
      );

      var disabledUsersCountRow = new Nuance.widget.WidgetRow(
        {
          title: _("Number of disabled subscribers"),
          target: self.content,
          loading: true
        }
      );

      var onlineUsersCountRow=ce('p', {className: 'widget-row'}, self.content);
      var onlineUsersCountTitle = ce('span', {className: 'widget-option', innerHTML: _("Number of online subscribers")}, onlineUsersCountRow);
      var onlineUsersCountRoutersCount = ce('span', {className: 'widget-suboption'}, onlineUsersCountTitle );

      var onlineUsersCountValue = ce('span', {className: 'widget-value'}, onlineUsersCountRow);

      ce('p', {className: 'widget-divider'}, self.content);

      var allUsersCountRow = new Nuance.widget.WidgetRow(
        {
          title: _("Number of all subscribers"),
          target: self.content,
          loading: true
        }
      );
      function calculateInactiveUsers()
      {
        if (userStore.getState()==='loaded' &&
            orderStore.getState()==='loaded')
        {
          var disabledUsersCount=0;
          for (var i in userStore.data)
          {
            var user=userStore.data[i];
            if (user[userStore.ns.disabled])
            {
              disabledUsersCount++;
            }
          }
          disabledUsersCountRow.setValue(disabledUsersCount);

          inactiveUsersCountRow.setValue(userStore.length - activeOrder.ordersLength);
        }
      }

      onlineUsersCountValue.classList.add('loading');
      function onOrderStoreLoad()
      {
        activeUsersCountRow.setValue(activeOrder.ordersLength);
      }
      function onRouterStatesLoad()
      {
        var onlineUsersCount=0;

        var allRoutersCount=0;
        var onlineRoutersCount=0;
        var URIs=[];
        var ns=Nuance.stores.router.ns;
        for (var i in window.routerStateCheckers)
        {
          allRoutersCount++;
          if (routerStateCheckers[i].getState()==='online')
          {
            var row=routerStateCheckers[i].getActualRow();
            var uri=row[ns.ip]+':'+row[ns.port];
            if (URIs.indexOf(uri)===-1)
            {
              for (var j=0; j<routerStateCheckers[i].data.online.length; j++)
              {
                if ( allIP.indexOf( routerStateCheckers[i].data.online[j] ) !== -1 )
                {
                  onlineUsersCount++;
                }
              }
              URIs.push(uri);
            }
            onlineRoutersCount++;
          }
        }
        onlineUsersCountValue.classList.remove('loading');
        onlineUsersCountValue.innerHTML= onlineUsersCount;
        if (allRoutersCount !== onlineRoutersCount)
        {
          onlineUsersCountRoutersCount.innerHTML="&nbsp;"+sprintf(gt.ngettext("(information are displayed for %d router)", "(information are displayed for %d routers)", onlineRoutersCount), onlineRoutersCount);
        }
        else
        {
          onlineUsersCountRoutersCount.innerHTML='';
        }

      }

      function onUserStoreLoad()
      {
        var allUsersCount=userStore.length;
        
        allUsersCountRow.setValue ( allUsersCount);

      }
      function onRouterStoreLoad()
      {
        for (var i in window.routerStateCheckers)
        {
          routerStateCheckers[i].on('afterload', onRouterStatesLoad);
        }
        onRouterStatesLoad();
      }


      if (routerStore.getState()!=='loaded')
      {
        routerStore.on('afterload', onRouterStoreLoad);
      }
      else
      {
        onRouterStoreLoad();
      }
      
      if (userStore.getState()!=='loaded')
      {
        userStore.on('afterload', onUserStoreLoad);
        userStore.on('afterload', calculateInactiveUsers);
      }
      else
      {
        onUserStoreLoad();
      }

      if (orderStore.getState()!=='loaded')
      {
        orderStore.on('afterload', onOrderStoreLoad);
        orderStore.on('afterload', calculateInactiveUsers);
      }
      else
      {
        onOrderStoreLoad();
      }
    }
  },
  Grid : function(opts)
  {
    this.el = ce(  'div',  {id: opts.name+'-tab', className: 'grid'}); //grid body
    var self=this,
        coverWrap=ce(  'div',  {id: opts.name+'-cover-wrap', className: 'cover-wrap'}, this.el),
        cover=ce(  'div',  {id: opts.name+'-cover', className: 'cover'}, coverWrap),
        coverTextWrap=ce(  'p',  {className: 'cover-text-wrap'}, cover),
        coverText=ce(  'span',  {className: 'cover-text'}, coverTextWrap),
        name=opts.name,
        gridState,
        filters=opts.filters || [],
        sortname,
        sortdesc,
        waitForStores=opts.waitForStores || [],
        hiddenCols=opts.hiddenCols || [],
        userHiddenCols=configProxy.getValue('user', 'grid', name+'-hiddenCols', userId) || [];
    this.excludedFields=opts.excludedFields || [];
    Nuance.EventMixin.call(this, opts);
    var storeDefaultProps=
    {
      owner: this, 
      target: name
    };
    var proxyParams=mergeProps(storeDefaultProps, opts.proxyParams, true);


    if (opts.store)
    {
      if (opts.store.constructor===Nuance.Store)
      {
        this.store=opts.store;
      }
      else
      {
        this.store=new Nuance.Store(opts.store);
      }
    }
    else
    {
      this.store=new Nuance.Store(proxyParams);
    }

    if (opts.store) this.store.owner=this;
    this.onEdit=function()
    {
      if (selectedItems.length===1 && !opts.readOnly)
      {
        var form=new Nuance.EditPopup(
            {
              store: self.store,
              customFields: opts.customFields,
              onlyIncludedFields: opts.onlyIncludedFields,
              excludedFields: self.excludedFields,
              includedFields: opts.includedFields,
              recordId: self.recordId || selectedItems[0]
            }
        );
      }
    }
    this.onAdd=function()
    {
      var form=new Nuance.AddPopup(
        {
          store: self.store,
          customFields: opts.customFields, 
          onlyIncludedFields: opts.onlyIncludedFields,
          excludedFields: self.excludedFields, 
          includedFields: opts.includedFields, 
          recordId: 0
        }
      );
    }
    this.onDel=function()
    {
      if (selectedItems.length)
      {
         new Nuance.DeletePopup(
           {
             store: self.store, 
             recordId: selectedItems 
           }
         );
      }
    }
    var dependentStores=[];
    this.addDependentStore=function(name)
    {
      if (dependentStores.indexOf(name)===-1) dependentStores.push(name);
    }

    if (opts.readOnly)
    {
      var toolbarButtons= [];
    }
    else if (opts.deleteOnly)
    {
      var toolbarButtons= 
      [
        [
          {
            onclick: self.onDel,
            iconClass: 'remove',
            scope: self,
            onselectionchange: function(selectionId, grid)
            {
              if (checkPermission ( ['table', grid.getName(), 'remove'] ) && selectionId.length===1)
              {
                this.setDisabled(false);
              }
              else
              {
                this.setDisabled(true);
              }
            }
          }
        ]
      ];
    }
    else
    {
      var toolbarButtons= 
      [
        [
          {
            onclick: self.onAdd,
            iconClass: 'add', 
            scope: self,
            onselectionchange: function(selectionId, grid)
            {
              this.setDisabled( !checkPermission ( ['table', grid.getName(), 'add'] ) );
            }
          },
          {
            onclick: self.onEdit,
            iconClass: 'edit',
            scope: self,
            onselectionchange: function(selectionId, grid)
            {
              if (checkPermission ( ['table', grid.getName(), 'edit'] ) && selectionId.length===1)
              {
                this.setDisabled(false);
              }
              else
              {
                this.setDisabled(true);
              }
            }
          },
          {
            onclick: self.onDel,
            iconClass: 'remove',
            scope: self,
            onselectionchange: function(selectionId, grid)
            {
              if (checkPermission ( ['table', grid.getName(), 'remove'] ) && selectionId.length===1)
              {
                this.setDisabled(false);
              }
              else
              {
                this.setDisabled(true);
              }
            }
          }
        ]
      ];
    }
    toolbarButtons.push( {onclick: self.store.load, iconClass: 'reload', scope: self} );
    this.toolbarButtons = toolbarButtons;

    var toolbarEl = ce(  'div',  {className: 'toolbar'}, this.el), //grid toolbar
        filtersWrapEl=ce('div', {className: "filter-wrap"}, this.el),
        filtersEl=ce('div', {className: "filter"}, filtersWrapEl),
        buttons=[],
        gridTableHeader=ce(  'div',  {className: 'header'}, self.el),
        gridTable = ce(  'div',  {className: 'table selectable'}, this.el),
        statusBarWrap = ce(  'div',  {className: 'statusbar-wrap'}, toolbarEl),
        statusBar= ce(  'span',  {className: 'list statusbar'}, statusBarWrap ),
        sorterCol, // current sort column
        lastSelectedItem,
        selectedItems=[],
        scrollOffset=0,
        searchStr,
        dataOrder=[],
        dblClickHandler = function()
        {
          if (opts.onDblClick)
          {

            opts.onDblClick.call(self);
          }
          else if (self.onEdit)
          {
            self.onEdit.call(self);
          }
        },
        wasDeleted=false,
        selectedRows; //selected row in grid

    filtersWrapEl.style.display='none';
    var virtualFields=opts.virtualFields || [];
    this.getName=function(){return name;};


    var horizontalScroll;
    gridTable.addEventListener(
      'scroll',
      function(e)
      {
        if (this.scrollLeft!==horizontalScroll)
        {
          horizontalScroll=this.scrollLeft;
          gridTableHeader.scrollLeft=horizontalScroll;
        }
      }
    );
    gridTable.onselectstart=function(e)
    {
      e.preventDefault();
    }
    gridTable.ondblclick=function(e)
    {
      if (gridState==='normal')
      {
        dblClickHandler (e);
      }
    }

    gridTable.oncontextmenu=gridTable.onclick=function(e)
    {
      var rowId=e.target.recordId || e.target.parentNode.recordId || e.target.parentNode.parentNode.recordId;
      if (gridState=='normal' && (e.target.parentNode===gridTable || e.target.parentNode.parentNode===gridTable || e.target.parentNode.parentNode.parentNode===gridTable))
      {
        if (e.type==='contextmenu')
        {
          if (selectedItems.indexOf(rowId)===-1)
          {
            if (e.ctrlKey ) 
            {
              var selectionMode = 'ctrl';
            }
            else if ( e.shiftKey)
            {
              var selectionMode = 'shift';
            }
            else
            {
              var selectionMode = 'normal';
            }

            selectRow(rowId, selectionMode);
          }
          var contextMenuOptions=
          {
            event: e,
            options:
            opts.contextMenuItems
          };
          self.trigger('beforecontextmenushow', contextMenuOptions);
          new Nuance.ContextMenu(contextMenuOptions);
        }
        else
        {
          if (e.ctrlKey ) 
          {
            var selectionMode = 'ctrl';
          }
          else if ( e.shiftKey)
          {
            var selectionMode = 'shift';
          }
          else
          {
            var selectionMode = 'normal';
          }
          selectRow(rowId, selectionMode);
        }
      }
      return false;
    }

    opts.sorters=mergeProps(Nuance.globalSorters, opts.sorters, true);
    Nuance.grids[opts.name]=this;
    this.getSelectedItems=function()
    {
      return selectedItems;
    }
    this.getTableEl = function()
    {
      return gridTable;
    }
    this.addButton=function(btn, prepend)
    {
      if (Array.isArray(btn)) // if it is button group
      {
        buttons = buttons.concat((new Nuance.input.ButtonGroup({noWrap: true, buttons: btn, target: toolbarEl, mergeButtons: true})).getButtons());
      }
      else
      {
        if (btn.constructor==Nuance.input.Button) //if it is created button
        {
          if (btn.body.parentNode)
          {
            btn.body.parentNode.removeChild(btn.el);
          }
          if (prepend)
          {
            toolbarEl.insertBefore(btn.body, toolbarEl.firstChild);
          }
          else
          {
            toolbarEl.appendChild(btn.body);
          }
          btn.scope=self;
          buttons.push(btn);
        }
        else //if it is object with properties
        {
          btn.target=toolbarEl;
          btn.scope=self;
          buttons.push(new Nuance.input.Button(btn));
        }
      }
    };
    if (opts.toolbarButtons)
    {
      toolbarButtons=toolbarButtons.concat(opts.toolbarButtons);
    }
    for (var i=0; i<toolbarButtons.length; i++)
    {
      self.addButton(toolbarButtons[i]);
    }
    function searchFn(value)
    {
      alert(value);
    }
    function fireOnSelectionChange()
    {
      for (var i=0; i<buttons.length; i++)
      {
        buttons[i].onselectionchange && buttons[i].onselectionchange(self.getSelectedItems(), self);
      };
    }
    function clearSelection() 
    {
      for (var i=0; i<selectedItems.length; i++)
      {
        var selectedRow=ge(name+'-'+selectedItems[i]);
        if (selectedRow)
        {
          selectedRow.classList.remove('selected');
        }
      } 
    }
    function selectRow(id, selectionMode)
    {
      if ( selectionMode === 'normal')
      {
        clearSelection();
        selectedItems=[id];
        lastSelectedItem=id;
      }
      else if ( selectionMode === 'ctrl')
      {
        if (selectedItems.indexOf(id)===-1)
        {
          selectedItems.push(id);
        }
        else
        {
          var selectedRow=ge(name+'-'+id);
          if (selectedRow)
          {
            selectedRow.classList.remove('selected');
          }
          selectedItems.splice(selectedItems.indexOf(id), 1);
        }
        lastSelectedItem=id;
      }
      else if ( selectionMode === 'shift')
      {
        if (lastSelectedItem)
        {
          clearSelection();
          var startItemIndex = dataOrder.indexOf( lastSelectedItem );
          var stopItemIndex = dataOrder.indexOf( id );
          if (startItemIndex < stopItemIndex  )
          {
            for (var i=startItemIndex; i<stopItemIndex; i++)
            {
              selectedItems.push( dataOrder[i] );
            }
          }
          else if (startItemIndex > stopItemIndex  )
          {
            for (var i=stopItemIndex; i<startItemIndex; i++)
            {
              selectedItems.push( dataOrder[i] );
            }
          }
          else 
          {
          }
        }
        else 
        {
          selectedItems=[id];
          lastSelectedItem=id;
        }
      }
      fireOnSelectionChange();
      for (var i=0; i<selectedItems.length; i++)
      {
        var selectedRow=ge(name+'-'+selectedItems[i]);
        if (selectedRow)
        {
          selectedRow.classList.add('selected');
        }
      }
    };
    function selectAllRows()
    {
      selectedItems=cloneArray(dataOrder);
      fireOnSelectionChange();
      for (var i=2; i<gridTable.children.length; i++)
      {
        gridTable.children[i].classList.add('selected');
      }
    };
    var unselectRow = function()
    {
      selectedRow=null;
      selectedItems=[];
      fireOnSelectionChange();
    }
    fireOnSelectionChange();
    this.setState=function(state)
    {
      self.el.classList.remove('message');
      self.el.classList.remove('loading');
      self.el.classList.remove('offline');
      self.el.classList.remove('notfound');
      self.el.classList.remove('noitems');
      coverText.classList.remove('icon');
      coverText.classList.remove('spinner');
      var errorStates=['offline', 'notable', 'loading'];
      var notificationStates=['noitems', 'notfound', 'deny', 'loading'];

      var allStates=errorStates.concat(notificationStates);
      if (allStates.indexOf(state)!==-1)
      {
        self.el.classList.add('message');
        self.el.classList.add(state);
      }

      if (errorStates.indexOf(state)!==-1)
      {
        self.el.insertBefore(coverWrap, self.el.firstChild);
      }
      else if (notificationStates.indexOf(state)!==-1)
      {
        self.el.insertBefore(coverWrap, gridTable);
      }

      switch (state)
      {
        case 'loading':
          {
            coverText.innerHTML=_('Loading...');
            coverText.classList.add('icon');
            coverText.classList.add('spinner');
            break;
          }
        case 'normal':
          {
            break;
          }
        case 'offline':
          {
            coverText.innerHTML=_('Server unavailable...');
            break;
          }
        case 'notfound':
          {
            coverText.innerHTML=_('Nothing was found...');
            break;
          }
        case 'notable':
          {
            coverText.innerHTML=_('Table not fount...');
            break;
          }
        case 'deny':
          {
            coverText.innerHTML=_('You do not have permissions to view this table...');
            break;
          }
        case 'noitems':
          {
            coverText.innerHTML=_('No items to display...');
            break;
          }
      }
      gridState=state;
    }
    function loadDependentStores()
    {
      var header=self.store.header;
      var types=['link', 'multilink', 'tarifflink'];
      for (var i=0; i<header.length; i++)
      {
        var type=header[i][1];
        var name=header[i][0];// header name
        if (types.indexOf(type)!==-1 && name!=='referrer')
        {
          self.addDependentStore(name);
        }
      }
    }
    if (opts.dependentStores)
    {
      dependentStores=dependentStores.concat(opts.dependentStores);
    }


    var formatData = function(formattingRows)
    {
      var ns=self.store.ns,
          data=self.store.data,
          header=self.store.header || [],
          newHeader=[],
          sourceData={},
          displayNs={},
          displayData={};
      self.displayNs=displayNs;
      for (var id in data)
      {
        displayData[id]=[];
        sourceData[id]=[];
      }
      for (var d=0; d<header.length; d++)
      {

        for (var j in virtualFields)
        {
          if (virtualFields[j].order===d)
          {
            var hname=j;

            if (userHiddenCols.indexOf(hname)!==-1 || hiddenCols.indexOf(hname)!==-1)
            {
              continue;
            };

            newHeader.push([j, 'text']);
            displayNs[hname]=newHeader.length-1;
            for (var id in data)
            {
              displayData[id].push('');
            }

            for (var id in data)
            {
              sourceData[id].push(data[id][d]);
            }

            if (opts.customRenderers && opts.customRenderers[hname])
            {
              for (var id in data)
              {
                displayData[id][displayData[id].length-1]=opts.customRenderers[hname](displayData[id][displayData[id].length-1],data[id],ns);
              }
            }

          } 
        }

        var hname=header[d][0];
        var htype=header[d][1];
        if (userHiddenCols.indexOf(header[d][0])!==-1 || hiddenCols.indexOf(header[d][0])!==-1)
        {
          continue;
        };
        switch (htype)
        {
          case 'multilink':
            {
              if (typeof header[d][2]=='string')
              {
                hname=header[d][2];
              }
              for (var id in data)
              {
                var names=[];
                var ids=data[id][d];
                for (var i=0; i<ids.length; i++)
                {
                  names.push( Nuance.stores[hname].getNameById( ids[i] ) );
                }
                displayData[id].push(names.join(', '));
              }
              break;
            }
          case 'tarifflink':
          case 'link':
            {
              if (typeof header[d][2]=='string')
              {
                hname=header[d][2];
              }
              for (var id in data)
              {
                displayData[id].push(Nuance.stores[hname].getNameById(data[id][d]));
              }
              break;
            }
          case 'bit':
          case 'tinyint':
            {
              for (var id in data)
              {
                displayData[id].push(data[id][d] ? '<p class="icon enabled"></p>' : '');
              }
              break;
            }
          case 'money':
            {
              for (var id in data)
              {
                displayData[id].push(formatMoney(data[id][d]));
              }
              break;
            }
          case 'speed':
            {
              for (var id in data)
              {
                if (data[id][d])
                {
                  var results=data[id][d].match(/(\d+)(\w?)/);
                  if ( Array.isArray(results) )
                  {
                    var speedAsNumber=parseInt(results[1]);
                    var speedPostfix=results[2],
                        speedPattern="%d "+speedPostfix+"bit/s";
                    displayData[id].push(sprintf( _(speedPattern), speedAsNumber));
                  }
                }
                else
                {
                  displayData[id].push('');
                }
              }
              break;
            }
          default:
            {
              for (var id in data)
              {
                displayData[id].push(data[id][d]);
              }
              break;
            }
        };

        newHeader.push(header[d]);
        displayNs[hname]=newHeader.length-1;

        for (var id in data)
        {
          sourceData[id].push(data[id][d]);
        }
      }
      self.displayHeader=newHeader;
      self.sourceData=sourceData;
      self.displayData=displayData;
      self.trigger('beforerender', formattingRows, data, ns, displayData, displayNs);
    };
    this.remoteSort=function()
    {
      sort(configProxy.getValue('user', 'sorter', name, userId), configProxy.getValue('user', 'sorter', name+'direction', userId));
    }
    this.setSorting=function(sn, sd)
    {
      sortname=sn;
      sortdesc=sd;
      scrollOffset=0;
    }
    var sort=function()
    {
      if (!self.store.header || !self.store.header.length) return;

      var index=0;
      for (var col in self.displayHeader)
      {
        if (self.displayHeader[col][0]==sortname) {index=col; break;};
      }
      var hname=self.displayHeader[index][0];
      var htype=self.displayHeader[index][1];

      if (self.store.sortOrder[hname])
      {
        dataOrder=cloneArray(self.store.sortOrder[hname]);
      }
      else
      {
        dataOrder=[];
        for (id in self.displayData)
        {
          dataOrder.push(id);
        }

        if (opts.sorters && opts.sorters[htype])
        {
          dataOrder.sort(function(a,b){ return (opts.sorters[htype](self.displayData[a][index], self.sourceData[a][index])>opts.sorters[htype](self.displayData[b][index], self.sourceData[b][index])) ? 1 : -1});
        }
        else if (opts.sorters && opts.sorters[hname])
        {
          dataOrder.sort(function(a,b){ return (opts.sorters[hname](self.displayData[a][index], self.sourceData[a][index])>opts.sorters[hname](self.displayData[b][index], self.sourceData[b][index])) ? 1 : -1});
        }
        else
        {
          dataOrder.sort(function(a,b){ return (self.displayData[a][index]>self.displayData[b][index]) ? 1 : -1});
        }
      }

      if (sortdesc)
      {
        dataOrder=dataOrder.reverse();
      }
      gridTableHeader.children[index*2].classList.add(sortdesc ? 'sort-up': 'sort-down');
      gridTableHeader.children[index*2].classList.add('icon');
      sorterCol=gridTableHeader.children[index*2];
    };
    this.sort=sort;
    var onSortHeaderClick=function()
    {
      if (this==sorterCol)
      {
        this.classList.toggle('sort-up');
        this.classList.toggle('sort-down');
        dataOrder=dataOrder.reverse();
        sortdesc= !sortdesc;
      }
      else
      {
        sorterCol.classList.remove('sort-down');
        sorterCol.classList.remove('sort-up');
        self.setSorting(this.classList[0], false);
      }
      self.render();
      configProxy.setValue('user', 'sorter', name+'direction', this.classList.contains('sort-up'), userId);
      configProxy.setValue('user', 'sorter', name, this.classList[0], userId);
    };

    

    function setSearch(value)
    {
      searchStr=value ? new RegExp('('+RegExp.escape(value)+')(?!([^<]+)?>)', 'i') : value;
    }
    this.setSearch=function(v)
    {
      setSearch(v);
      searchBar.setValue(v);
      if (self.header)
      {
        self.render();
      }
      scrollOffset=0;
    };
    

    function search()
    {
      if (searchStr)
      {

        var data=self.displayData,
            foundRow;
        for (var i in data)
        {
          foundRow=false;
          for (var n=0; n<data[i].length; n++)
          {
            if (searchStr.test(data[i][n]))
            {
              data[i][n]=data[i][n].toString().replace(searchStr, '<em class="hl">$1</em>');
              foundRow=true;
            }
          }
          if (!foundRow)
          {
            delete data[i];
            dataOrder.splice(dataOrder.indexOf(i), 1);
          }
        }
      }
    }
    var filtersIsLoaded=false, filtersComboboxes={}, filtersIsDisplayed=false;
    function filter()
    {
      var data=self.store.data,
          displayData=self.displayData,
          foundRow;
      for (var i in filtersComboboxes)
      {
        var combobox=filtersComboboxes[i];
        var value=combobox.getValue();
        var columnName=combobox.getName();
        var position=self.store.ns[columnName];
        if (value!==undefined && value!==0)
        {
          if (filters[i].filterFunction)
          {
            for (var j in data)
            {
              if (!filters[i].filterFunction(j, value))
              {
                delete displayData[j];
                if (dataOrder.indexOf(j)!==-1)
                {
                  dataOrder.splice(dataOrder.indexOf(j), 1);
                }
              }
            }
          }
          else
          {
            for (var j in data)
            {
              if (data[j][position]!==value)
              {
                delete displayData[j];
                if (dataOrder.indexOf(j)!==-1)
                {
                  dataOrder.splice(dataOrder.indexOf(j), 1);
                }
              }
            }
          }
        }
      }
    }

    function loadFilters()
    {

      for (var i=0; i<self.store.header.length; i++)
      {
        var column=self.store.header[i];
        if (filters[column[0]]!==false && !filters[column[0]])
        {
          if (column[1].substr(column[1].length-4)==='link')
          {
            if (typeof column[2]==='string' && Nuance.stores[column[2]])
            {
              var store=Nuance.stores[column[2]];
            }
            else
            {
              var store=Nuance.stores[column[0]];
            }
            filters[column[0]]=
            {
              name: column[0],
              store: store
            };
          }
          else if (column[1]==='tinyint')
          {
            filters[column[0]]=
            {
              name: column[0],
              store: new Nuance.MemoryStore(
                {
                  header:
                  [
                    ['id', 'text'],
                    ['name', 'text']
                  ],
                  data:
                  {
                    'yes': ['yes', _("Yes")],
                    'no': ['no', _("No")]
                  }
                }
              ),
              filterFunction: function(id, selectedValue)
              {
                if (selectedValue==='yes')
                {
                  return self.store.data[id][self.store.ns[this.name]];
                }
                else
                {
                  return !self.store.data[id][self.store.ns[this.name]];
                }
              }
            };
          }
        }

      }

      for (var i in filters)
      {
        if (filters[i].name)
        {
          var fieldOptions=
          {
            name: filters[i].name,
            store: filters[i].store,
            showNotSelected: true,
            selectPlaceholder: _(filters[i].name),
            target: filtersEl
          };
          if (!fieldOptions.hasOwnProperty('parentList'))
          {
            for (var d=0; d<fieldOptions.store.header.length; d++)
            {
              var field=fieldOptions.store.header[d][0];
              if (Nuance.stores[field])
              {
                fieldOptions.parentList=filtersComboboxes[field]; 
                break;
              }
            }
          }
          filtersComboboxes[filters[i].name] = new Nuance.input.ComboBox(fieldOptions);
          filtersComboboxes[filters[i].name].on('change', self.render);
        }
      }
      if (!filtersEl.childElementCount)
      {
        filtersEl.innerHTML='<span class="filter-text">'+_("There are no available filters")+'</span>';
      }
      filtersIsLoaded=true;

    }
    function showFilters()
    {
      if (!filtersIsLoaded)
      {
        loadFilters();
      }
      filtersWrapEl.style.display='';
      filterButton.body.classList.add('filters-enabled');
      filtersIsDisplayed=true;
    }
    this.showFilters=showFilters;
    function hideFilters()
    {
      filtersWrapEl.style.display='none';
      filterButton.body.classList.remove('filters-enabled');
      filtersIsDisplayed=false;
    }
    this.hideFilters=hideFilters;
    function toggleFilters()
    {
      if (filtersIsDisplayed)
      {
        hideFilters();
      }
      else
      {
        showFilters();
      }
    }
    function setFilters(newFilters)
    {
      if (newFilters)
      {

        showFilters();
        for (var i in newFilters)
        {
          filtersComboboxes[i].setValue(newFilters[i]);
        }
      }
      else
      {
        hideFilters();
      }
    }
    this.setFilters=setFilters;
    new Nuance.input.StretchField({target: toolbarEl});
    var searchBar=new Nuance.input.SearchField({target: toolbarEl, onvaluechange: function(v){setSearch(v); self.render();}});
    var filterButton=new Nuance.input.Button({target: toolbarEl, iconClass: "filter", onlyIcon: true, onclick: toggleFilters});
    gridTableHeader.onmousedrag=falsefunc;
    gridTableHeader.onselectstart=falsefunc;
    var drawHeader=function()
    {
      // Creating header
      var header=self.displayHeader;
      gridTableHeader.innerHTML='';
      for (var d=0; d<header.length; d++)
      {
        ce(
            'span',
            {
              className: header[d][0]+' header-cell',
              draggable: true, 
              onclick: onSortHeaderClick,
              name: header[d][0],
              type: header[d][1],
              innerHTML: _("header_"+header[d][0])
            },
            gridTableHeader
          );
        var onmousedown=function(e)
        {
          var self=this,
              targetRow=self.previousSibling,
              classN =targetRow.classList[0],
              cursorOffset=-4,
              rect=targetRow.getBoundingClientRect(),
              cover=ce( 'div', {className: 'resize-cover'}, targetRow);

          cover.style.height=(( window.innerHeight || document.getElementsByTagName('body')[0].clientHeight)-127)+"px";
          cover.style.left=rect.left+'px';
          document.body.className='resizing';
          gridTable.classList.add('resizing');
          document.onmousemove = function(e)
          {
            cover.style.width=targetRow.style.width=(e.pageX-rect.left)+cursorOffset+"px";
          }
          document.onmouseup=function()
          {
            document.onmouseup=document.onmousemove = self.onmouseup = null;
            document.body.className='';
            gridTable.classList.remove('resizing');
            configProxy.setValue('user', "width", name+":"+targetRow.classList[0], targetRow.offsetWidth-8, userId);
            targetRow.removeChild(cover);
          }
          e.preventDefault();
          document.onmousemove(e);
        }

        ce(
          'p',
          {
            grid: self.el,
            className: 'width-drag',
            onmousedrag: function(e){e.preventDefault();},
            onselectstart: function(e){e.preventDefault();},
            onmousedown:  onmousedown
          },
          gridTableHeader
        );
      }
      var contextMenuIsDisplayed=false;
      var headerContextMenu;
      gridTableHeader.oncontextmenu=function(e)
      {
        var options=[];
        var header=self.store.header,
            newHeader=[];
        for (var d=0; d<header.length; d++)
        {

          for (var j in virtualFields)
          {
            if (virtualFields[j].order===d)
            {
              var hname=j;
              newHeader.push([j, 'text']);
            }
          }
          newHeader.push(header[d]);
        }

        var header=newHeader;

        for (var i=0; i<header.length; i++)
        {
          var columnName=header[i][0];
          if (  hiddenCols.indexOf(columnName)===-1 ||
                (virtualFields[columnName] && hiddenCols.indexOf(columnName)===-1)
             )
          {
            var hiddenByUser=userHiddenCols.indexOf(columnName)!==-1;
            options.push(
              {
                title: (hiddenByUser ? '<span class="icon blank">&nbsp;</span>' : '<span class="icon enabled">&nbsp;</span>' )+_("header_"+header[i][0]),
                onclick: (function(columnName, hiddenByUser, tableName)
                {
                  var hiddenByUser=hiddenByUser;
                  var columnName=columnName;
                  var tableName=tableName;
                  return function ()
                  {
                    if (!hiddenByUser)
                    {
                      userHiddenCols.push(columnName);
                    }
                    else
                    {
                      userHiddenCols.splice ( userHiddenCols.indexOf ( columnName), 1);
                    }
                    configProxy.setValue('user', 'grid', tableName+'-hiddenCols', userHiddenCols, userId );

                    self.render();
                  };
                })(columnName, hiddenByUser, name)
              }
            );
          }
        }
        var headerContextMenuOptions=
        {
          event: e,
          y: gridTableHeader.getBoundingClientRect().bottom,
          options: options
        };
        if (e.target===headerRightButton)
        {
          headerContextMenuOptions.floatSide='right';
        }
        headerContextMenu = new Nuance.ContextMenu(headerContextMenuOptions);
        if (e.target===headerRightButton)
        {
          headerContextMenu.on('close', 
            function()
            {
              headerRightButton.classList.remove('open');
              contextMenuIsDisplayed=false;
            }
          );
        }
        return false;
      }
      var headerRightButton=ce('div', 
        {
          className: 'header-context-menu-button icon check',
          onclick: function(e)
          {
            if (!contextMenuIsDisplayed)
            {
              headerRightButton.classList.add('open');
              gridTableHeader.oncontextmenu(e);
              contextMenuIsDisplayed=true;
            }
            else
            {
              headerRightButton.classList.remove('open');
              contextMenuIsDisplayed=false;
              headerContextMenu.close();
            }
          }
        },
        gridTableHeader
      );

      gridTableHeader.scrollLeft=0;
    }
    var topRenderedRow=0;
    var bottomRenderedRow=-1;
    var oldScrollTop;
    var surroundRows=20;
    if (window.tableRowComputedHeight)
    {
      var rowHeight=window.tableRowComputedHeight;
    }
    else
    {
      var testTable=ce('div', {className: 'grid', id: 'test-table'}, document.body);
      var testRow=ce('div', {id: 'test-row', className: 'table-row'}, testTable);
      ce( 'span', {className: 'table-cell', innerHTML: '42'}, testRow);
      var rowHeight=window.tableRowComputedHeight=testRow.offsetHeight;
      document.body.removeChild(testTable);
    }
    var gridTableRow;
    var topStretchEl;
    function createRow()
    {
      gridTableRow=ce('div', 
        {
          className: 'table-row'
        }
      );
      for (var prop in self.displayData)
      {
        var anyProp=prop;
        break;
      }
      for (var d=0; d<self.displayData[anyProp].length; d++)
      {
        ce( 'span', {className: 'table-cell '+self.displayHeader[d][0]}, gridTableRow);
      }
    }
    this.setDisplayValue=function(id, name, value)
    {
      if (bottomRenderedRow)
      {
        var row=ge(opts.name+'-'+id);
        if (row)
        {
          var cell=row.getElementsByClassName(name);
          if (cell.length)
          {
            cell[0].innerHTML=value;
          }
        }
      }
      if (self.displayData && self.displayData[id])
      {
        self.displayData[id][self.displayNs[name]]=value;
      }
    }
    function renderRows()
    {
      if (gridTable.offsetHeight)
      {
        var startEl=Math.round( gridTable.scrollTop/rowHeight ) - surroundRows/2;
        if (startEl<0) startEl=0;

        var endEl=startEl + Math.round( gridTable.offsetHeight/rowHeight ) + surroundRows;
        if (endEl>dataOrder.length) endEl=dataOrder.length;
      }
      else
      {
        var endEl=0;
      }
      var scrollUp=gridTable.scrollTop<oldScrollTop;
      var rowsFragment=document.createDocumentFragment();

      if (!gridTableRow)
      {
        return;
      }
      for (var i=startEl; i<endEl; i++)
      {
        if (inRange(topRenderedRow, bottomRenderedRow-1, i) )
        {
          i=bottomRenderedRow-1;
          continue;
        }
        var n=dataOrder[i];
        var rowFragment=document.createDocumentFragment();
        var row=gridTableRow.cloneNode(true);
        row.recordId = n;
        /*if (selectedItems.indexOf(n)!==-1)
        {
          row.classList.add('selected');
        }*/
        row.id = name+'-' + n;
        for (var d=0; d<self.displayData[n].length; d++)
        {
          row.children[d].innerHTML= self.displayData[n][d];
        }
        rowsFragment.appendChild(row); 
      }

      var rowsCount=endEl-startEl+2;
      topStretchEl.style.height=startEl*rowHeight+'px';
      if (scrollUp)
      {
        while (gridTable.children[rowsCount]) 
        {
          gridTable.removeChild(gridTable.children[rowsCount]);
        }
        gridTable.insertBefore(rowsFragment, gridTable.children[2]); 
      }
      else
      {
        while (gridTable.children[2] && dataOrder.indexOf(gridTable.children[2].recordId)<startEl) 
        {
          gridTable.removeChild(gridTable.children[2]);
        }
        gridTable.appendChild(rowsFragment);
      }

      oldScrollTop=gridTable.scrollTop;

      topRenderedRow=startEl;
      bottomRenderedRow=endEl;

      for (var i=0; i<selectedItems.length; i++)
      {
        var row=document.getElementById( name+'-'+selectedItems[i]);
        if (row)
        {
          row.classList.add('selected');
        }
      }
      scrollOffset=gridTable.scrollTop;
    }
    var scrollTimeoutId;
    function tableOnScroll()
    {
      if (scrollTimeoutId)
      {
        clearTimeout(scrollTimeoutId);
      }
      scrollTimeoutId=setTimeout( renderRows, 20);
    }
    gridTable.onscroll=tableOnScroll;
    var needToRender=true;
    this.render=function()
    {
      if (name==='user' && !activeOrder)
      {
        return;
      }
      gridTable.onscroll=false;
      gridTable.removeChilds();
      var stretchEl=ce('div', {className: 'left'}, gridTable);
      topStretchEl=ce('div', {}, gridTable);

      topRenderedRow=0;
      bottomRenderedRow=-1;
      
      formatData();
      drawHeader();
      sort();
      filter();
      search();
      stretchEl.style.height=(rowHeight*dataOrder.length) + 'px';


      if (store.getState()==='loading')
      {
        self.setState('loading');
      }
      else if (!dataOrder.length)
      {
        if (self.store.errors.indexOf('deny')!==-1)
        {
          self.setState('deny');
        }
        else if (searchStr)
        {
          self.setState('notfound');
        }
        else if (self.store.header && self.store.header.length)
        {
          self.setState('noitems');
        }
        else
        {
          self.setState('notable');
        }

        statusBar.classList.remove('icon');
        statusBar.innerHTML='';
      }
      else
      {
        self.setState('normal');
        createRow();
        gridTable.scrollTop=scrollOffset;
        renderRows();
        gridTable.onscroll=tableOnScroll;
        var storeLength=self.store.length;
        statusBar.classList.add('icon');

        if (storeLength!==dataOrder.length)
        {
          if (document.body.offsetWidth<1024)
          {
            statusBar.innerHTML=dataOrder.length +'/'+ storeLength;
          }
          else
          {
            statusBar.innerHTML=gt.strargs(gt.ngettext("%1 entry displayed on %2", "%1 entries displayed on %2", dataOrder.length, storeLength), [dataOrder.length, storeLength]);
          }
        }
        else
        {
          if (document.body.offsetWidth<1024)
          {
            statusBar.innerHTML=storeLength;
          }
          else
          {
            statusBar.innerHTML=gt.strargs(gt.ngettext("%1 entry", "%1 entries", storeLength), storeLength);
          }
        }
      }


      if (dataOrder.indexOf(lastSelectedItem)!==-1) 
      {
        var selectedRow=ge(name+'-'+lastSelectedItem);
        if (selectedRow && gridTable.scrollTop+gridTable.clientHeight+80<selectedRow.offsetTop) gridTable.scrollTop=selectedRow.offsetTop-80;
      }
      needToRender=false;
    }

    self.setSorting(configProxy.getValue('user', 'sorter', name, userId), configProxy.getValue('user', 'sorter', name+'direction', userId));
    function beforeAction()
    {
      self.setState('loading');
    }
    self.store.on('beforeload', beforeAction);
    self.store.on('beforeadd', beforeAction);
    self.store.on('beforeedit', beforeAction);
    self.store.on('beforeremove', beforeAction);




    // Check if all helper stores are loaded

    waitForStores.push(self.store.name);

    function onDataChange()
    {
      if (TabPanel.getSelectedTab().name===name && self.store.getState()==='loaded')
      {
        if (needToRender)
        {
          self.render();
        }
        else
        {
          renderRows();
        }
      }
    }

    function forceRender()
    {
      needToRender=true;
      onDataChange();
    }
    function onKeyPress(e)
    {
      if (TabPanel.getSelectedTab().name===name && self.store.getState()==='loaded')
      {
        if (e.ctrlKey===true && e.keyCode===65 && e.target===document.body)
        {
          e.preventDefault();
          selectAllRows();
        }
      }
    }
    function setHooks()
    {
        /*
      self.store.on( 'afterremove', function (e, removedItems)
      {
        
        for (var i=0; i<removedItems.length; i++)
        {
          var id= removedItems[i];
          c ( dataOrder.indexOf(id) )
          if ( dataOrder.indexOf(id) !== -1 )
          {
            dataOrder.splice( dataOrder.indexOf(id), 1 );
          }
        }
      })
      */
      for (var i=0; i<waitForStores.length; i++)
      {
        var store=Nuance.stores[waitForStores[i]];
        store.on('afterload', forceRender);
        store.on('afteradd', forceRender);
        store.on('afteredit', forceRender);
        store.on('afterremove', forceRender);
      }
      TabPanel.on('tabchange', onDataChange);

    }
    window.addEventListener('keydown', onKeyPress);
    var waitForStoresCount=waitForStores.length;
    function afterLoad()
    {
      if (waitForStoresCount)
      {
        waitForStoresCount--;
      }
      if (!waitForStoresCount)
      {
        setHooks();
        for (var i=0; i<waitForStoresCount; i++)
        {
          var store=Nuance.stores[waitForStores[i]];
          store.off('afterload', afterLoad);
        }
      }
    }

    for (var i=0; i<waitForStoresCount; i++)
    {
      var store=Nuance.stores[waitForStores[i]];
      if (store.getState()==='loading')
      {
        store.on('afterload', afterLoad);
      }
      else
      {
        waitForStoresCount--;
      }
    }



    if (self.store.getState()==='loading')
    {
      self.setState('loading');
    }


  }
}
