# APIPost MCP Server

一个用于从 APIPost 获取 API 信息的服务器，专为大型语言模型（LLM）设计，基于 Model Context Protocol (MCP)协议实现。

## 功能介绍

APIPost MCP Server 提供了一个中间层服务，允许大型语言模型通过 MCP 协议与 APIPost 平台进行交互，获取 API 文档和详细信息。主要功能包括：

- 支持通过 issue ID 和 target ID 获取 APIPost 上的 API 详细信息
- 提供多种连接方式：HTTP、SSE 和标准输入输出(stdio)
- 支持 MCP 协议的会话管理和进度通知
- 可作为独立服务运行或集成到其他应用中

## 配置

```
# APIPost 配置
APIPOST_API_TOKEN=你的APIPost API令牌
APIPOST_BASE_URL=https://open.apipost.net

```

### 配置项说明

- `APIPOST_API_TOKEN`: 必需，APIPost 的 API 访问令牌，在项目中获取，【项目】=》【项目设置】=》【OpenAPI】=》【新建】
- `APIPOST_BASE_URL`: APIPost 开放 API 的基础 URL，默认为`https://open.apipost.net`，可选

## 在 AI 编辑器中配置使用方式

在 AI 编辑器中，如 Cursor、Trae，添加以下配置：

```json
{
  "mcpServers": {
    "apipost sse mcp": {
      "command": "npx",
      "args": ["-y", "apipost-mcp-server", "--stdio"],
      "env": {
        "APIPOST_API_TOKEN": "你的APIPost API 项目令牌"
      }
    }
  }
}
```

## 可用工具

服务器提供以下 MCP 工具：

### get_apipost_api_data

获取 APIPost 上的 API 信息。

参数：

- `issueId`: 文档 ID，通常在 URL 中如 https://doc.apipost.net/docs/detail/<issueId>?...
- `targetId`: 目标 API 的 ID，通常作为 URL 参数 target_id=<targetId>

## 许可证

MIT

```

```
