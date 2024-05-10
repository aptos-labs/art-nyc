import { PieceData, getPieceDataMetadata } from "@/types/surf";
import { useState } from "react";
import { SharedFormFields } from "./SharedFormFields";
import { UpdateButton } from "./UpdateButton";
import { css } from "styled-system/css";
import { MetadataFields } from "./MetadataFields";
import { mapsAreEqual } from "@/utils";
import { Link } from "react-router-dom";
import { useGlobalState } from "@/context/GlobalState";
import {
  Button,
  IconClipboardLine,
  Tooltip,
} from "@aptos-internal/design-system-web";

/** A component where you can see the existing art data and make changes. */
export const PieceEditor = ({
  pieceId,
  pieceData,
}: {
  pieceId: string;
  pieceData: PieceData;
}) => {
  const [globalState] = useGlobalState();
  const [pieceName, setPieceName] = useState(pieceData.token_name);
  const [pieceDescription, setPieceDescription] = useState(
    pieceData.token_description,
  );
  const [pieceUri, setPieceUri] = useState(pieceData.token_uri);

  const originalMetadata = getPieceDataMetadata(pieceData);
  const [metadata, setMetadata] =
    useState<Map<string, string>>(originalMetadata);

  const anythingChanged =
    pieceName !== pieceData.token_name ||
    pieceDescription !== pieceData.token_description ||
    pieceUri !== pieceData.token_uri ||
    !mapsAreEqual(metadata, originalMetadata);

  return (
    <form
      className={css({ display: "flex", flexDirection: "column", gap: "16" })}
    >
      <p className={css({ textStyle: "heading.100.semibold" })}>
        <Link to={`/mint/${pieceId}?network=${globalState.network}`}>
          {pieceId}
        </Link>
        <Tooltip
          placement="top-start"
          content={
            <p className={css({ textStyle: "body.300.regular" })}>
              Copy Petra deeplink URL
            </p>
          }
        >
          <Button
            type="button"
            className={css({ marginLeft: "16" })}
            iconOnly={true}
            variant="secondary"
            size="sm"
            onClick={async () => {
              const url = `${window.location.protocol}//${window.location.host}/mint/${pieceId}?network=${globalState.network}`;
              await navigator.clipboard.writeText(
                `https://petra.app/explore?link=${url}`,
              );
            }}
          >
            <IconClipboardLine />
          </Button>
        </Tooltip>
      </p>
      <SharedFormFields
        pieceName={pieceName}
        pieceDescription={pieceDescription}
        pieceUri={pieceUri}
        setPieceName={setPieceName}
        setPieceDescription={setPieceDescription}
        setPieceUri={setPieceUri}
      />
      <MetadataFields metadata={metadata} setMetadata={setMetadata} />
      <UpdateButton
        pieceId={pieceId}
        pieceName={pieceName}
        pieceDescription={pieceDescription}
        pieceUri={pieceUri}
        metadata={metadata}
        enabled={anythingChanged}
        text={"Update"}
      />
    </form>
  );
};
