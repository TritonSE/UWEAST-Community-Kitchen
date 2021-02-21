/**
 * This file creates the routes to allow for interaction with the menuImages DB.
 * Contains routes to change the image and get the image.
 */
const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const { changeMenuImage, findMenuImage } = require("../db/services/menuImages");

// @description - changes the menu image in the DB
// @body {string} imageUrl - url to be set
// @return - success:true if imageUrl is changed
//          "MenuImage change unsuccessful" if duplicate imageUrl
router.post(
  "/changeMenuImage",
  [body("imageUrl").notEmpty().isURL(), isValidated],
  async (req, res, next) => {
    const { imageUrl } = req.body;
    try {
      // try to change image and respond with err msg or success
      imageJson = {
        imageUrl: imageUrl,
      };
      const imageSuccessful = await changeMenuImage(imageJson);
      if (!imageSuccessful) {
        return res
          .status(400)
          .json({ errors: [{ msg: "MenuImage change unsuccessful" }] });
      } else {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @description - returns the imageUrl in the DB
// @return - imageUrl object
router.get("/", async (req, res, next) => {
  try {
    // returns image/null or error if there is an error
    const menuImage = await findMenuImage();
    res.status(200).json({
      imageUrl: menuImage,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server err");
  }
});

module.exports = router;
