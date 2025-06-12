#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { getServerConfig } from "./config.js";
import { startHttpServer } from "./server.js";
import { createServer } from "./mcp.js";

const currentfile = import.meta.url; // 当前文件的 URL，会以 file:// 协议开头
const __filename = fileURLToPath(currentfile); // 当前文件绝对路径
const __dirname = dirname(__filename); // 当前文件所在目录绝对路径

// Load .env from the current working directory
config({ path: resolve(__dirname, "../.env") });
console.log(process.env.APIPOST_BASE_URL);

export async function startServer() {
  // Check if we're running in stdio mode (e.g., via CLI)
  const isStdioMode =
    process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

  const config = getServerConfig(isStdioMode);

  const server = createServer(config, {
    isHTTP: !isStdioMode,
    outputFormat: config.outputFormat,
  });

  if (isStdioMode) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    console.log(
      `Initializing Figma MCP Server in HTTP mode on port ${config.port}...`
    );
    await startHttpServer(config.port, server);
  }
}

// If we're being executed directly (not imported), start the server
if (process.argv[1]) {
  startServer().catch(error => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
