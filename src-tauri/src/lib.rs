pub mod core;

use serde::{Deserialize, Serialize};
use std::{clone::Clone, sync::{Arc, Mutex}};
use tauri::{
    AppHandle, Manager, menu::{Menu, MenuItem}, tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use crate::core::{overlay::*, recoil::{Point, RecoilConfig, RecoilState, start_global_listener}};
use crate::core::screenshot::*;

pub struct AppState {
    pub payloads: Mutex<Vec<Payload>>,
    pub recoil_state: Arc<Mutex<Option<RecoilState>>>
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Payload {
    pub id: String,
    pub points: Vec<Point>,
    pub sensitivity: f64,
    pub steps: u32,
    pub rpm: u64,
    pub image: String,
}

#[tauri::command]
fn set_current(app: AppHandle, id: String) {
    println!("Setting current payload to {}", id);

    let app_state = app.state::<AppState>();
    let payloads = app_state.payloads.lock().unwrap();

    if let Some(payload) = payloads.iter().find(|p| p.id == id) {
        let new_state = RecoilState {
            points: payload.points.clone(),
            config: RecoilConfig {
                rpm: payload.rpm,
                sensitivity: payload.sensitivity,
                smooth_steps: payload.steps,
            },
            active: true,
        };

        let mut global_recoil = app_state.recoil_state.lock().unwrap();
        *global_recoil = Some(new_state);

        println!("Arma atualizada para: {}", id);
    }
}

#[tauri::command]
fn load_payloads(app: AppHandle, payloads: Vec<Payload>) {
    println!("Loading {} payloads", payloads.len());

    let app_state = app.state::<AppState>();

    let mut payloads_guard = app_state.payloads.lock().unwrap();

    *payloads_guard = payloads;
}

#[tauri::command]
fn hidden_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        window.hide().unwrap();
    }
}

#[tauri::command]
fn show_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        window.show().unwrap();
        window.set_focus().unwrap();
    }
}

#[tauri::command]
fn write_config_file(app_handle: tauri::AppHandle, filename: String, content: String) {
    let config_dir = app_handle.path().document_dir().unwrap().join("recoilly");

    if !config_dir.exists() {
        std::fs::create_dir_all(&config_dir).unwrap();
    }

    let path = config_dir.join(filename);
    std::fs::write(path, content).unwrap();
}

#[tauri::command]
fn read_config_file(app_handle: tauri::AppHandle, filename: String) -> Result<String, String> {
    let path = app_handle.path().document_dir().unwrap().join("recoilly").join(filename);

    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(_) => Ok("".to_string())
    }
}

#[tauri::command]
fn delete_config_file(app_handle: tauri::AppHandle, filename: String) {
    let path = app_handle.path().document_dir().unwrap().join("recoilly").join(filename);
    std::fs::remove_file(path).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let recoil_state = Arc::new(Mutex::new(None));

    start_global_listener(recoil_state.clone());

    tauri::Builder::default()
        .manage(AppState {
            payloads: Mutex::new(Vec::new()),
            recoil_state: recoil_state
        })
        .setup(move |app| {
            let app_handle = app.handle();
            setup_tray(&app_handle)?;

            let overlay = Overlay::new();

            let overlay_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyO);
            let active_shortcut = Shortcut::new(None, Code::F1);

            let overlay_s_clone = overlay_shortcut.clone();
            let active_s_clone = active_shortcut.clone();

            let _ = app_handle.plugin(
                tauri_plugin_global_shortcut::Builder::new()
                    .with_handler(move |myapp, shortcut, event| {
                        if shortcut == &overlay_s_clone {
                            if let ShortcutState::Pressed = event.state() {
                                overlay.toggle_overlay(myapp);
                            }
                        }

                        if shortcut == &active_s_clone {
                            if let ShortcutState::Pressed = event.state() {
                                let app_state = myapp.state::<AppState>();

                                let mut guard = app_state.recoil_state.lock().unwrap();

                                if let Some(ref mut state) = *guard {
                                    state.active = !state.active;
                                    println!("Recoil Active: {}", state.active);
                                } else {
                                    println!("Nenhuma arma selecionada para ativar/desativar.");
                                }
                            }
                        }
                    })
                    .build(),
            );

            let _ = app.global_shortcut().register(overlay_shortcut);
            let _ = app.global_shortcut().register(active_shortcut);

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            hidden_window,
            show_window,
            take_screenshot,
            write_config_file,
            read_config_file,
            delete_config_file,
            load_payloads,
            set_current,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_tray(app: &AppHandle) -> Result<(), tauri::Error> {
    let app_clone = app.clone();

    let quit_i = MenuItem::with_id(&app_clone, "quit", "Quit", true, None::<&str>)?;
    let toggle_i = MenuItem::with_id(&app_clone, "toggle", "Show/Hide", true, None::<&str>)?;

    let menu = Menu::with_items(&app_clone, &[&toggle_i, &quit_i])?;

    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }
            "toggle" => {
                if let Some(window) = app.get_webview_window("main") {
                    let new_visibility = !window.is_visible().unwrap();
                    if new_visibility {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    } else {
                        window.hide().unwrap();
                    }
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
        })
        .build(app)?;

    Ok(())
}
