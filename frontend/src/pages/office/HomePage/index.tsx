import { useGetArtData } from "@/api/hooks/useGetArtData";
import { getNetworkQueryParam, useGlobalState } from "@/context/GlobalState";
import { useOfficeState } from "@/context/OfficeState";
import { getPieceDataMetadata, getTypedMetadata } from "@/types/surf";
import { getImageUrl } from "@/utils";
import { Card, Skeleton, range } from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";

export const HomePage = () => {
  const { artDataInner, isLoading } = useGetArtData();
  const [globalState] = useGlobalState();
  const officeState = useOfficeState();

  return (
    <div
      className={flex({
        position: "relative",
        p: "16",
        wrap: "wrap",
        gap: "32",
        justify: "center",
        w: "full",
        maxW: "[1200px]",
      })}
    >
      <div
        style={{ opacity: isLoading ? 1 : 0 }}
        className={flex({
          position: "absolute",
          w: "full",
          wrap: "wrap",
          gap: "32",
          justify: "center",
          transition: "[opacity 1.4s ease]",
        })}
      >
        {range(0, 16).map((i) => (
          <Skeleton
            key={i}
            className={css({ w: "[230px]", h: "[208px]", rounded: "200" })}
          />
        ))}
      </div>
      {artDataInner &&
        Array.from(artDataInner.entries()).map(([key, value], i) => {
          const metadata = getTypedMetadata(getPieceDataMetadata(value));
          const imgSrc = getImageUrl(value);
          return (
            <Card
              key={key}
              className={stack({
                w: "[230px]",
                minH: "[208px]",
                p: "0",
                gap: "0",
                overflow: "hidden",
                opacity: "0",
                animation: "fadeIn 0.6s ease forwards",
              })}
              asChild
            >
              <a
                href={`${officeState.office}/mint/${key}${getNetworkQueryParam(globalState)}`}
                style={{ animationDelay: `${i / 20}s` }}
              >
                <img
                  src={imgSrc}
                  alt={value.token_name}
                  className={css({
                    w: "full",
                    h: "120",
                    objectFit: "cover",
                    bg: "[background.disabled]",
                  })}
                />
                <div className={stack({ gap: "[2px]", px: "12", py: "8" })}>
                  <div className={css({ textStyle: "body.md" })}>
                    {metadata.artist_name}
                  </div>
                  <div className={css({ textStyle: "label.md" })}>
                    {value.token_name}
                  </div>
                </div>
              </a>
            </Card>
          );
        })}
    </div>
  );
};
