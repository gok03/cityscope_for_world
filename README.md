# Cityscope for world
"CityScope" is a concept for shared, interactive computation for urban planning.
This project is an extension of https://cityio.media.mit.edu application for any part of the world. 

[![cs_for_world.gif](https://github.com/gok03/cityscope_for_world/blob/master/csw_demo.gif)]

## Usage
Use http://cityscope.gok03.com/ to test.  
1. Select a region within 1 Km2.  
2. Enter a name and your email to get notified on process completion.  
3. In the viewer, you can change between buildings and blocks of the processed region.
4. Start your planning/analysis by selecting a Block from the region to edit its type or height.
5. Matrix gets updated for every change you make.  

## Demos
Some of the analysed links are,  
MIT (http://cityscope.gok03.com/viewer/?name=mit)  
Newyork (http://cityscope.gok03.com/viewer/?name=newyork)  
Hamburg (http://cityscope.gok03.com/viewer/?name=hamburg)  

## Install Instruction
1. Clone https://github.com/gok03/cityscope_for_world.git
2. Install mongodb
3. Install python dependecies for flask_server/server.py (Py3)
4. Run python flask_server/server.py (starts at port 5000)
5. Run node server.js (starts at port 80)
6. Goto your-url and start using the app

## To-Do
1. Review citymatrix datapoints(Radar Chart).
2. Implement Population Statistics.
3. Implement City Performance Heat-maps.
4. Implement AR for 3js model.
5. Add more data points to Layers(road, trees, etc).
6. Implement CS mobility module.

## Credits
Most of the code was clone from https://github.com/CityScope/  
The works of https://www.media.mit.edu/projects/cityscope/overview/ team interested me to extend the work to my hometown adyar/chennai(http://cityscope.gok03.com/viewer/?name=adyar) and eventually generalised for any place using OSM data.  
The threejs modeling code was extracted from https://github.com/minorua/Qgis2threejs  
