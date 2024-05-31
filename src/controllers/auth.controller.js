const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  adminService,
  roleService,
} = require("../services");
const ApiError = require("../utils/ApiError");

const login = catchAsync(async (req, res) => {
  // if user is verfied by an admin, only then they can login
  // also generate a token for the user to login
  const { email, password } = req.body;
  try {
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password
    );
    let tokens = null;
    if (user) {
      tokens = await tokenService.generateAuthTokens(user);
    }
    console.log("User is: ", user);
    console.log("Tokens are: ", tokens);
    res.send({ user, tokens });
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).send({ error: error.message });
  }
});

const register = catchAsync(async (req, res) => {
  console.log("req.body in auth register: ", req.body);
  let registeredUser = null;
  try {
    const role = await roleService.getRole(req.body.role);

    if (role.role === "admin") {
      registeredUser = await adminService.createAdmin(req.body);
    } else if (role.role === "institution admin") {
      registeredUser = await adminService.createInstituteAdmin(req.body);
    } else {
      registeredUser = await userService.createUser(req.body);
    }
    console.log("Registered User is: ", registeredUser);

    res.status(httpStatus.CREATED).send({ registeredUser });
  } catch (error) {
    throw new ApiError(httpStatus[500], "Please authenticate correctly" + error);
  }
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const logout = catchAsync(async (req, res) => {});

module.exports = {
  login,
  register,
  refreshTokens,
};
