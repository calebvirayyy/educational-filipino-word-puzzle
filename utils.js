export default {
    NArray: function (...dimensions) {
        var index = 0;
        function NArrayRec(dims) {
            var first = dims[0], next = dims.slice().splice(1); 
            if(dims.length > 1) 
                return Array(dims[0]).fill(null).map((x, i) => NArrayRec(next));
            return Array(dims[0]).fill(null).map((x, i) => (index++));
        }
        return NArrayRec(dimensions);
    },
    allDirections: ['east', 'west', 'south', 'north',
        'southeast', 'southwest', 'northeast', 'northwest'],
    directions: {
        east: function (x, y, i) { return { x: x + i, y: y }; },
        west: function (x, y, i) { return { x: x - i, y: y }; },
        south: function (x, y, i) { return { x: x, y: y + i }; },
        north: function (x, y, i) { return { x: x, y: y - i }; },
        southeast: function (x, y, i) { return { x: x + i, y: y + i }; },
        southwest: function (x, y, i) { return { x: x - i, y: y + i }; },
        northeast: function (x, y, i) { return { x: x + i, y: y - i }; },
        northwest: function (x, y, i) { return { x: x - i, y: y - i }; }
    },
    checkDirections: {
        east: function (x, y, h, w, l) { return w >= x + l; },
        west: function (x, y, h, w, l) { return x + 1 >= l; },
        south: function (x, y, h, w, l) { return h >= y + l; },
        north: function (x, y, h, w, l) { return y + 1 >= l; },
        southeast: function (x, y, h, w, l) { return (w >= x + l) && (h >= y + l); },
        southwest: function (x, y, h, w, l) { return (x + 1 >= l) && (h >= y + l); },
        northeast: function (x, y, h, w, l) { return (w >= x + l) && (y + 1 >= l); },
        northwest: function (x, y, h, w, l) { return (x + 1 >= l) && (y + 1 >= l); }
    },
    skipDirections: {
        east: function (x, y, l) { return { x: 0, y: y + 1 }; },
        west: function (x, y, l) { return { x: l - 1, y: y }; },
        south: function (x, y, l) { return { x: 0, y: y + 100 }; },
        north: function (x, y, l) { return { x: 0, y: l - 1 }; },
        southeast: function (x, y, l) { return { x: 0, y: y + 1 }; },
        southwest: function (x, y, l) { return { x: l - 1, y: x >= l - 1 ? y + 1 : y }; },
        northeast: function (x, y, l) { return { x: 0, y: y < l - 1 ? l - 1 : y + 1 }; },
        northwest: function (x, y, l) { return { x: l - 1, y: x >= l - 1 ? y + 1 : y }; }
    },
}