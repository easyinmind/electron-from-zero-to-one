import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
import "moment/locale/zh-cn";
import App from "./App";

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);
