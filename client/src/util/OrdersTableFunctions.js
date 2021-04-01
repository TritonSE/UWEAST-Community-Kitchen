/**
 * Contains all the helper methods used inside the OrdersTableColumn.js file.
 * 
 * Each Method does the following: 
 * 
 * renderDateFilters- The Node displayed when filtering by Date
 * updateDateFilters- Called when the user clicks the "X" inside the Node
 * DisplayStatusFilters- Renders The dropdown for Order Status filtering
 * DisplayDateFilters- Renders the Date Range picker inside the Filter Dialog
 * renderStatus- Node displaying the current filter option for Order Status
 * 
 * @summary - helper functions for orders table 
 */

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {getJWT, logout} from './Auth';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../css/Orders.css';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

// this displays the filters in the top left
const renderDateFilters = (options) => {
    if (options[0] && options[1]) {
      return `Start Date: ${options[0]}, End Date: ${options[1]}`;
    }
  
    return [];
}
  
/**
 * This updates the filterList when it is closed
 * 
 * @param {List} filterList 
 * @param {int} filterPos 
 * @param {int} index 
 */
const updateDateFilters = (filterList, filterPos, index) => {
    if (filterPos === 0) {
        filterList[index].splice(filterPos, 2, '');
    } else if (filterPos === 1) {
        filterList[index].splice(filterPos, 1);
    } else if (filterPos === -1) {
        filterList[index] = [];
    }

    return filterList;  
}
  
/**
 * This renders the select dropdown in the filter dropdown
 * 
 * @param {Object} filterList 
 * @param {Function} onChange - update the order status
 * @param {Index} index 
 * @param {Array} column 
 */
const DisplayStatusFilters = (filterList, onChange, index, column) => {
    
    const filterStatus = (event, picker) => {
      // alert(JSON.stringify(filterList));
      filterList[index][0] = event.target.value;
      // update the filter 
      onChange(filterList[index], index, column);
    } 
    
    return (
      <FormControl >
        <InputLabel id="demo-simple-select-label">Order Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterList[index][0] ? filterList[index][0] : "All Orders"}
          onChange={filterStatus}
        >
          {/* All possible options */}
          <MenuItem value={"All Orders"}>All Orders</MenuItem>
          <MenuItem value={"Pending Orders"}>Pending Orders</MenuItem>
          <MenuItem value={"Completed Orders"}>Completed Orders</MenuItem>
          <MenuItem value={"Cancelled Orders"}>Cancelled Orders</MenuItem>
        </Select>
      </FormControl>
    )
}
  
/**
 * This function displays the date range picker when clicking on the
 * textfield inside the filters modal
 * @param {List} filterList 
 * @param {Function} onChange 
 * @param {int} index 
 * @param {int} column 
 */
const DisplayDateFilters = (filterList, onChange, index, column) => {  
    // get the initial start date and end date for the date filter
    const initialStartDate = new Date();
    const initialEndDate = new Date();
    initialEndDate.setDate(initialStartDate.getDate()+7);
  
    const startDate = initialStartDate.getMonth()+1 + "/" + initialStartDate.getDate() + "/" + initialStartDate.getFullYear();
    const endDate = initialEndDate.getMonth()+1 + "/" + initialEndDate.getDate() + "/" + initialEndDate.getFullYear();
  
    // called when the "apply" button is clicked
    const saveDate = (event, picker) => {
      const split = event.target.value.split(" - ");
      filterList[index] = [split[0], split[1]];
      onChange(filterList[index], index, column);
    }
  
    return (
      <div style={{width: '20vw'}}>
        <label>{index === 0 ? 'Pick Up Details' : 'Submission Details'}</label>
        <DateRangePicker
          initialSettings={{ startDate: filterList[index][0] || startDate, endDate: filterList[index][1] || endDate}}
          onApply={saveDate}
        >
          <input type="text" className="form-control" />
        </DateRangePicker>
      </div>
    );
}
  
/**
 * This is called when the user changes the status of the 
 * order 
 * 
 * @param {String} value 
 * @param {Object} tableMeta 
 * @param {Function} updateValue 
 * @param {Object} e 
 */
const updateStatus = (value, tableMeta, updateValue, e) => {

    const setValue = e.target.value;
    const getRowId = tableMeta.rowData[10];

    let isCompleted = 0; 
    if(e.target.value === "Completed Orders"){
      isCompleted = 1; 
    } else if(e.target.value === "Cancelled Orders"){
      isCompleted = 2; 
    }
    
    const requestBody = {
      _id: getRowId,
      isCompleted: isCompleted,
      "token": getJWT()
    }
  
    fetch(`${BACKEND_URL}order/updatestatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(async result => {
        if (result.ok) {
          updateValue(setValue, tableMeta.rowIndex);
        }
         // invalid admin token
         else if(result.status === 401){
          logout();
          // refresh will cause a redirect to login page
          window.location.reload();
          return;
      }
    })
    .catch(e => {
          console.log(e);
    });
}
  
/**
 * This renders the Order status dropdown
 * 
 * @param {boolean} value - The value to pass in
 * @param {object} tableMeta - Information about the row
 */
const renderStatus = (value, tableMeta, updateValue) => {
    let statusClass = "dropdown-menu-pending";
    if(value === "Completed Orders"){
      statusClass = "dropdown-menu-completed";
    } else if(value === "Cancelled Orders"){
      statusClass = "dropdown-menu-cancelled";
    }
    return (
        <div className="orders-status">
            <select className={statusClass} value={value} 
            onChange={(e) => updateStatus(value, tableMeta, updateValue, e)}
                onClick={(e) => {
                    // this prevents the current row from expanding
                    e.stopPropagation();
                }}>
                <option value={"Pending Orders"}>Pending</option>
                <option value={"Completed Orders"}>Completed</option>
                <option value={"Cancelled Orders"}>Cancelled</option>
            </select> 
        </div>  
    )
}

const renderPaypalStatus = (value, tableMeta, updateValue) => {
  let obj = {};
  let paypalStatus = "Pending";

  if(value === 2) {
    obj.backgroundColor = '#EF6649';
    paypalStatus = "Rejected";
  } 
  else if(value === 1) {
    obj.backgroundColor = '#5AE44E';
    paypalStatus = "Accepted";
  } 
  else if(value === 3) {
    obj.backgroundColor = '#87CEFA';
    paypalStatus = "Refunded";
  } 

  return (
    <div className="paypal-order-status" style={obj}>
      <p>{paypalStatus}</p>
    </div>    
  )
}

export {
    renderStatus,
    DisplayDateFilters,
    DisplayStatusFilters,
    updateDateFilters,
    renderDateFilters,
    renderPaypalStatus    
}