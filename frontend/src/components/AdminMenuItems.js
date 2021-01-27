import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";

import '../css/AdminMenuItems.css';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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



// Renders modal that asks the user if they want to remove the item from the menu
const deleteConfirmationModal = (deleteConfirmation, setDeleteConfirmation) => {
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
// Renders table of items based on what is passed in through displayContent
function menuTable(displayContent) {
    return (
        <TableContainer component={Paper} className="menuTableContainer">
            <Table aria-label="simple table" stickyHeader className="menuTable">
                <TableHead>
                    <TableRow >
                        <TableCell className="menuTableHeaders">#</TableCell>
                        <TableCell className="menuTableHeaders" align="center">Item Image</TableCell>
                        <TableCell className="menuTableHeaders" align="left">Item Name</TableCell>
                        <TableCell className="menuTableHeaders" align="left">Category Name</TableCell>
                        <TableCell className="menuTableHeaders" align="left">Size/Options</TableCell>
                        <TableCell className="menuTableHeaders" align="left">Base Price</TableCell>
                        <TableCell className="menuTableHeaders" align="left">Description</TableCell>
                        <TableCell className="menuTableHeaders" align="left">Edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayContent.map((row, index) => {
                        const bgColor = index % 2 === 0 ? "evenrowbg" : "oddrowbg";
                        return (
                            <TableRow key={row.itemName} className={bgColor}>
                                <TableCell component="th" scope="row" className="menuRowText">
                                    {index}
                                </TableCell>
                                <TableCell align="center" className="menuRowText">
                                    <img src={row.imgSource} alt={row.itemName} className="menuItemImage"/>
                                </TableCell>
                                <TableCell className="menuRowText">{row.itemName}</TableCell>
                                <TableCell align="left" className="menuRowText">{row.categoryName}</TableCell>
                                <TableCell align="left" className="menuRowText">
                                    {row.options.map((v) => {
                                        return (<p>{v}</p>)
                                    })}
                                </TableCell>
                                <TableCell align="left" className="menuRowText">{row.basePrice}</TableCell>
                                <TableCell align="left" className="menuRowText">{row.description}</TableCell>
                                <TableCell align="left" className="menuRowText">
                                    <EditIcon style={{"marginRight": "5px"}}/>
                                    <DeleteIcon style={{"marginLeft": "5px"}}/>
                                </TableCell>
                            </TableRow>
                    )})}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default function AdminMenuItems (props) {
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    // create testing data
    const rows = [
        createData('Brioche French Toast', 
            'https://d1e3z2jco40k3v.cloudfront.net/-/media/mccormick-us/recipes/mccormick/q/800/quick_and_easy_french_toast_new_800x800.jpg?rev=7ec5983cd3674050aac15327c66935dc&vd=20200628T071104Z&hash=E2A73229EE45D0D9AD547240FE366160',
            'Appetizers', ['Family', 'Gluten Free'], 14.50, 'Item description'),
    ];
    const [displayContent, setDisplayContent] = useState(rows);
    // Fetch all menu items to display in table


    // update display contents based on search term
    const handleSearch = (searchTerm) => {
        console.log("handleSearch")
        const newRows = [
            createData('Brioche French Toast', 
                'https://d1e3z2jco40k3v.cloudfront.net/-/media/mccormick-us/recipes/mccormick/q/800/quick_and_easy_french_toast_new_800x800.jpg?rev=7ec5983cd3674050aac15327c66935dc&vd=20200628T071104Z&hash=E2A73229EE45D0D9AD547240FE366160',
                'Appetizers', ['Family', 'Gluten Free'], 14.50, 'Item description'),
            createData('Italian Pizza',
                'https://thefoodellers.com/wp-content/uploads/2019/05/Italian-Pizza-Recipe.jpeg',
                'Main Dishes', ['Family', 'Vegetarian'], 19.99, 'Item description'),
            createData('Cookies', 
                'https://celebratingsweets.com/wp-content/uploads/2018/12/MM-Cookies-1-500x500.jpg',
                'Sides', ['Individual', 'Family'], 3.50, 'Item description'),
            createData('Cookies', 
                'https://celebratingsweets.com/wp-content/uploads/2018/12/MM-Cookies-1-500x500.jpg',
                'Sides', ['Individual', 'Family'], 3.50, 'Item description'),
            createData('Cookies', 
                'https://celebratingsweets.com/wp-content/uploads/2018/12/MM-Cookies-1-500x500.jpg',
                'Sides', ['Individual', 'Family'], 3.50, 'Item description'),
        ];
        setDisplayContent(newRows); 
    }
    return (
        <div>
            <div className="aboveTableContainer">
                <Button>+ Add Item</Button>
                <SearchBar
                    value={searchTerm}
                    onChange={(newValue) => setSearchTerm(newValue)}
                    onRequestSearch={() => handleSearch(searchTerm)}
                />
            </div>
            {menuTable(displayContent)}
        </div>
        
    );
}
