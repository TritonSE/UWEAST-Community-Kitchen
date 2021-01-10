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
            getItemsArray: []
        }

        this.featuredItemModal = this.featuredItemModal.bind(this);
        this.editItemModal = this.editItemModal.bind(this);
        this.addItemModal = this.addItemModal.bind(this);
        this.deleteItemModal = this.deleteItemModal.bind(this);
        this.editItemDetails = this.editItemDetails.bind(this);
        this.updateField = this.updateField.bind(this);
        this.updateFieldCheckbox = this.updateFieldCheckbox.bind(this);
        this.getItems = this.getItems.bind(this);
        this.saveItemChanges = this.saveItemChanges.bind(this);
    }

    //////////////////////////////////////////
    //          Fetch call methods          //
    //////////////////////////////////////////

    //Fetch call to get all menu items
    getItems() {
        fetch(`${BACKEND_URL}item`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                getItemsArray: data.items,
            });   
        }).catch((error) => {
            console.log(error);
        })
    }

    //Fetch call to save item changes upon editing
    saveItemChanges() {
        if(!this.state.getItemInfo) {
            console.log("Error! editing item problem.");
            return;
        }

        console.log(this.state.getItemInfo);

        fetch(`${BACKEND_URL}item/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.getItemInfo)
        }).then(async result => {
            console.log(result);
            if (result.ok){
                const json = await result.json();
                console.log(json.message);
            } else {
                console.log("Error saving data");
            }
        })
        .catch(e => {
            console.log(e);
        });
        

        this.setState({renderItemDetails: false})
    }

    componentDidMount() {
        //Get the list of menu items when loading the page
        this.getItems();
    }

    //The modal that renders the items in the database. Allows for admin to
    //Determine the items to be listed as "featured"
    featuredItemModal() {
        //List of categories
        const featuredCategories = ["Appetizers", "Main Dishes", "Sides", "Drinks"];

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
                                    {this.state.getItemsArray.map((item, ind) => {
                                        let checkbox;
                                        if(item.category === category) {
                                            //This if will check if the item is already featured or not
                                            if(item.featured) {
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
                                    {this.state.getItemsArray.map((item, ind) => {
                                        if(item.category === category) {
                                            return (
                                                <button onClick={() => {
                                                    const filterItem = this.state.getItemsArray.filter(items => items.name === item.name)[0];
                                                    this.setState({
                                                        renderEditItems: false,
                                                        renderItemDetails: true,
                                                        getItemInfo: filterItem,
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

    // Helper method used to update textfield in edit item modal
    updateField(e, field) {
        let updateField = this.state.getItemInfo;
        updateField[field] = e.target.value;
        this.setState({ getItemInfo: updateField });
    }

    //Used for vegan, vegetarian, and glutenFree checkboxes
    updateFieldCheckbox(isChecked, field) {
        let updateField = this.state.getItemInfo;
        updateField[field] = isChecked;
        this.setState({ getItemInfo: updateField });
    }

    //This will render the modal that displays the description of the food item
    //Allows the admin to edit any field and update accordingly
    editItemDetails() {
        //Undefined when page initially renders, returns an error
        //This check prevents such error
        if(this.state.getItemInfo === undefined) return; 

        return (
            <Modal show={this.state.renderItemDetails} onHide={() => this.setState({renderItemDetails: false})} >
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={(e) => this.getItems()}>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input name="name" type="text" class="form-control" id="editName" placeholder="Enter name" required 
                                value={this.state.getItemInfo.name} onChange={(e) => this.updateField(e, 'name')}
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="name">Description</label>
                            <input name="description" type="text" class="form-control" id="editDescription" placeholder="Enter description" required 
                                value={this.state.getItemInfo.description} onChange={(e) => this.updateField(e, 'description')}
                            />
                        </div>

                        <label for="description">Category</label>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" name="category" id="categoryAppetizers" value="Appetizers" required 
                                checked={this.state.getItemInfo.category === "Appetizers"} onChange={(e) => this.updateField(e, 'category')}
                            />
                            <label class="form-check-label" for="Appetizers">
                                Appetizers
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" name="category" id="categoryMainDishes" value="Main Dishes" required 
                                checked={this.state.getItemInfo.category === "Main Dishes"} onChange={(e) => this.updateField(e, 'category')}
                            />
                            <label class="form-check-label" for="Main Dishes">
                                Main Dishes
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" name="category" id="categorySides" value="Sides" required 
                                checked={this.state.getItemInfo.category === "Sides"} onChange={(e) => this.updateField(e, 'category')}
                            />
                            <label class="form-check-label" for="Sides">
                                Sides
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" name="category" type="radio" name="category" id="categoryDrinks" value="Drinks" required 
                                checked={this.state.getItemInfo.category === "Drinks"} onChange={(e) => this.updateField(e, 'category')}
                            />
                            <label class="form-check-label" for="Drinks">
                                Drinks
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label for="price">Price</label>
                            <input name="price" type="number" step="0.01" class="form-control" id="editPrice" placeholder="Enter price" required 
                                value={this.state.getItemInfo.price} onChange={(e) => this.updateField(e, 'price')}
                            />
                        </div>

                        <div class="form-group">
                            <label for="image">Image Link</label>
                            <input name="image" type="text" class="form-control" id="editImage" placeholder="Enter link" required 
                                value={this.state.getItemInfo.image} onChange={(e) => this.updateField(e, 'image')}
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="cuisine">Cuisine</label>
                            <input name="cuisine" type="text" class="form-control" id="editCuisine" placeholder="Enter cuisine" required 
                                value={this.state.getItemInfo.cuisine} onChange={(e) => this.updateField(e, 'cuisine')}
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="ingredients">Ingredients</label>
                            <input name="ingredients" type="text" class="form-control" id="editIngredients" placeholder="Enter ingredients, separated by commas" required 
                                value={this.state.getItemInfo.ingredients.toString().replace(',', ', ')} onChange={(e) => this.updateField(e, 'ingredients')}
                            />
                        </div>

                        <div class="form-check form-check-inline">
                            <input name="vegan" class="form-check-input" type="checkbox" value="" id="editVegan" 
                                checked={this.state.getItemInfo.vegan} onChange={(e) => this.updateFieldCheckbox(!this.state.getItemInfo.vegan, 'vegan')}
                            />
                            <label class="form-check-label" for="defaultCheck1">
                                Vegan
                            </label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input name="vegetarian" class="form-check-input" type="checkbox" value="" id="editVegetarian" 
                                checked={this.state.getItemInfo.vegetarian} onChange={(e) => this.updateFieldCheckbox(!this.state.getItemInfo.vegetarian, 'vegetarian')}
                            />
                            <label class="form-check-label" for="defaultCheck2">
                                Vegetarian
                            </label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input name="glutenFree" class="form-check-input" type="checkbox" value="" id="editGlutenFree" 
                                checked={this.state.getItemInfo.glutenFree} onChange={(e) => this.updateFieldCheckbox(!this.state.getItemInfo.glutenFree, 'glutenFree')}
                            />
                            <label class="form-check-label" for="defaultCheck3">
                                Gluten Free
                            </label>
                        </div>   
                        <Modal.Footer>
                            <Button variant="secondary" type="submit" onClick={() => this.setState({ renderItemDetails: false }) }>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => this.saveItemChanges()}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
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