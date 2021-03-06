import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

import ChuckNorris from "../ChuckNorris";

describe('ChuckNorris Component', function () {

    //Test Data declarations
    let chuckData;

    //Set up test data before running any tests
    beforeAll(function () {
        chuckData = "Chuck Norris is awesome.";
    })

    // Test 1
    test('Renders div with appropriate styling class', function () {
        const component = shallow(<ChuckNorris />);

        expect(component.find('div.chuckNorrisClass')).to.have.length(1);
    });

    // Test 2
    test('Renders div with span with correct default props', function () {
        const component = shallow(<ChuckNorris />);

        expect(component.find('div#contact-chuck-container-div')).to.have.length(1);
        expect(component.find('span')).to.have.length(1);

        expect(component.instance().props.chuckNorrisFromParent).to.equal(". . .");
    });

    // Test 3
    test('Renders with prop data', function () {
        const component = shallow(<ChuckNorris chuckNorrisFromParent={chuckData}/>);

        expect(component.instance().props.chuckNorrisFromParent).to.equal(chuckData);
    })

    // Test 4
    test('Renders button that calls provided callback function', function () {
        const callChuckNorris = sinon.spy();
        const component = shallow(<ChuckNorris callChuckNorris={callChuckNorris}/>);

        component.find('a').simulate('click');
        expect(callChuckNorris.calledOnce).to.equal(true);
    })


});