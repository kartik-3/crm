const express = require("express");
const mongo = require("mongodb");

const leadsRouter = express.Router();

const mongoClient = mongo.MongoClient;

const mongoURL = process.env.MONGO_URL;

mongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, dbname) => {
  if (err) throw err;

  let db = dbname.db("crm");
  db.collection("leads", (err) => {
    if (err) throw err;
  });

  leadsRouter
    .post("/", (req, res) => {
      if (!req.body.currUserRole) {
        res.status(400).send("Current user role not present in request");
      } else if (
        req.body.currUserRole != "manager" &&
        req.body.currUserRole != "admin" &&
        req.body.currUserRole != "employee"
      ) {
        res.status(404).send("Don't have access to create leads.");
      } else {
        if (!req.body.subject) {
          res.status(400).send("Subject not present in request");
        } else if (!req.body.assignedTo) {
          res.status(400).send("AssignedTo not present in request");
        } else if (!req.body.createdBy) {
          res.status(400).send("CreatedBy not present in request");
        } else {
          db.collection("leads").countDocuments({}, (err, count) => {
            if (err) throw err;
            const leadId = count + 1;
            const data = {
              subject: req.body.subject,
              assignedTo: req.body.assignedTo,
              stage: "created",
              id: leadId,
              createdBy: req.body.createdBy,
            };
            db.collection("leads").insertOne(data, (err, response) => {
              if (err) throw err;
              res.status(200).send("Lead created successfully");
            });
          });
        }
      }
    })
    .patch("/:id", (req, res) => {
      if (!req.body.currUserRole) {
        res.status(400).send("Current user role not present in request");
      } else if (
        req.body.currUserRole != "manager" &&
        req.body.currUserRole != "admin" &&
        req.body.currUserRole != "employee"
      ) {
        res.status(404).send("Don't have access to create leads.");
      } else {
        if (!req.params.id) {
          res.status(400).send("Lead ID not present in request");
        } else if (!req.body.query) {
          res.status(400).send("Update query not present in request");
        } else if (req.body.query.id) {
          res.status(400).send("Can't update ID of lead");
        } else {
            db.collection("leads").findOne(
                { id: parseInt(req.params.id) },
                (err, response) => {
                  if (err) throw err;
                  if (response != null) {
                    db.collection("leads").updateOne(
                      { id: req.params.id },
                      { $set: req.body.query },
                      (err, response) => {
                        if (err) throw err;
                        res.status(200).send("Updated lead");
                      }
                    );
                  } else {
                    res.status(400).send("Lead not found");
                  }
                }
              );
        }
      }
    })
    .get("/:id", (req, res) => {
      if (!req.params.id) {
        res.status(400).send("Lead ID not present in request");
      }
      console.log(req.params.id);
      db.collection("leads").findOne(
        { id: parseInt(req.params.id) },
        (err, response) => {
          if (err) throw err;
          if (response != null) {
            res.status(200).send(response);
          } else {
            res.status(400).send("Lead not found");
          }
        }
      );
    })
    .get("/", (req, res) => {
      db.collection("leads")
        .find({})
        .toArray((err, response) => {
          res.status(200).send(response);
        });
    });

  //   dbname.close();
});

module.exports = leadsRouter;
