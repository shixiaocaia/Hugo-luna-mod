---
title: Hexo-Stellar简化 + Docsify搭建
tags: 
  - 博客
  - 倒腾东东
slug: 44623
date: 2022-09-25 23:09:15
---

## Stellar简化

当初从Hugo迁移回Hexo就是看上了stellar主题的wiki的结构，toc目录，一个个框架，看起来特别简洁舒服。

在使用Stellar主题后，我发布的内容，除了周记以外，主要还是用来记录笔记，复习使用，但由于stellar目前还不支持搜索功能，对于wiki下笔记内容的检索并不方便，恰好之前看到过[小鱼的搭建Docsify](https://gregueria.icu/posts/doclog/)的文章，可以看到Docsify是将markdown文件静态渲染，支持一定的插件，例如toc目录、评论、检索等功能，这满足了我做笔记的要求。

> 如果做了笔记，不去时常复习，就失去了笔记的意义。对于同一个知识点，在不同时间看到会带来不同的认知感受，经常回顾会有新的收获，并且也能更快捡起。

将笔记复习和嘟嘟的文章分开，感觉更加简洁轻松。于是下定决心去除了wiki内的笔记文章，搬移到Docsify中，到后面边复习笔记内容，边迁移。

说干就干！

menu调整，去除菜单按钮的[专栏]，增加[友链]。

调整友链界面的信息，将其改为

```yaml
---
menu_id: friend
seo_title: 友链
header: false
---
```

调整后

![](https://bu.dusays.com/2022/12/24/63a6b61144815.png)

修改about界面的内容标签，将wiki下的笔记全部备份好，准备后面边复习边迁移。

现在博客的界面（其实也看不出改变）。其实除了我自己还有谁会没事看我CS笔记呢hhh...，也不知道为什么自己站点地图提交谷歌并没有识别，加上中文在谷歌下的优先级应该不高，所以更加没人看了。

![](https://bu.dusays.com/2022/12/24/63a6b613e43dd.png)

## Docsify

从六七月倒腾完后，现在真的想一切从简，先好好记录，倒腾完什么都不做的话也是枉然。直接去使用了开源大佬[MurphyChen](https://docs.mphy.top/#/)的文件，作者将主要的插件都配置完成了，基本可以开箱即用，只要我们自己做出删删减减。

更多的插件，以及主题修改，热爱折腾的请参考[Docsify中文文档](https://docsify.js.org/#/zh-cn/)。

除了主要信息的更替，因为主要作为个人站点笔记，于是把评论功能去除了，更加轻巧。

**常用的命令**

```yaml
npm i docsify-cli -g //全局安装Docsify-cli
docsify init ./docs //初始化
docsify serve docs  //本地预览
```

**语法**

```yaml
!> //强调语法，类似markdown的双星强调
?> //提示语法
```

后续再稍微熟悉下文章子目录设置即可。

哦对了直接将文件放到**Onedrive**，实现了双备份！不怕丢失！

**部署**

可以直接将文件放到Github中，然后使用我们的老朋友vercel一键部署！最后绑定自己的子域名，新的~~玩具~~就出来啦！🔗[站点链接](https://docsify.shixiaocaia.fun)

**问题**

在CPP代码高亮渲染时，直接引入官方文档中的`prism-cpp.min.js`，会出现错误，这里不具体列出图，应该同时引入c和cpp的CDN就不会出错了。

```yaml
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-c.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-cpp.min.js"></script>
```

