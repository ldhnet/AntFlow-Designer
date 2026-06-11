<p align="center" style="margin-bottom: 0 !important">
	<img alt="logo" src="https://env-00jy6aujr8eq.normal.cloudstatic.cn/antflow/images/logo.png"  width = 20%;>
</p>

## 基于 Vue3 + ElementPlus 的独立流程设计器

- [![star](https://gitee.com/ldhnet/Antflow-Designer/badge/star.svg?theme=dark)](https://gitee.com/ldhnet/Antflow-Designer/stargazers) [![fork](https://gitee.com/ldhnet/Antflow-Designer/badge/fork.svg?theme=dark)](https://gitee.com/ldhnet/Antflow-Designer/members)

- 成品案例 [预览入口](http://antflow.top/admin/)
- 集成若依案例 [预览入口](http://antflow.top/mate/)
- 独立流程设计器 [预览入口](http://antflow.top/design/)
- 项目文档 [wiki 入口](https://gitee.com/ldhnet/Antflow-Designer/wikis)
- 流程设计器地址 [Gitee 仓库](https://gitee.com/ldhnet/Antflow-Designer) | [GitHub 仓库](https://github.com/ldhnet/Antflow-Designer) | [GitCode 仓库](https://gitcode.com/ldhnet/Antflow-Designer/overview)
- Antflow 项目地址 [Gitee 仓库](https://gitee.com/tylerzhou/Antflow) | [Github 仓库](https://github.com/mrtylerzhou/Antflow) | [GitCode 仓库](https://gitcode.com/zypqqgc/Antflow/overview)

- QQ 技术交流群（972107977） 期待您的加入
- 联系作者 QQ574427343 或者邮箱 574427343@qq.com
- 有疑问/建议可以 Issues 留言，我们会认真对待 [issues 地址](https://gitee.com/ldhnet/Antflow-Designer/issues)

## 项目介绍

- UI 钉钉风格
- 技术点<br />
  1、组件自调用+递归处理，按树状结局处理审批流程问题<br />
  2、接入 VForm3 低代码表单实现【零】编码发起工作流<br />
  3、本项目流程设计器，方便集成到现有项目中或者二次开发<br />
- 流程设计器<br />
  1、节点操作：流程节点（添加、修改、删除)。<br />
  2、节点设置：包括审批人、发起人、抄送人、条件设置。<br />
  3、条件节点：选择条件类型，自定义配置条件判断值。<br />
  4、审批节点：选择需要审批的人员、角色、或部门。<br />
  5、抄送节点：选择抄送到的人员、角色、或部门。<br />
  6、错误校验: 对流程节点参数的校验。<br />
  7、流程发布: 当前配置流程提交到 Api 接口。<br />

## 演示图

![](https://antflow.top/file/preview/4.png)
![](https://antflow.top/file/preview/5.png)

---

## 项目源码

| 项目     | Gitee                                                         | Github                                                         | GitCode                                                              |
| -------- | ------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| 设计器   | [Antflow-Designer](https://gitee.com/ldhnet/Antflow-Designer) | [Antflow-Designer](https://github.com/ldhnet/Antflow-Designer) | [Antflow-Designer](https://gitcode.com/ldhnet/FlowDesigner/overview) |
| 成品项目 | [Antflow](https://gitee.com/tylerzhou/Antflow)                | [Antflow](https://github.com/mrtylerzhou/Antflow)              | [Antflow](https://gitcode.com/zypqqgc/Antflow/overview)              |

#### 项目运行 node20.19.4 以上版本

> 温馨提示：由于项目升级了 vite7.1.1 版本，所以需要 node20.19.4 以上版本。如果需要使用低版本 nodejs 可以降级 vite 与 vitejs/plugin-vue 这两个依赖版本即可

> 1.下载项目 git clone https://gitee.com/ldhnet/Antflow-Designer.git

> 2.环境依赖 `npm  install --registry=https://registry.npmmirror.com`

> 3.本地运行 `npm run dev`

> 4.打包运行 `npm run build`

## 捐赠支持

😀 你可以请作者喝杯咖啡表示鼓励

- 有捐赠的小伙伴（金额不限）可以联系作者领取一份 **独家提升开发技能的文档**
- 加 QQ574427343 或者邮件到 574427343@qq.com邮箱 _注明 领取开发技能提升文档_
- 文档宗旨在于提升初级、中级、高级等一线开发人员的编码意识，讲述**什么是好代码**，好代码的标准，**如何编写高质量代码**等
<table>
    <tr>
        <td><img src="https://antflow.top/file/pay/wxpay.jpg"/></td>
        <td><img src="https://antflow.top/file/pay/alipay.jpg"/></td>
    </tr>  
</table>

## 好书推荐

大家在使用本项目时，推荐结合贺波老师的书
[《深入 Flowable 流程引擎：核心原理与高阶实战》](https://item.jd.com/14804836.html)学习。这本书得到了 Flowable 创始人 Tijs Rademakers 亲笔作序推荐，对系统学习和深入掌握 Flowable 的用法非常有帮助。

> flowable 源于 activiti,很多核心表,核心 api 和设计模式都是一样的.读 flowable 的书同样也可以用在 activiti 上

![图书image](https://gitee.com/tylerzhou/Antflow/raw/master/doc/images/flowablebook.jpg)
