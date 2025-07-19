import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyD-sR7W8dSyD9jc4JD6B_z2xrE0QuDMmac",
  authDomain: "roxu-mods.firebaseapp.com",
  databaseURL: "https://roxu-mods-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "roxu-mods",
  storageBucket: "roxu-mods.firebasestorage.app",
  messagingSenderId: "1017801546966",
  appId: "1:1017801546966:android:419ee0d177dd0584befd77"
};
const app = initializeApp(firebaseConfig);
export default app;
