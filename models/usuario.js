const {Schema, model} = require('mongoose');

const UsuarioSchemea = Schema({
    nombre: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    online: {
        type: Boolean,
        default: false
    },
});

UsuarioSchemea.method('toJSON', function() {
    const {__v, _id, online, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchemea); 