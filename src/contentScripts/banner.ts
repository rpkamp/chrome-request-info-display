window.chrome.runtime.onMessage.addListener((message: any) => {
  const callback = () => {
    const div = document.createElement('div');
    div.className = 'environmentIndicatorBanner';
    const shadowRoot = div.attachShadow({mode: 'open'});

    const cssFile = document.createElement('link');
    cssFile.rel = 'stylesheet';
    cssFile.href = chrome.runtime.getURL('contents.css');
    shadowRoot.appendChild(cssFile);

    const style = document.createElement('style');
    style.innerText = `.environmentIndicatorBannerContents { ${message.css} }`;
    shadowRoot.appendChild(style);

    const contents = document.createElement('div');
    contents.className = 'environmentIndicatorBannerContents';
    contents.innerHTML = message.text.replace("\n", '<br />');
    shadowRoot.appendChild(contents);

    document.body.appendChild(div);

    div.addEventListener('click', () => div.classList.toggle('environmentIndicatorBanner--left'));
  };

  if (document.readyState !== 'loading') {
    callback();
    return;
  }

  document.addEventListener('DOMContentLoaded', callback, false);
});
