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

  if (!pieceId) {
    return <p>No piece ID in path</p>;
  }

  // Look up the data for this piece (name, description, etc).
  const {
    pieceData,
    isLoading: pieceDataIsLoading,
    error: pieceDataError,
  } = useGetPieceData(pieceId, {
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

  // Lookup the piece IDs of those tokens.
  const {
    data: pieceIdsData,
    isLoading: pieceIdsIsLoading,
    error: pieceIdsError,
  } = useGetPieceIds(
    tokensData?.filter((t) => t.amount > 0).map((t) => t.token_data_id)!,
    {
      enabled: tokensData !== undefined,
    },
  );
  // TODO fix this up obviously.
  const ownedPieceIds = ["pieceid1"];

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
  if (tokensData === undefined) {
    return <p>Somehow no token data even after it loaded successfully.</p>;
  }
  if (pieceIdsData === undefined) {
    return (
      <p>Somehow no owned piece IDs data even after it loaded successfully.</p>
    );
  }

  const userOwnsThisPieceAlready = ownedPieceIds.includes(pieceId);

  // At this point all the data we need is available.
  return (
    <Root
      pieceId={pieceId}
      pieceData={pieceData}
      userOwnsThisPieceAlready={userOwnsThisPieceAlready}
    />
  );
};
