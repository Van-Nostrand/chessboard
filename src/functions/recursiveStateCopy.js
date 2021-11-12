// this will deep copy objects and arrays
// it's borked if you pass in any "array-like objects" or Date objects, weird things like that. 
// but it can handle Arrays, Objects, Number, String, Boolean
export const recursiveStateCopy = (oldState) => {
  if (thisIsPrimitive(oldState)) return oldState
  let newState;
  if (Array.isArray(oldState)) {
    newState = oldState.map(value => {
      return recursiveStateCopy(value)
    })
  } else if (thisIsAnObject(oldState)) {
    newState = {}
    Object.keys(oldState).forEach(key => {
      newState[key] = recursiveStateCopy(oldState[key])
    });
  }
  return newState;
}

const thisIsAnObject = (thing) => {
  return typeof thing === 'object' && !Array.isArray(thing)
}

const thisIsPrimitive = (thing) => {
  return typeof thing === 'string' || typeof thing === 'number' || typeof thing === 'boolean'
}