//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

//COMPONENT TO TEST
import UserCard from '../UserCard';

describe('UserCard Component Tests', function () {

    //Test Suite Mocks/Spies/Data
    const testName = "testUser";
    const testDescription = "A test user";
    const testUserName = "test@email.com";

    const userCardData = {};
    userCardData.name = testName;
    userCardData.description = testDescription;
    userCardData.userName = testUserName;

    // Test 1
    test('Should render UserCard component with test data', () => {
        const component = shallow(<UserCard {... userCardData} />);

        expect(component.find("div.card")).to.have.length(1);
        expect(component.find("div.card-user")).to.have.length(1);
        expect(component.find("div.content")).to.have.length(1);
        expect(component.find("div.author")).to.have.length(1);
        expect(component.find("div.image")).to.have.length(1);
        expect(component.find("img.avatar")).to.have.length(1);

        let foundUserName = component.find("small");
        expect(foundUserName.text()).to.equal(testUserName);

        let foundName = component.find("h4.title");
        expect(foundName.text()).to.equal(testName + foundUserName.text());

        let foundDescription = component.find("p.description");
        expect(foundDescription.text()).to.equal(testDescription);
    })

});