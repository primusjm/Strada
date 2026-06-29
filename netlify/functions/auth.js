exports.handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const siteUrl = process.env.URL || "https://rising-leaders-center.netlify.app";
  const redirectUri = `${siteUrl}/api/callback`;
  const state = Math.random().toString(36).slice(2);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state,
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
    },
  };
};
