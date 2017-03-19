# quadtile-index
Convert between x,y tile coordinates and a bitwise-interleaved single integer

Quadtiles use a 2-bit tile interleaved addresses. So an x and y values represented as bits would result in **xyxyxyxy xyxyxyxy xyxyxyxy xyxyxyxy** index value.

## xyToIndex(x, y, [zoom])
 Convert x,y into a single integer with alternating bits
## indexToXY(index, [zoom])
 Convert index into the x,y coordinates (as a [x,y] array)
## isValidCoordinate(val, [zoom]), isValidIndex(index, [zoom]), isValidZoom(zoom)
 Boolean validation functions
## maxZoom
 Constant: Maximum supported zoom level (26)
## maxXY
 Constant: Maximum x or y coordinate for the maximum zoom level
## maxIndex
 Constant: Maximum index for the maximum zoom level


See also: [Quadtile indexes](https://wiki.openstreetmap.org/wiki/QuadTiles#Quadtile_implementation)
