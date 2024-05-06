import { Button, FormField, Input } from "@aptos-internal/design-system-web";
import { useState } from "react";
import { SharedFormFields } from "./SharedFormFields";
import { UpdateButton } from "./UpdateButton";
import { css } from "styled-system/css";
import { MetadataFields } from "./MetadataFields";

/** A component with which you can create new piece data in the art data. */
export const PieceCreator = () => {
  const [pieceId, setPieceId] = useState("");
  const [pieceName, setPieceName] = useState("");
  const [pieceDescription, setPieceDescription] = useState("");
  const [pieceUri, setPieceUri] = useState("");

  const [metadata, setMetadata] = useState<Map<string, string>>(new Map());

  return (
    <form
      className={css({ display: "flex", flexDirection: "column", gap: "16" })}
    >
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
      <MetadataFields metadata={metadata} setMetadata={setMetadata} />
      <UpdateButton
        pieceId={pieceId}
        pieceName={pieceName}
        pieceDescription={pieceDescription}
        pieceUri={pieceUri}
        metadata={metadata}
        enabled={true}
        text={"Create"}
      />
    </form>
  );
};
