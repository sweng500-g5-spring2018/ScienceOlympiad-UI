//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

//CHILDREN COMPONENTS OF COMPONENT IN TEST
import Sudoku from 'sudoku-react-component';

//COMPONENT TO TEST
import EasterEgg from '../sudoku';

describe('Sudoku EasterEgg Component Tests', function () {

    // Test 1
    test('Should render Sudoku Easter Eggcomponent', () => {
        const component = shallow(<EasterEgg />);

        expect(component.find(Sudoku)).to.have.length(1);
    })

});