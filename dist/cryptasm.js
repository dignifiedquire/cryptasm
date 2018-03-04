
            /* tslint:disable */
            import * as wasm from './cryptasm_wasm'; // imports from wasm file
            

            
            let cachedUint8Memory = null;
            function getUint8Memory() {
                if (cachedUint8Memory === null ||
                    cachedUint8Memory.buffer !== wasm.memory.buffer)
                    cachedUint8Memory = new Uint8Array(wasm.memory.buffer);
                return cachedUint8Memory;
            }
        
            function passArray8ToWasm(arg) {
                const ptr = wasm.__wbindgen_malloc(arg.byteLength);
                getUint8Memory().set(arg, ptr);
                return [ptr, arg.length];
            }
        
            function getArrayU8FromWasm(ptr, len) {
                const mem = getUint8Memory();
                const slice = mem.slice(ptr, ptr + len);
                return new Uint8Array(slice);
            }
        export function aes128_ctr(arg0, arg1, arg2) {
        const [ptr0, len0] = passArray8ToWasm(arg0);
                    const [ptr1, len1] = passArray8ToWasm(arg1);
                    const [ptr2, len2] = passArray8ToWasm(arg2);
                    try {
                    const ret = wasm.aes128_ctr(ptr0, len0, ptr1, len1, ptr2, len2);
                    
                    const ptr = wasm.__wbindgen_boxed_str_ptr(ret);
                    const len = wasm.__wbindgen_boxed_str_len(ret);
                    const realRet = getArrayU8FromWasm(ptr, len);
                    wasm.__wbindgen_boxed_str_free(ret);
                    return realRet;
                
                } finally {
                    
wasm.__wbindgen_free(ptr0, len0);

wasm.__wbindgen_free(ptr1, len1);

wasm.__wbindgen_free(ptr2, len2);

                }
            }

            let cachedDecoder = null;
            function textDecoder() {
                if (cachedDecoder)
                    return cachedDecoder;
                cachedDecoder = new TextDecoder('utf-8');
                return cachedDecoder;
            }
        
                function getStringFromWasm(ptr, len) {
                    const mem = getUint8Memory();
                    const slice = mem.slice(ptr, ptr + len);
                    const ret = textDecoder().decode(slice);
                    return ret;
                }
            export function __wbindgen_throw (ptr, len) {
                        throw new Error(getStringFromWasm(ptr, len));
                    }

        