use sha2::{Digest, Sha256};
use std::fs;
use std::io::Write;
use std::path::PathBuf;

fn hash(pin: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(pin.as_bytes());
    format!("{:x}", hasher.finalize())
}

fn pin_file() -> PathBuf {
    let home = std::env::var("HOME").unwrap();
    PathBuf::from(home).join(".access_pin")
}

fn read_stored_hash() -> Option<String> {
    fs::read_to_string(pin_file()).ok().map(|s| s.trim().to_string())
}

fn save_hash(hash: &str) {
    fs::write(pin_file(), hash).unwrap();
}

fn ask_pin(prompt: &str) -> String {
    print!("{}", prompt);
    std::io::stdout().flush().unwrap();
    let mut pin = String::new();
    std::io::stdin().read_line(&mut pin).unwrap();
    pin.trim().to_string()
}

fn main() {
    match read_stored_hash() {
        Some(stored) => {
            for attempt in 1..=3 {
                let pin = ask_pin("Введите PIN: ");
                if hash(&pin) == stored {
                    println!("✅ Доступ разрешён!");
                    return;
                }
                println!("❌ Неверный PIN (попытка {} из 3)\n", attempt);
            }
            println!("🚫 Попытки закончились. Запусти программу снова.");
        }
        None => {
            println!("🔐 Первый запуск: придумай PIN (минимум 4 символа)");
            loop {
                let pin = ask_pin("Новый PIN: ");
                if pin.len() < 4 {
                    println!("Слишком короткий, минимум 4 символа.\n");
                    continue;
                }
                let pin2 = ask_pin("Повтори PIN: ");
                if pin != pin2 {
                    println!("Пины не совпадают, попробуй ещё раз.\n");
                    continue;
                }
                save_hash(&hash(&pin));
                println!("✅ PIN сохранён!");
                break;
            }
        }
    }
}
