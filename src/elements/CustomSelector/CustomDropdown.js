import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';

class CustomDropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: this.props.errorText,
            list: [],
        }

        this.updateValues = this.updateValues.bind(this);

        //INCOMING PROPS:
        //selected - "the item selected"
        //endpoint - "/sweng500/getCoaches"
        //sortKey - "lastName"
        //hintText - "the label before clicking"
        //labelText - "the label"
        //textKeys - ["firstName", "lastName"]
    }

    sortByKey(array, key) {
        if(key === undefined) return array;

        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    buildLabel(listItem) {
        var label = "";
        if(this.props.textKeys && this.props.textKeys.length > 0) {
            this.props.textKeys.forEach(function (key) {
                label += (listItem[key] + " ");
            });

            return label.trim();
        }

        return " - ";
    }

    componentDidMount() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + this.props.endpoint, 'GET', constants.useCredentials(), null, true).then(function (result) {
            _this.setState({list: _this.sortByKey(result.body, _this.props.sortKey)})
        }).catch(function (error) {
            _this.setState({
                errorText: "Failed to get data"
            });
        })
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.errorText !== nextProps.errorText)
            this.setState({errorText: nextProps.errorText})
    }

    updateValues(event, index, value) {
        this.props.selectedValue(value);
    }

    render() {
        if (this.state.list.length !== 0) {
            return (
                <SelectField
                    name={this.props.name}
                    hintText={this.props.hintText}
                    errorText={this.state.errorText}
                    floatingLabelText={this.props.labelText}
                    onChange={this.updateValues}
                    value={this.props.selected}
                    maxHeight={200}
                    style={{textAlign: 'left'}}>
                    {
                        Object.keys(this.state.list).map(function (key) {
                            return (
                                <MenuItem key={this.state.list[key].id}
                                          primaryText={this.buildLabel(this.state.list[key])}
                                          value={this.state.list[key]}/>
                            )
                        }, this)

                    }
                </SelectField>
            )
        }
        else
            return <span></span>
    }
}

export default CustomDropdown;