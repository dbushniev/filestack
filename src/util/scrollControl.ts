enum Keys {
  PageUp = 'PageUp',
  PageDown = 'PageDown'
}

const KEYS: {[key: string]: string} = {
  [Keys.PageDown]: 'PageDown',
  [Keys.PageUp]: 'PageUp',
}

const scrollControl = (e: KeyboardEvent) => {
  console.log(e.key)
  const list = document.querySelector<HTMLDivElement>('.fsp-content-scroll');
  if (list && list.scrollHeight > list.clientHeight && KEYS[e.key]) {
    e.preventDefault();
    if (KEYS[e.key] === KEYS[Keys.PageDown]) return list.scrollTop += 100;
    return list.scrollTop += -100
  }
}

export default scrollControl;