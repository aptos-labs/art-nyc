import { useGetPieceData } from "@/api/hooks/useGetPieceData";
import { useGetPieceIds } from "@/api/hooks/useGetPieceIds";
import { useGetTokenAddresses } from "@/api/hooks/useGetTokenAddresses";
import { Skeleton } from "@/components/Skeleton";
import { WalletReadyState, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "styled-system/css";
import { stack } from "styled-system/patterns";
import { Root } from "./Root";

export const MintPage = () => {
  const { pieceId } = useParams();
  const { account, connected, isLoading, connect, wallets } = useWallet();

  useEffect(() => {
    const supportsTouch = "ontouchstart" in document.documentElement;
    const petra = wallets?.find((wallet) => wallet.name === "Petra");

    // Auto-connect when running inside the Petra browser
    if (
      !isLoading &&
      !connected &&
      supportsTouch &&
      petra?.readyState === WalletReadyState.Installed
    ) {
      connect(petra.name);
    }
  }, [connect, connected, isLoading, wallets]);

  // Look up the data for this piece (name, description, etc).
  const {
    pieceData,
    isLoading: pieceDataIsLoading,
    error: pieceDataError,
  } = useGetPieceData(pieceId!, {
    enabled: pieceId !== undefined,
  });

  // Lookup what tokens the user owns right now in this collection.
  const { data: tokenAddresses, error: tokensError } = useGetTokenAddresses(
    account?.address!,
    {
      enabled: account !== null && account.address !== undefined,
    },
  );

  // Lookup the piece IDs of those tokens.
  const { pieceIds, error: pieceIdsError } = useGetPieceIds(tokenAddresses!, {
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

  if (!pieceDataIsLoading && !pieceData) {
    return <p>No data found for this piece ID</p>;
  }

  const userOwnsThisPieceAlready = pieceIds.includes(pieceId);

  // At this point all the data we need is available.
  return (
    <div
      className={stack({ w: "full", align: "center", position: "relative" })}
    >
      <div
        style={{ opacity: pieceDataIsLoading ? 1 : 0 }}
        className={stack({
          position: "absolute",
          align: "center",
          p: "16",
          w: "full",
          maxW: "[500px]",
          transition: "[opacity 0.6s ease]",
        })}
      >
        <Skeleton
          className={css({ w: "full", h: "[450px]", rounded: "200" })}
        />
      </div>
      {pieceData && (
        <Root
          pieceId={pieceId}
          pieceData={pieceData}
          userOwnsThisPieceAlready={userOwnsThisPieceAlready}
        />
      )}
    </div>
  );
};
