import React, { useState } from 'react';
//Datatable
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

//DUMMY DATA
const object = {
    pickUpDate: "01/02/2021",
    pickUpTime: "2:13 PM",
    name: 'Amitesh',
    email: '123@gmail.com',
    phoneNumber: '858778069',
    dateSubmitted: '01/01/2021',
    amountPaid: '50.00',
    itemInfo: [
      {
        name: 'curry',
        quantity: '1',
        description: '',
        size: 'family'
      }, 
      {
        name: 'rice',
        quantity: '2',
        description: 'brown rice, not white',
        size: 'family'
      }
    ]
}

const object2 = {
  pickUpDate: "01/03/2021",
  pickUpTime: "2:13 PM",
  name: 'Tom',
  email: '4566@gmail.com',
  phoneNumber: '858778069',
  dateSubmitted: '01/05/2021',
  amountPaid: '60.00',
  itemInfo: [
    {
      name: 'Pasta',
      quantity: '1',
      description: '',
      size: 'single'
    }, 
    {
      name: 'bread',
      quantity: '2',
      description: 'No sauce please',
      size: 'single'
    }
  ]
}

const object3 = {
  pickUpDate: "01/8/2021",
  pickUpTime: "2:13 PM",
  name: 'Jeff',
  email: 'Jeff123@gmail.com',
  phoneNumber: '8778909999',
  dateSubmitted: '01/10/2021',
  amountPaid: '90.00',
  itemInfo: [
    {
      name: 'Pasta',
      quantity: '1',
      description: '',
      size: 'single'
    }, 
    {
      name: 'Tea',
      quantity: '2',
      description: 'No sauce please',
      size: 'single'
    },
    {
      name: 'Free money',
      quantity: '2',
      description: 'bags on bags',
      size: 'single'
    }
  ]
}

const objList = [object, object2];

const data = [
  [object.pickUpDate, object.pickUpTime, object.name, object.email, object.phoneNumber, object.dateSubmitted, object.amountPaid, object.itemInfo],
  [object2.pickUpDate, object2.pickUpTime, object2.name, object2.email, object2.phoneNumber, object2.dateSubmitted, object2.amountPaid, object2.itemInfo],
  [object3.pickUpDate, object3.pickUpTime, object3.name, object3.email, object3.phoneNumber, object3.dateSubmitted, object3.amountPaid, object3.itemInfo],
  [object.pickUpDate, object.pickUpTime, object.name, object.email, object.phoneNumber, object.dateSubmitted, object.amountPaid, object.itemInfo],
];

//END OF DUMMY DATA

//Converts the data to an object list
function createData(name, quantity, description, size) {
  return { name, quantity, description, size };
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
    const length = rowData[7].length;
    for(let i = 0; i < length; i++) {
      rows.push(createData(rowData[7][i].name, rowData[7][i].quantity, rowData[7][i].description, rowData[7][i].size))
    }

    return (
        <React.Fragment>
          <tr>
            <td colSpan={5}>
              <TableContainer component={Paper}>
                <Table style={{ minWidth: "650" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Items purchased</TableCell>
                      <TableCell align="right">Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Special Instructions</TableCell>
                      <TableCell align="right">Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.description}</TableCell>
                        <TableCell align="right">{row.size}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </td>
          </tr>
        </React.Fragment>   
    )
}

//The options used to customize the MUITable
const options = {
  filter: true,
  filterType: 'textField',
  expandableRowsOnClick: true,
  expandableRows: true,
  selectableRows: "single",
  rowsPerPageOptions: [10, 25, 50],
  renderExpandableRow: renderRow
};

const renderDateFilters = (options) => {
  if (options[0] && options[1]) {
    return `Start Date: ${options[0]}, End Date: ${options[1]}`;
  }

  return [];
}

const updateAgeFilters = (filterList, filterPos, index) => {
  console.log('customFilterListOnDelete: ', filterList, filterPos, index);

  if (filterPos === 0) {
    filterList[index].splice(filterPos, 1, '');
  } else if (filterPos === 1) {
    filterList[index].splice(filterPos, 1);
  } else if (filterPos === -1) {
    filterList[index] = [];
  }

  return filterList;  
}

const DisplayAgeFilters = (filterList, onChange, index, column) => {  
  const initialStartDate = new Date();
  const initialEndDate = new Date();
  initialEndDate.setDate(initialStartDate.getDate()+7);

  const startDate = initialStartDate.getMonth()+1 + "/" + initialStartDate.getDate() + "/" + initialStartDate.getFullYear();
  const endDate = initialEndDate.getMonth()+1 + "/" + initialEndDate.getDate() + "/" + initialEndDate.getFullYear();

  const saveDate = (event, picker) => {
    console.log(event.target.value);
    const split = event.target.value.split(" - ");
    console.log(split);
    filterList[index][0] = split[0];
    filterList[index][1] = split[1];
    onChange(filterList[index], index, column);
  }

  return (
    <div style={{width: '20vw'}}>
      <label>Submission dates</label>
      <DateRangePicker
        initialSettings={{ startDate: filterList[index][0] || startDate, endDate: filterList[index][1] || endDate}}
        onApply={saveDate}
      >
        <input type="text" className="form-control" />
      </DateRangePicker>
    </div>
  );
}

//The column headers for the table
const columns = [
{
  name: "Pick up Date",
  options: {
    filter: false
  }
}, 
{
  name: "Pick Up Time",
  options: {
    filter: false
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
  name: "Submission Date",
  options: {
    filter: true,
    filterType: 'custom',
    customFilterListOptions: {
      render: renderDateFilters,
      update: updateAgeFilters
    },
    filterOptions: {
      names: [],
      logic(date, filters) {
        if (filters[0] && filters[1]) {
          return date < filters[0] || date > filters[1];
        } else if (filters[0]) {
          return date < filters[0];
        } else if (filters[1]) {
          return date > filters[1];
        }
        return false;
      },
      display: DisplayAgeFilters
    }
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
}];

export default function OrdersTable(props) {
  return (
      <MUIDataTable
          title={"Past Orders"}
          data={data}
          columns={columns}
          options={options}
      />
  )
}