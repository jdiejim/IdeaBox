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

// BUG: votes add aditional article to old article
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

// TODO: Search Input: on keyup, test if empty

$('.ideas-container').on('keyup',, function (e) {
  var idea = getIdea($(e.target).parent()[0].id);
  console.log(idea.title);
  var key = e.which;

  idea.title = $('#idea-title').text();
  console.log("this.find ", $(this).find('#idea-title'));
  console.log("title: ", idea.title);
  idea.body = $('#idea-body').text();
  console.log(idea.id);
  
  if (key === 27) {
    // loses something
    $(e.target).parent().parent().html(idea.element);
    $(e.target).blur();
  } else if (key === 13) {
    // BUG: except for that weird div it makes that disappears on refresh?
    idea.element = buildElement(idea);
    // console.log("idea 2: ",idea);
    setIdea(idea);
    $(e.target).blur();
    $(e.target).parent().replaceWith(idea.element);
  }
});

$(document).on('click', function(e) {
  if (!$(e.target).closest('.ideas-container').length) {
    // if the user clicks outside the container, we need to set those changes to local storage.
    // how to capture the changes that happened since target isn't the thing that changes?
    // setIdea(idea);
    console.log(localStorage);
    return;
  }
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
  <h2 id='idea-title' contenteditable>${obj.title}</h2> \
  <div id='delete'></div> \
  <p id='idea-body' contenteditable>${obj.body}</p> \
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
