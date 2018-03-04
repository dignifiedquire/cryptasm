#![feature(proc_macro)]

extern crate wasm_bindgen;
extern crate aes;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[no_mangle]
pub extern "C" fn aes128_ctr(key: &[u8], iv: &[u8], data: &[u8]) -> Vec<u8> {
    let mut ctx = aes::AES::new(aes::Size::AES128, aes::Mode::CTR, key, iv);
    // pkcs7 padding
    //
    let rounds = (data.len() as f32 / 16f32).ceil() as usize;
    let mut result = data.to_vec();
    // extend vec
    let diff = rounds * 16 - data.len();
    let len = 16 - diff;
    result.extend((0..len).map(|_| len as u8));

    for chunk in result.chunks_mut(16) {
        aes::aes_ctr_xcrypt_buffer(&mut ctx, chunk);
    }
    // drop padding
    result.truncate(data.len());

    result
}

#[test]
pub fn test_aes128_ctr() {
    let key: Vec<u8> = vec![0; 16];
    let iv: Vec<u8> = vec![0; 16];
    let input: Vec<u8> = vec![1; 80];

    assert_eq!(
        aes128_ctr(key.as_slice(), iv.as_slice(), vec![0;15].as_slice()).len(),
        15,
    );
    assert_eq!(
        aes128_ctr(key.as_slice(), iv.as_slice(), vec![0;19].as_slice()).len(),
        19,
    );
    assert_eq!(
        aes128_ctr(key.as_slice(), iv.as_slice(), vec![0; 32].as_slice()).len(),
        32
    );


    let out: Vec<u8> = vec![
        103,
        232,
        74,
        213,
        238,
        139,
        45,
        58,
        137,
        77,
        251,
        88,
        203,
        53,
        42,
        47,
        89,
        227,
        253,
        207,
        251,
        127,
        49,
        96,
        55,
        126,
        28,
        86,
        165,
        230,
        68,
        91,
        2,
        137,
        219,
        207,
        97,
        183,
        162,
        147,
        242,
        41,
        195,
        184,
        112,
        179,
        255,
        121,
        246,
        148,
        171,
        170,
        72,
        74,
        88,
        34,
        246,
        252,
        136,
        254,
        149,
        138,
        192,
        225,
        33,
        3,
        16,
        32,
        79,
        114,
        149,
        219,
        33,
        136,
        183,
        173,
        209,
        146,
        170,
        225,
    ];

    assert_eq!(
        aes128_ctr(key.as_slice(), iv.as_slice(), input.as_slice()),
        out,
    );
}
