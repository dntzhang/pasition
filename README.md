
<p align="center">
  <a href ="##"><img alt="Omi" src="http://images2015.cnblogs.com/blog/105416/201706/105416-20170614174731868-1520193923.gif"></a>
</p>
<h3 align="center">
pasition === path transition
</h3>
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

[https://unpkg.com/pasition@0.1.2/pasition.js](https://unpkg.com/pasition@0.1.2/pasition.js)

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

you can get the progressing shapes by `pasition.lerp`:

```js
var shapes  = pasition.lerp(pathA, pathB, 0.5)
//render shapes in canvas ,svg or anywhere you want
...
```

## DEMO

* [https://alloyteam.github.io/pasition/](https://alloyteam.github.io/pasition/)

#### 中文 | [English](https://github.com/AlloyTeam/pasition#english--中文)

## pasition

超级小尺寸的Path过渡动画类库

## 安装

```
npm install pasition
```

CDN地址下载下来使用:

[https://unpkg.com/pasition@0.1.2/pasition.js](https://unpkg.com/pasition@0.1.2/pasition.js)

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

你可以通过 `pasition.lerp` 方法拿到插值中的shapes:

```js
var shapes  = pasition.lerp(pathA, pathB, 0.5)
//拿到shapes之后你可以在任何你想要渲染的地方绘制，如canvas、svg、webgl等
...
```

## 在线演示

* [https://alloyteam.github.io/pasition/](https://alloyteam.github.io/pasition/)


# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
