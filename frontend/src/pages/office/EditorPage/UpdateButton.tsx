import { useGlobalState } from "@/context/GlobalState";
import { getIdentifier, useOfficeState } from "@/context/OfficeState";
import { onClickSubmitTransaction } from "@/utils";
import { Button } from "@aptos-internal/design-system-web";
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
  const officeState = useOfficeState();

  const onClick = async () => {
    setSubmitting(true);
    let metadataKeys = Array.from(metadata.keys());
    let metadataValues = Array.from(metadata.values());
    const payload: InputEntryFunctionData = {
      function: getIdentifier(officeState, "collection", "set_art_data"),
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
    await onClickSubmitTransaction({
      payload,
      signAndSubmitTransaction,
      account,
      aptos: globalState.client,
      successToast: {
        title: "Success!",
        description: `Successfully updated art data for ${pieceId}`,
        variant: "success",
        duration: 5000,
      },
      errorToast: {
        title: "Error updating art data",
        variant: "error",
        duration: 5000,
      },
    });
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
    </>
  );
};
