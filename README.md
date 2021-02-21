# ibooknotes2html

**An Utility to convert ibook notes to HTML & PDF**

## Prerequisites

- NodeJs v12 and above (Install on MacOS using `brew install node`)
- MacOS
- git

## Usage

- Clone Repo

```bash
$ git clone https://github.com/arnabkaycee/ibooknotes2html
```

- install packages

```bash
$ cd ibooknotes2html
$ npm ci
```

- select books

```bash
node get-books.js
```

This will create a `books.txt` file. Find your book and copy the IDs of the books inside `config.json`

```json
"books" : ["<book ids 1>", "<book id 2>"]
```

- generate pdf and html

```bash
node generate.js
```
