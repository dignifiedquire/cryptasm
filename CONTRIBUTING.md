# Contributing

## Development

### Setup

This guide assumes a Linux like environment. Although, the commands should be easily modified to other environments.

#### Install Rust

The easiest way to install Rust and its associated tooling is with Rustup. The second command is needed to updated the current shell.

```bash
$ curl https://sh.rustup.rs -sSf | sh
$ source $HOME/.cargo/env
```

Because these are relatively new targets, it is best to use the nightly release of Rust in order to get recent improvements.

```bash
$ rustup install nightly
$ rustup default nightly
```

Next we must install the asm.js and WebAssembly targets.

```bash
$ rustup target add asmjs-unknown-emscripten
$ rustup target add wasm32-unknown-emscripten
```

#### Install Emscripten

Download and extract the the portable Emscripten SDK in the emsdk_portable folder run the following:
Note: git, cmake and g++ must be installed. They can probably be easily installed with your OS's package manager.

```bash
$ source ./emsdk_env.sh
$ emsdk update
$ emsdk install sdk-incoming-64bit
$ emsdk activate sdk-incoming-64bit
```

After going through the installation process, we can simply source the emsdk_env.sh file to add the Emscripten toolchain to our path. This is necessary before compiling Rust code to the asm.js or WebAssembly targets. The second line checks that the Emscripten compiler (emcc) is available and its version (1.37.3 of the time of this writing).

```bash
$ source <path/to>/emsdk_env.sh
$ emcc --version
```
