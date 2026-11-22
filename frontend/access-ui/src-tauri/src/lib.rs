use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;

fn hash(pin: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(pin.as_bytes());
    format!("{:x}", hasher.finalize())
}

#[tauri::command]
fn check_pin(pin: &str, app: AppHandle) -> Result<String, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let file: PathBuf = dir.join(".access_pin");

    if let Ok(stored) = fs::read_to_string(&file) {
        if hash(pin) == stored.trim() {
            Ok("success".into())
        } else {
            Err("wrong".into())
        }
    } else {
        if pin.len() < 4 {
            return Err("short".into());
        }
        fs::write(&file, hash(pin)).map_err(|e| e.to_string())?;
        Ok("first_time".into())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_pin])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
