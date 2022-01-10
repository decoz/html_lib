export default class imgMarker extends HTMLElement {

  imgsrc = null
  root = null
  img  = null
  fsize = 9

  constructor() {
      super()
  };

  setImg(src) {
    this.img = document.createElement('img')
    this.img.src = src
    this.root.appendChild(this.img)
  };

  setValue(name, value) {
    var marker = this.root.getElementById(name)
    marker.innerText = value
  };

  setValues(json) {
    for( var k in json){
        this.setValue(k, json[k])
    }
  };

  addMarker(name, posx, posy) {
    //alert(name + " " + posx + "," + posy)
    var marker = document.createElement('div')

    marker.id = name
    marker.className = 'marker'
    marker.innerHTML = name
    this.root.appendChild(marker)
    marker.style.left = parseInt(posx)
    marker.style.top = parseInt(posy)
  };

  readMarker(str) {
    var f = str.split(':')

    if( f.length != 2 ) return false
    var mark_name = f[0].trim()
    var pos = f[1].split(',')
    if( pos.length == 2 ){
      //alert(mark_name + ":" + pos[0] + "," + pos[1])

      this.addMarker(mark_name, pos[0],pos[1])
    }
  };

  connectedCallback(){
    this.root = this.attachShadow({mode:'open'})

    if( this.hasAttributes('src') ){
      this.imgsrc = this.getAttribute('src')
      this.setImg(this.imgsrc)
    }

    if( this.hasAttributes('marker') ){
      var str = this.getAttribute('marker')
      var markers = str.split(';')
      for( var i in markers )
        this.readMarker(markers[i])
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
      img {

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
