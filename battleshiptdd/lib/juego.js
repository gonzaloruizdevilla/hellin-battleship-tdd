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

function casillasOcupadas(opciones) {
    var i,
        posicion = opciones.posicion,
        casillas = [],
        minX = posicion.x,
        minY = posicion.y,
        maxX = posicion.x + largoAdicional(opciones, HORIZONTAL),
        maxY = posicion.y + largoAdicional(opciones, VERTICAL);
   if (minX < 0 || minY < 0 || maxX > 9 || maxY > 9) {
       throw Error("Barco fuera de los limites.");
   }
   if (minX === maxX) {
       for (i = minY; i <= maxY; i += 1) {
           casillas.push({x: minX, y: i, impacto: false});
       }
   } else {
       for (i = minX; i <= maxX; i += 1) {
           casillas.push({x: i, y: minY, impacto: false});
       }
   }
   return casillas;
}

function coincidenCasillas(casillasA, casillasB) {
    var coinciden = false;
    casillasA.forEach(function (casillaA) {
        casillasB.forEach(function (casillaB) {
            if (casillaA.x === casillaB.x && casillaA.y === casillaB.y) {
                throw new Error("Barco coincidente con otro en casillas (" + casillaA.x + ", " + casillaA.y + ")");
            }
        });
    });
    return coinciden;
}

function verificaPosicionBarco(tablero, opciones) {
    var casillasNuevoBarco = casillasOcupadas(opciones);
    tablero.barcos.forEach(function(barco) {
        if (coincidenCasillas(barco.casillas, casillasNuevoBarco)) {
            throw new Error("Barco sobre otro");
        }
    });
}

function preparaBarcoParaColocar(barco) {
    var casillas = casillasOcupadas(barco);
    return {
        posicion: barco.posicion,
        direccion: barco.direccion,
        tipo: barco.tipo,
        casillas: casillas
    };
}

function actualizaEstadoTablero(tablero) {
    tablero.estado = tablero.barcos.length === 10 ? COLOCADO :  COLOCANDO;
}

function actualizaEstadoPartida(partida) {
    actualizaEstadoTablero(partida.tableroRojo);
    actualizaEstadoTablero(partida.tableroAzul);
    if (partida.tableroRojo.estado === COLOCANDO || partida.tableroAzul.estado === COLOCANDO) {
        partida.estado = EMPEZANDO;
    } else {
        partida.estado = JUGANDO;
    }
}

function colocaBarco(partida, barco) {
    var tablero = seleccionaTablero(partida, barco.color);
    verificaPosicionBarco(tablero, barco);
    tablero.barcos.push(preparaBarcoParaColocar(barco));
    actualizaEstadoPartida(partida);
    return {
        estado: partida.estado
    };
}


function buscaBarco(tablero, coordenadas) {
    var barcoBuscado = null;
    tablero.barcos.forEach(function (barco) {
        barco.casillas.forEach(function (casilla) {
            if (casilla.x === coordenadas.x && casilla.y === coordenadas.y) {
                casilla.impacto = true;
                barcoBuscado = barco;
            }
        });
    });
    return barcoBuscado;
}

function actualizaEstadoBarco(barco) {
    var hundido = true;
    barco.casillas.forEach(function (casilla) {
        if (!casilla.impacto) {
            hundido = false;
        }
    });
    barco.estado = hundido ? HUNDIDO : TOCADO;
}

function todosHundidos(barcos) {
    var hundidos = true;
    barcos.forEach(function (barco) {
        hundidos = hundidos && (barco.estado === HUNDIDO);
    });
    return hundidos;
}

function dispara(partida, disparo) {
    var tablero = seleccionaTablero(partida, disparo.destino),
        barco = buscaBarco(tablero, disparo.coordenadas),
        resultado;
    if (!barco) {
        resultado = AGUA;
    } else {
        actualizaEstadoBarco(barco, disparo.coordenadas);
        resultado = barco.estado;
        if (resultado === HUNDIDO && todosHundidos(tablero.barcos)) {
            resultado = GANA;
            partida.estado = resultado;
        }
    }
    return resultado;
}

function nuevaPartida() {
    return {
        estado: EMPEZANDO,
        tableroAzul: {barcos: []},
        tableroRojo: {barcos: []},
        colocaBarco: function (barco) {
            return colocaBarco(this, barco);
        },
        dispara: function (disparo) {
            return dispara(this, disparo);
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