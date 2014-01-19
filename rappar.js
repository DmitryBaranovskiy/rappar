var fs = require("fs"),
    path = require("path"),
    elemental = require("./elemental.js"),
    eve = elemental.eve,
    _ref = require("child_process"),
    spawn = _ref.spawn,
    exec = _ref.exec;
elemental = elemental.elemental;

var aa = {
    cursor: 1,
    cx: 0,
    cy: 0,
    fill: 1,
    "fill-opacity": 0,
    font: 1,
    "font-family": 1,
    "font-size": 0,
    "font-style": 1,
    "font-weight": 1,
    height: 0,
    "letter-spacing": 0,
    opacity: 0,
    r: 0,
    rx: 0,
    ry: 0,
    src: 1,
    stroke: 1,
    // "stroke-dasharray": "",
    "stroke-linecap": 1,
    "stroke-linejoin": 1,
    "stroke-miterlimit": 0,
    "stroke-opacity": 0,
    "stroke-width": 0,
    "text-anchor": 1,
    width: 0,
    x: 0,
    y: 0
},
    R,
    Raphael = R = {
        angle: function (x1, y1, x2, y2, x3, y3) {
            if (x3 == null) {
                var x = x1 - x2,
                    y = y1 - y2;
                if (!x && !y) {
                    return 0;
                }
                return (180 + Math.atan2(-y, -x) * 180 / Math.PI + 360) % 360;
            } else {
                return Raphael.angle(x1, y1, x3, y3) - Raphael.angle(x2, y2, x3, y3);
            }
        },
        rad: function (deg) {
            return deg % 360 * Math.PI / 180;
        },
        deg: function (rad) {
            return rad * 180 / Math.PI % 360;
        },
        matrix: function (a, b, c, d, e, f) {
            return new Matrix(a, b, c, d, e, f);
        }
    };
function Matrix(a, b, c, d, e, f) {
    if (a != null) {
        this.a = +a;
        this.b = +b;
        this.c = +c;
        this.d = +d;
        this.e = +e;
        this.f = +f;
    } else {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
    }
}
(function (matrixproto) {
    /*\
     * Matrix.add
     [ method ]
     **
     * Adds given matrix to existing one.
     > Parameters
     - a (number)
     - b (number)
     - c (number)
     - d (number)
     - e (number)
     - f (number)
     or
     - matrix (object) @Matrix
    \*/
    matrixproto.add = function (a, b, c, d, e, f) {
        var out = [[], [], []],
            m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
            matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
            x, y, z, res;

        if (a && a instanceof Matrix) {
            matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
        }

        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                res = 0;
                for (z = 0; z < 3; z++) {
                    res += m[x][z] * matrix[z][y];
                }
                out[x][y] = res;
            }
        }
        this.a = out[0][0];
        this.b = out[1][0];
        this.c = out[0][1];
        this.d = out[1][1];
        this.e = out[0][2];
        this.f = out[1][2];
    };
    /*\
     * Matrix.invert
     [ method ]
     **
     * Returns inverted version of the matrix
     = (object) @Matrix
    \*/
    matrixproto.invert = function () {
        var me = this,
            x = me.a * me.d - me.b * me.c;
        return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
    };
    /*\
     * Matrix.clone
     [ method ]
     **
     * Returns copy of the matrix
     = (object) @Matrix
    \*/
    matrixproto.clone = function () {
        return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
    };
    /*\
     * Matrix.translate
     [ method ]
     **
     * Translate the matrix
     > Parameters
     - x (number)
     - y (number)
    \*/
    matrixproto.translate = function (x, y) {
        this.add(1, 0, 0, 1, x, y);
    };
    /*\
     * Matrix.scale
     [ method ]
     **
     * Scales the matrix
     > Parameters
     - x (number)
     - y (number) #optional
     - cx (number) #optional
     - cy (number) #optional
    \*/
    matrixproto.scale = function (x, y, cx, cy) {
        y == null && (y = x);
        (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
        this.add(x, 0, 0, y, 0, 0);
        (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
    };
    /*\
     * Matrix.rotate
     [ method ]
     **
     * Rotates the matrix
     > Parameters
     - a (number)
     - x (number)
     - y (number)
    \*/
    matrixproto.rotate = function (a, x, y) {
        a = R.rad(a);
        x = x || 0;
        y = y || 0;
        var cos = +Math.cos(a).toFixed(9),
            sin = +Math.sin(a).toFixed(9);
        this.add(cos, sin, -sin, cos, x, y);
        this.add(1, 0, 0, 1, -x, -y);
    };
    /*\
     * Matrix.x
     [ method ]
     **
     * Return x coordinate for given point after transformation described by the matrix. See also @Matrix.y
     > Parameters
     - x (number)
     - y (number)
     = (number) x
    \*/
    matrixproto.x = function (x, y) {
        return x * this.a + y * this.c + this.e;
    };
    /*\
     * Matrix.y
     [ method ]
     **
     * Return y coordinate for given point after transformation described by the matrix. See also @Matrix.x
     > Parameters
     - x (number)
     - y (number)
     = (number) y
    \*/
    matrixproto.y = function (x, y) {
        return x * this.b + y * this.d + this.f;
    };
    matrixproto.get = function (i) {
        return +this[Str.fromCharCode(97 + i)].toFixed(4);
    };
    matrixproto.toString = function () {
        return R.svg ?
            "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" :
            [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join();
    };
    matrixproto.toFilter = function () {
        return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) +
            ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) +
            ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')";
    };
    matrixproto.offset = function () {
        return [this.e.toFixed(4), this.f.toFixed(4)];
    };
    function norm(a) {
        return a[0] * a[0] + a[1] * a[1];
    }
    function normalize(a) {
        var mag = Math.sqrt(norm(a));
        a[0] && (a[0] /= mag);
        a[1] && (a[1] /= mag);
    }
    /*\
     * Matrix.split
     [ method ]
     **
     * Splits matrix into primitive transformations
     = (object) in format:
     o dx (number) translation by x
     o dy (number) translation by y
     o scalex (number) scale by x
     o scaley (number) scale by y
     o shear (number) shear
     o rotate (number) rotation in deg
     o isSimple (boolean) could it be represented via simple transformations
    \*/
    matrixproto.split = function () {
        var out = {};
        // translation
        out.dx = this.e;
        out.dy = this.f;

        // scale and shear
        var row = [[this.a, this.c], [this.b, this.d]];
        out.scalex = Math.sqrt(norm(row[0]));
        normalize(row[0]);

        out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
        row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

        out.scaley = Math.sqrt(norm(row[1]));
        normalize(row[1]);
        out.shear /= out.scaley;

        // rotation
        var sin = -row[0][1],
            cos = row[1][1];
        if (cos < 0) {
            out.rotate = R.deg(Math.acos(cos));
            if (sin < 0) {
                out.rotate = 360 - out.rotate;
            }
        } else {
            out.rotate = R.deg(Math.asin(sin));
        }

        out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
        out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
        out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
        return out;
    };
    /*\
     * Matrix.toTransformString
     [ method ]
     **
     * Return transform string that represents given matrix
     = (string) transform string
    \*/
    matrixproto.toTransformString = function (shorter) {
        var s = shorter || this.split();
        if (s.isSimple) {
            s.scalex = +s.scalex.toFixed(4);
            s.scaley = +s.scaley.toFixed(4);
            s.rotate = +s.rotate.toFixed(4);
            return  (s.dx && s.dy ? "t" + [s.dx, s.dy] : "") + 
                    (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : "") +
                    (s.rotate ? "r" + [s.rotate, 0, 0] : "");
        } else {
            return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
        }
    };
})(Matrix.prototype);

function rappar(svg) {
    var parser = elemental(),
        items = [],
        groups = [],
        idtops = {},
        text,
        textel,
        grad;
    
    function factory(tag, type) {
        return function (data, attr) {
            var el = {type: type || tag, fill: "#000", stroke: "none"};
            items.push(el);
            for (var at in attr) if (attr.hasOwnProperty(at)) {
                eve("rappar." + tag + ".attr." + at, el, attr[at], at);
            }
            eve("rappar." + tag + ".attrend", el, attr);
        }
    }
    
    eve.on("rappar.polygon.attr.points", function (value) {
        this.path = "M" + value + "z";
        eve.stop();
    });
    eve.on("rappar.image.attr.xlink:href", function (value) {
        this.src = value;
        eve.stop();
    });
    eve.on("rappar.path.attr.d", function (value) {
        this.path = value;
        eve.stop();
    });
    eve.on("rappar.*.attr.transform", function (value) {
        this.transform = parseTransform(value);
        eve.stop();
    });
    eve.on("rappar.*.attr.fill", function (value) {
        var id = value.match(/url\(#([^\)]+)\)/),
            el = this;
        if (id) {
            id = id[1];
            if (idtops[id]) {
                this.fill = idtops[id];
            } else {
                eve.on("rappar.found." + id, function (fill) {
                    el.fill = fill;
                });
            }
            eve.stop();
        }
    });
    eve.on("rappar.line.attrend", function (attr) {
        this.path = "M" + [attr.x1, attr.y1, attr.x2, attr.y2];
    });

    eve.on("rappar.*.attrend", function () {
        var i = groups.length;
        while (i--) if (groups[i] != this) {
            for (var key in groups[i]) {
                if (key == "transform" && this.transform) {
                    this.transform = groups[i].transform + this.transform;
                } else {
                    this[key] = groups[i][key];
                }
            }
        }
    });
    eve.on("rappar.*.attr.style", function (value) {
        var f = function () {
            applyStyle(value, this, aa);
            eve.unbind("rappar.*.attrend", f);
        };
        eve.on("rappar.*.attrend", f);
        eve.stop();
    });
    eve.on("rappar.*.attr.*", function (value, name) {
        if (name in aa) {
            this[name] = aa[name] ? value : parseFloat(value);
        }
    });
    eve.on("elemental.tag.circle", factory("circle"));
    eve.on("elemental.tag.ellipse", factory("ellipse"));
    eve.on("elemental.tag.polygon", factory("polygon", "path"));
    eve.on("elemental.tag.path", factory("path"));
    eve.on("elemental.tag.line", factory("line", "path"));
    eve.on("elemental.tag.rect", factory("rect"));
    eve.on("elemental.tag.image", factory("image"));
    eve.on("elemental.tag.text", factory("text"));

    eve.on("rappar.text.attrend", function () {
        text = "";
        textel = this;
        this["text-anchor"] = this["text-anchor"] || "start";
    });
    eve.on("elemental.text", function (data, attr, raw) {
        textel && (text += raw);
    });
    eve.on("elemental./tag.text", function () {
        textel.text = text;
        textel = null;
    });
    eve.on("elemental.tag.g", function (data, attr) {
        var el = {};
        groups.push(el);
        for (var at in attr) if (attr.hasOwnProperty(at)) {
            eve("rappar.g.attr." + at, el, attr[at], at);
        }
        eve("rappar.g.attrend", el);
    });
    eve.on("elemental./tag.g", function (data, attr) {
        groups.pop();
    });
    eve.on("elemental.tag.linearGradient", function (data, attr) {
        grad = {
            id: attr.id,
            angle: +(360 + Raphael.angle(attr.x1, attr.y1, attr.x2, attr.y2, attr.x1 + 100, attr.y1)).toFixed(2),
            stops: []
        };
    });
    eve.on("elemental./tag.linearGradient", function () {
        var s = [grad.angle],
            stop;
        for (var i = 0, ii = grad.stops.length; i < ii; i++) {
            stop = grad.stops[i];
            if (i && i != ii - 1) {
                s.push(stop.color + ":" + stop.offset);
            } else {
                s.push(stop.color);
            }
        }
        idtops[grad.id] = s.join("-");
        eve("rappar.found." + grad.id, null, idtops[grad.id]);
    });
    eve.on("elemental.tag.radialGradient", function (data, attr) {
        grad = {
            id: attr.id,
            stops: []
        };
    });
    eve.on("elemental./tag.radialGradient", function () {
        var s = [],
            stop;
        for (var i = 0, ii = grad.stops.length; i < ii; i++) {
            stop = grad.stops[i];
            if (i && i != ii - 1) {
                s.push(stop.color + ":" + stop.offset);
            } else {
                s.push(stop.color);
            }
        }
        idtops[grad.id] = "r" + s.join("-");
        eve("rappar.found." + grad.id, null, idtops[grad.id]);
    });
    eve.on("elemental.tag.stop", function (data, attr) {
        var stop = {};
        if (attr.style) {
            applyStyle(attr.style, stop);
        }
        stop.offset = stop.offset || attr.offset;
        stop.color = stop["stop-color"] || attr["stop-color"];
        stop.opacity = stop["stop-opacity"] || attr["stop-opacity"];
        if (~(stop.offset + "").indexOf("%")) {
            stop.offset = parseFloat(stop.offset);
        } else {
            stop.offset = parseFloat(stop.offset) * 100;
        }
        stop.offset = +stop.offset.toFixed(2);
        grad.stops.push(stop);
    });
    parser(svg);
    parser.end();
    return items;
}

function parseTransform(t) {
    var m = Raphael.matrix(),
        sep = /\s+,?\s*|,\s*/;
    (t + "").replace(/([a-z]+)\(([^)]+)\)(?:\s+,?\s*|,\s*|$)/gi, function (all, command, values) {
        values = values.split(sep);
        switch (command.toLowerCase()) {
            case "translate":
                m.add(1, 0, 0, 1, values[0], values[1]);
            break;
            case "scale":
                m.add(values[0], 0, 0, values[1], 0, 0);
            break;
            case "rotate":
                m.rotate(values[0], values[1], values[2]);
            break;
            case "skewx":
                m.add(1, 0, Math.tan(Raphael.rad(values[0])), 1, 0, 0);
            break;
            case "skewy":
                m.add(1, Math.tan(Raphael.rad(values[0])), 0, 1, 0, 0);
            break;
            case "matrix":
                m.add(values[0], values[1], values[2], values[3], values[4], values[5]);
            break;
        }
    });
    return m.toTransformString();
}

function applyStyle(css, el, aa) {
    var rules = (css + "").split(";"),
        trim = /^\s+|\s+$/g,
        key;
    for (var i = 0, ii = rules.length; i < ii; i++) {
        var pair = rules[i].split(":");
        key = pair[0].replace(trim, "").replace(/[A-Z]/g, function (letter) {
            return "-" + letter.toLowerCase();
        });
        if (!aa || key in aa) {
            el[key] = pair[1].replace(trim, "");
            if (aa && !aa[key]) {
                el[key] = parseFloat(el[key]);
            }
        }
    }
}



var files = process.argv.slice(0);
if (files.length > 2) {
    var svg = fs.readFileSync(files[2], "utf-8");
    console.log(JSON.stringify(rappar(svg)));
}