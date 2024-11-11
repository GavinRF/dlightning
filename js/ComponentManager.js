class ComponentManager {
  constructor() {
    this.components = {
      button: (type = 'default') => {
        const container = document.createElement('div');
        container.style.cssText = 'width: 100%; display: flex; justify-content: space-between;';
        
        const createButton = (text, isGhost = false, isDisabled = false) => {
          const button = document.createElement('div');
          button.textContent = text;
          button.style.cssText = `
            height: 48px;
            background-color: ${isGhost ? 'transparent' : 'var(--primary-color)'};
            color: ${isGhost ? 'var(--primary-color)' : 'var(--text-on-primary)'};
            border: ${isGhost ? '2px solid var(--primary-color)' : 'none'};
            border-radius: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
            flex: 1;
            align-content: center;
            text-align: center;
            margin: 0 4px;
            border-bottom:${isGhost ? '2px solid var(--primary-color)' : '3px solid rgba(0,0,0,.12)'};
          `;
          if (isDisabled) {
            button.style.opacity = '0.5';
          }
          button.setAttribute('role', 'button');
          button.setAttribute('contentEditable', 'true');
          button.setAttribute('data-button-type', type); // Store the button type
          return button;
        };

        switch (type) {
          case 'ghost':
            container.appendChild(createButton('Ghost Button', true));
            break;
          case 'twobuttons':
            container.appendChild(createButton('Button 1'));
            container.appendChild(createButton('Button 2'));
            break;
          case 'disabled':
            container.appendChild(createButton('Disabled Button', false, true));
            break;
          default:
            container.appendChild(createButton('Button'));
        }
        
        // Store the component type and variant
        container.setAttribute('data-component-type', 'button');
        container.setAttribute('data-component-variant', type);
        
        return container;
      },
      // ... other components ...
    };
  }
}

const componentManager = new ComponentManager();


// min-width: calc(50% - 4px); height: 200px; background-color: var(--neutral-gray); display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 10px; overflow: hidden; position: relative; background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA/You get the idea/SQD/UUUAFLSCloA//9k="); background-size: cover; background-position: center center;