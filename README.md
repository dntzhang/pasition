
<p align="center">
  <a href ="##"><img alt="Omi" src="http://images2015.cnblogs.com/blog/105416/201706/105416-20170614154238196-2066608546.gif"></a>
</p>
<p align="center">
pasition === path transition
</p>
<p align="center">
1kb(gzip)  javascript Path Transition library. 
</p>
<p align="center">
  <a href="https://travis-ci.org/AlloyTeam/omi"><img src="https://travis-ci.org/AlloyTeam/omi.svg"></a>
</p>

---
#### English | [﻿中文](https://github.com/AlloyTeam/pasition#中文--english)



## Install

```
npm install pasition
```

or get js by the cdn address:

[https://unpkg.com/pasition@0.1.0/pasition.js](https://unpkg.com/pasition@0.1.0/pasition.js)

## Usage

```js
pasition.animate(pathA, pathB, time, {
    easing : function(){ },
    begin ：function(){ },
    progress : function(shapes){ },
    end : function(){ }
})
```

you can get the path from attr d of svg path element.


## DEMO

* [https://alloyteam.github.io/pasition/](https://alloyteam.github.io/pasition/)

#### 中文 | [English](https://github.com/AlloyTeam/pasition#english--中文)

## pasition === path transition 

超级小尺寸的Path过渡动画类库

## 安装

```
npm install pasition
```

CDN地址下载下来使用:

[https://unpkg.com/pasition@0.1.0/pasition.js](https://unpkg.com/pasition@0.1.0/pasition.js)

## 使用指南


```js
pasition.animate(pathA, pathB, time, {
    easing : function(){ },
    begin ：function(){ },
    progress : function(shapes){ },
    end : function(){ }
})
```

path从哪里来？你可以从svg的path的d属性获取。

## 在线演示

* [https://alloyteam.github.io/pasition/](https://alloyteam.github.io/pasition/)


# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
