import { useGetArtData } from "@/api/hooks/useGetArtData";
import { PieceEditor } from "./PieceEditor";
import { PieceCreator } from "./PieceCreator";
import { css } from "styled-system/css";
import { Card } from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { knownMetadataKeys } from "../MintPage/TokenInfo";

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
        <Card className={css({ backgroundColor: "slate.100" })}>
          <PieceEditor pieceId={key} pieceData={value} />
        </Card>
      </div>,
    );
  }

  let walletConnectComponent = null;
  if (!connected) {
    walletConnectComponent = (
      <div
        className={css({ padding: "12", textStyle: "heading.100.semibold" })}
      >
        <p>Please connect your wallet.</p>
      </div>
    );
  }

  return (
    <div className={css({ paddingTop: "32" })}>
      <p
        className={css({
          paddingLeft: "12",
          textStyle: "heading.300.semibold",
        })}
      >
        Editor
      </p>
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
        <Card className={css({ backgroundColor: "slate.100" })}>
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
      backgroundColor: "[#ccc]",
      marginLeft: "[100px]",
      marginRight: "[100px]",
      marginTop: "24",
      marginBottom: "24",
    })}
  ></div>
);
