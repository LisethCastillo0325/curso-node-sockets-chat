const { io } = require('../classes/server');
const Usuarios = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        //console.log('entrarChat: ', data);
        if( !data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son requeridos'
            });
        }

        client.join(data.sala);

        usuarios.agregarUsuario(client.id, data.nombre, data.sala);

        let usuariosPorSala = usuarios.getUsuariosPorSala(data.sala);

        client.broadcast.to(data.sala).emit('listaUsuarios', usuariosPorSala);
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`));

        callback(usuariosPorSala);

    });

    client.on('crearMensaje', (data, callback) => {
        let usuario = usuarios.getUsuario(client.id);
        let mensaje = crearMensaje(usuario.nombre, data.mensaje);

        client.broadcast.to(usuario.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    client.on('disconnect', () => {

        let usuarioBorrada = usuarios.borrarUsuario(client.id);

        client.broadcast.to(usuarioBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuarioBorrada.nombre} salió`));

        client.broadcast.to(usuarioBorrada.sala).emit('listaUsuarios', usuarios.getUsuariosPorSala(usuarioBorrada.sala));

    });

    // Mensajes privados

    client.on('mensajePrivado', (data, callback) => {
        
        let usuario = usuarios.getUsuario( client.id );

        let mensaje = crearMensaje(usuario.nombre, data.mensaje);

        client.broadcast.to(data.destinatario).emit('mensajePrivado', mensaje);
        callback(mensaje);
    });

    client.on('informacionUsuario', (id, callback) => {

        let usuario = usuarios.getUsuario( id );

        client.broadcast.to(client.id).emit('informacionUsuario', usuario);

        callback(usuario);
    });

});