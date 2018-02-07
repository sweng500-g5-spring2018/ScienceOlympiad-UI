import React, {Component} from 'react';

import Sudoku from 'sudoku-react-component';

class EasterEgg extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div id='sudoku-container'>
                <Sudoku />
            </div>
        )
    }

}

export default EasterEgg;