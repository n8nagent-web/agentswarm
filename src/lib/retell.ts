export interface RetellDynamicVariables {
  [key: string]: string;
}

export interface CreateWebCallResponse {
  access_token: string;
  call_id?: string;
}

export interface CreateWebCallOptions {
  dynamicVariables?: RetellDynamicVariables;
  beginMessage?: string;
}

export async function createRetellWebCall(
  agentId: string,
  options?: CreateWebCallOptions,
): Promise<CreateWebCallResponse> {
  const response = await fetch("/api/retell/create-web-call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: agentId,
      retell_llm_dynamic_variables: options?.dynamicVariables,
      begin_message: options?.beginMessage,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(errorBody || `Failed to create Retell web call (${response.status})`);
  }

  return response.json();
}
