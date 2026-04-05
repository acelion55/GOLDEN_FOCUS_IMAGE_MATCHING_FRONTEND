import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPhoto extends Document {
  _id: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  eventName: string;
  imageUrl: string;
  thumbnailUrl?: string;
  faceEmbeddings: number[][];
  faceCount: number;
  originalFilename: string;
  fileSize: number;
  width?: number;
  height?: number;
  isProcessed: boolean;
  processingError?: string;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>(
  {
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    faceEmbeddings: {
      type: [[Number]],
      default: [],
    },
    faceCount: {
      type: Number,
      default: 0,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    isProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },
    processingError: {
      type: String,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
PhotoSchema.index({ photographerId: 1, eventName: 1 });
PhotoSchema.index({ photographerId: 1, createdAt: -1 });
PhotoSchema.index({ isProcessed: 1, photographerId: 1 });

const Photo: Model<IPhoto> =
  mongoose.models.Photo || mongoose.model<IPhoto>("Photo", PhotoSchema);

export default Photo;
