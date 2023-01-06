---
title: "Hugo-Luna主题装修指南"
date: 2023-01-03T21:21:04+08:00
slug: 7aee45b6
featured_image: cover.webp
tags:
  - 博客
  - 倒腾东东
---

> 新年新气象，换了新主题 Hugo Luna !

<!--more-->

最先看到这个主题，是才开始折腾博客的时候，是使用[Hugo MEME](https://github.com/reuixiy/hugo-theme-meme)主题，然后通过友链间接着访问，看到了[小鱼的博客](https://gregueria.icu/)是使用[Hugo MEME](https://github.com/Ice-Hazymoon/hugo-theme-luna)主题的，当时就很喜欢了。

本次博客装修也是基本参考了她的[装修日记](https://gregueria.icu/posts/hugo-luna/)。

## Thanks for all the fish

先列出[小鱼装修日记](https://gregueria.icu/posts/hugo-luna/)中已经提及的修改。

- 主题安装
- 全站字数统计
- 把文末的 Licences 全部删掉
- Waline 评论区配置
- 表情包大小
- 首页卡片
- 卡片中的 Summary 变量改为 Description
- 阅读时间改为字数统计
- 文章题图
- 页尾运行时间

以上的内容优先参考小鱼的内容。

## 修改文章链接显示

```shell
permalinks:
  # 文章链接的格式
  posts: /posts/:slug
  pages: /:slug.html # about.html
```

修改`archetypes\default.md`生成文章的默认模板为：

```shell
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}
draft: false
featured_image: cover.jpg
tags:
  - 默认
```

新建文章时，可以随机生成slug，替代原来的XXX.html后缀。

原来使用hexo 的`arrblink`标签值可以直接替换为`slug`。

## 标签链接修正

分别修改`\layouts\partials\article\components\info.html`和`\layouts\partials\article-list\info.html`.

将其中的`<a href="{{- "/tags/" | relLangURL -}}{{- . | urlize -}}" title="{{- . -}}"`

替换为`<a href="{{- "/tags/" | relLangURL -}}{{- . | urlize -}}{{- "/" -}}" title="{{- . -}}"`。

这样部署到OSS之类中，不会出现tags标签因为`/123`，的跳转错误。

## Cover，Album

在Luna中想要给文章增加封面，以及使用shortcode的`Gallery`时，注意需要新建一个文件夹，将文档名改为`index.md`，然后直接引用本地图片，而不是使用图床图片。

> 否则无法渲染，会出现错误。

## 使用upx-upyun

在使用hexo时，有`hexo-deployer-upyun-purge`，配合一个`.bat`脚本完成博客部署到upyun。

搜索hugo没有直接发现相关的插件，最终找到了[upx](https://github.com/upyun/upx)，配合一个`.bat`脚本实现博客部署到upyun中。

> 本着能白嫖就白嫖的思路，一定要使用！比单纯放在Github上要快很多，就是需要域名备案。

基本思路就是

1. `hugo`命令生成public文件夹，注意每次需要新生成。
2. upx命令`upx.exe sync D:\Code\Hugo-Luna\public`同步public文件夹。

```c
// upx 基本使用
// 登录方式一
upx-windows-amd64-v0.1.4.exe login
// 依次输入服务名、操作员、操作员的密码
ServiceName: <bucket>
Operator: <operator>
Password: <operator_password>
    
// 上传文件
upx-windows-amd64-v0.1.4.exe put <本地路径> <云存储路径>    

// 增量文件同步,加 -v,显示增量文件同步过程信息
upx-windows-amd64-v0.1.4.exe sync <本地目录> <云存储目录> -v
    
//.bat脚本上传
hugo
cd upx
upx.exe sync D:\Code\Hugo-Luna\public
pause    
```

## 豆瓣标签

{{< douban src="https://book.douban.com/subject/36089534/" >}}

{{< douban src="https://movie.douban.com/subject/35275350/" >}}

在`layouts\shortcodes`里新建`douban.html`，并贴入以下code:

```html
<!DOCTYPE HTML>
<html lang="en">
<head>
    <title></title>
    <style>
        .post-preview {
            max-width: 780px;
            height: 200px;
            margin: 1em auto;
            position: relative;
            display: flex;
            /*background: #eee;*/
            background: var(--entry);
            border-radius: 15px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .25), 0 0 2px rgba(0, 0, 0, .25);
        }

        .dark .post-preview {
            /*background: #383838;*/
            background: var(--entry);
            box-shadow: 0 2px 4px rgba(0, 0, 0, .5), 0 0 2px rgba(0, 0, 0, .5);
        }

        .post-preview--meta {
            width: 80%;
            padding: 23px;
            overflow: hidden;
        }

        .post-preview--middle {
            line-height: 28px;
        }

        .post-preview--title {
            font-size: 20px;
            margin: 0 !important;
        }

        .post-preview--title a {
            text-decoration: none;
        }

        .post-preview--date {
            font-size: 12px;
            color: #999;
        }

        .post-preview--excerpt {
            font-size: 14px;
            line-height: 1.825;
        }

        .post-preview--excerpt p {
            display: hidden;
            margin: 0;
			line-height: 1.825;
        }

        .post-preview--image {
            height: 200px !important;
            width: 25% !important;
            float: right;
            border-radius: 0 15px 15px 0;
			margin-top: 0rem !important;
        }

        .post-preview img {
            margin: unset;
            width: 20%;
            border-radius: 0 15px 15px 0;
        }

        @media (max-width: 550px) {
            .post-preview {
                width: 95%;
            }

            .post-preview--excerpt {
                display: none;
            }

            .post-preview--middle {
                line-height: 19px;
            }
        }

        .rating {
            display: block;
            line-height: 15px;
        }

        .rating-star {
            display: inline-block;
            width: 75px;
            height: 15px;
            background-repeat: no-repeat;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAClCAYAAAAUAAAYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA5xJREFUeNrs3T9rFEEcxvG7qEQIglaCICKkin9AUEtBKxU7wS61VlYivgWj70TtNFj5BqzE7qxEWwsxKIoYn4UtluFmbm8nczvzm+/BjxyuDwNzu3uXD0+46f7LC5PA45Hm+WTYw1x2LRDc0jzTXB+wqMlsaLPutz8fDFjYZHYauAz3NBvt83XNnyUWNpn1nVm3OsHmsb3EomazzZnVXKMPNcc0xzUnNKc0Rzv/77fms+Z7O3vt9b1eU7bZrNN68l5zcolX4ofmsuZXTdnmMvyi2dR86Bmcac62P6vKrnVubpc0bxYE32nOab45N8YqsvPeDfcD4SOav4HjprPuu+H5BTt9LXDMfNbdLPfT678Fx6vKupt1o/O8+R3pkOaJ5/iktqx7z/qp+aq5q/nY+fczmheaK03Gs7D5rLtZdzSvA6/Ebc2u55j57HQB0TzW7AzkjiKzny6+2hlKNE8juMNcFqKBaIZndRlCNBBNgmx7ZkE0fbLtZkE0EA1EM17WuQwhGogGooFoss6296y52cNO+J6HLJoPaFdbsvA9zGerIxrPh85eWYgGooFoDiQbuAxp0UA0EVmdWbRo+ma1WbRoIBqIZtzsnHdDWjQQDUQD0WSbde5ZS2UhmtqJJtSEiVkXooFoIJre2VATJmZdiKZ2ogk1YSb8oVMvDeUPnSAaiCaPJkzMuhANRAPRQDQpsqEmTMy6EI11oolpwkA0EA1EcyDZmCYMRAPR+LMxTZjqiCamCQPRQDQQzehNGIgGooFoIJpVZ2OaMBBN7USTqgkD0UA0EE3vbKomDERTO9GkasKYJJpUTRiIBqKBaEZvwkA0EA1EA9GkyKZqwkA01olmrCYMRAPRQDR9LkO+0QmiKbAJUyTRjNWEgWggGohm9CYMRAPRQDQQzZDsWE0YiMYC0eTYhIFoIJrKiCbHJgxEY4FocmzCZEs0OTZhIBqIpjKiybEJA9FANBANROPL5tiEgWhKIJoSmzAQDURjjGhKbMJANCUQTYlNmNGIpsQmDEQD0RgjmhKbMBANRAPR1Es0JTZhIJpciMZaEwaigWgKJBprTRiIJheisdaESUo01powEA1EUyDRWGvCQDQQDURjm2isNWEgmlURzWw2q4pZIBqIJkOiCVyGJpkFolkV0ejMMvel28mIRptl7ku3IRqIpjCimfNuaJpZIBqIBqIpm2ice5Z5ZonJupvVkMRu4JW4qXnrOWY++1+AAQBw9BJSCTeN9wAAAABJRU5ErkJggg==);
            overflow: hidden;
        }

        .allstar10 {
            background-position: 0px 0px;
        }

        .allstar9 {
            background-position: 0px -15px;
        }

        .allstar8 {
            background-position: 0px -30px;
        }

        .allstar7 {
            background-position: 0px -45px;
        }

        .allstar6 {
            background-position: 0px -60px;
        }

        .allstar5 {
            background-position: 0px -75px;
        }

        .allstar4 {
            background-position: 0px -90px;
        }

        .allstar3 {
            background-position: 0px -105px;
        }

        .allstar2 {
            background-position: 0px -120px;
        }

        .allstar1 {
            background-position: 0px -135px;
        }

        .allstar0 {
            background-position: 0px -150px;
        }


        .rating-average {
            color: #777;
            display: inline-block;
            font-size: 13px;
            margin-left: 10px;
        }
    </style>
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"
            integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('.douban_item').each(function () {
                var _this = $(this);
                var strs = _this.attr('urlstring').toString();
                var db_reg = /^https\:\/\/(movie|book)\.douban\.com\/subject\/([0-9]+)\/?/;
                if (db_reg.test(strs)) {
                    var db_type = strs.replace(db_reg, "$1");
                    var db_id = strs.replace(db_reg, "$2").toString();
                    var db_api = "https://douban.edui.fun/";
                    if (db_type === 'movie') {
                        var ls_item = 'movie' + db_id;
                        var url = db_api + "movies/" + db_id;
                        if (localStorage.getItem(ls_item) == null || localStorage.getItem(ls_item) === 'undefined') {
                            $.ajax({
                                url: url, type: 'GET', dataType: "json", success: function (data) {
                                    localStorage.setItem(ls_item, JSON.stringify(data));
                                    movieShow(_this, ls_item, strs)
                                }
                            })
                        } else {
                            movieShow(_this, ls_item, strs)
                        }
                    } else if (db_type === 'book') {
                        var ls_item = 'book' + db_id;
                        var url = db_api + "v2/book/id/" + db_id;
                        if (localStorage.getItem(ls_item) == null || localStorage.getItem(ls_item) === 'undefined') {
                            $.ajax({
                                url: url, type: 'GET', dataType: 'json', success: function (data) {
                                    localStorage.setItem('book' + db_id, JSON.stringify(data));
                                    bookShow(_this, ls_item, strs)
                                }
                            })
                        } else {
                            bookShow(_this, ls_item, strs)
                        }
                    }
                }
            });
        });

        function movieShow(_this, ls_item, str) {
            var storage = localStorage.getItem(ls_item);
            var data = JSON.parse(storage);
            var db_star = Math.ceil(data.rating);
            $("<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><div class='post-preview--title'><a target='_blank' style='box-shadow: none; font-weight: bolder;' href='" + str + "'>" + data.name + "</a></div><div class='rating'><div class='rating-star allstar" + db_star + "'></div><div class='rating-average'>" + data.rating + "</div></div><time class='post-preview--date'>导演：" + data.director + " / 类型：" + data.genre + " / " + data.year + "</time><section style='max-height:75px;overflow:hidden;' class='post-preview--excerpt'>" + data.intro.replace(/\s*/g, "") + "</section></div></div><img referrerpolicy='no-referrer' loading='lazy' class='post-preview--image' src=" + data.img + "></div>").replaceAll(_this)
        }

        function bookShow(_this, ls_item, str) {
            var storage = localStorage.getItem(ls_item);
            var data = JSON.parse(storage);
            var db_star = Math.ceil(data.rating.average);
            $("<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><div class='post-preview--title'><a target='_blank' style='box-shadow: none; font-weight: bolder;' href='" + str + "'>" + data.title + "</a></div><div class='rating'><div class='rating-star allstar" + db_star + "'></div><div class='rating-average'>" + data.rating.average + "</div></div><time class='post-preview--date'>作者：" + data.author + " / 出版："+ data.pubdate +" / "+ data.publisher +" </time><section style='max-height:75px;overflow:hidden;' class='post-preview--excerpt'>" + data.summary.replace(/\s*/g, "") + "</section></div></div><img referrerpolicy='no-referrer' loading='lazy' class='post-preview--image' src=" + data.images.medium + "></div>").replaceAll(_this)
        }
    </script>
</head>
<body>
<div class="douban_show">
    <div id="db{{ .Get "src" }}" urlstring="{{ .Get "src" }}" class="douban_item post-preview"></div>
</div>
</body>
</html>
```

> CSS调整为适合Hugo-Luna的，可能适用到你自己主题需要再改下，可参考[源文件](https://www.sulvblog.cn/posts/blog/shortcodes/#65-%e8%b1%86%e7%93%a3%e9%98%85%e8%af%bb%e5%92%8c%e7%94%b5%e5%bd%b1%e5%8d%a1%e7%89%87)。

