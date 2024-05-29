const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Role } = require("../models");

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    console.log("user", user);
    req.user = user;

    if (requiredRights.length) {
      const role = user.role_type ? user.role_type : user.role;
      let findRolePromise;

      if (role.match(/^[a-zA-Z]+$/)) {
        findRolePromise = Role.findOne({ role: role });
      } else {
        findRolePromise = Role.findOne({ _id: role });
      }

      findRolePromise
        .then((roleObject) => {
          const userRights = roleObject.role_rights;
          console.log("role", role);
          console.log("userRights", userRights);

          if (!userRights) {
            return Promise.reject(
              new ApiError(
                httpStatus.FORBIDDEN,
                "Forbidden because role doesnt have rights"
              )
            );
          }

          const hasRequiredRights = requiredRights.every((requiredRight) =>
            userRights.includes(requiredRight)
          );

          if (!hasRequiredRights && req.params.userId !== user.id) {
            return Promise.reject(
              new ApiError(httpStatus.FORBIDDEN, "Forbidden")
            );
          }
        })
        .catch((err) => {
          console.error(err);
          return Promise.reject(
            new ApiError(httpStatus.FORBIDDEN, "Forbidden")
          );
        });
    }

    resolve();
  };

const auth =
  () => //...requiredRights
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false }
        //verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
