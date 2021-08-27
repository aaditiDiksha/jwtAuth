const jwt = require("jsonwebtoken");

const {
  signAccessToken,
  signRefreshToken,
} = require("./AuthTokens");



const RegisterAuthentication = async (req, res, db) => {
  try {
  const { name, email, mobile } = req.body;
  if (!name || !(email || mobile)) throw "please enter fields";

  
  
      const user = await db
        .insert({ name, email,  mobile })
        .into("users")
        .returning("*");
    const accessToken = await signAccessToken({user_id: user[0].user_id, name: user[0].name});
    const refreshToken = await signRefreshToken({
      user_id: user[0].user_id,
      name: user[0].name,
    });

     await db("users")
      .where("user_id", "=", user[0].user_id)
      .update({ refresh_token: refreshToken })

    const updatedUser = await db.select('*').from('users').where('user_id','=',user[0].user_id).returning('*')

if (!updatedUser[0]) throw "some error";

    res.json({ accessToken, refreshToken, updatedUser });
  } catch (error) {
    res.json(error)

    return error;
  }
};

module.exports = {
  RegisterAuthentication,
};
