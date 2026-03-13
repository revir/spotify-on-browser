// https://sdk.scdn.co/spotify-player.js
/* Spotify JS-SDK - v1.10.0-9fee1b0 */

!(function e(t, r, n) {
  function o(i, a) {
    if (!r[i]) {
      if (!t[i]) {
        var u = "function" == typeof require && require;
        if (!a && u) return u(i, !0);
        if (s) return s(i, !0);
        var c = new Error("Cannot find module '" + i + "'");
        throw ((c.code = "MODULE_NOT_FOUND"), c);
      }
      var f = (r[i] = { exports: {} });
      t[i][0].call(
        f.exports,
        function (e) {
          return o(t[i][1][e] || e);
        },
        f,
        f.exports,
        e,
        t,
        r,
        n,
      );
    }
    return r[i].exports;
  }
  for (
    var s = "function" == typeof require && require, i = 0;
    i < n.length;
    i++
  )
    o(n[i]);
  return o;
})(
  {
    1: [
      function (e, t, r) {
        "use strict";
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.createPromiseResolver = function () {
            var e, t;
            return {
              promise: new Promise(function (r, n) {
                ((e = r), (t = n));
              }),
              resolve: e,
              reject: t,
            };
          }));
      },
      {},
    ],
    2: [
      function (e, t, r) {
        (function (e) {
          (function () {
            "use strict";
            function r(e) {
              return (r =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e &&
                        "function" == typeof Symbol &&
                        e.constructor === Symbol &&
                        e !== Symbol.prototype
                        ? "symbol"
                        : typeof e;
                    })(e);
            }
            var n,
              o,
              s,
              i,
              a,
              u,
              c,
              f,
              l,
              p,
              _,
              d,
              y,
              E,
              h,
              g,
              v,
              m,
              R,
              A,
              T,
              O,
              M,
              b,
              P,
              S,
              w,
              L,
              N,
              C,
              I,
              D;
            !(function (n) {
              var o =
                "object" === (void 0 === e ? "undefined" : r(e))
                  ? e
                  : "object" ===
                      ("undefined" == typeof self ? "undefined" : r(self))
                    ? self
                    : "object" === r(this)
                      ? this
                      : {};
              function s(e, t) {
                return (
                  e !== o &&
                    ("function" == typeof Object.create
                      ? Object.defineProperty(e, "__esModule", { value: !0 })
                      : (e.__esModule = !0)),
                  function (r, n) {
                    return (e[r] = t ? t(r, n) : n);
                  }
                );
              }
              "function" == typeof define && define.amd
                ? define("tslib", ["exports"], function (e) {
                    n(s(o, s(e)));
                  })
                : "object" === (void 0 === t ? "undefined" : r(t)) &&
                    "object" === r(t.exports)
                  ? n(s(o, s(t.exports)))
                  : n(s(o));
            })(function (e) {
              var t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, t) {
                    e.__proto__ = t;
                  }) ||
                function (e, t) {
                  for (var r in t)
                    Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                };
              ((n = function (e, r) {
                if ("function" != typeof r && null !== r)
                  throw new TypeError(
                    "Class extends value " +
                      String(r) +
                      " is not a constructor or null",
                  );
                function n() {
                  this.constructor = e;
                }
                (t(e, r),
                  (e.prototype =
                    null === r
                      ? Object.create(r)
                      : ((n.prototype = r.prototype), new n())));
              }),
                (o =
                  Object.assign ||
                  function (e) {
                    for (var t, r = 1, n = arguments.length; r < n; r++)
                      for (var o in (t = arguments[r]))
                        Object.prototype.hasOwnProperty.call(t, o) &&
                          (e[o] = t[o]);
                    return e;
                  }),
                (s = function (e, t) {
                  var r = {};
                  for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) &&
                      t.indexOf(n) < 0 &&
                      (r[n] = e[n]);
                  if (
                    null != e &&
                    "function" == typeof Object.getOwnPropertySymbols
                  ) {
                    var o = 0;
                    for (n = Object.getOwnPropertySymbols(e); o < n.length; o++)
                      t.indexOf(n[o]) < 0 &&
                        Object.prototype.propertyIsEnumerable.call(e, n[o]) &&
                        (r[n[o]] = e[n[o]]);
                  }
                  return r;
                }),
                (i = function (e, t, n, o) {
                  var s,
                    i = arguments.length,
                    a =
                      i < 3
                        ? t
                        : null === o
                          ? (o = Object.getOwnPropertyDescriptor(t, n))
                          : o;
                  if (
                    "object" ===
                      ("undefined" == typeof Reflect
                        ? "undefined"
                        : r(Reflect)) &&
                    "function" == typeof Reflect.decorate
                  )
                    a = Reflect.decorate(e, t, n, o);
                  else
                    for (var u = e.length - 1; u >= 0; u--)
                      (s = e[u]) &&
                        (a =
                          (i < 3 ? s(a) : i > 3 ? s(t, n, a) : s(t, n)) || a);
                  return (i > 3 && a && Object.defineProperty(t, n, a), a);
                }),
                (a = function (e, t) {
                  return function (r, n) {
                    t(r, n, e);
                  };
                }),
                (u = function (e, t, n, o, s, i) {
                  function a(e) {
                    if (void 0 !== e && "function" != typeof e)
                      throw new TypeError("Function expected");
                    return e;
                  }
                  for (
                    var u,
                      c = o.kind,
                      f =
                        "getter" === c
                          ? "get"
                          : "setter" === c
                            ? "set"
                            : "value",
                      l = !t && e ? (o.static ? e : e.prototype) : null,
                      p =
                        t ||
                        (l ? Object.getOwnPropertyDescriptor(l, o.name) : {}),
                      _ = !1,
                      d = n.length - 1;
                    d >= 0;
                    d--
                  ) {
                    var y = {};
                    for (var E in o) y[E] = "access" === E ? {} : o[E];
                    for (var E in o.access) y.access[E] = o.access[E];
                    y.addInitializer = function (e) {
                      if (_)
                        throw new TypeError(
                          "Cannot add initializers after decoration has completed",
                        );
                      i.push(a(e || null));
                    };
                    var h = (0, n[d])(
                      "accessor" === c ? { get: p.get, set: p.set } : p[f],
                      y,
                    );
                    if ("accessor" === c) {
                      if (void 0 === h) continue;
                      if (null === h || "object" !== r(h))
                        throw new TypeError("Object expected");
                      ((u = a(h.get)) && (p.get = u),
                        (u = a(h.set)) && (p.set = u),
                        (u = a(h.init)) && s.unshift(u));
                    } else
                      (u = a(h)) && ("field" === c ? s.unshift(u) : (p[f] = u));
                  }
                  (l && Object.defineProperty(l, o.name, p), (_ = !0));
                }),
                (c = function (e, t, r) {
                  for (var n = arguments.length > 2, o = 0; o < t.length; o++)
                    r = n ? t[o].call(e, r) : t[o].call(e);
                  return n ? r : void 0;
                }),
                (f = function (e) {
                  return "symbol" === r(e) ? e : "".concat(e);
                }),
                (l = function (e, t, n) {
                  return (
                    "symbol" === r(t) &&
                      (t = t.description ? "[".concat(t.description, "]") : ""),
                    Object.defineProperty(e, "name", {
                      configurable: !0,
                      value: n ? "".concat(n, " ", t) : t,
                    })
                  );
                }),
                (p = function (e, t) {
                  if (
                    "object" ===
                      ("undefined" == typeof Reflect
                        ? "undefined"
                        : r(Reflect)) &&
                    "function" == typeof Reflect.metadata
                  )
                    return Reflect.metadata(e, t);
                }),
                (_ = function (e, t, r, n) {
                  return new (r || (r = Promise))(function (o, s) {
                    function i(e) {
                      try {
                        u(n.next(e));
                      } catch (e) {
                        s(e);
                      }
                    }
                    function a(e) {
                      try {
                        u(n.throw(e));
                      } catch (e) {
                        s(e);
                      }
                    }
                    function u(e) {
                      var t;
                      e.done
                        ? o(e.value)
                        : ((t = e.value),
                          t instanceof r
                            ? t
                            : new r(function (e) {
                                e(t);
                              })).then(i, a);
                    }
                    u((n = n.apply(e, t || [])).next());
                  });
                }),
                (d = function (e, t) {
                  var r,
                    n,
                    o,
                    s = {
                      label: 0,
                      sent: function () {
                        if (1 & o[0]) throw o[1];
                        return o[1];
                      },
                      trys: [],
                      ops: [],
                    },
                    i = Object.create(
                      ("function" == typeof Iterator ? Iterator : Object)
                        .prototype,
                    );
                  return (
                    (i.next = a(0)),
                    (i.throw = a(1)),
                    (i.return = a(2)),
                    "function" == typeof Symbol &&
                      (i[Symbol.iterator] = function () {
                        return this;
                      }),
                    i
                  );
                  function a(a) {
                    return function (u) {
                      return (function (a) {
                        if (r)
                          throw new TypeError(
                            "Generator is already executing.",
                          );
                        for (; i && ((i = 0), a[0] && (s = 0)), s; )
                          try {
                            if (
                              ((r = 1),
                              n &&
                                (o =
                                  2 & a[0]
                                    ? n.return
                                    : a[0]
                                      ? n.throw ||
                                        ((o = n.return) && o.call(n), 0)
                                      : n.next) &&
                                !(o = o.call(n, a[1])).done)
                            )
                              return o;
                            switch (
                              ((n = 0), o && (a = [2 & a[0], o.value]), a[0])
                            ) {
                              case 0:
                              case 1:
                                o = a;
                                break;
                              case 4:
                                return (s.label++, { value: a[1], done: !1 });
                              case 5:
                                (s.label++, (n = a[1]), (a = [0]));
                                continue;
                              case 7:
                                ((a = s.ops.pop()), s.trys.pop());
                                continue;
                              default:
                                if (
                                  !((o = s.trys),
                                  (o = o.length > 0 && o[o.length - 1]) ||
                                    (6 !== a[0] && 2 !== a[0]))
                                ) {
                                  s = 0;
                                  continue;
                                }
                                if (
                                  3 === a[0] &&
                                  (!o || (a[1] > o[0] && a[1] < o[3]))
                                ) {
                                  s.label = a[1];
                                  break;
                                }
                                if (6 === a[0] && s.label < o[1]) {
                                  ((s.label = o[1]), (o = a));
                                  break;
                                }
                                if (o && s.label < o[2]) {
                                  ((s.label = o[2]), s.ops.push(a));
                                  break;
                                }
                                (o[2] && s.ops.pop(), s.trys.pop());
                                continue;
                            }
                            a = t.call(e, s);
                          } catch (e) {
                            ((a = [6, e]), (n = 0));
                          } finally {
                            r = o = 0;
                          }
                        if (5 & a[0]) throw a[1];
                        return { value: a[0] ? a[1] : void 0, done: !0 };
                      })([a, u]);
                    };
                  }
                }),
                (y = function (e, t) {
                  for (var r in e)
                    "default" === r ||
                      Object.prototype.hasOwnProperty.call(t, r) ||
                      N(t, e, r);
                }),
                (N = Object.create
                  ? function (e, t, r, n) {
                      void 0 === n && (n = r);
                      var o = Object.getOwnPropertyDescriptor(t, r);
                      ((o &&
                        !("get" in o
                          ? !t.__esModule
                          : o.writable || o.configurable)) ||
                        (o = {
                          enumerable: !0,
                          get: function () {
                            return t[r];
                          },
                        }),
                        Object.defineProperty(e, n, o));
                    }
                  : function (e, t, r, n) {
                      (void 0 === n && (n = r), (e[n] = t[r]));
                    }),
                (E = function (e) {
                  var t = "function" == typeof Symbol && Symbol.iterator,
                    r = t && e[t],
                    n = 0;
                  if (r) return r.call(e);
                  if (e && "number" == typeof e.length)
                    return {
                      next: function () {
                        return (
                          e && n >= e.length && (e = void 0),
                          { value: e && e[n++], done: !e }
                        );
                      },
                    };
                  throw new TypeError(
                    t
                      ? "Object is not iterable."
                      : "Symbol.iterator is not defined.",
                  );
                }),
                (h = function (e, t) {
                  var r = "function" == typeof Symbol && e[Symbol.iterator];
                  if (!r) return e;
                  var n,
                    o,
                    s = r.call(e),
                    i = [];
                  try {
                    for (; (void 0 === t || t-- > 0) && !(n = s.next()).done; )
                      i.push(n.value);
                  } catch (e) {
                    o = { error: e };
                  } finally {
                    try {
                      n && !n.done && (r = s.return) && r.call(s);
                    } finally {
                      if (o) throw o.error;
                    }
                  }
                  return i;
                }),
                (g = function () {
                  for (var e = [], t = 0; t < arguments.length; t++)
                    e = e.concat(h(arguments[t]));
                  return e;
                }),
                (v = function () {
                  for (var e = 0, t = 0, r = arguments.length; t < r; t++)
                    e += arguments[t].length;
                  var n = Array(e),
                    o = 0;
                  for (t = 0; t < r; t++)
                    for (
                      var s = arguments[t], i = 0, a = s.length;
                      i < a;
                      i++, o++
                    )
                      n[o] = s[i];
                  return n;
                }),
                (m = function (e, t, r) {
                  if (r || 2 === arguments.length)
                    for (var n, o = 0, s = t.length; o < s; o++)
                      (!n && o in t) ||
                        (n || (n = Array.prototype.slice.call(t, 0, o)),
                        (n[o] = t[o]));
                  return e.concat(n || Array.prototype.slice.call(t));
                }),
                (R = function (e) {
                  return this instanceof R ? ((this.v = e), this) : new R(e);
                }),
                (A = function (e, t, r) {
                  if (!Symbol.asyncIterator)
                    throw new TypeError("Symbol.asyncIterator is not defined.");
                  var n,
                    o = r.apply(e, t || []),
                    s = [];
                  return (
                    (n = Object.create(
                      ("function" == typeof AsyncIterator
                        ? AsyncIterator
                        : Object
                      ).prototype,
                    )),
                    i("next"),
                    i("throw"),
                    i("return", function (e) {
                      return function (t) {
                        return Promise.resolve(t).then(e, c);
                      };
                    }),
                    (n[Symbol.asyncIterator] = function () {
                      return this;
                    }),
                    n
                  );
                  function i(e, t) {
                    o[e] &&
                      ((n[e] = function (t) {
                        return new Promise(function (r, n) {
                          s.push([e, t, r, n]) > 1 || a(e, t);
                        });
                      }),
                      t && (n[e] = t(n[e])));
                  }
                  function a(e, t) {
                    try {
                      (r = o[e](t)).value instanceof R
                        ? Promise.resolve(r.value.v).then(u, c)
                        : f(s[0][2], r);
                    } catch (e) {
                      f(s[0][3], e);
                    }
                    var r;
                  }
                  function u(e) {
                    a("next", e);
                  }
                  function c(e) {
                    a("throw", e);
                  }
                  function f(e, t) {
                    (e(t), s.shift(), s.length && a(s[0][0], s[0][1]));
                  }
                }),
                (T = function (e) {
                  var t, r;
                  return (
                    (t = {}),
                    n("next"),
                    n("throw", function (e) {
                      throw e;
                    }),
                    n("return"),
                    (t[Symbol.iterator] = function () {
                      return this;
                    }),
                    t
                  );
                  function n(n, o) {
                    t[n] = e[n]
                      ? function (t) {
                          return (r = !r)
                            ? { value: R(e[n](t)), done: !1 }
                            : o
                              ? o(t)
                              : t;
                        }
                      : o;
                  }
                }),
                (O = function (e) {
                  if (!Symbol.asyncIterator)
                    throw new TypeError("Symbol.asyncIterator is not defined.");
                  var t,
                    r = e[Symbol.asyncIterator];
                  return r
                    ? r.call(e)
                    : ((e =
                        "function" == typeof E ? E(e) : e[Symbol.iterator]()),
                      (t = {}),
                      n("next"),
                      n("throw"),
                      n("return"),
                      (t[Symbol.asyncIterator] = function () {
                        return this;
                      }),
                      t);
                  function n(r) {
                    t[r] =
                      e[r] &&
                      function (t) {
                        return new Promise(function (n, o) {
                          (function (e, t, r, n) {
                            Promise.resolve(n).then(function (t) {
                              e({ value: t, done: r });
                            }, t);
                          })(n, o, (t = e[r](t)).done, t.value);
                        });
                      };
                  }
                }),
                (M = function (e, t) {
                  return (
                    Object.defineProperty
                      ? Object.defineProperty(e, "raw", { value: t })
                      : (e.raw = t),
                    e
                  );
                }));
              var j = Object.create
                  ? function (e, t) {
                      Object.defineProperty(e, "default", {
                        enumerable: !0,
                        value: t,
                      });
                    }
                  : function (e, t) {
                      e.default = t;
                    },
                Y = function (e) {
                  return (Y =
                    Object.getOwnPropertyNames ||
                    function (e) {
                      var t = [];
                      for (var r in e)
                        Object.prototype.hasOwnProperty.call(e, r) &&
                          (t[t.length] = r);
                      return t;
                    })(e);
                };
              ((b = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                  for (var r = Y(e), n = 0; n < r.length; n++)
                    "default" !== r[n] && N(t, e, r[n]);
                return (j(t, e), t);
              }),
                (P = function (e) {
                  return e && e.__esModule ? e : { default: e };
                }),
                (S = function (e, t, r, n) {
                  if ("a" === r && !n)
                    throw new TypeError(
                      "Private accessor was defined without a getter",
                    );
                  if ("function" == typeof t ? e !== t || !n : !t.has(e))
                    throw new TypeError(
                      "Cannot read private member from an object whose class did not declare it",
                    );
                  return "m" === r
                    ? n
                    : "a" === r
                      ? n.call(e)
                      : n
                        ? n.value
                        : t.get(e);
                }),
                (w = function (e, t, r, n, o) {
                  if ("m" === n)
                    throw new TypeError("Private method is not writable");
                  if ("a" === n && !o)
                    throw new TypeError(
                      "Private accessor was defined without a setter",
                    );
                  if ("function" == typeof t ? e !== t || !o : !t.has(e))
                    throw new TypeError(
                      "Cannot write private member to an object whose class did not declare it",
                    );
                  return (
                    "a" === n ? o.call(e, r) : o ? (o.value = r) : t.set(e, r),
                    r
                  );
                }),
                (L = function (e, t) {
                  if (
                    null === t ||
                    ("object" !== r(t) && "function" != typeof t)
                  )
                    throw new TypeError(
                      "Cannot use 'in' operator on non-object",
                    );
                  return "function" == typeof e ? t === e : e.has(t);
                }),
                (C = function (e, t, n) {
                  if (null != t) {
                    if ("object" !== r(t) && "function" != typeof t)
                      throw new TypeError("Object expected.");
                    var o, s;
                    if (n) {
                      if (!Symbol.asyncDispose)
                        throw new TypeError(
                          "Symbol.asyncDispose is not defined.",
                        );
                      o = t[Symbol.asyncDispose];
                    }
                    if (void 0 === o) {
                      if (!Symbol.dispose)
                        throw new TypeError("Symbol.dispose is not defined.");
                      ((o = t[Symbol.dispose]), n && (s = o));
                    }
                    if ("function" != typeof o)
                      throw new TypeError("Object not disposable.");
                    (s &&
                      (o = function () {
                        try {
                          s.call(this);
                        } catch (e) {
                          return Promise.reject(e);
                        }
                      }),
                      e.stack.push({ value: t, dispose: o, async: n }));
                  } else n && e.stack.push({ async: !0 });
                  return t;
                }));
              var V =
                "function" == typeof SuppressedError
                  ? SuppressedError
                  : function (e, t, r) {
                      var n = new Error(r);
                      return (
                        (n.name = "SuppressedError"),
                        (n.error = e),
                        (n.suppressed = t),
                        n
                      );
                    };
              ((I = function (e) {
                function t(t) {
                  ((e.error = e.hasError
                    ? new V(
                        t,
                        e.error,
                        "An error was suppressed during disposal.",
                      )
                    : t),
                    (e.hasError = !0));
                }
                var r,
                  n = 0;
                return (function o() {
                  for (; (r = e.stack.pop()); )
                    try {
                      if (!r.async && 1 === n)
                        return (
                          (n = 0),
                          e.stack.push(r),
                          Promise.resolve().then(o)
                        );
                      if (r.dispose) {
                        var s = r.dispose.call(r.value);
                        if (r.async)
                          return (
                            (n |= 2),
                            Promise.resolve(s).then(o, function (e) {
                              return (t(e), o());
                            })
                          );
                      } else n |= 1;
                    } catch (e) {
                      t(e);
                    }
                  if (1 === n)
                    return e.hasError
                      ? Promise.reject(e.error)
                      : Promise.resolve();
                  if (e.hasError) throw e.error;
                })();
              }),
                (D = function (e, t) {
                  return "string" == typeof e && /^\.\.?\//.test(e)
                    ? e.replace(
                        /\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,
                        function (e, r, n, o, s) {
                          return r
                            ? t
                              ? ".jsx"
                              : ".js"
                            : !n || (o && s)
                              ? n + o + "." + s.toLowerCase() + "js"
                              : e;
                        },
                      )
                    : e;
                }),
                e("__extends", n),
                e("__assign", o),
                e("__rest", s),
                e("__decorate", i),
                e("__param", a),
                e("__esDecorate", u),
                e("__runInitializers", c),
                e("__propKey", f),
                e("__setFunctionName", l),
                e("__metadata", p),
                e("__awaiter", _),
                e("__generator", d),
                e("__exportStar", y),
                e("__createBinding", N),
                e("__values", E),
                e("__read", h),
                e("__spread", g),
                e("__spreadArrays", v),
                e("__spreadArray", m),
                e("__await", R),
                e("__asyncGenerator", A),
                e("__asyncDelegator", T),
                e("__asyncValues", O),
                e("__makeTemplateObject", M),
                e("__importStar", b),
                e("__importDefault", P),
                e("__classPrivateFieldGet", S),
                e("__classPrivateFieldSet", w),
                e("__classPrivateFieldIn", L),
                e("__addDisposableResource", C),
                e("__disposeResources", I),
                e("__rewriteRelativeImportExtension", D));
            });
          }).call(this);
        }).call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
                ? window
                : {},
        );
      },
      {},
    ],
    3: [
      function (e, t, r) {
        "use strict";
        var n;
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.Errors = void 0),
          (function (e) {
            ((e.INVALID_LISTENER = "INVALID_LISTENER"),
              (e.INVALID_WEBPLAYBACK = "INVALID_WEBPLAYBACK"),
              (e.NO_BODY = "NO_BODY"),
              (e.NO_EVENT = "NO_EVENT"),
              (e.INVALID_OAUTH = "INVALID_OAUTH"),
              (e.MISSING_IFRAME = "MISSING_IFRAME"),
              (e.AUTOPLAY_FAILED = "AUTOPLAY_FAILED"));
          })(n || (r.Errors = n = {})));
      },
      {},
    ],
    4: [
      function (e, t, r) {
        "use strict";
        var n;
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.AnthemEvents = void 0),
          (function (e) {
            ((e.ACCOUNT_ERROR = "account_error"),
              (e.AUTH_ERROR = "authentication_error"),
              (e.AUTOPLAY_FAILED = "autoplay_failed"),
              (e.PROGRESS = "progress"),
              (e.PLAYBACK_ERROR = "playback_error"),
              (e.PLAYER_INIT_ERROR = "initialization_error"),
              (e.PLAYER_READY = "ready"),
              (e.PLAYER_NOT_READY = "not_ready"),
              (e.PLAYER_STATE_CHANGED = "player_state_changed"));
          })(n || (r.AnthemEvents = n = {})));
      },
      {},
    ],
    5: [
      function (e, t, r) {
        "use strict";
        var n;
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.Messages = void 0),
          (function (e) {
            ((e.SPOTIFY_MESSAGE = "SP_MESSAGE"),
              (e.ACCOUNT_ERROR = "ACCOUNT_ERROR"),
              (e.AUTH_ERROR = "AUTH_ERROR"),
              (e.CONNECT = "CONNECT"),
              (e.CONNECTED = "CONNECTED"),
              (e.CURRENT_STATE = "CURRENT_STATE"),
              (e.DISCONNECT = "DISCONNECT"),
              (e.EVENT = "EVENT"),
              (e.GET_CURRENT_STATE = "GET_CURRENT_STATE"),
              (e.GET_TOKEN = "GET_TOKEN"),
              (e.GET_VOLUME = "GET_VOLUME"),
              (e.INIT = "INIT"),
              (e.LOADED = "LOADED"),
              (e.NEXT_TRACK = "NEXT_TRACK"),
              (e.PAUSE = "PAUSE"),
              (e.PLAYBACK_ERROR = "PLAYBACK_ERROR"),
              (e.ACTIVATE_ELEMENT = "ACTIVATE_ELEMENT"),
              (e.ACTIVATE_ELEMENT_ERROR = "ACTIVATE_ELEMENT_ERROR"),
              (e.PLAYER_INIT_ERROR = "PLAYER_INIT_ERROR"),
              (e.PLAYER_READY = "PLAYER_READY"),
              (e.PLAYER_NOT_READY = "PLAYER_NOT_READY"),
              (e.PLAYER_STATE_CHANGED = "PLAYER_STATE_CHANGED"),
              (e.PREV_TRACK = "PREV_TRACK"),
              (e.PROGRESS = "PROGRESS"),
              (e.RESUME = "RESUME"),
              (e.SEEK = "SEEK"),
              (e.SET_NAME = "SET_NAME"),
              (e.SET_VOLUME = "SET_VOLUME"),
              (e.TOGGLE_PLAY = "TOGGLE_PLAY"),
              (e.TOKEN = "TOKEN"),
              (e.VOLUME = "VOLUME"),
              (e.AUTOPLAY_FAILED = "AUTOPLAY_FAILED"));
          })(n || (r.Messages = n = {})));
      },
      {},
    ],
    6: [
      function (e, t, r) {
        "use strict";
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.PlayerError = void 0));
        var n = e("tslib"),
          o = (function (e) {
            function t(t, r) {
              var n = e.call(this, r) || this;
              return (
                (n.code = t),
                (n.message = r),
                (n.name = "AnthemError"),
                n
              );
            }
            return (n.__extends(t, e), t);
          })(Error);
        r.PlayerError = o;
      },
      { tslib: 2 },
    ],
    7: [
      function (e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", { value: !0 });
        var n = e("../enums/errors"),
          o = e("../error/player_error"),
          s = e("./player_api");
        function i() {
          if (!document.body)
            throw new o.PlayerError(
              n.Errors.NO_BODY,
              "Document doesn't have a body",
            );
          if (
            ((window.Spotify = { Player: (0, s.setupPlayerEnv)(window) }),
            window.onSpotifyWebPlaybackSDKReady)
          )
            return window.onSpotifyWebPlaybackSDKReady();
          if (window.onSpotifyPlayerAPIReady)
            return window.onSpotifyPlayerAPIReady();
          throw new o.PlayerError(
            n.Errors.INVALID_WEBPLAYBACK,
            "onSpotifyWebPlaybackSDKReady is not defined",
          );
        }
        "complete" === document.readyState
          ? i()
          : window.addEventListener("load", i);
      },
      { "../enums/errors": 3, "../error/player_error": 6, "./player_api": 8 },
    ],
    8: [
      function (e, t, r) {
        "use strict";
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.setupPlayerEnv = void 0));
        var n = e("tslib"),
          o = e("@js-sdk/common/lib/promise_resolver"),
          s = e("../enums/messages"),
          i = e("../enums/events"),
          a = e("../enums/errors"),
          u = e("../error/player_error"),
          c = e("../shared/message_dispatcher"),
          f = e("../shared/messages_factory");
        r.setupPlayerEnv = function (e, t) {
          var r = "https://sdk.scdn.co/embedded/index.html",
            l = (0, o.createPromiseResolver)(),
            p = c.MessageDispatcher.create(),
            _ =
              t ||
              function (t) {
                var r = e.document.createElement("iframe");
                return (
                  (r.src = t),
                  r.setAttribute("alt", "Audio Playback Container"),
                  r.setAttribute("tabIndex", "-1"),
                  r.style.setProperty("position", "absolute", "important"),
                  r.style.setProperty("left", "-1px", "important"),
                  r.style.setProperty("width", "0", "important"),
                  r.style.setProperty("height", "0", "important"),
                  r.style.setProperty("border", "none", "important"),
                  r.style.setProperty("outline", "none", "important"),
                  (r.allow = "encrypted-media; autoplay"),
                  e.document.body.appendChild(r),
                  r.contentWindow
                );
              };
          p.listen(e, function (t) {
            t === s.Messages.LOADED && (p.stopListening(e), l.resolve());
          });
          var d = _(r);
          return (function () {
            function t(t) {
              var r,
                n,
                o,
                a,
                u = this;
              ((this._options = {
                name:
                  t.name ||
                  (null === (o = null == e ? void 0 : e.location) ||
                  void 0 === o
                    ? void 0
                    : o.hostname) ||
                  "",
                getOAuthToken: t.getOAuthToken || t.getOauthToken,
                volume: null !== (a = t.volume) && void 0 !== a ? a : 1,
                enableMediaSession: t.enableMediaSession,
              }),
                (this._handleMessages = this._handleMessages.bind(this)),
                (this._eventListeners =
                  (((r = {})[i.AnthemEvents.ACCOUNT_ERROR] = []),
                  (r[i.AnthemEvents.AUTH_ERROR] = []),
                  (r[i.AnthemEvents.AUTOPLAY_FAILED] = []),
                  (r[i.AnthemEvents.PLAYBACK_ERROR] = []),
                  (r[i.AnthemEvents.PLAYER_INIT_ERROR] = []),
                  (r[i.AnthemEvents.PLAYER_READY] = []),
                  (r[i.AnthemEvents.PLAYER_NOT_READY] = []),
                  (r[i.AnthemEvents.PLAYER_STATE_CHANGED] = []),
                  (r[i.AnthemEvents.PROGRESS] = []),
                  r)),
                (this._connectionRequests = {}),
                (this._getCurrentStateRequests = {}),
                (this._getVolumeRequests = {}),
                (this._messageHandlers =
                  (((n = {})[s.Messages.GET_TOKEN] =
                    this._onGetToken.bind(this)),
                  (n[s.Messages.EVENT] = this._onEvent.bind(this)),
                  (n[s.Messages.CONNECTED] = this._onConnected.bind(this)),
                  (n[s.Messages.CURRENT_STATE] =
                    this._onCurrentState.bind(this)),
                  (n[s.Messages.VOLUME] = this._onVolume.bind(this)),
                  n)),
                (this.isLoaded = l.promise.then(function () {
                  (p.listen(e, u._handleMessages),
                    u._sendMessage(f.messages.init(u._options)));
                })));
            }
            return (
              (t.prototype._getListeners = function (e) {
                return n.__spreadArray([], this._eventListeners[e], !0);
              }),
              (t.prototype._onEvent = function (e) {
                var t = e.name;
                this._getListeners(i.AnthemEvents[t]).forEach(function (t) {
                  t(e.eventData);
                });
              }),
              (t.prototype._onGetToken = function (e, t) {
                var r = this,
                  n = this._options.getOAuthToken;
                if ("function" == typeof n)
                  new Promise(n).then(function (e) {
                    r._sendMessage(f.messages.token(e, t));
                  });
                else {
                  if (
                    !this._getListeners(i.AnthemEvents.PLAYER_INIT_ERROR).length
                  )
                    throw new u.PlayerError(
                      a.Errors.INVALID_OAUTH,
                      "getOAuthToken is not a function",
                    );
                  this._onEvent({
                    name: s.Messages.PLAYER_INIT_ERROR,
                    eventData: { message: a.Errors.INVALID_OAUTH },
                  });
                }
              }),
              (t.prototype._onConnected = function (e) {
                var t;
                e.ref in this._connectionRequests &&
                  (null === (t = this._connectionRequests[e.ref]) ||
                    void 0 === t ||
                    t.resolve(e.connected),
                  delete this._connectionRequests[e.ref]);
              }),
              (t.prototype._onCurrentState = function (e) {
                var t;
                e.ref in this._getCurrentStateRequests &&
                  (null === (t = this._getCurrentStateRequests[e.ref]) ||
                    void 0 === t ||
                    t.resolve(e.state),
                  delete this._getCurrentStateRequests[e.ref]);
              }),
              (t.prototype._onVolume = function (e) {
                var t;
                e.ref in this._getVolumeRequests &&
                  (null === (t = this._getVolumeRequests[e.ref]) ||
                    void 0 === t ||
                    t.resolve(e.volume),
                  delete this._getVolumeRequests[e.ref]);
              }),
              (t.prototype._handleMessages = function (e, t, r) {
                var n, o;
                null === (o = (n = this._messageHandlers)[e]) ||
                  void 0 === o ||
                  o.call(n, t, r);
              }),
              (t.prototype._sendMessage = function (e) {
                return p.send(d, e, r);
              }),
              (t.prototype._sendMessageWhenLoaded = function (e) {
                var t = this;
                return this.isLoaded.then(function () {
                  return t._sendMessage(e);
                });
              }),
              (t.prototype.connect = function () {
                var e = this;
                return this.isLoaded.then(function () {
                  var t,
                    r = e._sendMessage(f.messages.connect());
                  return (
                    (e._connectionRequests[r] = (0, o.createPromiseResolver)()),
                    null === (t = e._connectionRequests[r]) || void 0 === t
                      ? void 0
                      : t.promise
                  );
                });
              }),
              (t.prototype.on = function (e, t) {
                return (
                  -1 === this._eventListeners[e].indexOf(t) &&
                  (this._eventListeners[e].push(t), !0)
                );
              }),
              (t.prototype.addListener = function (e, t) {
                return this.on(e, t);
              }),
              (t.prototype.removeListener = function (e, t) {
                var r = this._eventListeners[e];
                return 1 === arguments.length
                  ? ((this._eventListeners[e] = []), !0)
                  : !(!r || !r.length) &&
                      ((this._eventListeners[e] = r.filter(function (e) {
                        return e !== t;
                      })),
                      !0);
              }),
              (t.prototype.getCurrentState = function () {
                var e = this;
                return this.isLoaded.then(function () {
                  var t,
                    r = e._sendMessage(f.messages.getCurrentState());
                  return (
                    (e._getCurrentStateRequests[r] = (0,
                    o.createPromiseResolver)()),
                    null === (t = e._getCurrentStateRequests[r]) || void 0 === t
                      ? void 0
                      : t.promise
                  );
                });
              }),
              (t.prototype.getVolume = function () {
                var e = this;
                return this.isLoaded.then(function () {
                  var t,
                    r = e._sendMessage(f.messages.getVolume());
                  return (
                    (e._getVolumeRequests[r] = (0, o.createPromiseResolver)()),
                    null === (t = e._getVolumeRequests[r]) || void 0 === t
                      ? void 0
                      : t.promise
                  );
                });
              }),
              (t.prototype.setName = function (e) {
                return this._sendMessageWhenLoaded(f.messages.setName(e));
              }),
              (t.prototype.setVolume = function (e) {
                return this._sendMessageWhenLoaded(f.messages.setVolume(e));
              }),
              (t.prototype.activateElement = function () {
                return this._sendMessageWhenLoaded(
                  f.messages.activateElement(),
                );
              }),
              (t.prototype.pause = function () {
                return this._sendMessageWhenLoaded(f.messages.pause());
              }),
              (t.prototype.resume = function () {
                return this._sendMessageWhenLoaded(f.messages.resume());
              }),
              (t.prototype.togglePlay = function () {
                return this._sendMessageWhenLoaded(f.messages.togglePlay());
              }),
              (t.prototype.seek = function (e) {
                return this._sendMessageWhenLoaded(f.messages.seek(e));
              }),
              (t.prototype.previousTrack = function (e) {
                return this._sendMessageWhenLoaded(f.messages.previousTrack(e));
              }),
              (t.prototype.nextTrack = function (e) {
                return this._sendMessageWhenLoaded(f.messages.nextTrack(e));
              }),
              (t.prototype.disconnect = function () {
                return this._sendMessageWhenLoaded(f.messages.disconnect());
              }),
              t
            );
          })();
        };
      },
      {
        "../enums/errors": 3,
        "../enums/events": 4,
        "../enums/messages": 5,
        "../error/player_error": 6,
        "../shared/message_dispatcher": 9,
        "../shared/messages_factory": 10,
        "@js-sdk/common/lib/promise_resolver": 1,
        tslib: 2,
      },
    ],
    9: [
      function (e, t, r) {
        "use strict";
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.MessageDispatcher = void 0));
        var n = e("../enums/messages"),
          o = (function () {
            function e() {
              ((this._seq = 0),
                (this._onMessageCallback = function () {}),
                (this._receiveMessage = this._receiveMessage.bind(this)));
            }
            return (
              (e.create = function () {
                return new e();
              }),
              (e.prototype._addMessageId = function (e) {
                return ((e.seq = this._seq++), e);
              }),
              (e.prototype._receiveMessage = function (e) {
                if (e.data) {
                  var t = e.data,
                    r = t.type,
                    o = t.body,
                    s = t.seq;
                  r === n.Messages.SPOTIFY_MESSAGE &&
                    (null == o ? void 0 : o.topic) &&
                    this._onMessageCallback(o.topic, o.data, s);
                }
              }),
              (e.prototype.listen = function (e, t) {
                ((this._onMessageCallback = t),
                  e.addEventListener("message", this._receiveMessage));
              }),
              (e.prototype.stopListening = function (e) {
                e.removeEventListener("message", this._receiveMessage);
              }),
              (e.prototype.send = function (e, t, r) {
                void 0 === r && (r = "*");
                var n = this._addMessageId(t);
                return (e.postMessage(n, r), n.seq);
              }),
              e
            );
          })();
        r.MessageDispatcher = o;
      },
      { "../enums/messages": 5 },
    ],
    10: [
      function (e, t, r) {
        "use strict";
        (Object.defineProperty(r, "__esModule", { value: !0 }),
          (r.messages = void 0));
        var n = e("../enums/messages"),
          o = (function () {
            function e() {}
            return (
              (e.create = function () {
                return new e();
              }),
              (e.prototype._createEventMessage = function (e, t) {
                return this._createMessage(n.Messages.EVENT, {
                  name: e,
                  eventData: t,
                });
              }),
              (e.prototype._createMessage = function (e, t) {
                return {
                  type: n.Messages.SPOTIFY_MESSAGE,
                  body: {
                    topic: e,
                    data: void 0 !== t ? JSON.parse(JSON.stringify(t)) : void 0,
                  },
                };
              }),
              (e.prototype.accountError = function (e) {
                return this._createEventMessage(n.Messages.ACCOUNT_ERROR, {
                  message: e,
                });
              }),
              (e.prototype.authError = function (e) {
                return this._createEventMessage(n.Messages.AUTH_ERROR, e);
              }),
              (e.prototype.autoplayFailed = function (e) {
                return this._createEventMessage(n.Messages.AUTOPLAY_FAILED, e);
              }),
              (e.prototype.playbackError = function (e) {
                return this._createEventMessage(n.Messages.PLAYBACK_ERROR, e);
              }),
              (e.prototype.playerReady = function (e) {
                return this._createEventMessage(n.Messages.PLAYER_READY, e);
              }),
              (e.prototype.playerNotReady = function (e) {
                return this._createEventMessage(n.Messages.PLAYER_NOT_READY, e);
              }),
              (e.prototype.connect = function () {
                return this._createMessage(n.Messages.CONNECT);
              }),
              (e.prototype.connected = function (e, t) {
                return this._createMessage(n.Messages.CONNECTED, {
                  connected: e,
                  ref: t,
                });
              }),
              (e.prototype.disconnect = function () {
                return this._createMessage(n.Messages.DISCONNECT);
              }),
              (e.prototype.init = function (e) {
                return this._createMessage(n.Messages.INIT, e);
              }),
              (e.prototype.playerInitError = function (e) {
                return this._createEventMessage(
                  n.Messages.PLAYER_INIT_ERROR,
                  e,
                );
              }),
              (e.prototype.getToken = function () {
                return this._createMessage(n.Messages.GET_TOKEN);
              }),
              (e.prototype.token = function (e, t) {
                return this._createMessage(n.Messages.TOKEN, {
                  token: e,
                  ref: t,
                });
              }),
              (e.prototype.activateElement = function () {
                return this._createMessage(n.Messages.ACTIVATE_ELEMENT);
              }),
              (e.prototype.activateElementError = function (e) {
                return this._createEventMessage(
                  n.Messages.ACTIVATE_ELEMENT_ERROR,
                  e,
                );
              }),
              (e.prototype.pause = function () {
                return this._createMessage(n.Messages.PAUSE);
              }),
              (e.prototype.resume = function () {
                return this._createMessage(n.Messages.RESUME);
              }),
              (e.prototype.togglePlay = function () {
                return this._createMessage(n.Messages.TOGGLE_PLAY);
              }),
              (e.prototype.seek = function (e) {
                return this._createMessage(n.Messages.SEEK, e);
              }),
              (e.prototype.nextTrack = function (e) {
                return this._createMessage(n.Messages.NEXT_TRACK, e);
              }),
              (e.prototype.previousTrack = function (e) {
                return this._createMessage(n.Messages.PREV_TRACK, e);
              }),
              (e.prototype.getCurrentState = function () {
                return this._createMessage(n.Messages.GET_CURRENT_STATE);
              }),
              (e.prototype.currentState = function (e, t) {
                return this._createMessage(n.Messages.CURRENT_STATE, {
                  state: e,
                  ref: t,
                });
              }),
              (e.prototype.playerStateChanged = function (e) {
                return this._createEventMessage(
                  n.Messages.PLAYER_STATE_CHANGED,
                  e,
                );
              }),
              (e.prototype.progress = function (e) {
                return this._createEventMessage(n.Messages.PROGRESS, e);
              }),
              (e.prototype.getVolume = function () {
                return this._createMessage(n.Messages.GET_VOLUME);
              }),
              (e.prototype.volume = function (e, t) {
                return this._createMessage(n.Messages.VOLUME, {
                  volume: e,
                  ref: t,
                });
              }),
              (e.prototype.setVolume = function (e) {
                return this._createMessage(n.Messages.SET_VOLUME, e);
              }),
              (e.prototype.setName = function (e) {
                return this._createMessage(n.Messages.SET_NAME, e);
              }),
              (e.prototype.embeddedLoaded = function () {
                return this._createMessage(n.Messages.LOADED);
              }),
              e
            );
          })();
        r.messages = o.create();
      },
      { "../enums/messages": 5 },
    ],
  },
  {},
  [7],
);
