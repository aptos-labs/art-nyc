import { TokenInfo } from "./TokenInfo";
import { MintButton } from "./MintButton";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { PieceData } from "@/types/surf";

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
    button = <WalletSelector />;
  } else if (userOwnsThisPieceAlready) {
    // TODO: Some button to view the token, or just a greyed out "you already have this token" if we show the art on the main minting page.
    button = <p>You own this piece already!</p>;
  } else {
    button = <MintButton pieceId={pieceId} pieceData={pieceData} />;
  }

  // TODO: Make sure any newlines and the like in the description are respected.
  return (
    <>
      <TokenInfo pieceData={pieceData} />
      {button}
    </>
  );
};
