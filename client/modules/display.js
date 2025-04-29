import * as destructor from "./destructor.js";

const quando = window['quando']
if (!quando) {
  alert('Fatal Error: display.js must be included after quando_browser')
}

let self = quando.display = {}
let buttons_parent = null // this is where to drop in new rows/columns

  function _getButtonsParent() {
    if (buttons_parent == null) {
      buttons_parent = document.getElementById("quando_buttons")
    }
    return buttons_parent
  }

  // Use an empty div for flew grow
  function _getWeightedButton(weight, button) {
    let div = document.createElement('div')
    div.className = "quando_button_parent"
    div.style.flexGrow = weight/100
    div.appendChild(button)
    return div
  }

  self.addButton = function({text = "", up_down = "down", weight = 100, text_colour, button_colour}, fn) {
    let button = document.createElement('div')
    button.className = 'quando_button';
    button.innerHTML = text;
    button.style.color = text_colour;
    button.style.background = button_colour;
    button.setAttribute('id', 'button'+text);

    function handleTouch(ev) {
      ev.preventDefault(); // Avoids double event
      switch (ev.type) {
        case "touchstart":
        case "mousedown":
          if (up_down === "down") {
            fn();
          } else if (up_down === "either") {
            fn(1);
          }
          break;
        case "touchend":
        case "mouseup":
          if (up_down === "up") {
            fn();
          } else if (up_down === "either") {
            fn(0);
          }
          break;
      }
    }

    // Attach event listeners
    button.onmousedown = handleTouch;
    button.ontouchstart = handleTouch;
    button.onmouseup = handleTouch;
    button.ontouchend = handleTouch;

    // Append button to parent
    _getButtonsParent().appendChild(_getWeightedButton(weight, button));
}


  self.addSpacer = function({weight = 100}) {
    let spacer = document.createElement('div')
    spacer.className = 'quando_button'
    spacer.style.opacity = 0
    _getButtonsParent().appendChild(_getWeightedButton(weight, spacer))
  }

  self.buttonRow = function({row_flow=true, weight=100}, fn) {
    let new_parent = document.createElement('div')
    new_parent.style.flexGrow = weight/100
    if (row_flow) {
      new_parent.className = "quando_buttons_row"
    } else {
      new_parent.className = "quando_buttons_column"
    }
    let original_parent = _getButtonsParent()
    original_parent.appendChild(new_parent)
    // descend into the child
    buttons_parent = new_parent
    fn()
    // restore the original parent
    buttons_parent = original_parent
  }

class ConditionalBlock extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById('conditional-block');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.evaluateCondition();
    // Re-evaluate whenever inputs change
    this.addEventListener('slotchange', () => this.evaluateCondition());
    this.shadowRoot.querySelector('.comparison')
      .addEventListener('change', () => this.evaluateCondition());
  }

  evaluateCondition() {
    const inputA = this.getSlottedValue('input-a');
    const comparator = this.shadowRoot.querySelector('.comparison').value;
    const inputB = this.getSlottedValue('input-b');

    let result = false;
    switch (comparator) {
      case 'equals':       result = (inputA === inputB); break;
      case 'contains':     result = inputA.includes(inputB); break;
      case 'startsWith':   result = inputA.startsWith(inputB); break;
      case 'endsWith':     result = inputA.endsWith(inputB); break;
    }

    // Show/Hide action slots based on result
    this.toggleSlot('then-action',  result);
    this.toggleSlot('else-action', !result);
  }

  getSlottedValue(slotName) {
    const slot = this.shadowRoot.querySelector(`slot[name="${slotName}"]`);
    const nodes = slot.assignedElements();
    if (nodes.length && typeof nodes[0].getAttribute === 'function') {
      return nodes[0].getAttribute('data-value') || nodes[0].textContent;
    }
    return '';
  }

  toggleSlot(slotName, show) {
    const slotElem = this.shadowRoot.querySelector(`slot[name="${slotName}"]`);
    slotElem.style.display = show ? '' : 'none';
  }
}

customElements.define('conditional-block', ConditionalBlock);