import { Button, FormField, Input } from "@aptos-internal/design-system-web";
import { useState } from "react";
import { SharedFormFields } from "./SharedFormFields";
import { UpdateButton } from "./UpdateButton";

/** A component with which you can create new piece data in the art data. */
export const PieceCreator = () => {
  const [pieceId, setPieceId] = useState("");
  const [pieceName, setPieceName] = useState("");
  const [pieceDescription, setPieceDescription] = useState("");
  const [pieceUri, setPieceUri] = useState("");

  const canSubmit = pieceId && pieceName && pieceDescription && pieceUri;

  return (
    <form>
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
      <Button disabled={!canSubmit}>Create</Button>
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
