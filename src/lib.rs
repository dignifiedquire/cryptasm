#![cfg_attr(feature = "with-bench", feature(test))]

extern crate rand;
extern crate rustc_serialize as serialize;

pub mod aes;
pub mod aessafe;
pub mod symmetriccipher;
pub mod step_by;
pub mod buffer;
pub mod cryptoutil;
pub mod digest;
mod simd;
pub mod blockmodes;
