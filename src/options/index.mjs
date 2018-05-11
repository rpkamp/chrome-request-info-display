window.chrome.runtime.sendMessage({action: 'loadConfiguration'}, (response) => {
  document.querySelector('#configuration').value = response.configuration;
});

document.querySelector('#license-toggle').addEventListener('click', () => {
  document.querySelector('#license-toggle').style.display = 'none';
  document.querySelector('#license').style.display = 'block';
});

const saveButton = document.querySelector('#save');
saveButton.addEventListener('click', () => {
  try {
    JSON.parse(document.querySelector('#configuration').value);
  } catch (e) {
    document.querySelector('#json-error').style.display = 'block';
    document.querySelector('#json-error').innerText = e.message;

    return;
  }

  document.querySelector('#json-error').style.display = 'none';
  document.querySelector('#json-error').innerText = '';

  saveButton.innerText = 'Saving...';

  window.chrome.runtime.sendMessage({
    action: 'saveConfiguration',
    configuration: document.querySelector('#configuration').value
  });

  saveButton.innerText = 'Save';
});
