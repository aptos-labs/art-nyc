import { PieceData } from "@/types/surf";
import { css } from "styled-system/css";

export const TokenInfo = ({ pieceData }: { pieceData: PieceData }) => {
  return (
    <>
      <p className={css({ textStyle: "heading.100.semibold" })}>
        {pieceData.token_name}
      </p>
      <p style={{ whiteSpace: "pre-wrap" }}>{pieceData.token_description}</p>
    </>
  );
};
