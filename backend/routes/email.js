const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const {
  // addnewEmail,
  findAllEmails,
  // deleteOneEmail,
  changeEmail,
} = require("../db/services/email");

// @body: email, returns success:true if email is changed
router.post(
  "/change",
  [body("email").notEmpty().isEmail(), isValidated],
  async (req, res, next) => {
    const { email } = req.body;
    try {
      // try to change email and respond with err msg or success
      emailJson = {
        email: email,
      };
      const emailSuccessful = await changeEmail(emailJson);
      if (!emailSuccessful) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email change unsuccessful" }] });
      } else {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @body: email, returns success:true if email is inserted
// router.post(
//   "/insert",
//   [body("email").notEmpty().isEmail(), isValidated],
//   async (req, res, next) => {
//     const { email } = req.body;
//     try {
//       // try to add email and respond with err msg or success
//       emailJson = {
//         email: email,
//       };
//       const emailSuccessful = await addnewEmail(emailJson);
//       if (!emailSuccessful) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: "Enter a non-duplicate email" }] });
//       } else {
//         return res.status(200).json({ success: true });
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server err");
//     }
//   }
// );

// @body: email, returns success:true if email is inserted
// router.delete(
//   "/remove",
//   [body("email").notEmpty().isEmail(), isValidated],
//   async (req, res, next) => {
//     const { email } = req.body;
//     try {
//       // check if user exists
//       const deleteSuccessful = await deleteOneEmail(email);
//       if (!deleteSuccessful) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: "Enter a valid email" }] });
//       } else {
//         return res.status(200).json({ success: true });
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server err");
//     }
//   }
// );

router.get("/all", async (req, res, next) => {
  try {
    // returns emails or error if there is an error
    const emails = await findAllEmails();
    res.status(200).json({
      emails: emails,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server err");
  }
});

module.exports = router;
