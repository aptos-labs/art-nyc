import { createGasStationApiClient } from "@aptos-internal/gas-station-api-client";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import React, { createContext, useMemo } from "react";
import {
  defaultNetwork,
  fullnodeConfig,
  gasStationConfig,
  indexerConfig,
} from "../constants";
import { useNetworkSelector } from "./networkSelection";

export interface GlobalState {
  /** Derived from external state ?network=<network> query parameter - e.g. testnet */
  readonly network: Network;
  /** Derived from network */
  readonly client: Aptos;
  /** Determined by the user using the toggle in the menu */
  readonly useFeePayer: boolean;
  readonly gasStationClient: ReturnType<typeof createGasStationApiClient>;
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
  } else if (network === "testnet") {
    // This is created by John.
    apiKey = "aptoslabs_F1fFrSzj8xQ_4Tin4WihqULB2fsdbMpSX8bpjZBKqDjfi";
  } else {
    throw new Error("Invalid network");
  }

  const clientConfig = apiKey ? { API_KEY: apiKey } : undefined;
  const config = new AptosConfig({
    network,
    fullnode: fullnodeConfig[network],
    indexer: indexerConfig[network],
    clientConfig,
  });
  const client = new Aptos(config);

  const gasStationClient = createGasStationApiClient({
    baseUrl: gasStationConfig[network]!,
    interceptors: {
      request: (request) => {
        request.headers.set("Authorization", `Bearer ${apiKey}`);
        return request;
      },
    },
  });

  return {
    network,
    client,
    useFeePayer,
    gasStationClient,
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

export function useGetNetworkQueryParam() {
  const [globalState] = useGlobalState();
  // Only include the query param if the network is not the default network.
  return globalState.network === defaultNetwork
    ? ""
    : `?network=${globalState.network}`;
}
