---
title: Hexo-博客搭建
tags: 
  - 博客
  - 倒腾东东
slug: 26102
date: 2022-09-20 12:45:35
---

## 环境配置

### vercel部署

选择hexo模板使用[vercel](https://vercel.com/new)一键部署，会在GitHub下创建一个Rep。

![202207290641489](https://bu.dusays.com/2022/12/24/63a6b653b95d5.png)

### 本地环境

```go
git init
git remote add origin 仓库地址
git pull origin 分支

# ERROR Cannot find module 'hexo' from
npm install hexo --no-optional
hexo g
hexo s

# 同步stellar主题
git submodule add https://github.com/shixiaocaia/hexo-theme-stellar themes/stellar
```

### 又拍云部署

**[hexo-deployer-upyundeploy](https://github.com/abcdGJJ/hexo-deployer-upyun2019)**

安装npm

```yaml
npm install hexo-deployer-upyundeploy --save
```

站点文件修改

```yaml
deploy:
  - type: upyun
    serviceName: 服务名称
    operatorName: 操作员名称
    operatorPassword: 操作员密码
    path: / 上传目录(选填，默认为根目录)
```

IP 访问限制，开启

> 点击添加限制规则，资源路径：`/*`，限制策略：100 - 200 禁止 600 	秒，200 - 500 禁止 3600 秒，500 以上 86400 秒。

CC 防护，开启

> URI 匹配规则：`/*`，访问频率阈值：200 次，智能防护

强制HTTPS访问

> 上传SSL证书后勾选强制HTTPS访问，不然浏览器上提示怪烦的，SSL证书可以在域名提供商等多处免费获取。

## 主题修改

配置**_config.yml**，同时新建**_config.stellar.yml**，它的优先级>themes/stellar 文件下的config文件，所以主要修改_config.stellar.yml，保持原仓库文件不变。如果更新主题的css等样式，注意push到子仓库。

> 现在为了更好自定义主题，已将主题同步到自己仓库，缺点是主题修改是，需要自己手动对比不同版本代码，去一步步修改。

### waline配置

- 参考了[小鱼的文章](https://gregueria.icu/posts/decoration/)，包括使用到环境变量的添加
- 本次去除了评论者的UA等信息，详细看[waline使用文档下的环境变量](https://waline.js.org/reference/server.html#%E4%B8%BB%E8%A6%81%E9%85%8D%E7%BD%AE)
- 管理界面为`<serverURL>/ui/register `
- 添加表情包，目前将表情包图片直接放在了站点目录下

```yaml
emoji: 
    - https://cdn.jsdelivr.net/gh/norevi/blob-emoji-for-waline@2.0/blobs-gif
    - https://cdn.jsdelivr.net/gh/norevi/blob-emoji-for-waline@2.0/blobs-png
```

### 页面居中

改整体页面偏左为居中显示。

```go
#删除hexo-theme-stellar/source/css/_layout/main.styl

#Line 6 in 0c57544

 margin-right: "calc(2 * %s + %s)" % (var(--gap-l) var(--width-left)) 
```

### 页脚信息

通过修改footer.ejs文件，增添了hexo-wordcount的全站字数统计，但是默认只统计了post文件下的字数，考虑到专栏大部分是笔记等内容，不计入也罢，有一定内容的部分，会单独发出来也会计入，总体算是实现。

搬运了原hugo博客下，小球飞鱼写的计数，统计了建站的总日期，虽然在代码中间加入很丑，但是这样直接调用变量填入，让不懂前端的我，顺利实现了想要的效果。

```yaml
//修改footer.ejs文件
// footer
  el += '<div class="text">'; 
  el += '<div><span id="copyright"></span> <a href="https://github.com/shixiaocaia/">shixiaocaia </a> | Powered By Hexo | <a href="https://github.com/xaoxuu/hexo-theme-stellar/tree/1.8.0">Stellar</a></div>';  
  if (theme.footer.up_time) {
    el += '<div><span id="days"></span></div>';
  }
  

<script>
    function createtime() {
        var s1 = '2022-06-03';//设置为建站时间
        s1 = new Date(s1.replace(/-/g, "/"));
        s2 = new Date();
        var year = s2.getFullYear();
        var days = s2.getTime() - s1.getTime()+250;
        var number_of_days = parseInt(days / (1000 * 60 * 60 * 24));
        document.getElementById("days").innerHTML = "在宇宙中漂流了 " + number_of_days + " 天。";
        if(year == 2022){
           document.getElementById("copyright").innerHTML = "©" + "2022";
        }
        else{
           document.getElementById("copyright").innerHTML = "©" + "2022-" + year;
        }
        
    };
setInterval("createtime()",250);
</script>
```

最终效果如下：

![image-20220812220153033](https://bu.dusays.com/2022/12/24/63a6b65eac2ab.png)

### 链接名

修改_config.yml中的

```yaml
permalink: posts/:slug/
```

从而使得网页链接变为：

```html
https://hexo-beta-woad.vercel.app/posts/57513/
```

### 侧边栏[mastodon 动态小部件](https://github.com/mengrru/mastodon-on-blog)

一开始想用iframe引入，和主题的部分设定发生了冲突。遂直接引入了插件的index.html文件，注意要修改js，css文件的为自己的存放位置。以及注意css文件中设置overflow改为auto，否则会出现页面无法上下移动的问题。

> 感谢[吕楪](https://irithys.com/)的帮助！

最终实现效果：

{% image http://pic.shixiaocaia.fun/202209182301751.png bg:var(--card) padding:16px %}

## 一些问题

### 便笺部分，头标签重复

通过新建一个wiki，在_date 下的project中加了Notes wiki，生成便笺页面，但是会发现Notes 的title 是便笺这和页面的便笺标题发生冲突，如下面所示：

![](https://bu.dusays.com/2022/12/24/63a6b662d7627.png)

在_config.yml站点文件下添加：

```go
pretty_urls:
  trailing_index: false # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: true # Set to false to remove trailing '.html' from permalinks
```

### 最近更新排序不对

最近更新按照的时间顺序默认是编译下，在_config.yml站点文件下更改

```go
## updated_option supports 'mtime', 'date', 'empty'
updated_option: 'date'
```

### 申请SSL免费证书
**阿里云免费SSL证书**

本站域名是在阿里云注册的，阿里云提供20个免费的域名证书。

**又拍云**

目前博客部署在又拍云，又拍云也能提供多个免费的证书，在不绑定SSL证书，无法强制Https，此时会造成又拍云OSS上的图片无法正常显示。

### 图床

将网页的图标avatar等信息统一上传[杜老师的图床](https://7bu.top/)，提高了友链界面的访问速度，有一些朋友的图片是放在Github上套CDN的还是很慢。

本站暂时将其他的文件放到了又拍云OSS中，毕竟免费！通过picgo插件搭配typora体验良好，具体的食用方法，可以在网络中查到很多，这里不赘述。
