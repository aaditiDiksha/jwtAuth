const JWT = require("jsonwebtoken");

module.exports = {
  signAccessToken: (data) => {
    return new Promise((resolve, reject) => {
      const payload = data;
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "10"
      };
      JWT.sign(payload, secret, { expiresIn: '120000ms' }, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(err.message);
          return;
        }
        resolve(token);
      });
    });
  },


  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next("not in headers");
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(message);
      }
      req.payload = payload;
      next('welcome');
    });
  },
  signRefreshToken: (data) => {
    return new Promise((resolve, reject) => {
      const payload = data;
      
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "10d"
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          // reject(err)
          reject(err.message);
        }

        
          resolve(token);
    
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(err);
          return resolve({admin_id: payload.admin_id, email: payload.email})
         
        }
      );
    });
  },
};
