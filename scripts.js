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
      idea.element = updateElement(idea);
      setIdea(idea);
      $('#quality').html(idea.quality);
      break;
    case 'downvote':
      idea.quality = downQuality(idea.quality);
      idea.element = updateElement(idea);
      setIdea(idea);
      $('#quality').html(idea.quality);
      break;
  }
});

// TODO: Search Input: on keyup, test if empty

// ----- Function -----
function getInputValues() {
  var title = $('#input-title').val();
  var body = $('#input-body').val();
  return {
    title: title,
    body: body
  };
}

function createIdea(inputs) {
  var id = new Date().getTime();
  var element =
  `<article id='${id}' class='idea'> \
    <h2>${inputs.title}</h2> \
    <div id='delete'></div> \
    <p>${inputs.body}</p> \
    <div id='vote'> \
      <div id='upvote'></div> \
      <div id='downvote'></div> \
      quality: <span id='quality'>swill</span> \
    </div> \
  </article>`;
  return {
      title: inputs.title,
      body: inputs.body,
      id: id,
      element: element,
      quality: 'swill'
  };
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
      break;
    case 'plausible':
      return 'genius';
      break;
    case 'genius':
      return 'genius';
      break;
  }
}

function downQuality(quality) {
  switch(quality) {
    case 'swill':
      return 'swill';
      break;
    case 'plausible':
      return 'swill';
      break;
    case 'genius':
      return 'plausible';
      break;
  }
}

function updateElement(idea) {
  return `<article id='${idea.id}' class='idea'> \
    <h2>${idea.title}</h2> \
    <div id='delete'></div> \
    <p>${idea.body}</p> \
    <div id='vote'> \
      <div id='upvote'></div> \
      <div id='downvote'></div> \
      quality: <span id='quality'>${idea.quality}</span> \
    </div> \
  </article>`;
}
