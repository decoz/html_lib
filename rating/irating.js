export default class iRating extends HTMLElement{

  value = 0
  max = 5

  constructor() {
    super()
  }

  Get() {
    return this.value
  }

  Put(v) {
    if( v < 1 ){
      let arr = this.shadowRoot.querySelectorAll('#rating input')
      arr.forEach(input => {
        input.checked = false
        this.value = 0
      })
    } else {
      let input = this.shadowRoot.getElementById('rate'+v)
      input.checked = true
      this.value = v
    }
  }


  h_click = e => {
    this.value =  e.srcElement.getAttribute('value')
    console.log(this.value)
  }

  connectedCallback(){
    this.attachShadow({mode:'open'})

    if(this.hasAttribute('max')) this.max = parseInt(this.getAttribute('max'))

    this.shadowRoot.innerHTML = this.make_objhtml(this.max)
    this.shadowRoot.innerHTML += this.defaultcss

    let arr = this.shadowRoot.querySelectorAll('#rating input')
    console.log(arr)

    arr.forEach( obj => {
        obj.addEventListener('click', this.h_click)
    })

  }

  make_objhtml(max) {
    let inputs = ''
    for(let i = max ; i > 0; i--){
      inputs += '<input type="radio" name="rating" value="' + i + '" id="rate' + i + '"><label for="rate' + i + '">⭐</label>\n'
    }
    return '<fieldset id = rating >' + inputs + '</fieldset'

  }

  defaultcss = `
  <style>
  fieldset{
      display: inline-block;
      direction: rtl;
      border: 0;
  }
  fieldset legend{
      text-align: left;
  }
  input[type=radio]{
      display: none;
  }
  label{
      font-size: 1em;
      color: transparent;
      text-shadow: 0 0 0 #f0f0f0;
  }
  label:hover{
      text-shadow: 0 0 0 #ec6517;
  }
  label:hover ~ label{
      text-shadow: 0 0 0 #ec6517;
  }
  input[type=radio]:checked ~ label{
      text-shadow: 0 0 0 #ec6517;
  }
  </style>
  `

}
