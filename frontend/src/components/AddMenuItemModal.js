import React, { Component, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal, FormControl, Checkbox, FormControlLabel, FormGroup, OutlinedInput, Select, MenuItem, InputAdornment } from '@material-ui/core';
import '../css/AddMenuItemModal.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function AddMenuItemModal (props) {
    const showModal = props.addItemModal;
    const setShowModal = props.setAddItemModal;

    // form states
    const [itemName, setItemName] = useState("")
    const [itemCategory, setItemCategory] = useState("")
    const [individualItemPrice, setIndividualItemPrice] = useState("")
    const [familyItemPrice, setFamilyItemPrice] = useState("")
    const [itemImageURL, setItemImageURL] = useState("")
    const [itemDescription, setItemDescription] = useState("")
    /*  addOns is an array of objects 
    [
        {
            name: "",
            price: ""
        }
    ]
    */
    const [addOns, setAddOns] = useState([]);
        // dietary info
    const [vegan, setVegan] = useState(false);
    const [vegetarian, setVegetarian] = useState(false);
    const [glutenFree, setGlutenFree] = useState(false);
    const [dairyFree, setDairyFree] = useState(false);

    const [menuError, setMenuError] = useState(false);
    const handleSubmit = () => {

    }
    return (

        <Modal open={showModal} onClose={() => setShowModal(false)} 
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
                                <MenuItem value="Appetizers">Appetizers</MenuItem>
                                <MenuItem value="Main Dishes">Main Dishes</MenuItem>
                                <MenuItem value="Sides">Sides</MenuItem>
                                <MenuItem value="Drinks">Drinks</MenuItem>
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
                                        onChange={(e) => setIndividualItemPrice(e.target.value)}
                                        size="small"
                                    /> 
                                </FormControl>
                                <FormControl error={menuError && individualItemPrice === "" && familyItemPrice === ""} margin='dense' variant="outlined">
                                    <OutlinedInput name="name" id="familyprice" className="formTextInput"
                                        type="number"
                                        value={familyItemPrice}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        onChange={(e) => setFamilyItemPrice(e.target.value)}
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
                                                onChange={e => {
                                                        const addontemp = [...addOns];
                                                        addontemp[index].name = e.target.value;
                                                        setAddOns(addOns);
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
                                                type="numeric"
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                onChange={e => {
                                                        const addontemp = [...addOns];
                                                        addontemp[index].price = e.target.value;
                                                        setAddOns(addOns);
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
                                        console.log("inserting new add on");
                                        const addontemp = [...addOns];
                                        addontemp.push({name: "", price: ""});
                                        setAddOns(addontemp);
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
                                onChange={(e) => setItemDescription(e.target.value)}
                                size="small"
                            />
                        </FormControl>
                    </div>
                    <div className="modalFooter">
                        <Button className="cancelButton" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button className="menuAddButton" onClick={() => handleSubmit}>
                            <AddCircleIcon className="menuAddButtonIcon" />
                            Add Item
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
