//foreverpinetree@gmail.com
(function()
{
    var initial_scale = 1 / window.devicePixelRatio;
    if(initial_scale < 0.5) initial_scale = 0.5;
    var content = "width=device-width,user-scalable=no,initial-scale=" +
        initial_scale + ",minimum-scale=" + initial_scale + ",maximum-scale=" + initial_scale;
    var meta = document.getElementsByTagName("meta");
    var viewportIndex = -1;
    for(var i = 0; i < meta.length; i++)
    {
        if(meta[i].getAttribute('name') == "viewport")
        {
            viewportIndex = i;
            break;
        }
    }
    if(viewportIndex > -1)
    {
        meta[viewportIndex].setAttribute("content", content);
    }

    window.init = function()
    {
        var isSupportHTML5 = !!document.createElement('canvas').getContext;
        if(!isSupportHTML5)
        {
            var root = document.getElementById("container");
            root.style.left = "10px";
            root.style.top = "10px";
            root.innerHTML = "<span style='color:#ff0000;font-size:14px;'>Your browser does not support HTML5</span>," +
            " please use <a href='http://windows.microsoft.com/en-us/internet-explorer/download-ie'>IE9+</a>" +
            " or lastest versions of other modern browsers" +
            " like<span style='color:#0000ff;font-size:14px;'>" +
            " <a href='https://www.google.com/chrome/browser/'>Chrome</a>," +
            " <a href='https://www.mozilla.org/'>Firefox</a>," +
            " <a href='http://www.apple.com/safari/'>Sarafi</a>," +
            " <a href='http://www.opera.com/'>Opera</a></span> and so on.";
            return;
        }

        var preloadContainer = document.getElementById("preloadContainer");
        this.siteLoading = new pinetreepreload.SiteLoading();

        //you can change the color of loading by modifying the 3rd param.
        this.siteLoading.initWith(preloadContainer, "#cccccc", "#32a692");

        //don't modify the following paths
        var textURLS = ["data/json/config.json", "data/json/menu.json", "data/json/assets/texture.json"];

        this.loadQueue = new pinetreepreload.JSLoaderQueue(null);
        this.loadQueue.setURLs(pinetreepreload.importURLs, textURLS);
        this.loadQueue.completeHandler = __create(this, this.onLoadStageFirstComplete);
        this.loadQueue.start();
    }

    window.onLoadStageFirstComplete = function()
    {
        var texts = this.loadQueue.getTexts();
        var len = texts.length, o;
        var configData, menuData, textureData;

        for(var i = 0; i < len; i ++)
        {
            o = texts[i];
            if(o)
            {
                if(o.url == "data/json/config.json")
                {
                    configData = o.data;
                }
                else if(o.url == "data/json/menu.json")
                {
                    menuData = o.data;
                }
                else if(o.url == "data/json/assets/texture.json")
                {
                    textureData = o.data;
                }
            }
        }

        pt.parseConfig(JSON.parse(configData));
        pinetreepages.configUtil.parseMenu(JSON.parse(menuData));
        pinetree.textureData = JSON.parse(textureData);
        pinetree.textureImage = document.getElementById("texture");

        this.loadQueue && this.loadQueue.dispose();
        this.loadQueue = null;

        jQuery('#spinnerContainer').fadeOut(300);

        setTimeout(this.startStageFirstSetUp, 300);
    }

    window.startStageFirstSetUp = function()
    {
        var root = document.getElementById("container");
        var staticRoot = document.getElementById("fixedContainer");
        var staticDeviceRoot = document.getElementById("deviceRootContainer");
        var main = new pinetree.Entry(root, staticRoot, staticDeviceRoot);
        main.start(pinetreepages.Index);

        if(this.siteLoading)
        {
            this.siteLoading.dispose();
            this.siteLoading = null;
        }
    }
}());