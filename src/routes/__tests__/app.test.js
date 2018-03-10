//React / Testing frameworks
import React from 'react';
import {expect} from 'chai';

//COMPONENT TO TEST
import appRoutes from "../app";

describe('App Routes Tests', function () {

    test('Should return proper routes', () => {
        expect(appRoutes.length).to.be.greaterThan(5);
        expect(appRoutes[appRoutes.length - 1].redirect).to.be.true;
        expect(appRoutes[appRoutes.length - 1].to).to.equal("/app/dashboard");
    });
});