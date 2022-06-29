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

var conf = {
	username:"",
	password:"",
	confIp : "http://127.0.0.1:15523",
	errorCount : 1,
	pingurls : [""],
	addon : {
		set state (val) {
			storage.write("state", val)
		},
		get state () {
			var _state = storage.read("state");
			if (!_state || _state === 'undefined' || typeof _state === 'undefined') return 'enabled';
			else return _state;
		}
	},
    testUrls : ["http://httpbin.org/ip?","http://ip-api.com/json?","https://user.dewvpn.com/api/bsp/url?"]
};
window.tab_info = false;

var storage = (function () {
	var objs = {};
	window.setTimeout(function () {
		chrome.storage.local.get(null, function (o) {
			objs = o;
		});
	}, 300);
	return {
		"read": function (id) {
			return objs[id]
		},
		"write": function (id, data ,cb) {
			var tmp = {};
			objs[id] = data;
			tmp[id] = data;
			chrome.storage.local.set(tmp, function () { cb&&cb(); });
		}
	}
})();

var proxys = [];

//检测是否翻山成功
function testPing(succ, error){
        HTTPAPI([conf.confIp,"/dewvpn/server/list"].join("") , {}).then(function(dataJSON){
            var servers = dataJSON&&dataJSON.Servers || [];
            var avalidArr = [];
            if(servers.length>0) {
                succ();
            }else{
                error();
            }
        });
}

function HTTPAPI(url, paramsObj) {
    return new Promise(function(resove, reject) {

            //url = "http://127.0.0.1:15523/dewvpn/server/ping";
            xhr = new XMLHttpRequest();
            xhr.open("post", url, true);
            var data;
            xhr.setRequestHeader("Content-Type", "application/json");
            data = JSON.stringify(paramsObj);

            var timer = setTimeout(function() {
                resove()
            },
            11000);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    clearTimeout(timer);
                    var jsonData = JSON.parse(xhr.responseText);
                    if(jsonData.Status==0) {
                        resove(jsonData.Value);
                    }else{
                        resove(jsonData.Value);
                    }
                }
            }
            xhr.onerror = function(e)  {
                //网络错误或者服务器错误，或者其他错误
                resove()
            }
            xhr.send(data);
    })
}

function unSetProxy() {
	return new Promise(function(res, rej) {
		var config = {
		
		};
		chrome.proxy.settings.clear(
		    {},
		    function() {

                setProxy.data={};
                setProxy.Id="";
		    	res();
		});
	})
}


function setProxy(Id) {
	return new Promise(function(res, rej){
        HTTPAPI([conf.confIp,"/dewvpn/socket/new"].join("") , {
            "proxyId":Id,
            // "proxyId":"eyJjb250aWQiOjAsImNvdW50cnlpZCI6MCwibGluZWlkIjowLCJjYXB0aW9uIjoiVVNBIC0gTG9zIEFuZ2VsZXMgLSAzIn0=",
            "browserName":"chrome",
            "version":"1.0.1",
            "isForce":true
        }).then(function(dataJSON){
            //console.log(dataJSON)
            if(dataJSON&&dataJSON.addr) {
                var ip = dataJSON.addr.split(':')[0];
                var port = dataJSON.addr.split(':')[1];
                var config = {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy : {
                        scheme: "socks5",
                        host: ip,
                        port: parseInt(port)
                    },
                    bypassList: ["127.0.0.1","localhost"]
                    }
                };
                chrome.proxy.settings.set({value: config, scope: 'regular'},function() {

                    setProxy.data=dataJSON;
                    setProxy.Id = Id;
                    res()
                });
            }else{
                setIcon.off();
                unSetProxy();
                chrome.runtime.sendMessage({set:"error"});
            }
        });
        
	})
}
// setProxy.heartBeat = function() {
//     clearTimeout(setProxy.timer);
//     setProxy.timer = setTimeout(function(){
//         (function(oldTimer) {
//             HTTPAPI([conf.confIp,"/dewvpn/socket/ping"].join("") , {
//                 "socketId":setProxy.data.socketId,
//                 "timeout":10
//             }).then(function(dataJSON){
//                 console.log(dataJSON)
//                 if(oldTimer == setProxy.timer) {
//                     return setProxy.heartBeat();   
//                 }
//             });
//         })(setProxy.timer);
//     }, 2000);
// }
var heartBeat = function() {
    if(setProxy&&setProxy.data&&setProxy.data.socketId) {
        HTTPAPI([conf.confIp,"/dewvpn/socket/ping"].join("") , {
            "socketId":setProxy.data.socketId,
            "timeout":8
        }).then(function(dataJSON){
            console.log(dataJSON)
            heartBeat();
            if(dataJSON&&dataJSON.status<0) {
                //断开连接
                unSetProxy().then(function() {
                    setIcon.off();
                    setProxy.Id = "";
                    chrome.runtime.sendMessage({disconnect:true},function(){})
                });
            }
        });   
    }else{
        setTimeout(heartBeat,20*1000);
    }
}
heartBeat();

chrome.proxy.onProxyError.addListener(function(details){
    //代理异常
    unSetProxy().then(function() {
        setIcon.off();
        setProxy.Id = "";
        chrome.runtime.sendMessage({disconnect:true})
    });
})


function queryProxy() {
	return new Promise(function(res, rej) {
		chrome.proxy.settings.get({'incognito': false},
		function(config) {
			console.log(JSON.stringify(config));
			res(JSON.stringify(config));
		});

	});
}

/******
	enabled ：启动preventWebRTC
	disabled：默认开启webRTC
*****/
function webRTC (state) {
	if (chrome.privacy) {
		if (chrome.privacy.network) {
			if (chrome.privacy.network.webRTCIPHandlingPolicy) {
				var IPHandlingPolicy = (state === "enabled") ? {
					"value": 'disable_non_proxied_udp'
				}: {
					"value": 'default'
				};
				chrome.privacy.network.webRTCIPHandlingPolicy.set(IPHandlingPolicy,
				function() {
					chrome.privacy.network.webRTCIPHandlingPolicy.get({},
					function(e) {
						//console.error("IPHandlingPolicy: ", e.value);
					});
				});
			}
			/*  */
			if (chrome.privacy.network.webRTCMultipleRoutesEnabled) {
				var MultipleRoutes = {
					"value": (state === "disabled"),
					"scope": 'regular'
				};
				chrome.privacy.network.webRTCMultipleRoutesEnabled.set(MultipleRoutes,
				function() {
					chrome.privacy.network.webRTCMultipleRoutesEnabled.get({},
					function(e) {
						//console.error("MultipleRoutes: ", e.value);
					});
				});
			}
		}
	}
}

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
	//console.log(request);
	if(request.data==true){
		//main();
        getData().then(postDataToCOntent);
        // callback&&callback();
        // return ;
	}
	if(request.set) {
		//取消代理
		unSetProxy().then(function() {
			//重新设置代理
			setProxy( request.set.Id ).then(function() {
				testPing(function() {
					chrome.runtime.sendMessage({set:"success"});
                    setIcon.on();
				}, function() {
                    setIcon.off();
					unSetProxy();
					chrome.runtime.sendMessage({set:"error"});
				})
			})
		})
	}
	if(request.query) {
        
        callback&&callback();
		chrome.runtime.sendMessage({query:setProxy.Id});
        return 
	}
	if(request.disconnect) {
		unSetProxy().then(function() {
            setIcon.off();
            setProxy.Id = "";
			chrome.runtime.sendMessage({disconnect:true})
		});

	}
	if(request.pageLoad) {
		//chrome.runtime.sendMessage({pageLoad:conf.addon.state})
		//给指定的页面发送信息
		chrome.tabs.sendMessage(sender.tab.id, {pageLoad:conf.addon.state}, function () {});
		
	}
	if(request.webRTCState) {
		chrome.runtime.sendMessage({webRTCState:conf.addon.state})
	}
	if(request.setWebRTCState) {
		conf.addon.state = request.setWebRTCState=="enabled"?"enabled":"disabled";
		initWebRTC();
	}
	if(request.newNoise) {
		generateNewFingerPrint();
	}
    if((typeof request.gnerateNewFingerDiv)!="undefined") {
        storage.write("enabled",request.gnerateNewFingerDiv)
    }
	callback&&callback();
});


chrome.webRequest.onAuthRequired.addListener(function(details) {
	return {
		authCredentials:{
			username:conf.username,
			password:conf.password	
		}
	}
}, {urls: ["<all_urls>"]}, ["blocking"]);


var setIcon = {
	on : function() {
		chrome.browserAction.setIcon({path: "images/on.png"}, function () {

		})
	},
	off : function() {
		chrome.browserAction.setIcon({path: "images/off.png"}, function () {
			
		})
	}
}


window.addEventListener('online', function(){
	//https://developer.mozilla.org/zh-CN/docs/Web/API/NavigatorOnLine/onLine
	//当该属性值为false的时候，你可以说浏览器不能正常联网，但如果该属性值为true的时候，并不意味着浏览器一定能连接上互联网。还有其他一些可能引起误判的原因，比如你的电脑安装了虚拟化软件，可能会有一个虚拟网卡，这时它总是会显示正常联网。因此，如果你想得到浏览器确切的联网状态，应该使用其他额外的检查手段。
	//main();
});

window.addEventListener('offline', function(){
	//main();
});

function getData() {
	return new Promise(function(res, rej) {
		HTTPAPI([conf.confIp,"/dewvpn/server/list"].join("") , {}).then(function(dataJSON){
            var servers = dataJSON&&dataJSON.Servers || [];
            var avalidArr = [];
            for(var i=0; i<servers.length; i++) {
                if( servers[i].nodecount==-1 || servers[i].nodecount==0 ) {
                    avalidArr.push(servers[i])
                }
            };
			window.proxys = avalidArr;
			res(avalidArr)
		});
	});
}

function postDataToCOntent( list ) {
	proxys = list || [];
	//正常返回
	if(proxys.length>0) {
		postDataToCOntent.errorCount=0;
        chrome.runtime.sendMessage({ type: "datalist", data: proxys, tabId: window.tab_info},function (response) {
	    });	
	}else{
		if(postDataToCOntent.errorCount>conf.errorCount) {
            //多次错误，那就取消代理，以及代理红绿灯
            initBgProxyIconState();
            chrome.runtime.sendMessage({ type: "datalist", data: [], tabId: window.tab_info},function (response) {
		    });
		    return;
		}
		postDataToCOntent.errorCount++;
		//代理错误，或者服务器错误，取消代理重新连接;
		unSetProxy().then(function() {
			// main();
            getData().then(postDataToCOntent);
		})
	}
}
postDataToCOntent.errorCount = 0;


// canvas ip block start
var data;
var dataHash;
var g_latestUpdate;
var HashLength = 30;
var docId = getRandomString();
storage.write("docId",docId);

function initCanvasBlock() {
	data = storage.read("data");
	enabled = storage.read("enabled") || true;
	latestUpdate = storage.read("latestUpdate") || 0;
	if(data) {
	    dataHash = md5(data).substring(0, HashLength);
	    data = JSON.parse(data);
	}else{
		generateNewFingerPrint().then(function(generatedHash) {
	        dataHash = generatedHash;
	        data = storage.read("data");
		})
	}
};

function generateNewFingerPrint() {
    return new Promise((success, fail)=>{
        data = {};
        data.r = HashLength - randomIntFromInterval(0, HashLength + 10);
        data.g = HashLength - randomIntFromInterval(0, HashLength + 10);
        data.b = HashLength - randomIntFromInterval(0, HashLength + 10);
        data.a = HashLength - randomIntFromInterval(0, HashLength + 10);
        const jsonData = JSON.stringify(data);
        g_latestUpdate = Date.now();
        storage.write("data", jsonData, function() {
	        storage.write("latestUpdate", g_latestUpdate, function() {
	        	success(md5(jsonData).substring(0, HashLength));
	        })
        })
    })
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomString() {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 5; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}
// canvas ip block  end


function initWebRTC() {
	webRTC(conf.addon.state);
}

function initBgProxyIconState() {
    queryProxy().then(function(queryProxyResult) {
        //chrome.runtime.sendMessage({query:queryProxyResult})
        //走代理的情况下，才设置图标亮与灭
        //每次都要检测代理是否可用
        console.log(JSON.parse(queryProxyResult));
        if(JSON.parse(queryProxyResult).value.mode == "direct" || JSON.parse(queryProxyResult).value.mode == "system") {
            setIcon.off();
        }else{

            testPing(function() {
                chrome.runtime.sendMessage({set:"success"});
                setIcon.on();
            }, function() {
                setIcon.off();
                unSetProxy();
                chrome.runtime.sendMessage({set:"error"});
            })
        }
    });
}

// initBgProxyIconState();
unSetProxy().then(function(){
    setIcon.off();
})
initWebRTC();
setTimeout(initCanvasBlock, 1000)


chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        // install
        //window.open('https://www.dewvpn.com/plugin/step1.html');
        chrome.tabs.create({
            url: "https://www.dewvpn.com/plugin/step1.html"
        }, function (tab) {
                //window.tab_info = tab.id;
                //chrome.runtime.sendMessage({ tabFlag: true, tabId: tab.id });
                window.tab_info = tab.id;
        })
    }
    if (details.reason === 'update') {
        // 更新事件
        //window.open('https://www.dewvpn.com/plugin/step1.html');
    }

});