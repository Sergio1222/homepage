import { fightersDetails, fighters } from './mockData';

const BASE_API_URL = 'https://api.github.com/';
const SECURITY_HEADERS = {
  headers: {
    authorization: "token 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"
  }
};

const rootElement = document.getElementById('root');
const loadingElement = document.getElementById('loading-overlay');

function callApi(endpoint, method = 'GET') {
  const url = BASE_API_URL + endpoint;
  const options = { method, ...SECURITY_HEADERS };

  return fetch(url, options)
    .then(response =>
      response.ok
        ? response.json()
        : Promise.reject(Error('Failed to load'))
    )
    .then(file => JSON.parse(atob(file.content)))
    .catch(error => { throw error });
}

class FighterService {
  #endpoint = 'repos/oleksandr-danylchenko/street-fighter/contents/resources/api/fighters.json'

  async getFighters() {
    try {
      const apiResult = await callApi(this.#endpoint, 'GET');
      return JSON.parse(atob(apiResult.content));
    } catch (error) {
      throw error;
    }
  }
}
const fighterService = new FighterService();
class View {
  element;

  createElement({ tagName, className = '', attributes = {} }) {
    const element = document.createElement(tagName);
    element.classList.add(className);

    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

    return element;
  }
}
get element() {
  return this.element;
}

set element(value) {
  this.element = value;
}
class FighterView extends View {
  constructor(fighter, handleClick) {
    super();
    this.createFighter(fighter, handleClick);
  }

  createFighter(fighter, handleClick) {
    const { name, source } = fighter;
    const nameElement = this.createName(name);
    const imageElement = this.createImage(source);

    this.element = this.createElement({ tagName: 'div', className: 'fighter' });
    this.element.append(imageElement, nameElement);
    this.element.addEventListener('click', event => handleClick(event, fighter), false);
  }

  createName(name) {
    const nameElement = this.createElement({ tagName: 'span', className: 'name' });
    nameElement.innerText = name;
    return nameElement;
  }

  createImage(source) {
    const attributes = { src: source };
    return this.createElement({
      tagName: 'img',
      className: 'fighter-image',
      attributes
    });
  }
}

class FightersView extends View {
  fightersDetailsMap = new Map();

  constructor(fighters) {
    super();
    this.createFighters(fighters);
  }

  createFighters(fighters) {
    const fighterElements = fighters.map(fighter => {
      const fighterView = new FighterView(fighter, this.handleFighterClick);
      return fighterView.element;
    });

    this.element = this.createElement({ tagName: 'div', className: 'fighters' });
    this.element.append(...fighterElements);
  }

  handleFighterClick(event, fighter) {
    this.fightersDetailsMap.set(fighter._id, fighter);
    console.log('clicked')
  }
}
class Lumberjack {
  cut() {
    console.log("Cutting tree");
  }
}

class SmartLumberjack extends Lumberjack {
  cut() {
    console.log("Measuring sizes of the tree");
    super.cut();
  }
}

const smartLumberjack = new SmartLumberjack();
smartLumberjack.cut();
class App {
  static rootElement = document.getElementById('root');
  static loadingElement = document.getElementById('loading-overlay');

  static async startApp() {
    try {
      App.loadingElement.style.visibility = 'visible';

      const fighters = await fighterService.getFighters();
      const fightersView = new FightersView(fighters);

      App.rootElement.appendChild(fightersView.element);
    } catch (error) {
      console.warn(error);
      App.rootElement.innerText = 'Failed to load data';
    } finally {
      App.loadingElement.style.visibility = 'hidden';
    }
  }
}

App.startApp();
.bind()
const obj = { a: 1 };
const bindedFunction = foo.bind(obj);
bindedFunction(); // { a: 1 }

function foo() {
  console.log(this);
}
// .call()
const obj = { a: 1 };
foo.call(obj); // { a: 1 }

function foo() {
  console.log(this);
}
// .apply()
const obj = { a: 1 };
const args = ['firstArg', 'secondArg'];
foo.apply(obj, args); // { a: 1 }, 'firstArg', 'secondArg'

foo.call(obj, ...args); // alternative

function foo(arg1, arg2) {
  console.log(this, arg1, arg2);
}
class FightersView extends View {
  constructor(fighters) {
    super();

    this.handleClick = this.handleFighterClick.bind(this);
    this.createFighters(fighters);
  }

  createFighters(fighters) {
    const fighterElements = fighters.map(fighter => {

      // 1. Class function with context
      const fighterView = new FighterView(fighter, this.handleClick);

      // 2. Inline context binding
      const fighterView = new FighterView(fighter, this.handleFighterClick.bind(this));

      // 3. Arrow function
      const fighterView = new FighterView(fighter, (event, fighters) => this.handleFighterClick(event, fighters));

      return fighterView.element;
    });

    // ...
  }
}

