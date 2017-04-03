
// ----- Main -----
// TODO: setup onload
// renderIdeas(getIdeas('ideas'), $('section'));

// ----- Events -----
$('#btn-save').on('click', function (e) {
  e.preventDefault();
  var inputs = getInputValues();
  var idea = createElement(inputs);
  clearInputs();
})

// TODO: Search Input: on keyup, test if empty
// TODO: upVote Btn: on click
// TODO: downVote Btn: on click
// TODO: delete Btn: on click

// ----- Function -----

function getInputValues() {
  var title = $('#input-title').val();
  var body = $('#input-body').val();
  var quality = 'swill';
  return {title: title, body: body, quality: quality};
}

function createElement(inputs) {
  var elementString = `<article class='idea'> \
    <h2>${inputs.title}</h2> \
    <div id='delete'></div> \
    <p>${inputs.body}</p> \
    <div id='vote'> \
      <div id='upvote'></div> \
      <div id='downvote'></div> \
      quality: ${inputs.quality} \
    </div> \
  </article>`;
  return elementString;
}

// function getIdeas(key) {
//   return JSON.parse(localStorage.getItem(key));
// }
// 
// function addIdea(idea) {
//   var ideas = getIdeas('ideas');
//   ideas.push(idea);
//   localStorage.setItem('ideas', idea);
// }
// 
// function renderIdeas(array, container) {
//   array.forEach(function(e) {
//     container.prepend(e);
//   });
// }

// TODO: ideas should be chronologically (use prepend on jquer)


function clearInputs() {
  $('#input-title').val('');
  $('#input-body').val('');
}