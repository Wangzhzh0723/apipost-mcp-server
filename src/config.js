import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Load environment variables from .env file
config();

export function getServerConfig(isStdioMode) {
  // Parse command line arguments
  const argv = yargs(hideBin(process.argv))
    .options({
      "apipost-api-token": {
        type: "string",
        description: "APIPOST API Token (Personal Access Token)",
      },
      port: {
        type: "number",
        description: "Port to run the server on",
      },
    })
    .help()
    .version(process.env.NPM_PACKAGE_VERSION ?? "unknown")
    .parseSync();

  const config = {
    port: 6677,
  };

  // Handle APIPOST_API_TOKEN
  if (argv["apipost-api-token"]) {
    config.apipostApiToken = argv["apipost-api-token"];
  } else if (process.env.APIPOST_API_TOKEN) {
    config.apipostApiToken = process.env.APIPOST_API_TOKEN;
  }

  // Handle PORT
  if (argv.port) {
    config.port = argv.port;
  } else if (process.env.PORT) {
    config.port = parseInt(process.env.PORT, 10);
  }

  // Log configuration sources
  if (!isStdioMode) {
    console.log("\nConfiguration:");

    console.log(`- APIPOST-API-TOKEN: ${config.apipostApiToken}`);
    console.log(`- PORT: ${config.port}`);

    console.log(); // Empty line for better readability
  }

  return config;
}
