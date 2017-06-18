

function curveBox(curve) {
    let x1 = curve[0],
        x2 = curve[2],
        x3 = curve[4],
        x4 = curve[6],
        y1 = curve[1],
        y2 = curve[3],
        y3 = curve[5],
        y4 = curve[7]
    return [Math.min(x1, x2, x3, x4), Math.min(y1, y2, y3, y4), Math.max(x1, x2, x3, x4), Math.max(y1, y2, y3, y4)]
}

function shapeBox(shape) {
    let minX=shape[0][0], minY=shape[0][1], maxX=minX, maxY=minY
    shape.forEach(curve=> {
        let x1 = curve[0],
            x2 = curve[2],
            x3 = curve[4],
            x4 = curve[6],
            y1 = curve[1],
            y2 = curve[3],
            y3 = curve[5],
            y4 = curve[7]

        minX = Math.min(minX, x1, x2, x3, x4)
        minY = Math.min(minY, y1, y2, y3, y4)
        maxX = Math.max(maxX, x1, x2, x3, x4)
        maxY = Math.max(maxY, y1, y2, y3, y4)

    })

    return [minX, minY, maxX, maxY]
}

function boxDistance(boxA, boxB){
    return Math.sqrt(Math.pow( boxA[0] - boxB[0],2)+Math.pow(boxA[1]-boxB[1],2))+ Math.sqrt(Math.pow( boxA[2] - boxB[2],2)+Math.pow(boxA[3]-boxB[3],2))

}


function sortCurves(curvesA, curvesB){

    let arrList = permuteCurveNum(curvesA.length)

    let list = []
    arrList.forEach(arr => {
        let distance = 0
        arr.forEach(index=> {
            distance += boxDistance(curveBox(curvesA[index]), curveBox(curvesB[index]))
        })
        list.push({index: arr, distance: distance})
    })

    list.sort(function(a,b){
        return a.distance - b.distance
    })

    let result = []

    list[0].index.forEach(index=>{
        result.push(curvesA[index])
    })

    return result

}

function sort(pathA, pathB){

    let arrList = permuteNum(pathA.length)

    let list = []
    arrList.forEach(arr => {
        let distance = 0
        arr.forEach(index=> {
            distance += boxDistance(shapeBox(pathA[index]), shapeBox(pathB[index]))
        })
        list.push({index: arr, distance: distance})
    })

    list.sort(function(a,b){
        return a.distance - b.distance
    })

    let result = []

    list[0].index.forEach(index=>{
        result.push(pathA[index])
    })

    return result
}

function permuteCurveNum(num) {
    let arr = []

    for (let i = 0; i < num; i++) {
        let indexArr = []
        for (let j = 0; j < num; j++) {
            let index = j + i
            if (index > num - 1)index -= num
            indexArr[index] = j
        }

        arr.push(indexArr)
    }

    return arr
}


function permuteNum(num) {
    let arr = []
    for (let i = 0; i < num; i++) {
        arr.push(i)
    }

    return permute(arr)

}

function permute(input) {
    var permArr = [],
        usedChars = []
    function main(input){
        var i, ch
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0]
            usedChars.push(ch)
            if (input.length == 0) {
                permArr.push(usedChars.slice())
            }
            main(input)
            input.splice(i, 0, ch)
            usedChars.pop()
        }
        return permArr
    }
    return main(input)
}

export  {
    sort,
    sortCurves
}
