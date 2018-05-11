window.chrome.runtime.onMessage.addListener((message) => {
  const callback = () => {
    const div = document.createElement('div');
    div.className = 'environmentIndicatorBanner';
    div.innerHTML = message.text.replace("\n", '<br />');

    div.addEventListener('click', () => {
      if (/environmentIndicatorBanner--left/.test(div.className)) {
        div.className = 'environmentIndicatorBanner';
      } else {
        div.className = 'environmentIndicatorBanner environmentIndicatorBanner--left';
      }
    });

    document.querySelector('body').appendChild(div);
  };

  if (document.readyState !== 'loading') {
    callback();
    return;
  }

  document.addEventListener('DOMContentLoaded', callback, false);
});
