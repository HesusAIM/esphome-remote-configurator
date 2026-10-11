"""ESPHome Remote Configurator — HA sidebar panel."""
from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

DOMAIN = "esphome_remote_configurator"
_PANEL_JS = "panel.js"
_PANEL_URL = f"/{DOMAIN}/{_PANEL_JS}"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register static file and sidebar panel."""
    js_path = Path(__file__).parent / "frontend" / _PANEL_JS

    # Serve the Web Component JS file
    await hass.http.async_register_static_paths(
        [StaticPathConfig(_PANEL_URL, str(js_path), cache_headers=False)]
    )

    # Cache-bust using file modification time so the HA frontend module
    # loader always fetches a fresh copy after each update.
    try:
        mtime = int(js_path.stat().st_mtime)
    except OSError:
        mtime = 0
    js_url_versioned = f"{_PANEL_URL}?v={mtime}"

    # Register the panel (shows in HA sidebar)
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="ESPHome Remote",
        sidebar_icon="mdi:remote-tv",
        frontend_url_path="esphome-remote",
        config={
            "_panel_custom": {
                "name": "esphome-remote-configurator-panel",
                "js_url": js_url_versioned,
            }
        },
        require_admin=False,
    )
    return True
