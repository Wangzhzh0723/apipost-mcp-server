import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Logger } from "./utils/logger.js";

const serverInfo = {
  name: "ApiPost MCP Server",
  version: process.env.NPM_PACKAGE_VERSION ?? "unknown",
};

function createServer(config, { isHTTP = false } = {}) {
  const server = new McpServer(serverInfo);
  registerTools(server, config);

  Logger.isHTTP = isHTTP;

  return server;
}

function registerTools(server, config) {
  // Tool to get api information
  server.tool(
    "get_apipost_api_data",
    "Obtain API information on apipost based on the provided issue ID and target ID",
    {
      issueId: z
        .string()
        .describe(
          "The key of the issue id to fetch, often found in a provided URL like https://doc.apipost.net/docs/detail/<issueId>?..."
        ),
      targetId: z
        .string()
        .describe(
          "The key of the target id to fetch, often found as URL parameter target_id=<targetId>, always use if provided"
        ),
    },
    async ({ issueId, targetId }) => {
      try {
        Logger.log(`Obtain project info by issue id: ${issueId}`);
        let APIPOST_DOC_URL = process.env.APIPOST_DOC_URL;
        if (!APIPOST_DOC_URL) {
          APIPOST_DOC_URL = process.env.APIPOST_BASE_URL?.replace(
            "//open.",
            "//doc."
          );
        }
        const projectResponse = await fetch(
          `${APIPOST_DOC_URL}/doc/preview?issue_id=${issueId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "api-token": config.apipostApiToken,
            },
          }
        ).then(res => res.json());

        const projectId = projectResponse.data.project_id;
        Logger.log(
          `Obtain ${projectResponse.data.list.find(
            i => i.target_id === targetId
          )} api info by target id: ${targetId}`
        );
        const response = await fetch(
          `${process.env.APIPOST_BASE_URL}/open/apis/details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-token": config.apipostApiToken,
            },
            body: JSON.stringify({
              project_id: projectId,
              target_ids: [targetId],
            }),
          }
        ).then(res => res.json());

        Logger.log(`Successfully fetched api: ${targetId}`);

        const result = response.data.list[0];

        const formattedResult = JSON.stringify(result, null, 2);

        Logger.log("Sending result to client");
        return {
          content: [{ type: "text", text: formattedResult }],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : JSON.stringify(error);
        Logger.error(`Error fetching api:`, message);
        return {
          isError: true,
          content: [{ type: "text", text: `Error fetching api: ${message}` }],
        };
      }
    }
  );
}

export { createServer };
