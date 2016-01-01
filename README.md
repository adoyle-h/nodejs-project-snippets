# NodeJS Project Snippets

> 如果说我看得比别人更远些，那是因为我站在巨人的肩膀上。  ——艾萨克·牛顿

本项目它不是一套框架，也不是类库。只不过是使用了各种第三方库，并结合我的经验，总结出的一套模块化，松耦合的代码集合。

所以根据你的需要选择模块，直接复制文件到你的项目，略作调整即可使用。

这些模块都带有强烈的个人风格，也许有些地方你不喜欢。模块内部结构很简单，你可以很容易地进行修改和扩展，以符合你的需求。

## 为什么要写这个？

我不想再造一个框架。从 express、koa 这种轻量级框架，到 hapi、sails、MEAN 这些重量级框架，又或者 meteor 这种全栈框架。它们都很不错，每个框架各有特点。有些人会被其中的某些优秀的特性所吸引，有些人又会因为某些糟糕设计而放弃它。  
为何不能取其精华，去其糟粕呢？

然而我也不想造一个类库。我觉得写类库要考虑很多通用性设计，更灵活，更符合不同场景所需。这个会耗费我太多时间了。

而这个项目里的代码，主要是一些代码组织的思路，和一些经过二次封装的类库。  
所以我只是想总结自己的代码片段，把好的东西抽离出来放在一个目录或者文件里。各位若觉得好用，拿过去改改便是。几个文件几个模块凑一起，说不定能拼出一个框架来。  
自定义框架是最好的，因为那是依照你的需求搭建出来的，不会有多余的东西，使用起来也很灵活。

## 模块

每个模块都是开箱即用的，有些模块暴露一个统一的配置接口 `init`。有些模块没有这个接口，直接复制代码就可以用。

以下是各个模块的说明。

### 模块加载（include）

- 目的: 为了取代 `require('../../xxx')` 这种写法，相对路径不利于重构且容易写错。
- 主要文件: include.js
- 依赖: 无
- 第三方依赖: rfr, lodash

建议放置在项目根目录下

### 日志（log）

- 目的: 使用 Winston
- 主要文件: log/
- 依赖: config
- 第三方依赖: npm i --save winston pretty-error lodash sprintf-js bytes cli-color

### 配置（config）

- 目的: 二次封装 node-config
- 主要文件: config.js, config/
- 依赖: 无
- 第三方依赖: npm i --save node-config

建议 `config/` 目录放置在项目根目录下

### 子配置（sub_config）

- 目的: 为了让子模块能够管理自身的配置。

该部分已独立成类库 [config-sp](https://github.com/adoyle-h/config-sp)

### 自动化（gulp）

- 目的: 模块化 gulp 任务，拿来即用，无用则删。
- 思路/特性: 将 gulp 任务拆分成各个单元，每个单元集合功能类似的子任务。一个单元完成其所有子任务。也能够单独调用子任务。
- 主要文件: gulpfile.js/
- 第三方依赖: npm i --save-dev minimist gulp config-sp, 其他第三方依赖见 gulpfile.js/require.js

必须放置在项目根目录下

### 自动化构建（scaffolding && generate）

- 目的: 自动化构建代码片段和目录结构，能够在项目生命周期中一直使用。
- 主要文件: gulpfile.js/tasks/generate.js, gulpfile.js/generators/
- 依赖: gulpfile.js/
- 第三方依赖: gulp

实际上利用 gulp 来实现构建，每个构建任务就是一个 gulp 任务。  
每个 gulp 任务的名字必须以 "generator:" 开头。

执行 `gulp g -m <generator name> <args>` 以执行指定任务。  
`<generator name>` 为构建的任务名称，这里只需要输入 "generator:" 后面的名字就行了。  
`<args>` 为任务的参数，根据每个任务的实际要求来传。

其实这个跟 yeoman、slush 类似，只是这两个工具需要将构建任务打包发布。  
而在项目构建过程中，构建的代码必然也需要随时修改的。所以利用 gulp 自身来完成构建任务，更灵活且易修改。

### 工具（util）

- 目的: 提供一系列辅助函数，提高编码效率
- 思路/特性:
    - 基于 lodash。将 mixin 拆分成多个文件，由核心函数、第三方工具、自定义函数组成，能控制顺序，分层管理。
    - 自动检测是否有重名函数，帮助整合各个 util 函数。
    - 取自己所需的，不要的可以轻松移除。
- 主要文件: util/
- 依赖: include, assert
- 第三方依赖: npm i --save lodash, 其他第三方依赖见 util/third_party.js

### 测试（test）

- 目的: 基于 mocha 创建一整套测试流程框架
- 思路/特性:
    - 插件化测试套件
    - 分层测试（单元测试、集成测试、端到端测试）
- 主要文件: test/
- 第三方依赖: npm i --save walkdir && npm i --save-dev mocha should chai config-sp

建议放置在项目根目录下

### 控制台（repl）

- 目的: 增强 node repl，简化操作，方便调试。
- 思路/特性: 预加载依赖文件，启动程序等等。
- 主要文件: repl/
- 依赖: include, util, consts, config, log
- 第三方依赖: npm i --save shelljs lodash

建议放置在项目根目录下

### 常量（consts）

- 目的: 在一个文件中维护所有通用的常量
- 思路/特性: 无
- 主要文件: consts.js
- 依赖: 无
- 第三方依赖: 无

### 代码风格（eslint）

- 目的: 统一编码风格，让所有代码看起来像是一个人写的
- 思路/特性: 基于 airbnb/javascript
- 主要文件: .eslintrc, .eslintignore
- 依赖: 无
- 第三方依赖: 无

### 验证（validator）

- 目的: 验证函数传入的实参
- 主要文件: validator.js
- 第三方依赖: npm i --save joi lodash

### 应用程序（app）

- 目的: 建立一套应用的公共接口，方便应用模块化、流程化。
- 主要文件: app.js
- 依赖: include, log, config
- 第三方依赖: npm i --save wodule

建议放置在项目根目录下

### gitignore

- 目的: 项目中不应该存到 git 仓库里的文件
- 主要文件: .gitignore
- 依赖: 无
- 第三方依赖: 无

## 版本（Version）

本项目遵循 [Semver 2.0.0][Semver] 规则

## 反馈问题或建议（Bug & Suggestion）

欢迎使用 [Issue][] 提意见或者反馈 BUG

## 如何做贡献（Contributing）

本项目不接受 Pull Request，如果你有什么好的想法，或者改进的建议，请使用 [Issue][] 与我探讨。

其余修改请 fork 本项目，打造属于你自己的 NodeJS Project Snippets 吧。

## 版权声明（License）

本项目代码遵循 BSD 3-clause License，具体请看 [LICENSE][] 文件的内容。

<!-- 链接 -->

[Semver]: http://semver.org/lang/zh-CN/
[Issue]: https://github.com/adoyle-h/nodejs-project-snippets/issues
[LICENSE]: ./LICENSE
