/**
 * Custom time picker that allows only times in a specific range to be selected and displays
 * appropriate error messages. It renders the time picker using material-ui's TimePicker. This 
 * file has no dependencies on other files or components.
 * 
 * @summary Displays the custom time picker item.
 * @author Dhanush Nanjunda Reddy
 */
import React from "react";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import '../css/CartSummary.css';

/**
 * Renders the custom time picker using values passed in through props
 * 
 * @param {*} props - values passed down from parent component
 */
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