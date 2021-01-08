import React, { Component } from 'react';
import { Modal, Button} from 'react-bootstrap';
import Navbar from '../components/NavBar';
import '../css/Admin.css';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderFeaturedItems: false,
            renderEditItems: false,
            renderAddItems: false,
            renderDeleteItems: false,
            renderItemDetails: false,
            itemName: ''
        }

        this.featuredItemModal = this.featuredItemModal.bind(this);
        this.editItemModal = this.editItemModal.bind(this);
        this.addItemModal = this.addItemModal.bind(this);
        this.deleteItemModal = this.deleteItemModal.bind(this);
        this.editItemDetails = this.editItemDetails.bind(this);
    }

    //The modal that renders the items in the database. Allows for admin to
    //Determine the items to be listed as "featured"
    featuredItemModal() {
        //List of categories
        const featuredCategories = ["Appetizers", "Main Dishes", "Sides", "Drinks"];
        let pizza = { category: 'Appetizers', name: 'Pizza' };
        let igor = { category: 'Main Dishes', name: 'Igor'};
        let fries = { category: 'Sides', name: 'Fries'};
        let soda = { category: 'Drinks', name: 'Pepsi'}; 
        let items = [pizza, igor, fries, soda];

        return (
            <Modal show={this.state.renderFeaturedItems} onHide={() => this.setState({renderFeaturedItems: false})} >
                <Modal.Header closeButton>
                    <Modal.Title>Featured Menu Item</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        {featuredCategories.map((category, ind) => (
                            <div>
                                <h6>{category}</h6>
                                <div className="list-group">
                                    {items.map((item, ind) => {
                                        let checkbox;

                                        if(item.category === category) {
                                            //This if will check if the item is already featured or not
                                            if(false) {
                                                checkbox = <input name="menu-item" class="form-check-input" type="checkbox" checked></input>
                                            } else {
                                                checkbox = <input name="menu-item" class="form-check-input" type="checkbox"></input>
                                            }
                                            
                                            return (
                                                <div>
                                                    {checkbox}
                                                    <label class="form-check-label" for="<%= item._id %>">
                                                        {item.name}
                                                    </label>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({renderFeaturedItems: false})}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.setState({renderFeaturedItems: false})}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    //This modal opens when the Admin clicks on "edit"
    //This will allows the admin to edit their menu items
    editItemModal() {
        const featuredCategories = ["Appetizers", "Main Dishes", "Sides", "Drinks"];
        let pizza = { category: 'Appetizers', name: 'Pizza' };
        let igor = { category: 'Main Dishes', name: 'Igor'};
        let fries = { category: 'Sides', name: 'Fries'};
        let soda = { category: 'Drinks', name: 'Pepsi'}; 
        let items = [pizza, igor, fries, soda];   

        return (
            <Modal show={this.state.renderEditItems} onHide={() => this.setState({renderEditItems: false})} >
                <Modal.Header closeButton>
                    <Modal.Title>Edit item</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        {featuredCategories.map((category, ind) => (
                            <div>
                                <h6>{category}</h6>
                                <div className="list-group">
                                    {items.map((item, ind) => {
                                        if(item.category === category) {
                                            return (
                                                <button onClick={() => {
                                                    this.setState({
                                                        renderEditItems: false,
                                                        renderItemDetails: true,
                                                        itemName: item.name
                                                    })
                                                }}>Edit {item.name}</button>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({renderEditItems: false})}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.setState({renderEditItems: false})}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    //This will render the modal that displays the description of the food item
    //Allows the admin to edit any field and update accordingly
    editItemDetails(itemName) {
        return (
            <Modal show={this.state.renderItemDetails} onHide={() => this.setState({renderItemDetails: false})} >
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div class="form-group">
                        <label for="name">{itemName}</label>
                        <input name="name" type="text" class="form-control" id="editName" placeholder="Enter name" required />
                    </div>
                    
                    <div class="form-group">
                        <label for="name">Description</label>
                        <input name="description" type="text" class="form-control" id="editDescription" placeholder="Enter description" required />
                    </div>

                    <label for="description">Category</label>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="categoryAppetizers" value="Appetizers" required />
                        <label class="form-check-label" for="Appetizers">
                            Appetizers
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="categoryMainDishes" value="Main Dishes" required />
                        <label class="form-check-label" for="Main Dishes">
                            Main Dishes
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="categorySides" value="Sides" required />
                        <label class="form-check-label" for="Sides">
                            Sides
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="categoryDrinks" value="Drinks" required />
                        <label class="form-check-label" for="Drinks">
                            Drinks
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input name="price" type="number" step="0.01" class="form-control" id="editPrice" placeholder="Enter price" required />
                    </div>

                    <div class="form-group">
                        <label for="image">Image Link</label>
                        <input name="image" type="text" class="form-control" id="editImage" placeholder="Enter link" required />
                    </div>
                    
                    <div class="form-group">
                        <label for="cuisine">Cuisine</label>
                        <input name="cuisine" type="text" class="form-control" id="editCuisine" placeholder="Enter cuisine" required />
                    </div>
                    
                    <div class="form-group">
                        <label for="ingredients">Ingredients</label>
                        <input name="ingredients" type="text" class="form-control" id="editIngredients" placeholder="Enter ingredients, separated by commas" required />
                    </div>

                    <div class="form-check form-check-inline">
                        <input name="vegan" class="form-check-input" type="checkbox" value="" id="editVegan" />
                        <label class="form-check-label" for="defaultCheck1">
                            Vegan
                        </label>
                    </div>
                    
                    <div class="form-check form-check-inline">
                        <input name="vegetarian" class="form-check-input" type="checkbox" value="" id="editVegetarian" />
                        <label class="form-check-label" for="defaultCheck2">
                            Vegetarian
                        </label>
                    </div>
                    
                    <div class="form-check form-check-inline">
                        <input name="glutenFree" class="form-check-input" type="checkbox" value="" id="editGlutenFree" />
                        <label class="form-check-label" for="defaultCheck3">
                            Gluten Free
                        </label>
                    </div>   
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({renderItemDetails: false})}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.setState({renderItemDetails: false})}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    //Add item to the database. Allows the admin user to add any type of new item
    //To their menu, and updates instantly
    addItemModal() {
        return (
            <Modal show={this.state.renderAddItems} onHide={() => this.setState({renderAddItems: false})} >
                <Modal.Header closeButton>
                    <Modal.Title>Add Menu Item</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input name="name" type="text" class="form-control" id="name" placeholder="Enter name" required />
                    </div>
                    
                    <div class="form-group">
                        <label for="name">Description</label>
                        <input name="description" type="text" class="form-control" id="description" placeholder="Enter description" required />
                    </div>

                    <label for="description">Category</label>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="category" value="Appetizers" required />
                        <label class="form-check-label" for="Appetizers">
                            Appetizers
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="category" value="Main Dishes" required />
                        <label class="form-check-label" for="Main Dishes">
                            Main Dishes
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="category" value="Sides" required />
                        <label class="form-check-label" for="Sides">
                            Sides
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" name="category" type="radio" name="category" id="category" value="Drinks" required />
                        <label class="form-check-label" for="Drinks">
                            Drinks
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input name="price" type="number" step="0.01" class="form-control" id="price" placeholder="Enter price" required />
                    </div>

                    <div class="form-group">
                        <label for="image">Image Link</label>
                        <input name="image" type="text" class="form-control" id="image" placeholder="Enter link" required />
                    </div>
                    
                    <div class="form-group">
                        <label for="cuisine">Cuisine</label>
                        <input name="cuisine" type="text" class="form-control" id="cuisine" placeholder="Enter cuisine" required />
                    </div>
                    
                    <div class="form-group">
                        <label for="ingredients">Ingredients</label>
                        <input name="ingredients" type="text" class="form-control" id="ingredients" placeholder="Enter ingredients, separated by commas" required />
                    </div>

                    <div class="form-check form-check-inline">
                        <input name="vegan" class="form-check-input" type="checkbox" value="" id="vegan" />
                        <label class="form-check-label" for="defaultCheck1">
                            Vegan
                        </label>
                    </div>
                    
                    <div class="form-check form-check-inline">
                        <input name="vegetarian" class="form-check-input" type="checkbox" value="" id="vegetarian" />
                        <label class="form-check-label" for="defaultCheck2">
                            Vegetarian
                        </label>
                    </div>
                    
                    <div class="form-check form-check-inline">
                        <input name="glutenFree" class="form-check-input" type="checkbox" value="" id="glutenFree" />
                        <label class="form-check-label" for="defaultCheck3">
                            Gluten Free
                        </label>
                    </div>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({renderAddItems: false})}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.setState({renderAddItems: false})}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    //Deletes the item from the database
    deleteItemModal() {
        const featuredCategories = ["Appetizers", "Main Dishes", "Sides", "Drinks"];
        let pizza = { category: 'Appetizers', name: 'Pizza' };
        let igor = { category: 'Main Dishes', name: 'Igor'};
        let fries = { category: 'Sides', name: 'Fries'};
        let soda = { category: 'Drinks', name: 'Pepsi'}; 
        let items = [pizza, igor, fries, soda];   

        return (
            <Modal show={this.state.renderDeleteItems} onHide={() => this.setState({renderDeleteItems: false})} >
                <Modal.Header closeButton>
                    <Modal.Title>Edit item</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        {featuredCategories.map((category, ind) => (
                            <div>
                                <h6>{category}</h6>
                                <div className="list-group">
                                    {items.map((item, ind) => {
                                        if(item.category === category) {
                                            return (
                                                <button>Delete {item.name}</button>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({renderDeleteItems: false})}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.setState({renderDeleteItems: false})}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
      return (
          <div>
              <Navbar/>
              <div class="admin-section">
                    <div class="col-12">
                        <h2 class="admin-title">Admin Panel</h2>
                        <p>Please use this page to edit what is displayed on the website to customers.</p>
                    </div>

                    <br />

                    <div class="col-12">
                        <h2 class="admin-title">Orders</h2>
                        <p>View placed orders and mark them as fulfilled.</p>
                        <a class="btn btn-primary" href="/orders" role="button">Orders</a>
                    </div>

                    <br />

                    <div class="col-12">
                        <h2 class="admin-title">Menu Items</h2>
                        <p>Adjust what items are on the website.</p>
                        <Button onClick={() => this.setState({renderAddItems: true})}>
                            Add
                        </Button>
                        <Button onClick={() => this.setState({renderEditItems: true})}>
                            Edit
                        </Button>
                        <Button onClick={() => this.setState({renderDeleteItems: true})}>
                            Delete
                        </Button>
                    </div>

                    <br />

                    <div class="col-12">
                        <h2 class="admin-title">Featured Item</h2>
                        <p>Choose the featured item to display at the top of the site.</p>
                        <Button onClick={() => this.setState({renderFeaturedItems: true})} >Edit</Button>
                    </div>
                </div>       
                {this.featuredItemModal()}
                {this.editItemModal()}
                {this.addItemModal()}
                {this.deleteItemModal()}
                {this.editItemDetails(this.state.itemName)}
          </div>

      )
    }
  }
  
  export default Admin;