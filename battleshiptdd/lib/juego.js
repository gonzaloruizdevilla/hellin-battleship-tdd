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


function nuevaPartida() {
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
    nuevaPartida: nuevaPartida
};