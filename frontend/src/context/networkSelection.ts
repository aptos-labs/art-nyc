// Since we don't let the user select the network we don't bother with storing a
// selection in local storage, we just use the query params. We assume the lack of
// a query param implies mainnet, and throughout the application only include the
// query param if the network is not mainnet.

import { Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";

import { defaultNetwork } from "../constants";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Returns a Network if the given string is a valid network name, otherwise returns
// undefined.
export function getNetwork(value: string): Network {
  // https://aptos-org.slack.com/archives/C05NLAKJM9U/p1699122142193429
  // This should be NetworkNameToNetwork
  return NetworkToNetworkName[value];
}

export function isValidNetworkString(value: string): boolean {
  return getNetwork(value) !== undefined;
}

export function useNetworkSelector() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedNetworkQueryParam = searchParams.get("network") ?? "";

  function selectNetwork(
    network: string,
    { replace = false }: { replace?: boolean } = {},
  ) {
    setSearchParams(
      (prev) => {
        if (network !== "mainnet") {
          prev.set("network", network);
        }
        return prev;
      },
      { replace },
    );
  }

  useEffect(
    () => {
      const currentNetworkSearchParam = searchParams.get("network");
      if (!isValidNetworkString(currentNetworkSearchParam ?? "")) {
        selectNetwork(defaultNetwork, {
          replace: true,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // empty [] makes this effect only run once (on mount)
  );

  const selectedNetwork = getNetwork(selectedNetworkQueryParam);
  if (selectedNetwork !== undefined) {
    return [selectedNetwork, selectNetwork] as const;
  } else {
    return [defaultNetwork, selectNetwork] as const;
  }
}
