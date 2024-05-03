import { PieceData } from "@/types/surf";
import { css } from "styled-system/css";

export const TokenInfo = ({ pieceData }: { pieceData: PieceData }) => {
  // TODO: Make sure any newlines and the like in the description is respected.
  return (
    <>
      <p className={css({ textStyle: "heading.100.semibold" })}>
        {pieceData.token_name}
      </p>
      <p>{pieceData.token_description}</p>
    </>
  );
};
