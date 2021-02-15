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
                      <TableCell style={{width: 'calc(24.5%)'}}>Accommodations</TableCell>
                      <TableCell style={{width: 'calc(27.6%)'}}>Special Instructions</TableCell>
                      <TableCell style={{width: 'calc(17.8%)'}}>Size</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {/* The dropdown row data */}
                    {rows.map(row => (
                      <TableRow key={row.name}>
                        <TableCell style={{width: 'calc(48px)'}}></TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.accommodations}</TableCell>
                        <TableCell>{row.specialInstructions}</TableCell>
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

export default function OrdersTable(props) {
  
  const options = {
    filter: true,
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
          minWidth: '900px',
          maxWidth: '90vw',
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