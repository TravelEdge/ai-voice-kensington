// find-available-worker.js
//
// Twilio Function: looks up a Flex TaskRouter Worker by email and reports
// whether they are currently in an "available" activity (i.e. can receive
// tasks right now).
//
// Deploy alongside a Twilio Serverless service (either via the Console or
// `twilio serverless:deploy`). The Functions runtime auto-populates
// TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN — you only need to add:
//
//   TASKROUTER_WORKSPACE_SID   the Flex TaskRouter workspace SID (WSxxxxxxxx...)
//
// under the service's Environment Variables.
//
// Endpoint:  GET  /find-available-worker?email=agent@example.com
// Response:  always HTTP 200; check the `error` field for problems.
//
//   {
//     "workerSid": "WKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | null,
//     "activity":  "Available" | null,
//     "isAvailable": true | false,
//     "error": null | "message"
//   }
//
// Notes:
// - Rename to `find-available-worker.protected.js` if you want Twilio to
//   auto-validate the X-Twilio-Signature header on every request (recommended
//   if this endpoint is called from other Twilio products like Studio).
// - The lookup below assumes the agent's email is stored as `attributes.email`
//   on the Worker resource — the standard Flex convention. If your deployment
//   uses a different attribute key (e.g. `contact_uri`, `email_address`),
//   update the left-hand side of the TargetWorkersExpression accordingly.

exports.handler = async function (context, event, callback) {
  const result = {
    workerSid: null,
    activity: null,
    isAvailable: false,
    error: null,
  };

  try {
    const email = (event.email || '').trim();
    if (!email) {
      result.error = 'Missing required query parameter: email';
      return callback(null, result);
    }

    // Sanity-check the email before splicing it into the workers-filter
    // expression below. TargetWorkersExpression is a filter string with no
    // parameter binding, so we refuse anything that could break out of the
    // quoted-string context rather than trying to escape.
    if (!/^[^\s@"'\\]+@[^\s@"'\\]+\.[^\s@"'\\]+$/.test(email)) {
      result.error = 'Invalid email format';
      return callback(null, result);
    }

    const workspaceSid = context.TASKROUTER_WORKSPACE_SID;
    if (!workspaceSid) {
      result.error = 'TASKROUTER_WORKSPACE_SID is not configured';
      return callback(null, result);
    }

    const client = context.getTwilioClient();

    // TargetWorkersExpression uses the same expression language TaskRouter
    // workflows use for routing rules — `attr == "value"` matches Worker
    // attribute keys. limit: 2 lets us detect "more than one match" without
    // pulling the entire workspace.
    const workers = await client.taskrouter.v1
      .workspaces(workspaceSid)
      .workers.list({
        targetWorkersExpression: `email == "${email}"`,
        limit: 2,
      });

    if (workers.length === 0) {
      result.error = `No worker found with email "${email}"`;
      return callback(null, result);
    }
    if (workers.length > 1) {
      result.error = `Multiple workers matched email "${email}" (found ${workers.length}) — refusing to guess`;
      return callback(null, result);
    }

    const worker = workers[0];
    result.workerSid = worker.sid;
    result.activity = worker.activityName;
    // Worker.available is derived by TaskRouter from the current activity's
    // `available` boolean — so `true` here means the agent is in an activity
    // that can accept tasks (typically the "Available" activity), regardless
    // of what that activity is named in your workspace.
    result.isAvailable = worker.available === true;

    return callback(null, result);
  } catch (err) {
    result.error = err && err.message ? err.message : String(err);
    return callback(null, result);
  }
};
