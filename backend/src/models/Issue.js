import mongoose from 'mongoose';

const timelineEntrySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  note: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    location: {
      block: {
        type: String,
        required: [true, 'Campus block/building is required'],
        trim: true,
      },
      floor: {
        type: String,
        default: 'Ground Floor',
        trim: true,
      },
      area: {
        type: String,
        required: [true, 'Specific area or room is required'],
        trim: true,
      },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    upvotesCount: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: [
        'REPORTED',
        'UNDER_REVIEW',
        'APPROVED',
        'ASSIGNED',
        'ACKNOWLEDGED',
        'IN_PROGRESS',
        'RESOLVED',
        'USER_VERIFIED',
        'CLOSED',
        'REJECTED',
        'REOPENED',
      ],
      default: 'REPORTED',
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    priorityScore: {
      type: Number,
      default: 15,
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    deadline: {
      type: Date,
      default: null,
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    inProgressAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    proof: {
      beforeMedia: {
        type: [String],
        default: [],
      },
      afterMedia: {
        type: [String],
        default: [],
      },
      workNotes: {
        type: String,
        default: '',
      },
      completedAt: {
        type: Date,
        default: null,
      },
    },
    verification: {
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      isSatisfied: {
        type: Boolean,
        default: null,
      },
      reopenReason: {
        type: String,
        default: '',
      },
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      default: null,
    },
    timeline: [timelineEntrySchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance searches and feed filtering
issueSchema.index({ status: 1, priorityScore: -1 });
issueSchema.index({ category: 1 });
issueSchema.index({ 'location.block': 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ assignedWorker: 1 });

export const Issue = mongoose.model('Issue', issueSchema);
