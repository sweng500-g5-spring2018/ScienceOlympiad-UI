//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS
import NotificationSystem from 'react-notification-system';
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Sidebar from "../../../components/Sidebar/Sidebar";
import AuthenticatedRoute from "../../../routes/AuthenticatedRoute";
import {HashRouter, Switch, Redirect} from 'react-router-dom';

//COMPONENT TO TEST
import App from "../App";
import AuthService from "../../../utils/AuthService";
import HttpRequest from "../../../adapters/httpRequest";

describe('App Component Tests', function () {
    const mountWithRouter = node => mount(<HashRouter>{node}</HashRouter>);
    const shallowWithRouter = node => shallow(<HashRouter>{node}</HashRouter>);

    var sandbox;
    // const notifyStub = sinon.stub(NotificationSystem.prototype, 'addNotification').returns(true);
    var props = {location: {pathname: "hello"}};

    beforeEach( () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach( () => {
        sandbox.restore();
    });

    test('Should render App with important higher level modules', () => {
        sandbox.stub(AuthService, 'isUserRoleAllowed').returns(true);
        sandbox.stub(AuthService, 'isLoggedIn').returns(true);
        sandbox.stub(AuthService, 'isAuthorized').returns(true);
        sandbox.stub(HttpRequest, 'httpRequest').resolves({status:200, body: "YAY"});
        sandbox.stub(AuthService, 'getUserRole').returns("ADMIN");

        const component = mountWithRouter(<App {...props} />);

        expect(component.find(NotificationSystem)).to.be.length(1);
        expect(component.find(Header)).to.be.length(1);
        expect(component.find(Footer)).to.be.length(1);
        expect(component.find(Sidebar)).to.be.length(1);
        expect(component.find(Switch)).to.be.length(1);
        expect(component.find(AuthenticatedRoute).length).to.be.greaterThan(0);

        let myAppComp = component.find(App);

        expect(myAppComp).to.be.length(1);

        myAppComp.instance().notify("Hi");
        component.update();
        myAppComp.instance().notify("Hi", "info", "tc", 10, "TITLE");
        component.update();
    })

    test('Should return back expected notification details', () => {
        var myMathFloor = sandbox.stub(Math, 'floor');
        myMathFloor.onCall(0).returns(1);
        myMathFloor.onCall(1).returns(2);
        myMathFloor.onCall(2).returns(3);
        myMathFloor.onCall(3).returns(4);
        myMathFloor.onCall(4).returns(5);

        expect(App.getRandoNotification().level).to.equal('success');
        expect(App.getRandoNotification().level).to.equal('warning');
        expect(App.getRandoNotification().level).to.equal('error');
        expect(App.getRandoNotification().level).to.equal('info');
        expect(App.getRandoNotification().level).to.equal('info');
    })

    test('Should render App and call componentDidUpdate', () => {
        sandbox.stub(App.prototype, 'componentDidMount').returns(true);
        var hello = sandbox.spy(App.prototype, 'componentDidUpdate');

        window.innerWidth = 900;

        const component = shallow(<App {... props}/>);

        let e = {
            history: {
                location: {
                    pathname: "hello"
                }
            },
            location: {
                pathname: "hello2"
            }
        };
        component.instance().componentDidUpdate(e);

        expect(hello.called).to.be.true;
    })
});