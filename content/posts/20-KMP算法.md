---
title: KMP算法&日常
tags:
  - 闲话长说
  - 偶偶学习
slug: 39226
date: 2022-09-15 20:40:15
---

## KMP算法

这次重学CS课程，不可避免看到了树、图等，依稀记得大学时候看KMP，在自习室直接看睡着了。到现在这个时候了，不能再逃避了。

KMP算法是用在字符串匹配一类问题时。例如[Leetcode28. 找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/)，一般我直接想到的是，用模式串一个个对应匹配主串，当某一个位置字符不匹配时，将模式串移动到下一个位置，从头开始匹配，假设模式串长度为n，主串长度为m，m>n，在最坏的情况下，O((m-n)*n)。

**KMP算法的思路**

通过计算next数组，即存放前缀表的数组，该数组中对应下标的数值为，其最长的公共前后缀长度，例如aaffaa，next[1] = 1, next[2] = 0。 当我们用模式串匹配主串时，出现不相等字符时，我们就将模式串移动到最长的公共前后缀长度位置处，直到找到能和当前匹配的前缀位置，最坏情况像暴力一样从头开始。

如何判断主串中能找到模式串，指向模式串的指针指向了末尾。

**计算next数组**

前缀：指不包含最后一个字符的所有以第一个字符开头的连续子串

后缀：指不包含第一个字符的所有以最后一个字符结尾的连续子串。

```c++
void getNext(int* next, const string& s){
        int j = -1; //前缀最长公共子串末尾
        next[0] = j; //0 首位置不存在
        for(int i = 1; i < s.size(); i++){
            while(j >= 0 && s[i] != s[j+1]){
                j = next[j]; //回退j+1上一个位置j的最长公共字串，直到开头
            }
            if(s[i] == s[j+1]){
                j++;//当前位置能匹配的最长公共前后缀
            }
            next[i] = j;//表示i以及i之前的最长相等前后缀长度
        }
    }
```

|  a   |  a   |  b   |  a   |  a   |  f   |
| :--: | :--: | :--: | :--: | :--: | :--: |
|  0   |  1   |  0   |  0   |  2   |  0   |
|  -1  |  0   |  -1  |  -1  |  1   |  -1  |

注意前缀表和next数组可能形式不同，这里采用的是将前缀表整体右移一个位置，作为next数组，也可以直接将前缀表作为next数组。

先对数组进行初始化，用 j 指向前缀最长公共子串末尾，用 i 指向后缀的末尾。然后分别考虑字符串不匹配时回退，字符匹配都前移一位。

**使用next数组来做匹配**

循环判断两个字符串的字符，当不匹配时进行，跳转到next[i]，直到 j 指针指向了模式串末尾，返回在主串中开始的位置。

```c++
int strStr(string haystack, string needle) {
        if(needle.size() == 0){
            return 0;
        }
        int next[needle.size()];
        getNext(next, needle);
        for(int i = 0, j = -1; i < haystack.size(); i++){
            while(j>= 0 && haystack[i] != needle[j+1]){
                j = next[j];
            }
            if(haystack[i] == needle[j+1]){
                j++;
            }
            if(j == (needle.size() - 1)){
                return (i - needle.size() + 1);
            }
        }
        return -1;
    }
```

这是写的第一遍，可能有错，后续也还需要通过其他题加深印象，有一些绕。



## 用.bat文件偷懒

新建一个txt文件，然后将下述文件复制进去，改后缀为`.bat`。

**git push**

```yaml
git add .
set /p m= input commit = 
git commit -m %m%
git push origin main
pause
```

**git deploy**

```yaml
@echo off

cd D:\Code\shixiaocai.fun

echo "&#x5F53;&#x524D;&#x76EE;&#x5F55;&#x662F;&#xFF1A; D:\Code\shixiaocai.fun"

echo "&#x6B63;&#x5728;&#x90E8;&#x7F72;blog... ..."
hexo clean && hexo g && hexo d
echo;
echo "&#x90E8;&#x7F72; complete."
echo;
echo;

pause&#x8F6C;&#x6362;&#x4E3A;UTF-8&#x5B57;&#x7B26;&#x3002;&#x518D;&#x6309;&#x201C;&#x8FD8;&#x539F;&#x201D;&#x5373;&#x53EF;&#x5C06;&#x5176;&#x8FD8;&#x539F;&#x4E3A;&#x7B80;&#x4F53;&#x4E2D;&#x6587;&#x3002;
```

看到的是utf-8格式，避免中文文字乱码错误，我现在是部署在对象存储上，使用脚本连打开git敲`hexo clean && hexo g && hexo d`也省了，不愧是我懒人~

## 未来

今天和师兄沟通了组里的情况，比较尴尬，组里没有实习的时间，好消息是组里没有什么延毕的情况。又感叹了，专业课、研究方向、工作，是三回事。同组的同学，让我放宽心，我还是控制不住自己对未来的担忧，现在的就业形势各方面都不是太好。

不过认清归认清，该做什么还是得去做。倦态社会，积极人生。

好像距离考研也就100天了，招生简章也出了，希望学弟学妹他们也加油吧，去追求自己想要的，后面的苦恼，放到明年这时候再考虑。

这几天bbtalk作者公众号的服务挂了，没有地方直接的自言自语记录了，在想要不要写个手书，可是公众号直接发一条一条好方便，不知道什么时候能恢复~

哦对了，这周申请了又拍云CDN加速，站点底部加了小广告，但是没有解决RSS订阅的问题，还是老老实实用本地的Fluent Reader订阅大家的更新吧，也推荐大家给开源软件~

peace~
