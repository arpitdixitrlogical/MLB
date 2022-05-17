/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function() {
    function detectStorageNamespace(storage) {
        var ns = 'local';

        if(storage.sync) {
            ns = 'sync';

            try {
                var test = window[ns];
                var x = '__storage_test__';

                test.setItem(x, x);
                test.removeItem(x);
            }
            catch(e) {
                ns = 'local';
            }
        }

        return ns;
    }

    var storage = chrome.storage;
    var storageNamespace = detectStorageNamespace(storage);
    var dataStore = storage[storageNamespace];

    var listener_callbacks = {};

    function get(key, callback, default_value) {
        dataStore.get(key, function(result) {
            if (result.hasOwnProperty(key)) {
                if(typeof(listener_callbacks[key]) != 'undefined') {
                    for (var i in listener_callbacks[key]) {
                        if (listener_callbacks[key].hasOwnProperty(i)) {
                            listener_callbacks[key][i](result[key]);
                        }
                    }
                }

                if(typeof(callback) !== 'undefined') {
                    callback(result[key]);
                }
            } else if(typeof(default_value) !== 'undefined') {
                callback(default_value);
            }
        });
    }

    function set(key, value) {
        var data = {};
        data[key] = value;
        dataStore.set(data);
    }

    function register(key, callback) {
        if(typeof(listener_callbacks[key]) == 'undefined') {
            listener_callbacks[key] = [];
        }
        listener_callbacks[key].push(callback);

        storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === storageNamespace && changes.hasOwnProperty(key)) {
                if(typeof(callback) !== 'undefined') {
                    callback(changes[key].newValue);
                }

                return changes[key].newValue;
            }
        });
    }

    return {
        'get': get,
        'set': set,
        'register': register
    };
}();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*global chrome:True*/


var CredentialStorage = __webpack_require__(2);

// the popin and option pane needs this to save the temporary item
window.Storage = __webpack_require__(0);

var Extension = function () {
    var statuses = {};
    var max_try = 5;

    function showBadeForTab(tab) {
        showBadge(tab.id, tab.url);
    }

    function showBadgeForTabId(tab_id) {
        chrome.tabs.get(tab_id, showBadeForTab);
    }

    function showBadgeForStatus(status) {
        showBadgeForTabId(status.tabId);
    }

    function showBadge(tab_id, url) {
        var re = statuses.hasOwnProperty(tab_id) && statuses[tab_id].credentials.length > 0 ?
            new RegExp(statuses[tab_id].credentials[0].url) : false;

        if (re !== false && re.test(url)) {
            var color = statuses[tab_id].credentials.length > 1 ? '#FFFF00' : '#00FF00';
            if(statuses[tab_id].count > max_try) { // fail
                color = '#FF0000';
            }

            chrome.browserAction.setBadgeText({ text: ' ' });
            chrome.browserAction.setBadgeBackgroundColor({ color: color });
        } else {
            chrome.browserAction.setBadgeText({text: ''});
            delete statuses[tab_id];
        }
    }

    function retrieveCredentials(status) {
        var credentials = CredentialStorage.getCredentials(status);

        if(statuses.hasOwnProperty(status.tabId) && statuses[status.tabId].requestId == status.requestId) {
            statuses[status.tabId].count += 1;
        } else {
            statuses[status.tabId] = {
                credentials: credentials,
                count: 0,
                requestId: status.requestId
            };
        }

        return credentials.length == 0 || statuses[status.tabId].count > max_try ? {} : {
            authCredentials: {
                username: credentials[0].username,
                password: credentials[0].password
            }
        };
    }

    function suggester(status) {
        if(statuses.hasOwnProperty(status.tabId)) {
            if(statuses[status.tabId].credentials.length == 0) {
                // no credentials found
            } else {
                if (statuses[status.tabId].credentials.length > 1) {
                    // multiple credentials
                }

                if (statuses[status.tabId].count > max_try) {
                    // failed authentication
                } else {
                    // authentication sent
                }
            }
        }
    }

    function init() {
        chrome.webRequest.onAuthRequired.addListener(retrieveCredentials, {urls: ['<all_urls>']}, ['blocking']);

        chrome.webRequest.onCompleted.addListener(suggester, {urls: ['<all_urls>']});

        chrome.tabs.onUpdated.addListener(showBadgeForTabId);
        chrome.tabs.onActivated.addListener(showBadgeForStatus);
    }

    return {
        'init': init
    };
}();

Extension.init();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Storage = __webpack_require__(0);

module.exports = function() {
    var credentials = {};

    var variable_name = 'credentials';

    function _key(key) {
        var hash = 0;
        var len = key.length;

        if (len === 0) {
            return hash;
        }

        for (var i = 0; i < len; i++) {
            var chr = key.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function addCredential(credential) {
        credentials[_key(credential.url)] = credential;
        Storage.set(variable_name, credentials);

        return credential;
    }

    function removeCredential(url) {
        var key = _key(url);
        var credential = credentials[key];
        delete credentials[key];
        Storage.set(variable_name, credentials);

        return credential;
    }

    function clearAll() {
        credentials = {};
        Storage.set(variable_name, credentials);
    }

    function getCredentials(status) {
        var found = [];
        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                try {
                    var re = new RegExp(credentials[key].url);
                    if (re.test(status.url)) {
                        found.push(credentials[key]);
                    }
                } catch(e) {
                    // the regex contained an error
                }
            }
        }

        found.sort(sortCredentials);

        return found;
    }

    function register(callback) {
        Storage.register(variable_name, callback);
        callback(credentials);
    }

    function updateCredentials(result)
    {
        // convert from the old storage format
        if(Array.isArray(result)) {
            credentials = {};

            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    credentials[_key(result[key].url)] = result[key];
                }
            }

            Storage.set(variable_name, credentials);
        } else {
            credentials = result;
        }
    }

    function sortCredentials(a, b)
    {
        if(typeof(a.priority) === 'undefined') a.priority = 1;
        if(typeof(b.priority) === 'undefined') b.priority = 1;

        return a.priority - b.priority;
    }

    // retrieve the credentials from storage
    Storage.get(variable_name, updateCredentials);
    register(updateCredentials);

    return {
        'register': register,

        'getCredentials': getCredentials,

        'sortCredentials': sortCredentials,

        'removeCredential': removeCredential,
        'clearAll': clearAll,
        'addCredential': addCredential,
        'asJSON': function() { return JSON.stringify(credentials); },
    };
}();


/***/ })
/******/ ]);