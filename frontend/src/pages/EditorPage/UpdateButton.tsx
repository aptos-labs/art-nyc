import { useGlobalState } from "@/context/GlobalState";
import {
  Button,
  Toaster,
  Tooltip,
  toast,
} from "@aptos-internal/design-system-web";
import { InputEntryFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";

/** A component with which you can create new piece data in the art data. */
export const UpdateButton = ({
  pieceId,
  pieceName,
  pieceDescription,
  pieceUri,
  metadata,
  enabled,
  text,
}: {
  pieceId: string;
  pieceName: string;
  pieceDescription: string;
  pieceUri: string;
  metadata: Map<string, string>;
  enabled: boolean;
  text: string;
}) => {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [submitting, setSubmitting] = useState(false);
  const [globalState] = useGlobalState();

  const onClick = async () => {
    if (account === null) {
      throw "Account should be non null at this point";
    }
    setSubmitting(true);

    let metadataKeys = Array.from(metadata.keys());
    let metadataValues = Array.from(metadata.values());
    const payload: InputEntryFunctionData = {
      function: `${globalState.moduleAddress}::nyc_collection::set_art_data`,
      typeArguments: [],
      functionArguments: [
        pieceId,
        pieceName,
        pieceDescription,
        pieceUri,
        metadataKeys,
        metadataValues,
      ],
    };

    try {
      let submissionResponse = await signAndSubmitTransaction({
        sender: account.address,
        data: payload,
      });
      await globalState.client.waitForTransaction({
        transactionHash: submissionResponse.hash,
        options: { checkSuccess: true, waitForIndexer: true },
      });

      toast({
        title: "Success!",
        description: `Successfully updated art data for ${pieceId}`,
        variant: "success",
        duration: 5000,
      });
    } catch (error) {
      console.log(`Error updating art data: ${JSON.stringify(error)}`);
      toast({
        title: "Error updating art data",
        description: `${error}`,
        variant: "error",
        duration: 5000,
      });
    }
    setSubmitting(false);
  };

  const finalEnabled =
    enabled &&
    connected &&
    pieceId &&
    pieceName &&
    pieceDescription &&
    pieceUri;

  return (
    <>
      <Button loading={submitting} disabled={!finalEnabled} onClick={onClick}>
        {text}
      </Button>
      <Toaster />
    </>
  );
};
