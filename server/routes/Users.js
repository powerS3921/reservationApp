/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         email:
 *           type: string
 *
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */
const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Op } = require("sequelize");

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       500:
 *         description: Internal server error
 */

router.post("/", async (req, res) => {
  const { username, password, email } = req.body;

  const existingEmailUser = await Users.findOne({ where: { email: email } });
  if (existingEmailUser) {
    return res.status(400).json({ error: "This email is already registered." });
  }

  const existingUsernameUser = await Users.findOne({ where: { username: username } });
  if (existingUsernameUser) {
    return res.status(400).json({ error: "This username is already taken." });
  }

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      email: email,
    });
    res.json("SUCCESS");
  });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: username }],
    },
  });

  if (!user) return res.json({ error: "User Doesn't exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) return res.json({ error: "Wrong username and password combination!" });
    const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
    res.json({ token: accessToken, username: user.username, id: user.id });
  });
});

/**
 * @swagger
 * /auth/auth:
 *   get:
 *     summary: Get authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return authenticated user data
 *       401:
 *         description: Unauthorized access
 */

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

/**
 * @swagger
 * /auth/basicinfo/{id}:
 *   get:
 *     summary: Get basic information of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Return basic information of the user
 *       404:
 *         description: User not found
 */

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;
  const basicInfo = await Users.findByPk(id, { attributes: { exclude: ["password"] } });
  res.json(basicInfo);
});

/**
 * @swagger
 * /auth/changepassword:
 *   put:
 *     summary: Change user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password
 *       401:
 *         description: Unauthorized access
 */

router.put("/changepassword", async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Old password and new password are required." });
  }
  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  bcrypt.compare(oldPassword, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: "Incorrect old password." });
    }

    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Failed to hash new password." });
      }

      Users.update({ password: hash }, { where: { username: username } })
        .then(() => {
          res.json({ success: true, message: "Password changed successfully." });
        })
        .catch((error) => {
          res.status(500).json({ error: "Failed to update password." });
        });
    });
  });
});
module.exports = router;
