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
 */

// Import helper functions from utils
import {
    renderStatus,
    DisplayDateFilters,
    DisplayStatusFilters,
    updateDateFilters,
    renderDateFilters    
} from '../util/OrdersTableFunctions';

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
        filterType: 'custom',
        customBodyRender: renderStatus,
        customFilterListOptions: {
          render: (options) => {
            if(options[0] === "All Orders") return [];
            return options;
          },
        },
        filterOptions: {
          names: ["Pending Orders", "Completed Orders"],
          logic(order, filters) {
            if (filters[0] == "Completed Orders") {
              return order === "Pending Orders";
            } else if (filters[0] == "Pending Orders") {
              return order === "Completed Orders";
            }
  
            return false;
          },
          display: DisplayStatusFilters
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

export { columns } ;