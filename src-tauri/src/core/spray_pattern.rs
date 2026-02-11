use serde::{Serialize, Deserialize};
use std::clone::Clone;

#[derive(Serialize, Deserialize, Clone)]
pub struct Payload {
    payload: DrawPoints
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DrawPoints {
    x: i32,
    y: i32,
    color: String,
    size: i32
}

pub struct SprayPattern {
    spray_points: Vec<DrawPoints>,
}

impl SprayPattern {
    pub fn new() -> SprayPattern {
        SprayPattern {
            spray_points: Vec::new(),
        }
    }

    pub fn add_point(&mut self, point: DrawPoints) {
        self.spray_points.push(point);
    }

    pub fn get_points(&self) -> Vec<DrawPoints> {
        self.spray_points.clone()
    }
}
