//React / Testing frameworks
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

/* Test Helpers */
import helper from '../../../../test/helpers/helper';

//CHILDREN COMPONENTS
import NotificationSystem from 'react-notification-system';
import StudentTeamCreator from '../StudentTeamCreator';
import TeamViewer from '../../../components/Teams/TeamViewer';

//COMPONENT TO TEST
import TeamManagement from "../TeamManagement";

describe('TeamManagement Component Tests', function () {

    test('Should render TeamManagement component with expected components', () => {

        const component = shallow(<TeamManagement />);

        expect(component.find(NotificationSystem)).to.be.length(1);
        expect(component.find(StudentTeamCreator)).to.be.length(1);
        expect(component.find(TeamViewer)).to.be.length(1);
    });

    test('Should render TeamManagement component with working notification system', async () => {

        const component = shallow(<TeamManagement/>);
        component.instance().addNotification("YO");

        await helper.flushPromises();
        component.update();
        component.instance().addNotification("YO");
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

    test('Should update table state as a force re-render', async () => {
        const component = shallow(<TeamManagement />);

        await helper.flushPromises();
        component.update();

        expect(component.state().tableUpdateToggler).to.be.false;

        component.instance().updateTable();
        component.update();
        await helper.flushPromises();

        expect(component.state().tableUpdateToggler).to.be.true;
    });

});