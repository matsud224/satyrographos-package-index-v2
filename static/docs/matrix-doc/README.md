# Matrices in SATySFi!

[日本語版はこちら][README-ja.md]

## Usage

```satysfi
+math(${
  \matrix![
    [${1}; ${2}; ${3}];
    [${4}; ${5}; ${6}];
    [${7}; ${8}; ${9}];
  ]
});
```

This code will produce the following.

[![A 3x3 matrix that is {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}][sample_matrix.png]][sample_matrix.png]

More precisely, this library provides a math command `\matrix : [(math list) list] math-cmd`. You can pass 2d (rectangular) list into this command.

See [`example`][example] for more complicated examples.

## Notice

**CAUTION**: This library is tested only under SATySFi 0.0.3. Since SATySFi is under the initial development period, no compatibility is ensured for future versions of SATySFi.

## Installation

### With Satyrographos

Install [Satyrographos](https://github.com/na4zagin3/satyrographos). Then, install `satysfi-matrix` package and run `satyrographos install` as follows.

```sh
opam install satysfi-matrix
satyrographos install
```

### Manually Copying

Just copy `matrix.satyh` under your `LIBROOT/dist/packages/matrix/` (LIBROOT changes depending on your environment).

#### Example: Unix-like OSs

```sh
git clone https://github.com/nekketsuuu/satysfi-matrix.git
cd satysfi-matrix
mkdir -p ~/.satysfi/dist/packages/matrix
cp matrix.satyh ~/.satysfi/dist/packages/matrix/
```

#### Example: Windows

```sh
git clone https://github.com/nekketsuuu/satysfi-matrix.git
cd satysfi-matrix
mkdir %USERPROFILE%\.satysfi\dist\packages\matrix
copy matrix.satyh %USERPROFILE%\.satysfi\dist\packages\matrix\
```

## Uninstallation

### Satyrographos

Remove `satysfi-matrix` package.

```sh
opam uninstall satysfi-matrix
```

### Manually Copying

Delete `LIBROOT/dist/packages/matrix/matrix.satyh`.

## Known Issues

See [GitHub Issues].

## Contributing

Both pull requests and issues are welcome! Please write them in English or in Japanese.

Also, this library is distributed under The Unlicense. You can freely edit and use this library.


  [README-ja.md]: https://github.com/nekketsuuu/satysfi-matrix/blob/master/README-ja.md
  [sample_matrix.png]: https://raw.githubusercontent.com/nekketsuuu/satysfi-matrix/master/doc/img/sample_matrix.png
  [example]: https://github.com/nekketsuuu/satysfi-matrix/blob/master/example
  [GitHub Issues]: https://github.com/nekketsuuu/satysfi-matrix/issues
