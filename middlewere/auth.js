const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function requireAuth(req, res, next) {
    let token;

    if (req.headers["authorization"]) {
        token = req.headers["authorization"].split(" ")[1];
    }

    if (!token && req.headers.cookie) {
        const cookies = Object.fromEntries(
            req.headers.cookie.split(";").map(c => c.trim().split("="))
        );
        token = cookies.token;
    }

    if (!token && req.session && req.session.token) {
        token = req.session.token;
    }

    if (!token) {
      console.log(token, "No token found in request");
        return res.redirect('/login');
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err, "Token verification failed");
            return res.redirect('/login');
        }
        req.user = decoded;
        next();
    });
}

function requireAuthAPI(req, res, next) {
    let token;

    if (req.headers["authorization"]) {
        token = req.headers["authorization"].split(" ")[1];
    }

    if (!token && req.headers.cookie) {
        const cookies = Object.fromEntries(
            req.headers.cookie.split(";").map(c => c.trim().split("="))
        );
        token = cookies.token;
    }

    if (!token && req.session && req.session.token) {
        token = req.session.token;
    }

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
}

function redirectIfAuthenticated(req, res, next) {
    let token;

    if (req.headers["authorization"]) {
        token = req.headers["authorization"].split(" ")[1];
    }

    if (!token && req.headers.cookie) {
        const cookies = Object.fromEntries(
            req.headers.cookie.split(";").map(c => c.trim().split("="))
        );
        token = cookies.token;
    }

    if (!token && req.session && req.session.token) {
        token = req.session.token;
    }

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err) {
                return res.redirect('/');
            }
            next();
        });
    } else {
        next();
    }
}

module.exports = {
    requireAuth,        
    requireAuthAPI,       
    redirectIfAuthenticated  
};