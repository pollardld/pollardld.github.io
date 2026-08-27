# pollardld.github.io

Personal portfolio for David Pollard, published at [pollardld.com](https://pollardld.com/).
The site presents selected engineering work, experience, and project case studies.

## Tech Stack

- HTML, SASS, and JavaScript
- Python scripts for generated content and verification
- GitHub Pages for deployment
- Free from application framework, server, or JS client dependencies
- Hand made in San Francisco, CA, USA

## Requirements

- Node.js and npm
- Python 3

Install the Node development dependency from the repository root:

```sh
npm install
```

## Development

Compile Sass after changing files in `static/sass/`:

```sh
npm run build:css
```

Recompile automatically whenever a Sass file changes:

```sh
npm run watch:css
```

The experience section in `index.html` is rendered from `resume_data.json`:

```sh
npm run build:experience
```

Preview the static site locally with Python:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/> in a browser. Stop the server with `Ctrl-C`.

> You can also preview the site by just opening `index.html` in a browser.

## Verification

Run the repository checks before opening a pull request or publishing:

```sh
npm run verify
```

This checks the HTML structure, accessibility metadata, local links, referenced assets,
and whether the generated experience markup matches `resume_data.json`.

If you update any Sass, run `npm run build:css` before `npm run verify`. The compiled file at
`static/css/styles.css` is tracked because it is served directly by GitHub Pages.

## Repository Layout

```text
index.html                  Home page
projects/                   Case-study pages
static/sass/                Sass source files
static/css/                 Compiled stylesheet served by the site
static/js/                  Client-side site behavior
scripts/                    Build and verification scripts
resume_data.json            Source data for the experience section
CNAME                       GitHub Pages custom domain
```

## Deployment

GitHub Pages serves the `main` branch. Changes merged or pushed to `main` are published at
[pollardld.com](https://pollardld.com/).

## Links

- [Live site](https://pollardld.com/)
- [LinkedIn](https://linkedin.com/in/pollardld)

## License

This project is licensed under the Unlicense. See [LICENSE](LICENSE) for details.
