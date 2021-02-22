/**
 * This file creates the routes to allow for interaction with the Item DB.
 * Contains routes to add, edit or delete an item.
 * Also contains requests to get the all of the menu items as well as
 * set an item to be featured.
 */
const express = require("express");
const {
  getAllMenuItems,
  addNewItem,
  deleteItem,
  editItem,
  setFeatured,
} = require("../db/services/item");
const { body, validationResult } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { token } = require("morgan");
const { verify } = require("./verifyToken");
const router = express.Router();

// returns all menu items in the DB
router.get("/", async (req, res, next) => {
  const items = await getAllMenuItems();
  if (!items) {
    res.status(400).json({ errors: [{ msg: "Get unsuccessful" }] });
  } else {
    res.status(200).json({ items: items });
  }
});

// num - string representation of money
// checks the string to conform to positive decimals
function checkNumeral(num) {
  const regex = /^\d*(\.)?\d*$/;
  if (num === undefined || num.trim() === "") return false;
  if (!regex.test(num)) return false;
  return true;
}

// @description - inserts an item into the Item DB
// @body Name, pictureURL, Description, Category, Prices - required
//       at least one of Individual or Family Prices - required
//       isFeatured, Accommodations - not required
router.post(
  "/insert",
  [
    body("Name").isString(),
    body("pictureURL").isString(),
    body("Description").isString(),
    body("Category").isString(),
    body("Prices").custom((value) => {
      if (value.Family === "" && value.Individual === "") return false;
      // check for numeric values with regex to be price conforming
      return (
        value &&
        ((checkNumeral(value.Family) && !value.Individual) ||
          (checkNumeral(value.Individual) && !value.Family) ||
          (checkNumeral(value.Family) && checkNumeral(value.Individual)))
      );
    }),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    body("Accommodations")
      .custom((value) => {
        // check for numeric values with regex to be price conforming
        // for each price in Accomodations array
        for (val of value) {
          let success = checkNumeral(val.Price) ? true : false;
          if (success === false) return false;
        }
        return true;
      })
      .optional(),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      // addedItem if successful or false if error
      const addedItem = await addNewItem(req.body);
      if (!addedItem) {
        return res.status(400).json({
          errors: [{ msg: "Insert unsuccessful/ enter valid Item data" }],
        });
      } else {
        return res.status(200).json({ item_id: addedItem._id });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err/ enter valid Item data");
    }
  }
);

// @description - deletes an item for the Item DB
// @body _id - id of object to be deleted
router.delete(
  "/remove",
  [
    body("_id").notEmpty(),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      // deleted object response check if deletedCount is 1
      const deleted = await deleteItem(req.body._id);
      if (deleted && deleted.deletedCount !== 1) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Delete unsuccessful/ not found" }] });
      } else {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @description - edits any of the item attributes, the only required attribute is _id
// @body id - of object to be edited and any of the attributes of the item object
router.post(
  "/edit",
  [
    body("_id").notEmpty(),
    body("Prices").custom((value) => {
      // if Prices is not passed in
      if (value === undefined) return true;
      if (value.Family === "" && value.Individual === "") return false;
      // check for numeric values with 2 decimal places
      return (
        value &&
        ((checkNumeral(value.Family) && !value.Individual) ||
          (checkNumeral(value.Individual) && !value.Family) ||
          (checkNumeral(value.Family) && checkNumeral(value.Individual)))
      );
    }),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    body("Accommodations")
      .custom((value) => {
        // check for numeric values with regex to be price conforming
        // for each price in Accommodations array
        for (val of value) {
          let success = checkNumeral(val.Price) ? true : false;
          if (success === false) return false;
        }
        return true;
      })
      .optional(),
    isValidated,
  ],
  async (req, res, next) => {
    const edit = await editItem(req.body._id, req.body);
    // if there is an error or item is not found
    if (edit === false || (edit && edit.n !== 1)) {
      res
        .status(400)
        .json({ errors: [{ msg: "edit unsuccessful/ not found" }] });
    } else {
      res.status(200).json({ success: true });
    }
  }
);

// @description - sets the isFeatured atribute of the object associated with the id
// @body _id - id of the item to be featured/unfeatured
//       isFeatured - T/F to set to object
router.post(
  "/feature",
  [
    body("_id").notEmpty(),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    body("isFeatured").notEmpty(),
    isValidated,
  ],
  async (req, res, next) => {
    const featured = await setFeatured(req.body._id, req.body.isFeatured);
    // if there is an error or the item is not found
    if (featured === false || (featured && featured.n !== 1)) {
      res
        .status(400)
        .json({ errors: [{ msg: "edit unsuccessful/ not found" }] });
    } else {
      res.status(200).json({ success: true });
    }
  }
);

module.exports = router;
