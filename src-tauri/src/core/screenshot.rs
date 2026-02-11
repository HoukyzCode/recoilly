use screenshots::{Screen, image::ImageOutputFormat};
use base64::{Engine as _, engine::general_purpose};
use std::io::Cursor;

pub fn capture_screen_internal() -> Result<String, String> {
    let screens = Screen::all().map_err(|e| e.to_string())?;
    let screen = screens.first().ok_or("No screens found")?;

    let image = screen.capture().map_err(|e| e.to_string())?;

    let mut buffer = Cursor::new(Vec::new());

    image.write_to(&mut buffer, ImageOutputFormat::Jpeg(100))
        .map_err(|e| e.to_string())?;

    let b64 = general_purpose::STANDARD.encode(buffer.into_inner());

    Ok(format!("data:image/jpeg;base64,{}", b64))
}

#[tauri::command]
pub fn take_screenshot() -> Result<String, String> {
    capture_screen_internal()
}
