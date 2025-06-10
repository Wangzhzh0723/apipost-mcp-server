# APIPost MCP Server

一个用于从APIPost获取API信息的服务器，专为大型语言模型设计。

## 项目说明

这个项目使用Rollup作为构建工具，将TypeScript代码编译为ESM格式的JavaScript。

## 安装

```bash
npm install
# 或
yarn
```

## 开发

```bash
npm run dev
# 或
yarn dev
```

这将启动开发模式，使用Rollup构建代码并监视文件变化，然后运行CLI。

## 构建

```bash
npm run build
# 或
yarn build
```

这将使用Rollup构建项目，输出文件将位于`dist`目录中。

## 启动服务器

```bash
npm start
# 或
yarn start
```

## 配置

项目使用`.env`文件进行配置，请确保在项目根目录创建此文件。

## Rollup配置说明

项目使用Rollup进行构建，主要配置如下：

- 入口文件：`src/index.ts`和`src/cli.ts`
- 输出格式：ESM
- 输出目录：`dist`
- 开发模式下不压缩代码，生产模式下使用terser压缩
- 支持环境变量注入

原tsup配置已转换为等效的Rollup配置，保持了相同的功能。