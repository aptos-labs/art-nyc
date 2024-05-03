import { useGetArtData } from "@/api/hooks/useGetArtData";
import { PieceEditor } from "./PieceEditor";
import { PieceCreator } from "./PieceCreator";
import { css } from "@aptos-internal/design-system-web/dist/styled-system/css";

/**
 * A place where you can see the existing art data and make changes.
 *
 * We don't bother with validating if the user is an admin in the frontend, this is only
 * intended for admins, the experience doesn't need to be good for anyone else.
 */
export const DataPage = () => {
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
      <div className={css({ padding: "12", paddingBottom: "64" })}>
        <PieceEditor pieceId={key} pieceData={value} />
      </div>,
    );
  }

  return (
    <div>
      {editorElements}
      <PieceCreator />
    </div>
  );
};
