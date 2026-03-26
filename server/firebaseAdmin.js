import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

initializeApp();

export const db = getFirestore();
export const FieldValue = admin.firestore.FieldValue;