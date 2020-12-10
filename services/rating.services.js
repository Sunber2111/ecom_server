const axios = require("axios");

module.exports.getRatingByIdList = async (listId) => {
  try {
    const res = await axios.post("http://localhost:5001/api/comments/getManyByListId", { listId });
    return res.data.data;
  } catch (error) {
    return [];
  }
};
