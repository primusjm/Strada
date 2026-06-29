function renderResult(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: `<!doctype html>
<html><body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(
        ${JSON.stringify(message)},
        e.origin
      );
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
</body></html>`,
  };
}

exports.handler = async (event) => {
  const code = event.queryStringParameters && event.queryStringParameters.code;

  if (!code) {
    return renderResult("error", { message: "Missing authorization code" });
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();

    if (data.error || !data.access_token) {
      return renderResult("error", { message: data.error_description || "OAuth exchange failed" });
    }

    return renderResult("success", { token: data.access_token, provider: "github" });
  } catch (err) {
    return renderResult("error", { message: err.message });
  }
};
