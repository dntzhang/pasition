# 腾讯AlloyTeam正式发布pasition - 制作酷炫Path过渡动画

![pv](http://images2015.cnblogs.com/blog/105416/201706/105416-20170620094820476-131210795.gif)
![pv](http://images2015.cnblogs.com/blog/105416/201706/105416-20170620094817554-48316107.gif)

## pasition

Pasition - Path Transition with little JS code, render to anywhere - 超小尺寸的Path过渡动画类库

* [Github源代码](https://github.com/AlloyTeam/pasition)
* [在线演示](https://alloyteam.github.io/pasition/)

最近和贝塞尔曲线杠上了，如[curvejs](https://github.com/AlloyTeam/curvejs) 和 [pasition](https://github.com/AlloyTeam/pasition) 都是贝塞尔曲线的应用案例，未来还有一款和贝塞尔曲线相关的开源的东西，暂时保密。

## 安装

```
npm install pasition
```

CDN地址下载下来使用:

[https://unpkg.com/pasition@1.0.1/dist/pasition.js](https://unpkg.com/pasition@1.0.1/dist/pasition.js)

## 使用指南

### pasition.lerp

你可以通过 `pasition.lerp` 方法拿到插值中的shapes:

```js
var shapes  = pasition.lerp(pathA, pathB, 0.5)
//拿到shapes之后你可以在任何你想要渲染的地方绘制，如canvas、svg、webgl等
...
```

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

每条curve都包含8个数字，分别代表三次贝塞尔曲线的 起点 控制点 控制点 终点。

![](http://images2015.cnblogs.com/blog/105416/201704/105416-20170421100408884-843332110.png)

每个shape都是闭合的，所以shape的基本规则是:

* 每条curve的终点就是下一条curve的起点
* 最后一条curve的终点就是第一条curve的起点

知道基本规则之后,我们可以进行渲染，这里拿canvas里渲染为例子:

Fill模式:

``` js
function renderShapes(context, curves, color){
    context.beginPath();
    context.fillStyle = color||'black';
    context.moveTo(curves[0][0], curves[0][1]);
    curves.forEach(function(points){
        context.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
    })
    context.closePath();
    context.fill();
}

shapes.forEach(function(curves){
    renderShapes(context,curves,"#006DF0")
})
```


Stroke模式:

```js
function renderCurve(context, points, color){
    context.beginPath();
    context.strokeStyle = color||'black';
    context.moveTo(points[0], points[1]);
    context.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
    context.stroke();
}

shapes.forEach(function(curves){
    curves.forEach(function (curve) {
        renderCurve(context, curve, "#006DF0")
    })	
})
```

当然你也可以把shapes转成SVG的命令在SVG渲染，这应该不是什么困难的事情:

```js
    function toSVGPath(shapes){
        //把 shapes数组转成 M....C........C........Z M....C.....C....C...Z 的字符串。
    }
```

这个函数可以自行尝试一下，生成出的字符串赋值给SVG的Path的d就可以了。

更新: [liyongleihf2006 的SVG解决方案](https://github.com/AlloyTeam/pasition/blob/master/docs/svg.md)

## Github

[https://github.com/AlloyTeam/pasition](https://github.com/AlloyTeam/pasition)

## License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
