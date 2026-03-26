import {
    registerUser,
    loginUser,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
} from "./auth.service.js";

import {
    generateAccessToken,
    generateRefreshToken,
} from "./token.service.js";
import jwt from "jsonwebtoken";
const normalize = (u) => u.trim().toLowerCase();


export const register = async (req, res) => {
    try {
        let { username, password } = req.body;
        username = normalize(username);

        const user = await registerUser(username, password);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await saveRefreshToken(user.id, refreshToken);

        res.json({ accessToken, refreshToken, username: user.username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        let { username, password } = req.body;
        username = normalize(username);

        const user = await loginUser(username, password);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await saveRefreshToken(user.id, refreshToken);

        res.json({ accessToken, refreshToken, username: user.username });
    } catch (err) {
        res.status(401).json({ error: "Invalid username or password" });
    }
};


export const refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    const stored = await findRefreshToken(refreshToken);
    if (!stored) return res.sendStatus(403);

    try {
        const user = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const accessToken = generateAccessToken(user);

        res.json({ accessToken });
    } catch {
        res.sendStatus(403);
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.body;

    await deleteRefreshToken(refreshToken);

    res.sendStatus(204);
};