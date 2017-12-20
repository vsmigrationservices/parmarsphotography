/**
 * Created by foreverpinetree@gmail.com on 14-4-13.
 */
var pinetree = {};//namespace
pinetree.FRAME_RATE = 0;
pinetree.stage = null;
pinetree.textureData = "";
pinetree.textureImage = null;
pinetree.ids = [];//array for element id. NOTE:id SHOULD BE UNIQUE.
pinetree.privateId = 0;//use for debug
pinetree.addresses = [];
pinetree.touchGapSet = 30;
pinetree.EDGE_DEVICE_WIDTH = 1152;
pinetree.isSmallMode = false;
pinetree.headFirst = document.getElementsByTagName('head')[0];
pinetree.isSupportTransition = document.body.style.transition != undefined || document.body.style.webkitTransition != undefined;
pinetree.isSupportAnimation = document.body.style.animationName != undefined || document.body.style.webkitAnimationName != undefined;

pinetree.getGlobalPrivateId = function()
{
    return pinetree.privateId ++;
}

if(!window.trace)
{
    window.trace = function(params)
    {
        if (typeof(console) == "undefined" || typeof(console.log) == "undefined") return;

        var msgs = [], len = arguments.length, msg;
        for(var i = 0; i < len; i ++)
        {
            msg = arguments[i] === undefined ? "undefined" : arguments[i] === null ? "null" : arguments[i].toString();
            msgs.push(msg);
        }
        console.log(msgs.join(" "));
    }
}

if(!window.requestAnimationFrame)
{
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}

/**
 * NOTE:only extends prototype.
 */
if(!window.__extends)
{
    window.__extends = function(subClassRef, parentClassRef)
    {
        var f = function(){};
        f.prototype = parentClassRef.prototype;
        var newPrototype = new f();
        newPrototype.constructor = subClassRef;
        subClassRef.prototype = newPrototype;
        return newPrototype;
    }
}

if(!window.__defineGetterSetter)
{
    window.__defineGetterSetter = function(target, property)
    {
        var firstChar, newPropertyName;
        if(typeof property == "string")
        {
            firstChar = property.substr(0, 1).toUpperCase();
            newPropertyName = firstChar + property.substr(1);

            Object.defineProperty(target, property, {
                get:target['get' + newPropertyName] || function(){},
                set:target['set' + newPropertyName] || function(){}
            });
        }
        else if(typeof property == "object")
        {
            var key, str;
            for(key in property)
            {
                str = property[key];
                if(typeof str == "string")
                {
                    firstChar = str.substr(0, 1).toUpperCase();
                    newPropertyName = firstChar + str.substr(1);

                    Object.defineProperty(target, str, {
                        get:target['get' + newPropertyName] || function(){},
                        set:target['set' + newPropertyName] || function(){}
                    });
                }
            }
        }
    }
}

if(!window.navigateToURL)
{
    window.navigateToURL = function(url, target)
    {
        if(!target || target == "_blank")
        {
            window.open(url);
        }
        else
        {
            document.location.href = url;
        }
    }
}

/**
 * if isBoolean is set to true, the condition will use "!value" to check the value,
 * otherwise will use "value == undifined".
 * NOTE:if isBoolean is true, it is equal "value||defaultValue".
 */
if(!window.__defaultSet)
{
    window.__defaultSet = function(value, defaultValue, isBoolean)
    {
        var condition = isBoolean ? !value : value == undefined;
        return condition ? defaultValue : value;
    }
}

!(function () {
    var ua = navigator.userAgent;

    pinetree.isIE = /msie|trident/i.test(ua);
    pinetree.isOpera = /opera|opr/i.test(ua);
    pinetree.isChrome = /chrome|crios|crmo/i.test(ua) && !pinetree.isOpera;
    pinetree.isWinPhone = /windows phone/i.test(ua);
    pinetree.isIPhone = /(iphone)/i.test(ua);
    pinetree.isIPad = /(ipad)/i.test(ua);
    pinetree.isIPod = /(ipod)/i.test(ua);
    pinetree.isFirefox = /firefox|iceweasel/i.test(ua);
    pinetree.isAndroid = /android/i.test(ua);
    pinetree.isBlackBerry = /blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua);
    pinetree.isWebOS = /(web|hpw)os/i.test(ua);
    pinetree.isMobile = /mobile/i.test(ua);
    pinetree.isTablet = /tablet/i.test(ua);
    pinetree.isKindle = /Kindle/i.test(ua) || /Silk/i.test(ua) || /KFTT/i.test(ua) || /KFOT/i.test(ua) || /KFJWA/i.test(ua) ||
        /KFJWI/i.test(ua) || /KFSOWI/i.test(ua) || /KFTHWA/i.test(ua) || /KFTHWI/i.test(ua) || /KFAPWA/i.test(ua) || /KFAPWI/i.test(ua);
    pinetree.isDevice = /*true;*/(pinetree.isAndroid || pinetree.isBlackBerry || pinetree.isIPad || pinetree.isTablet ||
    pinetree.isIPhone || pinetree.isIPod || pinetree.isWebOS || pinetree.isWinPhone || pinetree.isMobile || pinetree.isKindle);
})();

pinetree.FRAME_RATE = pinetree.isDevice ? 60 : 60;

pinetree.createCanvas = function(w, h)
{
    var canvas = document.createElement("canvas");
    if(w != undefined) canvas.width = w;
    if(h != undefined) canvas.height = h;
    return canvas;
}

if(!window.__import)
{
    window.__import = function(address)
    {
        if(!__global.isDebug) return;

        var i = pinetree.addresses.length;
        while(i --)
        {
            if(pinetree.addresses[i] == address)
            {
                return;
            }
        }
        pinetree.addresses.push(address);
        document.write("<script src='" + address + "'></script>");
    }
}

pinetree.makeClip = function (x, y, width, height)
{
    x = !x ? 0 : x;
    y = !y ? 0 : y;
    return "rect(" + y + "px, " + (x + width) + "px, " + (y + height) + "px, " + x + "px)"
}

pinetree.getScrollX = function()
{
    var x = (window.pageXOffset !== undefined) ? window.pageXOffset :
        (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    return x;
}

pinetree.getScrollY = function()
{
    var y = (window.pageYOffset !== undefined) ? window.pageYOffset :
        (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return y;
}

pinetree.parseFontSize = function(fontSize)
{
    return pinetree.isDevice ? Math.floor(fontSize * 1.25) : fontSize;
}

pinetree.hasProgressEvent = (function(){
    var request = window.XMLHttpRequest && new window.XMLHttpRequest() || "";
    return "onprogress" in request; })();

pinetree.enableGlobalSelect = function(value)
{
    if(!!value)
        document.onselectstart = function(){ return true };
    else
        document.onselectstart = function(){ return false };
}

/**
 * return RGBA string.
 * @param color
 * @param alpha
 */
pinetree.getRGBA = function(color, alpha)
{
    return "rgba(" + ((color >> 16) & 0xff) +  "," + ((color >> 8) & 0xff) +  "," +
        (color & 0xff) +  "," + alpha + ")";
}

pinetree.getOffsetColor = function(srcColor, destColor, percent)
{
    if(typeof(percent) != "number") return;
    percent = percent < 0 ? 0 : percent > 1 ? 1 : percent;

    var r1 = (srcColor >> 16) & 0xff;
    var g1 = (srcColor >> 8) & 0xff;
    var b1 = srcColor & 0xff;

    var r2 = (destColor >> 16) & 0xff;
    var g2 = (destColor >> 8) & 0xff;
    var b2 = destColor & 0xff;

    r1 += (r2 - r1) * percent;
    g1 += (g2 - g1) * percent;
    b1 += (b2 - b1) * percent;

    return Math.floor((r1 << 16) + (g1 << 8) + b1);
}

pinetree.getColorString = function(color)
{
    var str = color.toString(16);
    var left = 6 - str.length;
    while(left -- > 0)
    {
        str = "0" + str;
    }
    return "#" + str;
}

pinetree.addEventListener = function (target, event, handler, useCapture)
{
    if(target.addEventListener)
    {
        target.addEventListener(event, handler, useCapture || false);
        return true;
    }
    else if(target.attachEvent)//deprecated in IE9+
    {
        target.attachEvent("on" + event, handler);
        return true;
    }
    return false;
}

pinetree.removeEventListener = function(target, event, handler, useCapture)
{
    if(target.removeEventListener)
    {
        target.removeEventListener(event, handler, useCapture || false);
        return true;
    }
    else if(target.detachEvent)
    {
        target.detachEvent("on" + event, handler);
        return true;
    }
    return false;
}

pinetree.dispatchEvent = function(target, event)
{
    if(target.dispatchEvent)
    {
        target.dispatchEvent(event);
        return true;
    }
    else if(target.fireEvent)
    {
        target.fireEvent("on" + event.eventType, event);
        return true;
    }
    return false;
}

pinetree.getEvent = function(eventName)
{
    var event;
    if(document.createEvent)
    {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
    }
    else if(document.createEventObject)// IE < 9
    {
        event = document.createEventObject();
        event.eventType = eventName;
    }
    if(!event) return null;
    event.eventName = eventName;
    return event;
}

pinetree.dispatchWith = function(target, eventName)
{
    var event = this.getEvent(eventName);
    if(!event) return;
    this.dispatchEvent(target, event);
}

pinetree.setTransform = function(target, value)
{
    var oldTransform = target.style.transform || target.style.msTransform ||
        target.style.webkitTransform || target.style.oTransform || target.style.mozTransform;
    if(oldTransform)
    {
        var interests = ["rotate", "scale", "scaleX", "scaleY", "translate", "skew", "matrix"];
        var key;
        var i = interests.length;
        while(i --)
        {
            if(value.indexOf(interests[i]) > -1)
            {
                key = interests[i];
                break;
            }
        }

        var pattern = /,\s+/g;
        oldTransform = oldTransform.replace(pattern, ",");

        var arr = oldTransform.split(" ");
        i = arr.length;
        while(i --)
        {
            if(arr[i].indexOf(key) > -1)
            {
                arr.splice(i, 1);
            }
        }

        value = arr.join(" ") + " " + value;
    }
    target.style.transform = value;
    target.style.msTransform = value;
    target.style.webkitTransform = value;
    target.style.oTransform = value;
    target.style.mozTransform = value;
}

pinetree.setTransition = function(target, value)
{
    target.style.transition = value;
    target.style.webkitTransition = value;
}

pinetree.setAnimation = function(target, value)
{
    target.style.animation = value;
    target.style.webkitAnimation = value;
}

pinetree.setTransformOrigin = function(target, x, y, z)
{
    var value = [x, y, z].join(" ");
    target.style.transformOrigin = value;
    target.style.msTransformOrigin = value;
    target.style.webkitTransformOrigin = value;
    target.style.oTransformOrigin = value;
    target.style.mozTransformOrigin = value;
}

pinetree.getStagePosition = function(evt)
{
    var pos = {x:0, y:0};
    if(evt.pageX || evt.pageY)
    {
        pos.x = evt.pageX;
        pos.y = evt.pageY;
    }
    else
    {
        pos.x = evt.clientX + document.body.scrollLeft - document.body.clientLeft;
        pos.y = evt.clientY + document.body.scrollTop  - document.body.clientTop
    }

    if(isNaN(pos.x)) pos.x = 0;
    if(isNaN(pos.y)) pos.y = 0;
    return pos;
}

pinetree.containsElement = function(parentNode, childNode)
{
    if(!parentNode || !childNode) return false;
    if(childNode.nodeType != 1) return false;

    if(document.compareDocumentPosition)
    {
        return !!(parentNode.compareDocumentPosition(childNode) & 16);
    }
    else
    {
        return parentNode !== childNode && (parentNode.contains ? parentNode.contains(childNode) : true);
    }
}

pinetree.addKeyFrames = function(keyFrames)
{
    var str = " @-webkit-keyframes " + keyFrames + " @keyframes " + keyFrames;
    var s = document.createElement("style");
    s.type = 'text/css';
    s.innerHTML = str;
    pinetree.headFirst.appendChild(s);
    return s;
}

var Delegate = {};
Delegate.create = function (owner, method)
{
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
        return method.apply(owner, Array.prototype.slice.call(arguments, 0).concat(args));
    };
}

//------------------------------------------------------------------------
__import('js/pinetreeframework/Entry.js');

/**
 * Created by foreverpinetree@gmail.com on 14-5-25.
 */
var pinetreemvc = {};



/**
 * Created by foreverpinetree@gmail.com on 14-5-8.
 */
var pinetreecom = {};

/**
 * Created by foreverpinetree@gmail.com on 14-4-23.
 */
var pinetreesite = {};//namespace
__import('js/siteframework/SiteMain.js');

/**
 * Created by foreverpinetree@gmail.com on 14-4-24.
 */
var pt = function(){};
var pinetreepages = {};

__import('js/src/data/ConfigSetting.js');
__import('js/src/utils/ConfigUtil.js');
__import('js/src/utils/EnumTextures.js');
__import('js/src/utils/AssetsManager.js');
__import('js/src/$.js');
__import('js/src/Index.js');
__import('js/src/ui/views/components/components.js');
