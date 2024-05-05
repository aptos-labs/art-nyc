import { useGetArtData } from "@/api/hooks/useGetArtData";
import { PieceEditor } from "./PieceEditor";
import { PieceCreator } from "./PieceCreator";
import { css } from "styled-system/css";
import { Card } from "@aptos-internal/design-system-web";

/**
 * A place where you can see the existing art data and make changes.
 *
 * We don't bother with validating if the user is an admin in the frontend, this is only
 * intended for admins, the experience doesn't need to be good for anyone else.
 */
export const EditorPage = () => {
  const { artDataInner, isLoading, error } = useGetArtData();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{`Failed to load art data: ${JSON.stringify(error)}`}</p>;
  }
  if (artDataInner === undefined) {
    return <p>Art data unexpectedly undefined</p>;
  }

  // TODO: Add spacing between all this stuff.
  // mysteriously padding 12 does something but padding 16 doesn't?
  let editorElements = [];
  for (var [key, value] of artDataInner) {
    editorElements.push(
      <div key={key} className={css({ padding: "12" })}>
        <Card>
          <PieceEditor pieceId={key} pieceData={value} />
        </Card>
      </div>,
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
        It is not recommended to edit names for existing pieces right now, we
        need to confirm how the indexer behaves first.
      </p>
      <p className={css({ paddingLeft: "12" })}>
        These are the metadata keys the UI knows how to handle: todo
      </p>
      {editorElements}
      <div
        style={{
          height: "1px",
          backgroundColor: "#ccc",
          marginLeft: "100px",
          marginRight: "100px",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      ></div>
      <div className={css({ padding: "12" })}>
        <Card>
          <PieceCreator />
        </Card>
      </div>
    </div>
  );
};
