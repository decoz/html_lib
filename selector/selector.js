export default class selector extends HTMLElement {
  selectname = null
  selected = null
  onselect = null
  value = null

  init(){
    console.log(this.selectname)
    this.querySelectorAll(`[opt='${this.selectname}']`).forEach( elm => {
      console.log(elm)
      if(!elm.eventAttached)
        elm.addEventListener('click', e => {
          console.log(this, elm)
          elm.setAttribute('selected','')
          if( this.selected != null )
            this.selected.removeAttribute('selected')

          this.selected = elm
          this.value = elm.hasAttribute('value') ?
            elm.getAttribute('value') : elm.innerText

          console.log(this.onselect, typeof(this.onselect))
          if( this.onselect && typeof(this.onselect) == 'function'){

            this.onselect(this.value)
          }
        })
      elm.eventAttached = true

    })
  }

  connectedCallback(){

    if( this.hasAttribute('select') )
      this.selectname = this.getAttribute('select')

    if( this.hasAttribute('onselect') )
        this.onselect = this.getAttribute('onselect')
    this.init()
  }
}
