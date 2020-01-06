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

// Create COMMENT for a Big picture
var bigPicContainer = document.querySelector('.big-picture');
var comContainer = bigPicContainer.querySelector('.social__comments');
var comCount = bigPicContainer.querySelector('.social__comment-count');
var comLoader = bigPicContainer.querySelector('.social__comments-loader');
var AVATAR_NUMBER = {
  MIN: 1,
  MAX: 6
};

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

var setNewCom = function () {
  comLoader.classList.add('visually-hidden');
  comCount.classList.add('visually-hidden');
  comContainer.appendChild(comFragment);
};

/*---------------------

        Show the Big picture:
          - Add event.listener to document, which is tracking the target
          - Through the target gets info about photo
          - Set photos info to Big picture

        Clouse the Big picture:
          - Track clicks on #picture-cancel and add class to Big Picture HIDDEN

----------------------*/

var btnBigPictureCancel = bigPicContainer.querySelector('#picture-cancel');

// Upgrade of Big-picture

var updateBigPictureInfo = function (index) {
  bigPicContainer.querySelector('.big-picture__img img').src = pictures[index].url;
  bigPicContainer.querySelector('.likes-count').textContent = pictures[index].likes;
  bigPicContainer.querySelector('.comments-count').textContent = pictures[index].comments.length;
  bigPicContainer.querySelector('.social__caption').textContent = pictures[index].description;
};

var onPictureClick = function (index) {
  updateBigPictureInfo(index);
  setNewCom();
  bigPicContainer.classList.remove('hidden');
};

var onPreviewPictureClick = function (evt) {
  var target = evt.target;

  if (target.nodeName === 'IMG') {
    var srcImgTarget = evt.target.attributes.src.value;

    for (var i = 0; i < pictures.length; i++) {
      if (srcImgTarget === pictures[i].url) {
        onPictureClick(i);
      }
    }
  }
  document.addEventListener('keydown', onBigPictureEscPress);
};

var ESC_KEYCODE = 27;

var closeBigPicture = function () {
  bigPicContainer.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
  }
};

document.addEventListener('click', function (evt) {
  onPreviewPictureClick(evt);
});

btnBigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});

/*---------------------

        Loading the photo and showing the form of setting it
          - remove class hidden form container .img-upload__overlay
            as input type=file tracked change;
          - after clousing the form (adding the class hidden), needs to set value of input to empty string;

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

var setUploadedPhotoOpen = document.querySelector('#upload-file');
var imgUploadContainer = document.querySelector('.img-upload__overlay');
var setUploadedPhotoClose = document.querySelector('.img-upload__cancel');
var imgUploadPreview = document.querySelector('.img-upload__preview img');
var pinContainer = document.querySelector('.effect-level__line');
var pinLevel = pinContainer.querySelector('.effect-level__pin');

var getPinLevel = function () {
  var pinLeft = pinLevel.offsetLeft;
  var pinContainerWidth = pinContainer.offsetWidth;
  return Math.floor(pinLeft * 100 / pinContainerWidth);
};

var setFilterValue = function (filterName) {
  var imgStyle = imgUploadPreview.style;
  if (filterName !== 'blur') {
    imgStyle.WebkitFilter = filterName + '(' + getPinLevel() + '%)';
  } else {
    imgStyle.WebkitFilter = filterName + '(' + getPinLevel() / 10 + 'px)';
  }
};

var onFilterClick = function (evt) {
  var target = evt.target;
  if (target.type === 'radio') {
    var filterType = target.value;
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

    setFilterValue(filterName);
  }
};

var scaleControlBtnSmaller = imgUploadContainer.querySelector('.scale__control--smaller');
var scaleControlBtnBigger = imgUploadContainer.querySelector('.scale__control--bigger');
var scaleControlInput = imgUploadContainer.querySelector('.scale__control--value');

var scaleValue = {
  MIN_STEP: 25,
  MAX: 100
};
scaleControlInput.value = scaleValue.MAX + '%';
var scaleControlInputValue;

var closePopup = function () {
  imgUploadContainer.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  document.removeEventListener('click', onFilterClick);
  setUploadedPhotoOpen.value = '';
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  imgUploadContainer.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
  document.addEventListener('click', onFilterClick);
};

var reducePhoto = function () {
  scaleControlInputValue = parseInt(scaleControlInput.value, 10);
  if (scaleControlInputValue > scaleValue.MIN_STEP) {
    imgUploadPreview.style.transform = 'scale(' + (scaleControlInputValue - scaleValue.MIN_STEP) / scaleValue.MAX + ')';
    scaleControlInput.value = scaleControlInputValue - scaleValue.MIN_STEP + '%';
  }
};

var enlargePhoto = function () {
  scaleControlInputValue = parseInt(scaleControlInput.value, 10);
  if (scaleControlInputValue < scaleValue.MAX) {
    imgUploadPreview.style.transform = 'scale(' + (scaleControlInputValue + scaleValue.MIN_STEP) / scaleValue.MAX + ')';
    scaleControlInput.value = scaleControlInputValue + scaleValue.MIN_STEP + '%';
  }
};

scaleControlBtnSmaller.addEventListener('click', reducePhoto);
scaleControlBtnBigger.addEventListener('click', enlargePhoto);

pinLevel.addEventListener('mouseup', function () {
  var filterName = imgUploadPreview.style.filter.split('(')[0];
  setFilterValue(filterName);
});

setUploadedPhotoOpen.addEventListener('change', function () {
  openPopup();
});

setUploadedPhotoClose.addEventListener('click', function () {
  closePopup();
});

/*---------------------

        Hashtags validation:
          - Add a listener to the field
          - Write a check under all conditions
          - As well as a hint for the user

        Comments validation:
          - Add a listener to the textarea
          - Write a check under all conditions
          - As well as a hint for the user

----------------------*/
var form = document.querySelector('#upload-select-image');
var inputHashtags = form.querySelector('.text__hashtags');
var inputComments = form.querySelector('.text__description');
var btnSubmitForm = form.querySelector('#upload-submit');

var MAX_HASHTAGS_NUMBER = 5;
var MIN_HASHTAGS_LENGTH = 1;
var MAX_HASHTAGS_LENGTH = 20;
var MAX_COMMENT_LENGTH = 140;

var chackHashtags = function (list) {
  inputHashtags.setCustomValidity('');
  var hashtagsList = list.split(' ');
  var message = '';
  if (hashtagsList.length > MAX_HASHTAGS_NUMBER) {
    message = 'The maximum allowed number of hashtag should not exceed 5. ';
  } else {
    for (var i = 0; i < hashtagsList.length; i++) {
      if (hashtagsList[i][0] !== '#') {
        message += 'The hashtag must begin with the "#" sign.';
      } else if (hashtagsList[i].length === MIN_HASHTAGS_LENGTH) {
        message += 'The hashtag cannot consist of a single "#" character. ';
      } else if (hashtagsList[i].length > MAX_HASHTAGS_LENGTH) {
        message += 'The maximum length of the hashtag should not exceed 20 characters. ';
      }
      var hashtagRepeatCheck = hashtagsList[i].toLowerCase();
      for (var j = i + 1; j < hashtagsList.length; j++) {
        if (hashtagRepeatCheck === hashtagsList[j].toLowerCase()) {
          message += 'Your hashtag (' + hashtagsList[j] + ') cannot be repeated. ';
        }
      }
    }
  }
  if (message) {
    inputHashtags.style.outlineColor = 'red';
    inputHashtags.setCustomValidity(message);
  }
};

var checkComments = function () {
  if (inputComments.value > MAX_COMMENT_LENGTH) {
    inputComments.setCustomValidity('Comment length must not exceed 140 characters');
    inputComments.style.outlineColor = 'red';
  }
};

btnSubmitForm.addEventListener('click', function () {
  chackHashtags(inputHashtags.value);
  checkComments(inputComments.value);
});

