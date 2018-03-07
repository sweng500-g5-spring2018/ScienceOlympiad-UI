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
        if (Object.keys(this.state.buildingList).length !== 0) {
            return (
                <SelectField
                    name={"buildings"}
                    hintText={this.props.hintText}
                    errorText={this.state.errorMsg}
                    floatingLabelText={this.props.labelText}
                    onChange={this.updateValues}
                    maxHeight={200}
                    value={this.props.selected}>
                    {
                        Object.keys(this.state.buildingList).map(function (key) {
                            return (
                                <MenuItem key={this.state.buildingList[key].id}
                                          primaryText={this.state.buildingList[key].building}
                                          value={this.state.buildingList[key].id}/>
                            )
                        }, this)

                    }
                </SelectField>
            )
        }
        else
            return ("ERROR LOADING SCHOOLS")
    }
}

export default BuildingSelector;