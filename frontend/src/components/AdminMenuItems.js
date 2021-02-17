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

const config = require('../config');
const BACKEND_URL = config.backend.uri;

function createData(itemName, imgSource, categoryName, options, baseprice, description, id, featured) {
  return {
        "itemName": itemName, 
        "imgSource": imgSource,
        "categoryName": categoryName, 
        "options": options, 
        "basePrice": baseprice, 
        "description": description,
        "id": id,
        "isFeatured": featured,
    };
}

// Renders modal that asks the user if they want to remove the item from the menu
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

// Renders table of items based on what is passed in through displayContent
function menuTable(itemList, setItemList, displayContent, setDisplayContent, setDeleteConfirmation, handleFeatureChange) {
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
                        console.log(row);
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
                                    <IconButton>
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
// handle remove based on id passed in through params
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
    const [changeHeaderModal, setChangeHeaderModal] = useState(false);
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
                console.log(element);
                rows.push(
                    createData(
                        element.Name,
                        element.pictureURL, 
                        element.Category, 
                        Object.entries(element.Accomodations),
                        Object.entries(element.Prices), 
                        element.Description,
                        element._id,
                        element.isFeatured,
                ));
            });
            setItemList(rows);
            setDisplayContent(rows);
            setLoaded(true);
        }
        
        fetchData();
    }, [setLoaded,])
    // update display contents based on search term
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
    // update display contents based on filter term
    // possible terms are: Main Dish, Appetizer, Drink, Side
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
    // Called when a set featured checkbox is clicked
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
                {deleteConfirmation[0] !== "" && deleteConfirmationModal(deleteConfirmation, setDeleteConfirmation, itemList, setItemList, displayContent, setDisplayContent)}
                <div className="aboveTableContainer">
                    <div>
                        <Button className="menuAddButton">
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
                            onCancelSearch={() => {
                                setSearchTerm(""); 
                                handleSearch("");
                            }}
                        />
                    </div>
                </div>
                {menuTable(itemList, setItemList, displayContent, setDisplayContent, setDeleteConfirmation, handleFeatureChange)}
            </div>
        )
    }
    else{
        return (
            <div> </div>
        )
    }
}
