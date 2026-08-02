import { NextResponse } from "next/server";
import { getSubmittedMemories, addSubmittedMemory, getContributorNames } from "@/lib/submittedMemories";

// Requires `fs` access to read/write data/submitted-memories.json — not supported on the Edge runtime.
export const runtime = "nodejs";
// Always reflect the latest on-disk submissions; never let this be statically cached.
export const dynamic = "force-dynamic";

/**
 * GET /api/memories
 *
 * Lists all friend-submitted memories/messages (see `POST` below for how
 * they're created), most-recently-submitted first, so a friend page's
 * album/playlist-style feed can render them directly.
 *
 * Response 200:
 *   {
 *     "memories": [
 *       { "id": string, "friendName": string, "message": string, "submittedAt": string } // submittedAt is ISO 8601
 *     ],
 *     "count": number,
 *     "contributors": string[] // unique friendName values, alphabetically sorted — for a "Closing Credits" page
 *   }
 *
 * `contributors` is a thin, read-only derivation of `memories` (no new
 * storage) — see `getContributorNames()` in `lib/submittedMemories.js`.
 * Adding this field is additive/non-breaking: `memories` and `count` are
 * unchanged from before.
 *
 * Note on persistence: memories are read from `data/submitted-memories.json`
 * on disk — see `lib/submittedMemories.js` for the storage approach and its
 * ephemeral-filesystem caveats on serverless deployments.
 */
export async function GET() {
  const memories = await getSubmittedMemories();
  const mostRecentFirst = [...memories].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return NextResponse.json({
    memories: mostRecentFirst,
    count: mostRecentFirst.length,
    contributors: getContributorNames(memories),
  });
}

/**
 * POST /api/memories
 *
 * Accepts a friend's submitted memory/message (from a friend page's
 * submission form) and persists it to `data/submitted-memories.json`.
 *
 * Request body (Content-Type: application/json):
 *   { "friendName": string, "message": string }
 *   Both fields are required and must be non-empty after trimming whitespace.
 *   friendName max length: 80 characters. message max length: 2000 characters.
 *
 * Responses:
 *   201 Created — submission accepted and persisted:
 *     { "memory": { "id": string, "friendName": string, "message": string, "submittedAt": string } }
 *
 *   400 Bad Request — body wasn't valid JSON:
 *     { "error": "invalid_json", "message": string }
 *
 *   400 Bad Request — missing/empty/too-long fields:
 *     { "error": "validation_error", "message": string, "fieldErrors": { "friendName"?: string, "message"?: string } }
 *
 *   500 Internal Server Error — could not persist the submission (e.g. a
 *   read-only filesystem on some deployments — see `lib/submittedMemories.js`):
 *     { "error": "storage_error", "message": string }
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  let result;
  try {
    result = await addSubmittedMemory(body ?? {});
  } catch (error) {
    console.error("Failed to persist submitted memory:", error);
    return NextResponse.json(
      {
        error: "storage_error",
        message:
          "Could not save this memory. If this app is deployed to a serverless or read-only filesystem, see the persistence notes in BACKEND_SETUP.md / lib/submittedMemories.js.",
      },
      { status: 500 }
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      {
        error: "validation_error",
        message: "friendName and message are both required.",
        fieldErrors: result.fieldErrors,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ memory: result.memory }, { status: 201 });
}
