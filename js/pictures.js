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
var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
var pictureContainer = document.querySelector('.pictures');
var photoFragment = document.createDocumentFragment();

var renderPhoto = function (item) {
  var newPhoto = photoTemplate.cloneNode(true);
  newPhoto.querySelector('.picture__img').src = item.url;
  newPhoto.querySelector('.picture__likes').textContent = item.likes;
  newPhoto.querySelector('.picture__comments').textContent = getRandomNumber(5, 100);

  return newPhoto;
};

for (var i = 0; i < pictures.length; i++) {
  photoFragment.appendChild(renderPhoto(pictures[i]));
}

pictureContainer.appendChild(photoFragment);

// Upgrade of Big-picture
var bigPicContainer = document.querySelector('.big-picture');
// var comContainer = document.querySelector('.social__comments');
// var comCount = document.querySelector('.social__comment-count');
// var comLoader = document.querySelector('.social__comments-loader');
var AVATAR_NUMBER = {
  MIN: 1,
  MAX: 6
};

bigPicContainer.querySelector('.big-picture__img img').src = pictures[0].url;
bigPicContainer.querySelector('.likes-count').textContent = pictures[0].likes;
bigPicContainer.querySelector('.comments-count').textContent = pictures[0].comments.length;
bigPicContainer.querySelector('.social__caption').textContent = pictures[0].description;

// Create COMMENT for a picture
var createCom = function (data) {
  var liItem = document.createElement('li');
  var imgItem = document.createElement('img');
  var pItem = document.createElement('p');

  liItem.classList.add('social__comment');

  imgItem.classList.add('social__picture');
  imgItem.src = 'img/avatar-'
    + getRandomNumber(AVATAR_NUMBER.MIN, AVATAR_NUMBER.MAX)
    + '.svg';
  imgItem.alt = 'Аватар комментатора фотографии';
  imgItem.width = 35;
  imgItem.height = 35;
  liItem.appendChild(imgItem);

  pItem.classList.add('social__text');
  pItem.textContent = data.comments.join('');
  liItem.appendChild(pItem);
  return liItem;
};

var comFragment = document.createDocumentFragment();
for (var i = 0, j = getRandomNumber(1, 2); i < j; i++) {
  comFragment.appendChild(createCom(pictures[i]));
}

// bigPicContainer.classList.remove('hidden');
// comLoader.classList.add('visually-hidden');
// comCount.classList.add('visually-hidden');
// comContainer.appendChild(comFragment);



// id upload-file > change, remove class hidden from img-upload__overlay
// as you add class Hidden to img-upload_overlay, needs to clean input file
/*---------------------

        Loading the photo and showing the form of setting it
          - remove class hidden form container .img-upload__overlay
            as input type=file tracked change;
          - after clousing the form (adding the class hidden), needs to set value of input to empty string;

----------------------*/

var uploadFileInput = document.querySelector('#upload-file');
var imgUploadContainer = document.querySelector('.img-upload__overlay');
var imgUploadCancel = document.querySelector('.img-upload__cancel');

uploadFileInput.addEventListener('change', function () {
  imgUploadContainer.classList.remove('hidden');
});

imgUploadCancel.addEventListener('click', function () {
  imgUploadContainer.classList.add('hidden');
  uploadFileInput.value = '';
});


/*---------------------

        Filters level:
          - got level-pin container .effect-level__line width
          - trackking level-pin .effect-level__pin on mouse up
          - finded the proportion of level-pin to it's container
          - set it's value to filter property
        Filters btn:
          - Delegation tracking click filter switching buttons
          - Determining the type of filter
          - Assigning this class to a photograph
          - The value of this filter is moderated due to the level

----------------------*/

var imgUploadPreview = document.querySelector('.img-upload__preview img');
var pinContainer = document.querySelector('.effect-level__line');
var pinLevel = pinContainer.querySelector('.effect-level__pin');

var getPinLevel = function () {
  var pinLeft = pinLevel.offsetLeft;
  var pinContainerWidth = pinContainer.offsetWidth;
  return Math.floor(pinLeft * 100 / pinContainerWidth);
};

var setFilterValue = function () {
  var imgStyle = imgUploadPreview.style;
  var filterType = imgUploadPreview.classList[0].slice(18);
  var filterName = '';

  switch (filterType) {
    case 'chrome':
      filterName = 'grayscale';
      break;
    case 'marvin':
      filterName = 'invert';
      break;
    case 'phobos':
      filterName = 'blur';
      break;
    case 'heat':
      filterName = 'brightness';
      break;
    case 'sepia':
      filterName = 'sepia';
  }

  if (filterName !== 'blur') {
    imgStyle.WebkitFilter = filterName + '(' + getPinLevel() + '%)';
  } else {
    imgStyle.WebkitFilter = filterName + '(' + getPinLevel() + 'px)';
  }
};

pinLevel.addEventListener('mouseup', function () {
  setFilterValue();
});

document.addEventListener('click', function (evt) {
  var target = evt.target;
  if (target.type === 'radio') {
    imgUploadPreview.setAttribute('class', '');
    imgUploadPreview.setAttribute('style', '');
    imgUploadPreview.classList.add('effects__preview--' + target.value);
  }
});
