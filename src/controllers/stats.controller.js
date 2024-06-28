const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { statsService } = require("../services");


const getStats = catchAsync(async (req, res) => {

  const stats = await statsService.getStats();
  if (!stats) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stats not found");
  }
  res.send(stats[0]);
});



module.exports = {
getStats
}
