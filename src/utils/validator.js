
module.exports.validateTeamName = function (teamName) {
    var result = {isValid: false};

    if(!teamName) {
        result.message = "Team Name is required.";
        return result;
    }

    if(teamName.trim().length < 5) {
        result.message = "Team Name is too short.";
        return result;
    }

    let reg = /^[a-z0-9|\s]+$/i;
    if(!reg.test(teamName.trim())){
        result.message = "May only include Alphanumeric";
        return result;
    }

    result.isValid = true;
    return result;
};

// Checks to see if an email has a host, @ symbols, and domain.
module.exports.validateEmail = function(text) {
    var result = {isValid: false};

    if(!text || text.trim() === "") {
        result.message = "Email address is required";
        return result;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!reg.test(text)) {
        result.message = "Must be proper Email address";
        return result;
    }

    result.isValid = true;
    return result;
};