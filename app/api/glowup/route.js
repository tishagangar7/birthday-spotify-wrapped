import { listGlowUpPhotos } from "../../../lib/listGlowUpPhotos";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ photos: listGlowUpPhotos() });
}
