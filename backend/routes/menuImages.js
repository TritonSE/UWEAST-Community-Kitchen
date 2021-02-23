/**
 * This file creates the routes to allow for interaction with the menuImages DB.
 * Contains routes to change the image and get the image.
 *
 * @summary   Routes to modify the menuImages DB specifically changing and finding.
 * @author    Thomas Garry
 */
const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const { changeMenuImage, findMenuImage } = require("../db/services/menuImages");
const { verify } = require("./services/jwt");

/**
 * Changes the menu image in the DB.
 *
 * @body {string} imageUrl - url to be set
 * @returns {status/object} - 200 success if imageUrl is changed / 400 err with duplicate url / 500 err
 */
router.post(
  "/changeMenuImage",
  [
    body("imageUrl").notEmpty().isURL(),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    isValidated,
  ],
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

/**
 * Returns the imageUrl in the DB.
 *
 * @returns {status/object} - 200 with imageUrl object / 500 with err
 */
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
