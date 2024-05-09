import { PieceData, getPieceDataMetadata } from "@/types/surf";
import {
  Button,
  IconExternalLinkLine,
  IconInstagramLine,
  IconTwitterLine,
} from "@aptos-internal/design-system-web";
import { css } from "styled-system/css";

type TypedMetadata = {
  artist_name?: string;
  creation_year?: string;
  material_description?: string;
  website_url?: string;
  instagram_handle?: string;
  twitter_handle?: string;
};

/**
 * Just a convenience for the edit page. Try to keep this up to date with the fields
 * in AdditionalArtData.
 */
export const knownMetadataKeys: (keyof TypedMetadata)[] = [
  "artist_name",
  "creation_year",
  "material_description",
  "website_url",
  "instagram_handle",
  "twitter_handle",
];

function getTypedMetadata(metadata: Map<string, string>): TypedMetadata {
  const additionalData: Partial<TypedMetadata> = {};

  knownMetadataKeys.forEach((field) => {
    additionalData[field] = metadata.get(field) || undefined;
  });

  return additionalData as TypedMetadata;
}

export const TokenInfo = ({ pieceData }: { pieceData: PieceData }) => {
  const metadata = getTypedMetadata(getPieceDataMetadata(pieceData));

  const instagramHref =
    metadata.instagram_handle &&
    `https://instagram.com/${metadata.instagram_handle.trim().replace("@", "")}`;

  const twitterHref =
    metadata.twitter_handle &&
    `https://twitter.com/${metadata.twitter_handle.trim().replace("@", "")}`;

  let websiteHref = metadata.website_url?.trim();
  if (websiteHref && !websiteHref.startsWith("http")) {
    websiteHref = `https://${websiteHref}`;
  }

  return (
    <>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0",
        })}
      >
        {metadata.artist_name && (
          <p className={css({ paddingRight: "4" })}>{metadata.artist_name}</p>
        )}
        {instagramHref && (
          <Button
            className={css({ p: "4" })}
            variant="secondaryText"
            size="sm"
            iconOnly
            asChild
          >
            <a href={instagramHref}>
              <IconInstagramLine className={css({ h: "24", w: "24" })} />
            </a>
          </Button>
        )}
        {twitterHref && (
          <Button
            className={css({ p: "4" })}
            variant="secondaryText"
            size="sm"
            iconOnly
            asChild
          >
            <a href={twitterHref}>
              <IconTwitterLine className={css({ h: "24", w: "24" })} />
            </a>
          </Button>
        )}
        {websiteHref && (
          <Button
            className={css({ p: "4" })}
            variant="secondaryText"
            size="sm"
            iconOnly
            asChild
          >
            <a href={websiteHref}>
              <IconExternalLinkLine className={css({ h: "24", w: "24" })} />
            </a>
          </Button>
        )}
      </div>
      <p className={css({ textStyle: "heading.100.semibold" })}>
        <i>{pieceData.token_name}</i>
        {metadata.creation_year ? `, ${metadata.creation_year}` : ""}
      </p>
      {metadata.material_description && (
        <p className={css({})}>{metadata.material_description}</p>
      )}
      <br />
      <p
        className={css({
          whiteSpace: "pre-wrap",
          textAlign: "center",
          textStyle: "body.300.regular",
          maxW: "prose",
        })}
      >
        {pieceData.token_description}
      </p>
    </>
  );
};
