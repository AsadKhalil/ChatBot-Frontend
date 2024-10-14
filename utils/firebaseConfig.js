import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDvqZyaJaa6Ps6S-2171pSQ_HFvbgrjzDE",
  authDomain: "chat-bot-1cc20.firebaseapp.com",
  projectId: "chat-bot-1cc20",
  storageBucket:"chat-bot-1cc20.appspot.com",
  messagingSenderId: "571257952435",
  appId:"1:571257952435:web:94e2130af65952dd0438c6",
};
console.log(firebaseConfig);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
