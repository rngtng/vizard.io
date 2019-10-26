/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Contributor(s):
 *
 *
 *
 * ***** END LICENSE BLOCK ***** */

ace.define('ace/mode/diagram_highlight_rules', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(acequire, exports, module) {
    var oop = acequire("../lib/oop");
    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    var DiagramHighlightRules = function() {
        var keywords = (
            "@enduml|@startuml|activate|again|also|alt|as|autonumber|bottom|box|break|center|create|critical|deactivate|destroy|down|else|end|endif|endwhile|footbox|footer|fork|group|header|hide|if|is|left|link|loop|namespace|newpage|note|of|on|opt|over|package|page|par|partition|ref|repeat|return|right|rotate|show|skin|skinparam|start|stop|title|top|top to bottom direction|up|while"
        );

        var builtinConstants = (
            "AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGreen|DarkGrey|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkSlateGrey|DarkTurquoise|DarkViolet|Darkorange|DeepPink|DeepSkyBlue|DimGray|DimGrey|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Green|GreenYellow|Grey|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGreen|LightGrey|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSlateGrey|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|SlateGrey|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen"
        );

        var builtinFunctions = (
            "abstract|actor|class|component|enum|interface|object|participant|state|usecase"
        );

        var keywordMapper = this.createKeywordMapper({
            "support.function": keywords + "|" + builtinFunctions,
            "constant.language": builtinConstants
        }, "identifier", true);

        this.$rules = {
            "start" : [ {
                token : "comment",
                regex : "'.*$"
            }, {
                token : "string",           // " string
                regex : '".*?"'
            }, {
                token : "string",           // ' string
                regex : "'.*?'"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "-?->|<-?-"
            }, {
                token : "paren.lparen",
                regex : "[\\(]"
            }, {
                token : "paren.rparen",
                regex : "[\\(]"
            }, {
                token : "text",
                regex : "\\s+"
            } ]
        };
    };

    oop.inherits(DiagramHighlightRules, TextHighlightRules);

    exports.DiagramHighlightRules = DiagramHighlightRules;
});

ace.define('ace/mode/folding/cstyle', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(acequire, exports, module) {
    var oop = acequire("../../lib/oop");
    var BaseFoldMode = acequire("./fold_mode").FoldMode;

    var FoldMode = exports.FoldMode = function(commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
            );
        }
    };
    oop.inherits(FoldMode, BaseFoldMode);

    (function() {

        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)|^note /;
        this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)|^end/;

        this.getFoldWidgetRange = function(session, foldStyle, row) {
            var line = session.getLine(row);
            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;

                if (match[1])
                    return this.openingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i + match[0].length, 1);
            }

            if (foldStyle !== "markbeginend")
                return;

            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;

                if (match[1])
                    return this.closingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i, -1);
            }
        };

    }).call(FoldMode.prototype);
});

ace.define('ace/mode/diagram', ["require", 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/diagram_highlight_rules', 'ace/mode/folding/cstyle'], function(acequire, exports, module) {
    "use strict";
    var oop = acequire("../lib/oop");
    var TextMode = acequire("./text").Mode;
    var Tokenizer = acequire("../tokenizer").Tokenizer;
    var DiagramHighlightRules = acequire("./diagram_highlight_rules").DiagramHighlightRules;
    var FoldMode = acequire("./folding/cstyle").FoldMode;

    var Mode = function() {
        var highlighter = new DiagramHighlightRules();
        this.foldingRules = new FoldMode();
        this.$tokenizer = new Tokenizer(highlighter.getRules());
        this.$keywordList = highlighter.$keywordList;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.lineCommentStart = "'";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
