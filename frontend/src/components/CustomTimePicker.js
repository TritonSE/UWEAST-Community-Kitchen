import React from "react";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import '../css/CartSummary.css';

function CustomTimePicker(props) {
    return (
        <div className="time-picker">
        <MuiPickersUtilsProvider utils={MomentUtils}>
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
                inputProps={
                    props.setSize ?
                    {
                    style: {
                        fontSize: "3vw"
                    }
                } : {}}
                InputLabelProps={
                    props.setSize ? 
                    {
                    style: {
                        fontSize: "3vw"
                    }
                } : {}}
                />
                {props.errorMessage && (
                <span className="error">{props.errorMessage}</span>
                )}
        </MuiPickersUtilsProvider>
        </div>
    );
}

export default CustomTimePicker;