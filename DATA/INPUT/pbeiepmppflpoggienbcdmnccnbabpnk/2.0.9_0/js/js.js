//MD5 start
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*global unescape, define, module */

;(function ($) {
    'use strict'

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xFFFF)
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn (q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
    }
    function md5_ff (a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }
    function md5_gg (a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }
    function md5_hh (a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t)
    }
    function md5_ii (a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl_md5 (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32)
        x[(((len + 64) >>> 9) << 4) + 14] = len

        var i
        var olda
        var oldb
        var oldc
        var oldd
        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878

        for (i = 0; i < x.length; i += 16) {
            olda = a
            oldb = b
            oldc = c
            oldd = d

            a = md5_ff(a, b, c, d, x[i], 7, -680876936)
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
            b = md5_gg(b, c, d, a, x[i], 20, -373897302)
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
            d = md5_hh(d, a, b, c, x[i], 11, -358537222)
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

            a = md5_ii(a, b, c, d, x[i], 6, -198630844)
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

            a = safe_add(a, olda)
            b = safe_add(b, oldb)
            c = safe_add(c, oldc)
            d = safe_add(d, oldd)
        }
        return [a, b, c, d]
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr (input) {
        var i
        var output = ''
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
        }
        return output
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl (input) {
        var i
        var output = []
        output[(input.length >> 2) - 1] = undefined
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
        }
        return output
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstr_md5 (s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac_md5 (key, data) {
        var i
        var bkey = rstr2binl(key)
        var ipad = []
        var opad = []
        var hash
        ipad[15] = opad[15] = undefined
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8)
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636
            opad[i] = bkey[i] ^ 0x5C5C5C5C
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex (input) {
        var hex_tab = '0123456789abcdef'
        var output = ''
        var x
        var i
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i)
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F)
        }
        return output
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstr_utf8 (input) {
        return unescape(encodeURIComponent(input))
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function raw_md5 (s) {
        return rstr_md5(str2rstr_utf8(s))
    }
    function hex_md5 (s) {
        return rstr2hex(raw_md5(s))
    }
    function raw_hmac_md5 (k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
    }
    function hex_hmac_md5 (k, d) {
        return rstr2hex(raw_hmac_md5(k, d))
    }

    function md5 (string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string)
            }
            return raw_md5(string)
        }
        if (!raw) {
            return hex_hmac_md5(key, string)
        }
        return raw_hmac_md5(key, string)
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return md5
        })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = md5
    } else {
        $.md5 = md5
    }
}(this))
//MD5 end
/*
*/
//  url = "http://127.0.0.1:15523/dewvpn/server/ping";
//             xhr = new XMLHttpRequest();
//             xhr.open("post", url, true);
//             var data;
//             xhr.setRequestHeader("Content-Type", "application/json");
//             data = JSON.stringify({
// 					"mode": "raw",
// 					"raw": "{\n\t\"pingip\":\"www.baidu.com\",\n\t\"pingport\":80,\n\t\"timeout\":10\n}"
// });
//             xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//             xhr.send(data);

var proxyList = [];
var fakeProxys = [{
	Id: "eyJjb250aWQiOjAsImNvdW50cnlpZCI6MCwibGluZWlkIjowLCJjYXB0aW9uIjoiVVNBIC0gTG9zIEFuZ2VsZXMgLSAzIn0=",
	caption: "USA - Los Angeles - 1",
	contid: 0,
	countryid: 0,
	lineid: 0,
	nodecount: -1,
	pingip: "128.14.131.72",
	pingport: 80,
    imageid:235
},{
	Id: "eyJjb250aWQiOjAsImNvdW50cnlpZCI6MCwibGluZWlkIjo4LCJjYXB0aW9uIjoiVVNBIC0gV2FzaGluZ3RvbiBEQyJ9",
	caption: "USA - Washington DC",
	contid: 0,
	countryid: 0,
	lineid: 8,
	nodecount: -1,
	pingip: "128.14.131.72",
	pingport: 80,
    imageid:235
},{
	Id: "eyJjb250aWQiOjAsImNvdW50cnlpZCI6MSwibGluZWlkIjozLCJjYXB0aW9uIjoiQ2FuZGEgLSBNb250cmVhbCJ9",
	caption: "Canda - Montreal",
	contid: 0,
	countryid: 1,
	lineid: 3,
	nodecount: -1,
	pingip: "128.14.131.72",
	pingport: 80,
    imageid:38
},{
	Id: "eyJjb250aWQiOjEsImNvdW50cnlpZCI6MCwibGluZWlkIjowLCJjYXB0aW9uIjoiSmFwYW4gLSBUb2t5byAtIDEifQ==",
	caption: "Japan - Tokyo - 1",
	contid: 1,
	countryid: 0,
	lineid: 0,
	nodecount: -1,
	pingip: "128.14.131.72",
	pingport: 80,
    imageid:116
}];
var storageSet = chrome.storage.local.set;
var storageGet = chrome.storage.local.get;
window.tab_info = false;

function hasClass(className, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + className + ' ');
}

function addClass(className, cls) {
    if (!hasClass(className, cls)) {
        return  className + ' ' + cls;
    }
    return className;
}

function removeClass(className, cls) {
    if (hasClass(className, cls)) {
        var newClass = ' ' + className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        return newClass.replace(/^\s+|\s+$/g, '');
    }
  	return className
}
function Toast(msg,duration){
  duration=isNaN(duration)?3000:duration;
  var m = document.createElement('div');
  m.innerHTML = msg;
  m.style.cssText="position:absolute;left:50%;top:50%; margin-left: -75px;    margin-top: -20px; min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
  document.body.appendChild(m);
  setTimeout(function() {
    var d = 0.5;
    m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
    m.style.opacity = '0';
    //setTimeout(function() { document.body.removeChild(m) }, d * 1000);
  }, duration);
}


function queryProxy() {
	chrome.runtime.sendMessage({query:true}, function(response) {
	});
}
function queryWebRTC() {
	chrome.runtime.sendMessage({webRTCState:true}, function(response) {
	});
}
function disconnect() {
	chrome.runtime.sendMessage({disconnect:true}, function(response) {
	});
}
function getProxyList() {
	return new Promise(function(res, rej) {
		chrome.runtime.sendMessage({data:true}, function(response) {
		});
	});
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "datalist") {
        proxyList = request.data;
        app.setProxyList();
        queryProxy();
        queryWebRTC();
        window.tab_info = request.tabId;
    } else if (request.set == "success") {
        //Toast("success")
        app.setConnected();
    } else if (request.set == "error") {
        Toast("disconnect", 1000)
        app.setDisconnect();
    } else if (request.query) {
        app.setSelected(request.query);
    } else if (request.disconnect) {
        app.setDisconnect()
    } else if (request.webRTCState) {
        app.setWebRTCState(request.webRTCState)
    }
	sendResponse();
});

var downloadUrl = "";
function fetchDownloadUrl() {

    xhr = new XMLHttpRequest();
    xhr.open("get", "https://user.dewvpn.com/api/bsp/url", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var jsonData = JSON.parse(xhr.responseText);
            downloadUrl = jsonData.url;
        }
    }
    xhr.onerror = function(e)  {
        fetchDownloadUrl();
    }
    xhr.send();
}
fetchDownloadUrl();

var conJsonMap = {
    "0":"images/countryicon/0.png",
    "1":"images/countryicon/1.png",
    "2":"images/countryicon/2.png",
    "3":"images/countryicon/3.png",
    "4":"images/countryicon/4.png",
    "5":"images/countryicon/5.png",
    "6":"images/countryicon/6.png",
    "7":"images/countryicon/7.png",
    "8":"images/countryicon/8.png",
    "9":"images/countryicon/9.png",
    "10":"images/countryicon/10.png",
    "11":"images/countryicon/11.png",
    "12":"images/countryicon/12.png",
    "13":"images/countryicon/13.png",
    "14":"images/countryicon/14.png",
    "15":"images/countryicon/15.png",
    "16":"images/countryicon/16.png",
    "17":"images/countryicon/17.png",
    "18":"images/countryicon/18.png",
    "19":"images/countryicon/19.png",
    "20":"images/countryicon/20.png",
    "21":"images/countryicon/21.png",
    "22":"images/countryicon/22.png",
    "23":"images/countryicon/23.png",
    "24":"images/countryicon/24.png",
    "25":"images/countryicon/25.png",
    "26":"images/countryicon/26.png",
    "27":"images/countryicon/27.png",
    "28":"images/countryicon/28.png",
    "29":"images/countryicon/29.png",
    "30":"images/countryicon/30.png",
    "31":"images/countryicon/31.png",
    "32":"images/countryicon/32.png",
    "33":"images/countryicon/33.png",
    "34":"images/countryicon/34.png",
    "35":"images/countryicon/35.png",
    "36":"images/countryicon/36.png",
    "37":"images/countryicon/37.png",
    "38":"images/countryicon/38.png",
    "39":"images/countryicon/39.png",
    "40":"images/countryicon/40.png",
    "41":"images/countryicon/41.png",
    "42":"images/countryicon/42.png",
    "43":"images/countryicon/43.png",
    "44":"images/countryicon/44.png",
    "45":"images/countryicon/45.png",
    "46":"images/countryicon/46.png",
    "47":"images/countryicon/47.png",
    "48":"images/countryicon/48.png",
    "49":"images/countryicon/49.png",
    "50":"images/countryicon/50.png",
    "51":"images/countryicon/51.png",
    "52":"images/countryicon/52.png",
    "53":"images/countryicon/53.png",
    "54":"images/countryicon/54.png",
    "55":"images/countryicon/55.png",
    "56":"images/countryicon/56.png",
    "57":"images/countryicon/57.png",
    "58":"images/countryicon/58.png",
    "59":"images/countryicon/59.png",
    "60":"images/countryicon/60.png",
    "61":"images/countryicon/61.png",
    "62":"images/countryicon/62.png",
    "63":"images/countryicon/63.png",
    "64":"images/countryicon/64.png",
    "65":"images/countryicon/65.png",
    "66":"images/countryicon/66.png",
    "67":"images/countryicon/67.png",
    "68":"images/countryicon/68.png",
    "69":"images/countryicon/69.png",
    "70":"images/countryicon/70.png",
    "71":"images/countryicon/71.png",
    "72":"images/countryicon/72.png",
    "73":"images/countryicon/73.png",
    "74":"images/countryicon/74.png",
    "75":"images/countryicon/75.png",
    "76":"images/countryicon/76.png",
    "77":"images/countryicon/77.png",
    "78":"images/countryicon/78.png",
    "79":"images/countryicon/79.png",
    "80":"images/countryicon/80.png",
    "81":"images/countryicon/81.png",
    "82":"images/countryicon/82.png",
    "83":"images/countryicon/83.png",
    "84":"images/countryicon/84.png",
    "85":"images/countryicon/85.png",
    "86":"images/countryicon/86.png",
    "87":"images/countryicon/87.png",
    "88":"images/countryicon/88.png",
    "89":"images/countryicon/89.png",
    "90":"images/countryicon/90.png",
    "91":"images/countryicon/91.png",
    "92":"images/countryicon/92.png",
    "93":"images/countryicon/93.png",
    "94":"images/countryicon/94.png",
    "95":"images/countryicon/95.png",
    "96":"images/countryicon/96.png",
    "97":"images/countryicon/97.png",
    "98":"images/countryicon/98.png",
    "99":"images/countryicon/99.png",
    "100":"images/countryicon/100.png",
    "101":"images/countryicon/101.png",
    "102":"images/countryicon/102.png",
    "103":"images/countryicon/103.png",
    "104":"images/countryicon/104.png",
    "105":"images/countryicon/105.png",
    "106":"images/countryicon/106.png",
    "107":"images/countryicon/107.png",
    "108":"images/countryicon/108.png",
    "109":"images/countryicon/109.png",
    "110":"images/countryicon/110.png",
    "111":"images/countryicon/111.png",
    "112":"images/countryicon/112.png",
    "113":"images/countryicon/113.png",
    "114":"images/countryicon/114.png",
    "115":"images/countryicon/115.png",
    "116":"images/countryicon/116.png",
    "117":"images/countryicon/117.png",
    "118":"images/countryicon/118.png",
    "119":"images/countryicon/119.png",
    "120":"images/countryicon/120.png",
    "121":"images/countryicon/121.png",
    "122":"images/countryicon/122.png",
    "123":"images/countryicon/123.png",
    "124":"images/countryicon/124.png",
    "125":"images/countryicon/125.png",
    "126":"images/countryicon/126.png",
    "127":"images/countryicon/127.png",
    "128":"images/countryicon/128.png",
    "129":"images/countryicon/129.png",
    "130":"images/countryicon/130.png",
    "131":"images/countryicon/131.png",
    "132":"images/countryicon/132.png",
    "133":"images/countryicon/133.png",
    "134":"images/countryicon/134.png",
    "135":"images/countryicon/135.png",
    "136":"images/countryicon/136.png",
    "137":"images/countryicon/137.png",
    "138":"images/countryicon/138.png",
    "139":"images/countryicon/139.png",
    "140":"images/countryicon/140.png",
    "141":"images/countryicon/141.png",
    "142":"images/countryicon/142.png",
    "143":"images/countryicon/143.png",
    "144":"images/countryicon/144.png",
    "145":"images/countryicon/145.png",
    "146":"images/countryicon/146.png",
    "147":"images/countryicon/147.png",
    "148":"images/countryicon/148.png",
    "149":"images/countryicon/149.png",
    "150":"images/countryicon/150.png",
    "151":"images/countryicon/151.png",
    "152":"images/countryicon/152.png",
    "153":"images/countryicon/153.png",
    "154":"images/countryicon/154.png",
    "155":"images/countryicon/155.png",
    "156":"images/countryicon/156.png",
    "157":"images/countryicon/157.png",
    "158":"images/countryicon/158.png",
    "159":"images/countryicon/159.png",
    "160":"images/countryicon/160.png",
    "161":"images/countryicon/161.png",
    "162":"images/countryicon/162.png",
    "163":"images/countryicon/163.png",
    "164":"images/countryicon/164.png",
    "165":"images/countryicon/165.png",
    "166":"images/countryicon/166.png",
    "167":"images/countryicon/167.png",
    "168":"images/countryicon/168.png",
    "169":"images/countryicon/169.png",
    "170":"images/countryicon/170.png",
    "171":"images/countryicon/171.png",
    "172":"images/countryicon/172.png",
    "173":"images/countryicon/173.png",
    "174":"images/countryicon/174.png",
    "175":"images/countryicon/175.png",
    "176":"images/countryicon/176.png",
    "177":"images/countryicon/177.png",
    "178":"images/countryicon/178.png",
    "179":"images/countryicon/179.png",
    "180":"images/countryicon/180.png",
    "181":"images/countryicon/181.png",
    "182":"images/countryicon/182.png",
    "183":"images/countryicon/183.png",
    "184":"images/countryicon/184.png",
    "185":"images/countryicon/185.png",
    "186":"images/countryicon/186.png",
    "187":"images/countryicon/187.png",
    "188":"images/countryicon/188.png",
    "189":"images/countryicon/189.png",
    "190":"images/countryicon/190.png",
    "191":"images/countryicon/191.png",
    "192":"images/countryicon/192.png",
    "193":"images/countryicon/193.png",
    "194":"images/countryicon/194.png",
    "195":"images/countryicon/195.png",
    "196":"images/countryicon/196.png",
    "197":"images/countryicon/197.png",
    "198":"images/countryicon/198.png",
    "199":"images/countryicon/199.png",
    "200":"images/countryicon/200.png",
    "201":"images/countryicon/201.png",
    "202":"images/countryicon/202.png",
    "203":"images/countryicon/203.png",
    "204":"images/countryicon/204.png",
    "205":"images/countryicon/205.png",
    "206":"images/countryicon/206.png",
    "207":"images/countryicon/207.png",
    "208":"images/countryicon/208.png",
    "209":"images/countryicon/209.png",
    "210":"images/countryicon/210.png",
    "211":"images/countryicon/211.png",
    "212":"images/countryicon/212.png",
    "213":"images/countryicon/213.png",
    "214":"images/countryicon/214.png",
    "215":"images/countryicon/215.png",
    "216":"images/countryicon/216.png",
    "217":"images/countryicon/217.png",
    "218":"images/countryicon/218.png",
    "219":"images/countryicon/219.png",
    "220":"images/countryicon/220.png",
    "221":"images/countryicon/221.png",
    "222":"images/countryicon/222.png",
    "223":"images/countryicon/223.png",
    "224":"images/countryicon/224.png",
    "225":"images/countryicon/225.png",
    "226":"images/countryicon/226.png",
    "227":"images/countryicon/227.png",
    "228":"images/countryicon/228.png",
    "229":"images/countryicon/229.png",
    "230":"images/countryicon/230.png",
    "231":"images/countryicon/231.png",
    "232":"images/countryicon/232.png",
    "233":"images/countryicon/233.png",
    "234":"images/countryicon/234.png",
    "235":"images/countryicon/235.png",
    "236":"images/countryicon/236.png",
    "237":"images/countryicon/237.png",
    "238":"images/countryicon/238.png",
    "239":"images/countryicon/239.png",
    "240":"images/countryicon/240.png",
    "241":"images/countryicon/241.png",
    "242":"images/countryicon/242.png",
    "243":"images/countryicon/243.png",
    "244":"images/countryicon/244.png",
    "245":"images/countryicon/245.png",
    "246":"images/countryicon/246.png",
    "247":"images/countryicon/247.png",
    "248":"images/countryicon/248.png",
    "249":"images/countryicon/249.png",
    "250":"images/countryicon/250.png",
    "251":"images/countryicon/251.png",
    "252":"images/countryicon/252.png",
    "" : "images/null.png"
};
var app = angular.module("myApp", []);
app.directive('blocksrc', function() {
    return {
        scope:{
            imgid : "@"
        },
        restrict : "AE",
        compile : function(ele, attrs, cloneTransclude) {
            return function($sc, $ele, $attrs) {
            	// console.log($ele)
            	// window.ee = $ele;
            	// console.log($sc);
            	// console.log($ele.attr("blocksrc"))
            	// $sc.$watch("contid", function() {

	            // 	$ele.attr("src",  conJsonMap[$sc.contid]&&conJsonMap[$sc.contid][$sc.countryid] );	
            	// })
            	// $sc.$watch("countryid", function() {

	            // 	$ele.attr("src",  conJsonMap[$sc.contid]&&conJsonMap[$sc.contid][$sc.countryid] );	
            	// })


                $sc.$watch("imgid", function() {
                    $ele.attr("src",  conJsonMap[$sc.imgid]); 
                })
            	//$ele.attr("src",  conJsonMap[$sc.contid]&&conJsonMap[$sc.contid][$sc.countryid] );
            }
        }
    }
});
var gScope;
app.controller("myCtrl", function($scope) {
	gScope = $scope;
	gScope.vpnOff = true;
	gScope.listShow = false;
    gScope.showPage1 = true;
    gScope.showPage11 = false;
	gScope.showPage2 = false;
	gScope.downloadNavigator = false;
	gScope.disabledCon = false;
	gScope.connecting = false;
	gScope.webRTCOpt = false;
	gScope.canvasHash = "";
	gScope.toPage1 = function() {
        gScope.showPage1 = true;
		gScope.showPage2 = false;
	}
	gScope.toPage2 = function() {
		gScope.showPage1 = false;
		gScope.showPage2 = true;
	}
	gScope.setProxy = function(proxy) {
		for(var i=0; i<$scope.proxyList.length; i++) {
			$scope.proxyList[i].className = removeClass($scope.proxyList[i].className,"active");
		};
		proxy.className = addClass(proxy.className, "active");
	}
	gScope.disconnect = function() {
		gScope.nowProxy = {nowProxy:{"contid":" ","countryid":" "}};
		disconnect();
		app.setDisconnect();
		//
	}
	gScope.connect = function() {
		for(var i=0; i<$scope.proxyList.length; i++) {
			if( hasClass($scope.proxyList[i].className,"active") ) {
				gScope.setProxydbl( $scope.proxyList[i] );
			};
		};
		//
	}

	gScope.setProxydbl = function(proxy) {
		for(var i=0; i<$scope.proxyList.length; i++){
			$scope.proxyList[i].className = removeClass($scope.proxyList[i].className,"active");
		};
		proxy.className = addClass(proxy.className, "active");
		for(var i=0; i<$scope.proxyList.length; i++){
			$scope.proxyList[i].className = removeClass($scope.proxyList[i].className,"mainbg");
		};
		gScope.connecting = true;
		gScope.nowProxy = proxy;
		proxy.className = addClass(proxy.className, "mainbg");
		chrome.runtime.sendMessage({set:proxy}, function(response) {
			console.log(response);
		});
	}
	gScope.cancelConnect = function() {
		disconnect();
		app.setDisconnect();
	}
	gScope.changeWebRTC = function() {
		gScope.webRTCState = !gScope.webRTCState;
		chrome.runtime.sendMessage({setWebRTCState:gScope.webRTCState?"enabled":"disabled"})
	}
	//canvas ip block start
	gScope.changeCanvasBlock = function () {
		gScope.gnerateNewFingerDiv = !gScope.gnerateNewFingerDiv;
		chrome.runtime.sendMessage({gnerateNewFingerDiv:gScope.gnerateNewFingerDiv})
	}
	gScope.newNoise = function () {
		chrome.runtime.sendMessage({newNoise:true}, function(response) {
			chrome.storage.local.get(null, function (o) {
				gScope.canvasHash = md5(o.data).substring(0, 30);
				gScope.$apply();
			});
		});
		
		document.querySelector(".created-noise").style.display = "block";
		setTimeout(function() {
			document.querySelector(".created-noise").style.display = "none";	
		},3000)
	}
	//canvas ip block end

    gScope.download = function() {
        window.open(downloadUrl)

    }

    gScope.clicked_install = function () {
        //alert('ff');
        //alert(window.tab_info);
        chrome.tabs.create({ url: 'https://d87hw114pqw7b.cloudfront.net/dewvpn-setup.exe' });
        chrome.tabs.create({ url: 'https://www.dewvpn.com/plugin/step2.html' });
        chrome.tabs.remove(window.tab_info);
    }
});

app.setProxyList = function() {
	gScope.listShow = true;
	gScope.proxyList = proxyList.length>0 ? proxyList : fakeProxys;
	gScope.downloadNavigator =  proxyList.length>0 ? false : true;
	gScope.disabledCon = proxyList.length>0 ? false : true;
    //gScope.vpnOff = proxyList.length>0 ?  false : true;
    if (proxyList.length < 1) {
        gScope.showPage1 = false;
        gScope.showPage11 = true;
    }
	gScope.$apply();
};
app.setSelected = function(Id) {
	if(!gScope.proxyList)return;
	for(var i=0; i<gScope.proxyList.length; i++){
		if(gScope.proxyList[i].Id==Id) {
			gScope.nowProxy = gScope.proxyList[i];
			gScope.proxyList[i].className = addClass(gScope.proxyList[i].className, "mainbg");
		}
		//gScope.proxyList[i].className = removeClass($scope.proxyList[i].className,"active");
	};
	app.setConnected();

}
app.setConnected = function() {
	gScope.connecting = false;
	gScope.vpnOff = false;
	gScope.$apply();
}
app.setDisconnect = function () {
	for(var i=0; i<gScope.proxyList.length; i++){
		gScope.proxyList[i].className = "";
	};
	gScope.connecting = false;
	gScope.vpnOff = true;
	gScope.$apply();
}
app.setWebRTCState = function (flag) {
	gScope.webRTCState = (flag == "enabled" ? true : false);
	gScope.$apply();
	// body...
}

//更新界面信息
chrome.storage.local.get(["enabled"],function(elems) {
	var { enabled = true} = elems || {};
	gScope.gnerateNewFingerDiv = enabled;
	gScope.$apply();
});

chrome.storage.local.get(null, function (o) {
	gScope.canvasHash = md5(o.data).substring(0, 30);
	gScope.$apply();
});

getProxyList()
