/**
 * This renders a toolbar on the Orders table when a row is selected. 
 * This is used to delete the order that is selected. A trash can
 * icon will display above the table when a row is selected.
 * 
 * @summary     The toolbar that renders when a row is selected.
 * @author      Amitesh Sharma
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import DeleteOrder from './DeleteOrder';

export default function OrdersTableSelectToolbar(props) {
    // show the toolbar
    const [show, setShow] = useState(false);

    return (
        <div className="delete-order-icon">
            {/* Delete icon */}
            <FontAwesomeIcon icon={faTrash} onClick={() => setShow(true)} />
            <DeleteOrder show={show} updateParentShow={setShow} _id={props.data[9]} render={props.render} 
                setSelectedRows={props.setSelectedRows} error={props.error} paypalId={props.data[0]}
            /> 
        </div>
    )
}