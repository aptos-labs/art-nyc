import { PieceData } from "@/types/surf";
import { Button, toast, Toaster } from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";
import React, { useState } from "react";
import { useGlobalState } from "../../context/GlobalState";
import {
  InputEntryFunctionData,
  TransactionResponseType,
  WriteSetChangeWriteResource,
} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { standardizeAddress } from "@/utils";

/** Only show this component if the user doesn't already own the piece and their wallet is connected. */
export const MintButton = ({
  pieceId,
  pieceData,
}: {
  pieceId: string;
  pieceData: PieceData;
}) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [globalState] = useGlobalState();
  const [tokenAddress, setTokenAddress] = useState("");

  // TODO: Is the fee payer's seqnum part of the txn? If so, there need to be many of
  // them and some fancy way to manage seqnums, esp if we do the server_as_sponsor.ts approach.
  const onClick = async () => {
    if (account === null) {
      throw "Account should be non null at this point";
    }

    const payload: InputEntryFunctionData = {
      function: `${globalState.moduleAddress}::nyc_token::mint`,
      typeArguments: [],
      functionArguments: [pieceId],
    };

    try {
      // TODO For some reason I'm getting "invalid network name" here.
      let submissionResponse = await signAndSubmitTransaction({
        sender: account.address,
        data: payload,
      });
      const waitResponse = await globalState.client.waitForTransaction({
        transactionHash: submissionResponse.hash,
        options: { checkSuccess: true, waitForIndexer: true },
      });

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

      toast({
        title: "Success!",
        // TODO: Can we make this a link to the explorer?
        description: `Successfully minted token: ${tokenAddress}`,
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      console.log(`Error minting token: ${JSON.stringify(error)}`);
      toast({
        title: "Error minting token",
        description: `${error}`,
        variant: "error",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <Toaster />
      <Button onClick={onClick}>Mint</Button>
    </>
  );
};
