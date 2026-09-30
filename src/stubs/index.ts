// Stub-mode gate.
//
// When the USE_API_STUBS environment variable is set to "true"
// (case-insensitive), the API clients under src/tools/*.ts short-circuit their
// network calls and return canned payloads sourced from the sibling files in
// this folder. Useful for local development against KT's APIs when credentials
// or sandboxes are unavailable.

export const isStubMode = (): boolean =>
  process.env.USE_API_STUBS?.toLowerCase() === 'true';
