/*********************************************************
 * Copyright (C) 2015-2016 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview videocapture.js -- VideoCapture
 * Class to handle video capturing
 */

(function() {
   'use strict';
   /*global window, document, setTimeout, RTAV*/
   /*jslint plusplus:true*/

   var VideoCapture = function() {
      this.inited = false;
      this.frameRateController = new FrameRateController();
   };

   VideoCapture.statusEnum = {
      Uninited: 'Uninited',
      Inited: 'Inited',
      Working: 'Working'
   };
   /**
    * Get what status this video src is in, cuurently only Uinited is detected, but keep the API as it
    * for future extension and debugging
    * @return {string} This returns one of the VideoCapture.statusEnum of 'Uninited', 'Inited', 'Working'
    */
   VideoCapture.prototype.getStatus = function() {
      var status;
      if (!this.inited) {
         status = VideoCapture.statusEnum['Uninited'];
      } else {
         if (this.sessionID < 0) {
            status = VideoCapture.statusEnum['Inited'];
         } else {
            status = VideoCapture.statusEnum['Working'];
         }
      }
      return status;
   };

   /**
    * Deconstructure function, should be called when want to change the param, nor
    * we want a brand now capturing session.
    */
   VideoCapture.prototype.clear = function() {
      if (!this.inited) {
         console.error('this video capture is not inited, clear fail');
         return;
      }
      if (this.sessionID >= 0) {
         console.debug('negative: the video capture is not stopped yet, stop it before clear it.');
         this.stop();
      }
      this.video = null;
      this.canvas = null;
      this.ctx = null;
      this.inited = false;
      this.syncTimer = null;
      this.dataCallback = null;
      this.losingDevice = false;
      this.deviceUnpluged = false;
      this.localStream = null;
   };

   /**
    * Init capturing video by binding events to the passed in stream, and later for each frame, call
    * the callback with it.
    * Similar to mVdoInput.Open for native clients, use prefs and timer, but here also pass in stream
    * and callback which is done differently for native clients.
    * and the caller should be similar to VCamServer::InitVideoSrcDev, to reset sync timer if needed.
    * it looks like "open" but the real open didn't happen here, it's acctually init the opened source,
    * we do not open it here to avoid anoying hint diaglog which is forced by some browsers like firefox.
    *
    * @param  {object} videoParam The parameter object that contains width, height and fps
    * @param  {object} syncTimer The timer object user to sync the audio and video
    * @param  {function} callback The frame dealing function for each frame
    */
   VideoCapture.prototype.init = function(videoParam, syncTimer, callback) {
      if (this.inited) {
         console.error('this video capture has already been inited, init fail');
         return;
      }
      if (typeof callback !== 'function') {
         return;
      }

      this.width = videoParam.width;
      this.height = videoParam.height;
      this.fps = videoParam.fps;
      this.frameRateController.setFPS(this.fps);

      this.dataCallback = callback;
      // Adjust size
      this.video = document.getElementById("video");
      this.video.setAttribute('width', this.width);
      this.video.setAttribute('height', this.height);
      // mute the video to fix bug 1587389
      this.video.volume = 0;
      // Adjust size
      this.canvas = document.getElementById("canvas");
      this.canvas.setAttribute('width', this.width);
      this.canvas.setAttribute('height', this.height);
      this.ctx = this.canvas.getContext('2d');
      if (!this.video || !this.canvas || !this.ctx || this.width !== this.canvas.width || this.height !== this.canvas.height) {
         return;
      }
      /**
       * use sessionID without sessionCount can also controll the workflow, but one can
       * not detect the error for calling start or stop with undesired timing, so do not
       * pick that design.
       */
      this.sessionID = -1; //current working sesssion ID
      this.sessionCount = 0; //total working session number ever created

      this.syncTimer = syncTimer;
      this.inited = true;
   };

   /**
    * Start capturing video, and if there is another working session, do nothing.
    * @param  {object} stream The stream object obtained by the getUserMedia
    */
   VideoCapture.prototype.start = function(stream) {
      if (!stream) {
         console.error('the video stream is not valid, start fail');
         return;
      }
      if (!this.inited) {
         console.error('the video capture is not being inited, start fail');
         return;
      }
      if (this.sessionID >= 0) {
         console.error('find existing video capturing session, start fail');
         return;
      }

      this.video.src = window.URL.createObjectURL(stream);
      this.localStream = stream;

      this.sessionID = this.sessionCount;
      this.sessionCount++;
      this.lastValidTime = -1;
      this.freezeCount = 0;
      this.losingDevice = false;
      this.deviceUnpluged = false;
      this.getNextFrame(this.sessionID);
   };

   /**
    * Stop capturing data, and enter waiting status.
    * The coming getNextFrame with old sessionID will not be processed after this call.
    */
   VideoCapture.prototype.stop = function() {
      if (!this.inited) {
         console.error('the video capture is not being inited, stop fail');
         return;
      }
      if (this.sessionID < 0) {
         console.debug('find no video capturing session, skip stop');
         return;
      }
      this.losingDevice = false;
      this.deviceUnpluged = false;
      this.sessionID = -1;
   };

   /**
    * Will fetch a new frame if this.sessionID is the same of this.sessionID to handle
    * the async workflow of stop_V and start_V
    * maxFPS not supported yet, which it's a trival feature(would do later).
    *
    * @private
    * @param {number} sessionID The number use to mark the video srcource session,
    *     which is identical from a start_V to a stop_V to avoid parallel capturing.
    */
   VideoCapture.prototype.getNextFrame = function(sessionID) {
      setTimeout(function() {
         if (!this.inited) {
            return;
         }
         if (this.sessionID < 0 && this.sessionID !== sessionID) {
            return;
         }
         var imgData,
            timeStamp = this.syncTimer.getTime();

         this.updateActiveStatus();
         this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
         imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
         this.frameRateController.onFrameCaptured();
         this.dataCallback({
            data: imgData.data.buffer,
            timeStamp: timeStamp,
            others: {
               callbackParam: sessionID,
               callback: this.getNextFrame.bind(this)
            }
         });
      }.bind(this), this.frameRateController.getWaitTime());
   };

   /**
    * Update the device active status
    */
   VideoCapture.prototype.updateActiveStatus = function() {
      var freezeTolerence = this.fps / 2 + 2;

      if (!!this.video.currentTime) {
         if (this.video.currentTime === this.lastValidTime) {
            this.freezeCount = this.freezeCount + 1;
            if (!this.losingDevice && this.freezeCount > freezeTolerence) {
               this.losingDevice = true;
               console.debug('negative: seems the video device becomes invalid, please check');
            }
         } else {
            this.freezeCount = 0;
            if (this.video.currentTime > 0) {
               this.lastValidTime = this.video.currentTime;
            }
            if (this.losingDevice) {
               this.losingDevice = false;
               console.debug('negative: seems the video device becomes valid again, which means it might unstable');
            }
         }
      }

      if (!!this.localStream && typeof this.localStream.active === 'boolean') {
         if (!this.localStream.active && !this.deviceUnpluged) {
            this.deviceUnpluged = true;
            console.debug('negative: seems the audio device is unpluged');
         }
      }
   };

   /**
    * This returns whether the device can provide valid data
    */
   VideoCapture.prototype.isActive = function() {
      return !this.losingDevice && !this.deviceUnpluged;
   };
   window.VideoCapture = VideoCapture;
}());