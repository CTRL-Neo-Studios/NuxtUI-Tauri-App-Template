#[cfg(desktop)]
mod window_effects;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init());

    #[cfg(desktop)] let builder = builder.plugin(tauri_plugin_decorum::init()); // decorum (1/2)

    builder
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // Desktop window effects: comment out a line to disable it.
            #[cfg(desktop)]
            {
                use tauri::Manager;
                let main = app.get_webview_window("main").unwrap();
                window_effects::decorum(&main)?; // decorum (2/2)
                // window_effects::vibrancy(&main)?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
