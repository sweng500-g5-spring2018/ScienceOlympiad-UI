import React, {Component} from 'react';
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import {RaisedButton, AppBar, FontIcon, FlatButton, MuiThemeProvider, TextField, IconButton} from 'material-ui';
import Card from '../../components/Cards/Card';

import AuthService from '../../utils/AuthService';

class EventScores extends Component {
    constructor(props) {
        super(props);

        var internalScores = {};
        props.teams.forEach(function (team) {
            internalScores[team.id] = {
                score: team.score != null ? team.score : 0,
                hasBeenScored: team.score != null
            };
        });

        this.state = {
            internalScores: internalScores
        }
    }

    handleSingleScoreUpdate(teamEvent, resetScore) {
        console.log(teamEvent);

        var body = {score: null};

        console.log("reset score is: " + resetScore);
        if(!resetScore) {
            console.log("no reset score")
            body = {score: this.state.internalScores[teamEvent.id].score};
        }

        if(body.score != null && (body.score < 0 || body.score > 100)){
            this.props.addNotification(<div>Please submit a score that is between 0 and 100.</div>, 'error');
            return;
        }

        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/addScore/" + teamEvent.id, "POST", constants.useCredentials(), body, true).then(function (result) {
            _this.props.addNotification(<div>Successfully submitted score for team <em>{teamEvent.teamName}</em> for event <em>{teamEvent.eventName}</em>.</div>, 'info');

            let tempScores = _this.state.internalScores;
            tempScores[teamEvent.id].hasBeenScored = !resetScore;

            _this.setState({
                internalScores: tempScores
            }, () => {
                _this.props.updateScores(teamEvent, body.score);
            });

        }).catch(function (error) {
            console.log(error);
            _this.props.addNotification(<div>Scores for team <b>{teamEvent.teamName}</b> could not be updated because: <em>{error.message}</em></div>, 'error');
        });
    }

    renderCategoryItem(team) {
        if(AuthService.isUserRoleAllowed(["JUDGE", "ADMIN"])) {
            return (
                <span>
                    Record results for team <em>{team.teamName}</em> in event <em>{team.eventName}</em>.
                </span>
            )
        } else {
            return (
                <span>
                    Scores for team <em>{team.teamName}</em> in event <em>{team.eventName}</em>.
                </span>
            )
        }
    }

    renderRemoveScoreButton(team){
        if(this.state.internalScores[team.id].hasBeenScored) {
            return (
                <IconButton tooltip="Remove score from team" iconClassName="pe-7s-trash" onClick={this.handleSingleScoreUpdate.bind(this, team, true)}/>
            )
        }
    }

    renderContentItem(team) {
        if(AuthService.isUserRoleAllowed(["JUDGE", "ADMIN"])) {
            return (
                <div>
                    <TextField name="scoreInput" type="number" style={{maxWidth: '50px'}}
                               floatingLabelText="Score" hintText={"Score"}
                               value={this.state.internalScores[team.id].score}
                               margin="normal"
                               min="0" max="100"
                               onChange={
                                   (event, newValue) => {
                                       let internal = this.state.internalScores;
                                       internal[team.id].score = newValue;
                                       this.setState({internalScores: internal});
                                   }
                               }
                    />
                    &nbsp;&nbsp;
                    <IconButton
                        tooltip={this.state.internalScores[team.id].hasBeenScored ? "Update Score" : "Submit Score" }
                        iconClassName={this.state.internalScores[team.id].hasBeenScored ? "pe-7s-pen" : "pe-7s-check" }
                        onClick={this.handleSingleScoreUpdate.bind(this, team, false)}
                    />
                    {this.renderRemoveScoreButton(team)}
                </div>
            )
        } else {
            if(this.state.internalScores[team.id].hasBeenScored) {
                return (
                    <span style={{fontSize: 40}}><b>{this.state.internalScores[team.id].score}</b></span>
                )
            } else {
                return (
                    <div>
                        Team <em>{team.teamName}</em> has not been scored yet for event <em>{team.eventName}</em>.
                    </div>
                )
            }
        }
    }

    renderTeamCards() {
        if(this.props.teams != undefined && this.props.teams != null) {
            return (
                <div style={{width: '50%', marginLeft: '25%', marginRight: '25%'}}>
                {
                    this.props.teams.map(function (team) {
                        return  (
                        <Card id={team.teamId} key={team.teamId} style={{backgroundColor: this.state.internalScores[team.id].hasBeenScored ? '#ecf9ec' : '#ffe6e6'}}
                            title={team.teamName + " Score"}
                            category={
                                this.renderCategoryItem(team)
                            }
                            content={
                                this.renderContentItem(team)
                            }
                        />
                        )
                    }, this)
                }
                </div>
            )
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="content" style={{textAlign: 'center'}}>
                    <h2 style={{textAlign: 'center'}}>
                        <em>Event Scores for: <b>{this.props.label}</b></em>
                        <div style={{fontSize: 'small'}}>All scores are out of 100 points.</div>
                    </h2>
                    {this.renderTeamCards()}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default EventScores;