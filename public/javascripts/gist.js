$(document).ready(function(){
  var editor = ace.edit("editor");
  var filename = document.location.hash.slice(1);
  var code = editor.getValue();

  var gist = {
    "description": "A gist from Code Czar",
    "public": true,
    "files": {
      "test": {
        "content": JSON.stringify(code)
      }
    }
  };

  var currentDateTime = function(){
    var datetime, currentdate = new Date();
    return datetime = "Version: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
  };

  $("body").on("click", "#gist", function(){
    $.ajax({type: "POST",
            url: "https://api.github.com/gists",
            data: JSON.stringify(gist),
            success: function(data){
              $("#sharelink").append('<p><a href="' + data["html_url"] + '">View Gist</a>       ' + currentDateTime()+ '</p>');
            },
            error: function(e){
              console.log(e);
            }
        });
      });
});
