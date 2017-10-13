function proxy_start(){
    var popup;
    var initingCount = 0;
    /*
    * send init messge to trig the init function of controller 
    */
    initPage = function(){
        var initMsg ={
            type : "init",
            data : {id: 1}
        };
        popup.postMessage(initMsg,"*");
        initingCount = 2;//always update resolution in the first 5 frames
    }; 
    var requestCachedImage = function(){
        var buf = new ArrayBuffer(2);
        var dbytes =new Uint16Array(buf);
        // call 112 to get full images
        dbytes[0] = 112;
        connection.send(buf);
    }
    /*
    * send startDisplay messge to add handler of all kinds 
    * message that may be sent 
    */
    startDisplay = function(){ 
        var scrBase={
            x:0,
            y:0
        };
        var scrModel ={
            k:1,
            tx:0,
            ty:0
        };
        var startData ={
            screenBase:scrBase,
            sizeFactor:1,
            screenModel:scrModel
        }; 
        var startDisplayMsg ={
            type : "startDisplay",
            data : startData
        };  
        popup.postMessage(startDisplayMsg,"*");

        requestCachedImage();
    };
    /*
    *display the data we sent
    */
    display = function(rgba,x,y,w,h){ 
        console.log("test herer");
        var cdat = new Uint8ClampedArray(rgba);
        var imd = new ImageData(cdat,w,h);
        createImageBitmap(imd, 0, 0, w, h).then(function(imm){

            imginf = {
                image: imm,
                encoding : -260,
                //subEncoding : 0x80,
                x:x,
                y:y,
                width:w,
                height:h,
                //color :0xff0000,
            };
            tmp = {
                rect : imginf,
                renderingIndex : 0
            };
            arr = new Array();
            arr[0] = tmp;
            displayMsg = {
                type : "display",
                data : arr
            };
            popup.postMessage(displayMsg,"*");
        });
    }; 

    /*
    * establish the wss connection
    * author: MANSION
    * Date:2017-09-05 12:59:40
    */
    var sendData = function(){console.log("ignore data before connection");};
    var connection;
    var host = location.hostname;
    console.log(host);
    var address = "wss://"+host+":8057/dup";
    connection = new WebSocket(address);
    connection.binaryType = 'arraybuffer';
    connection.onopen = function(){
       console.log("connected to dup broker");
       sendData = function(data) {
          connection.send(data);
       };
    };
    var convertToRGBA = function(data, offset, w, h){
        if(data.byteLength!==w*h*3+offset){
            console.error("bad package "+w +"*"+h+"+"+offset+"!="+data.byteLength);
            return;
        }
        var i,j;
        var srcDepth = 3;//not sending alpha data to save bandwidth
        var dstDepth = 4;//depth=4 for testing data
        var srcWidthStep = w*srcDepth;
        var dstWidthStep = w*dstDepth;
        var srcBaseIndex;
        var dstBaseIndex;
        var src = new Uint8ClampedArray(data);
        var dst = new Uint8ClampedArray(w*h*4);
        for(i=0;i<h;i++){
            for(j=0;j<w;j++){
                var dstBaseIndex = i*dstWidthStep+j*dstDepth;
                var srcBaseIndex = i*srcWidthStep+j*srcDepth+offset;
                dst[dstBaseIndex] = src[srcBaseIndex+2];
                dst[dstBaseIndex+1] = src[srcBaseIndex+1];
                dst[dstBaseIndex+2] = src[srcBaseIndex];
                dst[dstBaseIndex+3] = 255;
            }
        }
        return dst.buffer;
    };
    var previousResolution = {
        width: 0,
        height: 0
    };
    var resolutionChanged = function(resolutionWidth,resolutionHeight){
        //always update resolution in the first 5 frames
        if(initingCount>0){
            initingCount--;
            return true;
        }
        return previousResolution.width !== resolutionWidth ||
            previousResolution.height !== resolutionHeight;
    };
    var changeResolution = function(resolutionWidth,resolutionHeight){
        var newResolution = {
            width: resolutionWidth,
            height: resolutionHeight
        }
        resolutionMsg = {
            type : "resolution",
            data : newResolution
        };
        popup.postMessage(resolutionMsg,"*");
        console.log("resolution Changed");
        previousResolution = newResolution;
    };
    /*
    *received image data from server
    */
    connection.onmessage = function(evt) {
        var sizeOfUshort = 2;//2 bytes
       //should construct the object here and send it to 
       // subpage
       console.log("data length from server :")
       console.log(evt.data.byteLength)
      /* var ushortBuf = new Uint16Array(evt.data);
       var resolutionWidth = ushortBuf[0];
       var resolutionHeight = ushortBuf[1];
       var x = ushortBuf[2];
       var y = ushortBuf[3];
       var w = ushortBuf[4];
       var h = ushortBuf[5];
       var widthStep = ushortBuf[6];
       if(widthStep !== resolutionWidth*4){
          console.error("inner logic error!!");
       }*/

       //console.log(resolutionWidth,resolutionHeight,x,y,w,h,widthStep);
       /*if(resolutionChanged(resolutionWidth,resolutionHeight)){
          changeResolution(resolutionWidth,resolutionHeight);
          requestCachedImage();
       } else {*/
          //display(convertToRGBA(evt.data,7*sizeOfUshort,w,h),x,y,w,h);
          display(evt.data,0,0,1368,768);
      // }
       console.log("recv from server:" + evt.data);
    };
    connection.onclose = function() {
       console.log('Connection is closed...');
    };
    /*
    * handle the message and send it to 
    * the server via wss
    * author : Mansion
    * date :2017-09-05 11:34:47
    */
    window.onmessage = function(e){
        //console.log(e.data);
        var buf = new ArrayBuffer(10);
        switch(e.data.type){
            case "mouseMove": 
                    var dbytes =new Uint16Array(buf);
                    dbytes[0] = 4;
                    dbytes[1] = e.data.data.position.x;
                    dbytes[2] = e.data.data.position.y;
                    connection.send(buf.slice(0,6));
                    break;
            case "mouseWheel":
                    var dbytes1 =new Uint16Array(buf);
                    dbytes1[0] = 3;
                    dbytes1[1] = e.data.data.position.x;
                    dbytes1[2] = e.data.data.position.y;
                    dbytes1[3] = e.data.data.position.dx;
                    dbytes1[4] = e.data.data.position.dy;
                    connection.send(buf);
                    break;
            case "mouseButton":
                    var dbytes2 =new Uint16Array(buf);
                    dbytes2[0] = 2;
                    dbytes2[1] = e.data.data.isDownEvent;
                    dbytes2[2] = e.data.data.bmask;
                    dbytes2[3] = e.data.data.position.x;
                    dbytes2[4] = e.data.data.position.y;
                    connection.send(buf);
                    break;
            default :
                    console.log("unsupported event");
                    break;
        }
    } ;// window.onmessge
    /* 
    *start to display
    */
   
    setTimeout(function(){
        var iframeObj = document.getElementById("viewportal");
        iframeObj.src = './webclient/app-extended-monitor.html';
        iframeObj.style.width= screen.width+"px";
        iframeObj.style.height= screen.height -5+"px";
        iframeObj.style.display= '';
        popup = iframeObj.contentWindow;
        setTimeout(initPage,1000);
        setTimeout(startDisplay,1200); 
    },200);
    //setTimeout(testdisplay,1500); 
}