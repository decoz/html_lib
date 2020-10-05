
export default class dragUpload extends HTMLElement {
  onFileDrop = null
  onUploadResponse = null
  uploadform = new FormData();

  uploadurl = ""

  constructor() {
    super()

  }

  uploadValue(key, value){
    this.uploadform.append(key, value)
  }

  uploadFile(file){
    console.log(this)
    var xhr = new XMLHttpRequest()
    //var formData = new FormData()
    var it = this
    xhr.open('POST', this.uploadurl, true)
    xhr.upload.addEventListener("progress", function(e) {
      //updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    })

    xhr.addEventListener('readystatechange', function(e) {

      if (xhr.readyState == 4 && xhr.status == 200) {
        if( typeof(it.onUploadResponse) == 'function')
            it.onUploadResponse(xhr.response)
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        // Error. Inform the user
      }
    })

    this.uploadform.append('file', file)
    xhr.send(this.uploadform)

  }

  preventDefaults(e){
    e.preventDefault()
    e.stopPropagation()
  }

  highlight(e){
    this.classList.add('highlight')
  }

  unhighlight(e){
    this.classList.remove('highlight')
  }

  h_drop(e){
    let dt = e.dataTransfer
    let files = [...dt.files]

    if( this.onFileDrop == 'function' ){
      files.forEach(this.onFileDrop)
    }

    if( this.uploadurl != "" ){
      files.forEach( this.uploadFile.bind(this) )
    }

  }

  connectedCallback(){
    this.addEventListener('dragenter', this.highlight, false)
    this.addEventListener('drop', this.h_drop, false)

    ;['dragleave', 'drop'].forEach( ev => {
      this.addEventListener( ev, this.unhighlight, false)
    })

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.addEventListener(eventName, this.preventDefaults, false)
    })

    if( this.hasAttributes('uploadurl') )
      this.uploadurl = this.getAttribute('uploadurl')

    this.attachShadow({mode:'open'})
    this.shadowRoot.innerHTML = `
    drag file here
    <style>
    :host {
      all: initial;
      color:dimgray;
      font-size:20px;
      line-height: 10;
      text-align: center;
      vertical-align: middle;
      padding: 10px;
      border: 2px dashed #ccc;
      border-radius: 20px;
      width:  600px;
      display: inline-block;
      height: 200px;
    }
    :host(.highlight){
      color:white;
      background-color:lightgray;
    }
    </style>
    `
  }
}
