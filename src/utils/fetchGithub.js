const axios = require("axios");

const fetchGithub = async function (username) {
  const uri = encodeURI(`https://api.github.com/users/${username}/repos`);

  const headers = {
    "user-agent": "node.js",
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  };

  const options = {
    headers,
    params: {
      per_page: 5,
      sort: "created:asc",
    },
  };

  const githubResponse = await axios.get(uri, options);
  return githubResponse;
};

module.exports = fetchGithub;
