import "../../global.css";

import React from "react";
import { Box, Flex } from "../../styled-system/jsx";
import { Link } from "react-router-dom";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { css } from "../../styled-system/css";
import { Button, IconGithub } from "@aptos-internal/design-system-web";

export const ConnectWalletComponent = () => {
  // Wallet icon component.
  return <WalletSelector />;
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  let { isLoading } = useWallet();

  let headerMiddle = null;

  // Not using this for now.
  let githubIcon = (
    <Flex justifyContent="flex-end" alignItems="center" gap="[2px]" flex="1">
      <a href="https://github.com/banool/aptos-account-value">
        <Button
          iconOnly={true}
          variant="secondary"
          size="md"
          aria-label={`View source code on GitHub`}
        >
          <IconGithub className="aptos-h_16 aptos-w_16" />
        </Button>
      </a>
    </Flex>
  );

  // Courtesy of https://stackoverflow.com/q/75175422/3846032.
  // TODO: None of the styles on these boxes is doing anything.
  const body = (
    <Box display="flex" flexDirection="column">
      <Box
        paddingTop="[5px]"
        paddingBottom="[5px]"
        paddingLeft="[8px]"
        paddingRight="[8px]"
      >
        <Flex alignItems="center" gap="[2px]">
          <Flex alignItems="center" gap="[2px]" flex="1">
            <Box>
              <p className={css({ textStyle: "heading.400.semibold" })}>
                <Link to="/">Aptos NYC 2024</Link>
              </p>
            </Box>
          </Flex>
          <Flex
            justifyContent="center"
            alignItems="center"
            gap="[2px]"
            flex="1"
          >
            {headerMiddle}
          </Flex>
        </Flex>
      </Box>
      <Box width="[100px]" height="[100px]" backgroundColor="red.100" />
      <div
        className={css({
          width: "[100px]",
          height: "[100px]",
          backgroundColor: "red.100",
        })}
      />
      <div
        style={{ width: "100px", height: "100px", backgroundColor: "red.100" }}
      />
      {children}
    </Box>
  );

  // Blur the content if we're connecting a wallet.
  let out;
  if (isLoading) {
    out = (
      <Box
        filter="[blur(4px) brightness(0.8)]"
        pointerEvents="none"
        position="absolute"
        width="[100%]"
        height="[100%]"
      >
        {body}
      </Box>
    );
  } else {
    out = body;
  }

  return body;
}

// For some reason this works:
// <div style={{width:"100px", height:"100px", backgroundColor:"red"}}/>

// But this doesn't, the div just doesn't appear:
// <div className={css({width:"[100px]", height:"[100px]", backgroundColor:"red.100"})}/>
