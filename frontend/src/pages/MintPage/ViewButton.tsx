import { PINATA_GATEWAY_TOKEN } from "@/constants";
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
              gap: "24",
              align: "center",
            })}
          >
            <img
              src={ipfsGatewayUrl}
              alt={pieceData.token_name}
              className={css({ w: "full", h: "auto", objectFit: "contain" })}
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
