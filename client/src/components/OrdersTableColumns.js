/**
 * Contains the details about each column in the Orders Table.
 * 
 * Each Column has specific props it requires. For example, 
 * 
 * The Pickup Details, Order Status, and Submission Details 
 * Require their own custom filtering, so they take in props
 * That allow for custom filtering. 
 * 
 * Order Status contains props for a custom body inside the table
 * Cell. 
 * 
 * @summary   Column details for orders table.
 * @author    Amitesh Sharma
 */

// import helper functions from utils
import {
    renderStatus,
    DisplayDateFilters,
    DisplayStatusFilters,
    updateDateFilters,
    renderDateFilters,
    renderPaypalStatus    
} from '../util/OrdersTableFunctions';

// formarts the time so it can be turned into a Date object
const convertToTimeInt = (data) => {
    // extract the necessary information
    const splitTime = data.split('\n');
    const date = splitTime[0].split("/");
    const time = splitTime[1].split(" ")[0].split(":");

    // convert the hours to military 
    let hoursTwo = time[0].length === 1 ? "0"+time[0] : time[0];
    if(hoursTwo === '12') {
      hoursTwo = '00'
    }

    if(data.includes('P.M.')) {
      hoursTwo = parseInt(hoursTwo, 10) + 12;
    } else if (data.includes('A.M.')) {
      hoursTwo = parseInt(hoursTwo, 10)
    }

    const minutesTwo = time[1]; 
  
    // return the formatted time
    const formatedTime = hoursTwo + ":" + minutesTwo;
    const dateTwo = new Date(date[2] +  "-" + date[0] + "-" + ( date[1].length === 1 ? "0"+date[1] : date[1] )  + "T" + formatedTime + ":00");
    return dateTwo.getTime();
}

// the column headers for the table
const columns = [
    // the order id column
    {
      name: "Order ID",
      options: {
        display: true, 
        viewColumns: true, 
        filter: true,
        filterType: 'textField',
        sortThirdClickReset: true,
      }
    },
    // the pick up details column
    {
      name: "Pick up Details",
      options: {
        filter: true,
        filterType: 'custom',
        // custom filter dialog
        customFilterListOptions: {
          // custom filter for pick up
          render: renderDateFilters,
          // custom updating inside the filter dialog
          update: updateDateFilters
        },
        // custom sort for dates
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const timeOne = convertToTimeInt(obj1.data);
            const timeTwo = convertToTimeInt(obj2.data);
            
            // if timeOne - timeTwo < 0, it's less, otherwise, it's greater
            return (timeOne - timeTwo) * (order === 'asc' ? 1 : -1);
          }
        },
        sortThirdClickReset: true,
        filterOptions: {
          names: [],
          // custom filtering logic when selected
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
          // displays the filter node when applied
          display: DisplayDateFilters
        }
      }  
    },
    // the name column
    {
      name: "Name",
      options: {
        filter: true,
        filterType: 'textField',
        sortThirdClickReset: true,
      }  
    },
    // the email column
    {
      name: "Email",
      options: {
        filter: true,
        filterType: 'textField',
        sortThirdClickReset: true,
      }    
    },
    // the phone number column
    {
      name: "Phone Number",
      options: {
        filter: true,
        filterType: 'textField',
        sortThirdClickReset: true,
      }  
    },
    // the amount paid column
    {
      name: "Amount Paid",
      options: {
        filter: false,
        // custom sort for amount
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const priceOne = parseFloat(obj1.data);
            const priceTwo = parseFloat(obj2.data);
            
            // if priceOne - priceTwo < 0, it's less, otherwise, it's greater
            return (priceOne - priceTwo) * (order === 'asc' ? 1 : -1);
          }
        },
        sortThirdClickReset: true,
      }  
    },
    // the order Description
    {
      name: "Order Description",
      options: {
        display: false, 
        viewColumns: false, 
        filter: false
      }
    },
    // the submission details
    {
      name: "Submission Details",
      options: {
        filter: true,
        filterType: 'custom',
        // custome filter dialog
        customFilterListOptions: {
          // custom rendering for filter in dialog
          render: renderDateFilters,
          // custom updating for submission filter
          update: updateDateFilters
        },
        // custom sorting for submission details
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const timeOne = convertToTimeInt(obj1.data);
            const timeTwo = convertToTimeInt(obj2.data);
            
            // if timeOne - timeTwo < 0, it's less, otherwise, it's greater
            return (timeOne - timeTwo) * (order === 'asc' ? 1 : -1);
          }
        },
        sortThirdClickReset: true,
        filterOptions: {
          names: [],
          // custom logic for getting orders when filters are applied
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
    // the order status column
    {
      name: "Order Status",
      options: {
        filter: true,
        sortThirdClickReset: true,
        filterType: 'custom',
        // custom dropdown inside the filter dialog
        customBodyRender: renderStatus,
        customFilterListOptions: {
          render: (options) => {
            if(options[0] === "All Orders") return [];
            return options;
          },
        },
        // custom sort function when the column is sorted
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const orderOne = obj1.data;
            const orderTwo = obj2.data;
            
            // if true, then pending is before completed
            // otherwise, completed comes before pending
            if(orderOne > orderTwo) {
              return order === 'asc' ? 1 : -1;
            } else {
              return order === 'asc' ? -1 : 1;
            }
          }
        },
        filterOptions: {
          // labels for the dropdown 
          names: ["Pending Orders", "Completed Orders", "Cancelled Orders"],
          // custom logic for getting orders that are 'completed' or 'pending'
          logic(order, filters) {
            if (filters[0] === "Completed Orders") {
              return order !== "Completed Orders";
            } else if (filters[0] === "Pending Orders") {
              return order !== "Pending Orders";
            } else if (filters[0] === "Cancelled Orders") {
              return order !== "Cancelled Orders";
            }
  
            return false;
          },
          display: DisplayStatusFilters
        }
      }
    },
    // the paypal status column
    {
      name: "Paypal Status",
      options: {
        display: true, 
        viewColumns: true, 
        filter: true,
        filterOptions: {
          // labels to replace '0', '1', and '2'
          names: ['Pending', 'Accepted', 'Rejected', 'Refunded'],
          // custom filtering logic
          logic: (location, filters, row) => {
            if(filters[0] === 'Pending') return location !== 0;
            else if(filters[0] === 'Accepted') return location !== 1;
            else if(filters[0] === 'Rejected') return location !== 2;
            else return location !== 3;
          }
        },
        filterType: 'dropdown',
        sortThirdClickReset: true,
        // custom design inside the row
        customBodyRender: renderPaypalStatus,
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const paypalOne = obj1.data;
            const paypalTwo = obj2.data;
            
            // if paypalOne - paypalTwo < 0, it's less, otherwise, it's greater
            return (paypalOne - paypalTwo) * (order === 'asc' ? 1 : -1);
          }
        }
      }
    },
    // the row id column
    {
      name: "Id",
      // all options are false so it will not show in the table
      // this data is used for backend calls
      options: {
        display: false, 
        viewColumns: false, 
        filter: false,
      }  
    },
    {
      name: "notes",
      // all options are false so it will not show in the table
      // this data is represented on row extension as notes
      options: {
        display: false, 
        viewColumns: false, 
        filter: false,
      }  
    },
];

export { columns } ;