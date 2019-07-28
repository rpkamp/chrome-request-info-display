import HostnameMatcher from '../HostnameMatcher';
import MessageSender = chrome.runtime.MessageSender;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;
import {LegacyResponseInfoReplacer} from "../LegacyResponseInfoReplacer";
import {ChainedResponseInfoReplacer} from "../ChainedResponseInfoReplacer";
import {MustacheResponseInfoReplacer} from "../MustacheResponseInfoReplacer";

type Config = {
  domain: string,
  text: string,
  css: string
}

let matchers: HostnameMatcher[] = [];
let configuration: Config[] = [];
const updates: { [s: string]: Function } = {};
const replacer = new ChainedResponseInfoReplacer([
  new LegacyResponseInfoReplacer(),
  new MustacheResponseInfoReplacer()
]);

const defaultConfiguration = "[\n" +
  "    {\n" +
  "        \"domain\": \".*\",\n" +
  "        \"text\": \"{{ip}}\"\n" +
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
  (data: WebResponseCacheDetails) => {
    if (data.tabId === -1) {
      return;
    }

    for (let i in matchers) {
      if (!matchers[i].matches(data.url)) {
        continue;
      }

      updates[data.tabId] = () => {
        chrome.tabs.insertCSS(
          data.tabId, {
            file: 'banner.css',
            runAt: 'document_start'
          },
          () => {
            chrome.tabs.executeScript(
              data.tabId, {
                file: 'banner.js',
                runAt: 'document_start'
              },
              () => {
                chrome.tabs.sendMessage(
                  data.tabId, {
                    text: replacer.replace(data, configuration[i].text),
                    css: 'css' in configuration[i] ? configuration[i].css : ''
                  }
                );
              }
            );
          }
        )
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
      const configuration = typeof data.configuration !== 'undefined' ? data.configuration : defaultConfiguration;
      sendResponse({configuration});
    });

    return true;
  }
});
