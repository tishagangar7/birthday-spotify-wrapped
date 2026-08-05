import { listGlowUpPhotoSets } from "../../../lib/listGlowUpPhotos";

export const dynamic = "force-dynamic";

export async function GET() {
  const sets = listGlowUpPhotoSets();
  return Response.json({
    sets,
    photos: sets[0] ?? [],
  });
}
