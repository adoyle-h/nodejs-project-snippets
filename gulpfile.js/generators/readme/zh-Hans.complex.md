# {{name}}

## 依赖 (Dependencies)

**务必各版本与下表一致**

| 名称                | 版本                                               |
| :--                 | :--                                                |
| node                | 见 package.json 的 engines                         |
| node third packages | 见 package.json 的 dependencies 和 devDependencies |
| npm                 | >= 2.7.4                                           |

## 版本（Versioning）

版本迭代遵循 SemVer 2.0.0 的规则。

*但是*，当主版本号是零（0.y.z），一切*随时*都可能有*不兼容的修改*。这处于开发初始阶段，其公共 API 是不稳定的。

关于 SemVer 的更多信息，请访问 http://semver.org/。

## 安装 (Installation)

1. 安装好上述依赖
2. 需要用到 `bower` 和 `gulp` 工具。执行 `npm install -g bower gulp` 来安装。
3. 在项目根目录执行以下步骤


## 配置 (Configuration)
创建`config/local.js`，用`module.exports = {}`的格式写本地的配置。  
不必完全拷贝`config/default.js`中的内容，只需写本地配置，local 会覆盖合并 default 的配置。

详见[node-config](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

## 启动 (Starting)

## 部署 (Deployment)

## 路由 (Routes & API EndPoints)

## TODO

## 提供问题或建议 (Bug & Suggestion)

在[这里](http://gitlab.widget-inc.com/her/her-gateway/issues)新建 Issue ，指派给对应的开发者，并根据内容打上对应的 Label

## 开发指南 (Contributing)

### 目录结构 (Directories Structure)

### npm 包管理
**注意** 本项目使用了 npm-shrinkwrap，当你变更了 `package.json`，你需要执行 `npm shrinkwrap` 来生成新的 `npm-shrinkwrap.json` 文件。
若没及时更新 `npm-shrinkwrap.json`，可能会导致 `npm install` 的时候不会安装新的包。

npm-shrinkwrap 是为了保证任何环境下，都使用同一套版本的第三方依赖。保持生产环境和开发环境的强一致。

### Git WorkFlow
#### 分支
| 名称                   | 描述                                                                               |
| :--                    | :--                                                                                |
| master                 | 生产环境分支。保护分支。这个分支上的每个节点都需要打 TAG，每个节点都是稳定可切换的 |
| develop                | 开发主分支。保护分支。项目主要维护者直接在这个分支上开发，其他开发者需要提 PR 审核 |
| feature/{feature-name} | feature 分支，多人合作时需要用正式的名称。中划线分隔                               |
| release                | 预发布分支。用于准备发布用的数据，更新 Readme、Version、ChangeLog 等等             |

以上都是公共分支，意味着绝对不可以更改重写 git 仓库的提交历史。  
对应的有私有分支，分支名随便写，建议使用 `{username}/{branch name}` 这种格式，方便区分是哪个人使用的分支。


## 版权声明（Copyright and License）

Copyright {{year}} ADoyle

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

See the NOTICE file distributed with this work for additional information regarding copyright ownership.
