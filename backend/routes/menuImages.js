// this file creates the routes to allow for interaction with the
// menuimages DB, routes are /changeMenuImage (POST) and / (GET)
const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const { changeMenuImage, findMenuImage } = require("../db/services/menuImages");

// @body: imageUrl
// @return: success:true if imageUrl is changed
//          "MenuImage change unsuccessful" if duplicate imageUrl
// @description: changes the menu image in the DB
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

// @return: imageUrl object
// @description: returns the imageUrl in the DB
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
