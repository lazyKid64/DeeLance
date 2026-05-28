const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema(
  {
    internshipName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    ethRewardPool: {
      type: Number,
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    durationGaps: {
      type: Number,
      required: true,
    },

    companyHandle: {
      type: String,
      required: true,
    },

    contractInternshipId: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", InternshipSchema);
