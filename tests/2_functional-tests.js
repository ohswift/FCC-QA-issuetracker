const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let issue_id_to_put;
let issue_id_to_delete;

suite("Functional Tests", function () {
  test("#1 POST every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "t1",
        issue_text: "t1t1t1t1",
        created_by: "author1",
        assigned_to: "p1",
        status_text: "ok",
      })
      .end(function (err, res) {
        issue_id_to_put = res.body._id;
        issue_id_to_delete = res.body._id;
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#2 POST only field", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "t2",
        issue_text: "t2t2t2t2",
        created_by: "author2",
      })
      .end(function (err, res) {
        issue_id_to_delete = res.body._id;
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#3 POST missing field", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_text: "t3t3t3",
        created_by: "author3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });
  test("#4 view issues", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        console.log(res.text);
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#5 view issues with one filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?open=true")
      .end(function (err, res) {
        console.log(res.text);
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#6 view issues with multiple filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?open=true&created_by=aaa")
      .end(function (err, res) {
        console.log(res.text);
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#7 PUT one field", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: issue_id_to_put, issue_title: "t4" })
      .end(function (err, res) {
        console.log(res.text);
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#8 PUT multiple field", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: issue_id_to_put, issue_title: "t5", issue_text: "t5t5t5t5" })
      .end(function (err, res) {
        console.log(res.text);
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#9 PUT missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ issue_title: "t6", issue_text: "t6t6t6t6" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  test("#10 PUT no field", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: issue_id_to_put })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#11 PUT invalid _id ", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: 989898, issue_title: "t7" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#12 DELETE invalid _id ", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: 989898 })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  test("#13 PUT missing _id ", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ issue_title: "t8" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  test("#14 DELETE issue ", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: issue_id_to_delete })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
});
