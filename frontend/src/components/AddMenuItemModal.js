import React, { Component, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/Admin.css';

export default function AddMenuItemModal (props) {
    const showModal = props.addItemModal;
    const setShowModal = props.setAddItemModal;
    console.log(showModal);
    const [numAddOns, setNumAddOns] = useState(0);
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} backdrop='static'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Menu Item</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form>
                        
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" 
                    // onClick={() => this.setState({
                    //     insertItem: {
                    //         vegan: false,
                    //         vegetarian: false,
                    //         glutenFree: false
                    //     },
                    //     renderAddItems: false
                    // })}
                    >
                        Close
                    </Button>
                    <Button variant="primary" type="submit" 
                        // onClick={() => this.insertItem()}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
    );
}

/* 
<form>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input name="name" type="text" class="form-control" id="name" placeholder="Enter name" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="name">Description</label>
                            <input name="description" type="text" class="form-control" id="description" placeholder="Enter description" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                        </div>

                        <label for="description">Category</label>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" id="category" value="Appetizers" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                            <label class="form-check-label" for="Appetizers">
                                Appetizers
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" id="category" value="Main Dishes" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                            <label class="form-check-label" for="Main Dishes">
                                Main Dishes
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" id="category" value="Sides" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                            <label class="form-check-label" for="Sides">
                                Sides
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" id="category" value="Drinks" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                            <label class="form-check-label" for="Drinks">
                                Drinks
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label for="price">Price</label>
                            <input name="price" type="number" step="0.01" class="form-control" id="price" placeholder="Enter price" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                        </div>

                        <div class="form-group">
                            <label for="image">Image Link</label>
                            <input name="image" type="text" class="form-control" id="image" placeholder="Enter link" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="cuisine">Cuisine</label>
                            <input name="cuisine" type="text" class="form-control" id="cuisine" placeholder="Enter cuisine" required 
                                // onChange={(e) => this.updateInsertField(e)}
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="ingredients">Ingredients</label>
                            <input name="ingredients" type="text" class="form-control" id="ingredients" placeholder="Enter ingredients, separated by commas" required 
                                // onChange={(e) => this.updateInsertField(e, true)}
                            />
                        </div>

                        <div class="form-check form-check-inline">
                            <input name="vegan" class="form-check-input" type="checkbox" checked={this.state.vegan} id="vegan" 
                                // onChange={(e) => this.updateInsertFieldCheckbox(e)}
                            />
                            <label class="form-check-label" for="defaultCheck1">
                                Vegan
                            </label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input name="vegetarian" class="form-check-input" type="checkbox" checked={this.state.vegetarian} id="vegetarian" 
                                // onChange={(e) => this.updateInsertFieldCheckbox(e)}
                            />
                            <label class="form-check-label" for="defaultCheck2">
                                Vegetarian
                            </label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input name="glutenFree" class="form-check-input" type="checkbox" checked={this.state.glutenFree} id="glutenFree" 
                                // onChange={(e) => this.updateInsertFieldCheckbox(e)}
                            />
                            <label class="form-check-label" for="defaultCheck3">
                                Gluten Free
                            </label>
                        </div>
*/