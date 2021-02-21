/**
 * This file allows for interaction with the MenuImage DB.
 * Contains methods that change the MenuImage and that
 * find the MenuImage.
 */
const { MenuImage } = require("../models/menuImages");

// @description - change the current image url in the DB
// @return - menu object / false on error
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

// @description - finds the imageUrl in the DB
// @return - the first MenuImage in the DB
async function findMenuImage() {
  return MenuImage.findOne({}).exec();
}

module.exports = {
  changeMenuImage,
  findMenuImage,
};
