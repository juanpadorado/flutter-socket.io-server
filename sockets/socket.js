const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBans(new Band('Queen'));
bands.addBans(new Band('Rata Blanca'));
bands.addBans(new Band('Mago de Oz'));
bands.addBans(new Band('Metalica'));

// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
     });

    client.on('mensaje', (payload) => {
        console.log('mensaje!!', payload);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', payload => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', payload => {
        bands.addBans(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', payload => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    /*client.on('emitir-mensaje', (payload) => {
        console.log('mensaje flutter!!', payload);
        //io.emit('nuevo-mensaje', payload); // Emite a todos los clientes conectados
        client.broadcast.emit('nuevo-mensaje', payload); // Emite a todos menos al que lo emitio
    });*/

});