use std::{sync::Mutex, thread};
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};
use rdev::{listen, EventType, Button};
use std::sync::{Arc, atomic::{AtomicBool, Ordering}};
use lazy_static::lazy_static;
use windows::Win32::UI::Input::KeyboardAndMouse::{
    SendInput, INPUT, INPUT_0, INPUT_MOUSE, MOUSEEVENTF_MOVE, MOUSEINPUT,
};

lazy_static! {
    static ref RIGHT_MOUSE_DOWN: AtomicBool = AtomicBool::new(false);
    static ref LEFT_MOUSE_DOWN: AtomicBool = AtomicBool::new(false);
}

#[derive(Clone, Debug)]
pub struct RecoilState {
    pub points: Vec<Point>,
    pub config: RecoilConfig,
    pub active: bool,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Clone, Debug)]
pub struct RecoilConfig {
    pub sensitivity: f64,
    pub rpm: u64,
    pub smooth_steps: u32,
}

pub fn start_global_listener(shared_state: Arc<Mutex<Option<RecoilState>>>) {
    let is_firing = Arc::new(AtomicBool::new(false));

    thread::spawn(move || {
        if let Err(error) = listen(move |event| {
            match event.event_type {
                EventType::ButtonPress(Button::Right) => {
                    RIGHT_MOUSE_DOWN.store(true, Ordering::SeqCst);
                }
                EventType::ButtonRelease(Button::Right) => {
                    RIGHT_MOUSE_DOWN.store(false, Ordering::SeqCst);
                    is_firing.store(false, Ordering::SeqCst);
                }
                EventType::ButtonPress(Button::Left) => {
                    LEFT_MOUSE_DOWN.store(true, Ordering::SeqCst);

                    if RIGHT_MOUSE_DOWN.load(Ordering::SeqCst) && !is_firing.load(Ordering::SeqCst) {
                        let current_config = {
                            let guard = shared_state.lock().unwrap();
                            guard.clone()
                        };

                        if let Some(state) = current_config {
                            is_firing.store(true, Ordering::SeqCst);
                            let f = is_firing.clone();

                            thread::spawn(move || {
                                play_recoil(state.points, state.config, f);
                            });
                        }
                    }
                }
                EventType::ButtonRelease(Button::Left) => {
                    LEFT_MOUSE_DOWN.store(false, Ordering::SeqCst);
                    is_firing.store(false, Ordering::SeqCst);
                }
                _ => {}
            }
        }) {
            println!("Error: {:?}", error);
        }
    });
}

pub fn play_recoil(
    points: Vec<Point>,
    config: RecoilConfig,
    is_firing: Arc<AtomicBool>
) {
    let ms_per_shot = 60000 / config.rpm;
    let step_delay = ms_per_shot / config.smooth_steps as u64;

    println!("Thread de Recoil Iniciada (Modo Infinito)");

    while is_firing.load(Ordering::SeqCst) {
        for i in 0..points.len() - 1 {
            if !is_firing.load(Ordering::SeqCst) {
                break;
            }

            let current = &points[i];
            let next = &points[i + 1];

            let delta_x = (next.x - current.x) * config.sensitivity;
            let delta_y = (next.y - current.y) * config.sensitivity;

            let target_x = -delta_x;
            let target_y = -delta_y;

            apply_smoothing_enigo(
                target_x,
                target_y,
                config.smooth_steps,
                step_delay,
                &is_firing
            );
        }

        thread::sleep(Duration::from_millis(1));
    }

    println!("Thread de Recoil Finalizada");
}

fn apply_smoothing_enigo(
    total_x: f64,
    total_y: f64,
    steps: u32,
    delay_ms: u64,
    is_firing: &Arc<AtomicBool>
) {
    let mut rng = rand::rng();

    let step_x = total_x / steps as f64;
    let step_y = total_y / steps as f64;

    let mut acc_x = 0.0;
    let mut acc_y = 0.0;

    for _ in 0..steps {
        if !is_firing.load(Ordering::SeqCst) { break; }

        let start = Instant::now();

        let jitter_x: f64 = rng.random_range(-0.5..0.5);
        let jitter_y: f64 = rng.random_range(-0.5..0.5);

        acc_x += step_x + jitter_x;
        acc_y += step_y + jitter_y;

        let move_x = acc_x as i32;
        let move_y = acc_y as i32;

        acc_x -= move_x as f64;
        acc_y -= move_y as f64;

        if move_x != 0 || move_y != 0 {
            move_mouse_raw(move_x, move_y);
        }

        let elapsed = start.elapsed();
        if elapsed < Duration::from_millis(delay_ms) {
            thread::sleep(Duration::from_millis(delay_ms) - elapsed);
        }
    }
}

fn move_mouse_raw(x: i32, y: i32) {
    if x == 0 && y == 0 {
        return;
    }

    unsafe {
        let input = INPUT {
            r#type: INPUT_MOUSE,
            Anonymous: INPUT_0 {
                mi: MOUSEINPUT {
                    dx: x,
                    dy: y,
                    mouseData: 0,
                    dwFlags: MOUSEEVENTF_MOVE,
                    time: 0,
                    dwExtraInfo: 0,
                },
            },
        };

        SendInput(&[input], std::mem::size_of::<INPUT>() as i32);
    }
}
