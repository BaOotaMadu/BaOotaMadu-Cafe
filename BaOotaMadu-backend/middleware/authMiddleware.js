const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        console.log("🔹 Auth Middleware Triggered");

        // Check if Authorization header exists
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            console.log("❌ No token provided in request headers");
            return res.status(401).json({
                success: false,
                message: "Unauthorized user, token not provided",
            });
        }

        // Extract the token
        const token = req.headers.authorization.split(" ")[1];
        console.log("✅ Token Extracted:", token);

        // Verify token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("❌ Invalid token:", err.message);
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized user, invalid token",
                });
            }

            console.log("✅ Token Verified. User ID:", decoded.id);

            // Attach decoded user ID to request object
            req.body.id = decoded.id;
            next();
        });
    } catch (error) {
        console.error("🔥 Authentication Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
