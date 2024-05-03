import { useQuery } from "@tanstack/react-query";
import { useGlobalState } from "../../context/GlobalState";

export function useGetTokens(
  accountAddress: string,
  options: { enabled?: boolean; refetchInterval?: number } = {},
) {
  const [globalState] = useGlobalState();
  return useQuery({
    queryKey: ["tokens", accountAddress, globalState.network],
    queryFn: async () => {
      // We don't bother with pagination because there are few enough pieces of art
      // that it's impossible for someone to have more tokens than fit in a single page.
      //
      // TODO: It seems like there is no way to restrict the response, e.g. to only get
      // the token addresses and maybe names, but double check.
      return await globalState.client.account.getAccountOwnedTokensFromCollectionAddress(
        {
          accountAddress,
          collectionAddress: globalState.collectionAddress,
          options: {
            tokenStandard: "v2",
          },
        },
      );
    },
    refetchInterval: options.refetchInterval,
    retry: false,
    enabled: options.enabled,
  });
}
