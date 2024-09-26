import "../../global.css";
import { AptosLogo } from "@/components/AptosLogo";
import { connectPetra } from "@/components/WalletSelector";
import { getNetworkQueryParam, useGlobalState } from "@/context/GlobalState";
import { navigateExternal } from "@/utils";
import {
  IconButton,
  IconDotsThreeVertical,
  IconGasPump,
  IconGithub,
  IconMoney,
  IconSignIn,
  IconSignOut,
  Menu,
  toast,
} from "@aptos-internal/design-system-web";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";

interface LayoutProps {
  children: React.ReactNode;
  headerText: string;
}

/**
 * Even though it doesn't make sense to use this in all contexts, e.g. /, we still
 * expect that GlobalState is set.
 */
export function MainLayout({ children, headerText }: LayoutProps) {
  const [globalState] = useGlobalState();

  // Make the home button just return to the office specific home page if we're "in an office".
  const location = useLocation();
  const office = location.pathname.split("/")[1];

  const headerContent = (
    <div
      className={flex({
        align: "center",
        justify: "space-between",
        w: "full",
        px: "16",
        py: "12",
        color: "text.primary",
      })}
    >
      <Link to={`/${office}${getNetworkQueryParam(globalState)}`}>
        <AptosLogo
          className={css({ h: "32", w: "32", color: "text.primary" })}
        />
      </Link>
      <h1 className={css({ textStyle: "heading.md" })}>{headerText}</h1>
      <MyMenu />
    </div>
  );

  return (
    <div className={stack({ align: "center", gap: "0" })}>
      {headerContent}
      {children}
    </div>
  );
}

function MyMenu() {
  const { connected, connect, disconnect } = useWallet();
  const [globalState, globalActions] = useGlobalState();

  const walletItem = connected
    ? {
        Icon: IconSignOut,
        id: "disconnect",
        label: "Disconnect",
        onSelect: disconnect,
      }
    : {
        Icon: IconSignIn,
        id: "connect",
        label: "Connect",
        onSelect: connectPetra(connect),
      };

  function getFeePayerItem(
    label: string,
    icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element,
  ) {
    return {
      Icon: icon,
      id: "feepayer",
      label,
      onSelect: () => {
        globalActions.setUseFeePayer((current) => {
          let newValue = !current;
          let title = newValue ? "Fee Payer Enabled" : "Fee Payer Disabled";
          let description = newValue
            ? "The fee payer will pay gas on your behalf."
            : "You will pay for gas yourself.";
          toast({ title, description, variant: "info", duration: 5000 });
          return !current;
        });
      },
    };
  }

  const feePayerItem = globalState.useFeePayer
    ? getFeePayerItem("Pay Own Gas", IconGasPump)
    : getFeePayerItem("Use Fee Payer", IconMoney);

  return (
    <Menu
      menuItems={[
        walletItem,
        feePayerItem,
        {
          Icon: IconGithub,
          id: "source",
          label: "View Source",
          onSelect: () => {
            navigateExternal("https://github.com/banool/aptos-nyc-2024");
          },
        },
      ]}
      trigger={
        <IconButton variant="secondary" size="sm" ariaLabel="Open Menu">
          <IconDotsThreeVertical />
        </IconButton>
      }
    />
  );
  // TODO: Consider making this a larger button with text desktop rather than a hamburger.
}
