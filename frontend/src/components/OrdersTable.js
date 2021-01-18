import React, { useState } from 'react';
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const object = {
    pickUpDate: "1/2/2021",
    pickUpTime: "2:13 PM",
    name: 'Amitesh',
    email: '123@gmail.com',
    phoneNumber: '858778069',
    dateSubmitted: '1/1/2021',
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
  pickUpDate: "1/3/2021",
  pickUpTime: "2:13 PM",
  name: 'Tom',
  email: '4566@gmail.com',
  phoneNumber: '858778069',
  dateSubmitted: '1/1/2021',
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

const columns = ["Pick up Date", "Pick Up Time", "Name", "Email", "Phone Number", "Submission Date", "Amount Paid"];

const data = [
  [object.pickUpDate, object.pickUpTime, object.name, object.email, object.phoneNumber, object.dateSubmitted, object.amountPaid],
  [object2.pickUpDate, object2.pickUpTime, object2.name, object2.email, object2.phoneNumber, object2.dateSubmitted, object2.amountPaid],
  [object.pickUpDate, object.pickUpTime, object.name, object.email, object.phoneNumber, object.dateSubmitted, object.amountPaid],
  [object.pickUpDate, object.pickUpTime, object.name, object.email, object.phoneNumber, object.dateSubmitted, object.amountPaid],
];

function createData(name, quantity, description, size) {
  return { name, quantity, description, size };
}

const renderRow = (rowData, rowMeta) => {
    const getIndex = rowMeta.rowIndex;
    console.log(getIndex);

    const rows = [
      createData(object.itemInfo.name, object.itemInfo.quantity, object.itemInfo.description, object.itemInfo.size)
    ]

    return (
        <React.Fragment>
          <tr>
            <td colSpan={6}>
              <TableContainer component={Paper}>
                <Table style={{ minWidth: "650" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Items purchases</TableCell>
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
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
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

const options = {
  filter: 'disabled',
  expandableRowsOnClick: true,
  expandableRows: true,
  selectableRows: "single",
  renderExpandableRow: renderRow
};


export default function OrdersTable(props) {
    return (
        <MUIDataTable
            title={"Employee List"}
            data={data}
            columns={columns}
            options={options}
        />
    )
}