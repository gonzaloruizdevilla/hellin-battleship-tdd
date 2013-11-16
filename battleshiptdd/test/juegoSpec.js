/*jslint node: true */
/*globals describe,beforeEach,it*/
'use strict';
var expect = require('chai').expect,
    juego = require('../lib/juego');

describe('juego', function  () {
    it('debe ser algo', function () {
        expect(juego).not.to.be.null;
    });
});