export default function handler(_request, response) {
  const challengeToken = process.env.OPENAI_APPS_CHALLENGE_TOKEN ?? "";

  if (!challengeToken) {
    response.writeHead(404, {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
    });
    response.end(JSON.stringify({ error: "challenge_not_configured" }));
    return;
  }

  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": "text/plain; charset=utf-8",
    "x-content-type-options": "nosniff",
  });
  response.end(challengeToken);
}
