import { useCallback } from "react";
import { AccountAuthenticator, AnyRawTransaction } from "@aptos-labs/ts-sdk";
import { useGlobalState } from "../../context/GlobalState";

export function useGasStation() {
  const [globalState] = useGlobalState();
  const { gasStationClient } = globalState;

  const gasStationSignAndSubmit = useCallback(
    async (
      transaction: AnyRawTransaction,
      senderAuth: AccountAuthenticator,
      additionalSignersAuth?: AccountAuthenticator[],
    ) => {
      return gasStationClient.signAndSubmit(
        transaction,
        senderAuth,
        additionalSignersAuth,
      );
    },
    [gasStationClient],
  );

  return { gasStationSignAndSubmit };
}
