#!/usr/bin/env python
# coding: utf-8

cellsize = 10 #ref 10m = 1 block
from flask import Flask,request
from flask_cors import CORS, cross_origin
from flask_mail import Mail,  Message
import geopandas as gpd
import geopy
from geopy.distance import geodesic
from shapely.geometry import Polygon
import numpy as np
import json
from pyproj import CRS, Transformer
from pyproj.transformer import Transformer, AreaOfInterest
import math
from osmxtract import overpass
from staticmap import StaticMap, CircleMarker
import io
import os
import urllib.request
import requests
from PIL import Image
from math import pi, log, tan, exp, atan, log2, floor
from pymongo import MongoClient 

ZOOM0_SIZE = 512

def g2p(lat, lon, zoom):
    return (
        ZOOM0_SIZE * (2 ** zoom) * (1 + lon / 180) / 2,
        ZOOM0_SIZE / (2 * pi) * (2 ** zoom) * (pi - log(tan(pi / 4 * (1 + lat / 90))))
    )

def p2g(x, y, zoom):
    return (
        (atan(exp(pi - y / ZOOM0_SIZE * (2 * pi) / (2 ** zoom))) / pi * 4 - 1) * 90,
        (x / ZOOM0_SIZE * 2 / (2 ** zoom) - 1) * 180,
    )

def ax2mb(left, right, bottom, top):
    return (left, bottom, right, top)

def mb2ax(left, bottom, right, top):
    return (left, right, bottom, top)


def get_map_by_bbox(bbox):
    token = "pk.eyJ1IjoiZ2swMyIsImEiOiJhMzEwZTIyYWRhZWFjNWE5MTg0MzVkOGU5MjUyNzkxMiJ9.MKrbn4sDFM-oNMc9QupIKg"

    (left, bottom, right, top) = bbox

    assert (-90 <= bottom < top <= 90)
    assert (-180 <= left < right <= 180)

    (w, h) = (1024, 1024)

    (lat, lon) = ((top + bottom) / 2, (left + right) / 2)

    snap_to_dyadic = (lambda a, b: (lambda x, scale=(2 ** floor(log2(abs(b - a) / 4))): (round(x / scale) * scale)))

    lat = snap_to_dyadic(bottom, top)(lat)
    lon = snap_to_dyadic(left, right)(lon)

    assert ((bottom < lat < top) and (left < lon < right)), "Reference point not inside the region of interest"

    for zoom in range(16, 0, -1):
        (x0, y0) = g2p(lat, lon, zoom)

        (TOP, LEFT) = p2g(x0 - w / 2, y0 - h / 2, zoom)
        (BOTTOM, RIGHT) = p2g(x0 + w / 2, y0 + h / 2, zoom)

        if (LEFT <= left < right <= RIGHT):
            if (BOTTOM <= bottom < top <= TOP):
                break

    params = {
        'style': "streets-v10",
        'lat': lat,
        'lon': lon,
        'token': token,
        'zoom': zoom,
        'w': w,
        'h': h,
        'retina': "@2x",
    }

    url_template = "https://api.mapbox.com/styles/v1/mapbox/{style}/static/{lon},{lat},{zoom}/{w}x{h}{retina}?access_token={token}&attribution=false&logo=false"
    url = url_template.format(**params)

    with urllib.request.urlopen(url) as response:
        j = Image.open(io.BytesIO(response.read()))

    (W, H) = j.size
    assert ((W, H) in [(w, h), (2 * w, 2 * h)])

    i = j.crop((
        round(W * (left - LEFT) / (RIGHT - LEFT)),
        round(H * (top - TOP) / (BOTTOM - TOP)),
        round(W * (right - LEFT) / (RIGHT - LEFT)),
        round(H * (bottom - TOP) / (BOTTOM - TOP)),
    ))

    return i


def test(bbox):
    return(get_map_by_bbox(bbox))

def get_geojson(bounds):
    query = overpass.ql_query(bounds, tag='building')
    response = overpass.request(query)
    return(response)

def transfrom_latlng_to_m(lat,lng, bounds, h,w):
    center = ((bounds[0]+bounds[2])/2,(bounds[1]+bounds[3])/2)
    x = geodesic(center, (bounds[0],center[1])).m
    y = geodesic(center, (center[0],bounds[1])).m
    crs = CRS.from_proj4("+proj=laea +lat_0="+str(center[0])+" +lon_0="+str(center[1])+" +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")
    transformer = Transformer.from_crs("epsg:4326", crs)
    y1,x1 = transformer.transform(lat, lng)
    return([(h/2)/y*y1,(w/2)/x*x1])

def get_q3jsjson(jsondata,h,w,bounds):
    json1 = {
      "block": 0,
      "layer": 0,
      "type": "block"
    }
    features = []
    for i in jsondata["features"]:
        not_overflow = True
        if(i["geometry"]["type"] == "Polygon"):
            feature = {"ids":i["id"],"tags":i["properties"],"mtl":{"face":0}}
            centroid = transfrom_latlng_to_m(Polygon(i["geometry"]["coordinates"][0]).centroid.y,Polygon(i["geometry"]["coordinates"][0]).centroid.x,bounds, h,w)
            polygons = []
            for j in i["geometry"]["coordinates"]:
                sub_poly = []
                for k in j:
                    changed_lat_lng = transfrom_latlng_to_m(k[1],k[0], bounds, h,w)  
                    #print(changed_lat_lng[0],changed_lat_lng[1])
                    #if(changed_lat_lng[0]>w/2 or changed_lat_lng[1]>h/2):
                     #   print(changed_lat_lng[0],changed_lat_lng[1])
                      #  not_overflow = False
                    #else:
                    sub_poly.append(changed_lat_lng)
                polygons.append(sub_poly)
            geom = {"centroids": [[centroid[0],centroid[1],0.0]],"h":1,"polygons":[polygons]}
            feature["geom"] = geom
            if(not_overflow):
                features.append(feature)
    json1["features"] = features
    return(json1)

def round_10(n):
    return(int(n + 9) // 10 * 10)

def find_distance_edge(bounds_map):
    coords_1 = (bounds_map[0], bounds_map[1])
    coords_2 = (bounds_map[0], bounds_map[3])
    coords_3 = (bounds_map[2], bounds_map[1])
    return (round_10(geopy.distance.distance(coords_1, coords_2).m), round_10(geopy.distance.distance(coords_1, coords_3).m))

def latlng_for_distance(lat,lng,distance,side):
    origin = geopy.Point(lat, lng)
    if(side == 'y'):
        destination = geodesic(kilometers=distance).destination(origin, 90)
    elif(side == 'x'):
        destination = geodesic(kilometers=distance).destination(origin, 0)
    return(round(destination.latitude,7), round(destination.longitude,7))

def matrix_latlng(ilat,ilng,x_distance,y_distance):
    latlng_height = []
    latlng_lenght = [(ilat,ilng)]
    for i in range(10,y_distance+10,10):
        latlng_height.append(latlng_for_distance(ilat,ilng,i/1000,"y"))
    for i in range(10,x_distance+10,10):
        latlng_lenght.append(latlng_for_distance(ilat,ilng,i/1000,"x"))
    return(latlng_lenght,latlng_height)

def find_points(data):
    distances = find_distance_edge(data.total_bounds) # Finds the distance in meters in x,y
    return(matrix_latlng(data.total_bounds[0],data.total_bounds[1],distances[1],distances[0])) # Find all the points of 10m matrix in latlng

def find_interaction(all_gpd,segment_bounds):
    bound = gpd.GeoSeries([Polygon(segment_bounds)])
    bound_gdframe = gpd.GeoDataFrame({'geometry': bound})
    return(gpd.overlay(all_gpd, bound_gdframe, how='intersection'))

def find_grid_gdf(gdf):
    matrix = find_points(gdf)
    xlen = len(matrix[0])
    ylen = len(matrix[1])
    matrix_interactions = [[None]* ylen]* xlen
    #print(xlen,ylen,len(matrix_interactions),len(matrix_interactions[0]))
    for x in range(0,xlen):
        for y in range(0,ylen):
            #print(x,y)
            bounds = [(matrix[0][x-1][0],matrix[1][y-1][1]),(matrix[0][x][0],matrix[1][y-1][1]),(matrix[0][x][0],matrix[1][y][1]),(matrix[0][x-1][0],matrix[1][y][1])]
            matrix_interactions[x][y] = find_interaction(gdf,bounds)
    return(matrix_interactions,xlen,ylen)

def find_one_grid(igdf):
    count = 0
    for i in range(0,len(igdf.building)):
        if(igdf.building[i] == 'yes'):
            count+=1
    if(count == 0):
        return([-1,0,0])
    else:
        return([0,1,0])

def find_grid_for_cs(gdf):
    igdfs,xlen,ylen = find_grid_gdf(gdf)
    grid_for_cs = [[None]*ylen]* xlen
    for x in range(0,xlen):
        for y in range(0,ylen):
            grid_for_cs[x][y] = find_one_grid(igdfs[x][y])
    return(grid_for_cs,xlen,ylen)


def get_cityscope_json(geojson):
    owner = {
      "name": "Gokul",
      "title": "-",
      "institute": "-"
    }
    mapping = {
      "type": {
        "-1": "MASK_INTERACTIVE",
        "0": "RL",
        "1": "RM",
        "2": "RS",
        "3": "OL",
        "4": "OM",
        "5": "OS",
        "6": "ROAD"
      }
    }
    block = [
      "type",
      "height",
      "rotation"
    ]
    name = "test1_adyar"
    temp = find_grid_for_cs(geojson)
    spatial = {
      "physical_longitude": geojson.geometry[0].centroid.y,
      "cellsize": cellsize,
      "longitude": geojson.geometry[0].centroid.y,
      "rotation": 0,
      "nrows": temp[2],
      "latitude": geojson.geometry[0].centroid.x,
      "ncols": temp[1],
      "physical_latitude": geojson.geometry[0].centroid.x
    }
    final_api_data= {"grid":temp[0],"id":"","objects":{}, "header": {"spatial":spatial,"name":name,"block":block,"mapping":mapping,"owner":owner}}
    return final_api_data

def run_all(bounds,h,w):
    image = test([bounds[1],bounds[0],bounds[3],bounds[2]]) #PIL image
    osm_json = get_geojson(bounds)
    q3jsjson = get_q3jsjson(overpass.as_geojson(osm_json, 'polygon'),h,w,bounds)
    geojson = overpass.as_geojson(osm_json, 'polygon') #geojson
    cityscopejson = get_cityscope_json(gpd.GeoDataFrame.from_features(geojson))
    return(image,geojson,q3jsjson,cityscopejson)


def get_scene(bound,h,w,name):
    pathtoq3jsjson = "./data/"+name+"/a0.json"
    pathtoimage = "./data/"+name+"/b1.png"
    scenename = name
    scenewidth = w
    sceneheight = h
    boundinverse = [bound[1],bound[0],bound[3],bound[2]]
    centerlat = (bound[0]+bound[2])/2
    centerlon = (bound[1]+bound[3])/2
    scene = {
      "layers": [
        {
          "data": {
            "blocks": [
              {
                "url": pathtoq3jsjson
              }
            ],
            "materials": [
              {
                "c": 12011595,
                "type": 0
              }
            ]
          },
          "id": 0,
          "properties": {
            "name": scenename,
            "objType": "Extruded",
            "queryable": 1,
            "type": "polygon",
            "visible": 'true'
          },
          "type": "layer"
        },
        {
          "data": [
            {
              "block": 0,
              "grid": {
                "height": 2,
                "url": "./data/index/b0.bin",
                "width": 2
              },
              "height": scenewidth,
              "layer": 1,
              "material": {
                "ds": 1,
                "image": { 
                  "url": pathtoimage
                },
                "type": 0
              },
              "sides": 'true',
              "translate": [
                0.0,
                0.0,
                0.0
              ],
              "type": "block",
              "width": sceneheight,
              "zScale": 5858.880522639865,
              "zShift": 0.0
            }
          ],
          "id": 1,
          "properties": {
            "name": "Flat Plane",
            "queryable": 1,
            "shading": 'true',
            "type": "dem",
            "visible": 'true'
          },
          "type": "layer"
        }
      ],
      "properties": {
        "baseExtent": boundinverse,
        "crs": "EPSG:4326",
        "height": scenewidth,
        "proj": "+proj=longlat +datum=WGS84 +no_defs",
        "rotation": 0,
        "wgs84Center": {
          "lat": centerlat,
          "lon": centerlon
        },
        "width": sceneheight,
        "zExaggeration": 1.0,
        "zShift": 0.0
      },
      "type": "scene"
    }
    return scene


def finall(bound,h,w,name,url_server,path_to_data_folder):
    a = run_all(bound,h,w)
    path = path_to_data_folder+name
    if(os.path.exists(path) == False):
    	os.mkdir(path)
    a[0].save(path+'/b1.png')
    with open(path+'/geojson.json','w+') as fh:
        json.dump(a[1],fh)
    with open(path+'/a0.json','w+') as fh:
        json.dump(a[2],fh)
    with open(path+'/cityscope.json','w+') as fh:
        json.dump(a[3],fh)
    #requests.post(url='http://localhost:3000/api/table/update/'+name, data=a[3])
    post_mongo(name,a[3])
    with open(path+'/scene.json','w+') as fh:
        json.dump(get_scene(bound,h,w,name),fh)
    return "success"

def sendmail(link,email):
	mail.send_message(
        'CityScope For World',
        sender='meetlukog@gmail.com',
        recipients=[email],
        body="Proccessing Completed! Link: "+link
    )

def post_mongo(name,json):
    conn = MongoClient("localhost", 27017)
    db = conn.cityio
    collection = db[name]
    confirm = collection.insert_one(json)
    return "success"

app = Flask(__name__)
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME = 'meetlukog@gmail.com',
    MAIL_PASSWORD = 'lcsboulxabumdpuv'
)
mail = Mail(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods=['POST'])
@cross_origin()
def home():
    #url = "http://cityscope.gok03.com"
    #path_to_data_folder = "/home/ubuntu/cityscope_for_world/viewer/data/"
    url = request.environ.get('HTTP_ORIGIN', 'default value')
    path_to_data_folder = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))+"/viewer/data/"
    content = request.get_json(force=True)
    h = 100
    w = 65.95092024539878
    name = content["name"]
    bound = content["bound"]
    email = content["email"]
    link = url+"/viewer/?name="+name
    ret = finall(bound,h,w,name,url,path_to_data_folder)
    sendmail(link,email)
    if(ret == "success"):
        return link
    else:
        return "404"


if __name__ == "__main__":
    #app.run(host= '0.0.0.0')
    app.run(host= '0.0.0.0',debug=True)

