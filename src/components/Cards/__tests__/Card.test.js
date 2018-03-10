//React / Testing frameworks
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

//COMPONENT TO TEST
import Card from '../Card';

describe('Card Component Tests', function () {

    const cardData = {};
    const cardClassData = {};

    beforeAll(() => {
        //Setup card data
        cardData.title = "hello_title";
        cardData.category = "hello_category";
        cardData.content = "hello_content";
        cardData.legend = "hello_legend";
        cardData.stats = "hello_stats";

        //Setup card class data
        cardClassData.plain = true;
        cardClassData.hCenter = true;
        cardClassData.ctAllIcons = true;
        cardClassData.ctTableFullWidth = true;
        cardClassData.ctTableResponsive = true;
        cardClassData.ctTableUpgrade = true;
        cardClassData.statsIcon = "hello_icon";
    })


    // Test 1
    test('Should render Card component with test data and no classes set', () => {
        const component = shallow(<Card {... cardData} />);

        expect(component.find("div.card")).to.have.length(1);
        expect(component.find("div.card-plain")).to.have.length(0);

        let myHeader = component.find("div.header");
        expect(myHeader).to.have.length(1);
        expect(myHeader.text()).to.contain(cardData.title);
        expect(myHeader.text()).to.contain(cardData.category);
        expect(component.find("div.text-center")).to.have.length(0);


        let myContent = component.find("div.content");
        expect(myContent).to.have.length(1);
        expect(myContent.text()).to.contain(cardData.content);
        expect(myContent.text()).to.contain(cardData.legend);
        expect(myContent.text()).to.contain(cardData.stats);

        expect(component.find("hr")).to.be.length(1);

        expect(component.find("div.all-icons")).to.have.length(0);
        expect(component.find("div.table-full-width")).to.have.length(0);
        expect(component.find("div.table-responsive")).to.have.length(0);
        expect(component.find("div.table-upgrade")).to.have.length(0);

        expect(component.find("div.footer")).to.have.length(1);
        expect(component.find("div.stats")).to.have.length(1);
    })

    // Test 2
    test('Should render Card component with test data and all classes set', () => {
        cardData.stats = null;
        const component = shallow(<Card {... cardData} {... cardClassData}/>);

        expect(component.find("div.card")).to.have.length(1);
        expect(component.find("div.card-plain")).to.have.length(1);

        let myHeader = component.find("div.header");
        expect(myHeader).to.have.length(1);
        expect(myHeader.text()).to.contain(cardData.title);
        expect(myHeader.text()).to.contain(cardData.category);
        expect(component.find("div.text-center")).to.have.length(1);


        let myContent = component.find("div.content");
        expect(myContent).to.have.length(1);
        expect(myContent.text()).to.contain(cardData.content);
        expect(myContent.text()).to.contain(cardData.legend);
        expect(myContent.text()).to.not.contain(cardData.stats);

        expect(component.find("hr")).to.be.length(0);

        expect(component.find("div.all-icons")).to.have.length(1);
        expect(component.find("div.table-full-width")).to.have.length(1);
        expect(component.find("div.table-responsive")).to.have.length(1);
        expect(component.find("div.table-upgrade")).to.have.length(1);

        expect(component.find("div.footer")).to.have.length(1);
        expect(component.find("div.stats")).to.have.length(1);

        expect(component.find("i." + cardClassData.statsIcon)).to.have.length(1);
    })

});