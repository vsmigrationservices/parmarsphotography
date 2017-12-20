/**
 * Created by foreverpinetree@gmail.com on 14-8-17.
 */
var pinetreepreload = {};

var __global = {};
__global.isDebug = false;

var __create = function (owner, method)
{
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
        return method.apply(owner, Array.prototype.slice.call(arguments, 0).concat(args));
    };
}

if(window.PARENT_URL == undefined)
{
    window.PARENT_URL = "./";
}

pinetreepreload.importURLs = [];

if(__global.isDebug)
{
    document.write("<script src='js/classes/thirdpart/allinone.min.js'></script>");

    document.write("<script src='js/pinetreeframework/core/pinetree.js'></script>");
    document.write("<script src='js/pinetreemvc/core/pinetreemvc.js'></script>");
    document.write("<script src='js/com/core/pinetreecom.js'></script>");
    document.write("<script src='js/siteframework/core/pinetreesite.js'></script>");
    document.write("<script src='js/src/core/pinetreepages.js'></script>");
}
else
{

}

(function()
{
    var SiteLoading = function()
    {
        this._percent = 0;//0-1

        this._parent = null;
        this._container = null;

        this._track = null;

        this._disposed = false;

        this._backgroundHeight = 0;
        this._trackHeight = 10;
        this._backgroundColor = "#000000";
        this._trackColor = "#ffffff";

        this.trackWidth = 0;

        //this.tweenTime = 1.0;
        //this.transition = Quad.easeOut;

        window._siteLoading = this;

        window.addEventListener("resize", this.onResize, false);
    }

    var p = SiteLoading.prototype;

    p.initWith = function(parentElement, bgColor, trackColor)
    {
        this._parent = parentElement;
        this._backgroundColor = bgColor;
        this._trackColor = trackColor;

        this._container = document.createElement("div");
        this._container.style.opacity = 1;
        this._container.style.height = this._backgroundHeight + "px";
        this._container.style.position = "absolute";
        this._container.style.backgroundColor = this._backgroundColor;
        this._parent.appendChild(this._container);

        this._track = document.createElement("div");
        this._track.style.height = this._trackHeight + "px";
        this._track.style.wdith = 0 + "px";
        this._track.style.position = "absolute";
        this._track.style.top = ((this._backgroundHeight - this._trackHeight) >> 1) + "px";
        this._track.style.backgroundColor = this._trackColor;
        this._container.appendChild(this._track);

        this.onResize(null);
        this._update();
    }

    p.getPercent = function() { return this._percent; }
    p.setPercent = function(value)
    {
        value = value > 1 ? 1 : value < 0 ? 0 : value;
        this._percent = value;
        this._update();
    }

    p._update = function()
    {
        /*TweenMax.to(this, this.tweenTime, {trackWidth:this.getStageWidth() * this._percent, ease:this.transition,
            onUpdate:this._onTweenUpdate, onUpdateParams:[this]});*/
        this.trackWidth = this.getStageWidth() * this._percent;
        this._onTweenUpdate(this);
    }

    p._onTweenUpdate = function(owner)
    {
        owner._track.style.width = owner.trackWidth + "px";
    }

    p.getStageWidth = function()
    {
        var w = 0;
        if(window.innerWidth)
            w = window.innerWidth;
        else if(document.body && document.body.clientWidth)
            w = document.body.clientWidth;
        if(document.documentElement && document.documentElement.clientWidth)
        {
            w = document.documentElement.clientWidth;
        }
        return w;
    }

    p.getStageHeight = function()
    {
        var h = 0;
        if(window.innerHeight)
            h = window.innerHeight;
        else if((document.body)&&(document.body.clientHeight))
            h = document.body.clientHeight;

        if(document.documentElement && document.documentElement.clientHeight)
        {
            h = document.documentElement.clientHeight;
        }
        return h;
    }

    p.onResize = function(evt)
    {
        var owner = window._siteLoading;

        var sw = owner.getStageWidth();
        var sh = owner.getStageHeight();

        var y = (sh - owner._backgroundHeight) >> 1;
        //owner._container.style.top = y + "px";
        owner._container.style.width = sw + "px";
    }

    p.removeAllElementNodes = function(parentNode)
    {
        if(!parentNode) return;

        var childNodes =parentNode.childNodes, childNode;
        for(var i=childNodes.length-1; i>=0; i--)
        {
            childNode = childNodes.item(i);
            if(!childNode) continue;
            if(childNode.childNodes && childNode.childNodes.length > 0)
            {
                this.removeAllElementNodes(childNode);
            }
            parentNode.removeChild(childNode);
        }
    }

    p.dispose = function()
    {
        if(this._disposed) return;
        this._disposed = true;

        TweenMax.killTweensOf(this);

        window.removeEventListener("resize", this.onResize, false);
        window._siteLoading = null;

        this.removeAllElementNodes(this._container);
        this._parent.removeChild(this._container);
    }

    pinetreepreload.SiteLoading = SiteLoading;
}());

(function()
{
    var JSLoader = function()
    {
        this.abortHandler = null;
        this.errorHandler = null;
        this.completeHandler = null;
        this.progressHandler = null;

        this._ajax = new XMLHttpRequest();
        this._ajax.onabort = __create(this, this.onAbort);
        this._ajax.onreadystatechange = __create(this, this.onReadyStateChange);
        this._ajax.onprogress = __create(this, this.onProgress);

        this.type = "js";

        this.url = "";
    }

    var p = JSLoader.prototype;

    p.load = function(url)
    {
        this.url = url;

        if(__global.isDebug)
        {
            this._ajax.open("GET", url, true);
            this._ajax.send();
        }
        else
        {
            this._ajax.open('POST', PARENT_URL + "data/php/proxy.php", true);
            this._ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            this._ajax.send('file_url=' + url);
        }
    }

    p.onReadyStateChange = function()
    {
        if (this._ajax.readyState == 4)
        {
            if(this._ajax.status == 200 || this._ajax.status == 0)//0 is for local test
            {
                this._data = this._ajax.responseText;

                if(this.type == "js")
                {
                    var myHead = document.getElementsByTagName("HEAD").item(0);
                    var myScript = document.createElement( "script" );
                    myScript.language = "javascript";
                    myScript.type = "text/javascript";
                    try
                    {
                        myScript.appendChild(document.createTextNode(this._data));
                    }
                    catch (ex)
                    {
                        myScript.text = this._data;
                    }
                    myHead.appendChild(myScript);
                }

                this.completeHandler && this.completeHandler();
            }
            else
            {
                this.errorHandler && this.errorHandler();
            }
        }
    }

    p.onAbort = function(evt)
    {
        this.abortHandler && this.abortHandler();
    }

    p.onProgress = function(evt)
    {
        var percent;
        if(evt)
        {
            percent = evt.total != undefined && !isNaN(evt.total) && evt.total > 0 ? evt.loaded / evt.total : 0;
        }
        this.progressHandler && this.progressHandler(percent);
    }

    p.getData = function()
    {
        return this._data;
    }

    p.dispose = function()
    {
        if(this._ajax)
        {
            this._ajax.onabort = null;
            this._ajax.onreadystatechange = null;
            this._ajax.onprogress = null;
            this._ajax.abort();
            this._ajax = null;
        }

        this.abortHandler = null;
        this.errorHandler = null;
        this.completeHandler = null;
    }

    pinetreepreload.JSLoader = JSLoader;
}());

(function()
{
    var JSLoaderQueue = function(loading)
    {
        this._loading = loading || null;

        this._jsUrls = null;
        this._loaders = null;

        this._texts = null;

        this._textUrls = null;

        this._currentIndex = 0;
        this._totalCount = 0;

        this._percent = 0;
        this._fileCountPercent = 0;
        this._sectionPercent = 0;
        this._partConstPercent = 0;

        this.completeHandler = null;
        this.progressHandler = null;
    }

    var p = JSLoaderQueue.prototype;

    p.setURLs = function(jsUrls, textUrls)
    {
        this._jsUrls = jsUrls;
        this._textUrls = textUrls;
    }

    p.start = function()
    {
        this._currentIndex = 0;
        this._totalCount = this._jsUrls.length;
        if(this._textUrls)
        {
            this._totalCount += this._textUrls.length;
        }

        this._percent = 0;
        this._fileCountPercent = 0;
        this._sectionPercent = 0;
        this._partConstPercent = this._totalCount > 0 ? 1 / this._totalCount : 0;

        this._loaders = [];

        this._texts = [];

        if(this._loading)
        {
            this._loading.enabled = true;
        }

        this._loadNext();
    }

    p._loadNext = function()
    {
        this._sectionPercent = 0;

        var loader = new pinetreepreload.JSLoader();
        loader.completeHandler = __create(this, this.onLoadComplete);
        loader.progressHandler = __create(this, this.onProgress);
        this._loaders.push(loader);

        if(this._currentIndex < this._jsUrls.length)
        {
            loader.type = "js";
            loader.load(this._jsUrls[this._currentIndex]);
        }
        else
        {
            loader.type = "text";
            loader.load(this._textUrls[this._currentIndex - this._jsUrls.length]);
        }
    }

    p.onProgress = function(percent)
    {
        this._sectionPercent = percent * this._partConstPercent;
        this._percent = this._fileCountPercent + this._sectionPercent;
        this.progressHandler && this.progressHandler(this._percent);

        if(this._loading)
        {
            this._loading.setPercent && this._loading.setPercent(this._percent);
        }
    }

    p.onLoadComplete = function(e)
    {
        var loader = this._loaders[this._currentIndex];
        loader.completeHandler = null;
        loader.progressHandler = null;

        if(loader.type == "text")
        {
            this._texts.push({url:loader.url, data:loader.getData()});
        }

        this._currentIndex ++;

        this._fileCountPercent = this._currentIndex / this._totalCount;
        this._percent = this._fileCountPercent;
        this.progressHandler && this.progressHandler(this._percent);

        if(this._loading)
        {
            this._loading.setPercent && this._loading.setPercent(this._percent);
        }

        if(this._currentIndex < this._totalCount)
        {
            this._loadNext();
        }
        else
        {
            this.completeHandler && this.completeHandler();
        }
    }

    p.getTexts = function()
    {
        return this._texts;
    }

    p.dispose = function()
    {
        this.completeHandler = null;
        this.progressHandler = null;

        if(this._loading)
        {
            this._loading.enabled = false;
            this._loading = null;
        }

        if(this._loaders)
        {
            var loader;
            for(var key in this._loaders)
            {
                loader = this._loaders[key];
                loader && loader.dispose();
            }

            this._loaders.splice(0, this._loaders.length);
            this._loaders = null;
        }
    }

    pinetreepreload.JSLoaderQueue = JSLoaderQueue;
}());