import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import '../css/AdminMenuItems.css';
import {
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";

function createData(itemName, imgSource, categoryName, options, baseprice, description) {
  return {
        "itemName": itemName, 
        "imgSource": imgSource,
        "categoryName": categoryName, 
        "options": options, 
        "basePrice": baseprice, 
        "description": description
    };
}

export default function AdminMenuItems (props) {
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    // create testing data
    const rows = [
        createData('Brioche French Toast', 
            'https://d1e3z2jco40k3v.cloudfront.net/-/media/mccormick-us/recipes/mccormick/q/800/quick_and_easy_french_toast_new_800x800.jpg?rev=7ec5983cd3674050aac15327c66935dc&vd=20200628T071104Z&hash=E2A73229EE45D0D9AD547240FE366160',
            'Appetizers', ['Family', 'Gluten Free'], 14.50, 'Item description'),
        createData('Italian Pizza',
            'https://thefoodellers.com/wp-content/uploads/2019/05/Italian-Pizza-Recipe.jpeg',
            'Main Dishes', ['Family', 'Vegetarian'], 19.99, 'Item description'),
        createData('Cookies', 
            'https://celebratingsweets.com/wp-content/uploads/2018/12/MM-Cookies-1-500x500.jpg',
            'Sides', ['Individual', 'Family'], 3.50, 'Item description'),
    ];
    // Fetch all menu items to display in table



    // Modal that asks the user if they want to remove the item from the menu
    const deleteConfirmationModal = () => {
        return (
            <Modal 
                show={deleteConfirmation !== ""} 
                onHide={() => setDeleteConfirmation("")} 
                backdrop='static'
            >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Menu Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <p>Are you sure you want to remove {deleteConfirmation} from the menu?</p>
                        </div>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => {
                            // REMOVE ITEM FROM MENU
                            console.log("removing item from menu")
                            
                            // Call database, remove item from menu
                            
                            setDeleteConfirmation("");
                        }}>
                            Remove Item
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            setDeleteConfirmation("");
                        }}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
    }
    
    const menuTable = () => {
        return (
            <TableContainer component={Paper} >
                <Table aria-label="simple table" className="menuTableContainer">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="Center">Item Image</TableCell>
                            <TableCell align="left">Item Name</TableCell>
                            <TableCell align="left">Category Name</TableCell>
                            <TableCell align="left">Size/Options</TableCell>
                            <TableCell align="left">Base Price</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="left">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.itemName}>
                                <TableCell component="th" scope="row">
                                    {index}
                                </TableCell>
                                <TableCell align="center">
                                    <img src={row.imgSource} alt={row.itemName} className="menuItemImage"/>
                                </TableCell>
                                <TableCell>{row.itemName}</TableCell>
                                <TableCell align="left">{row.categoryName}</TableCell>
                                <TableCell align="left">
                                    {row.options.map((v) => {
                                        return (<p>{v}</p>)
                                    })}
                                </TableCell>
                                <TableCell align="left">{row.basePrice}</TableCell>
                                <TableCell align="left">{row.description}</TableCell>
                                <TableCell align="left">Edit buttons</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
    
    return (
        <div>
            <Button onClick={() => setDeleteConfirmation("french toast")}>+ Add Item</Button>
            {menuTable()}
            {deleteConfirmationModal()}
        </div>
        
    );
}
