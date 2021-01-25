import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';



export default function AdminMenuItems (props) {
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    // Modal that asks the user if they want to remove the item from the menu
    const deleteConfirmationModal = () => {
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
    return (
        <div>
            <Button onClick={() => setDeleteConfirmation("french toast")}>+ Add Item</Button>
            {deleteConfirmationModal()}
        </div>
        
    );
}
