/**
   * Handles managing all events for whatever you plug it into. Priorities for hooks are based on lowest to highest in
   * that, lowest priority hooks are fired first.
   */
const slice = Array.prototype.slice

/**
* Contains the hooks that get registered with this EventManager. The array for storage utilizes a "flat"
* object literal such that looking up the hook utilizes the native object literal hash.
*/
const STORAGE = {
  actions: {},
  filters: {}
}

/**
* Adds an action to the event manager.
*
* @param action Must contain namespace.identifier
* @param callback Must be a valid callback function before this action is added
* @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
* @param [context] Supply a value to be used for this
*/
export function addAction(action, callback, priority = 10, context) {
  if (typeof action === "string" && typeof callback === "function") {
    priority = parseInt(priority, 10)
    _addHook("actions", action, callback, priority, context)
  }
}

/**
* Performs an action if it exists. You can pass as many arguments as you want to this function; the only rule is
* that the first argument must always be the action.
*/
export function doAction(/* action, arg1, arg2, ... */) {
  var args = slice.call(arguments)
  var action = args.shift()

  if (typeof action === "string") {
    _runHook("actions", action, args)
  }
}

/**
* Removes the specified action if it contains a namespace.identifier & exists.
*
* @param action The action to remove
* @param [callback] Callback function to remove
*/
export function removeAction(action, callback) {
  if (typeof action === "string") {
    _removeHook("actions", action, callback)
  }
}

/**
* Adds a filter to the event manager.
*
* @param filter Must contain namespace.identifier
* @param callback Must be a valid callback function before this action is added
* @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
* @param [context] Supply a value to be used for this
*/
export function addFilter(filter, callback, priority = 10, context) {
  if (typeof filter === "string" && typeof callback === "function") {
    priority = parseInt(priority, 10)
    _addHook("filters", filter, callback, priority, context)
  }
}

/**
* Performs a filter if it exists. You should only ever pass 1 argument to be filtered. The only rule is that
* the first argument must always be the filter.
*/
export function applyFilters(/* filter, filtered arg, arg2, ... */) {
  var args = slice.call(arguments)
  var filter = args.shift()

  if (typeof filter === "string") {
    return _runHook("filters", filter, args)
  }
}

/**
* Removes the specified filter if it contains a namespace.identifier & exists.
*
* @param filter The action to remove
* @param [callback] Callback function to remove
*/
export function removeFilter(filter, callback) {
  if (typeof filter === "string") {
    _removeHook("filters", filter, callback)
  }
}

/**
* Removes the specified hook by resetting the value of it.
*
* @param type Type of hook, either 'actions' or 'filters'
* @param hook The hook (namespace.identifier) to remove
* @private
*/
function _removeHook(type, hook, callback, context) {
  if (!STORAGE[type][hook]) {
    return
  }
  if (!callback) {
    STORAGE[type][hook] = []
  } else {
    const handlers = STORAGE[type][hook]
    if (!context) {
      for (let i = handlers.length; i--; ) {
        if (handlers[i].callback === callback) {
          handlers.splice(i, 1)
        }
      }
    } else {
      let handler
      for (let i = handlers.length; i--; ) {
        handler = handlers[i]
        if (handler.callback === callback && handler.context === context) {
          handlers.splice(i, 1)
        }
      }
    }
  }
}

/**
* Adds the hook to the appropriate storage container
*
* @param type 'actions' or 'filters'
* @param hook The hook (namespace.identifier) to add to our event manager
* @param callback The function that will be called when the hook is executed.
* @param priority The priority of this hook. Must be an integer.
* @param [context] A value to be used for this
* @private
*/
function _addHook(type, hook, callback, priority, context) {
  const hookObject = {
    callback,
    priority,
    context
  }

  // Utilize 'prop itself' : http://jsperf.com/hasownproperty-vs-in-vs-undefined/19
  var hooks = STORAGE[type][hook]
  if (hooks) {
    hooks.push(hookObject)
    hooks = _hookInsertSort(hooks)
  } else {
    hooks = [hookObject]
  }

  STORAGE[type][hook] = hooks
}

/**
* Use an insert sort for keeping our hooks organized based on priority. This function is ridiculously faster
* than bubble sort, etc: http://jsperf.com/javascript-sort
*
* @param hooks The custom array containing all of the appropriate hooks to perform an insert sort on.
* @private
*/
function _hookInsertSort(hooks) {
  let tmpHook, j, prevHook
  for (let i = 1, len = hooks.length; i < len; i++) {
    tmpHook = hooks[i]
    j = i
    // eslint-disable-next-line
    while ((prevHook = hooks[j - 1]) && prevHook.priority > tmpHook.priority) {
      hooks[j] = hooks[j - 1]
      --j
    }
    hooks[j] = tmpHook
  }

  return hooks
}

/**
* Runs the specified hook. If it is an action, the value is not modified but if it is a filter, it is.
*
* @param type 'actions' or 'filters'
* @param hook The hook ( namespace.identifier ) to be ran.
* @param args Arguments to pass to the action/filter. If it's a filter, args is actually a single parameter.
* @private
*/
function _runHook(type, hook, args) {
  const handlers = STORAGE[type][hook]

  if (!handlers) {
    return type === "filters" ? args[0] : false
  }

  const len = handlers.length

  if (type === "filters") {
    for (let i = 0; i < len; i++) {
      args[0] = handlers[i].callback.apply(handlers[i].context, args)
    }
  } else {
    for (let i = 0; i < len; i++) {
      handlers[i].callback.apply(handlers[i].context, args)
    }
  }

  return type === "filters" ? args[0] : true
}
