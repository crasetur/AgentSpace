#![no_std]

#[no_mangle]
pub extern "C" fn score_tag(input: i32) -> i32 {
    if input == 1 || input == 4 { 1 } else { 0 }
}
