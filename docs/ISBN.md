# ISBN to URL

``` md
- URL:
  - ISBN10:
  - ISBN13:
- Selector:
```

## 書誌データベース

### ブクログ

- URL:
  - ISBN10: <https://booklog.jp/item/1/4873119707>
- Selector: `script[type="application/ld+json"]`

### 読書メーター

- URL: <https://bookmeter.com/books/18910099>
  - ISBN10: <https://bookmeter.com/b/4873119707>

### カーリル

- URL:
  - ISBN10: <https://calil.jp/book/4873119707>
  - ISBN13: <https://calil.jp/book/9784873119700>
- Selector:
  - `meta[property="books:isbn]"`
  - `span[itemprop="isbn"]` (broken)
    - 隣要素に ISBN がある。

### 版元ドットコム

- URL:
  - ISBN10: <https://www.hanmoto.com/bd/isbn/4873119707>
  - ISBN13: <https://www.hanmoto.com/bd/isbn/9784873119700>
- Selector:
  - `span[itemprop="isbn"]`
  - `span[itemprop="isbn13"]` (custom)
  - `span[itemprop="isbn10"]` (custom)
  - `span[itemprop="isbn10h"]` (custom)
  - `script[type="application/ld+json"]`
    - 末尾に `;` が付いているため、`JSON.parse` が失敗する。

### 出版書誌データベース

- URL:
  - ISBN13: <https://www.books.or.jp/book-details/9784873119700>

### 国立国会図書館

- URL: <https://ndlsearch.ndl.go.jp/books/R100000002-I031817975>
  - ISBN10: <https://ndlsearch.ndl.go.jp/openurl?cs=api_openurl&f-isbn=4873119707>
  - ISBN13: <https://ndlsearch.ndl.go.jp/openurl?cs=api_openurl&f-isbn=9784873119700>

## 通販サイト

### 丸善ジュンク堂

- URL:
  - ISBN13: <https://www.maruzenjunkudo.co.jp/products/9784873119700>
- Selector: `script[type="application/ld+json"]`

### 紀伊國屋書店

- URL:
  - ISBN13: <https://www.kinokuniya.co.jp/f/dsg-01-9784873119700>

### くまざわ書店

- URL: <https://www.search.kumabook.com/kumazawa/html/products/detail/6948966>
  - ISBN13: <https://www.search.kumabook.com/kumazawa/html/products/list?isbncd=9784873119700>

### e-hon

- URL: <https://www.e-hon.ne.jp/bec/SA/Detail?refShinCode=0100000000000034279365&Action_id=121&Sza_id=B0>
  - ISBN10: <https://www.e-hon.ne.jp/bec/SA/Detail?refBook=4873119707>
  - ISBN13: <https://www.e-hon.ne.jp/bec/SA/Detail?refBook=9784873119700>
- Selector: `meta[property="books:isbn]"`

### Honya Club

- URL: <https://www.honyaclub.com/shop/goods/goods.aspx?goods=20501374>
  - ISBN10: <https://www.honyaclub.com/shop/affiliate/itemlist.aspx?isbn=4873119707>
  - ISBN13: <https://www.honyaclub.com/shop/affiliate/itemlist.aspx?isbn=9784873119700>

### ブックオフ

- URL: <https://shopping.bookoff.co.jp/used/0019772514>
  - ISBN13: <https://shopping.bookoff.co.jp/search/keyword/9784873119700>
- Selector: `script[type="application/ld+json"]`

### ネットオフ

- URL: <https://www.netoff.co.jp/detail/0013398091/>
  - ISBN13: <https://www.netoff.co.jp/cmdtyallsearch/?word=9784873119700>
- Selector: `script[type="application/ld+json"]`
  - CDATA Section が含まれており、`JSON.parse` が失敗する。

## 出版社

### O'Reilly Japan

- URL:
  - ISBN13: <https://www.oreilly.co.jp/books/9784873119700/>
- Selector: `dd[itemprop="isbn"]`

### 翔泳社

- URL:
  - ISBN13: <https://www.shoeisha.co.jp/book/detail/9784798186627>
- Selector: `dd[itemprop="isbn"]`

#### SEShop

- URL: <https://www.seshop.com/product/detail/26395>
- Selector: `script[type="application/ld+json"]`
