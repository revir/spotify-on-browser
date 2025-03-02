// https://sdk.scdn.co/spotify-player.js
/* Spotify JS-SDK - v1.10.0-a391294 */

!(function e(t, n, r) {
  function s(a, i) {
    if (!n[a]) {
      if (!t[a]) {
        var u = "function" == typeof require && require;
        if (!i && u) return u(a, !0);
        if (o) return o(a, !0);
        var c = new Error("Cannot find module '" + a + "'");
        throw ((c.code = "MODULE_NOT_FOUND"), c);
      }
      var f = (n[a] = { exports: {} });
      t[a][0].call(
        f.exports,
        function (e) {
          return s(t[a][1][e] || e);
        },
        f,
        f.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[a].exports;
  }
  for (
    var o = "function" == typeof require && require, a = 0;
    a < r.length;
    a++
  )
    s(r[a]);
  return s;
})(
  {
    1: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.createPromiseResolver = function () {
            var e, t;
            return {
              promise: new Promise(function (n, r) {
                (e = n), (t = r);
              }),
              resolve: e,
              reject: t,
            };
          });
      },
      {},
    ],
    2: [
      function (e, t, n) {
        (function (e) {
          (function () {
            /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
            var n,
              r,
              s,
              o,
              a,
              i,
              u,
              c,
              f,
              l,
              _,
              p,
              E,
              d,
              y,
              h,
              g,
              v,
              R,
              m,
              A,
              T,
              M,
              O;
            !(function (n) {
              var r =
                "object" == typeof e
                  ? e
                  : "object" == typeof self
                  ? self
                  : "object" == typeof this
                  ? this
                  : {};
              function s(e, t) {
                return (
                  e !== r &&
                    ("function" == typeof Object.create
                      ? Object.defineProperty(e, "__esModule", { value: !0 })
                      : (e.__esModule = !0)),
                  function (n, r) {
                    return (e[n] = t ? t(n, r) : r);
                  }
                );
              }
              "function" == typeof define && define.amd
                ? define("tslib", ["exports"], function (e) {
                    n(s(r, s(e)));
                  })
                : "object" == typeof t && "object" == typeof t.exports
                ? n(s(r, s(t.exports)))
                : n(s(r));
            })(function (e) {
              var t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (e, t) {
                    e.__proto__ = t;
                  }) ||
                function (e, t) {
                  for (var n in t)
                    Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                };
              (n = function (e, n) {
                if ("function" != typeof n && null !== n)
                  throw new TypeError(
                    "Class extends value " +
                      String(n) +
                      " is not a constructor or null"
                  );
                function r() {
                  this.constructor = e;
                }
                t(e, n),
                  (e.prototype =
                    null === n
                      ? Object.create(n)
                      : ((r.prototype = n.prototype), new r()));
              }),
                (r =
                  Object.assign ||
                  function (e) {
                    for (var t, n = 1, r = arguments.length; n < r; n++)
                      for (var s in (t = arguments[n]))
                        Object.prototype.hasOwnProperty.call(t, s) &&
                          (e[s] = t[s]);
                    return e;
                  }),
                (s = function (e, t) {
                  var n = {};
                  for (var r in e)
                    Object.prototype.hasOwnProperty.call(e, r) &&
                      t.indexOf(r) < 0 &&
                      (n[r] = e[r]);
                  if (
                    null != e &&
                    "function" == typeof Object.getOwnPropertySymbols
                  ) {
                    var s = 0;
                    for (r = Object.getOwnPropertySymbols(e); s < r.length; s++)
                      t.indexOf(r[s]) < 0 &&
                        Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
                        (n[r[s]] = e[r[s]]);
                  }
                  return n;
                }),
                (o = function (e, t, n, r) {
                  var s,
                    o = arguments.length,
                    a =
                      o < 3
                        ? t
                        : null === r
                        ? (r = Object.getOwnPropertyDescriptor(t, n))
                        : r;
                  if (
                    "object" == typeof Reflect &&
                    "function" == typeof Reflect.decorate
                  )
                    a = Reflect.decorate(e, t, n, r);
                  else
                    for (var i = e.length - 1; i >= 0; i--)
                      (s = e[i]) &&
                        (a =
                          (o < 3 ? s(a) : o > 3 ? s(t, n, a) : s(t, n)) || a);
                  return o > 3 && a && Object.defineProperty(t, n, a), a;
                }),
                (a = function (e, t) {
                  return function (n, r) {
                    t(n, r, e);
                  };
                }),
                (i = function (e, t) {
                  if (
                    "object" == typeof Reflect &&
                    "function" == typeof Reflect.metadata
                  )
                    return Reflect.metadata(e, t);
                }),
                (u = function (e, t, n, r) {
                  return new (n || (n = Promise))(function (s, o) {
                    function a(e) {
                      try {
                        u(r.next(e));
                      } catch (e) {
                        o(e);
                      }
                    }
                    function i(e) {
                      try {
                        u(r.throw(e));
                      } catch (e) {
                        o(e);
                      }
                    }
                    function u(e) {
                      var t;
                      e.done
                        ? s(e.value)
                        : ((t = e.value),
                          t instanceof n
                            ? t
                            : new n(function (e) {
                                e(t);
                              })).then(a, i);
                    }
                    u((r = r.apply(e, t || [])).next());
                  });
                }),
                (c = function (e, t) {
                  var n,
                    r,
                    s,
                    o,
                    a = {
                      label: 0,
                      sent: function () {
                        if (1 & s[0]) throw s[1];
                        return s[1];
                      },
                      trys: [],
                      ops: [],
                    };
                  return (
                    (o = { next: i(0), throw: i(1), return: i(2) }),
                    "function" == typeof Symbol &&
                      (o[Symbol.iterator] = function () {
                        return this;
                      }),
                    o
                  );
                  function i(o) {
                    return function (i) {
                      return (function (o) {
                        if (n)
                          throw new TypeError(
                            "Generator is already executing."
                          );
                        for (; a; )
                          try {
                            if (
                              ((n = 1),
                              r &&
                                (s =
                                  2 & o[0]
                                    ? r.return
                                    : o[0]
                                    ? r.throw ||
                                      ((s = r.return) && s.call(r), 0)
                                    : r.next) &&
                                !(s = s.call(r, o[1])).done)
                            )
                              return s;
                            switch (
                              ((r = 0), s && (o = [2 & o[0], s.value]), o[0])
                            ) {
                              case 0:
                              case 1:
                                s = o;
                                break;
                              case 4:
                                return a.label++, { value: o[1], done: !1 };
                              case 5:
                                a.label++, (r = o[1]), (o = [0]);
                                continue;
                              case 7:
                                (o = a.ops.pop()), a.trys.pop();
                                continue;
                              default:
                                if (
                                  !((s = a.trys),
                                  (s = s.length > 0 && s[s.length - 1]) ||
                                    (6 !== o[0] && 2 !== o[0]))
                                ) {
                                  a = 0;
                                  continue;
                                }
                                if (
                                  3 === o[0] &&
                                  (!s || (o[1] > s[0] && o[1] < s[3]))
                                ) {
                                  a.label = o[1];
                                  break;
                                }
                                if (6 === o[0] && a.label < s[1]) {
                                  (a.label = s[1]), (s = o);
                                  break;
                                }
                                if (s && a.label < s[2]) {
                                  (a.label = s[2]), a.ops.push(o);
                                  break;
                                }
                                s[2] && a.ops.pop(), a.trys.pop();
                                continue;
                            }
                            o = t.call(e, a);
                          } catch (e) {
                            (o = [6, e]), (r = 0);
                          } finally {
                            n = s = 0;
                          }
                        if (5 & o[0]) throw o[1];
                        return { value: o[0] ? o[1] : void 0, done: !0 };
                      })([o, i]);
                    };
                  }
                }),
                (f = function (e, t) {
                  for (var n in e)
                    "default" === n ||
                      Object.prototype.hasOwnProperty.call(t, n) ||
                      O(t, e, n);
                }),
                (O = Object.create
                  ? function (e, t, n, r) {
                      void 0 === r && (r = n),
                        Object.defineProperty(e, r, {
                          enumerable: !0,
                          get: function () {
                            return t[n];
                          },
                        });
                    }
                  : function (e, t, n, r) {
                      void 0 === r && (r = n), (e[r] = t[n]);
                    }),
                (l = function (e) {
                  var t = "function" == typeof Symbol && Symbol.iterator,
                    n = t && e[t],
                    r = 0;
                  if (n) return n.call(e);
                  if (e && "number" == typeof e.length)
                    return {
                      next: function () {
                        return (
                          e && r >= e.length && (e = void 0),
                          { value: e && e[r++], done: !e }
                        );
                      },
                    };
                  throw new TypeError(
                    t
                      ? "Object is not iterable."
                      : "Symbol.iterator is not defined."
                  );
                }),
                (_ = function (e, t) {
                  var n = "function" == typeof Symbol && e[Symbol.iterator];
                  if (!n) return e;
                  var r,
                    s,
                    o = n.call(e),
                    a = [];
                  try {
                    for (; (void 0 === t || t-- > 0) && !(r = o.next()).done; )
                      a.push(r.value);
                  } catch (e) {
                    s = { error: e };
                  } finally {
                    try {
                      r && !r.done && (n = o.return) && n.call(o);
                    } finally {
                      if (s) throw s.error;
                    }
                  }
                  return a;
                }),
                (p = function () {
                  for (var e = [], t = 0; t < arguments.length; t++)
                    e = e.concat(_(arguments[t]));
                  return e;
                }),
                (E = function () {
                  for (var e = 0, t = 0, n = arguments.length; t < n; t++)
                    e += arguments[t].length;
                  var r = Array(e),
                    s = 0;
                  for (t = 0; t < n; t++)
                    for (
                      var o = arguments[t], a = 0, i = o.length;
                      a < i;
                      a++, s++
                    )
                      r[s] = o[a];
                  return r;
                }),
                (d = function (e, t, n) {
                  if (n || 2 === arguments.length)
                    for (var r, s = 0, o = t.length; s < o; s++)
                      (!r && s in t) ||
                        (r || (r = Array.prototype.slice.call(t, 0, s)),
                        (r[s] = t[s]));
                  return e.concat(r || t);
                }),
                (y = function (e) {
                  return this instanceof y ? ((this.v = e), this) : new y(e);
                }),
                (h = function (e, t, n) {
                  if (!Symbol.asyncIterator)
                    throw new TypeError("Symbol.asyncIterator is not defined.");
                  var r,
                    s = n.apply(e, t || []),
                    o = [];
                  return (
                    (r = {}),
                    a("next"),
                    a("throw"),
                    a("return"),
                    (r[Symbol.asyncIterator] = function () {
                      return this;
                    }),
                    r
                  );
                  function a(e) {
                    s[e] &&
                      (r[e] = function (t) {
                        return new Promise(function (n, r) {
                          o.push([e, t, n, r]) > 1 || i(e, t);
                        });
                      });
                  }
                  function i(e, t) {
                    try {
                      (n = s[e](t)).value instanceof y
                        ? Promise.resolve(n.value.v).then(u, c)
                        : f(o[0][2], n);
                    } catch (e) {
                      f(o[0][3], e);
                    }
                    var n;
                  }
                  function u(e) {
                    i("next", e);
                  }
                  function c(e) {
                    i("throw", e);
                  }
                  function f(e, t) {
                    e(t), o.shift(), o.length && i(o[0][0], o[0][1]);
                  }
                }),
                (g = function (e) {
                  var t, n;
                  return (
                    (t = {}),
                    r("next"),
                    r("throw", function (e) {
                      throw e;
                    }),
                    r("return"),
                    (t[Symbol.iterator] = function () {
                      return this;
                    }),
                    t
                  );
                  function r(r, s) {
                    t[r] = e[r]
                      ? function (t) {
                          return (n = !n)
                            ? { value: y(e[r](t)), done: "return" === r }
                            : s
                            ? s(t)
                            : t;
                        }
                      : s;
                  }
                }),
                (v = function (e) {
                  if (!Symbol.asyncIterator)
                    throw new TypeError("Symbol.asyncIterator is not defined.");
                  var t,
                    n = e[Symbol.asyncIterator];
                  return n
                    ? n.call(e)
                    : ((e = l(e)),
                      (t = {}),
                      r("next"),
                      r("throw"),
                      r("return"),
                      (t[Symbol.asyncIterator] = function () {
                        return this;
                      }),
                      t);
                  function r(n) {
                    t[n] =
                      e[n] &&
                      function (t) {
                        return new Promise(function (r, s) {
                          (function (e, t, n, r) {
                            Promise.resolve(r).then(function (t) {
                              e({ value: t, done: n });
                            }, t);
                          })(r, s, (t = e[n](t)).done, t.value);
                        });
                      };
                  }
                }),
                (R = function (e, t) {
                  return (
                    Object.defineProperty
                      ? Object.defineProperty(e, "raw", { value: t })
                      : (e.raw = t),
                    e
                  );
                });
              var P = Object.create
                ? function (e, t) {
                    Object.defineProperty(e, "default", {
                      enumerable: !0,
                      value: t,
                    });
                  }
                : function (e, t) {
                    e.default = t;
                  };
              (m = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                  for (var n in e)
                    "default" !== n &&
                      Object.prototype.hasOwnProperty.call(e, n) &&
                      O(t, e, n);
                return P(t, e), t;
              }),
                (A = function (e) {
                  return e && e.__esModule ? e : { default: e };
                }),
                (T = function (e, t, n, r) {
                  if ("a" === n && !r)
                    throw new TypeError(
                      "Private accessor was defined without a getter"
                    );
                  if ("function" == typeof t ? e !== t || !r : !t.has(e))
                    throw new TypeError(
                      "Cannot read private member from an object whose class did not declare it"
                    );
                  return "m" === n
                    ? r
                    : "a" === n
                    ? r.call(e)
                    : r
                    ? r.value
                    : t.get(e);
                }),
                (M = function (e, t, n, r, s) {
                  if ("m" === r)
                    throw new TypeError("Private method is not writable");
                  if ("a" === r && !s)
                    throw new TypeError(
                      "Private accessor was defined without a setter"
                    );
                  if ("function" == typeof t ? e !== t || !s : !t.has(e))
                    throw new TypeError(
                      "Cannot write private member to an object whose class did not declare it"
                    );
                  return (
                    "a" === r ? s.call(e, n) : s ? (s.value = n) : t.set(e, n),
                    n
                  );
                }),
                e("__extends", n),
                e("__assign", r),
                e("__rest", s),
                e("__decorate", o),
                e("__param", a),
                e("__metadata", i),
                e("__awaiter", u),
                e("__generator", c),
                e("__exportStar", f),
                e("__createBinding", O),
                e("__values", l),
                e("__read", _),
                e("__spread", p),
                e("__spreadArrays", E),
                e("__spreadArray", d),
                e("__await", y),
                e("__asyncGenerator", h),
                e("__asyncDelegator", g),
                e("__asyncValues", v),
                e("__makeTemplateObject", R),
                e("__importStar", m),
                e("__importDefault", A),
                e("__classPrivateFieldGet", T),
                e("__classPrivateFieldSet", M);
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
            : {}
        );
      },
      {},
    ],
    3: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.AnthemEvents = void 0),
          (function (e) {
            (e.ACCOUNT_ERROR = "account_error"),
              (e.AUTH_ERROR = "authentication_error"),
              (e.AUTOPLAY_FAILED = "autoplay_failed"),
              (e.PROGRESS = "progress"),
              (e.PLAYBACK_ERROR = "playback_error"),
              (e.PLAYER_INIT_ERROR = "initialization_error"),
              (e.PLAYER_READY = "ready"),
              (e.PLAYER_NOT_READY = "not_ready"),
              (e.PLAYER_STATE_CHANGED = "player_state_changed");
          })(n.AnthemEvents || (n.AnthemEvents = {}));
      },
      {},
    ],
    4: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.Errors = void 0),
          (function (e) {
            (e.INVALID_LISTENER = "INVALID_LISTENER"),
              (e.INVALID_WEBPLAYBACK = "INVALID_WEBPLAYBACK"),
              (e.NO_BODY = "NO_BODY"),
              (e.NO_EVENT = "NO_EVENT"),
              (e.INVALID_OAUTH = "INVALID_OAUTH"),
              (e.MISSING_IFRAME = "MISSING_IFRAME"),
              (e.AUTOPLAY_FAILED = "AUTOPLAY_FAILED");
          })(n.Errors || (n.Errors = {}));
      },
      {},
    ],
    5: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.Messages = void 0),
          (function (e) {
            (e.SPOTIFY_MESSAGE = "SP_MESSAGE"),
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
              (e.AUTOPLAY_FAILED = "AUTOPLAY_FAILED");
          })(n.Messages || (n.Messages = {}));
      },
      {},
    ],
    6: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.PlayerError = void 0);
        var r = e("tslib"),
          s = (function (e) {
            function t(t, n) {
              var r = e.call(this, n) || this;
              return (r.code = t), (r.message = n), (r.name = "AnthemError"), r;
            }
            return r.__extends(t, e), t;
          })(Error);
        n.PlayerError = s;
      },
      { tslib: 2 },
    ],
    7: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 });
        var r = e("../enums/errors"),
          s = e("../error/player_error"),
          o = e("./player_api");
        function a() {
          if (!document.body)
            throw new s.PlayerError(
              r.Errors.NO_BODY,
              "Document doesn't have a body"
            );
          if (
            ((window.Spotify = { Player: o.setupPlayerEnv(window) }),
            window.onSpotifyWebPlaybackSDKReady)
          )
            return window.onSpotifyWebPlaybackSDKReady();
          if (window.onSpotifyPlayerAPIReady)
            return window.onSpotifyPlayerAPIReady();
          throw new s.PlayerError(
            r.Errors.INVALID_WEBPLAYBACK,
            "onSpotifyWebPlaybackSDKReady is not defined"
          );
        }
        "complete" === document.readyState
          ? a()
          : window.addEventListener("load", a);
      },
      { "../enums/errors": 4, "../error/player_error": 6, "./player_api": 8 },
    ],
    8: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.setupPlayerEnv = void 0);
        var r = e("tslib"),
          s = e("@js-sdk/common/lib/promise_resolver"),
          o = e("../enums/messages"),
          a = e("../enums/anthemEvents"),
          i = e("../enums/errors"),
          u = e("../error/player_error"),
          c = e("../shared/message_dispatcher"),
          f = e("../shared/messages_factory");
        n.setupPlayerEnv = function (e, t) {
          var n = "https://sdk.scdn.co/embedded/index.html",
            l = s.createPromiseResolver(),
            _ = c.MessageDispatcher.create(),
            p =
              t ||
              function (t) {
                var n = e.document.createElement("iframe");
                return (
                  (n.src = t),
                  n.setAttribute("alt", "Audio Playback Container"),
                  n.setAttribute("tabIndex", "-1"),
                  n.style.setProperty("position", "absolute", "important"),
                  n.style.setProperty("left", "-1px", "important"),
                  n.style.setProperty("width", "0", "important"),
                  n.style.setProperty("height", "0", "important"),
                  n.style.setProperty("border", "none", "important"),
                  n.style.setProperty("outline", "none", "important"),
                  (n.allow = "encrypted-media; autoplay"),
                  e.document.body.appendChild(n),
                  n.contentWindow
                );
              };
          _.listen(e, function (t) {
            t === o.Messages.LOADED && (_.stopListening(e), l.resolve());
          });
          var E = p(n);
          return (function () {
            function t(t) {
              var n,
                r,
                s,
                i,
                u = this;
              (this._options = {
                name:
                  t.name ||
                  (null === (s = null == e ? void 0 : e.location) ||
                  void 0 === s
                    ? void 0
                    : s.hostname) ||
                  "",
                getOAuthToken: t.getOAuthToken || t.getOauthToken,
                volume: null !== (i = t.volume) && void 0 !== i ? i : 1,
                enableMediaSession: t.enableMediaSession,
              }),
                (this._handleMessages = this._handleMessages.bind(this)),
                (this._eventListeners =
                  (((n = {})[a.AnthemEvents.ACCOUNT_ERROR] = []),
                  (n[a.AnthemEvents.AUTH_ERROR] = []),
                  (n[a.AnthemEvents.AUTOPLAY_FAILED] = []),
                  (n[a.AnthemEvents.PLAYBACK_ERROR] = []),
                  (n[a.AnthemEvents.PLAYER_INIT_ERROR] = []),
                  (n[a.AnthemEvents.PLAYER_READY] = []),
                  (n[a.AnthemEvents.PLAYER_NOT_READY] = []),
                  (n[a.AnthemEvents.PLAYER_STATE_CHANGED] = []),
                  (n[a.AnthemEvents.PROGRESS] = []),
                  n)),
                (this._connectionRequests = {}),
                (this._getCurrentStateRequests = {}),
                (this._getVolumeRequests = {}),
                (this._messageHandlers =
                  (((r = {})[o.Messages.GET_TOKEN] =
                    this._onGetToken.bind(this)),
                  (r[o.Messages.EVENT] = this._onEvent.bind(this)),
                  (r[o.Messages.CONNECTED] = this._onConnected.bind(this)),
                  (r[o.Messages.CURRENT_STATE] =
                    this._onCurrentState.bind(this)),
                  (r[o.Messages.VOLUME] = this._onVolume.bind(this)),
                  r)),
                (this.isLoaded = l.promise.then(function () {
                  _.listen(e, u._handleMessages),
                    u._sendMessage(f.messages.init(u._options));
                }));
            }
            return (
              (t.prototype._getListeners = function (e) {
                return r.__spreadArray([], this._eventListeners[e]);
              }),
              (t.prototype._onEvent = function (e) {
                var t = e.name;
                this._getListeners(a.AnthemEvents[t]).forEach(function (t) {
                  t(e.eventData);
                });
              }),
              (t.prototype._onGetToken = function (e, t) {
                var n = this,
                  r = this._options.getOAuthToken;
                if ("function" == typeof r)
                  new Promise(r).then(function (e) {
                    n._sendMessage(f.messages.token(e, t));
                  });
                else {
                  if (
                    !this._getListeners(a.AnthemEvents.PLAYER_INIT_ERROR).length
                  )
                    throw new u.PlayerError(
                      i.Errors.INVALID_OAUTH,
                      "getOAuthToken is not a function"
                    );
                  this._onEvent({
                    name: o.Messages.PLAYER_INIT_ERROR,
                    eventData: { message: i.Errors.INVALID_OAUTH },
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
              (t.prototype._handleMessages = function (e, t, n) {
                var r, s;
                null === (s = (r = this._messageHandlers)[e]) ||
                  void 0 === s ||
                  s.call(r, t, n);
              }),
              (t.prototype._sendMessage = function (e) {
                return _.send(E, e, n);
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
                    n = e._sendMessage(f.messages.connect());
                  return (
                    (e._connectionRequests[n] = s.createPromiseResolver()),
                    null === (t = e._connectionRequests[n]) || void 0 === t
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
                var n = this._eventListeners[e];
                return 1 === arguments.length
                  ? ((this._eventListeners[e] = []), !0)
                  : !(!n || !n.length) &&
                      ((this._eventListeners[e] = n.filter(function (e) {
                        return e !== t;
                      })),
                      !0);
              }),
              (t.prototype.getCurrentState = function () {
                var e = this;
                return this.isLoaded.then(function () {
                  var t,
                    n = e._sendMessage(f.messages.getCurrentState());
                  return (
                    (e._getCurrentStateRequests[n] = s.createPromiseResolver()),
                    null === (t = e._getCurrentStateRequests[n]) || void 0 === t
                      ? void 0
                      : t.promise
                  );
                });
              }),
              (t.prototype.getVolume = function () {
                var e = this;
                return this.isLoaded.then(function () {
                  var t,
                    n = e._sendMessage(f.messages.getVolume());
                  return (
                    (e._getVolumeRequests[n] = s.createPromiseResolver()),
                    null === (t = e._getVolumeRequests[n]) || void 0 === t
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
                  f.messages.activateElement()
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
        "../enums/anthemEvents": 3,
        "../enums/errors": 4,
        "../enums/messages": 5,
        "../error/player_error": 6,
        "../shared/message_dispatcher": 9,
        "../shared/messages_factory": 10,
        "@js-sdk/common/lib/promise_resolver": 1,
        tslib: 2,
      },
    ],
    9: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.MessageDispatcher = void 0);
        var r = e("../enums/messages"),
          s = (function () {
            function e() {
              (this._seq = 0),
                (this._onMessageCallback = function () {}),
                (this._receiveMessage = this._receiveMessage.bind(this));
            }
            return (
              (e.create = function () {
                return new e();
              }),
              (e.prototype._addMessageId = function (e) {
                return (e.seq = this._seq++), e;
              }),
              (e.prototype._receiveMessage = function (e) {
                if (e.data) {
                  var t = e.data,
                    n = t.type,
                    s = t.body,
                    o = t.seq;
                  n === r.Messages.SPOTIFY_MESSAGE &&
                    (null == s ? void 0 : s.topic) &&
                    this._onMessageCallback(s.topic, s.data, o);
                }
              }),
              (e.prototype.listen = function (e, t) {
                (this._onMessageCallback = t),
                  e.addEventListener("message", this._receiveMessage);
              }),
              (e.prototype.stopListening = function (e) {
                e.removeEventListener("message", this._receiveMessage);
              }),
              (e.prototype.send = function (e, t, n) {
                void 0 === n && (n = "*");
                var r = this._addMessageId(t);
                return e.postMessage(r, n), r.seq;
              }),
              e
            );
          })();
        n.MessageDispatcher = s;
      },
      { "../enums/messages": 5 },
    ],
    10: [
      function (e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 }),
          (n.messages = void 0);
        var r = e("../enums/messages"),
          s = (function () {
            function e() {}
            return (
              (e.create = function () {
                return new e();
              }),
              (e.prototype._createEventMessage = function (e, t) {
                return this._createMessage(r.Messages.EVENT, {
                  name: e,
                  eventData: t,
                });
              }),
              (e.prototype._createMessage = function (e, t) {
                return {
                  type: r.Messages.SPOTIFY_MESSAGE,
                  body: {
                    topic: e,
                    data: void 0 !== t ? JSON.parse(JSON.stringify(t)) : void 0,
                  },
                };
              }),
              (e.prototype.accountError = function (e) {
                return this._createEventMessage(r.Messages.ACCOUNT_ERROR, {
                  message: e,
                });
              }),
              (e.prototype.authError = function (e) {
                return this._createEventMessage(r.Messages.AUTH_ERROR, e);
              }),
              (e.prototype.autoplayFailed = function (e) {
                return this._createEventMessage(r.Messages.AUTOPLAY_FAILED, e);
              }),
              (e.prototype.playbackError = function (e) {
                return this._createEventMessage(r.Messages.PLAYBACK_ERROR, e);
              }),
              (e.prototype.playerReady = function (e) {
                return this._createEventMessage(r.Messages.PLAYER_READY, e);
              }),
              (e.prototype.playerNotReady = function (e) {
                return this._createEventMessage(r.Messages.PLAYER_NOT_READY, e);
              }),
              (e.prototype.connect = function () {
                return this._createMessage(r.Messages.CONNECT);
              }),
              (e.prototype.connected = function (e, t) {
                return this._createMessage(r.Messages.CONNECTED, {
                  connected: e,
                  ref: t,
                });
              }),
              (e.prototype.disconnect = function () {
                return this._createMessage(r.Messages.DISCONNECT);
              }),
              (e.prototype.init = function (e) {
                return this._createMessage(r.Messages.INIT, e);
              }),
              (e.prototype.playerInitError = function (e) {
                return this._createEventMessage(
                  r.Messages.PLAYER_INIT_ERROR,
                  e
                );
              }),
              (e.prototype.getToken = function () {
                return this._createMessage(r.Messages.GET_TOKEN);
              }),
              (e.prototype.token = function (e, t) {
                return this._createMessage(r.Messages.TOKEN, {
                  token: e,
                  ref: t,
                });
              }),
              (e.prototype.activateElement = function () {
                return this._createMessage(r.Messages.ACTIVATE_ELEMENT);
              }),
              (e.prototype.activateElementError = function (e) {
                return this._createEventMessage(
                  r.Messages.ACTIVATE_ELEMENT_ERROR,
                  e
                );
              }),
              (e.prototype.pause = function () {
                return this._createMessage(r.Messages.PAUSE);
              }),
              (e.prototype.resume = function () {
                return this._createMessage(r.Messages.RESUME);
              }),
              (e.prototype.togglePlay = function () {
                return this._createMessage(r.Messages.TOGGLE_PLAY);
              }),
              (e.prototype.seek = function (e) {
                return this._createMessage(r.Messages.SEEK, e);
              }),
              (e.prototype.nextTrack = function (e) {
                return this._createMessage(r.Messages.NEXT_TRACK, e);
              }),
              (e.prototype.previousTrack = function (e) {
                return this._createMessage(r.Messages.PREV_TRACK, e);
              }),
              (e.prototype.getCurrentState = function () {
                return this._createMessage(r.Messages.GET_CURRENT_STATE);
              }),
              (e.prototype.currentState = function (e, t) {
                return this._createMessage(r.Messages.CURRENT_STATE, {
                  state: e,
                  ref: t,
                });
              }),
              (e.prototype.playerStateChanged = function (e) {
                return this._createEventMessage(
                  r.Messages.PLAYER_STATE_CHANGED,
                  e
                );
              }),
              (e.prototype.progress = function (e) {
                return this._createEventMessage(r.Messages.PROGRESS, e);
              }),
              (e.prototype.getVolume = function () {
                return this._createMessage(r.Messages.GET_VOLUME);
              }),
              (e.prototype.volume = function (e, t) {
                return this._createMessage(r.Messages.VOLUME, {
                  volume: e,
                  ref: t,
                });
              }),
              (e.prototype.setVolume = function (e) {
                return this._createMessage(r.Messages.SET_VOLUME, e);
              }),
              (e.prototype.setName = function (e) {
                return this._createMessage(r.Messages.SET_NAME, e);
              }),
              (e.prototype.embeddedLoaded = function () {
                return this._createMessage(r.Messages.LOADED);
              }),
              e
            );
          })();
        n.messages = s.create();
      },
      { "../enums/messages": 5 },
    ],
  },
  {},
  [7]
);
