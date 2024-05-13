import { PieceData } from "@/types/surf";
import { getImageUrl } from "@/utils";
import {
  Button,
  IconCloseLine,
  Modal,
} from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";
import { stack } from "styled-system/patterns";

export const ViewButton = ({ pieceData }: { pieceData: PieceData }) => {
  return (
    <Modal
      renderContent={({ close }) => {
        const ipfsGatewayUrl = getImageUrl(pieceData);
        return (
          <div
            className={stack({
              w: "[100vw]",
              maxH: "[100vh]",
              py: "24",
              gap: "24",
              align: "center",
              overflow: "auto",
            })}
          >
            <img
              src={ipfsGatewayUrl}
              alt={pieceData.token_name}
              className={css({
                w: "full",
                h: "auto",
                maxH: "[calc(100vh - 120px)]",
                objectFit: "contain",
              })}
            />
            <Button variant="secondary" iconOnly onClick={close}>
              <IconCloseLine />
            </Button>
          </div>
        );
      }}
      trigger={
        <Button size="lg" className={css({ w: "full" })}>
          View
        </Button>
      }
    />
  );
};
