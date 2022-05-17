const allow = "DIRECT";

let settings = {
  host: null,
  port: null,
  type: null,
  site_list: [],
};

browser.runtime.sendMessage("init");

browser.runtime.onMessage.addListener(msg => {
  settings.type = msg.scheme;
  settings.host = msg.host;
  settings.port = msg.port;
  settings.site_list = msg.site_list;
});

function FindProxyForURL(url, host) {
  if (settings.host !== null && settings.port !== null) {
    return settings.type + ' ' + settings.host + ':' + settings.port;
  }
  return allow;
}
