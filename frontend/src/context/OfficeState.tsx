import { InputEntryFunctionData, Network } from "@aptos-labs/ts-sdk";
import React, { createContext, useMemo } from "react";
import { defaultNetwork } from "../constants";
import { useGlobalState } from "./GlobalState";

export enum Office {
  NYC = "nyc",
  BAYAREA = "bayarea",
}

/**
 * State to be used in the context of an office, aka under an /<office> path.
 *
 * You can only use this from within a GlobalStateProvider.
 */
export interface OfficeState {
  readonly office: Office;
  /** Derived from network and office */
  readonly moduleAddress: string;
  readonly collectionAddress: string;
  readonly collectionModuleName: string;
  readonly tokenModuleName: string;
}

function deriveOfficeState({
  network,
  office,
}: {
  network: Network;
  office: Office;
}): OfficeState {
  let moduleAddress: string;
  let collectionAddress: string;

  if (network === "local") {
    if (office === Office.NYC) {
      moduleAddress =
        "0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30";
      collectionAddress =
        "0xd976c82c8e5ac55e585d16899dc9390225231538fc0c5ab31e3612271fe8f446";
    } else if (office === Office.BAYAREA) {
      moduleAddress =
        "0x9e1f28eafc90fbf6353b9a84b6f87914eee13f62af3d15cb449d0f6e72d569ed";
      collectionAddress =
        "0xb22dff55afea76b6755cce833b3c62cc58c3d7f2e93b62dad46efe5afd912e98";
    } else {
      throw new Error(`Unknown office: ${office}`);
    }
  } else if (network === "mainnet") {
    if (office === Office.NYC) {
      moduleAddress =
        "0x4c8732fad66998c2389abd3cb5ec9dc5b56245276477023a9fb43170969c7be6";
      collectionAddress =
        "0x9d672ee84bd09ce5eba14755ae3a1bb8b2a5e971bd1ea2922e8df5f61e33440e";
    } else if (office === Office.BAYAREA) {
      moduleAddress =
        "0xd217bc9ed519bfc367c12b6b83cef1801fe43c5c43a950eb9ee3f48d427a990d";
      collectionAddress =
        "0xb8dc71216352e4cf051a5b4af2f519a87dedfc542d8c2a56cd950ed726506b28";
    } else {
      throw new Error(`Unknown office: ${office}`);
    }
  } else {
    throw new Error(`Unknown network: ${network}`);
  }

  return {
    office,
    moduleAddress,
    collectionAddress,
    collectionModuleName: `${office}_collection`,
    tokenModuleName: `${office}_token`,
  };
}

const initialOfficeState = deriveOfficeState({
  network: defaultNetwork,
  office: Office.NYC,
});

export const OfficeStateContext = createContext(initialOfficeState);

export const OfficeStateProvider = ({
  children,
  office,
}: {
  children: React.ReactNode;
  office: Office;
}) => {
  const [globalState] = useGlobalState();

  const officeState: OfficeState = useMemo(
    () =>
      deriveOfficeState({
        network: globalState.network,
        office,
      }),
    [globalState.network, office],
  );

  return (
    <OfficeStateContext.Provider value={officeState}>
      {children}
    </OfficeStateContext.Provider>
  );
};

export const useOfficeState = () => React.useContext(OfficeStateContext);

/**
 * Use this for calling a function or constructing a resource type for something on
 * the module or on the collection.
 */
export function getIdentifier(
  officeState: OfficeState,
  module: "collection" | "token",
  identifier: string,
): InputEntryFunctionData["function"] {
  const moduleName =
    module === "collection"
      ? officeState.collectionModuleName
      : officeState.tokenModuleName;
  return `${officeState.moduleAddress}::${moduleName}::${identifier}`;
}
