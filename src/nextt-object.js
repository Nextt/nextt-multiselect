/**
 * Gently borrowed from http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
 */
 
Object.keys = Object.keys || (function () {
    var hasOwnProp = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [ 
            'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
            'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
        ],
        DontEnumsLength = DontEnums.length;

    return function (o) {
        if (typeof o !== "object" && typeof o !== "function" || o === null) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var result = [];
        for (var name in o) {
            if (hasOwnProp.call(o, name)) {
                result.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProp.call(o, DontEnums[i])) {
                    result.push(DontEnums[i]);
                }
            }   
        }

        return result;
    };
}());