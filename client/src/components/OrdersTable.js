/**
 * This is the OrdersTable that is imported in the Orders.js file. This
 * Renders the MUI-datatable that contains all the relevant information
 * About past orders.
 *
 * The information layed out in the table:
 * Pickup Details, Name, email, Phone number, Price, Submission Date, Order Status,
 * Items, Quantity, Size, Accommodations, Special Instructions
 *
 * @summary     The Orders table implementation.
 * @author      Amitesh Sharma
 */

import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { columns } from "./OrdersTableColumns";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "../css/Orders.css";

import OrdersTableSelectToolbar from "./OrdersTableSelectToolbar";

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
  const rows = [];
  const { length } = rowData[6];
  // format the row information
  for (let i = 0; i < length; i++) {
    rows.push(
      createData(
        rowData[6][i].item,
        rowData[6][i].accommodations,
        rowData[6][i].specialInstructions,
        rowData[6][i].size,
        rowData[6][i].quantity
      )
    );
  }

  // styling for the cells in the dropdown
  const stylingCell = {
    maxWidth: "calc(21vw)",
    whiteSpace: "pre-wrap",
  };

  return (
    <>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={10}>
          <TableContainer>
            <Table aria-label="simple table">
              {/* The dropdown header */}
              <TableHead>
                <TableRow style={{ border: "none" }}>
                  {/* The table headers individual names */}
                  <TableCell />
                  <TableCell id="table-cell-items">Items</TableCell>
                  <TableCell id="table-cell-quanitity">Quantity</TableCell>
                  <TableCell id="table-cell-size">Size</TableCell>
                  <TableCell id="table-cell-acc">Accommodations</TableCell>
                  <TableCell id="table-cell-si">Special Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* The dropdown row data */}
                {rows.map((row) => (
                  <>
                    <TableRow key={row.name}>
                      {/* The table row information */}
                      <TableCell style={{ width: "calc(68px)" }} />
                      <TableCell>
                        <p style={stylingCell}>{row.name}</p>
                      </TableCell>
                      <TableCell>
                        <p style={stylingCell}>{row.quantity}</p>
                      </TableCell>
                      <TableCell>
                        <p style={stylingCell}>{row.size}</p>
                      </TableCell>
                      <TableCell>
                        <p style={stylingCell}>
                          {row.accommodations.length === 0 ? "N/A" : row.accommodations}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p style={stylingCell}>
                          {row.specialInstructions.length === 0 ? "N/A" : row.specialInstructions}
                        </p>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
                {/* displays notes information, if there is any */}
                {rowData[11] !== "" ? (
                  <TableRow>
                    <TableCell style={{ width: "calc(68px)" }} />
                    <TableCell style={{ whiteSpace: "pre-wrap" }} colSpan="10">
                      <p>
                        <b>Notes: {"\n\n"}</b>
                        {rowData[11]}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function OrdersTable(props) {
  // keep track of the selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // renders the custom toolbar when a row is selected
  const deleteModal = (selectedRows, displayData, setSelectedRows) => {
    const { index } = selectedRows.data[0];
    const { data } = displayData[index];

    return (
      <OrdersTableSelectToolbar
        data={data}
        render={props.render}
        setSelectedRows={setSelectedRows}
        error={props.error}
      />
    );
  };

  // option props to pass into the table
  const options = {
    // allows for filtering
    filter: true,
    // allows for rows to expand on click
    expandableRowsOnClick: true,
    expandableRows: true,
    renderExpandableRow: renderRow,
    // only select one row
    selectableRows: "single",
    // keeps track of the selected rows
    rowsSelected: selectedRows,
    // updates the selected rows
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      setSelectedRows(rowsSelected);
    },
    rowsPerPageOptions: [10, 25, 50],
    customToolbarSelect: deleteModal,
    // allows searchbar to initially be open
    searchOpen: true,
    // on mobile screens, it renders the table vertically
    responsive: "vertical",
    print: false,
    // downloading the orders table as a csv
    downloadOptions: { filename: "Baraka_Catering_Orders.csv", separator: "," },
    onDownload: (buildHead, buildBody, columns, data) => {
      // remove last two columns, as they will not be shown on table
      columns.splice(-2, 2);

      data = data.map((row) => {
        // build order breakdown as a string
        const order = row.data[6];

        let row_str = "";
        for (let i = 0; i < order.length; i++) {
          const { item } = order[i];
          const { size } = order[i];
          const qty = order[i].quantity;
          const { accommodations } = order[i];
          const { specialInstructions } = order[i];

          const rep = `${qty} x ${item} (${size}) ${
            accommodations === "" ? "" : `: ${accommodations}`
          } ${specialInstructions === "" ? "" : `\nSI: ${specialInstructions}`}\n\n`;
          row_str += rep;
        }

        // add in any notes if some exist
        if (row.data[11] !== "") {
          row_str += `\n\nNotes: ${row.data[11]}`;
        }

        // paypal status, map numeric to value
        let status = "Pending";

        if (row.data[9] === 1) {
          status = "Accepted";
        } else if (row.data[9] === 2) {
          status = "Rejected";
        } else if (row.data[9] === 3) {
          status = "Refunded";
        }

        const temp = [
          row.data[0], // order id
          row.data[1], // pickup
          row.data[2], // name
          row.data[3], // email
          row.data[4], // number
          row.data[5], // amount
          row_str, // order breakdown
          row.data[7], // submission
          row.data[8], // status
          status, // paypal status
        ];
        return { data: temp };
      });

      return `${buildHead(columns)}${buildBody(data)}`.trim();
    },
  };

  // styling for the row
  const getMuiTheme = () =>
    createMuiTheme({
      palette: {
        primary: {
          main: "#000",
          contrastText: "#fff",
        },
      },
      overrides: {
        MUIDataTable: {
          paper: {
            boxShadow: "none",
            minWidth: "900px",
            maxWidth: "90vw",
          },
        },
        MuiTableHead: {
          root: {
            fontWeight: "bold",
          },
        },
        MuiTableRow: {
          root: {
            borderLeft: "2px solid #CCCCCC",
            borderRight: "2px solid #CCCCCC",
            borderBottom: "2px solid #CCCCCC",
          },
          hover: { "&$root": { "&:hover": { backgroundColor: "#F1f1f1" } } },
        },
        MuiTableCell: {
          root: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "calc(16px)",
            borderBottom: "2px solid #CCCCCC",
          },
        },
      },
    });

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable data={props.orders} columns={columns} options={options} />
    </MuiThemeProvider>
  );
}
