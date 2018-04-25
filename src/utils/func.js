import { isObservableArray } from "mobx"

/**
 * Compose functions
 * @see https://gist.github.com/JamieMason/172460a36a0eaef24233e6edb2706f83
 * @param {...function} fns
 */
export const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)))

/**
 * Same as compose but in reverse
 * @see https://gist.github.com/JamieMason/172460a36a0eaef24233e6edb2706f83
 * @param {...function} fns
 */
export const pipe = (...fns) => compose.apply(compose, fns.reverse())

export function* mapIt(iterable, fn) {
  var i = 0
  for (let item of iterable) yield fn(item, i++)
}

export function* filterIt(iterable, fn) {
  var i = 0
  for (let item of iterable) if (fn(item, i++)) yield item
}

export function reduceIt(iterable, fn, initial = undefined) {
  let val = initial
  if (val === undefined) {
    for (let x of iterable) {
      val = x
      break
    }
  }

  for (let x of iterable) {
    val = fn(val, x)
  }

  return val
}

/**
 * Renames the keys supplied in obj
 * to rename firstName to name
 * keys = {
 *   firstName: "name"
 * }
 *
 * @param {object} obj
 * @param {object} keys
 */
export function renameKeys(obj, keys) {
  return Object.entries(obj).reduce((save, [key, value]) => {
    if (value) {
      key = keys[key] || key
      save[key] = value
    }
    return save
  }, {})
}

export function asArray(v) {
  if (typeof v === "undefined") return []
  return Array.isArray(v) || isObservableArray(v) ? v : [v]
}
