window.chrome.runtime.onMessage.addListener((message: any) => {
  const callback = () => {
    const div = document.createElement('div');
    div.className = 'environmentIndicatorBanner';

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = chrome.runtime.getURL('contents.css');

    const contents = document.createElement('div');
    contents.className = 'environmentIndicatorBannerContents';
    contents.innerHTML = message.text.replace("\n", '<br />');

    const shadowRoot = div.attachShadow({mode: 'open'});
    shadowRoot.appendChild(style);
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
