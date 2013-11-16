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

function colocaBarco(partida, barco) {
    var tablero = seleccionaTablero(partida, barco.color);
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