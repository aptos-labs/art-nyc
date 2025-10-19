import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./MyRoutes";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { ModalContainer, Toaster } from "@aptos-internal/design-system-web";
import { GlobalStateProvider, useGlobalState } from "./context/GlobalState";

const queryClient = new QueryClient();

const AppContent = () => {
  const [globalState] = useGlobalState();

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: globalState.network,
        transactionSubmitter:
          globalState.client.config.getTransactionSubmitter(),
      }}
      optInWallets={["Petra"]}
    >
      <MyRoutes />
      <ModalContainer />
      <Toaster />
    </AptosWalletAdapterProvider>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GlobalStateProvider>
          <AppContent />
        </GlobalStateProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
