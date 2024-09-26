import { WalletName } from "@aptos-labs/wallet-adapter-react";

export const connectPetra =
  (connect: (walletName: WalletName) => void) => () => {
    connect("Petra" as WalletName);
  };
