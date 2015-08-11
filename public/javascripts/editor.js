var randomString = function() {
  var length = 5;
  var chars = "abcdefghijklmnopqrstuvwxyz";
  var string = [];
  for (i = 0; i < length; i++) {
    string.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return string.join('');
};

$(document).ready(function() {
  var editor = ace.edit("editor");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setTheme("ace/theme/dawn");
  editor.getSession().setTabSize(2);
  editor.getSession().setUseWrapMode(true);
  editor.$blockScrolling = Infinity;

  window.addEventListener('message', function (e) {
    if ((e.origin === "null" && e.source === sandboxedFrame.contentWindow)
      || (e.origin === (window.location.protocol + "//" + window.location.host))) {
      $("#result").text(e.data);
    }
  });

  var sandboxedFrame = document.getElementById('sandboxed');

  function evaluate(frame) {
    var code = editor.getValue();
    frame.contentWindow.postMessage(code, '*');
  }

  document.getElementById('run').addEventListener('click', function () {
    evaluate(sandboxedFrame);
  });

  if (!document.location.hash) {
    document.location.hash = '#' + randomString();
  }

  var docName = "" + document.location.hash.slice(1);

  sharejs.open(docName, 'text', function(error, doc) {
    if (error) {
      console.error(error);
      return;
    }

    if (doc.created) {
      doc.insert(0, "// Type & run your code here!\n// Share your url with friends to begin collaborating.\n\nfunction foo() {\n  return 'hi!'\n}\n\nfoo()");
    }

    doc.attach_ace(editor);
    editor.setReadOnly(false);
  });
});
