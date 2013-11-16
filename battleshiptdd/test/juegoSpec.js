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

});