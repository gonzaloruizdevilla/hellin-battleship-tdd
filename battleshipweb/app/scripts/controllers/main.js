(function () {
    'use strict';

    function largos(tipo) {
        var longitud;
        if (tipo === "ACORAZADO") {longitud = 5; }
        if (tipo === "SUBMARINO") {longitud = 4; }
        if (tipo === "CORBETA") {longitud = 3; }
        if (tipo === "LANCHA") {longitud = 2; }
        return longitud;
    }


    function creaBarco(nombre) {
        return {
            nombre: nombre,
            largo: largos(nombre)
        };
    }

    function creaFlota() {
        var flota = [];
        flota.push(creaBarco("ACORAZADO"));
        flota.push(creaBarco("SUBMARINO"));
        flota.push(creaBarco("SUBMARINO"));
        flota.push(creaBarco("CORBETA"));
        flota.push(creaBarco("CORBETA"));
        flota.push(creaBarco("CORBETA"));
        flota.push(creaBarco("LANCHA"));
        flota.push(creaBarco("LANCHA"));
        flota.push(creaBarco("LANCHA"));
        flota.push(creaBarco("LANCHA"));
        return flota;
    }

    function creaTablero() {
        var tablero,
            celdas = {},
            celda,
            filas = [],
            fila,
            i,
            j;
        for (i = 0; i < 10; i++) {
            filas.push(fila = []);
            for (j = 0; j < 10; j++) {
                celda = {
                    x: j,
                    y: i
                }
                fila.push(celda);
                celdas[ celda.x + "-" + celda.y] = celda;
            }
        }
        tablero = {
            filas: filas,
            celdas: celdas
        };
        return tablero;
    }

    function celdaOcupadaPorBarco(barco, horizontal, celda, cabeceraBarco) {
        if (horizontal) {
            return  (celda.y === cabeceraBarco.y) &&
                    (cabeceraBarco.x <= celda.x) &&
                    (celda.x <= (cabeceraBarco.x + largos(barco.nombre) - 1));
        }
        return  (celda.x === cabeceraBarco.x) &&
                (cabeceraBarco.y <= celda.y) &&
                (celda.y <= (cabeceraBarco.y + largos(barco.nombre) - 1));
    }

    angular.module('battleshipwebApp')
        .controller('MainCtrl', function ($scope, $http, $interval) {
            var tableroJugador = creaTablero(),
                tableroOponente = creaTablero(),
                flota,
                flotaSituada = [],
                seleccion = {};

            $scope.estado = "CARGANDO";
            $scope.turno = "ESPERANDO";

            $http.get("/api/partida").success(function (datosPartida){
                creaPartida(datosPartida);
                $scope.estado = "PREPARANDO";

                $interval(function (){
                    $http.get("/api/" + $scope.idsesion + "/estado").success(function (datos){
                        $scope.estadoPartida = datos.estado;
                        if ($scope.turno == "ESPERANDO" && datos.turno == $scope.color) {
                            $scope.turno = "DISPARANDO";
                        }
                        if (datos.estado == "GANA"){
                            $scope.estado = "FIN";
                            if (datos.turno == $scope.color) {
                                $scope.turno = "HAS_PERDIDO";
                            } else  {
                                $scope.turno = "HAS_GANADO";
                            }
                        }
                        if (datos.ultimoDisparo && datos.turno == $scope.color){
                            var disparo = datos.ultimoDisparo;
                            $scope.tableroJugador.celdas[disparo.coordenadas.x + "-" + disparo.coordenadas.y].resultado = disparo.resultado.toLowerCase();
                        }
                    })
                },1000,0,false);
            })

            $scope.horizontal = true;
            $scope.$watch("estadoPartida", function (newValue){
                if (newValue === "JUGANDO") {
                    $scope.estado = "JUGANDO";
                }
            })

            function creaPartida(datosPartida) {
                flota = creaFlota();
                flotaSituada = [];
                $scope.idsesion = datosPartida.id;
                $scope.color = datosPartida.color;
                $scope.numero = datosPartida.numero;
                $scope.tableroJugador = tableroJugador = creaTablero();
                $scope.tableroOponente = tableroOponente = creaTablero();
                $scope.mostrarOponente = false;
                $scope.colocandoFichas = true;
                $scope.siguienteBarco =  flota.shift();
            }


           function celdaPosible(celda) {
                if (!seleccion.barco) {
                    return false;
                }
                if (barcoFueraLimites(seleccion.barco, $scope.horizontal, seleccion.celda)){
                    return false;
                }
                return celdaOcupadaPorBarco(seleccion.barco, $scope.horizontal, celda, seleccion.celda)
            };

            $scope.celdaPosible = celdaPosible;

             function conflicto(celda) {
                var i,
                    hayConflicto = false,
                    x,
                    y,
                    deltaX = 0,
                    deltaY = 0,
                    largo;
                if (!seleccion.celda || !$scope.siguienteBarco){
                    return;
                }
                largo = largos($scope.siguienteBarco.nombre);
                x = seleccion.celda.x;
                y = seleccion.celda.y;
                if (celdaPosible(celda)){
                    if ($scope.horizontal) {
                        deltaX = 1;
                    } else {
                        deltaY = 1;
                    }
                    for(i = 0; i < largo; i += 1) {
                        hayConflicto = hayConflicto || (tableroJugador.celdas[x + "-" + y] && tableroJugador.celdas[x + "-" + y].ocupada);
                        x = x + deltaX;
                        y = y + deltaY;
                    }
                }
                return hayConflicto;
            };
            $scope.conflicto = conflicto;

            $scope.barcoSobreCelda = function (barco, celda) {
                seleccion.barco = barco;
                seleccion.celda = celda;
            };

            function barcoFueraLimites(barco, horizontal, celda) {
                return (horizontal ? celda.x : celda.y) > (10 - largos(barco.nombre));
            }

            $scope.situaBarco = function (celda) {
                var barco = $scope.siguienteBarco;
                if (!barco) {
                    return;
                }
                if (conflicto(celda)){
                    return;
                }
                if (barcoFueraLimites(barco, $scope.horizontal, celda)) {
                    return;
                }
                flotaSituada.push(barco);
                marcaCeldas(barco, $scope.horizontal, celda);
                informaColocacionBarco(barco, $scope.horizontal, celda);
                $scope.siguienteBarco = flota.shift();
            };

            function marcaCeldas(barco, horizontal, celdaCabecera){
                $scope.tableroJugador.filas.forEach(function (fila) {
                    fila.forEach(function (celda) {
                        celda.ocupada = celda.ocupada || celdaOcupadaPorBarco(barco, horizontal, celda, celdaCabecera);
                    })
                })
            }

            function informaColocacionBarco(barco, horizontal, celda) {
                $http.post("/api/" + $scope.idsesion + "/coloca", {
                    tipo: barco.nombre,
                    x: celda.x,
                    y: celda.y,
                    horizontal: horizontal
                }).success(function (datos){
                    console.log(datos);
                })
            }

            $scope.dejaDeDisparar = function () {
                $scope.objetivo = null;
            }

            $scope.sobreObjetivo = function (celda) {
                $scope.objetivo = celda;
            }

            $scope.disparable = function (celda) {
                return ($scope.turno == "DISPARANDO") && celda === $scope.objetivo;
            }

            $scope.disparo = function (celda) {
                if ($scope.turno != "DISPARANDO" || celda.resultado) {
                    return;
                }
                $scope.turno = "ENVIANDO";
                $http.post("/api/" + $scope.idsesion + "/dispara", {
                    x: celda.x,
                    y: celda.y
                }).success(function (datos){
                    celda.resultado = datos.resultado;
                    if(datos.resultado === "AGUA") {
                        celda.agua = true;
                    } else if (datos.resultado === "TOCADO") {
                        celda.tocado = true;
                    } else if (datos.resultado === "HUNDIDO") {
                        celda.hundido = true;
                    } else if (datos.resultado === "GANA") {
                        celda.hundido = true;
                        $scope.turno = "HAS_GANADO";
                    }
                    $scope.turno = "ESPERANDO";
                })
            }

            $scope.jugar = function (){
                $scope.estado = "JUGANDO";
            }
            $scope.cambiar = function (){
                if ($scope.turno == "DISPARANDO") {
                    $scope.turno = "ENVIANDO";
                } else if ($scope.turno == "ENVIANDO") {
                    $scope.turno = "ESPERANDO"
                } else {
                    $scope.turno = "DISPARANDO"
                }
            }
        });
}());
