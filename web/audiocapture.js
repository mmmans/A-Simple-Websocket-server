/*********************************************************
 * Copyright (C) 2015-2016 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview audiocapture.js -- AudioCapture
 * Class to handle audio capturing
 *
 * Support but not recommand to change the default sample rate.
 */

(function() {
   'use strict';
   /*global console, window, Uint16Array, RTAV*/
   /*jslint plusplus:true */

   var AudioCapture = function() {
      this.clipBuffer = new this.ClipBuffer(AudioCapture.clipTarget, AudioCapture.clipBufferLen);
      this.previousSampleRate = null;
      this.inited = false;
   };

   // It's one of the API required length, so need to clip before compress+translate
   AudioCapture.bufferLen = 512;
   // Required length at service side
   AudioCapture.clipTarget = 160;
   // A length enough for buffering the data
   AudioCapture.clipBufferLen = 1024;
   // browser API sample rate
   AudioCapture.machineSampleRate = 44100;

   AudioCapture.statusEnum = {
      Uninited: 'Uninited',
      Inited: 'Inited',
      Working: 'Working'
   };

   /**
    * Get what status this audio src is in, cuurently only Uinited is detected, but keep the API as it
    * for future extension and debugging
    * @return {string} This returns one of the AudioCapture.statusEnum of 'Uninited', 'Inited', 'Working'
    */
   AudioCapture.prototype.getStatus = function() {
      var status;
      if (!this.inited) {
         status = AudioCapture.statusEnum['Uninited'];
      } else {
         if (this.paused) {
            status = AudioCapture.statusEnum['Inited'];
         } else {
            status = AudioCapture.statusEnum['Working'];
         }
      }
      return status;
   };

   /**
    * Init capturing audio by binding events to the passed in stream, and for each data segment, call
    * the callback with it.
    * Similar to mAudInput.Open for native clients, use prefs and timer, but here also pass in stream
    * and callback which is done differently for native clients.
    * and the caller should be similar to VCamServer::InitAudioInDev, to reset sync timer if needed.
    * It looks like "open" but the real open didn't happen here, it's acctually init the opened source,
    * we do not open it here to avoid anoying hint diaglog which is forced by some browsers like firefox.
    *
    * @param  {object} syncTimer The timer object user to sync audio and video
    * @param  {function} callback The function for dealing with each frame
    */
   AudioCapture.prototype.init = function(audioParam, syncTimer, callback) {
      var sampleRate = audioParam.sampleRate;

      if (this.inited) {
         console.error('this audio capture has already been inited, init fail');
         return;
      }
      if (typeof callback !== 'function') {
         return;
      }

      if (!sampleRate || sampleRate <= 0) {
         sampleRate = 8000;
      }
      if (sampleRate >= AudioCapture.machineSampleRate) {
         console.error('do not support sample rate greater than 44100');
      }

      if (this.previousSampleRate !== sampleRate) {
         if (this.hasOwnProperty('resampler') && !!this.resampler) {
            delete this.resampler;
         }
         this.resampler = new this.Resampler(AudioCapture.machineSampleRate, sampleRate, AudioCapture.bufferLen);
      }

      this.callback = callback;
      this.paused = true;
      this.syncTimer = syncTimer;

      this.inited = true;
   };

   /**
    * Clear the status and release audio capture related resources which make this srouce to start a new srouce for
    * another stream session(start_A and stop_A).
    * But be aware of that, the stream object which will hold the devices will not be release in this level, but in
    * the mediacapture.clear(). and that should only happen when the wmks session don't want RTAV anymore, like when
    * the wmks session is closed.
    */
   AudioCapture.prototype.clear = function() {
      if (!this.inited) {
         console.error('this audio capture is not inited, clear fail');
         return;
      }
      if (!this.paused) {
         console.trace('negative: the audio capture is not stopped yet, stop it before clear it.');
         this.stop();
      }
      this.scriptNode = null;
      this.mediaCtx = null;
      this.mediaStreamSource = null;
      // Edge seems not support close method which is defined in html5 standard for now, so we need the check
      if (!!this.audioContext && typeof this.audioContext.close === 'function') {
         this.audioContext.close();
      }
      this.audioContext = null;
      this.clipBuffer.reset();
      this.resampler.reset();
      this.inited = false;
      this.paused = true;
      this.losingDevice = false;
      this.deviceUnpluged = false;
      this.localStream = null;
   };

   /**
    * Start capturing data with inited param
    * @param  {object} stream The stream object obtained by the getUserMedia
    */
   AudioCapture.prototype.start = function(stream) {
      var numChannelsIn = 1,
         numChannelsOut = 1;

      if (!stream) {
         console.error('the audio stream is not valid, start fail');
         return;
      }
      if (!this.inited) {
         console.error('the audio capture is not being inited, start fail');
         return;
      }
      if (!this.paused) {
         console.error('find existing audio capturing session, start fail');
         return;
      }

      this.lastValidTime = -1;
      this.freezeCount = 0;
      this.losingDevice = false;
      this.deviceUnpluged = false;
      this.audioContext = new window.AudioContext();
      this.localStream = stream;
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.mediaCtx = this.mediaStreamSource.context;
      this.scriptNode = this.mediaCtx.createScriptProcessor(AudioCapture.bufferLen, numChannelsIn, numChannelsOut);
      this.scriptNode.onaudioprocess = function(event) {
         var clip,
            capturedData,
            resampledBuff;
         if (this.paused) {
            return;
         }

         this.updateActiveStatus();
         // Buffer has length specified in _useStream
         capturedData = event.inputBuffer.getChannelData(0);
         resampledBuff = this.resampler.process(capturedData);
         // Add the samples immediately to the Clip, with correct format(float32 to uint16)
         this.clipBuffer.add(resampledBuff, this.syncTimer.getTime());
         clip = this.clipBuffer.getClip();
         if (!!clip) {
            // The callback should compress the clip, and send the compressed data in package on VVC.
            this.callback(clip);
         }
      }.bind(this);

      this.mediaStreamSource.connect(this.scriptNode);
      this.scriptNode.connect(this.mediaCtx.destination);
      this.paused = false;
   };

   /**
    * Stop capturing data, and enter waiting status.
    */
   AudioCapture.prototype.stop = function() {
      if (!this.inited) {
         console.error('the audio capture is not being inited, stop fail');
         return;
      }
      if (this.paused) {
         console.error('find no audio capturing session, stop fail');
         return;
      }
      this.mediaStreamSource.disconnect(this.scriptNode);
      this.scriptNode.disconnect(this.mediaCtx.destination);
      //since its in the single thread, set the puase flag here is early enough
      this.paused = true;
      this.losingDevice = false;
      this.deviceUnpluged = false;
   };

   /**
    * Update the device active status
    */
   AudioCapture.prototype.updateActiveStatus = function() {
      var freezeTolerence = AudioCapture.machineSampleRate / AudioCapture.bufferLen;

      if (!!this.localStream.currentTime) {
         if (this.localStream.currentTime === this.lastValidTime) {
            this.freezeCount = this.freezeCount + 1;
            if (!this.losingDevice && this.freezeCount > freezeTolerence) {
               this.losingDevice = true;
               console.trace('negative: seems the audio device becomes invalid, please check');
            }
         } else {
            if (this.localStream.currentTime > 0) {
               this.lastValidTime = this.localStream.currentTime;
            }
            this.freezeCount = 0;
            if (this.losingDevice) {
               this.losingDevice = false;
               console.trace('negative: seems the audio device becomes valid again, which means it might unstable');
            }
         }
      }

      if (!!this.localStream && typeof this.localStream.active === 'boolean') {
         if (!this.localStream.active && !this.deviceUnpluged) {
            this.deviceUnpluged = true;
            console.trace('negative: seems the audio device is unpluged');
         }
      }
   };

   /**
    * This returns whether the device can provide valid data
    */
   AudioCapture.prototype.isActive = function() {
      return !this.losingDevice && !this.deviceUnpluged;
   };

   /**
    * FIFO clipper buffer
    * @param {number} segmentLength [description]
    * @param {number} buffsize      [description]
    */
   AudioCapture.prototype.ClipBuffer = function(segmentLength, buffsize) {
      /**
       * Init the instance
       */
      this.init = function() {
         this.segmentLength = segmentLength;
         this.buffsize = buffsize;
         this.buff = new Uint16Array(this.buffsize);
         this.reset();
      };

      this.reset = function() {
         this.startIndex = 0;
         this.tailIndex = 0;
         this.length = 0;
         this.lastTimeStamp = {
            value: 0,
            index: 0
         };
         this.newTimeStamp = {
            value: 0,
            index: 0
         };
      };

      /**
       * A simple float to short(int16) converting function
       * @param  {number} floatNum A number in the range [-1,1]
       * @return {number} This returns a short number in the range [-32767, 32767]
       */
      this.convertToShort = function(floatNum) {
         var maxShortValue = 32767;
         return Math.round(maxShortValue * floatNum);
      };

      /**
       * Add data to the ClipBuffer with floating number converted to short
       * @param {Array} data
       * @param {number} timeStamp
       */
      this.add = function(data, timeStamp) {
         var i, k;
         if (data.length > this.buffsize - this.length) {
            return;
         }

         this.lastTimeStamp.value = this.newTimeStamp.value;
         this.lastTimeStamp.index = this.newTimeStamp.index;
         for (i = 0, k = this.tailIndex; i < data.length; i++, k = (k + 1) % this.buffsize) {
            this.buff[k] = this.convertToShort(data[i]);
         }
         this.length += data.length;
         this.tailIndex = (this.tailIndex + data.length) % this.buffsize;
         this.newTimeStamp.value = timeStamp;
         this.newTimeStamp.index = this.tailIndex;
      };

      /**
       * get the extended index to easy the calculation of accurate timestamp
       * @param  {number} srcIndex The original index, which might get extended if too small
       * @param  {number} minIndex The lower bound of the index
       * @return {number} This returns the extended index which is larger or equal to minIndex
       */
      this.getExtendedIndex = function(srcIndex, minIndex) {
         if (srcIndex < minIndex) {
            return srcIndex + this.buffsize;
         } else {
            return srcIndex;
         }
      };

      /**
       * Get a object with ArrayBuffer as data and number as timeStamp if possible
       * @return {object|null}
       */
      this.getClip = function() {
         var i,
            k,
            resultLength,
            result,
            sampleExtenedIndex,
            newExtenedIndex,
            lastIndex,
            addup,
            timeStamp;

         if (this.length < this.segmentLength) {
            return null;
         }

         // shift out the data
         resultLength = this.length - this.length % this.segmentLength;
         result = new Uint16Array(resultLength);
         for (i = 0, k = this.startIndex; i < resultLength; i++, k = (k + 1) % this.buffsize) {
            result[i] = this.buff[k];
         }
         this.length -= result.length;
         this.startIndex = (this.startIndex + result.length) % this.buffsize;

         // calculate the corresponding timeStamp with linear assumsion, which should be acurate enough for the currect use case
         lastIndex = this.lastTimeStamp.index;
         sampleExtenedIndex = this.getExtendedIndex(this.startIndex, lastIndex);
         newExtenedIndex = this.getExtendedIndex(this.newTimeStamp.index, lastIndex);
         // approximate increamental time from the 2nd last newTimeStamp, and that is using linear assumsion with 2nd last and last newTimeStamp to get.
         addup = (this.newTimeStamp.value - this.lastTimeStamp.value) / (newExtenedIndex - lastIndex) * (sampleExtenedIndex - lastIndex);
         // add the increamental time to 2nd last newTimeStamp, and get the result timeStamp
         timeStamp = Math.round(this.lastTimeStamp.value + addup);
         return {
            data: result.buffer,
            timeStamp: timeStamp
         };
      };
      this.init();
   };

   /**
    * Resampler for converting data in high sample rate to lower.
    * @param {number} originalRate The input sample rate
    * @param {number} targetRate   The target sample rate
    * @param {number} inputSize    The input data length
    */
   AudioCapture.prototype.Resampler = function(originalRate, targetRate, inputSize) {
      /**
       * Init the instance
       */
      this.init = function() {
         if (originalRate < targetRate) {
            console.error('resample can only have less samples');
            return;
         }
         this.sampleIndexInc = originalRate / targetRate;
         // Math.ceil(this.sampleIndexInc) * 2 is large enough extra space for the non-processed and being processed data
         this.buffSize = inputSize + Math.ceil(this.sampleIndexInc) * 2;
         this.buff = new Array(this.buffSize);
         this.inputSize = inputSize;
         this.reset();
      };

      this.reset = function() {
         this.startIndex = 0;
         this.tailIndex = 0;
         this.sampleStartIndex = 0;
      };

      /**
       * Insert data in the inner buffer
       * @private
       */
      this.push = function(data) {
         var i, k;
         if (data.length > this.buffSize - this.length) {
            return false;
         }
         for (i = 0, k = this.tailIndex; i < data.length; i++, k = (k + 1) % this.buffSize) {
            this.buff[k] = data[i];
         }
         this.tailIndex = (this.tailIndex + data.length) % this.buffSize;
         return true;
      };

      /**
       * @return {float} return the resampled value
       */
      this.getResampledData = function(startIndex, endIndex) {
         var i,
            is, ie,
            ws, we,
            sum;

         // Start index of included data segment(included)
         is = Math.ceil(startIndex);
         // End index of included data segment(not included)
         ie = Math.floor(endIndex);
         // The persentage of sample that should be count in before the included data segment
         ws = (is - startIndex);
         // The persentage of sample that should be count in after the included data segment
         we = (endIndex - ie);
         // Count in the data before the included data segment
         sum = ws * this.buff[Math.floor(startIndex)];
         // Count in the data after the included data segment
         if (we > 0) {
            sum += we * this.buff[ie];
         }
         // Count in the included data segment
         if (ie < is) {
            ie += this.buffSize;
            for (i = is; i < ie; i++) {
               sum += this.buff[i % this.buffSize];
            }
         } else {
            for (i = is; i < ie; i++) {
               sum += this.buff[i];
            }
         }
         return sum / this.sampleIndexInc;
      };

      /**
       * @param  {number} index
       * @return {boolean} This returns whether the index is in the valid range
       */
      this.isInRange = function(index) {
         if (this.startIndex < this.tailIndex) {
            return (index <= this.tailIndex) && (index >= this.startIndex);
         }
         return (index >= this.startIndex) || (index <= this.tailIndex);
      };

      /**
       * Using reverting check to tell when both input index are valid, whether the range in between
       * is also valid
       * @param  {number}  sampleIndexStart The valid start index of the range
       * @param  {number}  sampleIndexEnd The valid end index of the range
       * @return {Boolean} This returns whether the range in between valid index contains invalid data
       */
      this.isInCorrectOrder = function(sampleIndexStart, sampleIndexEnd) {
         if (this.startIndex < this.tailIndex) {
            // with normal order of valid data, sample should also be normal order
            return sampleIndexStart < sampleIndexEnd;
         }
         // with revert order of valid data, sample can't across the bind
         return sampleIndexStart > this.tailIndex || sampleIndexEnd < this.startIndex;
      };

      /**
       * Using isInCorrectOrder and isInRange to check whether the sub-range are valid or not.
       * @return {boolean} This returns whether we can access the elements in the range.
       */
      this.validSubRange = function(sampleIndexStart, sampleIndexEnd) {
         return this.isInRange(sampleIndexStart) && this.isInRange(sampleIndexEnd) &&
            this.isInCorrectOrder(sampleIndexStart, sampleIndexEnd);
      };

      this.deleteUsed = function() {
         this.startIndex = Math.floor(this.sampleStartIndex);
      };

      /**
       * @return {Array} return the resampled array
       */
      this.getResampledArray = function() {
         var sampleIndexStart = this.sampleStartIndex,
            sampleIndexEnd = (sampleIndexStart + this.sampleIndexInc) % this.buffSize,
            i = 0,
            result = [];

         // while needed data are in the buff.
         while (this.validSubRange(sampleIndexStart, sampleIndexEnd)) {
            // get each resampled data
            result[i] = this.getResampledData(sampleIndexStart, sampleIndexEnd);
            // shift indexes accordingly after get the resampled data
            i++;
            sampleIndexStart = sampleIndexEnd;
            sampleIndexEnd = (sampleIndexStart + this.sampleIndexInc) % this.buffSize;
         }
         this.sampleStartIndex = sampleIndexStart;
         this.deleteUsed();
         return result;
      };

      /**
       * Input data and would return the resampled array
       * @param  {Array} data The array of length inputSize and with sample rate originalRate
       * @return {Array|null} This returns the array of data with sample rate targetRate
       */
      this.process = function(data) {
         var resampled;

         if (data.length !== this.inputSize) {
            return null;
         }
         if (!this.push(data)) {
            return null;
         }
         resampled = this.getResampledArray();
         if (!resampled) {
            return null;
         }
         return resampled;
      };

      this.init();
   };
   
   window.AudioCapture = AudioCapture;
}());