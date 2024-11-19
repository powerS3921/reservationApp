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

router.post("/send-confirmation-email", async (req, res) => {
  const { email } = req.body;

  try {
    // Sprawdzenie, czy użytkownik istnieje
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Użytkownik o podanym e-mailu nie istnieje" });
    }

    if (user.isConfirmed) {
      return res.status(400).json({ message: "Konto jest już potwierdzone." });
    }

    // Generowanie tokena potwierdzającego
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token ważny 24 godziny
    });

    // Konfiguracja SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Brak klucza API SendGrid" });
    }

    sgMail.setApiKey(apiKey);

    const confirmationUrl = `http://localhost:3000/confirm-email/${token}`;

    // Treść wiadomości
    const msg = {
      to: email,
      from: "opielowski.maciek0309@outlook.com",
      subject: "Potwierdzenie rejestracji w GameGalaxy",
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Potwierdzenie Konta</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; background-color: #f4f4f4;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #931100; color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                          GameGalaxy
                        </td>
                      </tr>
                      <!-- Spacer -->
                      <tr>
                        <td style="height: 20px;">&nbsp;</td>
                      </tr>
                      <!-- Content -->
                      <tr>
                        <td align="center" style="padding: 20px 30px; font-size: 16px; line-height: 1.5; color: #333333;">
                          <h2 style="margin: 0; font-size: 22px; color: #931100;">Witaj ${user.username}!</h2>
                          <p>Dziękujemy za rejestrację w GameGalaxy.</p>
                          <p>Aby aktywować swoje konto, kliknij poniższy przycisk:</p>
                          <a href="${confirmationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #931100; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Potwierdź konto</a>
                          <p>Link jest ważny przez 24 godziny. Jeśli nie zakładałeś konta, zignoruj tę wiadomość.</p>
                        </td>
                      </tr>
                      <!-- Spacer -->
                      <tr>
                        <td style="height: 20px;">&nbsp;</td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="padding: 10px; background-color: #931100; color: #ffffff; font-size: 14px;">
                          Pozdrawiamy, Zespół GameGalaxy
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>`,
    };

    // Wysyłanie wiadomości e-mail
    await sgMail.send(msg);
    console.log("E-mail wysłany");

    res.status(200).json({ message: "E-mail potwierdzający został wysłany." });
  } catch (error) {
    console.error("Błąd przy wysyłaniu e-maila:", error);
    res.status(500).json({ message: "Błąd przy wysyłaniu e-maila." });
  }
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
