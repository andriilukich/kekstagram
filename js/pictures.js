'use strict';

var PHOTOS_AMOUNT = 25;
var LIKES_NUMBER = {
  MIN: 15,
  MAX: 200
};
var COMMENTS_LIST = [
  'Всё отлично! ',
  'В целом всё неплохо. Но не всё. ',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально. ',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше. ',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше. ',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?! '
];
var DESCRIPTION_LIST = [
  'Тестим новую камеру! ',
  'Затусили с друзьями на море ',
  'Как же круто тут кормят ',
  'Отдыхаем... ',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами...... ',
  'Вот это тачка! '
];
var pictures = [];

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomCom = function (data) {
  var newCom = [];
  var maxIter = getRandomNumber(1, 2);
  for (var i = 0; i < maxIter; i++) {
    var randomNumber = getRandomNumber(0, data.length - 1);
    if (!newCom.includes(data[randomNumber])) {
      newCom.push(data[randomNumber]);
    } else {
      --i;
    }
  }

  return newCom;
};

var getRandomDescr = function (data) {
  return data[getRandomNumber(0, data.length - 1)];
};

var createPicture = function (i) {
  var newPicture = {
    url: 'photos/' + (i + 1) + '.jpg',
    likes: getRandomNumber(LIKES_NUMBER.MIN, LIKES_NUMBER.MAX),
    comments: getRandomCom(COMMENTS_LIST),
    description: getRandomDescr(DESCRIPTION_LIST)
  };
  return newPicture;
};

for (var i = 0; i < PHOTOS_AMOUNT; i++) {
  pictures.push(createPicture(i));
}

// Create TEMPLATE of pictures
var PHOTO_TEMPLATE = document.querySelector('#picture').content.querySelector('.picture');
var PICTURE_CONTAINER = document.querySelector('.pictures');
var photoFragment = document.createDocumentFragment();

var renderPhoto = function (item) {
  var newPhoto = PHOTO_TEMPLATE.cloneNode(true);
  newPhoto.querySelector('.picture__img').src = item.url;
  newPhoto.querySelector('.picture__likes').textContent = item.likes;
  newPhoto.querySelector('.picture__comments').textContent = item.comments;

  return newPhoto;
};

for (var index = 0; index < pictures.length - 1; index++) {
  photoFragment.appendChild(renderPhoto(pictures[index]));
}

PICTURE_CONTAINER.appendChild(photoFragment);

// Upgrade of Big-picture
var BIG_PIC_CONTAINER = document.querySelector('.big-picture');
var COM_CONTAINER = document.querySelector('.social__comments');
var COM_COUNT = document.querySelector('.social__comment-count');
var COM_LOADER = document.querySelector('.social__comments-loader');
var AVATAR_NUMBER = {
  MIN: 1,
  MAX: 6
};
BIG_PIC_CONTAINER.classList.remove('hidden');
COM_LOADER.classList.add('visually-hidden');
COM_COUNT.classList.add('visually-hidden');

BIG_PIC_CONTAINER.querySelector('.big-picture__img img').src = pictures[0].url;
BIG_PIC_CONTAINER.querySelector('.likes-count').textContent = pictures[0].likes;
BIG_PIC_CONTAINER.querySelector('.comments-count').textContent = pictures[0].comments.length;
BIG_PIC_CONTAINER.querySelector('.social__caption').textContent = pictures[0].description;

// Create COMMENT for a picture
var createCom = function (data) {
  var liItem = document.createElement('li');
  liItem.classList.add('social__comment');
  var imgItem = document.createElement('img');
  imgItem.classList.add('social__picture');
  imgItem.src = 'img/avatar-'
    + getRandomNumber(AVATAR_NUMBER.MIN, AVATAR_NUMBER.MAX)
    + '.svg';
  imgItem.alt = 'Аватар комментатора фотографии';
  imgItem.width = 35;
  imgItem.height = 35;
  liItem.appendChild(imgItem);
  var pItem = document.createElement('p');
  pItem.classList.add('social__text');
  pItem.textContent = data.comments.join('');
  liItem.appendChild(pItem);
  return liItem;
};

var comFragment = document.createDocumentFragment();
for (var ind = 0, j = getRandomNumber(1, 2); ind < j; ind++) {
  comFragment.appendChild(createCom(pictures[ind]));
}

COM_CONTAINER.appendChild(comFragment);
