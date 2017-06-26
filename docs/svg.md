# SVG 中渲染 pasition 路径

hi!

pasition这个插件做的很棒，谢谢您及您团队的分享.

这两天使用了一下发现了一个不是太方便的地方，插件实时产生的数据在应用于canvas的时候非常的方便，但这些数据在应用于svg的时候稍微有一点儿麻烦.
这些数据在将要应用于svg path d属性的时候，我们还是需要自己写一个逻辑将其转换为svg path 的字符串，
当然了，这个转换相比于整个插件的能力不值一提，但对于应用该插件的开发者来说若是能够有一个直接转化的方法我想会更加便捷。
我想到了两种思路：

* 第一个思路是直接在插件调用的时候传入一个属性指明返回的实时数据是适用于canvas还是svg的来决定返回什么格式的数据。
* 第二个思路是提供一个静态方法比如pasition.toSVGString(shapes)之类的方法，开发者自己调用进行转换。

我在使用插件的时候自己写了一个上述的第二种思路的方法,如下(附件中是在您官方示例基础上修改的demo)：

 ``` js
/**
 * 一个对pasition的扩展,pasition执行过程中产生的实时返回数据(即shapes)格式对于生成canvas画布数据比较方便,但对于生成svg需要额外的处理一下,这里扩展的这个方法是将实时数据生成适合svg路径的字符串格式
 * @param {Object} shapes  pasition执行过程中产生的实时返回数据
 * @return {String} SVGString svg路径格式字符串
 * */
pasition.toSVGString = function (shapes) {
    return shapes.map(function(shape){
        shape.forEach(function (point, idx) {
            if (!idx) {
                /*
                 * 若是第一个点数组，那么对该点数组的处理是前面加M,然后前两个点后面加C
                 * */
                point.splice(2, 0, "C");
                point.unshift("M");
            } else {
                /*
                 * 除了第一个点数据外,所有的点数组的前两个点删除掉
                 * */
                point.splice(0, 2, "C");
            }
        });
        return shape.map(function (point) {
            return point.join(" ");
        }).join("");
    }).join("")
};
```

谢谢您抽时间看我这个建议！
预祝您及AlloyTeam团队更加强大！


liyongleihf2006

2017/06/25

## 在线演示

* [pasition + SVG 在线演示](https://alloyteam.github.io/pasition/example/svg.html)
* [SVG 演示源代码](https://github.com/AlloyTeam/pasition/blob/master/example/svg.html)


