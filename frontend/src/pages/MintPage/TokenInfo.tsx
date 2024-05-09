import { PieceData, getPieceDataMetadata } from "@/types/surf";
import { navigateExternal } from "@/utils";
import {
  Button,
  IconExternalLinkLine,
  IconInstagramLine,
  IconTwitter,
} from "@aptos-internal/design-system-web";
import { isMobile } from "@aptos-labs/wallet-adapter-core";
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

  let descriptionCss;
  if (isMobile()) {
    descriptionCss = css({ whiteSpace: "pre-wrap", textAlign: "center" });
  } else {
    descriptionCss = css({
      whiteSpace: "pre-wrap",
      textAlign: "center",
      maxWidth: "[50%]",
    });
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
        {metadata.instagram_handle && (
          <Button
            className={css({ margin: "0", padding: "4", gap: "0" })}
            iconOnly={true}
            onClick={() => {
              const handle = metadata.instagram_handle!.trim().replace("@", "");
              navigateExternal(`https://instagram.com/${handle}`);
            }}
            variant="secondaryText"
            size="sm"
          >
            <IconInstagramLine className="aptos-h_24 aptos-w_24" />
          </Button>
        )}
        {metadata.twitter_handle && (
          <Button
            className={css({ margin: "0", padding: "4", gap: "0" })}
            iconOnly={true}
            onClick={() => {
              const handle = metadata.twitter_handle!.trim().replace("@", "");
              navigateExternal(`https://twitter.com/${handle}`);
            }}
            variant="secondaryText"
            size="sm"
          >
            <IconTwitter className="aptos-h_24 aptos-w_24" />
          </Button>
        )}
        {metadata.website_url && (
          <Button
            className={css({ margin: "0", padding: "4", gap: "0" })}
            iconOnly={true}
            onClick={() => {
              let url = metadata.website_url!.trim();
              if (!url.startsWith("http")) {
                url = `https://${url}`;
              }
              navigateExternal(url);
            }}
            variant="secondaryText"
            size="sm"
          >
            <IconExternalLinkLine className="aptos-h_24 aptos-w_24" />
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
        })}
      >
        {pieceData.token_description}
      </p>
    </>
  );
};
