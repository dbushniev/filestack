enum Keys {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp'
}

const KEYS: {[key: string]: string} = {
  [Keys.ArrowDown]: 'ArrowDown',
  [Keys.ArrowUp]: 'ArrowUp',
}

const scrollControl = (e: KeyboardEvent) => {
  const list = document.querySelector<HTMLDivElement>('.fsp-content-scroll');
  if (list && list.scrollHeight > list.clientHeight && KEYS[e.key]) {
    e.preventDefault();
    if (KEYS[e.key] === KEYS[Keys.ArrowDown]) return list.scrollTop += 100;
    return list.scrollTop += -100
  }
}

export default scrollControl;