# cityscope_for_world
https://cityio.media.mit.edu extension for any part of world.

## Install Instruction
1. clone https://github.com/gok03/cityscope_for_world.git
2. update the new server URLs in source (steps below), Paths & Keys.
3. install mongodb
4. install python dependecies for flask_server/server.py
5. run python flask_server/server.py 
6. run node server.js


### To update server URLs & polyfill paths
1. Find "cityscope_server" varialbe in following files and change to node server URL.
- backend/index.js
- logics.js
- matrix/scripts/index.js
- matrixmini/scripts/index.js
- scanner/js/Modules.js
- scanner/js/UI/DATGUI.js

2. Parcel Build index.html the following folders with their new URL 
eg - parcel build index.html --public-url http://localhost/matrixmini/
- backend
- matrix
- matrixmini
- scanner

3. Update Python server URL in selector/script.js for variable URL

4. Update the following in flask_server/server.py
- In "home" Function, update path_to_data_folder to viewer/data/ path (eg: "/home/ubuntu/cityscope_for_world/viewer/data/)
- In "home" Function, update "url" to node server URL.
