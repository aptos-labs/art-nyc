import { knownMetadataKeys } from "@/types/surf";
import { FormField, Input, Button } from "@aptos-internal/design-system-web";
import React, { useState } from "react";
import { css } from "styled-system/css";

export function MetadataFields({
  metadata,
  setMetadata,
}: {
  metadata: Map<string, string>;
  setMetadata: React.Dispatch<React.SetStateAction<Map<string, string>>>;
}) {
  const [newKey, setNewKey] = useState("");

  const newKeyValid =
    newKey.length > 0 &&
    !metadata.has(newKey) &&
    knownMetadataKeys.includes(newKey as any);

  const addField = () => {
    if (newKeyValid) {
      const newMetadata = new Map(metadata);
      newMetadata.set(newKey, "");
      setMetadata(newMetadata);
      setNewKey("");
    }
  };

  const deleteField = (key: string) => {
    const newMetadata = new Map(metadata);
    newMetadata.delete(key);
    setMetadata(newMetadata);
  };

  const fields = Array.from(metadata.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => (
      <div
        key={key}
        className={css({ display: "flex", alignItems: "flex-end", gap: "12" })}
      >
        <FormField label={key}>
          {(formControlProps) => (
            <Input
              value={value}
              onChange={(e) => {
                const newMetadata = new Map(metadata);
                newMetadata.set(key, e.target.value);
                setMetadata(newMetadata);
              }}
              placeholder={key}
              {...formControlProps}
            />
          )}
        </FormField>
        <Button
          onClick={() => deleteField(key)}
          variant="destructive"
          aria-label="Delete field"
        >
          Delete
        </Button>
      </div>
    ));

  return (
    <div>
      <div
        className={css({ display: "flex", flexDirection: "column", gap: "16" })}
      >
        {fields}
      </div>
      <div
        className={css({
          marginTop: "20",
          display: "flex",
          alignItems: "center",
          gap: "12",
        })}
      >
        <Input
          className={css({ marginRight: "12" })}
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Enter new field key"
        />
        <Button
          onClick={addField}
          disabled={!newKeyValid}
          variant="primary"
          aria-label="Add field"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
