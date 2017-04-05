// ----- Setup -----
populateIdeas();

// ----- Events -----
$('#btn-save').on('click', function (e) {
  e.preventDefault();
  var inputs = getInputValues();
  var idea = createIdea(inputs);
  setIdea(idea);
  addIdea(idea);
  clearInputs();
  $('#btn-save').prop('disabled', true);
});

$('.ideas-container').on('click', function(e) {
  var childId = $(e.target).parent()[0].id;
  var idea = getIdea($(e.target).parent().parent()[0].id);
  switch(e.target.id) {
    case 'delete':
      $(e.target).parent().remove();
      removeIdea(childId);
      break;
    case 'upvote':
      idea.quality = upQuality(idea.quality);
      idea.element = buildElement(idea);
      setIdea(idea);
      $(e.target).parent().parent().replaceWith(idea.element);
      break;
    case 'downvote':
      idea.quality = downQuality(idea.quality);
      idea.element = buildElement(idea);
      setIdea(idea);
      $(e.target).parent().parent().replaceWith(idea.element);
      break;
  }
});

$('#inputs').on('keyup', function () {
  if ($('#input-title').val() !== "" && $('#input-body').val() !== "") {
    $('#btn-save').prop('disabled', false);
  } else {
    $('#btn-save').prop('disabled', true);
  }
});

$('#search').on('keyup', function() {
  $('.ideas-container').html('');
  var searchValue = $(this).val().toUpperCase();
  if (searchValue !== '') {
    var filteredArray = [];
    for (var i in localStorage) {
      filteredArray.push(JSON.parse(localStorage[i]));
    }
    filteredArray = filteredArray.filter(function(idea) {
      return idea.title.toUpperCase().indexOf(searchValue) !== -1 ||
             idea.body.toUpperCase().indexOf(searchValue) !== -1;
    });
    var filteredObj = filteredArray.reduce(function(obj, idea) {
      obj[idea.id] = idea;
      return obj;
    }, {});
    for (var idea in filteredObj) {
      $('.ideas-container').prepend(filteredObj[idea].element);
    }
  } else {
    populateIdeas();
  }
});



$('.ideas-container').on('keyup', function (e) {
  var key = e.which;

  if (key === 13) {
    $(e.target).blur();
  }
});

$('.ideas-container').on('focusout', function(e) {
  var idea = getIdea($(e.target).parent()[0].id);
  idea.title = $(this).find(`h2.${idea.id}`).text();
  idea.body = $(this).find(`p.${idea.id}`).text();
  idea.element = buildElement(idea);
  setIdea(idea);
  $(e.target).parent().replaceWith(idea.element);
});

// ----- Function -----
function getInputValues() {
  var title = $('#input-title').val();
  var body = $('#input-body').val();
  return {
    title: title,
    body: body,
    id: new Date().getTime(),
    quality: 'swill'
  };
}

function createIdea(inputs) {
  return {
      title: inputs.title,
      body: inputs.body,
      id: inputs.id,
      element: buildElement(inputs),
      quality: 'swill'
  };
}

function buildElement(obj) {
  return `<article id='${obj.id}' class='idea'> \
  <h2 class='${obj.id}' contenteditable>${obj.title}</h2> \
  <div id='delete'></div> \
  <p class='${obj.id}' contenteditable>${obj.body}</p> \
  <div id='vote'> \
  <div id='upvote'></div> \
  <div id='downvote'></div> \
  quality: <span id='quality'>${obj.quality}</span> \
  </div> \
  </article>`;
}

function addIdea(idea) {
  $('.ideas-container').prepend(idea.element);
}

function clearInputs() {
  $('#input-title').val('');
  $('#input-body').val('');
}

function getIdea(id) {
  return JSON.parse(localStorage.getItem(id));
}

function setIdea(idea) {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function removeIdea(id) {
  localStorage.removeItem(id);
}

function populateIdeas() {
  for (var idea in localStorage) {
    $('.ideas-container').prepend(JSON.parse(localStorage[idea]).element);
  }
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
