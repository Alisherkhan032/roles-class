require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { findUserByName } = require('./db');

let refreshTokens = new Set();

const app = express();
app.use(express.json());

app.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
    if (!refreshTokens.has(refreshToken)) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) return res.status(403).json({ message: "Forbidden", error: err.message });
        const token = generateAccessToken({ user: data.user });
        res.json({ token });
    });
});

app.post("/login", async (req, res) => {
    try {
        const user = findUserByName(req.body.username);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const data = { user };
        const token = generateAccessToken(data);
        const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.add(refreshToken);
        return res.json({ token: token, refreshToken: refreshToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/logout", (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshTokens.has(refreshToken)) {
        res.status(200).json({ message: "No op" });
    }
    refreshTokens.delete(refreshToken);
    return res.status(204).json({ message: "Logged out" });
});

function generateAccessToken(userInfo) {
    return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
}

app.listen(5001, ()=>{
    console.log('running on 5001');
});
