# LINKBOARD

A static GitHub Pages link directory.

## Structure

- `index.html` — homepage
- `games/index.html` — Games
- `school/index.html` — School
- `tools/index.html` — Tools
- `movies/index.html` — Movies
- `other/index.html` — Other
- `style.css` — shared styling

Each category is a real separate HTML page. Clicking a category on the homepage navigates to that folder's `index.html`.

## Add a link

Open the category's `index.html` and copy a link card:

```html
<a class="link-card" href="https://example.com" target="_blank" rel="noopener noreferrer">
  <div class="card-tag">LINK</div>
  <h2>My Link</h2>
  <p>Description of the link.</p>
  <span class="open">Open ↗</span>
</a>
```

## Add a category

Create a folder such as:

```text
music/
└── index.html
```

Then add `music/` as a link on the main `index.html` and in the navigation of the other pages.

## GitHub Pages

Upload the contents of this folder to the root of a GitHub repository. In Settings → Pages, select GitHub Actions if your repository uses Actions, or deploy the repository as a static site. No Node.js, database, or backend is required.
