import { getNetworkQueryParam, useGlobalState } from "@/context/GlobalState";
import { Button } from "@aptos-internal/design-system-web";
import { Link } from "react-router-dom";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";

export const LandingPage = () => {
  const [globalState] = useGlobalState();
  const buttonCss = css({ w: "[230px]", h: "[208px]", rounded: "200" });

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
        className={stack({
          direction: "row",
          gap: "32",
          justify: "center",
          align: "center",
        })}
      >
        <Button
          className={buttonCss}
          variant="secondary"
          size="lg"
          children="NYC"
          render={(children) => (
            <Link to={`/nyc${getNetworkQueryParam(globalState)}`}>
              {children}
            </Link>
          )}
        />

        <Button
          className={buttonCss}
          variant="secondary"
          size="lg"
          children="Bay Area"
          render={(children) => (
            <Link to={`/bayarea${getNetworkQueryParam(globalState)}`}>
              {children}
            </Link>
          )}
        />
      </div>
    </div>
  );
};
