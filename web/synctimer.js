/*********************************************************
 * Copyright (C) 2015-2016 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview synctimer.js -- SyncTimer
 * Class to control timer, not support pause yet
 */
(function() {
   'use strict';
   /*global RTAV*/

   var SyncTimer = function() {
      this.inited = false;
      this.startTime = 0;
   };

   /**
    * @return {number} return current system time
    */
   SyncTimer.prototype.getNow = function() {
      return (new Date()).getTime();
   };

   SyncTimer.prototype.isInited = function() {
      return this.inited;
   };
   /**
    * reset the timer to init status
    */
   SyncTimer.prototype.reset = function() {
      this.startTime = this.getNow();
      this.inited = true;
   };

   SyncTimer.prototype.clear = function() {
      this.startTime = 0;
      this.inited = false;
   };
   /**
    * @return {number} This returns the time from the timer-init moment
    */
   SyncTimer.prototype.getTime = function() {
      if (!this.inited) {
         return 0;
      }
      var now = this.getNow();
      return now - this.startTime;
   };

   window.SyncTimer = SyncTimer;
}());