import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  GasStationClient,
  GasStationTransactionSubmitter,
} from "@aptos-labs/gas-station-client";
import React, { createContext, useMemo } from "react";
import {
  defaultNetwork,
  FRONTEND_API_KEYS,
  GAS_STATION_API_KEYS,
} from "../constants";
import { useNetworkSelector } from "./networkSelection";

export interface GlobalState {
  /** Derived from external state ?network=<network> query parameter - e.g. devnet */
  readonly network: Network;
  /** Derived from network */
  readonly client: Aptos;
  /** Determined by the user using the toggle in the menu */
  readonly useGasStation: boolean;
}

function deriveGlobalState({
  network,
  useGasStation,
}: {
  network: Network;
  useGasStation: boolean;
}): GlobalState {
  const clientConfig = FRONTEND_API_KEYS[network]
    ? { API_KEY: FRONTEND_API_KEYS[network] }
    : undefined;

  // Configure gas station if enabled and API key is available.
  let config: AptosConfig;
  if (useGasStation && GAS_STATION_API_KEYS[network]) {
    const gasStationClient = new GasStationClient({
      network,
      apiKey: GAS_STATION_API_KEYS[network],
    });

    const transactionSubmitter = new GasStationTransactionSubmitter(
      gasStationClient,
    );

    config = new AptosConfig({
      network,
      clientConfig,
      pluginSettings: {
        TRANSACTION_SUBMITTER: transactionSubmitter,
      },
    });
  } else {
    config = new AptosConfig({ network, clientConfig });
  }

  const client = new Aptos(config);

  return {
    network,
    client,
    useGasStation,
  };
}

const initialGlobalState = deriveGlobalState({
  network: defaultNetwork,
  useGasStation: true,
});

type GlobalActions = {
  selectNetwork: ReturnType<typeof useNetworkSelector>[1];
  setUseGasStation: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalStateContext = createContext(initialGlobalState);
export const GlobalActionsContext = createContext({} as GlobalActions);

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedNetwork, selectNetwork] = useNetworkSelector();
  const [useGasStation, setUseGasStation] = React.useState(true);

  const globalState: GlobalState = useMemo(
    () =>
      deriveGlobalState({
        network: selectedNetwork,
        useGasStation,
      }),
    [selectedNetwork, useGasStation],
  );

  const globalActions = useMemo(
    () => ({
      selectNetwork,
      setUseGasStation,
    }),
    [selectNetwork, setUseGasStation],
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
