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
    document.querySelector('#save-error').style.display = 'block';
    document.querySelector('#save-error').innerText = e.message;

    return;
  }

  document.querySelector('#save-error').style.display = 'none';
  document.querySelector('#save-error').innerText = '';

  window.chrome.runtime.sendMessage(
    {
      action: 'saveConfiguration',
      configuration: document.querySelector('#configuration').value
    },
    () => {
      document.querySelector('#save-success').innerText = 'Save successful!';
      document.querySelector('#save-success').style.display = 'block';
      setTimeout(
        () => {
          document.querySelector('#save-success').style.display = 'none';
        },
        3000
      )
    }
  );
});
