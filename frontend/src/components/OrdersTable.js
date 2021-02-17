/**
 * This is the OrdersTable that is imported in the Orders.js file. This
 * Renders the MUI-datatable that contains all the relevant information
 * About past orders. 
 * 
 * The information layed out in the table: 
 * Pickup Details, Name, email, Phone number, Price, Submission Date, Order Status,
 * Items, Quantity, Size, Accommodations, Special Instructions
 * 
*/

import React from 'react';
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { columns } from './OrdersTableColumns';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../css/Orders.css';

import {
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";

//Converts the data to an object list
function createData(name, accommodations, specialInstructions, size, quantity) {
  return { name, accommodations, specialInstructions, size, quantity };
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
    //Format the row information
    for(let i = 0; i < length; i++) {
      console.log(rowData[5][i]);
      rows.push(createData(rowData[5][i].item, rowData[5][i].accommodations, rowData[5][i].specialInstructions, rowData[5][i].size, rowData[5][i].quantity));
    }

    //Styling for the cells in the dropdown, makes the text overflow
    const stylingCell = {
      maxWidth: '25ch', 
      whiteSpace: 'pre-wrap'  
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
                      <TableCell style={{width: 'calc(14.3%)'}}>Items</TableCell>
                      <TableCell style={{width: 'calc(24.5%)'}}>Quantity</TableCell>
                      <TableCell style={{width: 'calc(27.5%)'}}>Size</TableCell>
                      <TableCell style={{width: 'calc(17.6%)'}}>Accommodations</TableCell>
                      <TableCell>Special Instructions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {/* The dropdown row data */}
                    {rows.map(row => (
                      <TableRow key={row.name}>
                        <TableCell style={{width: 'calc(48px)'}}></TableCell>
                        <TableCell><p style={stylingCell}>{row.name}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.quantity}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.size}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.accommodations}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.specialInstructions}</p></TableCell>                        
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

export default function OrdersTable(props) {
  
  // Option props to pass into the table
  const options = {
    filter: true,
    expandableRowsOnClick: true,
    expandableRows: true,
    selectableRows: 'none',
    rowsPerPageOptions: [10, 25, 50],
    renderExpandableRow: renderRow,
    searchOpen: true,
  };

  // Styling for the row
  const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTable: {
        paper: {
          boxShadow: 'none',
          minWidth: '900px',
          maxWidth: '90vw',
        },
      },
      MuiTableHead: {
        root: {
          fontWeight: 'bold'
        }
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

  return (
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={props.orders}
          columns={columns}
          options={options}
      />
      </MuiThemeProvider>
  )
}