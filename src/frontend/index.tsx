import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Inline,
  Text,
  Tooltip,
  Icon,
  Spinner,
  Strong,
  Em,
  xcss,
  Box,
} from "@forge/react";
import { invoke, events } from "@forge/bridge";
import { ResolverHandlers, ReturnType_getIssueSecurity } from "../resolvers";
import { Logger } from "../logger/Logger";
import { ErrorOrValue } from "../support/ErrorOrValue";

type Return_getIssueSecurity = ErrorOrValue<Return_getIssueSecurity_T>;
type Return_getIssueSecurity_T = string | null;

class ResolverMethods {
  public static getIssueSecurity(): Promise<Return_getIssueSecurity> {
    return invoke<ReturnType_getIssueSecurity>(
      ResolverHandlers.getIssueSecurity__METHOD_NAME,
    )
      .then((issueSecurityValueFromResolver) => {
        return ErrorOrValue.createFromObject<Return_getIssueSecurity_T>(
          issueSecurityValueFromResolver,
        );
      })
      .then((issueSecurityValueFromResolver: Return_getIssueSecurity) => {
        if (issueSecurityValueFromResolver.isError()) {
          Logger.logError(
            "Error occurred during fetching issue security.",
            issueSecurityValueFromResolver,
          );
        }

        return issueSecurityValueFromResolver;
      });
  }
}

class Components {
  private static readonly redTextStyle = xcss({
    color: "color.text.accent.red",
  });

  private static buildActualValueComponent(value: string) {
    return (
      <Box xcss={Components.redTextStyle}>
        <Inline alignBlock="center">
          <Text>
            <Strong>{value}</Strong>
          </Text>
          <Icon glyph="lock" label="Lock" />
        </Inline>
      </Box>
    );
  }

  private static buildNullValueComponent() {
    return (
      <Inline alignBlock="center">
        <Text>
          <Em>None</Em>
        </Text>
        <Icon glyph="unlock" label="Unlock" />
      </Inline>
    );
  }

  private static buildErrorValueComponent(error: string) {
    return (
      <Inline alignBlock="center">
        <Icon glyph="error" label="Error" />
        <Text>
          <Em>{error}</Em>
        </Text>
        <Icon glyph="error" label="Error" />
      </Inline>
    );
  }

  public static buildValueComponent(
    dataValue: Return_getIssueSecurity | undefined,
  ) {
    if (dataValue?.isError()) {
      return Components.buildErrorValueComponent(dataValue.errorSimple);
    } else {
      const val = dataValue?.value;

      if (val === null) {
        return Components.buildNullValueComponent();
      } else if (val) {
        return Components.buildActualValueComponent(val);
      } else {
        return <Spinner label="loading" />;
      }
    }
  }
}

const App = () => {
  const [data, setData] = useState<Return_getIssueSecurity | undefined>(
    undefined,
  );

  events.on("JIRA_ISSUE_CHANGED", () => {
    setData(undefined);

    ResolverMethods.getIssueSecurity().then(setData);
  });

  useEffect(() => {
    ResolverMethods.getIssueSecurity().then(setData);
  }, []);

  return (
    <>
      <Tooltip content="To change this value, use the lock icon on the top right of the issue">
        {Components.buildValueComponent(data)}
      </Tooltip>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
