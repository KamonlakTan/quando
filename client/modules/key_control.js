import * as text from "/common/text.js";

let quando = window['quando']
if (!quando) {
  alert('Fatal Error: key_control must be included after quando_browser')
}

  let self = quando.key_control = {}

  function _send(command, arg) {
    fetch('/control/' + command, { method: 'POST', 
      mode: "no-cors",
      body: JSON.stringify(arg), 
      headers: ({"Content-Type": "text/plain"})
    })
  }

  self.type = (str) => {
    _send('type', text.decode(str))
  }

  self.key = (ch, up_down, shift, ctrl, alt, on_off) => {
    // ch is a character, or character description string
    let press = false
    switch (up_down) {
      case 'down':
        press = true
        break
      case 'either':
        if (on_off && (on_off > 0.5)) {
          press = true
        }
    }
    let key_data = {'key':ch, 'shift':shift, 'ctrl':ctrl, 'alt':alt, 'press':press}
    _send('key', key_data)
  }

  document.addEventListener('keydown', (event) => {
    const isModifier = event.ctrlKey || event.metaKey;
  
    if (isModifier) {
      const platform = window.quandoPlatform; // 'mac' or 'windows'
      const app = window.quandoApp;           // 'word', 'google_docs', etc.
      const key = `${platform}_${app}`;
      const pressed = event.key.toLowerCase(); // e.g., 'b', 'i', 'u'
  
      switch (key) {
        case 'mac_word':
          switch (pressed) {
            case 'b':
              console.log('Bold for Word on Mac');
              break;
            case 'i':
              console.log('Italic for Word on Mac');
              break;
            case 'u':
              console.log('Underline for Word on Mac');
              break;
          }
          break;
  
        case 'mac_google_docs':
          switch (pressed) {
            case 'b':
              console.log('Bold for Google Docs on Mac');
              break;
            case 'i':
              console.log('Italic for Google Docs on Mac');
              break;
            case 'u':
              console.log('Underline for Google Docs on Mac');
              break;
          }
          break;
  
        case 'windows_word':
          switch (pressed) {
            case 'b':
              console.log('Bold for Word on Windows');
              break;
            case 'i':
              console.log('Italic for Word on Windows');
              break;
            case 'u':
              console.log('Underline for Word on Windows');
              break;
          }
          break;
  
        case 'windows_google_docs':
          switch (pressed) {
            case 'b':
              console.log('Bold for Google Docs on Windows');
              break;
            case 'i':
              console.log('Italic for Google Docs on Windows');
              break;
            case 'u':
              console.log('Underline for Google Docs on Windows');
              break;
          }
          break;
  
        default:
          console.log(`No handler for ${key}`);
      }
    }
  });
  
  function handleShortcut(action) {
    const isMac = window.quandoPlatform === 'mac';
    const app = window.quandoApp;
  
    let shortcut;
  
    if (app === 'google_docs') {
      switch (action) {
        case 'bold': shortcut = isMac ? ['meta', 'b'] : ['ctrl', 'b']; break;
        case 'italic': shortcut = isMac ? ['meta', 'i'] : ['ctrl', 'i']; break;
        case 'underline': shortcut = isMac ? ['meta', 'u'] : ['ctrl', 'u']; break;
      }
    } else if (app === 'word') {
      switch (action) {
        case 'bold': shortcut = isMac ? ['meta', 'b'] : ['ctrl', 'b']; break;
        case 'italic': shortcut = isMac ? ['meta', 'i'] : ['ctrl', 'i']; break;
        case 'underline': shortcut = isMac ? ['meta', 'u'] : ['ctrl', 'u']; break;
        // case 'superscript': shortcut = isMac ? ['ctrl', 'cmd', '+'] : ['ctrl', 'shift', '+']; break;
      }
    }
  
    if (shortcut) simulateKeyCombo(shortcut);
  }
  
  function simulateKeyCombo(keys) {
    // This can only really work in controlled environments (like extensions)
    // You might need to integrate with content scripts or clipboard actions
    console.log('Simulating:', keys.join(' + '));
  }
  
  quando.key.simulateShortcut = ({format}) => {
    let shortcuts = {
      bold: {ctrl: true, key: 'b'},
      italic: {ctrl: true, key: 'i'},
      underline: {ctrl: true, key: 'u'},
      strikethrough: {ctrl: true, shift: true, key: 'x'}
    };
  
    let shortcut = shortcuts[format];
    if (!shortcut) return;
  
    // Simulate key combo (you might already have a utility to send keyboard shortcuts)
    quando.key.handleKey({
      key: shortcut.key,
      ctrl: shortcut.ctrl || false,
      shift: shortcut.shift || false,
      alt: false,
      down_up: 'down'
    });
  };
  