async function main(callback) {
  const mongoose = require("mongoose");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const IssueModel = mongoose.model(
      "issues",
      new mongoose.Schema({
        project: { type: String, required: true },
        assigned_to: { type: String },
        status_text: { type: String },
        open: { type: Boolean },
        issue_title: { type: String, required: true },
        issue_text: { type: String, required: true },

        created_by: { type: String, required: true },
        created_on: { type: Date },
        updated_on: { type: Date },
      })
    );

    const FindIssue = (filters, done) => {
      IssueModel.find(filters, (err, data) => {
        if (err) return done(err, null);
        done(null, data);
      });
    };

    const DeleteIssue = (issue_id, done) => {
      IssueModel.deleteOne({ _id: issue_id }, (err, data) => {
        if (err) return done(err, null);
        done(null, data);
      });
    };

    const AddIssue = (params, done) => {
      const d = new IssueModel(params);
      d.save((err, doc) => {
        if (err) return done(err, null);
        done(null, doc);
      });
    };

    const UpdateIssue = (issue_id, params, done) => {
      //   console.log(issue_id, params);
      IssueModel.findOne({ _id: issue_id }, (err, doc) => {
        if (err) return done(err, null);
        if (!doc) return done(new Error("missing"), null);
        Object.assign(doc, params);
        doc.save((err1, doc1) => {
          if (err1) return done(err, null);
          done(null, doc1);
        });
      });
    };

    callback({
      FindIssue,
      DeleteIssue,
      UpdateIssue,
      AddIssue,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to Connect to Database");
  }
}

module.exports = main;
