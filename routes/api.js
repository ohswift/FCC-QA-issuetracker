"use strict";

module.exports = function (app, client) {
  console.log("init db...");
  app
    .route("/api/issues/:project")
    .get(function (req, res, next) {
      let project = req.params.project;
      client.FindIssue({}, (err, docs) => {
        if (err) return next(err);
        res.send(docs);
      });
    })

    .post(function (req, res, next) {
      let project = req.params.project;
      console.log(req.body);
      let params = Object.assign({}, req.body);

      params["projectname"] = project;
      params["open"] = true;
      params["created_on"] = new Date();
      console.log(params);
      client.AddIssue(params, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
      });
    })

    .put(function (req, res, next) {
      let project = req.params.project;
      console.log(req.body);
      let { _id, ...params } = req.body;
      if (_id == undefined) {
        next(new Error("invalid id"));
        return;
      }
      params["updated_on"] = new Date();
      client.UpdateIssue(_id, params, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
      });
    })

    .delete(function (req, res, next) {
      let project = req.params.project;
      let { _id, ...params } = req.body;
      console.log(req.body);
      if (_id == undefined) {
        next(new Error("invalid id"));
        return;
      }
      client.DeleteIssue(_id, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
      });
    });
};
