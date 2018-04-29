[![Build Status](https://travis-ci.org/kartotherian/quadtile-index.svg?branch=master)](https://travis-ci.org/kartotherian/quadtile-index)

# quadtile-index
Convert between x,y map tile coordinates and a bitwise-interleaved single integer

Quadtile index has many useful properties. For example, it makes zoom calculations much easier: for a tile at zoom N, the "parent" tile at zoom N-1 is simply `math.Floor(index/4)`. A single index integer makes iteration easier as well - `0 .. 4^zoom-1` are all the tiles at the current zoom level, and makes it much simpler to subdivide work between multiple machines. Iterating tends to go over the tiles in one area before moving to a different area, which may benefit caching.

Quadtiles use a 2-bit tile interleaved addresses. An **x** and **y** coordinate value bit representation of up to 26 bits each can be converted to a single integer value up to 56 bits. The limit is due to JavaScript's maximum lossless integer representation. For example, two 8 bit values **xxxx xxxx** and **yyyy yyyy** would produce a single **xyxyxyxy xyxyxyxy xyxyxyxy xyxyxyxy** index value.

The library will assert the validity of each value, and allows optional zoom for additional verification.

For more info, see [quadtile indexes info](https://wiki.openstreetmap.org/wiki/QuadTiles#Quadtile_implementation)

## xyToIndex(x, y, [zoom])
 Convert x,y into a single integer with alternating bits
## indexToXY(index, [zoom])
 Convert index into the x,y coordinates (as a [x,y] array)
## isValidCoordinate(val, [zoom]), isValidIndex(index, [zoom]), isValidZoom(zoom)
 Boolean validation functions
## maxZoom
 Constant: Maximum supported zoom level (26)
