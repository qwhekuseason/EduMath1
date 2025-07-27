// lib/firebase.ts

// We keep these outside the function so they act like a singleton.
// This ensures Firebase is only initialized ONCE.
let app: any;
let auth: any;
let db: any;
let storage: any;

/**
 * A robust function to get the initialized Firebase instances.
 * It waits for the CDN script to load and initializes Firebase only once.
 */
export const getFirebase = () => {
  // If we've already initialized, just return the existing instances.
  if (app) {
    return { app, auth, db, storage };
  }

  // This check is crucial. It only runs on the client-side.
  if (typeof window !== 'undefined') {
    // Check if the global 'firebase' object from the CDN is available.
    if (window.firebase) {
      const firebaseConfig = {
        apiKey: "AIzaSyBfN0ci74w2zpeFcglQMSSvgKZ-zq2VK0w",
        authDomain: "edumathghana-817d5.firebaseapp.com",
        projectId: "edumathghana-817d5",
        storageBucket: "edumathghana-817d5.firebasestorage.app",
        messagingSenderId: "602430791823",
        appId: "1:602430791823:web:b2b2122fd43ec646b2d0fa",
        measurementId: "G-2TJ8FNDQS6"
      };
      
      // Initialize Firebase and store the instances
      app = window.firebase.initializeApp(firebaseConfig);
      auth = window.firebase.auth();
      db = window.firebase.firestore();
      storage = window.firebase.storage();

      return { app, auth, db, storage };

    } else {
      // This case handles the race condition if a component tries to get Firebase
      // before the CDN script has loaded. It shouldn't happen if components
      // use it inside useEffect or event handlers, but it's a safe fallback.
      console.error("Firebase CDN script has not loaded yet.");
      return { app: null, auth: null, db: null, storage: null };
    }
  }

  // Return nulls if on the server
  return { app: null, auth: null, db: null, storage: null };
};