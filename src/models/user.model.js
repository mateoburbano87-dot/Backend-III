import mongoose from 'mongoose';
import { USER_ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    // Array de metadatos de documentos (no guardo el archivo, solo info)
    documents: [
      {
        originalName: String,
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
        documentType: {
          type: String,
          enum: Object.values(DOCUMENT_TYPES),
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);