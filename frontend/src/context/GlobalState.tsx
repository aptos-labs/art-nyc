import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import React, { createContext, useMemo } from "react";
import { defaultNetwork } from "../constants";
import { useNetworkSelector } from "./networkSelection";
import { Client } from "@aptos-labs/aptos-fee-payer-client";

export interface GlobalState {
  /** Derived from external state ?network=<network> query parameter - e.g. devnet */
  readonly network: Network;
  /** Derived from network */
  readonly client: Aptos;
  /** Derived from network */
  readonly feePayerClient?: Client;
  /** Determined by the user using the toggle in the menu */
  readonly useFeePayer: boolean;
}

function deriveGlobalState({
  network,
  useFeePayer,
}: {
  network: Network;
  useFeePayer: boolean;
}): GlobalState {
  let apiKey: string | undefined;
  if (network === "mainnet") {
    // This is a frontend API key made by dport.
    apiKey = "AG-82QP58357YNHHMZMTG8D2MQT99962GQGT";
  }

  const clientConfig = apiKey ? { API_KEY: apiKey } : undefined;
  const config = new AptosConfig({ network, clientConfig });
  const client = new Aptos(config);
  let feePayerClient;
  if (network === "mainnet") {
    feePayerClient = new Client({
      url: "https://art-nyc.mainnet-prod.gcp.aptosdev.com",
    });
  }
  return {
    network,
    client,
    feePayerClient,
    useFeePayer,
  };
}

const initialGlobalState = deriveGlobalState({
  network: defaultNetwork,
  useFeePayer: true,
});

type GlobalActions = {
  selectNetwork: ReturnType<typeof useNetworkSelector>[1];
  setUseFeePayer: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalStateContext = createContext(initialGlobalState);
export const GlobalActionsContext = createContext({} as GlobalActions);

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedNetwork, selectNetwork] = useNetworkSelector();
  const [useFeePayer, setUseFeePayer] = React.useState(true);

  const globalState: GlobalState = useMemo(
    () =>
      deriveGlobalState({
        network: selectedNetwork,
        useFeePayer,
      }),
    [selectedNetwork, useFeePayer],
  );

  const globalActions = useMemo(
    () => ({
      selectNetwork,
      setUseFeePayer,
    }),
    [selectNetwork, setUseFeePayer],
  );

  return (
    <GlobalStateContext.Provider value={globalState}>
      <GlobalActionsContext.Provider value={globalActions}>
        {children}
      </GlobalActionsContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () =>
  [
    React.useContext(GlobalStateContext),
    React.useContext(GlobalActionsContext),
  ] as const;

export function getNetworkQueryParam(globalState: GlobalState) {
  return globalState.network === "mainnet"
    ? ""
    : `?network=${globalState.network}`;
}
