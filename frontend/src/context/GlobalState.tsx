import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import React, { createContext, useMemo } from "react";
import { defaultNetwork } from "../constants";
import { useNetworkSelector } from "./networkSelection";
import { Client } from "@aptos-labs/aptos-fee-payer-client";

export type GlobalState = {
  /** derived from external state ?network=<network> query parameter - e.g. devnet */
  readonly network: Network;
  /** derived from network_value */
  readonly client: Aptos;
  /** derived from network_value */
  readonly moduleAddress: string;
  /** derived from network_value */
  readonly collectionAddress: string;
  /** derived from network_value */
  readonly feePayerClient?: Client;
  /** determined by the user using the toggle in the menu */
  useFeePayer: boolean;
};

function deriveGlobalState({
  network,
  useFeePayer,
}: {
  network: Network;
  useFeePayer: boolean;
}): GlobalState {
  const config = new AptosConfig({ network });
  const client = new Aptos(config);
  let moduleAddress;
  let collectionAddress;
  let feePayerClient;
  switch (network) {
    case "local":
      moduleAddress =
        "0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30";
      collectionAddress =
        "0xd976c82c8e5ac55e585d16899dc9390225231538fc0c5ab31e3612271fe8f446";
      break;
    case "devnet":
      moduleAddress = "";
      collectionAddress = "";
      break;
    case "testnet":
      moduleAddress = "";
      collectionAddress = "";
      break;
    case "mainnet":
      moduleAddress =
        "0x4c8732fad66998c2389abd3cb5ec9dc5b56245276477023a9fb43170969c7be6";
      collectionAddress =
        "0x9d672ee84bd09ce5eba14755ae3a1bb8b2a5e971bd1ea2922e8df5f61e33440e";
      feePayerClient = new Client({
        url: "https://art-nyc.mainnet-prod.gcp.aptosdev.com",
      });
      break;
    default:
      throw new Error(`Unknown network: ${network}`);
  }
  return {
    network,
    client,
    moduleAddress,
    collectionAddress,
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
