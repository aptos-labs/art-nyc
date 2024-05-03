import { useGlobalState } from "../../context/GlobalState";
import { onChainSimpleMapToMap } from "../helpers";
import { useGetAccountResource } from "./useGetAccountResource";
import { ArtData, PieceData } from "@/types/surf";

export function useGetPieceData(
  pieceId: string,
  options: { enabled?: boolean; refetchInterval?: number } = {},
) {
  const [globalState] = useGlobalState();
  let resourceType = `${globalState.moduleAddress}::nyc_collection::ArtData`;
  const result = useGetAccountResource(
    globalState.collectionAddress,
    resourceType,
    options,
  );
  let pieceData: PieceData | undefined = undefined;
  if (result && result.data) {
    let inner = (result.data as any).data;
    if (inner && inner.data) {
      let artData: ArtData = inner as ArtData;
      let artDataData = onChainSimpleMapToMap(artData.data as any);
      pieceData = artDataData.get(pieceId);
    }
  }
  return { pieceData, ...result };
}
