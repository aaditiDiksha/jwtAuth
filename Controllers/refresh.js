const { verifyRefreshToken, signAccessToken } = require("./AuthTokens");

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw "no refresh token";
    const user = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken({admin_id: user.admin_id, email: user.email});
    res.json({accessToken,user});
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  refreshToken
};
