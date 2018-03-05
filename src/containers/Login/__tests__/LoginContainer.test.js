//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS
import NotificationSystem from 'react-notification-system';
import Login from "../../../components/Login/Login";
import Signup from "../../../components/Login/Signup";
import Forgot from "../../../components/Login/Forgot";

//COMPONENT TO TEST
import LoginContainer from "../LoginContainer";

describe('Login Component Tests', function () {
    // const notifyStub = sinon.stub(NotificationSystem.prototype, 'addNotification').returns(true);

    test('Should render LoginContainer with initial view of Login', () => {

        const component = shallow(<LoginContainer/>);

        //Renders divs
        expect(component.find("div#login-container")).to.have.length(1);
        expect(component.find("div#login-container-card")).to.have.length(1);
        expect(component.find("div#login-container-slider").hasClass('collapse')).to.be.false;
        expect(component.find("div#signup-container-slider").hasClass('collapse')).to.be.true;
        expect(component.find("div#forgot-container-slider").hasClass('collapse')).to.be.true;

        //Renders children Components
        expect(component.find(NotificationSystem)).to.have.length(1);
        expect(component.find(Login)).to.have.length(1);
        expect(component.find(Signup)).to.have.length(1);
        expect(component.find(Forgot)).to.have.length(1);
    });

    test('Should render LoginContainer and allow clicks of for navigation', async () => {

        var eventStubber = sinon.stub(helper.mockedEvent.target.attributes, "getNamedItem");
        eventStubber.onCall(0).returns({value: 'forgot'});
        eventStubber.onCall(1).returns({value: 'flogin'});
        eventStubber.onCall(2).returns({value: 'register'});
        eventStubber.onCall(3).returns({value: 'slogin'});
        eventStubber.onCall(4).returns({value: 'default'});

        const component = shallow(<LoginContainer/>);

        await helper.flushPromises();
        component.update();

        //Clicks forgot
        let forgotClick = component.find("a").at(0);
        expect(forgotClick.text("Forgot your password?"));
        expect(forgotClick.simulate('click', helper.mockedEvent));

        //Clicks return
        let flogin = component.find("a").at(3);
        expect(flogin.text("Return to the login screen"));
        expect(flogin.simulate('click', helper.mockedEvent));

        //Clicks register
        let registerClick = component.find("a").at(1);
        expect(registerClick.text("Register for a new account"));
        expect(registerClick.simulate('click', helper.mockedEvent));

        //Clicks return
        let slogin = component.find("a").at(2);
        expect(slogin.text("Return to the login screen"));
        expect(slogin.simulate('click', helper.mockedEvent));

        //somehow default case is shit
        expect(slogin.simulate('click', helper.mockedEvent));

        expect(eventStubber.callCount).to.equal(5);
    });

    test('Should render LoginContainer with working notification system', async () => {

        const component = shallow(<LoginContainer/>);

        await helper.flushPromises();
        component.update();
        component.instance().setState({_notificationSystem: {addNotification: () => {} }});
        component.instance().componentDidMount();
        component.update();
        await helper.flushPromises();
        component.update();

        //Renders children Components
        expect(component.find(NotificationSystem)).to.have.length(1);

        component.instance().setState({_notificationSystem: {addNotification: () => {} }});
        component.instance().addNotification("YO", "yo", "yo", 2);
        component.instance().addNotification("YO");
    });

});