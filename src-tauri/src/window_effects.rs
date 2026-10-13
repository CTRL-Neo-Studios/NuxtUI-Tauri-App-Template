//! Desktop-only window effects. Toggle each one from `lib.rs`.

use tauri::WebviewWindow;
use tauri_plugin_decorum::WebviewWindowExt;

/// Overlay titlebar + inset traffic lights (tauri-plugin-decorum).
/// Needs `.plugin(tauri_plugin_decorum::init())` on the builder.
pub fn decorum(window: &WebviewWindow) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    window.set_title_bar_style(tauri::TitleBarStyle::Overlay)?;
    window.create_overlay_titlebar()?;
    #[cfg(target_os = "macos")]
    window.set_traffic_lights_inset(12.0, 16.0)?;
    Ok(())
}

/// Native blur behind the webview (window-vibrancy). Linux: no-op (compositor-controlled).
/// Only visible where the page background is transparent.
#[allow(unused_variables)]
pub fn vibrancy(window: &WebviewWindow) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(target_os = "macos")]
    {
        // decorum's helper: transparent window without `macOSPrivateApi`
        window.make_transparent()?;
        window_vibrancy::apply_vibrancy(
            window,
            window_vibrancy::NSVisualEffectMaterial::HudWindow,
            None,
            None,
        )?;
    }
    #[cfg(target_os = "windows")]
    window_vibrancy::apply_blur(window, Some((18, 18, 18, 125)))?;
    Ok(())
}
