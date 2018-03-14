import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';

class CoachSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMsg: this.props.errorMsg,
            coachList: [],
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

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getCoaches/', 'GET', constants.useCredentials(), null, true).then(function (result) {
            _this.setState({coachList: _this.sortByKey(result.body, "lastName")})
        }).catch(function (error) {
            console.log("OMG : " + error);
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
        if (Object.keys(this.state.coachList).length !== 0) {
            return (
                <SelectField
                    name="coaches"
                    hintText={this.props.hintText}
                    // errorText={this.state.errorMsg}
                    floatingLabelText={this.props.labelText}
                    // onChange={this.updateValues}
                    // value={this.props.selected}>
                    maxHeight={200}>
                    {
                        Object.keys(this.state.coachList).map(function (key) {
                            return (
                                <MenuItem key={this.state.coachList[key].id}
                                          primaryText={this.state.coachList[key].firstName + " " + this.state.coachList[key].lastName}
                                          value={this.state.coachList[key].id}/>
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

export default CoachSelector;