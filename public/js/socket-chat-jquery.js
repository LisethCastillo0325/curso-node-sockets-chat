var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');


// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var divTitleChat = $('#divTitleChat');
var divUsuario = $('#divUsuario');
var idPrivado;

// Funciones para renderizar usuarios
function renderizarUsuarios(usuarios) { // [{},{},{}]

    renderizarDatosUsario();

    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" data-sala="'+ sala + '" class="active"><img src="assets/images/users/7.jpg" alt="user-img" class="img-circle"><span> ' + sala + '</span></a>';
    html += '</li>';

    for (var i = 0; i < usuarios.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + usuarios[i].id + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + usuarios[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

function renderizarTituloMensajes(titulo){
    var html = '';
    html += '<h4 class="box-title">' + titulo + '</h4>';
    divTitleChat.html(html);
}

function renderizarDatosUsario(){
    var html = '';

    html += ' <a href="javascript:void(0)" data-sala="'+ sala + '" class="active"><img src="assets/images/users/4.jpg" alt="user-img" class="img-circle responsive"><span> ' + nombre + '</span></a>';

    divUsuario.html(html);
}

function renderizarChatPrivado(usuario){

    renderizarTituloMensajes('Mensaje privado a: ' + usuario.nombre);

   // divChatbox.html('');
}


function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';

        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }


    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

renderizarTituloMensajes(params.get('sala') + '<br><small>Grupo</small>');


// Listeners
divUsuarios.on('click', 'a', function() {
    idPrivado = $(this).data('id');
    var sala = $(this).data('sala');
    if (idPrivado) {
        socket.emit('informacionUsuario', idPrivado, function(usuario){
            renderizarChatPrivado(usuario);
        })
    }else if(sala){
        renderizarTituloMensajes(sala + '<br><small>Grupo</small>');
    }
});

formEnviar.on('submit', function(e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    var evento = '';
    var data = {
        nombre: nombre,
        mensaje: txtMensaje.val()
    };

    if (idPrivado) {
        evento = 'mensajePrivado';
        data.destinatario = idPrivado;
    }else{
        evento = 'crearMensaje';
    }

    socket.emit(evento, data, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });


});