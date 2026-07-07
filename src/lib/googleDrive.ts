import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App safely if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with Google Drive Scopes
export const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/drive.readonly");
provider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");

// Keep state tracking variables
let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize Auth listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If we have a user but no cached token, they might need to sign in again to get the token
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google Sign-In trigger
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get Google Drive access token from authentication.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve current cached token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Logout handler
export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Interfaces for Google Drive files
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  size?: string;
  thumbnailLink?: string;
}

// ----------------------------------------------------
// GOOGLE DRIVE API OPERATIONS
// ----------------------------------------------------

/**
 * Lists JSON project files and media files in Google Drive.
 */
export const listFilesFromDrive = async (
  accessToken: string,
  type: "json" | "media" = "json"
): Promise<DriveFile[]> => {
  const query = type === "json"
    ? "name contains 'apollo_solar_project' and mimeType = 'application/json' and trashed = false"
    : "(mimeType contains 'image/' or mimeType contains 'video/') and trashed = false";

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,createdTime,size,thumbnailLink)&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Failed to list files from Google Drive.");
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Downloads a file's content as a JSON object.
 */
export const downloadJsonFile = async (accessToken: string, fileId: string): Promise<any> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to download project configuration from Google Drive.");
  }

  return await response.json();
};

/**
 * Fetches an image or video file from Google Drive as a Blob URL.
 * This is robust and sidesteps browser security policies or cross-origin issues.
 */
export const getFileBlobUrl = async (accessToken: string, fileId: string): Promise<string> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to download media file from Google Drive.");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Saves or updates a JSON file or report on Google Drive.
 * We use a clean 2-step process: Create metadata first, then PATCH content.
 */
export const saveFileToDrive = async (
  accessToken: string,
  fileName: string,
  mimeType: string,
  content: string
): Promise<string> => {
  // Step 1: Create file metadata
  const createUrl = "https://www.googleapis.com/drive/v3/files";
  const createResponse = await fetch(createUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: fileName,
      mimeType: mimeType
    })
  });

  if (!createResponse.ok) {
    const err = await createResponse.json();
    throw new Error(err.error?.message || "Failed to create file metadata in Google Drive.");
  }

  const metadata = await createResponse.json();
  const fileId = metadata.id;

  // Step 2: Upload content using PATCH
  const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
  const uploadResponse = await fetch(uploadUrl, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": mimeType
    },
    body: content
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to write content to Google Drive file.");
  }

  return fileId;
};

/**
 * Deletes a file from Google Drive (sends to trash).
 */
export const deleteFileFromDrive = async (accessToken: string, fileId: string): Promise<void> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to delete file from Google Drive.");
  }
};
