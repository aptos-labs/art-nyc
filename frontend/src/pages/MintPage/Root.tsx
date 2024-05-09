import { TokenInfo } from "./TokenInfo";
import { MintButton } from "./MintButton";
import { isMobile, useWallet } from "@aptos-labs/wallet-adapter-react";
import { openWalletSelector } from "@/components/WalletSelector";
import { PieceData } from "@/types/surf";
import { css } from "styled-system/css";
import { ViewButton } from "./ViewButton";
import { Button } from "@aptos-internal/design-system-web";

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
    button = <Button onClick={openWalletSelector}>Connect Wallet</Button>;
  } else if (userOwnsThisPieceAlready) {
    button = <ViewButton pieceData={pieceData} />;
  } else {
    button = <MintButton pieceId={pieceId} pieceData={pieceData} />;
  }

  let outerCss;
  if (isMobile()) {
    outerCss = css({ padding: "16" });
  } else {
    outerCss = css({ padding: "32", display: "grid", placeItems: "center" });
  }

  // TODO: Make sure any newlines and the like in the description are respected.
  return (
    <div className={outerCss}>
      <TokenInfo pieceData={pieceData} />
      <br />
      {button}
    </div>
  );
};
