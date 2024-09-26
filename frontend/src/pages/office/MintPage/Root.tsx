import { connectPetra } from "@/components/WalletSelector";
import { PieceData } from "@/types/surf";
import { Button } from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { stack } from "styled-system/patterns";
import { MintButton } from "./MintButton";
import { TokenInfo } from "./TokenInfo";
import { ViewButton } from "./ViewButton";
import { css } from "styled-system/css";

/**
 * In the index we handle all the data fetching and showing different stuff if the data
 * is missing or there is an error or something. This component doesn't have to worry
 * about any of that, it has all the data it needs.
 */
export const Root = ({
  pieceId,
  pieceData,
  userOwnsThisPieceAlready,
}: {
  pieceId: string;
  pieceData: PieceData;
  userOwnsThisPieceAlready: boolean;
}) => {
  const { connected: walletConnected, connect } = useWallet();

  // get the user's current tokens and if they have one of these, make it a "view" button instead.
  // TODO: in the hamburger, add a button to toggle sponsored txn vs direct submission mode
  let button;
  if (!walletConnected) {
    button = (
      <Button
        size="lg"
        className={css({ w: "full" })}
        onClick={connectPetra(connect)}
      >
        Connect Petra Wallet
      </Button>
    );
  } else if (userOwnsThisPieceAlready) {
    button = <ViewButton pieceData={pieceData} />;
  } else {
    button = <MintButton pieceId={pieceId} />;
  }

  // TODO: Make sure any newlines and the like in the description are respected.
  return (
    <div
      className={stack({
        align: "center",
        gap: "32",
        p: "16",
        pb: { base: "96", sm: "16" },
        w: "full",
        maxW: "[500px]",
        animation: "fadeIn 0.6s ease",
      })}
    >
      <TokenInfo pieceData={pieceData} />
      <div
        className={css({
          position: "fixed",
          bottom: "24",
          left: "16",
          right: "16",
          sm: { position: "static", w: "full" },
        })}
      >
        {button}
      </div>
    </div>
  );
};
