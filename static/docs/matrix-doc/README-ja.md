# SATySFi で行列！

[English version is here.][README.md]

## 使い方

```satysfi
+math(${
  \matrix![
    [${1}; ${2}; ${3}];
    [${4}; ${5}; ${6}];
    [${7}; ${8}; ${9}];
  ]
});
```

このコードが下のようになります。

[![3x3 型行列です。要素は {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}} です。][sample_matrix.png]][sample_matrix.png]

より正確には、このライブラリは math モードで使えるコマンド `\matrix : [(math list) list] math-cmd` を提供します。(長方形型の) 2次元リストを渡すことでコマンドを使用できます。

より複雑な例は [`example`][example] をご覧ください。

## 注意

**注意**: このライブラリは SATySFi 0.0.3 でのみテストされています。現在 SATySFi は開発初期であるため、SATySFi のバージョンアップに対するこのライブラリの互換性は一切保証しません。

## インストール方法

### Satyrographos を使用する場合

まず、 [Satyrographos] をインストールしてください。その後、 `satysfi-matrix` パッケージをインストールし、 `satyrographos install` を実行してください。

```sh
opam install satysfi-matrix
satyrographos install
```

### 手動でコピーする場合

`matrix.satyh` を `LIBROOT/dist/packages/matrix/` 下へコピーしてください (LIBROOT は環境によって変わります)。

#### 例: Unix 系 OS

```sh
git clone https://github.com/nekketsuuu/satysfi-matrix.git
cd satysfi-matrix
mkdir -p ~/.satysfi/dist/packages/matrix
cp matrix.satyh ~/.satysfi/dist/packages/matrix/
```

#### 例: Windows

```sh
git clone https://github.com/nekketsuuu/satysfi-matrix.git
cd satysfi-matrix
mkdir %USERPROFILE%\.satysfi\dist\packages\matrix
copy matrix.satyh %USERPROFILE%\.satysfi\dist\packages\matrix\
```

## アンインストール方法

### Satyrographos を使用する場合

`satysfi-matrix` パッケージをアンインストールしてください。

```sh
opam uninstall satysfi-matrix
```

### 手動でコピーする場合

`LIBROOT/dist/packages/matrix/matrix.satyh` を削除してください。

## 既知の問題

[GitHub Issues] をご覧ください。

## 貢献

Pull request も issue 報告も歓迎しています！　英語でも日本語でも大丈夫です。

また、このライブラリは The Unlicense の元で配布しています。自由に編集・使用することができます。


  [README.md]: https://github.com/nekketsuuu/satysfi-matrix/blob/master/README.md
  [sample_matrix.png]: https://raw.githubusercontent.com/nekketsuuu/satysfi-matrix/master/doc/img/sample_matrix.png
  [example]: https://github.com/nekketsuuu/satysfi-matrix/blob/master/example
  [GitHub Issues]: https://github.com/nekketsuuu/satysfi-matrix/issues
  [Satyrographos]: https://github.com/na4zagin3/satyrographos
