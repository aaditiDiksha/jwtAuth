const jwt = require("jsonwebtoken");

const {
  signAccessToken,
  signRefreshToken,
} = require("./AuthTokens");


const signinAuthentication = async (req, res, db, bcrypt) => {
  try {
  const { email, password } = req.body;
  if (!email || !password) {
throw 'enter the req fields'
  }

    
    const userExist = await db.select("*").from("admins").where("email", "=", email).returning('*')
    if(!userExist[0])
    throw 'user doesn\'t exist'
    if(!(userExist[0].password === password)){
        
        throw 'incorrect password'
    }
    const accessToken = await signAccessToken({
      admin_id: userExist[0].admin_id,
      email: userExist[0].email,
    });
    const refreshToken = await signRefreshToken({
      admin_id: userExist[0].admin_id,
      email: userExist[0].email,
    });
    const admin = await db("admins")
      .where("email", "=", email)
      .update({ refresh_token: refreshToken })
      .returning("*");
    if (!admin) throw "user does not exist";

    res.send({ accessToken, refreshToken });
  } catch (error) {
      res.json(error)
    return "Invalid Username/Password";
  }
};

module.exports = {
  signinAuthentication,
};
