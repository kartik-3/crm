const { Router, response } = require("express");
const { MongoClient } = require("mongodb");
const { generateHash } = require("../services/hashingService");

const userRouter = Router();

const mongoClient = MongoClient;
const mongoURL = process.env.MONGO_URL;

mongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, dbname) => {
  if (err) throw err;

  let db = dbname.db("crm");
  db.collection("users", (err) => {
    if (err) throw err;
  });

  userRouter.post("/", (req, res) => {
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
    } else {
      if (!req.body.email) {
        res.status(400).send("Email ID not present in request");
      } else if (!req.body.password) {
        res.status(400).send("Password not present in request");
      } else if (!req.body.firstName) {
        res.status(400).send("First name not present in request");
      } else if (!req.body.lastName) {
        res.status(400).send("Last name not present in request");
      } else if (!req.body.userType) {
        res.status(400).send("Email ID not present in request");
      } else {
        db.collection("users").findOne(
          { email: req.body.email },
          (err, response) => {
            if (err) throw err;
            if (response != null) {
              res.status(404).send("User already exists.");
            } else {
              generateHash(req.body.password).then((passwordHash) => {
                const data = {
                  email: req.body.email,
                  password: passwordHash,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  userType: req.body.userType,
                };
                db.collection("users").insertOne(data, (err, response2) => {
                  if (err) throw err;
                  res.status(200).send("User created successfully!");
                });
              });
            }
          }
        );
      }
    }
  });
});

module.exports = userRouter;
