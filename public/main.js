var socket;
var text = {
    text: ''
};
$().ready(function() {
	setup();
});

function setup(){
    socket = io();
    socket.on('connect',function(){
        socket.emit('switchRoom',"default");
    });
    $("#editor").on("froalaEditor.keyup", function(){
        var html = $(this).froalaEditor('html.get');
        var data = {
            text: html
        };
        socket.emit('text', data);
    });
    $('#editor').froalaEditor({
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html', '|', 'undo', 'redo'],
        fullPage: true
    });

    socket.on('text', handleRecievedText);
    socket.on('newUser', updateText);
}

function switchRoom(num) {
    console.log("switching to room "+num);
    $('#editor').froalaEditor('html.set', '');
    socket.emit('switchRoom',num);
}

function updateText(data){
    text.text = data;
    $("#editor").froalaEditor('html.set', data);
    var editor = $('#editor').data('froala.editor');
    editor.selection.setAtEnd(editor.$el.get(0));
    editor.selection.restore();
}

function handleRecievedText(data){
    text.text = data.text;
    $("#editor").froalaEditor('html.set', data.text);
    var editor = $('#editor').data('froala.editor');
    editor.selection.setAtEnd(editor.$el.get(0));
    editor.selection.restore();
}
