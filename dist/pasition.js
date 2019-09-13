/**
 * pasition v1.0.2 By dntzhang
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
        args = parseValues(args);

        // overloaded moveTo
        if (type == 'm' && args.length > 2) {
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

function shapeBox(shape) {
    var minX = shape[0][0],
        minY = shape[0][1],
        maxX = minX,
        maxY = minY;
    shape.forEach(function (curve) {
        var x1 = curve[0],
            x2 = curve[2],
            x3 = curve[4],
            x4 = curve[6],
            y1 = curve[1],
            y2 = curve[3],
            y3 = curve[5],
            y4 = curve[7];

        minX = Math.min(minX, x1, x2, x3, x4);
        minY = Math.min(minY, y1, y2, y3, y4);
        maxX = Math.max(maxX, x1, x2, x3, x4);
        maxY = Math.max(maxY, y1, y2, y3, y4);
    });

    return [minX, minY, maxX, maxY];
}

function boxDistance(boxA, boxB) {
    return Math.sqrt(Math.pow(boxA[0] - boxB[0], 2) + Math.pow(boxA[1] - boxB[1], 2)) + Math.sqrt(Math.pow(boxA[2] - boxB[2], 2) + Math.pow(boxA[3] - boxB[3], 2));
}

function curveDistance(curveA, curveB) {
    var x1 = curveA[0],
        x2 = curveA[2],
        x3 = curveA[4],
        x4 = curveA[6],
        y1 = curveA[1],
        y2 = curveA[3],
        y3 = curveA[5],
        y4 = curveA[7],
        xb1 = curveB[0],
        xb2 = curveB[2],
        xb3 = curveB[4],
        xb4 = curveB[6],
        yb1 = curveB[1],
        yb2 = curveB[3],
        yb3 = curveB[5],
        yb4 = curveB[7];

    return Math.sqrt(Math.pow(xb1 - x1, 2) + Math.pow(yb1 - y1, 2)) + Math.sqrt(Math.pow(xb2 - x2, 2) + Math.pow(yb2 - y2, 2)) + Math.sqrt(Math.pow(xb3 - x3, 2) + Math.pow(yb3 - y3, 2)) + Math.sqrt(Math.pow(xb4 - x4, 2) + Math.pow(yb4 - y4, 2));
}

function sortCurves(curvesA, curvesB) {

    var arrList = permuteCurveNum(curvesA.length);

    var list = [];
    arrList.forEach(function (arr) {
        var distance = 0;
        var i = 0;
        arr.forEach(function (index) {
            distance += curveDistance(curvesA[index], curvesB[i++]);
        });
        list.push({ index: arr, distance: distance });
    });

    list.sort(function (a, b) {
        return a.distance - b.distance;
    });

    var result = [];

    list[0].index.forEach(function (index) {
        result.push(curvesA[index]);
    });

    return result;
}

function sort(pathA, pathB) {

    var arrList = permuteNum(pathA.length);

    var list = [];
    arrList.forEach(function (arr) {
        var distance = 0;
        arr.forEach(function (index) {
            distance += boxDistance(shapeBox(pathA[index]), shapeBox(pathB[index]));
        });
        list.push({ index: arr, distance: distance });
    });

    list.sort(function (a, b) {
        return a.distance - b.distance;
    });

    var result = [];

    list[0].index.forEach(function (index) {
        result.push(pathA[index]);
    });

    return result;
}

function permuteCurveNum(num) {
    var arr = [];

    for (var i = 0; i < num; i++) {
        var indexArr = [];
        for (var j = 0; j < num; j++) {
            var index = j + i;
            if (index > num - 1) index -= num;
            indexArr[index] = j;
        }

        arr.push(indexArr);
    }

    return arr;
}

function permuteNum(num) {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(i);
    }

    return permute(arr);
}

function permute(input) {
    var permArr = [],
        usedChars = [];
    function main(input) {
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                permArr.push(usedChars.slice());
            }
            main(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr;
    }
    return main(input);
}

var pasition = {};
pasition.parser = parse;

pasition.lerpCurve = function (pathA, pathB, t) {

    return pasition.lerpPoints(pathA[0], pathA[1], pathB[0], pathB[1], t).concat(pasition.lerpPoints(pathA[2], pathA[3], pathB[2], pathB[3], t)).concat(pasition.lerpPoints(pathA[4], pathA[5], pathB[4], pathB[5], t)).concat(pasition.lerpPoints(pathA[6], pathA[7], pathB[6], pathB[7], t));
};

pasition.lerpPoints = function (x1, y1, x2, y2, t) {
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
};

pasition.q2b = function (x1, y1, x2, y2, x3, y3) {
    return [x1, y1, (x1 + 2 * x2) / 3, (y1 + 2 * y2) / 3, (x3 + 2 * x2) / 3, (y3 + 2 * y2) / 3, x3, y3];
};

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
        closeX = void 0,
        closeY = void 0,
        preCX = void 0,
        preCY = void 0,
        sLen = void 0,
        curves = void 0,
        lastCurve = void 0;

    for (; j < len; j++) {
        var item = cmds[j];
        var action = item[0];
        var preItem = cmds[j - 1];

        switch (action) {
            case 'm':
                sLen = shapes.length;
                shapes[sLen] = [];
                current = shapes[sLen];
                preX = preX + item[1];
                preY = preY + item[2];
                break;
            case 'M':

                sLen = shapes.length;
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
                if (preItem[0] === 'C' || preItem[0] === 'c') {
                    current.push([preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], item[1], item[2], item[3], item[4]]);
                } else if (preItem[0] === 'S' || preItem[0] === 's') {
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
                if (preItem[0] === 'C' || preItem[0] === 'c') {

                    current.push([preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                } else if (preItem[0] === 'S' || preItem[0] === 's') {
                    current.push([preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                }

                preX = preX + item[3];
                preY = preY + item[4];

                break;
            case 'a':
                curves = arcToBezier({
                    rx: item[1],
                    ry: item[2],
                    px: preX,
                    py: preY,
                    xAxisRotation: item[3],
                    largeArcFlag: item[4],
                    sweepFlag: item[5],
                    cx: preX + item[6],
                    cy: preY + item[7]
                });
                lastCurve = curves[curves.length - 1];

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

                curves = arcToBezier({
                    rx: item[1],
                    ry: item[2],
                    px: preX,
                    py: preY,
                    xAxisRotation: item[3],
                    largeArcFlag: item[4],
                    sweepFlag: item[5],
                    cx: item[6],
                    cy: item[7]
                });
                lastCurve = curves[curves.length - 1];

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
            case 'Q':
                current.push(pasition.q2b(preX, preY, item[1], item[2], item[3], item[4]));
                preX = item[3];
                preY = item[4];

                break;
            case 'q':
                current.push(pasition.q2b(preX, preY, preX + item[1], preY + item[2], item[3] + preX, item[4] + preY));
                preX += item[3];
                preY += item[4];
                break;

            case 'T':

                if (preItem[0] === 'Q' || preItem[0] === 'q') {
                    preCX = preX + preItem[3] - preItem[1];
                    preCY = preY + preItem[4] - preItem[2];
                    current.push(pasition.q2b(preX, preY, preCX, preCY, item[1], item[2]));
                } else if (preItem[0] === 'T' || preItem[0] === 't') {
                    current.push(pasition.q2b(preX, preY, preX + preX - preCX, preY + preY - preCY, item[1], item[2]));
                    preCX = preX + preX - preCX;
                    preCY = preY + preY - preCY;
                }

                preX = item[1];
                preY = item[2];
                break;

            case 't':
                if (preItem[0] === 'Q' || preItem[0] === 'q') {
                    preCX = preX + preItem[3] - preItem[1];
                    preCY = preY + preItem[4] - preItem[2];
                    current.push(pasition.q2b(preX, preY, preCX, preCY, preX + item[1], preY + item[2]));
                } else if (preItem[0] === 'T' || preItem[0] === 't') {
                    current.push(pasition.q2b(preX, preY, preX + preX - preCX, preY + preY - preCY, preX + item[1], preY + item[2]));
                    preCX = preX + preX - preCX;
                    preCY = preY + preY - preCY;
                }

                preX += item[1];
                preY += item[2];
                break;

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
    var i = 0,
        index = 0,
        len = curves.length;
    for (; i < count; i++) {
        curves.push(curves[index].slice(0));
        index++;
        if (index > len - 1) {
            index -= len;
        }
    }
};

function split(x1, y1, x2, y2, x3, y3, x4, y4, t) {
    return {
        left: _split(x1, y1, x2, y2, x3, y3, x4, y4, t),
        right: _split(x4, y4, x3, y3, x2, y2, x1, y1, 1 - t, true)
    };
}

function _split(x1, y1, x2, y2, x3, y3, x4, y4, t, reverse) {

    var x12 = (x2 - x1) * t + x1;
    var y12 = (y2 - y1) * t + y1;

    var x23 = (x3 - x2) * t + x2;
    var y23 = (y3 - y2) * t + y2;

    var x34 = (x4 - x3) * t + x3;
    var y34 = (y4 - y3) * t + y3;

    var x123 = (x23 - x12) * t + x12;
    var y123 = (y23 - y12) * t + y12;

    var x234 = (x34 - x23) * t + x23;
    var y234 = (y34 - y23) * t + y23;

    var x1234 = (x234 - x123) * t + x123;
    var y1234 = (y234 - y123) * t + y123;

    if (reverse) {
        return [x1234, y1234, x123, y123, x12, y12, x1, y1];
    }
    return [x1, y1, x12, y12, x123, y123, x1234, y1234];
}

pasition._splitCurves = function (curves, count) {
    var i = 0,
        index = 0;

    for (; i < count; i++) {
        var curve = curves[index];
        var cs = split(curve[0], curve[1], curve[2], curve[3], curve[4], curve[5], curve[6], curve[7], 0.5);
        curves.splice(index, 1);
        curves.splice(index, 0, cs.left, cs.right);

        index += 2;
        if (index >= curves.length - 1) {
            index = 0;
        }
    }
};

function sync(shapes, count) {
    var _loop = function _loop(i) {
        var shape = shapes[shapes.length - 1];
        var newShape = [];

        shape.forEach(function (curve) {
            newShape.push(curve.slice(0));
        });
        shapes.push(newShape);
    };

    for (var i = 0; i < count; i++) {
        _loop(i);
    }
}

pasition.lerp = function (pathA, pathB, t) {
    return pasition._lerp(pasition.path2shapes(pathA), pasition.path2shapes(pathB), t);
};

pasition.MIM_CURVES_COUNT = 100;

pasition._preprocessing = function (pathA, pathB) {

    var lenA = pathA.length,
        lenB = pathB.length,
        clonePathA = JSON.parse(JSON.stringify(pathA)),
        clonePathB = JSON.parse(JSON.stringify(pathB));

    if (lenA > lenB) {
        sync(clonePathB, lenA - lenB);
    } else if (lenA < lenB) {
        sync(clonePathA, lenB - lenA);
    }

    clonePathA = sort(clonePathA, clonePathB);

    clonePathA.forEach(function (curves, index) {

        var lenA = curves.length,
            lenB = clonePathB[index].length;

        if (lenA > lenB) {
            if (lenA < pasition.MIM_CURVES_COUNT) {
                pasition._splitCurves(curves, pasition.MIM_CURVES_COUNT - lenA);
                pasition._splitCurves(clonePathB[index], pasition.MIM_CURVES_COUNT - lenB);
            } else {
                pasition._splitCurves(clonePathB[index], lenA - lenB);
            }
        } else if (lenA < lenB) {
            if (lenB < pasition.MIM_CURVES_COUNT) {
                pasition._splitCurves(curves, pasition.MIM_CURVES_COUNT - lenA);
                pasition._splitCurves(clonePathB[index], pasition.MIM_CURVES_COUNT - lenB);
            } else {
                pasition._splitCurves(curves, lenB - lenA);
            }
        }
    });

    clonePathA.forEach(function (curves, index) {
        clonePathA[index] = sortCurves(curves, clonePathB[index]);
    });

    return [clonePathA, clonePathB];
};

pasition._lerp = function (pathA, pathB, t) {

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

pasition.animate = function (option) {
    var pathA = pasition.path2shapes(option.from);
    var pathB = pasition.path2shapes(option.to);
    var pathArr = pasition._preprocessing(pathA, pathB);

    var beginTime = new Date(),
        end = option.end || function () {},
        progress = option.progress || function () {},
        begin = option.begin || function () {},
        easing = option.easing || function (v) {
        return v;
    },
        tickId = null,
        outShape = null,
        time = option.time;

    begin(pathA);

    var tick = function tick() {
        var dt = new Date() - beginTime;
        if (dt >= time) {
            outShape = pathB;
            progress(outShape, 1);
            end(outShape);
            cancelAnimationFrame(tickId);
            return;
        }
        var percent = easing(dt / time);
        outShape = pasition._lerp(pathArr[0], pathArr[1], percent);
        progress(outShape, percent);
        tickId = requestAnimationFrame(tick);
    };
    tick();
};

return pasition;

})));
