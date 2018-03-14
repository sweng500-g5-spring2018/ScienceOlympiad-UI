//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import { Button } from 'react-bootstrap';

//COMPONENT TO TEST
import CustomButton from '../CustomButton';

describe('CustomButton Component Tests', function () {
    var data;
    //Set up test data before running any tests
    beforeAll(function () {
        data = {
            bsStyle: "info",
            pullRight: true,
            fill: true,
            type: "submit",
            onClick: sinon.spy()
        };
    });

    // Test 1
    test('Should render CustomButton component with React Bootstrap Button', () => {
        const component = shallow(<CustomButton {... data} />);

        expect(component.find(Button)).to.have.length(1);
        expect(component.find(Button).props().className).contain('btn-fill');
        expect(component.find(Button).props().className).contain('pull-right');
        expect(component.find(Button).props().className).not.contain('btn-block');
        expect(component.find(Button).props().className).not.contain('btn-round');
        expect(component.find(Button).props().className).not.contain('btn-simple');
        expect(component.find(Button).simulate('click'));
        expect(data.onClick.called).to.be.true;

    })

});