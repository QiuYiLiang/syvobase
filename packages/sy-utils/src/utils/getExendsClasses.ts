export function getExendsClasses(obj: any): any[] {
  let proto = Object.getPrototypeOf(obj)
  const classes: any[] = []

  while (proto) {
    if (proto.constructor && proto.constructor.name !== 'Object') {
      classes.push(proto.constructor)
    }
    proto = Object.getPrototypeOf(proto)
  }

  return classes.reverse()
}
