# Security level (view) app for Atlassian Jira Cloud

This project is a atlassian Forge app which provides a custom field called "Security level (view). Its purpose is to show the actual value of the "Security level" field on view screen (when this custom field is placed on the view screen). It is read-only so on edit screens there will be nothing.

## How to build and install on your development cloud Jira

1. Install Node.js
2. Set up [Atlassian Forge](https://developer.atlassian.com/platform/forge/set-up-forge/)
3. Run `npm run build` and it has to finish successfully
4. Run `npm run forge-common:register` to get the app registered (it also generates new unique app id)
5. Run `npm run forge-development:build-deploy` to get the app deployed
6. Run `npm run forge-development:install` to get the app installed

For full redeploy use `npm run forge-development:build-redeploy` (or `npm run forge-development:build-deploy` might be enough in some cases)
