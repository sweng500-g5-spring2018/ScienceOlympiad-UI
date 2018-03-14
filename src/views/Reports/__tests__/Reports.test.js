//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import { Grid, Row, Col } from 'react-bootstrap';

//COMPONENT TO TEST
import Reports from '../Reports';

describe('Reports Component Tests', function () {

    // Test 1
    test('Should render Dashboard component with Grid layout', () => {
        const component = shallow(<Reports />);

        expect(component.find('div.content')).to.have.length(1);
        expect(component.find(Grid)).to.have.length(1);
        expect(component.find(Row).length).to.be.greaterThan(0);
        expect(component.find(Col).length).to.be.greaterThan(0);
    })

});