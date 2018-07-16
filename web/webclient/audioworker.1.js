/*********************************************************
 * Copyright (C) 2016 VMware, Inc. All rights reserved.
 *********************************************************/

var LibSpeex;
if (typeof LibSpeex !== 'object') {
   LibSpeex = {};
}
LibSpeex.isLoaded = false;
LibSpeex["onRuntimeInitialized"] = function() {
   RTAV.logService.trace('js layer of libspeex loaded');
   LibSpeex.isLoaded = true;
};

/******************************************************************************
 * Copyright 2014-2017 VMware, Inc.  All rights reserved.
 *****************************************************************************/

/**
 * appblast-log.js
 *
 *    Implement logging in a way that takes advantage of modern
 *    browser debugging features but gracefully degrades on older
 *    browsers.
 *
 */


var log = (function() {
   var nullFunc = function() {
      },
      ret = {},
      levels = ["trace", "debug", "info", "warn", "error"];


   ret.LEVEL_TRACE = 0;
   ret.LEVEL_DEBUG = 1;
   ret.LEVEL_INFO = 2;
   ret.LEVEL_WARN = 3;
   ret.LEVEL_ERROR = 4;


   /**
    * getMethod
    *
    *    Bind to the named console method, or provide a fallback
    *    implementation. If console or console.log are not defined, we
    *    return dummy implementation which does nothing.
    *
    *    If the named method exists on the console, then we return a
    *    binding of that method. If it does not exist, we return
    *    console.log with the log level curried in.
    *
    *    If Function.prototype.bind does not exist, we raise an error.
    */

   function getMethod(name) {
      if (nullFunc.bind === undefined) {
         throw new Error("log requires Function.prototype.bind");
      }

      if ((console === undefined) || (console.log === undefined)) {
         return nullFunc;
      } else if (console[name] !== undefined) {
         return console[name].bind(console);
      } else {
         return console.log.bind(console, name);
      }
   }

   /**
    * setLevel
    *
    *    sets the current log level.
    */

   ret.setLevel = function(level) {
      var i;

      if ((typeof level !== "number") ||
         (level < 0) ||
         level > (levels.length - 1)) {
         throw new Error("Invalid log level: " + level);
      }

      for (i = 0; i < level; i++) {
         ret[levels[i]] = nullFunc;
      }

      for (i = level; i < levels.length; i++) {
         // log level trace is implemented as debug.
         // see: log.stackTrace() below.
         if (levels[i] === "trace") {
            ret.trace = getMethod("debug");
         } else {
            ret[levels[i]] = getMethod(levels[i]);
         }
      }

      ret.logLevel = level;
   };

   /**
    * log
    *
    *    binding of console.log or a dummy implementation.
    */

   ret.log = getMethod("log");

   /**
    * log
    *
    *    In modern browsers, console.trace() is not trace level
    *    logging, but actually a means to produce a stacktrace on the
    *    console. Our code defines LEVEL_TRACE as the loweset level of
    *    logging, so we expose console.trace here as log.stackTrace().
    */

   ret.stackTrace = getMethod("trace");


   /**
    * setLevel
    *
    *    Change the current log level. Log level must be an integer
    *    from LEVEL_TRACE to LEVEL_ERROR. Changing the log level to
    *    suppress a logging prevents the browser's console methods
    *    from ever being called, so they will never apear in the
    *    console regardless of the console filter settings used.
    */

   ret.setLevel(ret.LEVEL_DEBUG);

   return ret;
}());

/**
 *  NOTE: this is the workaround for RTAV workers.
 *  We don't use webpack for these workers as there are many complex function
 *  in them. As a result, we have to use this ugly way to expose 'log' to other
 *  webpack module, but not for worker context.
 */
if (typeof module !== "undefined" && module.exports) {
   module.exports = log;
}

/*********************************************************
 * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview logservice.js -- logService
 * service to handle logs, depend on log which is defined in
 * appblast-log.js
 */

/**
 *  NOTE: this is the workaround for RTAV workers.
 *  We don't use webpack for these workers as there are many complex function
 *  in them. As a result, we have to use this ugly way to expose 'log' to other
 *  webpack module, but not for worker context.
 */
var log;
if (typeof require === 'function') {
   log = require('../common/appblast-log');
}


var RTAV = {};

var logService = (function() {
   var ret = {},
      coreServer = log,
      functionMap = {
         "trace": "trace",
         "debug": "debug",
         "log": "info",
         "warn": "warn",
         "devError": "error",
         "error": "error"
      };

   /**
    * Helper function used to create a string with a desired length by padding
    * it with preceding zeroes, if necessary.
    *   pad(1, 5) will return "00001".
    *   pad("100", 1) will return "100".
    *   pad(-1, 5) will return "-00001".
    *   pad("-10", 4) will return "-0010".
    *
    * @param  {number} value  The number need to be padded
    * @param  {number} maxLen The padding max length
    * @return {number}        This returns the number which is padded to the
    *     appropriate length.
    */
   function pad(value, maxLen) {
      var string = value.toString(),
         negative = (string.indexOf("-") === 0),
         length = negative ? string.length - 1 : string.length;
      return length < maxLen ?
         pad(negative ? "-0" + string.slice(1) : "0" + string, maxLen) : string;
   }

   /**
    * Get current time as string
    * @return {string} This returns the current time
    */
   function getDataString() {
      var logTime = new Date();

      return "[" + logTime.getFullYear() + "-" +
         pad(logTime.getMonth() + 1, 2) + "-" + pad(logTime.getDate(), 2) +
         "T" +
         pad(logTime.getHours(), 2) + ":" + pad(logTime.getMinutes(), 2) + ":" +
         pad(logTime.getSeconds(), 2) + "." +
         pad(logTime.getMilliseconds(), 3) +
         "]: ";
   }

   /**
    * Determind whether a object need to be stringified
    * @param  {any} arg The param we need to print out in the log
    * @return {boolean} This returns whether the arg will looks better in the
    *    stringified format
    */
   function needStringify(arg) {
      var needList = ['Event', 'Object'],
         argType = Object.prototype.toString.call(arg),
         i;

      for (i = 0; i < needList.length; i++) {
         if (argType === '[object ' + needList[i] + ']') {
            return true;
         }
      }
      return false;
   }

   /**
    * Return the log function which will print log with current time with
    * logName
    * @param  {string} logName The name of log function in the logService
    * @return {function} This returns the log function corresponding to logName
    */
   function getLogFunction(logName) {
      return function(arg) {
         var logFunction = coreServer[functionMap[logName]].bind(coreServer),
            logtext;
         // stringfy only for real Object, array or other data has better look
         // in the non-json format
         if (needStringify(arg)) {
            logtext = getDataString() + JSON.stringify(arg);
         } else {
            logtext = getDataString() + arg;
         }
         logFunction(logtext);
      };
   }

   /**
    * Define log functions with key in functionMap
    */
   function defineFunctions() {
      var key;
      for (key in functionMap) {
         if (functionMap.hasOwnProperty(key)) {
            ret[key] = getLogFunction(key);
         }
      }
   }

   /**
    * Sets the current log level for coreServer.
    * @param {number} level A interger from [0,4]
    */
   ret.setLevel = function(level) {
      if (!coreServer) {
         console.error(
            "the coreServer is not defined in the RTAV.logService when set log level");
      }
      coreServer.setLevel(level);
      this.debug("the rtav log service is ready, while level is as " + level);
   };

   /**
    * Gets the current log level for coreServer.
    * @return {number} This returns a interger from [0,4]
    */
   ret.getLevel = function() {
      if (!coreServer) {
         console.error(
            "the coreServer is not defined in the RTAV.logService when get log level");
         return 2;
      }
      return coreServer.logLevel;
   };

   defineFunctions();

   return ret;
}());

RTAV.logService = logService;

/**
 *  NOTE: this is the workaround for RTAV workers.
 */
if (typeof module !== "undefined" && module.exports) {
   module.exports = RTAV;
}
/*********************************************************
 * Copyright (C) 2015-2016 VMware, Inc. All rights reserved.
 *********************************************************/

/**
 * @fileoverview workerutil.js -- workerUtil
 * Service to wrap util functions for worker
 */

var workerUtil = {
   /**
    * Execute the callback after the lib is loaded, using promise might be better, but this is
    *     good enough for now
    * @param {object} lib The lib need to be loaded first
    * @param {string} libName The name of lib, only for print logs
    * @param {function} callback The callback should be called after lib is ready
    * @param {number} checkPeriod Each %checkPeriod% ms, the status of the lib will be checked
    */
   processWhenLibReady: function(lib, libName, callback, checkPeriod) {
      if (typeof callback !== 'function' || lib === undefined || libName === undefined || typeof checkPeriod !== 'number') {
         RTAV.logService.devError('the processWhenLibReady is referred with invalid params');
         return;
      }
      if (lib.isLoaded === false) {
         RTAV.logService.trace(libName + ' is still loading, wait ' + checkPeriod + 'ms');
         setTimeout(function() {
            this.processWhenLibReady(lib, libName, callback, checkPeriod);
         }.bind(this), checkPeriod);
      } else {
         callback();
      }
   }
};
/*********************************************************
 * Copyright (C) 2016 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview libexceptionhandler.js -- LibExceptionHandler
 * Class to handle the C exceptions
 */

/*global console*/
/*jslint plusplus:true, sub: true*/

var LibExceptionHandler = function(libInstance, logFunction) {
   'use strict';
   if (!libInstance || typeof libInstance.allocate !== 'function' || libInstance.ALLOC_NORMAL === undefined ||
      typeof libInstance.getValue !== 'function' || typeof logFunction !== 'function') {
      RTAV.logService.error("LibException init fail");
      this.inited = false;
      return;
   }
   this.inited = true;
   this.logFunction = logFunction;
   this.lib = libInstance;
   this.buffer = libInstance.allocate(LibExceptionHandler.bufferSize, 'i8', libInstance.ALLOC_NORMAL);
};

LibExceptionHandler.bufferSize = 1024;
LibExceptionHandler.offsetMap = {
   hasException: 0,
   exceptionType: 4,
   content: 8
};
LibExceptionHandler.contentSize = LibExceptionHandler.bufferSize - LibExceptionHandler.offsetMap['content'];
// one can add more type here if needed.
LibExceptionHandler.exceptionTypeMap = {
   notDefined: 0,
   text: 1
};

/**
 * wrap up the offset related logics
 * @private
 */
LibExceptionHandler.prototype.getPtr = function(key) {
   'use strict';
   if (!LibExceptionHandler.offsetMap.hasOwnProperty(key)) {
      RTAV.logService.error('invalid ptr key in the LibExceptionHandler');
      return null;
   }
   return this.buffer + LibExceptionHandler.offsetMap[key];
};
/**
 * @private
 * clear exception header to avoid reading it twice.
 */
LibExceptionHandler.prototype.clearException = function() {
   'use strict';
   this.lib.setValue(this.getPtr('hasException'), 0, 'i32');
   this.lib.setValue(this.getPtr('exceptionType'), LibExceptionHandler.exceptionTypeMap['notDefined'], 'i32');
};

/**
 * @private
 * @return {object} This Returns the object parsed from the buffer
 */
LibExceptionHandler.prototype.getParsedObj = function() {
   'use strict';
   var hasException = this.lib.getValue(this.getPtr('hasException'), 'i32'),
      exceptionType = this.lib.getValue(this.getPtr('exceptionType'), 'i32'),
      exceptionContent = 'unknown type of exception';

   if (LibExceptionHandler.exceptionTypeMap['text'] === exceptionType) {
      exceptionContent = this.getText(this.getPtr('content'));
   }

   return {
      existing: hasException,
      content: exceptionContent
   };
};

/**
 * @private
 * @return {string} This returns the excetion description text
 */
LibExceptionHandler.prototype.getText = function(textPtr) {
   'use strict';
   var i = 0,
      charCode,
      text = '',
      EOF = 0;

   while (i <= LibExceptionHandler.contentSize) {
      charCode = this.lib.getValue(textPtr + i, 'i8');
      if (charCode === EOF) {
         return text;
      }

      text += String.fromCharCode(charCode);
      i++;
   }
   return "corrupted exception text found: " + text;
};


/**
 * API function, handle the exception handling function, currently, only print out
 * the exception for dev to debug, one can also add logic in to fix the lib status.
 */
LibExceptionHandler.prototype.handleException = function() {
   'use strict';
   var exception;

   if (!this.inited) {
      return;
   }

   exception = this.getParsedObj();
   if (exception.existing) {
      this.logFunction("error happen in the libs," + exception.content);
      this.clearException();
   }
};

/**
 * API function, return the exception buffer to pass to C codes
 */
LibExceptionHandler.prototype.getBuffer = function() {
   'use strict';

   if (!this.inited) {
      return;
   }

   return this.buffer;
};
/*********************************************************
 * Copyright (C) 2015-2016 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview speexwrapper.js -- SpeexWrapper
 * Class to wrap the libspeex
 * TODO: delete alloced momery.
 */

/*global LibSpeex, Int16Array ,console, Uint8Array, LibExceptionHandler, ArrayBuffer*/
/*jslint plusplus:true, sub: true, nomen: true*/
var libspeex = LibSpeex;

function SpeexWrapper() {
   'use strict';
   this.isInited = false;
   this.alloced = false;
   this.heap = libspeex.HEAP8.buffer;
}

// defined as the same for all clients
SpeexWrapper.prototype.SPX_MAX_PACKEAGE_BYTES = 2000;
SpeexWrapper.prototype.MAX_FRAME = 10;
SpeexWrapper.prototype.HEADER_SIZE = 16;

/**
 * return whether there is a inited encoder with param as request
 * @param  {object} audParams The object contains params sampleRate, channels, and bitsPerSample
 * @return {boolean} This returns whether the encoder is as requested
 */
SpeexWrapper.prototype.isInitedWith = function(audParams) {
   'use strict';
   return this.isInited && !!this.initSettings && (this.initSettings.sampleRate === audParams.sampleRate &&
      this.initSettings.channels === audParams.channels && this.initSettings.bitsPerSample === audParams.bitsPerSample);
};

/**
 * Init the encoder with param
 * @param  {object} audParams The object contains init params sampleRate, channels, and bitsPerSample
 * @return {boolean} This returns whether the init success
 */
SpeexWrapper.prototype.init = function(audParams) {
   'use strict';
   var sampleRate = audParams.sampleRate,
      channels = audParams.channels,
      bitsPerSample = audParams.bitsPerSample,
      frameSize;

   if (bitsPerSample !== 16 || channels !== 1) {
      return false;
   }

   if (this.isInited) {
      return false;
   }

   this.totalEncSampSz = 0;
   this.encFrameId = 0;

   if (!this.exceptionHandler) {
      // will use the exception handler function to replace the function(text){RTAV.logService.error(text);}
      this.exceptionHandler = new LibExceptionHandler(libspeex, function(text) {
         RTAV.logService.error(text);
      });
   }
   this.isInited = !!libspeex._initEncoder(sampleRate, channels, bitsPerSample, this.exceptionHandler.getBuffer(),
      LibExceptionHandler.bufferSize);
   this.exceptionHandler.handleException();

   if (!this.isInited) {
      RTAV.logService.devError('init failed');
      return false;
   }

   frameSize = libspeex._getFrameSize();
   if (frameSize <= 0) {
      this.isInited = false;
      RTAV.logService.devError('bad frame size, init failed');
      return false;
   }

   this.initSettings = {
      sampleRate: sampleRate, //uint32
      channels: channels, //uint32
      bitsPerSample: bitsPerSample //uint32
   };

   if (!this.alloced) {
      RTAV.logService.trace('alloc spaces for the working variable');
      this.inputBufferSize = frameSize * this.MAX_FRAME;
      this.inputBuffer = libspeex.allocate(this.inputBufferSize, 'i16', libspeex.ALLOC_NORMAL);
      this.outputBufferSize = this.SPX_MAX_PACKEAGE_BYTES * this.MAX_FRAME;
      this.outputBuffer = libspeex.allocate(this.outputBufferSize, 'i8', libspeex.ALLOC_NORMAL);
      this.alloced = true;
   }

   this.convertedResult = null;
   return this.isInited;
};

/**
 * Copy data into the encoder
 * Set data into the encoder with with int16 as data format
 * @param  {Int16Array} pcmData The data-contained Array
 */
SpeexWrapper.prototype.setInput = function(pcmData) {
   'use strict';
   var i, j,
      inputArray;

   if (pcmData.length > this.inputBufferSize) {
      return 0;
   }

   inputArray = new Uint16Array(this.heap, this.inputBuffer, pcmData.length);
   inputArray.set(pcmData);

   return pcmData.length*2;
};

/**
 * encode the input shorts using the 3rd part lib speex and return the result buffer
 * @param  {Int16Array} pcmData The input PCM data that will be compressed.
 * @return {object} This returns the compressed data in the a object with the length and data in
 *     the packed ogg form(little endian, can be just translated on the network)
 */
SpeexWrapper.prototype.encode = function(pcmShorts) {
   'use strict';
   var inputLength,
      resultLength;

   if (!this.isInited) {
      return null;
   }

   inputLength = this.setInput(pcmShorts);
   if (inputLength <= 0) {
      return null;
   }
   // Encode using data in the this.inputBuffer and store output in the this.outputBuffer
   resultLength = libspeex._encode(this.inputBuffer, inputLength, this.outputBuffer, this.outputBufferSize);
   this.exceptionHandler.handleException();
   if (resultLength <= 0) {
      return null;
   }
   // Return result in the this.outputBuffer
   return this.getOutputObj(resultLength);
};

/**
 * Get the result object by copying data in the momory of this.outputBuffer to a new object and return.
 * @param  {number} length The target result length
 * @return {object} This returns the result in the form of object of {buffer:Uint8Array, length:number}
 */
SpeexWrapper.prototype.getOutputObj = function(length) {
   'use strict';

   var result,
      data,
      resultArray;

   result = new ArrayBuffer(length + this.HEADER_SIZE);
   data = new Uint8Array(result, this.HEADER_SIZE, length);
   resultArray = new Uint8Array(this.heap, this.outputBuffer, length);
   data.set(resultArray);

   return {
      buffer: result,
      length: length
   };
};

/**
 * One should release the resources when not needed
 * @return {bool} This returns whether the clear success instead of whether the encode inited
 */
SpeexWrapper.prototype.cleanUp = function() {
   'use strict';

   if (!this.isInited) {
      RTAV.logService.error('this audio encoder isn\'t get inited yet, cleanUp fail');
      return false;
   }

   this.isInited = !libspeex._destory();
   return !this.isInited;
};

/**
 * Get header out of encoder
 * @return {object} This returns the encoder header in the form of object of {buffer:Uint8Array, length:number}
 */
SpeexWrapper.prototype.getHeaderData = function() {
   'use strict';
   var length;

   if (!this.isInited) {
      return null;
   }
   length = libspeex._getHeader(this.outputBuffer, this.outputBufferSize);
   this.exceptionHandler.handleException();
   if (length <= 0) {
      return null;
   }
   return this.getOutputObj(length);
};
/*********************************************************
 * Copyright (C) 2015 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview typedarraysupport.js -- Uint8Array.from, Int16Array.from
 * In some browsers there are some browser APIs missing(like chrome < 45),
 * so we use this file to define a simple version of these functions which
 * are enough for us to use.
 */

'use strict';

/*global Int16Array, Uint8Array, Array*/

(function() {
   var appendFunction = function(ArrayClass, data) {
      var i,
         typedArray;
      if (!data || !data.length) {
         return null;
      }
      typedArray = new ArrayClass(data.length);
      for (i = 0; i < data.length; i++) {
         typedArray[i] = data[i];
      }
      return typedArray;
   };

   if (!Uint8Array.from) {
      Uint8Array.from = function(data) {
         return appendFunction(Uint8Array, data);
      };
   }
   if (!Int16Array.from) {
      Int16Array.from = function(data) {
         return appendFunction(Int16Array, data);
      };
   }
   if (!Array.from) {
      Array.from = function(data) {
         return appendFunction(Array, data);
      };
   }
}());
/*********************************************************
 * Copyright (C) 2015-2016 VMware, Inc. All rights reserved.
 *********************************************************/
/**
 * @fileoverview audioworker.js -- audioWorker
 * Service to wrap audio encoding
 */

/*global SpeexWrapper, onmessage, postMessage, Uint8Array, Int16Array, LibSpeex*/

/**
 * Simple wrapper class as the encoding interface
 */
var audioWorker = (function() {
   'use strict';
   var audioEnc = null;

   return {
      init: function(param) {
         audioEnc = new SpeexWrapper();
         audioEnc.init(param);
         RTAV.logService.setLevel(param.logLevel);
         return audioEnc.getHeaderData();
      },
      encode: function(data) {
         if (!audioEnc) {
            return null;
         }
         return audioEnc.encode(data);
      },
      clear: function() {
         if (!audioEnc) {
            return false;
         }
         return audioEnc.cleanUp();
      },
      utTestingAPIs: {
         releaseEnc: function() {
            audioEnc = null;
         }
      }
   };
}());

/**
 * Handle event with data inside
 * @param  {object} e Event object contains action type and related data
 */
audioWorker.onmessage = onmessage = function(e) {
   'use strict';
   var message = e.data,
      headerObj,
      encodedObj,
      success;

   switch (message.type) {
      case 'Init':
         workerUtil.processWhenLibReady(LibSpeex, 'libspeex', function() {
            headerObj = audioWorker.init(message.data);
            if (!!headerObj) {
               postMessage({
                  type: 'InitDone',
                  data: headerObj
               }, [headerObj.buffer]);
            } else {
               postMessage({
                  type: 'InitFail'
               });
            }
         }, 200);
         break;
      case 'Encode':
         encodedObj = audioWorker.encode(new Int16Array(message.data));
         if (!!encodedObj) {
            postMessage({
               type: 'Encoded',
               data: encodedObj,
               envId: message.envId
            }, [encodedObj.buffer]);
         } else {
            postMessage({
               type: 'Encoded',
               data: null,
               envId: message.envId
            });
         }
         break;
      case 'Clear':
         success = audioWorker.clear();
         postMessage({
            type: 'Cleared',
            success: success
         });
         break;
   }
};

