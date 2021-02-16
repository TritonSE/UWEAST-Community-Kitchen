// this file allows for interaction with the MenuImages DB
// with changeMenuImage and findMenuImage
const { MenuImage } = require("../models/menuImages");

// change the current image url in the DB
async function changeMenuImage(raw_menu) {
  try {
    // find and replace the current image in the DB
    let menu = await MenuImage.findOneAndUpdate({}, raw_menu, {
      new: true,
    });
    // if there is no current image in the database insert one
    if (menu === null) {
      menu = new MenuImage(raw_menu);
      await menu.save();
    }
    return menu;
  } catch (err) {
    return false;
  }
}

// finds the imageUrl in the DB
async function findMenuImage() {
  return MenuImage.findOne({}).exec();
}

module.exports = {
  changeMenuImage,
  findMenuImage,
};
