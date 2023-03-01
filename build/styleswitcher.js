function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function setActiveStyleSheet(title) {
  var i, a;
  document.body.style.display = "none";
  
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) {
        a.disabled = false;
      }
    }
  }
  document.body.style.display = "block";
  
}

function getActiveStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
  }
  return null;
}

function getPreferredStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1
       && a.getAttribute("rel").indexOf("alt") == -1
       && a.getAttribute("title")
       ) return a.getAttribute("title");
  }
  return null;
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

window.onload = function(e) {
  var cookie = readCookie("style");
  var title = cookie ? cookie : getPreferredStyleSheet();
  setActiveStyleSheet(title);
}

window.onunload = function(e) {
  var title = getActiveStyleSheet();
  createCookie("style", title, 365);
}

var container = htmlToElement('<div class="shadow bg-white rounded-left text-center p-3" title="Theme switcher for demo" style="position:fixed;top:22%;right:0;z-index:2000"></div>');
var themer = htmlToElement('<div class="pb-1" id="themer"></div>');
var themes = [
    {name:'turquoise',color:'MediumTurquoise',file:'theme-turquoise.css'},
    {name:'red',color:'orangered',file:'theme-red.css'},
    {name:'blue',color:'skyblue',file:'theme-blue.css'},
    {name:'hotpink',color:'hotpink',file:'theme-hotpink.css'},
    {name:'slateblue',color:'#3f6dda',file:'theme-slateblue.css'},
    {name:'lime',color:'limegreen',file:'theme-lime.css'},
    {name:'black',color:'black',file:'theme-black.css'}
];

for (var t in themes) {
  var el = htmlToElement('<a href="." class="d-block py-1" onclick="setActiveStyleSheet(\''+themes[t].name+'\');"><span class="badge badge-pill" style="background-color:'+themes[t].color+';">&nbsp;</span></a>');
  var linkRef = htmlToElement('<link rel="alternate stylesheet" href="./css/'+themes[t].file+'" title="'+themes[t].name+'">');
  themer.appendChild(el);
  document.head.appendChild(linkRef);
}

container.appendChild(themer);
document.body.appendChild(container);

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
