/**
 * This file renders a table filled with each item in the menu. It includes information
 * such as name, icon, price, addons, sizing, etc. This table is searchable based on name,
 * and sortable based on item caregory (main dish, appetizer, side, etc.). This table gives
 * the user the option to edit and remove existing items, and add new items.
 *
 * @summary     Renders admin menu items table for the Admin page
 * @author      PatrickBrown1
 */


import React, {useState, useEffect, useReducer} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Snackbar from "@material-ui/core/Snackbar";
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
import ChangeHeaderModal from './ChangeHeaderModal.js';
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

 * @return - modal displaying delete confirmation message
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
 * @param {Object} display - list of menu item objects currently being displayed
 * @param {string} setDisplay - sets display
 * @param {function} setDeleteConfirmation - sets value of deleteConfirmation
 * @param {function} handleFeatureChange -  function that handles when featured checkbox is toggled
 * @param {function} setCurrentEditItem - sets the item being edited if edit button is pressed

 * @return - renders table of menu items
 */
function menuTable(display, setDisplay, setDeleteConfirmation, handleFeatureChange, setCurrentEditItem) {
    return (
        <TableContainer component={Paper} className="menuTableContainer">
            <Table aria-label="simple table" className="menuTable">
                <TableHead>
                    <TableRow style={{"overflow": "hidden"}}>
                        <TableCell className="menuTableHeaders" width="5%">Feature</TableCell>
                        <TableCell className="menuTableHeaders" width="15%" align="center">Item Image</TableCell>
                        <TableCell className="menuTableHeaders" width="10%" align="left">Item Name</TableCell>
                        <TableCell className="menuTableHeaders" width="10%" align="left">Category Name</TableCell>
                        <TableCell className="menuTableHeaders" width="10%" align="left">Size</TableCell>
                        <TableCell className="menuTableHeaders" width="10%" align="left">Base Price</TableCell>
                        <TableCell className="menuTableHeaders" width="30%" align="left">Add-ons</TableCell>
                        <TableCell className="menuTableHeaders" width="10%" align="left">Edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {display.displayContent.map((row, index) => {
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
                                <TableCell className="menuRowText" width="10%">{row.itemName}</TableCell>
                                <TableCell align="left" className="menuRowText" width="10%">{row.categoryName}</TableCell>
                                <TableCell align="left" className="menuRowText" width="10%">
                                {
                                    row.basePrice.map((v) => {return (<>{v[0]}<br /></>)})
                                }
                                </TableCell>
                                <TableCell align="left" className="menuRowText" width="10%">
                                {
                                    row.basePrice.map((v) => <>${v[1]}<br /></>)
                                }
                                </TableCell>
                                <TableCell align="left" className="menuRowText accommodationCell" width="30%">
                                {
                                    row.options.map((v) => <p>{v[1].Description}</p>)
                                }
                                </TableCell>
                                <TableCell align="left" className="menuRowText" width="10%">
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
                setDisplayContent({displayContent: displayContent.displayContent.filter(x => x.id !== id)});
            }
        })
    
}
export default function AdminMenuItems (props) {
    const [deleteConfirmation, setDeleteConfirmation] = useState(["", ""]);
    
    const [itemList, setItemList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [checkboxUpdate, setCheckboxUpdate] = useState("");
    const [changeHeaderModal, setChangeHeaderModal] = useState(false);
    const [addItemModal, setAddItemModal] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState("");
    const [itemAddedSuccess, setItemAddedSuccess] = useState(false)
    const [itemEditedSuccess, setItemEditedSuccess] = useState(false);

    // const [searchTerm, setSearchTerm] = useState("");
    // const [filter, setFilter] = useState("All");
    // const [displayContent, setDisplayContent] = useState([]);
    const [display, setDisplay] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {searchTerm: "", filter: "All", displayContent: itemList}
    )
    const [headerImageURL, setHeaderImageURL] = useState("");

    // fetch all menu items to display in table
    useEffect(() => {
        var data = null;
        var imgUrl = null;
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
            const urlFetch = await fetch(`${BACKEND_URL}menuImages/`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
            })
            data = await urlFetch.json();
            setHeaderImageURL(data.imageUrl.imageUrl);
            setItemList(rows);
            setDisplay({displayContent: rows});
            setLoaded(true);
        }
        
        fetchData();
    }, [loaded])

    /**
     * This functions takes in the filter string and the search term, and updates
     * the display state to these new two values, and the items that correspond to
     * these two values
     *
     * @param {String} filter - current filter
     * @param {String} searchTerm - current search term
     */
    const handleDisplayChange = (filter, searchTerm) => {
        // takes item list, filters by category then search term
        let workingItems = [];
        // filter by category
        if(filter === "All"){ 
            workingItems = itemList;
        }
        else if(filter === "Featured"){
            for(var index in itemList) { 
                if (itemList[index].isFeatured){
                    workingItems.push(itemList[index]); 
                }
            }
        }
        else{
            for(var i in itemList) { 
                if (itemList[i]["categoryName"] === filter){
                    workingItems.push(itemList[i]); 
                }
            }
        }
        // filter by search term
        if(searchTerm !== ""){
            workingItems = workingItems.filter(x => x.itemName.toLowerCase().includes(searchTerm.toLowerCase()));

        }
        setDisplay({filter: filter, searchTerm: searchTerm, displayContent: workingItems});
    }
    /**
    * Updates items and database when a feature checkbox is pressed
    *
    * @param {Object} row - row being updated
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
        var displayContentIndex = display.displayContent.findIndex(x => x.id === itemID);
        if(displayContentIndex !== -1){
            display.displayContent[displayContentIndex].isFeatured = newValue;
            setDisplay({displayContent: display.displayContent});
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
            <div className="adminMenuPageContainer">
                {currentEditItem !== "" && <EditMenuItemModal showModal={currentEditItem !== ""} setCurrentEditItem={setCurrentEditItem} item={itemList.filter(item => item.id === currentEditItem)[0]} setLoaded={setLoaded} setItemEditedSuccess={setItemEditedSuccess}/>}
                {deleteConfirmation[0] !== "" && deleteConfirmationModal(deleteConfirmation, setDeleteConfirmation, itemList, setItemList, display, setDisplay)}
                {addItemModal && <AddMenuItemModal addItemModal={addItemModal} setAddItemModal={setAddItemModal} setLoaded={setLoaded} setItemAddedSuccess={setItemAddedSuccess}/>}
                {changeHeaderModal && <ChangeHeaderModal changeHeaderModal={changeHeaderModal} setChangeHeaderModal={setChangeHeaderModal} setLoaded={setLoaded} headerImageURL={headerImageURL}/>}
                {/* Add/Edit item success snackbars*/}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={itemAddedSuccess}
                    autoHideDuration={5000}
                    onClose={() => setItemAddedSuccess(false)}
                    message={<span id="message-id">Item successfully added!</span>}
                />
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={itemEditedSuccess}
                    autoHideDuration={5000}
                    onClose={() => setItemEditedSuccess(false)}
                    message={<span id="message-id">Item successfully edited!</span>}
                />

                <div className="aboveTableContainer">
                    <div className="addUpdateButtonContainer">
                        <Button className="menuAddButton" onClick={() => {setAddItemModal(true)}}>
                            <AddCircleIcon className="menuAddButtonIcon" />
                            Add Item
                        </Button>
                        <Button className="menuChangeHeaderButton" onClick={() => {setChangeHeaderModal(true)}}>
                            Change Header
                        </Button>
                    </div>
                    <div className="searchFilterContainer">
                        <Select
                            className="menuFilterSelect"
                            id="item-filter-select"
                            defaultValue="All"
                            displayEmpty="false"
                            variant="outlined"
                            value={display.filter}
                            onChange={(v) => {
                                handleDisplayChange(v.target.value, display.searchTerm);
                            }}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Featured">Featured</MenuItem>
                            <MenuItem value="Appetizers">Appetizers</MenuItem>
                            <MenuItem value="Main Dishes">Main Dishes</MenuItem>
                            <MenuItem value="Sides">Sides</MenuItem>
                            <MenuItem value="Drinks">Drinks</MenuItem>
                        </Select>
                        <SearchBar
                            className="menuSearchBar"
                            value={display.searchTerm}
                            onChange={(newValue) => {
                                handleDisplayChange(display.filter, newValue);
                            }}
                            onRequestSearch={(newValue) => {
                                handleDisplayChange(display.filter, newValue);
                            }}
                            onCancelSearch={() => {                                
                                handleDisplayChange(display.filter, "");
                            }}
                        />
                    </div>
                </div>
                {menuTable(display, setDisplay, setDeleteConfirmation, handleFeatureChange, setCurrentEditItem)}
            </div>
        )
    }
    else{
        return (
            <div>Loading...</div>
        )
    }
}
