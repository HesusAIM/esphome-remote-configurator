# ESPHome Remote Configurator

A Home Assistant custom integration that adds a sidebar panel for configuring ESPHome-based remote controls. Browse your HA entities directly, map them to remote buttons, and export ready-to-flash ESPHome YAML — no token setup, no CORS issues.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

---

## Features

- **Sidebar panel** — lives inside HA, reads `hass.states` directly (no REST API, no token)
- **Entity browser** — filter lights, switches, and climate entities from your live HA instance
- **Device configurator** — map entities to remote buttons with icons, display names, and type-specific options
- **ESPHome YAML export** — generates complete, ready-to-flash remote firmware with `!include` structure
- **Settings** — sleep mode, Wi-Fi power save, screen timeout, boot page
- **Persistent** — config saved in `localStorage`, survives reloads

---

## Installation

### Via HACS (recommended)

1. Open HACS → **Integrations** → ⋮ menu → **Custom repositories**
2. Add `https://github.com/HesusAIM/esphome-remote-configurator` as an **Integration**
3. Find **ESPHome Remote Configurator** in HACS and click **Download**
4. Restart Home Assistant
5. Add to `configuration.yaml`:
   ```yaml
   esphome_remote_configurator:
   ```
6. Restart Home Assistant again — **ESPHome Remote** appears in the sidebar

### Manual

1. Copy `custom_components/esphome_remote_configurator/` into your HA `config/custom_components/` folder
2. Add to `configuration.yaml`:
   ```yaml
   esphome_remote_configurator:
   ```
3. Restart Home Assistant

---

## Usage

### Devices tab

Each row represents one button on your remote. Click **+ Add Device** to create a new entry.

| Field | Description |
|---|---|
| Key | Unique identifier used in YAML (e.g. `led_desk`) |
| Type | `light`, `switch`, or `climate` |
| Entity | Pick from your live HA entities via **Browse Entities** |
| Display name | Label shown on the remote's screen |
| Icon | MDI icon for on/off states |
| Dimmable | (lights only) enable long-press brightness control |
| HVAC modes | (climate only) modes available on the remote |

### Settings tab

| Setting | Description |
|---|---|
| Sleep mode | `none` / `dim` / `off` — what the screen does when idle |
| Wi-Fi power save | Reduce power consumption between state polls |
| Screen timeout | How long until sleep kicks in |
| Boot page | Which device page opens on power-on |

### Export tab

Generates a complete ESPHome YAML package. Copy it or download it, then flash via ESPHome dashboard or `esphome run`.

---

## Generated YAML structure

The export produces a single YAML file that uses the `packages:` key to include a shared remote base (fonts, display driver, encoder, BLE proxy, etc.). Device entries look like:

```yaml
substitutions:
  device_name: my_remote
  friendly_name: My Remote

packages:
  remote_base: !include remote_base.yaml

esphome:
  name: ${device_name}

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  power_save_mode: none

remote_pages:
  - key: led_desk
    type: light
    entity_id: light.lsc_led_strip_5_meter_rgbic_cctic
    display_name: LED Desk
    icon_on: "󰛈"
    icon_off: "󰍶"
    dimmable: true
    brightness_step: 5
```

---

## Requirements

- Home Assistant 2024.1.0 or later
- An ESPHome device flashed with a compatible remote base firmware (display + encoder)

---

## Development

```
custom_components/esphome_remote_configurator/
├── __init__.py          # Registers static path + sidebar panel
├── manifest.json        # Integration metadata
└── frontend/
    └── panel.js         # Web Component (shadow DOM, no build step)
```

The panel is a single vanilla JS file — no bundler, no framework. Edit `panel.js` and restart HA (or hard-reload the browser) to see changes.

---

## License

MIT
