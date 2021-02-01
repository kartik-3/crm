const express = require("express");
const mongo = require("mongodb");
const { validateHash } = require("../services/hashingService");
const { createToken } = require("../services/jwtService");

const loginRouter = express.Router();

const mongoClient = mongo.MongoClient;

const mongoURL = process.env.MONGO_URL;

mongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, dbname) => {
  if (err) throw err;

  let db = dbname.db("crm");
  db.collection("users", (err) => {
    if (err) throw err;
  });

  loginRouter.post("/", (req, res) => {
    if (!req.body.currUserRole) {
      res.status(400).send("Current user type not present in request");
    } else if (
      req.body.currUserRole != "manager" &&
      req.body.currUserRole != "admin"
    ) {
      res.status(404).send("Don't have access to set this type of user.");
    } else if (
      req.body.currUserRole == "manager" &&
      req.body.userType == "manager"
    ) {
      res.status(404).send("Don't have access to set this type of user.");
    } else if (req.body.userType == "admin") {
      res.status(404).send("Can't have anymore admin users.");
    }
    db.collection("users").findOne(
      { email: req.body.email },
      (err, response) => {
        if (res == null) {
          res.status(404).send("User not found.");
        } else {
          validateHash(req.body.password, response.password).then((result) => {
            if (result) {
              const token = createToken(req.body.email);
              res.cookie("jwt", token, {
                maxAge: 100000000,
                httpOnly: true,
                secure: false,
              });
              res.status(200).send("User logged in.");
            } else {
              res.status(404).send("Invalid user.");
            }
            return result;
          });
        }
      }
    );
  });

  //   dbname.close();
});

module.exports = loginRouter;
