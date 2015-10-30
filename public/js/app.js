// CLIENT-SIDE JAVASCRIPT
// On page load
$(document).ready(function(){
  pageLoad();
  kero();

});

// function definitions

function pageLoad() {
  // set event listeners
  $("#new-post-form").on("submit", function(e){
    // prevent form submission
    e.preventDefault();
    // post serialized form to server
    $.post("/api/posts", $(this).serialize(), function(response){
      // append new post to the page
      var newPost = response;
      console.log(newPost);
      // clear new post form
      var postString = makeHTMLString(newPost);
      $("#post-ul").prepend(postString);
      // reset the message input, name input remains 
      $("#post-message-input").val(function() {
        return this.defaultValue;
      });
      // give focus back to the post message input
      $("#post-message-input").focus();
    });
  });
}

//initial rendering of post to DOM
function makeHTMLString(post){ console.log(post._id);
  return '<li class="list-group-item"><h4 class="list-group-item-heading"></h4><span class="list-group-item-text">' + post.name + ': ' + post.message + '</span></li>';
}

function kero(){
  $('span.pull-right').on('click', function() {
     console.log(this);
     var title = $( this ).attr( "data-cal-date" );
     console.log(title);
});
}