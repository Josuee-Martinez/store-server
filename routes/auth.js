const express = require("express");
const router = express.Router();
const sequelize = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

const User = sequelize.import("../models/User");

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.create({
      email,
      encryptedPassword: bcrypt.hashSync(password, 10)
    }).then(
      user => {
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });

        res.json({
          user,
          message: "user created",
          token
        });
      },
      err => res.send(500, err.message)
    );
  }
);

router.get(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "A password is required").exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ where: { email } }).then(
      user => {
        if (user) {
          bcrypt.compare(password, user.encryptedPassword, (err, matches) => {
            if (matches) {
              let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24
              });

              res.json({
                user: user,
                message: "successfully authenticated",
                sessionToken: token
              });
            } else {
              res.status(502).send({ error: "password does not match" });
            }
          });
        } else {
          res.status(502).send({ error: "user does not exist" });
        }
      },
      err => res.status(501).send({ error: "failed" })
    );
  }
);

module.exports = router;
