/*!
 *  pasition v0.1.2 By dntzhang
 *  Github: https://github.com/AlloyTeam/pasition
 *  MIT Licensed.
 */
;(function (root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory()
    else if(typeof define === 'function' && define.amd)
        define([], factory)
    else if(typeof exports === 'object')
        exports["pasition"] = factory()
    else
        root["pasition"] = factory()
})(this,function() {

    var pasition = {}

    pasition.lerpCurve = function (pathA, pathB, t) {

        if (t < 0) {
            t = 0
        } else if (t > 1) {
            t = 1
        }
        return pasition.lerpPoints(pathA[0], pathA[1], pathB[0], pathB[1], t)
            .concat(pasition.lerpPoints(pathA[2], pathA[3], pathB[2], pathB[3], t))
            .concat(pasition.lerpPoints(pathA[4], pathA[5], pathB[4], pathB[5], t))
            .concat(pasition.lerpPoints(pathA[6], pathA[7], pathB[6], pathB[7], t))

    }


    pasition.lerpPoints = function (x1, y1, x2, y2, t) {
        return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]
    }

    pasition.q2b = function (x1, y1, x2, y2, x3, y3) {

    }

    pasition.l2b = function (x1, y1, x2, y2) {

    }

    pasition.p2b = function (x1, y1) {

    }


    //https://github.com/jkroso/parse-svg-path/blob/master/index.js
    /**
     * expected argument lengths
     * @type {Object}
     */

    var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}

    /**
     * segment pattern
     * @type {RegExp}
     */

    var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig

    /**
     * parse an svg path data string. Generates an Array
     * of commands where each command is an Array of the
     * form `[command, arg1, arg2, ...]`
     *
     * @param {String} path
     * @return {Array}
     */

    function parse(path) {
        var data = []
        path.replace(segment, function (_, command, args) {
            var type = command.toLowerCase()
            args = parseValues(args)

            // overloaded moveTo
            if (type == 'm' && args.length > 2) {
                data.push([command].concat(args.splice(0, 2)))
                type = 'l'
                command = command == 'm' ? 'l' : 'L'
            }

            while (true) {
                if (args.length == length[type]) {
                    args.unshift(command)
                    return data.push(args)
                }
                if (args.length < length[type]) throw new Error('malformed path data')
                data.push([command].concat(args.splice(0, length[type])))
            }
        })
        return data
    }

    var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig

    function parseValues(args) {
        var numbers = args.match(number)
        return numbers ? numbers.map(Number) : []
    }

    pasition.parse = parse


    pasition.path2shapes = function (path) {
        //https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
        //M = moveto
        //L = lineto
        //H = horizontal lineto
        //V = vertical lineto
        //C = curveto
        //S = smooth curveto
        //Q = quadratic Belzier curve
        //T = smooth quadratic Belzier curveto
        //A = elliptical Arc  暂时未实现，用贝塞尔拟合椭圆
        //Z = closepath
        //以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位(从上一个点开始)。
        var cmds = pasition.parse(path),
            preX = 0,
            preY = 0,
            j = 0,
            len = cmds.length,
            shapes = [],
            current = null


        for (; j < len; j++) {
            var item = cmds[j]
            var action = item[0]
            var preItem = cmds[j - 1]

            switch (action) {
                case 'm':
                    var sLen = shapes.length
                    shapes[sLen] = []
                    current = shapes[sLen]
                    preX = preX+item[1]
                    preY = preY+item[2]
                    break
                case 'M':

                    var sLen = shapes.length

                    shapes[sLen] = []
                    current = shapes[sLen]
                    preX = item[1]
                    preY = item[2]
                    break

                case 'l':
                    current.push([preX, preY, preX, preY, preX, preY, preX+item[1],preY+item[2]])
                    preX += item[1]
                    preY += item[2]
                    break

                case 'L':

                    current.push([preX, preY, item[1], item[2], item[1], item[2], item[1], item[2]])
                    preX = item[1]
                    preY = item[2]

                    break

                case 'h':

                    current.push([preX, preY, preX, preY, preX, preY,  preX + item[1], preY])
                    preX += item[1]
                    break


                case 'H':
                    current.push([preX, preY, item[1], preY, item[1], preY, item[1], preY])
                    preX = item[1]
                    break

                case 'v':
                    current.push([preX, preY, preX, preY, preX, preY, preX,  preY + item[1]])
                    preY += item[1]
                    break

                case 'V':
                    current.push([preX, preY, preX, item[1], preX, item[1], preX, item[1]])
                    preY = item[1]
                    break


                case 'C':

                    current.push([preX, preY, item[1], item[2], item[3], item[4], item[5], item[6]])
                    preX = item[5]
                    preY = item[6]
                    break
                case 'S':
                    if(preItem[0] ==='C'){
                    current.push([preX, preY, preX + preX - preItem[3], preY + preY - preItem[4], item[1], item[2], item[3], item[4]])
                    }else if(preItem[0] ==='c'){
                        current.push([preX, preY, preX + preItem[5] - preItem[3], preY +  preItem[6] - preItem[4], item[1], item[2], item[3], item[4]])
                    }else if(preItem[0] ==='S'){
                        current.push([preX, preY, preX + preX - preItem[1], preY + preY - preItem[2], item[1], item[2], item[3], item[4]])

                    }else if(preItem[0] ==='s'){
                        current.push([preX, preY, preX+  preItem[3] - preItem[1] ,preY+ preItem[4] - preItem[2], item[1], item[2], item[3], item[4]])
                    }
                    preX = item[3]
                    preY = item[4]
                    break

                case 'c':
                    current.push([preX, preY, preX + item[1], preY + item[2], preX + item[3], preY + item[4], preX + item[5], preY + item[6]])
                    preX = preX + item[5]
                    preY = preY + item[6]
                    break
                case 's':
                    if(preItem[0] ==='C'){
                        current.push([preX, preY, preX+ preX - preItem[3] ,preY+ preY - preItem[4],preX+ item[1],preY+ item[2], preX+item[3],preY+ item[4]])


                    }else if(preItem[0] ==='c'){
                        current.push([preX, preY, preX+  preItem[5] - preItem[3] ,preY+ preItem[6] - preItem[4],preX+ item[1],preY+ item[2], preX+item[3],preY+ item[4]])

                    }else if(preItem[0] ==='S' ){
                        current.push([preX, preY, preX+  preItem[3] - preItem[1] ,preY+ preItem[4] - preItem[2],preX+ item[1],preY+ item[2], preX+item[3],preY+ item[4]])

                    }else if(preItem[0] ==='s'){
                        current.push([preX, preY, preX+  preItem[3] - preItem[1] ,preY+ preItem[4] - preItem[2],preX+ item[1],preY+ item[2], preX+item[3],preY+ item[4]])
                    }

                    preX = preX+item[3]
                    preY = preY+item[4]

                    break
                //case 'Q':
                //    preX = item[3]
                //    preY = item[4]
                //    ctx.quadraticCurveTo( item[1], item[2],preX,preY)
                //    break
                //case 'T':
                //    ctx.quadraticCurveTo( preX+ preX - preItem[1], preY+ preY - preItem[2],item[1], item[2])
                //    preX = item[1]
                //    preY = item[2]
                //    break

                //case 'q':
                //
                //    ctx.quadraticCurveTo( preX+item[1], preY+item[2],item[3]+preX,item[4]+preY)
                //    preX += item[3]
                //    preY += item[4]
                //    break
                //case 't':
                //
                //    ctx.quadraticCurveTo(preX+ preX+ preX - preItem[1], preY+ preY+ preY - preItem[2],preX+ item[1],   preY+item[2])
                //    preX += item[1]
                //    preY += item[2]
                //    break

                //case 'Z':
                //    break
                //case 'z':
                //    break
            }
        }

        return shapes

    }


    pasition._upCurves = function (curves, count) {
        var i = 0
        for (; i < count; i++) {
            curves.push(curves[curves.length - 1].slice(0))
        }
    }

    pasition._upShapes = function (shapes, count) {
        var i = 0
        for (; i < count; i++) {
            var shape = shapes[shapes.length - 1]
            var newShape = []

            shape.forEach(function (curve) {

                newShape.push(curve.slice(0))

            })
            shapes.push(newShape)
        }
    }

    pasition.lerp = function (pathA, pathB, t) {
        return pasition._lerp( pasition.path2shapes(pathA), pasition.path2shapes(pathB), t)
    }

    pasition._lerp = function (pathA, pathB, t) {
        var lenA = pathA.length,
            lenB = pathB.length,
            pathA = JSON.parse(JSON.stringify(pathA)),
            pathB = JSON.parse(JSON.stringify(pathB))

        if (lenA > lenB) {
            pasition._upShapes(pathB, lenA - lenB)
        } else if (lenA < lenB) {
            pasition._upShapes(pathA, lenB - lenA)
        }

        pathA.forEach(function (curves, index) {

            var lenA = curves.length,
                lenB = pathB[index].length

            if (lenA > lenB) {
                pasition._upCurves(pathB[index], lenA - lenB)
            } else if (lenA < lenB) {
                pasition._upCurves(curves, lenB - lenA)
            }
        })


        var shapes = []
        pathA.forEach(function (curves, index) {
            var newCurves = []
            curves.forEach(function (curve, curveIndex) {
                newCurves.push(pasition.lerpCurve(curve, pathB[index][curveIndex], t))
            })
            shapes.push(newCurves)
        })
        return shapes
    }


    pasition.animate = function (pathA, pathB, time, option) {
        pathA = pasition.path2shapes(pathA)
        pathB = pasition.path2shapes(pathB)

        var beginTime = new Date(),
            end = option.end || function () {
                },
            progress = option.progress || function () {
                },
            begin = option.begin || function () {
                },
            easing = option.easing || function (v) {
                    return v
                },
            tickId = null,
            outShape = null

        begin(pathA)

        var tick = function () {
            var dt = new Date() - beginTime
            if (dt >= time) {
                outShape = pathB
                progress(outShape)
                end(outShape)
                cancelAnimationFrame(tickId)
                return
            }

            outShape = pasition._lerp(pathA, pathB, easing(dt / time))
            progress(outShape)
            tickId = requestAnimationFrame(tick)

        }
        tick()
    }

    return pasition
});