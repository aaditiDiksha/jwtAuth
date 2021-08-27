const express = require("express");
const cors = require("cors");
const knex = require("knex");
require("dotenv").config();

const { verifyAccessToken } = require("./Controllers/AuthTokens");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const refresh = require("./controllers/refresh");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;

// ---------------- IF ALREADY SIGNED IN  ---------------------
app.get("/", verifyAccessToken, async (req, res, next) => {
  res.json(next);
});

// ------------------- USER REGISTER ------------------
app.post("/register",(req, res) => {
  register.RegisterAuthentication(req, res, db)});

// --------------- ADMIN SIGN IN ----------------------
app.post("/signin", (req, res) => {signin.signinAuthentication(req, res, db)});


//  ------------------ ON REFRESH ( ADMIN ACCESS TOKEN REGENERATED) --------------------
app.post("/refresh",(req, res) => { refresh.refreshToken(req, res, db)});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

