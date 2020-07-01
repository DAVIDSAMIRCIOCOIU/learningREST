const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // get the token from the header (we split as we add Bearer + " " + <token>)
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // Add new field to the request so we can extract it in the future (remember
    // that the middleware is called before the request is called)
    req.userData = decoded;
    console.log(decoded)
    // Call next if we succeed (getting the next middleware)
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
