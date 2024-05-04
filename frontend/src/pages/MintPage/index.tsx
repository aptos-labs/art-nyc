import { useGetPieceData } from "@/api/hooks/useGetPieceData";
import { useParams } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useGetTokens } from "@/api/hooks/useGetTokens";
import { useGetPieceIds } from "@/api/hooks/useGetPieceIds";
import { Root } from "./Root";

export const MintPage = () => {
  const { pieceId } = useParams();

  // TODO: Figure out when isLoading is which value.
  const {
    connected: walletConnected,
    isLoading: walletIsLoading,
    account,
  } = useWallet();

  // Look up the data for this piece (name, description, etc).
  const {
    pieceData,
    isLoading: pieceDataIsLoading,
    error: pieceDataError,
  } = useGetPieceData(pieceId!, {
    enabled: pieceId !== undefined,
  });

  // Lookup what tokens the user owns right now in this collection.
  const {
    data: tokensData,
    isLoading: tokensIsLoading,
    error: tokensError,
  } = useGetTokens(account?.address!, {
    enabled: account !== null && account.address !== undefined,
  });

  console.log("tokensData", tokensData);
  const tokenAddresses = tokensData?.map((t) => t.token_data_id);
  console.log("tokenAddressesouter", tokenAddresses);
  // Lookup the piece IDs of those tokens.
  const {
    pieceIds,
    error: pieceIdsError,
    isLoading: pieceIdsIsLoading,
  } = useGetPieceIds(tokenAddresses!, {
    enabled: tokenAddresses !== undefined,
  });

  if (!pieceId) {
    return <p>No piece ID in path</p>;
  }

  if (pieceDataError || tokensError || pieceIdsError) {
    return (
      <>
        <p>{`Piece Data Error: ${JSON.stringify(pieceDataError)}`}</p>
        <p>{`Tokens Error: ${JSON.stringify(tokensError)}`}</p>
        <p>{`Piece IDs Error: ${JSON.stringify(pieceIdsError)}`}</p>
      </>
    );
  }

  if (pieceDataIsLoading || tokensIsLoading || pieceIdsError) {
    return <p>Loading...</p>;
  }

  if (!pieceData) {
    return <p>No data found for this piece ID</p>;
  }

  const userOwnsThisPieceAlready = pieceIds.includes(pieceId);

  // At this point all the data we need is available.
  return (
    <Root
      pieceId={pieceId}
      pieceData={pieceData}
      userOwnsThisPieceAlready={userOwnsThisPieceAlready}
    />
  );
};
