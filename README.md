# cityscope_for_world
https://cityio.media.mit.edu application for any part of the world. (Dev Incomplete)

Use http://cityscope.gok03.com/ to test.  
Some of the analysed links are,  
MIT (http://cityscope.gok03.com/viewer/?name=mit)  
Hamburg (http://cityscope.gok03.com/viewer/?name=hamburg)

## Install Instruction
1. Clone https://github.com/gok03/cityscope_for_world.git
2. Install mongodb
3. Install python dependecies for flask_server/server.py (Py3)
4. Run python flask_server/server.py (starts at port 5000)
5. Run node server.js (starts at port 80)
6. Goto your-url

Most of the code was clone from https://github.com/CityScope/  
The works of https://www.media.mit.edu/projects/cityscope/overview/ team interested me to extend the work to my hometown adyar/chennai(http://cityscope.gok03.com/viewer/?name=adyar) and eventually generalised for any place using OSM data.

To-Do
1. Add more data points to Layers(road, trees, etc)
2. Review citymatrix working for data
3. Implement Interactive module to update height and type of block.
4. Implement CS mobility module
4. Improve the interface to provide inference informations.

