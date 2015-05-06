# GoogleMapsAPIv3Toolkit-QV
QlikView extension to integrate main Google Maps API v3 features all in one place

Features included are:
  * Based on latitude and longitude coordinates
  * Possible to include you API Key
  * Support main map types
      - Roadmap | Satellite | Terrain | Hybrid | 45º Imagery | Street View
  * Display Markers
      - With ability to customize multiple marker icons
      - Info Window | Title | Label
      - Selectable (returns selection to QlikView)
      - Marker Clustering
      - Move markers to new location in the map
  * Custom shapes (polygons)
      - Info Window
      - Selectable (returns selection to QlikView)
      - Expression based coloring for multicolored shapes (i.e. based on a dimension)
  * Circles
      - Fast radius definition based on expression
      - Can be associated with markers (and moved with marker by the user)
      - Selectable (returns selection to QlikView)
      - Info Window
      - Expression based coloring for multicolored shapes (i.e. based on a dimension)
  * Heatmaps
      - Weight is expression based
      - Custom color
  * Lines
      - Info Window
      - Selectable (returns selection to QlikView)
      - Expression based coloring for multicolored shapes (i.e. based on a dimension)
      - Geodesic ready
  * Point to point directions
      - Display calculated direction based on origin and destination coordinates and driving mode type (i.e. walking or driving)

Note: extension loggin (console.log) was kept on purpose but is commented

A manual will be developed, but in the meanwhile, here are some tricks while waiting:
  * Latitude and Longitude are de dimensions of this chart
  * Use Measure 1 to determine the expected number of rows
  * If you have an API key from google you can include it in the "Basic Configurations"
  * To use custom icons for markers, either use URLs or relative paths to the image. You can include the icon in the extension folder at /lib/images/ and refer only to the filename
  * If you want to have multiple and diferent Icons, set the expression that will return the icon path (or filename) in "Markers - Additional Configurations". If done so, the path in the Markers main configurations will be ignored
  * Shapes and lines can be grouped by dimension value or calculated expressions
  * Colors are all expressions, so you can define a specific color calculated conditions
  * Point to point directions are based on given coordinates, passed through variables. You will need to create a variable for origin latitude, origin longitude, destination latitude, destination longitude. 
      - Travel mode must be passed as indicated with the following text: DRIVING, BICYCLING, TRANSIT or WALKING. Only one value permited at a time. You can use a variable within QlikView to allow a user iterate by the options. 
  * IMPORTANT: leave all non-used configurations in blank to guarantee best extension performance. 
  * IMPORTANT 2: Make sure your calculations are within the range defined in "Measure 1" or performance will be afected. Here is a list of options that must have this tip in account:
      - Basic Configurations -> Measure 1
      - Markers -> Info Window
      - Markers -> Marker Title
      - Markers -> Marker Label
      - Marksers - Additional Configurations -> Icons Path
      - Shapes and Circles -> Shape by
      - Shapes and Circles -> Circle Radius
      - Shapes and Circles -> Info Window
      - Shapes and Circles -> Stroke Calc Color
      - Shapes and Circles -> Fill Calc Color
      - Heatmaps -> Weight
      - Lines -> Group Line by
      - Lines -> Line Calc Color
      - Lines -> Line Weight