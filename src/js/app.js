const fileEl = document.querySelector('input');
const overlapEl = document.querySelector('.drop-area');
const previewContainer = document.querySelector('.preview-container');
const form = document.querySelector('form');

async function fetchRequest(method, data) {
  if (method === 'GET') {
    const response = await fetch('http://localhost:7070', {
      method: 'GET',
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } if (data) {
    const formData = new FormData();
    formData.append('src', data);
    const response = await fetch('http://localhost:7070', {
      method: 'POST',
      body: formData,
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  const formData = new FormData(form);
  const response = await fetch('http://localhost:7070', {
    method: 'POST',
    body: formData,
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function showImg(img) {
  if (img.link) {
    const deleteEl = document.createElement('a');
    deleteEl.className = 'delete';
    deleteEl.setAttribute('href', '#');
    deleteEl.textContent = 'x';
    deleteEl.addEventListener('click', (e) => {
      e.preventDefault();
      fetchRequest('POST', e.target.closest('.image').querySelector('img').dataset.id)
        .then((data) => {
          showImg(data);
        });
    });
    const image = document.createElement('div');
    image.className = 'image';
    image.innerHTML = `<img src="http://localhost:7070/${img.link}" class='preview' data-id="${img.link}">`;
    image.insertAdjacentElement('beforeend', deleteEl);
    previewContainer.appendChild(image);
  } else {
    previewContainer.innerHTML = '';
    img.forEach((element) => {
      const deleteEl = document.createElement('a');
      deleteEl.className = 'delete';
      deleteEl.setAttribute('href', '#');
      deleteEl.textContent = 'x';
      deleteEl.addEventListener('click', (e) => {
        e.preventDefault();
        fetchRequest('POST', e.target.closest('.image').querySelector('img').dataset.id)
          .then((data) => {
            showImg(data);
          });
      });

      const image = document.createElement('div');
      image.className = 'image';
      image.innerHTML = `<img src="http://localhost:7070/${element}" class='preview' data-id="${element}">`;
      image.insertAdjacentElement('beforeend', deleteEl);
      previewContainer.appendChild(image);
    });
  }
}

fetchRequest('GET')
  .then((data) => {
    showImg(data); // JSON data parsed by `response.json()` call
  });

function addPreview(files, evt) {
  fetchRequest('POST')
    .then((data) => {
      console.log(data);
      showImg(data); // JSON data parsed by `response.json()` call
    });
  const element = evt.target;
  element.value = '';
}

function fileHandler(evt) {
  evt.preventDefault();
  if (evt.type === 'change') {
    addPreview(Array.from(evt.currentTarget.files), evt);
  } else if (evt.type === 'drop') {
    addPreview(Array.from(evt.dataTransfer.files), evt);
  }
}

overlapEl.addEventListener('click', () => {
  fileEl.dispatchEvent(new Event('click'));
});

fileEl.dispatchEvent(new MouseEvent('click'));

fileEl.addEventListener('change', fileHandler);

overlapEl.addEventListener('dragover', (evt) => {
  evt.preventDefault();
});

overlapEl.addEventListener('drop', fileHandler);
