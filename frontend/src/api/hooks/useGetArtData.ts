import { simpleMapArrayToMap } from "@/utils";
import { useGetAccountResource } from "./useGetAccountResource";
import { ArtData, PieceData } from "@/types/surf";
import { getIdentifier, useOfficeState } from "@/context/OfficeState";

export function useGetArtData(
  options: { enabled?: boolean; refetchInterval?: number } = {},
) {
  const officeState = useOfficeState();
  const resourceType = getIdentifier(officeState, "collection", "ArtData");
  const result = useGetAccountResource(
    officeState.collectionAddress,
    resourceType,
    options,
  );
  let artData: ArtData | undefined = undefined;
  if (result && result.data) {
    let inner = (result.data as any).data;
    if (inner && inner.data) {
      artData = inner as ArtData;
    }
  }
  const artDataInner = artData?.data
    ? (simpleMapArrayToMap(artData.data as any) as Map<string, PieceData>)
    : undefined;
  return { artDataInner, ...result };
}
