( function(){
        var popup = window.open('C:/Users/menx/Desktop/webclient/webclient/app-extended-monitor.html')
        /*
        * send init messge to trig the init function of controller 
        */
        var initPage = function(){ 
            var scrBase={
                x:0,
                y:0
            };
            var scrModel ={
                k:1,
                tx:1,
                ty:1
            };
            var startData ={
                screenBase:scrBase,
                sizeFactor:1,
                screenModel:scrModel
            }; 
            var initMsg ={
                type : "init",
                data : startData
            };
            popup.postMessage(initMsg,"*");
        }; 
        /*
        * send startDisplay messge to add handler of all kinds 
        * message that may be sent 
        */
        var startDisplay = function(){ 
            var startDisplayMsg ={
                type : "startDisplay",
            };  
            popup.postMessage(startDisplayMsg,"*");
        };
        /*
        *display the data we sent
        */
        var display = function(){ 
            var imginf = {
                encoding : -260,
                subEncoding : 0x80,
                x:0,
                y:0,
                width:100,
                height:100,
                color :0xff0000,
            };
            var tmp ={
                rect : imginf,
                renderingIndex : 0
            };
            var arr = new Array();
            arr[0] = tmp;
            var displayMsg = {
                type : "display",
                data : arr
            } ;
            popup.postMessage(displayMsg,"*");
        }; 
        /*window.onmessage = function(e){
            console.log(e.data);
        } */
        drawMyPic = function (){
        	for(var i = 0; i < 10; ++i){
        		displayMsg.data[0].rect.x += 100;
        		displayMsg.data[0].rect.y += 100;
        		displayMsg.data[0].rect.color ^= 0xffffff;
        		display();
        	}
        };
}());