/**
 * This file renders a table filled with each item in the menu. It includes information
 * such as name, icon, price, addons, sizing, etc. This table is searchable based on name,
 * and sortable based on item caregory (main dish, appetizer, side, etc.). This table gives
 * the user the option to edit and remove existing items, and add new items.
 *
 * @summary Renders admin menu items table for the Admin page
 * @author PatrickBrown1
 */


import React, {useState, useEffect} from 'react';
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
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Checkbox from '@material-ui/core/Checkbox';

import '../css/AdminMenuItems.css';
import AddMenuItemModal from './AddMenuItemModal.js';
import EditMenuItemModal from './EditMenuItemModal.js';
const config = require('../config');
const BACKEND_URL = config.backend.uri;

/**
 * This function takes in data points from the get item route and formats them into
 * an object readable by the table.
 *
 * @param {string} itemName - name of the item
 * @param {string} imgSource - url of image source
 * @param {string} categoryName - item's category
 * @param {Object[]} options -  array of accommodation objects
 * @param {Object} baseprice - object with Individual and Family price properties
 * @param {string} description - description of the item
 * @param {string} id - item's id in database
 * @param {boolean} featured - indicates whether or not the item is featured on the menu
 * @param {Object} dietaryInfo - object containing dairyFree, vegan, vegetarian, and gluten-free boolean properties
 *
 * @return {Object} - Object with above parameters formatted in proper order.
 */
function createData(itemName, imgSource, categoryName, options, baseprice, description, id, featured, dietaryInfo) {
  return {
        "itemName": itemName, 
        "imgSource": imgSource,
        "categoryName": categoryName, 
        "options": options, 
        "basePrice": baseprice, 
        "description": description,
        "id": id,
        "isFeatured": featured,
        "dietaryInfo": dietaryInfo
    };
}
/**
 * Renders modal that asks the user if they want to remove the item from the menu.
 *
 * @param {boolean} deleteConfirmation - indicates whether or not to show the delete confirmation modal
 * @param {function} setDeleteConfirmation - sets value of deleteConfirmation
 * @param {Object[]} itemList - list of all menu item objects
 * @param {function} setItemList -  sets itemList
 * @param {Object} displayContent - list of menu item objects currently being displayed
 * @param {string} setDisplayContent - sets displayContent

 * @return modal displaying delete confirmation message
 */
const deleteConfirmationModal = (deleteConfirmation, setDeleteConfirmation, itemList, setItemList, displayContent, setDisplayContent) => {
    return (
        <Modal 
            show={deleteConfirmation !== []} 
            onHide={() => setDeleteConfirmation(["", ""])} 
            backdrop='static'
            style={{"marginTop": "30vh"}}
        >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Are you sure you want to remove {deleteConfirmation[0]} from the menu?</p>
                    </div>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="primary" className="menuAddButton" onClick={() => {
                        // REMOVE ITEM FROM MENU
                        console.log("removing item from menu")
                        
                        // Call database, remove item from menu
                        handleRemoveByID(deleteConfirmation[1], itemList, setItemList, displayContent, setDisplayContent);
                        setDeleteConfirmation(["", ""]);
                    }}>
                        Remove Item
                    </Button>
                    <Button variant="secondary" onClick={() => {
                        setDeleteConfirmation(["", ""]);
                    }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
}
/**
 * Renders table of items based on what is passed in through displayContent
 *
 * @param {Object} displayContent - list of menu item objects currently being displayed
 * @param {string} setDisplayContent - sets displayContent
 * @param {function} setDeleteConfirmation - sets value of deleteConfirmation
 * @param {function} handleFeatureChange -  function that handles when featured checkbox is toggled
 * @param {function} setCurrentEditItem - sets the item being edited if edit button is pressed

 * @return renders table of menu items
 */
function menuTable(displayContent, setDisplayContent, setDeleteConfirmation, handleFeatureChange, setCurrentEditItem) {
    return (
        <TableContainer component={Paper} className="menuTableContainer">
            <Table aria-label="simple table" stickyHeader className="menuTable">
                <TableHead>
                    <TableRow style={{"overflow": "hidden"}}>
                        <TableCell className="menuTableHeaders" width="5%">Feature</TableCell>
                        <TableCell className="menuTableHeaders" width="15%" align="center">Item Image</TableCell>
                        <TableCell className="menuTableHeaders" width="15%" align="left">Item Name</TableCell>
                        <TableCell className="menuTableHeaders" width="12%" align="left">Category Name</TableCell>
                        <TableCell className="menuTableHeaders" width="12%" align="left">Size</TableCell>
                        <TableCell className="menuTableHeaders" width="12%" align="left">Base Price</TableCell>
                        <TableCell className="menuTableHeaders" width="12%" align="left">Add-ons</TableCell>
                        <TableCell className="menuTableHeaders" width="12%" align="left">Edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayContent.map((row, index) => {
                        const bgColor = index % 2 === 0 ? "evenrowbg" : "oddrowbg";
                        // console.log(row);
                        return (
                            <TableRow key={row._id} className={bgColor}>
                                <TableCell component="th" scope="row" className="menuRowText" width="5%">
                                    <Checkbox
                                        id={row._id + "checkbox"}
                                        checked={row.isFeatured}
                                        onChange={(e) => {
                                            handleFeatureChange(row);
                                        }}
                                        name={row.itemName}
                                        style ={{
                                            color: "#747474",
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center" className="menuRowText" width="15%">
                                    <img src={row.imgSource} alt={row.itemName} className="menuItemImage"/>
                                </TableCell>
                                <TableCell className="menuRowText" width="15%">{row.itemName}</TableCell>
                                <TableCell align="left" className="menuRowText" width="12%">{row.categoryName}</TableCell>
                                <TableCell align="left" className="menuRowText" width="12%">
                                {
                                    row.basePrice.map((v) => {return (<>{v[0]}<br /></>)})
                                }
                                </TableCell>
                                <TableCell align="left" className="menuRowText" width="12%">
                                {
                                    row.basePrice.map((v) => <>${v[1]}<br /></>)
                                }
                                </TableCell>
                                <TableCell align="left" className="menuRowText" width="12%">
                                {
                                    row.options.map((v) => <p>{v[1].Description}</p>)
                                }
                                </TableCell>
                                <TableCell align="left" className="menuRowText" width="12%">
                                    <IconButton onClick={() => setCurrentEditItem(row.id)}>
                                        <EditIcon style={{"marginRight": "5px"}}/>
                                    </IconButton>
                                    <IconButton aria-label="delete item" onClick={() => setDeleteConfirmation([row.itemName, row.id])}>
                                        <DeleteIcon style={{"marginLeft": "5px"}}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                    )})}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
/**
 * Removed an item from the database and from page state
 *
 * @param {string} id - id of item being removed
 * @param {Object[]} itemList - list of all menu items
 * @param {function} setItemList - sets value of itemList
 * @param {Object[]} displayContent -  list of all menu items being displayed
 * @param {function} setDisplayContent - sets value of displayContent

 * @return void
 */
async function handleRemoveByID(id, itemList, setItemList, displayContent, setDisplayContent){
    // remove from database
    console.log("Removing " + id);
    await fetch(`${BACKEND_URL}item/remove`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                "_id": id
            })
        }).then(res => {
            if(res.ok){
                console.log("Remove successful!")
                // remove from rows
                setItemList(itemList.filter(x => x.id !== id));
                // remove from filtered rows
                setDisplayContent(displayContent.filter(x => x.id !== id));
            }
        })
    
}
export default function AdminMenuItems (props) {
    const [deleteConfirmation, setDeleteConfirmation] = useState(["", ""]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [displayContent, setDisplayContent] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [checkboxUpdate, setCheckboxUpdate] = useState("");
    const [addItemModal, setAddItemModal] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState("");
    // Fetch all menu items to display in table
    useEffect(() => {
        var data = null;
        const fetchData = async () => {
            const res = await fetch(`${BACKEND_URL}item/`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
            })
            data = await res.json();
            console.log(data.items);
            const rows = [];
            data.items.forEach(element => {
                // log(element);
                rows.push(
                    createData(
                        element.Name,
                        element.pictureURL, 
                        element.Category, 
                        Object.entries(element.Accommodations),
                        Object.entries(element.Prices), 
                        element.Description,
                        element._id,
                        element.isFeatured,
                        element.dietaryInfo
                ));
            });
            setItemList(rows);
            setDisplayContent(rows);
            setLoaded(true);
        }
        
        fetchData();
    }, [loaded])
    // 
    /**
    * Updates display contents based on search term
    *
    * @param {string} searchTerm - string being searched for
    *
    * @return void
    */
    const handleSearch = (searchTerm) => {
        // Empty search term, so we want to reset the displayed items to those of the current category
        if(searchTerm === ""){
            if(filter === "All"){        
                setDisplayContent(itemList); 
            }
            else {
                setDisplayContent(itemList.filter(x => x.categoryName === filter));
            }
        }
        else{
            // Filters the current display content to show those that contain the
            // search term in the name AND correspond to current filter
            if(filter === "All"){
                setDisplayContent(itemList.filter(x => x.itemName.toLowerCase().includes(searchTerm.toLowerCase()))); 
            }
            else {
                // Filter based on search term and filter term
                setDisplayContent(itemList.filter(x => 
                    x.itemName.toLowerCase().includes(searchTerm.toLowerCase())
                    && x.categoryName === filter
                )); 
            }
        }
    }
    /**
    * Updates display contents based on filter term
    *
    * @param {string} filter - filter being used, possible terms are: Main Dish, Appetizer, Drink, Side, Featured
    *
    * @return void
    */
    const handleFilterChange = (filter) => {
        // clear search
        setSearchTerm("");
        if(filter === "All"){        
            setDisplayContent(itemList); 
        }
        else{
            const newRows = [];
            for(var index in itemList) { 
                if (itemList[index]["categoryName"] === filter){
                    newRows.push(itemList[index]); 
                }
            }
            console.log(newRows)
            setDisplayContent(newRows); 
        }
    }
    /**
    * Updates items and database when a feature checkbox is pressed
    *
    * @param {Object} row - row being updated
    *
    * @return void
    */
    const handleFeatureChange = async (row) => {
        const itemID = row.id;
        const newValue = !row.isFeatured;
        row.isFeatured = newValue;
        // update item's feature property in local (displayContent and itemList)
        var itemListIndex = -1;
        itemList.forEach((x, index) => {
            itemListIndex = x.id === itemID ? index : itemListIndex;
        })
        if(itemListIndex !== -1){
            setItemList(prev => {
                prev[itemListIndex].isFeatured = newValue;
                return prev;
            })
        }
        var displayContentIndex = displayContent.findIndex(x => x.id === itemID);
        if(displayContentIndex !== -1){
            displayContent[displayContentIndex].isFeatured = newValue;
            setDisplayContent(displayContent);
        }
        setCheckboxUpdate(row.itemName + "" + newValue);

        // update item's feature property in database
        await fetch(`${BACKEND_URL}item/feature`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                "_id": itemID,
                "isFeatured": newValue
            })
        })
    }
    
    if(loaded){
        return (  
            <div>
                {currentEditItem !== "" && <EditMenuItemModal showModal={currentEditItem !== ""} setCurrentEditItem={setCurrentEditItem} item={itemList.filter(item => item.id === currentEditItem)[0]} setLoaded={setLoaded}/>}
                {deleteConfirmation[0] !== "" && deleteConfirmationModal(deleteConfirmation, setDeleteConfirmation, itemList, setItemList, displayContent, setDisplayContent)}
                {addItemModal && <AddMenuItemModal addItemModal={addItemModal} setAddItemModal={setAddItemModal} setLoaded={setLoaded} />}
                <div className="aboveTableContainer">
                    <Button className="menuAddButton" onClick={() => {setAddItemModal(true)}}>
                        <AddCircleIcon className="menuAddButtonIcon" />
                        Add Item
                    </Button>
                    <div className="searchFilterContainer">
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
                            <MenuItem value="Appetizers">Appetizers</MenuItem>
                            <MenuItem value="Main Dishes">Main Dishes</MenuItem>
                            <MenuItem value="Sides">Sides</MenuItem>
                            <MenuItem value="Drinks">Drinks</MenuItem>
                        </Select>
                        <SearchBar
                            className="menuSearchBar"
                            value={searchTerm}
                            onChange={(newValue) => setSearchTerm(newValue)}
                            onRequestSearch={() => handleSearch(searchTerm)}
                            onCancelSearch={() => {
                                setSearchTerm(""); 
                                handleSearch("");
                            }}
                        />
                    </div>
                </div>
                {menuTable(displayContent, setDisplayContent, setDeleteConfirmation, handleFeatureChange, setCurrentEditItem)}
            </div>
        )
    }
    else{
        return (
            <div>Loading...</div>
        )
    }
}
