import { simpleMapArrayToMap } from "@/utils";
import { useGlobalState } from "../../context/GlobalState";
import { useGetAccountResource } from "./useGetAccountResource";
import { ArtData } from "@/types/surf";

export function useGetArtData(
  options: { enabled?: boolean; refetchInterval?: number } = {},
) {
  const [globalState] = useGlobalState();
  let resourceType = `${globalState.moduleAddress}::nyc_collection::ArtData`;
  const result = useGetAccountResource(
    globalState.collectionAddress,
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
    ? simpleMapArrayToMap(artData.data as any)
    : undefined;
  return { artDataInner, ...result };
}
