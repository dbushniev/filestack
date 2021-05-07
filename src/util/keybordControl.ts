const KEYS = {
  Enter: 'Enter',
  Backspace: 'Backspace',
}

const BUTTONS = (key: string) => ({
  [key]: (): null => null,
  [KEYS.Enter]: () => document.querySelector<HTMLButtonElement>('.fsp-button.fsp-button--primary'),
  [KEYS.Backspace]: () => document.querySelector<HTMLButtonElement>('.fsp-button.fsp-button--cancel')
}[key])()

const keyboardControl = (e: KeyboardEvent) => {
  const btn = BUTTONS(e.key);
  if (btn) btn.click();
};

export default keyboardControl;