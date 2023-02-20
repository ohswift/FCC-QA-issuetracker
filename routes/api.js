"use strict";

module.exports = function (app, client) {
  const formatDoc = (doc) => {
    // remove project
    let res = doc._doc;
    res["assigned_to"] ||= "";
    res["status_text"] ||= "";
    delete res.project;
    return res;
  };

  console.log("init db...");
  app
    .route("/api/issues/:project")
    .get(function (req, res, next) {
      let project = req.params.project;
      let params = { project, ...req.query };
      console.log(params);
      client.FindIssue(params, (err, docs) => {
        if (err) return next(err);
        const output = docs.map((doc) => formatDoc(doc));
        res.send(output);
      });
    })

    .post(function (req, res, next) {
      let project = req.params.project;
      console.log(req.body);
      let params = Object.assign({}, req.body);
      console.log(params);
      if (
        !params.issue_title ||
        !params.issue_text ||
        !params.created_by ||
        !project
      ) {
        res.status(200);
        res.send({ error: "required field(s) missing" });
        return;
      }
      params["project"] = project;
      params["open"] = true;
      params["created_on"] = new Date();
      params["updated_on"] = new Date();
      console.log(params);
      client.AddIssue(params, (err, doc) => {
        if (err) {
          res.send({ error: "required field(s) missing" });
          return;
        }
        res.send(formatDoc(doc));
      });
    })

    .put(function (req, res, next) {
      let project = req.params.project;
      console.log(req.body);
      let { _id, ...params } = req.body;
      if (_id == undefined) {
        res.send({ error: "missing _id" });
        return;
      }
      if (Object.keys(params).length == 0) {
        res.send({ error: "no update field(s) sent", _id });
        return;
      }

      params["updated_on"] = new Date();
      client.UpdateIssue(_id, params, (err, doc) => {
        if (err) {
          res.send({ error: "could not update", _id });
          return;
        }
        res.send({
          result: "successfully updated",
          _id,
        });
      });
    })

    .delete(function (req, res, next) {
      let project = req.params.project;
      let { _id, ...params } = req.body;
      console.log(req.body);
      if (_id == undefined) {
        res.send({ error: "missing _id" });
        return;
      }
      client.DeleteIssue(_id, (err, doc) => {
        console.log(err, doc);
        if (err || doc.deletedCount == 0) {
          res.send({ error: "could not delete", _id });
          return;
        }
        res.send({
          result: "successfully deleted",
          _id,
        });
      });
    });
};
