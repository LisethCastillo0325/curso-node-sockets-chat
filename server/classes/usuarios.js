class Usuarios {

    constructor(){
        this.usuarios = [];
    }

    agregarUsuario(id, nombre, sala){
        let usuario = { id, nombre, sala };

        this.usuarios.push(usuario);

        return this.usuarios;
    }

    getUsuario( id ) {
        let usuario = this.usuarios.filter( usuario => usuario.id === id)[0];
        return usuario;
    }

    getUsuarios(){
        return this.usuarios;
    }

    getUsuariosPorSala(sala){
        let usuariosEnSala = this.usuarios.filter( usuario => usuario.sala === sala );
        return usuariosEnSala;
    }

    borrarUsuario( id ){

        let usuarioBorrar = this.getUsuario(id);

        this.usuarios = this.usuarios.filter(usuario => usuario.id != id);

        return usuarioBorrar;
    }

}

module.exports = Usuarios;