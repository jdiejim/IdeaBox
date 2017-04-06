// ----- Setup -----
populateIdeasContainer();
validateSortButton();
fetchTags();

// ----- Events -----
$('#inputs').on('keyup', validateSaveButton);
$('#btn-save').on('click', saveIdea);
$('#search').on('keyup', searchIdea);
$('#sort').on('click', sortIdeas);
$('.tag').on('click', addTag)
$('.ideas-container').on('click', '.delete', deleteIdea)
                     .on('click', '.upvote', upVote)
                     .on('click', '.downvote', downVote)
                     .on('focusout', '.edit', editElementText)
                     .on('keyup', enterKeyBlur);

// ----- Functions -----
function populateIdeasContainer() {
  for (var idea in localStorage) {
    $('.ideas-container').prepend(JSON.parse(localStorage[idea]).element);
  }
}

function saveIdea(e) {
  e.preventDefault();
  var idea = createIdeaObject();
  storeIdea(idea);
  prependIdea(idea);
  clearInputs();
  $(this).prop('disabled', true);
  validateSortButton();
  fetchTags();
}

function createIdeaObject() {
  var inputsObj = {
    title: $('#input-title').val(),
    body: $('#input-body').val(),
    id: new Date().getTime(),
    quality: 'swill',
    tags: $('#input-tags').val().split(' ')
  }
  inputsObj.tagsElement = buildTags(inputsObj.tags);
  inputsObj.element = buildElement(inputsObj);
  return inputsObj;
}

function buildElement(obj) {
  return `<article id='${obj.id}' class='idea'>
  <h2 class='edit' contenteditable>${obj.title}</h2>
  <div class='delete'></div>
  <p class='edit' contenteditable>${obj.body}</p>
  <div class='vote'>
  <div class='upvote'></div>
  <div class='downvote'></div>
  quality: <span class='quality'>${obj.quality}</span>
  </div>
  <div class='tags'>${obj.tagsElement}</div>
  </article>`;
}

function buildTags(array) {
  var tagElements = '';
  array.forEach(function(tag) {
    tagElements += '<div class="tag">' + tag + '</div>';
  });
  return tagElements;
}

function storeIdea(idea) {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function prependIdea(idea) {
  $('.ideas-container').prepend(idea.element);
}

function clearInputs() {
  $('#input-title').val('');
  $('#input-body').val('');
  $('#input-tags').val('');
}

function deleteIdea() {
  removeIdeaFromStorage($(this).parent().prop('id'));
  $(this).parent().remove();
  validateSortButton();
}

function removeIdeaFromStorage(id) {
  localStorage.removeItem(id);
}

function retrieveIdea(id) {
  return JSON.parse(localStorage.getItem(id));
}

function upVote() {
  var idea = retrieveIdea($(this).parents('.idea').prop('id'));
  idea.quality = upQuality(idea.quality);
  idea.element = buildElement(idea);
  storeIdea(idea);
  $(this).parents('.idea').replaceWith(idea.element);
}

function upQuality(quality) {
  switch(quality) {
    case 'swill':
      return 'plausible';
    case 'plausible':
      return 'genius';
    case 'genius':
      return 'genius';
  }
}

function downVote() {
  var idea = retrieveIdea($(this).parents('.idea').prop('id'));
  idea.quality = downQuality(idea.quality);
  idea.element = buildElement(idea);
  storeIdea(idea);
  $(this).parents('.idea').replaceWith(idea.element);
}

function downQuality(quality) {
  switch(quality) {
    case 'swill':
      return 'swill';
    case 'plausible':
      return 'swill';
    case 'genius':
      return 'plausible';
  }
}

function editElementText() {
  var idea = retrieveIdea($(this).parent().prop('id'));
  idea.title = $(this).parent().find('h2').text();
  idea.body = $(this).parent().find('p').text();
  idea.element = buildElement(idea);
  storeIdea(idea);
  $(this).parent().replaceWith(idea.element);
}

function populateRevisedIdeasContainer(obj) {
  for (var idea in obj) {
    $('.ideas-container').prepend(obj[idea].element);
  }
}

function enterKeyBlur(e) {
  var key = e.which;
  if (key === 13) {
    $(e.target).blur();
  }
}

function searchIdea() {
  var searchValue = $(this).val().toUpperCase();
  $('.ideas-container').html('');
  if (searchValue !== '') {
    populateRevisedIdeasContainer(filterObjectBy(searchValue));
  } else {
    populateIdeasContainer();
  }
}

function filterObjectBy(value) {
  var filteredArray = retrieveForStagingArray().filter(function(idea) {
    return idea.title.toUpperCase().indexOf(value) !== -1 ||
           idea.body.toUpperCase().indexOf(value) !== -1 ||
           idea.tags.join(' ').toUpperCase().indexOf(value) !== -1;
  });
  var filteredObj = filteredArray.reduce(function(obj, idea) {
    obj[idea.id] = idea;
    return obj;
  }, {});
  return filteredObj;
}

function sortIdeas() {
  $('.ideas-container').html('');
  switch ($(this).prop('class')) {
    case '':
      $(this).toggleClass('sorted');
      $(this).text('sorted');
      populateRevisedIdeasContainer(sortedObject());
      break;
    case 'sorted':
      $(this).toggleClass('sorted');
      $(this).text('sort');
      populateIdeasContainer();
      break;
  }
}

function sortedObject() {
  var sortedArray = retrieveForStagingArray().sort(function(a, b) {
    if (a.quality > b.quality) { return -1 }
    if (a.quality < b.quality) { return 1 }
    return 0;
  })
  var sortedObject = sortedArray.reduce(function(obj, idea) {
    obj[idea.id] = idea;
    return obj;
  }, {});
  return sortedObject;
}

function retrieveForStagingArray() {
  var array = [];
  for (var i in localStorage) {
    array.push(JSON.parse(localStorage[i]));
  }
  return array;
}

function validateSaveButton() {
  if ($('#input-title').val() !== "" && $('#input-body').val() !== "") {
    $('#btn-save').prop('disabled', false);
  } else {
    $('#btn-save').prop('disabled', true);
  }
}

function validateSortButton() {
  if ($('.ideas-container').html() !== '') {
    $('#sort').prop('disabled', false);
  } else {
    $('#sort').prop('disabled', true);
  }
}

function addTag() {
  var tags = $('#input-tags').val();
  tags += $(this).text() + ' ';
  $('#input-tags').val(tags);
}

function fetchTags() {
  $('.tags-container').html('');
  var newArr = [];
  var arr = retrieveForStagingArray();
  arr.forEach(function(e) {
    newArr = newArr.concat(e.tags);
  })
  newArr = newArr.filter(function(element, i) {
    return newArr.indexOf(element) === i;
  });
  var string = buildTags(newArr);
  $('.tags-container').prepend(string);
}
