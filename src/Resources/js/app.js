// vim: ts=4 sts=4 sw=4 expandtab
// -- kriskowal Kris Kowal Copyright (C) 2009-2011 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright (C) 2010 XXX TODO License or CLA
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Gozala Irakli Gozalishvili Copyright (C) 2010 MIT License
// -- kitcambridge Kit Cambridge Copyright (C) 2011 MIT License
// -- kossnocorp Sasha Koss XXX TODO License or CLA
// -- bryanforbes Bryan Forbes XXX TODO License or CLA
// -- killdream Quildreen Motta Copyright (C) 2011 MIT Licence
// -- michaelficarra Michael Ficarra Copyright (C) 2011 3-clause BSD License
// -- sharkbrainguy Gerard Paapu Copyright (C) 2011 MIT License
// -- bbqsrc Brendan Molloy XXX TODO License or CLA
// -- iwyg XXX TODO License or CLA
// -- DomenicDenicola Domenic Denicola XXX TODO License or CLA
// -- xavierm02 Montillet Xavier XXX TODO License or CLA
// -- Raynos Raynos XXX TODO License or CLA
// -- samsonjs Sami Samhuri XXX TODO License or CLA
// -- rwldrn Rick Waldron Copyright (C) 2011 MIT License
// -- lexer Alexey Zakharov XXX TODO License or CLA

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-050.pdf
 *
 * NOTE: this is a draft, and as such, the URL is subject to change.  If the
 * link is broken, check in the parent directory for the latest TC39 PDF.
 * http://www.ecma-international.org/publications/files/drafts/
 *
 * Previous ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
 * This is a broken link to the previous draft of ES5 on which most of the
 * numbered specification references and quotes herein were taken.  Updating
 * these references and quotes to reflect the new document would be a welcome
 * volunteer project.
 *
 * @module
 */

/*whatsupdoc*/

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function")
            throw new TypeError(); // TODO message
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 9. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 10. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 11. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 12. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        // 13. The [[Scope]] internal property of F is unused and need not
        //   exist.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.

                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (result !== null && Object(result) === result)
                    return result;
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the list
                //   boundArgs in the same order followed by the same values as
                //   the list ExtraArgs in the same order. 5.  Return the
                //   result of calling the [[Call]] internal method of target
                //   providing boundThis as the this value and providing args
                //   as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // XXX bound.length is never writable, so don't even try
        //
        // 16. The length own property of F is given attributes as specified in
        //   15.3.5.1.
        // TODO
        // 17. Set the [[Extensible]] internal property of F to true.
        // TODO
        // 18. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // 19. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property.
        // XXX can't delete it in pure-js.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.3.2
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var self = toObject(this),
            thisp = arguments[1],
            i = 0,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object context
                fun.call(thisp, self[i], i, self);
            }
            i++;
        }
    };
}

// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, self);
        }
        return result;
    };
}

// ES5 15.4.4.20
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = [],
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                result.push(self[i]);
        }
        return result;
    };
}

// ES5 15.4.4.16
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self))
                return false;
        }
        return true;
    };
}

// ES5 15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                return true;
        }
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self)
                result = fun.call(void 0, result, self[i], i, self);
        }

        return result;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        do {
            if (i in this)
                result = fun.call(void 0, result, self[i], i, self);
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;

        var i = 0;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);

        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;
        var i = length - 1;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i])
                return i;
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}

// ES5 15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        // If object does not owns property return undefined immediately.
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;

                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { "__proto__": null };
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);

        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

// ES5 15.2.3.14
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {

    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function keys(object) {

        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// Format a Date object as a string according to a simplified subset of the ISO 8601
// standard as defined in 15.9.1.15.
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value;
        if (!isFinite(this))
            throw new RangeError;

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10)
                result[length] = "0" + value;
        }
        // pad milliseconds to have three digits.
        return result.slice(0, 3).join("-") + "T" + result.slice(3).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }
}

// ES5 15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // This function provides a String representation of a Date object for
        // use by JSON.stringify (15.12.3). When the toJSON method is called
        // with argument key, the following steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function")
            throw new TypeError(); // TODO message
        // 6. Return the result of calling the [[Call]] internal method of
        // toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("2011-06-15T21:40:05+06:00"))) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format. This pattern does not implement
        // extended years (15.9.1.15.1), as `Date.UTC` cannot parse them.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4})" + // four-digit year capture
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:\\.(\\d{3}))?" + // milliseconds capture
                ")?" +
            "(?:" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate)
            Date[key] = NativeDate[key];

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // parse months, days, hours, minutes, seconds, and milliseconds
                for (var i = 1; i < 7; i++) {
                    // provide default values if necessary
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // `Date` objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i == 1)
                        match[i]--;
                }

                // parse the UTC offset component
                var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

                // compute the explicit time zone offset if specified
                var offset = 0;
                if (sign) {
                    // detect invalid offsets and return early
                    if (hourOffset > 23 || minuteOffset > 59)
                        return NaN;

                    // express the provided time zone offset in minutes. The offset is
                    // negative for time zones west of UTC; positive otherwise.
                    offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
                }

                // compute a new UTC date value, accounting for the optional offset
                return NativeDate.UTC.apply(this, match) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

//
// String
// ======
//

// ES5 15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// http://jsperf.com/to-integer
var toInteger = function (n) {
    n = +n;
    if (n !== n) // isNaN
        n = -1;
    else if (n !== 0 && n !== (1/0) && n !== -(1/0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    return n;
};

var prepareString = "a"[0] != "a",
    // ES5 9.9
    toObject = function (o) {
        if (o == null) { // this matches both null and undefined
            throw new TypeError(); // TODO message
        }
        // If the implementation doesn't support by-index access of
        // string characters (ex. IE < 7), split the string
        if (prepareString && typeof o == "string" && o) {
            return o.split("");
        }
        return Object(o);
    };
});
 

// Generated by CoffeeScript 1.3.3
(function() {

  Number.prototype.toMoney = function() {
    var after_first_pass, amount, comma, split;
    amount = this / 100;
    split = ("" + amount).split('.');
    if (split[0].length > 2) {
      if (split[0].length > 3) {
        comma = split[0].length % 3;
      } else {
        comma = 0;
      }
      after_first_pass = split[0].substr(comma).replace(/(\d{3})(?=\d)/g, "$1,");
      if (comma) {
        split[0] = ("" + (split[0].substr(0, comma)) + ",") + after_first_pass;
      } else {
        after_first_pass;

      }
    }
    if (split[1]) {
      if (split[1].length < 2) {
        split[1] = "" + split[1] + "0";
      }
    } else {
      split[1] = "00";
    }
    return split.join('.');
  };

}).call(this);
 

/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window); 

(function() {
  var Batman,
    __slice = [].slice;

  Batman = function() {
    var mixins;
    mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args), t = typeof result;
      return t == "object" || t == "function" ? result || child : child;
    })(Batman.Object, mixins, function(){});
  };

  Batman.version = '0.10.0';

  Batman.config = {
    pathPrefix: '/',
    usePushState: false,
    minificationErrors: true
  };

  (Batman.container = (function() {
    return this;
  })()).Batman = Batman;

  if (typeof define === 'function') {
    define('batman', [], function() {
      return Batman;
    });
  }

  Batman.exportHelpers = function(onto) {
    var k, _i, _len, _ref;
    _ref = ['mixin', 'extend', 'unmixin', 'redirect', 'typeOf', 'redirect', 'setImmediate', 'clearImmediate'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      onto["$" + k] = Batman[k];
    }
    return onto;
  };

  Batman.exportGlobals = function() {
    return Batman.exportHelpers(Batman.container);
  };

}).call(this);

(function() {
  var __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Batman.Inflector = (function() {

    Inflector.prototype.plural = function(regex, replacement) {
      return this._plural.unshift([regex, replacement]);
    };

    Inflector.prototype.singular = function(regex, replacement) {
      return this._singular.unshift([regex, replacement]);
    };

    Inflector.prototype.human = function(regex, replacement) {
      return this._human.unshift([regex, replacement]);
    };

    Inflector.prototype.uncountable = function() {
      var strings;
      strings = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._uncountable = this._uncountable.concat(strings.map(function(x) {
        return new RegExp("" + x + "$", 'i');
      }));
    };

    Inflector.prototype.irregular = function(singular, plural) {
      if (singular.charAt(0) === plural.charAt(0)) {
        this.plural(new RegExp("(" + (singular.charAt(0)) + ")" + (singular.slice(1)) + "$", "i"), "$1" + plural.slice(1));
        this.plural(new RegExp("(" + (singular.charAt(0)) + ")" + (plural.slice(1)) + "$", "i"), "$1" + plural.slice(1));
        return this.singular(new RegExp("(" + (plural.charAt(0)) + ")" + (plural.slice(1)) + "$", "i"), "$1" + singular.slice(1));
      } else {
        this.plural(new RegExp("" + singular + "$", 'i'), plural);
        this.plural(new RegExp("" + plural + "$", 'i'), plural);
        return this.singular(new RegExp("" + plural + "$", 'i'), singular);
      }
    };

    function Inflector() {
      this._plural = [];
      this._singular = [];
      this._uncountable = [];
      this._human = [];
    }

    Inflector.prototype.ordinalize = function(number) {
      var absNumber, _ref;
      absNumber = Math.abs(parseInt(number));
      if (_ref = absNumber % 100, __indexOf.call([11, 12, 13], _ref) >= 0) {
        return number + "th";
      } else {
        switch (absNumber % 10) {
          case 1:
            return number + "st";
          case 2:
            return number + "nd";
          case 3:
            return number + "rd";
          default:
            return number + "th";
        }
      }
    };

    Inflector.prototype.pluralize = function(word) {
      var regex, replace_string, uncountableRegex, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      _ref = this._uncountable;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        uncountableRegex = _ref[_i];
        if (uncountableRegex.test(word)) {
          return word;
        }
      }
      _ref1 = this._plural;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        _ref2 = _ref1[_j], regex = _ref2[0], replace_string = _ref2[1];
        if (regex.test(word)) {
          return word.replace(regex, replace_string);
        }
      }
      return word;
    };

    Inflector.prototype.singularize = function(word) {
      var regex, replace_string, uncountableRegex, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      _ref = this._uncountable;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        uncountableRegex = _ref[_i];
        if (uncountableRegex.test(word)) {
          return word;
        }
      }
      _ref1 = this._singular;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        _ref2 = _ref1[_j], regex = _ref2[0], replace_string = _ref2[1];
        if (regex.test(word)) {
          return word.replace(regex, replace_string);
        }
      }
      return word;
    };

    Inflector.prototype.humanize = function(word) {
      var regex, replace_string, _i, _len, _ref, _ref1;
      _ref = this._human;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], regex = _ref1[0], replace_string = _ref1[1];
        if (regex.test(word)) {
          return word.replace(regex, replace_string);
        }
      }
      return word;
    };

    return Inflector;

  })();

}).call(this);

(function() {
  var Inflector, camelize_rx, capitalize_rx, humanize_rx1, humanize_rx2, humanize_rx3, underscore_rx1, underscore_rx2;

  camelize_rx = /(?:^|_|\-)(.)/g;

  capitalize_rx = /(^|\s)([a-z])/g;

  underscore_rx1 = /([A-Z]+)([A-Z][a-z])/g;

  underscore_rx2 = /([a-z\d])([A-Z])/g;

  humanize_rx1 = /_id$/;

  humanize_rx2 = /_|-/g;

  humanize_rx3 = /^\w/g;

  Batman.helpers = {
    ordinalize: function() {
      return Batman.helpers.inflector.ordinalize.apply(Batman.helpers.inflector, arguments);
    },
    singularize: function() {
      return Batman.helpers.inflector.singularize.apply(Batman.helpers.inflector, arguments);
    },
    pluralize: function(count, singular, plural, includeCount) {
      var result;
      if (includeCount == null) {
        includeCount = true;
      }
      if (arguments.length < 2) {
        return Batman.helpers.inflector.pluralize(count);
      } else {
        result = +count === 1 ? singular : plural || Batman.helpers.inflector.pluralize(singular);
        if (includeCount) {
          result = ("" + (count || 0) + " ") + result;
        }
        return result;
      }
    },
    camelize: function(string, firstLetterLower) {
      string = string.replace(camelize_rx, function(str, p1) {
        return p1.toUpperCase();
      });
      if (firstLetterLower) {
        return string.substr(0, 1).toLowerCase() + string.substr(1);
      } else {
        return string;
      }
    },
    underscore: function(string) {
      return string.replace(underscore_rx1, '$1_$2').replace(underscore_rx2, '$1_$2').replace('-', '_').toLowerCase();
    },
    capitalize: function(string) {
      return string.replace(capitalize_rx, function(m, p1, p2) {
        return p1 + p2.toUpperCase();
      });
    },
    trim: function(string) {
      if (string) {
        return string.trim();
      } else {
        return "";
      }
    },
    interpolate: function(stringOrObject, keys) {
      var key, string, value;
      if (typeof stringOrObject === 'object') {
        string = stringOrObject[keys.count];
        if (!string) {
          string = stringOrObject['other'];
        }
      } else {
        string = stringOrObject;
      }
      for (key in keys) {
        value = keys[key];
        string = string.replace(new RegExp("%\\{" + key + "\\}", "g"), value);
      }
      return string;
    },
    humanize: function(string) {
      string = Batman.helpers.underscore(string);
      string = Batman.helpers.inflector.humanize(string);
      return string.replace(humanize_rx1, '').replace(humanize_rx2, ' ').replace(humanize_rx3, function(match) {
        return match.toUpperCase();
      });
    }
  };

  Inflector = new Batman.Inflector;

  Batman.helpers.inflector = Inflector;

  Inflector.plural(/$/, 's');

  Inflector.plural(/s$/i, 's');

  Inflector.plural(/(ax|test)is$/i, '$1es');

  Inflector.plural(/(octop|vir)us$/i, '$1i');

  Inflector.plural(/(octop|vir)i$/i, '$1i');

  Inflector.plural(/(alias|status)$/i, '$1es');

  Inflector.plural(/(bu)s$/i, '$1ses');

  Inflector.plural(/(buffal|tomat)o$/i, '$1oes');

  Inflector.plural(/([ti])um$/i, '$1a');

  Inflector.plural(/([ti])a$/i, '$1a');

  Inflector.plural(/sis$/i, 'ses');

  Inflector.plural(/(?:([^f])fe|([lr])f)$/i, '$1$2ves');

  Inflector.plural(/(hive)$/i, '$1s');

  Inflector.plural(/([^aeiouy]|qu)y$/i, '$1ies');

  Inflector.plural(/(x|ch|ss|sh)$/i, '$1es');

  Inflector.plural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices');

  Inflector.plural(/([m|l])ouse$/i, '$1ice');

  Inflector.plural(/([m|l])ice$/i, '$1ice');

  Inflector.plural(/^(ox)$/i, '$1en');

  Inflector.plural(/^(oxen)$/i, '$1');

  Inflector.plural(/(quiz)$/i, '$1zes');

  Inflector.singular(/s$/i, '');

  Inflector.singular(/(n)ews$/i, '$1ews');

  Inflector.singular(/([ti])a$/i, '$1um');

  Inflector.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1$2sis');

  Inflector.singular(/(^analy)ses$/i, '$1sis');

  Inflector.singular(/([^f])ves$/i, '$1fe');

  Inflector.singular(/(hive)s$/i, '$1');

  Inflector.singular(/(tive)s$/i, '$1');

  Inflector.singular(/([lr])ves$/i, '$1f');

  Inflector.singular(/([^aeiouy]|qu)ies$/i, '$1y');

  Inflector.singular(/(s)eries$/i, '$1eries');

  Inflector.singular(/(m)ovies$/i, '$1ovie');

  Inflector.singular(/(x|ch|ss|sh)es$/i, '$1');

  Inflector.singular(/([m|l])ice$/i, '$1ouse');

  Inflector.singular(/(bus)es$/i, '$1');

  Inflector.singular(/(o)es$/i, '$1');

  Inflector.singular(/(shoe)s$/i, '$1');

  Inflector.singular(/(cris|ax|test)es$/i, '$1is');

  Inflector.singular(/(octop|vir)i$/i, '$1us');

  Inflector.singular(/(alias|status)es$/i, '$1');

  Inflector.singular(/^(ox)en/i, '$1');

  Inflector.singular(/(vert|ind)ices$/i, '$1ex');

  Inflector.singular(/(matr)ices$/i, '$1ix');

  Inflector.singular(/(quiz)zes$/i, '$1');

  Inflector.singular(/(database)s$/i, '$1');

  Inflector.irregular('person', 'people');

  Inflector.irregular('man', 'men');

  Inflector.irregular('child', 'children');

  Inflector.irregular('sex', 'sexes');

  Inflector.irregular('move', 'moves');

  Inflector.irregular('cow', 'kine');

  Inflector.irregular('zombie', 'zombies');

  Inflector.uncountable('equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans');

}).call(this);

(function() {
  var _implementImmediates, _objectToString,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Batman.typeOf = function(object) {
    if (typeof object === 'undefined') {
      return "Undefined";
    }
    return _objectToString.call(object).slice(8, -1);
  };

  _objectToString = Object.prototype.toString;

  Batman.extend = function() {
    var key, object, objects, to, value, _i, _len;
    to = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      for (key in object) {
        value = object[key];
        to[key] = value;
      }
    }
    return to;
  };

  Batman.mixin = function() {
    var hasSet, key, mixin, mixins, to, value, _i, _len;
    to = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    hasSet = typeof to.set === 'function';
    for (_i = 0, _len = mixins.length; _i < _len; _i++) {
      mixin = mixins[_i];
      if (Batman.typeOf(mixin) !== 'Object') {
        continue;
      }
      for (key in mixin) {
        if (!__hasProp.call(mixin, key)) continue;
        value = mixin[key];
        if (key === 'initialize' || key === 'uninitialize' || key === 'prototype') {
          continue;
        }
        if (hasSet) {
          to.set(key, value);
        } else if (to.nodeName != null) {
          Batman.data(to, key, value);
        } else {
          to[key] = value;
        }
      }
      if (typeof mixin.initialize === 'function') {
        mixin.initialize.call(to);
      }
    }
    return to;
  };

  Batman.unmixin = function() {
    var from, key, mixin, mixins, _i, _len;
    from = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = mixins.length; _i < _len; _i++) {
      mixin = mixins[_i];
      for (key in mixin) {
        if (key === 'initialize' || key === 'uninitialize') {
          continue;
        }
        delete from[key];
      }
      if (typeof mixin.uninitialize === 'function') {
        mixin.uninitialize.call(from);
      }
    }
    return from;
  };

  Batman._functionName = Batman.functionName = function(f) {
    var _ref;
    if (f.__name__) {
      return f.__name__;
    }
    if (f.name) {
      return f.name;
    }
    return (_ref = f.toString().match(/\W*function\s+([\w\$]+)\(/)) != null ? _ref[1] : void 0;
  };

  Batman._isChildOf = Batman.isChildOf = function(parentNode, childNode) {
    var node;
    node = childNode.parentNode;
    while (node) {
      if (node === parentNode) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  Batman.setImmediate = Batman.clearImmediate = null;

  _implementImmediates = function(container) {
    var canUsePostMessage, count, functions, getHandle, handler, prefix, tasks;
    canUsePostMessage = function() {
      var async, oldMessage;
      if (!container.postMessage) {
        return false;
      }
      async = true;
      oldMessage = container.onmessage;
      container.onmessage = function() {
        return async = false;
      };
      container.postMessage("", "*");
      container.onmessage = oldMessage;
      return async;
    };
    tasks = new Batman.SimpleHash;
    count = 0;
    getHandle = function() {
      return "go" + (++count);
    };
    if (container.setImmediate) {
      Batman.setImmediate = container.setImmediate;
      Batman.clearImmediate = container.clearImmediate;
    } else if (container.msSetImmediate) {
      Batman.setImmediate = msSetImmediate;
      Batman.clearImmediate = msClearImmediate;
    } else if (canUsePostMessage()) {
      prefix = 'com.batman.';
      functions = new Batman.SimpleHash;
      handler = function(e) {
        var handle, _base;
        if (!~e.data.search(prefix)) {
          return;
        }
        handle = e.data.substring(prefix.length);
        return typeof (_base = tasks.unset(handle)) === "function" ? _base() : void 0;
      };
      if (container.addEventListener) {
        container.addEventListener('message', handler, false);
      } else {
        container.attachEvent('onmessage', handler);
      }
      Batman.setImmediate = function(f) {
        var handle;
        tasks.set(handle = getHandle(), f);
        container.postMessage(prefix + handle, "*");
        return handle;
      };
      Batman.clearImmediate = function(handle) {
        return tasks.unset(handle);
      };
    } else if (typeof document !== 'undefined' && __indexOf.call(document.createElement("script"), "onreadystatechange") >= 0) {
      Batman.setImmediate = function(f) {
        var handle, script;
        handle = getHandle();
        script = document.createElement("script");
        script.onreadystatechange = function() {
          var _base;
          if (typeof (_base = tasks.get(handle)) === "function") {
            _base();
          }
          script.onreadystatechange = null;
          script.parentNode.removeChild(script);
          return script = null;
        };
        document.documentElement.appendChild(script);
        return handle;
      };
      Batman.clearImmediate = function(handle) {
        return tasks.unset(handle);
      };
    } else if (typeof process !== "undefined" && process !== null ? process.nextTick : void 0) {
      functions = {};
      Batman.setImmediate = function(f) {
        var handle;
        handle = getHandle();
        functions[handle] = f;
        process.nextTick(function() {
          if (typeof functions[handle] === "function") {
            functions[handle]();
          }
          return delete functions[handle];
        });
        return handle;
      };
      Batman.clearImmediate = function(handle) {
        return delete functions[handle];
      };
    } else {
      Batman.setImmediate = function(f) {
        return setTimeout(f, 0);
      };
      Batman.clearImmediate = function(handle) {
        return clearTimeout(handle);
      };
    }
    Batman.setImmediate = Batman.setImmediate;
    return Batman.clearImmediate = Batman.clearImmediate;
  };

  Batman.setImmediate = function() {
    _implementImmediates(Batman.container);
    return Batman.setImmediate.apply(this, arguments);
  };

  Batman.clearImmediate = function() {
    _implementImmediates(Batman.container);
    return Batman.clearImmediate.apply(this, arguments);
  };

  Batman.forEach = function(container, iterator, ctx) {
    var e, i, k, v, _i, _len, _results, _results1;
    if (container.forEach) {
      return container.forEach(iterator, ctx);
    } else if (container.indexOf) {
      _results = [];
      for (i = _i = 0, _len = container.length; _i < _len; i = ++_i) {
        e = container[i];
        _results.push(iterator.call(ctx, e, i, container));
      }
      return _results;
    } else {
      _results1 = [];
      for (k in container) {
        v = container[k];
        _results1.push(iterator.call(ctx, k, v, container));
      }
      return _results1;
    }
  };

  Batman.objectHasKey = function(object, key) {
    if (typeof object.hasKey === 'function') {
      return object.hasKey(key);
    } else {
      return key in object;
    }
  };

  Batman.contains = function(container, item) {
    if (container.indexOf) {
      return __indexOf.call(container, item) >= 0;
    } else if (typeof container.has === 'function') {
      return container.has(item);
    } else {
      return Batman.objectHasKey(container, item);
    }
  };

  Batman.get = function(base, key) {
    if (typeof base.get === 'function') {
      return base.get(key);
    } else {
      return Batman.Property.forBaseAndKey(base, key).getValue();
    }
  };

  Batman.getPath = function(base, segments) {
    var segment, _i, _len;
    for (_i = 0, _len = segments.length; _i < _len; _i++) {
      segment = segments[_i];
      if (base != null) {
        base = Batman.get(base, segment);
        if (base == null) {
          return base;
        }
      } else {
        return void 0;
      }
    }
    return base;
  };

  Batman.escapeHTML = (function() {
    var replacements;
    replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&#34;",
      "'": "&#39;"
    };
    return function(s) {
      return ("" + s).replace(/[&<>'"]/g, function(c) {
        return replacements[c];
      });
    };
  })();

  Batman.translate = function(x, values) {
    if (values == null) {
      values = {};
    }
    return Batman.helpers.interpolate(Batman.get(Batman.translate.messages, x), values);
  };

  Batman.translate.messages = {};

  Batman.t = function() {
    return Batman.translate.apply(Batman, arguments);
  };

  Batman.redirect = function(url) {
    var _ref;
    return (_ref = Batman.navigator) != null ? _ref.redirect(url) : void 0;
  };

  Batman.initializeObject = function(object) {
    if (object._batman != null) {
      return object._batman.check(object);
    } else {
      return object._batman = new Batman._Batman(object);
    }
  };

}).call(this);

(function() {
  var developer;

  Batman.developer = {
    suppressed: false,
    DevelopmentError: (function() {
      var DevelopmentError;
      DevelopmentError = function(message) {
        this.message = message;
        return this.name = "DevelopmentError";
      };
      DevelopmentError.prototype = Error.prototype;
      return DevelopmentError;
    })(),
    _ie_console: function(f, args) {
      var arg, _i, _len, _results;
      if (args.length !== 1) {
        if (typeof console !== "undefined" && console !== null) {
          console[f]("..." + f + " of " + args.length + " items...");
        }
      }
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _results.push(typeof console !== "undefined" && console !== null ? console[f](arg) : void 0);
      }
      return _results;
    },
    suppress: function(f) {
      developer.suppressed = true;
      if (f) {
        f();
        return developer.suppressed = false;
      }
    },
    unsuppress: function() {
      return developer.suppressed = false;
    },
    log: function() {
      if (developer.suppressed || !((typeof console !== "undefined" && console !== null ? console.log : void 0) != null)) {
        return;
      }
      if (console.log.apply) {
        return console.log.apply(console, arguments);
      } else {
        return developer._ie_console("log", arguments);
      }
    },
    warn: function() {
      if (developer.suppressed || !((typeof console !== "undefined" && console !== null ? console.warn : void 0) != null)) {
        return;
      }
      if (console.warn.apply) {
        return console.warn.apply(console, arguments);
      } else {
        return developer._ie_console("warn", arguments);
      }
    },
    error: function(message) {
      throw new developer.DevelopmentError(message);
    },
    assert: function(result, message) {
      if (!result) {
        return developer.error(message);
      }
    },
    "do": function(f) {
      if (!developer.suppressed) {
        return f();
      }
    },
    addFilters: function() {
      return Batman.extend(Batman.Filters, {
        log: function(value, key) {
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.log === "function") {
              console.log(arguments);
            }
          }
          return value;
        },
        logStack: function(value) {
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.log === "function") {
              console.log(developer.currentFilterStack);
            }
          }
          return value;
        }
      });
    }
  };

  developer = Batman.developer;

  Batman.developer.assert((function() {}).bind, "Error! Batman needs Function.bind to work! Please shim it using something like es5-shim or augmentjs!");

}).call(this);

(function() {
  var _Batman;

  Batman._Batman = _Batman = (function() {

    function _Batman(object) {
      this.object = object;
    }

    _Batman.prototype.check = function(object) {
      if (object !== this.object) {
        object._batman = new Batman._Batman(object);
        return false;
      }
      return true;
    };

    _Batman.prototype.get = function(key) {
      var reduction, results;
      results = this.getAll(key);
      switch (results.length) {
        case 0:
          return void 0;
        case 1:
          return results[0];
        default:
          reduction = results[0].concat != null ? function(a, b) {
            return a.concat(b);
          } : results[0].merge != null ? function(a, b) {
            return a.merge(b);
          } : results.every(function(x) {
            return typeof x === 'object';
          }) ? (results.unshift({}), function(a, b) {
            return Batman.extend(a, b);
          }) : void 0;
          if (reduction) {
            return results.reduceRight(reduction);
          } else {
            return results;
          }
      }
    };

    _Batman.prototype.getFirst = function(key) {
      var results;
      results = this.getAll(key);
      return results[0];
    };

    _Batman.prototype.getAll = function(keyOrGetter) {
      var getter, results, val;
      if (typeof keyOrGetter === 'function') {
        getter = keyOrGetter;
      } else {
        getter = function(ancestor) {
          var _ref;
          return (_ref = ancestor._batman) != null ? _ref[keyOrGetter] : void 0;
        };
      }
      results = this.ancestors(getter);
      if (val = getter(this.object)) {
        results.unshift(val);
      }
      return results;
    };

    _Batman.prototype.ancestors = function(getter) {
      var isClass, parent, proto, results, val, _ref, _ref1;
      if (getter == null) {
        getter = function(x) {
          return x;
        };
      }
      results = [];
      isClass = !!this.object.prototype;
      parent = isClass ? (_ref = this.object.__super__) != null ? _ref.constructor : void 0 : (proto = Object.getPrototypeOf(this.object)) === this.object ? this.object.constructor.__super__ : proto;
      if (parent != null) {
        if ((_ref1 = parent._batman) != null) {
          _ref1.check(parent);
        }
        val = getter(parent);
        if (val != null) {
          results.push(val);
        }
        if (parent._batman != null) {
          results = results.concat(parent._batman.ancestors(getter));
        }
      }
      return results;
    };

    _Batman.prototype.set = function(key, value) {
      return this[key] = value;
    };

    return _Batman;

  })();

}).call(this);

(function() {

  Batman.Event = (function() {

    Event.forBaseAndKey = function(base, key) {
      if (base.isEventEmitter) {
        return base.event(key);
      } else {
        return new Batman.Event(base, key);
      }
    };

    function Event(base, key) {
      this.base = base;
      this.key = key;
      this.handlers = [];
      this._preventCount = 0;
    }

    Event.prototype.isEvent = true;

    Event.prototype.isEqual = function(other) {
      return this.constructor === other.constructor && this.base === other.base && this.key === other.key;
    };

    Event.prototype.hashKey = function() {
      var key;
      this.hashKey = function() {
        return key;
      };
      return key = "<Batman.Event base: " + (Batman.Hash.prototype.hashKeyFor(this.base)) + ", key: \"" + (Batman.Hash.prototype.hashKeyFor(this.key)) + "\">";
    };

    Event.prototype.addHandler = function(handler) {
      if (this.handlers.indexOf(handler) === -1) {
        this.handlers.push(handler);
      }
      if (this.oneShot) {
        this.autofireHandler(handler);
      }
      return this;
    };

    Event.prototype.removeHandler = function(handler) {
      var index;
      if ((index = this.handlers.indexOf(handler)) !== -1) {
        this.handlers.splice(index, 1);
      }
      return this;
    };

    Event.prototype.eachHandler = function(iterator) {
      var key, _ref, _ref1;
      this.handlers.slice().forEach(iterator);
      if ((_ref = this.base) != null ? _ref.isEventEmitter : void 0) {
        key = this.key;
        return (_ref1 = this.base._batman) != null ? _ref1.ancestors(function(ancestor) {
          var handlers, _ref2, _ref3;
          if (ancestor.isEventEmitter && ((_ref2 = ancestor._batman) != null ? (_ref3 = _ref2.events) != null ? _ref3.hasOwnProperty(key) : void 0 : void 0)) {
            handlers = ancestor.event(key).handlers;
            return handlers.slice().forEach(iterator);
          }
        }) : void 0;
      }
    };

    Event.prototype.clearHandlers = function() {
      return this.handlers = [];
    };

    Event.prototype.handlerContext = function() {
      return this.base;
    };

    Event.prototype.prevent = function() {
      return ++this._preventCount;
    };

    Event.prototype.allow = function() {
      if (this._preventCount) {
        --this._preventCount;
      }
      return this._preventCount;
    };

    Event.prototype.isPrevented = function() {
      return this._preventCount > 0;
    };

    Event.prototype.autofireHandler = function(handler) {
      if (this._oneShotFired && (this._oneShotArgs != null)) {
        return handler.apply(this.handlerContext(), this._oneShotArgs);
      }
    };

    Event.prototype.resetOneShot = function() {
      this._oneShotFired = false;
      return this._oneShotArgs = null;
    };

    Event.prototype.fire = function() {
      var args, context;
      if (this.isPrevented() || this._oneShotFired) {
        return false;
      }
      context = this.handlerContext();
      args = arguments;
      if (this.oneShot) {
        this._oneShotFired = true;
        this._oneShotArgs = arguments;
      }
      return this.eachHandler(function(handler) {
        return handler.apply(context, args);
      });
    };

    Event.prototype.allowAndFire = function() {
      this.allow();
      return this.fire.apply(this, arguments);
    };

    return Event;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PropertyEvent = (function(_super) {

    __extends(PropertyEvent, _super);

    function PropertyEvent() {
      return PropertyEvent.__super__.constructor.apply(this, arguments);
    }

    PropertyEvent.prototype.eachHandler = function(iterator) {
      return this.base.eachObserver(iterator);
    };

    PropertyEvent.prototype.handlerContext = function() {
      return this.base.base;
    };

    return PropertyEvent;

  })(Batman.Event);

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.EventEmitter = {
    isEventEmitter: true,
    hasEvent: function(key) {
      var _ref, _ref1;
      return (_ref = this._batman) != null ? typeof _ref.get === "function" ? (_ref1 = _ref.get('events')) != null ? _ref1.hasOwnProperty(key) : void 0 : void 0 : void 0;
    },
    event: function(key) {
      var eventClass, events, existingEvent, newEvent, _base;
      Batman.initializeObject(this);
      eventClass = this.eventClass || Batman.Event;
      events = (_base = this._batman).events || (_base.events = {});
      if (events.hasOwnProperty(key)) {
        return existingEvent = events[key];
      } else {
        this._batman.ancestors(function(ancestor) {
          var _ref, _ref1;
          return existingEvent || (existingEvent = (_ref = ancestor._batman) != null ? (_ref1 = _ref.events) != null ? _ref1[key] : void 0 : void 0);
        });
        newEvent = events[key] = new eventClass(this, key);
        newEvent.oneShot = existingEvent != null ? existingEvent.oneShot : void 0;
        return newEvent;
      }
    },
    on: function(key, handler) {
      return this.event(key).addHandler(handler);
    },
    once: function(key, originalHandler) {
      var event, handler;
      event = this.event(key);
      handler = function() {
        originalHandler.apply(this, arguments);
        return event.removeHandler(handler);
      };
      return event.addHandler(handler);
    },
    registerAsMutableSource: function() {
      return Batman.Property.registerSource(this);
    },
    mutation: function(wrappedFunction) {
      return function() {
        var result;
        result = wrappedFunction.apply(this, arguments);
        this.event('change').fire(this, this);
        return result;
      };
    },
    prevent: function(key) {
      this.event(key).prevent();
      return this;
    },
    allow: function(key) {
      this.event(key).allow();
      return this;
    },
    isPrevented: function(key) {
      return this.event(key).isPrevented();
    },
    fire: function() {
      var args, key, _ref;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = this.event(key)).fire.apply(_ref, args);
    },
    allowAndFire: function() {
      var args, key, _ref;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = this.event(key)).allowAndFire.apply(_ref, args);
    }
  };

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.Enumerable = {
    isEnumerable: true,
    map: function(f, ctx) {
      var r;
      if (ctx == null) {
        ctx = Batman.container;
      }
      r = [];
      this.forEach(function() {
        return r.push(f.apply(ctx, arguments));
      });
      return r;
    },
    mapToProperty: function(key) {
      var r;
      r = [];
      this.forEach(function(item) {
        return r.push(item.get(key));
      });
      return r;
    },
    every: function(f, ctx) {
      var r;
      if (ctx == null) {
        ctx = Batman.container;
      }
      r = true;
      this.forEach(function() {
        return r = r && f.apply(ctx, arguments);
      });
      return r;
    },
    some: function(f, ctx) {
      var r;
      if (ctx == null) {
        ctx = Batman.container;
      }
      r = false;
      this.forEach(function() {
        return r = r || f.apply(ctx, arguments);
      });
      return r;
    },
    reduce: function(f, r) {
      var count, self;
      count = 0;
      self = this;
      this.forEach(function() {
        if (r != null) {
          return r = f.apply(null, [r].concat(__slice.call(arguments), [count], [self]));
        } else {
          return r = arguments[0];
        }
      });
      return r;
    },
    filter: function(f) {
      var r, wrap;
      r = new this.constructor;
      if (r.add) {
        wrap = function(r, e) {
          if (f(e)) {
            r.add(e);
          }
          return r;
        };
      } else if (r.set) {
        wrap = function(r, k, v) {
          if (f(k, v)) {
            r.set(k, v);
          }
          return r;
        };
      } else {
        if (!r.push) {
          r = [];
        }
        wrap = function(r, e) {
          if (f(e)) {
            r.push(e);
          }
          return r;
        };
      }
      return this.reduce(wrap, r);
    },
    inGroupsOf: function(n) {
      var current, i, r;
      r = [];
      current = false;
      i = 0;
      this.forEach(function(x) {
        if (i++ % n === 0) {
          current = [];
          r.push(current);
        }
        return current.push(x);
      });
      return r;
    }
  };

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.SimpleHash = (function() {

    function SimpleHash(obj) {
      this._storage = {};
      this.length = 0;
      if (obj != null) {
        this.update(obj);
      }
    }

    Batman.extend(SimpleHash.prototype, Batman.Enumerable);

    SimpleHash.prototype.propertyClass = Batman.Property;

    SimpleHash.prototype.hasKey = function(key) {
      var pair, pairs, _i, _len;
      if (this.objectKey(key)) {
        if (!this._objectStorage) {
          return false;
        }
        if (pairs = this._objectStorage[this.hashKeyFor(key)]) {
          for (_i = 0, _len = pairs.length; _i < _len; _i++) {
            pair = pairs[_i];
            if (this.equality(pair[0], key)) {
              return true;
            }
          }
        }
        return false;
      } else {
        key = this.prefixedKey(key);
        return this._storage.hasOwnProperty(key);
      }
    };

    SimpleHash.prototype.get = function(key) {
      var pair, pairs, _i, _len;
      if (this.objectKey(key)) {
        if (!this._objectStorage) {
          return void 0;
        }
        if (pairs = this._objectStorage[this.hashKeyFor(key)]) {
          for (_i = 0, _len = pairs.length; _i < _len; _i++) {
            pair = pairs[_i];
            if (this.equality(pair[0], key)) {
              return pair[1];
            }
          }
        }
      } else {
        return this._storage[this.prefixedKey(key)];
      }
    };

    SimpleHash.prototype.set = function(key, val) {
      var pair, pairs, _base, _i, _len, _name;
      if (this.objectKey(key)) {
        this._objectStorage || (this._objectStorage = {});
        pairs = (_base = this._objectStorage)[_name = this.hashKeyFor(key)] || (_base[_name] = []);
        for (_i = 0, _len = pairs.length; _i < _len; _i++) {
          pair = pairs[_i];
          if (this.equality(pair[0], key)) {
            return pair[1] = val;
          }
        }
        this.length++;
        pairs.push([key, val]);
        return val;
      } else {
        key = this.prefixedKey(key);
        if (this._storage[key] == null) {
          this.length++;
        }
        return this._storage[key] = val;
      }
    };

    SimpleHash.prototype.unset = function(key) {
      var hashKey, index, obj, pair, pairs, val, value, _i, _len, _ref;
      if (this.objectKey(key)) {
        if (!this._objectStorage) {
          return void 0;
        }
        hashKey = this.hashKeyFor(key);
        if (pairs = this._objectStorage[hashKey]) {
          for (index = _i = 0, _len = pairs.length; _i < _len; index = ++_i) {
            _ref = pairs[index], obj = _ref[0], value = _ref[1];
            if (this.equality(obj, key)) {
              pair = pairs.splice(index, 1);
              if (!pairs.length) {
                delete this._objectStorage[hashKey];
              }
              this.length--;
              return pair[0][1];
            }
          }
        }
      } else {
        key = this.prefixedKey(key);
        val = this._storage[key];
        if (this._storage[key] != null) {
          this.length--;
          delete this._storage[key];
        }
        return val;
      }
    };

    SimpleHash.prototype.getOrSet = function(key, valueFunction) {
      var currentValue;
      currentValue = this.get(key);
      if (!currentValue) {
        currentValue = valueFunction();
        this.set(key, currentValue);
      }
      return currentValue;
    };

    SimpleHash.prototype.prefixedKey = function(key) {
      return "_" + key;
    };

    SimpleHash.prototype.unprefixedKey = function(key) {
      return key.slice(1);
    };

    SimpleHash.prototype.hashKeyFor = function(obj) {
      return (obj != null ? typeof obj.hashKey === "function" ? obj.hashKey() : void 0 : void 0) || obj;
    };

    SimpleHash.prototype.equality = function(lhs, rhs) {
      if (lhs === rhs) {
        return true;
      }
      if (lhs !== lhs && rhs !== rhs) {
        return true;
      }
      if ((lhs != null ? typeof lhs.isEqual === "function" ? lhs.isEqual(rhs) : void 0 : void 0) && (rhs != null ? typeof rhs.isEqual === "function" ? rhs.isEqual(lhs) : void 0 : void 0)) {
        return true;
      }
      return false;
    };

    SimpleHash.prototype.objectKey = function(key) {
      return typeof key !== 'string';
    };

    SimpleHash.prototype.forEach = function(iterator, ctx) {
      var key, obj, results, value, values, _i, _len, _ref, _ref1, _ref2, _ref3;
      results = [];
      if (this._objectStorage) {
        _ref = this._objectStorage;
        for (key in _ref) {
          values = _ref[key];
          _ref1 = values.slice();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            _ref2 = _ref1[_i], obj = _ref2[0], value = _ref2[1];
            results.push(iterator.call(ctx, obj, value, this));
          }
        }
      }
      _ref3 = this._storage;
      for (key in _ref3) {
        value = _ref3[key];
        results.push(iterator.call(ctx, this.unprefixedKey(key), value, this));
      }
      return results;
    };

    SimpleHash.prototype.keys = function() {
      var result;
      result = [];
      Batman.SimpleHash.prototype.forEach.call(this, function(key) {
        return result.push(key);
      });
      return result;
    };

    SimpleHash.prototype.toArray = SimpleHash.prototype.keys;

    SimpleHash.prototype.clear = function() {
      this._storage = {};
      delete this._objectStorage;
      return this.length = 0;
    };

    SimpleHash.prototype.isEmpty = function() {
      return this.length === 0;
    };

    SimpleHash.prototype.merge = function() {
      var hash, merged, others, _i, _len;
      others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      merged = new this.constructor;
      others.unshift(this);
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        hash = others[_i];
        hash.forEach(function(obj, value) {
          return merged.set(obj, value);
        });
      }
      return merged;
    };

    SimpleHash.prototype.update = function(object) {
      var k, v, _results;
      _results = [];
      for (k in object) {
        v = object[k];
        _results.push(this.set(k, v));
      }
      return _results;
    };

    SimpleHash.prototype.replace = function(object) {
      var _this = this;
      this.forEach(function(key, value) {
        if (!(key in object)) {
          return _this.unset(key);
        }
      });
      return this.update(object);
    };

    SimpleHash.prototype.toObject = function() {
      var key, obj, pair, value, _ref, _ref1;
      obj = {};
      _ref = this._storage;
      for (key in _ref) {
        value = _ref[key];
        obj[this.unprefixedKey(key)] = value;
      }
      if (this._objectStorage) {
        _ref1 = this._objectStorage;
        for (key in _ref1) {
          pair = _ref1[key];
          obj[key] = pair[0][1];
        }
      }
      return obj;
    };

    SimpleHash.prototype.toJSON = SimpleHash.prototype.toObject;

    return SimpleHash;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.AssociationCurator = (function(_super) {

    __extends(AssociationCurator, _super);

    AssociationCurator.availableAssociations = ['belongsTo', 'hasOne', 'hasMany'];

    function AssociationCurator(model) {
      this.model = model;
      AssociationCurator.__super__.constructor.call(this);
      this._byTypeStorage = new Batman.SimpleHash;
    }

    AssociationCurator.prototype.add = function(association) {
      var associationTypeSet;
      this.set(association.label, association);
      if (!(associationTypeSet = this._byTypeStorage.get(association.associationType))) {
        associationTypeSet = new Batman.SimpleSet;
        this._byTypeStorage.set(association.associationType, associationTypeSet);
      }
      return associationTypeSet.add(association);
    };

    AssociationCurator.prototype.getByType = function(type) {
      return this._byTypeStorage.get(type);
    };

    AssociationCurator.prototype.getByLabel = function(label) {
      return this.get(label);
    };

    AssociationCurator.prototype.reset = function() {
      this.forEach(function(label, association) {
        return association.reset();
      });
      return true;
    };

    AssociationCurator.prototype.merge = function() {
      var others, result;
      others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      result = AssociationCurator.__super__.merge.apply(this, arguments);
      result._byTypeStorage = this._byTypeStorage.merge(others.map(function(other) {
        return other._byTypeStorage;
      }));
      return result;
    };

    AssociationCurator.prototype._markDirtyAttribute = function(key, oldValue) {
      var _ref;
      if ((_ref = this.lifecycle.get('state')) !== 'loading' && _ref !== 'creating' && _ref !== 'saving' && _ref !== 'saved') {
        if (this.lifecycle.startTransition('set')) {
          return this.dirtyKeys.set(key, oldValue);
        } else {
          throw new Batman.StateMachine.InvalidTransitionError("Can't set while in state " + (this.lifecycle.get('state')));
        }
      }
    };

    return AssociationCurator;

  })(Batman.SimpleHash);

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.SimpleSet = (function() {

    function SimpleSet() {
      this._storage = [];
      this.length = 0;
      if (arguments.length > 0) {
        this.add.apply(this, arguments);
      }
    }

    Batman.extend(SimpleSet.prototype, Batman.Enumerable);

    SimpleSet.prototype.has = function(item) {
      return !!(~this._indexOfItem(item));
    };

    SimpleSet.prototype.add = function() {
      var addedItems, item, items, _i, _len;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      addedItems = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (!(!~this._indexOfItem(item))) {
          continue;
        }
        this._storage.push(item);
        addedItems.push(item);
      }
      this.length = this._storage.length;
      if (this.fire && addedItems.length !== 0) {
        this.fire('change', this, this);
        this.fire.apply(this, ['itemsWereAdded'].concat(__slice.call(addedItems)));
      }
      return addedItems;
    };

    SimpleSet.prototype.remove = function() {
      var index, item, items, removedItems, _i, _len;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      removedItems = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (!(~(index = this._indexOfItem(item)))) {
          continue;
        }
        this._storage.splice(index, 1);
        removedItems.push(item);
      }
      this.length = this._storage.length;
      if (this.fire && removedItems.length !== 0) {
        this.fire('change', this, this);
        this.fire.apply(this, ['itemsWereRemoved'].concat(__slice.call(removedItems)));
      }
      return removedItems;
    };

    SimpleSet.prototype.find = function(f) {
      var item, _i, _len, _ref;
      _ref = this._storage;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (f(item)) {
          return item;
        }
      }
    };

    SimpleSet.prototype.forEach = function(iterator, ctx) {
      var container;
      container = this;
      return this._storage.slice().forEach(function(key) {
        return iterator.call(ctx, key, null, container);
      });
    };

    SimpleSet.prototype.isEmpty = function() {
      return this.length === 0;
    };

    SimpleSet.prototype.clear = function() {
      var items;
      items = this._storage;
      this._storage = [];
      this.length = 0;
      if (this.fire && items.length !== 0) {
        this.fire('change', this, this);
        this.fire.apply(this, ['itemsWereRemoved'].concat(__slice.call(items)));
      }
      return items;
    };

    SimpleSet.prototype.replace = function(other) {
      try {
        if (typeof this.prevent === "function") {
          this.prevent('change');
        }
        this.clear();
        return this.add.apply(this, other.toArray());
      } finally {
        if (typeof this.allowAndFire === "function") {
          this.allowAndFire('change', this, this);
        }
      }
    };

    SimpleSet.prototype.toArray = function() {
      return this._storage.slice();
    };

    SimpleSet.prototype.merge = function() {
      var merged, others, set, _i, _len;
      others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      merged = new this.constructor;
      others.unshift(this);
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        set = others[_i];
        set.forEach(function(v) {
          return merged.add(v);
        });
      }
      return merged;
    };

    SimpleSet.prototype.indexedBy = function(key) {
      this._indexes || (this._indexes = new Batman.SimpleHash);
      return this._indexes.get(key) || this._indexes.set(key, new Batman.SetIndex(this, key));
    };

    SimpleSet.prototype.indexedByUnique = function(key) {
      this._uniqueIndexes || (this._uniqueIndexes = new Batman.SimpleHash);
      return this._uniqueIndexes.get(key) || this._uniqueIndexes.set(key, new Batman.UniqueSetIndex(this, key));
    };

    SimpleSet.prototype.sortedBy = function(key, order) {
      var sortsForKey;
      if (order == null) {
        order = "asc";
      }
      order = order.toLowerCase() === "desc" ? "desc" : "asc";
      this._sorts || (this._sorts = new Batman.SimpleHash);
      sortsForKey = this._sorts.get(key) || this._sorts.set(key, new Batman.Object);
      return sortsForKey.get(order) || sortsForKey.set(order, new Batman.SetSort(this, key, order));
    };

    SimpleSet.prototype.equality = Batman.SimpleHash.prototype.equality;

    SimpleSet.prototype._indexOfItem = function(givenItem) {
      var index, item, _i, _len, _ref;
      _ref = this._storage;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        if (this.equality(givenItem, item)) {
          return index;
        }
      }
      return -1;
    };

    return SimpleSet;

  })();

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.Property = (function() {

    Batman.mixin(Property.prototype, Batman.EventEmitter);

    Property._sourceTrackerStack = [];

    Property.sourceTracker = function() {
      var stack;
      return (stack = this._sourceTrackerStack)[stack.length - 1];
    };

    Property.defaultAccessor = {
      get: function(key) {
        return this[key];
      },
      set: function(key, val) {
        return this[key] = val;
      },
      unset: function(key) {
        var x;
        x = this[key];
        delete this[key];
        return x;
      },
      cache: false
    };

    Property.defaultAccessorForBase = function(base) {
      var _ref;
      return ((_ref = base._batman) != null ? _ref.getFirst('defaultAccessor') : void 0) || Batman.Property.defaultAccessor;
    };

    Property.accessorForBaseAndKey = function(base, key) {
      var accessor, _bm, _ref,
        _this = this;
      if ((_bm = base._batman) != null) {
        accessor = (_ref = _bm.keyAccessors) != null ? _ref.get(key) : void 0;
        if (!accessor) {
          _bm.ancestors(function(ancestor) {
            var _ref1, _ref2;
            return accessor || (accessor = (_ref1 = ancestor._batman) != null ? (_ref2 = _ref1.keyAccessors) != null ? _ref2.get(key) : void 0 : void 0);
          });
        }
      }
      return accessor || this.defaultAccessorForBase(base);
    };

    Property.forBaseAndKey = function(base, key) {
      if (base.isObservable) {
        return base.property(key);
      } else {
        return new Batman.Keypath(base, key);
      }
    };

    Property.withoutTracking = function(block) {
      return this.wrapTrackingPrevention(block)();
    };

    Property.wrapTrackingPrevention = function(block) {
      return function() {
        Batman.Property.pushDummySourceTracker();
        try {
          return block.apply(this, arguments);
        } finally {
          Batman.Property.popSourceTracker();
        }
      };
    };

    Property.registerSource = function(obj) {
      var _ref;
      if (!obj.isEventEmitter) {
        return;
      }
      return (_ref = this.sourceTracker()) != null ? _ref.add(obj) : void 0;
    };

    Property.pushSourceTracker = function() {
      return Batman.Property._sourceTrackerStack.push(new Batman.SimpleSet);
    };

    Property.pushDummySourceTracker = function() {
      return Batman.Property._sourceTrackerStack.push(null);
    };

    Property.popSourceTracker = function() {
      return Batman.Property._sourceTrackerStack.pop();
    };

    function Property(base, key) {
      this.base = base;
      this.key = key;
    }

    Property.prototype._isolationCount = 0;

    Property.prototype.cached = false;

    Property.prototype.value = null;

    Property.prototype.sources = null;

    Property.prototype.isProperty = true;

    Property.prototype.isDead = false;

    Property.prototype.eventClass = Batman.PropertyEvent;

    Property.prototype.isEqual = function(other) {
      return this.constructor === other.constructor && this.base === other.base && this.key === other.key;
    };

    Property.prototype.hashKey = function() {
      var key;
      this.hashKey = function() {
        return key;
      };
      return key = "<Batman.Property base: " + (Batman.Hash.prototype.hashKeyFor(this.base)) + ", key: \"" + (Batman.Hash.prototype.hashKeyFor(this.key)) + "\">";
    };

    Property.prototype.event = function(key) {
      var eventClass, _base;
      eventClass = this.eventClass || Batman.Event;
      this.events || (this.events = {});
      (_base = this.events)[key] || (_base[key] = new eventClass(this, key));
      return this.events[key];
    };

    Property.prototype.changeEvent = function() {
      var event;
      event = this.event('change');
      this.changeEvent = function() {
        return event;
      };
      return event;
    };

    Property.prototype.accessor = function() {
      var accessor;
      accessor = this.constructor.accessorForBaseAndKey(this.base, this.key);
      this.accessor = function() {
        return accessor;
      };
      return accessor;
    };

    Property.prototype.eachObserver = function(iterator) {
      var key;
      key = this.key;
      this.changeEvent().handlers.slice().forEach(iterator);
      if (this.base.isObservable) {
        return this.base._batman.ancestors(function(ancestor) {
          var handlers, property;
          if (ancestor.isObservable && ancestor.hasProperty(key)) {
            property = ancestor.property(key);
            handlers = property.changeEvent().handlers;
            return handlers.slice().forEach(iterator);
          }
        });
      }
    };

    Property.prototype.observers = function() {
      var results;
      results = [];
      this.eachObserver(function(observer) {
        return results.push(observer);
      });
      return results;
    };

    Property.prototype.hasObservers = function() {
      return this.observers().length > 0;
    };

    Property.prototype.updateSourcesFromTracker = function() {
      var handler, newSources;
      newSources = this.constructor.popSourceTracker();
      handler = this.sourceChangeHandler();
      this._eachSourceChangeEvent(function(e) {
        return e.removeHandler(handler);
      });
      this.sources = newSources;
      return this._eachSourceChangeEvent(function(e) {
        return e.addHandler(handler);
      });
    };

    Property.prototype._eachSourceChangeEvent = function(iterator) {
      if (this.sources == null) {
        return;
      }
      return this.sources.forEach(function(source) {
        return iterator(source.event('change'));
      });
    };

    Property.prototype.getValue = function() {
      this.registerAsMutableSource();
      if (!this.isCached()) {
        this.constructor.pushSourceTracker();
        try {
          this.value = this.valueFromAccessor();
          this.cached = true;
        } finally {
          this.updateSourcesFromTracker();
        }
      }
      return this.value;
    };

    Property.prototype.isCachable = function() {
      var cacheable;
      if (this.isFinal()) {
        return true;
      }
      cacheable = this.accessor().cache;
      if (cacheable != null) {
        return !!cacheable;
      } else {
        return true;
      }
    };

    Property.prototype.isCached = function() {
      return this.isCachable() && this.cached;
    };

    Property.prototype.isFinal = function() {
      return !!this.accessor()['final'];
    };

    Property.prototype.refresh = function() {
      var previousValue, value;
      this.cached = false;
      previousValue = this.value;
      value = this.getValue();
      if (value !== previousValue && !this.isIsolated()) {
        this.fire(value, previousValue);
      }
      if (this.value !== void 0 && this.isFinal()) {
        return this.lockValue();
      }
    };

    Property.prototype.sourceChangeHandler = function() {
      var handler,
        _this = this;
      handler = this._handleSourceChange.bind(this);
      Batman.developer["do"](function() {
        return handler.property = _this;
      });
      this.sourceChangeHandler = function() {
        return handler;
      };
      return handler;
    };

    Property.prototype._handleSourceChange = function() {
      if (this.isIsolated()) {
        return this._needsRefresh = true;
      } else if (!this.isFinal() && !this.hasObservers()) {
        return this.cached = false;
      } else {
        return this.refresh();
      }
    };

    Property.prototype.valueFromAccessor = function() {
      var _ref;
      return (_ref = this.accessor().get) != null ? _ref.call(this.base, this.key) : void 0;
    };

    Property.prototype.setValue = function(val) {
      var set;
      if (!(set = this.accessor().set)) {
        return;
      }
      return this._changeValue(function() {
        return set.call(this.base, this.key, val);
      });
    };

    Property.prototype.unsetValue = function() {
      var unset;
      if (!(unset = this.accessor().unset)) {
        return;
      }
      return this._changeValue(function() {
        return unset.call(this.base, this.key);
      });
    };

    Property.prototype._changeValue = function(block) {
      var result;
      this.cached = false;
      this.constructor.pushDummySourceTracker();
      try {
        result = block.apply(this);
        this.refresh();
      } finally {
        this.constructor.popSourceTracker();
      }
      if (!(this.isCached() || this.hasObservers())) {
        this.die();
      }
      return result;
    };

    Property.prototype.forget = function(handler) {
      if (handler != null) {
        return this.changeEvent().removeHandler(handler);
      } else {
        return this.changeEvent().clearHandlers();
      }
    };

    Property.prototype.observeAndFire = function(handler) {
      this.observe(handler);
      return handler.call(this.base, this.value, this.value, this.key);
    };

    Property.prototype.observe = function(handler) {
      this.changeEvent().addHandler(handler);
      if (this.sources == null) {
        this.getValue();
      }
      return this;
    };

    Property.prototype.observeOnce = function(originalHandler) {
      var event, handler;
      event = this.changeEvent();
      handler = function() {
        originalHandler.apply(this, arguments);
        return event.removeHandler(handler);
      };
      event.addHandler(handler);
      if (this.sources == null) {
        this.getValue();
      }
      return this;
    };

    Property.prototype._removeHandlers = function() {
      var handler;
      handler = this.sourceChangeHandler();
      this._eachSourceChangeEvent(function(e) {
        return e.removeHandler(handler);
      });
      delete this.sources;
      return this.changeEvent().clearHandlers();
    };

    Property.prototype.lockValue = function() {
      this._removeHandlers();
      this.getValue = function() {
        return this.value;
      };
      return this.setValue = this.unsetValue = this.refresh = this.observe = function() {};
    };

    Property.prototype.die = function() {
      var _ref, _ref1;
      this._removeHandlers();
      if ((_ref = this.base._batman) != null) {
        if ((_ref1 = _ref.properties) != null) {
          _ref1.unset(this.key);
        }
      }
      return this.isDead = true;
    };

    Property.prototype.fire = function() {
      var _ref;
      return (_ref = this.changeEvent()).fire.apply(_ref, __slice.call(arguments).concat([this.key]));
    };

    Property.prototype.isolate = function() {
      if (this._isolationCount === 0) {
        this._preIsolationValue = this.getValue();
      }
      return this._isolationCount++;
    };

    Property.prototype.expose = function() {
      if (this._isolationCount === 1) {
        this._isolationCount--;
        if (this._needsRefresh) {
          this.value = this._preIsolationValue;
          this.refresh();
        } else if (this.value !== this._preIsolationValue) {
          this.fire(this.value, this._preIsolationValue);
        }
        return this._preIsolationValue = null;
      } else if (this._isolationCount > 0) {
        return this._isolationCount--;
      }
    };

    Property.prototype.isIsolated = function() {
      return this._isolationCount > 0;
    };

    return Property;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.Keypath = (function(_super) {

    __extends(Keypath, _super);

    function Keypath(base, key) {
      if (typeof key === 'string') {
        this.segments = key.split('.');
        this.depth = this.segments.length;
      } else {
        this.segments = [key];
        this.depth = 1;
      }
      Keypath.__super__.constructor.apply(this, arguments);
    }

    Keypath.prototype.isCachable = function() {
      if (this.depth === 1) {
        return Keypath.__super__.isCachable.apply(this, arguments);
      } else {
        return true;
      }
    };

    Keypath.prototype.terminalProperty = function() {
      var base;
      base = Batman.getPath(this.base, this.segments.slice(0, -1));
      if (base == null) {
        return;
      }
      return Batman.Keypath.forBaseAndKey(base, this.segments[this.depth - 1]);
    };

    Keypath.prototype.valueFromAccessor = function() {
      if (this.depth === 1) {
        return Keypath.__super__.valueFromAccessor.apply(this, arguments);
      } else {
        return Batman.getPath(this.base, this.segments);
      }
    };

    Keypath.prototype.setValue = function(val) {
      var _ref;
      if (this.depth === 1) {
        return Keypath.__super__.setValue.apply(this, arguments);
      } else {
        return (_ref = this.terminalProperty()) != null ? _ref.setValue(val) : void 0;
      }
    };

    Keypath.prototype.unsetValue = function() {
      var _ref;
      if (this.depth === 1) {
        return Keypath.__super__.unsetValue.apply(this, arguments);
      } else {
        return (_ref = this.terminalProperty()) != null ? _ref.unsetValue() : void 0;
      }
    };

    return Keypath;

  })(Batman.Property);

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.Observable = {
    isObservable: true,
    hasProperty: function(key) {
      var _ref, _ref1;
      return (_ref = this._batman) != null ? (_ref1 = _ref.properties) != null ? typeof _ref1.hasKey === "function" ? _ref1.hasKey(key) : void 0 : void 0 : void 0;
    },
    property: function(key) {
      var properties, propertyClass, _base;
      Batman.initializeObject(this);
      propertyClass = this.propertyClass || Batman.Keypath;
      properties = (_base = this._batman).properties || (_base.properties = new Batman.SimpleHash);
      return properties.get(key) || properties.set(key, new propertyClass(this, key));
    },
    get: function(key) {
      return this.property(key).getValue();
    },
    set: function(key, val) {
      return this.property(key).setValue(val);
    },
    unset: function(key) {
      return this.property(key).unsetValue();
    },
    getOrSet: Batman.SimpleHash.prototype.getOrSet,
    forget: function(key, observer) {
      var _ref;
      if (key) {
        this.property(key).forget(observer);
      } else {
        if ((_ref = this._batman.properties) != null) {
          _ref.forEach(function(key, property) {
            return property.forget();
          });
        }
      }
      return this;
    },
    observe: function() {
      var args, key, _ref;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      (_ref = this.property(key)).observe.apply(_ref, args);
      return this;
    },
    observeAndFire: function() {
      var args, key, _ref;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      (_ref = this.property(key)).observeAndFire.apply(_ref, args);
      return this;
    },
    observeOnce: function() {
      var args, key, _ref;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      (_ref = this.property(key)).observeOnce.apply(_ref, args);
      return this;
    }
  };

}).call(this);

(function() {

  Batman.DOM = {
    textInputTypes: ['text', 'search', 'tel', 'url', 'email', 'password'],
    scrollIntoView: function(elementID) {
      var _ref;
      return (_ref = document.getElementById(elementID)) != null ? typeof _ref.scrollIntoView === "function" ? _ref.scrollIntoView() : void 0 : void 0;
    },
    querySelectorAll: (typeof window !== "undefined" && window !== null ? window.jQuery : void 0) != null ? function(node, selector) {
      return jQuery(selector, node);
    } : (typeof document !== "undefined" && document !== null ? document.querySelectorAll : void 0) != null ? function(node, selector) {
      return node.querySelectorAll(selector);
    } : function() {
      return Batman.developer.error("Please include either jQuery or a querySelectorAll polyfill, or set Batman.DOM.querySelectorAll to return an empty array.");
    },
    querySelector: (typeof window !== "undefined" && window !== null ? window.jQuery : void 0) != null ? function(node, selector) {
      return jQuery(selector, node)[0];
    } : (typeof document !== "undefined" && document !== null ? document.querySelector : void 0) != null ? function(node, selector) {
      return node.querySelector(selector);
    } : function() {
      return Batman.developer.error("Please include either jQuery or a querySelector polyfill, or set Batman.DOM.querySelector to an empty function.");
    },
    partial: function(container, path, context, renderer) {
      var view;
      renderer.prevent('rendered');
      view = new Batman.View({
        source: path,
        context: context
      });
      return view.on('ready', function() {
        Batman.setInnerHTML(container, '');
        Batman.appendChild(container, view.get('node'));
        return renderer.allowAndFire('rendered');
      });
    },
    propagateBindingEvent: Batman.propagateBindingEvent = function(binding, node) {
      var current, parentBinding, parentBindings, _i, _len;
      while ((current = (current || node).parentNode)) {
        parentBindings = Batman._data(current, 'bindings');
        if (parentBindings != null) {
          for (_i = 0, _len = parentBindings.length; _i < _len; _i++) {
            parentBinding = parentBindings[_i];
            if (typeof parentBinding.childBindingAdded === "function") {
              parentBinding.childBindingAdded(binding);
            }
          }
        }
      }
    },
    propagateBindingEvents: Batman.propagateBindingEvents = function(newNode) {
      var binding, bindings, child, _i, _j, _len, _len1, _ref;
      _ref = newNode.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        Batman.propagateBindingEvents(child);
      }
      if (bindings = Batman._data(newNode, 'bindings')) {
        for (_j = 0, _len1 = bindings.length; _j < _len1; _j++) {
          binding = bindings[_j];
          Batman.propagateBindingEvent(binding, newNode);
        }
      }
    },
    trackBinding: Batman.trackBinding = function(binding, node) {
      var bindings;
      if (bindings = Batman._data(node, 'bindings')) {
        bindings.push(binding);
      } else {
        Batman._data(node, 'bindings', [binding]);
      }
      Batman.DOM.fire('bindingAdded', binding);
      Batman.propagateBindingEvent(binding, node);
      return true;
    },
    onParseExit: Batman.onParseExit = function(node, callback) {
      var set;
      set = Batman._data(node, 'onParseExit') || Batman._data(node, 'onParseExit', new Batman.SimpleSet);
      if (callback != null) {
        set.add(callback);
      }
      return set;
    },
    forgetParseExit: Batman.forgetParseExit = function(node, callback) {
      return Batman.removeData(node, 'onParseExit', true);
    },
    defineView: function(name, node) {
      var contents;
      contents = node.innerHTML;
      Batman.View.store.set(Batman.Navigator.normalizePath(name), contents);
      return contents;
    },
    setInnerHTML: Batman.setInnerHTML = function(node, html) {
      var child, childNodes, result, _i, _j, _len, _len1;
      childNodes = (function() {
        var _i, _len, _ref, _results;
        _ref = node.childNodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child);
        }
        return _results;
      })();
      for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
        child = childNodes[_i];
        Batman.DOM.willRemoveNode(child);
      }
      result = node.innerHTML = html;
      for (_j = 0, _len1 = childNodes.length; _j < _len1; _j++) {
        child = childNodes[_j];
        Batman.DOM.didRemoveNode(child);
      }
      return result;
    },
    setStyleProperty: Batman.setStyleProperty = function(node, property, value, importance) {
      if (node.style.setAttribute) {
        return node.style.setAttribute(property, value, importance);
      } else {
        return node.style.setProperty(property, value, importance);
      }
    },
    removeNode: Batman.removeNode = function(node) {
      var _ref;
      Batman.DOM.willRemoveNode(node);
      if ((_ref = node.parentNode) != null) {
        _ref.removeChild(node);
      }
      return Batman.DOM.didRemoveNode(node);
    },
    destroyNode: Batman.destroyNode = function(node) {
      Batman.DOM.willDestroyNode(node);
      Batman.removeNode(node);
      return Batman.DOM.didDestroyNode(node);
    },
    appendChild: Batman.appendChild = function(parent, child) {
      Batman.DOM.willInsertNode(child);
      parent.appendChild(child);
      return Batman.DOM.didInsertNode(child);
    },
    removeOrDestroyNode: Batman.removeOrDestroyNode = function(node) {
      var view;
      view = Batman._data(node, 'view');
      view || (view = Batman._data(node, 'yielder'));
      if ((view != null) && view.get('cached')) {
        return Batman.DOM.removeNode(node);
      } else {
        return Batman.DOM.destroyNode(node);
      }
    },
    insertBefore: Batman.insertBefore = function(parentNode, newNode, referenceNode) {
      if (referenceNode == null) {
        referenceNode = null;
      }
      if (!referenceNode || parentNode.childNodes.length <= 0) {
        return Batman.appendChild(parentNode, newNode);
      } else {
        Batman.DOM.willInsertNode(newNode);
        parentNode.insertBefore(newNode, referenceNode);
        return Batman.DOM.didInsertNode(newNode);
      }
    },
    valueForNode: function(node, value, escapeValue) {
      var isSetting;
      if (value == null) {
        value = '';
      }
      if (escapeValue == null) {
        escapeValue = true;
      }
      isSetting = arguments.length > 1;
      switch (node.nodeName.toUpperCase()) {
        case 'INPUT':
        case 'TEXTAREA':
          if (isSetting) {
            return node.value = value;
          } else {
            return node.value;
          }
          break;
        case 'SELECT':
          if (isSetting) {
            return node.value = value;
          }
          break;
        default:
          if (isSetting) {
            return Batman.setInnerHTML(node, escapeValue ? Batman.escapeHTML(value) : value);
          } else {
            return node.innerHTML;
          }
      }
    },
    nodeIsEditable: function(node) {
      var _ref;
      return (_ref = node.nodeName.toUpperCase()) === 'INPUT' || _ref === 'TEXTAREA' || _ref === 'SELECT';
    },
    addEventListener: Batman.addEventListener = function(node, eventName, callback) {
      var listeners;
      if (!(listeners = Batman._data(node, 'listeners'))) {
        listeners = Batman._data(node, 'listeners', {});
      }
      if (!listeners[eventName]) {
        listeners[eventName] = [];
      }
      listeners[eventName].push(callback);
      if (Batman.hasAddEventListener) {
        return node.addEventListener(eventName, callback, false);
      } else {
        return node.attachEvent("on" + eventName, callback);
      }
    },
    removeEventListener: Batman.removeEventListener = function(node, eventName, callback) {
      var eventListeners, index, listeners;
      if (listeners = Batman._data(node, 'listeners')) {
        if (eventListeners = listeners[eventName]) {
          index = eventListeners.indexOf(callback);
          if (index !== -1) {
            eventListeners.splice(index, 1);
          }
        }
      }
      if (Batman.hasAddEventListener) {
        return node.removeEventListener(eventName, callback, false);
      } else {
        return node.detachEvent('on' + eventName, callback);
      }
    },
    hasAddEventListener: Batman.hasAddEventListener = !!(typeof window !== "undefined" && window !== null ? window.addEventListener : void 0),
    preventDefault: Batman.preventDefault = function(e) {
      if (typeof e.preventDefault === "function") {
        return e.preventDefault();
      } else {
        return e.returnValue = false;
      }
    },
    stopPropagation: Batman.stopPropagation = function(e) {
      if (e.stopPropagation) {
        return e.stopPropagation();
      } else {
        return e.cancelBubble = true;
      }
    },
    willInsertNode: function(node) {
      var child, view, _i, _len, _ref, _ref1;
      view = Batman._data(node, 'view');
      if (view != null) {
        view.fire('beforeAppear', node);
      }
      if ((_ref = Batman.data(node, 'show')) != null) {
        _ref.call(node);
      }
      _ref1 = node.childNodes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        Batman.DOM.willInsertNode(child);
      }
      return true;
    },
    didInsertNode: function(node) {
      var child, view, _i, _len, _ref;
      view = Batman._data(node, 'view');
      if (view) {
        view.fire('appear', node);
        view.applyYields();
      }
      _ref = node.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        Batman.DOM.didInsertNode(child);
      }
      return true;
    },
    willRemoveNode: function(node) {
      var child, view, _i, _len, _ref, _ref1;
      view = Batman._data(node, 'view');
      if (view) {
        view.fire('beforeDisappear', node);
      }
      if ((_ref = Batman.data(node, 'hide')) != null) {
        _ref.call(node);
      }
      _ref1 = node.childNodes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        Batman.DOM.willRemoveNode(child);
      }
      return true;
    },
    didRemoveNode: function(node) {
      var child, view, _i, _len, _ref;
      view = Batman._data(node, 'view');
      if (view) {
        view.retractYields();
        view.fire('disappear', node);
      }
      _ref = node.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        Batman.DOM.didRemoveNode(child);
      }
      return true;
    },
    willDestroyNode: function(node) {
      var child, view, _i, _len, _ref;
      view = Batman._data(node, 'view');
      if (view) {
        view.fire('beforeDestroy', node);
        view.get('yields').forEach(function(name, actions) {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = actions.length; _i < _len; _i++) {
            node = actions[_i].node;
            _results.push(Batman.DOM.willDestroyNode(node));
          }
          return _results;
        });
      }
      _ref = node.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        Batman.DOM.willDestroyNode(child);
      }
      return true;
    },
    didDestroyNode: function(node) {
      var bindings, child, eventListeners, eventName, listeners, view, _i, _len, _ref;
      view = Batman._data(node, 'view');
      if (view) {
        view.fire('destroy', node);
        view.get('yields').forEach(function(name, actions) {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = actions.length; _i < _len; _i++) {
            node = actions[_i].node;
            _results.push(Batman.DOM.didDestroyNode(node));
          }
          return _results;
        });
      }
      if (bindings = Batman._data(node, 'bindings')) {
        bindings.forEach(function(binding) {
          return binding.die();
        });
      }
      if (listeners = Batman._data(node, 'listeners')) {
        for (eventName in listeners) {
          eventListeners = listeners[eventName];
          eventListeners.forEach(function(listener) {
            return Batman.removeEventListener(node, eventName, listener);
          });
        }
      }
      Batman.removeData(node);
      Batman.removeData(node, void 0, true);
      _ref = node.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        Batman.DOM.didDestroyNode(child);
      }
      return true;
    }
  };

  Batman.mixin(Batman.DOM, Batman.EventEmitter, Batman.Observable);

  Batman.DOM.event('bindingAdded');

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.DOM.readers = {
    target: function(node, key, context, renderer) {
      Batman.DOM.readers.bind(node, key, context, renderer, 'nodeChange');
      return true;
    },
    source: function(node, key, context, renderer) {
      Batman.DOM.readers.bind(node, key, context, renderer, 'dataChange');
      return true;
    },
    bind: function(node, key, context, renderer, only) {
      var bindingClass;
      bindingClass = false;
      switch (node.nodeName.toLowerCase()) {
        case 'input':
          switch (node.getAttribute('type')) {
            case 'checkbox':
              Batman.DOM.attrReaders.bind(node, 'checked', key, context, renderer, only);
              return true;
            case 'radio':
              bindingClass = Batman.DOM.RadioBinding;
              break;
            case 'file':
              bindingClass = Batman.DOM.FileBinding;
          }
          break;
        case 'select':
          bindingClass = Batman.DOM.SelectBinding;
      }
      bindingClass || (bindingClass = Batman.DOM.Binding);
      (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(bindingClass, arguments, function(){});
      return true;
    },
    context: function(node, key, context, renderer) {
      return context.descendWithKey(key);
    },
    mixin: function(node, key, context, renderer) {
      new Batman.DOM.MixinBinding(node, key, context.descend(Batman.mixins), renderer);
      return true;
    },
    showif: function(node, key, context, parentRenderer, invert) {
      new Batman.DOM.ShowHideBinding(node, key, context, parentRenderer, false, invert);
      return true;
    },
    hideif: function() {
      var _ref;
      return (_ref = Batman.DOM.readers).showif.apply(_ref, __slice.call(arguments).concat([true]));
    },
    insertif: function(node, key, context, parentRenderer, invert) {
      new Batman.DOM.InsertionBinding(node, key, context, parentRenderer, false, invert);
      return true;
    },
    removeif: function() {
      var _ref;
      return (_ref = Batman.DOM.readers).insertif.apply(_ref, __slice.call(arguments).concat([true]));
    },
    route: function() {
      (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(Batman.DOM.RouteBinding, arguments, function(){});
      return true;
    },
    view: function() {
      (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(Batman.DOM.ViewBinding, arguments, function(){});
      return false;
    },
    partial: function(node, path, context, renderer) {
      Batman.DOM.partial(node, path, context, renderer);
      return true;
    },
    defineview: function(node, name, context, renderer) {
      Batman.onParseExit(node, function() {
        var _ref;
        return (_ref = node.parentNode) != null ? _ref.removeChild(node) : void 0;
      });
      Batman.DOM.defineView(name, node);
      return false;
    },
    renderif: function(node, key, context, renderer) {
      new Batman.DOM.DeferredRenderingBinding(node, key, context, renderer);
      return false;
    },
    "yield": function(node, key) {
      Batman.onParseExit(node, function() {
        return Batman.DOM.Yield.withName(key).set('containerNode', node);
      });
      return true;
    },
    contentfor: function(node, key, context, renderer, action) {
      if (action == null) {
        action = 'append';
      }
      Batman.onParseExit(node, function() {
        var _ref;
        if ((_ref = node.parentNode) != null) {
          _ref.removeChild(node);
        }
        return renderer.view.pushYieldAction(key, action, node);
      });
      return true;
    },
    replace: function(node, key, context, renderer) {
      Batman.DOM.readers.contentfor(node, key, context, renderer, 'replace');
      return true;
    }
  };

}).call(this);

(function() {
  var __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Batman.DOM.events = {
    click: function(node, callback, context, eventName) {
      if (eventName == null) {
        eventName = 'click';
      }
      Batman.addEventListener(node, eventName, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        callback.apply(null, [node].concat(__slice.call(args), [context]));
        return Batman.preventDefault(args[0]);
      });
      if (node.nodeName.toUpperCase() === 'A' && !node.href) {
        node.href = '#';
      }
      return node;
    },
    doubleclick: function(node, callback, context) {
      return Batman.DOM.events.click(node, callback, context, 'dblclick');
    },
    change: function(node, callback, context) {
      var eventName, eventNames, oldCallback, _i, _len, _results;
      eventNames = (function() {
        var _ref;
        switch (node.nodeName.toUpperCase()) {
          case 'TEXTAREA':
            return ['input', 'keyup', 'change'];
          case 'INPUT':
            if (_ref = node.type.toLowerCase(), __indexOf.call(Batman.DOM.textInputTypes, _ref) >= 0) {
              oldCallback = callback;
              callback = function(node, event) {
                if (event.type === 'keyup' && Batman.DOM.events.isEnter(event)) {
                  return;
                }
                return oldCallback.apply(null, arguments);
              };
              return ['input', 'keyup', 'change'];
            } else {
              return ['input', 'change'];
            }
            break;
          default:
            return ['change'];
        }
      })();
      _results = [];
      for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
        eventName = eventNames[_i];
        _results.push(Batman.addEventListener(node, eventName, function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return callback.apply(null, [node].concat(__slice.call(args), [context]));
        }));
      }
      return _results;
    },
    isEnter: function(ev) {
      var _ref, _ref1;
      return ((13 <= (_ref = ev.keyCode) && _ref <= 14)) || ((13 <= (_ref1 = ev.which) && _ref1 <= 14)) || ev.keyIdentifier === 'Enter' || ev.key === 'Enter';
    },
    submit: function(node, callback, context) {
      if (Batman.DOM.nodeIsEditable(node)) {
        Batman.addEventListener(node, 'keydown', function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (Batman.DOM.events.isEnter(args[0])) {
            return Batman.DOM._keyCapturingNode = node;
          }
        });
        Batman.addEventListener(node, 'keyup', function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (Batman.DOM.events.isEnter(args[0])) {
            if (Batman.DOM._keyCapturingNode === node) {
              Batman.preventDefault(args[0]);
              callback.apply(null, [node].concat(__slice.call(args), [context]));
            }
            return Batman.DOM._keyCapturingNode = null;
          }
        });
      } else {
        Batman.addEventListener(node, 'submit', function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          Batman.preventDefault(args[0]);
          return callback.apply(null, [node].concat(__slice.call(args), [context]));
        });
      }
      return node;
    },
    other: function(node, eventName, callback, context) {
      return Batman.addEventListener(node, eventName, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return callback.apply(null, [node].concat(__slice.call(args), [context]));
      });
    }
  };

}).call(this);

(function() {

  Batman.DOM.attrReaders = {
    _parseAttribute: function(value) {
      if (value === 'false') {
        value = false;
      }
      if (value === 'true') {
        value = true;
      }
      return value;
    },
    source: function(node, attr, key, context, renderer) {
      return Batman.DOM.attrReaders.bind(node, attr, key, context, renderer, 'dataChange');
    },
    bind: function(node, attr, key, context, renderer, only) {
      var bindingClass;
      bindingClass = (function() {
        switch (attr) {
          case 'checked':
          case 'disabled':
          case 'selected':
            return Batman.DOM.CheckedBinding;
          case 'value':
          case 'href':
          case 'src':
          case 'size':
            return Batman.DOM.NodeAttributeBinding;
          case 'class':
            return Batman.DOM.ClassBinding;
          case 'style':
            return Batman.DOM.StyleBinding;
          default:
            return Batman.DOM.AttributeBinding;
        }
      })();
      (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(bindingClass, arguments, function(){});
      return true;
    },
    context: function(node, contextName, key, context) {
      return context.descendWithKey(key, contextName);
    },
    event: function(node, eventName, key, context) {
      (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(Batman.DOM.EventBinding, arguments, function(){});
      return true;
    },
    addclass: function(node, className, key, context, parentRenderer, invert) {
      new Batman.DOM.AddClassBinding(node, className, key, context, parentRenderer, false, invert);
      return true;
    },
    removeclass: function(node, className, key, context, parentRenderer) {
      return Batman.DOM.attrReaders.addclass(node, className, key, context, parentRenderer, true);
    },
    foreach: function(node, iteratorName, key, context, parentRenderer) {
      (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(Batman.DOM.IteratorBinding, arguments, function(){});
      return false;
    },
    formfor: function(node, localName, key, context) {
      (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(Batman.DOM.FormBinding, arguments, function(){});
      return context.descendWithKey(key, localName);
    }
  };

}).call(this);

(function() {
  var BatmanObject,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  BatmanObject = (function(_super) {
    var counter, getAccessorObject, promiseWrapper, wrapSingleAccessor;

    __extends(BatmanObject, _super);

    Batman.initializeObject(BatmanObject);

    Batman.initializeObject(BatmanObject.prototype);

    BatmanObject.classMixin = function() {
      return Batman.mixin.apply(Batman, [this].concat(__slice.call(arguments)));
    };

    BatmanObject.mixin = function() {
      return this.classMixin.apply(this.prototype, arguments);
    };

    BatmanObject.prototype.mixin = BatmanObject.classMixin;

    counter = 0;

    BatmanObject.prototype._batmanID = function() {
      var c;
      this._batmanID = function() {
        return c;
      };
      return c = counter++;
    };

    BatmanObject.prototype.hashKey = function() {
      var key;
      if (typeof this.isEqual === 'function') {
        return;
      }
      this.hashKey = function() {
        return key;
      };
      return key = "<Batman.Object " + (this._batmanID()) + ">";
    };

    BatmanObject.prototype.toJSON = function() {
      var key, obj, value;
      obj = {};
      for (key in this) {
        if (!__hasProp.call(this, key)) continue;
        value = this[key];
        if (key !== "_batman" && key !== "hashKey" && key !== "_batmanID") {
          obj[key] = (value != null ? value.toJSON : void 0) ? value.toJSON() : value;
        }
      }
      return obj;
    };

    getAccessorObject = function(base, accessor) {
      var deprecated, _i, _len, _ref;
      if (typeof accessor === 'function') {
        accessor = {
          get: accessor
        };
      }
      _ref = ['cachable', 'cacheable'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        deprecated = _ref[_i];
        if (deprecated in accessor) {
          Batman.developer.warn("Property accessor option \"" + deprecated + "\" is deprecated. Use \"cache\" instead.");
          if (!('cache' in accessor)) {
            accessor.cache = accessor[deprecated];
          }
        }
      }
      return accessor;
    };

    promiseWrapper = function(fetcher) {
      return function(core) {
        return {
          get: function(key) {
            var deliver, returned, val,
              _this = this;
            val = core.get.apply(this, arguments);
            if (typeof val !== 'undefined') {
              return val;
            }
            returned = false;
            deliver = function(err, result) {
              if (returned) {
                _this.set(key, result);
              }
              return val = result;
            };
            fetcher.call(this, deliver, key);
            returned = true;
            return val;
          },
          cache: true
        };
      };
    };

    wrapSingleAccessor = function(core, wrapper) {
      var k, v;
      wrapper = (typeof wrapper === "function" ? wrapper(core) : void 0) || wrapper;
      for (k in core) {
        v = core[k];
        if (!(k in wrapper)) {
          wrapper[k] = v;
        }
      }
      return wrapper;
    };

    BatmanObject._defineAccessor = function() {
      var accessor, key, keys, _base, _i, _j, _len, _ref, _results;
      keys = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), accessor = arguments[_i++];
      if (!(accessor != null)) {
        return Batman.Property.defaultAccessorForBase(this);
      } else if (keys.length === 0 && ((_ref = Batman.typeOf(accessor)) !== 'Object' && _ref !== 'Function')) {
        return Batman.Property.accessorForBaseAndKey(this, accessor);
      } else if (typeof accessor.promise === 'function') {
        return this._defineWrapAccessor.apply(this, __slice.call(keys).concat([promiseWrapper(accessor.promise)]));
      }
      Batman.initializeObject(this);
      if (keys.length === 0) {
        return this._batman.defaultAccessor = getAccessorObject(this, accessor);
      } else {
        (_base = this._batman).keyAccessors || (_base.keyAccessors = new Batman.SimpleHash);
        _results = [];
        for (_j = 0, _len = keys.length; _j < _len; _j++) {
          key = keys[_j];
          _results.push(this._batman.keyAccessors.set(key, getAccessorObject(this, accessor)));
        }
        return _results;
      }
    };

    BatmanObject.prototype._defineAccessor = BatmanObject._defineAccessor;

    BatmanObject._defineWrapAccessor = function() {
      var key, keys, wrapper, _i, _j, _len, _results;
      keys = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), wrapper = arguments[_i++];
      Batman.initializeObject(this);
      if (keys.length === 0) {
        return this._defineAccessor(wrapSingleAccessor(this._defineAccessor(), wrapper));
      } else {
        _results = [];
        for (_j = 0, _len = keys.length; _j < _len; _j++) {
          key = keys[_j];
          _results.push(this._defineAccessor(key, wrapSingleAccessor(this._defineAccessor(key), wrapper)));
        }
        return _results;
      }
    };

    BatmanObject.prototype._defineWrapAccessor = BatmanObject._defineWrapAccessor;

    BatmanObject.classAccessor = BatmanObject._defineAccessor;

    BatmanObject.accessor = function() {
      var _ref;
      return (_ref = this.prototype)._defineAccessor.apply(_ref, arguments);
    };

    BatmanObject.prototype.accessor = BatmanObject._defineAccessor;

    BatmanObject.wrapClassAccessor = BatmanObject._defineWrapAccessor;

    BatmanObject.wrapAccessor = function() {
      var _ref;
      return (_ref = this.prototype)._defineWrapAccessor.apply(_ref, arguments);
    };

    BatmanObject.prototype.wrapAccessor = BatmanObject._defineWrapAccessor;

    function BatmanObject() {
      var mixins;
      mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this._batman = new Batman._Batman(this);
      this.mixin.apply(this, mixins);
    }

    BatmanObject.classMixin(Batman.EventEmitter, Batman.Observable);

    BatmanObject.mixin(Batman.EventEmitter, Batman.Observable);

    BatmanObject.observeAll = function() {
      return this.prototype.observe.apply(this.prototype, arguments);
    };

    BatmanObject.singleton = function(singletonMethodName) {
      if (singletonMethodName == null) {
        singletonMethodName = "sharedInstance";
      }
      return this.classAccessor(singletonMethodName, {
        get: function() {
          var _name;
          return this[_name = "_" + singletonMethodName] || (this[_name] = new this);
        }
      });
    };

    BatmanObject.accessor('_batmanID', function() {
      return this._batmanID();
    });

    return BatmanObject;

  })(Object);

  Batman.Object = BatmanObject;

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.Renderer = (function(_super) {
    var bindingRegexp, bindingSortOrder, bindingSortPositions, k, name, pos, _i, _j, _len, _len1, _ref;

    __extends(Renderer, _super);

    Renderer.prototype.deferEvery = 50;

    function Renderer(node, context, view) {
      this.node = node;
      this.context = context;
      this.view = view;
      this.resume = __bind(this.resume, this);

      this.start = __bind(this.start, this);

      Renderer.__super__.constructor.call(this);
      if (!(this.context instanceof Batman.RenderContext)) {
        Batman.developer.error("Must pass a RenderContext to a renderer for rendering");
      }
      this.immediate = Batman.setImmediate(this.start);
    }

    Renderer.prototype.start = function() {
      this.startTime = new Date;
      return this.parseNode(this.node);
    };

    Renderer.prototype.resume = function() {
      this.startTime = new Date;
      return this.parseNode(this.resumeNode);
    };

    Renderer.prototype.finish = function() {
      this.startTime = null;
      this.prevent('stopped');
      this.fire('parsed');
      return this.fire('rendered');
    };

    Renderer.prototype.stop = function() {
      Batman.clearImmediate(this.immediate);
      return this.fire('stopped');
    };

    _ref = ['parsed', 'rendered', 'stopped'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      Renderer.prototype.event(k).oneShot = true;
    }

    bindingRegexp = /^data\-(.*)/;

    bindingSortOrder = ["view", "renderif", "foreach", "formfor", "context", "bind", "source", "target"];

    bindingSortPositions = {};

    for (pos = _j = 0, _len1 = bindingSortOrder.length; _j < _len1; pos = ++_j) {
      name = bindingSortOrder[pos];
      bindingSortPositions[name] = pos;
    }

    Renderer.prototype._sortBindings = function(a, b) {
      var aindex, bindex;
      aindex = bindingSortPositions[a[0]];
      bindex = bindingSortPositions[b[0]];
      if (aindex == null) {
        aindex = bindingSortOrder.length;
      }
      if (bindex == null) {
        bindex = bindingSortOrder.length;
      }
      if (aindex > bindex) {
        return 1;
      } else if (bindex > aindex) {
        return -1;
      } else if (a[0] > b[0]) {
        return 1;
      } else if (b[0] > a[0]) {
        return -1;
      } else {
        return 0;
      }
    };

    Renderer.prototype.parseNode = function(node) {
      var argument, attribute, bindings, keypath, names, nextNode, oldContext, result, skipChildren, _base, _base1, _k, _l, _len2, _len3, _ref1, _ref2, _ref3, _ref4,
        _this = this;
      if (this.deferEvery && (new Date - this.startTime) > this.deferEvery) {
        this.resumeNode = node;
        this.timeout = Batman.setImmediate(this.resume);
        return;
      }
      if (node.getAttribute && node.attributes) {
        bindings = [];
        _ref1 = node.attributes;
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          attribute = _ref1[_k];
          name = (_ref2 = attribute.nodeName.match(bindingRegexp)) != null ? _ref2[1] : void 0;
          if (!name) {
            continue;
          }
          bindings.push((names = name.split('-')).length > 1 ? [names[0], names.slice(1, names.length + 1 || 9e9).join('-'), attribute.value] : [name, void 0, attribute.value]);
        }
        _ref3 = bindings.sort(this._sortBindings);
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          _ref4 = _ref3[_l], name = _ref4[0], argument = _ref4[1], keypath = _ref4[2];
          result = argument ? typeof (_base = Batman.DOM.attrReaders)[name] === "function" ? _base[name](node, argument, keypath, this.context, this) : void 0 : typeof (_base1 = Batman.DOM.readers)[name] === "function" ? _base1[name](node, keypath, this.context, this) : void 0;
          if (result === false) {
            skipChildren = true;
            break;
          } else if (result instanceof Batman.RenderContext) {
            oldContext = this.context;
            this.context = result;
            Batman.onParseExit(node, function() {
              return _this.context = oldContext;
            });
          }
        }
      }
      if ((nextNode = this.nextNode(node, skipChildren))) {
        return this.parseNode(nextNode);
      } else {
        return this.finish();
      }
    };

    Renderer.prototype.nextNode = function(node, skipChildren) {
      var children, nextParent, parentSibling, sibling, _ref1, _ref2;
      if (!skipChildren) {
        children = node.childNodes;
        if (children != null ? children.length : void 0) {
          return children[0];
        }
      }
      sibling = node.nextSibling;
      if ((_ref1 = Batman.onParseExit(node)) != null) {
        _ref1.forEach(function(callback) {
          return callback();
        });
      }
      Batman.forgetParseExit(node);
      if (this.node === node) {
        return;
      }
      if (sibling) {
        return sibling;
      }
      nextParent = node;
      while (nextParent = nextParent.parentNode) {
        parentSibling = nextParent.nextSibling;
        if ((_ref2 = Batman.onParseExit(nextParent)) != null) {
          _ref2.forEach(function(callback) {
            return callback();
          });
        }
        Batman.forgetParseExit(nextParent);
        if (this.node === nextParent) {
          return;
        }
        if (parentSibling) {
          return parentSibling;
        }
      }
    };

    return Renderer;

  })(Batman.Object);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.AbstractBinding = (function(_super) {
    var get_dot_rx, get_rx, keypath_rx;

    __extends(AbstractBinding, _super);

    keypath_rx = /(^|,)\s*(?:(true|false)|("[^"]*")|(\{[^\}]*\})|([a-zA-Z][\w\-\.]*[\?\!]?))\s*(?=$|,)/g;

    get_dot_rx = /(?:\]\.)(.+?)(?=[\[\.]|\s*\||$)/;

    get_rx = /(?!^\s*)\[(.*?)\]/g;

    AbstractBinding.accessor('filteredValue', {
      get: function() {
        var renderContext, result, self, unfilteredValue;
        unfilteredValue = this.get('unfilteredValue');
        self = this;
        renderContext = this.get('renderContext');
        if (this.filterFunctions.length > 0) {
          Batman.developer.currentFilterStack = renderContext;
          result = this.filterFunctions.reduce(function(value, fn, i) {
            var args;
            args = self.filterArguments[i].map(function(argument) {
              if (argument._keypath) {
                return self.renderContext.get(argument._keypath);
              } else {
                return argument;
              }
            });
            args.unshift(value);
            while (args.length < (fn.length - 1)) {
              args.push(void 0);
            }
            args.push(self);
            return fn.apply(renderContext, args);
          }, unfilteredValue);
          Batman.developer.currentFilterStack = null;
          return result;
        } else {
          return unfilteredValue;
        }
      },
      set: function(_, newValue) {
        return this.set('unfilteredValue', newValue);
      }
    });

    AbstractBinding.accessor('unfilteredValue', {
      get: function() {
        var k;
        if (k = this.get('key')) {
          return Batman.RenderContext.deProxy(Batman.getPath(this, ['keyContext', k]));
        } else {
          return this.get('value');
        }
      },
      set: function(_, value) {
        var k, keyContext, prop;
        if (k = this.get('key')) {
          keyContext = this.get('keyContext');
          if (keyContext && keyContext !== Batman.container) {
            prop = Batman.Property.forBaseAndKey(keyContext, k);
            return prop.setValue(value);
          }
        } else {
          return this.set('value', value);
        }
      }
    });

    AbstractBinding.accessor('keyContext', function() {
      return this.renderContext.contextForKey(this.key);
    });

    AbstractBinding.prototype.bindImmediately = true;

    AbstractBinding.prototype.shouldSet = true;

    AbstractBinding.prototype.isInputBinding = false;

    AbstractBinding.prototype.escapeValue = true;

    function AbstractBinding(node, keyPath, renderContext, renderer, only) {
      this.node = node;
      this.keyPath = keyPath;
      this.renderContext = renderContext;
      this.renderer = renderer;
      this.only = only != null ? only : false;
      this._fireDataChange = __bind(this._fireDataChange, this);

      this._fireNodeChange = __bind(this._fireNodeChange, this);

      this.parseFilter();
      if (this.bindImmediately) {
        this.bind();
      }
    }

    AbstractBinding.prototype.isTwoWay = function() {
      return (this.key != null) && this.filterFunctions.length === 0;
    };

    AbstractBinding.prototype.bind = function() {
      var _ref, _ref1;
      if ((this.node != null) && ((_ref = this.only) === false || _ref === 'nodeChange') && Batman.DOM.nodeIsEditable(this.node)) {
        Batman.DOM.events.change(this.node, this._fireNodeChange);
        if (this.only === 'nodeChange') {
          this._fireNodeChange();
        }
      }
      if ((_ref1 = this.only) === false || _ref1 === 'dataChange') {
        this.observeAndFire('filteredValue', this._fireDataChange);
      }
      if (this.node != null) {
        return Batman.DOM.trackBinding(this, this.node);
      }
    };

    AbstractBinding.prototype._fireNodeChange = function(event) {
      var val;
      this.shouldSet = false;
      val = this.value || this.get('keyContext');
      if (typeof this.nodeChange === "function") {
        this.nodeChange(this.node, val, event);
      }
      this.fire('nodeChange', this.node, val);
      return this.shouldSet = true;
    };

    AbstractBinding.prototype._fireDataChange = function(value) {
      if (this.shouldSet) {
        if (typeof this.dataChange === "function") {
          this.dataChange(value, this.node);
        }
        return this.fire('dataChange', value, this.node);
      }
    };

    AbstractBinding.prototype.die = function() {
      var _ref;
      this.forget();
      if ((_ref = this._batman.properties) != null) {
        _ref.forEach(function(key, property) {
          return property.die();
        });
      }
      this.fire('die');
      this.dead = true;
      return true;
    };

    AbstractBinding.prototype.parseFilter = function() {
      var args, filter, filterName, filterString, filters, key, keyPath, orig, split;
      this.filterFunctions = [];
      this.filterArguments = [];
      keyPath = this.keyPath;
      while (get_dot_rx.test(keyPath)) {
        keyPath = keyPath.replace(get_dot_rx, "]['$1']");
      }
      filters = keyPath.replace(get_rx, " | get $1 ").replace(/'/g, '"').split(/(?!")\s+\|\s+(?!")/);
      try {
        key = this.parseSegment(orig = filters.shift())[0];
      } catch (e) {
        Batman.developer.warn(e);
        Batman.developer.error("Error! Couldn't parse keypath in \"" + orig + "\". Parsing error above.");
      }
      if (key && key._keypath) {
        this.key = key._keypath;
      } else {
        this.value = key;
      }
      if (filters.length) {
        while (filterString = filters.shift()) {
          split = filterString.indexOf(' ');
          if (split === -1) {
            split = filterString.length;
          }
          filterName = filterString.substr(0, split);
          args = filterString.substr(split);
          if (!(filter = Batman.Filters[filterName])) {
            return Batman.developer.error("Unrecognized filter '" + filterName + "' in key \"" + this.keyPath + "\"!");
          }
          this.filterFunctions.push(filter);
          try {
            this.filterArguments.push(this.parseSegment(args));
          } catch (e) {
            Batman.developer.error("Bad filter arguments \"" + args + "\"!");
          }
        }
        return true;
      }
    };

    AbstractBinding.prototype.parseSegment = function(segment) {
      segment = segment.replace(keypath_rx, function(match, start, bool, string, object, keypath, offset) {
        var replacement;
        if (start == null) {
          start = '';
        }
        replacement = keypath ? '{"_keypath": "' + keypath + '"}' : bool || string || object;
        return start + replacement;
      });
      return JSON.parse("[" + segment + "]");
    };

    return AbstractBinding;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.ViewBinding = (function(_super) {

    __extends(ViewBinding, _super);

    function ViewBinding() {
      ViewBinding.__super__.constructor.apply(this, arguments);
      this.renderer.prevent('rendered');
      this.node.removeAttribute('data-view');
    }

    ViewBinding.prototype.dataChange = function(viewClassOrInstance) {
      var _this = this;
      if (viewClassOrInstance == null) {
        return;
      }
      if (viewClassOrInstance.isView) {
        this.view = viewClassOrInstance;
        this.view.set('context', this.renderContext);
        this.view.set('node', this.node);
      } else {
        this.view = new viewClassOrInstance({
          node: this.node,
          context: this.renderContext,
          parentView: this.renderer.view
        });
      }
      this.view.on('ready', function() {
        return _this.renderer.allowAndFire('rendered');
      });
      return this.die();
    };

    return ViewBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.ViewArgumentBinding = (function(_super) {

    __extends(ViewArgumentBinding, _super);

    function ViewArgumentBinding() {
      return ViewArgumentBinding.__super__.constructor.apply(this, arguments);
    }

    return ViewArgumentBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.ShowHideBinding = (function(_super) {

    __extends(ShowHideBinding, _super);

    function ShowHideBinding(node, className, key, context, parentRenderer, invert) {
      var display;
      this.invert = invert != null ? invert : false;
      display = node.style.display;
      if (!display || display === 'none') {
        display = '';
      }
      this.originalDisplay = display;
      ShowHideBinding.__super__.constructor.apply(this, arguments);
    }

    ShowHideBinding.prototype.dataChange = function(value) {
      var hide, view, _ref;
      view = Batman._data(this.node, 'view');
      if (!!value === !this.invert) {
        if (view != null) {
          view.fire('beforeAppear', this.node);
        }
        if ((_ref = Batman.data(this.node, 'show')) != null) {
          _ref.call(this.node);
        }
        this.node.style.display = this.originalDisplay;
        return view != null ? view.fire('appear', this.node) : void 0;
      } else {
        if (view != null) {
          view.fire('beforeDisappear', this.node);
        }
        if (typeof (hide = Batman.data(this.node, 'hide')) === 'function') {
          hide.call(this.node);
        } else {
          Batman.setStyleProperty(this.node, 'display', 'none', 'important');
        }
        return view != null ? view.fire('disappear', this.node) : void 0;
      }
    };

    return ShowHideBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.SelectBinding = (function(_super) {

    __extends(SelectBinding, _super);

    SelectBinding.prototype.isInputBinding = true;

    SelectBinding.prototype.firstBind = true;

    function SelectBinding() {
      this.updateOptionBindings = __bind(this.updateOptionBindings, this);

      this.nodeChange = __bind(this.nodeChange, this);

      this.dataChange = __bind(this.dataChange, this);

      this.childBindingAdded = __bind(this.childBindingAdded, this);
      this.selectedBindings = new Batman.SimpleSet;
      SelectBinding.__super__.constructor.apply(this, arguments);
    }

    SelectBinding.prototype.childBindingAdded = function(binding) {
      var dataChangeHandler,
        _this = this;
      if (binding instanceof Batman.DOM.CheckedBinding) {
        binding.on('dataChange', dataChangeHandler = function() {
          return _this.nodeChange();
        });
        binding.on('die', function() {
          binding.forget('dataChange', dataChangeHandler);
          return _this.selectedBindings.remove(binding);
        });
        this.selectedBindings.add(binding);
      } else if (binding instanceof Batman.DOM.IteratorBinding) {
        binding.on('nodeAdded', dataChangeHandler = function() {
          return _this._fireDataChange(_this.get('filteredValue'));
        });
        binding.on('nodeRemoved', dataChangeHandler);
        binding.on('die', function() {
          binding.forget('nodeAdded', dataChangeHandler);
          return binding.forget('nodeRemoved', dataChangeHandler);
        });
      } else {
        return;
      }
      return this._fireDataChange(this.get('filteredValue'));
    };

    SelectBinding.prototype.dataChange = function(newValue) {
      var child, matches, valueToChild, _i, _len, _name, _ref,
        _this = this;
      if (newValue != null ? newValue.forEach : void 0) {
        valueToChild = {};
        _ref = this.node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child.selected = false;
          matches = valueToChild[_name = child.value] || (valueToChild[_name] = []);
          matches.push(child);
        }
        newValue.forEach(function(value) {
          var children, node, _j, _len1, _results;
          if (children = valueToChild[value]) {
            _results = [];
            for (_j = 0, _len1 = children.length; _j < _len1; _j++) {
              node = children[_j];
              _results.push(node.selected = true);
            }
            return _results;
          }
        });
      } else {
        if (typeof newValue === 'undefined' && this.firstBind) {
          this.set('unfilteredValue', this.node.value);
        } else {
          Batman.DOM.valueForNode(this.node, newValue, this.escapeValue);
        }
        this.firstBind = false;
      }
      this.updateOptionBindings();
    };

    SelectBinding.prototype.nodeChange = function() {
      var c, selections;
      if (this.isTwoWay()) {
        selections = this.node.multiple ? (function() {
          var _i, _len, _ref, _results;
          _ref = this.node.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            c = _ref[_i];
            if (c.selected) {
              _results.push(c.value);
            }
          }
          return _results;
        }).call(this) : this.node.value;
        if (typeof selections === Array && selections.length === 1) {
          selections = selections[0];
        }
        this.set('unfilteredValue', selections);
        this.updateOptionBindings();
      }
    };

    SelectBinding.prototype.updateOptionBindings = function() {
      return this.selectedBindings.forEach(function(binding) {
        return binding._fireNodeChange();
      });
    };

    return SelectBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.RouteBinding = (function(_super) {

    __extends(RouteBinding, _super);

    function RouteBinding() {
      return RouteBinding.__super__.constructor.apply(this, arguments);
    }

    RouteBinding.prototype.onATag = false;

    RouteBinding.accessor('dispatcher', function() {
      return this.renderContext.get('dispatcher') || Batman.App.get('current.dispatcher');
    });

    RouteBinding.prototype.bind = function() {
      var _this = this;
      if (this.node.nodeName.toUpperCase() === 'A') {
        this.onATag = true;
      }
      RouteBinding.__super__.bind.apply(this, arguments);
      return Batman.DOM.events.click(this.node, function(node, event) {
        var params;
        if (event.__batmanActionTaken) {
          return;
        }
        event.__batmanActionTaken = true;
        params = _this.pathFromValue(_this.get('filteredValue'));
        if (params != null) {
          return Batman.redirect(params);
        }
      });
    };

    RouteBinding.prototype.dataChange = function(value) {
      var path;
      if (value != null) {
        path = this.pathFromValue(value);
      }
      if (this.onATag) {
        if (path != null) {
          path = Batman.navigator.linkTo(path);
        } else {
          path = "#";
        }
        return this.node.href = path;
      }
    };

    RouteBinding.prototype.pathFromValue = function(value) {
      var _ref;
      if (value != null) {
        if (value.isNamedRouteQuery) {
          return value.get('path');
        } else {
          return (_ref = this.get('dispatcher')) != null ? _ref.pathFromParams(value) : void 0;
        }
      }
    };

    return RouteBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.RadioBinding = (function(_super) {

    __extends(RadioBinding, _super);

    function RadioBinding() {
      return RadioBinding.__super__.constructor.apply(this, arguments);
    }

    RadioBinding.prototype.isInputBinding = true;

    RadioBinding.prototype.dataChange = function(value) {
      var boundValue;
      if ((boundValue = this.get('filteredValue')) != null) {
        return this.node.checked = boundValue === this.node.value;
      } else if (this.node.checked) {
        return this.set('filteredValue', this.node.value);
      }
    };

    RadioBinding.prototype.nodeChange = function(node) {
      if (this.isTwoWay()) {
        return this.set('filteredValue', Batman.DOM.attrReaders._parseAttribute(node.value));
      }
    };

    return RadioBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.MixinBinding = (function(_super) {

    __extends(MixinBinding, _super);

    function MixinBinding() {
      return MixinBinding.__super__.constructor.apply(this, arguments);
    }

    MixinBinding.prototype.dataChange = function(value) {
      if (value != null) {
        return Batman.mixin(this.node, value);
      }
    };

    return MixinBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.FileBinding = (function(_super) {

    __extends(FileBinding, _super);

    function FileBinding() {
      return FileBinding.__super__.constructor.apply(this, arguments);
    }

    FileBinding.prototype.isInputBinding = true;

    FileBinding.prototype.nodeChange = function(node, subContext) {
      if (!this.isTwoWay()) {
        return;
      }
      if (node.hasAttribute('multiple')) {
        return this.set('filteredValue', Array.prototype.slice.call(node.files));
      } else {
        return this.set('filteredValue', node.files[0]);
      }
    };

    return FileBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.DeferredRenderingBinding = (function(_super) {

    __extends(DeferredRenderingBinding, _super);

    DeferredRenderingBinding.prototype.rendered = false;

    function DeferredRenderingBinding() {
      DeferredRenderingBinding.__super__.constructor.apply(this, arguments);
      this.node.removeAttribute("data-renderif");
    }

    DeferredRenderingBinding.prototype.nodeChange = function() {};

    DeferredRenderingBinding.prototype.dataChange = function(value) {
      if (value && !this.rendered) {
        return this.render();
      }
    };

    DeferredRenderingBinding.prototype.render = function() {
      new Batman.Renderer(this.node, this.renderContext, this.renderer.view);
      return this.rendered = true;
    };

    return DeferredRenderingBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.Binding = (function(_super) {

    __extends(Binding, _super);

    function Binding(node) {
      var _ref;
      this.isInputBinding = (_ref = node.nodeName.toLowerCase()) === 'input' || _ref === 'textarea';
      Binding.__super__.constructor.apply(this, arguments);
    }

    Binding.prototype.nodeChange = function(node, context) {
      if (this.isTwoWay()) {
        return this.set('filteredValue', this.node.value);
      }
    };

    Binding.prototype.dataChange = function(value, node) {
      return Batman.DOM.valueForNode(this.node, value, this.escapeValue);
    };

    return Binding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.DOM.AbstractAttributeBinding = (function(_super) {

    __extends(AbstractAttributeBinding, _super);

    function AbstractAttributeBinding() {
      var args, attributeName, node;
      node = arguments[0], attributeName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      this.attributeName = attributeName;
      AbstractAttributeBinding.__super__.constructor.apply(this, [node].concat(__slice.call(args)));
    }

    return AbstractAttributeBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.FormBinding = (function(_super) {

    __extends(FormBinding, _super);

    FormBinding.current = null;

    FormBinding.prototype.errorClass = 'error';

    FormBinding.prototype.defaultErrorsListSelector = 'div.errors';

    FormBinding.accessor('errorsListSelector', function() {
      return this.get('node').getAttribute('data-errors-list') || this.defaultErrorsListSelector;
    });

    function FormBinding(node, contextName, keyPath, renderContext, renderer, only) {
      this.childBindingAdded = __bind(this.childBindingAdded, this);
      FormBinding.__super__.constructor.apply(this, arguments);
      this.contextName = contextName;
      delete this.attributeName;
      Batman.DOM.events.submit(this.get('node'), function(node, e) {
        return Batman.preventDefault(e);
      });
      this.setupErrorsList();
    }

    FormBinding.prototype.childBindingAdded = function(binding) {
      var field, index, node;
      if (binding.isInputBinding && Batman.isChildOf(this.get('node'), binding.get('node'))) {
        if (~(index = binding.get('key').indexOf(this.contextName))) {
          node = binding.get('node');
          field = binding.get('key').slice(index + this.contextName.length + 1);
          return new Batman.DOM.AddClassBinding(node, this.errorClass, this.get('keyPath') + (" | get 'errors." + field + ".length'"), this.renderContext, this.renderer);
        }
      }
    };

    FormBinding.prototype.setupErrorsList = function() {
      if (this.errorsListNode = Batman.DOM.querySelector(this.get('node'), this.get('errorsListSelector'))) {
        Batman.setInnerHTML(this.errorsListNode, this.errorsListHTML());
        if (!this.errorsListNode.getAttribute('data-showif')) {
          return this.errorsListNode.setAttribute('data-showif', "" + this.contextName + ".errors.length");
        }
      }
    };

    FormBinding.prototype.errorsListHTML = function() {
      return "<ul>\n  <li data-foreach-error=\"" + this.contextName + ".errors\" data-bind=\"error.fullMessage\"></li>\n</ul>";
    };

    return FormBinding;

  })(Batman.DOM.AbstractAttributeBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.EventBinding = (function(_super) {

    __extends(EventBinding, _super);

    EventBinding.prototype.bindImmediately = false;

    function EventBinding(node, eventName, key, context) {
      var attacher, callback, confirmText,
        _this = this;
      EventBinding.__super__.constructor.apply(this, arguments);
      confirmText = this.node.getAttribute('data-confirm');
      callback = function() {
        var _ref;
        if (confirmText && !confirm(confirmText)) {
          return;
        }
        return (_ref = _this.get('filteredValue')) != null ? _ref.apply(_this.get('callbackContext'), arguments) : void 0;
      };
      if (attacher = Batman.DOM.events[this.attributeName]) {
        attacher(this.node, callback, context);
      } else {
        Batman.DOM.events.other(this.node, this.attributeName, callback, context);
      }
      this.bind();
    }

    EventBinding.accessor('callbackContext', function() {
      var contextKeySegments;
      contextKeySegments = this.key.split('.');
      contextKeySegments.pop();
      if (contextKeySegments.length > 0) {
        return this.get('keyContext').get(contextKeySegments.join('.'));
      } else {
        return this.get('keyContext');
      }
    });

    EventBinding.wrapAccessor('unfilteredValue', function(core) {
      return {
        get: function() {
          var functionKey, k, keyContext, keys;
          if (k = this.get('key')) {
            keys = k.split('.');
            if (keys.length > 1) {
              functionKey = keys.pop();
              keyContext = Batman.getPath(this, ['keyContext'].concat(keys));
              if (keyContext != null) {
                keyContext = Batman.RenderContext.deProxy(keyContext);
                return keyContext[functionKey];
              }
            }
          }
          return core.get.apply(this, arguments);
        }
      };
    });

    return EventBinding;

  })(Batman.DOM.AbstractAttributeBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.NodeAttributeBinding = (function(_super) {

    __extends(NodeAttributeBinding, _super);

    function NodeAttributeBinding() {
      return NodeAttributeBinding.__super__.constructor.apply(this, arguments);
    }

    NodeAttributeBinding.prototype.dataChange = function(value) {
      if (value == null) {
        value = "";
      }
      return this.node[this.attributeName] = value;
    };

    NodeAttributeBinding.prototype.nodeChange = function(node) {
      if (this.isTwoWay()) {
        return this.set('filteredValue', Batman.DOM.attrReaders._parseAttribute(node[this.attributeName]));
      }
    };

    return NodeAttributeBinding;

  })(Batman.DOM.AbstractAttributeBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.CheckedBinding = (function(_super) {

    __extends(CheckedBinding, _super);

    function CheckedBinding() {
      return CheckedBinding.__super__.constructor.apply(this, arguments);
    }

    CheckedBinding.prototype.isInputBinding = true;

    CheckedBinding.prototype.dataChange = function(value) {
      return this.node[this.attributeName] = !!value;
    };

    return CheckedBinding;

  })(Batman.DOM.NodeAttributeBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.AttributeBinding = (function(_super) {

    __extends(AttributeBinding, _super);

    function AttributeBinding() {
      return AttributeBinding.__super__.constructor.apply(this, arguments);
    }

    AttributeBinding.prototype.dataChange = function(value) {
      return this.node.setAttribute(this.attributeName, value);
    };

    AttributeBinding.prototype.nodeChange = function(node) {
      if (this.isTwoWay()) {
        return this.set('filteredValue', Batman.DOM.attrReaders._parseAttribute(node.getAttribute(this.attributeName)));
      }
    };

    return AttributeBinding;

  })(Batman.DOM.AbstractAttributeBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.AddClassBinding = (function(_super) {

    __extends(AddClassBinding, _super);

    function AddClassBinding(node, className, keyPath, renderContext, renderer, only, invert) {
      var name, names;
      this.invert = invert != null ? invert : false;
      names = className.split('|');
      this.classes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          _results.push({
            name: name,
            pattern: new RegExp("(?:^|\\s)" + name + "(?:$|\\s)", 'i')
          });
        }
        return _results;
      })();
      AddClassBinding.__super__.constructor.apply(this, arguments);
      delete this.attributeName;
    }

    AddClassBinding.prototype.dataChange = function(value) {
      var currentName, includesClassName, name, pattern, _i, _len, _ref, _ref1;
      currentName = this.node.className;
      _ref = this.classes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], name = _ref1.name, pattern = _ref1.pattern;
        includesClassName = pattern.test(currentName);
        if (!!value === !this.invert) {
          if (!includesClassName) {
            this.node.className = "" + currentName + " " + name;
          }
        } else {
          if (includesClassName) {
            this.node.className = currentName.replace(pattern, ' ');
          }
        }
      }
      return true;
    };

    return AddClassBinding;

  })(Batman.DOM.AbstractAttributeBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.AbstractCollectionBinding = (function(_super) {

    __extends(AbstractCollectionBinding, _super);

    function AbstractCollectionBinding() {
      return AbstractCollectionBinding.__super__.constructor.apply(this, arguments);
    }

    AbstractCollectionBinding.prototype.bindCollection = function(newCollection) {
      var _ref;
      if (newCollection instanceof Batman.Hash) {
        newCollection = newCollection.meta;
      }
      if (newCollection === this.collection) {
        return true;
      } else {
        this.unbindCollection();
        this.collection = newCollection;
        if ((_ref = this.collection) != null ? _ref.isObservable : void 0) {
          this.collection.observeAndFire('toArray', this.handleArrayChanged);
          return true;
        }
      }
      return false;
    };

    AbstractCollectionBinding.prototype.unbindCollection = function() {
      var _ref;
      if ((_ref = this.collection) != null ? _ref.isObservable : void 0) {
        return this.collection.forget('toArray', this.handleArrayChanged);
      }
    };

    AbstractCollectionBinding.prototype.handleArrayChanged = function() {};

    AbstractCollectionBinding.prototype.die = function() {
      this.unbindCollection();
      return AbstractCollectionBinding.__super__.die.apply(this, arguments);
    };

    return AbstractCollectionBinding;

  })(Batman.DOM.AbstractAttributeBinding);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.DOM.StyleBinding = (function(_super) {

    __extends(StyleBinding, _super);

    StyleBinding.SingleStyleBinding = (function(_super1) {

      __extends(SingleStyleBinding, _super1);

      SingleStyleBinding.prototype.isTwoWay = function() {
        return false;
      };

      function SingleStyleBinding() {
        var args, parent, _i;
        args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), parent = arguments[_i++];
        this.parent = parent;
        SingleStyleBinding.__super__.constructor.apply(this, args);
      }

      SingleStyleBinding.prototype.dataChange = function(value) {
        return this.parent.setStyle(this.attributeName, value);
      };

      return SingleStyleBinding;

    })(Batman.DOM.AbstractAttributeBinding);

    function StyleBinding() {
      this.setStyle = __bind(this.setStyle, this);

      this.handleArrayChanged = __bind(this.handleArrayChanged, this);
      this.oldStyles = {};
      this.styleBindings = {};
      StyleBinding.__super__.constructor.apply(this, arguments);
    }

    StyleBinding.prototype.dataChange = function(value) {
      var colonSplitCSSValues, cssName, key, style, _i, _len, _ref, _ref1, _results;
      if (!value) {
        this.resetStyles();
        return;
      }
      this.unbindCollection();
      if (typeof value === 'string') {
        this.resetStyles();
        _ref = value.split(';');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          style = _ref[_i];
          _ref1 = style.split(":"), cssName = _ref1[0], colonSplitCSSValues = 2 <= _ref1.length ? __slice.call(_ref1, 1) : [];
          this.setStyle(cssName, colonSplitCSSValues.join(":"));
        }
        return;
      }
      if (value instanceof Batman.Hash) {
        return this.bindCollection(value);
      } else {
        if (value instanceof Batman.Object) {
          value = value.toJSON();
        }
        this.resetStyles();
        _results = [];
        for (key in value) {
          if (!__hasProp.call(value, key)) continue;
          _results.push(this.bindSingleAttribute(key, "" + this.keyPath + "." + key));
        }
        return _results;
      }
    };

    StyleBinding.prototype.handleArrayChanged = function(array) {
      var _this = this;
      return this.collection.forEach(function(key, value) {
        return _this.bindSingleAttribute(key, "" + _this.keyPath + "." + key);
      });
    };

    StyleBinding.prototype.bindSingleAttribute = function(attr, keyPath) {
      return this.styleBindings[attr] = new this.constructor.SingleStyleBinding(this.node, attr, keyPath, this.renderContext, this.renderer, this.only, this);
    };

    StyleBinding.prototype.setStyle = function(key, value) {
      key = Batman.helpers.camelize(key.trim(), true);
      if (this.oldStyles[key] == null) {
        this.oldStyles[key] = this.node.style[key] || "";
      }
      if (value != null ? value.trim : void 0) {
        value = value.trim();
      }
      if (value == null) {
        value = "";
      }
      return this.node.style[key] = value;
    };

    StyleBinding.prototype.resetStyles = function() {
      var cssName, cssValue, _ref, _results;
      _ref = this.oldStyles;
      _results = [];
      for (cssName in _ref) {
        if (!__hasProp.call(_ref, cssName)) continue;
        cssValue = _ref[cssName];
        _results.push(this.setStyle(cssName, cssValue));
      }
      return _results;
    };

    StyleBinding.prototype.resetBindings = function() {
      var attribute, binding, _ref;
      _ref = this.styleBindings;
      for (attribute in _ref) {
        binding = _ref[attribute];
        binding._fireDataChange('');
        binding.die();
      }
      return this.styleBindings = {};
    };

    StyleBinding.prototype.unbindCollection = function() {
      this.resetBindings();
      return StyleBinding.__super__.unbindCollection.apply(this, arguments);
    };

    return StyleBinding;

  })(Batman.DOM.AbstractCollectionBinding);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.IteratorBinding = (function(_super) {

    __extends(IteratorBinding, _super);

    IteratorBinding.prototype.currentActionNumber = 0;

    IteratorBinding.prototype.queuedActionNumber = 0;

    IteratorBinding.prototype.bindImmediately = false;

    function IteratorBinding(sourceNode, iteratorName, key, context, parentRenderer) {
      var previousSiblingNode,
        _this = this;
      this.iteratorName = iteratorName;
      this.key = key;
      this.context = context;
      this.parentRenderer = parentRenderer;
      this.handleArrayChanged = __bind(this.handleArrayChanged, this);

      this.nodeMap = new Batman.SimpleHash;
      this.rendererMap = new Batman.SimpleHash;
      this.fragment = document.createDocumentFragment();
      this.prototypeNode = sourceNode.cloneNode(true);
      this.prototypeNode.removeAttribute("data-foreach-" + this.iteratorName);
      previousSiblingNode = sourceNode.nextSibling;
      this.startNode = document.createComment("start " + this.iteratorName + "-" + (this.get('_batmanID')));
      this.endNode = document.createComment("end " + this.iteratorName + "-" + (this.get('_batmanID')));
      this.endNode[Batman.expando] = sourceNode[Batman.expando];
      if (Batman.canDeleteExpando) {
        delete sourceNode[Batman.expando];
      }
      Batman.insertBefore(sourceNode.parentNode, this.startNode, previousSiblingNode);
      Batman.insertBefore(sourceNode.parentNode, this.endNode, previousSiblingNode);
      this.parentRenderer.prevent('rendered');
      Batman.DOM.onParseExit(sourceNode.parentNode, function() {
        Batman.destroyNode(sourceNode);
        _this.bind();
        return _this.parentRenderer.allowAndFire('rendered');
      });
      IteratorBinding.__super__.constructor.call(this, this.endNode, this.iteratorName, this.key, this.context, this.parentRenderer);
    }

    IteratorBinding.prototype.parentNode = function() {
      return this.endNode.parentNode;
    };

    IteratorBinding.prototype.die = function() {
      this.dead = true;
      return IteratorBinding.__super__.die.apply(this, arguments);
    };

    IteratorBinding.prototype.dataChange = function(collection) {
      var items, _items;
      if (collection != null) {
        if (!this.bindCollection(collection)) {
          items = (collection != null ? collection.forEach : void 0) ? (_items = [], collection.forEach(function(item) {
            return _items.push(item);
          }), _items) : Object.keys(collection);
          return this.handleArrayChanged(items);
        }
      } else {
        return this.handleArrayChanged([]);
      }
    };

    IteratorBinding.prototype.handleArrayChanged = function(newItems) {
      var existingNode, index, newItem, node, nodeAtIndex, parentNode, startIndex, unseenNodeMap, _i, _len,
        _this = this;
      parentNode = this.parentNode();
      startIndex = this._getStartNodeIndex() + 1;
      unseenNodeMap = this.nodeMap.merge();
      for (index = _i = 0, _len = newItems.length; _i < _len; index = ++_i) {
        newItem = newItems[index];
        nodeAtIndex = parentNode.childNodes[startIndex + index];
        if ((nodeAtIndex != null) && this._itemForNode(nodeAtIndex) === newItem) {
          unseenNodeMap.unset(newItem);
          continue;
        } else {
          node = (existingNode = this.nodeMap.get(newItem)) ? (unseenNodeMap.unset(newItem), existingNode) : this._newNodeForItem(newItem);
          Batman.insertBefore(this.parentNode(), node, nodeAtIndex);
        }
      }
      unseenNodeMap.forEach(function(item, node) {
        return _this._removeItem(item);
      });
    };

    IteratorBinding.prototype._itemForNode = function(node) {
      return Batman._data(node, "" + this.iteratorName + "Item");
    };

    IteratorBinding.prototype._newNodeForItem = function(newItem) {
      var newNode, renderer,
        _this = this;
      newNode = this.prototypeNode.cloneNode(true);
      Batman._data(newNode, "" + this.iteratorName + "Item", newItem);
      this.nodeMap.set(newItem, newNode);
      this.parentRenderer.prevent('rendered');
      renderer = new Batman.Renderer(newNode, this.renderContext.descend(newItem, this.iteratorName), this.parentRenderer.view);
      renderer.on('rendered', function() {
        Batman.propagateBindingEvents(newNode);
        _this.fire('nodeAdded', newNode, newItem);
        return _this.parentRenderer.allowAndFire('rendered');
      });
      return newNode;
    };

    IteratorBinding.prototype._getStartNodeIndex = function() {
      var index, node, _i, _len, _ref;
      _ref = this.parentNode().childNodes;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        node = _ref[index];
        if (node === this.startNode) {
          return index;
        }
      }
      return 0;
    };

    IteratorBinding.prototype._removeItem = function(item) {
      var node;
      node = this.nodeMap.unset(item);
      Batman.destroyNode(node);
      return this.fire('nodeRemoved', node, item);
    };

    return IteratorBinding;

  })(Batman.DOM.AbstractCollectionBinding);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.ClassBinding = (function(_super) {

    __extends(ClassBinding, _super);

    function ClassBinding() {
      this.handleArrayChanged = __bind(this.handleArrayChanged, this);
      return ClassBinding.__super__.constructor.apply(this, arguments);
    }

    ClassBinding.prototype.dataChange = function(value) {
      if (value != null) {
        this.unbindCollection();
        if (typeof value === 'string') {
          return this.node.className = value;
        } else {
          this.bindCollection(value);
          return this.updateFromCollection();
        }
      }
    };

    ClassBinding.prototype.updateFromCollection = function() {
      var array, k, v;
      if (this.collection) {
        array = this.collection.map ? this.collection.map(function(x) {
          return x;
        }) : (function() {
          var _ref, _results;
          _ref = this.collection;
          _results = [];
          for (k in _ref) {
            if (!__hasProp.call(_ref, k)) continue;
            v = _ref[k];
            _results.push(k);
          }
          return _results;
        }).call(this);
        if (array.toArray != null) {
          array = array.toArray();
        }
        return this.node.className = array.join(' ');
      }
    };

    ClassBinding.prototype.handleArrayChanged = function() {
      return this.updateFromCollection();
    };

    return ClassBinding;

  })(Batman.DOM.AbstractCollectionBinding);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.ValidationError = (function(_super) {

    __extends(ValidationError, _super);

    ValidationError.accessor('fullMessage', function() {
      return Batman.t('errors.format', {
        attribute: Batman.helpers.humanize(this.attribute),
        message: this.message
      });
    });

    function ValidationError(attribute, message) {
      ValidationError.__super__.constructor.call(this, {
        attribute: attribute,
        message: message
      });
    }

    return ValidationError;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.StorageAdapter = (function(_super) {

    __extends(StorageAdapter, _super);

    StorageAdapter.StorageError = (function(_super1) {

      __extends(StorageError, _super1);

      StorageError.prototype.name = "StorageError";

      function StorageError(message) {
        StorageError.__super__.constructor.apply(this, arguments);
        this.message = message;
      }

      return StorageError;

    })(Error);

    StorageAdapter.RecordExistsError = (function(_super1) {

      __extends(RecordExistsError, _super1);

      RecordExistsError.prototype.name = 'RecordExistsError';

      function RecordExistsError(message) {
        RecordExistsError.__super__.constructor.call(this, message || "Can't create this record because it already exists in the store!");
      }

      return RecordExistsError;

    })(StorageAdapter.StorageError);

    StorageAdapter.NotFoundError = (function(_super1) {

      __extends(NotFoundError, _super1);

      NotFoundError.prototype.name = 'NotFoundError';

      function NotFoundError(message) {
        NotFoundError.__super__.constructor.call(this, message || "Record couldn't be found in storage!");
      }

      return NotFoundError;

    })(StorageAdapter.StorageError);

    function StorageAdapter(model) {
      var constructor;
      StorageAdapter.__super__.constructor.call(this, {
        model: model
      });
      constructor = this.constructor;
      if (constructor.ModelMixin) {
        Batman.extend(model, constructor.ModelMixin);
      }
      if (constructor.RecordMixin) {
        Batman.extend(model.prototype, constructor.RecordMixin);
      }
    }

    StorageAdapter.prototype.isStorageAdapter = true;

    StorageAdapter.prototype.storageKey = function(record) {
      var model;
      model = (record != null ? record.constructor : void 0) || this.model;
      return model.get('storageKey') || Batman.helpers.pluralize(Batman.helpers.underscore(model.get('resourceName')));
    };

    StorageAdapter.prototype.getRecordFromData = function(attributes, constructor) {
      var record;
      if (constructor == null) {
        constructor = this.model;
      }
      record = new constructor();
      record._withoutDirtyTracking(function() {
        return this.fromJSON(attributes);
      });
      return record;
    };

    StorageAdapter.skipIfError = function(f) {
      return function(env, next) {
        if (env.error != null) {
          return next();
        } else {
          return f.call(this, env, next);
        }
      };
    };

    StorageAdapter.prototype.before = function() {
      return this._addFilter.apply(this, ['before'].concat(__slice.call(arguments)));
    };

    StorageAdapter.prototype.after = function() {
      return this._addFilter.apply(this, ['after'].concat(__slice.call(arguments)));
    };

    StorageAdapter.prototype._inheritFilters = function() {
      var filtersByKey, filtersList, key, oldFilters, position, _results;
      if (!this._batman.check(this) || !this._batman.filters) {
        oldFilters = this._batman.getFirst('filters');
        this._batman.filters = {
          before: {},
          after: {}
        };
        if (oldFilters != null) {
          _results = [];
          for (position in oldFilters) {
            filtersByKey = oldFilters[position];
            _results.push((function() {
              var _results1;
              _results1 = [];
              for (key in filtersByKey) {
                filtersList = filtersByKey[key];
                _results1.push(this._batman.filters[position][key] = filtersList.slice(0));
              }
              return _results1;
            }).call(this));
          }
          return _results;
        }
      }
    };

    StorageAdapter.prototype._addFilter = function() {
      var filter, key, keys, position, _base, _i, _j, _len;
      position = arguments[0], keys = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), filter = arguments[_i++];
      this._inheritFilters();
      for (_j = 0, _len = keys.length; _j < _len; _j++) {
        key = keys[_j];
        (_base = this._batman.filters[position])[key] || (_base[key] = []);
        this._batman.filters[position][key].push(filter);
      }
      return true;
    };

    StorageAdapter.prototype.runFilter = function(position, action, env, callback) {
      var actionFilters, allFilters, filters, next,
        _this = this;
      this._inheritFilters();
      allFilters = this._batman.filters[position].all || [];
      actionFilters = this._batman.filters[position][action] || [];
      env.action = action;
      filters = position === 'before' ? actionFilters.concat(allFilters) : allFilters.concat(actionFilters);
      next = function(newEnv) {
        var nextFilter;
        if (newEnv != null) {
          env = newEnv;
        }
        if ((nextFilter = filters.shift()) != null) {
          return nextFilter.call(_this, env, next);
        } else {
          return callback.call(_this, env);
        }
      };
      return next();
    };

    StorageAdapter.prototype.runBeforeFilter = function() {
      return this.runFilter.apply(this, ['before'].concat(__slice.call(arguments)));
    };

    StorageAdapter.prototype.runAfterFilter = function(action, env, callback) {
      return this.runFilter('after', action, env, this.exportResult(callback));
    };

    StorageAdapter.prototype.exportResult = function(callback) {
      return function(env) {
        return callback(env.error, env.result, env);
      };
    };

    StorageAdapter.prototype._jsonToAttributes = function(json) {
      return JSON.parse(json);
    };

    StorageAdapter.prototype.perform = function(key, subject, options, callback) {
      var env, next,
        _this = this;
      options || (options = {});
      env = {
        options: options,
        subject: subject
      };
      next = function(newEnv) {
        if (newEnv != null) {
          env = newEnv;
        }
        return _this.runAfterFilter(key, env, callback);
      };
      return this.runBeforeFilter(key, env, function(env) {
        return this[key](env, next);
      });
    };

    return StorageAdapter;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Batman.RestStorage = (function(_super) {
    var key, _fn, _i, _len, _ref,
      _this = this;

    __extends(RestStorage, _super);

    RestStorage.JSONContentType = 'application/json';

    RestStorage.PostBodyContentType = 'application/x-www-form-urlencoded';

    RestStorage.BaseMixin = {
      request: function(action, options, callback) {
        if (!callback) {
          callback = options;
          options = {};
        }
        options.method || (options.method = 'GET');
        options.action = action;
        return this._doStorageOperation(options.method.toLowerCase(), options, callback);
      }
    };

    RestStorage.ModelMixin = Batman.extend({}, RestStorage.BaseMixin, {
      urlNestsUnder: function() {
        var key, keys, parents, _i, _len;
        keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        parents = {};
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          parents[key + '_id'] = Batman.helpers.pluralize(key);
        }
        this.url = function(options) {
          var childSegment, parentID, plural;
          childSegment = Batman.helpers.pluralize(this.get('resourceName').toLowerCase());
          for (key in parents) {
            plural = parents[key];
            parentID = options.data[key];
            if (parentID) {
              delete options.data[key];
              return "" + plural + "/" + parentID + "/" + childSegment;
            }
          }
          return childSegment;
        };
        return this.prototype.url = function() {
          var childSegment, id, parentID, plural, url;
          childSegment = Batman.helpers.pluralize(this.constructor.get('resourceName').toLowerCase());
          for (key in parents) {
            plural = parents[key];
            parentID = this.get('dirtyKeys').get(key);
            if (parentID === void 0) {
              parentID = this.get(key);
            }
            if (parentID) {
              url = "" + plural + "/" + parentID + "/" + childSegment;
              break;
            }
          }
          url || (url = childSegment);
          if (id = this.get('id')) {
            url += '/' + id;
          }
          return url;
        };
      }
    });

    RestStorage.RecordMixin = Batman.extend({}, RestStorage.BaseMixin);

    RestStorage.prototype.defaultRequestOptions = {
      type: 'json'
    };

    RestStorage.prototype._implicitActionNames = ['create', 'read', 'update', 'destroy', 'readAll'];

    RestStorage.prototype.serializeAsForm = true;

    function RestStorage() {
      RestStorage.__super__.constructor.apply(this, arguments);
      this.defaultRequestOptions = Batman.extend({}, this.defaultRequestOptions);
    }

    RestStorage.prototype.recordJsonNamespace = function(record) {
      return Batman.helpers.singularize(this.storageKey(record));
    };

    RestStorage.prototype.collectionJsonNamespace = function(constructor) {
      return Batman.helpers.pluralize(this.storageKey(constructor.prototype));
    };

    RestStorage.prototype._execWithOptions = function(object, key, options) {
      if (typeof object[key] === 'function') {
        return object[key](options);
      } else {
        return object[key];
      }
    };

    RestStorage.prototype._defaultCollectionUrl = function(model) {
      return "/" + (this.storageKey(model.prototype));
    };

    RestStorage.prototype._addParams = function(url, options) {
      var _ref;
      if (options && options.action && !(_ref = options.action, __indexOf.call(this._implicitActionNames, _ref) >= 0)) {
        url += '/' + options.action.toLowerCase();
      }
      return url;
    };

    RestStorage.prototype.urlForRecord = function(record, env) {
      var id, url;
      if (record.url) {
        url = this._execWithOptions(record, 'url', env.options);
      } else {
        url = record.constructor.url ? this._execWithOptions(record.constructor, 'url', env.options) : this._defaultCollectionUrl(record.constructor);
        if (env.action !== 'create') {
          if ((id = record.get('id')) != null) {
            url = url + "/" + id;
          } else {
            throw new this.constructor.StorageError("Couldn't get/set record primary key on " + env.action + "!");
          }
        }
      }
      url = this._addParams(url, env.options);
      return this.urlPrefix(record, env) + url + this.urlSuffix(record, env);
    };

    RestStorage.prototype.urlForCollection = function(model, env) {
      var url;
      url = model.url ? this._execWithOptions(model, 'url', env.options) : this._defaultCollectionUrl(model, env.options);
      url = this._addParams(url, env.options);
      return this.urlPrefix(model, env) + url + this.urlSuffix(model, env);
    };

    RestStorage.prototype.urlPrefix = function(object, env) {
      return this._execWithOptions(object, 'urlPrefix', env.options) || '';
    };

    RestStorage.prototype.urlSuffix = function(object, env) {
      return this._execWithOptions(object, 'urlSuffix', env.options) || '';
    };

    RestStorage.prototype.request = function(env, next) {
      var options;
      options = Batman.extend(env.options, {
        autosend: false,
        success: function(data) {
          return env.data = data;
        },
        error: function(error) {
          return env.error = error;
        },
        loaded: function() {
          env.response = env.request.get('response');
          return next();
        }
      });
      env.request = new Batman.Request(options);
      return env.request.send();
    };

    RestStorage.prototype.perform = function(key, record, options, callback) {
      options || (options = {});
      Batman.extend(options, this.defaultRequestOptions);
      return RestStorage.__super__.perform.call(this, key, record, options, callback);
    };

    RestStorage.prototype.before('all', RestStorage.skipIfError(function(env, next) {
      if (!env.options.url) {
        try {
          env.options.url = env.subject.prototype ? this.urlForCollection(env.subject, env) : this.urlForRecord(env.subject, env);
        } catch (error) {
          env.error = error;
        }
      }
      return next();
    }));

    RestStorage.prototype.before('get', 'put', 'post', 'delete', RestStorage.skipIfError(function(env, next) {
      env.options.method = env.action.toUpperCase();
      return next();
    }));

    RestStorage.prototype.before('create', 'update', RestStorage.skipIfError(function(env, next) {
      var data, json, namespace;
      json = env.subject.toJSON();
      if (namespace = this.recordJsonNamespace(env.subject)) {
        data = {};
        data[namespace] = json;
      } else {
        data = json;
      }
      env.options.data = data;
      return next();
    }));

    RestStorage.prototype.before('create', 'update', 'put', 'post', RestStorage.skipIfError(function(env, next) {
      if (this.serializeAsForm) {
        env.options.contentType = this.constructor.PostBodyContentType;
      } else {
        if (env.options.data != null) {
          env.options.data = JSON.stringify(env.options.data);
          env.options.contentType = this.constructor.JSONContentType;
        }
      }
      return next();
    }));

    RestStorage.prototype.after('all', RestStorage.skipIfError(function(env, next) {
      var json;
      if (!(env.data != null)) {
        return next();
      }
      if (typeof env.data === 'string') {
        if (env.data.length > 0) {
          try {
            json = this._jsonToAttributes(env.data);
          } catch (error) {
            env.error = error;
            return next();
          }
        }
      } else if (typeof env.data === 'object') {
        json = env.data;
      }
      if (json != null) {
        env.json = json;
      }
      return next();
    }));

    RestStorage.prototype.extractFromNamespace = function(data, namespace) {
      if (namespace && (data[namespace] != null)) {
        return data[namespace];
      } else {
        return data;
      }
    };

    RestStorage.prototype.after('create', 'read', 'update', RestStorage.skipIfError(function(env, next) {
      var json;
      if (env.json != null) {
        json = this.extractFromNamespace(env.json, this.recordJsonNamespace(env.subject));
        env.subject._withoutDirtyTracking(function() {
          return this.fromJSON(json);
        });
      }
      env.result = env.subject;
      return next();
    }));

    RestStorage.prototype.after('readAll', RestStorage.skipIfError(function(env, next) {
      var jsonRecordAttributes, namespace;
      namespace = this.collectionJsonNamespace(env.subject);
      env.recordsAttributes = this.extractFromNamespace(env.json, namespace);
      if (Batman.typeOf(env.recordsAttributes) !== 'Array') {
        namespace = this.recordJsonNamespace(env.subject.prototype);
        env.recordsAttributes = [this.extractFromNamespace(env.json, namespace)];
      }
      env.result = env.records = (function() {
        var _i, _len, _ref, _results;
        _ref = env.recordsAttributes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          jsonRecordAttributes = _ref[_i];
          _results.push(this.getRecordFromData(jsonRecordAttributes, env.subject));
        }
        return _results;
      }).call(this);
      return next();
    }));

    RestStorage.prototype.after('get', 'put', 'post', 'delete', RestStorage.skipIfError(function(env, next) {
      var json, namespace;
      if (env.json != null) {
        json = env.json;
        namespace = env.subject.prototype ? this.collectionJsonNamespace(env.subject) : this.recordJsonNamespace(env.subject);
        env.result = namespace && (env.json[namespace] != null) ? env.json[namespace] : env.json;
      }
      return next();
    }));

    RestStorage.HTTPMethods = {
      create: 'POST',
      update: 'PUT',
      read: 'GET',
      readAll: 'GET',
      destroy: 'DELETE'
    };

    _ref = ['create', 'read', 'update', 'destroy', 'readAll', 'get', 'post', 'put', 'delete'];
    _fn = function(key) {
      return RestStorage.prototype[key] = RestStorage.skipIfError(function(env, next) {
        var _base;
        (_base = env.options).method || (_base.method = this.constructor.HTTPMethods[key]);
        return this.request(env, next);
      });
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _fn(key);
    }

    return RestStorage;

  }).call(this, Batman.StorageAdapter);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.LocalStorage = (function(_super) {

    __extends(LocalStorage, _super);

    function LocalStorage() {
      if (typeof window.localStorage === 'undefined') {
        return null;
      }
      LocalStorage.__super__.constructor.apply(this, arguments);
      this.storage = localStorage;
    }

    LocalStorage.prototype.storageRegExpForRecord = function(record) {
      return new RegExp("^" + (this.storageKey(record)) + "(\\d+)$");
    };

    LocalStorage.prototype.nextIdForRecord = function(record) {
      var nextId, re;
      re = this.storageRegExpForRecord(record);
      nextId = 1;
      this._forAllStorageEntries(function(k, v) {
        var matches;
        if (matches = re.exec(k)) {
          return nextId = Math.max(nextId, parseInt(matches[1], 10) + 1);
        }
      });
      return nextId;
    };

    LocalStorage.prototype._forAllStorageEntries = function(iterator) {
      var i, key, _i, _ref;
      for (i = _i = 0, _ref = this.storage.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        key = this.storage.key(i);
        iterator.call(this, key, this.storage.getItem(key));
      }
      return true;
    };

    LocalStorage.prototype._storageEntriesMatching = function(constructor, options) {
      var re, records;
      re = this.storageRegExpForRecord(constructor.prototype);
      records = [];
      this._forAllStorageEntries(function(storageKey, storageString) {
        var data, keyMatches;
        if (keyMatches = re.exec(storageKey)) {
          data = this._jsonToAttributes(storageString);
          data[constructor.primaryKey] = keyMatches[1];
          if (this._dataMatches(options, data)) {
            return records.push(data);
          }
        }
      });
      return records;
    };

    LocalStorage.prototype._dataMatches = function(conditions, data) {
      var k, match, v;
      match = true;
      for (k in conditions) {
        v = conditions[k];
        if (data[k] !== v) {
          match = false;
          break;
        }
      }
      return match;
    };

    LocalStorage.prototype.before('read', 'create', 'update', 'destroy', LocalStorage.skipIfError(function(env, next) {
      var _this = this;
      if (env.action === 'create') {
        env.id = env.subject.get('id') || env.subject._withoutDirtyTracking(function() {
          return env.subject.set('id', _this.nextIdForRecord(env.subject));
        });
      } else {
        env.id = env.subject.get('id');
      }
      if (env.id == null) {
        env.error = new this.constructor.StorageError("Couldn't get/set record primary key on " + env.action + "!");
      } else {
        env.key = this.storageKey(env.subject) + env.id;
      }
      return next();
    }));

    LocalStorage.prototype.before('create', 'update', LocalStorage.skipIfError(function(env, next) {
      env.recordAttributes = JSON.stringify(env.subject);
      return next();
    }));

    LocalStorage.prototype.after('read', LocalStorage.skipIfError(function(env, next) {
      if (typeof env.recordAttributes === 'string') {
        try {
          env.recordAttributes = this._jsonToAttributes(env.recordAttributes);
        } catch (error) {
          env.error = error;
          return next();
        }
      }
      env.subject._withoutDirtyTracking(function() {
        return this.fromJSON(env.recordAttributes);
      });
      return next();
    }));

    LocalStorage.prototype.after('read', 'create', 'update', 'destroy', LocalStorage.skipIfError(function(env, next) {
      env.result = env.subject;
      return next();
    }));

    LocalStorage.prototype.after('readAll', LocalStorage.skipIfError(function(env, next) {
      var recordAttributes;
      env.result = env.records = (function() {
        var _i, _len, _ref, _results;
        _ref = env.recordsAttributes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          recordAttributes = _ref[_i];
          _results.push(this.getRecordFromData(recordAttributes, env.subject));
        }
        return _results;
      }).call(this);
      return next();
    }));

    LocalStorage.prototype.read = LocalStorage.skipIfError(function(env, next) {
      env.recordAttributes = this.storage.getItem(env.key);
      if (!env.recordAttributes) {
        env.error = new this.constructor.NotFoundError();
      }
      return next();
    });

    LocalStorage.prototype.create = LocalStorage.skipIfError(function(_arg, next) {
      var key, recordAttributes;
      key = _arg.key, recordAttributes = _arg.recordAttributes;
      if (this.storage.getItem(key)) {
        arguments[0].error = new this.constructor.RecordExistsError;
      } else {
        this.storage.setItem(key, recordAttributes);
      }
      return next();
    });

    LocalStorage.prototype.update = LocalStorage.skipIfError(function(_arg, next) {
      var key, recordAttributes;
      key = _arg.key, recordAttributes = _arg.recordAttributes;
      this.storage.setItem(key, recordAttributes);
      return next();
    });

    LocalStorage.prototype.destroy = LocalStorage.skipIfError(function(_arg, next) {
      var key;
      key = _arg.key;
      this.storage.removeItem(key);
      return next();
    });

    LocalStorage.prototype.readAll = LocalStorage.skipIfError(function(env, next) {
      try {
        arguments[0].recordsAttributes = this._storageEntriesMatching(env.subject, env.options.data);
      } catch (error) {
        arguments[0].error = error;
      }
      return next();
    });

    return LocalStorage;

  })(Batman.StorageAdapter);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.SessionStorage = (function(_super) {

    __extends(SessionStorage, _super);

    function SessionStorage() {
      if (typeof window.sessionStorage === 'undefined') {
        return null;
      }
      SessionStorage.__super__.constructor.apply(this, arguments);
      this.storage = sessionStorage;
    }

    return SessionStorage;

  })(Batman.LocalStorage);

}).call(this);

(function() {

  Batman.Encoders = new Batman.Object;

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.AssociationProxy = (function(_super) {

    __extends(AssociationProxy, _super);

    AssociationProxy.prototype.isProxy = true;

    function AssociationProxy(association, model) {
      this.association = association;
      this.model = model;
    }

    AssociationProxy.prototype.loaded = false;

    AssociationProxy.prototype.toJSON = function() {
      var target;
      target = this.get('target');
      if (target != null) {
        return this.get('target').toJSON();
      }
    };

    AssociationProxy.prototype.load = function(callback) {
      var _this = this;
      this.fetch(function(err, proxiedRecord) {
        if (!err) {
          _this.set('loaded', true);
          _this.set('target', proxiedRecord);
        }
        return typeof callback === "function" ? callback(err, proxiedRecord) : void 0;
      });
      return this.get('target');
    };

    AssociationProxy.prototype.fetch = function(callback) {
      var record;
      if ((this.get('foreignValue') || this.get('primaryValue')) == null) {
        return callback(void 0, void 0);
      }
      record = this.fetchFromLocal();
      if (record) {
        return callback(void 0, record);
      } else {
        return this.fetchFromRemote(callback);
      }
    };

    AssociationProxy.accessor('loaded', Batman.Property.defaultAccessor);

    AssociationProxy.accessor('target', {
      get: function() {
        return this.fetchFromLocal();
      },
      set: function(_, v) {
        return v;
      }
    });

    AssociationProxy.accessor({
      get: function(k) {
        var _ref;
        return (_ref = this.get('target')) != null ? _ref.get(k) : void 0;
      },
      set: function(k, v) {
        var _ref;
        return (_ref = this.get('target')) != null ? _ref.set(k, v) : void 0;
      }
    });

    return AssociationProxy;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.HasOneProxy = (function(_super) {

    __extends(HasOneProxy, _super);

    function HasOneProxy() {
      return HasOneProxy.__super__.constructor.apply(this, arguments);
    }

    HasOneProxy.accessor('primaryValue', function() {
      return this.model.get(this.association.primaryKey);
    });

    HasOneProxy.prototype.fetchFromLocal = function() {
      return this.association.setIndex().get(this.get('primaryValue'));
    };

    HasOneProxy.prototype.fetchFromRemote = function(callback) {
      var loadOptions,
        _this = this;
      loadOptions = {};
      loadOptions[this.association.foreignKey] = this.get('primaryValue');
      return this.association.getRelatedModel().load(loadOptions, function(error, loadedRecords) {
        if (error) {
          throw error;
        }
        if (!loadedRecords || loadedRecords.length <= 0) {
          return callback(new Error("Couldn't find related record!"), void 0);
        } else {
          return callback(void 0, loadedRecords[0]);
        }
      });
    };

    return HasOneProxy;

  })(Batman.AssociationProxy);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.BelongsToProxy = (function(_super) {

    __extends(BelongsToProxy, _super);

    function BelongsToProxy() {
      return BelongsToProxy.__super__.constructor.apply(this, arguments);
    }

    BelongsToProxy.accessor('foreignValue', function() {
      return this.model.get(this.association.foreignKey);
    });

    BelongsToProxy.prototype.fetchFromLocal = function() {
      return this.association.setIndex().get(this.get('foreignValue'));
    };

    BelongsToProxy.prototype.fetchFromRemote = function(callback) {
      var _this = this;
      return this.association.getRelatedModel().find(this.get('foreignValue'), function(error, loadedRecord) {
        if (error) {
          throw error;
        }
        return callback(void 0, loadedRecord);
      });
    };

    return BelongsToProxy;

  })(Batman.AssociationProxy);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PolymorphicBelongsToProxy = (function(_super) {

    __extends(PolymorphicBelongsToProxy, _super);

    function PolymorphicBelongsToProxy() {
      return PolymorphicBelongsToProxy.__super__.constructor.apply(this, arguments);
    }

    PolymorphicBelongsToProxy.accessor('foreignTypeValue', function() {
      return this.model.get(this.association.foreignTypeKey);
    });

    PolymorphicBelongsToProxy.prototype.fetchFromLocal = function() {
      return this.association.setIndexForType(this.get('foreignTypeValue')).get(this.get('foreignValue'));
    };

    PolymorphicBelongsToProxy.prototype.fetchFromRemote = function(callback) {
      var _this = this;
      return this.association.getRelatedModelForType(this.get('foreignTypeValue')).find(this.get('foreignValue'), function(error, loadedRecord) {
        if (error) {
          throw error;
        }
        return callback(void 0, loadedRecord);
      });
    };

    return PolymorphicBelongsToProxy;

  })(Batman.BelongsToProxy);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.StateMachine = (function(_super) {

    __extends(StateMachine, _super);

    StateMachine.InvalidTransitionError = function(message) {
      this.message = message != null ? message : "";
    };

    StateMachine.InvalidTransitionError.prototype = new Error;

    StateMachine.transitions = function(table) {
      var definePredicate, fromState, k, object, predicateKeys, toState, transitions, v, _fn, _ref,
        _this = this;
      for (k in table) {
        v = table[k];
        if (!(v.from && v.to)) {
          continue;
        }
        object = {};
        if (v.from.forEach) {
          v.from.forEach(function(fromKey) {
            return object[fromKey] = v.to;
          });
        } else {
          object[v.from] = v.to;
        }
        table[k] = object;
      }
      this.prototype.transitionTable = Batman.extend({}, this.prototype.transitionTable, table);
      predicateKeys = [];
      definePredicate = function(state) {
        var key;
        key = "is" + (Batman.helpers.capitalize(state));
        if (_this.prototype[key] != null) {
          return;
        }
        predicateKeys.push(key);
        return _this.prototype[key] = function() {
          return this.get('state') === state;
        };
      };
      _ref = this.prototype.transitionTable;
      _fn = function(k) {
        return _this.prototype[k] = function() {
          return this.startTransition(k);
        };
      };
      for (k in _ref) {
        transitions = _ref[k];
        if (!(!this.prototype[k])) {
          continue;
        }
        _fn(k);
        for (fromState in transitions) {
          toState = transitions[fromState];
          definePredicate(fromState);
          definePredicate(toState);
        }
      }
      if (predicateKeys.length) {
        this.accessor.apply(this, __slice.call(predicateKeys).concat([function(key) {
          return this[key]();
        }]));
      }
      return this;
    };

    function StateMachine(startState) {
      this.nextEvents = [];
      this.set('_state', startState);
    }

    StateMachine.accessor('state', function() {
      return this.get('_state');
    });

    StateMachine.prototype.isTransitioning = false;

    StateMachine.prototype.transitionTable = {};

    StateMachine.prototype.onTransition = function(from, into, callback) {
      return this.on("" + from + "->" + into, callback);
    };

    StateMachine.prototype.onEnter = function(into, callback) {
      return this.on("enter " + into, callback);
    };

    StateMachine.prototype.onExit = function(from, callback) {
      return this.on("exit " + from, callback);
    };

    StateMachine.prototype.startTransition = Batman.Property.wrapTrackingPrevention(function(event) {
      var nextState, previousState;
      if (this.isTransitioning) {
        this.nextEvents.push(event);
        return;
      }
      previousState = this.get('state');
      nextState = this.nextStateForEvent(event);
      if (!nextState) {
        return false;
      }
      this.isTransitioning = true;
      this.fire("exit " + previousState);
      this.set('_state', nextState);
      this.fire("" + previousState + "->" + nextState);
      this.fire("enter " + nextState);
      this.fire(event);
      this.isTransitioning = false;
      if (this.nextEvents.length > 0) {
        this.startTransition(this.nextEvents.shift());
      }
      return true;
    });

    StateMachine.prototype.canStartTransition = function(event, fromState) {
      if (fromState == null) {
        fromState = this.get('state');
      }
      return !!this.nextStateForEvent(event, fromState);
    };

    StateMachine.prototype.nextStateForEvent = function(event, fromState) {
      var _ref;
      if (fromState == null) {
        fromState = this.get('state');
      }
      return (_ref = this.transitionTable[event]) != null ? _ref[fromState] : void 0;
    };

    return StateMachine;

  })(Batman.Object);

  Batman.DelegatingStateMachine = (function(_super) {

    __extends(DelegatingStateMachine, _super);

    function DelegatingStateMachine(startState, base) {
      this.base = base;
      DelegatingStateMachine.__super__.constructor.call(this, startState);
    }

    DelegatingStateMachine.prototype.fire = function() {
      var result, _ref;
      result = DelegatingStateMachine.__super__.fire.apply(this, arguments);
      (_ref = this.base).fire.apply(_ref, arguments);
      return result;
    };

    return DelegatingStateMachine;

  })(Batman.StateMachine);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.Model = (function(_super) {
    var functionName, _i, _j, _len, _len1, _ref, _ref1;

    __extends(Model, _super);

    Model.primaryKey = 'id';

    Model.storageKey = null;

    Model.persist = function(mechanism, options) {
      Batman.initializeObject(this.prototype);
      mechanism = mechanism.isStorageAdapter ? mechanism : new mechanism(this);
      if (options) {
        Batman.mixin(mechanism, options);
      }
      this.prototype._batman.storage = mechanism;
      return mechanism;
    };

    Model.storageAdapter = function() {
      Batman.initializeObject(this.prototype);
      return this.prototype._batman.storage;
    };

    Model.encode = function() {
      var encoder, encoderOrLastKey, hash, key, keys, operation, _base, _base1, _i, _j, _k, _len, _len1, _ref;
      keys = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), encoderOrLastKey = arguments[_i++];
      Batman.initializeObject(this.prototype);
      (_base = this.prototype._batman).encoders || (_base.encoders = new Batman.SimpleHash);
      (_base1 = this.prototype._batman).decoders || (_base1.decoders = new Batman.SimpleHash);
      encoder = {};
      switch (Batman.typeOf(encoderOrLastKey)) {
        case 'String':
          keys.push(encoderOrLastKey);
          break;
        case 'Function':
          encoder.encode = encoderOrLastKey;
          break;
        default:
          if (encoderOrLastKey.encode != null) {
            encoder.encode = encoderOrLastKey.encode;
          }
          if (encoderOrLastKey.decode != null) {
            encoder.decode = encoderOrLastKey.decode;
          }
      }
      encoder = Batman.extend({}, this.defaultEncoder, encoder);
      _ref = ['encode', 'decode'];
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        operation = _ref[_j];
        for (_k = 0, _len1 = keys.length; _k < _len1; _k++) {
          key = keys[_k];
          hash = this.prototype._batman["" + operation + "rs"];
          if (encoder[operation]) {
            hash.set(key, encoder[operation]);
          } else {
            hash.unset(key);
          }
        }
      }
    };

    Model.defaultEncoder = {
      encode: function(x) {
        return x;
      },
      decode: function(x) {
        return x;
      }
    };

    Model.observeAndFire('primaryKey', function(newPrimaryKey, oldPrimaryKey) {
      this.encode(oldPrimaryKey, {
        encode: false,
        decode: false
      });
      return this.encode(newPrimaryKey, {
        encode: false,
        decode: this.defaultEncoder.decode
      });
    });

    Model.validate = function() {
      var keys, match, matches, options, optionsOrFunction, validator, validators, _base, _i, _j, _k, _len, _len1, _ref, _results;
      keys = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), optionsOrFunction = arguments[_i++];
      Batman.initializeObject(this.prototype);
      validators = (_base = this.prototype._batman).validators || (_base.validators = []);
      if (typeof optionsOrFunction === 'function') {
        return validators.push({
          keys: keys,
          callback: optionsOrFunction
        });
      } else {
        options = optionsOrFunction;
        _ref = Batman.Validators;
        _results = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          validator = _ref[_j];
          if ((matches = validator.matches(options))) {
            for (_k = 0, _len1 = matches.length; _k < _len1; _k++) {
              match = matches[_k];
              delete options[match];
            }
            _results.push(validators.push({
              keys: keys,
              validator: new validator(matches)
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Model.LifecycleStateMachine = (function(_super1) {

      __extends(LifecycleStateMachine, _super1);

      function LifecycleStateMachine() {
        return LifecycleStateMachine.__super__.constructor.apply(this, arguments);
      }

      LifecycleStateMachine.transitions({
        load: {
          empty: 'loading',
          loaded: 'loading',
          loading: 'loading'
        },
        loaded: {
          loading: 'loaded'
        },
        error: {
          loading: 'error'
        }
      });

      return LifecycleStateMachine;

    })(Batman.DelegatingStateMachine);

    Model.classAccessor('lifecycle', function() {
      var _base;
      this._batman.check(this);
      return (_base = this._batman).lifecycle || (_base.lifecycle = new this.LifecycleStateMachine('empty', this));
    });

    Model.classAccessor('resourceName', {
      get: function() {
        if (this.resourceName != null) {
          return this.resourceName;
        } else {
          if (Batman.config.minificationErrors) {
            Batman.developer.error("Please define " + (Batman.functionName(this)) + ".resourceName in order for your model to be minification safe.");
          }
          return Batman.helpers.underscore(Batman.functionName(this));
        }
      }
    });

    Model.classAccessor('all', {
      get: function() {
        this._batman.check(this);
        if (this.prototype.hasStorage() && !this._batman.allLoadTriggered) {
          this.load();
          this._batman.allLoadTriggered = true;
        }
        return this.get('loaded');
      },
      set: function(k, v) {
        return this.set('loaded', v);
      }
    });

    Model.classAccessor('loaded', {
      get: function() {
        return this._loaded || (this._loaded = new Batman.Set);
      },
      set: function(k, v) {
        return this._loaded = v;
      }
    });

    Model.classAccessor('first', function() {
      return this.get('all').toArray()[0];
    });

    Model.classAccessor('last', function() {
      var x;
      x = this.get('all').toArray();
      return x[x.length - 1];
    });

    Model.clear = function() {
      var result, _ref;
      Batman.initializeObject(this);
      result = this.get('loaded').clear();
      if ((_ref = this._batman.get('associations')) != null) {
        _ref.reset();
      }
      return result;
    };

    Model.find = function(id, callback) {
      var record;
      Batman.developer.assert(callback, "Must call find with a callback!");
      record = new this();
      record._withoutDirtyTracking(function() {
        return this.set('id', id);
      });
      record.load(callback);
      return record;
    };

    Model.load = function(options, callback) {
      var lifecycle, _ref,
        _this = this;
      if ((_ref = typeof options) === 'function' || _ref === 'undefined') {
        callback = options;
        options = {};
      }
      lifecycle = this.get('lifecycle');
      if (lifecycle.load()) {
        return this._doStorageOperation('readAll', {
          data: options
        }, function(err, records, env) {
          var mappedRecords, record;
          if (err != null) {
            lifecycle.error();
            return typeof callback === "function" ? callback(err, []) : void 0;
          } else {
            mappedRecords = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = records.length; _i < _len; _i++) {
                record = records[_i];
                _results.push(this._mapIdentity(record));
              }
              return _results;
            }).call(_this);
            lifecycle.loaded();
            return typeof callback === "function" ? callback(err, mappedRecords, env) : void 0;
          }
        });
      } else {
        return callback(new Batman.StateMachine.InvalidTransitionError("Can't load while in state " + (lifecycle.get('state'))));
      }
    };

    Model.create = function(attrs, callback) {
      var obj, _ref;
      if (!callback) {
        _ref = [{}, attrs], attrs = _ref[0], callback = _ref[1];
      }
      obj = new this(attrs);
      obj.save(callback);
      return obj;
    };

    Model.findOrCreate = function(attrs, callback) {
      var foundRecord, record;
      record = new this(attrs);
      if (record.isNew()) {
        record.save(callback);
      } else {
        foundRecord = this._mapIdentity(record);
        callback(void 0, foundRecord);
      }
      return record;
    };

    Model._mapIdentity = function(record) {
      var existing, id, _ref;
      if (typeof (id = record.get('id')) === 'undefined' || id === '') {
        return record;
      } else {
        existing = (_ref = this.get("loaded.indexedBy.id").get(id)) != null ? _ref.toArray()[0] : void 0;
        if (existing) {
          existing._withoutDirtyTracking(function() {
            var _ref1;
            return this.updateAttributes(((_ref1 = record.get('attributes')) != null ? _ref1.toObject() : void 0) || {});
          });
          return existing;
        } else {
          this.get('loaded').add(record);
          return record;
        }
      }
    };

    Model._doStorageOperation = function(operation, options, callback) {
      var adapter;
      Batman.developer.assert(this.prototype.hasStorage(), "Can't " + operation + " model " + (Batman.functionName(this.constructor)) + " without any storage adapters!");
      adapter = this.prototype._batman.get('storage');
      return adapter.perform(operation, this, options, callback);
    };

    _ref = ['find', 'load', 'create'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      functionName = _ref[_i];
      Model[functionName] = Batman.Property.wrapTrackingPrevention(Model[functionName]);
    }

    Model.InstanceLifecycleStateMachine = (function(_super1) {

      __extends(InstanceLifecycleStateMachine, _super1);

      function InstanceLifecycleStateMachine() {
        return InstanceLifecycleStateMachine.__super__.constructor.apply(this, arguments);
      }

      InstanceLifecycleStateMachine.transitions({
        load: {
          from: ['dirty', 'clean'],
          to: 'loading'
        },
        create: {
          from: ['dirty', 'clean'],
          to: 'creating'
        },
        save: {
          from: ['dirty', 'clean'],
          to: 'saving'
        },
        destroy: {
          from: ['dirty', 'clean'],
          to: 'destroying'
        },
        failedValidation: {
          from: ['saving', 'creating'],
          to: 'dirty'
        },
        loaded: {
          loading: 'clean'
        },
        created: {
          creating: 'clean'
        },
        saved: {
          saving: 'clean'
        },
        destroyed: {
          destroying: 'destroyed'
        },
        set: {
          from: ['dirty', 'clean'],
          to: 'dirty'
        },
        error: {
          from: ['saving', 'creating', 'loading', 'destroying'],
          to: 'error'
        }
      });

      return InstanceLifecycleStateMachine;

    })(Batman.DelegatingStateMachine);

    function Model(idOrAttributes) {
      if (idOrAttributes == null) {
        idOrAttributes = {};
      }
      this.destroy = __bind(this.destroy, this);

      this.save = __bind(this.save, this);

      this.load = __bind(this.load, this);

      Batman.developer.assert(this instanceof Batman.Object, "constructors must be called with new");
      if (Batman.typeOf(idOrAttributes) === 'Object') {
        Model.__super__.constructor.call(this, idOrAttributes);
      } else {
        Model.__super__.constructor.call(this);
        this.set('id', idOrAttributes);
      }
    }

    Model.accessor('lifecycle', function() {
      return this.lifecycle || (this.lifecycle = new Batman.Model.InstanceLifecycleStateMachine('clean', this));
    });

    Model.accessor('attributes', function() {
      return this.attributes || (this.attributes = new Batman.Hash);
    });

    Model.accessor('dirtyKeys', function() {
      return this.dirtyKeys || (this.dirtyKeys = new Batman.Hash);
    });

    Model.accessor('_dirtiedKeys', function() {
      return this._dirtiedKeys || (this._dirtiedKeys = new Batman.SimpleSet);
    });

    Model.accessor('errors', function() {
      return this.errors || (this.errors = new Batman.ErrorsSet);
    });

    Model.accessor('isNew', function() {
      return this.isNew();
    });

    Model.accessor(Model.defaultAccessor = {
      get: function(k) {
        return Batman.getPath(this, ['attributes', k]);
      },
      set: function(k, v) {
        if (this._willSet(k)) {
          return this.get('attributes').set(k, v);
        } else {
          return this.get(k);
        }
      },
      unset: function(k) {
        return this.get('attributes').unset(k);
      }
    });

    Model.wrapAccessor('id', function(core) {
      return {
        get: function() {
          var primaryKey;
          primaryKey = this.constructor.primaryKey;
          if (primaryKey === 'id') {
            return core.get.apply(this, arguments);
          } else {
            return this.get(primaryKey);
          }
        },
        set: function(key, value) {
          var parsedValue, primaryKey;
          if ((typeof value === "string") && (value.match(/[^0-9]/) === null) && (("" + (parsedValue = parseInt(value, 10))) === value)) {
            value = parsedValue;
          }
          primaryKey = this.constructor.primaryKey;
          if (primaryKey === 'id') {
            this._willSet(key);
            return core.set.apply(this, arguments);
          } else {
            return this.set(primaryKey, value);
          }
        }
      };
    });

    Model.prototype.isNew = function() {
      return typeof this.get('id') === 'undefined';
    };

    Model.prototype.updateAttributes = function(attrs) {
      this.mixin(attrs);
      return this;
    };

    Model.prototype.toString = function() {
      return "" + (this.constructor.get('resourceName')) + ": " + (this.get('id'));
    };

    Model.prototype.toParam = function() {
      return this.get('id');
    };

    Model.prototype.toJSON = function() {
      var encoders, obj,
        _this = this;
      obj = {};
      encoders = this._batman.get('encoders');
      if (!(!encoders || encoders.isEmpty())) {
        encoders.forEach(function(key, encoder) {
          var encodedVal, val;
          val = _this.get(key);
          if (typeof val !== 'undefined') {
            encodedVal = encoder(val, key, obj, _this);
            if (typeof encodedVal !== 'undefined') {
              return obj[key] = encodedVal;
            }
          }
        });
      }
      return obj;
    };

    Model.prototype.fromJSON = function(data) {
      var decoders, key, obj, value,
        _this = this;
      obj = {};
      decoders = this._batman.get('decoders');
      if (!decoders || decoders.isEmpty()) {
        for (key in data) {
          value = data[key];
          obj[key] = value;
        }
      } else {
        decoders.forEach(function(key, decoder) {
          if (typeof data[key] !== 'undefined') {
            return obj[key] = decoder(data[key], key, data, obj, _this);
          }
        });
      }
      if (this.constructor.primaryKey !== 'id') {
        obj.id = data[this.constructor.primaryKey];
      }
      Batman.developer["do"](function() {
        if ((!decoders) || decoders.length <= 1) {
          return Batman.developer.warn("Warning: Model " + (Batman.functionName(_this.constructor)) + " has suspiciously few decoders!");
        }
      });
      return this.mixin(obj);
    };

    Model.prototype.hasStorage = function() {
      return this._batman.get('storage') != null;
    };

    Model.prototype.load = function(options, callback) {
      var callbackQueue, hasOptions, _ref1, _ref2,
        _this = this;
      if (!callback) {
        _ref1 = [{}, options], options = _ref1[0], callback = _ref1[1];
      }
      hasOptions = Object.keys(options).length !== 0;
      if ((_ref2 = this.get('lifecycle.state')) === 'destroying' || _ref2 === 'destroyed') {
        if (typeof callback === "function") {
          callback(new Error("Can't load a destroyed record!"));
        }
        return;
      }
      if (this.get('lifecycle').load()) {
        callbackQueue = [];
        if (callback != null) {
          callbackQueue.push(callback);
        }
        if (!hasOptions) {
          this._currentLoad = callbackQueue;
        }
        return this._doStorageOperation('read', {
          data: options
        }, function(err, record, env) {
          var _j, _len1;
          if (!err) {
            _this.get('lifecycle').loaded();
            record = _this.constructor._mapIdentity(record);
          } else {
            _this.get('lifecycle').error();
          }
          if (!hasOptions) {
            _this._currentLoad = null;
          }
          for (_j = 0, _len1 = callbackQueue.length; _j < _len1; _j++) {
            callback = callbackQueue[_j];
            callback(err, record, env);
          }
        });
      } else {
        if (this.get('lifecycle.state') === 'loading' && !hasOptions) {
          if (callback != null) {
            return this._currentLoad.push(callback);
          }
        } else {
          return typeof callback === "function" ? callback(new Batman.StateMachine.InvalidTransitionError("Can't load while in state " + (this.get('lifecycle.state')))) : void 0;
        }
      }
    };

    Model.prototype.save = function(options, callback) {
      var endState, isNew, startState, storageOperation, _ref1, _ref2, _ref3,
        _this = this;
      if (!callback) {
        _ref1 = [{}, options], options = _ref1[0], callback = _ref1[1];
      }
      if ((_ref2 = this.get('lifecycle').get('state')) === 'destroying' || _ref2 === 'destroyed') {
        if (typeof callback === "function") {
          callback(new Error("Can't save a destroyed record!"));
        }
        return;
      }
      isNew = this.isNew();
      _ref3 = isNew ? ['create', 'create', 'created'] : ['save', 'update', 'saved'], startState = _ref3[0], storageOperation = _ref3[1], endState = _ref3[2];
      return this.validate(function(error, errors) {
        var associations, creating;
        if (error || errors.length) {
          _this.get('lifecycle').failedValidation();
          if (typeof callback === "function") {
            callback(error || errors, _this);
          }
          return;
        }
        creating = _this.isNew();
        if (_this.get('lifecycle').startTransition(startState)) {
          associations = _this.constructor._batman.get('associations');
          _this._withoutDirtyTracking(function() {
            var _ref4,
              _this = this;
            return associations != null ? (_ref4 = associations.getByType('belongsTo')) != null ? _ref4.forEach(function(association, label) {
              return association.apply(_this);
            }) : void 0 : void 0;
          });
          return _this._doStorageOperation(storageOperation, {
            data: options
          }, function(err, record, env) {
            if (!err) {
              _this.get('dirtyKeys').clear();
              _this.get('_dirtiedKeys').clear();
              if (associations) {
                record._withoutDirtyTracking(function() {
                  var _ref4, _ref5;
                  if ((_ref4 = associations.getByType('hasOne')) != null) {
                    _ref4.forEach(function(association, label) {
                      return association.apply(err, record);
                    });
                  }
                  return (_ref5 = associations.getByType('hasMany')) != null ? _ref5.forEach(function(association, label) {
                    return association.apply(err, record);
                  }) : void 0;
                });
              }
              record = _this.constructor._mapIdentity(record);
              _this.get('lifecycle').startTransition(endState);
            } else {
              if (err instanceof Batman.ErrorsSet) {
                _this.get('lifecycle').failedValidation();
              } else {
                _this.get('lifecycle').error();
              }
            }
            return typeof callback === "function" ? callback(err, record || _this, env) : void 0;
          });
        } else {
          return typeof callback === "function" ? callback(new Batman.StateMachine.InvalidTransitionError("Can't save while in state " + (_this.get('lifecycle.state')))) : void 0;
        }
      });
    };

    Model.prototype.destroy = function(options, callback) {
      var _ref1,
        _this = this;
      if (!callback) {
        _ref1 = [{}, options], options = _ref1[0], callback = _ref1[1];
      }
      if (this.get('lifecycle').destroy()) {
        return this._doStorageOperation('destroy', {
          data: options
        }, function(err, record, env) {
          if (!err) {
            _this.constructor.get('loaded').remove(_this);
            _this.get('lifecycle').destroyed();
          } else {
            _this.get('lifecycle').error();
          }
          return typeof callback === "function" ? callback(err, record, env) : void 0;
        });
      } else {
        return typeof callback === "function" ? callback(new Batman.StateMachine.InvalidTransitionError("Can't destroy while in state " + (this.get('lifecycle.state')))) : void 0;
      }
    };

    Model.prototype.validate = function(callback) {
      var args, count, errors, finishedValidation, key, validator, validators, _j, _k, _len1, _len2, _ref1;
      errors = this.get('errors');
      errors.clear();
      validators = this._batman.get('validators') || [];
      if (!validators || validators.length === 0) {
        if (typeof callback === "function") {
          callback(void 0, errors);
        }
        return true;
      }
      count = validators.reduce((function(acc, validator) {
        return acc + validator.keys.length;
      }), 0);
      finishedValidation = function() {
        if (--count === 0) {
          return typeof callback === "function" ? callback(void 0, errors) : void 0;
        }
      };
      for (_j = 0, _len1 = validators.length; _j < _len1; _j++) {
        validator = validators[_j];
        _ref1 = validator.keys;
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          key = _ref1[_k];
          args = [errors, this, key, finishedValidation];
          try {
            if (validator.validator) {
              validator.validator.validateEach.apply(validator.validator, args);
            } else {
              validator.callback.apply(validator, args);
            }
          } catch (e) {
            if (typeof callback === "function") {
              callback(e, errors);
            }
          }
        }
      }
    };

    Model.prototype.associationProxy = function(association) {
      var proxies, _base, _name;
      Batman.initializeObject(this);
      proxies = (_base = this._batman).associationProxies || (_base.associationProxies = {});
      proxies[_name = association.label] || (proxies[_name] = new association.proxyClass(association, this));
      return proxies[association.label];
    };

    Model.prototype._willSet = function(key) {
      if (this._pauseDirtyTracking) {
        return true;
      }
      if (this.get('lifecycle').startTransition('set')) {
        if (!this.get('_dirtiedKeys').has(key)) {
          this.set("dirtyKeys." + key, this.get(key));
          this.get('_dirtiedKeys').add(key);
        }
        return true;
      } else {
        return false;
      }
    };

    Model.prototype._doStorageOperation = function(operation, options, callback) {
      var adapter,
        _this = this;
      Batman.developer.assert(this.hasStorage(), "Can't " + operation + " model " + (Batman.functionName(this.constructor)) + " without any storage adapters!");
      adapter = this._batman.get('storage');
      return adapter.perform(operation, this, options, function() {
        return callback.apply(null, arguments);
      });
    };

    Model.prototype._withoutDirtyTracking = function(block) {
      var result;
      this._pauseDirtyTracking = true;
      result = block.call(this);
      this._pauseDirtyTracking = false;
      return result;
    };

    _ref1 = ['load', 'save', 'validate', 'destroy'];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      functionName = _ref1[_j];
      Model.prototype[functionName] = Batman.Property.wrapTrackingPrevention(Model.prototype[functionName]);
    }

    return Model;

  }).call(this, Batman.Object);

}).call(this);

(function() {
  var k, _fn, _i, _len, _ref,
    _this = this;

  _ref = Batman.AssociationCurator.availableAssociations;
  _fn = function(k) {
    return Batman.Model[k] = function(label, scope) {
      var collection, _base;
      Batman.initializeObject(this);
      collection = (_base = this._batman).associations || (_base.associations = new Batman.AssociationCurator(this));
      return collection.add(new Batman["" + (Batman.helpers.capitalize(k)) + "Association"](this, label, scope));
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    k = _ref[_i];
    _fn(k);
  }

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.ParamsReplacer = (function(_super) {

    __extends(ParamsReplacer, _super);

    function ParamsReplacer(navigator, params) {
      this.navigator = navigator;
      this.params = params;
    }

    ParamsReplacer.prototype.redirect = function() {
      return this.navigator.replace(this.toObject());
    };

    ParamsReplacer.prototype.replace = function(params) {
      this.params.replace(params);
      return this.redirect();
    };

    ParamsReplacer.prototype.update = function(params) {
      this.params.update(params);
      return this.redirect();
    };

    ParamsReplacer.prototype.clear = function() {
      this.params.clear();
      return this.redirect();
    };

    ParamsReplacer.prototype.toObject = function() {
      return this.params.toObject();
    };

    ParamsReplacer.accessor({
      get: function(k) {
        return this.params.get(k);
      },
      set: function(k, v) {
        var oldValue, result;
        oldValue = this.params.get(k);
        result = this.params.set(k, v);
        if (oldValue !== v) {
          this.redirect();
        }
        return result;
      },
      unset: function(k) {
        var hadKey, result;
        hadKey = this.params.hasKey(k);
        result = this.params.unset(k);
        if (hadKey) {
          this.redirect();
        }
        return result;
      }
    });

    return ParamsReplacer;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.ParamsPusher = (function(_super) {

    __extends(ParamsPusher, _super);

    function ParamsPusher() {
      return ParamsPusher.__super__.constructor.apply(this, arguments);
    }

    ParamsPusher.prototype.redirect = function() {
      return this.navigator.push(this.toObject());
    };

    return ParamsPusher;

  })(Batman.ParamsReplacer);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.NamedRouteQuery = (function(_super) {

    __extends(NamedRouteQuery, _super);

    NamedRouteQuery.prototype.isNamedRouteQuery = true;

    function NamedRouteQuery(routeMap, args) {
      var key;
      if (args == null) {
        args = [];
      }
      NamedRouteQuery.__super__.constructor.call(this, {
        routeMap: routeMap,
        args: args
      });
      for (key in this.get('routeMap').childrenByName) {
        this[key] = this._queryAccess.bind(this, key);
      }
    }

    NamedRouteQuery.accessor('route', function() {
      var collectionRoute, memberRoute, route, _i, _len, _ref, _ref1;
      _ref = this.get('routeMap'), memberRoute = _ref.memberRoute, collectionRoute = _ref.collectionRoute;
      _ref1 = [memberRoute, collectionRoute];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        route = _ref1[_i];
        if (route != null) {
          if (route.namedArguments.length === this.get('args').length) {
            return route;
          }
        }
      }
      return collectionRoute || memberRoute;
    });

    NamedRouteQuery.accessor('path', function() {
      return this.path();
    });

    NamedRouteQuery.accessor('routeMap', 'args', 'cardinality', 'hashValue', Batman.Property.defaultAccessor);

    NamedRouteQuery.accessor({
      get: function(key) {
        if (key == null) {
          return;
        }
        if (typeof key === 'string') {
          return this.nextQueryForName(key);
        } else {
          return this.nextQueryWithArgument(key);
        }
      },
      cache: false
    });

    NamedRouteQuery.accessor('withHash', function() {
      var _this = this;
      return new Batman.Accessible(function(hashValue) {
        return _this.withHash(hashValue);
      });
    });

    NamedRouteQuery.prototype.withHash = function(hashValue) {
      var clone;
      clone = this.clone();
      clone.set('hashValue', hashValue);
      return clone;
    };

    NamedRouteQuery.prototype.nextQueryForName = function(key) {
      var map;
      if (map = this.get('routeMap').childrenByName[key]) {
        return new Batman.NamedRouteQuery(map, this.args);
      } else {
        return Batman.developer.error("Couldn't find a route for the name " + key + "!");
      }
    };

    NamedRouteQuery.prototype.nextQueryWithArgument = function(arg) {
      var args;
      args = this.args.slice(0);
      args.push(arg);
      return this.clone(args);
    };

    NamedRouteQuery.prototype.path = function() {
      var argumentName, argumentValue, index, namedArguments, params, _i, _len;
      params = {};
      namedArguments = this.get('route.namedArguments');
      for (index = _i = 0, _len = namedArguments.length; _i < _len; index = ++_i) {
        argumentName = namedArguments[index];
        if ((argumentValue = this.get('args')[index]) != null) {
          params[argumentName] = this._toParam(argumentValue);
        }
      }
      if (this.get('hashValue') != null) {
        params['#'] = this.get('hashValue');
      }
      return this.get('route').pathFromParams(params);
    };

    NamedRouteQuery.prototype.toString = function() {
      return this.path();
    };

    NamedRouteQuery.prototype.clone = function(args) {
      if (args == null) {
        args = this.args;
      }
      return new Batman.NamedRouteQuery(this.routeMap, args);
    };

    NamedRouteQuery.prototype._toParam = function(arg) {
      if (arg instanceof Batman.AssociationProxy) {
        arg = arg.get('target');
      }
      if ((arg != null ? arg.toParam : void 0) != null) {
        return arg.toParam();
      } else {
        return arg;
      }
    };

    NamedRouteQuery.prototype._queryAccess = function(key, arg) {
      var query;
      query = this.nextQueryForName(key);
      if (arg != null) {
        query = query.nextQueryWithArgument(arg);
      }
      return query;
    };

    return NamedRouteQuery;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.Dispatcher = (function(_super) {
    var ControllerDirectory;

    __extends(Dispatcher, _super);

    Dispatcher.canInferRoute = function(argument) {
      return argument instanceof Batman.Model || argument instanceof Batman.AssociationProxy || argument.prototype instanceof Batman.Model;
    };

    Dispatcher.paramsFromArgument = function(argument) {
      var resourceNameFromModel;
      resourceNameFromModel = function(model) {
        return Batman.helpers.camelize(Batman.helpers.pluralize(model.get('resourceName')), true);
      };
      if (!this.canInferRoute(argument)) {
        return argument;
      }
      if (argument instanceof Batman.Model || argument instanceof Batman.AssociationProxy) {
        if (argument.isProxy) {
          argument = argument.get('target');
        }
        if (argument != null) {
          return {
            controller: resourceNameFromModel(argument.constructor),
            action: 'show',
            id: argument.get('id')
          };
        } else {
          return {};
        }
      } else if (argument.prototype instanceof Batman.Model) {
        return {
          controller: resourceNameFromModel(argument),
          action: 'index'
        };
      } else {
        return argument;
      }
    };

    ControllerDirectory = (function(_super1) {

      __extends(ControllerDirectory, _super1);

      function ControllerDirectory() {
        return ControllerDirectory.__super__.constructor.apply(this, arguments);
      }

      ControllerDirectory.accessor('__app', Batman.Property.defaultAccessor);

      ControllerDirectory.accessor(function(key) {
        return this.get("__app." + (Batman.helpers.capitalize(key)) + "Controller.sharedController");
      });

      return ControllerDirectory;

    })(Batman.Object);

    Dispatcher.accessor('controllers', function() {
      return new ControllerDirectory({
        __app: this.get('app')
      });
    });

    function Dispatcher(app, routeMap) {
      Dispatcher.__super__.constructor.call(this, {
        app: app,
        routeMap: routeMap
      });
    }

    Dispatcher.prototype.routeForParams = function(params) {
      params = this.constructor.paramsFromArgument(params);
      return this.get('routeMap').routeForParams(params);
    };

    Dispatcher.prototype.pathFromParams = function(params) {
      var _ref;
      if (typeof params === 'string') {
        return params;
      }
      params = this.constructor.paramsFromArgument(params);
      return (_ref = this.routeForParams(params)) != null ? _ref.pathFromParams(params) : void 0;
    };

    Dispatcher.prototype.dispatch = function(params) {
      var inferredParams, path, route, _ref;
      inferredParams = this.constructor.paramsFromArgument(params);
      route = this.routeForParams(inferredParams);
      if (route) {
        _ref = route.pathAndParamsFromArgument(inferredParams), path = _ref[0], params = _ref[1];
        this.set('app.currentRoute', route);
        this.set('app.currentURL', path);
        this.get('app.currentParams').replace(params || {});
        route.dispatch(params);
      } else {
        if (Batman.typeOf(params) === 'Object' && !this.constructor.canInferRoute(params)) {
          return this.get('app.currentParams').replace(params);
        } else {
          this.get('app.currentParams').clear();
        }
        if (params !== '/404') {
          return Batman.redirect('/404');
        }
      }
      return path;
    };

    return Dispatcher;

  }).call(this, Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.Route = (function(_super) {

    __extends(Route, _super);

    Route.regexps = {
      namedParam: /:([\w\d]+)/g,
      splatParam: /\*([\w\d]+)/g,
      queryParam: '(?:\\?.+)?',
      namedOrSplat: /[:|\*]([\w\d]+)/g,
      namePrefix: '[:|\*]',
      escapeRegExp: /[-[\]{}()+?.,\\^$|#\s]/g
    };

    Route.prototype.optionKeys = ['member', 'collection'];

    Route.prototype.testKeys = ['controller', 'action'];

    Route.prototype.isRoute = true;

    function Route(templatePath, baseParams) {
      var k, matches, namedArguments, pattern, properties, regexp, regexps, _i, _len, _ref;
      regexps = this.constructor.regexps;
      if (templatePath.indexOf('/') !== 0) {
        templatePath = "/" + templatePath;
      }
      pattern = templatePath.replace(regexps.escapeRegExp, '\\$&');
      regexp = RegExp("^" + (pattern.replace(regexps.namedParam, '([^\/]+)').replace(regexps.splatParam, '(.*?)')) + regexps.queryParam + "$");
      namedArguments = ((function() {
        var _results;
        _results = [];
        while (matches = regexps.namedOrSplat.exec(pattern)) {
          _results.push(matches[1]);
        }
        return _results;
      })());
      properties = {
        templatePath: templatePath,
        pattern: pattern,
        regexp: regexp,
        namedArguments: namedArguments,
        baseParams: baseParams
      };
      _ref = this.optionKeys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        properties[k] = baseParams[k];
        delete baseParams[k];
      }
      Route.__super__.constructor.call(this, properties);
    }

    Route.prototype.paramsFromPath = function(pathAndQuery) {
      var index, match, matches, name, namedArguments, params, uri, _i, _len;
      uri = new Batman.URI(pathAndQuery);
      namedArguments = this.get('namedArguments');
      params = Batman.extend({
        path: uri.path
      }, this.get('baseParams'));
      matches = this.get('regexp').exec(uri.path).slice(1);
      for (index = _i = 0, _len = matches.length; _i < _len; index = ++_i) {
        match = matches[index];
        name = namedArguments[index];
        params[name] = match;
      }
      return Batman.extend(params, uri.queryParams);
    };

    Route.prototype.pathFromParams = function(argumentParams) {
      var hash, key, name, newPath, params, path, query, regexp, _i, _j, _len, _len1, _ref, _ref1;
      params = Batman.extend({}, argumentParams);
      path = this.get('templatePath');
      _ref = this.get('namedArguments');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        regexp = RegExp("" + this.constructor.regexps.namePrefix + name);
        newPath = path.replace(regexp, (params[name] != null ? params[name] : ''));
        if (newPath !== path) {
          delete params[name];
          path = newPath;
        }
      }
      _ref1 = this.testKeys;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        key = _ref1[_j];
        delete params[key];
      }
      if (params['#']) {
        hash = params['#'];
        delete params['#'];
      }
      query = Batman.URI.queryFromParams(params);
      if (query) {
        path += "?" + query;
      }
      if (hash) {
        path += "#" + hash;
      }
      return path;
    };

    Route.prototype.test = function(pathOrParams) {
      var key, path, value, _i, _len, _ref;
      if (typeof pathOrParams === 'string') {
        path = pathOrParams;
      } else if (pathOrParams.path != null) {
        path = pathOrParams.path;
      } else {
        path = this.pathFromParams(pathOrParams);
        _ref = this.testKeys;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if ((value = this.get(key)) != null) {
            if (pathOrParams[key] !== value) {
              return false;
            }
          }
        }
      }
      return this.get('regexp').test(path);
    };

    Route.prototype.pathAndParamsFromArgument = function(pathOrParams) {
      var params, path;
      if (typeof pathOrParams === 'string') {
        params = this.paramsFromPath(pathOrParams);
        path = pathOrParams;
      } else {
        params = pathOrParams;
        path = this.pathFromParams(pathOrParams);
      }
      return [path, params];
    };

    Route.prototype.dispatch = function(params) {
      if (!this.test(params)) {
        return false;
      }
      return this.get('callback')(params);
    };

    Route.prototype.callback = function() {
      throw new Batman.DevelopmentError("Override callback in a Route subclass");
    };

    return Route;

  })(Batman.Object);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.ControllerActionRoute = (function(_super) {

    __extends(ControllerActionRoute, _super);

    ControllerActionRoute.prototype.optionKeys = ['member', 'collection', 'app', 'controller', 'action'];

    function ControllerActionRoute(templatePath, options) {
      this.callback = __bind(this.callback, this);

      var action, controller, _ref;
      if (options.signature) {
        _ref = options.signature.split('#'), controller = _ref[0], action = _ref[1];
        action || (action = 'index');
        options.controller = controller;
        options.action = action;
        delete options.signature;
      }
      ControllerActionRoute.__super__.constructor.call(this, templatePath, options);
    }

    ControllerActionRoute.prototype.callback = function(params) {
      var controller;
      controller = this.get("app.dispatcher.controllers." + (this.get('controller')));
      return controller.dispatch(this.get('action'), params);
    };

    return ControllerActionRoute;

  })(Batman.Route);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.CallbackActionRoute = (function(_super) {

    __extends(CallbackActionRoute, _super);

    function CallbackActionRoute() {
      return CallbackActionRoute.__super__.constructor.apply(this, arguments);
    }

    CallbackActionRoute.prototype.optionKeys = ['member', 'collection', 'callback', 'app'];

    CallbackActionRoute.prototype.controller = false;

    CallbackActionRoute.prototype.action = false;

    return CallbackActionRoute;

  })(Batman.Route);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.Hash = (function(_super) {
    var k, _fn, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;

    __extends(Hash, _super);

    Hash.Metadata = (function(_super1) {

      __extends(Metadata, _super1);

      Batman.extend(Metadata.prototype, Batman.Enumerable);

      function Metadata(hash) {
        this.hash = hash;
      }

      Metadata.accessor('length', function() {
        this.hash.registerAsMutableSource();
        return this.hash.length;
      });

      Metadata.accessor('isEmpty', 'keys', 'toArray', function(key) {
        this.hash.registerAsMutableSource();
        return this.hash[key]();
      });

      Metadata.prototype.forEach = function() {
        var _ref;
        return (_ref = this.hash).forEach.apply(_ref, arguments);
      };

      return Metadata;

    })(Batman.Object);

    function Hash() {
      this.meta = new this.constructor.Metadata(this);
      Batman.SimpleHash.apply(this, arguments);
      Hash.__super__.constructor.apply(this, arguments);
    }

    Batman.extend(Hash.prototype, Batman.Enumerable);

    Hash.prototype.propertyClass = Batman.Property;

    Hash.defaultAccessor = {
      get: Batman.SimpleHash.prototype.get,
      set: Hash.mutation(function(key, value) {
        var result;
        result = Batman.SimpleHash.prototype.set.call(this, key, value);
        this.fire('itemsWereAdded', key);
        return result;
      }),
      unset: Hash.mutation(function(key) {
        var result;
        result = Batman.SimpleHash.prototype.unset.call(this, key);
        if (result != null) {
          this.fire('itemsWereRemoved', key);
        }
        return result;
      }),
      cache: false
    };

    Hash.accessor(Hash.defaultAccessor);

    Hash.prototype._preventMutationEvents = function(block) {
      this.prevent('change');
      this.prevent('itemsWereAdded');
      this.prevent('itemsWereRemoved');
      try {
        return block.call(this);
      } finally {
        this.allow('change');
        this.allow('itemsWereAdded');
        this.allow('itemsWereRemoved');
      }
    };

    Hash.prototype.clear = Hash.mutation(function() {
      var keys, result;
      keys = this.keys();
      this._preventMutationEvents(function() {
        var _this = this;
        return this.forEach(function(k) {
          return _this.unset(k);
        });
      });
      result = Batman.SimpleHash.prototype.clear.call(this);
      this.fire.apply(this, ['itemsWereRemoved'].concat(__slice.call(keys)));
      return result;
    });

    Hash.prototype.update = Hash.mutation(function(object) {
      var addedKeys;
      addedKeys = [];
      this._preventMutationEvents(function() {
        var _this = this;
        return Batman.forEach(object, function(k, v) {
          if (!_this.hasKey(k)) {
            addedKeys.push(k);
          }
          return _this.set(k, v);
        });
      });
      if (addedKeys.length > 0) {
        return this.fire.apply(this, ['itemsWereAdded'].concat(__slice.call(addedKeys)));
      }
    });

    Hash.prototype.replace = Hash.mutation(function(object) {
      var addedKeys, removedKeys;
      addedKeys = [];
      removedKeys = [];
      this._preventMutationEvents(function() {
        var _this = this;
        this.forEach(function(k, _) {
          if (!Batman.objectHasKey(object, k)) {
            _this.unset(k);
            return removedKeys.push(k);
          }
        });
        return Batman.forEach(object, function(k, v) {
          if (!_this.hasKey(k)) {
            addedKeys.push(k);
          }
          return _this.set(k, v);
        });
      });
      if (addedKeys.length > 0) {
        this.fire.apply(this, ['itemsWereAdded'].concat(__slice.call(addedKeys)));
      }
      if (removedKeys.length > 0) {
        return this.fire.apply(this, ['itemsWereRemoved'].concat(__slice.call(removedKeys)));
      }
    });

    _ref = ['equality', 'hashKeyFor', 'objectKey', 'prefixedKey', 'unprefixedKey'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      Hash.prototype[k] = Batman.SimpleHash.prototype[k];
    }

    _ref1 = ['hasKey', 'forEach', 'isEmpty', 'keys', 'toArray', 'merge', 'toJSON', 'toObject'];
    _fn = function(k) {
      return Hash.prototype[k] = function() {
        this.registerAsMutableSource();
        return Batman.SimpleHash.prototype[k].apply(this, arguments);
      };
    };
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      k = _ref1[_j];
      _fn(k);
    }

    return Hash;

  }).call(this, Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.RenderCache = (function(_super) {

    __extends(RenderCache, _super);

    RenderCache.prototype.maximumLength = 4;

    function RenderCache() {
      RenderCache.__super__.constructor.apply(this, arguments);
      this.keyQueue = [];
    }

    RenderCache.prototype.viewForOptions = function(options) {
      var _this = this;
      if (options.cache === false || options.viewClass.prototype.cache === false) {
        return this._newViewFromOptions(options);
      }
      return this.getOrSet(options, function() {
        return _this._newViewFromOptions(Batman.extend({}, options));
      });
    };

    RenderCache.prototype._newViewFromOptions = function(options) {
      return new options.viewClass(options);
    };

    RenderCache.wrapAccessor(function(core) {
      return {
        cache: false,
        get: function(key) {
          var result;
          result = core.get.call(this, key);
          if (result) {
            this._addOrBubbleKey(key);
          }
          return result;
        },
        set: function(key, value) {
          var result;
          result = core.set.apply(this, arguments);
          result.set('cached', true);
          this._addOrBubbleKey(key);
          this._evictExpiredKeys();
          return result;
        },
        unset: function(key) {
          var result;
          result = core.unset.apply(this, arguments);
          result.set('cached', false);
          this._removeKeyFromQueue(key);
          return result;
        }
      };
    });

    RenderCache.prototype.equality = function(incomingOptions, storageOptions) {
      var key;
      if (Object.keys(incomingOptions).length !== Object.keys(storageOptions).length) {
        return false;
      }
      for (key in incomingOptions) {
        if (!(key === 'view')) {
          if (incomingOptions[key] !== storageOptions[key]) {
            return false;
          }
        }
      }
      return true;
    };

    RenderCache.prototype.reset = function() {
      var key, _i, _len, _ref, _results;
      _ref = this.keyQueue.slice(0);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(this.unset(key));
      }
      return _results;
    };

    RenderCache.prototype._addOrBubbleKey = function(key) {
      this._removeKeyFromQueue(key);
      return this.keyQueue.unshift(key);
    };

    RenderCache.prototype._removeKeyFromQueue = function(key) {
      var index, queuedKey, _i, _len, _ref;
      _ref = this.keyQueue;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        queuedKey = _ref[index];
        if (this.equality(queuedKey, key)) {
          this.keyQueue.splice(index, 1);
          break;
        }
      }
      return key;
    };

    RenderCache.prototype._evictExpiredKeys = function() {
      var currentKeys, i, key, _i, _ref, _ref1;
      if (this.length > this.maximumLength) {
        currentKeys = this.keyQueue.slice(0);
        for (i = _i = _ref = this.maximumLength, _ref1 = currentKeys.length; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          key = currentKeys[i];
          if (!this.get(key).isInDOM()) {
            this.unset(key);
          }
        }
      }
    };

    return RenderCache;

  })(Batman.Hash);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Batman.Controller = (function(_super) {
    var _optionsFromFilterArguments;

    __extends(Controller, _super);

    Controller.singleton('sharedController');

    Controller.wrapAccessor('routingKey', function(core) {
      return {
        get: function() {
          if (this.routingKey != null) {
            return this.routingKey;
          } else {
            if (Batman.config.minificationErrors) {
              Batman.developer.error("Please define `routingKey` on the prototype of " + (Batman.functionName(this.constructor)) + " in order for your controller to be minification safe.");
            }
            return Batman.functionName(this.constructor).replace(/Controller$/, '');
          }
        }
      };
    });

    Controller.accessor('_renderContext', function() {
      return Batman.RenderContext.root().descend(this);
    });

    _optionsFromFilterArguments = function(options, nameOrFunction) {
      if (!nameOrFunction) {
        nameOrFunction = options;
        options = {};
      } else {
        if (typeof options === 'string') {
          options = {
            only: [options]
          };
        } else {
          if (options.only && Batman.typeOf(options.only) !== 'Array') {
            options.only = [options.only];
          }
          if (options.except && Batman.typeOf(options.except) !== 'Array') {
            options.except = [options.except];
          }
        }
      }
      options.block = nameOrFunction;
      return options;
    };

    Controller.beforeFilter = function() {
      var filters, options, _base;
      Batman.initializeObject(this);
      options = _optionsFromFilterArguments.apply(null, arguments);
      filters = (_base = this._batman).beforeFilters || (_base.beforeFilters = new Batman.SimpleHash);
      return filters.set(options.block, options);
    };

    Controller.afterFilter = function() {
      var filters, options, _base;
      Batman.initializeObject(this);
      options = _optionsFromFilterArguments.apply(null, arguments);
      filters = (_base = this._batman).afterFilters || (_base.afterFilters = new Batman.SimpleHash);
      return filters.set(options.block, options);
    };

    Controller.afterFilter(function(params) {
      if (this.autoScrollToHash && (params['#'] != null)) {
        return this.scrollToHash(params['#']);
      }
    });

    function Controller() {
      this.redirect = __bind(this.redirect, this);
      Controller.__super__.constructor.apply(this, arguments);
      this._resetActionFrames();
    }

    Controller.prototype.renderCache = new Batman.RenderCache;

    Controller.prototype.defaultRenderYield = 'main';

    Controller.prototype.autoScrollToHash = true;

    Controller.prototype.dispatch = function(action, params) {
      var redirectTo;
      if (params == null) {
        params = {};
      }
      params.controller || (params.controller = this.get('routingKey'));
      params.action || (params.action = action);
      params.target || (params.target = this);
      this._resetActionFrames();
      this.set('action', action);
      this.set('params', params);
      Batman.DOM.Yield.cycleAll();
      this.executeAction(action, params);
      Batman.DOM.Yield.clearAllStale();
      redirectTo = this._afterFilterRedirect;
      delete this._afterFilterRedirect;
      if (redirectTo) {
        return Batman.redirect(redirectTo);
      }
    };

    Controller.prototype.executeAction = function(action, params) {
      var frame, oldRedirect, parentFrame, result, _ref, _ref1,
        _this = this;
      if (params == null) {
        params = this.get('params');
      }
      Batman.developer.assert(this[action], "Error! Controller action " + (this.get('routingKey')) + "." + action + " couldn't be found!");
      parentFrame = this._actionFrames[this._actionFrames.length - 1];
      frame = new Batman.ControllerActionFrame({
        parentFrame: parentFrame,
        action: action
      }, function() {
        var _ref;
        _this._runFilters(action, params, 'afterFilters');
        _this._resetActionFrames();
        return (_ref = Batman.navigator) != null ? _ref.redirect = oldRedirect : void 0;
      });
      this._actionFrames.push(frame);
      frame.startOperation({
        internal: true
      });
      oldRedirect = (_ref = Batman.navigator) != null ? _ref.redirect : void 0;
      if ((_ref1 = Batman.navigator) != null) {
        _ref1.redirect = this.redirect;
      }
      this._runFilters(action, params, 'beforeFilters');
      result = this[action](params);
      if (!frame.operationOccurred) {
        this.render();
      }
      frame.finishOperation();
      return result;
    };

    Controller.prototype.redirect = function(url) {
      var frame;
      frame = this._actionFrames[this._actionFrames.length - 1];
      if (frame) {
        if (frame.operationOccurred) {
          Batman.developer.warn("Warning! Trying to redirect but an action has already be taken during " + (this.get('routingKey')) + "." + (frame.action || this.get('action')));
        }
        frame.startAndFinishOperation();
        if (this._afterFilterRedirect != null) {
          return Batman.developer.warn("Warning! Multiple actions trying to redirect!");
        } else {
          return this._afterFilterRedirect = url;
        }
      } else {
        if (Batman.typeOf(url) === 'Object') {
          if (!url.controller) {
            url.controller = this;
          }
        }
        return Batman.redirect(url);
      }
    };

    Controller.prototype.render = function(options) {
      var action, frame, view, _ref, _ref1,
        _this = this;
      if (options == null) {
        options = {};
      }
      if (frame = (_ref = this._actionFrames) != null ? _ref[this._actionFrames.length - 1] : void 0) {
        frame.startOperation();
      }
      if (options === false) {
        frame.finishOperation();
        return;
      }
      action = (frame != null ? frame.action : void 0) || this.get('action');
      if (options) {
        options.into || (options.into = this.defaultRenderYield);
      }
      if (!options.view) {
        options.viewClass || (options.viewClass = this._viewClassForAction(action));
        options.context || (options.context = this.get('_renderContext'));
        options.source || (options.source = Batman.helpers.underscore(this.get('routingKey') + '/' + action));
        view = this.renderCache.viewForOptions(options);
      } else {
        view = options.view;
        options.view = null;
      }
      if (view) {
        if ((_ref1 = Batman.currentApp) != null) {
          _ref1.prevent('ready');
        }
        view.on('ready', function() {
          var _ref2;
          Batman.DOM.Yield.withName(options.into).replace(view.get('node'));
          if ((_ref2 = Batman.currentApp) != null) {
            _ref2.allowAndFire('ready');
          }
          return frame != null ? frame.finishOperation() : void 0;
        });
      }
      return view;
    };

    Controller.prototype.scrollToHash = function(hash) {
      if (hash == null) {
        hash = this.get('params')['#'];
      }
      return Batman.DOM.scrollIntoView(hash);
    };

    Controller.prototype._resetActionFrames = function() {
      return this._actionFrames = [];
    };

    Controller.prototype._viewClassForAction = function(action) {
      var classPrefix, _ref;
      classPrefix = this.get('routingKey').replace('/', '_');
      return ((_ref = Batman.currentApp) != null ? _ref[Batman.helpers.camelize("" + classPrefix + "_" + action + "_view")] : void 0) || Batman.View;
    };

    Controller.prototype._runFilters = function(action, params, filters) {
      var _ref,
        _this = this;
      if (filters = (_ref = this.constructor._batman) != null ? _ref.get(filters) : void 0) {
        return filters.forEach(function(_, options) {
          var block;
          if (options.only && __indexOf.call(options.only, action) < 0) {
            return;
          }
          if (options.except && __indexOf.call(options.except, action) >= 0) {
            return;
          }
          block = options.block;
          if (typeof block === 'function') {
            return block.call(_this, params);
          } else {
            return typeof _this[block] === "function" ? _this[block](params) : void 0;
          }
        });
      }
    };

    return Controller;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.Set = (function(_super) {
    var k, _fn, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;

    __extends(Set, _super);

    function Set() {
      Batman.SimpleSet.apply(this, arguments);
    }

    Batman.extend(Set.prototype, Batman.Enumerable);

    Set._applySetAccessors = function(klass) {
      var accessor, accessors, key, _results;
      accessors = {
        first: function() {
          return this.toArray()[0];
        },
        last: function() {
          return this.toArray()[this.length - 1];
        },
        isEmpty: function() {
          return this.isEmpty();
        },
        toArray: function() {
          return this.toArray();
        },
        length: function() {
          this.registerAsMutableSource();
          return this.length;
        },
        indexedBy: function() {
          var _this = this;
          return new Batman.TerminalAccessible(function(key) {
            return _this.indexedBy(key);
          });
        },
        indexedByUnique: function() {
          var _this = this;
          return new Batman.TerminalAccessible(function(key) {
            return _this.indexedByUnique(key);
          });
        },
        sortedBy: function() {
          var _this = this;
          return new Batman.TerminalAccessible(function(key) {
            return _this.sortedBy(key);
          });
        },
        sortedByDescending: function() {
          var _this = this;
          return new Batman.TerminalAccessible(function(key) {
            return _this.sortedBy(key, 'desc');
          });
        }
      };
      _results = [];
      for (key in accessors) {
        accessor = accessors[key];
        _results.push(klass.accessor(key, accessor));
      }
      return _results;
    };

    Set._applySetAccessors(Set);

    _ref = ['add', 'remove', 'clear', 'replace', 'indexedBy', 'indexedByUnique', 'sortedBy', 'equality', '_indexOfItem'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      Set.prototype[k] = Batman.SimpleSet.prototype[k];
    }

    _ref1 = ['find', 'merge', 'forEach', 'toArray', 'isEmpty', 'has'];
    _fn = function(k) {
      return Set.prototype[k] = function() {
        this.registerAsMutableSource();
        return Batman.SimpleSet.prototype[k].apply(this, arguments);
      };
    };
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      k = _ref1[_j];
      _fn(k);
    }

    Set.prototype.toJSON = Set.prototype.toArray;

    return Set;

  }).call(this, Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.ErrorsSet = (function(_super) {

    __extends(ErrorsSet, _super);

    function ErrorsSet() {
      return ErrorsSet.__super__.constructor.apply(this, arguments);
    }

    ErrorsSet.accessor(function(key) {
      return this.indexedBy('attribute').get(key);
    });

    ErrorsSet.prototype.add = function(key, error) {
      return ErrorsSet.__super__.add.call(this, new Batman.ValidationError(key, error));
    };

    return ErrorsSet;

  })(Batman.Set);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.SetProxy = (function(_super) {
    var k, _fn, _i, _len, _ref,
      _this = this;

    __extends(SetProxy, _super);

    function SetProxy(base) {
      var _this = this;
      this.base = base;
      SetProxy.__super__.constructor.call(this);
      this.length = this.base.length;
      this.base.on('itemsWereAdded', function() {
        var items;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _this.set('length', _this.base.length);
        return _this.fire.apply(_this, ['itemsWereAdded'].concat(__slice.call(items)));
      });
      this.base.on('itemsWereRemoved', function() {
        var items;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _this.set('length', _this.base.length);
        return _this.fire.apply(_this, ['itemsWereRemoved'].concat(__slice.call(items)));
      });
    }

    Batman.extend(SetProxy.prototype, Batman.Enumerable);

    SetProxy.prototype.filter = function(f) {
      var r;
      r = new Batman.Set();
      return this.reduce((function(r, e) {
        if (f(e)) {
          r.add(e);
        }
        return r;
      }), r);
    };

    SetProxy.prototype.replace = function() {
      var length, result;
      length = this.property('length');
      length.isolate();
      result = this.base.replace.apply(this, arguments);
      length.expose();
      return result;
    };

    _ref = ['add', 'remove', 'find', 'clear', 'has', 'merge', 'toArray', 'isEmpty', 'indexedBy', 'indexedByUnique', 'sortedBy'];
    _fn = function(k) {
      return SetProxy.prototype[k] = function() {
        var _ref1;
        return (_ref1 = this.base)[k].apply(_ref1, arguments);
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      _fn(k);
    }

    Batman.Set._applySetAccessors(SetProxy);

    SetProxy.accessor('length', {
      get: function() {
        this.registerAsMutableSource();
        return this.length;
      },
      set: function(_, v) {
        return this.length = v;
      }
    });

    return SetProxy;

  }).call(this, Batman.Object);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.BinarySetOperation = (function(_super) {

    __extends(BinarySetOperation, _super);

    function BinarySetOperation(left, right) {
      this.left = left;
      this.right = right;
      this._setup = __bind(this._setup, this);

      BinarySetOperation.__super__.constructor.call(this);
      this._setup(this.left, this.right);
      this._setup(this.right, this.left);
    }

    BinarySetOperation.prototype._setup = function(set, opposite) {
      var _this = this;
      set.on('itemsWereAdded', function() {
        var items;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this._itemsWereAddedToSource.apply(_this, [set, opposite].concat(__slice.call(items)));
      });
      set.on('itemsWereRemoved', function() {
        var items;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this._itemsWereRemovedFromSource.apply(_this, [set, opposite].concat(__slice.call(items)));
      });
      return this._itemsWereAddedToSource.apply(this, [set, opposite].concat(__slice.call(set.toArray())));
    };

    BinarySetOperation.prototype.merge = function() {
      var merged, others, set, _i, _len;
      others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      merged = new Batman.Set;
      others.unshift(this);
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        set = others[_i];
        set.forEach(function(v) {
          return merged.add(v);
        });
      }
      return merged;
    };

    BinarySetOperation.prototype.filter = Batman.SetProxy.prototype.filter;

    return BinarySetOperation;

  })(Batman.Set);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.SetUnion = (function(_super) {

    __extends(SetUnion, _super);

    function SetUnion() {
      return SetUnion.__super__.constructor.apply(this, arguments);
    }

    SetUnion.prototype._itemsWereAddedToSource = function() {
      var items, opposite, source;
      source = arguments[0], opposite = arguments[1], items = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return this.add.apply(this, items);
    };

    SetUnion.prototype._itemsWereRemovedFromSource = function() {
      var item, items, itemsToRemove, opposite, source;
      source = arguments[0], opposite = arguments[1], items = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      itemsToRemove = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (!opposite.has(item)) {
            _results.push(item);
          }
        }
        return _results;
      })();
      return this.remove.apply(this, itemsToRemove);
    };

    return SetUnion;

  })(Batman.BinarySetOperation);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.SetIntersection = (function(_super) {

    __extends(SetIntersection, _super);

    function SetIntersection() {
      return SetIntersection.__super__.constructor.apply(this, arguments);
    }

    SetIntersection.prototype._itemsWereAddedToSource = function() {
      var item, items, itemsToAdd, opposite, source;
      source = arguments[0], opposite = arguments[1], items = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      itemsToAdd = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (opposite.has(item)) {
            _results.push(item);
          }
        }
        return _results;
      })();
      return this.add.apply(this, itemsToAdd);
    };

    SetIntersection.prototype._itemsWereRemovedFromSource = function() {
      var items, opposite, source;
      source = arguments[0], opposite = arguments[1], items = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return this.remove.apply(this, items);
    };

    return SetIntersection;

  })(Batman.BinarySetOperation);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.SetComplement = (function(_super) {

    __extends(SetComplement, _super);

    function SetComplement() {
      return SetComplement.__super__.constructor.apply(this, arguments);
    }

    SetComplement.prototype._itemsWereAddedToSource = function() {
      var item, items, itemsToAdd, itemsToRemove, opposite, source;
      source = arguments[0], opposite = arguments[1], items = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (source === this.left) {
        itemsToAdd = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            if (!opposite.has(item)) {
              _results.push(item);
            }
          }
          return _results;
        })();
        return this.add.apply(this, itemsToAdd);
      } else {
        itemsToRemove = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            if (opposite.has(item)) {
              _results.push(item);
            }
          }
          return _results;
        })();
        return this.remove.apply(this, itemsToRemove);
      }
    };

    SetComplement.prototype._itemsWereRemovedFromSource = function() {
      var item, items, itemsToAdd, opposite, source;
      source = arguments[0], opposite = arguments[1], items = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (source === this.left) {
        return this.remove.apply(this, items);
      } else {
        itemsToAdd = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            if (opposite.has(item)) {
              _results.push(item);
            }
          }
          return _results;
        })();
        return this.add.apply(this, itemsToAdd);
      }
    };

    SetComplement.prototype._addComplement = function(items, opposite) {
      var item;
      return this.add.apply(this, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (opposite.has(item)) {
            _results.push(item);
          }
        }
        return _results;
      })());
    };

    return SetComplement;

  })(Batman.BinarySetOperation);

}).call(this);

(function() {

  Batman.mixins = new Batman.Object;

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.Accessible = (function(_super) {

    __extends(Accessible, _super);

    function Accessible() {
      this.accessor.apply(this, arguments);
    }

    return Accessible;

  })(Batman.Object);

  Batman.TerminalAccessible = (function(_super) {

    __extends(TerminalAccessible, _super);

    function TerminalAccessible() {
      return TerminalAccessible.__super__.constructor.apply(this, arguments);
    }

    TerminalAccessible.prototype.propertyClass = Batman.Property;

    return TerminalAccessible;

  })(Batman.Accessible);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.SetObserver = (function(_super) {

    __extends(SetObserver, _super);

    function SetObserver(base) {
      var _this = this;
      this.base = base;
      this._itemObservers = new Batman.SimpleHash;
      this._setObservers = new Batman.SimpleHash;
      this._setObservers.set("itemsWereAdded", function() {
        return _this.fire.apply(_this, ['itemsWereAdded'].concat(__slice.call(arguments)));
      });
      this._setObservers.set("itemsWereRemoved", function() {
        return _this.fire.apply(_this, ['itemsWereRemoved'].concat(__slice.call(arguments)));
      });
      this.on('itemsWereAdded', this.startObservingItems.bind(this));
      this.on('itemsWereRemoved', this.stopObservingItems.bind(this));
    }

    SetObserver.prototype.observedItemKeys = [];

    SetObserver.prototype.observerForItemAndKey = function(item, key) {};

    SetObserver.prototype._getOrSetObserverForItemAndKey = function(item, key) {
      var _this = this;
      return this._itemObservers.getOrSet(item, function() {
        var observersByKey;
        observersByKey = new Batman.SimpleHash;
        return observersByKey.getOrSet(key, function() {
          return _this.observerForItemAndKey(item, key);
        });
      });
    };

    SetObserver.prototype.startObserving = function() {
      this._manageItemObservers("observe");
      return this._manageSetObservers("addHandler");
    };

    SetObserver.prototype.stopObserving = function() {
      this._manageItemObservers("forget");
      return this._manageSetObservers("removeHandler");
    };

    SetObserver.prototype.startObservingItems = function() {
      var item, items, _i, _len, _results;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _results.push(this._manageObserversForItem(item, "observe"));
      }
      return _results;
    };

    SetObserver.prototype.stopObservingItems = function() {
      var item, items, _i, _len, _results;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _results.push(this._manageObserversForItem(item, "forget"));
      }
      return _results;
    };

    SetObserver.prototype._manageObserversForItem = function(item, method) {
      var key, _i, _len, _ref;
      if (!item.isObservable) {
        return;
      }
      _ref = this.observedItemKeys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        item[method](key, this._getOrSetObserverForItemAndKey(item, key));
      }
      if (method === "forget") {
        return this._itemObservers.unset(item);
      }
    };

    SetObserver.prototype._manageItemObservers = function(method) {
      var _this = this;
      return this.base.forEach(function(item) {
        return _this._manageObserversForItem(item, method);
      });
    };

    SetObserver.prototype._manageSetObservers = function(method) {
      var _this = this;
      if (!this.base.isObservable) {
        return;
      }
      return this._setObservers.forEach(function(key, observer) {
        return _this.base.event(key)[method](observer);
      });
    };

    return SetObserver;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.SetSort = (function(_super) {

    __extends(SetSort, _super);

    function SetSort(base, key, order) {
      var boundReIndex;
      this.key = key;
      if (order == null) {
        order = "asc";
      }
      SetSort.__super__.constructor.call(this, base);
      this.descending = order.toLowerCase() === "desc";
      if (this.base.isObservable) {
        this._setObserver = new Batman.SetObserver(this.base);
        this._setObserver.observedItemKeys = [this.key];
        boundReIndex = this._reIndex.bind(this);
        this._setObserver.observerForItemAndKey = function() {
          return boundReIndex;
        };
        this._setObserver.on('itemsWereAdded', boundReIndex);
        this._setObserver.on('itemsWereRemoved', boundReIndex);
        this.startObserving();
      }
      this._reIndex();
    }

    SetSort.prototype.startObserving = function() {
      var _ref;
      return (_ref = this._setObserver) != null ? _ref.startObserving() : void 0;
    };

    SetSort.prototype.stopObserving = function() {
      var _ref;
      return (_ref = this._setObserver) != null ? _ref.stopObserving() : void 0;
    };

    SetSort.prototype.toArray = function() {
      return this.get('_storage');
    };

    SetSort.prototype.forEach = function(iterator, ctx) {
      var e, i, _i, _len, _ref, _results;
      _ref = this.get('_storage');
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        e = _ref[i];
        _results.push(iterator.call(ctx, e, i, this));
      }
      return _results;
    };

    SetSort.prototype.compare = function(a, b) {
      if (a === b) {
        return 0;
      }
      if (a === void 0) {
        return 1;
      }
      if (b === void 0) {
        return -1;
      }
      if (a === null) {
        return 1;
      }
      if (b === null) {
        return -1;
      }
      if (a === false) {
        return 1;
      }
      if (b === false) {
        return -1;
      }
      if (a === true) {
        return 1;
      }
      if (b === true) {
        return -1;
      }
      if (a !== a) {
        if (b !== b) {
          return 0;
        } else {
          return 1;
        }
      }
      if (b !== b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    };

    SetSort.prototype._reIndex = function() {
      var newOrder, _ref,
        _this = this;
      newOrder = this.base.toArray().sort(function(a, b) {
        var multiple, valueA, valueB;
        valueA = Batman.get(a, _this.key);
        if (typeof valueA === 'function') {
          valueA = valueA.call(a);
        }
        if (valueA != null) {
          valueA = valueA.valueOf();
        }
        valueB = Batman.get(b, _this.key);
        if (typeof valueB === 'function') {
          valueB = valueB.call(b);
        }
        if (valueB != null) {
          valueB = valueB.valueOf();
        }
        multiple = _this.descending ? -1 : 1;
        return _this.compare.call(_this, valueA, valueB) * multiple;
      });
      if ((_ref = this._setObserver) != null) {
        _ref.startObservingItems.apply(_ref, newOrder);
      }
      return this.set('_storage', newOrder);
    };

    return SetSort;

  })(Batman.SetProxy);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.AssociationSet = (function(_super) {

    __extends(AssociationSet, _super);

    function AssociationSet(foreignKeyValue, association) {
      var base;
      this.foreignKeyValue = foreignKeyValue;
      this.association = association;
      base = new Batman.Set;
      AssociationSet.__super__.constructor.call(this, base, 'hashKey');
    }

    AssociationSet.prototype.loaded = false;

    AssociationSet.prototype.load = function(callback) {
      var _this = this;
      if (this.foreignKeyValue == null) {
        return callback(void 0, this);
      }
      return this.association.getRelatedModel().load(this._getLoadOptions(), function(err, records) {
        if (!err) {
          _this.markAsLoaded();
        }
        return callback(err, _this);
      });
    };

    AssociationSet.prototype._getLoadOptions = function() {
      var loadOptions;
      loadOptions = {};
      loadOptions[this.association.foreignKey] = this.foreignKeyValue;
      return loadOptions;
    };

    AssociationSet.accessor('loaded', Batman.Property.defaultAccessor);

    AssociationSet.prototype.markAsLoaded = function() {
      this.set('loaded', true);
      return this.fire('loaded');
    };

    return AssociationSet;

  })(Batman.SetSort);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PolymorphicAssociationSet = (function(_super) {

    __extends(PolymorphicAssociationSet, _super);

    function PolymorphicAssociationSet(foreignKeyValue, foreignTypeKeyValue, association) {
      this.foreignKeyValue = foreignKeyValue;
      this.foreignTypeKeyValue = foreignTypeKeyValue;
      this.association = association;
      PolymorphicAssociationSet.__super__.constructor.call(this, this.foreignKeyValue, this.association);
    }

    PolymorphicAssociationSet.prototype._getLoadOptions = function() {
      var loadOptions;
      loadOptions = {};
      loadOptions[this.association.foreignKey] = this.foreignKeyValue;
      loadOptions[this.association.foreignTypeKey] = this.foreignTypeKeyValue;
      return loadOptions;
    };

    return PolymorphicAssociationSet;

  })(Batman.AssociationSet);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.SetIndex = (function(_super) {

    __extends(SetIndex, _super);

    SetIndex.accessor('toArray', function() {
      return this.toArray();
    });

    Batman.extend(SetIndex.prototype, Batman.Enumerable);

    SetIndex.prototype.propertyClass = Batman.Property;

    function SetIndex(base, key) {
      var _this = this;
      this.base = base;
      this.key = key;
      SetIndex.__super__.constructor.call(this);
      this._storage = new Batman.Hash;
      if (this.base.isEventEmitter) {
        this._setObserver = new Batman.SetObserver(this.base);
        this._setObserver.observedItemKeys = [this.key];
        this._setObserver.observerForItemAndKey = this.observerForItemAndKey.bind(this);
        this._setObserver.on('itemsWereAdded', function() {
          var item, items, _i, _len, _results;
          items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _results.push(_this._addItem(item));
          }
          return _results;
        });
        this._setObserver.on('itemsWereRemoved', function() {
          var item, items, _i, _len, _results;
          items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _results.push(_this._removeItem(item));
          }
          return _results;
        });
      }
      this.base.forEach(this._addItem.bind(this));
      this.startObserving();
    }

    SetIndex.accessor(function(key) {
      return this._resultSetForKey(key);
    });

    SetIndex.prototype.startObserving = function() {
      var _ref;
      return (_ref = this._setObserver) != null ? _ref.startObserving() : void 0;
    };

    SetIndex.prototype.stopObserving = function() {
      var _ref;
      return (_ref = this._setObserver) != null ? _ref.stopObserving() : void 0;
    };

    SetIndex.prototype.observerForItemAndKey = function(item, key) {
      var _this = this;
      return function(newValue, oldValue) {
        _this._removeItemFromKey(item, oldValue);
        return _this._addItemToKey(item, newValue);
      };
    };

    SetIndex.prototype.forEach = function(iterator, ctx) {
      var _this = this;
      return this._storage.forEach(function(key, set) {
        if (set.get('length') > 0) {
          return iterator.call(ctx, key, set, _this);
        }
      });
    };

    SetIndex.prototype.toArray = function() {
      var results;
      results = [];
      this._storage.forEach(function(key, set) {
        if (set.get('length') > 0) {
          return results.push(key);
        }
      });
      return results;
    };

    SetIndex.prototype._addItem = function(item) {
      return this._addItemToKey(item, this._keyForItem(item));
    };

    SetIndex.prototype._addItemToKey = function(item, key) {
      return this._resultSetForKey(key).add(item);
    };

    SetIndex.prototype._removeItem = function(item) {
      return this._removeItemFromKey(item, this._keyForItem(item));
    };

    SetIndex.prototype._removeItemFromKey = function(item, key) {
      return this._resultSetForKey(key).remove(item);
    };

    SetIndex.prototype._resultSetForKey = function(key) {
      return this._storage.getOrSet(key, function() {
        return new Batman.Set;
      });
    };

    SetIndex.prototype._keyForItem = function(item) {
      return Batman.Keypath.forBaseAndKey(item, this.key).getValue();
    };

    return SetIndex;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PolymorphicAssociationSetIndex = (function(_super) {

    __extends(PolymorphicAssociationSetIndex, _super);

    function PolymorphicAssociationSetIndex(association, type, key) {
      this.association = association;
      this.type = type;
      PolymorphicAssociationSetIndex.__super__.constructor.call(this, this.association.getRelatedModelForType(type).get('loaded'), key);
    }

    PolymorphicAssociationSetIndex.prototype._resultSetForKey = function(key) {
      var _this = this;
      return this._storage.getOrSet(key, function() {
        return new Batman.PolymorphicAssociationSet(key, _this.type, _this.association);
      });
    };

    return PolymorphicAssociationSetIndex;

  })(Batman.SetIndex);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.AssociationSetIndex = (function(_super) {

    __extends(AssociationSetIndex, _super);

    function AssociationSetIndex(association, key) {
      this.association = association;
      AssociationSetIndex.__super__.constructor.call(this, this.association.getRelatedModel().get('loaded'), key);
    }

    AssociationSetIndex.prototype._resultSetForKey = function(key) {
      var _this = this;
      return this._storage.getOrSet(key, function() {
        return new Batman.AssociationSet(key, _this.association);
      });
    };

    AssociationSetIndex.prototype._setResultSet = function(key, set) {
      return this._storage.set(key, set);
    };

    return AssociationSetIndex;

  })(Batman.SetIndex);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.UniqueSetIndex = (function(_super) {

    __extends(UniqueSetIndex, _super);

    function UniqueSetIndex() {
      this._uniqueIndex = new Batman.Hash;
      UniqueSetIndex.__super__.constructor.apply(this, arguments);
    }

    UniqueSetIndex.accessor(function(key) {
      return this._uniqueIndex.get(key);
    });

    UniqueSetIndex.prototype._addItemToKey = function(item, key) {
      this._resultSetForKey(key).add(item);
      if (!this._uniqueIndex.hasKey(key)) {
        return this._uniqueIndex.set(key, item);
      }
    };

    UniqueSetIndex.prototype._removeItemFromKey = function(item, key) {
      var resultSet;
      resultSet = this._resultSetForKey(key);
      UniqueSetIndex.__super__._removeItemFromKey.apply(this, arguments);
      if (resultSet.isEmpty()) {
        return this._uniqueIndex.unset(key);
      } else {
        return this._uniqueIndex.set(key, resultSet.toArray()[0]);
      }
    };

    return UniqueSetIndex;

  })(Batman.SetIndex);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.UniqueAssociationSetIndex = (function(_super) {

    __extends(UniqueAssociationSetIndex, _super);

    function UniqueAssociationSetIndex(association, key) {
      this.association = association;
      UniqueAssociationSetIndex.__super__.constructor.call(this, this.association.getRelatedModel().get('loaded'), key);
    }

    return UniqueAssociationSetIndex;

  })(Batman.UniqueSetIndex);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PolymorphicUniqueAssociationSetIndex = (function(_super) {

    __extends(PolymorphicUniqueAssociationSetIndex, _super);

    function PolymorphicUniqueAssociationSetIndex(association, type, key) {
      this.association = association;
      this.type = type;
      PolymorphicUniqueAssociationSetIndex.__super__.constructor.call(this, this.association.getRelatedModelForType(type).get('loaded'), key);
    }

    return PolymorphicUniqueAssociationSetIndex;

  })(Batman.UniqueSetIndex);

}).call(this);

(function() {

  Batman.URI = (function() {
    /*
      # URI parsing
    */

    var attributes, childKeyMatchers, decodeQueryComponent, encodeComponent, encodeQueryComponent, keyVal, nameParser, normalizeParams, plus, queryFromParams, r20, strictParser;

    strictParser = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;

    attributes = ["source", "protocol", "authority", "userInfo", "user", "password", "hostname", "port", "relative", "path", "directory", "file", "query", "hash"];

    function URI(str) {
      var i, matches;
      matches = strictParser.exec(str);
      i = 14;
      while (i--) {
        this[attributes[i]] = matches[i] || '';
      }
      this.queryParams = this.constructor.paramsFromQuery(this.query);
      delete this.authority;
      delete this.userInfo;
      delete this.relative;
      delete this.directory;
      delete this.file;
      delete this.query;
    }

    URI.prototype.queryString = function() {
      return this.constructor.queryFromParams(this.queryParams);
    };

    URI.prototype.toString = function() {
      return [this.protocol ? "" + this.protocol + ":" : void 0, this.authority() ? "//" : void 0, this.authority(), this.relative()].join("");
    };

    URI.prototype.userInfo = function() {
      return [this.user, this.password ? ":" + this.password : void 0].join("");
    };

    URI.prototype.authority = function() {
      return [this.userInfo(), this.user || this.password ? "@" : void 0, this.hostname, this.port ? ":" + this.port : void 0].join("");
    };

    URI.prototype.relative = function() {
      var query;
      query = this.queryString();
      return [this.path, query ? "?" + query : void 0, this.hash ? "#" + this.hash : void 0].join("");
    };

    URI.prototype.directory = function() {
      var splitPath;
      splitPath = this.path.split('/');
      if (splitPath.length > 1) {
        return splitPath.slice(0, splitPath.length - 1).join('/') + "/";
      } else {
        return "";
      }
    };

    URI.prototype.file = function() {
      var splitPath;
      splitPath = this.path.split("/");
      return splitPath[splitPath.length - 1];
    };

    /*
      # query parsing
    */


    URI.paramsFromQuery = function(query) {
      var matches, params, segment, _i, _len, _ref;
      params = {};
      _ref = query.split('&');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        segment = _ref[_i];
        if (matches = segment.match(keyVal)) {
          normalizeParams(params, decodeQueryComponent(matches[1]), decodeQueryComponent(matches[2]));
        } else {
          normalizeParams(params, decodeQueryComponent(segment), null);
        }
      }
      return params;
    };

    URI.decodeQueryComponent = decodeQueryComponent = function(str) {
      return decodeURIComponent(str.replace(plus, '%20'));
    };

    nameParser = /^[\[\]]*([^\[\]]+)\]*(.*)/;

    childKeyMatchers = [/^\[\]\[([^\[\]]+)\]$/, /^\[\](.+)$/];

    plus = /\+/g;

    r20 = /%20/g;

    keyVal = /^([^=]*)=(.*)/;

    normalizeParams = function(params, name, v) {
      var after, childKey, k, last, matches, _ref, _ref1, _ref2;
      if (matches = name.match(nameParser)) {
        k = matches[1];
        after = matches[2];
      } else {
        return;
      }
      if (after === '') {
        params[k] = v;
      } else if (after === '[]') {
        if ((_ref = params[k]) == null) {
          params[k] = [];
        }
        if (Batman.typeOf(params[k]) !== 'Array') {
          throw new Error("expected Array (got " + (Batman.typeOf(params[k])) + ") for param \"" + k + "\"");
        }
        params[k].push(v);
      } else if (matches = after.match(childKeyMatchers[0]) || after.match(childKeyMatchers[1])) {
        childKey = matches[1];
        if ((_ref1 = params[k]) == null) {
          params[k] = [];
        }
        if (Batman.typeOf(params[k]) !== 'Array') {
          throw new Error("expected Array (got " + (Batman.typeOf(params[k])) + ") for param \"" + k + "\"");
        }
        last = params[k][params[k].length - 1];
        if (Batman.typeOf(last) === 'Object' && !(childKey in last)) {
          normalizeParams(last, childKey, v);
        } else {
          params[k].push(normalizeParams({}, childKey, v));
        }
      } else {
        if ((_ref2 = params[k]) == null) {
          params[k] = {};
        }
        if (Batman.typeOf(params[k]) !== 'Object') {
          throw new Error("expected Object (got " + (Batman.typeOf(params[k])) + ") for param \"" + k + "\"");
        }
        params[k] = normalizeParams(params[k], after, v);
      }
      return params;
    };

    /*
      # query building
    */


    URI.queryFromParams = queryFromParams = function(value, prefix) {
      var arrayResults, k, v, valueType;
      if (value == null) {
        return prefix;
      }
      valueType = Batman.typeOf(value);
      if (!((prefix != null) || valueType === 'Object')) {
        throw new Error("value must be an Object");
      }
      switch (valueType) {
        case 'Array':
          return ((function() {
            var _i, _len;
            arrayResults = [];
            if (value.length === 0) {
              arrayResults.push(queryFromParams(null, "" + prefix + "[]"));
            } else {
              for (_i = 0, _len = value.length; _i < _len; _i++) {
                v = value[_i];
                arrayResults.push(queryFromParams(v, "" + prefix + "[]"));
              }
            }
            return arrayResults;
          })()).join("&");
        case 'Object':
          return ((function() {
            var _results;
            _results = [];
            for (k in value) {
              v = value[k];
              _results.push(queryFromParams(v, prefix ? "" + prefix + "[" + (encodeQueryComponent(k)) + "]" : encodeQueryComponent(k)));
            }
            return _results;
          })()).join("&");
        default:
          if (prefix != null) {
            return "" + prefix + "=" + (encodeQueryComponent(value));
          } else {
            return encodeQueryComponent(value);
          }
      }
    };

    URI.encodeComponent = encodeComponent = function(str) {
      if (str != null) {
        return encodeURIComponent(str);
      } else {
        return '';
      }
    };

    URI.encodeQueryComponent = encodeQueryComponent = function(str) {
      return encodeComponent(str).replace(r20, '+');
    };

    return URI;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.Request = (function(_super) {
    var dataHasFileUploads;

    __extends(Request, _super);

    Request.objectToFormData = function(data) {
      var formData, key, pairForList, val, _i, _len, _ref, _ref1;
      pairForList = function(key, object, first) {
        var k, list, v;
        if (first == null) {
          first = false;
        }
        return list = (function() {
          switch (Batman.typeOf(object)) {
            case 'Object':
              list = (function() {
                var _results;
                _results = [];
                for (k in object) {
                  v = object[k];
                  _results.push(pairForList((first ? k : "" + key + "[" + k + "]"), v));
                }
                return _results;
              })();
              return list.reduce(function(acc, list) {
                return acc.concat(list);
              }, []);
            case 'Array':
              return object.reduce(function(acc, element) {
                return acc.concat(pairForList("" + key + "[]", element));
              }, []);
            default:
              return [[key, object]];
          }
        })();
      };
      formData = new Batman.container.FormData();
      _ref = pairForList("", data, true);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], key = _ref1[0], val = _ref1[1];
        formData.append(key, val);
      }
      return formData;
    };

    Request.dataHasFileUploads = dataHasFileUploads = function(data) {
      var k, type, v, _i, _len;
      if ((typeof File !== "undefined" && File !== null) && data instanceof File) {
        return true;
      }
      type = Batman.typeOf(data);
      switch (type) {
        case 'Object':
          for (k in data) {
            v = data[k];
            if (dataHasFileUploads(v)) {
              return true;
            }
          }
          break;
        case 'Array':
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            v = data[_i];
            if (dataHasFileUploads(v)) {
              return true;
            }
          }
      }
      return false;
    };

    Request.wrapAccessor('method', function(core) {
      return {
        set: function(k, val) {
          return core.set.call(this, k, val != null ? typeof val.toUpperCase === "function" ? val.toUpperCase() : void 0 : void 0);
        }
      };
    });

    Request.prototype.method = 'GET';

    Request.prototype.hasFileUploads = function() {
      return dataHasFileUploads(this.data);
    };

    Request.prototype.contentType = 'application/x-www-form-urlencoded';

    Request.prototype.autosend = true;

    function Request(options) {
      var handler, handlers, k, _ref;
      handlers = {};
      for (k in options) {
        handler = options[k];
        if (!(k === 'success' || k === 'error' || k === 'loading' || k === 'loaded')) {
          continue;
        }
        handlers[k] = handler;
        delete options[k];
      }
      Request.__super__.constructor.call(this, options);
      for (k in handlers) {
        handler = handlers[k];
        this.on(k, handler);
      }
      if (((_ref = this.get('url')) != null ? _ref.length : void 0) > 0) {
        if (this.autosend) {
          this.send();
        }
      } else {
        this.observe('url', function(url) {
          if (url != null) {
            return this.send();
          }
        });
      }
    }

    Request.prototype.send = function() {
      return Batman.developer.error("Please source a dependency file for a request implementation");
    };

    return Request;

  })(Batman.Object);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Batman.Navigator = (function() {

    Navigator.defaultClass = function() {
      if (Batman.config.usePushState && Batman.PushStateNavigator.isSupported()) {
        return Batman.PushStateNavigator;
      } else {
        return Batman.HashbangNavigator;
      }
    };

    Navigator.forApp = function(app) {
      return new (this.defaultClass())(app);
    };

    function Navigator(app) {
      this.app = app;
      this.handleCurrentLocation = __bind(this.handleCurrentLocation, this);

    }

    Navigator.prototype.start = function() {
      var _this = this;
      if (typeof window === 'undefined') {
        return;
      }
      if (this.started) {
        return;
      }
      this.started = true;
      this.startWatching();
      Batman.currentApp.prevent('ready');
      return Batman.setImmediate(function() {
        if (_this.started && Batman.currentApp) {
          _this.handleCurrentLocation();
          return Batman.currentApp.allowAndFire('ready');
        }
      });
    };

    Navigator.prototype.stop = function() {
      this.stopWatching();
      return this.started = false;
    };

    Navigator.prototype.handleLocation = function(location) {
      var path;
      path = this.pathFromLocation(location);
      if (path === this.cachedPath) {
        return;
      }
      return this.dispatch(path);
    };

    Navigator.prototype.handleCurrentLocation = function() {
      return this.handleLocation(window.location);
    };

    Navigator.prototype.dispatch = function(params) {
      return this.cachedPath = this.app.get('dispatcher').dispatch(params);
    };

    Navigator.prototype.push = function(params) {
      var path;
      path = this.dispatch(params);
      this.pushState(null, '', path);
      return path;
    };

    Navigator.prototype.replace = function(params) {
      var path;
      path = this.dispatch(params);
      this.replaceState(null, '', path);
      return path;
    };

    Navigator.prototype.redirect = Navigator.prototype.push;

    Navigator.prototype.normalizePath = function() {
      var i, seg, segments;
      segments = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      segments = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = segments.length; _i < _len; i = ++_i) {
          seg = segments[i];
          _results.push(("" + seg).replace(/^(?!\/)/, '/').replace(/\/+$/, ''));
        }
        return _results;
      })();
      return segments.join('') || '/';
    };

    Navigator.normalizePath = Navigator.prototype.normalizePath;

    return Navigator;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PushStateNavigator = (function(_super) {

    __extends(PushStateNavigator, _super);

    function PushStateNavigator() {
      return PushStateNavigator.__super__.constructor.apply(this, arguments);
    }

    PushStateNavigator.isSupported = function() {
      var _ref;
      return (typeof window !== "undefined" && window !== null ? (_ref = window.history) != null ? _ref.pushState : void 0 : void 0) != null;
    };

    PushStateNavigator.prototype.startWatching = function() {
      return Batman.addEventListener(window, 'popstate', this.handleCurrentLocation);
    };

    PushStateNavigator.prototype.stopWatching = function() {
      return Batman.removeEventListener(window, 'popstate', this.handleCurrentLocation);
    };

    PushStateNavigator.prototype.pushState = function(stateObject, title, path) {
      return window.history.pushState(stateObject, title, this.linkTo(path));
    };

    PushStateNavigator.prototype.replaceState = function(stateObject, title, path) {
      return window.history.replaceState(stateObject, title, this.linkTo(path));
    };

    PushStateNavigator.prototype.linkTo = function(url) {
      return this.normalizePath(Batman.config.pathPrefix, url);
    };

    PushStateNavigator.prototype.pathFromLocation = function(location) {
      var fullPath, prefixPattern;
      fullPath = "" + (location.pathname || '') + (location.search || '');
      prefixPattern = new RegExp("^" + (this.normalizePath(Batman.config.pathPrefix)));
      return this.normalizePath(fullPath.replace(prefixPattern, ''));
    };

    PushStateNavigator.prototype.handleLocation = function(location) {
      var hashbangPath, path;
      path = this.pathFromLocation(location);
      if (path === '/' && (hashbangPath = Batman.HashbangNavigator.prototype.pathFromLocation(location)) !== '/') {
        return this.replace(hashbangPath);
      } else {
        return PushStateNavigator.__super__.handleLocation.apply(this, arguments);
      }
    };

    return PushStateNavigator;

  })(Batman.Navigator);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.HashbangNavigator = (function(_super) {

    __extends(HashbangNavigator, _super);

    function HashbangNavigator() {
      return HashbangNavigator.__super__.constructor.apply(this, arguments);
    }

    HashbangNavigator.prototype.HASH_PREFIX = '#!';

    if ((typeof window !== "undefined" && window !== null) && 'onhashchange' in window) {
      HashbangNavigator.prototype.startWatching = function() {
        return Batman.addEventListener(window, 'hashchange', this.handleCurrentLocation);
      };
      HashbangNavigator.prototype.stopWatching = function() {
        return Batman.removeEventListener(window, 'hashchange', this.handleCurrentLocation);
      };
    } else {
      HashbangNavigator.prototype.startWatching = function() {
        return this.interval = setInterval(this.handleCurrentLocation, 100);
      };
      HashbangNavigator.prototype.stopWatching = function() {
        return this.interval = clearInterval(this.interval);
      };
    }

    HashbangNavigator.prototype.pushState = function(stateObject, title, path) {
      return window.location.hash = this.linkTo(path);
    };

    HashbangNavigator.prototype.replaceState = function(stateObject, title, path) {
      var loc;
      loc = window.location;
      return loc.replace("" + loc.pathname + loc.search + (this.linkTo(path)));
    };

    HashbangNavigator.prototype.linkTo = function(url) {
      return this.HASH_PREFIX + url;
    };

    HashbangNavigator.prototype.pathFromLocation = function(location) {
      var hash;
      hash = location.hash;
      if ((hash != null ? hash.substr(0, 2) : void 0) === this.HASH_PREFIX) {
        return this.normalizePath(hash.substr(2));
      } else {
        return '/';
      }
    };

    HashbangNavigator.prototype.handleLocation = function(location) {
      var realPath;
      if (!Batman.config.usePushState) {
        return HashbangNavigator.__super__.handleLocation.apply(this, arguments);
      }
      realPath = Batman.PushStateNavigator.prototype.pathFromLocation(location);
      if (realPath === '/') {
        return HashbangNavigator.__super__.handleLocation.apply(this, arguments);
      } else {
        return location.replace(this.normalizePath("" + Batman.config.pathPrefix + (this.linkTo(realPath))));
      }
    };

    return HashbangNavigator;

  })(Batman.Navigator);

}).call(this);

(function() {

  Batman.RouteMap = (function() {

    RouteMap.prototype.memberRoute = null;

    RouteMap.prototype.collectionRoute = null;

    function RouteMap() {
      this.childrenByOrder = [];
      this.childrenByName = {};
    }

    RouteMap.prototype.routeForParams = function(params) {
      var route, _i, _len, _ref;
      _ref = this.childrenByOrder;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        if (route.test(params)) {
          return route;
        }
      }
      return void 0;
    };

    RouteMap.prototype.addRoute = function(name, route) {
      var base, names,
        _this = this;
      this.childrenByOrder.push(route);
      if (name.length > 0 && (names = name.split('.')).length > 0) {
        base = names.shift();
        if (!this.childrenByName[base]) {
          this.childrenByName[base] = new Batman.RouteMap;
        }
        this.childrenByName[base].addRoute(names.join('.'), route);
      } else {
        if (route.get('member')) {
          Batman.developer["do"](function() {
            if (_this.memberRoute) {
              return Batman.developer.error("Member route with name " + name + " already exists!");
            }
          });
          this.memberRoute = route;
        } else {
          Batman.developer["do"](function() {
            if (_this.collectionRoute) {
              return Batman.developer.error("Collection route with name " + name + " already exists!");
            }
          });
          this.collectionRoute = route;
        }
      }
      return true;
    };

    return RouteMap;

  })();

}).call(this);

(function() {
  var __slice = [].slice;

  Batman.RouteMapBuilder = (function() {

    RouteMapBuilder.BUILDER_FUNCTIONS = ['resources', 'member', 'collection', 'route', 'root'];

    RouteMapBuilder.ROUTES = {
      index: {
        cardinality: 'collection',
        path: function(resource) {
          return resource;
        },
        name: function(resource) {
          return resource;
        }
      },
      "new": {
        cardinality: 'collection',
        path: function(resource) {
          return "" + resource + "/new";
        },
        name: function(resource) {
          return "" + resource + ".new";
        }
      },
      show: {
        cardinality: 'member',
        path: function(resource) {
          return "" + resource + "/:id";
        },
        name: function(resource) {
          return resource;
        }
      },
      edit: {
        cardinality: 'member',
        path: function(resource) {
          return "" + resource + "/:id/edit";
        },
        name: function(resource) {
          return "" + resource + ".edit";
        }
      },
      collection: {
        cardinality: 'collection',
        path: function(resource, name) {
          return "" + resource + "/" + name;
        },
        name: function(resource, name) {
          return "" + resource + "." + name;
        }
      },
      member: {
        cardinality: 'member',
        path: function(resource, name) {
          return "" + resource + "/:id/" + name;
        },
        name: function(resource, name) {
          return "" + resource + "." + name;
        }
      }
    };

    function RouteMapBuilder(app, routeMap, parent, baseOptions) {
      this.app = app;
      this.routeMap = routeMap;
      this.parent = parent;
      this.baseOptions = baseOptions != null ? baseOptions : {};
      if (this.parent) {
        this.rootPath = this.parent._nestingPath();
        this.rootName = this.parent._nestingName();
      } else {
        this.rootPath = '';
        this.rootName = '';
      }
    }

    RouteMapBuilder.prototype.resources = function() {
      var action, actions, arg, args, as, callback, childBuilder, controller, included, k, options, path, resourceName, resourceNames, resourceRoot, routeOptions, routeTemplate, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      resourceNames = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          if (typeof arg === 'string') {
            _results.push(arg);
          }
        }
        return _results;
      })();
      if (typeof args[args.length - 1] === 'function') {
        callback = args.pop();
      }
      if (typeof args[args.length - 1] === 'object') {
        options = args.pop();
      } else {
        options = {};
      }
      actions = {
        index: true,
        "new": true,
        show: true,
        edit: true
      };
      if (options.except) {
        _ref = options.except;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          k = _ref[_i];
          actions[k] = false;
        }
        delete options.except;
      } else if (options.only) {
        for (k in actions) {
          v = actions[k];
          actions[k] = false;
        }
        _ref1 = options.only;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          k = _ref1[_j];
          actions[k] = true;
        }
        delete options.only;
      }
      for (_k = 0, _len2 = resourceNames.length; _k < _len2; _k++) {
        resourceName = resourceNames[_k];
        resourceRoot = Batman.helpers.pluralize(resourceName);
        controller = Batman.helpers.camelize(resourceRoot, true);
        childBuilder = this._childBuilder({
          controller: controller
        });
        if (callback != null) {
          callback.call(childBuilder);
        }
        for (action in actions) {
          included = actions[action];
          if (!(included)) {
            continue;
          }
          routeTemplate = this.constructor.ROUTES[action];
          as = routeTemplate.name(resourceRoot);
          path = routeTemplate.path(resourceRoot);
          routeOptions = Batman.extend({
            controller: controller,
            action: action,
            path: path,
            as: as
          }, options);
          childBuilder[routeTemplate.cardinality](action, routeOptions);
        }
      }
      return true;
    };

    RouteMapBuilder.prototype.member = function() {
      return this._addRoutesWithCardinality.apply(this, ['member'].concat(__slice.call(arguments)));
    };

    RouteMapBuilder.prototype.collection = function() {
      return this._addRoutesWithCardinality.apply(this, ['collection'].concat(__slice.call(arguments)));
    };

    RouteMapBuilder.prototype.root = function(signature, options) {
      return this.route('/', signature, options);
    };

    RouteMapBuilder.prototype.route = function(path, signature, options, callback) {
      if (!callback) {
        if (typeof options === 'function') {
          callback = options;
          options = void 0;
        } else if (typeof signature === 'function') {
          callback = signature;
          signature = void 0;
        }
      }
      if (!options) {
        if (typeof signature === 'string') {
          options = {
            signature: signature
          };
        } else {
          options = signature;
        }
        options || (options = {});
      } else {
        if (signature) {
          options.signature = signature;
        }
      }
      if (callback) {
        options.callback = callback;
      }
      options.as || (options.as = this._nameFromPath(path));
      options.path = path;
      return this._addRoute(options);
    };

    RouteMapBuilder.prototype._addRoutesWithCardinality = function() {
      var cardinality, name, names, options, resourceRoot, routeOptions, routeTemplate, _i, _j, _len;
      cardinality = arguments[0], names = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
      if (typeof options === 'string') {
        names.push(options);
        options = {};
      }
      options = Batman.extend({}, this.baseOptions, options);
      options[cardinality] = true;
      routeTemplate = this.constructor.ROUTES[cardinality];
      resourceRoot = options.controller;
      for (_j = 0, _len = names.length; _j < _len; _j++) {
        name = names[_j];
        routeOptions = Batman.extend({
          action: name
        }, options);
        if (routeOptions.path == null) {
          routeOptions.path = routeTemplate.path(resourceRoot, name);
        }
        if (routeOptions.as == null) {
          routeOptions.as = routeTemplate.name(resourceRoot, name);
        }
        this._addRoute(routeOptions);
      }
      return true;
    };

    RouteMapBuilder.prototype._addRoute = function(options) {
      var klass, name, path, route;
      if (options == null) {
        options = {};
      }
      path = this.rootPath + options.path;
      name = this.rootName + Batman.helpers.camelize(options.as, true);
      delete options.as;
      delete options.path;
      klass = options.callback ? Batman.CallbackActionRoute : Batman.ControllerActionRoute;
      options.app = this.app;
      route = new klass(path, options);
      return this.routeMap.addRoute(name, route);
    };

    RouteMapBuilder.prototype._nameFromPath = function(path) {
      path = path.replace(Batman.Route.regexps.namedOrSplat, '').replace(/\/+/g, '.').replace(/(^\.)|(\.$)/g, '');
      return path;
    };

    RouteMapBuilder.prototype._nestingPath = function() {
      var nestingParam, nestingSegment;
      if (!this.parent) {
        return "";
      } else {
        nestingParam = ":" + Batman.helpers.singularize(this.baseOptions.controller) + "Id";
        nestingSegment = Batman.helpers.underscore(this.baseOptions.controller);
        return "" + (this.parent._nestingPath()) + "/" + nestingSegment + "/" + nestingParam + "/";
      }
    };

    RouteMapBuilder.prototype._nestingName = function() {
      if (!this.parent) {
        return "";
      } else {
        return this.baseOptions.controller + ".";
      }
    };

    RouteMapBuilder.prototype._childBuilder = function(baseOptions) {
      if (baseOptions == null) {
        baseOptions = {};
      }
      return new Batman.RouteMapBuilder(this.app, this.routeMap, this, baseOptions);
    };

    return RouteMapBuilder;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.App = (function(_super) {
    var name, _fn, _i, _len, _ref,
      _this = this;

    __extends(App, _super);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.classAccessor('currentParams', {
      get: function() {
        return new Batman.Hash;
      },
      'final': true
    });

    App.classAccessor('paramsManager', {
      get: function() {
        var nav, params;
        if (!(nav = this.get('navigator'))) {
          return;
        }
        params = this.get('currentParams');
        return params.replacer = new Batman.ParamsReplacer(nav, params);
      },
      'final': true
    });

    App.classAccessor('paramsPusher', {
      get: function() {
        var nav, params;
        if (!(nav = this.get('navigator'))) {
          return;
        }
        params = this.get('currentParams');
        return params.pusher = new Batman.ParamsPusher(nav, params);
      },
      'final': true
    });

    App.classAccessor('routes', function() {
      return new Batman.NamedRouteQuery(this.get('routeMap'));
    });

    App.classAccessor('routeMap', function() {
      return new Batman.RouteMap;
    });

    App.classAccessor('routeMapBuilder', function() {
      return new Batman.RouteMapBuilder(this, this.get('routeMap'));
    });

    App.classAccessor('dispatcher', function() {
      return new Batman.Dispatcher(this, this.get('routeMap'));
    });

    App.classAccessor('controllers', function() {
      return this.get('dispatcher.controllers');
    });

    App.classAccessor('_renderContext', function() {
      return Batman.RenderContext.base.descend(this);
    });

    App.requirePath = '';

    Batman.developer["do"](function() {
      App.require = function() {
        var base, name, names, path, _i, _len,
          _this = this;
        path = arguments[0], names = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        base = this.requirePath + path;
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          this.prevent('run');
          path = base + '/' + name + '.coffee';
          new Batman.Request({
            url: path,
            type: 'html',
            success: function(response) {
              CoffeeScript["eval"](response);
              _this.allow('run');
              if (!_this.isPrevented('run')) {
                _this.fire('loaded');
              }
              if (_this.wantsToRun) {
                return _this.run();
              }
            }
          });
        }
        return this;
      };
      App.controller = function() {
        var names;
        names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        names = names.map(function(n) {
          return n + '_controller';
        });
        return this.require.apply(this, ['controllers'].concat(__slice.call(names)));
      };
      App.model = function() {
        return this.require.apply(this, ['models'].concat(__slice.call(arguments)));
      };
      return App.view = function() {
        return this.require.apply(this, ['views'].concat(__slice.call(arguments)));
      };
    });

    App.layout = void 0;

    _ref = Batman.RouteMapBuilder.BUILDER_FUNCTIONS;
    _fn = function(name) {
      return App[name] = function() {
        var _ref1;
        return (_ref1 = this.get('routeMapBuilder'))[name].apply(_ref1, arguments);
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _fn(name);
    }

    App.event('ready').oneShot = true;

    App.event('run').oneShot = true;

    App.run = function() {
      var layout, layoutClass,
        _this = this;
      if (Batman.currentApp) {
        if (Batman.currentApp === this) {
          return;
        }
        Batman.currentApp.stop();
      }
      if (this.hasRun) {
        return false;
      }
      if (this.isPrevented('run')) {
        this.wantsToRun = true;
        return false;
      } else {
        delete this.wantsToRun;
      }
      Batman.currentApp = this;
      Batman.App.set('current', this);
      if (this.get('dispatcher') == null) {
        this.set('dispatcher', new Batman.Dispatcher(this, this.get('routeMap')));
        this.set('controllers', this.get('dispatcher.controllers'));
      }
      if (this.get('navigator') == null) {
        this.set('navigator', Batman.Navigator.forApp(this));
        this.on('run', function() {
          Batman.navigator = _this.get('navigator');
          if (Object.keys(_this.get('dispatcher').routeMap).length > 0) {
            return Batman.navigator.start();
          }
        });
      }
      this.observe('layout', function(layout) {
        return layout != null ? layout.on('ready', function() {
          return _this.fire('ready');
        }) : void 0;
      });
      layout = this.get('layout');
      if (layout) {
        if (typeof layout === 'string') {
          layoutClass = this[Batman.helpers.camelize(layout) + 'View'];
        }
      } else {
        if (layout !== null) {
          layoutClass = Batman.View;
        }
      }
      if (layoutClass) {
        layout = this.set('layout', new layoutClass({
          context: this,
          node: document
        }));
      }
      this.hasRun = true;
      this.fire('run');
      return this;
    };

    App.event('ready').oneShot = true;

    App.event('stop').oneShot = true;

    App.stop = function() {
      var _ref1;
      if ((_ref1 = this.navigator) != null) {
        _ref1.stop();
      }
      Batman.navigator = null;
      this.hasRun = false;
      this.fire('stop');
      return this;
    };

    return App;

  }).call(this, Batman.Object);

}).call(this);

(function() {

  Batman.Association = (function() {

    Association.prototype.associationType = '';

    Association.prototype.isPolymorphic = false;

    Association.prototype.defaultOptions = {
      saveInline: true,
      autoload: true,
      nestUrl: false
    };

    function Association(model, label, options) {
      var defaultOptions, encoder, getAccessor, self;
      this.model = model;
      this.label = label;
      if (options == null) {
        options = {};
      }
      defaultOptions = {
        namespace: Batman.currentApp,
        name: Batman.helpers.camelize(Batman.helpers.singularize(this.label))
      };
      this.options = Batman.extend(defaultOptions, this.defaultOptions, options);
      encoder = this.encoder();
      if (!this.options.saveInline) {
        encoder.encode = false;
      }
      this.model.encode(label, encoder);
      self = this;
      getAccessor = function() {
        return self.getAccessor.call(this, self, this.model, this.label);
      };
      this.model.accessor(this.label, {
        get: getAccessor,
        set: model.defaultAccessor.set,
        unset: model.defaultAccessor.unset
      });
      if (this.options.nestUrl) {
        if (!(this.model.urlNestsUnder != null)) {
          developer.error("You must persist the the model " + this.model.constructor.name + " to use the url helpers on an association");
        }
        this.model.urlNestsUnder(Batman.helpers.underscore(this.getRelatedModel().get('resourceName')));
      }
    }

    Association.prototype.getRelatedModel = function() {
      var className, relatedModel, scope;
      scope = this.options.namespace || Batman.currentApp;
      className = this.options.name;
      relatedModel = scope != null ? scope[className] : void 0;
      Batman.developer["do"](function() {
        if ((Batman.currentApp != null) && !relatedModel) {
          return Batman.developer.warn("Related model " + className + " hasn't loaded yet.");
        }
      });
      return relatedModel;
    };

    Association.prototype.getFromAttributes = function(record) {
      return record.get("attributes." + this.label);
    };

    Association.prototype.setIntoAttributes = function(record, value) {
      return record.get('attributes').set(this.label, value);
    };

    Association.prototype.encoder = function() {
      return Batman.developer.error("You must override encoder in Batman.Association subclasses.");
    };

    Association.prototype.setIndex = function() {
      return Batman.developer.error("You must override setIndex in Batman.Association subclasses.");
    };

    Association.prototype.inverse = function() {
      var inverse, relatedAssocs,
        _this = this;
      if (relatedAssocs = this.getRelatedModel()._batman.get('associations')) {
        if (this.options.inverseOf) {
          return relatedAssocs.getByLabel(this.options.inverseOf);
        }
        inverse = null;
        relatedAssocs.forEach(function(label, assoc) {
          if (assoc.getRelatedModel() === _this.model) {
            return inverse = assoc;
          }
        });
        return inverse;
      }
    };

    Association.prototype.reset = function() {
      delete this.index;
      return true;
    };

    return Association;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PluralAssociation = (function(_super) {

    __extends(PluralAssociation, _super);

    function PluralAssociation() {
      return PluralAssociation.__super__.constructor.apply(this, arguments);
    }

    PluralAssociation.prototype.isSingular = false;

    PluralAssociation.prototype.setForRecord = Batman.Property.wrapTrackingPrevention(function(record) {
      var id;
      if (id = record.get(this.primaryKey)) {
        return this.setIndex().get(id);
      } else {
        return new Batman.AssociationSet(void 0, this);
      }
    });

    PluralAssociation.prototype.getAccessor = function(self, model, label) {
      var relatedRecords, setInAttributes,
        _this = this;
      if (!self.getRelatedModel()) {
        return;
      }
      if (setInAttributes = self.getFromAttributes(this)) {
        return setInAttributes;
      } else {
        relatedRecords = self.setForRecord(this);
        self.setIntoAttributes(this, relatedRecords);
        Batman.Property.withoutTracking(function() {
          if (self.options.autoload && !_this.isNew() && !relatedRecords.loaded) {
            return relatedRecords.load(function(error, records) {
              if (error) {
                throw error;
              }
            });
          }
        });
        return relatedRecords;
      }
    };

    PluralAssociation.prototype.setIndex = function() {
      this.index || (this.index = new Batman.AssociationSetIndex(this, this[this.indexRelatedModelOn]));
      return this.index;
    };

    return PluralAssociation;

  })(Batman.Association);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.HasManyAssociation = (function(_super) {

    __extends(HasManyAssociation, _super);

    HasManyAssociation.prototype.associationType = 'hasMany';

    HasManyAssociation.prototype.indexRelatedModelOn = 'foreignKey';

    function HasManyAssociation(model, label, options) {
      if (options != null ? options.as : void 0) {
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args), t = typeof result;
          return t == "object" || t == "function" ? result || child : child;
        })(Batman.PolymorphicHasManyAssociation, arguments, function(){});
      }
      HasManyAssociation.__super__.constructor.apply(this, arguments);
      this.primaryKey = this.options.primaryKey || "id";
      this.foreignKey = this.options.foreignKey || ("" + (Batman.helpers.underscore(model.get('resourceName'))) + "_id");
    }

    HasManyAssociation.prototype.apply = function(baseSaveError, base) {
      var relations, set,
        _this = this;
      if (!baseSaveError) {
        if (relations = this.getFromAttributes(base)) {
          relations.forEach(function(model) {
            return model.set(_this.foreignKey, base.get(_this.primaryKey));
          });
        }
        base.set(this.label, set = this.setForRecord(base));
        if (base.lifecycle.get('state') === 'creating') {
          return set.markAsLoaded();
        }
      }
    };

    HasManyAssociation.prototype.encoder = function() {
      var association;
      association = this;
      return {
        encode: function(relationSet, _, __, record) {
          var jsonArray;
          if (!association.options.saveInline) {
            return;
          }
          if (relationSet != null) {
            jsonArray = [];
            relationSet.forEach(function(relation) {
              var relationJSON;
              relationJSON = relation.toJSON();
              if (!association.inverse() || association.inverse().options.encodeForeignKey) {
                relationJSON[association.foreignKey] = record.get(association.primaryKey);
              }
              return jsonArray.push(relationJSON);
            });
          }
          return jsonArray;
        },
        decode: function(data, key, _, __, parentRecord) {
          var existingRecord, existingRelations, jsonObject, newRelations, record, relatedModel, savedRecord, _i, _len;
          if (relatedModel = association.getRelatedModel()) {
            existingRelations = association.getFromAttributes(parentRecord) || association.setForRecord(parentRecord);
            newRelations = existingRelations.filter(function(relation) {
              return relation.isNew();
            }).toArray();
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              jsonObject = data[_i];
              record = new relatedModel();
              record._withoutDirtyTracking(function() {
                return this.fromJSON(jsonObject);
              });
              existingRecord = relatedModel.get('loaded').indexedByUnique('id').get(record.get('id'));
              if (existingRecord != null) {
                existingRecord._withoutDirtyTracking(function() {
                  return this.fromJSON(jsonObject);
                });
                record = existingRecord;
              } else {
                if (newRelations.length > 0) {
                  savedRecord = newRelations.shift();
                  savedRecord._withoutDirtyTracking(function() {
                    return this.fromJSON(jsonObject);
                  });
                  record = savedRecord;
                }
              }
              record = relatedModel._mapIdentity(record);
              existingRelations.add(record);
              if (association.options.inverseOf) {
                record.set(association.options.inverseOf, parentRecord);
              }
            }
            existingRelations.markAsLoaded();
          } else {
            Batman.developer.error("Can't decode model " + association.options.name + " because it hasn't been loaded yet!");
          }
          return existingRelations;
        }
      };
    };

    return HasManyAssociation;

  })(Batman.PluralAssociation);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PolymorphicHasManyAssociation = (function(_super) {

    __extends(PolymorphicHasManyAssociation, _super);

    PolymorphicHasManyAssociation.prototype.isPolymorphic = true;

    function PolymorphicHasManyAssociation(model, label, options) {
      options.inverseOf = this.foreignLabel = options.as;
      delete options.as;
      options.foreignKey || (options.foreignKey = "" + this.foreignLabel + "_id");
      PolymorphicHasManyAssociation.__super__.constructor.call(this, model, label, options);
      this.foreignTypeKey = options.foreignTypeKey || ("" + this.foreignLabel + "_type");
      this.model.encode(this.foreignTypeKey);
    }

    PolymorphicHasManyAssociation.prototype.apply = function(baseSaveError, base) {
      var relations,
        _this = this;
      if (!baseSaveError) {
        if (relations = this.getFromAttributes(base)) {
          PolymorphicHasManyAssociation.__super__.apply.apply(this, arguments);
          relations.forEach(function(model) {
            return model.set(_this.foreignTypeKey, _this.modelType());
          });
        }
      }
      return true;
    };

    PolymorphicHasManyAssociation.prototype.getRelatedModelForType = function() {
      return this.getRelatedModel();
    };

    PolymorphicHasManyAssociation.prototype.modelType = function() {
      return this.model.get('resourceName');
    };

    PolymorphicHasManyAssociation.prototype.setIndex = function() {
      if (!this.typeIndex) {
        this.typeIndex = new Batman.PolymorphicAssociationSetIndex(this, this.modelType(), this[this.indexRelatedModelOn]);
      }
      return this.typeIndex;
    };

    PolymorphicHasManyAssociation.prototype.encoder = function() {
      var association, encoder;
      association = this;
      encoder = PolymorphicHasManyAssociation.__super__.encoder.apply(this, arguments);
      encoder.encode = function(relationSet, _, __, record) {
        var jsonArray;
        if (association._beingEncoded) {
          return;
        }
        association._beingEncoded = true;
        if (!association.options.saveInline) {
          return;
        }
        if (relationSet != null) {
          jsonArray = [];
          relationSet.forEach(function(relation) {
            var relationJSON;
            relationJSON = relation.toJSON();
            relationJSON[association.foreignKey] = record.get(association.primaryKey);
            relationJSON[association.foreignTypeKey] = association.modelType();
            return jsonArray.push(relationJSON);
          });
        }
        delete association._beingEncoded;
        return jsonArray;
      };
      return encoder;
    };

    return PolymorphicHasManyAssociation;

  })(Batman.HasManyAssociation);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.SingularAssociation = (function(_super) {

    __extends(SingularAssociation, _super);

    function SingularAssociation() {
      return SingularAssociation.__super__.constructor.apply(this, arguments);
    }

    SingularAssociation.prototype.isSingular = true;

    SingularAssociation.prototype.getAccessor = function(self, model, label) {
      var proxy, recordInAttributes;
      if (recordInAttributes = self.getFromAttributes(this)) {
        return recordInAttributes;
      }
      if (self.getRelatedModel()) {
        proxy = this.associationProxy(self);
        Batman.Property.withoutTracking(function() {
          if (!proxy.get('loaded') && self.options.autoload) {
            return proxy.load();
          }
        });
        return proxy;
      }
    };

    SingularAssociation.prototype.setIndex = function() {
      this.index || (this.index = new Batman.UniqueAssociationSetIndex(this, this[this.indexRelatedModelOn]));
      return this.index;
    };

    return SingularAssociation;

  })(Batman.Association);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.HasOneAssociation = (function(_super) {

    __extends(HasOneAssociation, _super);

    HasOneAssociation.prototype.associationType = 'hasOne';

    HasOneAssociation.prototype.proxyClass = Batman.HasOneProxy;

    HasOneAssociation.prototype.indexRelatedModelOn = 'foreignKey';

    function HasOneAssociation() {
      HasOneAssociation.__super__.constructor.apply(this, arguments);
      this.primaryKey = this.options.primaryKey || "id";
      this.foreignKey = this.options.foreignKey || ("" + (Batman.helpers.underscore(this.model.get('resourceName'))) + "_id");
    }

    HasOneAssociation.prototype.apply = function(baseSaveError, base) {
      var relation;
      if (relation = this.getFromAttributes(base)) {
        return relation.set(this.foreignKey, base.get(this.primaryKey));
      }
    };

    HasOneAssociation.prototype.encoder = function() {
      var association;
      association = this;
      return {
        encode: function(val, key, object, record) {
          var json;
          if (!association.options.saveInline) {
            return;
          }
          if (json = val.toJSON()) {
            json[association.foreignKey] = record.get(association.primaryKey);
          }
          return json;
        },
        decode: function(data, _, __, ___, parentRecord) {
          var record, relatedModel;
          relatedModel = association.getRelatedModel();
          record = new relatedModel();
          record._withoutDirtyTracking(function() {
            return this.fromJSON(data);
          });
          if (association.options.inverseOf) {
            record.set(association.options.inverseOf, parentRecord);
          }
          record = relatedModel._mapIdentity(record);
          return record;
        }
      };
    };

    return HasOneAssociation;

  })(Batman.SingularAssociation);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.BelongsToAssociation = (function(_super) {

    __extends(BelongsToAssociation, _super);

    BelongsToAssociation.prototype.associationType = 'belongsTo';

    BelongsToAssociation.prototype.proxyClass = Batman.BelongsToProxy;

    BelongsToAssociation.prototype.indexRelatedModelOn = 'primaryKey';

    BelongsToAssociation.prototype.defaultOptions = {
      saveInline: false,
      autoload: true,
      encodeForeignKey: true
    };

    function BelongsToAssociation(model, label, options) {
      if (options != null ? options.polymorphic : void 0) {
        delete options.polymorphic;
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args), t = typeof result;
          return t == "object" || t == "function" ? result || child : child;
        })(Batman.PolymorphicBelongsToAssociation, arguments, function(){});
      }
      BelongsToAssociation.__super__.constructor.apply(this, arguments);
      this.foreignKey = this.options.foreignKey || ("" + this.label + "_id");
      this.primaryKey = this.options.primaryKey || "id";
      if (this.options.encodeForeignKey) {
        this.model.encode(this.foreignKey);
      }
    }

    BelongsToAssociation.prototype.encoder = function() {
      var association, encoder;
      association = this;
      encoder = {
        encode: false,
        decode: function(data, _, __, ___, childRecord) {
          var inverse, record, relatedModel;
          relatedModel = association.getRelatedModel();
          record = new relatedModel();
          record._withoutDirtyTracking(function() {
            return this.fromJSON(data);
          });
          record = relatedModel._mapIdentity(record);
          if (association.options.inverseOf) {
            if (inverse = association.inverse()) {
              if (inverse instanceof Batman.HasManyAssociation) {
                childRecord.set(association.foreignKey, record.get(association.primaryKey));
              } else {
                record.set(inverse.label, childRecord);
              }
            }
          }
          childRecord.set(association.label, record);
          return record;
        }
      };
      if (this.options.saveInline) {
        encoder.encode = function(val) {
          return val.toJSON();
        };
      }
      return encoder;
    };

    BelongsToAssociation.prototype.apply = function(base) {
      var foreignValue, model;
      if (model = base.get(this.label)) {
        foreignValue = model.get(this.primaryKey);
        if (foreignValue !== void 0) {
          return base.set(this.foreignKey, foreignValue);
        }
      }
    };

    return BelongsToAssociation;

  })(Batman.SingularAssociation);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PolymorphicBelongsToAssociation = (function(_super) {

    __extends(PolymorphicBelongsToAssociation, _super);

    PolymorphicBelongsToAssociation.prototype.isPolymorphic = true;

    PolymorphicBelongsToAssociation.prototype.proxyClass = Batman.PolymorphicBelongsToProxy;

    PolymorphicBelongsToAssociation.prototype.defaultOptions = Batman.mixin({}, Batman.BelongsToAssociation.prototype.defaultOptions, {
      encodeForeignTypeKey: true
    });

    function PolymorphicBelongsToAssociation() {
      PolymorphicBelongsToAssociation.__super__.constructor.apply(this, arguments);
      this.foreignTypeKey = this.options.foreignTypeKey || ("" + this.label + "_type");
      if (this.options.encodeForeignTypeKey) {
        this.model.encode(this.foreignTypeKey);
      }
      this.typeIndicies = {};
    }

    PolymorphicBelongsToAssociation.prototype.getRelatedModel = false;

    PolymorphicBelongsToAssociation.prototype.setIndex = false;

    PolymorphicBelongsToAssociation.prototype.inverse = false;

    PolymorphicBelongsToAssociation.prototype.apply = function(base) {
      var foreignTypeValue, instanceOrProxy, model;
      PolymorphicBelongsToAssociation.__super__.apply.apply(this, arguments);
      if (instanceOrProxy = base.get(this.label)) {
        if (instanceOrProxy instanceof Batman.AssociationProxy) {
          model = instanceOrProxy.association.model;
        } else {
          model = instanceOrProxy.constructor;
        }
        foreignTypeValue = model.get('resourceName');
        return base.set(this.foreignTypeKey, foreignTypeValue);
      }
    };

    PolymorphicBelongsToAssociation.prototype.getAccessor = function(self, model, label) {
      var proxy, recordInAttributes;
      if (recordInAttributes = self.getFromAttributes(this)) {
        return recordInAttributes;
      }
      if (self.getRelatedModelForType(this.get(self.foreignTypeKey))) {
        proxy = this.associationProxy(self);
        Batman.Property.withoutTracking(function() {
          if (!proxy.get('loaded') && self.options.autoload) {
            return proxy.load();
          }
        });
        return proxy;
      }
    };

    PolymorphicBelongsToAssociation.prototype.url = function(recordOptions) {
      var ending, helper, id, inverse, root, type, _ref, _ref1;
      type = (_ref = recordOptions.data) != null ? _ref[this.foreignTypeKey] : void 0;
      if (type && (inverse = this.inverseForType(type))) {
        root = Batman.helpers.pluralize(type).toLowerCase();
        id = (_ref1 = recordOptions.data) != null ? _ref1[this.foreignKey] : void 0;
        helper = inverse.isSingular ? "singularize" : "pluralize";
        ending = Batman.helpers[helper](inverse.label);
        return "/" + root + "/" + id + "/" + ending;
      }
    };

    PolymorphicBelongsToAssociation.prototype.getRelatedModelForType = function(type) {
      var relatedModel, scope;
      scope = this.options.namespace || Batman.currentApp;
      if (type) {
        relatedModel = scope != null ? scope[type] : void 0;
        relatedModel || (relatedModel = scope != null ? scope[Batman.helpers.camelize(type)] : void 0);
      }
      Batman.developer["do"](function() {
        if ((Batman.currentApp != null) && !relatedModel) {
          return Batman.developer.warn("Related model " + type + " for polymorhic association not found.");
        }
      });
      return relatedModel;
    };

    PolymorphicBelongsToAssociation.prototype.setIndexForType = function(type) {
      var _base;
      (_base = this.typeIndicies)[type] || (_base[type] = new Batman.PolymorphicUniqueAssociationSetIndex(this, type, this.primaryKey));
      return this.typeIndicies[type];
    };

    PolymorphicBelongsToAssociation.prototype.inverseForType = function(type) {
      var inverse, relatedAssocs, _ref,
        _this = this;
      if (relatedAssocs = (_ref = this.getRelatedModelForType(type)) != null ? _ref._batman.get('associations') : void 0) {
        if (this.options.inverseOf) {
          return relatedAssocs.getByLabel(this.options.inverseOf);
        }
        inverse = null;
        relatedAssocs.forEach(function(label, assoc) {
          if (assoc.getRelatedModel() === _this.model) {
            return inverse = assoc;
          }
        });
        return inverse;
      }
    };

    PolymorphicBelongsToAssociation.prototype.encoder = function() {
      var association, encoder;
      association = this;
      encoder = {
        encode: false,
        decode: function(data, key, response, ___, childRecord) {
          var foreignTypeValue, inverse, record, relatedModel;
          foreignTypeValue = response[association.foreignTypeKey] || childRecord.get(association.foreignTypeKey);
          relatedModel = association.getRelatedModelForType(foreignTypeValue);
          record = new relatedModel();
          record._withoutDirtyTracking(function() {
            return this.fromJSON(data);
          });
          record = relatedModel._mapIdentity(record);
          if (association.options.inverseOf) {
            if (inverse = association.inverseForType(foreignTypeValue)) {
              if (inverse instanceof Batman.PolymorphicHasManyAssociation) {
                childRecord.set(association.foreignKey, record.get(association.primaryKey));
                childRecord.set(association.foreignTypeKey, foreignTypeValue);
              } else {
                record.set(inverse.label, childRecord);
              }
            }
          }
          childRecord.set(association.label, record);
          return record;
        }
      };
      if (this.options.saveInline) {
        encoder.encode = function(val) {
          return val.toJSON();
        };
      }
      return encoder;
    };

    return PolymorphicBelongsToAssociation;

  })(Batman.BelongsToAssociation);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.Validator = (function(_super) {

    __extends(Validator, _super);

    function Validator() {
      var mixins, options;
      options = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.options = options;
      Validator.__super__.constructor.apply(this, mixins);
    }

    Validator.prototype.validate = function(record) {
      return Batman.developer.error("You must override validate in Batman.Validator subclasses.");
    };

    Validator.prototype.format = function(key, messageKey, interpolations) {
      return Batman.t("errors.messages." + messageKey, interpolations);
    };

    Validator.options = function() {
      var options;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      Batman.initializeObject(this);
      if (this._batman.options) {
        return this._batman.options.concat(options);
      } else {
        return this._batman.options = options;
      }
    };

    Validator.matches = function(options) {
      var key, results, shouldReturn, value, _ref, _ref1;
      results = {};
      shouldReturn = false;
      for (key in options) {
        value = options[key];
        if (~((_ref = this._batman) != null ? (_ref1 = _ref.options) != null ? _ref1.indexOf(key) : void 0 : void 0)) {
          results[key] = value;
          shouldReturn = true;
        }
      }
      if (shouldReturn) {
        return results;
      }
    };

    return Validator;

  })(Batman.Object);

}).call(this);

(function() {

  Batman.Validators = [];

  Batman.extend(Batman.translate.messages, {
    errors: {
      format: "%{attribute} %{message}",
      messages: {
        too_short: "must be at least %{count} characters",
        too_long: "must be less than %{count} characters",
        wrong_length: "must be %{count} characters",
        blank: "can't be blank",
        not_numeric: "must be a number",
        not_matching: "is not valid"
      }
    }
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.RegExpValidator = (function(_super) {

    __extends(RegExpValidator, _super);

    RegExpValidator.options('regexp', 'pattern');

    function RegExpValidator(options) {
      var _ref;
      this.regexp = (_ref = options.regexp) != null ? _ref : options.pattern;
      RegExpValidator.__super__.constructor.apply(this, arguments);
    }

    RegExpValidator.prototype.validateEach = function(errors, record, key, callback) {
      var value;
      value = record.get(key);
      if ((value != null) && value !== '') {
        if (!this.regexp.test(value)) {
          errors.add(key, this.format(key, 'not_matching'));
        }
      }
      return callback();
    };

    return RegExpValidator;

  })(Batman.Validator);

  Batman.Validators.push(Batman.RegExpValidator);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.PresenceValidator = (function(_super) {

    __extends(PresenceValidator, _super);

    function PresenceValidator() {
      return PresenceValidator.__super__.constructor.apply(this, arguments);
    }

    PresenceValidator.options('presence');

    PresenceValidator.prototype.validateEach = function(errors, record, key, callback) {
      var value;
      value = record.get(key);
      if (this.options.presence && (!(value != null) || value === '')) {
        errors.add(key, this.format(key, 'blank'));
      }
      return callback();
    };

    return PresenceValidator;

  })(Batman.Validator);

  Batman.Validators.push(Batman.PresenceValidator);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.NumericValidator = (function(_super) {

    __extends(NumericValidator, _super);

    function NumericValidator() {
      return NumericValidator.__super__.constructor.apply(this, arguments);
    }

    NumericValidator.options('numeric');

    NumericValidator.prototype.validateEach = function(errors, record, key, callback) {
      var value;
      value = record.get(key);
      if (this.options.numeric && isNaN(parseFloat(value))) {
        errors.add(key, this.format(key, 'not_numeric'));
      }
      return callback();
    };

    return NumericValidator;

  })(Batman.Validator);

  Batman.Validators.push(Batman.NumericValidator);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.LengthValidator = (function(_super) {

    __extends(LengthValidator, _super);

    LengthValidator.options('minLength', 'maxLength', 'length', 'lengthWithin', 'lengthIn');

    function LengthValidator(options) {
      var range;
      if (range = options.lengthIn || options.lengthWithin) {
        options.minLength = range[0];
        options.maxLength = range[1] || -1;
        delete options.lengthWithin;
        delete options.lengthIn;
      }
      LengthValidator.__super__.constructor.apply(this, arguments);
    }

    LengthValidator.prototype.validateEach = function(errors, record, key, callback) {
      var options, value, _ref;
      options = this.options;
      value = (_ref = record.get(key)) != null ? _ref : [];
      if (options.minLength && value.length < options.minLength) {
        errors.add(key, this.format(key, 'too_short', {
          count: options.minLength
        }));
      }
      if (options.maxLength && value.length > options.maxLength) {
        errors.add(key, this.format(key, 'too_long', {
          count: options.maxLength
        }));
      }
      if (options.length && value.length !== options.length) {
        errors.add(key, this.format(key, 'wrong_length', {
          count: options.length
        }));
      }
      return callback();
    };

    return LengthValidator;

  })(Batman.Validator);

  Batman.Validators.push(Batman.LengthValidator);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.ControllerActionFrame = (function(_super) {

    __extends(ControllerActionFrame, _super);

    ControllerActionFrame.prototype.operationOccurred = false;

    ControllerActionFrame.prototype.remainingOperations = 0;

    ControllerActionFrame.prototype.event('complete').oneShot = true;

    function ControllerActionFrame(options, onComplete) {
      ControllerActionFrame.__super__.constructor.call(this, options);
      this.on('complete', onComplete);
    }

    ControllerActionFrame.prototype.startOperation = function(options) {
      if (options == null) {
        options = {};
      }
      if (!options.internal) {
        this.operationOccurred = true;
      }
      this._changeOperationsCounter(1);
      return true;
    };

    ControllerActionFrame.prototype.finishOperation = function() {
      this._changeOperationsCounter(-1);
      return true;
    };

    ControllerActionFrame.prototype.startAndFinishOperation = function(options) {
      this.startOperation(options);
      this.finishOperation(options);
      return true;
    };

    ControllerActionFrame.prototype._changeOperationsCounter = function(delta) {
      var _ref;
      this.remainingOperations += delta;
      if (this.remainingOperations === 0) {
        this.fire('complete');
      }
      if ((_ref = this.parentFrame) != null) {
        _ref._changeOperationsCounter(delta);
      }
    };

    return ControllerActionFrame;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.DOM.InsertionBinding = (function(_super) {

    __extends(InsertionBinding, _super);

    InsertionBinding.prototype.isTwoWay = false;

    InsertionBinding.prototype.bindImmediately = false;

    function InsertionBinding(node, className, key, context, parentRenderer, invert) {
      var result,
        _this = this;
      this.invert = invert != null ? invert : false;
      this.placeholderNode = document.createComment("detached node " + (this.get('_batmanID')));
      result = InsertionBinding.__super__.constructor.apply(this, arguments);
      Batman.DOM.onParseExit(this.node, function() {
        _this.bind();
        if (_this.placeholderNode != null) {
          return Batman.DOM.trackBinding(_this, _this.placeholderNode);
        }
      });
      result;

    }

    InsertionBinding.prototype.dataChange = function(value) {
      var parentNode;
      parentNode = this.placeholderNode.parentNode || this.node.parentNode;
      if (!!value === !this.invert) {
        if (!(this.node.parentNode != null)) {
          Batman.DOM.insertBefore(parentNode, this.node, this.placeholderNode);
          return parentNode.removeChild(this.placeholderNode);
        }
      } else {
        parentNode.insertBefore(this.placeholderNode, this.node);
        return Batman.DOM.removeNode(this.node);
      }
    };

    InsertionBinding.prototype.die = function() {
      if (this.dead) {
        return;
      }
      InsertionBinding.__super__.die.apply(this, arguments);
      if (!!this.get('filteredValue') === !this.invert) {
        return Batman.DOM.destroyNode(this.placeholderNode);
      } else {
        return Batman.DOM.destroyNode(this.node);
      }
    };

    return InsertionBinding;

  })(Batman.DOM.AbstractBinding);

}).call(this);

(function() {
  var isEmptyDataObject;

  isEmptyDataObject = function(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  };

  Batman.extend(Batman, {
    cache: {},
    uuid: 0,
    expando: "batman" + Math.random().toString().replace(/\D/g, ''),
    canDeleteExpando: (function() {
      var div;
      try {
        div = document.createElement('div');
        return delete div.test;
      } catch (e) {
        return Batman.canDeleteExpando = false;
      }
    })(),
    noData: {
      "embed": true,
      "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      "applet": true
    },
    hasData: function(elem) {
      elem = (elem.nodeType ? Batman.cache[elem[Batman.expando]] : elem[Batman.expando]);
      return !!elem && !isEmptyDataObject(elem);
    },
    data: function(elem, name, data, pvt) {
      var cache, getByName, id, internalKey, ret, thisCache;
      if (!Batman.acceptData(elem)) {
        return;
      }
      internalKey = Batman.expando;
      getByName = typeof name === "string";
      cache = Batman.cache;
      id = elem[Batman.expando];
      if ((!id || (pvt && id && (cache[id] && !cache[id][internalKey]))) && getByName && data === void 0) {
        return;
      }
      if (!id) {
        if (elem.nodeType !== 3) {
          elem[Batman.expando] = id = ++Batman.uuid;
        } else {
          id = Batman.expando;
        }
      }
      if (!cache[id]) {
        cache[id] = {};
      }
      if (typeof name === "object" || typeof name === "function") {
        if (pvt) {
          cache[id][internalKey] = Batman.extend(cache[id][internalKey], name);
        } else {
          cache[id] = Batman.extend(cache[id], name);
        }
      }
      thisCache = cache[id];
      if (pvt) {
        thisCache[internalKey] || (thisCache[internalKey] = {});
        thisCache = thisCache[internalKey];
      }
      if (data !== void 0) {
        thisCache[name] = data;
      }
      if (getByName) {
        ret = thisCache[name];
      } else {
        ret = thisCache;
      }
      return ret;
    },
    removeData: function(elem, name, pvt) {
      var cache, id, internalCache, internalKey, isNode, thisCache;
      if (!Batman.acceptData(elem)) {
        return;
      }
      internalKey = Batman.expando;
      isNode = elem.nodeType;
      cache = Batman.cache;
      id = elem[Batman.expando];
      if (!cache[id]) {
        return;
      }
      if (name) {
        thisCache = pvt ? cache[id][internalKey] : cache[id];
        if (thisCache) {
          delete thisCache[name];
          if (!isEmptyDataObject(thisCache)) {
            return;
          }
        }
      }
      if (pvt) {
        delete cache[id][internalKey];
        if (!isEmptyDataObject(cache[id])) {
          return;
        }
      }
      internalCache = cache[id][internalKey];
      if (Batman.canDeleteExpando || !cache.setInterval) {
        delete cache[id];
      } else {
        cache[id] = null;
      }
      if (internalCache) {
        cache[id] = {};
        return cache[id][internalKey] = internalCache;
      } else {
        if (Batman.canDeleteExpando) {
          return delete elem[Batman.expando];
        } else if (elem.removeAttribute) {
          return elem.removeAttribute(Batman.expando);
        } else {
          return elem[Batman.expando] = null;
        }
      }
    },
    _data: function(elem, name, data) {
      return Batman.data(elem, name, data, true);
    },
    acceptData: function(elem) {
      var match;
      if (elem.nodeName) {
        match = Batman.noData[elem.nodeName.toLowerCase()];
        if (match) {
          return !(match === true || elem.getAttribute("classid") !== match);
        }
      }
      return true;
    }
  });

}).call(this);

(function() {
  var buntUndefined, defaultAndOr,
    __slice = [].slice;

  buntUndefined = function(f) {
    return function(value) {
      if (typeof value === 'undefined') {
        return void 0;
      } else {
        return f.apply(this, arguments);
      }
    };
  };

  defaultAndOr = function(lhs, rhs) {
    return lhs || rhs;
  };

  Batman.Filters = {
    raw: buntUndefined(function(value, binding) {
      binding.escapeValue = false;
      return value;
    }),
    get: buntUndefined(function(value, key) {
      if (value.get != null) {
        return value.get(key);
      } else {
        return value[key];
      }
    }),
    equals: buntUndefined(function(lhs, rhs, binding) {
      return lhs === rhs;
    }),
    and: function(lhs, rhs) {
      return lhs && rhs;
    },
    or: function(lhs, rhs, binding) {
      return lhs || rhs;
    },
    not: function(value, binding) {
      return !!!value;
    },
    matches: buntUndefined(function(value, searchFor) {
      return value.indexOf(searchFor) !== -1;
    }),
    truncate: buntUndefined(function(value, length, end, binding) {
      if (end == null) {
        end = "...";
      }
      if (!binding) {
        binding = end;
        end = "...";
      }
      if (value.length > length) {
        value = value.substr(0, length - end.length) + end;
      }
      return value;
    }),
    "default": function(value, defaultValue, binding) {
      if ((value != null) && value !== '') {
        return value;
      } else {
        return defaultValue;
      }
    },
    prepend: function(value, string, binding) {
      return string + value;
    },
    append: function(value, string, binding) {
      return value + string;
    },
    replace: buntUndefined(function(value, searchFor, replaceWith, flags, binding) {
      if (!binding) {
        binding = flags;
        flags = void 0;
      }
      if (flags === void 0) {
        return value.replace(searchFor, replaceWith);
      } else {
        return value.replace(searchFor, replaceWith, flags);
      }
    }),
    downcase: buntUndefined(function(value) {
      return value.toLowerCase();
    }),
    upcase: buntUndefined(function(value) {
      return value.toUpperCase();
    }),
    pluralize: buntUndefined(function(string, count, includeCount, binding) {
      if (!binding) {
        binding = includeCount;
        includeCount = true;
        if (!binding) {
          binding = count;
          count = void 0;
        }
      }
      if (count) {
        return Batman.helpers.pluralize(count, string, void 0, includeCount);
      } else {
        return Batman.helpers.pluralize(string);
      }
    }),
    humanize: buntUndefined(function(string, binding) {
      return Batman.helpers.humanize(string);
    }),
    join: buntUndefined(function(value, withWhat, binding) {
      if (withWhat == null) {
        withWhat = '';
      }
      if (!binding) {
        binding = withWhat;
        withWhat = '';
      }
      return value.join(withWhat);
    }),
    sort: buntUndefined(function(value) {
      return value.sort();
    }),
    map: buntUndefined(function(value, key) {
      return value.map(function(x) {
        return Batman.get(x, key);
      });
    }),
    has: function(set, item) {
      if (set == null) {
        return false;
      }
      return Batman.contains(set, item);
    },
    first: buntUndefined(function(value) {
      return value[0];
    }),
    meta: buntUndefined(function(value, keypath) {
      Batman.developer.assert(value.meta, "Error, value doesn't have a meta to filter on!");
      return value.meta.get(keypath);
    }),
    interpolate: function(string, interpolationKeypaths, binding) {
      var k, v, values;
      if (!binding) {
        binding = interpolationKeypaths;
        interpolationKeypaths = void 0;
      }
      if (!string) {
        return;
      }
      values = {};
      for (k in interpolationKeypaths) {
        v = interpolationKeypaths[k];
        values[k] = this.get(v);
        if (!(values[k] != null)) {
          Batman.developer.warn("Warning! Undefined interpolation key " + k + " for interpolation", string);
          values[k] = '';
        }
      }
      return Batman.helpers.interpolate(string, values);
    },
    withArguments: function() {
      var binding, block, curryArgs, _i;
      block = arguments[0], curryArgs = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), binding = arguments[_i++];
      if (!block) {
        return;
      }
      return function() {
        var regularArgs;
        regularArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return block.call.apply(block, [this].concat(__slice.call(curryArgs), __slice.call(regularArgs)));
      };
    },
    routeToAction: buntUndefined(function(model, action) {
      var params;
      params = Batman.Dispatcher.paramsFromArgument(model);
      params.action = action;
      return params;
    }),
    escape: buntUndefined(Batman.escapeHTML)
  };

  (function() {
    var k, _i, _len, _ref, _results;
    _ref = ['capitalize', 'singularize', 'underscore', 'camelize'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      _results.push(Batman.Filters[k] = buntUndefined(Batman.helpers[k]));
    }
    return _results;
  })();

  Batman.developer.addFilters();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.RenderContext = (function() {
    var ContextProxy;

    RenderContext.deProxy = function(object) {
      if ((object != null) && object.isContextProxy) {
        return object.get('proxiedObject');
      } else {
        return object;
      }
    };

    RenderContext.root = function() {
      var root;
      if (Batman.currentApp != null) {
        root = Batman.currentApp.get('_renderContext');
      }
      return root != null ? root : root = this.base;
    };

    RenderContext.prototype.windowWrapper = {
      window: Batman.container
    };

    function RenderContext(object, parent) {
      this.object = object;
      this.parent = parent;
    }

    RenderContext.prototype.findKey = function(key) {
      var base, currentNode, val;
      base = key.split('.')[0].split('|')[0].trim();
      currentNode = this;
      while (currentNode) {
        val = Batman.get(currentNode.object, base);
        if (typeof val !== 'undefined') {
          val = Batman.get(currentNode.object, key);
          return [val, currentNode.object].map(this.constructor.deProxy);
        }
        currentNode = currentNode.parent;
      }
      return [Batman.get(this.windowWrapper, key), this.windowWrapper];
    };

    RenderContext.prototype.get = function(key) {
      return this.findKey(key)[0];
    };

    RenderContext.prototype.contextForKey = function(key) {
      return this.findKey(key)[1];
    };

    RenderContext.prototype.descend = function(object, scopedKey) {
      var oldObject;
      if (scopedKey) {
        oldObject = object;
        object = new Batman.Object();
        object[scopedKey] = oldObject;
      }
      return new this.constructor(object, this);
    };

    RenderContext.prototype.descendWithKey = function(key, scopedKey) {
      var proxy;
      proxy = new ContextProxy(this, key);
      return this.descend(proxy, scopedKey);
    };

    RenderContext.prototype.chain = function() {
      var parent, x;
      x = [];
      parent = this;
      while (parent) {
        x.push(parent.object);
        parent = parent.parent;
      }
      return x;
    };

    RenderContext.ContextProxy = ContextProxy = (function(_super) {

      __extends(ContextProxy, _super);

      ContextProxy.prototype.isContextProxy = true;

      ContextProxy.accessor('proxiedObject', function() {
        return this.binding.get('filteredValue');
      });

      ContextProxy.accessor({
        get: function(key) {
          return this.get("proxiedObject." + key);
        },
        set: function(key, value) {
          return this.set("proxiedObject." + key, value);
        },
        unset: function(key) {
          return this.unset("proxiedObject." + key);
        }
      });

      function ContextProxy(renderContext, keyPath, localKey) {
        this.renderContext = renderContext;
        this.keyPath = keyPath;
        this.localKey = localKey;
        this.binding = new Batman.DOM.AbstractBinding(void 0, this.keyPath, this.renderContext);
      }

      return ContextProxy;

    })(Batman.Object);

    return RenderContext;

  }).call(this);

  Batman.RenderContext.base = new Batman.RenderContext(Batman.RenderContext.prototype.windowWrapper);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Batman.ViewStore = (function(_super) {

    __extends(ViewStore, _super);

    ViewStore.prefix = 'views';

    ViewStore.fetchFromRemote = true;

    function ViewStore() {
      ViewStore.__super__.constructor.apply(this, arguments);
      this._viewContents = {};
      this._requestedPaths = new Batman.SimpleSet;
    }

    ViewStore.prototype.propertyClass = Batman.Property;

    ViewStore.prototype.fetchView = function(path) {
      var _this = this;
      return new Batman.Request({
        url: Batman.Navigator.normalizePath(this.constructor.prefix, "" + path + ".html"),
        type: 'html',
        success: function(response) {
          return _this.set(path, response);
        },
        error: function(response) {
          throw new Error("Could not load view from " + path);
        }
      });
    };

    ViewStore.accessor({
      'final': true,
      get: function(path) {
        var contents;
        if (path[0] !== '/') {
          return this.get("/" + path);
        }
        if (this._viewContents[path]) {
          return this._viewContents[path];
        }
        if (this._requestedPaths.has(path)) {
          return;
        }
        if (contents = this._sourceFromDOM(path)) {
          return contents;
        }
        if (this.constructor.fetchFromRemote) {
          this.fetchView(path);
        } else {
          throw new Error("Couldn't find view source for \'" + path + "\'!");
        }
      },
      set: function(path, content) {
        if (path[0] !== '/') {
          return this.set("/" + path, content);
        }
        this._requestedPaths.add(path);
        return this._viewContents[path] = content;
      }
    });

    ViewStore.prototype.prefetch = function(path) {
      this.get(path);
      return true;
    };

    ViewStore.prototype._sourceFromDOM = function(path) {
      var node, relativePath;
      relativePath = path.slice(1);
      if (node = Batman.DOM.querySelector(document, "[data-defineview*='" + relativePath + "']")) {
        Batman.setImmediate(function() {
          var _ref;
          return (_ref = node.parentNode) != null ? _ref.removeChild(node) : void 0;
        });
        return Batman.DOM.defineView(path, node);
      }
    };

    return ViewStore;

  })(Batman.Object);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.View = (function(_super) {

    __extends(View, _super);

    View.store = new Batman.ViewStore();

    View.option = function() {
      var keys,
        _this = this;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      keys.forEach(function(key) {
        return _this.accessor(_this.prototype._argumentBindingKey(key), function(bindingKey) {
          var context, keyPath, node, _ref;
          if (!((node = this.get('node')) && (context = this.get('context')))) {
            return;
          }
          keyPath = node.getAttribute(("data-view-" + key).toLowerCase());
          if (keyPath == null) {
            return;
          }
          if ((_ref = this[bindingKey]) != null) {
            _ref.die();
          }
          return this[bindingKey] = new Batman.DOM.ViewArgumentBinding(node, keyPath, context);
        });
      });
      return this.accessor.apply(this, __slice.call(keys).concat([function(key) {
        var _ref;
        return (_ref = this.get(this._argumentBindingKey(key))) != null ? _ref.get('filteredValue') : void 0;
      }]));
    };

    View.prototype.isView = true;

    View.prototype.cache = true;

    View.prototype._rendered = false;

    View.prototype.source = '';

    View.prototype.html = '';

    View.prototype.node = null;

    View.prototype.event('ready').oneShot = true;

    View.accessor('html', {
      get: function() {
        var source;
        if (this.html && this.html.length > 0) {
          return this.html;
        }
        if (!(source = this.get('source'))) {
          return;
        }
        source = Batman.Navigator.normalizePath(source);
        return this.html = this.constructor.store.get(source);
      },
      set: function(_, html) {
        return this.html = html;
      }
    });

    View.accessor('node', {
      get: function() {
        var html;
        if (this.node == null) {
          html = this.get('html');
          if (!(html && html.length > 0)) {
            return;
          }
          this.node = document.createElement('div');
          this._setNodeOwner(this.node);
          Batman.setInnerHTML(this.node, html);
        }
        return this.node;
      },
      set: function(_, node) {
        var updateHTML,
          _this = this;
        this.node = node;
        this._setNodeOwner(node);
        updateHTML = function(html) {
          if (html != null) {
            Batman.setInnerHTML(_this.node, html);
            return _this.forget('html', updateHTML);
          }
        };
        this.observeAndFire('html', updateHTML);
        return node;
      }
    });

    View.YieldStorage = (function(_super1) {

      __extends(YieldStorage, _super1);

      function YieldStorage() {
        return YieldStorage.__super__.constructor.apply(this, arguments);
      }

      YieldStorage.wrapAccessor(function(core) {
        return {
          get: function(key) {
            var val;
            val = core.get.call(this, key);
            if (!(val != null)) {
              val = this.set(key, []);
            }
            return val;
          }
        };
      });

      return YieldStorage;

    })(Batman.Hash);

    View.accessor('yields', function() {
      return new this.constructor.YieldStorage;
    });

    function View(options) {
      var context,
        _this = this;
      if (options == null) {
        options = {};
      }
      context = options.context;
      if (context) {
        if (!(context instanceof Batman.RenderContext)) {
          context = Batman.RenderContext.root().descend(context);
        }
      } else {
        context = Batman.RenderContext.root();
      }
      options.context = context.descend(this);
      View.__super__.constructor.call(this, options);
      Batman.Property.withoutTracking(function() {
        var node;
        if (node = _this.get('node')) {
          return _this.render(node);
        } else {
          return _this.observeOnce('node', function(node) {
            return _this.render(node);
          });
        }
      });
    }

    View.prototype.render = function(node) {
      var _this = this;
      if (this._rendered) {
        return;
      }
      this._rendered = true;
      this.event('ready').resetOneShot();
      if (node) {
        this._renderer = new Batman.Renderer(node, this.context, this);
        return this._renderer.on('rendered', function() {
          return _this.fire('ready', node);
        });
      }
    };

    View.prototype.isInDOM = function() {
      var node;
      if ((node = this.get('node'))) {
        return (node.parentNode != null) || this.get('yields').some(function(name, nodes) {
          var _i, _len;
          for (_i = 0, _len = nodes.length; _i < _len; _i++) {
            node = nodes[_i].node;
            if (node.parentNode != null) {
              return true;
            }
          }
          return false;
        });
      } else {
        return false;
      }
    };

    View.prototype.applyYields = function() {
      return this.get('yields').forEach(function(name, nodes) {
        var action, node, yieldObject, _i, _len, _ref, _results;
        yieldObject = Batman.DOM.Yield.withName(name);
        _results = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          _ref = nodes[_i], node = _ref.node, action = _ref.action;
          _results.push(yieldObject[action](node));
        }
        return _results;
      });
    };

    View.prototype.retractYields = function() {
      return this.get('yields').forEach(function(name, nodes) {
        var node, _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i].node;
          _results.push((_ref = node.parentNode) != null ? _ref.removeChild(node) : void 0);
        }
        return _results;
      });
    };

    View.prototype.pushYieldAction = function(key, action, node) {
      this._setNodeYielder(node);
      return this.get("yields").get(key).push({
        node: node,
        action: action
      });
    };

    View.prototype._argumentBindingKey = function(key) {
      return "_" + key + "ArgumentBinding";
    };

    View.prototype._setNodeOwner = function(node) {
      return Batman._data(node, 'view', this);
    };

    View.prototype._setNodeYielder = function(node) {
      return Batman._data(node, 'yielder', this);
    };

    View.prototype.on('ready', function() {
      return typeof this.ready === "function" ? this.ready.apply(this, arguments) : void 0;
    });

    View.prototype.on('appear', function() {
      return typeof this.viewDidAppear === "function" ? this.viewDidAppear.apply(this, arguments) : void 0;
    });

    View.prototype.on('disappear', function() {
      return typeof this.viewDidDisappear === "function" ? this.viewDidDisappear.apply(this, arguments) : void 0;
    });

    View.prototype.on('beforeAppear', function() {
      return typeof this.viewWillAppear === "function" ? this.viewWillAppear.apply(this, arguments) : void 0;
    });

    View.prototype.on('beforeDisappear', function() {
      return typeof this.viewWillDisappear === "function" ? this.viewWillDisappear.apply(this, arguments) : void 0;
    });

    return View;

  }).call(this, Batman.Object);

}).call(this);

(function() {
  var Yield,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Batman.DOM.Yield = Yield = (function(_super) {

    __extends(Yield, _super);

    Yield.yields = {};

    Yield.queued = function(fn) {
      return function() {
        var args, handler,
          _this = this;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (this.containerNode != null) {
          return fn.apply(this, args);
        } else {
          return handler = this.observe('containerNode', function() {
            var result;
            result = fn.apply(_this, args);
            _this.forget('containerNode', handler);
            return result;
          });
        }
      };
    };

    Yield.reset = function() {
      return this.yields = {};
    };

    Yield.withName = function(name) {
      var _base;
      (_base = this.yields)[name] || (_base[name] = new this({
        name: name
      }));
      return this.yields[name];
    };

    Yield.forEach = function(f) {
      var name, yieldObject, _ref;
      _ref = this.yields;
      for (name in _ref) {
        yieldObject = _ref[name];
        f(yieldObject);
      }
    };

    Yield.clearAll = function() {
      return this.forEach(function(yieldObject) {
        return yieldObject.clear();
      });
    };

    Yield.cycleAll = function() {
      return this.forEach(function(yieldObject) {
        return yieldObject.cycle();
      });
    };

    Yield.clearAllStale = function() {
      return this.forEach(function(yieldObject) {
        return yieldObject.clearStale();
      });
    };

    function Yield() {
      this.cycle();
    }

    Yield.prototype.cycle = function() {
      return this.currentVersionNodes = [];
    };

    Yield.prototype.clear = Yield.queued(function() {
      var child, _i, _len, _ref, _results;
      this.cycle();
      _ref = (function() {
        var _j, _len, _ref, _results1;
        _ref = this.containerNode.childNodes;
        _results1 = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          child = _ref[_j];
          _results1.push(child);
        }
        return _results1;
      }).call(this);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(Batman.removeOrDestroyNode(child));
      }
      return _results;
    });

    Yield.prototype.clearStale = Yield.queued(function() {
      var child, _i, _len, _ref, _results;
      _ref = (function() {
        var _j, _len, _ref, _results1;
        _ref = this.containerNode.childNodes;
        _results1 = [];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          child = _ref[_j];
          _results1.push(child);
        }
        return _results1;
      }).call(this);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (!~this.currentVersionNodes.indexOf(child)) {
          _results.push(Batman.removeOrDestroyNode(child));
        }
      }
      return _results;
    });

    Yield.prototype.append = Yield.queued(function(node) {
      this.currentVersionNodes.push(node);
      return Batman.appendChild(this.containerNode, node, true);
    });

    Yield.prototype.replace = Yield.queued(function(node) {
      this.clear();
      return this.append(node);
    });

    return Yield;

  })(Batman.Object);

}).call(this);

(function() {



}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var date_re, numericKeys,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  numericKeys = [1, 2, 3, 4, 5, 6, 7, 10, 11];

  date_re = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;

  Batman.mixin(Batman.Encoders, {
    railsDate: {
      defaultTimezoneOffset: (new Date()).getTimezoneOffset(),
      encode: function(value) {
        return value;
      },
      decode: function(value) {
        var key, minutesOffset, obj, _i, _len;
        if (value != null) {
          if ((obj = date_re.exec(value))) {
            for (_i = 0, _len = numericKeys.length; _i < _len; _i++) {
              key = numericKeys[_i];
              obj[key] = +obj[key] || 0;
            }
            obj[2] = (+obj[2] || 1) - 1;
            obj[3] = +obj[3] || 1;
            if (obj[8] !== "Z" && obj[9] !== void 0) {
              minutesOffset = obj[10] * 60 + obj[11];
              if (obj[9] === "+") {
                minutesOffset = 0 - minutesOffset;
              }
            } else {
              minutesOffset = Batman.Encoders.railsDate.defaultTimezoneOffset;
            }
            return new Date(Date.UTC(obj[1], obj[2], obj[3], obj[4], obj[5] + minutesOffset, obj[6], obj[7]));
          } else {
            Batman.developer.warn("Unrecognized rails date " + value + "!");
            return Date.parse(value);
          }
        }
      }
    }
  });

  Batman.RailsStorage = (function(_super) {

    __extends(RailsStorage, _super);

    function RailsStorage() {
      return RailsStorage.__super__.constructor.apply(this, arguments);
    }

    RailsStorage.prototype.urlForRecord = function() {
      return this._addJsonExtension(RailsStorage.__super__.urlForRecord.apply(this, arguments));
    };

    RailsStorage.prototype.urlForCollection = function() {
      return this._addJsonExtension(RailsStorage.__super__.urlForCollection.apply(this, arguments));
    };

    RailsStorage.prototype._addJsonExtension = function(url) {
      if (url.indexOf('?') !== -1 || url.substr(-5, 5) === '.json') {
        return url;
      }
      return url + '.json';
    };

    RailsStorage.prototype._errorsFrom422Response = function(response) {
      return JSON.parse(response);
    };

    RailsStorage.prototype.after('update', 'create', function(env, next) {
      var error, errorsArray, key, record, response, validationError, validationErrors, _i, _len, _ref;
      record = env.subject;
      error = env.error, response = env.response;
      if (error) {
        if (((_ref = error.request) != null ? _ref.get('status') : void 0) === 422) {
          try {
            validationErrors = this._errorsFrom422Response(response);
          } catch (extractionError) {
            env.error = extractionError;
            return next();
          }
          for (key in validationErrors) {
            errorsArray = validationErrors[key];
            for (_i = 0, _len = errorsArray.length; _i < _len; _i++) {
              validationError = errorsArray[_i];
              record.get('errors').add(key, validationError);
            }
          }
          env.result = record;
          env.error = record.get('errors');
          return next();
        }
      }
      return next();
    });

    return RailsStorage;

  })(Batman.RestStorage);

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var Titanium;

  if (!window.Titanium) {
    Titanium = {
      UI: {
        UserWindow: {
          showInspector: function(bool) {
            return console.log('***show inspector***');
          }
        }
      },
      Process: {
        createProcess: function(args, env, stdin, stdout, stderr) {
          return function() {
            return {
              toString: function() {},
              launch: function() {}
            };
          };
        }
      }
    };
    window.Titanium = Titanium;
  }

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var Tunes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Tunes = Tunes = (function(_super) {
    var _this = this;

    __extends(Tunes, _super);

    function Tunes() {
      return Tunes.__super__.constructor.apply(this, arguments);
    }

    Tunes.title = "iCloudTunes";

    Tunes.root('tunes#index');

    Tunes.on('run', function() {
      $('script[type="text/template"]').each(function() {
        return Batman.View.store.set($(this).attr('id'), $(this).html());
      });
      return console.log("We're running");
    });

    Tunes.on('ready', function() {
      return console.log("We're ready");
    });

    return Tunes;

  }).call(this, Batman.App);

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tunes.Track = (function(_super) {

    __extends(Track, _super);

    function Track() {
      return Track.__super__.constructor.apply(this, arguments);
    }

    Track.prototype.resourceName = 'track';

    Track.encode('name', 'artist', 'album', 'duration', 'location', 'databaseID', 'pushed', 'filename', 'filetype');

    return Track;

  })(Batman.Model);

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tunes.Session = (function(_super) {

    __extends(Session, _super);

    function Session() {
      return Session.__super__.constructor.apply(this, arguments);
    }

    return Session;

  })(Batman.Model);

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tunes.Pushed = (function(_super) {

    __extends(Pushed, _super);

    function Pushed() {
      this.push = __bind(this.push, this);
      return Pushed.__super__.constructor.apply(this, arguments);
    }

    Pushed.resourceName = 'push_queue';

    Pushed.persist(Batman.LocalStorage);

    Pushed.encode('name', 'artist', 'album', 'duration', 'databaseID', 'location');

    Pushed.prototype.push = function() {
      var file;
      return file = Titanium.Filesystem.getFile(this.get);
    };

    return Pushed;

  })(Batman.Model);

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tunes.ITunesApp = (function(_super) {

    __extends(ITunesApp, _super);

    function ITunesApp() {
      this.currentTrack = __bind(this.currentTrack, this);

      this.isPlaying = __bind(this.isPlaying, this);

      this.isRunning = __bind(this.isRunning, this);

      this.getOsa = __bind(this.getOsa, this);
      this.set('stateText', 'stopped');
      this.set('playhead', null);
      this.set('iTunesRunning', 0);
      this.set('trackDuration', 0);
      this.set('currentDatabaseID', 0);
      this.accessor('percentPlayed', {
        get: function(key) {
          return Math.round((this.get('playhead') / this.get('trackDuration')) * 100);
        }
      });
    }

    ITunesApp.prototype.getOsa = function() {
      var state, _ref;
      this.set('iTunesRunning', parseInt(this.tellApp('count (every process whose displayed name is "iTunes")', 'System Events')));
      state = (_ref = this.tellApp('return {player state, player position}')) != null ? _ref.split(',') : void 0;
      if (state) {
        this.set('currentDatabaseID', parseInt(this.tellApp('return database id of current track'), 10));
        this.set('stateText', state[0]);
        this.set('playhead', parseInt(state[1], 10));
      }
    };

    ITunesApp.prototype.isRunning = function() {
      this.getOsa();
      return this.get('itunesTunning') > 0;
    };

    ITunesApp.prototype.isPlaying = function() {
      this.getOsa();
      if (this.get('stateText') === "stopped") {
        return false;
      }
      if (this.get('stateText') === "playing") {
        return true;
      }
      return false;
    };

    ITunesApp.prototype.currentTrack = function() {
      var info, location, spl;
      info = this.tellApp('return {n:name,ar:artist,al:album,d:duration,id:database id,kind:kind} of current track').split(/,\s\w+:/);
      location = this.tellApp('return POSIX path of ((get location of current track) as text)').replace(/\n/, '');
      this.set('trackDuration', parseFloat(info[3]));
      spl = location.split('/');
      return new Tunes.Track({
        name: info[0].substr(2),
        artist: info[1],
        album: info[2],
        duration: parseFloat(info[3]),
        databaseID: parseInt(info[4]),
        location: location,
        filetype: this.trackMime(info[5]),
        filename: location.split('/')[spl.length - 1]
      });
    };

    ITunesApp.prototype.trackMime = function(kind) {
      switch (kind.replace(/\n/, '')) {
        case "MPEG audio file":
          return "audio/mpeg";
        case "MPEG audio stream":
          return "audio/mpeg";
        case "AAC audio file":
          return "audio/m4a";
        case "Purchased AAC audio file":
          return "audio/m4a";
        case "WAV audio file":
          return "audio/wav";
        default:
          return "unknown";
      }
    };

    ITunesApp.prototype.tellApp = function(to, app) {
      var command, process;
      if (!app) {
        app = "iTunes";
      }
      command = ["osascript", "-e", "tell app \"" + app + "\" to " + to];
      process = Titanium.Process.createProcess(command);
      return process().toString();
    };

    return ITunesApp;

  })(Batman.Object);

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tunes.TunesController = (function(_super) {

    __extends(TunesController, _super);

    function TunesController() {
      this.refresh = __bind(this.refresh, this);

      this.index = __bind(this.index, this);
      this.set('app', new Tunes.ITunesApp());
    }

    TunesController.prototype.routingKey = 'tunes';

    TunesController.prototype.index = function(params) {
      console.log("TunesController > Index");
      this.refresh();
      return setInterval(this.refresh, 2500);
    };

    TunesController.prototype.refresh = function(params) {
      if (this.get('app').isPlaying() === true) {
        if (this.get('track') === void 0 || (this.get('app').get('currentDatabaseID') !== this.get('track').get('databaseID'))) {
          return this.set('track', this.get('app').currentTrack());
        }
      }
    };

    return TunesController;

  })(Batman.Controller);

}).call(this);
 

// Generated by CoffeeScript 1.3.3
(function() {

  window.Tunes || (window.Tunes = {});

  $(function() {
    $('img').live('dragstart', function(e) {
      return e.preventDefault();
    });
    return Tunes.run();
  });

}).call(this);
 

