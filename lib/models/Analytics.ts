import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalytics extends Document {
  _id: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  eventType: "visit" | "search" | "match_found" | "download";
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  eventName?: string;
  matchCount?: number;
  photoId?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ["visit", "search", "match_found", "download"],
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    eventName: {
      type: String,
    },
    matchCount: {
      type: Number,
    },
    photoId: {
      type: Schema.Types.ObjectId,
      ref: "Photo",
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for analytics queries
AnalyticsSchema.index({ photographerId: 1, eventType: 1, createdAt: -1 });
AnalyticsSchema.index({ photographerId: 1, createdAt: -1 });
AnalyticsSchema.index({ sessionId: 1 });

const Analytics: Model<IAnalytics> =
  mongoose.models.Analytics ||
  mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);

export default Analytics;
