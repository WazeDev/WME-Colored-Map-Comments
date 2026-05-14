// ==UserScript==
// @name         WME Colored Map Comments
// @namespace    Dude495
// @version      2026.05.14.01
// @author       Dude495
// @description  Change the color of Map Comment Points based on HEX Color Code.
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js

// @downloadURL https://update.greasyfork.org/scripts/380974/WME%20Colored%20Map%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/380974/WME%20Colored%20Map%20Comments.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global bootstrap */

(function main() {
    'use strict';

    let originalPointStyle = null;
    let originalHoverPointStyle = null;
    let originalSelectedPointStyle = null;
    let originalPolygonStyle = null;
    let originalHoverPolygonStyle = null;
    let originalSelectedPolygonStyle = null;

    const updateMessage = 'SDK migration for script tab registration.<br><br>';
    const scriptName = GM_info.script.name;
    const scriptVersion = GM_info.script.version;
    const downloadUrl = 'https://update.greasyfork.org/scripts/380974/WME%20Colored%20Map%20Comments.user.js';
    const forumUrl = 'https://www.waze.com/forum/viewtopic.php?f=819&t=279838';

    function ChangeColor() {
        const defaultRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.default.rules;
        const highlightRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.highlight.rules;
        const selectRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.highlightselected.rules;
        const mcStyle = defaultRules[0];
        const hoverStyle = highlightRules[1];
        const selectedStyle = selectRules[1];

        if (!originalPointStyle && mcStyle && mcStyle.symbolizer.Point) {
            originalPointStyle = { ...mcStyle.symbolizer.Point };
            originalHoverPointStyle = { ...hoverStyle.symbolizer.Point };
            originalSelectedPointStyle = { ...selectedStyle.symbolizer.Point };
        }
        if (!originalPolygonStyle && mcStyle && mcStyle.symbolizer.Polygon) {
            originalPolygonStyle = { ...mcStyle.symbolizer.Polygon };
            originalHoverPolygonStyle = { ...hoverStyle.symbolizer.Polygon };
            originalSelectedPolygonStyle = { ...selectedStyle.symbolizer.Polygon };
        }

        if (mcStyle) {
        // MC Points
            if ($('#MCP').is(':checked')) {
                mcStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                mcStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity');
                hoverStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                hoverStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity') - 0.1;
                selectedStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
            } else {
                mcStyle.symbolizer.Point.fillColor = '#ffffff';
                mcStyle.symbolizer.Point.fillOpacity = '0.3';
                hoverStyle.symbolizer.Point.fillColor = '#ffffff';
                hoverStyle.symbolizer.Point.fillOpacity = '0.3';
                selectedStyle.symbolizer.Point.fillColor = '#ffffff';
                selectedStyle.symbolizer.Point.fillOpacity = '0.3';
            }

            // MC Areas
            if ($('#MCA').is(':checked')) {
                mcStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                mcStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                mcStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity');
                hoverStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                hoverStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                hoverStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity') - 0.1;
                selectedStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                selectedStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
            } else {
                mcStyle.symbolizer.Polygon.fillColor = '#ffffff';
                mcStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                mcStyle.symbolizer.Polygon.fillOpacity = '0.3';
                hoverStyle.symbolizer.Polygon.fillColor = '#ffffff';
                hoverStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                hoverStyle.symbolizer.Polygon.fillOpacity = '0.3';
                selectedStyle.symbolizer.Polygon.fillColor = '#ffffff';
                selectedStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                selectedStyle.symbolizer.Polygon.fillOpacity = '0.3';
            }
            W.map.getLayersByName('mapComments')[0].redraw();
        }
    }
    function Save() {
        localStorage.setItem('CMC-Point', $('#CMC-Point').val());
        localStorage.setItem('CMC-Area', $('#CMC-Area').val());
        localStorage.setItem('CMC-MCPOpacity', $('#MCP-Slider').val() / 100);
        localStorage.setItem('CMC-MCAOpacity', $('#MCA-Slider').val() / 100);
        ChangeColor();
        $('#CMC-colorWheelPoint')[0].value = localStorage.getItem('CMC-Point');
        $('#CMC-colorWheelArea')[0].value = localStorage.getItem('CMC-Area');
        localStorage.setItem('MCP', $('#MCP').is(':checked'));
        localStorage.setItem('MCA', $('#MCA').is(':checked'));
        /* console.log(['CMC Settings Saved:',
                     'CMC-Point: '+localStorage.getItem('CMC-Point'),
                     'CMC-Area: '+localStorage.getItem('CMC-Area'),
                     'CMC-MCPOpacity: '+localStorage.getItem('CMC-MCPOpacity'),
                     'CMC-MCAOpacity: '+localStorage.getItem('CMC-MCAOpacity'),
                    ].join('\n')); */
    }

	async function init(sdk) {
		// Register the sidebar tab via the WME SDK
		const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
		tabLabel.textContent = 'MC Colors';
		tabLabel.title = 'Colored Map Comments';

		// Build the panel HTML inside tabPane
		const panel = document.createElement('div');
		panel.id = 'CMC-Panel';
		panel.innerHTML = [
			`<h5 style="color:black">Colored Map Comments v${GM_info.script.version}</h5>`,
			'<label><input data-toggle="tooltip" type="checkbox" id="MCP" title="Enable Color Highlighting for MC Points"> Colored MC Points</label>',
			'<br>',
			'<textarea style="resize:none;width:85px;height:25px;" rows="1" cols="10" maxlength="7" id="CMC-Point" title="Enter HEX Color Code (include #)"></textarea>',
			`<input style="width:25px;margin-left:5px;top:-7px;position:relative;" id="CMC-colorWheelPoint" type="color" value="${localStorage.getItem('CMC-Point') || '#ffffff'}">`,
			'<div class="rangeslider" title="Set opacity level" style="width:100px;"><input type="range" min="1" max="100" value="10" class="myslider" id="MCP-Slider"></div>',
			'<br>',
			'<label><input id="MCA" type="checkbox" title="Enable Color Highlighting for MC Area Polygons"> Colored MC Areas</label><br>',
			'<textarea style="resize:none;width:85px;height:25px;" rows="1" cols="10" maxlength="7" id="CMC-Area" title="Enter HEX Color Code (include #)"></textarea>',
			`<input style="width:25px;margin-left:5px;top:-7px;position:relative;" id="CMC-colorWheelArea" type="color" value="${localStorage.getItem('CMC-Area') || '#ffffff'}">`,
			'<div class="rangeslider" title="Set opacity level" style="width:100px;"><input type="range" min="1" max="100" value="10" id="MCA-Slider" class="myslider"></div>',
			'<button class="btn btn-success" style="margin-bottom:25px;" id="CMC-Save" title="Only needed if you manually change the HEX Code">Save</button>'
		].join('');
		tabPane.appendChild(panel);

		// Wire up event handlers (now directly on the DOM elements — no jQuery tab callback needed)
		document.getElementById('MCP').checked = localStorage.getItem('MCP') === 'true';
		document.getElementById('MCA').checked = localStorage.getItem('MCA') === 'true';
		document.getElementById('CMC-Point').value = localStorage.getItem('CMC-Point') || '';
		document.getElementById('CMC-Area').value = localStorage.getItem('CMC-Area') || '';
		document.getElementById('MCP-Slider').value = (localStorage.getItem('CMC-MCPOpacity') || 0.3) * 100;
		document.getElementById('MCA-Slider').value = (localStorage.getItem('CMC-MCAOpacity') || 0.3) * 100;

		document.getElementById('CMC-colorWheelPoint').onchange = function() {
			document.getElementById('CMC-Point').value = this.value;
			Save();
		};
		document.getElementById('CMC-colorWheelArea').onchange = function() {
			document.getElementById('CMC-Area').value = this.value;
			Save();
		};
		document.getElementById('MCP-Slider').onchange = Save;
		document.getElementById('MCA-Slider').onchange = Save;
		document.getElementById('MCP').onchange = Save;
		document.getElementById('MCA').onchange = Save;
		document.getElementById('CMC-Save').onclick = Save;

		ChangeColor();
	}

    async function sandboxBootstrap() {
        if (WazeWrap?.Ready) {
            const sdk = await bootstrap({
                scriptUpdateMonitor: { downloadUrl }
            });
            init(sdk);
            WazeWrap.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl, forumUrl);
        } else {
            setTimeout(sandboxBootstrap, 250);
        }
    }

    // Start the "sandboxed" code.
    sandboxBootstrap();
    console.log(`${scriptName} initialized.`);
})();
