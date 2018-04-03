import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';

class BuildingSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state ={
            errorMsg: this.props.errorMsg,
            buildingList: [],
            roomList:[],
        }

    }

    sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    componentWillMount() {
        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getAllRooms', 'GET',constants.useCredentials(), null).then(function (result) {
            console.log(result.body);
            _this.setState({roomList: _this.sortByKey(result.body, "roomName")})
        }).catch(function (error) {

        })
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getBuildings', 'GET',constants.useCredentials(), null).then(function (result) {
            _this.setState({buildingList: _this.sortByKey(result.body, "building")})
        }).catch(function (error) {

        })
    }

    componentWillReceiveProps(nextProps) {

        if(JSON.stringify(this.props.errorMsg) !== JSON.stringify(nextProps.errorMsg))
            this.setState({errorMsg: nextProps.errorMsg})
    }

    updateValues = (event, index, value) =>  {
        this.props.callBack(event, index, value);
    }

    render() {
        if (Object.keys(this.state.buildingList).length !== 0 && Object.keys(this.state.roomList).length !== 0 ) {
            return (
                <SelectField
                    name={"buildings"}
                    hintText={this.props.hintText}
                    errorText={this.state.errorMsg}
                    floatingLabelText={this.props.labelText}
                    onChange={this.updateValues}
                    fullWidth={true}
                    value={this.props.selected}>
                    {
                        Object.keys(this.state.buildingList).map(function (key) {
                            var items = Object.keys(this.state.roomList).map(function (roomKey){
                                if(this.state.buildingList[key].id.indexOf(this.state.roomList[roomKey].buildingID) > -1) {
                                    return (
                                        <MenuItem key={this.state.roomList[roomKey].id}
                                                  primaryText={this.state.buildingList[key].building +' -- ' +  this.state.roomList[roomKey].roomName}
                                                //  secondaryText={this.state.roomList[roomKey].roomName}
                                                  value={this.state.roomList[roomKey].id}/>
                                    )
                                }
                            }, this)
                            return (
                                items
                            )
                        }, this)

                    }
                </SelectField>
            )
        }
        else
            return ("ERROR LOADING BUILDINGS")
    }
}

export default BuildingSelector;