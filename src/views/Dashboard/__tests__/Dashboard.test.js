//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import { Grid, Row, Col } from 'react-bootstrap';

//COMPONENT TO TEST
import Dashboard from '../Dashboard';
import AuthService from "../../../utils/AuthService";
import HttpRequest from "../../../adapters/httpRequest";

describe('Dashboard Component Tests', function () {

    // Test 1
    test('Should render Dashboard component with Grid layout', () => {

        //Simulate the user be logged on
        sinon.stub(AuthService, 'isLoggedIn').returns(true)
        sinon.stub(AuthService, 'getUserRole').returns("ADMIN")

        const component = shallow(<Dashboard />);

        expect(component.find('div.content')).to.have.length(1);
        expect(component.find(Grid)).to.have.length(1);
        expect(component.find(Row).length).to.be.greaterThan(0);
        expect(component.find(Col).length).to.be.greaterThan(0);
    })

});