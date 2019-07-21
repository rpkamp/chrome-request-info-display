const deprecationNotice = <HTMLDivElement>document.querySelector('#deprecation-notice');
const configuration = <HTMLInputElement>document.querySelector('#configuration');
const saveButton = <HTMLButtonElement>document.querySelector('#save');
const saveSuccess = <HTMLDivElement>document.querySelector('#save-success');
const saveError = <HTMLDivElement>document.querySelector('#save-error');

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

saveButton.addEventListener('click', () => {
  try {
    JSON.parse(configuration.value);
  } catch (e) {
    saveError.style.display = 'block';
    saveError.innerText = e.message;

    return;
  }

  saveError.style.display = 'none';
  saveError.innerText = '';

  saveButton.innerText = 'Saving...';

  window.chrome.runtime.sendMessage({
    action: 'saveConfiguration',
    configuration: configuration.value
  }, () => {
    saveButton.innerText = 'Save';
    saveSuccess.innerText = 'Save successful!';
    saveSuccess.style.display = 'block';
    setTimeout(() => saveSuccess.style.display = 'none', 3000);
  });
});
