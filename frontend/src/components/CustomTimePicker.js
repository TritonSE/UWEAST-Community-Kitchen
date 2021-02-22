import React from "react";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import '../css/CartSummary.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

function CustomTimePicker(props) {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className="time-picker">
                <Row>
                <TimePicker
                label={props.label ? props.label : "Time Picker"}
                value={
                    props.value
                    ? moment(props.value, "HH:mm A")
                    : null
                }
                ampm={true}
                autoOk={true}
                minutesStep={1}
                onChange={(time) => props.setSelectedTime(time)}
                error={props.errorMessage ? true : false}
                />
                </Row>
                <Row>
                {props.errorMessage && (
                <span className="error">{props.errorMessage}</span>
                )}
                </Row>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default CustomTimePicker;