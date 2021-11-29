// this will deep copy objects and arrays
// I think it's borked if you pass in any built in weird javascript class instances or Date objects, nodelists, things like that.
// but it can handle Arrays, Objects, Number, String, Boolean, and functions
// it probably won't work with react components
export const recursiveStateCopy = (oldState) => {
  if (thisIsPrimitive(oldState) || typeof oldState === 'function') return oldState
  let newState
  if (Array.isArray(oldState)) {
    newState = oldState.map(value => {
      return recursiveStateCopy(value)
    })
  } else if (thisIsAPlainObject(oldState)) {
    // this is a boring-ass object
    newState = {}
    Object.keys(oldState).forEach(key => {
      newState[key] = recursiveStateCopy(oldState[key])
    })
  } else if (thisIsASpecialObject(oldState)) {
    // it's an object, but it didn't pass the plain object test above
    // so this object must be an instance of some special class
    // I haven't tested this thoroughly... it seems too easy
    return Object.assign(Object.create(Object.getPrototypeOf(oldState)), oldState)
  }
  return newState
}

const thisIsASpecialObject = (thing) => {
  return typeof thing === 'object'
}

const thisIsAPlainObject = (thing) => {
  return Object.getPrototypeOf(thing).constructor.name === 'Object'
}

const thisIsPrimitive = (thing) => {
  return typeof thing === 'string' || typeof thing === 'number' || typeof thing === 'boolean'
}

// class Bishop extends Object {
//   constructor (props) {

//     super(props)
//   }
// }
// const testObject = new Object({ x: 0, y: 0, name: 'boring ass object' })
// const testPiece = new Bishop({ x: 0, y: 0, name: 'wB1' })
// console.log('BISHOP test 1', typeof testPiece === 'object')
// console.log('BISHOP test 2', Object.getPrototypeOf(testPiece))
// console.log('BISHOP test 3', Object.getPrototypeOf(testPiece).constructor.name)
// console.log('OBJ test 1', typeof testObject === 'object')
// console.log('OBJ test 2', Object.getPrototypeOf(testObject))
// console.log('OBJ test 3', Object.getPrototypeOf(testObject).constructor.name)

// const newBishop = Object.assign(Object.create(Object.getPrototypeOf(testPiece)), testPiece)
// const newTestObject = Object.assign(Object.create(Object.getPrototypeOf(testObject)), testObject)

// console.log('NEW BISHOP test 1', typeof newBishop === 'object')
// console.log('NEW BISHOP test 2', Object.getPrototypeOf(newBishop))
// console.log('NEW BISHOP test 3', Object.getPrototypeOf(newBishop).constructor.name)
// console.log('NEW OBJ test 1', typeof newTestObject === 'object')
// console.log('NEW OBJ test 2', Object.getPrototypeOf(newTestObject))
// console.log('NEW OBJ test 3', Object.getPrototypeOf(newTestObject).constructor.name)
