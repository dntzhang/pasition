# 腾讯AlloyTeam正式发布pasition - 制作酷炫Path过渡动画

![pv](http://images2015.cnblogs.com/blog/105416/201706/105416-20170620094820476-131210795.gif)
![pv](http://images2015.cnblogs.com/blog/105416/201706/105416-20170620094817554-48316107.gif)

## pasition

Pasition - Path Transition with little JS code, render to anywhere - 超小尺寸的Path过渡动画类库

* [Github源代码](https://github.com/AlloyTeam/pasition)
* [在线演示](https://alloyteam.github.io/pasition/)

## 安装

```
npm install pasition
```

CDN地址下载下来使用:

[https://unpkg.com/pasition@1.0.0/dist/pasition.js](https://unpkg.com/pasition@1.0.0/dist/pasition.js)

## 使用指南

### pasition.animate

```js
pasition.animate({
    from : fromPath,
    to : toPath,
    time : time,
    easing : function(){ },
    begin ：function(shapes){ },
    progress : function(shapes, percent){ },
    end : function(shapes){ }
})
```

path从哪里来？你可以从svg的path的d属性获取。

支持所有的SVG Path命令:

```
M/m = moveto
L/l = lineto
H/h = horizontal lineto
V/v = vertical lineto
C/c = curveto
S/s = smooth curveto
A/a = elliptical Arc
Z/z = closepath
Q/q = quadratic Belzier curve
T/t = smooth quadratic Belzier curveto
```

举个例子:

```js
pasition.animate({
            from: 'M 40 40 Q 60 80 80 40T 120 40 T 160 40 z',
            to: 'M32,0C14.4,0,0,14.4,0,32s14.3,32,32,32 s32-14.3,32-32S49.7,0,32,0z',
            time: 1000,
            easing : function(){ },
            begin:function(shapes){ },
            progress : function(shapes, percent){
                //你可以在任何你想绘制的地方绘制,如canvas、svg、webgl
            },
            end : function(shapes){ }
        });
```

对上面传入的配置项目一一解释下:

* from 起始的路径
* to 终点的路径
* time 从from到to所需要的时间
* easing 缓动函数(不填默认是匀速运动)
* begin 开始运动的回调函数
* progress 运动过程中的回调函数
* end 运动结束的回调函数

在progress里可以拿到path转变过程中的shapes和运动进度percent（范围是0-1）。下面来看看shapes的结构:

```js
[
    [
       [],    //curve
       [],    //curve
       []    //curve   
    ],      //shape      
    [[],[],[],[],[]],     //shape      
    [[],[],[],[],[]]     //shape    
]
```

在开发者工具里截图:

![](http://images2015.cnblogs.com/blog/105416/201706/105416-20170620102737116-105264871.jpg)

### pasition.lerp

你可以通过 `pasition.lerp` 方法拿到插值中的shapes:

```js
var shapes  = pasition.lerp(pathA, pathB, 0.5)
//拿到shapes之后你可以在任何你想要渲染的地方绘制，如canvas、svg、webgl等
...
```

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
