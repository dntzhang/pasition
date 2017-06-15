/**
 * pasition v0.2.1 By dntzhang
 * Github: https://github.com/AlloyTeam/pasition
 * MIT Licensed.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.pasition = factory());
}(this, (function () { 'use strict';

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

//https://github.com/colinmeinke/svg-arc-to-cubic-bezier

var TAU = Math.PI * 2;

var mapToEllipse = function mapToEllipse(_ref, rx, ry, cosphi, sinphi, centerx, centery) {
    var x = _ref.x,
        y = _ref.y;

    x *= rx;
    y *= ry;

    var xp = cosphi * x - sinphi * y;
    var yp = sinphi * x + cosphi * y;

    return {
        x: xp + centerx,
        y: yp + centery
    };
};

var approxUnitArc = function approxUnitArc(ang1, ang2) {
    var a = 4 / 3 * Math.tan(ang2 / 4);

    var x1 = Math.cos(ang1);
    var y1 = Math.sin(ang1);
    var x2 = Math.cos(ang1 + ang2);
    var y2 = Math.sin(ang1 + ang2);

    return [{
        x: x1 - y1 * a,
        y: y1 + x1 * a
    }, {
        x: x2 + y2 * a,
        y: y2 - x2 * a
    }, {
        x: x2,
        y: y2
    }];
};

var vectorAngle = function vectorAngle(ux, uy, vx, vy) {
    var sign = ux * vy - uy * vx < 0 ? -1 : 1;
    var umag = Math.sqrt(ux * ux + uy * uy);
    var vmag = Math.sqrt(ux * ux + uy * uy);
    var dot = ux * vx + uy * vy;

    var div = dot / (umag * vmag);

    if (div > 1) {
        div = 1;
    }

    if (div < -1) {
        div = -1;
    }

    return sign * Math.acos(div);
};

var getArcCenter = function getArcCenter(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp) {
    var rxsq = Math.pow(rx, 2);
    var rysq = Math.pow(ry, 2);
    var pxpsq = Math.pow(pxp, 2);
    var pypsq = Math.pow(pyp, 2);

    var radicant = rxsq * rysq - rxsq * pypsq - rysq * pxpsq;

    if (radicant < 0) {
        radicant = 0;
    }

    radicant /= rxsq * pypsq + rysq * pxpsq;
    radicant = Math.sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);

    var centerxp = radicant * rx / ry * pyp;
    var centeryp = radicant * -ry / rx * pxp;

    var centerx = cosphi * centerxp - sinphi * centeryp + (px + cx) / 2;
    var centery = sinphi * centerxp + cosphi * centeryp + (py + cy) / 2;

    var vx1 = (pxp - centerxp) / rx;
    var vy1 = (pyp - centeryp) / ry;
    var vx2 = (-pxp - centerxp) / rx;
    var vy2 = (-pyp - centeryp) / ry;

    var ang1 = vectorAngle(1, 0, vx1, vy1);
    var ang2 = vectorAngle(vx1, vy1, vx2, vy2);

    if (sweepFlag === 0 && ang2 > 0) {
        ang2 -= TAU;
    }

    if (sweepFlag === 1 && ang2 < 0) {
        ang2 += TAU;
    }

    return [centerx, centery, ang1, ang2];
};

var arcToBezier = function arcToBezier(_ref2) {
    var px = _ref2.px,
        py = _ref2.py,
        cx = _ref2.cx,
        cy = _ref2.cy,
        rx = _ref2.rx,
        ry = _ref2.ry,
        _ref2$xAxisRotation = _ref2.xAxisRotation,
        xAxisRotation = _ref2$xAxisRotation === undefined ? 0 : _ref2$xAxisRotation,
        _ref2$largeArcFlag = _ref2.largeArcFlag,
        largeArcFlag = _ref2$largeArcFlag === undefined ? 0 : _ref2$largeArcFlag,
        _ref2$sweepFlag = _ref2.sweepFlag,
        sweepFlag = _ref2$sweepFlag === undefined ? 0 : _ref2$sweepFlag;

    var curves = [];

    if (rx === 0 || ry === 0) {
        return [];
    }

    var sinphi = Math.sin(xAxisRotation * TAU / 360);
    var cosphi = Math.cos(xAxisRotation * TAU / 360);

    var pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2;
    var pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2;

    if (pxp === 0 && pyp === 0) {
        return [];
    }

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    var lambda = Math.pow(pxp, 2) / Math.pow(rx, 2) + Math.pow(pyp, 2) / Math.pow(ry, 2);

    if (lambda > 1) {
        rx *= Math.sqrt(lambda);
        ry *= Math.sqrt(lambda);
    }

    var _getArcCenter = getArcCenter(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp),
        _getArcCenter2 = slicedToArray(_getArcCenter, 4),
        centerx = _getArcCenter2[0],
        centery = _getArcCenter2[1],
        ang1 = _getArcCenter2[2],
        ang2 = _getArcCenter2[3];

    var segments = Math.max(Math.ceil(Math.abs(ang2) / (TAU / 4)), 1);

    ang2 /= segments;

    for (var i = 0; i < segments; i++) {
        curves.push(approxUnitArc(ang1, ang2));
        ang1 += ang2;
    }

    return curves.map(function (curve) {
        var _mapToEllipse = mapToEllipse(curve[0], rx, ry, cosphi, sinphi, centerx, centery),
            x1 = _mapToEllipse.x,
            y1 = _mapToEllipse.y;

        var _mapToEllipse2 = mapToEllipse(curve[1], rx, ry, cosphi, sinphi, centerx, centery),
            x2 = _mapToEllipse2.x,
            y2 = _mapToEllipse2.y;

        var _mapToEllipse3 = mapToEllipse(curve[2], rx, ry, cosphi, sinphi, centerx, centery),
            x = _mapToEllipse3.x,
            y = _mapToEllipse3.y;

        return { x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y };
    });
};

//https://github.com/jkroso/parse-svg-path/blob/master/index.js
/**
 * expected argument lengths
 * @type {Object}
 */

var length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0

    /**
     * segment pattern
     * @type {RegExp}
     */

};var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;

/**
 * parse an svg path data string. Generates an Array
 * of commands where each command is an Array of the
 * form `[command, arg1, arg2, ...]`
 *
 * @param {String} path
 * @return {Array}
 */

function parse(path) {
    var data = [];
    path.replace(segment, function (_, command, args) {
        var type = command.toLowerCase();
        args = parseValues(args

        // overloaded moveTo
        );if (type == 'm' && args.length > 2) {
            data.push([command].concat(args.splice(0, 2)));
            type = 'l';
            command = command == 'm' ? 'l' : 'L';
        }

        while (true) {
            if (args.length == length[type]) {
                args.unshift(command);
                return data.push(args);
            }
            if (args.length < length[type]) throw new Error('malformed path data');
            data.push([command].concat(args.splice(0, length[type])));
        }
    });
    return data;
}

var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;

function parseValues(args) {
    var numbers = args.match(number);
    return numbers ? numbers.map(Number) : [];
}

var pasition = {};
pasition.parser = parse;

pasition.lerpCurve = function (pathA, pathB, t) {

    if (t < 0) {
        t = 0;
    } else if (t > 1) {
        t = 1;
    }
    return pasition.lerpPoints(pathA[0], pathA[1], pathB[0], pathB[1], t).concat(pasition.lerpPoints(pathA[2], pathA[3], pathB[2], pathB[3], t)).concat(pasition.lerpPoints(pathA[4], pathA[5], pathB[4], pathB[5], t)).concat(pasition.lerpPoints(pathA[6], pathA[7], pathB[6], pathB[7], t));
};

pasition.lerpPoints = function (x1, y1, x2, y2, t) {
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
};

pasition.q2b = function (x1, y1, x2, y2, x3, y3) {};

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
    //A = elliptical Arc
    //Z = closepath
    //以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位(从上一个点开始)。
    var cmds = pasition.parser(path),
        preX = 0,
        preY = 0,
        j = 0,
        len = cmds.length,
        shapes = [],
        current = null,
        closeX,
        closeY;

    for (; j < len; j++) {
        var item = cmds[j];
        var action = item[0];
        var preItem = cmds[j - 1];

        switch (action) {
            case 'm':
                var sLen = shapes.length;
                shapes[sLen] = [];
                current = shapes[sLen];
                preX = preX + item[1];
                preY = preY + item[2];
                break;
            case 'M':

                var sLen = shapes.length;

                shapes[sLen] = [];
                current = shapes[sLen];
                preX = item[1];
                preY = item[2];
                break;

            case 'l':
                current.push([preX, preY, preX, preY, preX, preY, preX + item[1], preY + item[2]]);
                preX += item[1];
                preY += item[2];
                break;

            case 'L':

                current.push([preX, preY, item[1], item[2], item[1], item[2], item[1], item[2]]);
                preX = item[1];
                preY = item[2];

                break;

            case 'h':

                current.push([preX, preY, preX, preY, preX, preY, preX + item[1], preY]);
                preX += item[1];
                break;

            case 'H':
                current.push([preX, preY, item[1], preY, item[1], preY, item[1], preY]);
                preX = item[1];
                break;

            case 'v':
                current.push([preX, preY, preX, preY, preX, preY, preX, preY + item[1]]);
                preY += item[1];
                break;

            case 'V':
                current.push([preX, preY, preX, item[1], preX, item[1], preX, item[1]]);
                preY = item[1];
                break;

            case 'C':

                current.push([preX, preY, item[1], item[2], item[3], item[4], item[5], item[6]]);
                preX = item[5];
                preY = item[6];
                break;
            case 'S':
                if (preItem[0] === 'C') {
                    current.push([preX, preY, preX + preX - preItem[3], preY + preY - preItem[4], item[1], item[2], item[3], item[4]]);
                } else if (preItem[0] === 'c') {
                    current.push([preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], item[1], item[2], item[3], item[4]]);
                } else if (preItem[0] === 'S') {
                    current.push([preX, preY, preX + preX - preItem[1], preY + preY - preItem[2], item[1], item[2], item[3], item[4]]);
                } else if (preItem[0] === 's') {
                    current.push([preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], item[1], item[2], item[3], item[4]]);
                }
                preX = item[3];
                preY = item[4];
                break;

            case 'c':
                current.push([preX, preY, preX + item[1], preY + item[2], preX + item[3], preY + item[4], preX + item[5], preY + item[6]]);
                preX = preX + item[5];
                preY = preY + item[6];
                break;
            case 's':
                if (preItem[0] === 'C') {
                    current.push([preX, preY, preX + preX - preItem[3], preY + preY - preItem[4], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                } else if (preItem[0] === 'c') {
                    current.push([preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                } else if (preItem[0] === 'S') {
                    current.push([preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                } else if (preItem[0] === 's') {
                    current.push([preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                }

                preX = preX + item[3];
                preY = preY + item[4];

                break;
            case 'a':
                var currentPoint = {
                    rx: item[1],
                    ry: item[2],
                    px: preX,
                    py: preY,
                    xAxisRotation: item[3],
                    largeArcFlag: item[4],
                    sweepFlag: item[5],
                    cx: preX + item[6],
                    cy: preX + item[7]
                };

                var curves = arcToBezier(currentPoint);
                var lastCurve = curves[curves.length - 1];

                curves.forEach(function (curve, index) {
                    if (index === 0) {
                        current.push([preX, preY, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                    } else {
                        current.push([curves[index - 1].x, curves[index - 1].y, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                    }
                });

                preX = lastCurve.x;
                preY = lastCurve.y;

                break;

            case 'A':
                var currentPoint = {
                    rx: item[1],
                    ry: item[2],
                    px: preX,
                    py: preY,
                    xAxisRotation: item[3],
                    largeArcFlag: item[4],
                    sweepFlag: item[5],
                    cx: item[6],
                    cy: item[7]
                };

                var curves = arcToBezier(currentPoint);
                var lastCurve = curves[curves.length - 1];

                curves.forEach(function (curve, index) {
                    if (index === 0) {
                        current.push([preX, preY, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                    } else {
                        current.push([curves[index - 1].x, curves[index - 1].y, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                    }
                });

                preX = lastCurve.x;
                preY = lastCurve.y;

                break;
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

            case 'Z':
                closeX = current[0][0];
                closeY = current[0][1];
                current.push([preX, preY, closeX, closeY, closeX, closeY, closeX, closeY]);
                break;
            case 'z':
                closeX = current[0][0];
                closeY = current[0][1];
                current.push([preX, preY, closeX, closeY, closeX, closeY, closeX, closeY]);
                break;
        }
    }

    return shapes;
};

pasition._upCurves = function (curves, count) {
    var i = 0;
    for (; i < count; i++) {
        curves.push(curves[curves.length - 1].slice(0));
    }
};

pasition._upShapes = function (shapes, count) {
    var i = 0;
    for (; i < count; i++) {
        var shape = shapes[shapes.length - 1];
        var newShape = [];

        shape.forEach(function (curve) {

            newShape.push(curve.slice(0));
        });
        shapes.push(newShape);
    }
};

pasition.lerp = function (pathA, pathB, t) {
    return pasition._lerp(pasition.path2shapes(pathA), pasition.path2shapes(pathB), t);
};

pasition._lerp = function (pathA, pathB, t) {
    var lenA = pathA.length,
        lenB = pathB.length,
        pathA = JSON.parse(JSON.stringify(pathA)),
        pathB = JSON.parse(JSON.stringify(pathB));

    if (lenA > lenB) {
        pasition._upShapes(pathB, lenA - lenB);
    } else if (lenA < lenB) {
        pasition._upShapes(pathA, lenB - lenA);
    }

    pathA.forEach(function (curves, index) {

        var lenA = curves.length,
            lenB = pathB[index].length;

        if (lenA > lenB) {
            pasition._upCurves(pathB[index], lenA - lenB);
        } else if (lenA < lenB) {
            pasition._upCurves(curves, lenB - lenA);
        }
    });

    var shapes = [];
    pathA.forEach(function (curves, index) {
        var newCurves = [];
        curves.forEach(function (curve, curveIndex) {
            newCurves.push(pasition.lerpCurve(curve, pathB[index][curveIndex], t));
        });
        shapes.push(newCurves);
    });
    return shapes;
};

pasition.animate = function (pathA, pathB, time, option) {
    pathA = pasition.path2shapes(pathA);
    pathB = pasition.path2shapes(pathB);

    var beginTime = new Date(),
        end = option.end || function () {},
        progress = option.progress || function () {},
        begin = option.begin || function () {},
        easing = option.easing || function (v) {
        return v;
    },
        tickId = null,
        outShape = null;

    begin(pathA);

    var tick = function tick() {
        var dt = new Date() - beginTime;
        if (dt >= time) {
            outShape = pathB;
            progress(outShape);
            end(outShape);
            cancelAnimationFrame(tickId);
            return;
        }

        outShape = pasition._lerp(pathA, pathB, easing(dt / time));
        progress(outShape);
        tickId = requestAnimationFrame(tick);
    };
    tick();
};

return pasition;

})));
