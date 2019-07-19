import HostnameMatcher from '../HostnameMatcher';
import replaceRequestInfo from '../replaceRequestInfo';
import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import MessageSender = chrome.runtime.MessageSender;

type Config = {
  domain: string,
  text: string,
  css: string
}

const updates: { [s: string]: Function } = {};
let matchers: HostnameMatcher[] = [];
let configuration: Config[] = [];
const defaultConfiguration = "[\n" +
  "    {\n" +
  "        \"domain\": \".*\",\n" +
  "        \"text\": \"%ip%\"\n" +
  "    }\n" +
  ']';

function init() {
  matchers = [];
  window.chrome.storage.sync.get(['configuration'], (response) => {
    configuration = response.configuration ? JSON.parse(response.configuration) : JSON.parse(defaultConfiguration);
    configuration.forEach((domain, i) => {
      matchers[i] = new HostnameMatcher(domain.domain);
    });
  });
}

init();

window.chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'complete' && tabId in updates) {
    updates[tabId]();
    delete updates[tabId];
  }
});

window.chrome.webRequest.onResponseStarted.addListener(
  (data: WebResponseHeadersDetails) => {
    if (data.tabId === -1) {
      return;
    }

    for (let i in matchers) {
      if (!matchers[i].matches(data.url)) {
        continue;
      }

      const sendMessage = () => {
        chrome.tabs.sendMessage(data.tabId, { text: replaceRequestInfo(data, configuration[i].text) });
      };

      const injectScript = () => {
        chrome.tabs.executeScript(data.tabId, {
            file: 'banner.js',
            runAt: 'document_start'
          }, sendMessage
        );
      };

      const injectCss = () => {
        chrome.tabs.insertCSS(data.tabId, {
          code: `.environmentIndicatorBanner { ${'css' in configuration[i] ? configuration[i].css : ''} }`,
          runAt: 'document_start'
        }, injectScript)
      };

      updates[data.tabId] = () => {
        chrome.tabs.insertCSS(data.tabId, {
          file: 'banner.css',
          runAt: 'document_start'
        }, injectCss)
      };
      break;
    }
  }, {
    urls: ['http://*/*', 'https://*/*'],
    types: ["main_frame"]
  },
  ['responseHeaders']
);

chrome.runtime.onMessage.addListener((message: any, sender: MessageSender, sendResponse: Function) => {
  if (message.action === 'saveConfiguration') {
    window.chrome.storage.sync.set({configuration: message.configuration}, () => {
      init();
    });

    return;
  }

  if (message.action === 'loadConfiguration') {
    window.chrome.storage.sync.get(['configuration'], (data) => {
      const response = {configuration: data.configuration ? data.configuration : defaultConfiguration};
      sendResponse(response);
    });
  }
});
