import {
  PieceData,
  getPieceDataMetadata,
  getTypedMetadata,
} from "@/types/surf";
import { getImageUrl } from "@/utils";
import {
  Button,
  Card,
  IconArrowSquareOut,
  IconInstagramLogo,
  IconXLogo,
} from "@aptos-internal/design-system-web";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";

export const TokenInfo = ({ pieceData }: { pieceData: PieceData }) => {
  const metadata = getTypedMetadata(getPieceDataMetadata(pieceData));

  const instagramHref =
    metadata.instagram_handle &&
    `https://instagram.com/${metadata.instagram_handle
      .trim()
      .replace("@", "")}`;

  const twitterHref =
    metadata.twitter_handle &&
    `https://twitter.com/${metadata.twitter_handle.trim().replace("@", "")}`;

  let websiteHref = metadata.website_url?.trim();
  if (websiteHref && !websiteHref.startsWith("http")) {
    websiteHref = `https://${websiteHref}`;
  }

  return (
    <Card
      className={stack({
        position: "relative",
        w: "full",
        gap: "0",
      })}
    >
      <ImageShadow name={pieceData.token_name} src={getImageUrl(pieceData)} />
      <div className={flex({ align: "center" })}>
        {metadata.artist_name && (
          <p className={css({ textStyle: "body.md", pr: "4" })}>
            {metadata.artist_name}
          </p>
        )}
        {instagramHref && (
          <Button
            className={css({ p: "4" })}
            variant="text"
            size="sm"
            ariaLabel="Visit artist's Instagram"
          >
            <a href={instagramHref}>
              <IconInstagramLogo />
            </a>
          </Button>
        )}
        {twitterHref && (
          <Button
            className={css({ p: "4" })}
            variant="text"
            size="sm"
            ariaLabel="Visit artist's X profile"
          >
            <a href={twitterHref}>
              <IconXLogo />
            </a>
          </Button>
        )}
        {websiteHref && (
          <Button
            className={css({ p: "4" })}
            variant="text"
            size="sm"
            ariaLabel="Visit artist's website"
          >
            <a href={websiteHref}>
              <IconArrowSquareOut />
            </a>
          </Button>
        )}
      </div>
      <p
        className={css({
          textStyle: "heading.md",
          fontWeight: "bold",
        })}
      >
        <i>{pieceData.token_name}</i>
        <span className={css({ fontWeight: "regular" })}>
          {metadata.creation_year ? `, ${metadata.creation_year}` : ""}
        </span>
      </p>
      {metadata.material_description && (
        <p
          className={css({
            color: "text.secondary",
            textStyle: "body.md",
          })}
        >
          {metadata.material_description}
        </p>
      )}
      <br />
      <p
        className={css({
          whiteSpace: "pre-wrap",
          textStyle: "body.md",
          maxW: "prose",
        })}
      >
        {pieceData.token_description}
      </p>
    </Card>
  );
};

interface ImageShadowProps {
  name: string;
  src: string;
}

function ImageShadow({ name, src }: ImageShadowProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  const onLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      onLoad();
    }
  }, []);

  return (
    <img
      ref={ref}
      onLoad={onLoad}
      alt={name}
      src={src}
      className={
        loaded
          ? css({
              position: "absolute",
              inset: "0",
              h: "full",
              w: "full",
              zIndex: "[-1]",
              objectFit: "cover",
              filter: "[blur(32px)]",
              opacity: 0.5,
              transform: "scale(0)",
              rounded: "300",
              animation: "expand 1s ease forwards",
            })
          : css({ display: "none" })
      }
    />
  );
}
