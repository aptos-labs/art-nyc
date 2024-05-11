import { PieceData } from "@/types/surf";
import {
  FeePayerArgs,
  onClickSubmitTransaction,
  standardizeAddress,
} from "@/utils";
import { Button } from "@aptos-internal/design-system-web";
import {
  InputEntryFunctionData,
  TransactionResponseType,
  WriteSetChangeWriteResource,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { useGlobalState } from "../../context/GlobalState";

/** Only show this component if the user doesn't already own the piece and their wallet is connected. */
export const MintButton = ({
  pieceId,
  pieceData,
}: {
  pieceId: string;
  pieceData: PieceData;
}) => {
  const { account, signAndSubmitTransaction, signTransaction } = useWallet();
  const [globalState] = useGlobalState();
  const [tokenAddress, setTokenAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onClick = async () => {
    const payload: InputEntryFunctionData = {
      function: `${globalState.moduleAddress}::nyc_token::mint`,
      typeArguments: [],
      functionArguments: [pieceId],
    };
    let feePayerArgs: FeePayerArgs | undefined;
    if (globalState.feePayerClient) {
      feePayerArgs = {
        useFeePayer: globalState.useFeePayer,
        feePayerClient: globalState.feePayerClient,
        signTransaction,
      };
    }
    const waitResponse = await onClickSubmitTransaction({
      payload,
      signAndSubmitTransaction,
      feePayerArgs,
      setSubmitting,
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

    setTokenAddress(tokenAddress);
  };

  return (
    <>
      <Button variant="secondary" onClick={onClick} loading={submitting}>
        Mint
      </Button>
    </>
  );
};
