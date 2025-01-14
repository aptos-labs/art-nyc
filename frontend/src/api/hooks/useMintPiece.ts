import { useGlobalState } from "@/context/GlobalState";
import { getIdentifier, useOfficeState } from "@/context/OfficeState";
import {
  FeePayerArgs,
  onClickSubmitTransaction,
  standardizeAddress,
} from "@/utils";
import {
  InputEntryFunctionData,
  TransactionResponseType,
  WriteSetChangeWriteResource,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGasStation } from "./useGasStation";

export function useMintPiece() {
  const { account, signAndSubmitTransaction, signTransaction } = useWallet();
  const [globalState] = useGlobalState();
  const { gasStationSignAndSubmit } = useGasStation();
  const officeState = useOfficeState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pieceId: string) => {
      const payload: InputEntryFunctionData = {
        function: getIdentifier(officeState, "token", "mint"),
        typeArguments: [],
        functionArguments: [pieceId],
      };
      let feePayerArgs: FeePayerArgs | undefined;
      if (globalState.gasStationClient) {
        feePayerArgs = {
          useFeePayer: globalState.useFeePayer,
          signTransaction,
        };
      }
      const waitResponse = await onClickSubmitTransaction({
        payload,
        signAndSubmitTransaction,
        gasStationSignAndSubmit,
        feePayerArgs,
        account,
        aptos: globalState.client,
        successToast: {
          title: "Success!",
          // TODO: Can we make this a link to the explorer?
          description: `Successfully minted token`,
          variant: "success",
          duration: 4000,
        },
        errorToast: {
          title: "Error minting token",
          variant: "error",
          duration: 5000,
        },
      });

      if (waitResponse === null) {
        return;
      }

      // Needed to make the type checker happy.
      if (waitResponse.type !== TransactionResponseType.User) {
        throw new Error("Transaction was unexpectedly the wrong type");
      }

      // TODO: A function to get the objects created in a txn would be nice. I don't
      // believe such a function exists still, so I use the event that is emitted for
      // now.
      let tokenAddress = null;
      for (const change of waitResponse.changes) {
        // TODO: Do this type check properly.
        if (change.type !== "write_resource") {
          continue;
        }
        let c: WriteSetChangeWriteResource = change as any;
        if (c.data.type === "0x4::token::Token") {
          tokenAddress = c.address;
        }
      }

      if (tokenAddress === null) {
        throw new Error("Couldn't find token address from mint function");
      }

      tokenAddress = standardizeAddress(tokenAddress);

      return tokenAddress;
    },
    onSuccess: async (tokenAddress) => {
      if (!account?.address || !tokenAddress) return;

      const queryKey = ["tokenAddresses", account.address, globalState.network];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<string[]>(queryKey, (prev) => {
        if (!prev) return [tokenAddress];
        return [...prev, tokenAddress];
      });
    },
  });
}
