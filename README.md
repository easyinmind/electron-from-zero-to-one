### 搭建流程

1. 创建 React 项目 `create-react-app`
2. 安装 electron 依赖 `yarn add electron -D`
3. 创建 [main.js](./main.js)
4. 增加 [package](./package.json) 启动入口 main.js 及 增加调整 scripts 命令

   ```
   "main": "main.js"

   "start-render": "react-scripts start"
   "start-main": "electron ."
   ```

   _运行 npm run start-render 和 npm run start-main_

5. 安装 concurrently 、 wait-on 、 cross-env `yarn add concurrently wait-on cross-env -D`

   > 不使用 npm run start-render && npm run start-main 是因为 npm run start-render 内有监听会阻塞  
   > 添加 `"start": "concurrently 'wait-on http://localhost:3000 && npm run start-main' 'cross-env BROWSER=none npm start-render'"`

   _修改代码可以看到应用内渲染进程更新（CRA），如何监听主进程更新_

6. 安装 nodemon `yarn global add nodemon`

   > 调整 `"start-main": "nodemon --watch main.js --exec electron ."`

7. 打包 `yarn add election-build -D` `yarn add electron-is-dev`

   > package 增加 build 配置 增加 pack dist, main.js 增加 dev 环境区分

   ```
   "pack": "electron-builder --dir",
   "dist": "electron-builder"
   ```

   ##### 针对打包报错的解决方案

   1. > 打包报错 Application entry file "build/electron.js" in the "/Users/yjq/code/share/dist/mac/easy.app/Contents/Resources/app.asar" does not exist. Seems like a wrong configuration

      > 当时用 react cra 时（react-scripts），electron-build 会预设默认入口为 build/electron.js

      > 解决： 关闭预设 "extends": null

   2. > 打包报错 无法找到 electron-is-dev

      > 因为 dev 依赖不会打包进应用

      > 解决 `yarn add electron-is-dev`

   3. > 调试窗报错 Not allowed to load local resource： ...

      > cra 默认打包目录是 build，electron-build 默认以 build 做为 pack 过程中生成安装包的静态资源目录，不需要打包在应用程序中

      > 解决 手动指定打包目录 设置 build 的 files(需要打包的文件)

      ```
      "build/**/*",
      "node_modules/**/*",
      "main.js",
      "package.json"
      ```

   4. > 调试窗报错 Failed to load resource: net::ERR_FILE_NOT_FOUND

      > build-render 打包出来的文件默认使用的绝对路径 导致找不到 css js

      > 调整打包路径为相对路径

      ```
      "homepage": "./"
      ```

8. 打包优化
   1. 优化 node_modules 文件 调整 dependencies（非必须的依赖放到 devDependencies，不打包进应用）
   2. 优化 main.js（打包优化）
