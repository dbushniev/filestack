const getElementParents = (element: HTMLElement) => {
  const parents: HTMLElement[] = [];

  for (let parent = element; parent && parent.nodeType !== 9; parent = parent.parentNode as HTMLElement) {
    parents.push(parent);
  }

  return parents;
}


export default getElementParents;