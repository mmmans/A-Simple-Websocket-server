webpackJsonp([1], {

  /***/
  133:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _angular = __webpack_require__(5);

    var _angular2 = _interopRequireDefault(_angular);

    var _angularRoute = __webpack_require__(11);

    var _angularRoute2 = _interopRequireDefault(_angularRoute);

    var _ngDialog = __webpack_require__(9);

    var _ngDialog2 = _interopRequireDefault(_ngDialog);

    var _module = __webpack_require__(28);

    var _module2 = _interopRequireDefault(_module);

    __webpack_require__(76);

    __webpack_require__(21);

    __webpack_require__(20);

    var _templateModule = __webpack_require__(19);

    var _templateModule2 = _interopRequireDefault(_templateModule);

    var _route = __webpack_require__(69);

    var _route2 = _interopRequireDefault(_route);

    var _extendedMonitorController = __webpack_require__(64);

    var _extendedMonitorController2 = _interopRequireDefault(_extendedMonitorController);

    var _extendedMonitorDetector = __webpack_require__(65);

    var _extendedMonitorDetector2 = _interopRequireDefault(_extendedMonitorDetector);

    var _extendedMonitorDisplayer = __webpack_require__(66);

    var _extendedMonitorDisplayer2 = _interopRequireDefault(_extendedMonitorDisplayer);

    var _extendedMonitorUtil = __webpack_require__(67);

    var _multimonWmksService = __webpack_require__(68);

    var _multimonWmksService2 = _interopRequireDefault(_multimonWmksService);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    // All css import here
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    exports.default = _angular2.default.module('com.vmware.vdi.htmlaccess.desktop.extendedMonitor', [_templateModule2.default, _angularRoute2.default, _ngDialog2.default, _module2.default]).config(['$routeProvider', _route2.default]).controller("extendedMonitorCtrl", ["$scope", "$rootScope", "$timeout", "$location", "ngDialog", "extendedMonitorModel", "fullscreenService", "messageService", "extendedMonitorTranslationService", _extendedMonitorController2.default]).controller("extendedMonitorDetector", ["$scope", "$rootScope", "$timeout", "messageService", "fullscreenService", "extendedMonitorTranslationService", _extendedMonitorDetector2.default]).controller("extendedMonitorDisplayer", ["$scope", "$rootScope", "$timeout", "extendedMonitorModel", "messageService", "multimonWmksService", "wmksBaseService", "normalizationService", "vncDecoder", "extendedMonitorTranslationService", _extendedMonitorDisplayer2.default]).service("messageService", ["$window", _extendedMonitorUtil.messageService]).service("extendedMonitorModel", ["messageService", _extendedMonitorUtil.extendedMonitorModel]).service("extendedMonitorTranslationService", ["messageService", _extendedMonitorUtil.extendedMonitorTranslationService]).service("multimonWmksService", ["wmksBaseService", _multimonWmksService2.default]).name;

    /***/
  }),

  /***/
  19:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    /*********************************************************
     * Copyright (C) 2017 VMware, Inc. All rights reserved.
     *********************************************************/

    exports.default = angular.module("com.vmware.vdi.htmlaccess.template", []).name;

    /***/
  }),

  /***/
  20:
  /***/
    (function(module, exports) {

    // removed by extract-text-webpack-plugin

    /***/
  }),

  /***/
  21:
  /***/
    (function(module, exports) {

    // removed by extract-text-webpack-plugin

    /***/
  }),

  /***/
  257:
  /***/
    (function(module, exports) {

    var path = 'common/commondialog/dialog_simple_confirm.html';
    var html = "<div class=\"dialog-title\">{{ngDialogData.title}}</div>\n<div class=\"dialog-content\">\n   <div class=\"session-ops-window-text\">{{ngDialogData.message}}</div>\n   <div class=\"session-ops-window-text warning\" ng-show=\"ngDialogData.warningMessage\">{{ngDialogData.warningMessage}}</div>\n</div>\n<div class=\"dialog-button-row\" dialog-tab-scope>\n   <button class=\"modal-button-base modal-button-right modal-button-blue ok-button\" ng-click=\"confirm() || closeThisDialog()\" id=\"okDialogBtn\" dialog-tabindex=\"1\" dialog-prevent-key-up>\n      {{ngDialogData.buttonLabelConfirm}}\n   </button>\n   <button class=\"modal-button-base modal-button-right modal-button-grey\" ng-click=\"close() || closeThisDialog()\" id=\"cancelDialogBtn\" dialog-tabindex=\"2\" dialog-prevent-key-up>\n      {{ngDialogData.buttonLabelCancel}}\n   </button>\n</div>";
    window.angular.module('com.vmware.vdi.htmlaccess.template').run(['$templateCache', function(c) {
      c.put(path, html)
    }]);
    module.exports = path;

    /***/
  }),

  /***/
  262:
  /***/
    (function(module, exports) {

    var path = 'desktop/multimon/extended-page/extended_monitor_detector_template.html';
    var html = "<div ng-if=\"noOverlap\">\n   <div id=\"powerOnBackground\" class=\"background-display\">\n      <div id=\"hint-text\" class=\"suggest-text top-area\">{{sugggestSelectText}}</div>\n      <button id=\"power-on-button\" type=\"button\" class=\"icon-button icon-select\" ng-click=\"powerOn()\">\n   </div>\n</div>\n<div ng-if=\"!noOverlap\" class=\"background-display\">\n   <div id=\"hint-text\" class=\"suggest-text central\">{{sugggestMoveText}}</div>\n</div>";
    window.angular.module('com.vmware.vdi.htmlaccess.template').run(['$templateCache', function(c) {
      c.put(path, html)
    }]);
    module.exports = path;

    /***/
  }),

  /***/
  28:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _angular = __webpack_require__(5);

    var _angular2 = _interopRequireDefault(_angular);

    var _fullscreenService = __webpack_require__(34);

    var _bitbuffer = __webpack_require__(33);

    var _bitbuffer2 = _interopRequireDefault(_bitbuffer);

    var _renderCacheService = __webpack_require__(36);

    var _renderCacheService2 = _interopRequireDefault(_renderCacheService);

    var _vncDecoder = __webpack_require__(37);

    var _vncDecoder2 = _interopRequireDefault(_vncDecoder);

    var _wmksBaseService = __webpack_require__(38);

    var _wmksBaseService2 = _interopRequireDefault(_wmksBaseService);

    var _normalizationService = __webpack_require__(35);

    var _normalizationService2 = _interopRequireDefault(_normalizationService);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    exports.default = _angular2.default.module('com.vmware.vdi.htmlaccess.desktop.sharedUtil', []).service('fullscreenSubService', ['$window', _fullscreenService.fullscreenSubService]).service('bitBuffer', _bitbuffer2.default).service('renderCacheService', ['bitBuffer', _renderCacheService2.default]).service('normalizationService', _normalizationService2.default).service('fullscreenService', ['$window', '$timeout', 'fullscreenSubService', _fullscreenService.fullscreenService]).service('vncDecoder', ['normalizationService', 'renderCacheService', _vncDecoder2.default]).service('wmksBaseService', ['$window', 'normalizationService', _wmksBaseService2.default]).name;
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /***/
  }),

  /***/
  33:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = bitBuffer;
    /*********************************************************
     * Copyright (C) 2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * bitbuffer.js -- bitBuffer
     *
     * Service to generate bitBuffer instance.
     */

    function bitBuffer() {
      var BitBuffer = function BitBuffer(buffer, size) {
        this._buf = buffer;
        this._size = size;
        this._readCount = 0;
        this._overflow = false;
        this._thisByte = 0;
        this._thisByteBits = 0;
      };

      BitBuffer.prototype.readBits0 = function(val, nr) {
        var mask = void 0;

        if (this._bits < nr) {
          this._overflow = true;
          return -1;
        }

        mask = ~(0xff >> nr); /* ones in the lower 'nr' bits */
        val <<= nr; /* move output value up to make space */
        val |= (this._thisByte & mask) >> 8 - nr;
        this._thisByte <<= nr;
        this._thisByte &= 0xff;
        this._thisByteBits -= nr;

        return val;
      };

      BitBuffer.prototype.readBits = function(nr) {
        var origNr = nr;
        var val = 0;

        if (this._overflow) {
          return 0;
        }

        while (nr > this._thisByteBits) {
          nr -= this._thisByteBits;
          val = this.readBits0(val, this._thisByteBits);

          if (this._readCount < this._size) {
            this._thisByte = this._buf[this._readCount++];
            this._thisByteBits = 8;
          } else {
            this._thisByte = 0;
            this._thisByteBits = 0;
            if (nr > 0) {
              this._overflow = true;
              return 0;
            }
          }
        }

        val = this.readBits0(val, nr);
        return val;
      };

      BitBuffer.prototype.readEliasGamma = function() {
        var l = 0;
        var value = void 0;
        var bit = void 0;
        var origidx = this._readCount;
        var origbit = this._thisByteBits;

        while (!this._overflow && (bit = this.readBits(1)) === 0) {
          l++;
        }

        value = 1 << l;

        if (l) {
          value |= this.readBits(l);
        }

        return value;
      };
      return {
        newInstance: function newInstance(buffer, size) {
          return new BitBuffer(buffer, size);
        }
      };
    }

    /***/
  }),

  /***/
  34:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";
    /* WEBPACK VAR INJECTION */
    (function($) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.fullscreenSubService = fullscreenSubService;
      exports.fullscreenService = fullscreenService;
      /*********************************************************
       * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
       *********************************************************/

      /**
       * fullscreen-service.js -- fullscreenService
       *
       * "sharedUtilModule" will shared among modules.
       * functions like this and logger should also be added in this place
       * to share among all modules like for launcher, appblast, mulitmon,
       * rtav, etc...
       *
       * Service to control the fullscreen related logic, only support one
       * listener for event, and extenable to the many version.
       */

      function fullscreenSubService($window) {
        this.isFullscreen = function() {
          return !($window.document.fullScreenElement !== undefined && $window.document.fullScreenElement === null || $window.document.msFullscreenElement !== undefined && $window.document.msFullscreenElement === null || $window.document.mozFullScreen !== undefined && !$window.document.mozFullScreen || $window.document.webkitIsFullScreen !== undefined && !$window.document.webkitIsFullScreen);
        };

        /**
         * Will execute the callback when either waitTime reached or condition is
         *    satisfied
         * @param  {function} condition The condition function, which once return
         *    true, will trigger the execution of callback
         * @param  {function} callback The callback function will be processed
         *    sooner
         *    or later.
         * @param  {number} waitMaxTime The max wait time in ms
         */
        this.waitCondition = function(condition, callback, waitMaxTime) {
          var waitTime = waitMaxTime || 3000,
            //ms
            checkInterval = 100,
            //ms
            checkFunction = void 0,
            waitTimer = void 0;

          checkFunction = function checkFunction() {
            waitTime -= checkInterval;
            if (condition() || waitTime <= 0) {
              callback();
              clearInterval(waitTimer);
            }
          };

          if (condition()) {
            callback();
          } else {
            waitTimer = setInterval(checkFunction, checkInterval);
          }
        };
      }

      /**
       * Control the full screen related logic, since chrome will take time to update
       * the property value on some version, add waitTime as 500ms to avoid using
       * corrupted properties.
       */
      function fullscreenService($window, $timeout, fullscreenSubService) {
        var fullscreenHandler = {},
          onFullscreenChanged = void 0,
          isFullscreen = fullscreenSubService.isFullscreen,
          waitCondition = fullscreenSubService.waitCondition,
          waitTime = 500;

        onFullscreenChanged = function onFullscreenChanged(event) {
          console.info("full screen changed");
          if (isFullscreen()) {
            console.info("enter full screen");
            if (!fullscreenHandler || typeof fullscreenHandler.onEnterFullscreen !== "function") {
              console.error("found no handler");
              return;
            }
            waitCondition(function() {
              /**
               * Use tolerent to avoid delay before entering fullscreen on some
               * machines since chrome has bug on some machines to support screenX
               * https://drafts.csswg.org/cssom-view/#dom-window-screenx
               */
              var tolerent = 10;
              return screenX <= screen.availLeft + tolerent && screenY <= screen.availTop + tolerent;
            }, function() {
              $timeout(fullscreenHandler.onEnterFullscreen, waitTime);
            });
          } else {
            console.info("exit full screen");
            if (!fullscreenHandler || typeof fullscreenHandler.onExitFullscreen !== "function") {
              console.error("found no handler");
              return;
            }
            /**
             * Specify the wait time here to avoid a chrome bug on "screen", which
             * in corner cases violates the spec:
             * https://developer.mozilla.org/en-US/docs/Web/API/Screen/availLeft
             */
            waitCondition(function() {
              return screenX >= screen.availLeft && screenY >= screen.availTop;
            }, fullscreenHandler.onExitFullscreen, waitTime);
          }
        };
        return {
          enterFullscreen: function enterFullscreen(elem) {
            if (isFullscreen()) {
              return;
            }
            if (elem.requestFullScreen) {
              elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
            } else if (elem.webkitRequestFullScreen) {
              elem.webkitRequestFullScreen(elem.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            } else {
              console.error("fail to max the screen");
            }
          },
          exitFullscreen: function exitFullscreen() {
            if (isFullscreen()) {
              if ($window.document.exitFullscreen) {
                $window.document.exitFullscreen();
              } else if ($window.document.msExitFullscreen) {
                $window.document.msExitFullscreen();
              } else if ($window.document.mozCancelFullScreen) {
                $window.document.mozCancelFullScreen();
              } else if ($window.document.webkitExitFullscreen) {
                $window.document.webkitExitFullscreen();
              } else {
                console.error("fail to cancel maximizing the screen");
              }
            }
          },
          onEnterFullscreen: function onEnterFullscreen(callback) {
            fullscreenHandler.onEnterFullscreen = callback;
          },
          onExitFullscreen: function onExitFullscreen(callback) {
            fullscreenHandler.onExitFullscreen = callback;
          },
          bindFullScreen: function bindFullScreen() {
            $(document).on('webkitfullscreenchange mozfullscreenchange ' + 'fullscreenchange MSFullscreenChange', onFullscreenChanged);
          },
          unbindFullScreen: function unbindFullScreen() {
            $(document).off('webkitfullscreenchange mozfullscreenchange ' + 'fullscreenchange MSFullscreenChange', onFullscreenChanged);
          }
        };
      }
      /* WEBPACK VAR INJECTION */
    }.call(exports, __webpack_require__(1)))

    /***/
  }),

  /***/
  35:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = normalizationService;
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * normalization-service.js -- normalizationService
     *
     * 3+ monitor support is not added in the 17Q2
     * And only support same DPI for now, checkpoint tracking has not been adapted yet.
     */

    function normalizationService() {
      this._perMonitorMode = false;

      this.clear = function() {
        this._rawSetting = {};
        this._normalizationModel = null;
        this._normalizedSettings = {};
        this._defaultModel = {};
        this._agentDPI = 1.0;
        this._DPIEnabled = true;
      };
      this.clear();

      this.setAgentDPI = function(dpi) {
        this._agentDPI = dpi;
      };

      /**
       * To fully enable this, the segment mouse map is needed, which is simple but
       * will not be done in 17q2 since we adapt the per system to reduce the
       * chance of meeting bug 1847196 when using multimon.
       */
      this.setPerMonitor = function(usePerMonitor) {
        this._perMonitorMode = !!usePerMonitor;
      };

      this.isPerMonitorMode = function() {
        return this._perMonitorMode;
      };

      /**
       * Returns the scale factor, which is depending the defination of "High
       * Resolution" option
       * Now using agent DPI scale, since the final design is so, and logic for
       * single monitor also get changed accordingly.
       */
      this.getFactor = function(id) {
        var baseDPI = this._rawSetting['0'].devicePixelRatio,
          monitorDPI = this._rawSetting[id].devicePixelRatio,
          compensateFactor = this._perMonitorMode ? 1 : monitorDPI / baseDPI,
          clientFactor = this._DPIEnabled ? compensateFactor : monitorDPI;

        return clientFactor * this._agentDPI;
      };

      /**
       * To indicate whether the DPI Sync is enabled or not, and DPI sync here is
       * defined as "using client DPI scale if enabled, use native pixel if not".
       * @param {boolean} enabled
       */
      this.setDPISync = function(enabled) {
        this._DPIEnabled = enabled;
      };

      /**
       * Returns the param to normalize target to refer
       * @param  {object} target
       * @param  {object} refer
       * @param  {object} k
       * @return {object}
       */
      this._getNormalizationParam = function(target, refer, k) {
        var param = {
          k: k,
          tx: refer.x - k * target.x,
          ty: refer.y - k * target.y
        };
        return param;
      };

      /**
       * After 17Q2, if want to support different DPI, the segment model should be
       * used.
       * @param  {object} point The source point
       * @param  {object} model The model
       * @return {object} This returns the point in the model
       */
      this.normalize = function(point, model) {
        if (!this._defaultModel) {
          return point;
        }
        if (!model) {
          model = this._defaultModel;
        }
        return {
          x: Math.round(point.x * model.k + model.tx),
          y: Math.round(point.y * model.k + model.ty)
        };
      };

      /**
       * revert the point back to normal using the identical model
       * @param  {object} point
       * @param  {object} model
       * @return {object}
       */
      this.revert = function(point, model) {
        if (!this._defaultModel) {
          return point;
        }
        if (!model) {
          model = this._defaultModel;
        }
        return {
          x: Math.round((point.x - model.tx) / model.k),
          y: Math.round((point.y - model.ty) / model.k)
        };
      };

      /**
       * Since we only support 2 monitors this function need no param, and will
       * return the stable point compare with rawSetting[0]
       *
       * Using this way, we will have bug 1834512, but we will not fix it for 17Q2,
       * Using the dragging detection before entering multimon can fix it, but need
       *    new UI and workflow.
       *
       * Written in the readable way instead of with the simpliest logic.
       *
       * @return {object} The top or left point in the line segment of the sharing
       *    Edge.
       */
      this._getStablePoint = function(id) {
        var baseId = '0',
          isLeft = this._rawSetting[id].x + this._rawSetting[id].width <= this._rawSetting[baseId].x,
          isRight = this._rawSetting[id].x >= this._rawSetting[baseId].x + this._rawSetting[baseId].width,
          isTop = this._rawSetting[id].y + this._rawSetting[id].height <= this._rawSetting[baseId].y,
          isDown = this._rawSetting[id].y >= this._rawSetting[baseId].y + this._rawSetting[baseId].height;

        if (isLeft) {
          return {
            x: this._rawSetting[baseId].x,
            y: Math.max(this._rawSetting[baseId].y, this._rawSetting[id].y)
          };
        } else if (isTop) {
          return {
            x: Math.max(this._rawSetting[baseId].x, this._rawSetting[id].x),
            y: this._rawSetting[baseId].y
          };
        } else if (isRight) {
          return {
            x: this._rawSetting[id].x,
            y: Math.max(this._rawSetting[baseId].y, this._rawSetting[id].y)
          };
        } else {
          return {
            x: Math.max(this._rawSetting[baseId].x, this._rawSetting[id].x),
            y: this._rawSetting[id].y
          };
        }
      };

      /**
       * Generate the model
       * In 17Q2 only enable 2 monitors, or a tree grow shall be used.
       */
      this._generateModel = function() {
        var key = void 0;
        this._normalizationModel = {};
        this._normalizationModel['0'] = this._getNormalizationParam({
          x: this._rawSetting['0'].x,
          y: this._rawSetting['0'].y
        }, {
          x: 0,
          y: 0
        }, this.getFactor(0));

        for (key in this._rawSetting) {
          if (this._rawSetting.hasOwnProperty(key) && key !== "0") {
            var stablePoint = this._getStablePoint(key);
            this._normalizationModel[key] = this._getNormalizationParam(stablePoint, this.normalize(stablePoint, this._normalizationModel['0']), this.getFactor(Number(key)));
          }
        }
      };

      this._calculateNormalizedSetting = function() {
        var key = void 0,
          startPoint = void 0;

        this._normalizedSettings = {};
        for (key in this._rawSetting) {
          if (this._rawSetting.hasOwnProperty(key) && this._normalizationModel.hasOwnProperty(key)) {
            startPoint = this.normalize(this._rawSetting[key], this._normalizationModel[key]);
            this._normalizedSettings[key] = {
              x: startPoint.x,
              y: startPoint.y,
              width: Math.round(this._rawSetting[key].width * this.getFactor(key)),
              height: Math.round(this._rawSetting[key].height * this.getFactor(key)),
              isModified: this.getFactor(key) !== 1
            };
          }
        }
      };

      /**
       * Avoid bug 1860710, since width need to be even for RDSH.
       */
      this._clipSettings = function() {
        var key = void 0;
        for (key in this._normalizedSettings) {
          if (this._normalizedSettings.hasOwnProperty(key)) {
            if (this._normalizedSettings[key].x % 2 !== 0) {
              this._normalizedSettings[key].x--;
              if (this._normalizedSettings[key].width % 2 !== 0) {
                this._normalizedSettings[key].width++;
              }
            } else {
              if (this._normalizedSettings[key].width % 2 !== 0) {
                this._normalizedSettings[key].width--;
              }
            }
          }
        }
      };

      this.setScreenModel = function(model) {
        this._defaultModel = model;
      };

      /**
       * Set the raw setting gathered from browser, currently only enable for chrome
       * @param {number} id
       * @param {object} setting
       */
      this.setRawSetting = function(id, setting) {
        this._rawSetting[id] = setting;
      };

      /**
       * Set the raw setting gathered from browser, currently only enable for chrome
       * @param {number} id
       * @param {object} setting
       */
      this.removeRawSetting = function(id) {
        delete this._rawSetting[id];
      };

      /**
       * Using the previous input data to calculate and derive the model and setting
       */
      this.calculate = function() {
        this._generateModel();
        this._calculateNormalizedSetting();
        this._clipSettings();
      };

      /**
       * Get the derived model
       * @return {object}
       */
      this.getNormalizationModel = function() {
        return this._normalizationModel;
      };

      /**
       * Get the derived normalized settings
       * @return {object}
       */
      this.getNormalizedSettings = function() {
        return this._normalizedSettings;
      };

      this.getSizeFactor = function(id) {
        return this._normalizationModel[id].k;
      };

      this.isScaleMismatched = function() {
        if (!this._rawSetting['0'] || this._rawSetting['0'].devicePixelRatio === undefined) {
          return false;
        }

        for (var key in this._rawSetting) {
          if (key !== '0' && this._rawSetting.hasOwnProperty(key) && this._rawSetting['0'].devicePixelRatio !== this._rawSetting[key].devicePixelRatio) {
            return true;
          }
        }
        return false;
      };
    }

    /***/
  }),

  /***/
  36:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = renderCacheService;
    /*********************************************************
     * Copyright (C) 2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * render-cache-service.js -- renderCacheService
     *
     * Service to handle cache for rendering.
     */

    function renderCacheService(bitBuffer) {
      this.decodeToCacheEntry = -1;
      this.updateCache = [];
      this.updateCacheEntries = 0;
      this.cacheOperationType = {
        updateCacheOpInit: 0,
        updateCacheOpBegin: 1,
        updateCacheOpEnd: 2,
        updateCacheOpReplay: 3
      };

      this.fail = function(message) {
        console.error(message);
        return false;
      };

      this.releaseImage = function(rect) {
        if (!!rect.image) {
          if (typeof rect.image.close === "function") {
            rect.image.close();
          }
          delete rect.image;
        }
        if (!!rect.data) {
          delete rect.data;
        }
      };
      /*
       *------------------------------------------------------------------------------
       *
       * _evictUpdateCacheEntry
       *
       *    Evict one entry from the update cache.  This is done in response
       *    to the payload of the Begin opcode as well as the destination
       *    slot of the Begin opcode.
       *
       * Results:
       *    None.
       *
       *------------------------------------------------------------------------------
       */

      this._evictUpdateCacheEntry = function(slot) {

        this.releaseImage(this.updateCache[slot]);

        this.updateCache[slot] = {};
        this.updateCache[slot].image = null;
      };

      /*
       *----------------------------------------------------------------------------
       *
       * _executeUpdateCacheInit --
       *
       *      Handle the UPDATE_CACHE_OP_INIT subcommand.  This resets the
       *      cache, evicting all entries and resets the cache sizes and
       *      flags.  The sizes and flags must be a subset of those which
       *      the client advertised in the capability packet.
       *
       * Results:
       *      None.
       *
       * Side effects:
       *      Resets update cache.
       *
       *----------------------------------------------------------------------------
       */

      this._executeUpdateCacheInit = function(rect) {
        var i = void 0;

        for (i = 0; i < this.updateCacheEntries; i++) {
          this._evictUpdateCacheEntry(i);
        }

        this.updateCache = [];
        this.updateCacheEntries = rect.updateCacheEntries;

        for (i = 0; i < this.updateCacheEntries; i++) {
          this.updateCache[i] = {};
          this.updateCache[i].image = null;
        }
      };

      /*
       *----------------------------------------------------------------------------
       *
       * _updateCacheInsideBeginEnd --
       *
       *      Returns true if the decoder has received in the current
       *      framebuffer update message a VNC_UPDATECACHE_OP_BEGIN message
       *      but not yet received the corresponding OP_END.
       *
       * Side effects:
       *      None.
       *
       *----------------------------------------------------------------------------
       */

      this._updateCacheInsideBeginEnd = function() {
        return this.decodeToCacheEntry !== -1;
      };

      /*
       *----------------------------------------------------------------------------
       *
       * _updateCacheInitialized --
       *
       *      Returns true if the decoder has been configured to have an
       *      active UpdateCache and the cache size negotiation has
       *      completed..
       *
       * Side effects:
       *      None.
       *
       *----------------------------------------------------------------------------
       */

      this._updateCacheInitialized = function() {
        return this.updateCacheEntries !== 0;
      };

      /*
       *----------------------------------------------------------------------------
       *
       * _executeUpdateCacheBegin --
       *
       *      Handle the UPDATE_CACHE_OP_BEGIN subcommand.  Process the
       *      message payload, which is a mask of cache entries to evict.
       *      Evict any existing entry at the destination slot, and create a
       *      new entry there.
       *
       * Results:
       *      None.
       *
       * Side effects:
       *      Evicts elements of the update cache.
       *      Creates a new cache entry.
       *
       *----------------------------------------------------------------------------
       */

      this._executeUpdateCacheBegin = function(rect) {
        var maskBitBuf = void 0,
          maskState = void 0,
          maskCount = void 0,
          i = void 0,
          j = void 0;

        if (!this._updateCacheInitialized()) {
          return false;
        }

        if (this._updateCacheInsideBeginEnd() || rect.slot >= this.updateCacheEntries) {
          return this.fail("error: cache status wrong for cache begin");
        }

        maskBitBuf = bitBuffer.newInstance(rect.data, rect.dataLength);
        maskState = !maskBitBuf.readBits(1);
        maskCount = 0;
        j = 0;

        do {
          maskCount = maskBitBuf.readEliasGamma();
          maskState = !maskState;

          if (maskState) {
            for (i = 0; i < maskCount && i < this.updateCacheEntries; i++) {
              this._evictUpdateCacheEntry(i + j);
            }
          }

          j += maskCount;
        } while (j < this.updateCacheEntries && !maskBitBuf.overflow);

        this.decodeToCacheEntry = rect.slot;
        this._evictUpdateCacheEntry(rect.slot);

        this.updateCache[this.decodeToCacheEntry].imageWidth = rect.width;
        this.updateCache[this.decodeToCacheEntry].imageHeight = rect.height;
        return true;
      };

      /*
       *----------------------------------------------------------------------------
       *
       * _executeUpdateCacheEnd --
       *
       *      Handle the UPDATE_CACHE_OP_END subcommand.  Process the
       *      message payload, which is a serialized bitmask of screen
       *      regions to scatter the update image to.
       *
       * Results:
       *      None.
       *
       * Side effects:
       *      Draws to the canvas.
       *
       *----------------------------------------------------------------------------
       */
      this._executeUpdateCacheEnd = function(rect, offset) {
        if (!this._updateCacheInitialized()) {
          return false;
        }
        if (!this._updateCacheInsideBeginEnd()) {
          return this.fail("error: cache status wrong for cache end");
        }
        var update = this.updateCache[this.decodeToCacheEntry],
          state = void 0,
          count = void 0,
          dstx = 0,
          dsty = 0,
          dstw = Math.ceil(rect.width / 16),
          dsth = Math.ceil(rect.height / 16),
          srcx = 0,
          srcy = 0,
          srcw = update.imageWidth / 16,
          srch = update.imageHeight / 16,
          availwidth = void 0,
          bitbuf = void 0,
          targetPoint = void 0;

        if (!this._updateCacheInitialized() || !this._updateCacheInsideBeginEnd() || rect.slot !== this.decodeToCacheEntry || rect.slot >= this.updateCacheEntries) {
          return this.fail("error: requested cache slot invalid");
        }

        update.encodedMaskRect = {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        };
        update.mask = rect.data;
        update.maskLength = rect.dataLength;

        bitbuf = bitBuffer.newInstance(update.mask, update.maskLength);
        state = !bitbuf.readBits(1);
        count = 0;

        do {
          if (count === 0) {
            count = bitbuf.readEliasGamma();
            state = !state;
          }

          availwidth = Math.min(srcw - srcx, dstw - dstx);
          availwidth = Math.min(availwidth, count);

          if (state) {
            targetPoint = this.vncDecoder._normalize({
              x: rect.x + dstx * 16,
              y: rect.y + dsty * 16
            }, offset);
            // Don't worry if we don't have a full 16-wide mcu at the
            // screen edge.  The canvas will trim the drawImage
            // coordinates for us.
            //
            this.vncDecoder._context.drawImage(update.image, srcx * 16, srcy * 16, availwidth * 16, 16, targetPoint.x, targetPoint.y, availwidth * 16, 16);

            srcx += availwidth;
            if (srcx === srcw) {
              srcx = 0;
              srcy++;
            }
          }

          dstx += availwidth;
          if (dstx === dstw) {
            dstx = 0;
            dsty++;
          }

          count -= availwidth;
        } while (dsty < dsth && !bitbuf._overflow);

        this.decodeToCacheEntry = -1;
        return true;
      };

      /*
       *----------------------------------------------------------------------------
       *
       * _executeUpdateCacheReplay --
       *
       *      Handle the UPDATE_CACHE_OP_REPLAY subcommand.  Process the
       *      message payload, which is a serialized mask used to subset the
       *      bitmask provided at the time the cache entry being replayed
       *      was created.  Scatters the specified subset of the cached
       *      image to the canvas.
       *
       * Results:
       *      None.
       *
       * Side effects:
       *      Draws to the canvas.
       *
       *----------------------------------------------------------------------------
       */

      this._executeUpdateCacheReplay = function(rect, offset) {
        if (!this._updateCacheInitialized()) {
          return false;
        }

        if (rect.slot >= this.updateCacheEntries) {
          return this.fail("error: requested cache slot invalid");
        }

        if (!this.updateCache[rect.slot] || !this.updateCache[rect.slot].encodedMaskRect) {
          return this.fail("error: requested cache slot data invalid");
        }

        var update = this.updateCache[rect.slot],
          encodedMaskRect = this.updateCache[rect.slot].encodedMaskRect,
          dstx = 0,
          dsty = 0,
          dstw = Math.ceil(encodedMaskRect.width / 16),
          dsth = Math.ceil(encodedMaskRect.height / 16),
          availwidth = void 0,
          srcx = 0,
          srcy = 0,
          srcw = update.imageWidth / 16,
          srch = update.imageHeight / 16,
          targetPoint = void 0,
          maskBitBuf = bitBuffer.newInstance(rect.data, rect.dataLength),
          updateBitBuf = bitBuffer.newInstance(update.mask, update.maskLength),
          updateState = !updateBitBuf.readBits(1),
          updateCount = 0,
          maskState = !maskBitBuf.readBits(1),
          maskCount = 0;

        if (!this._updateCacheInitialized() || this._updateCacheInsideBeginEnd() || rect.slot >= this.updateCacheEntries) {
          return this.fail("");
        }

        do {
          if (updateCount === 0) {
            updateCount = updateBitBuf.readEliasGamma();
            updateState = !updateState;
          }
          if (maskCount === 0) {
            maskCount = maskBitBuf.readEliasGamma();
            maskState = !maskState;
          }

          availwidth = dstw - dstx;
          availwidth = Math.min(availwidth, updateCount);

          if (updateState) {
            availwidth = Math.min(availwidth, srcw - srcx);
            availwidth = Math.min(availwidth, maskCount);

            if (maskState) {
              targetPoint = this.vncDecoder._normalize({
                x: encodedMaskRect.x + dstx * 16,
                y: encodedMaskRect.y + dsty * 16
              }, offset);
              // Don't worry if the right/bottom blocks are not
              // 16-pixel, the canvas will trim the drawImage dimesions
              // for us.
              if (true) {
                this.vncDecoder._context.drawImage(update.image, srcx * 16, srcy * 16, availwidth * 16, 16, targetPoint.x, targetPoint.y, availwidth * 16, 16);
              }

              if (false) {
                this._lighten(targetPoint.x, targetPoint.y, availwidth * 16, 16, "red");
              }
            }

            srcx += availwidth;
            if (srcx === srcw) {
              srcx = 0;
              srcy++;
            }

            maskCount -= availwidth;
          }

          dstx += availwidth;
          if (dstx === dstw) {
            dstx = 0;
            dsty++;
          }

          updateCount -= availwidth;
        } while (dsty < dsth && !maskBitBuf._overflow && !updateBitBuf._overflow);
        return true;
      };

      this._lighten = function(x, y, w, h, color) {
        this.vncDecoder._context.globalCompositeOperation = "lighten";
        this.vncDecoder._context.fillStyle = color;
        this.vncDecoder._context.fillRect(x, y, w, h);
        this.vncDecoder._context.globalCompositeOperation = "source-over";
      };

      /*
       *------------------------------------------------------------------------------
       *
       * _executeUpdateCacheReplay
       *
       *    Dispatch the updateCache commands according to their opcode.
       *    data is in various length as maskLength
       *
       * Results:
       *    None.
       *
       * Side Effects:
       *    None.
       *
       *------------------------------------------------------------------------------
       */

      this.operateOnCache = function(rect, offset) {
        switch (rect.opcode) {
          case this.cacheOperationType.updateCacheOpInit:
            this._executeUpdateCacheInit(rect);
            break;
          case this.cacheOperationType.updateCacheOpBegin:
            this._executeUpdateCacheBegin(rect);
            break;
          case this.cacheOperationType.updateCacheOpEnd:
            this._executeUpdateCacheEnd(rect, offset);
            break;
          case this.cacheOperationType.updateCacheOpReplay:
            this._executeUpdateCacheReplay(rect, offset);
            break;
          default:
            return this.fail("error: requested cache opcode invalid");
        }
      };
      this.setImage = function(rect) {
        this.updateCache[this.decodeToCacheEntry].image = rect.image;
      };
      this.setVncDecoder = function(decoder) {
        this.vncDecoder = decoder;
      };
      this.decodingCache = function() {
        return this.decodeToCacheEntry !== -1;
      };
    }

    /***/
  }),

  /***/
  37:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";
    /* WEBPACK VAR INJECTION */
    (function($) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = vncDecoder;
      /*********************************************************
       * Copyright (C) 2017 VMware, Inc. All rights reserved.
       *********************************************************/

      /**
       * vnc-decoder.js -- vncDecoder
       *
       * Service to get a VNC decoder
       * This file is needed since we want to fix bug 1797231 and unblock the release
       * of multimon feature, so the changes that should be done in 17Q2 after
       * completing the split of the vnc decoder from the wmks is move in 17Q1, thus
       * this file is incompleted and reduandant with the one in the wmks.
       *
       * In another words, the one in wmks will work for single monitor as before,
       * while this one will work for multimon, and we plan to merger them later.
       *
       * And why this can fix the crash issue is for we pass the non-rendered VNC messages
       * around instead of the whole screen image, which save a lot of memory alloc
       * and free.
       */

      function vncDecoder(normalizationService, renderCacheService) {
        this._canvas = null;
        this._context = null;
        this.encodingTypes = {
          encCopyRect: 0x01,
          encTightPNG: -260,
          encUpdateCache: 127 + 0x574d5600,
          //sub encodings
          subEncFill: 0x80
        };

        this._screenBase = {
          x: 0,
          y: 0
        };

        /**
         * Chrome on some windows machine has bug, e.g. the screenX, screenY on the
         * problem machine return 3844, 1924 after using fullscreen, while the true
         * value on the system setting is 3840 and 1920
         * use Math.min(screen.availLeft, screeX) to bypass come this bug according
         * to spec:
         * https://drafts.csswg.org/cssom-view/#dom-window-screenx
         */
        this.initScreen = function() {
          /*if (screen.availLeft !== undefined && screen.availTop !== undefined) {
            this._screenBase = normalizationService.normalize({
              x: Math.min(screenX, screen.availLeft),
              y: Math.min(screenY, screen.availTop)
            });
          } else {
            this._screenBase = normalizationService.normalize({
              x: screenX,
              y: screenY
            });
          }*/;
        };

        this._normalize = function(p, offset) {
          return {
            x: p.x - offset.x - this._screenBase.x,
            y: p.y - offset.y - this._screenBase.y
          };
        };

        this._copyRectBlit = function(srcX, srcY, width, height, dstX, dstY) {
          this._backgroundContext.drawImage(this._canvas, srcX, srcY, width, height, srcX, srcY, width, height);
          this._context.drawImage(this._backgroundCanvas, srcX, srcY, width, height, dstX, dstY, width, height);
        };

        this._fillRectWithColor = function(x, y, width, height, color) {
          var newStyle = void 0,
            canvas2dCtx = this._context;
          newStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
          canvas2dCtx.fillStyle = newStyle;
          canvas2dCtx.fillRect(x, y, width, height);
        };

        this._renderImage = function(rect, offset) {
          var p = this._normalize({
            x: rect.x,
            y: rect.y
          }, offset);
          try {
            this._context.drawImage(rect.image, p.x, p.y);
          } catch (e) {
            console.error(e);
          }
        };

        this.setCanvas = function(canvas) {
          var size = {
            width: canvas.width,
            height: canvas.height
          };
          this._canvas = canvas;
          this._context = this._canvas.getContext('2d');
          if (!!this._backgroundCanvasObject) {
            this._backgroundCanvasObject.remove();
          }
          this._backgroundCanvasObject = $('.canvas_css').css({
            position: 'absolute'
          });
          // print as log info
          console.log("set background here")
          console.log(this._backgroundCanvasObject)
          this._backgroundCanvasObject.attr(size).css(size);
          this._backgroundCanvas = this._backgroundCanvasObject[0];
          this._backgroundContext = this._backgroundCanvas.getContext('2d');
          renderCacheService.setVncDecoder(this);
        };

        this.onDPIChanged = function(canvas) {
          var size = {
            width: canvas.width,
            height: canvas.height
          };
          this._backgroundCanvasObject.attr(size);
        };

        /**
         * The function to render a rect, which include a special one as End of Frame
         *    indicate the end of async rendering is done.
         * @param  {object} rect The object including data
         * @param  {object} offset The screen offset information
         * @param  {function} onRenderDone The callback for finish rendering, accept no param
         */
        this.render = function(rect, offset, onRenderDone) {
          var pSrc, p;
          switch (rect.encoding) {
            case this.encodingTypes.encCopyRect:
              pSrc = this._normalize({
                x: rect.srcX,
                y: rect.srcY
              }, offset);
              p = this._normalize({
                x: rect.x,
                y: rect.y
              }, offset);
              this._copyRectBlit(pSrc.x, pSrc.y, rect.width, rect.height, p.x, p.y);
              break;
            case this.encodingTypes.encTightPNG:
              if (rect.subEncoding === this.encodingTypes.subEncFill) {
                p = this._normalize({
                  x: rect.x,
                  y: rect.y
                }, offset);
                this._fillRectWithColor(p.x, p.y, rect.width, rect.height, rect.color);
              } else if (renderCacheService.decodingCache()) {
                renderCacheService.setImage(rect, offset);
              } else {
                this._renderImage(rect, offset);
                this.releaseRectData(rect);
              }
              break;
            case this.encodingTypes.encUpdateCache:
              renderCacheService.operateOnCache(rect, offset);
              break;
            default:
              /**
               * can't use Logger since the commen Logger service is still not
               * completed after page merging
               */
              console.error("unsupported encoding type found for multimon");
              break;
          }

          /**
           * similar timeout also exist in wmks to allow canvas to render, and
           * here it's mainly for GC
           */
          setTimeout(onRenderDone, 1);
        };

        this.releaseRectData = renderCacheService.releaseImage;
      }
      /* WEBPACK VAR INJECTION */
    }.call(exports, __webpack_require__(1)))

    /***/
  }),

  /***/
  38:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = wmksBaseService;
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * wmks-base-service.js -- wmksBaseService
     *
     * This hold the getEventPosition function, which currently not support retina,
     * later would add more logic and function in.
     */

    function wmksBaseService($window, normalizationService) {
      this.getEventPosition = function(event, offset) {
        var docX = void 0,
          docY = void 0,
          defaultPosition = {
            x: 0,
            y: 0
          },
          normalizedPosition = void 0;

        if (!offset || !event) {
          return defaultPosition;
        }
        if (event.pageX || event.pageY) {
          docX = event.pageX;
          docY = event.pageY;
        } else if (event.clientX || event.clientY) {
          docX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          docY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        } else {
          return defaultPosition;
        }
        normalizedPosition = normalizationService.normalize({
          x: docX + screenX,
          y: docY + screenY
        });
        return {
          x: normalizedPosition.x + offset.x,
          y: normalizedPosition.y + offset.y
        };
      };
      /**
       * Add this workaround check to avoid a bug happens by chance of
       * wrong screenX, where the offset is added with a extra number,
       * and the availLeft is correct when this bug happens without the
       * positive extra offset. so when screen.availLeft exist, use min
       * of both should fix it.
       *
       * On the spec, the screenX should never be smaller than the
       * screen.availLeft, please refer the definition in:
       * https://drafts.csswg.org/cssom-view/#dom-window-screenx
       * as "The screenX attribute must return the x-coordinate of the position
       * where the event occurred relative to the origin of the Web-exposed
       * screen area."
       * And after entering fullscreen, they should be equal to each other, if
       * the browser don't count the windows/Mac OS bar in.
       */
      this.getScreenSetting = function() {
        var offsetX = void 0,
          offsetY = void 0;

        if (!screen || screenX === undefined || screenY === undefined) {
          return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            devicePixelRatio: window.devicePixelRatio || 1
          };
        }
        if (screen.availLeft !== undefined) {
          offsetX = Math.min(screenX, screen.availLeft);
        } else {
          offsetX = screenX;
        }
        if (screen.availTop !== undefined) {
          offsetY = Math.min(screenY, screen.availTop);
        } else {
          offsetY = screenY;
        }

        return {
          x: offsetX,
          y: offsetY,
          width: screen.width,
          height: screen.height,
          devicePixelRatio: window.devicePixelRatio || 1
        };
      };

      /**
       * whether should prevent default
       * @param {object} event
       */
      this.shouldPreventDefault = function(event) {
        if (!event) {
          return false;
        }
        var specialKeys = ["meta", "ctrl", "alt", "shift"];
        var hasSpecialKey = false;
        specialKeys.forEach(function(keyName) {
          if (event[keyName + "Key"]) {
            hasSpecialKey = true;
          }
        });
        /**
         * 65 is A, 90 is Z, add this condition for avoiding bug 1821196
         */
        return !(!!event.key && event.key.length === 1 && event.key.charCodeAt(0) >= 65 && event.key.charCodeAt(0) <= 90) || hasSpecialKey;
      };
    }

    /***/
  }),

  /***/
  64:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = extendedMonitorCtrl;

    var _dialog_simple_confirm = __webpack_require__(257);

    var _dialog_simple_confirm2 = _interopRequireDefault(_dialog_simple_confirm);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function extendedMonitorCtrl($scope, $rootScope, $timeout, $location, ngDialog, extendedMonitorModel, fullscreenService, messageService, _) {
      this.onEnterFullscreen = function() {
        $timeout(function() {
          extendedMonitorModel.isFullscreen = true;
          console.log("jump to display page");
          $location.path("/display");
        });
      };

      this.quit = function() {
        fullscreenService.unbindFullScreen();
        $timeout(function() {
          messageService.sendMessage({
            type: "confirmedClose"
          });
        });
      };

      /**
       * Don't allow to close dialog by esc since this dialog can be triggered
       *    by it.
       */
      this.onExitFullscreen = function() {
        if (extendedMonitorModel.started) {

          $scope.exitMultimonDialog = ngDialog.open({
            name: "QuitMultimon",
            templateUrl: _dialog_simple_confirm2.default,
            className: "session-ops-dialog",
            data: {
              title: _.translate("MM_QUIT_MULTIMON_T"),
              message: _.translate("MM_QUIT_MULTIMON_M"),
              buttonLabelConfirm: _.translate("OK"),
              buttonLabelCancel: _.translate("CANCEL")
            },
            showClose: false,
            closeByEscape: false,
            closeByDocument: false,
            scope: function() {
              $scope.confirm = function() {
                $scope.exitMultimonDialog.close();
                this.quit();
              }.bind(this);
              $scope.close = function() {
                var canvas = document.getElementById("extendedCanvas");

                $scope.exitMultimonDialog.close();
                if (!canvas) {
                  this.quit();
                }
                fullscreenService.enterFullscreen(canvas);
              }.bind(this);
              return $scope;
            }.bind(this)()
          });
        } else {
          $timeout(function() {
            extendedMonitorModel.isFullscreen = false;
            console.log("jump to back when not in fullscreen");
            $location.path("/detect");
          });
        }
      }.bind(this);

      fullscreenService.onEnterFullscreen(this.onEnterFullscreen);
      fullscreenService.onExitFullscreen(this.onExitFullscreen);
      fullscreenService.bindFullScreen();

      $rootScope.showCanvas = false;
      $rootScope.angularInited = true;

      messageService.responseTo("forcibleClose", function(data) {
        messageService.stop();
        $timeout(function() {
          window.open('location', '_self', '');
          window.close();
        });
      });
    }
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * extended-monitor-controller.js -- extendedMonitorCtrl
     */

    /***/
  }),

  /***/
  65:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = extendedMonitorDetector;
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * extended-monitor-detector.js -- extendedMonitorDetector
     *
     * Module to gather the display information and trigger fullscreen
     *
     * The UI part is enough for working, and could be better, which is low priority
     * to be done in later patches
     */

    function extendedMonitorDetector($scope, $rootScope, $timeout, messageService, fullscreenService, _) {
      this.onLoaded = function() {
        this.unmaxableRegions = {
          0: null
        };
        this.startRender = false;
        this.detectTimer = null;
        $timeout(function() {
          var canvas = document.getElementById("extendedCanvas");
          if (!canvas) {
            return;
          }
          canvas.width = 0;
          canvas.height = 0;
          $rootScope.showCanvas = false;
          $scope.noOverlap = false;
          $scope.$apply();
          messageService.sendMessage({
            type: "ready"
          });
          messageService.responseTo("init", this.init);
        }.bind(this));
      }.bind(this);

      this.init = function() {
        $scope.sugggestMoveText = _.translate("MM_HINT_MOVE");
        $scope.sugggestSelectText = _.translate("MM_SELECT_MONITOR");
        document.title = _.translate("MM_MONITOR_DETECTOR");
        this.region = this.getOwnRegion();
        messageService.responseTo("updateUnmaxableRegions", this.updateUnmaxableRegions);
        messageService.sendMessage({
          type: "setUnmaxableRegion",
          data: {
            region: this.region
          }
        });
        messageService.sendMessage({
          type: "initDone"
        });
      }.bind(this);

      this.getOwnRegion = function() {
        return {
          x: screen.availLeft,
          y: screen.availTop,
          width: screen.availWidth,
          height: screen.availHeight
        };
      };

      this.updateUnmaxableRegions = function(data) {
        this.unmaxableRegions = data.regions;
        _.onTranslateReady(this.updateScopeDisplay);
      }.bind(this);

      this.watchingRegionChange = function() {
        if (!!this.detectTimer) {
          console.error("time has already being inited");
          return;
        }
        this.detectTimer = setInterval(function() {
          if (JSON.stringify(this.region) !== JSON.stringify(this.getOwnRegion())) {
            this.region = this.getOwnRegion();
            messageService.sendMessage({
              type: "setUnmaxableRegion",
              data: {
                region: this.region
              }
            });
          }
          _.onTranslateReady(this.updateScopeDisplay);
        }.bind(this), 500);
      }.bind(this);

      this.isPointIn = function(p, rect) {
        return p.x >= rect.x && p.x <= rect.x + rect.width && p.y >= rect.y && p.y <= rect.y + rect.height;
      };

      this.windowHasOverlapWith = function(rect) {
        // if can decide treat as no overlap and clickable
        if (screenX === undefined || screenY === undefined || window.outerHeight === undefined || window.outerWidth === undefined) {
          return false;
        }
        return this.isPointIn({
          x: screenX,
          y: screenY
        }, rect) || this.isPointIn({
          x: screenX,
          y: screenY + window.outerHeight
        }, rect) || this.isPointIn({
          x: screenX + window.outerWidth,
          y: screenY
        }, rect) || this.isPointIn({
          x: screenX + window.outerWidth,
          y: screenY + window.outerHeight
        }, rect);
      }.bind(this);

      this.noOverlap = function() {
        var key = void 0,
          isEmpty = true;
        for (key in this.unmaxableRegions) {
          if (this.unmaxableRegions.hasOwnProperty(key)) {
            isEmpty = false;
            if (this.windowHasOverlapWith(this.unmaxableRegions[key])) {
              return false;
            }
          }
        }
        return !isEmpty;
      }.bind(this);

      this.updateStatus = function() {
        $scope.noOverlap = this.noOverlap();
        $scope.$apply();
      };

      this.updateScopeDisplay = function() {
        if (!this.startRender) {
          this.startRender = true;
          this.watchingRegionChange();
          this.updateStatus();
        } else {
          if ($scope.noOverlap !== this.noOverlap()) {
            this.updateStatus();
          }
        }
      }.bind(this);

      /**
       * Click handler when user click the power on button
       * will clearup and jump
       */
      $scope.powerOn = function() {
        var canvas = void 0;

        if (!this.startRender) {
          return;
        }
        if (!!this.detectTimer) {
          clearInterval(this.detectTimer);
        }
        canvas = document.getElementById("extendedCanvas");
        if (!canvas) {
          return;
        }
        this.detectTimer = null;
        messageService.clearResponsor("updateUnmaxableRegions");
        fullscreenService.enterFullscreen(canvas);
      }.bind(this);

      this.onLoaded();
    }

    /***/
  }),
  /***/
  66:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = extendedMonitorDisplayer;
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * extended-monitor-displayer.js -- extendedMonitorDisplayer
     *
     * Module to control all extended monitors inside the new page
     *
     */

    function extendedMonitorDisplayer($scope, $rootScope, $timeout, extendedMonitorModel, messageService, multimonWmksService, wmksBaseService, normalizationService, vncDecoder, _) {
      this.init = function() {
        console.log("initing the extendedMonitorDisplayer");
        this.canvas = document.getElementById("extendedCanvas");
        if (!this.canvas) {
          return;
        }
        this.browserSizeFactor = 1;
        this.context = this.canvas.getContext("2d");
        _.onTranslateReady(this.initRendering);
        messageService.responseTo("startDisplay", this.startDisplay);
        $timeout(function() {
          messageService.sendMessage({
            type: "readyToDisplay",
            data: {
              region: wmksBaseService.getScreenSetting()
            }
          });
        });
        this.responseTimer = null;
        this.responseInterval = 100;
        $scope.$on("$destroy", this.onDestroy);
      };

      var previousAngle = -1000;
      var handleOrientation = function(){
        if(previousAngle !==screen.orientation.angle){
          console.log(screen.orientation.angle);
          previousAngle =screen.orientation.angle;
        } else {
          return;
        }
        if(screen.orientation.angle === 0 || screen.orientation.angle === 180){
           window.onOrientationChanged(true);
        } else {
           window.onOrientationChanged(false);
        }
      }
      window.addEventListener("deviceorientation", handleOrientation, true);


      window.mksModifier = null;
      this.initRendering = function() {
        this.fitCanvasToScreen();
        vncDecoder.setCanvas(this.canvas);
        this.showDefaultDesktop();
        window.mksPosition = function(position){
          return {
            x: (position.x-mksModifier.cx)*mksModifier.sx,
            y: (position.y-mksModifier.cy)*mksModifier.sy
          };
        };
        if(!mksModifier){
          mksModifier = {
            sx:1,
            sy:1,
            cx:0,
            cy:0
          };
        }
        console.log("resolution inited");
      }.bind(this);
      window.usedRemoteResolution = {
        width:0,
        height:0
      };
      this.onResolutionChanged = function(data){
         let width = data.width;
         let height = data.height;

         window.usedRemoteResolution = data;

        this.canvas.style.width = screen.width + 'px';
        this.canvas.style.height = screen.height + 'px';
        this.canvas.width = width;
        this.canvas.height = height;
        mksModifier = {
          sx:width/screen.width,
          sy:height/screen.height,
          cx:screenX,
          cy:screenY
        };
        console.log("resolution Changed");
      }.bind(this);
      window.onOrientationChanged = function(isLandscope){
        this.onResolutionChanged(window.usedRemoteResolution);
      }.bind(this);

      this.startDisplay = function(data) {
        this.offset = {
          x: data.screenBase.x,
          y: data.screenBase.y
        };
        this.onDPISettingChanged(data.sizeFactor);
        normalizationService.setScreenModel(data.screenModel);
        messageService.responseTo("resolution", this.onResolutionChanged);
        messageService.responseTo("display", this.onDisplayData);
        messageService.responseTo("setCursor", multimonWmksService.setCursor);
        messageService.responseTo("showDisplay", this.showDisplay);
        messageService.responseTo("hideDisplay", this.hideDisplay);
        multimonWmksService.startRedirect(document, this.canvas, {
          onWmks: messageService.sendMessage.bind(messageService)
        }, this.offset);
        extendedMonitorModel.started = true;
        if (!!this.responseTimer) {
          clearInterval(this.responseTimer);
        }
        this.responseTimer = setInterval(this.responseCheck, this.responseInterval);
        this.renderingIndeces = [];
        vncDecoder.initScreen();
      }.bind(this);

      /**
       * fit the this.canvas to the size of screen
       */
      this.fitCanvasToScreen = function() {
        this.canvas.style.width = screen.width + 'px';
        this.canvas.style.height = screen.height + 'px';
        this.canvas.width = screen.width * this.browserSizeFactor;
        this.canvas.height = screen.height * this.browserSizeFactor;
      };

      /**
       * displaying default desktop before getting any data to display
       */
      this.showDefaultDesktop = function() {
        var fontSize = void 0,
          defaultText = void 0,
          backgroundGradient = void 0;

        $rootScope.showCanvas = true;
        fontSize = Math.min(40, this.canvas.width / 25);
        defaultText = _.translate("Connecting...");

        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        backgroundGradient = this.context.createLinearGradient(0, 0, 0, 2 * this.canvas.height);
        backgroundGradient.addColorStop(0, "black");
        backgroundGradient.addColorStop(1, "white");
        this.context.fillStyle = backgroundGradient;
        this.context.fill();
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        this.context.font = fontSize + "px Georgia";
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText(defaultText, this.canvas.width / 2, this.canvas.height / 2);
        $timeout(function() {
          $scope.$apply();
        });
      };

      /**
       * Callback when getting displaying data, use in this way to trigger
       * rendering timing as we expected.
       * @param  {object} vncRects The array contains VNC data
       */
      this.onDisplayData = function(vncRects) {
        console.log("get rects: ", vncRects);
        var _this = this;

        vncRects.forEach(function(item) {
          _this.renderData(item);
        });
      }.bind(this);

      this.responseCheck = function() {
        if (this.renderingIndeces.length > 0) {
          messageService.sendMessage({
            type: "renderingDone",
            renderingIndeces: this.renderingIndeces
          });
          this.renderingIndeces = [];
        }
      }.bind(this);

      /**
       * Udpate according to the the displaying data
       * @param  {object} data The object contains VNC data
       */
      this.renderData = function(data) {
        var _this2 = this;

        var rect = data.rect,
          renderingIndex = data.renderingIndex;

        vncDecoder.render(rect, this.offset, function() {
          _this2.renderingIndeces.push(renderingIndex);
        });
      };

      /**
       * clear up when leaving this scope
       */
      this.onDestroy = function() {
        messageService.clearResponsor("display");
        messageService.clearResponsor("setCursor");
        messageService.clearResponsor("startDisplay");
        messageService.clearResponsor("showDisplay");
        messageService.clearResponsor("hideDisplay");
        multimonWmksService.stopRedirect();
        extendedMonitorModel.started = false;
      };
      this.init();

      /**
       * factor might be dpi_b or dpi_a*dpi_b
       * @param  {[type]} factor [description]
       * @return {[type]}        [description]
       */
      this.onDPISettingChanged = function(factor) {
        this.browserSizeFactor = factor;
        if (this.canvas.width !== screen.width * this.browserSizeFactor || this.canvas.height !== screen.height * this.browserSizeFactor) {
          this.canvas.width = screen.width * this.browserSizeFactor;
          this.canvas.height = screen.height * this.browserSizeFactor;
          vncDecoder.onDPIChanged(this.canvas);
        }
      };

      this.showDisplay = function() {
        this.canvas.style.display = "";
      };

      this.hideDisplay = function() {
        this.canvas.style.display = "none";
      };
    }

    /***/
  }),

  /***/
  67:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.messageService = messageService;
    exports.extendedMonitorModel = extendedMonitorModel;
    exports.extendedMonitorTranslationService = extendedMonitorTranslationService;
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * extended-monitor-util.js -- messageService extendedMonitorModel
     * extendedMonitorTranslationService
     *
     * "multimonModule" is for multimon codes
     * Define those services and model that shared among controllers to decouple.
     */

    function messageService($window) {
      var messageMap = {},
        extendedMonitorModel = null,
        service = void 0,
        onClose = void 0,
        //origin = "https://" + $window.location.hostname,
        origin = "*",
        ref,

        onMessage = function onMessage(event) {
          console.log(event)
          ref = event.source;
          var data = event.data,
            i = void 0,
            handlers = void 0;
          //eventOrigin = event.origin || event.originalEvent.origin;
          console.log(data);
          if (messageMap.hasOwnProperty(data.type)) {
            handlers = messageMap[data.type];

            for (i = 0; i < handlers.length; i++) {
              handlers[i](data.data);
            }
          }
        };

      service = {
        /**
         * make handler response to a type of message
         * @param {string} type The target message type
         * @param {function} handler The callback for the target message
         */
        responseTo: function responseTo(type, handler) {
          if (!messageMap[type]) {
            messageMap[type] = [];
          }
          messageMap[type].push(handler);
        },

        /**
         * send message
         * @param {object} message should contains the "type" property
         */
        sendMessage: function sendMessage(message) {
          console.log("sending", message);
          message.uid = extendedMonitorModel.uid;
          if (!message.data) {
            message.data = {};
          }
          message.data.id = extendedMonitorModel.id;
          message.data.isFullscreen = extendedMonitorModel.isFullscreen;
          $window.parent.postMessage(message, origin);
        },

        /**
         * cancel calling back the handler for the target type
         * @param {string} type The target message type
         * @param {function} handler Optimal The callback for the target message,
         *     if absent, will delete all handlers bound to the message
         */
        clearResponsor: function clearResponsor(type, handler) {
          var handlerIndex = void 0;

          if (!messageMap[type]) {
            return;
          }
          if (!handler) {
            delete messageMap[type];
          } else {
            handlerIndex = messageMap[type].indexOf(handler);
            if (handlerIndex === -1) {
              return;
            }
            messageMap[type].splice(handlerIndex, 1);
            if (messageMap[type].length === 0) {
              delete messageMap[type];
            }
          }
        },

        /**
         * @param {object} model The extendedMonitorModel object
         */
        setextendedMonitorModel: function setextendedMonitorModel(model) {
          extendedMonitorModel = model;
        },
        onMessage: onMessage,
        stop: function stop() {
          $window.removeEventListener("message", onMessage);
          $window.removeEventListener('beforeunload', onClose);
        }
      };

      onClose = function onClose() {
        service.sendMessage({
          type: "close"
        });
      };
      $window.addEventListener("message", onMessage, false);
      $window.addEventListener('beforeunload', onClose);
      return service;
    }

    function extendedMonitorModel(messageService) {
      var random = void 0,
        getUid = void 0,
        model = void 0;

      random = function random() {
        var d = new Date(),
          seed = Math.abs(1000 * d.getSeconds() + d.getMilliseconds()),
          r = seed * Math.random();
        return r - Math.floor(r);
      };
      getUid = function getUid() {
        return 'xx-xx-xx-xx xx-xx-xx-xx xx-xx-xx-xx xx-xx-xx-xx'.replace(/x/g, function() {
          var r = random() * 16 | 0;
          return r.toString(16);
        });
      };
      model = {
        id: -1,
        uid: getUid(),
        isFullscreen: false
      };
      messageService.setextendedMonitorModel(model);
      messageService.responseTo("init", function(data) {
        model.id = data.id;
      });
      return model;
    }

    function extendedMonitorTranslationService(messageService) {
      var translationMap = null,
        initCallback = null,
        inited = false;

      messageService.responseTo("init", function(data) {
        translationMap = data.translationMap;
        inited = true;
        console.log("table inited");
        if (typeof initCallback === "function") {
          initCallback();
        }
      });
      return {
        /**
         * translate the text if the table are ready
         * @param  {string} englishText The english text
         * @return {string} This returns the translated text
         */
        translate: function translate(englishText) {
          if (!translationMap || !translationMap.hasOwnProperty(englishText)) {
            return englishText;
          }
          return translationMap[englishText];
        },
        /**
         * call the callback when the table loaded.
         * @param {function} callback
         */
        onTranslateReady: function onTranslateReady(callback) {
          if (!inited) {
            initCallback = callback;
          } else {
            initCallback = null;
            callback();
          }
        }
      };
    }

    /***/
  }),

  /***/
  68:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = multimonWmksService;

    var _jquery = __webpack_require__(1);

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function multimonWmksService(wmksBaseService) {
      var wmksHandler = void 0,
        mouseDetectionElement = void 0,
        cursorElement = void 0,
        offset = void 0,
        mouseDetectionInterval = void 0,
        canSendMouseMove = void 0,
        cachedMousePosition = void 0,
        startWorking = false,
        wmksHandlerMap = void 0,

        // functions
        onBlur = void 0,
        onMouseEvent = void 0,
        onMouseWheel = void 0,
        onMouseMove = void 0,
        copyProperties = void 0,
        getKeyEventData = void 0,
        onKeyEvent = void 0,
        _setCursor = void 0,
        clearCursor = void 0,
        boundWmksEvents = void 0,
        unboundWmksEvents = void 0;

      onBlur = function onBlur(event) {
        wmksHandler.onWmks({
          type: "onBlur"
        });
      };

      onMouseEvent = function onMouseEvent(event, isDownEvent) {
        var position = wmksBaseService.getEventPosition(event, offset),
          bmask = 1 << event.button;
        wmksHandler.onWmks({
          type: "mouseButton",
          data: {
            position: mksPosition(position),
            isDownEvent: isDownEvent,
            bmask: bmask
          }
        });
      };

      onMouseWheel = function onMouseWheel(event) {
        var position = wmksBaseService.getEventPosition(event, offset),
          dx = Math.max(Math.min(event.wheelDeltaX, 1), -1),
          dy = Math.max(Math.min(event.wheelDeltaY, 1), -1);

        wmksHandler.onWmks({
          type: "mouseWheel",
          data: {
            position: mksPosition(position),
            dx: dx,
            dy: dy
          }
        });
      };

      onMouseMove = function onMouseMove(event) {
        if (!canSendMouseMove) {
          // buffer position
          cachedMousePosition = wmksBaseService.getEventPosition(event, offset);
          return;
        }
        canSendMouseMove = false;
        var position = wmksBaseService.getEventPosition(event, offset);
        wmksHandler.onWmks({
          type: "mouseMove",
          data: {
            position: mksPosition(position)
          }
        });
        setTimeout(function() {
          // check buffered position
          canSendMouseMove = true;
          wmksHandler.onWmks({
            type: "mouseMove",
            data: {
              position: mksPosition(cachedMousePosition)
            }
          });
        }, mouseDetectionInterval);
      };

      copyProperties = function copyProperties(dst, src, nameList) {
        var i = void 0,
          name = void 0;
        for (i = 0; i < nameList.length; i++) {
          name = nameList[i];
          if (src[name] !== undefined) {
            dst[name] = src[name];
          }
        }
      };
      /**
       * Will copy below properties to dst object which is enough for wmks to use.
       * e.originalEvent.key
       * e.originalEvent.keyIdentifier
       * e.shiftKey
       * e.keyCode
       * e.charCode;
       * e.altKey
       * e.ctrlKey,
       * e.key
       * e.which
       */
      getKeyEventData = function getKeyEventData(e) {
        var passableKeyEvent = {};
        if (!!e.originalEvent) {
          passableKeyEvent.originalEvent = {};
          copyProperties(passableKeyEvent.originalEvent, e.originalEvent, ["key", "keyIdentifier"]);
        }
        copyProperties(passableKeyEvent, e, ["shiftKey", "keyCode", "charCode", "altKey", "ctrlKey", "key", "which", "keyIdentifier", "type",
          /*extra after here*/
          "code", "location", "metaKey"
        ]);
        return passableKeyEvent;
      };

      onKeyEvent = function onKeyEvent(type, event) {
        var keyEventData = getKeyEventData(event);
        wmksHandler.onWmks({
          type: "keyEvent",
          data: {
            type: type,
            event: keyEventData
          }
        });

        if (wmksBaseService.shouldPreventDefault(event)) {
          event.preventDefault();
        }
        event.stopPropagation();
      };

      _setCursor = function setCursor(url) {
        cursorElement.style.cursor = url;
      };

      clearCursor = function clearCursor() {
        _setCursor("");
      };

      wmksHandlerMap = {
        keyboardHandlers: {
          keyup: function keyup(event) {
            onKeyEvent("KeyUp", event.originalEvent);
          },
          keydown: function keydown(event) {
            onKeyEvent("KeyDown", event.originalEvent);
          },
          keypress: function keypress(event) {
            onKeyEvent("KeyPress", event.originalEvent);
          }
        },
        mouseHandlers: {
          mousemove: function mousemove(event) {
            onMouseMove(event.originalEvent);
          },
          mousedown: function mousedown(event) {
            onMouseEvent(event.originalEvent, 1);
          },
          mouseup: function mouseup(event) {
            onMouseEvent(event.originalEvent, 0);
          },
          wheel: function wheel(event) {
            onMouseWheel(event.originalEvent || window.event);
          }
        }
      };

      boundWmksEvents = function boundWmksEvents() {
        var eventName = void 0,
          keyboardHandlers = wmksHandlerMap.keyboardHandlers,
          mouseHandlers = wmksHandlerMap.mouseHandlers;

        for (eventName in keyboardHandlers) {
          if (keyboardHandlers.hasOwnProperty(eventName)) {
            (0, _jquery2.default)(document).on(eventName, keyboardHandlers[eventName]);
          }
        }
        for (eventName in mouseHandlers) {
          if (mouseHandlers.hasOwnProperty(eventName)) {
            (0, _jquery2.default)(mouseDetectionElement).on(eventName, mouseHandlers[eventName]);
          }
        }
        (0, _jquery2.default)(window).on("blur", onBlur);
      };

      unboundWmksEvents = function unboundWmksEvents() {
        var eventName = void 0,
          keyboardHandlers = wmksHandlerMap.keyboardHandlers,
          mouseHandlers = wmksHandlerMap.mouseHandlers;

        for (eventName in keyboardHandlers) {
          if (keyboardHandlers.hasOwnProperty(eventName)) {
            (0, _jquery2.default)(document).off(eventName, keyboardHandlers[eventName]);
          }
        }
        for (eventName in mouseHandlers) {
          if (mouseHandlers.hasOwnProperty(eventName)) {
            (0, _jquery2.default)(mouseDetectionElement).off(eventName, mouseHandlers[eventName]);
          }
        }
        (0, _jquery2.default)(window).off("blur", onBlur);
      };

      return {
        /**
         * Set cursor style
         * @param {object} data Object contains the image url for cursor
         */
        setCursor: function setCursor(data) {
          _setCursor(data.url);
        },
        /**
         * Start firing wmks events to the realWmksService.onWmks
         * @param {object} mouseDetectionTarget The DOM element we want to detect
         *    mouse
         * @param {object} cursorTarget The DOM element we want to apply cursor
         *    on
         * @param {object} realWmksService This should contains a property of
         *     "onWmks"
         * @param {object} screenOffset This contains "x" and "y" to adjust the
         *     event position
         */
        startRedirect: function startRedirect(mouseDetectionTarget, cursorTarget, realWmksService, screenOffset) {
          if (!!startWorking) {
            console.log("skip start wmks since it's already started");
            return;
          }
          wmksHandler = realWmksService;
          mouseDetectionElement = mouseDetectionTarget;
          cursorElement = cursorTarget;
          offset = screenOffset;
          mouseDetectionInterval = 20;
          canSendMouseMove = true;
          cachedMousePosition = null;
          boundWmksEvents();
          startWorking = true;
        },
        /**
         * Stop firing wmks events to the realWmksService.onWmks and clear up
         */
        stopRedirect: function stopRedirect() {
          if (!startWorking) {
            console.log("skip stop wmks since it's not started");
            return;
          }
          unboundWmksEvents();
          clearCursor();
          canSendMouseMove = false;
          cachedMousePosition = null;
          wmksHandler = null;
          mouseDetectionElement = null;
          offset = null;
          startWorking = false;
        }
      };
    }
    /*********************************************************
     * Copyright (C) 2016-2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /**
     * multimon-wmks-service.js -- multimonWmksService
     *
     * Class to wrap browser wmks events and provide APIs
     *
     */

    /***/
  }),

  /***/
  69:
  /***/
    (function(module, exports, __webpack_require__) {

    "use strict";


    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = routeConfig;

    var _extended_monitor_detector_template = __webpack_require__(262);

    var _extended_monitor_detector_template2 = _interopRequireDefault(_extended_monitor_detector_template);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function routeConfig($routeProvider) {
      $routeProvider.when('/detect', {
        controller: 'extendedMonitorDetector',
        templateUrl: _extended_monitor_detector_template2.default
      }).when('/display', {
        controller: 'extendedMonitorDisplayer',
        template: " "
      }).otherwise({
        redirectTo: '/display'
      });
    }
    /*********************************************************
     * Copyright (C) 2017 VMware, Inc. All rights reserved.
     *********************************************************/

    /***/
  }),

  /***/
  76:
  /***/
    (function(module, exports) {

    // removed by extract-text-webpack-plugin

    /***/
  })

}, [133]);
//# sourceMappingURL=extended-monitor.cc050c0b31e6616b259f.js.map