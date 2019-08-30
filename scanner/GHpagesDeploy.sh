# #!/bin/bash
sudo rm -rf dist
# build the /dist for public url 
sudo parcel build index.html --public-url https://cityscope.media.mit.edu/CS_cityscopeJS/
# make sure to add dist to gitignore [force] 
git add dist -f
#commit the GH pages changes 
git commit -m "gh-pages commit"
#push to subtree remote [Soft:  git subtree push --prefix dist origin gh-pages]
git push origin `git subtree split --prefix dist master`:gh-pages --force
