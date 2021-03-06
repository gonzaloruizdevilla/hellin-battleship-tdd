/*jslint node: true */
/*globals describe,beforeEach,it*/
'use strict';
var expect = require('chai').expect,
    juego = require('../lib/juego');

function cargaBarcos(partida) {
    var y = 0;
    [
        [juego.ACORAZADO, 1],
        [juego.SUBMARINO, 2],
        [juego.CORBETA, 3],
        [juego.LANCHA, 4]
    ].forEach(function (par) {
        var tipo = par[0], numero = par[1], i;
        function barco(color) {
            return {
                color: color,
                posicion: {x: 0, y: y},
                direccion: juego.HORIZONTAL,
                tipo: tipo
            };
        }
        for (i = 0; i < numero; ++i) {
            partida.colocaBarco(barco(juego.ROJO));
            partida.colocaBarco(barco(juego.AZUL));
            y += 1;
        }
    });
}


describe('juego', function  () {
    it('debe ser algo', function () {
        expect(juego).not.to.be.null;
    });

    it('proporciona direcciones', function () {
        expect(juego.HORIZONTAL).not.to.be.undefined;
        expect(juego.VERTICAL).not.to.be.undefined;
    });

    it('proporciona estados de tablero', function () {
        expect(juego.COLOCANDO).not.to.be.undefined;
        expect(juego.COLOCADO).not.to.be.undefined;
    });

    it('proporciona estados de tablero', function () {
        expect(juego.EMPEZANDO).not.to.be.undefined;
        expect(juego.JUGANDO).not.to.be.undefined;
        expect(juego.FINALIZADO).not.to.be.undefined;
    });

    it('proporciona colores', function () {
        expect(juego.ROJO).not.to.be.undefined;
        expect(juego.AZUL).not.to.be.undefined;
    });

    it('proporciona barcos', function () {
        expect(juego.ACORAZADO).not.to.be.undefined;
        expect(juego.SUBMARINO).not.to.be.undefined;
        expect(juego.CORBETA).not.to.be.undefined;
        expect(juego.LANCHA).not.to.be.undefined;
    });

    describe('nuevaPartida', function() {
        it('debe crear una nueva partida', function () {
            expect(juego.nuevaPartida()).not.to.be.null;
        });

        it('debe crear los dos tableros', function () {
            var partida = juego.nuevaPartida();
            expect(partida.tableroAzul).not.to.be.null;
            expect(partida.tableroRojo).not.to.be.null;
        });
    });

    describe('colocaBarco', function () {
        var tableroAzul, tableroRojo, partida;
        beforeEach(function () {
            partida = juego.nuevaPartida();
            tableroAzul = partida.tableroAzul;
            tableroRojo = partida.tableroRojo;
        });

        it('debe colocar un barco', function () {
            var tableroRojo;
            partida.colocaBarco({
                color: juego.ROJO,
                posicion: {
                    x: 0,
                    y: 0
                },
                direccion: juego.HORIZONTAL,
                tipo: juego.ACORAZADO
            });
            tableroRojo = partida.tableroRojo;
            expect(tableroRojo.barcos.length).to.equal(1);
            expect(tableroRojo.barcos[0].posicion).to.deep.equal({x:0,y:0});
            expect(tableroRojo.barcos[0].direccion).to.equal(juego.HORIZONTAL);
            expect(tableroRojo.barcos[0].tipo).to.equal(juego.ACORAZADO);
        });

        it('debe impedir colocar un barco fuera de los limites del tablero', function () {
            function colocaBarcoFuera() {
                partida.colocaBarco({
                    color: juego.ROJO,
                    posicion: {
                        x: -1,
                        y: 0
                    },
                    direccion: juego.HORIZONTAL,
                    tipo: juego.ACORAZADO
                });
            }
            function colocaBarcoFuera2(){
                partida.colocaBarco({
                    color: juego.ROJO,
                    posicion: {
                        x: 9,
                        y: 0
                    },
                    direccion: juego.HORIZONTAL,
                    tipo: juego.ACORAZADO
                });
            }
            function colocaBarcoFuera3(){
                partida.colocaBarco({
                    color: juego.ROJO,
                    posicion: {
                        x: 0,
                        y: 9
                    },
                    direccion: juego.VERTICAL,
                    tipo: juego.ACORAZADO
                });
            }
            expect(colocaBarcoFuera).to.throw("Barco fuera de los limites.");
            expect(colocaBarcoFuera2).to.throw("Barco fuera de los limites.");
            expect(colocaBarcoFuera3).to.throw("Barco fuera de los limites.");
        });

        it('debe impedir colocar un barco sobre otro', function () {
            partida.colocaBarco({
                color: juego.ROJO,
                posicion: {
                    x: 0,
                    y: 0
                },
                direccion: juego.HORIZONTAL,
                tipo: juego.ACORAZADO
            });
            function colocaBarcoEncima(){
                partida.colocaBarco({
                    color: juego.ROJO,
                    posicion: {
                        x: 1,
                        y: 0
                    },
                    direccion: juego.HORIZONTAL,
                    tipo: juego.SUBMARINO
                });
            }
            expect(colocaBarcoEncima).to.throw("Barco coincidente con otro en casillas (1, 0)");
        });

        it('debe informar el estado del tablero', function () {
            var y = 0;
            [[juego.ACORAZADO,1],
             [juego.SUBMARINO,2],
             [juego.CORBETA,3],
             [juego.LANCHA,3]
            ].forEach(function (par){
                var tipo = par[0], numero = par[1], i;
                for(i = 0; i <numero; ++i) {
                    partida.colocaBarco({
                        color: juego.ROJO,
                        posicion: {x:0, y:y},
                        direccion: juego.HORIZONTAL,
                        tipo: tipo
                    });
                    y += 1;
                }
            });
            expect(partida.tableroRojo.estado).to.equal(juego.COLOCANDO);
            partida.colocaBarco({
                color: juego.ROJO,
                posicion: {x:0, y:9},
                direccion: juego.HORIZONTAL,
                tipo: juego.LANCHA
            });
            expect(partida.tableroRojo.estado).to.equal(juego.COLOCADO);
        });

        it('debe informar el estado del juego', function () {
            expect(partida.estado).to.equal(juego.EMPEZANDO);
            cargaBarcos(partida);
            expect(partida.estado).to.equal(juego.JUGANDO);
        });
    });

    describe('dispara', function () {
        var tableroAzul, tableroRojo, partida;
        beforeEach(function () {
            partida = juego.nuevaPartida();
            cargaBarcos(partida);
            tableroAzul = partida.tableroAzul;
            tableroRojo = partida.tableroRojo;
        });

        it('debe informar cuando hace agua', function (){
            var resultado = partida.dispara({
                destino: juego.ROJO,
                coordenadas: {x:9,y:0}
            });
            expect(resultado).to.equal(juego.AGUA);
        });

        it('debe informar cuando un disparo toca un barco', function (){
            var resultado = partida.dispara({
                destino: juego.ROJO,
                coordenadas: {x:0,y:3}
            });
            expect(resultado).to.equal(juego.TOCADO);
        });

        it('debe informar cuando un disparo hunde un barco', function (){
            var resultado;
            partida.dispara({
                destino: juego.ROJO,
                coordenadas: {x:0,y:8}
            });
            resultado = partida.dispara({
                destino: juego.ROJO,
                coordenadas: {x:1,y:8}
            });
            expect(resultado).to.equal(juego.HUNDIDO);
        });

        it('debe informar cuando un disparo hunde el último barco', function (){
            var resultado;
            partida.tableroRojo.barcos.forEach(function (barco) {
                barco.estado = juego.HUNDIDO;
            });
            partida.dispara({
                destino: juego.ROJO,
                coordenadas: {x:0,y:8}
            });
            resultado = partida.dispara({
                destino: juego.ROJO,
                coordenadas: {x:1,y:8}
            });
            expect(resultado).to.equal(juego.GANA);
            expect(partida.estado).to.equal(juego.GANA);
        });
    });
});