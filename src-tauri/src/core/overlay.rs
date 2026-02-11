use tauri::{AppHandle, Manager, Emitter};
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Instant, Duration};
use std::sync::Mutex;
use std::thread;

use crate::core::screenshot::capture_screen_internal;

pub struct Overlay {
    pub is_overlay_open: AtomicBool,
    pub last_toggle: Mutex<Instant>,
}

impl Overlay {
    pub fn new() -> Overlay {
        Overlay {
            is_overlay_open: AtomicBool::new(false),
            last_toggle: Mutex::new(Instant::now()),
        }
    }

    pub fn toggle_overlay(&self, app: &AppHandle) {
        let mut last_toggle = self.last_toggle.lock().unwrap();
        if last_toggle.elapsed() < Duration::from_millis(300) {
            return;
        }
        *last_toggle = Instant::now();

        let is_open = self.is_overlay_open.load(Ordering::SeqCst);
        let overlay_window = app.get_webview_window("overlay");

        if is_open {
            if let Some(ow) = overlay_window {
                ow.hide().unwrap();
            }

            self.is_overlay_open.store(false, Ordering::SeqCst);
        } else {
            if let Some(ow) = overlay_window {
                ow.hide().unwrap();

                thread::sleep(Duration::from_millis(150));

                if let Ok(b64_image) = capture_screen_internal() {
                    ow.emit("screenshot-captured", b64_image).unwrap();
                }

                ow.show().unwrap();
                ow.set_focus().unwrap();
            }

            self.is_overlay_open.store(true, Ordering::SeqCst);
        }
    }
}
