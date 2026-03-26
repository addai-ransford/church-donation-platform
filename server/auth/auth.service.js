import bcrypt from "bcrypt";
import { db } from "../firebaseAdmin.js";

export const registerUser = async (username, password) => {
    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();

    if (doc.exists) {
        throw new Error("Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
        id: username, 
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };

    await userRef.set(newUser);
    return newUser;
};

export const loginUser = async (username, password) => {
    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();

    if (!doc.exists) throw new Error("Invalid credentials");

    const user = doc.data();
    const isOk = await bcrypt.compare(password, user.password);

    if (!isOk) throw new Error("Invalid credentials");

    return user;
};

export const saveRefreshToken = async (userId, token) => {
    await db.collection("refreshTokens").doc(token).set({
        userId,
        token,
        createdAt: new Date().toISOString()
    });
};

export const findRefreshToken = async (token) => {
    const doc = await db.collection("refreshTokens").doc(token).get();
    return doc.exists ? doc.data() : null;
};

export const deleteRefreshToken = async (token) => {
    await db.collection("refreshTokens").doc(token).delete();
};