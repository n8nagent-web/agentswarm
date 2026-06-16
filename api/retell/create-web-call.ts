import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RETELL_API_KEY is not configured" });
  }

  const body = req.body as {
    agent_id?: string;
    retell_llm_dynamic_variables?: Record<string, string>;
    begin_message?: string;
  };

  const agentId = body.agent_id || process.env.VITE_RETELL_AGENT_ID;
  if (!agentId) {
    return res.status(400).json({ error: "agent_id is required" });
  }

  const retellBody: Record<string, unknown> = { agent_id: agentId };

  if (body.retell_llm_dynamic_variables) {
    retellBody.retell_llm_dynamic_variables = body.retell_llm_dynamic_variables;
  }

  if (body.begin_message) {
    retellBody.agent_override = {
      retell_llm: {
        begin_message: body.begin_message,
        start_speaker: "agent",
      },
    };
  }

  try {
    const retellResponse = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(retellBody),
    });

    const responseBody = await retellResponse.text();
    res.status(retellResponse.status).setHeader("Content-Type", "application/json");
    return res.send(responseBody);
  } catch {
    return res.status(500).json({ error: "Failed to create Retell web call" });
  }
}
