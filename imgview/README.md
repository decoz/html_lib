# img view
this is custom elements for visualization additional information over images.

<hr>

## img_marker
img marker is elements making easy to put text over images

<img src = 'example.png'>

#### import
``` html
<script type = 'module'>
import imgMarker from './imgmarker.js'
customElements.define("img-marker", imgMarker)
</script>
```

#### usage
``` html
<img-marker
  id = 'bsize'
  src = 'bodysize.png'
  fontsize = '11'
  marker = '{
    "neck":[0.6,0.16],
    "shoulder":[0.2,0.2],
    "chest":[0.45,0.25],
    "arm":[0.17, 0.35],
    "waist":[0.45,0.39],
    "heap":[0.45,0.45],
    "leg":[0.7,0.65]
  }'
  >
</img-marker>

<script>
window.onload = function(e){
  bsize.labels = { 'chest':'가슴'  }
  bsize.redrawMarkers()
  bsize.setValues(json)
  bsize.setValue('shoulder','48')
}
</script>
```

#### attribute
- src : source image file
- marker : define markers
  ( position must be propotional 0~1 float values )
- fontsize : fontsize pt value
- css : additional css
- labels : convert label dictionary (must redraw after set)


```
  {
   "marker-name1" : [x-position, y-postion],
   "marker-name2" : [x-position, y-postion],
    :
  }
```

#### method
- setValue(key,value) : set value of marker by key
- setValues(json) : insert keys and values using json for multiple assignment
- setImg(src) : set image src (string)
-
