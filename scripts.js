// ----- Setup -----
populateIdeas();
validateSortButton();


// ----- Events -----
$('#inputs').on('keyup', validateButton);
$('#btn-save').on('click', saveIdea);
$('#search').on('keyup', searchIdea);
$('#sort').on('click', sortIdeas);
$('.ideas-container').on('click', '.delete', deleteIdea)
                     .on('click', '.upvote', upVote)
                     .on('click', '.downvote', downVote)
                     .on('focusout', '.edit', editElementText)
                     .on('keyup', removeEnterKeyBlur);

// ----- Functions -----
function populateIdeas() {
  for (var idea in localStorage) {
    $('.ideas-container').prepend(JSON.parse(localStorage[idea]).element);
  }
}

function saveIdea(e) {
  e.preventDefault();
  var idea = createIdea(inputs);
  setIdea(idea);
  prependIdea(idea);
  clearInputs();
  $(this).prop('disabled', true);
  validateSortButton();
}

function createIdea() {
  var inputsObj = {
    title: $('#input-title').val(),
    body: $('#input-body').val(),
    id: new Date().getTime(),
    quality: 'swill'
  }
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
  </article>`;
}

function setIdea(idea) {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function prependIdea(idea) {
  $('.ideas-container').prepend(idea.element);
}

function clearInputs() {
  $('#input-title').val('');
  $('#input-body').val('');
}

function deleteIdea() {
  removeIdea($(this).parent().prop('id'));
  $(this).parent().remove();
  validateSortButton();
}

function removeIdea(id) {
  localStorage.removeItem(id);
}

function getIdea(id) {
  return JSON.parse(localStorage.getItem(id));
}

function upVote() {
  var idea = getIdea($(this).parents('.idea').prop('id'));
  idea.quality = upQuality(idea.quality);
  idea.element = buildElement(idea);
  setIdea(idea);
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
  var idea = getIdea($(this).parents('.idea').prop('id'));
  idea.quality = downQuality(idea.quality);
  idea.element = buildElement(idea);
  setIdea(idea);
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
  var idea = getIdea($(this).parent().prop('id'));
  idea.title = $(this).parent().find('h2').text();
  idea.body = $(this).parent().find('p').text();
  idea.element = buildElement(idea);
  setIdea(idea);
  $(this).parent().replaceWith(idea.element);
}

function populateFilteredIdeas(obj) {
  for (var idea in obj) {
    $('.ideas-container').prepend(obj[idea].element);
  }
}

function removeEnterKeyBlur(e) {
  var key = e.which;
  if (key === 13) {
    $(e.target).blur();
    console.log('made ir');
  }
}

function searchIdea() {
  var searchValue = $(this).val().toUpperCase();
  $('.ideas-container').html('');
  if (searchValue !== '') {
    populateFilteredIdeas(filterObjectBy(searchValue));
  } else {
    populateIdeas();
  }
}

function filterObjectBy(value) {
  var filteredArray = localStorageToArray().filter(function(idea) {
    return idea.title.toUpperCase().indexOf(value) !== -1 ||
           idea.body.toUpperCase().indexOf(value) !== -1;
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
      var sortedObject = localStorageToArray().sort(function(a, b) {
        if (a.quality > b.quality) { return -1 }
        if (a.quality < b.quality) { return 1 }
        return 0;
      }).reduce(function(obj, idea) {
        obj[idea.id] = idea;
        return obj;
      }, {});
      populateFilteredIdeas(sortedObject);
      break;

    case 'sorted':
      $(this).toggleClass('sorted');
      $(this).text('sort');
      populateIdeas();
      break;
  }
}

function localStorageToArray() {
  var array = [];
  for (var i in localStorage) {
    array.push(JSON.parse(localStorage[i]));
  }
  return array;
}

function validateButton() {
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
