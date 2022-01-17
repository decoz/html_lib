/*
  create multiple input by json

  usage :
  <js-input input = '
    'data1':'text/width:40',
    'data2':'select/options:1,2,3,4/width:40',
    'data3':'/width:40',
    'data3': [
      'x':'/width:20px'
      'y':'/width:20px'
    ]


  }
  '>
  </js-input>
*/

export default class jsInput extends HTMLElement {


  constructor() {
    super()
  }


  getjson(obj, json){
    switch(obj.className){
    case 'input_name' :
      let input = obj.querySelector("input")
      if(input && input.value != '') {
        console.log("json add:" + obj.innerText, input.value)
        json[obj.innerText] = input.value
        console.log("json now:")
        console.log(json)
      }
      break;
    case 'list' :
      let list = []
      for(let i in obj.children){
        let childjson = this.getjson(obj.children[i], {})
        if( Object.keys(childjson).length > 0 ) list.push(childjson)
      }
      json[obj.id] = list
      break
    default:
      for(var i in obj.children)
        this.getjson(obj.children[i], json)
    }

    return json
  }

  extractJson(){
    return this.getjson(this.shadowRoot, {})

  }

  createInput(name, str){
    //console.log(name + ":" + str)

    let fields = str.split('/')
    let input = null
    let css = null
    let el = null

    if( fields.length > 1) css = fields[1]
    //console.log(fields)
    switch(fields[0]){
      case '':
      case 'text':
        if( fields[0] == '' ) el = document.createElement('span')
        else el = document.createElement('div')

        el.innerText = name
        input = document.createElement('input')
        input.id = name
        input.style = css

        //console.log("css:"+css)
    }

    if(input) {
      el.className = 'input_name'
      el.appendChild(input)
    }

    return el
  }


  clonetpl(tpl){

    let tdiv = tpl.cloneNode(true)
    tdiv.className = ''
    tdiv.style.display = 'block'

    let del_btn = document.createElement('button');
    del_btn.innerText = 'remove'
    del_btn.onclick = function(e){

      this.parentElement.removeChild(this)
    }.bind(tdiv)

    tdiv.appendChild(del_btn)
    return tdiv
  }

  createTemplate(name, array){
    if(array.length > 0){
      let div = document.createElement('div')
      let cdiv = document.createElement('div')
      div.id = name
      div.className = 'list'
      div.innerText = name
      cdiv.className = 'tpl'
      cdiv.style.display = 'none'

      div.appendChild(cdiv)

      for(let i in array){
        this.struct(cdiv, array[i])
      }

      let add_btn = document.createElement('button')
      div.add_btn = add_btn
      add_btn.innerText = 'add'
      add_btn.className = 'btn_add'


      div.appendChild(this.clonetpl(cdiv))
      div.appendChild(add_btn)
      div.rootObj = this

      add_btn.onclick = function(e){
        let cdiv = this.querySelector(".tpl")
        let tdiv = this.rootObj.clonetpl(cdiv)
        let last = this.children[this.children.length-1]
        this.insertBefore(tdiv, last)
        tdiv.focus()
      }.bind(div)

      return div
    }
  }

  struct(root, json){
    //console.log(json)
    for(let k in json){
      //console.log(k + ":" + json[k])
      if( typeof(json[k]) == 'string'){
        let el = this.createInput(k, json[k])
        if(el) root.appendChild(el)

      }
      else if( Array.isArray(json[k])) {
        root.appendChild( this.createTemplate(k, json[k]) )
      }
    }
  }

  connectedCallback(){

    this.attachShadow({mode:'open'})
    this.shadowRoot.innerHTML += this.csstyle;

    if( this.hasAttributes('input') ){

      let txt = this.getAttribute('input')
      let json = JSON.parse( this.getAttribute('input'))
      if(json) this.struct(this.shadowRoot, json)
    }
  }

  csstyle = `
    <style>
    :host {
      all: initial;
      position:relative;
      display: inline-block;


    }
    .input_name {
      font-family: inherit;
      margin:10px;
      border-bottom: 1px solid gray;
    }
    .list {
      margin:10px;
    }
    input {
      font-family: inherit;
       color:gray;
       outline: 0;
       border:0;
       margin-left:10px;
       padding: 7px 0;
       background: transparent;
       transition: border-color 0.2s;
    }
    </style>
  `

}
