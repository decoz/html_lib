export default class imgMarker extends HTMLElement {

  imgsrc = null
  root = null
  img  = null
  fsize = 9
  markers = {}
  me = this

  constructor() {
      super()

  };

  createMarker(name){
    var marker = document.createElement('div')
    marker.id = name
    marker.className = 'marker'
    marker.innerHTML = name
    return marker
  }

  refreshMarkers() {
    this.root.innerHTML = ""
    //debugger
    this.setImg(this.imgsrc)
  }

  locateMarkers(){
    var m = this.markers
    var w = this.img.width
    var h = this.img.height

    this.root = this.shadowRoot.children[0]
    //alert(this.root.clientWidth + ":" + this.img.src)
    for( var k in m ){
      var obj = this.createMarker(k)
      /*
      console.log( m[i].name + ":" + m[i].pos[0] + "," + m[i].pos[1] +
        "[" + this.root.clientWidth + "," + this.root.clientHeight + "]")
      */
      this.root.appendChild(obj)
      obj.style.left = m[k][0] * this.root.clientWidth / w
      obj.style.top = m[k][1] * this.root.clientHeight / h
    }
  };

  setImg(src) {
    //console.log("setImg:"+src)
    if(!src) return

    this.imgsrc = src
    this.img = document.createElement('img')
    this.img.src = src

    var newimg = this.img.cloneNode()

    newimg.onload = function(e){
      var root = this.shadowRoot.querySelector("#imgdiv")
      root.appendChild(newimg)
      this.locateMarkers()

    }.bind(this)

  };

  setValue(name, value) {
    var marker = this.shadowRoot.getElementById(name)
    marker.innerText = value
  };

  setValues(json) {
    for( var k in json){
        this.setValue(k, json[k])
    }
  };

  setMarkers(json) {
    for( var k in json ){
      this.addMarker(k, json[k][0], json[k][1] )
    }
  };


  addMarker(name, posx, posy) {

    var left = parseInt(posx)
    var top = parseInt(posy)

    this.markers[name] = [left, top]
  };

  readMarker(str) {
    var f = str.split(':')

    if( f.length != 2 ) return false
    var mark_name = f[0].trim()
    var pos = f[1].split(',')
    if( pos.length == 2 ){
        this.addMarker(mark_name, pos[0],pos[1])
    }
  };

  connectedCallback(){
    //this.root = this.shadowRoot.children[0]
    this.attachShadow({mode:'open'})
    var div = document.createElement('div')
    div.id = 'imgdiv'
    this.root = this.shadowRoot.appendChild(div)


    if( this.hasAttributes('src') ){    
      this.setImg(this.getAttribute('src'))
    }

    if( this.getAttribute('marker') ){
      var json  = JSON.parse(this.getAttribute('marker'))
      if(json) this.setMarkers(json)
    }

    if( this.hasAttributes('fontsize') ){
      var str = this.getAttribute('fontsize')
      this.fsize = parseInt(str)
    }



    this.shadowRoot.innerHTML += `
      <style>
      :host {
        all: initial;
        position:relative;
        display: inline-block;
      }
      #imgdiv {
        position:relative;
        display: inline-block;
      }
      img {
        width:100%;
        position:relative;
      }
      .marker{
        font-size:`
       + this.fsize +
      `pt;
        position:absolute;
      }
      </style> `

  };



}
