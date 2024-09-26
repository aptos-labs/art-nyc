import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./MyRoutes";
import {
  AptosWalletAdapterProvider,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { ModalContainer, Toaster } from "@aptos-internal/design-system-web";
import { GlobalStateProvider } from "./context/GlobalState";

const queryClient = new QueryClient();

export const App = () => {
  const wallets: Wallet[] = [new PetraWallet()];

  return (
    <BrowserRouter>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <QueryClientProvider client={queryClient}>
          <GlobalStateProvider>
            <MyRoutes />
            <ModalContainer />
            <Toaster />
          </GlobalStateProvider>
        </QueryClientProvider>
      </AptosWalletAdapterProvider>
    </BrowserRouter>
  );
};
