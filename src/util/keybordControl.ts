import _ from 'lodash';

const KEYS = {
  Enter: 'Enter',
  Backspace: 'Backspace',
}

const BUTTONS = (key: string) => ({
  [key]: (): null => null,
  [KEYS.Enter]: () => document.querySelector<HTMLButtonElement>('.fsp-button.fsp-button--primary'),
  [KEYS.Backspace]: () => _.first([
    document.querySelector<HTMLButtonElement>('.fsp-button.fsp-button--cancel'),
    document.querySelector<HTMLDivElement>('.fsp-summary__go-back'),
  ].filter(Boolean)),
}[key])()

const keyboardControl = (e: KeyboardEvent) => {
  e.stopPropagation();
  const btn = BUTTONS(e.key);
  if (btn) btn.click();
};

export default keyboardControl;