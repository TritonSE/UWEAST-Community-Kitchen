import React, { useState, useEffect } from 'react';
//Datatable
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../css/Orders.css';

import OrdersStatus from './OrdersStatus';

import {
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";

//Converts the data to an object list
function createData(name, description, size, quantity) {
  return { name, description, size, quantity };
}

/**
 * This function is used to render the row when the table row is clicked. Toggles view onClick
 * Of the original table row. Renders the order details of the selected order.
 * 
 * @param {Object} rowData - info of the row clicked 
 * @param {Object} rowMeta - index of the data
 */
const renderRow = (rowData, rowMeta) => {
    const rows = []
    const length = rowData[5].length;
    for(let i = 0; i < length; i++) {
      rows.push(createData(rowData[5][i].item, rowData[5][i].extra, rowData[5][i].size, rowData[5][i].quantity));
    }

    return (
        <React.Fragment>
          <TableRow>
            <TableCell style={{ padding: 0 }} colSpan={8}>
              <TableContainer>
                <Table aria-label="simple table">
                {/* The dropdown header */}
                  <TableHead>
                    <TableRow style={{border: 'none'}}>
                      <TableCell></TableCell>
                      <TableCell style={{width: 'calc(23.5%)'}}>Items</TableCell>
                      <TableCell style={{width: 'calc(31%)'}}>Special Instructions</TableCell>
                      <TableCell style={{width: 'calc(28.6%)'}}>Size</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {/* The dropdown row data */}
                    {rows.map(row => (
                      <TableRow key={row.name}>
                        <TableCell style={{width: 'calc(48px)'}}></TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableCell>
          </TableRow>
        </React.Fragment>   
    )
}

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
    filterList[index][0] = split[0];
    filterList[index][1] = split[1];
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
 * This renders the status dropdown
 * 
 * @param {boolean} value - The value to pass in
 * @param {object} tableMeta - Information about the row
 */
const renderStatus = (value, tableMeta, updateValue) => {
  return (
    <OrdersStatus value={value} rowInfo={tableMeta} />
  )
}

//The column headers for the table
const columns = [
{
  name: "Pick up Details",
  options: {
    filter: true,
    filterType: 'custom',
    customFilterListOptions: {
      render: renderDateFilters,
      update: updateDateFilters
    },
    filterOptions: {
      names: [],
      logic(date, filters) {
        const getDate = date.split("\n")[0];
        if (filters[0] && filters[1]) {
          return getDate < filters[0] || getDate > filters[1];
        } else if (filters[0]) {
          return getDate < filters[0];
        } else if (filters[1]) {
          return getDate > filters[1];
        }
        return false;
      },
      display: DisplayDateFilters
    }
  }  
},
{
  name: "Name",
  options: {
    filter: true,
    filterType: 'textField'
  }  
},
{
  name: "Email",
  options: {
    filter: true,
    filterType: 'textField'
  }    
},
{
  name: "Phone Number",
  options: {
    filter: true,
    filterType: 'textField'
  }  
},
{
  name: "Amount Paid",
  options: {
    filter: false
  }  
},
{
  name: "Order Description",
  options: {
    display: false, 
    viewColumns: false, 
    filter: false
  }
},
{
  name: "Submission Details",
  options: {
    filter: true,
    filterType: 'custom',
    customFilterListOptions: {
      render: renderDateFilters,
      update: updateDateFilters
    },
    filterOptions: {
      names: [],
      logic(date, filters) {
        const getDate = date.split("\n")[0];
        if (filters[0] && filters[1]) {
          return getDate < filters[0] || getDate > filters[1];
        } else if (filters[0]) {
          return getDate < filters[0];
        } else if (filters[1]) {
          return getDate > filters[1];
        }
        return false;
      },
      display: DisplayDateFilters
    }
  }  
},
{
  name: "Order Status",
  options: {
    filter: true,
    filterType: 'dropdown',
    customBodyRender: renderStatus,
    filterOptions: {
      names: ["Pending Orders", "Completed Orders"],
      logic(date, filters) {

        if (filters[0] === "Completed Orders") {
          console.log('here');
          return date === false;
        } else if (filters[0] === "Pending Orders") {
          return date === true;
        }
        return false;
      },
    }
  }  
},
{
  name: "Row ID",
  options: {
    display: false, 
    viewColumns: false, 
    filter: false
  }
}
];

export default function OrdersTable(props) {
  
  const options = {
    filter: true,
    filterType: 'textField',
    expandableRowsOnClick: true,
    expandableRows: true,
    selectableRows: 'none',
    rowsPerPageOptions: [10, 25, 50],
    renderExpandableRow: renderRow,
    searchOpen: true,
  };

  const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTable: {
        paper: {
          boxShadow: 'none',
        },
      },
      MuiTableRow: {
        root: {
          borderLeft: '2px solid #CCCCCC',
          borderRight: '2px solid #CCCCCC',
        }
      },
      MuiTableCell: {
        root: {
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'calc(16px)',
          borderBottom: '2px solid #CCCCCC',
        }
      }
    },
  });

  console.log(props.orders);
  return (
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Past Orders"}
          data={props.orders}
          columns={columns}
          options={options}
      />
      </MuiThemeProvider>
  )
}