/**
 * This file allows for interaction with the MenuImage DB.
 * Contains methods that change the MenuImage and that
 * find the MenuImage.
 *
 * @summary   Creation of interaction with menuImage DB.
 * @author    Thomas Garry
 */
const { MenuImage } = require("../models/menuImages");

/**
 * Change the current image url in the DB.
 *
 * @param {string} raw_menu - ImageUrl to be used
 * @returns {object/boolean} - Created imageUrl / false
 */
async function changeMenuImage(raw_menu) {
  try {
    // find and replace the current image in the DB
    let menu = await MenuImage.findOneAndUpdate({}, raw_menu);
    // if there is no current image in the database insert one
    if (menu === null) {
      menu = new MenuImage(raw_menu);
      await menu.save();
    }
    // duplicate insertion
    else if (menu.imageUrl === raw_menu.imageUrl) return false;
    return menu;
  } catch (err) {
    return false;
  }
}

/**
 * Finds the imageUrl in the DB.
 *
 * @returns {object} - The first MenuImage in the DB
 */
async function findMenuImage() {
  return await MenuImage.findOne({}).exec();
}

module.exports = {
  changeMenuImage,
  findMenuImage,
};
