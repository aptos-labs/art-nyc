import { Button, FormField, Input } from "@aptos-internal/design-system-web";
import { useState } from "react";
import { SharedFormFields } from "./SharedFormFields";
import { UpdateButton } from "./UpdateButton";
import { css } from "styled-system/css";

/** A component with which you can create new piece data in the art data. */
export const PieceCreator = () => {
  const [pieceId, setPieceId] = useState("");
  const [pieceName, setPieceName] = useState("");
  const [pieceDescription, setPieceDescription] = useState("");
  const [pieceUri, setPieceUri] = useState("");

  const canSubmit = pieceId && pieceName && pieceDescription && pieceUri;

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p
        className={css({ textStyle: "heading.100.semibold" })}
      >{`Create a new piece`}</p>
      <FormField label="Piece ID">
        {(formControlProps) => (
          <Input
            value={pieceId}
            onChange={(t) => setPieceId(t.target.value)}
            placeholder="Piece ID"
            {...formControlProps}
          />
        )}
      </FormField>
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
        enabled={true}
        text={"Create"}
      />
    </form>
  );
};
