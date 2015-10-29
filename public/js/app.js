// CLIENT-SIDE JAVASCRIPT
// On page load
$(document).ready(function(){
  pageLoad();
});

// function definitions

function pageLoad() {
  // set event listeners
  $("#new-post-form").on("submit", function(e){
    // prevent form submission
    e.preventDefault();
    // post serialized form to server
    $.post("/api/posts", $(this).serialize(), function(response){
      // append new food to the page
      var newPost = response;
    console.log('hi');
      // clear new food form
      var postString = makeHTMLString(newPost);
      $("#post-ul").prepend(postString);
      // reset the form 
      $("#new-post-form")[0].reset();
      // give focus back to the food name input
      $("#post-name-input").focus();
    });
  });
}


function makeHTMLString(post){
  return '<li class="list-group-item"><h4 class="list-group-item-heading">' + post.name +
  '</h4><span class="list-group-item-text">' + post.message + '</span>' +
  '<button data-id='+ post.id + ' type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
  '</li>';
}








// $(document).ready(function() {
//     getPost();

// });

// //function to grab input from form
// function getPost() {
// 	$('.btn-block').click(function() {
//     	event.preventDefault();	
//       	postPost($('#name').val(), $('#message').val());
// 	});
// }
// //function to add input and timestamp to the DOM and then clear typebox
// function postPost(name, message) {
// 	$('#postlist').prepend('<p>' + name + ' said ' + '"' + message + '"' + ' on ' + new Date($.now())+ '</p>');
// 	$('#message').val('');
// }