// ==UserScript==
// @name         WME Colored Map Comments
// @namespace    Dude495
// @version      2023.03.17.01
// @author       Dude495
// @description  Change the color of Map Comment Points based on HEX Color Code.
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
/* global W */
/* global $ */
/* global WazeWrap */
// ==/UserScript==

(function() {
    'use strict';
    function ChangeColor() {
        let defaultRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.default.rules;
        let highlightRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.highlight.rules;
        let selectRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.highlightselected.rules;
        let mcStyle = defaultRules[0];
        let hoverStyle = highlightRules[1];
        let selectedStyle = selectRules[1];
        if (mcStyle) {
            if ($('#MCP').is(':checked')) {
                mcStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                mcStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity');
                hoverStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                hoverStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity')-0.1;
                selectedStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                //selectedStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity');
                W.map.getLayersByName("mapComments")[0].redraw();
            } else {
                mcStyle.symbolizer.Point.fillColor = '#ffffff';
                mcStyle.symbolizer.Point.fillOpacity = '0.3'
                hoverStyle.symbolizer.Point.fillColor = '#ffffff';
                hoverStyle.symbolizer.Point.fillOpacity = '0.3'
                selectedStyle.symbolizer.Point.fillColor = '#ffffff';
                selectedStyle.symbolizer.Point.fillOpacity = '0.3'
                W.map.getLayersByName("mapComments")[0].redraw();
            }
            if ($('#MCA').is(':checked')) {
                mcStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                mcStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                mcStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity');
                hoverStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                hoverStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                hoverStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity')-0.1;
                selectedStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                selectedStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                //selectedStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity')
                W.map.getLayersByName("mapComments")[0].redraw();
            } else {
                mcStyle.symbolizer.Polygon.fillColor = '#ffffff';
                mcStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                mcStyle.symbolizer.Polygon.fillOpacity = '0.3'
                hoverStyle.symbolizer.Polygon.fillColor = '#ffffff';
                hoverStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                hoverStyle.symbolizer.Polygon.fillOpacity = '0.3'
                selectedStyle.symbolizer.Polygon.fillColor = '#ffffff';
                selectedStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                selectedStyle.symbolizer.Polygon.fillOpacity = '0.3'
                W.map.getLayersByName("mapComments")[0].redraw();
            }
        }
    }
    function Save() {
        localStorage.setItem('CMC-Point', $('#CMC-Point').val());
        localStorage.setItem('CMC-Area', $('#CMC-Area').val());
        localStorage.setItem('CMC-MCPOpacity', $('#MCP-Slider').val()/100);
        localStorage.setItem('CMC-MCAOpacity', $('#MCA-Slider').val()/100);
        ChangeColor();
        $('#CMC-colorWheelPoint')[0].value = localStorage.getItem('CMC-Point');
        $('#CMC-colorWheelArea')[0].value = localStorage.getItem('CMC-Area');
        localStorage.setItem('MCP', $('#MCP').is(':checked'));
        localStorage.setItem('MCA', $('#MCA').is(':checked'));
        /*console.log(['CMC Settings Saved:',
                     'CMC-Point: '+localStorage.getItem('CMC-Point'),
                     'CMC-Area: '+localStorage.getItem('CMC-Area'),
                     'CMC-MCPOpacity: '+localStorage.getItem('CMC-MCPOpacity'),
                     'CMC-MCAOpacity: '+localStorage.getItem('CMC-MCAOpacity'),
                    ].join('\n'));*/
    }
    function init() {
        var $section = $('<div id="CMC-Panel">');
        $section.html([
            '<h5 align="left" style="color:black">Colored Map Comments v'+GM_info.script.version+',</h5>',
            '<input data-toggle="tooltip" type="checkbox" id="MCP" title="Enable Color Highlighting for MC Points">Colored MC Points</input>',
            '<br>',
            '<textarea style="resize: none; width: 85px; height: 25px;" rows="1" cols="10" maxlength="7" id="CMC-Point" data-toggle="tooltip" title="Enter the HEX Color Code for the color you want Map Comments to appear. (Include the #)" maxlength="7"></textarea>',
            '<input style="width: 25px; margin-left: 5px; top: -7px; position: relative;" id="CMC-colorWheelPoint" type="color" value="'+localStorage.getItem("CMC-Point")+'"></input>',
            '<div class="rangeslider" title="Set opacity level" style="resize: none; width: 100px;"><input type="range" min="1" max="100" value="10" class="myslider" id="MCP-Slider"></div>',
            '<br>',
            '<input id="MCA" type="checkbox" title="Enable Color Highlighting for MC Area Polygons" data-toggle="tooltip">Colored MC Areas</input><br>',
            '<textarea style="resize: none; width: 85px; height: 25px;" rows="1" cols="10" maxlength="7" id="CMC-Area" data-toggle="tooltip" title="Enter the HEX Color Code for the color you want Map Comment Areas to appear. (Include the #)"></textarea>',
            '<input style="width: 25px; margin-left: 5px; top: -7px; position: relative;" id="CMC-colorWheelArea" type="color" value="'+localStorage.getItem("CMC-Area")+'">',
            '<div class="rangeslider" title="Set opacity level" style="resize: none; width: 100px;"><input type="range" min="1" max="100" value="10" id="MCA-Slider" class="myslider"></input></div>',
            '<button class="btn btn-success" style="margin-bottom: 25px;" id="CMC-Save" data-toggle="tooltip" title="This button is only needed if you manually change the HEX Code">Save</button>'
        ].join(' '));
        //$('#sidepanel-prefs').append($section);
        WazeWrap.Interface.Tab('MC Colors', $section.html(), ChangeColor, 'MC Colors');
        if (localStorage.getItem('MCP') === "true") {
            $('#MCP')[0].checked = true
        } else {
            $('#MCP')[0].checked = false
        }
        if (localStorage.getItem('MCA') === "true") {
            $('#MCA')[0].checked = true
        } else {
            $('#MCA')[0].checked = false
        }
        $('#CMC-colorWheelPoint')[0].onchange = function() {
            $('#CMC-Point')[0].value = $('#CMC-colorWheelPoint')[0].value;
            Save();
        }
        $("#CMC-Point").val(localStorage.getItem('CMC-Point'));
        $('#MCP-Slider').val(localStorage.getItem("CMC-MCPOpacity")*100);
        $('#MCA-Slider').val(localStorage.getItem("CMC-MCAOpacity")*100);
        $('#CMC-colorWheelArea')[0].onchange = function() {
            $('#CMC-Area')[0].value = $('#CMC-colorWheelArea')[0].value;
            Save();
        }
        $('#MCP-Slider')[0].onchange = function() {
            Save();
        }
        $('#MCA-Slider')[0].onchange = function() {
            Save();
        }
        $('#MCP')[0].onchange = function() {
            Save();
        }
        $('#MCA')[0].onchange = function() {
            Save();
        }
        $('#CMC-Save')[0].onclick = function() {
            Save();
        }
        $("#CMC-Area").val(localStorage.getItem('CMC-Area'));
        ChangeColor();
        $('[data-toggle="tooltip"]').tooltip();
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready) {
            console.log(GM_info.script.name, 'Initialized');
            init();
            WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, '<ul><li>Code Change<ol style="list-style-type: lower-alpha; padding-bottom: 0;"><li>Created tab in the <b>Scripts</b> section of the new WME interface instead of having the controls under WME Settings.</li></li></ul><br><br><br>', "https://greasyfork.org/en/scripts/380974-wme-colored-map-comments","https://www.waze.com/forum/viewtopic.php?f=819&t=279838");
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
