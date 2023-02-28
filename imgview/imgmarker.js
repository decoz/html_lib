export default class imgMarker extends HTMLElement {

  attrs = ['marker', 'src', 'fontsize', 'css', 'labels', 'mixedlabel']


  imgsrc = null
  root = null
  img  = null
  fsize = 9
  markers = {}
  me = this
  labels = null
  values = null
  pending = false
  onready = null

  constructor() {
      super()
  }

  setImg(src) {
    this.image.src = src

    this.image.onload = e => {
      if( this.image.complete){
        if(this.markers) this.redrawMarkers()
        if(this.values) this.setValues(this.values)
      }
    }
  }


  setValue(name, value) {

    var marker = this.shadowRoot.getElementById(name)
    if( marker ) marker.innerText = this.mixedlabel? marker.innerText + "\n" + value : value
  };

  setValues(arr) {

    this.values = arr
    if(!this.image.complete) return

    for( var k in arr){
        this.setValue(k, arr[k])
    }
  };

  valuesWithLabel() {
    for(let k in this.markers){

    }

  }

  resetMarkers() {
    this.arr = []
    this.clearMarkers()
    this.setMarkers(this.arr)
  }

  setMarkers(arr) {
    this.markers = {}

    for( let k in arr ){
      let posx = arr[k][0]
      let posy = arr[k][1]
      if( typeof(posx) == 'string') posx = parseFloat(posx)
      if( typeof(posy) == 'string') posy = parseFloat(posy)
      this.markers[k] = [posx,posy]
      console.log(k,posx,posy)
    }

  };


  clearMarkers(){
    this.imgdiv.querySelectorAll('.marker').forEach( marker =>{
      let p = marker.parentElement
      p.removeChild(marker)
    })
  }


  createMarker(name, left, top){
    var marker = document.createElement('div')
    marker.id = name
    marker.className = 'marker'
    console.log(this.labels)
    marker.innerHTML = this.labels && this.labels[name] ? this.labels[name] : name
    marker.style.cssText = 'left:'+left+"px;top:"+top+"px"
    marker.style.cssText += `font-size:${this.fontsize}pt`

    return marker
  }

  getMarker(name){

    return this.shadowRoot.getElementById(name)
  }

  redrawMarkers(){
    if(!this.image.complete) {
      //console.log('canceled draw marker waiting loading')
      this.pending = true
      return;
    }


    console.log("redraw markers imgdiv size:", this.image.complete,
      this.image.clientWidth, " x ", this.image.clientHeight)
    console.log(this.markers)
    this.clearMarkers()
    for( let k in this.markers ){
      let pos = this.markers[k]
      /*
      console.log(pos,
        `${this.image.clientWidth} x ${this.image.clientHeight}`,
        `${this.image.offsetLeft},${this.image.offsetLeft}`)
      */
      let posx = parseInt( pos[0] * this.image.clientWidth  + this.image.offsetLeft)
      let posy = parseInt( pos[1] * this.image.clientHeight + this.image.offsetTop)

      //console.log("marker:",k,posx,posy)
      this.imgdiv.appendChild( this.createMarker(k, posx, posy) )
    }
    this.pending = false

  }

  addMarker(name, posx, posy) {
    this.markers[name] = [
      posx / this.image.clientWidth,
      posy / this.image.clientHeight
    ]
    this.redrawMarkers()
  };

  delMarker(name) {
    delete( this.markers[name] )
    this.redrawMarkers()
  }


  connectedCallback(){
    console.log('draw markers')
    for(let attr of this.attrs){
      if( this.hasAttributes(attr) ){
        this[attr] = this.getAttribute(attr)
      }  else  this['attr'] = null
    }
    if(this.labels) this.labels = JSON.parse(this.labels)

    if(!this.fontsize) this.fontsize = 9
    //console.log("fontsize:",this.fontsize)

    this.attachShadow({mode:'open'})

    this.shadowRoot.innerHTML += this.objhtml
    this.shadowRoot.innerHTML += this.cssstyle
    if(this.css) this.shadowRoot.innerHTML += this.css


    this.image = this.shadowRoot.getElementById('image')
    this.imgdiv = this.shadowRoot.getElementById('imgdiv')

    if(this.src) {
      this.image.src = this.src
      this.image.onload = e => {
        console.log('done')
          //console.log("now redrawing pended markers")
        if(this.markers) this.redrawMarkers()
        if(this.values) this.setValues(this.values)

        if(typeof(this.onload) == 'function') this.onload()

      }
    }

    if(this.marker) {
      this.markers = JSON.parse(this.marker)
      console.log(this.markers)
      //if(this.image.complete) this.redrawMarkers()
    }



  };

  objhtml = `
    <div id = imgdiv>
    <img id = image>
    </div>
  `

  cssstyle = `
    <style>
    :host {
      all: initial;
      position:relative;
      display: grid;
      width:100%;
      height:100%;
      max-height:100%;

    }
    #imgdiv {
      object-fit:contain;
      width:auto;
      max-height:100%;
      display: grid;
      overflow-y:hidden;
    }
    img {
      max-height:100%;
      min-height:100%;

      display:block;
      justify-self:center;
    }
    .marker{
      position:absolute;
    }
    </style>
  `



}
