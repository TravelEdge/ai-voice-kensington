// Editable stub payloads for src/tools/tmt-legacy.ts.
//
// When USE_API_STUBS=true the tool file returns these constants instead of
// calling the TMT Legacy API. Add per-endpoint stubs here as needed.

/** Bearer token returned by tmt-legacy authenticate() in stub mode. */
export const TMT_LEGACY_AUTH_STUB = 'dummy';

/**
 * Response body returned by createNewClientRequest() in stub mode. Replace
 * this with the actual shape KT returns (e.g. `{ clientRequestId, leadId }`)
 * so the LLM sees realistic post-success data downstream.
 */
export const CREATE_NEW_CLIENT_REQUEST_STUB: unknown = {};
