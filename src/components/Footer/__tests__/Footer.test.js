//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import { Grid } from 'react-bootstrap';

//COMPONENT TO TEST
import Footer from '../Footer';

describe('Footer Component Tests', function () {

    // Test 1
    test('Should render Footer component with appropriate elements', () => {
        const component = shallow(<Footer />);

        expect(component.find("footer.footer")).to.have.length(1);
        expect(component.find(Grid)).to.have.length(1);
        expect(component.find("nav.pull-left")).to.have.length(1);
        expect(component.find("p.copyright")).to.have.length(1);

        let references = component.find("a");

        expect(references.length).to.equal(4);
        expect(references.at(0).text()).to.equal("Home");
        expect(references.at(0).prop("href")).to.equal("/#/app/dashboard");
    })

});