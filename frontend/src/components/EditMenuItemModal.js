import React, { Component, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal, FormControl, Checkbox, FormControlLabel, FormGroup, OutlinedInput, Select, MenuItem, InputAdornment } from '@material-ui/core';
import '../css/AddMenuItemModal.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
const config = require('../config');
const BACKEND_URL = config.backend.uri;

export default function EditMenuItemModal (props) {
    // currently glitches with dietary information because the object doesn't exist in item.
    // Need to update the item being passed in from AdminMenuItems.js to include dietary info
    
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
    const [dairyFree, setDairyFree] = useState(props.item.dietaryInfo !== undefined ? !props.item.dietaryInfo.containsDairy : false);

    const [menuError, setMenuError] = useState(false);

    const handleSubmit = async () => {
        // validate basic input
        if(itemName === "" || 
            itemCategory === "" || 
            (individualItemPrice === "" && familyItemPrice === "") || 
            itemImageURL === "" || itemDescription === ""
        ){
            // if(!validURL(itemImageURL)){
            //     console.log("fail url");
            //     setMenuError(true);
            //     return;
            // }
            console.log("fail basic");
            setMenuError(true);
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
                return;
            }
            else if(item.name !== "" && parseFloat(item.price) < 0){
                //negative number
                console.log("add on price was negative");
                failAddOn = true;
                setMenuError(true);
                return;
            }
        })
        if(failAddOn){
            setMenuError(true);
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
        let accomodations = [];
        addOns.forEach(addon => {
            if(addon.name !== "" && addon.price !== ""){
                accomodations.push({"Description": addon.name, "Price": addon.price});
            }
        })
        const dietaryInfo = {
            "vegan": vegan,
            "vegetarian": vegetarian,
            "glutenFree": glutenFree,
            "containsDairy": !dairyFree,
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
            "Accomodations": accomodations,
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
                alert("Your item was updated!");
                //refetch
                setLoaded(false);
                setShowModal("");
            }
            else{
                alert("There was an error. Recheck your inputs and try again");
            }
        })
        
    }
    return (

        <Modal open={showModal} onClose={() => setShowModal("")} 
            className="modalContainer"
        >
            <div className="modalBackground">
                {/* <div className="modalHeader">
                    <Button onClick={() =>setShowModal(false)}>X</Button>
                </div> */}
                <form autocomplete="off">
                    <div className="modalBody">
                        {/* Item Name */}
                        <FormControl fullWidth error={menuError && itemName === ""} className="formItem" margin='dense'>
                            <p className="formLabelText">Name</p>
                            <OutlinedInput name="name" id="name" className="formTextInput"
                                required 
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                size="small"
                            />
                        </FormControl>
                        {/* Item Image URL */}
                        <FormControl fullWidth error={menuError && itemImageURL === ""} className="formItem" margin='dense'>
                            <p className="formLabelText">Image Link</p>
                            <OutlinedInput name="imageURL" id="imageURL" className="formTextInput"
                                required 
                                value={itemImageURL}
                                onChange={(e) => setItemImageURL(e.target.value)}
                                size="small"
                            />
                        </FormControl>

                        {/* Item Category */}
                        <FormControl fullWidth error={menuError && itemCategory === ""} className="formItem" margin='dense' variant="outlined">
                            <p className="formLabelText">Category Name</p>
                            <Select name="category" type="text" id="category" className="formSelectInput" required 
                                placeholder=""
                                value={itemCategory}
                                onChange={(e) => setItemCategory(e.target.value)}
                                size="small"
                                displayEmpty
                            >
                                <MenuItem value="Appetizer">Appetizer</MenuItem>
                                <MenuItem value="Main Dish">Main Dish</MenuItem>
                                <MenuItem value="Side">Side</MenuItem>
                                <MenuItem value="Drink">Drink</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Item Sizing and Price*/}
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
                        {/* Item Addons*/}
                        <div className="priceSizeContainer">
                            <div className="sizeContainer">
                                <p className="formLabelText">Name</p>
                                {addOns.map((item,index) => {
                                    
                                    return(
                                        <FormControl margin='dense'>
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
                                <p className="formLabelText">Price</p>
                                {addOns.map((item,index) => {
                                    return(
                                        <FormControl margin='dense'>
                                            <OutlinedInput id={item.name + "priceinput"} name={item.name + "priceinput"} className="formTextInput"
                                                required 
                                                type="number"
                                                value={item.price}
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
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
                                <Button
                                    style={{"marginTop": "10px", "width": "100%"}}
                                    className="addAddOnButton"
                                    onClick={() => {
                                        const addontemp = [...addOns];
                                        if(addontemp.length === 0){
                                            // add an empty addon for editing if there are none
                                            addontemp.push({name: "", price: ""});
                                            setAddOns(addontemp);
                                        }
                                        else{
                                            // you can only add a new add on if the past ones are valid
                                            let valid = true;
                                            addontemp.forEach(item => {
                                                if(item.name === "" || item.price === ""){
                                                    valid = false;
                                                }
                                            })
                                            if(valid){
                                                addontemp.push({name: "", price: ""});
                                                setAddOns(addontemp);
                                            }
                                        }
                                    }}
                                >
                                    <AddCircleIcon className="menuAddButtonIcon" />
                                    Add
                                </Button>
                            </div>
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
                                            checked={dairyFree} 
                                            style ={{
                                                color: "#747474",
                                            }}
                                            onChange={(e) => setDairyFree(e.target.checked)} 
                                            name="dairyFree" 
                                        />
                                    }
                                    label="Dairy Free"
                                />
                            </FormGroup>
                        </FormControl>
                        
                        {/* Item Description */}
                        <FormControl fullWidth className="formLongItem" margin='dense'>
                            <p className="formLabelText">Description</p>
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
                            <AddCircleIcon className="menuAddButtonIcon" />
                            Add Item
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
