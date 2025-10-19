import { useGetArtData } from "@/api/hooks/useGetArtData";
import { PieceEditor } from "./PieceEditor";
import { PieceCreator } from "./PieceCreator";
import { PrintableQRCodes } from "./PrintableQRCodes";
import { css } from "styled-system/css";
import { Card } from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { knownMetadataKeys } from "@/types/surf";

/**
 * A place where you can see the existing art data and make changes.
 *
 * We don't bother with validating if the user is an admin in the frontend, this is only
 * intended for admins, the experience doesn't need to be good for anyone else.
 */
export const EditorPage = () => {
  const { artDataInner, isLoading, error } = useGetArtData();
  const { connected } = useWallet();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{`Failed to load art data: ${JSON.stringify(error)}`}</p>;
  }
  if (artDataInner === undefined) {
    return <p>Art data unexpectedly undefined</p>;
  }

  let editorElements = [];
  for (var [key, value] of artDataInner) {
    editorElements.push(
      <div key={key} className={css({ padding: "12" })}>
        <Card>
          <PieceEditor pieceId={key} pieceData={value} />
        </Card>
      </div>,
    );
  }

  let walletConnectComponent = null;
  if (!connected) {
    walletConnectComponent = (
      <div className={css({ padding: "12", textStyle: "heading.md" })}>
        <p>Please connect your wallet.</p>
      </div>
    );
  }

  return (
    <div className={css({ paddingTop: "32" })}>
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "12",
          paddingRight: "12",
          paddingBottom: "16",
        })}
      >
        <p className={css({ textStyle: "heading.md" })}>Editor</p>
        <PrintableQRCodes />
      </div>
      <p className={css({ paddingLeft: "12" })}>
        It is not recommended to edit names for pieces that people have minted,
        it makes indexing complex.
      </p>
      <div className={css({ paddingLeft: "12" })}>
        <p>These are the metadata keys the UI knows how to handle:</p>
        <ul>
          {knownMetadataKeys.map((key) => (
            <li key={key}>{`    • ${key}`}</li>
          ))}
        </ul>
      </div>
      {walletConnectComponent}
      <div className={css({ padding: "12" })}>
        <Card>
          <PieceCreator />
        </Card>
      </div>
      <Divider />
      {editorElements}
    </div>
  );
};

const Divider = () => (
  <div
    className={css({
      height: "[1px]",
      backgroundColor: "border.primary",
      marginLeft: "[100px]",
      marginRight: "[100px]",
      marginTop: "24",
      marginBottom: "24",
    })}
  ></div>
);
