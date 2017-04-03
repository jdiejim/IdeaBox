
// ----- Main -----
// TODO: setup onload
// renderIdeas(getIdeas('ideas'), $('section'));

// ----- Events -----
$('#btn-save').on('click', function (e) {
  e.preventDefault();
  var idea = getInputValues();
})

// TODO: Search Input: on keyup, test if empty
// TODO: upVote Btn: on click
// TODO: downVote Btn: on click
// TODO: delete Btn: on click

// ----- Function -----

function getInputValues() {
  var title = $('#input-title').val();
  var body = $('#input-body').val();
  return {title: title, body: body};
}

function createElement() {
  
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
