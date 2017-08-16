setTimeout(function(){
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia;

supportHTML5Audio = !!window.AudioContext && !!navigator.getUserMedia;
if (!supportHTML5Audio) {
   console.error('browser does not support HTML5 media in, creating media source fails');
}
console.log('browser supports HTML5 media in');



///////////////////////////////////////////////////////////////////////////////////////////////
getRGB = function(rgbaBuffer) {
   var data = new Uint8Array(rgbaBuffer),
      result = new Uint8Array(rgbaBuffer.byteLength/4*3);

   for (var i =0;i<rgbaBuffer.byteLength/4;i++){
      result[i*3] = data[i*4];
      result[i*3+1] = data[i*4+1];
      result[i*3+2] = data[i*4+2];
   }
   return result.buffer;
};
///////////////////////////////////////////////////////////////////////////////////////////////
var TypeMap = {
   audio: new Uint16Array([137,1]),
   video: new Uint16Array([137,0]),
}
var sendData = function(){console.log("ignore data before connection");};
var connection;
var audiotype = new Uint16Array([137,1]);
var videotype = new Uint16Array([137,0]);
var address = "wss://"+location.hostname+":8001/echo";
connection = new WebSocket(address);
connection.binaryType = 'arraybuffer';
connection.onopen = function(){
   console.log("connected to media broker");
   sendData = function(data, type) {
      connection.send(TypeMap[type]);
      connection.send(data);
   };
};
connection.onmessage = function(evt) {
   console.log("from server:" + evt.data);
};
connection.onclose = function() {
   console.log('Connection is closed...');
};
var audioCapture = new AudioCapture();
var videoCapture = new VideoCapture();
var syncTimer = new SyncTimer();
var audioParam = {sampleRate: 8000};
var videoParam = {
      width: 320,
      height:240,
      fps: 5
   };

var onAudioData = function(sample){
   console.log("audio send");
   sendData(audiotype.concat(sample.data));
};
var onVideoData = function(sample){
   console.log("video send");
   sendData("video"+getRGB(sample.data), );
   sample.others.callback(sample.others.callbackParam);
};
audioCapture.init(audioParam, syncTimer, onAudioData);
videoCapture.init(videoParam, syncTimer, onVideoData);

///////////////////////////////////////////////////////////////////////////////////////////////
var successCallback = function (stream) {
   audioCapture.start(stream);
   videoCapture.start(stream);
}

navigator.getUserMedia({
      audio:true,
      video:true
   },
   successCallback,
   function(){
      alert("fail to open media");
   }
);
},3000);