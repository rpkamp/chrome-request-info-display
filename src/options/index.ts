const configuration = <HTMLInputElement>document.querySelector('#configuration');
const jsonError = <HTMLDivElement>document.querySelector('#json-error');
const deprecationNotice = <HTMLDivElement>document.querySelector('#deprecation-notice');

chrome.runtime.sendMessage({action: 'loadConfiguration'}, (response) => {
  if (response.configuration.indexOf('%') !== -1) {
    deprecationNotice.innerHTML = 'Your configuration appears to contain deprecated placeholders with % signs.<br />' +
      'Please replace them with the new {{ }} placeholder syntax. See below.';
    deprecationNotice.style.display = 'block';
  }

  configuration.value = response.configuration;
});

let licenceToggle = <HTMLLinkElement>document.querySelector('#license-toggle');
licenceToggle.addEventListener('click', () => {
  licenceToggle.style.display = 'none';
  (document.querySelector('#license') as HTMLDivElement).style.display = 'block';
});

const saveButton = <HTMLButtonElement>document.querySelector('#save');
saveButton.addEventListener('click', () => {
  try {
    JSON.parse(configuration.value);
  } catch (e) {
    jsonError.style.display = 'block';
    jsonError.innerText = e.message;

    return;
  }

  jsonError.style.display = 'none';
  jsonError.innerText = '';

  saveButton.innerText = 'Saving...';

  window.chrome.runtime.sendMessage({
    action: 'saveConfiguration',
    configuration: configuration.value
  });

  saveButton.innerText = 'Save';
});
