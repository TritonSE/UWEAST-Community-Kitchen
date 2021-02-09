import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../css/Orders.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

//This displays the filters in the top left
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
 * @param {Function} onChange 
 * @param {Index} index 
 * @param {Array} column 
 */
const DisplayStatusFilters = (filterList, onChange, index, column) => {
    
    const filterStatus = (event, picker) => {
      filterList[index][0] = event.target.value;
      //Update the filter 
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
    //Get the initial start date and end date for the date filter
    const initialStartDate = new Date();
    const initialEndDate = new Date();
    initialEndDate.setDate(initialStartDate.getDate()+7);
  
    const startDate = initialStartDate.getMonth()+1 + "/" + initialStartDate.getDate() + "/" + initialStartDate.getFullYear();
    const endDate = initialEndDate.getMonth()+1 + "/" + initialEndDate.getDate() + "/" + initialEndDate.getFullYear();
  
    //Called when the "apply" button is clicked
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
    const setValue = (value === "Completed Orders") ? "Pending Orders" : "Completed Orders";
    const getRowId = tableMeta.rowData[8];
    
    const requestBody = {
      _id: getRowId,
      isCompleted: (value === "Completed Orders") ? false : true
    }
  
    fetch(`${BACKEND_URL}order/updatestatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(async result => {
        if (result.ok) console.log(result.statusText);
        updateValue(setValue, tableMeta.rowIndex);
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
    return (
        <div className="orders-status">
            <select className={(value === "Completed Orders") ? "dropdown-menu-completed" : "dropdown-menu-pending"} value={value} 
            onChange={(e) => updateStatus(value, tableMeta, updateValue, e)}
                onClick={(e) => {
                    //This prevents the current row from expanding
                    e.stopPropagation();
                }}>
                <option value={"Pending Orders"}>Pending</option>
                <option value={"Completed Orders"}>Completed</option>
            </select> 
        </div>  
    )
}

export {
    renderStatus,
    DisplayDateFilters,
    DisplayStatusFilters,
    updateDateFilters,
    renderDateFilters    
}