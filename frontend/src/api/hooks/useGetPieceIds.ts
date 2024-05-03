import { useGlobalState } from "../../context/GlobalState";
import { onChainSimpleMapToMap } from "../helpers";
import { useGetAccountResource } from "./useGetAccountResource";
import { ArtData, PieceData } from "@/types/surf";

/** Given a list of token addresses, get what piece ID they are for. */
export function useGetPieceIds(
  tokenAddresses: string[],
  options: { enabled?: boolean; refetchInterval?: number } = {},
) {
  const [globalState] = useGlobalState();
  let resourceType = `${globalState.moduleAddress}::nyc_collection::ArtData`;
  const result = useGetAccountResource(
    globalState.collectionAddress,
    resourceType,
    options,
  );
  /*
  // TODO: idk how to use useQuery for multiple queries.
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
  */
  return result;
}
