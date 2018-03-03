import React, {Component} from 'react';

import Sudoku from 'sudoku-react-component';

class EasterEgg extends Component {

    render() {
        return (
            <div id='sudoku-container'>
                <Sudoku />
            </div>
        )
    }

}

export default EasterEgg;