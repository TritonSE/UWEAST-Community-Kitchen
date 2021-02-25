/**
 * This file contains the modal for editing an item that exists the menu. It's split
 * into sections for each of the form items, including name, image url, category,
 * prices, accommodations, and description. The fields are automatically filled
 * in with the current information from the item for the user to edit.
 * 
 * It uses MaterialUI's form control
 * to create the form. 
 * The required fields are name, image url, category, description, and price.
 * Price is considered to be filled out if one of the prices is complete (so
 * one of the prices can be empty).
 * Also, a given accommodations is considered to be filled out if it has
 * 0 or 2 fields completed. If 0, it is removed, if 1, it is considered incomplete.
 * 
 * Errors are thrown under the following cases:
 *     1. one of the required fields is empty
 *     2. one of the accommodations fields has one of the fields filled out
 *     3. none of the prices are filled out
 *   
 * A new accommodation field can be added if both fields of the previous one
 * has values, if not it will not be added.
 * Disclaimer: This file seems really long (it is), but it isn't very hard to
 * understand. A lot of the bulk comes from Material UI's form control handling
 * and general HTML property tags.
 *
 * @summary     Renders a modal for editing an item existing in the menu.
 * @author      PatrickBrown1
 */

import React, { useState, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import { Modal, FormControl, Checkbox, FormControlLabel, FormGroup, OutlinedInput, Select, MenuItem, InputAdornment, FormHelperText, Snackbar, IconButton } from '@material-ui/core';
import '../css/AddMenuItemModal.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

// renders a red asterix that indicates a required field
function requiredAsterix(){
    return (
        <p className="requiredAsterix">*</p>
    );
}
export default function EditMenuItemModal (props) {

    const showModal = props.showModal;
    const setShowModal = props.setCurrentEditItem;
    const setLoaded = props.setLoaded;
    // form states
    const [itemName, setItemName] = useState(props.item.itemName);
    const [itemCategory, setItemCategory] = useState(props.item.categoryName)

    let [individualItemPrice, setIndividualItemPrice] = useState(props.item.basePrice[0][0] === "Individual" ? props.item.basePrice[0][1] : ""); 
    let [familyItemPrice, setFamilyItemPrice] = useState(props.item.basePrice[0][0] === "Family" ? props.item.basePrice[0][1] : props.item.basePrice.length === 2 ? props.item.basePrice[1][1] : "" );
    
    const [itemImageURL, setItemImageURL] = useState(props.item.imgSource)
    const [itemDescription, setItemDescription] = useState(props.item.description)
    /*  addOns is an array of objects 
    [
        {
            name: "",
            price: ""
        }
    ]
    */
    let tempaddon = [];
    props.item.options.forEach(item => {
        tempaddon.push({"name": item[1].Description, "price": item[1].Price});
    })
    const [addOns, setAddOns] = useState(tempaddon);
    
        // dietary info
    const [vegan, setVegan] = useState(props.item.dietaryInfo !== undefined ? props.item.dietaryInfo.vegan : false);
    const [vegetarian, setVegetarian] = useState(props.item.dietaryInfo !== undefined ? props.item.dietaryInfo.vegetarian : false);
    const [glutenFree, setGlutenFree] = useState(props.item.dietaryInfo !== undefined ? props.item.dietaryInfo.glutenFree : false);
    const [containsDairy, setContainsDairy] = useState(props.item.dietaryInfo !== undefined ? props.item.dietaryInfo.containsDairy : false);

    const [menuError, setMenuError] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {visible: false, message: ""}
    )
    
    const handleSubmit = async () => {
        // validate basic input
        if(itemName === "" || 
            itemCategory === "" || 
            (individualItemPrice === "" && familyItemPrice === "") || 
            itemImageURL === "" || itemDescription === ""
        ){
            console.log("fail basic");
            setMenuError(true);
            setErrorSnackbar({visible: true, message: "There was an error in the form"});
            return;
        }
        // validate addons
        let failAddOn = false;
        addOns.forEach(item => {
            if((item.price === "" && item.name !== "") || (item.price !== "" && item.name === "")){
                // error
                console.log("fail add on");
                failAddOn = true;
                setMenuError(true);
                setErrorSnackbar({visible: true, message: "One or more addons weren't properly filled in"});
                return;
            }
            else if(item.name !== "" && parseFloat(item.price) < 0){
                //negative number
                console.log("add on price was negative");
                failAddOn = true;
                setMenuError(true);
                setErrorSnackbar({visible: true, message: "Negative prices are not allowed in the menu"});
                return;
            }
        })
        if(failAddOn){
            setMenuError(true);
            setErrorSnackbar({visible: true, message: "One or more addons weren't properly filled in"});
            return;
        }
        // send to db
        console.log("sending to database");

        // format data into item object
        let pricesObj = {};
        if(individualItemPrice !== ""){
            pricesObj.Individual = individualItemPrice;
        }
        if(familyItemPrice !== ""){
            pricesObj.Family = familyItemPrice;
        }
        let accommodations = [];
        addOns.forEach(addon => {
            if(addon.name !== "" && addon.price !== ""){
                accommodations.push({"Description": addon.name, "Price": addon.price});
            }
        })
        const dietaryInfo = {
            "vegan": vegan,
            "vegetarian": vegetarian,
            "glutenFree": glutenFree,
            "containsDairy": containsDairy,
        };
        const itemObject = {
            "_id": props.item.id,
            "Name": itemName,
            "pictureURL": itemImageURL,
            "Description": itemDescription,
            "Category": itemCategory,
            "Prices": pricesObj,
            "isFeatured": false,
            "isCompleted": false,
            "Accommodations": accommodations,
            "dietaryInfo": dietaryInfo
        }
        // push to database
        await fetch(`${BACKEND_URL}item/edit`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(itemObject)
        }).then(res => {
            if(res.ok){
                props.setItemEditedSuccess(true);
                // refetch
                setLoaded(false);
                setShowModal("");
            }
            else{
                alert("There was an error. Recheck your inputs and try again");
            }
        })
        
    }
    return (
        <>
            {/* Failure Snackbar */}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={errorSnackbar.visible}
                autoHideDuration={5000}
                onClose={() => setErrorSnackbar({visible: false, message: ""})}
                message={<span id="message-id">{errorSnackbar.message}</span>}
            />
            <Modal open={showModal} onClose={() => setShowModal("")} 
                className="modalContainer"
            >
                <div className="modalBackground">
                    <div className="headerContainer">
                    <IconButton
                        className="removeAddOnButton"
                        onClick={() => setShowModal("")}
                    >
                        <ClearIcon/>
                    </IconButton>
                    </div>
                    <form autocomplete="off">
                        <div className="modalBody">
                            {/* Item Name */}
                            <p className="formLabelText">Name {requiredAsterix()}</p>
                            <FormControl fullWidth error={menuError && itemName === ""} className="formItem" margin='dense'>
                                <OutlinedInput name="name" id="name" className="formTextInput"
                                    required 
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    size="small"
                                />
                            </FormControl>
                            {/* Item Image URL */}
                            <p className="formLabelText">Image Link {requiredAsterix()}</p>
                            <FormControl fullWidth error={menuError && (itemImageURL === "")} className="formItem" margin='dense'>
                                <OutlinedInput name="imageURL" id="imageURL" className="formTextInput"
                                    required 
                                    value={itemImageURL}
                                    onChange={(e) => setItemImageURL(e.target.value)}
                                    size="small"
                                />
                            </FormControl>

                            {/* Item Category */}
                            <p className="formLabelText">Category Name {requiredAsterix()}</p>
                            <FormControl fullWidth error={menuError && itemCategory === ""} className="formItem" margin='dense' variant="outlined">
                                <Select name="category" type="text" id="category" className="formSelectInput" required 
                                    placeholder=""
                                    value={itemCategory}
                                    onChange={(e) => setItemCategory(e.target.value)}
                                    size="small"
                                    displayEmpty
                                >
                                    <MenuItem value="Appetizers">Appetizers</MenuItem>
                                    <MenuItem value="Main Dishes">Main Dishes</MenuItem>
                                    <MenuItem value="Sides">Sides</MenuItem>
                                    <MenuItem value="Drinks">Drinks</MenuItem>
                                </Select>
                            </FormControl>
                            {/* Item Sizing and Price */}
                            <div className="priceSizeContainer">
                                <div className="sizeContainer">
                                    <p className="formLabelText">Size</p>
                                    <FormControl margin='dense'>
                                        <OutlinedInput name="name" id="individuallabel" className="formTextInput"
                                            required 
                                            value={"Individual"}
                                            size="small"
                                            disabled
                                        />
                                    </FormControl>
                                    <FormControl margin='dense'>
                                        <OutlinedInput name="name" id="familylabel" className="formTextInput"
                                            required 
                                            value={"Family"}
                                            size="small"
                                            disabled
                                        />
                                    </FormControl>
                                </div>
                                
                                <div className="priceContainer">
                                    <p className="formLabelText">Price</p>
                                    <FormControl error={menuError && individualItemPrice === "" && familyItemPrice === ""} margin='dense' variant="outlined">
                                        <OutlinedInput name="name" id="individualprice" className="formTextInput"
                                            type="number"
                                            value={individualItemPrice}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            onChange={(e) => {if(e.target.value >= 0) {setIndividualItemPrice(e.target.value)}}}
                                            size="small"
                                        /> 
                                    </FormControl>
                                    <FormControl error={menuError && individualItemPrice === "" && familyItemPrice === ""} margin='dense' variant="outlined">
                                        <OutlinedInput name="name" id="familyprice" className="formTextInput"
                                            type="number"
                                            value={familyItemPrice}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            onChange={(e) => {if(e.target.value >= 0) {setFamilyItemPrice(e.target.value)}}}
                                            size="small"
                                        /> 
                                    </FormControl>
                                </div>
                            </div>
                            <div className="priceSizeContainer">
                                <FormHelperText style={{"margin": "0px 40px 20px 0px"}}>{requiredAsterix()} At least one size must be given a price. If you do not want a particular size available for the item, please leave its price field blank.</FormHelperText>
                            </div>
                            {/* Item Addons */}
                            <p className="formLabelText" style={{"marginTop": "20px", "marginBottom": "-10px"}}>Accommodations</p>
                            <div className="priceSizeContainer">
                                <div className="sizeContainer">
                                    <p className="formSubHeading">Description</p>
                                    {addOns.map((item,index) => {
                                        
                                        return(
                                            <FormControl margin='dense'
                                                error = 
                                                {   menuError && 
                                                    ((item.name === "" && item.price !== "") || 
                                                    (item.name !== "" && item.price === ""))
                                                }
                                            >
                                                <OutlinedInput id={item.name + "nameinput"} name={item.name + "nameinput"} className="formTextInput"
                                                    required 
                                                    value={item.name}
                                                    onChange={e => {
                                                            let addontemp = [...addOns];
                                                            addontemp[index].name = e.target.value;
                                                            setAddOns(addontemp);
                                                        }} 
                                                    size="small"
                                                />
                                            </FormControl>
                                        );
                                    })}
                                </div>
                                
                                <div className="priceContainer">
                                    <p className="formSubHeading">Price</p>
                                    {addOns.map((item,index) => {
                                        return(
                                            <FormControl margin='dense'
                                                error = 
                                                {   menuError && 
                                                    ((item.name === "" && item.price !== "") || 
                                                    (item.name !== "" && item.price === "")) ||
                                                    (parseInt(item.price) < 0)
                                                }
                                            >
                                                <OutlinedInput id={item.name + "priceinput"} name={item.name + "priceinput"} className="formTextInput"
                                                    required 
                                                    type="number"
                                                    value={item.price}
                                                    startAdornment={<InputAdornment position="start">+$</InputAdornment>}
                                                    onChange={e => {
                                                            const addontemp = [...addOns];
                                                            addontemp[index].price = e.target.value;
                                                            setAddOns(addontemp);
                                                        }} 
                                                    size="small"
                                                />
                                            </FormControl>
                                        )
                                    })}
                                    
                                </div>
                                <div className="removeAddOnContainer">
                                    {addOns.map((item,index) => {
                                        return(
                                            <FormControl margin='dense'>
                                                <IconButton
                                                    className="removeAddOnButton"
                                                    onClick={() => {
                                                        // remove item from addOns
                                                        const addontemp = [...addOns];
                                                        addontemp.splice(index, 1);
                                                        setAddOns(addontemp);
                                                    }}
                                                >
                                                    <ClearIcon/>
                                                </IconButton> 
                                            </FormControl>
                                        )
                                    })}
                                   
                                </div>
                                
                            </div>
                            <div className="priceSizeContainer">
                                <div className="sizeContainer">
                                    <Button
                                        className="addAddOnButton"
                                        onClick={() => {
                                            const addontemp = [...addOns];
                                            addontemp.push({name: "", price: ""});
                                            setAddOns(addontemp);
                                        }}
                                    >
                                        <AddCircleIcon className="menuAddButtonIcon" />
                                        Add Accommodation
                                    </Button>
                                </div>
                                <div className="priceContainer"> </div>
                                <div className="removeAddOnContainer"></div>
                            </div>
                            {/* Item Dietary Information */}
                            <FormControl fullWidth className="formItem" margin='dense' variant="outlined">
                                <p className="formLabelText">Dietary Info</p>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={vegan} 
                                                style ={{
                                                    color: "#747474",
                                                }}
                                                onChange={(e) => setVegan(e.target.checked)} 
                                                name="vegan" 
                                            />
                                        }
                                        label="Vegan"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={vegetarian} 
                                                style ={{
                                                    color: "#747474",
                                                }}
                                                onChange={(e) => setVegetarian(e.target.checked)} 
                                                name="vegetarian" 
                                            />
                                        }
                                        label="Vegetarian"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={glutenFree} 
                                                style ={{
                                                    color: "#747474",
                                                }}
                                                onChange={(e) => setGlutenFree(e.target.checked)} 
                                                name="glutenFree" 
                                            />
                                        }
                                        label="Gluten Free"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={containsDairy} 
                                                style ={{
                                                    color: "#747474",
                                                }}
                                                onChange={(e) => setContainsDairy(e.target.checked)} 
                                                name="containsDairy" 
                                            />
                                        }
                                        label="Contains Dairy"
                                    />
                                </FormGroup>
                            </FormControl>
                            
                            {/* Item Description */}
                            <p className="formLabelText">Description {requiredAsterix()}</p>
                            <FormControl fullWidth className="formLongItem" margin='dense'
                                error={menuError && itemDescription === ""}
                            >
                                <OutlinedInput name="description" id="description" className="formLongInput" 
                                    value={itemDescription}
                                    multiline={true}
                                    rows={3}
                                    required
                                    onChange={(e) => setItemDescription(e.target.value)}
                                    size="small"
                                />
                            </FormControl>
                        </div>
                        <div className="modalFooter">
                            <Button className="cancelButton" onClick={() => setShowModal("")}>
                                Close
                            </Button>
                            <Button className="menuAddButton" onClick={() => handleSubmit()}>
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
