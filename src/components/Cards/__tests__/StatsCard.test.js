//React / Testing frameworks
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

//CHILDREN components to look for
import {Row, Col} from 'react-bootstrap';

//COMPONENT TO TEST
import StatsCard from '../StatsCard';

describe('StatsCard Component Tests', function () {

    const cardData = {};

    beforeAll(() => {
        //Setup card data
        cardData.bigIcon = "hello_big_icon";
        cardData.statsText = "hello_text";
        cardData.statsValue = "hello_value";
        cardData.statsIcon = "hello_icon";
        cardData.statsIconText = "hello_icon_text";
    })


    // Test 1
    test('Should render Card component with test data and no classes set', () => {
        const component = shallow(<StatsCard {... cardData} />);

        expect(component.find("div.card")).to.have.length(1);
        expect(component.find("div.card-stats")).to.have.length(1);

        let myNumbersDiv = component.find("div.numbers");
        expect(myNumbersDiv).to.have.length(2);

        let myContent = component.find("div.content");
        expect(myContent).to.have.length(1);
    })
});