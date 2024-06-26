import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { GlobalStateProvider, useGlobalState } from "./context/GlobalState";
import MyRoutes from "./MyRoutes";
import {
  AptosWalletAdapterProvider,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import {
  IdentityConnectWallet,
  IdentityConnectWalletConfig,
} from "@identity-connect/wallet-adapter-plugin";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { ModalContainer, Toaster } from "@aptos-internal/design-system-web";

// It is okay for this to be publicly accessible.
const identityConnectDappId = "ca7fe716-4187-4d84-8fc4-641aaf98ccd7";

const queryClient = new QueryClient();

export const App = () => (
  <BrowserRouter>
    <GlobalStateProvider>
      <AppInner />
    </GlobalStateProvider>
  </BrowserRouter>
);

export const AppInner = () => {
  const [state] = useGlobalState();

  let wallets: Wallet[] = [];

  // First try to add IdentityConnectWallet. This only works if we're on a production
  // network, it doesn't work for local development.
  if (state.network) {
    const identityConnectWalletConfig: IdentityConnectWalletConfig = {
      networkName: state.network,
    };
    wallets.push(
      new IdentityConnectWallet(
        identityConnectDappId,
        identityConnectWalletConfig,
      ),
    );
  }

  // Add the rest of the wallets. This order is intentional.
  wallets = wallets.concat([
    new PetraWallet(),
    new PontemWallet(),
    new MartianWallet(),
    new FewchaWallet(),
  ]);

  return (
    // This key is necessary to make the wallets used by the WalletSelector refresh
    // when the selected network changes.
    <div key={state.network}>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <QueryClientProvider client={queryClient}>
          <MyRoutes />
          <ModalContainer />
          <Toaster />
        </QueryClientProvider>
      </AptosWalletAdapterProvider>
    </div>
  );
};
