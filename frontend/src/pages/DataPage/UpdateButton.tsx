import { useGlobalState } from "@/context/GlobalState";
import { Button, Toaster, toast } from "@aptos-internal/design-system-web";
import { InputEntryFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

/** A component with which you can create new piece data in the art data. */
export const UpdateButton = ({
  pieceId,
  pieceName,
  pieceDescription,
  pieceUri,
  enabled,
  text,
}: {
  pieceId: string;
  pieceName: string;
  pieceDescription: string;
  pieceUri: string;
  enabled: boolean;
  text: string;
}) => {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [globalState] = useGlobalState();

  const onClick = async () => {
    if (account === null) {
      throw "Account should be non null at this point";
    }

    const payload: InputEntryFunctionData = {
      function: `${globalState.moduleAddress}::nyc_token::set_art_data`,
      typeArguments: [],
      functionArguments: [pieceId, pieceName, pieceDescription, pieceUri],
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
        duration: 2000,
      });
    } catch (error) {
      console.log(`Error updating art data: ${JSON.stringify(error)}`);
      toast({
        title: "Error updating art data",
        description: `${error}`,
        variant: "error",
        duration: 4000,
      });
    }
  };


  const finalEnabled =
    enabled &&
    connected &&
    pieceId &&
    pieceName &&
    pieceDescription &&
    pieceUri;

  return <><Button disabled={!finalEnabled} onClick={onClick}>{text}</Button><Toaster /></>;
};
