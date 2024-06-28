const httpStatus = require("http-status");
const { User } = require("../models");
// const { getPreferences } = require('../utils/createPreferences');

const getStats = async (roleBody) => {
  console.log("Hi from role service createRole", roleBody);
  
  const stats = await User.aggregate([
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "roleDetails"
      }
    },
    {
      $unwind: "$roleDetails"
    },
    {
      $facet: {
        totalCount: [
          {
            $match: {
              "roleDetails.role": {
                $in: ["graduate", "practitioner", "researcher", "professor"]
              }
            }
          },
          {
            $count: "totalCount"
          }
        ],
        graduateCount: [
          {
            $match: {
              "roleDetails.role": "graduate"
            }
          },
          {
            $count: "graduateCount"
          }
        ],
        fileStoresCount: [
          {
            $lookup: {
              from: "filestores",
              pipeline: [
                {
                  $count: "fileStoresCount"
                }
              ],
              as: "fileStoresCount"
            }
          },
          {
            $unwind: "$fileStoresCount"
          },
          {
            $replaceRoot: {
              newRoot: "$fileStoresCount"
            }
          }
        ],
        institutesAdminCount: [
          {
            $lookup: {
              from: "admins",
              let: { institution: "$institution" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $ne: ["$institution", null]
                    }
                  }
                },
                {
                  $count: "institutesAdminCount"
                }
              ],
              as: "institutesAdminCount"
            }
          },
          {
            $unwind: "$institutesAdminCount"
          },
          {
            $replaceRoot: {
              newRoot: "$institutesAdminCount"
            }
          }
        ]
      }
    },
    {
      $project: {
        members: { $arrayElemAt: ["$totalCount.totalCount", 0] },
        graduate: { $arrayElemAt: ["$graduateCount.graduateCount", 0] },
        files: { $arrayElemAt: ["$fileStoresCount.fileStoresCount", 0] },
        institutes: { $arrayElemAt: ["$institutesAdminCount.institutesAdminCount", 0] }
      }
    }
  ]
  
  );
  return stats;
};


module.exports = {
 getStats
};