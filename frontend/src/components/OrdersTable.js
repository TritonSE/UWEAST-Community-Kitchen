/**
 * This is the OrdersTable that is imported in the Orders.js file. This
 * Renders the MUI-datatable that contains all the relevant information
 * About past orders. 
 * 
 * The information layed out in the table: 
 * Pickup Details, Name, email, Phone number, Price, Submission Date, Order Status,
 * Items, Quantity, Size, Accommodations, Special Instructions
 * 
 * @summary The Orders table implementation.
 */

import React, { useState } from 'react';
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
import OrdersTableSelectToolbar from './OrdersTableSelectToolbar';

// converts the data to an object list
function createData(name, accommodations, specialInstructions, size, quantity) {
  return { name, accommodations, specialInstructions, size, quantity };
}

/**
 * This function is used to render the dropdown row when the table row is clicked.
 * It renders the order details of the selected order row.
 * 
 * @param {Object} rowData - Info of the row clicked 
 * @param {Object} rowMeta - Index of the data
 */
const renderRow = (rowData, rowMeta) => {
    const rows = []
    const length = rowData[6].length;
    // format the row information
    for(let i = 0; i < length; i++) {
      rows.push(createData(rowData[6][i].item, rowData[6][i].accommodations, rowData[6][i].specialInstructions, rowData[6][i].size, rowData[6][i].quantity));
    }

    // styling for the cells in the dropdown
    const stylingCell = {
      maxWidth: 'calc(21vw)', 
      whiteSpace: 'pre-wrap',
    }

    return (
        <React.Fragment>
          <TableRow>
            <TableCell style={{ padding: 0 }} colSpan={10}>
              <TableContainer>
                <Table aria-label="simple table">
                {/* The dropdown header */}
                  <TableHead>
                    <TableRow style={{border: 'none'}}>
                      <TableCell></TableCell>
                      <TableCell id="table-cell-items">Items</TableCell>
                      <TableCell id="table-cell-quanitity">Quantity</TableCell>
                      <TableCell id="table-cell-size">Size</TableCell>
                      <TableCell id="table-cell-acc">Accommodations</TableCell>
                      <TableCell id="table-cell-si">Special Instructions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {/* The dropdown row data */}
                    {rows.map(row => (
                      <TableRow key={row.name}>
                        <TableCell style={{width: 'calc(68px)'}}></TableCell>
                        <TableCell><p style={stylingCell}>{row.name}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.quantity}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.size}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.accommodations.length === 0 ? 'N/A' : row.accommodations}</p></TableCell>
                        <TableCell><p style={stylingCell}>{row.specialInstructions.length === 0 ? 'N/A' : row.specialInstructions}</p></TableCell>                        
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
  const [selectedRows, setSelectedRows] = useState([]);

  const deleteModal = (selectedRows, displayData, setSelectedRows) => {
    const index = selectedRows.data[0].index;
    const data = displayData[index].data;
    
    return <OrdersTableSelectToolbar data={data} render={props.render} setSelectedRows={setSelectedRows} error={props.error}/>
  }

  // option props to pass into the table
  const options = {
    filter: true,
    expandableRowsOnClick: true,
    expandableRows: true,
    selectableRows: 'single',
    rowsSelected: selectedRows,
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      setSelectedRows(rowsSelected);
    },
    rowsPerPageOptions: [10, 25, 50],
    renderExpandableRow: renderRow,
    customToolbarSelect: deleteModal,
    searchOpen: true,
    responsive: 'vertical'
  };

  // styling for the row
  const getMuiTheme = () =>
  createMuiTheme({
    palette: {
      primary: {
        main: '#000',
        contrastText: '#fff',
      },
    },
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
          borderBottom: '2px solid #CCCCCC'
        },
        hover: { '&$root': { '&:hover': { backgroundColor: '#F1f1f1' }, } }
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