import Resolver from "@forge/resolver";
import api, { route, Route } from "@forge/api";
import { ErrorOrValue } from "../support/ErrorOrValue";

interface JiraIssueFieldsSecurity {
  name: string;
}

interface JiraIssueFields {
  security: JiraIssueFieldsSecurity;
}

interface JiraIssue {
  fields: JiraIssueFields;
}

export type ReturnValueFromJira = ErrorOrValue<JiraIssue>;

class HelperMethods {
  public static async getDataFromJira(
    url: Route
  ): Promise<ReturnValueFromJira> {
    const response = await api.asUser().requestJira(url);

    if (response.ok) {
      return ErrorOrValue.createFromValue(await response.json());
    } else {
      return ErrorOrValue.createFromError(
        `Request failed with code ${response.status}`,
        `Request failed with code '${response.status}', body: '${await response.text()}'`
      );
    }
  }

  public static composeGetIssueUrlFieldSecurityUrl(issueKey: string) {
    // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get
    return route`/rest/api/3/issue/${issueKey}?fields=security`;
  }
}

export type ReturnType_getIssueSecurity = ErrorOrValue<string | null>;

export class ResolverHandlers {
  public static get getIssueSecurity__METHOD_NAME(): string {
    return "getIssueSecurity";
  }
}

const resolver = new Resolver();

resolver.define(
  ResolverHandlers.getIssueSecurity__METHOD_NAME,
  async (request): Promise<ReturnType_getIssueSecurity> => {
    const jiraKey = request.context.extension.issue.key;

    const getIssueUrl =
      HelperMethods.composeGetIssueUrlFieldSecurityUrl(jiraKey);
    const response = await HelperMethods.getDataFromJira(getIssueUrl);

    if (!response.isError()) {
      const security = response.value.fields.security;

      return ErrorOrValue.createFromValue(security?.name ?? null);
    } else {
      return ErrorOrValue.createFromErrorOther(response);
    }
  }
);

export const handler = resolver.getDefinitions();
