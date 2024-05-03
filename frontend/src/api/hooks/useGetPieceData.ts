import { PieceData } from "@/types/surf";
import { useGetArtData } from "./useGetArtData";

export function useGetPieceData(
  pieceId: string,
  options: { enabled?: boolean; refetchInterval?: number } = {},
) {
  const result = useGetArtData(options);
  let pieceData: PieceData | undefined = undefined;
  if (result.artDataInner) {
    pieceData = result.artDataInner.get(pieceId);
  }
  return { pieceData, ...result };
}
