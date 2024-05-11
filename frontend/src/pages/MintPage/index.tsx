import { useGetPieceData } from "@/api/hooks/useGetPieceData";
import { useParams } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useGetTokenAddresses } from "@/api/hooks/useGetTokenAddresses";
import { useGetPieceIds } from "@/api/hooks/useGetPieceIds";
import { Root } from "./Root";
import { Button, Card } from "@aptos-internal/design-system-web";
import { stack } from "styled-system/patterns";

export const MintPage = () => {
  const { pieceId } = useParams();

  const { isLoading: walletIsLoading, account } = useWallet();

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
    data: tokenAddresses,
    isLoading: tokensIsLoading,
    error: tokensError,
  } = useGetTokenAddresses(account?.address!, {
    enabled: account !== null && account.address !== undefined,
  });

  // Lookup the piece IDs of those tokens.
  const {
    pieceIds,
    error: pieceIdsError,
    isLoading: pieceIdsIsLoading,
  } = useGetPieceIds(tokenAddresses!, {
    enabled: tokenAddresses !== undefined,
  });

  const isLoading =
    walletIsLoading ||
    !tokenAddresses ||
    pieceDataIsLoading ||
    pieceIdsIsLoading;

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

  if (isLoading) {
    return (
      <div
        className={stack({
          align: "center",
          gap: "32",
          padding: { base: "16", md: "32" },
        })}
      >
        <Card>Loading...</Card>
        <Button size="lg" loading>
          Mint
        </Button>
      </div>
    );
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
