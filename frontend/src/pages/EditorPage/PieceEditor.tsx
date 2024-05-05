import { PieceData, getPieceDataMetadata } from "@/types/surf";
import { useState } from "react";
import { SharedFormFields } from "./SharedFormFields";
import { UpdateButton } from "./UpdateButton";
import { css } from "styled-system/css";
import { MetadataFields } from "./MetadataFields";
import { mapsAreEqual } from "@/utils";

/** A component where you can see the existing art data and make changes. */
export const PieceEditor = ({
  pieceId,
  pieceData,
}: {
  pieceId: string;
  pieceData: PieceData;
}) => {
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
    <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p
        className={css({ textStyle: "heading.100.semibold" })}
      >{`${pieceId}`}</p>
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
