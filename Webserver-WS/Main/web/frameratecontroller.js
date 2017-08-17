/*********************************************************
 * Copyright (C) 2016 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview frameratecontroller.js -- FrameRateController
 * Class to help calculate the wait time in ms with target fps,
 * when fps is 0, always return the suggested wait time as 0 ms.
 */

(function() {
   'use strict';
   /*global console, RTAV*/

   var FrameRateController = function() {
      this.lastCaptureTime = 0;
      this.targetInterval = 0;
      this.fpsLogTime = 60;
      this.fpsInfo = {
         count: -1,
         startTime: 0
      };
   };

   /**
    * set the fps info for calculating the target interval in ms.
    * @param {number} fps The target frame rate.
    */
   FrameRateController.prototype.setFPS = function(fps) {
      // fps lies here
      if (fps < 0) {
         console.error('fps can never be a negative number');
         return;
      }
      if (fps === 0) {
         this.targetInterval = 0; // no rate limitation
      } else {
         this.targetInterval = (1000 / fps);
      }
      this.lastCaptureTime = 0;
      this.fpsInfo = {
         count: -1,
         startTime: 0
      };
   };

   /**
    * Get current time in ms
    * @priavte
    */
   FrameRateController.prototype.getNow = function() {
      return (new Date()).getTime();
   };

   /**
    * Get the suggested wait time to capture the next frame
    * @return {number} This returns the suggested wait time to capture the next frame
    */
   FrameRateController.prototype.getWaitTime = function() {
      var passedTime = this.getNow() - this.lastCaptureTime;
      return Math.max(0, this.targetInterval - passedTime);
   };

   /**
    * Used to calculate the real-time fps, should be called when starting a frame sending
    * Currently It returns nothing and will print a log each %this.fpsLogTime% seconds
    * @param  {number} currentTime The currentTime in ms
    */
   FrameRateController.prototype.updateRealFPS = function(currentTime) {
      var difftime;

      if (this.fpsInfo.count === -1) {
         this.fpsInfo.count = 0;
         this.fpsInfo.startTime = currentTime;
      } else {
         difftime = (currentTime - this.fpsInfo.startTime) / 1000;
         if (this.fpsLogTime > 0 && difftime >= this.fpsLogTime) {
            console.trace("fps = " + (this.fpsInfo.count + 1) / difftime);
            this.fpsInfo.count = 0;
            this.fpsInfo.startTime = currentTime;
         } else {
            this.fpsInfo.count++;
         }
      }
   };

   /**
    * The function to update the knowledge of when the last frame is captured
    */
   FrameRateController.prototype.onFrameCaptured = function() {
      this.lastCaptureTime = this.getNow();
      this.updateRealFPS(this.lastCaptureTime);
   };

   window.FrameRateController = FrameRateController;
}());