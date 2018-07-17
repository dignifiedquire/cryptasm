#![feature(use_extern_macros, wasm_custom_section, wasm_import_module)]

extern crate aes;
extern crate block_modes;
extern crate wasm_bindgen;

use aes::block_cipher_trait::generic_array::GenericArray;
use aes::Aes128;
use block_modes::block_padding::{Padding, Pkcs7};
use block_modes::{BlockMode, BlockModeIv, Ctr128};
use wasm_bindgen::prelude::*;

const BLOCK_SIZE: usize = 16;

#[wasm_bindgen]
#[no_mangle]
pub struct Aes128Ctr {
    inner: block_modes::Ctr128<Aes128, Pkcs7>,
}

#[wasm_bindgen]
#[no_mangle]
impl Aes128Ctr {
    pub fn new(key: &[u8], iv: &[u8]) -> Aes128Ctr {
        let iv = GenericArray::from_slice(iv);

        Aes128Ctr {
            inner: Ctr128::<Aes128, Pkcs7>::new_varkey(key, iv).expect("invalid key"),
        }
    }

    pub fn encrypt(&mut self, data: &[u8]) -> Vec<u8> {
        let buf_size = ((data.len() as f32 / BLOCK_SIZE as f32).ceil() as usize + 1) * BLOCK_SIZE;
        let n = data.len();
        let mut buffer = vec![0u8; buf_size];
        buffer[..n].copy_from_slice(data);

        let mut padded_data =
            Pkcs7::pad(&mut buffer, n, BLOCK_SIZE).expect("failed to pad message");

        self.inner
            .encrypt_nopad(&mut padded_data)
            .expect("failed to encrypt");

        padded_data[..n].to_vec()
    }
}

#[test]
pub fn test_aes128_ctr() {
    let key = vec![0u8; 16];
    let iv = vec![0u8; 16];
    let input = vec![1u8; 80];

    let mut aes128 = Aes128Ctr::new(key.as_slice(), iv.as_slice());
    assert_eq!(aes128.encrypt(vec![0; 15].as_slice()).len(), 15,);
    assert_eq!(aes128.encrypt(vec![0; 19].as_slice()).len(), 19,);
    assert_eq!(aes128.encrypt(vec![0; 32].as_slice()).len(), 32);

    let out: Vec<u8> = vec![
        103, 232, 74, 213, 238, 139, 45, 58, 137, 77, 251, 88, 203, 53, 42, 47, 89, 227, 253, 207,
        251, 127, 49, 96, 55, 126, 28, 86, 165, 230, 68, 91, 2, 137, 219, 207, 97, 183, 162, 147,
        242, 41, 195, 184, 112, 179, 255, 121, 246, 148, 171, 170, 72, 74, 88, 34, 246, 252, 136,
        254, 149, 138, 192, 225, 33, 3, 16, 32, 79, 114, 149, 219, 33, 136, 183, 173, 209, 146,
        170, 225,
    ];

    let mut aes128 = Aes128Ctr::new(key.as_slice(), iv.as_slice());
    assert_eq!(aes128.encrypt(input.as_slice()), out,);
}
