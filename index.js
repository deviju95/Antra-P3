// CONST
const DOM_SELECTOR = {
  INPUT_BAR_FORM: '#album-search .input-bar__form',
  INPUT_BAR_INPUT: '#album-search .input-bar__input',
  ALBUM_COUNT_WRAPPER: '.album-search__album-count-wrapper',
  ALBUM_LIST: '.album-search__album-list',
};

let ARTIST_NAME = 'gaga';

// APIs
function fetchAlbumData() {
  return fetch(
    `https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200`
  ).then((res) => res.json());
}

// FUNCTIONS
function render(element, data) {
  if (data instanceof Array) {
    return element.replaceChildren(...data);
  }

  element.replaceChildren(data);
}

function generateAlbumCount(albumCount) {
  const spanNode = document.createElement('span');

  spanNode.classList.add('album-search__album-count');
  spanNode.innerHTML = `${albumCount} albums found.`;

  const element = document.querySelector(DOM_SELECTOR.ALBUM_COUNT_WRAPPER);
  const data = spanNode;

  render(element, data);
}

function generateAlbumNode(albumData) {
  const { collectionId, collectionName, artworkUrl100 } = albumData;

  const listNode = document.createElement('li');
  const imgNode = document.createElement('img');
  const titleNode = document.createElement('h3');

  listNode.classList.add('album-search__list-item');
  listNode.id = `collection-id__${collectionId}`;

  imgNode.classList.add('album-search__img');
  imgNode.src = artworkUrl100;

  titleNode.classList.add('album-search__title');
  titleNode.innerHTML = `${collectionName}`;

  listNode.append(imgNode, titleNode);

  return listNode;
}

function renderAlbumList(albumList) {
  const result = [];
  for (let i = 0; i < albumList.length; i++) {
    const albumNode = generateAlbumNode(albumList[i]);
    result.push(albumNode);
  }

  const element = document.querySelector(DOM_SELECTOR.ALBUM_LIST);
  const data = result;

  render(element, data);
}

function inputHandler(event) {
  event.preventDefault();

  const inputElement = document.querySelector(DOM_SELECTOR.INPUT_BAR_INPUT);
  ARTIST_NAME = inputElement.value;
  console.log(ARTIST_NAME);
  fetchAlbumData().then((json) => generateAlbumCount(json.resultCount));
  fetchAlbumData().then((json) => renderAlbumList(json.results));
}

function validateInput() {
  const input = document.querySelector(DOM_SELECTOR.INPUT_BAR_INPUT);

  if (input === '') {
    alert('Artist name must be filled out');
    return false;
  }
}

// INIT
fetchAlbumData().then((json) => generateAlbumCount(json.resultCount));
fetchAlbumData().then((json) => renderAlbumList(json.results));

document
  .querySelector(DOM_SELECTOR.INPUT_BAR_FORM)
  .addEventListener('submit', inputHandler);
