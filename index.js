// CONST
const DOM_SELECTOR = {
  INPUT_BAR_FORM: '#album-search .input-bar__form',
  INPUT_BAR_INPUT: '#album-search .input-bar__input',
  ALBUM_COUNT_WRAPPER: '.album-search__album-count-wrapper',
  ALBUM_LIST: '.album-search__album-list',
  ALBUM_NEXT_BTN_WRAPPER: '.album-search__next-btn-wrapper',
  ALBUM_NEXT_BTN: '.album-search__next-btn',
};

let ARTIST_NAME = '';
let totalAlbums = [];
let renderedAlbums = [];

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

function inputHandler(event) {
  event.preventDefault();

  const inputElement = document.querySelector(DOM_SELECTOR.INPUT_BAR_INPUT);
  ARTIST_NAME = inputElement.value;
  console.log(ARTIST_NAME);

  generateLoader();

  fetchAlbumData().then((json) => {
    generateAlbumCount(json.resultCount);
    generateAlbumList(json.results);
  });
}

function generateLoader() {
  const divNode = document.createElement('div');
  divNode.classList.add('loading-spinner', 'fixed-center');

  const element = document.querySelector(DOM_SELECTOR.ALBUM_LIST);
  const data = divNode;

  render(element, data);
}

function generateAlbumCount(albumCount) {
  const spanNode = document.createElement('span');

  spanNode.classList.add('album-search__album-count');
  spanNode.innerHTML = `Total of <b>${albumCount}</b> results for "${ARTIST_NAME}"`;

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

function generateAlbumList(albumList) {
  totalAlbums = albumList.map((el) => generateAlbumNode(el));

  renderAlbumList();
}

function renderAlbumList() {
  if (totalAlbums.length > 12) generateNextAlbumBtn();
  else
    document.querySelector(DOM_SELECTOR.ALBUM_NEXT_BTN).style.display = 'none';

  renderedAlbums = totalAlbums.splice(0, 12);

  const element = document.querySelector(DOM_SELECTOR.ALBUM_LIST);
  const data = renderedAlbums;
  render(element, data);
}

function generateNextAlbumBtn() {
  const btnNode = document.createElement('button');

  btnNode.classList.add('album-search__next-btn');
  btnNode.innerHTML = 'Load Next...';
  btnNode.addEventListener('click', renderAlbumList);

  const element = document.querySelector(DOM_SELECTOR.ALBUM_NEXT_BTN_WRAPPER);
  const data = btnNode;
  render(element, data);
}

// INIT
document
  .querySelector(DOM_SELECTOR.INPUT_BAR_FORM)
  .addEventListener('submit', inputHandler);
