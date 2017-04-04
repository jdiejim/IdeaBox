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
  switch(e.target.id) {
    case 'delete':
      $(e.target).parent().remove();
      removeIdea(childId);
      break;
    case 'upvote':
      var qualities = {'swill', 'plausible', 'genius'};
      var oldQual = 
  }
});

// TODO: Search Input: on keyup, test if empty
// TODO: upVote Btn: on click
// TODO: downVote Btn: on click

// ----- Function -----
function getInputValues() {
  var title = $('#input-title').val();
  var body = $('#input-body').val();
  var quality = 'swill';
  return {
    title: title,
    body: body,
    quality: quality
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
      quality: ${inputs.quality} \
    </div> \
  </article>`;
  return {
      title: inputs.title,
      body: inputs.body,
      id: id,
      element: element,
      quality: inputs.quality
  };
}

function addIdea(idea) {
  $('.ideas-container').prepend(idea.element);
}

function clearInputs() {
  $('#input-title').val('');
  $('#input-body').val('');
}

function getIdea(idea) {
  return JSON.parse(localStorage.getItem(idea.id));
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
