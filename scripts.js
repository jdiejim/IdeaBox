// ----- Globals -----
var ideasArray = [];
// ----- Main -----
// TODO: setup onload

// ----- Events -----
$('#btn-save').on('click', function (e) {
  e.preventDefault();
  var inputs = getInputValues();
  var idea = createElement(inputs);
  addIdea(ideasArray, idea);
  clearInputs();
});

$('.ideas-container').on('click', function(e) {
  switch(e.target.id) {
    case 'delete':
      var childID = parseInt($(e.target).parent()[0].id);
      $(e.target).parent().remove();
      console.log(childID);
      ideasArray = ideasArray.filter(function(element) {
        return element.id !== childID;
      });
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
  return {title: title, body: body, quality: quality};
}

// NOTE: new return value is object with timestamp id
function createElement(inputs) {
  var id = new Date().getTime();
  var elementString = `<article id='${id}' class='idea'> \
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
      element: elementString,
      quality: inputs.quality
  };
}

// NOTE: Add object key element
// NOTE: Change string argument to object
// NOTE: Add prepend funcionality
function addIdea(array, obj) {
  ideasArray.push(obj);
  $('.ideas-container').prepend(ideasArray[ideasArray.length - 1].element);
}

function clearInputs() {
  $('#input-title').val('');
  $('#input-body').val('');
}
