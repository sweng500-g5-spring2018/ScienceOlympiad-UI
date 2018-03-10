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

        expect(component.find(Row)).to.have.length(1);
        expect(component.find(Col)).to.have.length(2);

        let myBigIconDiv = component.find("div.icon-big");
        expect(myBigIconDiv).to.have.length(1);
        expect(myBigIconDiv.text()).to.contain(cardData.bigIcon);

        let myNumbersDiv = component.find("div.numbers");
        expect(myNumbersDiv).to.have.length(1);
        expect(myNumbersDiv.text()).to.contain(cardData.statsText);
        expect(myNumbersDiv.text()).to.contain(cardData.statsValue);

        expect(component.find("div.footer")).to.have.length(1);
        expect(component.find("div.stats")).to.have.length(1);
        expect(component.find("hr")).to.have.length(1);
        expect(component.find("p")).to.have.length(1);

        let myContent = component.find("div.content");
        expect(myContent).to.have.length(1);

        expect(myContent.text()).to.contain(cardData.statsIcon);
        expect(myContent.text()).to.contain(cardData.statsIconText);
    })
});