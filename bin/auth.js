const bycrypt = require("bcryptjs");
const saltRound = 10;

const hashPassword = async (password) => {
  var salt = await bycrypt.genSalt(saltRound);

  return await bycrypt.hash(password, salt);
};

const hashCompare = async (password, hashedPassword) => {
  return await bycrypt.compare(password, hashedPassword);
};
module.exports = { hashPassword, hashCompare };
