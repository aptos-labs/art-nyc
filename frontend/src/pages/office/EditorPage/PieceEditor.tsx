import { PieceData, getPieceDataMetadata } from "@/types/surf";
import { useState } from "react";
import { SharedFormFields } from "./SharedFormFields";
import { UpdateButton } from "./UpdateButton";
import { css } from "styled-system/css";
import { MetadataFields } from "./MetadataFields";
import { mapsAreEqual } from "@/utils";
import { Link } from "react-router-dom";
import { getNetworkQueryParam, useGlobalState } from "@/context/GlobalState";
import {
  IconButton,
  IconClipboard,
  Tooltip,
} from "@aptos-internal/design-system-web";
import { useOfficeState } from "@/context/OfficeState";
import { QRCodeModal } from "./QRCodeModal";

/** A component where you can see the existing art data and make changes. */
export const PieceEditor = ({
  pieceId,
  pieceData,
}: {
  pieceId: string;
  pieceData: PieceData;
}) => {
  const [globalState] = useGlobalState();
  const officeState = useOfficeState();
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

  const linkTo = `/${officeState.office}/mint/${pieceId}`;
  const fullUrl = `${window.location.protocol}//${window.location.host}${linkTo}`;
  const petraDeeplink = `https://petra.app/explore?link=${fullUrl}`;

  return (
    <form
      className={css({ display: "flex", flexDirection: "column", gap: "16" })}
    >
      <div className={css({ display: "flex", alignItems: "center", gap: "8" })}>
        <Link to={`${linkTo}${getNetworkQueryParam(globalState)}`}>
          <span className={css({ textStyle: "heading.md" })}>{pieceId}</span>
        </Link>
        <Tooltip placement="top-start" content="Copy Petra deeplink URL">
          <IconButton
            type="button"
            variant="secondary"
            ariaLabel="Copy Petra deeplink URL"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(petraDeeplink);
            }}
          >
            <IconClipboard />
          </IconButton>
        </Tooltip>
        <QRCodeModal url={petraDeeplink} pieceId={pieceId} />
      </div>
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
