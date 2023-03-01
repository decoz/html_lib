export default class popupSel extends HTMLElement {
  onselect = null
  obj = null
  value = null
  labels = null

  constructor() {
    super()
  }

  additem(parent, value, item){
    let li = document.createElement("li")
    li.innerHTML = "<a value = '" + value + "'>"+item+"</a>"

    li.addEventListener('click', e => {
      let value = e.srcElement.getAttribute("value")
      console.log(value)
      if( typeof(this.onselect) == 'function')
        this.onselect(value)
    })
    parent.appendChild(li)
    return li
  }


  setList(json){
    let root = this.root
    this.addList(root, json)
  }

  addList(root,json){
    console.log("add to " + root.innerHTML)
    let ul = document.createElement("ul")
    root.appendChild(ul)

    console.log(Array.isArray(json),json)
    for(let k in json){

      let item = Array.isArray(json) ? json[k] : k
      if( this.labels && typeof(this.labels) == 'object' ) item = this.labels[k]
      let itemobj = this.additem(ul, item, item)
      console.log(typeof(json[k]))
      if( typeof(json[k]) == 'object'){
        itemobj.href = "#"
         this.addList(itemobj, json[k])
      }
    }
  }

  init(){
    this.shadowRoot.innerText = ""
    let ul = document.createElement("ul")
    ul.className = 'dropdown'
    let li = document.createElement("li")
    li.innerText = this.text
    ul.appendChild(li)
    this.root = this.shadowRoot.appendChild(ul).children[0]

  }


  connectedCallback(){
    console.log("create popupsel:",this.innerHTML)
    this.text = this.innerText
    this.attachShadow({mode:'open'})

    this.shadowRoot.innerHTML += this.csstyle;
    if( this.hasAttributes('items') ){
      this.init()
      let itemtxt = this.getAttribute('items')
      let items = JSON.parse(itemtxt)
      this.setList(items)
    }
  }

  csstyle = `
  <style>

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    margin: 0;
    padding: 10px;
  }

  .dropdown {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100px;
    background-color: #AAAAAA;
  }

  .dropdown li {
    z-index: 10;
    position: relative;
  }

  .dropdown li a {
    color: #ffffff;
    text-align: center;
    text-decoration: none;
    display: block;
    padding: 10px;
  }

  .dropdown li ul {
    position: absolute;
    top: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: none;
    line-height: normal;
    background-color: #333;
  }

  .dropdown li ul li a {
    text-align: left;
    color: #cccccc;
    font-size: 14px;
    padding: 10px;
    display: block;
    white-space: nowrap;
  }

  .dropdown li ul li a:hover {
    background-color: #0abf53;
    color: #ffffff;
  }

  .dropdown li ul li ul {
    left: 100%;
    top: 0;
  }

  ul li:hover>a {
    background-color: #AAA;
    border-right:1px solid #CCC;
    color: #ffffff !important;
  }

  ul li:hover>ul {
    display: block;
  }
  </style>
  `
}
