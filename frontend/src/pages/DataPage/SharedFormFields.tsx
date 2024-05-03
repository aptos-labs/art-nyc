import { FormField, Input, TextArea } from "@aptos-internal/design-system-web";

export function SharedFormFields({
  pieceName,
  pieceDescription,
  pieceUri,
  setPieceName,
  setPieceDescription,
  setPieceUri,
}: {
  pieceName: string;
  pieceDescription: string;
  pieceUri: string;
  setPieceName: React.Dispatch<React.SetStateAction<string>>;
  setPieceDescription: React.Dispatch<React.SetStateAction<string>>;
  setPieceUri: React.Dispatch<React.SetStateAction<string>>;
}) {
  // TODO: Use the css function instead.
  // How to add spacing between items in a div rather than adding spacing on each item in it?
  return (
    <div style={{gap: 24}}>
      <FormField label="Name">
        {(formControlProps) => (
          <Input
            value={pieceName}
            onChange={(t) => setPieceName(t.target.value)}
            placeholder="Name"
            {...formControlProps}
          />
        )}
      </FormField>
      <FormField label="Description">
        {(formControlProps) => (
          <TextArea
            value={pieceDescription}
            onChange={(t) => setPieceDescription(t.target.value)}
            placeholder="Description"
            rows={12}
            {...formControlProps}
          />
        )}
      </FormField>
      <FormField label="URI">
        {(formControlProps) => (
          <Input
            value={pieceUri}
            onChange={(t) => setPieceUri(t.target.value)}
            placeholder="URI"
            {...formControlProps}
          />
        )}
      </FormField>
    </div>
  );
}

export function onClick({
  pieceId,
  pieceName,
  pieceDescription,
  pieceUri,
}: {
  pieceId: string;
  pieceName: string;
  pieceDescription: string;
  pieceUri: string;
}) {}
