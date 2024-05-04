import { PieceData } from "@/types/surf";
import { Button } from "@aptos-internal/design-system-web";
import { useState } from "react";
import { SharedFormFields } from "./SharedFormFields";
import { UpdateButton } from "./UpdateButton";
import { css } from "styled-system/css";

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

  const anythingChanged =
    pieceName !== pieceData.token_name ||
    pieceDescription !== pieceData.token_description ||
    pieceUri !== pieceData.token_uri;

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
      <UpdateButton
        pieceId={pieceId}
        pieceName={pieceName}
        pieceDescription={pieceDescription}
        pieceUri={pieceUri}
        enabled={anythingChanged}
        text={"Update"}
      />
    </form>
  );
};
