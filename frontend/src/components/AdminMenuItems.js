import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SearchBar from "material-ui-search-bar";

import '../css/AdminMenuItems.css';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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
                            <TableRow key={row.itemName + "" + row.index + "" + row.categoryName} className={bgColor}>
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
    const [filter, setFilter] = useState("All");
    // create testing data
    const rows = [
            createData('Brioche French Toast', 
                'https://d1e3z2jco40k3v.cloudfront.net/-/media/mccormick-us/recipes/mccormick/q/800/quick_and_easy_french_toast_new_800x800.jpg?rev=7ec5983cd3674050aac15327c66935dc&vd=20200628T071104Z&hash=E2A73229EE45D0D9AD547240FE366160',
                'Appetizer', ['Family', 'Gluten Free'], 14.50, 'Item description'),
            createData('Italian Pizza',
                'https://thefoodellers.com/wp-content/uploads/2019/05/Italian-Pizza-Recipe.jpeg',
                'Main Dish', ['Family', 'Vegetarian'], 19.99, 'Item description'),
            createData('Drink', 
                'https://zdnet2.cbsistatic.com/hub/i/r/2020/06/09/2eacd230-d144-4224-9e64-aa012e900877/resize/1200x900/1e8024904299314d9378f958f86e920c/coca-cola-coke-coca-cola.jpg',
                'Drink', ['Individual'], 2.00, 'Item description'),
            createData('Cookies', 
                'https://celebratingsweets.com/wp-content/uploads/2018/12/MM-Cookies-1-500x500.jpg',
                'Side', ['Individual', 'Family'], 3.50, 'Item description'),
        ];
    const [displayContent, setDisplayContent] = useState(rows);
    // Fetch all menu items to display in table


    // update display contents based on search term
    const handleSearch = (searchTerm) => {
        if(searchTerm === ""){
            setDisplayContent(rows.filter(x => x.categoryName === filter));
        }
        else{
            setDisplayContent(displayContent.filter(x => x.itemName.toLowerCase().includes(searchTerm.toLowerCase()))); 
        }
    }
    // update display contents based on filter term
    // possible terms are: Main Dish, Appetizer, Drink, Side
    const handleFilterChange = (filter) => {

        console.log("handleFilter " + filter)
        if(filter === "All"){        
            setDisplayContent(rows); 
        }
        else{
            const newRows = [];
            for(var index in rows) { 
                // console.log(rows[index])
                if (rows[index]["categoryName"] === filter){
                    console.log("pushing " + rows[index]);
                    newRows.push(rows[index]); 
                }
            }
            console.log(newRows)
            setDisplayContent(newRows); 
        }
    }
    return (
        <div>
            <div className="aboveTableContainer">
                <Button className="menuAddButton">
                    <AddCircleIcon className="menuAddButtonIcon" />
                    Add Item
                </Button>
                <span style={{"display": "flex", "flexDirection": "row"}}>
                    <Select
                        className="menuFilterSelect"
                        id="item-filter-select"
                        defaultValue="All"
                        displayEmpty="false"
                        variant="outlined"
                        value={filter}
                        onChange={(v) => {
                            setFilter(v.target.value);
                            handleFilterChange(v.target.value);
                        }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Appetizer">Appetizer</MenuItem>
                        <MenuItem value="Main Dish">Main Dish</MenuItem>
                        <MenuItem value="Side">Side</MenuItem>
                        <MenuItem value="Drink">Drink</MenuItem>
                    </Select>
                    <SearchBar
                        className="menuSearchBar"
                        value={searchTerm}
                        onChange={(newValue) => setSearchTerm(newValue)}
                        onRequestSearch={() => handleSearch(searchTerm)}
                    />
                </span>
            </div>
            {menuTable(displayContent)}
        </div>
        
    );
}
