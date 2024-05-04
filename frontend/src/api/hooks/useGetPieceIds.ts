import { useGlobalState } from "../../context/GlobalState";
import { useQueries } from "@tanstack/react-query";
import { TokenRefs } from "@/types/surf";
import { MoveStructId } from "@aptos-labs/ts-sdk";

type Output = {
  pieceIds: (string | undefined)[];
  isLoading: boolean;
  error: any | undefined;
};

/**
 * Given a list of token addresses, get what piece ID they are for each.
 *
 * We collapse all the queries into a single isLoading and error state.
 */
export function useGetPieceIds(
  tokenAddresses: string[] | undefined,
  options: { enabled?: boolean; refetchInterval?: number } = {},
) {
  const [globalState] = useGlobalState();
  const resourceType = `${globalState.moduleAddress}::nyc_token::TokenRefs`;

  console.log(options);

  const result: Output = useQueries({
    queries: (tokenAddresses ?? []).map((address) => ({
      queryKey: ["getPieceId", address],
      queryFn: async () => {
        const rt = resourceType as MoveStructId;
        return await globalState.client.account.getAccountResource({
          accountAddress: address,
          resourceType: rt,
        });
      },
      ...options,
    })),
    combine: (results) => {
      // Combine all results into a single state object
      return results.reduce(
        (acc: Output, result, index) => {
          console.log("res", result);
          const refs = result.data as TokenRefs | undefined;
          const pieceId = refs ? refs.piece_id : undefined;

          acc.pieceIds.push(pieceId);

          // Set a single loading state if any query is still loading
          if (result.isLoading) acc.isLoading = true;

          // Combine errors into a single error state (show the first found error)
          if (result.error && !acc.error) acc.error = result.error;

          return acc;
        },
        { pieceIds: [], isLoading: false, error: null },
      );
    },
  });

  return result;
}
