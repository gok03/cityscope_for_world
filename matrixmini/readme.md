# CityScope UI components for the Web

![alt text](./DOCS/r.gif "Logo Title Text 1")

#### Live example here:

https://cityscope.media.mit.edu/CS_CityScopeJS_UI/

Add `?TABLE_NAME` to URL to get radar for a specific CityScope table, i.e:
`https://cityscope.media.mit.edu/CS_CityScopeJS_UI/?CityScopeJS`

#### Development

- Clone & run with `npm install`, `npm test`
- edit `radarMath.js` to add math functions on `cityIO` data [or any other data you're calling in `index.js`]
- edit/add/remove/compare radar axes in `radarMath.js`

---

## how to build with `parcel` for GitHub pages

### Building production into `dist` folder

`sudo parcel build index.html --public-url https://cityscope.media.mit.edu/CS_CityScopeJS_UI/`

## Deploying `dist` to GitHub Pages

### Step 1

Remove the `dist` directory from the project’s `.gitignore` (or skip and force-add afterwards).

### Step 2

Make sure git knows about your subtree (the subfolder with your site).

```sh
git add dist
```

or force-add it if you don't want to change your `.gitignore`

```sh
git add dist -f
```

### Step 3

Commit!

```sh
git commit -m "gh-pages commit"
```

### Step 4

Use subtree push to send it to the `gh-pages` branch on GitHub.

```sh
git subtree push --prefix dist origin gh-pages
```

### Step 4.1

If this gets an error [see below], try `force` push:

```sh
git push origin `git subtree split --prefix dist master`:gh-pages --force
```

---

radar core from taken from [Charles Allen's block](http://bl.ocks.org/TennisVisuals/c591445c3e6773c6eb6f)
Maintained by [Ariel Noyman](http://arielnoyman.com)
