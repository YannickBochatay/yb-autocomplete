const template = document.createElement("template")

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      position:relative;
    }
    :host([hidden]) {
      display: none;
    }
    .list {
      display:none;
    }
    input:focus ~ .list {
      display:block;
    }
    ul {
      position:absolute;
      margin:0;
      padding:0;
      list-style-type:none;
      background-color:white;
      z-index:1;
      width:100%;
      border:1px solid #ddd;
    }
    li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
      padding:5px;
    }
    li:hover {
      background-color:#ddd;
      cursor:default;
    }
    .clear {
      font-family:sans-serif;
      position:relative;
      left:-15px;
      cursor:pointer;
    }
    input[value=""] ~ .clear {
      display:none;
    }
  </style>
  <div class="container">
    <input type="text" value=""/><span class="clear">x</span>
    <div class="list">
      <ul></ul>
    </div>
  </div>
`

class Autocomplete extends HTMLElement {

  constructor() {
    super()
    const children = this.children
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.ul = this.shadowRoot.querySelector("ul")
    this.input = this.shadowRoot.querySelector("input")

    const options = [...children].map(child => {
      const li = document.createElement("li")
      li.textContent = child.textContent
      li.title = child.textContent

      return li
    })

    this.ul.append(...options)
  }

  filter(searchStr) {
    [...this.ul.children].forEach(option => {
      const display = option.textContent.includes(searchStr)
      option.style.display = display ? "block" : "none"
    })
  }

  get value() {
    return this.input.value
  }

  set value(value) {
    this.input.value = value
    this.input.setAttribute("value", value)
    this.filter(value)
  }

  connectedCallback() {
    this.ul.addEventListener("mousedown", e => {
      e.preventDefault()
      this.value = e.target.textContent
      this.input.blur()
    })

    this.input.addEventListener("input", e => {
      this.value = e.target.value
    })

    this.shadowRoot.querySelector(".clear").addEventListener("click", () => {
      this.value = ""
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") this.value = newValue
  }
}

customElements.define('yb-autocomplete', Autocomplete);