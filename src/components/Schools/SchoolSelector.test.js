import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import SchoolSelector from "./SchoolSelector";

describe('School Selector Component', function () {


    //Set up test data before running any tests
    beforeAll(function () {

    })

    // Test 1
    test('Renders school selector', function () {
        const component = shallow(<SchoolSelector />);

        expect(component.find('SelectField')).to.have.length(1);
    });




});