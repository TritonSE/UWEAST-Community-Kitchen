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
 * @summary Column details for orders table.
 */

// import helper functions from utils
import {
    renderStatus,
    DisplayDateFilters,
    DisplayStatusFilters,
    updateDateFilters,
    renderDateFilters    
} from '../util/OrdersTableFunctions';

// formarts the time so it can be turned into a Date object
const convertToTimeInt = (data) => {
    const splitTime = data.split('\n');
    const date = splitTime[0].split("/");
    const time = splitTime[1].split(" ")[0].split(":");

    const hoursTwo = time[0].length === 1 ? "0"+time[0] : time[0];
    const minutesTwo = time[1]; 

    const formatedTime = hoursTwo + ":" + minutesTwo;
    const dateTwo = new Date(date[2] +  "-" + date[0] + "-" + date[1]  + "T" + formatedTime + ":00");
    return dateTwo.getTime();
}

// the column headers for the table
const columns = [
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
    {
      name: "Pick up Details",
      options: {
        filter: true,
        filterType: 'custom',
        customFilterListOptions: {
          render: renderDateFilters,
          update: updateDateFilters
        },
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const timeOne = convertToTimeInt(obj1.data);
            const timeTwo = convertToTimeInt(obj2.data);
            
            return (timeOne - timeTwo) * (order === 'asc' ? 1 : -1);
          }
        },
        sortThirdClickReset: true,
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
        filterType: 'textField',
        sortThirdClickReset: true,
      }  
    },
    {
      name: "Email",
      options: {
        filter: true,
        filterType: 'textField',
        sortThirdClickReset: true,
      }    
    },
    {
      name: "Phone Number",
      options: {
        filter: true,
        filterType: 'textField',
        sortThirdClickReset: true,
      }  
    },
    {
      name: "Amount Paid",
      options: {
        filter: false,
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const priceOne = parseFloat(obj1.data);
            const priceTwo = parseFloat(obj2.data);
            
            return (priceOne - priceTwo) * (order === 'asc' ? 1 : -1);
          }
        },
        sortThirdClickReset: true,
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
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const timeOne = convertToTimeInt(obj1.data);
            const timeTwo = convertToTimeInt(obj2.data);
            
            return (timeOne - timeTwo) * (order === 'asc' ? 1 : -1);
          }
        },
        sortThirdClickReset: true,
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
        sortThirdClickReset: true,
        filterType: 'custom',
        customBodyRender: renderStatus,
        customFilterListOptions: {
          render: (options) => {
            if(options[0] === "All Orders") return [];
            return options;
          },
        },
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const orderOne = obj1.data;
            const orderTwo = obj2.data;

            console.log("one: ", orderOne);
            console.log("two: ", orderTwo);

            if(orderOne > orderTwo) {
              return order === 'asc' ? 1 : -1;
            } else {
              return order === 'asc' ? -1 : 1;
            }
          }
        },
        filterOptions: {
          names: ["Pending Orders", "Completed Orders"],
          logic(order, filters) {
            if (filters[0] === "Completed Orders") {
              return order === "Pending Orders";
            } else if (filters[0] === "Pending Orders") {
              return order === "Completed Orders";
            }
  
            return false;
          },
          display: DisplayStatusFilters
        }
      }
    },
    {
      name: "Id",
      options: {
        display: false, 
        viewColumns: false, 
        filter: false,
      }  
    },
];

export { columns } ;