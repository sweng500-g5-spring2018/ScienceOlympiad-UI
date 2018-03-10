import React from "react";

/**
 * A Test Component that can be used as a React Component when testing
 *  Provide the component with a 'text' prop to observe text within the rendered div
 * @param props
 * @returns {*}
 * @constructor
 */
class TestComponent extends React.Component {
    constructor(props) { super (props)}
    render() {
        return (
            <div id="test-component-id" className="testComponentClass">
                {this.props.text}
            </div>
        )
    }
}

export default TestComponent;