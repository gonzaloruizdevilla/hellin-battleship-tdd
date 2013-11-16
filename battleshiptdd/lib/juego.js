/*jslint node: true */
"use strict";

    var //orientaciones
        HORIZONTAL = "HORIZONTAL",
        VERTICAL = "VERTICAL",
        //tableros
        ROJO = "ROJO",
        AZUL = "AZUL",
        //resultados disparos
        AGUA = "AGUA",
        TOCADO = "TOCADO",
        HUNDIDO = "HUNDIDO",
        GANA = "GANA",
        //tipo de baro
        ACORAZADO = "ACORAZADO",
        SUBMARINO = "SUBMARINO",
        CORBETA = "CORBETA",
        LANCHA = "LANCHA",
        //estados del juego
        EMPEZANDO = "EMPEZANDO",
        JUGANDO = "JUGANDO",
        FINALIZADO = "FINALIZADO",
        //estados del tablero
        COLOCANDO = "COLOCANDO",
        COLOCADO = "COLOCADO";

function seleccionaTablero(partida, color) {
    return color === ROJO ? partida.tableroRojo : partida.tableroAzul;
}

function preparaBarcoParaColocar(barco) {
    return {
        posicion: barco.posicion,
        direccion: barco.direccion,
        tipo: barco.tipo
    };
}

function largos(tipo) {
    var longitud;
    if (tipo === ACORAZADO) {longitud = 5; }
    if (tipo === SUBMARINO) {longitud = 4; }
    if (tipo === CORBETA) {longitud = 3; }
    if (tipo === LANCHA) {longitud = 2; }
    return longitud;
}

function largoAdicional(opciones, direccion) {
    return (opciones.direccion !== direccion) ? 0 : largos(opciones.tipo) - 1;
}

function verificaPosicionBarco(tablero, opciones) {
    var i,
           posicion = opciones.posicion,
           minX = posicion.x,
           minY = posicion.y,
           maxX = posicion.x + largoAdicional(opciones, HORIZONTAL),
           maxY = posicion.y + largoAdicional(opciones, VERTICAL);
   if (minX < 0 || minY < 0 || maxX > 9 || maxY > 9) {
       throw Error("Barco fuera de los limites.");
   }
}

function colocaBarco(partida, barco) {
    var tablero = seleccionaTablero(partida, barco.color);
    verificaPosicionBarco(tablero, barco);
    tablero.barcos.push(preparaBarcoParaColocar(barco));
}

function nuevaPartida() {
    return {
        tableroAzul: {barcos: []},
        tableroRojo: {barcos: []},
        colocaBarco: function (barco) {
            return colocaBarco(this, barco);
        }
    };
}

module.exports = {
    HORIZONTAL: HORIZONTAL,
    VERTICAL: VERTICAL,
    ROJO: ROJO,
    AZUL: AZUL,
    AGUA: AGUA,
    TOCADO: TOCADO,
    HUNDIDO: HUNDIDO,
    GANA: GANA,
    ACORAZADO: ACORAZADO,
    SUBMARINO: SUBMARINO,
    CORBETA: CORBETA,
    LANCHA: LANCHA,
    EMPEZANDO: EMPEZANDO,
    JUGANDO: JUGANDO,
    FINALIZADO: FINALIZADO,
    COLOCADO: COLOCADO,
    COLOCANDO: COLOCANDO,
    nuevaPartida: nuevaPartida
};