/* ESPHome Remote Configurator — HA sidebar panel (Web Component)
 * Registered as: esphome-remote-configurator-panel
 * Entity browsing uses hass.states — no CORS, no token needed.
 */
(function () {
  'use strict';

  /* ── Google Fonts (injected into main document; propagate to shadow) ── */
  if (!document.querySelector('#espr-fonts')) {
    const link = document.createElement('link');
    link.id = 'espr-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }

  /* ── Icon library ───────────────────────────────────────────────────── */
  const ICONS = [
    ['lightbulb-on',            'F06E8'],
    ['lightbulb-outline',       'F0336'],
    ['lightbulb-off-outline',   'F1A84'],
    ['led-strip-variant',       'F1051'],
    ['led-strip-variant-off',   'F1A4B'],
    ['led-strip',               'F07D6'],
    ['light-switch',            'F097E'],
    ['light-switch-off',        'F1A24'],
    ['ceiling-light',           'F1147'],
    ['ceiling-light-outline',   'F1148'],
    ['floor-lamp',              'F1097'],
    ['floor-lamp-outline',      'F1098'],
    ['desk-lamp',               'F1015'],
    ['desk-lamp-outline',       'F1016'],
    ['lamp',                    'F06B5'],
    ['fan',                     'F0210'],
    ['fan-off',                 'F0F37'],
    ['thermometer',             'F050F'],
    ['thermometer-off',         'F12B4'],
    ['home-thermometer',        'F0F55'],
    ['home-thermometer-outline','F0F56'],
    ['radiator',                'F06BB'],
    ['radiator-off',            'F1A23'],
    ['snowflake',               'F0717'],
    ['snowflake-off',           'F1260'],
    ['air-conditioner',         'F0025'],
    ['fire',                    'F0238'],
    ['power-plug',              'F06A4'],
    ['power-plug-off',          'F0E01'],
    ['power-plug-off-outline',  'F13C1'],
    ['electric-switch',         'F0F7E'],
    ['electric-switch-closed',  'F0F7F'],
    ['toggle-switch',           'F0538'],
    ['toggle-switch-off',       'F053A'],
    ['television',              'F0502'],
    ['television-off',          'F0F53'],
    ['speaker',                 'F04C3'],
    ['speaker-off',             'F0E45'],
    ['monitor',                 'F03B0'],
    ['television-play',         'F0F00'],
    ['home',                    'F02DC'],
    ['home-outline',            'F06A1'],
    ['sofa',                    'F04B8'],
    ['sofa-outline',            'F157E'],
    ['bed',                     'F02E3'],
    ['fridge',                  'F1240'],
    ['fridge-outline',          'F1241'],
    ['washing-machine',         'F09B2'],
    ['dishwasher',              'F1360'],
    ['microwave',               'F1107'],
    ['coffee',                  'F00E9'],
    ['kettle',                  'F109B'],
    ['oven',                    'F1108'],
    ['lock',                    'F033E'],
    ['lock-open-outline',       'F0FC9'],
    ['door-open',               'F0783'],
    ['door-closed',             'F07F2'],
    ['garage',                  'F02D9'],
    ['garage-open',             'F07D3'],
    ['window-open',             'F0A4C'],
    ['window-closed',           'F0A4B'],
    ['car',                     'F010B'],
    ['car-side',                'F1724'],
    ['robot-vacuum',            'F0B26'],
    ['motion-sensor',           'F1020'],
    ['solar-panel',             'F0A02'],
    ['water',                   'F058E'],
    ['water-pump',              'F0590'],
    ['flower',                  'F024A'],
  ];

  /* ── CSS ─────────────────────────────────────────────────────────── */
  const CSS = `
:host {
  display: block;
  height: 100%;
  position: relative;
  --bg:        #0d1117;
  --bg2:       #161b22;
  --bg3:       #21262d;
  --border:    #30363d;
  --border2:   #444c56;
  --fg:        #e6edf3;
  --fg2:       #8b949e;
  --fg3:       #6e7681;
  --accent:    #00d4aa;
  --accent-bg: #00d4aa1a;
  --accent-d:  #00a88a;
  --danger:    #f85149;
  --warn:      #d29922;
  --mono:      'JetBrains Mono', monospace;
  --sans:      'Inter', system-ui, sans-serif;
  color-scheme: dark;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.5;
}
* { box-sizing: border-box; margin: 0; }
#app { display: flex; flex-direction: column; height: 100%; overflow: hidden; position: relative; }

/* ── Header ── */
.header {
  display: flex; align-items: center; gap: 12px;
  padding: 0 16px; height: 52px;
  background: var(--bg2); border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.header-title { font-size: 15px; font-weight: 600; color: var(--fg); display: flex; align-items: center; gap: 8px; }
.header-title .logo {
  width: 22px; height: 22px; background: var(--accent); border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #000;
}
.header-spacer { flex: 1; }
.ha-conn-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; background: var(--bg3);
  border: 1px solid var(--border); border-radius: 6px;
  color: var(--fg2); font-size: 13px; cursor: pointer;
  font-family: var(--sans); transition: border-color .15s, color .15s;
}
.ha-conn-btn:hover { border-color: var(--accent); color: var(--accent); }
.ha-conn-btn.connected { color: var(--accent); border-color: var(--accent); }
.conn-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }

/* ── Tabs ── */
.tabs {
  display: flex; background: var(--bg2);
  border-bottom: 1px solid var(--border); padding: 0 16px; flex-shrink: 0;
}
.tab-btn {
  padding: 10px 16px; font-size: 13px; font-weight: 500;
  color: var(--fg2); background: none; border: none;
  border-bottom: 2px solid transparent; cursor: pointer;
  font-family: var(--sans); transition: color .15s, border-color .15s;
  margin-bottom: -1px;
}
.tab-btn:hover { color: var(--fg); }
.tab-btn.active { color: var(--accent); border-color: var(--accent); }

/* ── Workspace ── */
.workspace { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.tab-panel { display: none; flex: 1; overflow: hidden; }
.tab-panel.active { display: flex; flex: 1; overflow: hidden; }

/* ── Devices two-panel ── */
.devices-layout { display: flex; flex: 1; overflow: hidden; }
.device-list-panel {
  width: 280px; min-width: 220px; flex-shrink: 0;
  display: flex; flex-direction: column;
  border-right: 1px solid var(--border); overflow: hidden;
}
.panel-header {
  padding: 12px 14px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.shortcut-section-header {
  border-top: 2px solid var(--border2);
  margin-top: 4px;
  position: sticky;
  top: 0;
  background: var(--bg2);
  z-index: 1;
}
.panel-title { font-size: 12px; font-weight: 600; color: var(--fg2); text-transform: uppercase; letter-spacing: .07em; flex: 1; }
.btn-icon {
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  background: var(--bg3); border: 1px solid var(--border); border-radius: 6px;
  cursor: pointer; color: var(--fg2); font-size: 16px; line-height: 1;
  transition: all .15s; font-family: var(--sans);
}
.btn-icon:hover { border-color: var(--accent); color: var(--accent); }
.device-list-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.device-list { padding: 6px; }
.device-card {
  display: flex; align-items: center; gap: 8px;
  padding: 10px; border-radius: 6px; cursor: pointer;
  border: 1px solid transparent; margin-bottom: 3px;
  transition: background .1s, border-color .1s; position: relative;
}
.device-card:hover { background: var(--bg3); }
.device-card.selected { background: var(--accent-bg); border-color: var(--accent); }
.device-card.dragging { opacity: .4; }
.device-card.drag-over { border-color: var(--accent); border-style: dashed; }
.drag-handle { color: var(--fg3); cursor: grab; font-size: 14px; padding: 2px; flex-shrink: 0; }
.drag-handle:active { cursor: grabbing; }
.device-card-info { flex: 1; min-width: 0; }
.device-card-name { font-size: 13px; font-weight: 500; color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.device-card-sub { font-size: 11px; color: var(--fg3); font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.device-card-type { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.type-light    { background: #d2992210; color: var(--warn); }
.type-rgb      { background: #e05cad12; color: #e05cad; }
.type-switch   { background: #00d4aa10; color: var(--accent); }
.type-climate  { background: #388bfd10; color: #388bfd; }
.type-shortcut { background: #9e6aff10; color: #9e6aff; }
.device-del-btn {
  opacity: 0; padding: 3px 6px; background: none; border: none;
  color: var(--danger); cursor: pointer; font-size: 14px;
  border-radius: 4px; flex-shrink: 0; font-family: var(--sans); transition: opacity .1s;
}
.device-card:hover .device-del-btn { opacity: 1; }

/* ── Editor ── */
.device-editor { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.editor-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--fg3); gap: 12px; }
.editor-empty-icon { font-size: 40px; }
.editor-empty-text { font-size: 14px; }
.editor-form { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
.editor-form-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.editor-form-title { font-size: 15px; font-weight: 600; }
.btn-save { padding: 7px 16px; background: var(--accent); color: #000; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--sans); transition: background .15s; }
.btn-save:hover { background: var(--accent-d); }

/* Form fields */
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-row { display: flex; gap: 14px; }
.field-row .field-group { flex: 1; min-width: 0; }
label { font-size: 12px; font-weight: 500; color: var(--fg2); }
.field-hint { font-size: 11px; color: var(--fg3); }
input[type=text], input[type=number], select, textarea {
  width: 100%; padding: 8px 10px;
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: 6px; color: var(--fg); font-size: 13px;
  font-family: var(--mono); transition: border-color .15s; outline: none;
}
input[type=text]:focus, input[type=number]:focus, select:focus, textarea:focus { border-color: var(--accent); }
select { cursor: pointer; }
.entity-field-wrap { position: relative; }
.entity-browse-btn {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  padding: 3px 8px; background: var(--bg2); border: 1px solid var(--border);
  border-radius: 4px; color: var(--fg2); font-size: 11px; cursor: pointer;
  font-family: var(--sans); transition: all .15s;
}
.entity-browse-btn:hover { border-color: var(--accent); color: var(--accent); }

/* Toggle */
.toggle-row { display: flex; align-items: center; gap: 10px; }
.toggle { width: 38px; height: 20px; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; position: relative; cursor: pointer; flex-shrink: 0; transition: background .15s, border-color .15s; }
.toggle.on { background: var(--accent); border-color: var(--accent); }
.toggle::after { content: ''; position: absolute; width: 14px; height: 14px; background: var(--fg3); border-radius: 50%; top: 2px; left: 2px; transition: transform .15s, background .15s; }
.toggle.on::after { transform: translateX(18px); background: #000; }
.toggle-label { font-size: 13px; color: var(--fg); }

/* Type tabs */
.type-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.type-tab { padding: 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; color: var(--fg2); font-size: 12px; font-weight: 500; text-align: center; cursor: pointer; transition: all .15s; font-family: var(--sans); }
.type-tab:hover { border-color: var(--border2); color: var(--fg); }
.type-tab.active.light    { border-color: var(--warn);   color: var(--warn);   background: #d2992210; }
.type-tab.active.switch   { border-color: var(--accent);  color: var(--accent);  background: var(--accent-bg); }
.type-tab.active.climate  { border-color: #388bfd; color: #388bfd; background: #388bfd10; }
.type-tab.active.shortcut { border-color: #9e6aff; color: #9e6aff; background: #9e6aff10; }

/* RGB color list */
.color-list { display: flex; flex-direction: column; gap: 6px; margin-top: 2px; }
.color-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; }
.color-swatch { width: 32px; height: 32px; border: none; border-radius: 5px; cursor: pointer; padding: 0; background: none; flex-shrink: 0; }
.color-name { flex: 1; font-family: var(--sans); font-size: 12px; background: transparent; border: none; color: var(--fg); outline: none; min-width: 0; }
.color-name::placeholder { color: var(--fg3); }
.color-name:focus { color: var(--fg); }
.color-del-btn { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid transparent; border-radius: 4px; cursor: pointer; color: var(--fg3); font-size: 11px; font-family: var(--sans); flex-shrink: 0; transition: all .1s; }
.color-del-btn:hover { border-color: var(--danger); color: var(--danger); background: #f8514910; }
.color-list-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
.color-count-hint { font-size: 11px; color: var(--fg3); }
.btn-add-color { padding: 5px 10px; background: var(--bg3); border: 1px solid var(--border); border-radius: 5px; color: var(--fg2); font-size: 12px; font-family: var(--sans); cursor: pointer; transition: all .15s; }
.btn-add-color:hover { border-color: var(--accent); color: var(--accent); }

/* Icon picker */
.icon-pair { display: flex; gap: 12px; }
.icon-browse-hint { margin-top: 8px; font-size: 11px; color: var(--fg3); line-height: 1.6; }
.icon-browse-hint a { color: var(--accent); text-decoration: none; }
.icon-browse-hint a:hover { text-decoration: underline; }
.icon-browse-hint code { font-family: var(--mono); font-size: 10px; background: var(--bg3); padding: 1px 4px; border-radius: 3px; color: var(--fg2); }
.icon-pair .field-group { flex: 1; }
.icon-picker-wrap { position: relative; }
.icon-preview { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: border-color .15s; user-select: none; }
.icon-preview:hover { border-color: var(--accent); }
.icon-glyph { font-size: 11px; font-family: var(--mono); color: var(--accent); background: var(--accent-bg); padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.icon-name-text { font-size: 11px; font-family: var(--mono); color: var(--fg2); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.icon-code { font-size: 11px; font-family: var(--mono); color: var(--fg3); flex-shrink: 0; }
.icon-dropdown { position: fixed; background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; z-index: 9999; box-shadow: 0 8px 32px #0008; overflow: hidden; display: none; }
.icon-search-wrap { padding: 10px; border-bottom: 1px solid var(--border); }
.icon-search-wrap input { font-family: var(--sans); }
.icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 4px; padding: 8px; max-height: 220px; overflow-y: auto; }
.icon-grid-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: all .1s; }
.icon-grid-item:hover { background: var(--bg3); border-color: var(--border); }
.icon-grid-item.selected { background: var(--accent-bg); border-color: var(--accent); }
.icon-grid-glyph { font-size: 9px; font-family: var(--mono); color: var(--accent); background: var(--accent-bg); padding: 2px 4px; border-radius: 3px; margin-bottom: 2px; }
.icon-grid-label { font-size: 9px; color: var(--fg3); text-align: center; line-height: 1.3; word-break: break-all; }
.icon-manual-row { padding: 8px 10px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
.icon-manual-row label { font-size: 11px; white-space: nowrap; color: var(--fg2); }
.icon-manual-row input { font-size: 12px; font-family: var(--mono); flex: 1; }
.icon-manual-apply { padding: 5px 10px; background: var(--bg3); border: 1px solid var(--border); border-radius: 5px; color: var(--fg2); font-size: 12px; cursor: pointer; font-family: var(--sans); white-space: nowrap; }
.icon-manual-apply:hover { border-color: var(--accent); color: var(--accent); }

/* Climate modes */
.climate-modes-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.mode-chip { padding: 4px 10px; background: var(--bg3); border: 1px solid var(--border); border-radius: 20px; font-size: 12px; color: var(--fg2); cursor: pointer; transition: all .15s; font-family: var(--mono); }
.mode-chip.active { background: #388bfd18; border-color: #388bfd; color: #388bfd; }

/* ── Settings ── */
.settings-layout { flex: 1; overflow-y: auto; padding: 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; align-content: start; }
.settings-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.settings-card-header { padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--fg); }
.settings-card-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.radio-group { display: flex; flex-direction: column; gap: 8px; }
.radio-option { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: border-color .15s, background .15s; }
.radio-option:hover { border-color: var(--border2); }
.radio-option.selected { border-color: var(--accent); background: var(--accent-bg); }
.radio-option input[type=radio] { margin-top: 3px; accent-color: var(--accent); flex-shrink: 0; }
.radio-option-text { min-width: 0; }
.radio-option-title { font-size: 13px; font-weight: 500; color: var(--fg); }
.radio-option-desc { font-size: 11px; color: var(--fg3); margin-top: 2px; }
.timeout-row { display: flex; align-items: center; gap: 10px; }
.timeout-row input[type=number] { width: 80px; flex-shrink: 0; }
.timeout-unit { padding: 8px 10px; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-size: 13px; font-family: var(--mono); cursor: pointer; outline: none; }
.timeout-unit:focus { border-color: var(--accent); }

/* ── Export ── */
.export-layout { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.export-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.export-card-header { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
.export-card-title { font-size: 13px; font-weight: 600; flex: 1; }
.export-card-sub { font-size: 12px; color: var(--fg3); }
.btn-copy { padding: 5px 12px; background: var(--bg3); border: 1px solid var(--border); border-radius: 5px; color: var(--fg2); font-size: 12px; cursor: pointer; font-family: var(--sans); transition: all .15s; }
.btn-copy:hover { border-color: var(--accent); color: var(--accent); }
.btn-copy.copied { border-color: var(--accent); color: var(--accent); }
.code-block { padding: 16px; font-family: var(--mono); font-size: 12px; line-height: 1.65; color: var(--fg); white-space: pre; overflow-x: auto; max-height: 380px; overflow-y: auto; background: var(--bg); }
.export-notice { padding: 12px 16px; background: #d2992215; border: 1px solid #d2992230; border-radius: 6px; font-size: 12px; color: #d29922; line-height: 1.6; }

/* ── Entity Browser Drawer (position: absolute fills the panel) ── */
.ha-drawer-overlay { position: absolute; inset: 0; background: #0008; z-index: 200; display: none; align-items: flex-start; justify-content: flex-end; }
.ha-drawer-overlay.open { display: flex; }
.ha-drawer { width: 360px; height: 100%; background: var(--bg2); border-left: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.ha-drawer-header { padding: 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
.ha-drawer-title { font-size: 15px; font-weight: 600; flex: 1; }
.btn-close { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg2); font-size: 18px; font-family: var(--sans); transition: all .15s; }
.btn-close:hover { border-color: var(--danger); color: var(--danger); }
.ha-drawer-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; overflow: hidden; }
.entity-type-filter { display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }
.filter-chip { padding: 4px 10px; background: var(--bg3); border: 1px solid var(--border); border-radius: 20px; font-size: 11px; font-weight: 500; color: var(--fg3); cursor: pointer; transition: all .15s; font-family: var(--sans); }
.filter-chip.active { background: var(--accent-bg); border-color: var(--accent); color: var(--accent); }
.entity-search { flex-shrink: 0; }
.ha-entity-scroll { flex: 1; overflow-y: auto; }
.entity-item { padding: 8px 10px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: all .1s; }
.entity-item:hover { background: var(--bg3); border-color: var(--border); }
.entity-item-id { font-size: 12px; font-family: var(--mono); color: var(--fg); }
.entity-item-friendly { font-size: 11px; color: var(--fg3); }
.ha-status { font-size: 12px; color: var(--fg3); flex-shrink: 0; }
.ha-status.ok { color: var(--accent); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--border2); }

/* Responsive */
@media (max-width: 640px) {
  .devices-layout { flex-direction: column; }
  .device-list-panel { width: 100%; border-right: none; border-bottom: 1px solid var(--border); max-height: 200px; }
  .settings-layout { grid-template-columns: 1fr; }
  .ha-drawer { width: 100%; }
  .field-row { flex-direction: column; gap: 12px; }
  .icon-pair { flex-direction: column; }
}
`;

  /* ── HTML template ───────────────────────────────────────────────── */
  const HTML = `
<style>${CSS}</style>
<div id="app">

  <header class="header">
    <div class="header-title">
      <div class="logo">ER</div>
      ESPHome Remote Config
    </div>
    <div class="header-spacer"></div>
    <button class="ha-conn-btn connected" id="haConnBtn">
      <div class="conn-dot"></div>
      <span id="entityCountText">Loading…</span>
    </button>
  </header>

  <div class="tabs">
    <button class="tab-btn active" id="tabBtnDevices">Devices</button>
    <button class="tab-btn" id="tabBtnSettings">Settings</button>
    <button class="tab-btn" id="tabBtnExport">Export YAML</button>
  </div>

  <div class="workspace">

    <!-- DEVICES TAB -->
    <div class="tab-panel active" id="tab-devices">
      <div class="devices-layout">
        <div class="device-list-panel">
          <div class="panel-header">
            <span class="panel-title">Devices (<span id="deviceCount">0</span>)</span>
            <button class="btn-icon" id="btnAddDevice" title="Add device">＋</button>
          </div>
          <div class="device-list-scroll">
            <div class="device-list" id="deviceList"></div>
            <div class="panel-header shortcut-section-header" id="shortcutSectionHeader">
              <span class="panel-title">Shortcuts (<span id="shortcutCount">0</span>)</span>
              <button class="btn-icon" id="btnAddShortcut" title="Add shortcut">＋</button>
            </div>
            <div class="device-list" id="shortcutList"></div>
          </div>
        </div>

        <div class="device-editor" id="deviceEditor">
          <div class="editor-empty" id="editorEmpty">
            <div class="editor-empty-icon">📡</div>
            <div class="editor-empty-text">Select a device to edit, or add a new one</div>
          </div>
          <div class="editor-form" id="editorForm" style="display:none">
            <div class="editor-form-header">
              <span class="editor-form-title" id="editorTitle">Edit Device</span>
              <button class="btn-save" id="btnSaveDevice">Save</button>
            </div>

            <div class="field-group">
              <label>Device Type</label>
              <div class="type-tabs">
                <button class="type-tab active light"   id="typeTabLight">💡 Light</button>
                <button class="type-tab switch"         id="typeTabSwitch">🔌 Switch</button>
                <button class="type-tab climate"        id="typeTabClimate">🌡️ Climate</button>
                <button class="type-tab shortcut"       id="typeTabShortcut">⚡ Shortcut</button>
              </div>
            </div>

            <div class="field-group" id="entityRow">
              <label id="entityRowLabel">Entity ID</label>
              <div class="entity-field-wrap">
                <input type="text" id="fEntityId" placeholder="light.my_light" spellcheck="false">
                <button class="entity-browse-btn" id="browseBtn" title="Browse HA entities">Browse HA</button>
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label>Display Name</label>
                <input type="text" id="fDisplayName" placeholder="LED Desk">
              </div>
              <div class="field-group">
                <label>Key <span style="color:var(--fg3)">(unique ID)</span></label>
                <input type="text" id="fKey" placeholder="led_desk" spellcheck="false">
              </div>
            </div>

            <div id="lightFields">
              <div class="field-row">
                <div class="field-group">
                  <label>Brightness Step (%)</label>
                  <input type="number" id="fBrightnessStep" value="5" min="1" max="50">
                </div>
                <div class="field-group">
                  <label>Dimmable</label>
                  <div class="toggle-row" style="margin-top:8px">
                    <div class="toggle on" id="dimmableToggle"></div>
                    <span class="toggle-label" id="dimmableLabel">Yes</span>
                  </div>
                </div>
              </div>
              <div class="field-group">
                <label>RGB Light</label>
                <div class="toggle-row" style="margin-top:8px">
                  <div class="toggle" id="rgbToggle"></div>
                  <span class="toggle-label" id="rgbToggleLabel">No</span>
                </div>
                <span class="field-hint">When enabled, hold OK on the remote opens a color submenu</span>
              </div>
            </div>

            <div id="climateFields" style="display:none">
              <div class="field-row">
                <div class="field-group">
                  <label>Temp Step (°)</label>
                  <input type="number" id="fTempStep" value="1" min="0.5" max="5" step="0.5">
                </div>
                <div class="field-group">
                  <label>HVAC Modes</label>
                  <div class="climate-modes-wrap" id="climateModes">
                    <div class="mode-chip active" data-mode="off">off</div>
                    <div class="mode-chip" data-mode="heat">heat</div>
                    <div class="mode-chip" data-mode="cool">cool</div>
                    <div class="mode-chip" data-mode="heat_cool">heat_cool</div>
                    <div class="mode-chip" data-mode="fan_only">fan_only</div>
                    <div class="mode-chip" data-mode="dry">dry</div>
                    <div class="mode-chip" data-mode="auto">auto</div>
                  </div>
                </div>
              </div>
            </div>

            <div id="rgbFields" style="display:none">
              <div class="field-group">
                <label>Predefined Colors <span style="color:var(--fg3)">(shown in hold-OK submenu on remote)</span></label>
                <div class="color-list" id="rgbColorList"></div>
                <div class="color-list-footer">
                  <span class="color-count-hint" id="colorCountHint">0 / 8 colors</span>
                  <button class="btn-add-color" id="btnAddColor">＋ Add Color</button>
                </div>
              </div>
            </div>

            <div id="shortcutFields" style="display:none">
              <div class="field-group">
                <label>Button ID <span style="color:var(--fg3)">(physical button on remote)</span></label>
                <select id="fButtonId">
                  <option value="sw1">sw1</option>
                  <option value="sw2">sw2</option>
                  <option value="sw3">sw3</option>
                </select>
              </div>
            </div>

            <div id="iconFields">
              <div class="icon-pair">
                <div class="field-group">
                  <label>Icon (ON)</label>
                  <div class="icon-picker-wrap" id="iconOnWrap">
                    <div class="icon-preview" id="iconOnPreview">
                      <span class="icon-glyph" id="iconOnGlyph">F06E8</span>
                      <span class="icon-name-text" id="iconOnName">mdi-lightbulb-on</span>
                      <span class="icon-code" id="iconOnCode"></span>
                    </div>
                  </div>
                </div>
                <div class="field-group">
                  <label>Icon (OFF)</label>
                  <div class="icon-picker-wrap" id="iconOffWrap">
                    <div class="icon-preview" id="iconOffPreview">
                      <span class="icon-glyph" id="iconOffGlyph">F0336</span>
                      <span class="icon-name-text" id="iconOffName">mdi-lightbulb-outline</span>
                      <span class="icon-code" id="iconOffCode"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="icon-browse-hint">
                Looking for a specific icon? Browse the full MDI library at
                <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener">pictogrammers.com/library/mdi</a>
                — find your icon, copy its 5-digit hex code (e.g. <code>F06E8</code>), then type it into the picker above.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- SETTINGS TAB -->
    <div class="tab-panel" id="tab-settings">
      <div class="settings-layout">

        <div class="settings-card">
          <div class="settings-card-header">⏱ Display &amp; Sleep</div>
          <div class="settings-card-body">
            <div class="field-group">
              <label>Screen Timeout</label>
              <div class="timeout-row">
                <input type="number" id="sScreenTimeoutVal" value="30" min="5" max="600">
                <select class="timeout-unit" id="sScreenTimeoutUnit">
                  <option value="s">seconds</option>
                  <option value="min">minutes</option>
                </select>
              </div>
              <span class="field-hint">How long before the display turns off after the last button press</span>
            </div>
            <div class="field-group">
              <label>Sleep Timeout</label>
              <div class="timeout-row">
                <input type="number" id="sSleepTimeoutVal" value="5" min="1" max="600">
                <select class="timeout-unit" id="sSleepTimeoutUnit">
                  <option value="s">seconds</option>
                  <option value="min">minutes</option>
                </select>
              </div>
              <span class="field-hint">How long after screen off before ESP32 enters deep sleep (only applies when Deep Sleep is selected below)</span>
            </div>
            <div class="field-group">
              <label>After Screen Off</label>
              <div class="radio-group">
                <label class="radio-option selected" id="radioSleep_deep">
                  <input type="radio" name="sleep_mode" value="deep" checked>
                  <div class="radio-option-text">
                    <div class="radio-option-title">Deep Sleep</div>
                    <div class="radio-option-desc">ESP32 fully powers down. Lowest battery use. Press OK to wake (takes 2–3s to reconnect).</div>
                  </div>
                </label>
                <label class="radio-option" id="radioSleep_screen">
                  <input type="radio" name="sleep_mode" value="screen">
                  <div class="radio-option-text">
                    <div class="radio-option-title">Screen Off Only</div>
                    <div class="radio-option-desc">Display turns off, WiFi stays connected. Instant wake, higher battery use.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-card">
          <div class="settings-card-header">📡 WiFi Power Save</div>
          <div class="settings-card-body">
            <div class="radio-group">
              <label class="radio-option" id="radioWifi_NONE">
                <input type="radio" name="wifi_ps" value="NONE">
                <div class="radio-option-text">
                  <div class="radio-option-title">None</div>
                  <div class="radio-option-desc">Radio always on. Fastest response, highest current draw.</div>
                </div>
              </label>
              <label class="radio-option selected" id="radioWifi_LIGHT">
                <input type="radio" name="wifi_ps" value="LIGHT" checked>
                <div class="radio-option-text">
                  <div class="radio-option-title">Light <span style="color:var(--accent);font-size:11px">Recommended</span></div>
                  <div class="radio-option-desc">802.11 DTIM sleep between beacons. ~50–300ms extra latency per action.</div>
                </div>
              </label>
              <label class="radio-option" id="radioWifi_HIGH">
                <input type="radio" name="wifi_ps" value="HIGH">
                <div class="radio-option-text">
                  <div class="radio-option-title">High</div>
                  <div class="radio-option-desc">Most aggressive sleep. Noticeable sluggishness. Not ideal for a remote.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-card">
          <div class="settings-card-header">🏠 Boot &amp; Navigation</div>
          <div class="settings-card-body">
            <div class="field-group">
              <label>Boot Page</label>
              <select id="sBootPage"></select>
              <span class="field-hint">Which device page shows first after power-on or wake from deep sleep</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- EXPORT TAB -->
    <div class="tab-panel" id="tab-export">
      <div class="export-layout">
        <div class="export-notice" id="exportNotice"></div>

        <div class="export-card">
          <div class="export-card-header">
            <span class="export-card-title">esphome-remote.yaml</span>
            <span class="export-card-sub">Replace your existing file</span>
            <button class="btn-copy" id="btnCopyMain">Copy</button>
          </div>
          <pre class="code-block" id="exportMain"></pre>
        </div>

        <div class="export-card">
          <div class="export-card-header">
            <span class="export-card-title">common.yaml — substitutions</span>
            <span class="export-card-sub">Replace the <code style="background:var(--bg3);padding:1px 5px;border-radius:3px;font-size:11px">substitutions:</code> block at the top of your common.yaml</span>
            <button class="btn-copy" id="btnCopyCommon">Copy</button>
          </div>
          <pre class="code-block" id="exportCommon"></pre>
        </div>

        <div class="export-card">
          <div class="export-card-header">
            <span class="export-card-title">common.yaml — font glyphs</span>
            <span class="export-card-sub">Replace the <code style="background:var(--bg3);padding:1px 5px;border-radius:3px;font-size:11px">glyphs:</code> list under your font_icons font</span>
            <button class="btn-copy" id="btnCopyGlyphs">Copy</button>
          </div>
          <pre class="code-block" id="exportGlyphs"></pre>
        </div>
      </div>
    </div>

  </div><!-- /workspace -->

  <!-- Entity Browser Drawer -->
  <div class="ha-drawer-overlay" id="haDrawerOverlay">
    <div class="ha-drawer" id="haDrawer">
      <div class="ha-drawer-header">
        <span class="ha-drawer-title">Browse Entities</span>
        <button class="btn-close" id="btnCloseDrawer">×</button>
      </div>
      <div class="ha-drawer-body">
        <div class="ha-status ok" id="haStatus"></div>
        <div class="entity-type-filter">
          <button class="filter-chip active" data-type="all"        id="filterAll">All</button>
          <button class="filter-chip" data-type="light"           id="filterLight">Lights</button>
          <button class="filter-chip" data-type="switch"          id="filterSwitch">Switches</button>
          <button class="filter-chip" data-type="climate"         id="filterClimate">Climate</button>
          <button class="filter-chip" data-type="automation"      id="filterAutomation">Automations</button>
        </div>
        <input type="text" id="haEntitySearch" class="entity-search" placeholder="Search entities…">
        <div class="ha-entity-scroll">
          <div id="haEntityList"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Icon picker dropdown (position:fixed — viewport coords from getBoundingClientRect) -->
  <div id="iconPickerDropdown" class="icon-dropdown">
    <div class="icon-search-wrap">
      <input type="text" id="iconSearch" placeholder="Search icons…">
    </div>
    <div class="icon-grid" id="iconGrid"></div>
    <div class="icon-manual-row">
      <label>Custom hex:</label>
      <input type="text" id="iconManualHex" placeholder="F06E8" maxlength="6" style="width:80px;text-transform:uppercase">
      <input type="text" id="iconManualName" placeholder="icon-name" style="flex:1">
      <button class="icon-manual-apply" id="btnApplyIcon">Apply</button>
    </div>
  </div>

</div><!-- /app -->
`;

  /* ── Web Component ───────────────────────────────────────────────── */
  class EspRemoteConfiguratorPanel extends HTMLElement {
    constructor() {
      super();
      this._hass = null;
      this._mounted = false;
      this.attachShadow({ mode: 'open' });
    }

    set hass(hass) {
      this._hass = hass;
      if (!this._mounted) {
        this._mounted = true;
        this._mount();
      } else if (this._onHassUpdate) {
        this._onHassUpdate();
      }
    }

    _mount() {
      const shadow = this.shadowRoot;
      const self = this;
      shadow.innerHTML = HTML;

      /* Helpers */
      const $ = id => shadow.getElementById(id);
      const $$ = sel => shadow.querySelectorAll(sel);

      function esc(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      function cap(s) { return s[0].toUpperCase() + s.slice(1); }

      /* ── State ─────────────────────────────────────────────────── */
      let state = {
        devices: [],
        settings: { screenTimeoutVal: 30, screenTimeoutUnit: 's', sleepTimeoutVal: 5, sleepTimeoutUnit: 's', sleepMode: 'deep', wifiPowerSave: 'LIGHT', bootPage: '' }
      };
      let selectedIndex = null;
      let editingDevice = null;
      let dimmableState = true;
      let activeIconTarget = null;
      let haEntityFilterType = 'all';

      /* ── Persist ────────────────────────────────────────────────── */
      function loadState() {
        try {
          const saved = localStorage.getItem('espremote-config');
          if (saved) { state = JSON.parse(saved); return; }
        } catch (e) {}
        state.devices = [
          { key:'led_desk',      type:'light',   entity_id:'light.lsc_led_strip_5_meter_rgbic_cctic', display_name:'LED Desk',      brightness_step:5, dimmable:true,  icon_on:'F06E8', icon_off:'F0336', hvac_modes:['off','heat'], temp_step:1 },
          { key:'led_shelf',     type:'light',   entity_id:'light.led_shelf',                         display_name:'LED Shelf',     brightness_step:5, dimmable:true,  icon_on:'F1051', icon_off:'F1A4B', hvac_modes:['off','heat'], temp_step:1 },
          { key:'lamp',          type:'light',   entity_id:'light.lamp_3',                            display_name:'Lamp',          brightness_step:5, dimmable:true,  icon_on:'F06E8', icon_off:'F0336', hvac_modes:['off','heat'], temp_step:1 },
          { key:'ceiling_light', type:'light',   entity_id:'light.wled_ceilinglight',                 display_name:'Ceiling Light', brightness_step:5, dimmable:true,  icon_on:'F06E8', icon_off:'F0336', hvac_modes:['off','heat'], temp_step:1 },
          { key:'closet',        type:'light',   entity_id:'light.closet',                            display_name:'Closet',        brightness_step:5, dimmable:false, icon_on:'F097E', icon_off:'F1A24', hvac_modes:['off','heat'], temp_step:1 },
          { key:'mercedes',      type:'light',   entity_id:'light.mb_light_12v_led',                  display_name:'Mercedes',      brightness_step:5, dimmable:false, icon_on:'F097E', icon_off:'F1A24', hvac_modes:['off','heat'], temp_step:1 },
          { key:'mini_fridge',   type:'light',   entity_id:'light.mini_fridge',                       display_name:'Mini Fridge',   brightness_step:5, dimmable:true,  icon_on:'F1240', icon_off:'F1241', hvac_modes:['off','heat'], temp_step:1 },
          { key:'thermostat',    type:'climate', entity_id:'climate.termostat',                        display_name:'Thermostat',    brightness_step:5, dimmable:false, icon_on:'F06E8', icon_off:'F0336', hvac_modes:['off','heat'], temp_step:1 },
        ];
        state.settings.bootPage = 'mercedes';
      }

      function saveState() {
        try { localStorage.setItem('espremote-config', JSON.stringify(state)); } catch (e) {}
      }

      /* ── HA entity source ───────────────────────────────────────── */
      function getHaEntities() {
        if (!self._hass) return [];
        return Object.entries(self._hass.states)
          .filter(([id]) => /^(light|switch|climate|automation)\./.test(id))
          .map(([id, s]) => ({ entity_id: id, attributes: s.attributes || {} }))
          .sort((a, b) => a.entity_id.localeCompare(b.entity_id));
      }

      /* ── Tabs ───────────────────────────────────────────────────── */
      function switchTab(id, btn) {
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        $$('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        $('tab-' + id).classList.add('active');
        if (id === 'export') renderExport();
        if (id === 'settings') syncSettingsUI();
      }

      $('tabBtnDevices').addEventListener('click', e => switchTab('devices', e.currentTarget));
      $('tabBtnSettings').addEventListener('click', e => switchTab('settings', e.currentTarget));
      $('tabBtnExport').addEventListener('click', e => switchTab('export', e.currentTarget));

      /* ── Device list ────────────────────────────────────────────── */
      function makeDeviceCard(dev, i) {
        const card = document.createElement('div');
        card.className = 'device-card' + (i === selectedIndex ? ' selected' : '');
        card.draggable = true;
        card.dataset.index = i;
        const sub = dev.type === 'shortcut'
          ? (dev.button_id ? `${dev.button_id} → ${dev.automation_id || 'none'}` : '')
          : dev.type === 'rgb'
            ? `${dev.entity_id || ''} · ${(dev.colors || []).length} color${(dev.colors || []).length !== 1 ? 's' : ''}`
            : (dev.entity_id || '');
        card.innerHTML = `
          <span class="drag-handle" title="Drag to reorder">⠿</span>
          <div class="device-card-info">
            <div class="device-card-name">${esc(dev.display_name)}</div>
            <div class="device-card-sub">${esc(sub)}</div>
          </div>
          <span class="device-card-type type-${dev.type}">${dev.type}</span>
          <button class="device-del-btn" data-del="${i}" title="Delete">✕</button>`;
        card.querySelector('.device-del-btn').addEventListener('click', e => { e.stopPropagation(); deleteDevice(i); });
        card.addEventListener('click', () => selectDevice(i));
        setupDrag(card, i);
        return card;
      }

      function renderDeviceList() {
        const list = $('deviceList');
        const scList = $('shortcutList');

        const devices   = state.devices.filter(d => d.type !== 'shortcut');
        const shortcuts = state.devices.filter(d => d.type === 'shortcut');

        $('deviceCount').textContent = devices.length;
        list.innerHTML = '';
        state.devices.forEach((dev, i) => {
          if (dev.type !== 'shortcut') list.appendChild(makeDeviceCard(dev, i));
        });

        $('shortcutCount').textContent = shortcuts.length;
        scList.innerHTML = '';
        state.devices.forEach((dev, i) => {
          if (dev.type === 'shortcut') scList.appendChild(makeDeviceCard(dev, i));
        });

        updateBootPageSelect();
      }

      function updateBootPageSelect() {
        const sel = $('sBootPage');
        const cur = state.settings.bootPage;
        sel.innerHTML = state.devices.filter(d => d.type !== 'shortcut').map(d =>
          `<option value="${esc(d.key)}"${d.key === cur ? ' selected' : ''}>${esc(d.display_name)}</option>`
        ).join('');
      }

      /* ── Drag & drop ────────────────────────────────────────────── */
      let dragSrc = null;
      function setupDrag(card, index) {
        card.addEventListener('dragstart', e => { dragSrc = index; card.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag-over'); });
        card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
        card.addEventListener('drop', e => {
          e.preventDefault(); card.classList.remove('drag-over');
          if (dragSrc !== null && dragSrc !== index) {
            const [moved] = state.devices.splice(dragSrc, 1);
            state.devices.splice(index, 0, moved);
            selectedIndex = null; saveState(); renderDeviceList(); showEditorEmpty();
          }
          dragSrc = null;
        });
      }

      /* ── Select / add / delete ──────────────────────────────────── */
      function selectDevice(i) {
        selectedIndex = i;
        editingDevice = JSON.parse(JSON.stringify(state.devices[i]));
        populateEditor(editingDevice);
        renderDeviceList();
      }

      const DEFAULT_RGB_COLORS = [
        { name: 'Warm White', hex: '#ffd6a0' },
        { name: 'Cool White', hex: '#cce8ff' },
        { name: 'Red',        hex: '#ff0000' },
        { name: 'Green',      hex: '#00cc44' },
        { name: 'Blue',       hex: '#0066ff' },
        { name: 'Purple',     hex: '#8800ff' },
      ];

      function addDevice(type = 'light') {
        const colors = type === 'rgb' ? DEFAULT_RGB_COLORS.map(c => ({ ...c })) : [];
        editingDevice = { key: '', type, entity_id: '', display_name: '', brightness_step: 5, dimmable: true, icon_on: 'F06E8', icon_off: 'F0336', hvac_modes: ['off'], temp_step: 1, button_id: 'sw1', automation_id: '', colors };
        selectedIndex = null;
        populateEditor(editingDevice, true);
        renderDeviceList();
      }

      function deleteDevice(i) {
        if (!confirm(`Delete "${state.devices[i].display_name}"?`)) return;
        state.devices.splice(i, 1);
        if (selectedIndex === i) { selectedIndex = null; showEditorEmpty(); }
        else if (selectedIndex > i) selectedIndex--;
        saveState(); renderDeviceList();
      }

      function showEditorEmpty() {
        $('editorEmpty').style.display = '';
        $('editorForm').style.display = 'none';
      }

      $('btnAddDevice').addEventListener('click', () => addDevice('light'));
      $('btnAddShortcut').addEventListener('click', () => addDevice('shortcut'));

      /* ── Editor ─────────────────────────────────────────────────── */
      function populateEditor(dev, isNew = false) {
        $('editorEmpty').style.display = 'none';
        $('editorForm').style.display = '';
        $('editorTitle').textContent = isNew ? 'Add Device' : 'Edit: ' + dev.display_name;
        $('fKey').value = dev.key;
        $('fEntityId').value = dev.type === 'shortcut' ? (dev.automation_id || '') : (dev.entity_id || '');
        $('fDisplayName').value = dev.display_name;
        $('fButtonId').value = dev.button_id || 'sw1';
        $('fBrightnessStep').value = dev.brightness_step || 5;
        $('fTempStep').value = dev.temp_step || 1;
        setEditorTypeUI(dev.type);
        dimmableState = dev.dimmable !== false;
        $('dimmableToggle').className = 'toggle' + (dimmableState ? ' on' : '');
        $('dimmableLabel').textContent = dimmableState ? 'Yes' : 'No';
        const modes = dev.hvac_modes || ['off'];
        $$('#climateModes .mode-chip').forEach(c => {
          c.classList.toggle('active', modes.includes(c.dataset.mode));
        });
        setIconUI('on', dev.icon_on || 'F06E8');
        setIconUI('off', dev.icon_off || 'F0336');
        if (dev.type === 'rgb') renderColorList(dev.colors || []);
        // Reset key manual flag when populating
        $('fKey').dataset.manual = dev.key ? '1' : '';
      }

      /* ── RGB color list ─────────────────────────────────────────── */
      function hexToRgb(hex) {
        const n = parseInt((hex || '#ffffff').slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      }

      function renderColorList(colors) {
        const container = $('rgbColorList');
        container.innerHTML = '';
        (colors || []).forEach((color, i) => {
          const row = document.createElement('div');
          row.className = 'color-row';
          row.innerHTML = `
            <input type="color" class="color-swatch" value="${esc(color.hex || '#ffffff')}" title="Pick color">
            <input type="text" class="color-name" placeholder="e.g. Warm White" value="${esc(color.name || '')}">
            <button class="color-del-btn" title="Remove">✕</button>`;
          row.querySelector('.color-swatch').addEventListener('input', e => {
            if (editingDevice && editingDevice.colors[i]) editingDevice.colors[i].hex = e.target.value;
          });
          row.querySelector('.color-name').addEventListener('input', e => {
            if (editingDevice && editingDevice.colors[i]) editingDevice.colors[i].name = e.target.value;
          });
          row.querySelector('.color-del-btn').addEventListener('click', () => {
            if (!editingDevice) return;
            editingDevice.colors.splice(i, 1);
            renderColorList(editingDevice.colors);
          });
          container.appendChild(row);
        });
        $('colorCountHint').textContent = `${(colors || []).length} / 8 colors`;
      }

      $('btnAddColor').addEventListener('click', () => {
        if (!editingDevice) return;
        if (!editingDevice.colors) editingDevice.colors = [];
        if (editingDevice.colors.length >= 8) { alert('Maximum 8 colors'); return; }
        editingDevice.colors.push({ name: '', hex: '#ffffff' });
        renderColorList(editingDevice.colors);
      });

      function setRgbToggle(on) {
        $('rgbToggle').className = 'toggle' + (on ? ' on' : '');
        $('rgbToggleLabel').textContent = on ? 'Yes' : 'No';
        $('rgbFields').style.display = on ? '' : 'none';
        if (editingDevice) {
          editingDevice.type = on ? 'rgb' : 'light';
          if (on && !editingDevice.colors) {
            editingDevice.colors = DEFAULT_RGB_COLORS.map(c => ({ ...c }));
            renderColorList(editingDevice.colors);
          }
        }
      }

      function setEditorTypeUI(type) {
        // 'rgb' maps to the light tab — it's a light with the RGB toggle on
        const tabType = (type === 'rgb') ? 'light' : type;
        $$('.type-tab').forEach(b => {
          b.classList.remove('active');
          if (b.id === 'typeTab' + cap(tabType)) b.classList.add('active');
        });
        const isShortcut = type === 'shortcut';
        const isRgb      = type === 'rgb';
        const isLight    = type === 'light' || isRgb;
        $('lightFields').style.display    = isLight ? '' : 'none';
        $('rgbFields').style.display      = isRgb ? '' : 'none';
        $('climateFields').style.display  = type === 'climate' ? '' : 'none';
        $('shortcutFields').style.display = isShortcut ? '' : 'none';
        $('iconFields').style.display     = (type === 'climate' || isShortcut) ? 'none' : '';
        $('entityRowLabel').textContent   = isShortcut ? 'Automation ID' : 'Entity ID';
        $('fEntityId').placeholder        = isShortcut ? 'automation.wakey_on (or "none")' : 'light.my_light';
        // Sync RGB toggle to reflect actual type without firing the click handler
        const rgbOn = isRgb;
        $('rgbToggle').className = 'toggle' + (rgbOn ? ' on' : '');
        $('rgbToggleLabel').textContent = rgbOn ? 'Yes' : 'No';
        if (editingDevice) {
          editingDevice.type = type;
          if (isRgb && !editingDevice.colors) {
            editingDevice.colors = DEFAULT_RGB_COLORS.map(c => ({ ...c }));
            renderColorList(editingDevice.colors);
          }
        }
      }

      $('rgbToggle').addEventListener('click', () => {
        const isNowRgb = !$('rgbToggle').classList.contains('on');
        setRgbToggle(isNowRgb);
      });

      $('typeTabLight').addEventListener('click', () => setEditorTypeUI('light'));
      $('typeTabSwitch').addEventListener('click', () => setEditorTypeUI('switch'));
      $('typeTabClimate').addEventListener('click', () => setEditorTypeUI('climate'));
      $('typeTabShortcut').addEventListener('click', () => setEditorTypeUI('shortcut'));

      $('dimmableToggle').addEventListener('click', () => {
        dimmableState = !dimmableState;
        $('dimmableToggle').className = 'toggle' + (dimmableState ? ' on' : '');
        $('dimmableLabel').textContent = dimmableState ? 'Yes' : 'No';
      });

      // Auto-gen key from display name
      $('fDisplayName').addEventListener('input', function () {
        const keyField = $('fKey');
        if (!keyField.dataset.manual) {
          keyField.value = this.value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        }
      });
      $('fKey').addEventListener('input', function () {
        this.dataset.manual = this.value ? '1' : '';
      });
      // Auto-detect type from entity_id prefix
      $('fEntityId').addEventListener('input', function () {
        const v = this.value.trim();
        if (v.startsWith('light.')) setEditorTypeUI('light');
        else if (v.startsWith('switch.')) setEditorTypeUI('switch');
        else if (v.startsWith('climate.')) setEditorTypeUI('climate');
        else if (v.startsWith('automation.')) setEditorTypeUI('shortcut');
      });

      // Climate mode chips
      $$('#climateModes .mode-chip').forEach(chip => {
        chip.addEventListener('click', () => chip.classList.toggle('active'));
      });

      /* ── Save device ────────────────────────────────────────────── */
      function saveDevice() {
        if (!editingDevice) return;
        editingDevice.key = $('fKey').value.trim().replace(/\s+/g, '_').toLowerCase();
        editingDevice.display_name = $('fDisplayName').value.trim();
        if (editingDevice.type === 'shortcut') {
          editingDevice.automation_id = $('fEntityId').value.trim();
          editingDevice.button_id = $('fButtonId').value.trim();
        } else {
          editingDevice.entity_id = $('fEntityId').value.trim();
          editingDevice.brightness_step = parseInt($('fBrightnessStep').value) || 5;
          editingDevice.temp_step = parseFloat($('fTempStep').value) || 1;
          editingDevice.dimmable = dimmableState;
          editingDevice.hvac_modes = [...$$('#climateModes .mode-chip.active')].map(c => c.dataset.mode);
          if (editingDevice.hvac_modes.length === 0) editingDevice.hvac_modes = ['off'];
          if (editingDevice.type === 'rgb') {
            // colors are tracked live via input listeners; just filter empty names
            editingDevice.colors = (editingDevice.colors || []).filter(c => c.name.trim() || c.hex);
          }
        }

        if (!editingDevice.key) { alert('Key is required'); return; }
        if (editingDevice.type === 'shortcut') {
          if (!editingDevice.button_id) { alert('Button ID is required (e.g. sw1)'); return; }
        } else {
          if (!editingDevice.entity_id) { alert('Entity ID is required'); return; }
        }
        if (!editingDevice.display_name) { alert('Display Name is required'); return; }

        if (selectedIndex === null) {
          if (state.devices.some(d => d.key === editingDevice.key)) { alert(`Key "${editingDevice.key}" is already used.`); return; }
          state.devices.push(editingDevice);
          selectedIndex = state.devices.length - 1;
        } else {
          const oldKey = state.devices[selectedIndex].key;
          if (editingDevice.key !== oldKey && state.devices.some((d, i) => i !== selectedIndex && d.key === editingDevice.key)) {
            alert(`Key "${editingDevice.key}" is already used.`); return;
          }
          state.devices[selectedIndex] = editingDevice;
          if (state.settings.bootPage === oldKey) state.settings.bootPage = editingDevice.key;
        }
        saveState(); renderDeviceList();
        $('editorTitle').textContent = 'Edit: ' + editingDevice.display_name;
      }

      $('btnSaveDevice').addEventListener('click', saveDevice);

      /* ── Icon picker ────────────────────────────────────────────── */
      function findIcon(code) { return ICONS.find(([, c]) => c === code) || [code, code]; }

      function setIconUI(target, code) {
        const [name] = findIcon(code);
        $('icon' + cap(target) + 'Glyph').textContent = code;
        $('icon' + cap(target) + 'Name').textContent = 'mdi-' + name;
        $('icon' + cap(target) + 'Code').textContent = '';
        if (editingDevice) editingDevice['icon_' + target] = code;
      }

      function openIconPicker(target) {
        closeIconPicker();
        activeIconTarget = target;
        const wrap = $('icon' + cap(target) + 'Wrap');
        const rect = wrap.getBoundingClientRect();
        const picker = $('iconPickerDropdown');
        picker.style.display = 'block';
        const spaceBelow = window.innerHeight - rect.bottom;
        picker.style.top = (spaceBelow > 350 ? rect.bottom + 4 : Math.max(8, rect.top - 360)) + 'px';
        picker.style.left = Math.min(rect.left, window.innerWidth - 320) + 'px';
        picker.style.width = Math.min(340, window.innerWidth - 32) + 'px';
        $('iconSearch').value = '';
        $('iconManualHex').value = editingDevice ? (editingDevice['icon_' + target] || '') : '';
        renderIconGrid();
        $('iconSearch').focus();
      }

      function closeIconPicker() {
        $('iconPickerDropdown').style.display = 'none';
        activeIconTarget = null;
      }

      function renderIconGrid() {
        const q = $('iconSearch').value.toLowerCase();
        const grid = $('iconGrid');
        const curCode = editingDevice ? editingDevice['icon_' + activeIconTarget] : '';
        const filtered = q ? ICONS.filter(([n]) => n.includes(q)) : ICONS;
        grid.innerHTML = filtered.map(([name, code]) => {
          const sel = code === curCode ? ' selected' : '';
          return `<div class="icon-grid-item${sel}" data-code="${code}" data-name="${name}" title="${name} (${code})">
            <span class="icon-grid-glyph">${code}</span>
            <span class="icon-grid-label">${name}</span>
          </div>`;
        }).join('');
        grid.querySelectorAll('.icon-grid-item').forEach(item => {
          item.addEventListener('click', () => {
            setIconUI(activeIconTarget, item.dataset.code);
            closeIconPicker();
          });
        });
      }

      function applyManualIcon() {
        let hex = $('iconManualHex').value.trim().toUpperCase().replace(/^F?/, 'F');
        if (!/^F[0-9A-F]{4}$/.test(hex)) { alert('Enter a valid 5-hex codepoint like F06E8'); return; }
        setIconUI(activeIconTarget, hex);
        closeIconPicker();
      }

      $('iconOnPreview').addEventListener('click', () => openIconPicker('on'));
      $('iconOffPreview').addEventListener('click', () => openIconPicker('off'));
      $('iconSearch').addEventListener('input', renderIconGrid);
      $('btnApplyIcon').addEventListener('click', applyManualIcon);

      // Close icon picker on outside click
      shadow.addEventListener('click', e => {
        const picker = $('iconPickerDropdown');
        if (picker.style.display !== 'none' && !picker.contains(e.target) && !e.target.closest('.icon-preview')) {
          closeIconPicker();
        }
      });

      /* ── Entity Browser Drawer ──────────────────────────────────── */
      function openHaDrawer() {
        // Auto-select the matching filter for the current device type
        if (editingDevice) {
          const typeToFilter = { light: 'light', switch: 'switch', climate: 'climate', shortcut: 'automation' };
          const f = typeToFilter[editingDevice.type] || 'all';
          const filterIdMap = { all: 'filterAll', light: 'filterLight', switch: 'filterSwitch', climate: 'filterClimate', automation: 'filterAutomation' };
          const btn = $(filterIdMap[f] || 'filterAll');
          if (btn) filterEntities(f, btn);
        }
        renderHaEntities();
        $('haDrawerOverlay').classList.add('open');
      }

      function closeHaDrawer() {
        $('haDrawerOverlay').classList.remove('open');
      }

      function filterEntities(type, btn) {
        haEntityFilterType = type;
        $$('.filter-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        renderHaEntities();
      }

      function renderHaEntities() {
        const q = $('haEntitySearch').value.toLowerCase();
        let entities = getHaEntities();
        if (haEntityFilterType !== 'all') entities = entities.filter(e => e.entity_id.startsWith(haEntityFilterType + '.'));
        if (q) entities = entities.filter(e => e.entity_id.includes(q) || (e.attributes.friendly_name || '').toLowerCase().includes(q));
        const list = $('haEntityList');
        if (entities.length === 0) {
          list.innerHTML = '<div class="ha-status">No entities match.</div>';
          return;
        }
        list.innerHTML = '';
        entities.slice(0, 150).forEach(e => {
          const div = document.createElement('div');
          div.className = 'entity-item';
          div.innerHTML = `<div class="entity-item-id">${esc(e.entity_id)}</div>${e.attributes.friendly_name ? `<div class="entity-item-friendly">${esc(e.attributes.friendly_name)}</div>` : ''}`;
          div.addEventListener('click', () => selectHaEntity(e.entity_id, e.attributes.friendly_name || ''));
          list.appendChild(div);
        });
      }

      function selectHaEntity(entityId, friendly) {
        $('fEntityId').value = entityId;
        if (!$('fDisplayName').value) {
          $('fDisplayName').value = friendly || '';
          const keyField = $('fKey');
          if (!keyField.dataset.manual) {
            keyField.value = (friendly || entityId).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
          }
        }
        if (entityId.startsWith('light.')) setEditorTypeUI('light');
        else if (entityId.startsWith('switch.')) setEditorTypeUI('switch');
        else if (entityId.startsWith('climate.')) setEditorTypeUI('climate');
        else if (entityId.startsWith('automation.')) { setEditorTypeUI('shortcut'); $('fEntityId').value = entityId; }
        closeHaDrawer();
      }

      $('haConnBtn').addEventListener('click', openHaDrawer);
      $('browseBtn').addEventListener('click', openHaDrawer);
      $('btnCloseDrawer').addEventListener('click', closeHaDrawer);
      $('haDrawerOverlay').addEventListener('click', e => { if (e.target === $('haDrawerOverlay')) closeHaDrawer(); });
      $('haEntitySearch').addEventListener('input', renderHaEntities);
      $('filterAll').addEventListener('click',        e => filterEntities('all', e.currentTarget));
      $('filterLight').addEventListener('click',      e => filterEntities('light', e.currentTarget));
      $('filterSwitch').addEventListener('click',     e => filterEntities('switch', e.currentTarget));
      $('filterClimate').addEventListener('click',    e => filterEntities('climate', e.currentTarget));
      $('filterAutomation').addEventListener('click', e => filterEntities('automation', e.currentTarget));

      /* ── Settings ───────────────────────────────────────────────── */
      function syncSettingsUI() {
        const s = state.settings;
        $('sScreenTimeoutVal').value = s.screenTimeoutVal;
        $('sScreenTimeoutUnit').value = s.screenTimeoutUnit;
        $('sSleepTimeoutVal').value = s.sleepTimeoutVal ?? 5;
        $('sSleepTimeoutUnit').value = s.sleepTimeoutUnit ?? 's';
        $$('[name=sleep_mode]').forEach(r => { r.checked = r.value === s.sleepMode; });
        $$('[name=wifi_ps]').forEach(r => { r.checked = r.value === s.wifiPowerSave; });
        $$('.radio-option').forEach(el => {
          const r = el.querySelector('input[type=radio]');
          if (r) el.classList.toggle('selected', r.checked);
        });
        updateBootPageSelect();
      }

      function saveSettings() {
        state.settings.screenTimeoutVal = parseInt($('sScreenTimeoutVal').value) || 30;
        state.settings.screenTimeoutUnit = $('sScreenTimeoutUnit').value;
        state.settings.sleepTimeoutVal = parseInt($('sSleepTimeoutVal').value) || 5;
        state.settings.sleepTimeoutUnit = $('sSleepTimeoutUnit').value;
        state.settings.bootPage = $('sBootPage').value;
        saveState();
      }

      shadow.addEventListener('change', e => {
        const t = e.target;
        if (t.name === 'sleep_mode') {
          state.settings.sleepMode = t.value;
          $$('[name=sleep_mode]').forEach(r => r.closest('.radio-option').classList.toggle('selected', r.checked));
          saveSettings();
        } else if (t.name === 'wifi_ps') {
          state.settings.wifiPowerSave = t.value;
          $$('[name=wifi_ps]').forEach(r => r.closest('.radio-option').classList.toggle('selected', r.checked));
          saveSettings();
        } else if (['sScreenTimeoutVal','sScreenTimeoutUnit','sSleepTimeoutVal','sSleepTimeoutUnit','sBootPage'].includes(t.id)) {
          saveSettings();
        }
      });

      /* ── YAML generation ────────────────────────────────────────── */
      function getTimeout() {
        const s = state.settings;
        return s.screenTimeoutVal + s.screenTimeoutUnit;
      }

      function getSleepTimeout() {
        const s = state.settings;
        return (s.sleepTimeoutVal ?? 5) + (s.sleepTimeoutUnit ?? 's');
      }

      function getBootPage() {
        const pages = state.devices.filter(d => d.type !== 'shortcut');
        const key = state.settings.bootPage || (pages[0] && pages[0].key) || 'none';
        return 'page_' + key;
      }

      function getAllGlyphs() {
        const codes = new Set();
        state.devices.forEach(d => {
          if (d.type === 'shortcut') return;
          if (d.icon_on) codes.add(d.icon_on);
          if (d.icon_off) codes.add(d.icon_off);
        });
        return [...codes].sort();
      }

      function iconComment(code) {
        const [name] = findIcon(code);
        return `      - "\\U000${code}"  # mdi-${name}`;
      }

      function genMainYaml() {
        const devs = state.devices;
        let out = `# esphome-remote.yaml — generated by ESPHome Remote Configurator\n# edit device order/settings in the configurator\n\npackages:\n  common: !include espremote/common.yaml\n  dev_page: !include espremote/dev_page.yaml\n`;
        if (devs.length === 0) {
          out += `  no_devices: !include espremote/devices/_no_devices_placeholder.yaml\n`;
        } else {
          devs.forEach(dev => {
            if (dev.type === 'shortcut') {
              out += `\n  ${dev.key}: !include\n    file: espremote/shortcut_button.yaml\n    vars:\n`;
              out += `      button_id: "${dev.button_id || 'sw1'}"\n`;
              out += `      automation_id: "${dev.automation_id || 'none'}"\n`;
              return;
            }
            const tpl = dev.type === 'climate' ? '_template_climate.yaml'
                      : dev.type === 'switch'  ? '_template_switch.yaml'
                      : dev.type === 'rgb'     ? '_template_rgb.yaml'
                      :                          '_template_light.yaml';
            out += `\n  ${dev.key}: !include\n    file: espremote/devices/${tpl}\n    vars:\n`;
            out += `      key: "${dev.key}"\n      entity_id: "${dev.entity_id}"\n      display_name: "${dev.display_name}"\n`;
            if (dev.type === 'light') {
              out += `      brightness_step: "${dev.brightness_step || 5}"\n      dimmable: "${dev.dimmable ? 'true' : 'false'}"\n`;
              out += `      icon_on: "\\U000F${(dev.icon_on || '06E8').replace(/^F/, '').toUpperCase()}"\n`;
              out += `      icon_off: "\\U000F${(dev.icon_off || '0336').replace(/^F/, '').toUpperCase()}"\n`;
            } else if (dev.type === 'rgb') {
              out += `      brightness_step: "${dev.brightness_step || 5}"\n      dimmable: "${dev.dimmable ? 'true' : 'false'}"\n`;
              out += `      icon_on: "\\U000F${(dev.icon_on || '06E8').replace(/^F/, '').toUpperCase()}"\n`;
              out += `      icon_off: "\\U000F${(dev.icon_off || '0336').replace(/^F/, '').toUpperCase()}"\n`;
              const colors = (dev.colors || []).filter(c => c.name.trim() || c.hex);
              out += `      color_count: "${colors.length}"\n`;
              colors.forEach((c, idx) => {
                const [r, g, b] = hexToRgb(c.hex);
                out += `      color${idx + 1}_name: "${c.name.trim() || `Color ${idx + 1}`}"\n`;
                out += `      color${idx + 1}_r: "${r}"\n`;
                out += `      color${idx + 1}_g: "${g}"\n`;
                out += `      color${idx + 1}_b: "${b}"\n`;
              });
            } else if (dev.type === 'switch') {
              out += `      icon_on: "\\U000F${(dev.icon_on || '06E8').replace(/^F/, '').toUpperCase()}"\n`;
              out += `      icon_off: "\\U000F${(dev.icon_off || '0336').replace(/^F/, '').toUpperCase()}"\n`;
            } else if (dev.type === 'climate') {
              out += `      temp_step: "${dev.temp_step || 1}"\n      hvac_modes: "${(dev.hvac_modes || ['off', 'heat']).join(',')}"\n`;
            }
          });
        }
        const pages = devs.filter(d => d.type !== 'shortcut');
        const bootKey = state.settings.bootPage || (pages[0] && pages[0].key) || '';
        const bootIdx = pages.findIndex(d => d.key === bootKey);
        const pageIndex = bootIdx >= 0 ? bootIdx + 1 : 1;
        out += `\nesphome:\n  on_boot:\n    then:\n      - display.page.show: ${getBootPage()}\n      - lambda: id(current_page_index) = ${pageIndex};\n      - component.update: oled\n`;
        return out;
      }

      function genCommonSubst() {
        const s = state.settings;
        const pages = state.devices.filter(d => d.type !== 'shortcut');
        return `substitutions:\n  screen_timeout: "${getTimeout()}"\n  sleep_timeout: "${getSleepTimeout()}"\n  # "screen" = stay connected, display off\n  # "deep"   = ESP32 deep sleep (OK button wakes)\n  sleep_mode: "${s.sleepMode}"\n  # WiFi power save: NONE | LIGHT | HIGH\n  power_save_mode: "${s.wifiPowerSave}"\n  total_pages: "${pages.length}"`;
      }

      function genGlyphs() {
        const codes = getAllGlyphs();
        if (codes.length === 0) return `    glyphs:\n      - "\\U000F0336"  # mdi-lightbulb-outline\n      - "\\U000F06E8"  # mdi-lightbulb-on`;
        return `    glyphs:\n` + codes.map(iconComment).join('\n');
      }

      function renderExport() {
        const n = state.devices.length;
        $('exportNotice').textContent = n === 0
          ? '⚠️  No devices configured — add at least one device before flashing.'
          : `${n} device${n !== 1 ? 's' : ''} configured. Copy each block into its file, then run: esphome run esphome-remote.yaml`;
        $('exportMain').textContent = genMainYaml();
        $('exportCommon').textContent = genCommonSubst();
        $('exportGlyphs').textContent = genGlyphs();
      }

      function copyExport(which, btn) {
        const ids = { main: 'exportMain', common: 'exportCommon', glyphs: 'exportGlyphs' };
        const text = $(ids[which]).textContent;

        function confirm() {
          btn.textContent = 'Copied!'; btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        }

        function fallback() {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0;';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          try { document.execCommand('copy'); confirm(); } catch (e) {}
          document.body.removeChild(ta);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(confirm).catch(fallback);
        } else {
          fallback();
        }
      }

      $('btnCopyMain').addEventListener('click', e => copyExport('main', e.currentTarget));
      $('btnCopyCommon').addEventListener('click', e => copyExport('common', e.currentTarget));
      $('btnCopyGlyphs').addEventListener('click', e => copyExport('glyphs', e.currentTarget));

      /* ── Hass update callback ───────────────────────────────────── */
      self._onHassUpdate = function () {
        const count = getHaEntities().length;
        $('entityCountText').textContent = count + ' entities';
        $('haStatus').textContent = `${count} entities available`;
      };

      /* ── Init ───────────────────────────────────────────────────── */
      loadState();
      renderDeviceList();
      syncSettingsUI();
      self._onHassUpdate();
    }
  }

  customElements.define('esphome-remote-configurator-panel', EspRemoteConfiguratorPanel);
})();
