const mongoose = require('mongoose');

const teaSchema = new mongoose.Schema({
  traceCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    type: String,
    required: true,
    trim: true
  },
  producer: {
    type: String,
    required: true,
    trim: true
  },
  productionDate: {
    type: Date,
    required: true
  },
  harvestDate: {
    type: Date,
    required: true
  },
  processingSteps: [
    {
      step: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        trim: true
      }
    }
  ],
  qualityTest: {
    passed: {
      type: Boolean,
      required: true
    },
    testDate: {
      type: Date,
      required: true
    },
    testResults: {
      type: String,
      trim: true
    }
  },
  packagingInfo: {
    material: {
      type: String,
      required: true
    },
    packageDate: {
      type: Date,
      required: true
    },
    packageQuantity: {
      type: Number,
      required: true
    }
  },
  distributionInfo: [
    {
      location: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      status: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tea = mongoose.model('Tea', teaSchema);

module.exports = Tea;
