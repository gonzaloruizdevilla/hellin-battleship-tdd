/*jslint node: true */
/*globals describe,beforeEach,it*/
'use strict';
var expect = require('chai').expect,
    juego = require('../lib/juego');

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
    });

});