import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text",
      "text/plain",
      "application/rtf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, DOCX, ODT, TXT, and RTF are allowed."));
    }
  },
});

export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// Get file extension from mimetype or filename
const getFileExtension = (file) => {
  const originalName = file.originalname;
  const extFromName = originalName.split('.').pop().toLowerCase();
  
  const mimeToExt = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.oasis.opendocument.text': 'odt',
    'text/plain': 'txt',
    'application/rtf': 'rtf'
  };
  
  const extFromMime = mimeToExt[file.mimetype];
  
  return extFromName || extFromMime || 'pdf';
};

// Format filename for Cloudinary
const formatFilename = (userId, userName, originalName) => {
  const sanitizedName = userName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
  
  // Include folder in the public_id
  return `resumes/resume_${sanitizedName}_${dateStr}`;
};

// Upload to Cloudinary
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const fileExtension = getFileExtension(file);
    
    const publicId = options.public_id || formatFilename(
      options.userId || 'user',
      options.userName || 'user',
      file.originalname
    );

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload with raw resource type for all documents
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: "raw",
      public_id: publicId,
      access_mode: "public",
      ...options,
    });

    return {
      ...uploadResult,
      fileExtension,
      displayName: file.originalname,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
}

// Upload profile image to Cloudinary
export const uploadProfileImage = async (file, userId, userName) => {
  try {
    const sanitizedName = userName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    const publicId = `${sanitizedName}_${userId}`;

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: "image",
      public_id: publicId,
      folder: "profile_images",
      access_mode: "public",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary profile image upload error:", error);
    throw new Error(`Profile image upload failed: ${error.message}`);
  }
};