import { openWalletSelector } from "@/components/WalletSelector";
import { PieceData } from "@/types/surf";
import { Button } from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { css } from "styled-system/css";
import { MintButton } from "./MintButton";
import { TokenInfo } from "./TokenInfo";
import { ViewButton } from "./ViewButton";
import { stack } from "styled-system/patterns";

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
  const { connected: walletConnected } = useWallet();

  // get the user's current tokens and if they have one of these, make it a "view" button instead.
  // TODO: in the hamburger, add a button to toggle sponsored txn vs direct submission mode
  let button;
  if (!walletConnected) {
    button = (
      <Button size="lg" onClick={openWalletSelector}>
        Connect Wallet
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
        padding: { base: "16", md: "32" },
      })}
    >
      <TokenInfo pieceData={pieceData} />
      {button}
    </div>
  );
};
