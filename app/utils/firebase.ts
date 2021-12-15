import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import * as dotenv from "dotenv";
import { config } from "./firebaseConfig";
dotenv.config();

// Firebase configuration
const firebaseConfig = config;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
