<h1 align="center">loongson-visual-debug-frontend</h1>

<em>
本项目是龙芯可视化调试系统的前端工程，使用前端框架Vue和组建库Element UI开发。
</em>

### 目录

- [环境依赖](#环境依赖)
- [快速开始](#快速开始)
- [相关技术](#相关技术)
- [Docker运行与部署🐳](#docker运行与部署)
- [项目文档](#项目文档)

## 环境依赖

- Nodejs
- npm

[官方下载地址](https://nodejs.org/en/download/)

## 快速开始

### 安装依赖库

```shell
npm install
```

如果提示错误，请安装合适的nodejs版本，开发时使用版本为`v14.19.1`，npm版本`v8.6.0`

### 更新后端接口地址

- 在运行本项目前，请务必先启动后端服务`loongson-visual-debug-backend`
- 更新接口地址

  修改文件`src/request/request.js`

    ```javascript
    export const ip = "10.2.5.5"
    export const basic_url = "http://" + ip + ":8000"
    export const basic_websocket = "ws://" + ip + ":8000/websocket/"
    ```
  > 修改ip为后端ip，并修改对应端口号

### 启动项目

```shell
npm run serve
```

### 打包项目

```shell
npm run build
```

项目打包后，生成`dist`文件夹，将文件夹下的内容可以通过`nginx`等Web服务器进行部署

## 相关技术

- Ajax
    - axios
- antv g6
- echarts
- markjs
- websocket

## Docker部署🐳

<em>构建docker镜像与容器，以移植和部署在其他机器上</em>

1. 构建docker镜像

```shell
cd loongson-visual-debug-frontend
docker build --force-rm -t loongson-visual-debug-frontend .
```

2. 运行

```shell
docker run \
    -p 8080:80 \
    -d \
    --name visual-debug-frontend \
    loongson-visual-debug-frontend
```

## 项目文档

(更新中...)