/*jslint node: true */
'use strict';
var Guid = require("guid");
var motor = require("../../../battleshiptdd/lib/juego.js")
var partidas = [];
var partidaPendiente = null;
var sesiones = {};


exports.coloca = function (req,res){
	var id = req.params.id,
		datos = req.body,
		partida = sesiones[id],
		color = (partida.jugadorRojo === id) ? motor.ROJO : motor.AZUL;


	partida.colocaBarco({
	    color: color,
	    posicion: {
	        x: req.body.x,
	        y: req.body.y
	    },
	    direccion: (datos.horizontal ? motor.HORIZONTAL : motor.VERTICAL),
	    tipo: datos.tipo
	});
	console.log(JSON.stringify(partida, true, " "));
	res.json({ok:true})
}
exports.estado = function (req,res) {
	var respuesta,
		id = req.params.id,
		partida = sesiones[id];
	if (!partida) {
		respuesta = {estado: "INEXISTENTE"};
	} else {
		respuesta = {
			estado: partida.estado,
			turno: partida.turno,
			ultimoDisparo: partida.ultimoDisparo
		};
	}
	res.json(respuesta);
}

exports.dispara = function (req, res) {
	var gana,
		resultado,
		id = req.params.id,
		partida = sesiones[id],
		destino = (partida.jugadorRojo === id) ? motor.AZUL : motor.ROJO,
		disparo = {
	        destino: destino,
	        coordenadas: {
	        	x: req.body.x,
		        y: req.body.y
	        }
	    };

	if (destino == motor.ROJO) {
		partida.disparosDeAzul.push(disparo);
	} else {
		partida.disparosDeRojo.push(disparo);
	}
	resultado = partida.dispara(disparo);
	disparo.resultado = resultado;
	partida.turno = destino;
	partida.ultimoDisparo = disparo;
	if (resultado == motor.GANA){
		gana = (partida.jugadorRojo === id) ? motor.ROJO : motor.AZUL;
	}
	res.json({resultado: resultado, gana: gana});
}

exports.partida = function(req, res) {
	var id = Guid.raw(), tipo, partida;

	if (!partidaPendiente) {
		partidaPendiente = motor.nuevaPartida();
		partidaPendiente.numero = partidas.length;
		partidaPendiente.turno = (Math.random() < 0.5) ? "ROJO" : "AZUL";
		partidas.push(partidaPendiente);
		partidaPendiente.disparosDeRojo = [];
		partidaPendiente.disparosDeAzul = [];
	}

	partida  = partidaPendiente;
	sesiones[id] = partida;

	if (partida.jugadorAzul) {
		partida.jugadorRojo = id;
		tipo = "ROJO";
		console.log("Partida con ambos jugadores. Nº partida: " + partida.numero);
		partidaPendiente = null;
	} else {
		console.log("Partida creada. Nº partida: " + partida.numero);
		partida.jugadorAzul = id;
		tipo = "AZUL";
	}

    res.json({
    	numero: partida.numero,
    	id: id,
    	color: tipo
    });
};