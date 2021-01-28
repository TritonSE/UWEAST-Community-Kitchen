const express = require("express");
const {
  getAllMenuItems,
  addNewItem,
  deleteItem,
  editItem,
  setFeatured,
  // setNotFeatured,
} = require("../db/services/item");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();

// function buildItemJSON(body) {
//   body.vegan = body.vegan !== undefined;
//   body.vegetarian = body.vegetarian !== undefined;
//   body.glutenFree = body.glutenFree !== undefined;
//   // body.ingredients = body.ingredients.split(', ');
//   body.price = parseFloat(body.price);

//   return body;
// }

// get all menu items
router.get("/", async (req, res, next) => {
  const items = await getAllMenuItems();
  if (!items) {
    res.status(400).json({ errors: [{ msg: "Get unsuccessful" }] });
  } else {
    res.status(200).json({ items: items });
  }
});

// Post data, log data to terminal.
router.post(
  "/insert",
  [
    body("Name").isString(),
    body("pictureURL").isString(),
    body("Description").isString(),
    body("Category").isString(),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      const addedItem = await addNewItem(req.body);
      if (!addedItem) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Insert unsuccessful" }] });
      } else {
        return res.status(200).json({ item_id: addedItem._id });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// given _id deletes
router.delete(
  "/remove",
  [body("_id").notEmpty(), isValidated],
  async (req, res, next) => {
    try {
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

// @body id and any of the attributes of the item object
router.post(
  "/edit",
  [body("_id").notEmpty(), isValidated],
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

router.post(
  "/feature",
  [body("_id").notEmpty(), body("isFeatured").notEmpty(), isValidated],
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
    // getAllMenuItems()
    //   .then((allItems) => {
    //     for (const key in allItems) {
    //       if (req.body[allItems[key]._id]) setFeatured(allItems[key]._id);
    //       else setNotFeatured(allItems[key]._id);
    //     }
    //     res.sendStatus(200);
    //   })
    //   .catch((error) => {
    //     res.sendStatus(error.status || 500);
    //   });
  }
);

module.exports = router;
