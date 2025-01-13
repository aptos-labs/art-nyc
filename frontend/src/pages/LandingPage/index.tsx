import { useGetNetworkQueryParam } from "@/context/GlobalState";
import { Button } from "@aptos-internal/design-system-web";
import { Link } from "react-router-dom";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";

export const LandingPage = () => {
  const networkQueryParam = useGetNetworkQueryParam();

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
      <Button
        className={buttonStyles}
        variant="secondary"
        size="lg"
        children="NYC"
        render={(children) => (
          <Link to={`/nyc${networkQueryParam}`}>{children}</Link>
        )}
      />

      <Button
        className={buttonStyles}
        variant="secondary"
        size="lg"
        children="Bay Area"
        render={(children) => (
          <Link to={`/bayarea${networkQueryParam}`}>{children}</Link>
        )}
      />
    </div>
  );
};

const buttonStyles = css({
  w: "[230px]",
  h: "[208px]",
  rounded: "200",
  textStyle: "heading.sm",
});
