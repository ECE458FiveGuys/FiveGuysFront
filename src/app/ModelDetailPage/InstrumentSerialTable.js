import React, { Component } from "react";
import ErrorBoundary from "./ErrorBoundary";

class InstrumentSerialTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instruments: this.props.instruments
        }
    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                    <ul>{this.props.instruments.map((instrument, index) => (
                        <li
                            key = {instrument.pk}
                        >
                            {instrument.serial_number}
                        </li>
                    ))}
                    </ul>
                </ErrorBoundary>
            </div>
        );
    }

}
export default InstrumentSerialTable;