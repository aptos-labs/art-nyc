import { useCallback } from "react";
import { useGlobalState } from "../../context/GlobalState";
import {
  SignAndSubmitTransactionData,
  SignAndSubmitTransactionResponse,
} from "@aptos-internal/gas-station-api-client/build/generated/types.gen";
import { RequestResult } from "@aptos-internal/gas-station-api-client/build/generated/client";

export function useGasStation() {
  const [globalState] = useGlobalState();
  const { gasStationClient } = globalState;

  const gasStationSignAndSubmit = useCallback(
    async (
      options: SignAndSubmitTransactionData,
    ): Promise<RequestResult<SignAndSubmitTransactionResponse>> => {
      return gasStationClient.signAndSubmitTransaction(options);
    },
    [gasStationClient],
  );

  return { gasStationSignAndSubmit };
}
