(async () => {
  (function() {
    const a = document.createElement("link").relList;
    if (a && a.supports && a.supports("modulepreload")) return;
    for (const c of document.querySelectorAll('link[rel="modulepreload"]')) r(c);
    new MutationObserver((c) => {
      for (const f of c) if (f.type === "childList") for (const h of f.addedNodes) h.tagName === "LINK" && h.rel === "modulepreload" && r(h);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function s(c) {
      const f = {};
      return c.integrity && (f.integrity = c.integrity), c.referrerPolicy && (f.referrerPolicy = c.referrerPolicy), c.crossOrigin === "use-credentials" ? f.credentials = "include" : c.crossOrigin === "anonymous" ? f.credentials = "omit" : f.credentials = "same-origin", f;
    }
    function r(c) {
      if (c.ep) return;
      c.ep = true;
      const f = s(c);
      fetch(c.href, f);
    }
  })();
  var uc = {
    exports: {}
  }, Vl = {};
  var wp;
  function Ab() {
    if (wp) return Vl;
    wp = 1;
    var i = Symbol.for("react.transitional.element"), a = Symbol.for("react.fragment");
    function s(r, c, f) {
      var h = null;
      if (f !== void 0 && (h = "" + f), c.key !== void 0 && (h = "" + c.key), "key" in c) {
        f = {};
        for (var m in c) m !== "key" && (f[m] = c[m]);
      } else f = c;
      return c = f.ref, {
        $$typeof: i,
        type: r,
        key: h,
        ref: c !== void 0 ? c : null,
        props: f
      };
    }
    return Vl.Fragment = a, Vl.jsx = s, Vl.jsxs = s, Vl;
  }
  var Rp;
  function Eb() {
    return Rp || (Rp = 1, uc.exports = Ab()), uc.exports;
  }
  var _ = Eb(), oc = {
    exports: {}
  }, rt = {};
  var Op;
  function _b() {
    if (Op) return rt;
    Op = 1;
    var i = Symbol.for("react.transitional.element"), a = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), f = Symbol.for("react.consumer"), h = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), y = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), b = Symbol.for("react.activity"), T = Symbol.iterator;
    function w(S) {
      return S === null || typeof S != "object" ? null : (S = T && S[T] || S["@@iterator"], typeof S == "function" ? S : null);
    }
    var C = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    }, L = Object.assign, H = {};
    function B(S, V, X) {
      this.props = S, this.context = V, this.refs = H, this.updater = X || C;
    }
    B.prototype.isReactComponent = {}, B.prototype.setState = function(S, V) {
      if (typeof S != "object" && typeof S != "function" && S != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, S, V, "setState");
    }, B.prototype.forceUpdate = function(S) {
      this.updater.enqueueForceUpdate(this, S, "forceUpdate");
    };
    function k() {
    }
    k.prototype = B.prototype;
    function G(S, V, X) {
      this.props = S, this.context = V, this.refs = H, this.updater = X || C;
    }
    var Q = G.prototype = new k();
    Q.constructor = G, L(Q, B.prototype), Q.isPureReactComponent = true;
    var I = Array.isArray;
    function ft() {
    }
    var et = {
      H: null,
      A: null,
      T: null,
      S: null
    }, nt = Object.prototype.hasOwnProperty;
    function zt(S, V, X) {
      var J = X.ref;
      return {
        $$typeof: i,
        type: S,
        key: V,
        ref: J !== void 0 ? J : null,
        props: X
      };
    }
    function it(S, V) {
      return zt(S.type, V, S.props);
    }
    function St(S) {
      return typeof S == "object" && S !== null && S.$$typeof === i;
    }
    function At(S) {
      var V = {
        "=": "=0",
        ":": "=2"
      };
      return "$" + S.replace(/[=:]/g, function(X) {
        return V[X];
      });
    }
    var oe = /\/+/g;
    function Qt(S, V) {
      return typeof S == "object" && S !== null && S.key != null ? At("" + S.key) : V.toString(36);
    }
    function kt(S) {
      switch (S.status) {
        case "fulfilled":
          return S.value;
        case "rejected":
          throw S.reason;
        default:
          switch (typeof S.status == "string" ? S.then(ft, ft) : (S.status = "pending", S.then(function(V) {
            S.status === "pending" && (S.status = "fulfilled", S.value = V);
          }, function(V) {
            S.status === "pending" && (S.status = "rejected", S.reason = V);
          })), S.status) {
            case "fulfilled":
              return S.value;
            case "rejected":
              throw S.reason;
          }
      }
      throw S;
    }
    function O(S, V, X, J, st) {
      var ht = typeof S;
      (ht === "undefined" || ht === "boolean") && (S = null);
      var xt = false;
      if (S === null) xt = true;
      else switch (ht) {
        case "bigint":
        case "string":
        case "number":
          xt = true;
          break;
        case "object":
          switch (S.$$typeof) {
            case i:
            case a:
              xt = true;
              break;
            case v:
              return xt = S._init, O(xt(S._payload), V, X, J, st);
          }
      }
      if (xt) return st = st(S), xt = J === "" ? "." + Qt(S, 0) : J, I(st) ? (X = "", xt != null && (X = xt.replace(oe, "$&/") + "/"), O(st, V, X, "", function(bi) {
        return bi;
      })) : st != null && (St(st) && (st = it(st, X + (st.key == null || S && S.key === st.key ? "" : ("" + st.key).replace(oe, "$&/") + "/") + xt)), V.push(st)), 1;
      xt = 0;
      var ce = J === "" ? "." : J + ":";
      if (I(S)) for (var Xt = 0; Xt < S.length; Xt++) J = S[Xt], ht = ce + Qt(J, Xt), xt += O(J, V, X, ht, st);
      else if (Xt = w(S), typeof Xt == "function") for (S = Xt.call(S), Xt = 0; !(J = S.next()).done; ) J = J.value, ht = ce + Qt(J, Xt++), xt += O(J, V, X, ht, st);
      else if (ht === "object") {
        if (typeof S.then == "function") return O(kt(S), V, X, J, st);
        throw V = String(S), Error("Objects are not valid as a React child (found: " + (V === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : V) + "). If you meant to render a collection of children, use an array instead.");
      }
      return xt;
    }
    function Y(S, V, X) {
      if (S == null) return S;
      var J = [], st = 0;
      return O(S, J, "", "", function(ht) {
        return V.call(X, ht, st++);
      }), J;
    }
    function K(S) {
      if (S._status === -1) {
        var V = S._result;
        V = V(), V.then(function(X) {
          (S._status === 0 || S._status === -1) && (S._status = 1, S._result = X);
        }, function(X) {
          (S._status === 0 || S._status === -1) && (S._status = 2, S._result = X);
        }), S._status === -1 && (S._status = 0, S._result = V);
      }
      if (S._status === 1) return S._result.default;
      throw S._result;
    }
    var lt = typeof reportError == "function" ? reportError : function(S) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var V = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof S == "object" && S !== null && typeof S.message == "string" ? String(S.message) : String(S),
          error: S
        });
        if (!window.dispatchEvent(V)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", S);
        return;
      }
      console.error(S);
    }, mt = {
      map: Y,
      forEach: function(S, V, X) {
        Y(S, function() {
          V.apply(this, arguments);
        }, X);
      },
      count: function(S) {
        var V = 0;
        return Y(S, function() {
          V++;
        }), V;
      },
      toArray: function(S) {
        return Y(S, function(V) {
          return V;
        }) || [];
      },
      only: function(S) {
        if (!St(S)) throw Error("React.Children.only expected to receive a single React element child.");
        return S;
      }
    };
    return rt.Activity = b, rt.Children = mt, rt.Component = B, rt.Fragment = s, rt.Profiler = c, rt.PureComponent = G, rt.StrictMode = r, rt.Suspense = p, rt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = et, rt.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(S) {
        return et.H.useMemoCache(S);
      }
    }, rt.cache = function(S) {
      return function() {
        return S.apply(null, arguments);
      };
    }, rt.cacheSignal = function() {
      return null;
    }, rt.cloneElement = function(S, V, X) {
      if (S == null) throw Error("The argument must be a React element, but you passed " + S + ".");
      var J = L({}, S.props), st = S.key;
      if (V != null) for (ht in V.key !== void 0 && (st = "" + V.key), V) !nt.call(V, ht) || ht === "key" || ht === "__self" || ht === "__source" || ht === "ref" && V.ref === void 0 || (J[ht] = V[ht]);
      var ht = arguments.length - 2;
      if (ht === 1) J.children = X;
      else if (1 < ht) {
        for (var xt = Array(ht), ce = 0; ce < ht; ce++) xt[ce] = arguments[ce + 2];
        J.children = xt;
      }
      return zt(S.type, st, J);
    }, rt.createContext = function(S) {
      return S = {
        $$typeof: h,
        _currentValue: S,
        _currentValue2: S,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      }, S.Provider = S, S.Consumer = {
        $$typeof: f,
        _context: S
      }, S;
    }, rt.createElement = function(S, V, X) {
      var J, st = {}, ht = null;
      if (V != null) for (J in V.key !== void 0 && (ht = "" + V.key), V) nt.call(V, J) && J !== "key" && J !== "__self" && J !== "__source" && (st[J] = V[J]);
      var xt = arguments.length - 2;
      if (xt === 1) st.children = X;
      else if (1 < xt) {
        for (var ce = Array(xt), Xt = 0; Xt < xt; Xt++) ce[Xt] = arguments[Xt + 2];
        st.children = ce;
      }
      if (S && S.defaultProps) for (J in xt = S.defaultProps, xt) st[J] === void 0 && (st[J] = xt[J]);
      return zt(S, ht, st);
    }, rt.createRef = function() {
      return {
        current: null
      };
    }, rt.forwardRef = function(S) {
      return {
        $$typeof: m,
        render: S
      };
    }, rt.isValidElement = St, rt.lazy = function(S) {
      return {
        $$typeof: v,
        _payload: {
          _status: -1,
          _result: S
        },
        _init: K
      };
    }, rt.memo = function(S, V) {
      return {
        $$typeof: y,
        type: S,
        compare: V === void 0 ? null : V
      };
    }, rt.startTransition = function(S) {
      var V = et.T, X = {};
      et.T = X;
      try {
        var J = S(), st = et.S;
        st !== null && st(X, J), typeof J == "object" && J !== null && typeof J.then == "function" && J.then(ft, lt);
      } catch (ht) {
        lt(ht);
      } finally {
        V !== null && X.types !== null && (V.types = X.types), et.T = V;
      }
    }, rt.unstable_useCacheRefresh = function() {
      return et.H.useCacheRefresh();
    }, rt.use = function(S) {
      return et.H.use(S);
    }, rt.useActionState = function(S, V, X) {
      return et.H.useActionState(S, V, X);
    }, rt.useCallback = function(S, V) {
      return et.H.useCallback(S, V);
    }, rt.useContext = function(S) {
      return et.H.useContext(S);
    }, rt.useDebugValue = function() {
    }, rt.useDeferredValue = function(S, V) {
      return et.H.useDeferredValue(S, V);
    }, rt.useEffect = function(S, V) {
      return et.H.useEffect(S, V);
    }, rt.useEffectEvent = function(S) {
      return et.H.useEffectEvent(S);
    }, rt.useId = function() {
      return et.H.useId();
    }, rt.useImperativeHandle = function(S, V, X) {
      return et.H.useImperativeHandle(S, V, X);
    }, rt.useInsertionEffect = function(S, V) {
      return et.H.useInsertionEffect(S, V);
    }, rt.useLayoutEffect = function(S, V) {
      return et.H.useLayoutEffect(S, V);
    }, rt.useMemo = function(S, V) {
      return et.H.useMemo(S, V);
    }, rt.useOptimistic = function(S, V) {
      return et.H.useOptimistic(S, V);
    }, rt.useReducer = function(S, V, X) {
      return et.H.useReducer(S, V, X);
    }, rt.useRef = function(S) {
      return et.H.useRef(S);
    }, rt.useState = function(S) {
      return et.H.useState(S);
    }, rt.useSyncExternalStore = function(S, V, X) {
      return et.H.useSyncExternalStore(S, V, X);
    }, rt.useTransition = function() {
      return et.H.useTransition();
    }, rt.version = "19.2.5", rt;
  }
  var Np;
  function af() {
    return Np || (Np = 1, oc.exports = _b()), oc.exports;
  }
  var q = af(), cc = {
    exports: {}
  }, Ul = {}, fc = {
    exports: {}
  }, hc = {};
  var jp;
  function Mb() {
    return jp || (jp = 1, (function(i) {
      function a(O, Y) {
        var K = O.length;
        O.push(Y);
        t: for (; 0 < K; ) {
          var lt = K - 1 >>> 1, mt = O[lt];
          if (0 < c(mt, Y)) O[lt] = Y, O[K] = mt, K = lt;
          else break t;
        }
      }
      function s(O) {
        return O.length === 0 ? null : O[0];
      }
      function r(O) {
        if (O.length === 0) return null;
        var Y = O[0], K = O.pop();
        if (K !== Y) {
          O[0] = K;
          t: for (var lt = 0, mt = O.length, S = mt >>> 1; lt < S; ) {
            var V = 2 * (lt + 1) - 1, X = O[V], J = V + 1, st = O[J];
            if (0 > c(X, K)) J < mt && 0 > c(st, X) ? (O[lt] = st, O[J] = K, lt = J) : (O[lt] = X, O[V] = K, lt = V);
            else if (J < mt && 0 > c(st, K)) O[lt] = st, O[J] = K, lt = J;
            else break t;
          }
        }
        return Y;
      }
      function c(O, Y) {
        var K = O.sortIndex - Y.sortIndex;
        return K !== 0 ? K : O.id - Y.id;
      }
      if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
        var f = performance;
        i.unstable_now = function() {
          return f.now();
        };
      } else {
        var h = Date, m = h.now();
        i.unstable_now = function() {
          return h.now() - m;
        };
      }
      var p = [], y = [], v = 1, b = null, T = 3, w = false, C = false, L = false, H = false, B = typeof setTimeout == "function" ? setTimeout : null, k = typeof clearTimeout == "function" ? clearTimeout : null, G = typeof setImmediate < "u" ? setImmediate : null;
      function Q(O) {
        for (var Y = s(y); Y !== null; ) {
          if (Y.callback === null) r(y);
          else if (Y.startTime <= O) r(y), Y.sortIndex = Y.expirationTime, a(p, Y);
          else break;
          Y = s(y);
        }
      }
      function I(O) {
        if (L = false, Q(O), !C) if (s(p) !== null) C = true, ft || (ft = true, At());
        else {
          var Y = s(y);
          Y !== null && kt(I, Y.startTime - O);
        }
      }
      var ft = false, et = -1, nt = 5, zt = -1;
      function it() {
        return H ? true : !(i.unstable_now() - zt < nt);
      }
      function St() {
        if (H = false, ft) {
          var O = i.unstable_now();
          zt = O;
          var Y = true;
          try {
            t: {
              C = false, L && (L = false, k(et), et = -1), w = true;
              var K = T;
              try {
                e: {
                  for (Q(O), b = s(p); b !== null && !(b.expirationTime > O && it()); ) {
                    var lt = b.callback;
                    if (typeof lt == "function") {
                      b.callback = null, T = b.priorityLevel;
                      var mt = lt(b.expirationTime <= O);
                      if (O = i.unstable_now(), typeof mt == "function") {
                        b.callback = mt, Q(O), Y = true;
                        break e;
                      }
                      b === s(p) && r(p), Q(O);
                    } else r(p);
                    b = s(p);
                  }
                  if (b !== null) Y = true;
                  else {
                    var S = s(y);
                    S !== null && kt(I, S.startTime - O), Y = false;
                  }
                }
                break t;
              } finally {
                b = null, T = K, w = false;
              }
              Y = void 0;
            }
          } finally {
            Y ? At() : ft = false;
          }
        }
      }
      var At;
      if (typeof G == "function") At = function() {
        G(St);
      };
      else if (typeof MessageChannel < "u") {
        var oe = new MessageChannel(), Qt = oe.port2;
        oe.port1.onmessage = St, At = function() {
          Qt.postMessage(null);
        };
      } else At = function() {
        B(St, 0);
      };
      function kt(O, Y) {
        et = B(function() {
          O(i.unstable_now());
        }, Y);
      }
      i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(O) {
        O.callback = null;
      }, i.unstable_forceFrameRate = function(O) {
        0 > O || 125 < O ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : nt = 0 < O ? Math.floor(1e3 / O) : 5;
      }, i.unstable_getCurrentPriorityLevel = function() {
        return T;
      }, i.unstable_next = function(O) {
        switch (T) {
          case 1:
          case 2:
          case 3:
            var Y = 3;
            break;
          default:
            Y = T;
        }
        var K = T;
        T = Y;
        try {
          return O();
        } finally {
          T = K;
        }
      }, i.unstable_requestPaint = function() {
        H = true;
      }, i.unstable_runWithPriority = function(O, Y) {
        switch (O) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            O = 3;
        }
        var K = T;
        T = O;
        try {
          return Y();
        } finally {
          T = K;
        }
      }, i.unstable_scheduleCallback = function(O, Y, K) {
        var lt = i.unstable_now();
        switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? lt + K : lt) : K = lt, O) {
          case 1:
            var mt = -1;
            break;
          case 2:
            mt = 250;
            break;
          case 5:
            mt = 1073741823;
            break;
          case 4:
            mt = 1e4;
            break;
          default:
            mt = 5e3;
        }
        return mt = K + mt, O = {
          id: v++,
          callback: Y,
          priorityLevel: O,
          startTime: K,
          expirationTime: mt,
          sortIndex: -1
        }, K > lt ? (O.sortIndex = K, a(y, O), s(p) === null && O === s(y) && (L ? (k(et), et = -1) : L = true, kt(I, K - lt))) : (O.sortIndex = mt, a(p, O), C || w || (C = true, ft || (ft = true, At()))), O;
      }, i.unstable_shouldYield = it, i.unstable_wrapCallback = function(O) {
        var Y = T;
        return function() {
          var K = T;
          T = Y;
          try {
            return O.apply(this, arguments);
          } finally {
            T = K;
          }
        };
      };
    })(hc)), hc;
  }
  var Vp;
  function Db() {
    return Vp || (Vp = 1, fc.exports = Mb()), fc.exports;
  }
  var dc = {
    exports: {}
  }, ve = {};
  var Up;
  function zb() {
    if (Up) return ve;
    Up = 1;
    var i = af();
    function a(p) {
      var y = "https://react.dev/errors/" + p;
      if (1 < arguments.length) {
        y += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var v = 2; v < arguments.length; v++) y += "&args[]=" + encodeURIComponent(arguments[v]);
      }
      return "Minified React error #" + p + "; visit " + y + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function s() {
    }
    var r = {
      d: {
        f: s,
        r: function() {
          throw Error(a(522));
        },
        D: s,
        C: s,
        L: s,
        m: s,
        X: s,
        S: s,
        M: s
      },
      p: 0,
      findDOMNode: null
    }, c = Symbol.for("react.portal");
    function f(p, y, v) {
      var b = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: c,
        key: b == null ? null : "" + b,
        children: p,
        containerInfo: y,
        implementation: v
      };
    }
    var h = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function m(p, y) {
      if (p === "font") return "";
      if (typeof y == "string") return y === "use-credentials" ? y : "";
    }
    return ve.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, ve.createPortal = function(p, y) {
      var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!y || y.nodeType !== 1 && y.nodeType !== 9 && y.nodeType !== 11) throw Error(a(299));
      return f(p, y, null, v);
    }, ve.flushSync = function(p) {
      var y = h.T, v = r.p;
      try {
        if (h.T = null, r.p = 2, p) return p();
      } finally {
        h.T = y, r.p = v, r.d.f();
      }
    }, ve.preconnect = function(p, y) {
      typeof p == "string" && (y ? (y = y.crossOrigin, y = typeof y == "string" ? y === "use-credentials" ? y : "" : void 0) : y = null, r.d.C(p, y));
    }, ve.prefetchDNS = function(p) {
      typeof p == "string" && r.d.D(p);
    }, ve.preinit = function(p, y) {
      if (typeof p == "string" && y && typeof y.as == "string") {
        var v = y.as, b = m(v, y.crossOrigin), T = typeof y.integrity == "string" ? y.integrity : void 0, w = typeof y.fetchPriority == "string" ? y.fetchPriority : void 0;
        v === "style" ? r.d.S(p, typeof y.precedence == "string" ? y.precedence : void 0, {
          crossOrigin: b,
          integrity: T,
          fetchPriority: w
        }) : v === "script" && r.d.X(p, {
          crossOrigin: b,
          integrity: T,
          fetchPriority: w,
          nonce: typeof y.nonce == "string" ? y.nonce : void 0
        });
      }
    }, ve.preinitModule = function(p, y) {
      if (typeof p == "string") if (typeof y == "object" && y !== null) {
        if (y.as == null || y.as === "script") {
          var v = m(y.as, y.crossOrigin);
          r.d.M(p, {
            crossOrigin: v,
            integrity: typeof y.integrity == "string" ? y.integrity : void 0,
            nonce: typeof y.nonce == "string" ? y.nonce : void 0
          });
        }
      } else y == null && r.d.M(p);
    }, ve.preload = function(p, y) {
      if (typeof p == "string" && typeof y == "object" && y !== null && typeof y.as == "string") {
        var v = y.as, b = m(v, y.crossOrigin);
        r.d.L(p, v, {
          crossOrigin: b,
          integrity: typeof y.integrity == "string" ? y.integrity : void 0,
          nonce: typeof y.nonce == "string" ? y.nonce : void 0,
          type: typeof y.type == "string" ? y.type : void 0,
          fetchPriority: typeof y.fetchPriority == "string" ? y.fetchPriority : void 0,
          referrerPolicy: typeof y.referrerPolicy == "string" ? y.referrerPolicy : void 0,
          imageSrcSet: typeof y.imageSrcSet == "string" ? y.imageSrcSet : void 0,
          imageSizes: typeof y.imageSizes == "string" ? y.imageSizes : void 0,
          media: typeof y.media == "string" ? y.media : void 0
        });
      }
    }, ve.preloadModule = function(p, y) {
      if (typeof p == "string") if (y) {
        var v = m(y.as, y.crossOrigin);
        r.d.m(p, {
          as: typeof y.as == "string" && y.as !== "script" ? y.as : void 0,
          crossOrigin: v,
          integrity: typeof y.integrity == "string" ? y.integrity : void 0
        });
      } else r.d.m(p);
    }, ve.requestFormReset = function(p) {
      r.d.r(p);
    }, ve.unstable_batchedUpdates = function(p, y) {
      return p(y);
    }, ve.useFormState = function(p, y, v) {
      return h.H.useFormState(p, y, v);
    }, ve.useFormStatus = function() {
      return h.H.useHostTransitionStatus();
    }, ve.version = "19.2.5", ve;
  }
  var Lp;
  function Cb() {
    if (Lp) return dc.exports;
    Lp = 1;
    function i() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (a) {
        console.error(a);
      }
    }
    return i(), dc.exports = zb(), dc.exports;
  }
  var Bp;
  function wb() {
    if (Bp) return Ul;
    Bp = 1;
    var i = Db(), a = af(), s = Cb();
    function r(t) {
      var e = "https://react.dev/errors/" + t;
      if (1 < arguments.length) {
        e += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
      }
      return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function c(t) {
      return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
    }
    function f(t) {
      var e = t, n = t;
      if (t.alternate) for (; e.return; ) e = e.return;
      else {
        t = e;
        do
          e = t, (e.flags & 4098) !== 0 && (n = e.return), t = e.return;
        while (t);
      }
      return e.tag === 3 ? n : null;
    }
    function h(t) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
      }
      return null;
    }
    function m(t) {
      if (t.tag === 31) {
        var e = t.memoizedState;
        if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
      }
      return null;
    }
    function p(t) {
      if (f(t) !== t) throw Error(r(188));
    }
    function y(t) {
      var e = t.alternate;
      if (!e) {
        if (e = f(t), e === null) throw Error(r(188));
        return e !== t ? null : t;
      }
      for (var n = t, l = e; ; ) {
        var u = n.return;
        if (u === null) break;
        var o = u.alternate;
        if (o === null) {
          if (l = u.return, l !== null) {
            n = l;
            continue;
          }
          break;
        }
        if (u.child === o.child) {
          for (o = u.child; o; ) {
            if (o === n) return p(u), t;
            if (o === l) return p(u), e;
            o = o.sibling;
          }
          throw Error(r(188));
        }
        if (n.return !== l.return) n = u, l = o;
        else {
          for (var d = false, g = u.child; g; ) {
            if (g === n) {
              d = true, n = u, l = o;
              break;
            }
            if (g === l) {
              d = true, l = u, n = o;
              break;
            }
            g = g.sibling;
          }
          if (!d) {
            for (g = o.child; g; ) {
              if (g === n) {
                d = true, n = o, l = u;
                break;
              }
              if (g === l) {
                d = true, l = o, n = u;
                break;
              }
              g = g.sibling;
            }
            if (!d) throw Error(r(189));
          }
        }
        if (n.alternate !== l) throw Error(r(190));
      }
      if (n.tag !== 3) throw Error(r(188));
      return n.stateNode.current === n ? t : e;
    }
    function v(t) {
      var e = t.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6) return t;
      for (t = t.child; t !== null; ) {
        if (e = v(t), e !== null) return e;
        t = t.sibling;
      }
      return null;
    }
    var b = Object.assign, T = Symbol.for("react.element"), w = Symbol.for("react.transitional.element"), C = Symbol.for("react.portal"), L = Symbol.for("react.fragment"), H = Symbol.for("react.strict_mode"), B = Symbol.for("react.profiler"), k = Symbol.for("react.consumer"), G = Symbol.for("react.context"), Q = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), ft = Symbol.for("react.suspense_list"), et = Symbol.for("react.memo"), nt = Symbol.for("react.lazy"), zt = Symbol.for("react.activity"), it = Symbol.for("react.memo_cache_sentinel"), St = Symbol.iterator;
    function At(t) {
      return t === null || typeof t != "object" ? null : (t = St && t[St] || t["@@iterator"], typeof t == "function" ? t : null);
    }
    var oe = Symbol.for("react.client.reference");
    function Qt(t) {
      if (t == null) return null;
      if (typeof t == "function") return t.$$typeof === oe ? null : t.displayName || t.name || null;
      if (typeof t == "string") return t;
      switch (t) {
        case L:
          return "Fragment";
        case B:
          return "Profiler";
        case H:
          return "StrictMode";
        case I:
          return "Suspense";
        case ft:
          return "SuspenseList";
        case zt:
          return "Activity";
      }
      if (typeof t == "object") switch (t.$$typeof) {
        case C:
          return "Portal";
        case G:
          return t.displayName || "Context";
        case k:
          return (t._context.displayName || "Context") + ".Consumer";
        case Q:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case et:
          return e = t.displayName || null, e !== null ? e : Qt(t.type) || "Memo";
        case nt:
          e = t._payload, t = t._init;
          try {
            return Qt(t(e));
          } catch {
          }
      }
      return null;
    }
    var kt = Array.isArray, O = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = {
      pending: false,
      data: null,
      method: null,
      action: null
    }, lt = [], mt = -1;
    function S(t) {
      return {
        current: t
      };
    }
    function V(t) {
      0 > mt || (t.current = lt[mt], lt[mt] = null, mt--);
    }
    function X(t, e) {
      mt++, lt[mt] = t.current, t.current = e;
    }
    var J = S(null), st = S(null), ht = S(null), xt = S(null);
    function ce(t, e) {
      switch (X(ht, e), X(st, t), X(J, null), e.nodeType) {
        case 9:
        case 11:
          t = (t = e.documentElement) && (t = t.namespaceURI) ? Im(t) : 0;
          break;
        default:
          if (t = e.tagName, e = e.namespaceURI) e = Im(e), t = tp(e, t);
          else switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
      }
      V(J), X(J, t);
    }
    function Xt() {
      V(J), V(st), V(ht);
    }
    function bi(t) {
      t.memoizedState !== null && X(xt, t);
      var e = J.current, n = tp(e, t.type);
      e !== n && (X(st, t), X(J, n));
    }
    function Zi(t) {
      st.current === t && (V(J), V(st)), xt.current === t && (V(xt), Rl._currentValue = K);
    }
    var Vt, Z;
    function ot(t) {
      if (Vt === void 0) try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        Vt = e && e[1] || "", Z = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
      return `
` + Vt + t + Z;
    }
    var dt = false;
    function Mt(t, e) {
      if (!t || dt) return "";
      dt = true;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var l = {
          DetermineComponentFrameRoot: function() {
            try {
              if (e) {
                var U = function() {
                  throw Error();
                };
                if (Object.defineProperty(U.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(U, []);
                  } catch (R) {
                    var z = R;
                  }
                  Reflect.construct(t, [], U);
                } else {
                  try {
                    U.call();
                  } catch (R) {
                    z = R;
                  }
                  t.call(U.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (R) {
                  z = R;
                }
                (U = t()) && typeof U.catch == "function" && U.catch(function() {
                });
              }
            } catch (R) {
              if (R && z && typeof R.stack == "string") return [
                R.stack,
                z.stack
              ];
            }
            return [
              null,
              null
            ];
          }
        };
        l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var u = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
        u && u.configurable && Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot"
        });
        var o = l.DetermineComponentFrameRoot(), d = o[0], g = o[1];
        if (d && g) {
          var x = d.split(`
`), D = g.split(`
`);
          for (u = l = 0; l < x.length && !x[l].includes("DetermineComponentFrameRoot"); ) l++;
          for (; u < D.length && !D[u].includes("DetermineComponentFrameRoot"); ) u++;
          if (l === x.length || u === D.length) for (l = x.length - 1, u = D.length - 1; 1 <= l && 0 <= u && x[l] !== D[u]; ) u--;
          for (; 1 <= l && 0 <= u; l--, u--) if (x[l] !== D[u]) {
            if (l !== 1 || u !== 1) do
              if (l--, u--, 0 > u || x[l] !== D[u]) {
                var N = `
` + x[l].replace(" at new ", " at ");
                return t.displayName && N.includes("<anonymous>") && (N = N.replace("<anonymous>", t.displayName)), N;
              }
            while (1 <= l && 0 <= u);
            break;
          }
        }
      } finally {
        dt = false, Error.prepareStackTrace = n;
      }
      return (n = t ? t.displayName || t.name : "") ? ot(n) : "";
    }
    function $(t, e) {
      switch (t.tag) {
        case 26:
        case 27:
        case 5:
          return ot(t.type);
        case 16:
          return ot("Lazy");
        case 13:
          return t.child !== e && e !== null ? ot("Suspense Fallback") : ot("Suspense");
        case 19:
          return ot("SuspenseList");
        case 0:
        case 15:
          return Mt(t.type, false);
        case 11:
          return Mt(t.type.render, false);
        case 1:
          return Mt(t.type, true);
        case 31:
          return ot("Activity");
        default:
          return "";
      }
    }
    function Tt(t) {
      try {
        var e = "", n = null;
        do
          e += $(t, n), n = t, t = t.return;
        while (t);
        return e;
      } catch (l) {
        return `
Error generating stack: ` + l.message + `
` + l.stack;
      }
    }
    var Bt = Object.prototype.hasOwnProperty, _e = i.unstable_scheduleCallback, fn = i.unstable_cancelCallback, be = i.unstable_shouldYield, Si = i.unstable_requestPaint, $t = i.unstable_now, Qr = i.unstable_getCurrentPriorityLevel, Zr = i.unstable_ImmediatePriority, Ya = i.unstable_UserBlockingPriority, xi = i.unstable_NormalPriority, Pr = i.unstable_LowPriority, Nf = i.unstable_IdlePriority, lv = i.log, sv = i.unstable_setDisableYieldValue, ka = null, Ne = null;
    function Yn(t) {
      if (typeof lv == "function" && sv(t), Ne && typeof Ne.setStrictMode == "function") try {
        Ne.setStrictMode(ka, t);
      } catch {
      }
    }
    var je = Math.clz32 ? Math.clz32 : ov, rv = Math.log, uv = Math.LN2;
    function ov(t) {
      return t >>>= 0, t === 0 ? 32 : 31 - (rv(t) / uv | 0) | 0;
    }
    var es = 256, ns = 262144, is = 4194304;
    function Ti(t) {
      var e = t & 42;
      if (e !== 0) return e;
      switch (t & -t) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return t & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return t & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return t;
      }
    }
    function as(t, e, n) {
      var l = t.pendingLanes;
      if (l === 0) return 0;
      var u = 0, o = t.suspendedLanes, d = t.pingedLanes;
      t = t.warmLanes;
      var g = l & 134217727;
      return g !== 0 ? (l = g & ~o, l !== 0 ? u = Ti(l) : (d &= g, d !== 0 ? u = Ti(d) : n || (n = g & ~t, n !== 0 && (u = Ti(n))))) : (g = l & ~o, g !== 0 ? u = Ti(g) : d !== 0 ? u = Ti(d) : n || (n = l & ~t, n !== 0 && (u = Ti(n)))), u === 0 ? 0 : e !== 0 && e !== u && (e & o) === 0 && (o = u & -u, n = e & -e, o >= n || o === 32 && (n & 4194048) !== 0) ? e : u;
    }
    function Xa(t, e) {
      return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
    }
    function cv(t, e) {
      switch (t) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return e + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function jf() {
      var t = is;
      return is <<= 1, (is & 62914560) === 0 && (is = 4194304), t;
    }
    function Jr(t) {
      for (var e = [], n = 0; 31 > n; n++) e.push(t);
      return e;
    }
    function Ka(t, e) {
      t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
    }
    function fv(t, e, n, l, u, o) {
      var d = t.pendingLanes;
      t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
      var g = t.entanglements, x = t.expirationTimes, D = t.hiddenUpdates;
      for (n = d & ~n; 0 < n; ) {
        var N = 31 - je(n), U = 1 << N;
        g[N] = 0, x[N] = -1;
        var z = D[N];
        if (z !== null) for (D[N] = null, N = 0; N < z.length; N++) {
          var R = z[N];
          R !== null && (R.lane &= -536870913);
        }
        n &= ~U;
      }
      l !== 0 && Vf(t, l, 0), o !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= o & ~(d & ~e));
    }
    function Vf(t, e, n) {
      t.pendingLanes |= e, t.suspendedLanes &= ~e;
      var l = 31 - je(e);
      t.entangledLanes |= e, t.entanglements[l] = t.entanglements[l] | 1073741824 | n & 261930;
    }
    function Uf(t, e) {
      var n = t.entangledLanes |= e;
      for (t = t.entanglements; n; ) {
        var l = 31 - je(n), u = 1 << l;
        u & e | t[l] & e && (t[l] |= e), n &= ~u;
      }
    }
    function Lf(t, e) {
      var n = e & -e;
      return n = (n & 42) !== 0 ? 1 : Fr(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n;
    }
    function Fr(t) {
      switch (t) {
        case 2:
          t = 1;
          break;
        case 8:
          t = 4;
          break;
        case 32:
          t = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          t = 128;
          break;
        case 268435456:
          t = 134217728;
          break;
        default:
          t = 0;
      }
      return t;
    }
    function Wr(t) {
      return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function Bf() {
      var t = Y.p;
      return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : Ap(t.type));
    }
    function Hf(t, e) {
      var n = Y.p;
      try {
        return Y.p = t, e();
      } finally {
        Y.p = n;
      }
    }
    var kn = Math.random().toString(36).slice(2), fe = "__reactFiber$" + kn, Me = "__reactProps$" + kn, Pi = "__reactContainer$" + kn, $r = "__reactEvents$" + kn, hv = "__reactListeners$" + kn, dv = "__reactHandles$" + kn, Gf = "__reactResources$" + kn, Qa = "__reactMarker$" + kn;
    function Ir(t) {
      delete t[fe], delete t[Me], delete t[$r], delete t[hv], delete t[dv];
    }
    function Ji(t) {
      var e = t[fe];
      if (e) return e;
      for (var n = t.parentNode; n; ) {
        if (e = n[Pi] || n[fe]) {
          if (n = e.alternate, e.child !== null || n !== null && n.child !== null) for (t = rp(t); t !== null; ) {
            if (n = t[fe]) return n;
            t = rp(t);
          }
          return e;
        }
        t = n, n = t.parentNode;
      }
      return null;
    }
    function Fi(t) {
      if (t = t[fe] || t[Pi]) {
        var e = t.tag;
        if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t;
      }
      return null;
    }
    function Za(t) {
      var e = t.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
      throw Error(r(33));
    }
    function Wi(t) {
      var e = t[Gf];
      return e || (e = t[Gf] = {
        hoistableStyles: /* @__PURE__ */ new Map(),
        hoistableScripts: /* @__PURE__ */ new Map()
      }), e;
    }
    function re(t) {
      t[Qa] = true;
    }
    var qf = /* @__PURE__ */ new Set(), Yf = {};
    function Ai(t, e) {
      $i(t, e), $i(t + "Capture", e);
    }
    function $i(t, e) {
      for (Yf[t] = e, t = 0; t < e.length; t++) qf.add(e[t]);
    }
    var mv = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), kf = {}, Xf = {};
    function pv(t) {
      return Bt.call(Xf, t) ? true : Bt.call(kf, t) ? false : mv.test(t) ? Xf[t] = true : (kf[t] = true, false);
    }
    function ls(t, e, n) {
      if (pv(e)) if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var l = e.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + n);
      }
    }
    function ss(t, e, n) {
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            t.removeAttribute(e);
            return;
        }
        t.setAttribute(e, "" + n);
      }
    }
    function Tn(t, e, n, l) {
      if (l === null) t.removeAttribute(n);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            t.removeAttribute(n);
            return;
        }
        t.setAttributeNS(e, n, "" + l);
      }
    }
    function Xe(t) {
      switch (typeof t) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return t;
        case "object":
          return t;
        default:
          return "";
      }
    }
    function Kf(t) {
      var e = t.type;
      return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
    }
    function yv(t, e, n) {
      var l = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
      if (!t.hasOwnProperty(e) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
        var u = l.get, o = l.set;
        return Object.defineProperty(t, e, {
          configurable: true,
          get: function() {
            return u.call(this);
          },
          set: function(d) {
            n = "" + d, o.call(this, d);
          }
        }), Object.defineProperty(t, e, {
          enumerable: l.enumerable
        }), {
          getValue: function() {
            return n;
          },
          setValue: function(d) {
            n = "" + d;
          },
          stopTracking: function() {
            t._valueTracker = null, delete t[e];
          }
        };
      }
    }
    function tu(t) {
      if (!t._valueTracker) {
        var e = Kf(t) ? "checked" : "value";
        t._valueTracker = yv(t, e, "" + t[e]);
      }
    }
    function Qf(t) {
      if (!t) return false;
      var e = t._valueTracker;
      if (!e) return true;
      var n = e.getValue(), l = "";
      return t && (l = Kf(t) ? t.checked ? "true" : "false" : t.value), t = l, t !== n ? (e.setValue(t), true) : false;
    }
    function rs(t) {
      if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
      try {
        return t.activeElement || t.body;
      } catch {
        return t.body;
      }
    }
    var gv = /[\n"\\]/g;
    function Ke(t) {
      return t.replace(gv, function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      });
    }
    function eu(t, e, n, l, u, o, d, g) {
      t.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? t.type = d : t.removeAttribute("type"), e != null ? d === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Xe(e)) : t.value !== "" + Xe(e) && (t.value = "" + Xe(e)) : d !== "submit" && d !== "reset" || t.removeAttribute("value"), e != null ? nu(t, d, Xe(e)) : n != null ? nu(t, d, Xe(n)) : l != null && t.removeAttribute("value"), u == null && o != null && (t.defaultChecked = !!o), u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"), g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? t.name = "" + Xe(g) : t.removeAttribute("name");
    }
    function Zf(t, e, n, l, u, o, d, g) {
      if (o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (t.type = o), e != null || n != null) {
        if (!(o !== "submit" && o !== "reset" || e != null)) {
          tu(t);
          return;
        }
        n = n != null ? "" + Xe(n) : "", e = e != null ? "" + Xe(e) : n, g || e === t.value || (t.value = e), t.defaultValue = e;
      }
      l = l ?? u, l = typeof l != "function" && typeof l != "symbol" && !!l, t.checked = g ? t.checked : !!l, t.defaultChecked = !!l, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (t.name = d), tu(t);
    }
    function nu(t, e, n) {
      e === "number" && rs(t.ownerDocument) === t || t.defaultValue === "" + n || (t.defaultValue = "" + n);
    }
    function Ii(t, e, n, l) {
      if (t = t.options, e) {
        e = {};
        for (var u = 0; u < n.length; u++) e["$" + n[u]] = true;
        for (n = 0; n < t.length; n++) u = e.hasOwnProperty("$" + t[n].value), t[n].selected !== u && (t[n].selected = u), u && l && (t[n].defaultSelected = true);
      } else {
        for (n = "" + Xe(n), e = null, u = 0; u < t.length; u++) {
          if (t[u].value === n) {
            t[u].selected = true, l && (t[u].defaultSelected = true);
            return;
          }
          e !== null || t[u].disabled || (e = t[u]);
        }
        e !== null && (e.selected = true);
      }
    }
    function Pf(t, e, n) {
      if (e != null && (e = "" + Xe(e), e !== t.value && (t.value = e), n == null)) {
        t.defaultValue !== e && (t.defaultValue = e);
        return;
      }
      t.defaultValue = n != null ? "" + Xe(n) : "";
    }
    function Jf(t, e, n, l) {
      if (e == null) {
        if (l != null) {
          if (n != null) throw Error(r(92));
          if (kt(l)) {
            if (1 < l.length) throw Error(r(93));
            l = l[0];
          }
          n = l;
        }
        n == null && (n = ""), e = n;
      }
      n = Xe(e), t.defaultValue = n, l = t.textContent, l === n && l !== "" && l !== null && (t.value = l), tu(t);
    }
    function ta(t, e) {
      if (e) {
        var n = t.firstChild;
        if (n && n === t.lastChild && n.nodeType === 3) {
          n.nodeValue = e;
          return;
        }
      }
      t.textContent = e;
    }
    var vv = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function Ff(t, e, n) {
      var l = e.indexOf("--") === 0;
      n == null || typeof n == "boolean" || n === "" ? l ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : l ? t.setProperty(e, n) : typeof n != "number" || n === 0 || vv.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
    }
    function Wf(t, e, n) {
      if (e != null && typeof e != "object") throw Error(r(62));
      if (t = t.style, n != null) {
        for (var l in n) !n.hasOwnProperty(l) || e != null && e.hasOwnProperty(l) || (l.indexOf("--") === 0 ? t.setProperty(l, "") : l === "float" ? t.cssFloat = "" : t[l] = "");
        for (var u in e) l = e[u], e.hasOwnProperty(u) && n[u] !== l && Ff(t, u, l);
      } else for (var o in e) e.hasOwnProperty(o) && Ff(t, o, e[o]);
    }
    function iu(t) {
      if (t.indexOf("-") === -1) return false;
      switch (t) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var bv = /* @__PURE__ */ new Map([
      [
        "acceptCharset",
        "accept-charset"
      ],
      [
        "htmlFor",
        "for"
      ],
      [
        "httpEquiv",
        "http-equiv"
      ],
      [
        "crossOrigin",
        "crossorigin"
      ],
      [
        "accentHeight",
        "accent-height"
      ],
      [
        "alignmentBaseline",
        "alignment-baseline"
      ],
      [
        "arabicForm",
        "arabic-form"
      ],
      [
        "baselineShift",
        "baseline-shift"
      ],
      [
        "capHeight",
        "cap-height"
      ],
      [
        "clipPath",
        "clip-path"
      ],
      [
        "clipRule",
        "clip-rule"
      ],
      [
        "colorInterpolation",
        "color-interpolation"
      ],
      [
        "colorInterpolationFilters",
        "color-interpolation-filters"
      ],
      [
        "colorProfile",
        "color-profile"
      ],
      [
        "colorRendering",
        "color-rendering"
      ],
      [
        "dominantBaseline",
        "dominant-baseline"
      ],
      [
        "enableBackground",
        "enable-background"
      ],
      [
        "fillOpacity",
        "fill-opacity"
      ],
      [
        "fillRule",
        "fill-rule"
      ],
      [
        "floodColor",
        "flood-color"
      ],
      [
        "floodOpacity",
        "flood-opacity"
      ],
      [
        "fontFamily",
        "font-family"
      ],
      [
        "fontSize",
        "font-size"
      ],
      [
        "fontSizeAdjust",
        "font-size-adjust"
      ],
      [
        "fontStretch",
        "font-stretch"
      ],
      [
        "fontStyle",
        "font-style"
      ],
      [
        "fontVariant",
        "font-variant"
      ],
      [
        "fontWeight",
        "font-weight"
      ],
      [
        "glyphName",
        "glyph-name"
      ],
      [
        "glyphOrientationHorizontal",
        "glyph-orientation-horizontal"
      ],
      [
        "glyphOrientationVertical",
        "glyph-orientation-vertical"
      ],
      [
        "horizAdvX",
        "horiz-adv-x"
      ],
      [
        "horizOriginX",
        "horiz-origin-x"
      ],
      [
        "imageRendering",
        "image-rendering"
      ],
      [
        "letterSpacing",
        "letter-spacing"
      ],
      [
        "lightingColor",
        "lighting-color"
      ],
      [
        "markerEnd",
        "marker-end"
      ],
      [
        "markerMid",
        "marker-mid"
      ],
      [
        "markerStart",
        "marker-start"
      ],
      [
        "overlinePosition",
        "overline-position"
      ],
      [
        "overlineThickness",
        "overline-thickness"
      ],
      [
        "paintOrder",
        "paint-order"
      ],
      [
        "panose-1",
        "panose-1"
      ],
      [
        "pointerEvents",
        "pointer-events"
      ],
      [
        "renderingIntent",
        "rendering-intent"
      ],
      [
        "shapeRendering",
        "shape-rendering"
      ],
      [
        "stopColor",
        "stop-color"
      ],
      [
        "stopOpacity",
        "stop-opacity"
      ],
      [
        "strikethroughPosition",
        "strikethrough-position"
      ],
      [
        "strikethroughThickness",
        "strikethrough-thickness"
      ],
      [
        "strokeDasharray",
        "stroke-dasharray"
      ],
      [
        "strokeDashoffset",
        "stroke-dashoffset"
      ],
      [
        "strokeLinecap",
        "stroke-linecap"
      ],
      [
        "strokeLinejoin",
        "stroke-linejoin"
      ],
      [
        "strokeMiterlimit",
        "stroke-miterlimit"
      ],
      [
        "strokeOpacity",
        "stroke-opacity"
      ],
      [
        "strokeWidth",
        "stroke-width"
      ],
      [
        "textAnchor",
        "text-anchor"
      ],
      [
        "textDecoration",
        "text-decoration"
      ],
      [
        "textRendering",
        "text-rendering"
      ],
      [
        "transformOrigin",
        "transform-origin"
      ],
      [
        "underlinePosition",
        "underline-position"
      ],
      [
        "underlineThickness",
        "underline-thickness"
      ],
      [
        "unicodeBidi",
        "unicode-bidi"
      ],
      [
        "unicodeRange",
        "unicode-range"
      ],
      [
        "unitsPerEm",
        "units-per-em"
      ],
      [
        "vAlphabetic",
        "v-alphabetic"
      ],
      [
        "vHanging",
        "v-hanging"
      ],
      [
        "vIdeographic",
        "v-ideographic"
      ],
      [
        "vMathematical",
        "v-mathematical"
      ],
      [
        "vectorEffect",
        "vector-effect"
      ],
      [
        "vertAdvY",
        "vert-adv-y"
      ],
      [
        "vertOriginX",
        "vert-origin-x"
      ],
      [
        "vertOriginY",
        "vert-origin-y"
      ],
      [
        "wordSpacing",
        "word-spacing"
      ],
      [
        "writingMode",
        "writing-mode"
      ],
      [
        "xmlnsXlink",
        "xmlns:xlink"
      ],
      [
        "xHeight",
        "x-height"
      ]
    ]), Sv = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function us(t) {
      return Sv.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
    }
    function An() {
    }
    var au = null;
    function lu(t) {
      return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
    }
    var ea = null, na = null;
    function $f(t) {
      var e = Fi(t);
      if (e && (t = e.stateNode)) {
        var n = t[Me] || null;
        t: switch (t = e.stateNode, e.type) {
          case "input":
            if (eu(t, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), e = n.name, n.type === "radio" && e != null) {
              for (n = t; n.parentNode; ) n = n.parentNode;
              for (n = n.querySelectorAll('input[name="' + Ke("" + e) + '"][type="radio"]'), e = 0; e < n.length; e++) {
                var l = n[e];
                if (l !== t && l.form === t.form) {
                  var u = l[Me] || null;
                  if (!u) throw Error(r(90));
                  eu(l, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
                }
              }
              for (e = 0; e < n.length; e++) l = n[e], l.form === t.form && Qf(l);
            }
            break t;
          case "textarea":
            Pf(t, n.value, n.defaultValue);
            break t;
          case "select":
            e = n.value, e != null && Ii(t, !!n.multiple, e, false);
        }
      }
    }
    var su = false;
    function If(t, e, n) {
      if (su) return t(e, n);
      su = true;
      try {
        var l = t(e);
        return l;
      } finally {
        if (su = false, (ea !== null || na !== null) && (Js(), ea && (e = ea, t = na, na = ea = null, $f(e), t))) for (e = 0; e < t.length; e++) $f(t[e]);
      }
    }
    function Pa(t, e) {
      var n = t.stateNode;
      if (n === null) return null;
      var l = n[Me] || null;
      if (l === null) return null;
      n = l[e];
      t: switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (l = !l.disabled) || (t = t.type, l = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !l;
          break t;
        default:
          t = false;
      }
      if (t) return null;
      if (n && typeof n != "function") throw Error(r(231, e, typeof n));
      return n;
    }
    var En = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ru = false;
    if (En) try {
      var Ja = {};
      Object.defineProperty(Ja, "passive", {
        get: function() {
          ru = true;
        }
      }), window.addEventListener("test", Ja, Ja), window.removeEventListener("test", Ja, Ja);
    } catch {
      ru = false;
    }
    var Xn = null, uu = null, os = null;
    function th() {
      if (os) return os;
      var t, e = uu, n = e.length, l, u = "value" in Xn ? Xn.value : Xn.textContent, o = u.length;
      for (t = 0; t < n && e[t] === u[t]; t++) ;
      var d = n - t;
      for (l = 1; l <= d && e[n - l] === u[o - l]; l++) ;
      return os = u.slice(t, 1 < l ? 1 - l : void 0);
    }
    function cs(t) {
      var e = t.keyCode;
      return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
    }
    function fs() {
      return true;
    }
    function eh() {
      return false;
    }
    function De(t) {
      function e(n, l, u, o, d) {
        this._reactName = n, this._targetInst = u, this.type = l, this.nativeEvent = o, this.target = d, this.currentTarget = null;
        for (var g in t) t.hasOwnProperty(g) && (n = t[g], this[g] = n ? n(o) : o[g]);
        return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === false) ? fs : eh, this.isPropagationStopped = eh, this;
      }
      return b(e.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var n = this.nativeEvent;
          n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = false), this.isDefaultPrevented = fs);
        },
        stopPropagation: function() {
          var n = this.nativeEvent;
          n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = true), this.isPropagationStopped = fs);
        },
        persist: function() {
        },
        isPersistent: fs
      }), e;
    }
    var Ei = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, hs = De(Ei), Fa = b({}, Ei, {
      view: 0,
      detail: 0
    }), xv = De(Fa), ou, cu, Wa, ds = b({}, Fa, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: hu,
      button: 0,
      buttons: 0,
      relatedTarget: function(t) {
        return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
      },
      movementX: function(t) {
        return "movementX" in t ? t.movementX : (t !== Wa && (Wa && t.type === "mousemove" ? (ou = t.screenX - Wa.screenX, cu = t.screenY - Wa.screenY) : cu = ou = 0, Wa = t), ou);
      },
      movementY: function(t) {
        return "movementY" in t ? t.movementY : cu;
      }
    }), nh = De(ds), Tv = b({}, ds, {
      dataTransfer: 0
    }), Av = De(Tv), Ev = b({}, Fa, {
      relatedTarget: 0
    }), fu = De(Ev), _v = b({}, Ei, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Mv = De(_v), Dv = b({}, Ei, {
      clipboardData: function(t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      }
    }), zv = De(Dv), Cv = b({}, Ei, {
      data: 0
    }), ih = De(Cv), wv = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Rv = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    }, Ov = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function Nv(t) {
      var e = this.nativeEvent;
      return e.getModifierState ? e.getModifierState(t) : (t = Ov[t]) ? !!e[t] : false;
    }
    function hu() {
      return Nv;
    }
    var jv = b({}, Fa, {
      key: function(t) {
        if (t.key) {
          var e = wv[t.key] || t.key;
          if (e !== "Unidentified") return e;
        }
        return t.type === "keypress" ? (t = cs(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Rv[t.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: hu,
      charCode: function(t) {
        return t.type === "keypress" ? cs(t) : 0;
      },
      keyCode: function(t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function(t) {
        return t.type === "keypress" ? cs(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      }
    }), Vv = De(jv), Uv = b({}, ds, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), ah = De(Uv), Lv = b({}, Fa, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: hu
    }), Bv = De(Lv), Hv = b({}, Ei, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Gv = De(Hv), qv = b({}, ds, {
      deltaX: function(t) {
        return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
      },
      deltaY: function(t) {
        return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), Yv = De(qv), kv = b({}, Ei, {
      newState: 0,
      oldState: 0
    }), Xv = De(kv), Kv = [
      9,
      13,
      27,
      32
    ], du = En && "CompositionEvent" in window, $a = null;
    En && "documentMode" in document && ($a = document.documentMode);
    var Qv = En && "TextEvent" in window && !$a, lh = En && (!du || $a && 8 < $a && 11 >= $a), sh = " ", rh = false;
    function uh(t, e) {
      switch (t) {
        case "keyup":
          return Kv.indexOf(e.keyCode) !== -1;
        case "keydown":
          return e.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function oh(t) {
      return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
    }
    var ia = false;
    function Zv(t, e) {
      switch (t) {
        case "compositionend":
          return oh(e);
        case "keypress":
          return e.which !== 32 ? null : (rh = true, sh);
        case "textInput":
          return t = e.data, t === sh && rh ? null : t;
        default:
          return null;
      }
    }
    function Pv(t, e) {
      if (ia) return t === "compositionend" || !du && uh(t, e) ? (t = th(), os = uu = Xn = null, ia = false, t) : null;
      switch (t) {
        case "paste":
          return null;
        case "keypress":
          if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
            if (e.char && 1 < e.char.length) return e.char;
            if (e.which) return String.fromCharCode(e.which);
          }
          return null;
        case "compositionend":
          return lh && e.locale !== "ko" ? null : e.data;
        default:
          return null;
      }
    }
    var Jv = {
      color: true,
      date: true,
      datetime: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      password: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true
    };
    function ch(t) {
      var e = t && t.nodeName && t.nodeName.toLowerCase();
      return e === "input" ? !!Jv[t.type] : e === "textarea";
    }
    function fh(t, e, n, l) {
      ea ? na ? na.push(l) : na = [
        l
      ] : ea = l, e = nr(e, "onChange"), 0 < e.length && (n = new hs("onChange", "change", null, n, l), t.push({
        event: n,
        listeners: e
      }));
    }
    var Ia = null, tl = null;
    function Fv(t) {
      Zm(t, 0);
    }
    function ms(t) {
      var e = Za(t);
      if (Qf(e)) return t;
    }
    function hh(t, e) {
      if (t === "change") return e;
    }
    var dh = false;
    if (En) {
      var mu;
      if (En) {
        var pu = "oninput" in document;
        if (!pu) {
          var mh = document.createElement("div");
          mh.setAttribute("oninput", "return;"), pu = typeof mh.oninput == "function";
        }
        mu = pu;
      } else mu = false;
      dh = mu && (!document.documentMode || 9 < document.documentMode);
    }
    function ph() {
      Ia && (Ia.detachEvent("onpropertychange", yh), tl = Ia = null);
    }
    function yh(t) {
      if (t.propertyName === "value" && ms(tl)) {
        var e = [];
        fh(e, tl, t, lu(t)), If(Fv, e);
      }
    }
    function Wv(t, e, n) {
      t === "focusin" ? (ph(), Ia = e, tl = n, Ia.attachEvent("onpropertychange", yh)) : t === "focusout" && ph();
    }
    function $v(t) {
      if (t === "selectionchange" || t === "keyup" || t === "keydown") return ms(tl);
    }
    function Iv(t, e) {
      if (t === "click") return ms(e);
    }
    function t1(t, e) {
      if (t === "input" || t === "change") return ms(e);
    }
    function e1(t, e) {
      return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
    }
    var Ve = typeof Object.is == "function" ? Object.is : e1;
    function el(t, e) {
      if (Ve(t, e)) return true;
      if (typeof t != "object" || t === null || typeof e != "object" || e === null) return false;
      var n = Object.keys(t), l = Object.keys(e);
      if (n.length !== l.length) return false;
      for (l = 0; l < n.length; l++) {
        var u = n[l];
        if (!Bt.call(e, u) || !Ve(t[u], e[u])) return false;
      }
      return true;
    }
    function gh(t) {
      for (; t && t.firstChild; ) t = t.firstChild;
      return t;
    }
    function vh(t, e) {
      var n = gh(t);
      t = 0;
      for (var l; n; ) {
        if (n.nodeType === 3) {
          if (l = t + n.textContent.length, t <= e && l >= e) return {
            node: n,
            offset: e - t
          };
          t = l;
        }
        t: {
          for (; n; ) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break t;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = gh(n);
      }
    }
    function bh(t, e) {
      return t && e ? t === e ? true : t && t.nodeType === 3 ? false : e && e.nodeType === 3 ? bh(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : false : false;
    }
    function Sh(t) {
      t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
      for (var e = rs(t.document); e instanceof t.HTMLIFrameElement; ) {
        try {
          var n = typeof e.contentWindow.location.href == "string";
        } catch {
          n = false;
        }
        if (n) t = e.contentWindow;
        else break;
        e = rs(t.document);
      }
      return e;
    }
    function yu(t) {
      var e = t && t.nodeName && t.nodeName.toLowerCase();
      return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
    }
    var n1 = En && "documentMode" in document && 11 >= document.documentMode, aa = null, gu = null, nl = null, vu = false;
    function xh(t, e, n) {
      var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
      vu || aa == null || aa !== rs(l) || (l = aa, "selectionStart" in l && yu(l) ? l = {
        start: l.selectionStart,
        end: l.selectionEnd
      } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
        anchorNode: l.anchorNode,
        anchorOffset: l.anchorOffset,
        focusNode: l.focusNode,
        focusOffset: l.focusOffset
      }), nl && el(nl, l) || (nl = l, l = nr(gu, "onSelect"), 0 < l.length && (e = new hs("onSelect", "select", null, e, n), t.push({
        event: e,
        listeners: l
      }), e.target = aa)));
    }
    function _i(t, e) {
      var n = {};
      return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
    }
    var la = {
      animationend: _i("Animation", "AnimationEnd"),
      animationiteration: _i("Animation", "AnimationIteration"),
      animationstart: _i("Animation", "AnimationStart"),
      transitionrun: _i("Transition", "TransitionRun"),
      transitionstart: _i("Transition", "TransitionStart"),
      transitioncancel: _i("Transition", "TransitionCancel"),
      transitionend: _i("Transition", "TransitionEnd")
    }, bu = {}, Th = {};
    En && (Th = document.createElement("div").style, "AnimationEvent" in window || (delete la.animationend.animation, delete la.animationiteration.animation, delete la.animationstart.animation), "TransitionEvent" in window || delete la.transitionend.transition);
    function Mi(t) {
      if (bu[t]) return bu[t];
      if (!la[t]) return t;
      var e = la[t], n;
      for (n in e) if (e.hasOwnProperty(n) && n in Th) return bu[t] = e[n];
      return t;
    }
    var Ah = Mi("animationend"), Eh = Mi("animationiteration"), _h = Mi("animationstart"), i1 = Mi("transitionrun"), a1 = Mi("transitionstart"), l1 = Mi("transitioncancel"), Mh = Mi("transitionend"), Dh = /* @__PURE__ */ new Map(), Su = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    Su.push("scrollEnd");
    function an(t, e) {
      Dh.set(t, e), Ai(e, [
        t
      ]);
    }
    var ps = typeof reportError == "function" ? reportError : function(t) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var e = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
          error: t
        });
        if (!window.dispatchEvent(e)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", t);
        return;
      }
      console.error(t);
    }, Qe = [], sa = 0, xu = 0;
    function ys() {
      for (var t = sa, e = xu = sa = 0; e < t; ) {
        var n = Qe[e];
        Qe[e++] = null;
        var l = Qe[e];
        Qe[e++] = null;
        var u = Qe[e];
        Qe[e++] = null;
        var o = Qe[e];
        if (Qe[e++] = null, l !== null && u !== null) {
          var d = l.pending;
          d === null ? u.next = u : (u.next = d.next, d.next = u), l.pending = u;
        }
        o !== 0 && zh(n, u, o);
      }
    }
    function gs(t, e, n, l) {
      Qe[sa++] = t, Qe[sa++] = e, Qe[sa++] = n, Qe[sa++] = l, xu |= l, t.lanes |= l, t = t.alternate, t !== null && (t.lanes |= l);
    }
    function Tu(t, e, n, l) {
      return gs(t, e, n, l), vs(t);
    }
    function Di(t, e) {
      return gs(t, null, null, e), vs(t);
    }
    function zh(t, e, n) {
      t.lanes |= n;
      var l = t.alternate;
      l !== null && (l.lanes |= n);
      for (var u = false, o = t.return; o !== null; ) o.childLanes |= n, l = o.alternate, l !== null && (l.childLanes |= n), o.tag === 22 && (t = o.stateNode, t === null || t._visibility & 1 || (u = true)), t = o, o = o.return;
      return t.tag === 3 ? (o = t.stateNode, u && e !== null && (u = 31 - je(n), t = o.hiddenUpdates, l = t[u], l === null ? t[u] = [
        e
      ] : l.push(e), e.lane = n | 536870912), o) : null;
    }
    function vs(t) {
      if (50 < El) throw El = 0, Oo = null, Error(r(185));
      for (var e = t.return; e !== null; ) t = e, e = t.return;
      return t.tag === 3 ? t.stateNode : null;
    }
    var ra = {};
    function s1(t, e, n, l) {
      this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function Ue(t, e, n, l) {
      return new s1(t, e, n, l);
    }
    function Au(t) {
      return t = t.prototype, !(!t || !t.isReactComponent);
    }
    function _n(t, e) {
      var n = t.alternate;
      return n === null ? (n = Ue(t.tag, e, t.key, t.mode), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 65011712, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : {
        lanes: e.lanes,
        firstContext: e.firstContext
      }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
    }
    function Ch(t, e) {
      t.flags &= 65011714;
      var n = t.alternate;
      return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
        lanes: e.lanes,
        firstContext: e.firstContext
      }), t;
    }
    function bs(t, e, n, l, u, o) {
      var d = 0;
      if (l = t, typeof t == "function") Au(t) && (d = 1);
      else if (typeof t == "string") d = fb(t, n, J.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
      else t: switch (t) {
        case zt:
          return t = Ue(31, n, e, u), t.elementType = zt, t.lanes = o, t;
        case L:
          return zi(n.children, u, o, e);
        case H:
          d = 8, u |= 24;
          break;
        case B:
          return t = Ue(12, n, e, u | 2), t.elementType = B, t.lanes = o, t;
        case I:
          return t = Ue(13, n, e, u), t.elementType = I, t.lanes = o, t;
        case ft:
          return t = Ue(19, n, e, u), t.elementType = ft, t.lanes = o, t;
        default:
          if (typeof t == "object" && t !== null) switch (t.$$typeof) {
            case G:
              d = 10;
              break t;
            case k:
              d = 9;
              break t;
            case Q:
              d = 11;
              break t;
            case et:
              d = 14;
              break t;
            case nt:
              d = 16, l = null;
              break t;
          }
          d = 29, n = Error(r(130, t === null ? "null" : typeof t, "")), l = null;
      }
      return e = Ue(d, n, e, u), e.elementType = t, e.type = l, e.lanes = o, e;
    }
    function zi(t, e, n, l) {
      return t = Ue(7, t, l, e), t.lanes = n, t;
    }
    function Eu(t, e, n) {
      return t = Ue(6, t, null, e), t.lanes = n, t;
    }
    function wh(t) {
      var e = Ue(18, null, null, 0);
      return e.stateNode = t, e;
    }
    function _u(t, e, n) {
      return e = Ue(4, t.children !== null ? t.children : [], t.key, e), e.lanes = n, e.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation
      }, e;
    }
    var Rh = /* @__PURE__ */ new WeakMap();
    function Ze(t, e) {
      if (typeof t == "object" && t !== null) {
        var n = Rh.get(t);
        return n !== void 0 ? n : (e = {
          value: t,
          source: e,
          stack: Tt(e)
        }, Rh.set(t, e), e);
      }
      return {
        value: t,
        source: e,
        stack: Tt(e)
      };
    }
    var ua = [], oa = 0, Ss = null, il = 0, Pe = [], Je = 0, Kn = null, hn = 1, dn = "";
    function Mn(t, e) {
      ua[oa++] = il, ua[oa++] = Ss, Ss = t, il = e;
    }
    function Oh(t, e, n) {
      Pe[Je++] = hn, Pe[Je++] = dn, Pe[Je++] = Kn, Kn = t;
      var l = hn;
      t = dn;
      var u = 32 - je(l) - 1;
      l &= ~(1 << u), n += 1;
      var o = 32 - je(e) + u;
      if (30 < o) {
        var d = u - u % 5;
        o = (l & (1 << d) - 1).toString(32), l >>= d, u -= d, hn = 1 << 32 - je(e) + u | n << u | l, dn = o + t;
      } else hn = 1 << o | n << u | l, dn = t;
    }
    function Mu(t) {
      t.return !== null && (Mn(t, 1), Oh(t, 1, 0));
    }
    function Du(t) {
      for (; t === Ss; ) Ss = ua[--oa], ua[oa] = null, il = ua[--oa], ua[oa] = null;
      for (; t === Kn; ) Kn = Pe[--Je], Pe[Je] = null, dn = Pe[--Je], Pe[Je] = null, hn = Pe[--Je], Pe[Je] = null;
    }
    function Nh(t, e) {
      Pe[Je++] = hn, Pe[Je++] = dn, Pe[Je++] = Kn, hn = e.id, dn = e.overflow, Kn = t;
    }
    var he = null, Ht = null, bt = false, Qn = null, Fe = false, zu = Error(r(519));
    function Zn(t) {
      var e = Error(r(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
      throw al(Ze(e, t)), zu;
    }
    function jh(t) {
      var e = t.stateNode, n = t.type, l = t.memoizedProps;
      switch (e[fe] = t, e[Me] = l, n) {
        case "dialog":
          yt("cancel", e), yt("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          yt("load", e);
          break;
        case "video":
        case "audio":
          for (n = 0; n < Ml.length; n++) yt(Ml[n], e);
          break;
        case "source":
          yt("error", e);
          break;
        case "img":
        case "image":
        case "link":
          yt("error", e), yt("load", e);
          break;
        case "details":
          yt("toggle", e);
          break;
        case "input":
          yt("invalid", e), Zf(e, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, true);
          break;
        case "select":
          yt("invalid", e);
          break;
        case "textarea":
          yt("invalid", e), Jf(e, l.value, l.defaultValue, l.children);
      }
      n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || l.suppressHydrationWarning === true || Wm(e.textContent, n) ? (l.popover != null && (yt("beforetoggle", e), yt("toggle", e)), l.onScroll != null && yt("scroll", e), l.onScrollEnd != null && yt("scrollend", e), l.onClick != null && (e.onclick = An), e = true) : e = false, e || Zn(t, true);
    }
    function Vh(t) {
      for (he = t.return; he; ) switch (he.tag) {
        case 5:
        case 31:
        case 13:
          Fe = false;
          return;
        case 27:
        case 3:
          Fe = true;
          return;
        default:
          he = he.return;
      }
    }
    function ca(t) {
      if (t !== he) return false;
      if (!bt) return Vh(t), bt = true, false;
      var e = t.tag, n;
      if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || Zo(t.type, t.memoizedProps)), n = !n), n && Ht && Zn(t), Vh(t), e === 13) {
        if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
        Ht = sp(t);
      } else if (e === 31) {
        if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
        Ht = sp(t);
      } else e === 27 ? (e = Ht, ri(t.type) ? (t = $o, $o = null, Ht = t) : Ht = e) : Ht = he ? $e(t.stateNode.nextSibling) : null;
      return true;
    }
    function Ci() {
      Ht = he = null, bt = false;
    }
    function Cu() {
      var t = Qn;
      return t !== null && (Re === null ? Re = t : Re.push.apply(Re, t), Qn = null), t;
    }
    function al(t) {
      Qn === null ? Qn = [
        t
      ] : Qn.push(t);
    }
    var wu = S(null), wi = null, Dn = null;
    function Pn(t, e, n) {
      X(wu, e._currentValue), e._currentValue = n;
    }
    function zn(t) {
      t._currentValue = wu.current, V(wu);
    }
    function Ru(t, e, n) {
      for (; t !== null; ) {
        var l = t.alternate;
        if ((t.childLanes & e) !== e ? (t.childLanes |= e, l !== null && (l.childLanes |= e)) : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e), t === n) break;
        t = t.return;
      }
    }
    function Ou(t, e, n, l) {
      var u = t.child;
      for (u !== null && (u.return = t); u !== null; ) {
        var o = u.dependencies;
        if (o !== null) {
          var d = u.child;
          o = o.firstContext;
          t: for (; o !== null; ) {
            var g = o;
            o = u;
            for (var x = 0; x < e.length; x++) if (g.context === e[x]) {
              o.lanes |= n, g = o.alternate, g !== null && (g.lanes |= n), Ru(o.return, n, t), l || (d = null);
              break t;
            }
            o = g.next;
          }
        } else if (u.tag === 18) {
          if (d = u.return, d === null) throw Error(r(341));
          d.lanes |= n, o = d.alternate, o !== null && (o.lanes |= n), Ru(d, n, t), d = null;
        } else d = u.child;
        if (d !== null) d.return = u;
        else for (d = u; d !== null; ) {
          if (d === t) {
            d = null;
            break;
          }
          if (u = d.sibling, u !== null) {
            u.return = d.return, d = u;
            break;
          }
          d = d.return;
        }
        u = d;
      }
    }
    function fa(t, e, n, l) {
      t = null;
      for (var u = e, o = false; u !== null; ) {
        if (!o) {
          if ((u.flags & 524288) !== 0) o = true;
          else if ((u.flags & 262144) !== 0) break;
        }
        if (u.tag === 10) {
          var d = u.alternate;
          if (d === null) throw Error(r(387));
          if (d = d.memoizedProps, d !== null) {
            var g = u.type;
            Ve(u.pendingProps.value, d.value) || (t !== null ? t.push(g) : t = [
              g
            ]);
          }
        } else if (u === xt.current) {
          if (d = u.alternate, d === null) throw Error(r(387));
          d.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(Rl) : t = [
            Rl
          ]);
        }
        u = u.return;
      }
      t !== null && Ou(e, t, n, l), e.flags |= 262144;
    }
    function xs(t) {
      for (t = t.firstContext; t !== null; ) {
        if (!Ve(t.context._currentValue, t.memoizedValue)) return true;
        t = t.next;
      }
      return false;
    }
    function Ri(t) {
      wi = t, Dn = null, t = t.dependencies, t !== null && (t.firstContext = null);
    }
    function de(t) {
      return Uh(wi, t);
    }
    function Ts(t, e) {
      return wi === null && Ri(t), Uh(t, e);
    }
    function Uh(t, e) {
      var n = e._currentValue;
      if (e = {
        context: e,
        memoizedValue: n,
        next: null
      }, Dn === null) {
        if (t === null) throw Error(r(308));
        Dn = e, t.dependencies = {
          lanes: 0,
          firstContext: e
        }, t.flags |= 524288;
      } else Dn = Dn.next = e;
      return n;
    }
    var r1 = typeof AbortController < "u" ? AbortController : function() {
      var t = [], e = this.signal = {
        aborted: false,
        addEventListener: function(n, l) {
          t.push(l);
        }
      };
      this.abort = function() {
        e.aborted = true, t.forEach(function(n) {
          return n();
        });
      };
    }, u1 = i.unstable_scheduleCallback, o1 = i.unstable_NormalPriority, It = {
      $$typeof: G,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function Nu() {
      return {
        controller: new r1(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function ll(t) {
      t.refCount--, t.refCount === 0 && u1(o1, function() {
        t.controller.abort();
      });
    }
    var sl = null, ju = 0, ha = 0, da = null;
    function c1(t, e) {
      if (sl === null) {
        var n = sl = [];
        ju = 0, ha = Bo(), da = {
          status: "pending",
          value: void 0,
          then: function(l) {
            n.push(l);
          }
        };
      }
      return ju++, e.then(Lh, Lh), e;
    }
    function Lh() {
      if (--ju === 0 && sl !== null) {
        da !== null && (da.status = "fulfilled");
        var t = sl;
        sl = null, ha = 0, da = null;
        for (var e = 0; e < t.length; e++) (0, t[e])();
      }
    }
    function f1(t, e) {
      var n = [], l = {
        status: "pending",
        value: null,
        reason: null,
        then: function(u) {
          n.push(u);
        }
      };
      return t.then(function() {
        l.status = "fulfilled", l.value = e;
        for (var u = 0; u < n.length; u++) (0, n[u])(e);
      }, function(u) {
        for (l.status = "rejected", l.reason = u, u = 0; u < n.length; u++) (0, n[u])(void 0);
      }), l;
    }
    var Bh = O.S;
    O.S = function(t, e) {
      xm = $t(), typeof e == "object" && e !== null && typeof e.then == "function" && c1(t, e), Bh !== null && Bh(t, e);
    };
    var Oi = S(null);
    function Vu() {
      var t = Oi.current;
      return t !== null ? t : Ut.pooledCache;
    }
    function As(t, e) {
      e === null ? X(Oi, Oi.current) : X(Oi, e.pool);
    }
    function Hh() {
      var t = Vu();
      return t === null ? null : {
        parent: It._currentValue,
        pool: t
      };
    }
    var ma = Error(r(460)), Uu = Error(r(474)), Es = Error(r(542)), _s = {
      then: function() {
      }
    };
    function Gh(t) {
      return t = t.status, t === "fulfilled" || t === "rejected";
    }
    function qh(t, e, n) {
      switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(An, An), e = n), e.status) {
        case "fulfilled":
          return e.value;
        case "rejected":
          throw t = e.reason, kh(t), t;
        default:
          if (typeof e.status == "string") e.then(An, An);
          else {
            if (t = Ut, t !== null && 100 < t.shellSuspendCounter) throw Error(r(482));
            t = e, t.status = "pending", t.then(function(l) {
              if (e.status === "pending") {
                var u = e;
                u.status = "fulfilled", u.value = l;
              }
            }, function(l) {
              if (e.status === "pending") {
                var u = e;
                u.status = "rejected", u.reason = l;
              }
            });
          }
          switch (e.status) {
            case "fulfilled":
              return e.value;
            case "rejected":
              throw t = e.reason, kh(t), t;
          }
          throw ji = e, ma;
      }
    }
    function Ni(t) {
      try {
        var e = t._init;
        return e(t._payload);
      } catch (n) {
        throw n !== null && typeof n == "object" && typeof n.then == "function" ? (ji = n, ma) : n;
      }
    }
    var ji = null;
    function Yh() {
      if (ji === null) throw Error(r(459));
      var t = ji;
      return ji = null, t;
    }
    function kh(t) {
      if (t === ma || t === Es) throw Error(r(483));
    }
    var pa = null, rl = 0;
    function Ms(t) {
      var e = rl;
      return rl += 1, pa === null && (pa = []), qh(pa, t, e);
    }
    function ul(t, e) {
      e = e.props.ref, t.ref = e !== void 0 ? e : null;
    }
    function Ds(t, e) {
      throw e.$$typeof === T ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(r(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t)));
    }
    function Xh(t) {
      function e(E, A) {
        if (t) {
          var M = E.deletions;
          M === null ? (E.deletions = [
            A
          ], E.flags |= 16) : M.push(A);
        }
      }
      function n(E, A) {
        if (!t) return null;
        for (; A !== null; ) e(E, A), A = A.sibling;
        return null;
      }
      function l(E) {
        for (var A = /* @__PURE__ */ new Map(); E !== null; ) E.key !== null ? A.set(E.key, E) : A.set(E.index, E), E = E.sibling;
        return A;
      }
      function u(E, A) {
        return E = _n(E, A), E.index = 0, E.sibling = null, E;
      }
      function o(E, A, M) {
        return E.index = M, t ? (M = E.alternate, M !== null ? (M = M.index, M < A ? (E.flags |= 67108866, A) : M) : (E.flags |= 67108866, A)) : (E.flags |= 1048576, A);
      }
      function d(E) {
        return t && E.alternate === null && (E.flags |= 67108866), E;
      }
      function g(E, A, M, j) {
        return A === null || A.tag !== 6 ? (A = Eu(M, E.mode, j), A.return = E, A) : (A = u(A, M), A.return = E, A);
      }
      function x(E, A, M, j) {
        var tt = M.type;
        return tt === L ? N(E, A, M.props.children, j, M.key) : A !== null && (A.elementType === tt || typeof tt == "object" && tt !== null && tt.$$typeof === nt && Ni(tt) === A.type) ? (A = u(A, M.props), ul(A, M), A.return = E, A) : (A = bs(M.type, M.key, M.props, null, E.mode, j), ul(A, M), A.return = E, A);
      }
      function D(E, A, M, j) {
        return A === null || A.tag !== 4 || A.stateNode.containerInfo !== M.containerInfo || A.stateNode.implementation !== M.implementation ? (A = _u(M, E.mode, j), A.return = E, A) : (A = u(A, M.children || []), A.return = E, A);
      }
      function N(E, A, M, j, tt) {
        return A === null || A.tag !== 7 ? (A = zi(M, E.mode, j, tt), A.return = E, A) : (A = u(A, M), A.return = E, A);
      }
      function U(E, A, M) {
        if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint") return A = Eu("" + A, E.mode, M), A.return = E, A;
        if (typeof A == "object" && A !== null) {
          switch (A.$$typeof) {
            case w:
              return M = bs(A.type, A.key, A.props, null, E.mode, M), ul(M, A), M.return = E, M;
            case C:
              return A = _u(A, E.mode, M), A.return = E, A;
            case nt:
              return A = Ni(A), U(E, A, M);
          }
          if (kt(A) || At(A)) return A = zi(A, E.mode, M, null), A.return = E, A;
          if (typeof A.then == "function") return U(E, Ms(A), M);
          if (A.$$typeof === G) return U(E, Ts(E, A), M);
          Ds(E, A);
        }
        return null;
      }
      function z(E, A, M, j) {
        var tt = A !== null ? A.key : null;
        if (typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint") return tt !== null ? null : g(E, A, "" + M, j);
        if (typeof M == "object" && M !== null) {
          switch (M.$$typeof) {
            case w:
              return M.key === tt ? x(E, A, M, j) : null;
            case C:
              return M.key === tt ? D(E, A, M, j) : null;
            case nt:
              return M = Ni(M), z(E, A, M, j);
          }
          if (kt(M) || At(M)) return tt !== null ? null : N(E, A, M, j, null);
          if (typeof M.then == "function") return z(E, A, Ms(M), j);
          if (M.$$typeof === G) return z(E, A, Ts(E, M), j);
          Ds(E, M);
        }
        return null;
      }
      function R(E, A, M, j, tt) {
        if (typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint") return E = E.get(M) || null, g(A, E, "" + j, tt);
        if (typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case w:
              return E = E.get(j.key === null ? M : j.key) || null, x(A, E, j, tt);
            case C:
              return E = E.get(j.key === null ? M : j.key) || null, D(A, E, j, tt);
            case nt:
              return j = Ni(j), R(E, A, M, j, tt);
          }
          if (kt(j) || At(j)) return E = E.get(M) || null, N(A, E, j, tt, null);
          if (typeof j.then == "function") return R(E, A, M, Ms(j), tt);
          if (j.$$typeof === G) return R(E, A, M, Ts(A, j), tt);
          Ds(A, j);
        }
        return null;
      }
      function P(E, A, M, j) {
        for (var tt = null, Et = null, W = A, ct = A = 0, vt = null; W !== null && ct < M.length; ct++) {
          W.index > ct ? (vt = W, W = null) : vt = W.sibling;
          var _t = z(E, W, M[ct], j);
          if (_t === null) {
            W === null && (W = vt);
            break;
          }
          t && W && _t.alternate === null && e(E, W), A = o(_t, A, ct), Et === null ? tt = _t : Et.sibling = _t, Et = _t, W = vt;
        }
        if (ct === M.length) return n(E, W), bt && Mn(E, ct), tt;
        if (W === null) {
          for (; ct < M.length; ct++) W = U(E, M[ct], j), W !== null && (A = o(W, A, ct), Et === null ? tt = W : Et.sibling = W, Et = W);
          return bt && Mn(E, ct), tt;
        }
        for (W = l(W); ct < M.length; ct++) vt = R(W, E, ct, M[ct], j), vt !== null && (t && vt.alternate !== null && W.delete(vt.key === null ? ct : vt.key), A = o(vt, A, ct), Et === null ? tt = vt : Et.sibling = vt, Et = vt);
        return t && W.forEach(function(hi) {
          return e(E, hi);
        }), bt && Mn(E, ct), tt;
      }
      function at(E, A, M, j) {
        if (M == null) throw Error(r(151));
        for (var tt = null, Et = null, W = A, ct = A = 0, vt = null, _t = M.next(); W !== null && !_t.done; ct++, _t = M.next()) {
          W.index > ct ? (vt = W, W = null) : vt = W.sibling;
          var hi = z(E, W, _t.value, j);
          if (hi === null) {
            W === null && (W = vt);
            break;
          }
          t && W && hi.alternate === null && e(E, W), A = o(hi, A, ct), Et === null ? tt = hi : Et.sibling = hi, Et = hi, W = vt;
        }
        if (_t.done) return n(E, W), bt && Mn(E, ct), tt;
        if (W === null) {
          for (; !_t.done; ct++, _t = M.next()) _t = U(E, _t.value, j), _t !== null && (A = o(_t, A, ct), Et === null ? tt = _t : Et.sibling = _t, Et = _t);
          return bt && Mn(E, ct), tt;
        }
        for (W = l(W); !_t.done; ct++, _t = M.next()) _t = R(W, E, ct, _t.value, j), _t !== null && (t && _t.alternate !== null && W.delete(_t.key === null ? ct : _t.key), A = o(_t, A, ct), Et === null ? tt = _t : Et.sibling = _t, Et = _t);
        return t && W.forEach(function(Tb) {
          return e(E, Tb);
        }), bt && Mn(E, ct), tt;
      }
      function Nt(E, A, M, j) {
        if (typeof M == "object" && M !== null && M.type === L && M.key === null && (M = M.props.children), typeof M == "object" && M !== null) {
          switch (M.$$typeof) {
            case w:
              t: {
                for (var tt = M.key; A !== null; ) {
                  if (A.key === tt) {
                    if (tt = M.type, tt === L) {
                      if (A.tag === 7) {
                        n(E, A.sibling), j = u(A, M.props.children), j.return = E, E = j;
                        break t;
                      }
                    } else if (A.elementType === tt || typeof tt == "object" && tt !== null && tt.$$typeof === nt && Ni(tt) === A.type) {
                      n(E, A.sibling), j = u(A, M.props), ul(j, M), j.return = E, E = j;
                      break t;
                    }
                    n(E, A);
                    break;
                  } else e(E, A);
                  A = A.sibling;
                }
                M.type === L ? (j = zi(M.props.children, E.mode, j, M.key), j.return = E, E = j) : (j = bs(M.type, M.key, M.props, null, E.mode, j), ul(j, M), j.return = E, E = j);
              }
              return d(E);
            case C:
              t: {
                for (tt = M.key; A !== null; ) {
                  if (A.key === tt) if (A.tag === 4 && A.stateNode.containerInfo === M.containerInfo && A.stateNode.implementation === M.implementation) {
                    n(E, A.sibling), j = u(A, M.children || []), j.return = E, E = j;
                    break t;
                  } else {
                    n(E, A);
                    break;
                  }
                  else e(E, A);
                  A = A.sibling;
                }
                j = _u(M, E.mode, j), j.return = E, E = j;
              }
              return d(E);
            case nt:
              return M = Ni(M), Nt(E, A, M, j);
          }
          if (kt(M)) return P(E, A, M, j);
          if (At(M)) {
            if (tt = At(M), typeof tt != "function") throw Error(r(150));
            return M = tt.call(M), at(E, A, M, j);
          }
          if (typeof M.then == "function") return Nt(E, A, Ms(M), j);
          if (M.$$typeof === G) return Nt(E, A, Ts(E, M), j);
          Ds(E, M);
        }
        return typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint" ? (M = "" + M, A !== null && A.tag === 6 ? (n(E, A.sibling), j = u(A, M), j.return = E, E = j) : (n(E, A), j = Eu(M, E.mode, j), j.return = E, E = j), d(E)) : n(E, A);
      }
      return function(E, A, M, j) {
        try {
          rl = 0;
          var tt = Nt(E, A, M, j);
          return pa = null, tt;
        } catch (W) {
          if (W === ma || W === Es) throw W;
          var Et = Ue(29, W, null, E.mode);
          return Et.lanes = j, Et.return = E, Et;
        } finally {
        }
      };
    }
    var Vi = Xh(true), Kh = Xh(false), Jn = false;
    function Lu(t) {
      t.updateQueue = {
        baseState: t.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          lanes: 0,
          hiddenCallbacks: null
        },
        callbacks: null
      };
    }
    function Bu(t, e) {
      t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
        baseState: t.baseState,
        firstBaseUpdate: t.firstBaseUpdate,
        lastBaseUpdate: t.lastBaseUpdate,
        shared: t.shared,
        callbacks: null
      });
    }
    function Fn(t) {
      return {
        lane: t,
        tag: 0,
        payload: null,
        callback: null,
        next: null
      };
    }
    function Wn(t, e, n) {
      var l = t.updateQueue;
      if (l === null) return null;
      if (l = l.shared, (Dt & 2) !== 0) {
        var u = l.pending;
        return u === null ? e.next = e : (e.next = u.next, u.next = e), l.pending = e, e = vs(t), zh(t, null, n), e;
      }
      return gs(t, l, e, n), vs(t);
    }
    function ol(t, e, n) {
      if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
        var l = e.lanes;
        l &= t.pendingLanes, n |= l, e.lanes = n, Uf(t, n);
      }
    }
    function Hu(t, e) {
      var n = t.updateQueue, l = t.alternate;
      if (l !== null && (l = l.updateQueue, n === l)) {
        var u = null, o = null;
        if (n = n.firstBaseUpdate, n !== null) {
          do {
            var d = {
              lane: n.lane,
              tag: n.tag,
              payload: n.payload,
              callback: null,
              next: null
            };
            o === null ? u = o = d : o = o.next = d, n = n.next;
          } while (n !== null);
          o === null ? u = o = e : o = o.next = e;
        } else u = o = e;
        n = {
          baseState: l.baseState,
          firstBaseUpdate: u,
          lastBaseUpdate: o,
          shared: l.shared,
          callbacks: l.callbacks
        }, t.updateQueue = n;
        return;
      }
      t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
    }
    var Gu = false;
    function cl() {
      if (Gu) {
        var t = da;
        if (t !== null) throw t;
      }
    }
    function fl(t, e, n, l) {
      Gu = false;
      var u = t.updateQueue;
      Jn = false;
      var o = u.firstBaseUpdate, d = u.lastBaseUpdate, g = u.shared.pending;
      if (g !== null) {
        u.shared.pending = null;
        var x = g, D = x.next;
        x.next = null, d === null ? o = D : d.next = D, d = x;
        var N = t.alternate;
        N !== null && (N = N.updateQueue, g = N.lastBaseUpdate, g !== d && (g === null ? N.firstBaseUpdate = D : g.next = D, N.lastBaseUpdate = x));
      }
      if (o !== null) {
        var U = u.baseState;
        d = 0, N = D = x = null, g = o;
        do {
          var z = g.lane & -536870913, R = z !== g.lane;
          if (R ? (gt & z) === z : (l & z) === z) {
            z !== 0 && z === ha && (Gu = true), N !== null && (N = N.next = {
              lane: 0,
              tag: g.tag,
              payload: g.payload,
              callback: null,
              next: null
            });
            t: {
              var P = t, at = g;
              z = e;
              var Nt = n;
              switch (at.tag) {
                case 1:
                  if (P = at.payload, typeof P == "function") {
                    U = P.call(Nt, U, z);
                    break t;
                  }
                  U = P;
                  break t;
                case 3:
                  P.flags = P.flags & -65537 | 128;
                case 0:
                  if (P = at.payload, z = typeof P == "function" ? P.call(Nt, U, z) : P, z == null) break t;
                  U = b({}, U, z);
                  break t;
                case 2:
                  Jn = true;
              }
            }
            z = g.callback, z !== null && (t.flags |= 64, R && (t.flags |= 8192), R = u.callbacks, R === null ? u.callbacks = [
              z
            ] : R.push(z));
          } else R = {
            lane: z,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          }, N === null ? (D = N = R, x = U) : N = N.next = R, d |= z;
          if (g = g.next, g === null) {
            if (g = u.shared.pending, g === null) break;
            R = g, g = R.next, R.next = null, u.lastBaseUpdate = R, u.shared.pending = null;
          }
        } while (true);
        N === null && (x = U), u.baseState = x, u.firstBaseUpdate = D, u.lastBaseUpdate = N, o === null && (u.shared.lanes = 0), ni |= d, t.lanes = d, t.memoizedState = U;
      }
    }
    function Qh(t, e) {
      if (typeof t != "function") throw Error(r(191, t));
      t.call(e);
    }
    function Zh(t, e) {
      var n = t.callbacks;
      if (n !== null) for (t.callbacks = null, t = 0; t < n.length; t++) Qh(n[t], e);
    }
    var ya = S(null), zs = S(0);
    function Ph(t, e) {
      t = Ln, X(zs, t), X(ya, e), Ln = t | e.baseLanes;
    }
    function qu() {
      X(zs, Ln), X(ya, ya.current);
    }
    function Yu() {
      Ln = zs.current, V(ya), V(zs);
    }
    var Le = S(null), We = null;
    function $n(t) {
      var e = t.alternate;
      X(Ft, Ft.current & 1), X(Le, t), We === null && (e === null || ya.current !== null || e.memoizedState !== null) && (We = t);
    }
    function ku(t) {
      X(Ft, Ft.current), X(Le, t), We === null && (We = t);
    }
    function Jh(t) {
      t.tag === 22 ? (X(Ft, Ft.current), X(Le, t), We === null && (We = t)) : In();
    }
    function In() {
      X(Ft, Ft.current), X(Le, Le.current);
    }
    function Be(t) {
      V(Le), We === t && (We = null), V(Ft);
    }
    var Ft = S(0);
    function Cs(t) {
      for (var e = t; e !== null; ) {
        if (e.tag === 13) {
          var n = e.memoizedState;
          if (n !== null && (n = n.dehydrated, n === null || Fo(n) || Wo(n))) return e;
        } else if (e.tag === 19 && (e.memoizedProps.revealOrder === "forwards" || e.memoizedProps.revealOrder === "backwards" || e.memoizedProps.revealOrder === "unstable_legacy-backwards" || e.memoizedProps.revealOrder === "together")) {
          if ((e.flags & 128) !== 0) return e;
        } else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return null;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      return null;
    }
    var Cn = 0, ut = null, Rt = null, te = null, ws = false, ga = false, Ui = false, Rs = 0, hl = 0, va = null, h1 = 0;
    function Zt() {
      throw Error(r(321));
    }
    function Xu(t, e) {
      if (e === null) return false;
      for (var n = 0; n < e.length && n < t.length; n++) if (!Ve(t[n], e[n])) return false;
      return true;
    }
    function Ku(t, e, n, l, u, o) {
      return Cn = o, ut = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, O.H = t === null || t.memoizedState === null ? Od : so, Ui = false, o = n(l, u), Ui = false, ga && (o = Wh(e, n, l, u)), Fh(t), o;
    }
    function Fh(t) {
      O.H = pl;
      var e = Rt !== null && Rt.next !== null;
      if (Cn = 0, te = Rt = ut = null, ws = false, hl = 0, va = null, e) throw Error(r(300));
      t === null || ee || (t = t.dependencies, t !== null && xs(t) && (ee = true));
    }
    function Wh(t, e, n, l) {
      ut = t;
      var u = 0;
      do {
        if (ga && (va = null), hl = 0, ga = false, 25 <= u) throw Error(r(301));
        if (u += 1, te = Rt = null, t.updateQueue != null) {
          var o = t.updateQueue;
          o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
        }
        O.H = Nd, o = e(n, l);
      } while (ga);
      return o;
    }
    function d1() {
      var t = O.H, e = t.useState()[0];
      return e = typeof e.then == "function" ? dl(e) : e, t = t.useState()[0], (Rt !== null ? Rt.memoizedState : null) !== t && (ut.flags |= 1024), e;
    }
    function Qu() {
      var t = Rs !== 0;
      return Rs = 0, t;
    }
    function Zu(t, e, n) {
      e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
    }
    function Pu(t) {
      if (ws) {
        for (t = t.memoizedState; t !== null; ) {
          var e = t.queue;
          e !== null && (e.pending = null), t = t.next;
        }
        ws = false;
      }
      Cn = 0, te = Rt = ut = null, ga = false, hl = Rs = 0, va = null;
    }
    function Se() {
      var t = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return te === null ? ut.memoizedState = te = t : te = te.next = t, te;
    }
    function Wt() {
      if (Rt === null) {
        var t = ut.alternate;
        t = t !== null ? t.memoizedState : null;
      } else t = Rt.next;
      var e = te === null ? ut.memoizedState : te.next;
      if (e !== null) te = e, Rt = t;
      else {
        if (t === null) throw ut.alternate === null ? Error(r(467)) : Error(r(310));
        Rt = t, t = {
          memoizedState: Rt.memoizedState,
          baseState: Rt.baseState,
          baseQueue: Rt.baseQueue,
          queue: Rt.queue,
          next: null
        }, te === null ? ut.memoizedState = te = t : te = te.next = t;
      }
      return te;
    }
    function Os() {
      return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
      };
    }
    function dl(t) {
      var e = hl;
      return hl += 1, va === null && (va = []), t = qh(va, t, e), e = ut, (te === null ? e.memoizedState : te.next) === null && (e = e.alternate, O.H = e === null || e.memoizedState === null ? Od : so), t;
    }
    function Ns(t) {
      if (t !== null && typeof t == "object") {
        if (typeof t.then == "function") return dl(t);
        if (t.$$typeof === G) return de(t);
      }
      throw Error(r(438, String(t)));
    }
    function Ju(t) {
      var e = null, n = ut.updateQueue;
      if (n !== null && (e = n.memoCache), e == null) {
        var l = ut.alternate;
        l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (e = {
          data: l.data.map(function(u) {
            return u.slice();
          }),
          index: 0
        })));
      }
      if (e == null && (e = {
        data: [],
        index: 0
      }), n === null && (n = Os(), ut.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0) for (n = e.data[e.index] = Array(t), l = 0; l < t; l++) n[l] = it;
      return e.index++, n;
    }
    function wn(t, e) {
      return typeof e == "function" ? e(t) : e;
    }
    function js(t) {
      var e = Wt();
      return Fu(e, Rt, t);
    }
    function Fu(t, e, n) {
      var l = t.queue;
      if (l === null) throw Error(r(311));
      l.lastRenderedReducer = n;
      var u = t.baseQueue, o = l.pending;
      if (o !== null) {
        if (u !== null) {
          var d = u.next;
          u.next = o.next, o.next = d;
        }
        e.baseQueue = u = o, l.pending = null;
      }
      if (o = t.baseState, u === null) t.memoizedState = o;
      else {
        e = u.next;
        var g = d = null, x = null, D = e, N = false;
        do {
          var U = D.lane & -536870913;
          if (U !== D.lane ? (gt & U) === U : (Cn & U) === U) {
            var z = D.revertLane;
            if (z === 0) x !== null && (x = x.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: D.action,
              hasEagerState: D.hasEagerState,
              eagerState: D.eagerState,
              next: null
            }), U === ha && (N = true);
            else if ((Cn & z) === z) {
              D = D.next, z === ha && (N = true);
              continue;
            } else U = {
              lane: 0,
              revertLane: D.revertLane,
              gesture: null,
              action: D.action,
              hasEagerState: D.hasEagerState,
              eagerState: D.eagerState,
              next: null
            }, x === null ? (g = x = U, d = o) : x = x.next = U, ut.lanes |= z, ni |= z;
            U = D.action, Ui && n(o, U), o = D.hasEagerState ? D.eagerState : n(o, U);
          } else z = {
            lane: U,
            revertLane: D.revertLane,
            gesture: D.gesture,
            action: D.action,
            hasEagerState: D.hasEagerState,
            eagerState: D.eagerState,
            next: null
          }, x === null ? (g = x = z, d = o) : x = x.next = z, ut.lanes |= U, ni |= U;
          D = D.next;
        } while (D !== null && D !== e);
        if (x === null ? d = o : x.next = g, !Ve(o, t.memoizedState) && (ee = true, N && (n = da, n !== null))) throw n;
        t.memoizedState = o, t.baseState = d, t.baseQueue = x, l.lastRenderedState = o;
      }
      return u === null && (l.lanes = 0), [
        t.memoizedState,
        l.dispatch
      ];
    }
    function Wu(t) {
      var e = Wt(), n = e.queue;
      if (n === null) throw Error(r(311));
      n.lastRenderedReducer = t;
      var l = n.dispatch, u = n.pending, o = e.memoizedState;
      if (u !== null) {
        n.pending = null;
        var d = u = u.next;
        do
          o = t(o, d.action), d = d.next;
        while (d !== u);
        Ve(o, e.memoizedState) || (ee = true), e.memoizedState = o, e.baseQueue === null && (e.baseState = o), n.lastRenderedState = o;
      }
      return [
        o,
        l
      ];
    }
    function $h(t, e, n) {
      var l = ut, u = Wt(), o = bt;
      if (o) {
        if (n === void 0) throw Error(r(407));
        n = n();
      } else n = e();
      var d = !Ve((Rt || u).memoizedState, n);
      if (d && (u.memoizedState = n, ee = true), u = u.queue, to(ed.bind(null, l, u, t), [
        t
      ]), u.getSnapshot !== e || d || te !== null && te.memoizedState.tag & 1) {
        if (l.flags |= 2048, ba(9, {
          destroy: void 0
        }, td.bind(null, l, u, n, e), null), Ut === null) throw Error(r(349));
        o || (Cn & 127) !== 0 || Ih(l, e, n);
      }
      return n;
    }
    function Ih(t, e, n) {
      t.flags |= 16384, t = {
        getSnapshot: e,
        value: n
      }, e = ut.updateQueue, e === null ? (e = Os(), ut.updateQueue = e, e.stores = [
        t
      ]) : (n = e.stores, n === null ? e.stores = [
        t
      ] : n.push(t));
    }
    function td(t, e, n, l) {
      e.value = n, e.getSnapshot = l, nd(e) && id(t);
    }
    function ed(t, e, n) {
      return n(function() {
        nd(e) && id(t);
      });
    }
    function nd(t) {
      var e = t.getSnapshot;
      t = t.value;
      try {
        var n = e();
        return !Ve(t, n);
      } catch {
        return true;
      }
    }
    function id(t) {
      var e = Di(t, 2);
      e !== null && Oe(e, t, 2);
    }
    function $u(t) {
      var e = Se();
      if (typeof t == "function") {
        var n = t;
        if (t = n(), Ui) {
          Yn(true);
          try {
            n();
          } finally {
            Yn(false);
          }
        }
      }
      return e.memoizedState = e.baseState = t, e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: wn,
        lastRenderedState: t
      }, e;
    }
    function ad(t, e, n, l) {
      return t.baseState = n, Fu(t, Rt, typeof l == "function" ? l : wn);
    }
    function m1(t, e, n, l, u) {
      if (Ls(t)) throw Error(r(485));
      if (t = e.action, t !== null) {
        var o = {
          payload: u,
          action: t,
          next: null,
          isTransition: true,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(d) {
            o.listeners.push(d);
          }
        };
        O.T !== null ? n(true) : o.isTransition = false, l(o), n = e.pending, n === null ? (o.next = e.pending = o, ld(e, o)) : (o.next = n.next, e.pending = n.next = o);
      }
    }
    function ld(t, e) {
      var n = e.action, l = e.payload, u = t.state;
      if (e.isTransition) {
        var o = O.T, d = {};
        O.T = d;
        try {
          var g = n(u, l), x = O.S;
          x !== null && x(d, g), sd(t, e, g);
        } catch (D) {
          Iu(t, e, D);
        } finally {
          o !== null && d.types !== null && (o.types = d.types), O.T = o;
        }
      } else try {
        o = n(u, l), sd(t, e, o);
      } catch (D) {
        Iu(t, e, D);
      }
    }
    function sd(t, e, n) {
      n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(function(l) {
        rd(t, e, l);
      }, function(l) {
        return Iu(t, e, l);
      }) : rd(t, e, n);
    }
    function rd(t, e, n) {
      e.status = "fulfilled", e.value = n, ud(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, ld(t, n)));
    }
    function Iu(t, e, n) {
      var l = t.pending;
      if (t.pending = null, l !== null) {
        l = l.next;
        do
          e.status = "rejected", e.reason = n, ud(e), e = e.next;
        while (e !== l);
      }
      t.action = null;
    }
    function ud(t) {
      t = t.listeners;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
    function od(t, e) {
      return e;
    }
    function cd(t, e) {
      if (bt) {
        var n = Ut.formState;
        if (n !== null) {
          t: {
            var l = ut;
            if (bt) {
              if (Ht) {
                e: {
                  for (var u = Ht, o = Fe; u.nodeType !== 8; ) {
                    if (!o) {
                      u = null;
                      break e;
                    }
                    if (u = $e(u.nextSibling), u === null) {
                      u = null;
                      break e;
                    }
                  }
                  o = u.data, u = o === "F!" || o === "F" ? u : null;
                }
                if (u) {
                  Ht = $e(u.nextSibling), l = u.data === "F!";
                  break t;
                }
              }
              Zn(l);
            }
            l = false;
          }
          l && (e = n[0]);
        }
      }
      return n = Se(), n.memoizedState = n.baseState = e, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: od,
        lastRenderedState: e
      }, n.queue = l, n = Cd.bind(null, ut, l), l.dispatch = n, l = $u(false), o = lo.bind(null, ut, false, l.queue), l = Se(), u = {
        state: e,
        dispatch: null,
        action: t,
        pending: null
      }, l.queue = u, n = m1.bind(null, ut, u, o, n), u.dispatch = n, l.memoizedState = t, [
        e,
        n,
        false
      ];
    }
    function fd(t) {
      var e = Wt();
      return hd(e, Rt, t);
    }
    function hd(t, e, n) {
      if (e = Fu(t, e, od)[0], t = js(wn)[0], typeof e == "object" && e !== null && typeof e.then == "function") try {
        var l = dl(e);
      } catch (d) {
        throw d === ma ? Es : d;
      }
      else l = e;
      e = Wt();
      var u = e.queue, o = u.dispatch;
      return n !== e.memoizedState && (ut.flags |= 2048, ba(9, {
        destroy: void 0
      }, p1.bind(null, u, n), null)), [
        l,
        o,
        t
      ];
    }
    function p1(t, e) {
      t.action = e;
    }
    function dd(t) {
      var e = Wt(), n = Rt;
      if (n !== null) return hd(e, n, t);
      Wt(), e = e.memoizedState, n = Wt();
      var l = n.queue.dispatch;
      return n.memoizedState = t, [
        e,
        l,
        false
      ];
    }
    function ba(t, e, n, l) {
      return t = {
        tag: t,
        create: n,
        deps: l,
        inst: e,
        next: null
      }, e = ut.updateQueue, e === null && (e = Os(), ut.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (l = n.next, n.next = t, t.next = l, e.lastEffect = t), t;
    }
    function md() {
      return Wt().memoizedState;
    }
    function Vs(t, e, n, l) {
      var u = Se();
      ut.flags |= t, u.memoizedState = ba(1 | e, {
        destroy: void 0
      }, n, l === void 0 ? null : l);
    }
    function Us(t, e, n, l) {
      var u = Wt();
      l = l === void 0 ? null : l;
      var o = u.memoizedState.inst;
      Rt !== null && l !== null && Xu(l, Rt.memoizedState.deps) ? u.memoizedState = ba(e, o, n, l) : (ut.flags |= t, u.memoizedState = ba(1 | e, o, n, l));
    }
    function pd(t, e) {
      Vs(8390656, 8, t, e);
    }
    function to(t, e) {
      Us(2048, 8, t, e);
    }
    function y1(t) {
      ut.flags |= 4;
      var e = ut.updateQueue;
      if (e === null) e = Os(), ut.updateQueue = e, e.events = [
        t
      ];
      else {
        var n = e.events;
        n === null ? e.events = [
          t
        ] : n.push(t);
      }
    }
    function yd(t) {
      var e = Wt().memoizedState;
      return y1({
        ref: e,
        nextImpl: t
      }), function() {
        if ((Dt & 2) !== 0) throw Error(r(440));
        return e.impl.apply(void 0, arguments);
      };
    }
    function gd(t, e) {
      return Us(4, 2, t, e);
    }
    function vd(t, e) {
      return Us(4, 4, t, e);
    }
    function bd(t, e) {
      if (typeof e == "function") {
        t = t();
        var n = e(t);
        return function() {
          typeof n == "function" ? n() : e(null);
        };
      }
      if (e != null) return t = t(), e.current = t, function() {
        e.current = null;
      };
    }
    function Sd(t, e, n) {
      n = n != null ? n.concat([
        t
      ]) : null, Us(4, 4, bd.bind(null, e, t), n);
    }
    function eo() {
    }
    function xd(t, e) {
      var n = Wt();
      e = e === void 0 ? null : e;
      var l = n.memoizedState;
      return e !== null && Xu(e, l[1]) ? l[0] : (n.memoizedState = [
        t,
        e
      ], t);
    }
    function Td(t, e) {
      var n = Wt();
      e = e === void 0 ? null : e;
      var l = n.memoizedState;
      if (e !== null && Xu(e, l[1])) return l[0];
      if (l = t(), Ui) {
        Yn(true);
        try {
          t();
        } finally {
          Yn(false);
        }
      }
      return n.memoizedState = [
        l,
        e
      ], l;
    }
    function no(t, e, n) {
      return n === void 0 || (Cn & 1073741824) !== 0 && (gt & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = Am(), ut.lanes |= t, ni |= t, n);
    }
    function Ad(t, e, n, l) {
      return Ve(n, e) ? n : ya.current !== null ? (t = no(t, n, l), Ve(t, e) || (ee = true), t) : (Cn & 42) === 0 || (Cn & 1073741824) !== 0 && (gt & 261930) === 0 ? (ee = true, t.memoizedState = n) : (t = Am(), ut.lanes |= t, ni |= t, e);
    }
    function Ed(t, e, n, l, u) {
      var o = Y.p;
      Y.p = o !== 0 && 8 > o ? o : 8;
      var d = O.T, g = {};
      O.T = g, lo(t, false, e, n);
      try {
        var x = u(), D = O.S;
        if (D !== null && D(g, x), x !== null && typeof x == "object" && typeof x.then == "function") {
          var N = f1(x, l);
          ml(t, e, N, qe(t));
        } else ml(t, e, l, qe(t));
      } catch (U) {
        ml(t, e, {
          then: function() {
          },
          status: "rejected",
          reason: U
        }, qe());
      } finally {
        Y.p = o, d !== null && g.types !== null && (d.types = g.types), O.T = d;
      }
    }
    function g1() {
    }
    function io(t, e, n, l) {
      if (t.tag !== 5) throw Error(r(476));
      var u = _d(t).queue;
      Ed(t, u, e, K, n === null ? g1 : function() {
        return Md(t), n(l);
      });
    }
    function _d(t) {
      var e = t.memoizedState;
      if (e !== null) return e;
      e = {
        memoizedState: K,
        baseState: K,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: wn,
          lastRenderedState: K
        },
        next: null
      };
      var n = {};
      return e.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: wn,
          lastRenderedState: n
        },
        next: null
      }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
    }
    function Md(t) {
      var e = _d(t);
      e.next === null && (e = t.alternate.memoizedState), ml(t, e.next.queue, {}, qe());
    }
    function ao() {
      return de(Rl);
    }
    function Dd() {
      return Wt().memoizedState;
    }
    function zd() {
      return Wt().memoizedState;
    }
    function v1(t) {
      for (var e = t.return; e !== null; ) {
        switch (e.tag) {
          case 24:
          case 3:
            var n = qe();
            t = Fn(n);
            var l = Wn(e, t, n);
            l !== null && (Oe(l, e, n), ol(l, e, n)), e = {
              cache: Nu()
            }, t.payload = e;
            return;
        }
        e = e.return;
      }
    }
    function b1(t, e, n) {
      var l = qe();
      n = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, Ls(t) ? wd(e, n) : (n = Tu(t, e, n, l), n !== null && (Oe(n, t, l), Rd(n, e, l)));
    }
    function Cd(t, e, n) {
      var l = qe();
      ml(t, e, n, l);
    }
    function ml(t, e, n, l) {
      var u = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (Ls(t)) wd(e, u);
      else {
        var o = t.alternate;
        if (t.lanes === 0 && (o === null || o.lanes === 0) && (o = e.lastRenderedReducer, o !== null)) try {
          var d = e.lastRenderedState, g = o(d, n);
          if (u.hasEagerState = true, u.eagerState = g, Ve(g, d)) return gs(t, e, u, 0), Ut === null && ys(), false;
        } catch {
        } finally {
        }
        if (n = Tu(t, e, u, l), n !== null) return Oe(n, t, l), Rd(n, e, l), true;
      }
      return false;
    }
    function lo(t, e, n, l) {
      if (l = {
        lane: 2,
        revertLane: Bo(),
        gesture: null,
        action: l,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, Ls(t)) {
        if (e) throw Error(r(479));
      } else e = Tu(t, n, l, 2), e !== null && Oe(e, t, 2);
    }
    function Ls(t) {
      var e = t.alternate;
      return t === ut || e !== null && e === ut;
    }
    function wd(t, e) {
      ga = ws = true;
      var n = t.pending;
      n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
    }
    function Rd(t, e, n) {
      if ((n & 4194048) !== 0) {
        var l = e.lanes;
        l &= t.pendingLanes, n |= l, e.lanes = n, Uf(t, n);
      }
    }
    var pl = {
      readContext: de,
      use: Ns,
      useCallback: Zt,
      useContext: Zt,
      useEffect: Zt,
      useImperativeHandle: Zt,
      useLayoutEffect: Zt,
      useInsertionEffect: Zt,
      useMemo: Zt,
      useReducer: Zt,
      useRef: Zt,
      useState: Zt,
      useDebugValue: Zt,
      useDeferredValue: Zt,
      useTransition: Zt,
      useSyncExternalStore: Zt,
      useId: Zt,
      useHostTransitionStatus: Zt,
      useFormState: Zt,
      useActionState: Zt,
      useOptimistic: Zt,
      useMemoCache: Zt,
      useCacheRefresh: Zt
    };
    pl.useEffectEvent = Zt;
    var Od = {
      readContext: de,
      use: Ns,
      useCallback: function(t, e) {
        return Se().memoizedState = [
          t,
          e === void 0 ? null : e
        ], t;
      },
      useContext: de,
      useEffect: pd,
      useImperativeHandle: function(t, e, n) {
        n = n != null ? n.concat([
          t
        ]) : null, Vs(4194308, 4, bd.bind(null, e, t), n);
      },
      useLayoutEffect: function(t, e) {
        return Vs(4194308, 4, t, e);
      },
      useInsertionEffect: function(t, e) {
        Vs(4, 2, t, e);
      },
      useMemo: function(t, e) {
        var n = Se();
        e = e === void 0 ? null : e;
        var l = t();
        if (Ui) {
          Yn(true);
          try {
            t();
          } finally {
            Yn(false);
          }
        }
        return n.memoizedState = [
          l,
          e
        ], l;
      },
      useReducer: function(t, e, n) {
        var l = Se();
        if (n !== void 0) {
          var u = n(e);
          if (Ui) {
            Yn(true);
            try {
              n(e);
            } finally {
              Yn(false);
            }
          }
        } else u = e;
        return l.memoizedState = l.baseState = u, t = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: t,
          lastRenderedState: u
        }, l.queue = t, t = t.dispatch = b1.bind(null, ut, t), [
          l.memoizedState,
          t
        ];
      },
      useRef: function(t) {
        var e = Se();
        return t = {
          current: t
        }, e.memoizedState = t;
      },
      useState: function(t) {
        t = $u(t);
        var e = t.queue, n = Cd.bind(null, ut, e);
        return e.dispatch = n, [
          t.memoizedState,
          n
        ];
      },
      useDebugValue: eo,
      useDeferredValue: function(t, e) {
        var n = Se();
        return no(n, t, e);
      },
      useTransition: function() {
        var t = $u(false);
        return t = Ed.bind(null, ut, t.queue, true, false), Se().memoizedState = t, [
          false,
          t
        ];
      },
      useSyncExternalStore: function(t, e, n) {
        var l = ut, u = Se();
        if (bt) {
          if (n === void 0) throw Error(r(407));
          n = n();
        } else {
          if (n = e(), Ut === null) throw Error(r(349));
          (gt & 127) !== 0 || Ih(l, e, n);
        }
        u.memoizedState = n;
        var o = {
          value: n,
          getSnapshot: e
        };
        return u.queue = o, pd(ed.bind(null, l, o, t), [
          t
        ]), l.flags |= 2048, ba(9, {
          destroy: void 0
        }, td.bind(null, l, o, n, e), null), n;
      },
      useId: function() {
        var t = Se(), e = Ut.identifierPrefix;
        if (bt) {
          var n = dn, l = hn;
          n = (l & ~(1 << 32 - je(l) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = Rs++, 0 < n && (e += "H" + n.toString(32)), e += "_";
        } else n = h1++, e = "_" + e + "r_" + n.toString(32) + "_";
        return t.memoizedState = e;
      },
      useHostTransitionStatus: ao,
      useFormState: cd,
      useActionState: cd,
      useOptimistic: function(t) {
        var e = Se();
        e.memoizedState = e.baseState = t;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return e.queue = n, e = lo.bind(null, ut, true, n), n.dispatch = e, [
          t,
          e
        ];
      },
      useMemoCache: Ju,
      useCacheRefresh: function() {
        return Se().memoizedState = v1.bind(null, ut);
      },
      useEffectEvent: function(t) {
        var e = Se(), n = {
          impl: t
        };
        return e.memoizedState = n, function() {
          if ((Dt & 2) !== 0) throw Error(r(440));
          return n.impl.apply(void 0, arguments);
        };
      }
    }, so = {
      readContext: de,
      use: Ns,
      useCallback: xd,
      useContext: de,
      useEffect: to,
      useImperativeHandle: Sd,
      useInsertionEffect: gd,
      useLayoutEffect: vd,
      useMemo: Td,
      useReducer: js,
      useRef: md,
      useState: function() {
        return js(wn);
      },
      useDebugValue: eo,
      useDeferredValue: function(t, e) {
        var n = Wt();
        return Ad(n, Rt.memoizedState, t, e);
      },
      useTransition: function() {
        var t = js(wn)[0], e = Wt().memoizedState;
        return [
          typeof t == "boolean" ? t : dl(t),
          e
        ];
      },
      useSyncExternalStore: $h,
      useId: Dd,
      useHostTransitionStatus: ao,
      useFormState: fd,
      useActionState: fd,
      useOptimistic: function(t, e) {
        var n = Wt();
        return ad(n, Rt, t, e);
      },
      useMemoCache: Ju,
      useCacheRefresh: zd
    };
    so.useEffectEvent = yd;
    var Nd = {
      readContext: de,
      use: Ns,
      useCallback: xd,
      useContext: de,
      useEffect: to,
      useImperativeHandle: Sd,
      useInsertionEffect: gd,
      useLayoutEffect: vd,
      useMemo: Td,
      useReducer: Wu,
      useRef: md,
      useState: function() {
        return Wu(wn);
      },
      useDebugValue: eo,
      useDeferredValue: function(t, e) {
        var n = Wt();
        return Rt === null ? no(n, t, e) : Ad(n, Rt.memoizedState, t, e);
      },
      useTransition: function() {
        var t = Wu(wn)[0], e = Wt().memoizedState;
        return [
          typeof t == "boolean" ? t : dl(t),
          e
        ];
      },
      useSyncExternalStore: $h,
      useId: Dd,
      useHostTransitionStatus: ao,
      useFormState: dd,
      useActionState: dd,
      useOptimistic: function(t, e) {
        var n = Wt();
        return Rt !== null ? ad(n, Rt, t, e) : (n.baseState = t, [
          t,
          n.queue.dispatch
        ]);
      },
      useMemoCache: Ju,
      useCacheRefresh: zd
    };
    Nd.useEffectEvent = yd;
    function ro(t, e, n, l) {
      e = t.memoizedState, n = n(l, e), n = n == null ? e : b({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
    }
    var uo = {
      enqueueSetState: function(t, e, n) {
        t = t._reactInternals;
        var l = qe(), u = Fn(l);
        u.payload = e, n != null && (u.callback = n), e = Wn(t, u, l), e !== null && (Oe(e, t, l), ol(e, t, l));
      },
      enqueueReplaceState: function(t, e, n) {
        t = t._reactInternals;
        var l = qe(), u = Fn(l);
        u.tag = 1, u.payload = e, n != null && (u.callback = n), e = Wn(t, u, l), e !== null && (Oe(e, t, l), ol(e, t, l));
      },
      enqueueForceUpdate: function(t, e) {
        t = t._reactInternals;
        var n = qe(), l = Fn(n);
        l.tag = 2, e != null && (l.callback = e), e = Wn(t, l, n), e !== null && (Oe(e, t, n), ol(e, t, n));
      }
    };
    function jd(t, e, n, l, u, o, d) {
      return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(l, o, d) : e.prototype && e.prototype.isPureReactComponent ? !el(n, l) || !el(u, o) : true;
    }
    function Vd(t, e, n, l) {
      t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, l), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, l), e.state !== t && uo.enqueueReplaceState(e, e.state, null);
    }
    function Li(t, e) {
      var n = e;
      if ("ref" in e) {
        n = {};
        for (var l in e) l !== "ref" && (n[l] = e[l]);
      }
      if (t = t.defaultProps) {
        n === e && (n = b({}, n));
        for (var u in t) n[u] === void 0 && (n[u] = t[u]);
      }
      return n;
    }
    function Ud(t) {
      ps(t);
    }
    function Ld(t) {
      console.error(t);
    }
    function Bd(t) {
      ps(t);
    }
    function Bs(t, e) {
      try {
        var n = t.onUncaughtError;
        n(e.value, {
          componentStack: e.stack
        });
      } catch (l) {
        setTimeout(function() {
          throw l;
        });
      }
    }
    function Hd(t, e, n) {
      try {
        var l = t.onCaughtError;
        l(n.value, {
          componentStack: n.stack,
          errorBoundary: e.tag === 1 ? e.stateNode : null
        });
      } catch (u) {
        setTimeout(function() {
          throw u;
        });
      }
    }
    function oo(t, e, n) {
      return n = Fn(n), n.tag = 3, n.payload = {
        element: null
      }, n.callback = function() {
        Bs(t, e);
      }, n;
    }
    function Gd(t) {
      return t = Fn(t), t.tag = 3, t;
    }
    function qd(t, e, n, l) {
      var u = n.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var o = l.value;
        t.payload = function() {
          return u(o);
        }, t.callback = function() {
          Hd(e, n, l);
        };
      }
      var d = n.stateNode;
      d !== null && typeof d.componentDidCatch == "function" && (t.callback = function() {
        Hd(e, n, l), typeof u != "function" && (ii === null ? ii = /* @__PURE__ */ new Set([
          this
        ]) : ii.add(this));
        var g = l.stack;
        this.componentDidCatch(l.value, {
          componentStack: g !== null ? g : ""
        });
      });
    }
    function S1(t, e, n, l, u) {
      if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
        if (e = n.alternate, e !== null && fa(e, n, u, true), n = Le.current, n !== null) {
          switch (n.tag) {
            case 31:
            case 13:
              return We === null ? Fs() : n.alternate === null && Pt === 0 && (Pt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = u, l === _s ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([
                l
              ]) : e.add(l), Vo(t, l, u)), false;
            case 22:
              return n.flags |= 65536, l === _s ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([
                  l
                ])
              }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([
                l
              ]) : n.add(l)), Vo(t, l, u)), false;
          }
          throw Error(r(435, n.tag));
        }
        return Vo(t, l, u), Fs(), false;
      }
      if (bt) return e = Le.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = u, l !== zu && (t = Error(r(422), {
        cause: l
      }), al(Ze(t, n)))) : (l !== zu && (e = Error(r(423), {
        cause: l
      }), al(Ze(e, n))), t = t.current.alternate, t.flags |= 65536, u &= -u, t.lanes |= u, l = Ze(l, n), u = oo(t.stateNode, l, u), Hu(t, u), Pt !== 4 && (Pt = 2)), false;
      var o = Error(r(520), {
        cause: l
      });
      if (o = Ze(o, n), Al === null ? Al = [
        o
      ] : Al.push(o), Pt !== 4 && (Pt = 2), e === null) return true;
      l = Ze(l, n), n = e;
      do {
        switch (n.tag) {
          case 3:
            return n.flags |= 65536, t = u & -u, n.lanes |= t, t = oo(n.stateNode, l, t), Hu(n, t), false;
          case 1:
            if (e = n.type, o = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ii === null || !ii.has(o)))) return n.flags |= 65536, u &= -u, n.lanes |= u, u = Gd(u), qd(u, t, n, l), Hu(n, u), false;
        }
        n = n.return;
      } while (n !== null);
      return false;
    }
    var co = Error(r(461)), ee = false;
    function me(t, e, n, l) {
      e.child = t === null ? Kh(e, null, n, l) : Vi(e, t.child, n, l);
    }
    function Yd(t, e, n, l, u) {
      n = n.render;
      var o = e.ref;
      if ("ref" in l) {
        var d = {};
        for (var g in l) g !== "ref" && (d[g] = l[g]);
      } else d = l;
      return Ri(e), l = Ku(t, e, n, d, o, u), g = Qu(), t !== null && !ee ? (Zu(t, e, u), Rn(t, e, u)) : (bt && g && Mu(e), e.flags |= 1, me(t, e, l, u), e.child);
    }
    function kd(t, e, n, l, u) {
      if (t === null) {
        var o = n.type;
        return typeof o == "function" && !Au(o) && o.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = o, Xd(t, e, o, l, u)) : (t = bs(n.type, null, l, e, e.mode, u), t.ref = e.ref, t.return = e, e.child = t);
      }
      if (o = t.child, !bo(t, u)) {
        var d = o.memoizedProps;
        if (n = n.compare, n = n !== null ? n : el, n(d, l) && t.ref === e.ref) return Rn(t, e, u);
      }
      return e.flags |= 1, t = _n(o, l), t.ref = e.ref, t.return = e, e.child = t;
    }
    function Xd(t, e, n, l, u) {
      if (t !== null) {
        var o = t.memoizedProps;
        if (el(o, l) && t.ref === e.ref) if (ee = false, e.pendingProps = l = o, bo(t, u)) (t.flags & 131072) !== 0 && (ee = true);
        else return e.lanes = t.lanes, Rn(t, e, u);
      }
      return fo(t, e, n, l, u);
    }
    function Kd(t, e, n, l) {
      var u = l.children, o = t !== null ? t.memoizedState : null;
      if (t === null && e.stateNode === null && (e.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), l.mode === "hidden") {
        if ((e.flags & 128) !== 0) {
          if (o = o !== null ? o.baseLanes | n : n, t !== null) {
            for (l = e.child = t.child, u = 0; l !== null; ) u = u | l.lanes | l.childLanes, l = l.sibling;
            l = u & ~o;
          } else l = 0, e.child = null;
          return Qd(t, e, o, n, l);
        }
        if ((n & 536870912) !== 0) e.memoizedState = {
          baseLanes: 0,
          cachePool: null
        }, t !== null && As(e, o !== null ? o.cachePool : null), o !== null ? Ph(e, o) : qu(), Jh(e);
        else return l = e.lanes = 536870912, Qd(t, e, o !== null ? o.baseLanes | n : n, n, l);
      } else o !== null ? (As(e, o.cachePool), Ph(e, o), In(), e.memoizedState = null) : (t !== null && As(e, null), qu(), In());
      return me(t, e, u, n), e.child;
    }
    function yl(t, e) {
      return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), e.sibling;
    }
    function Qd(t, e, n, l, u) {
      var o = Vu();
      return o = o === null ? null : {
        parent: It._currentValue,
        pool: o
      }, e.memoizedState = {
        baseLanes: n,
        cachePool: o
      }, t !== null && As(e, null), qu(), Jh(e), t !== null && fa(t, e, l, true), e.childLanes = u, null;
    }
    function Hs(t, e) {
      return e = qs({
        mode: e.mode,
        children: e.children
      }, t.mode), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function Zd(t, e, n) {
      return Vi(e, t.child, null, n), t = Hs(e, e.pendingProps), t.flags |= 2, Be(e), e.memoizedState = null, t;
    }
    function x1(t, e, n) {
      var l = e.pendingProps, u = (e.flags & 128) !== 0;
      if (e.flags &= -129, t === null) {
        if (bt) {
          if (l.mode === "hidden") return t = Hs(e, l), e.lanes = 536870912, yl(null, t);
          if (ku(e), (t = Ht) ? (t = lp(t, Fe), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
            dehydrated: t,
            treeContext: Kn !== null ? {
              id: hn,
              overflow: dn
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, n = wh(t), n.return = e, e.child = n, he = e, Ht = null)) : t = null, t === null) throw Zn(e);
          return e.lanes = 536870912, null;
        }
        return Hs(e, l);
      }
      var o = t.memoizedState;
      if (o !== null) {
        var d = o.dehydrated;
        if (ku(e), u) if (e.flags & 256) e.flags &= -257, e = Zd(t, e, n);
        else if (e.memoizedState !== null) e.child = t.child, e.flags |= 128, e = null;
        else throw Error(r(558));
        else if (ee || fa(t, e, n, false), u = (n & t.childLanes) !== 0, ee || u) {
          if (l = Ut, l !== null && (d = Lf(l, n), d !== 0 && d !== o.retryLane)) throw o.retryLane = d, Di(t, d), Oe(l, t, d), co;
          Fs(), e = Zd(t, e, n);
        } else t = o.treeContext, Ht = $e(d.nextSibling), he = e, bt = true, Qn = null, Fe = false, t !== null && Nh(e, t), e = Hs(e, l), e.flags |= 4096;
        return e;
      }
      return t = _n(t.child, {
        mode: l.mode,
        children: l.children
      }), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function Gs(t, e) {
      var n = e.ref;
      if (n === null) t !== null && t.ref !== null && (e.flags |= 4194816);
      else {
        if (typeof n != "function" && typeof n != "object") throw Error(r(284));
        (t === null || t.ref !== n) && (e.flags |= 4194816);
      }
    }
    function fo(t, e, n, l, u) {
      return Ri(e), n = Ku(t, e, n, l, void 0, u), l = Qu(), t !== null && !ee ? (Zu(t, e, u), Rn(t, e, u)) : (bt && l && Mu(e), e.flags |= 1, me(t, e, n, u), e.child);
    }
    function Pd(t, e, n, l, u, o) {
      return Ri(e), e.updateQueue = null, n = Wh(e, l, n, u), Fh(t), l = Qu(), t !== null && !ee ? (Zu(t, e, o), Rn(t, e, o)) : (bt && l && Mu(e), e.flags |= 1, me(t, e, n, o), e.child);
    }
    function Jd(t, e, n, l, u) {
      if (Ri(e), e.stateNode === null) {
        var o = ra, d = n.contextType;
        typeof d == "object" && d !== null && (o = de(d)), o = new n(l, o), e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = uo, e.stateNode = o, o._reactInternals = e, o = e.stateNode, o.props = l, o.state = e.memoizedState, o.refs = {}, Lu(e), d = n.contextType, o.context = typeof d == "object" && d !== null ? de(d) : ra, o.state = e.memoizedState, d = n.getDerivedStateFromProps, typeof d == "function" && (ro(e, n, d, l), o.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (d = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), d !== o.state && uo.enqueueReplaceState(o, o.state, null), fl(e, l, o, u), cl(), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308), l = true;
      } else if (t === null) {
        o = e.stateNode;
        var g = e.memoizedProps, x = Li(n, g);
        o.props = x;
        var D = o.context, N = n.contextType;
        d = ra, typeof N == "object" && N !== null && (d = de(N));
        var U = n.getDerivedStateFromProps;
        N = typeof U == "function" || typeof o.getSnapshotBeforeUpdate == "function", g = e.pendingProps !== g, N || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (g || D !== d) && Vd(e, o, l, d), Jn = false;
        var z = e.memoizedState;
        o.state = z, fl(e, l, o, u), cl(), D = e.memoizedState, g || z !== D || Jn ? (typeof U == "function" && (ro(e, n, U, l), D = e.memoizedState), (x = Jn || jd(e, n, x, l, z, D, d)) ? (N || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = l, e.memoizedState = D), o.props = l, o.state = D, o.context = d, l = x) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), l = false);
      } else {
        o = e.stateNode, Bu(t, e), d = e.memoizedProps, N = Li(n, d), o.props = N, U = e.pendingProps, z = o.context, D = n.contextType, x = ra, typeof D == "object" && D !== null && (x = de(D)), g = n.getDerivedStateFromProps, (D = typeof g == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (d !== U || z !== x) && Vd(e, o, l, x), Jn = false, z = e.memoizedState, o.state = z, fl(e, l, o, u), cl();
        var R = e.memoizedState;
        d !== U || z !== R || Jn || t !== null && t.dependencies !== null && xs(t.dependencies) ? (typeof g == "function" && (ro(e, n, g, l), R = e.memoizedState), (N = Jn || jd(e, n, N, l, z, R, x) || t !== null && t.dependencies !== null && xs(t.dependencies)) ? (D || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(l, R, x), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(l, R, x)), typeof o.componentDidUpdate == "function" && (e.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || d === t.memoizedProps && z === t.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || d === t.memoizedProps && z === t.memoizedState || (e.flags |= 1024), e.memoizedProps = l, e.memoizedState = R), o.props = l, o.state = R, o.context = x, l = N) : (typeof o.componentDidUpdate != "function" || d === t.memoizedProps && z === t.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || d === t.memoizedProps && z === t.memoizedState || (e.flags |= 1024), l = false);
      }
      return o = l, Gs(t, e), l = (e.flags & 128) !== 0, o || l ? (o = e.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : o.render(), e.flags |= 1, t !== null && l ? (e.child = Vi(e, t.child, null, u), e.child = Vi(e, null, n, u)) : me(t, e, n, u), e.memoizedState = o.state, t = e.child) : t = Rn(t, e, u), t;
    }
    function Fd(t, e, n, l) {
      return Ci(), e.flags |= 256, me(t, e, n, l), e.child;
    }
    var ho = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    };
    function mo(t) {
      return {
        baseLanes: t,
        cachePool: Hh()
      };
    }
    function po(t, e, n) {
      return t = t !== null ? t.childLanes & ~n : 0, e && (t |= Ge), t;
    }
    function Wd(t, e, n) {
      var l = e.pendingProps, u = false, o = (e.flags & 128) !== 0, d;
      if ((d = o) || (d = t !== null && t.memoizedState === null ? false : (Ft.current & 2) !== 0), d && (u = true, e.flags &= -129), d = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
        if (bt) {
          if (u ? $n(e) : In(), (t = Ht) ? (t = lp(t, Fe), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
            dehydrated: t,
            treeContext: Kn !== null ? {
              id: hn,
              overflow: dn
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, n = wh(t), n.return = e, e.child = n, he = e, Ht = null)) : t = null, t === null) throw Zn(e);
          return Wo(t) ? e.lanes = 32 : e.lanes = 536870912, null;
        }
        var g = l.children;
        return l = l.fallback, u ? (In(), u = e.mode, g = qs({
          mode: "hidden",
          children: g
        }, u), l = zi(l, u, n, null), g.return = e, l.return = e, g.sibling = l, e.child = g, l = e.child, l.memoizedState = mo(n), l.childLanes = po(t, d, n), e.memoizedState = ho, yl(null, l)) : ($n(e), yo(e, g));
      }
      var x = t.memoizedState;
      if (x !== null && (g = x.dehydrated, g !== null)) {
        if (o) e.flags & 256 ? ($n(e), e.flags &= -257, e = go(t, e, n)) : e.memoizedState !== null ? (In(), e.child = t.child, e.flags |= 128, e = null) : (In(), g = l.fallback, u = e.mode, l = qs({
          mode: "visible",
          children: l.children
        }, u), g = zi(g, u, n, null), g.flags |= 2, l.return = e, g.return = e, l.sibling = g, e.child = l, Vi(e, t.child, null, n), l = e.child, l.memoizedState = mo(n), l.childLanes = po(t, d, n), e.memoizedState = ho, e = yl(null, l));
        else if ($n(e), Wo(g)) {
          if (d = g.nextSibling && g.nextSibling.dataset, d) var D = d.dgst;
          d = D, l = Error(r(419)), l.stack = "", l.digest = d, al({
            value: l,
            source: null,
            stack: null
          }), e = go(t, e, n);
        } else if (ee || fa(t, e, n, false), d = (n & t.childLanes) !== 0, ee || d) {
          if (d = Ut, d !== null && (l = Lf(d, n), l !== 0 && l !== x.retryLane)) throw x.retryLane = l, Di(t, l), Oe(d, t, l), co;
          Fo(g) || Fs(), e = go(t, e, n);
        } else Fo(g) ? (e.flags |= 192, e.child = t.child, e = null) : (t = x.treeContext, Ht = $e(g.nextSibling), he = e, bt = true, Qn = null, Fe = false, t !== null && Nh(e, t), e = yo(e, l.children), e.flags |= 4096);
        return e;
      }
      return u ? (In(), g = l.fallback, u = e.mode, x = t.child, D = x.sibling, l = _n(x, {
        mode: "hidden",
        children: l.children
      }), l.subtreeFlags = x.subtreeFlags & 65011712, D !== null ? g = _n(D, g) : (g = zi(g, u, n, null), g.flags |= 2), g.return = e, l.return = e, l.sibling = g, e.child = l, yl(null, l), l = e.child, g = t.child.memoizedState, g === null ? g = mo(n) : (u = g.cachePool, u !== null ? (x = It._currentValue, u = u.parent !== x ? {
        parent: x,
        pool: x
      } : u) : u = Hh(), g = {
        baseLanes: g.baseLanes | n,
        cachePool: u
      }), l.memoizedState = g, l.childLanes = po(t, d, n), e.memoizedState = ho, yl(t.child, l)) : ($n(e), n = t.child, t = n.sibling, n = _n(n, {
        mode: "visible",
        children: l.children
      }), n.return = e, n.sibling = null, t !== null && (d = e.deletions, d === null ? (e.deletions = [
        t
      ], e.flags |= 16) : d.push(t)), e.child = n, e.memoizedState = null, n);
    }
    function yo(t, e) {
      return e = qs({
        mode: "visible",
        children: e
      }, t.mode), e.return = t, t.child = e;
    }
    function qs(t, e) {
      return t = Ue(22, t, null, e), t.lanes = 0, t;
    }
    function go(t, e, n) {
      return Vi(e, t.child, null, n), t = yo(e, e.pendingProps.children), t.flags |= 2, e.memoizedState = null, t;
    }
    function $d(t, e, n) {
      t.lanes |= e;
      var l = t.alternate;
      l !== null && (l.lanes |= e), Ru(t.return, e, n);
    }
    function vo(t, e, n, l, u, o) {
      var d = t.memoizedState;
      d === null ? t.memoizedState = {
        isBackwards: e,
        rendering: null,
        renderingStartTime: 0,
        last: l,
        tail: n,
        tailMode: u,
        treeForkCount: o
      } : (d.isBackwards = e, d.rendering = null, d.renderingStartTime = 0, d.last = l, d.tail = n, d.tailMode = u, d.treeForkCount = o);
    }
    function Id(t, e, n) {
      var l = e.pendingProps, u = l.revealOrder, o = l.tail;
      l = l.children;
      var d = Ft.current, g = (d & 2) !== 0;
      if (g ? (d = d & 1 | 2, e.flags |= 128) : d &= 1, X(Ft, d), me(t, e, l, n), l = bt ? il : 0, !g && t !== null && (t.flags & 128) !== 0) t: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && $d(t, n, e);
        else if (t.tag === 19) $d(t, n, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      switch (u) {
        case "forwards":
          for (n = e.child, u = null; n !== null; ) t = n.alternate, t !== null && Cs(t) === null && (u = n), n = n.sibling;
          n = u, n === null ? (u = e.child, e.child = null) : (u = n.sibling, n.sibling = null), vo(e, false, u, n, o, l);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (n = null, u = e.child, e.child = null; u !== null; ) {
            if (t = u.alternate, t !== null && Cs(t) === null) {
              e.child = u;
              break;
            }
            t = u.sibling, u.sibling = n, n = u, u = t;
          }
          vo(e, true, n, null, o, l);
          break;
        case "together":
          vo(e, false, null, null, void 0, l);
          break;
        default:
          e.memoizedState = null;
      }
      return e.child;
    }
    function Rn(t, e, n) {
      if (t !== null && (e.dependencies = t.dependencies), ni |= e.lanes, (n & e.childLanes) === 0) if (t !== null) {
        if (fa(t, e, n, false), (n & e.childLanes) === 0) return null;
      } else return null;
      if (t !== null && e.child !== t.child) throw Error(r(153));
      if (e.child !== null) {
        for (t = e.child, n = _n(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; ) t = t.sibling, n = n.sibling = _n(t, t.pendingProps), n.return = e;
        n.sibling = null;
      }
      return e.child;
    }
    function bo(t, e) {
      return (t.lanes & e) !== 0 ? true : (t = t.dependencies, !!(t !== null && xs(t)));
    }
    function T1(t, e, n) {
      switch (e.tag) {
        case 3:
          ce(e, e.stateNode.containerInfo), Pn(e, It, t.memoizedState.cache), Ci();
          break;
        case 27:
        case 5:
          bi(e);
          break;
        case 4:
          ce(e, e.stateNode.containerInfo);
          break;
        case 10:
          Pn(e, e.type, e.memoizedProps.value);
          break;
        case 31:
          if (e.memoizedState !== null) return e.flags |= 128, ku(e), null;
          break;
        case 13:
          var l = e.memoizedState;
          if (l !== null) return l.dehydrated !== null ? ($n(e), e.flags |= 128, null) : (n & e.child.childLanes) !== 0 ? Wd(t, e, n) : ($n(e), t = Rn(t, e, n), t !== null ? t.sibling : null);
          $n(e);
          break;
        case 19:
          var u = (t.flags & 128) !== 0;
          if (l = (n & e.childLanes) !== 0, l || (fa(t, e, n, false), l = (n & e.childLanes) !== 0), u) {
            if (l) return Id(t, e, n);
            e.flags |= 128;
          }
          if (u = e.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), X(Ft, Ft.current), l) break;
          return null;
        case 22:
          return e.lanes = 0, Kd(t, e, n, e.pendingProps);
        case 24:
          Pn(e, It, t.memoizedState.cache);
      }
      return Rn(t, e, n);
    }
    function tm(t, e, n) {
      if (t !== null) if (t.memoizedProps !== e.pendingProps) ee = true;
      else {
        if (!bo(t, n) && (e.flags & 128) === 0) return ee = false, T1(t, e, n);
        ee = (t.flags & 131072) !== 0;
      }
      else ee = false, bt && (e.flags & 1048576) !== 0 && Oh(e, il, e.index);
      switch (e.lanes = 0, e.tag) {
        case 16:
          t: {
            var l = e.pendingProps;
            if (t = Ni(e.elementType), e.type = t, typeof t == "function") Au(t) ? (l = Li(t, l), e.tag = 1, e = Jd(null, e, t, l, n)) : (e.tag = 0, e = fo(null, e, t, l, n));
            else {
              if (t != null) {
                var u = t.$$typeof;
                if (u === Q) {
                  e.tag = 11, e = Yd(null, e, t, l, n);
                  break t;
                } else if (u === et) {
                  e.tag = 14, e = kd(null, e, t, l, n);
                  break t;
                }
              }
              throw e = Qt(t) || t, Error(r(306, e, ""));
            }
          }
          return e;
        case 0:
          return fo(t, e, e.type, e.pendingProps, n);
        case 1:
          return l = e.type, u = Li(l, e.pendingProps), Jd(t, e, l, u, n);
        case 3:
          t: {
            if (ce(e, e.stateNode.containerInfo), t === null) throw Error(r(387));
            l = e.pendingProps;
            var o = e.memoizedState;
            u = o.element, Bu(t, e), fl(e, l, null, n);
            var d = e.memoizedState;
            if (l = d.cache, Pn(e, It, l), l !== o.cache && Ou(e, [
              It
            ], n, true), cl(), l = d.element, o.isDehydrated) if (o = {
              element: l,
              isDehydrated: false,
              cache: d.cache
            }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
              e = Fd(t, e, l, n);
              break t;
            } else if (l !== u) {
              u = Ze(Error(r(424)), e), al(u), e = Fd(t, e, l, n);
              break t;
            } else {
              switch (t = e.stateNode.containerInfo, t.nodeType) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (Ht = $e(t.firstChild), he = e, bt = true, Qn = null, Fe = true, n = Kh(e, null, l, n), e.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
            else {
              if (Ci(), l === u) {
                e = Rn(t, e, n);
                break t;
              }
              me(t, e, l, n);
            }
            e = e.child;
          }
          return e;
        case 26:
          return Gs(t, e), t === null ? (n = fp(e.type, null, e.pendingProps, null)) ? e.memoizedState = n : bt || (n = e.type, t = e.pendingProps, l = ir(ht.current).createElement(n), l[fe] = e, l[Me] = t, pe(l, n, t), re(l), e.stateNode = l) : e.memoizedState = fp(e.type, t.memoizedProps, e.pendingProps, t.memoizedState), null;
        case 27:
          return bi(e), t === null && bt && (l = e.stateNode = up(e.type, e.pendingProps, ht.current), he = e, Fe = true, u = Ht, ri(e.type) ? ($o = u, Ht = $e(l.firstChild)) : Ht = u), me(t, e, e.pendingProps.children, n), Gs(t, e), t === null && (e.flags |= 4194304), e.child;
        case 5:
          return t === null && bt && ((u = l = Ht) && (l = $1(l, e.type, e.pendingProps, Fe), l !== null ? (e.stateNode = l, he = e, Ht = $e(l.firstChild), Fe = false, u = true) : u = false), u || Zn(e)), bi(e), u = e.type, o = e.pendingProps, d = t !== null ? t.memoizedProps : null, l = o.children, Zo(u, o) ? l = null : d !== null && Zo(u, d) && (e.flags |= 32), e.memoizedState !== null && (u = Ku(t, e, d1, null, null, n), Rl._currentValue = u), Gs(t, e), me(t, e, l, n), e.child;
        case 6:
          return t === null && bt && ((t = n = Ht) && (n = I1(n, e.pendingProps, Fe), n !== null ? (e.stateNode = n, he = e, Ht = null, t = true) : t = false), t || Zn(e)), null;
        case 13:
          return Wd(t, e, n);
        case 4:
          return ce(e, e.stateNode.containerInfo), l = e.pendingProps, t === null ? e.child = Vi(e, null, l, n) : me(t, e, l, n), e.child;
        case 11:
          return Yd(t, e, e.type, e.pendingProps, n);
        case 7:
          return me(t, e, e.pendingProps, n), e.child;
        case 8:
          return me(t, e, e.pendingProps.children, n), e.child;
        case 12:
          return me(t, e, e.pendingProps.children, n), e.child;
        case 10:
          return l = e.pendingProps, Pn(e, e.type, l.value), me(t, e, l.children, n), e.child;
        case 9:
          return u = e.type._context, l = e.pendingProps.children, Ri(e), u = de(u), l = l(u), e.flags |= 1, me(t, e, l, n), e.child;
        case 14:
          return kd(t, e, e.type, e.pendingProps, n);
        case 15:
          return Xd(t, e, e.type, e.pendingProps, n);
        case 19:
          return Id(t, e, n);
        case 31:
          return x1(t, e, n);
        case 22:
          return Kd(t, e, n, e.pendingProps);
        case 24:
          return Ri(e), l = de(It), t === null ? (u = Vu(), u === null && (u = Ut, o = Nu(), u.pooledCache = o, o.refCount++, o !== null && (u.pooledCacheLanes |= n), u = o), e.memoizedState = {
            parent: l,
            cache: u
          }, Lu(e), Pn(e, It, u)) : ((t.lanes & n) !== 0 && (Bu(t, e), fl(e, null, null, n), cl()), u = t.memoizedState, o = e.memoizedState, u.parent !== l ? (u = {
            parent: l,
            cache: l
          }, e.memoizedState = u, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = u), Pn(e, It, l)) : (l = o.cache, Pn(e, It, l), l !== u.cache && Ou(e, [
            It
          ], n, true))), me(t, e, e.pendingProps.children, n), e.child;
        case 29:
          throw e.pendingProps;
      }
      throw Error(r(156, e.tag));
    }
    function On(t) {
      t.flags |= 4;
    }
    function So(t, e, n, l, u) {
      if ((e = (t.mode & 32) !== 0) && (e = false), e) {
        if (t.flags |= 16777216, (u & 335544128) === u) if (t.stateNode.complete) t.flags |= 8192;
        else if (Dm()) t.flags |= 8192;
        else throw ji = _s, Uu;
      } else t.flags &= -16777217;
    }
    function em(t, e) {
      if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) t.flags &= -16777217;
      else if (t.flags |= 16777216, !yp(e)) if (Dm()) t.flags |= 8192;
      else throw ji = _s, Uu;
    }
    function Ys(t, e) {
      e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? jf() : 536870912, t.lanes |= e, Aa |= e);
    }
    function gl(t, e) {
      if (!bt) switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var n = null; e !== null; ) e.alternate !== null && (n = e), e = e.sibling;
          n === null ? t.tail = null : n.sibling = null;
          break;
        case "collapsed":
          n = t.tail;
          for (var l = null; n !== null; ) n.alternate !== null && (l = n), n = n.sibling;
          l === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : l.sibling = null;
      }
    }
    function Gt(t) {
      var e = t.alternate !== null && t.alternate.child === t.child, n = 0, l = 0;
      if (e) for (var u = t.child; u !== null; ) n |= u.lanes | u.childLanes, l |= u.subtreeFlags & 65011712, l |= u.flags & 65011712, u.return = t, u = u.sibling;
      else for (u = t.child; u !== null; ) n |= u.lanes | u.childLanes, l |= u.subtreeFlags, l |= u.flags, u.return = t, u = u.sibling;
      return t.subtreeFlags |= l, t.childLanes = n, e;
    }
    function A1(t, e, n) {
      var l = e.pendingProps;
      switch (Du(e), e.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return Gt(e), null;
        case 1:
          return Gt(e), null;
        case 3:
          return n = e.stateNode, l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), zn(It), Xt(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (ca(e) ? On(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, Cu())), Gt(e), null;
        case 26:
          var u = e.type, o = e.memoizedState;
          return t === null ? (On(e), o !== null ? (Gt(e), em(e, o)) : (Gt(e), So(e, u, null, l, n))) : o ? o !== t.memoizedState ? (On(e), Gt(e), em(e, o)) : (Gt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== l && On(e), Gt(e), So(e, u, t, l, n)), null;
        case 27:
          if (Zi(e), n = ht.current, u = e.type, t !== null && e.stateNode != null) t.memoizedProps !== l && On(e);
          else {
            if (!l) {
              if (e.stateNode === null) throw Error(r(166));
              return Gt(e), null;
            }
            t = J.current, ca(e) ? jh(e) : (t = up(u, l, n), e.stateNode = t, On(e));
          }
          return Gt(e), null;
        case 5:
          if (Zi(e), u = e.type, t !== null && e.stateNode != null) t.memoizedProps !== l && On(e);
          else {
            if (!l) {
              if (e.stateNode === null) throw Error(r(166));
              return Gt(e), null;
            }
            if (o = J.current, ca(e)) jh(e);
            else {
              var d = ir(ht.current);
              switch (o) {
                case 1:
                  o = d.createElementNS("http://www.w3.org/2000/svg", u);
                  break;
                case 2:
                  o = d.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                  break;
                default:
                  switch (u) {
                    case "svg":
                      o = d.createElementNS("http://www.w3.org/2000/svg", u);
                      break;
                    case "math":
                      o = d.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                      break;
                    case "script":
                      o = d.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
                      break;
                    case "select":
                      o = typeof l.is == "string" ? d.createElement("select", {
                        is: l.is
                      }) : d.createElement("select"), l.multiple ? o.multiple = true : l.size && (o.size = l.size);
                      break;
                    default:
                      o = typeof l.is == "string" ? d.createElement(u, {
                        is: l.is
                      }) : d.createElement(u);
                  }
              }
              o[fe] = e, o[Me] = l;
              t: for (d = e.child; d !== null; ) {
                if (d.tag === 5 || d.tag === 6) o.appendChild(d.stateNode);
                else if (d.tag !== 4 && d.tag !== 27 && d.child !== null) {
                  d.child.return = d, d = d.child;
                  continue;
                }
                if (d === e) break t;
                for (; d.sibling === null; ) {
                  if (d.return === null || d.return === e) break t;
                  d = d.return;
                }
                d.sibling.return = d.return, d = d.sibling;
              }
              e.stateNode = o;
              t: switch (pe(o, u, l), u) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  l = !!l.autoFocus;
                  break t;
                case "img":
                  l = true;
                  break t;
                default:
                  l = false;
              }
              l && On(e);
            }
          }
          return Gt(e), So(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, n), null;
        case 6:
          if (t && e.stateNode != null) t.memoizedProps !== l && On(e);
          else {
            if (typeof l != "string" && e.stateNode === null) throw Error(r(166));
            if (t = ht.current, ca(e)) {
              if (t = e.stateNode, n = e.memoizedProps, l = null, u = he, u !== null) switch (u.tag) {
                case 27:
                case 5:
                  l = u.memoizedProps;
              }
              t[fe] = e, t = !!(t.nodeValue === n || l !== null && l.suppressHydrationWarning === true || Wm(t.nodeValue, n)), t || Zn(e, true);
            } else t = ir(t).createTextNode(l), t[fe] = e, e.stateNode = t;
          }
          return Gt(e), null;
        case 31:
          if (n = e.memoizedState, t === null || t.memoizedState !== null) {
            if (l = ca(e), n !== null) {
              if (t === null) {
                if (!l) throw Error(r(318));
                if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(557));
                t[fe] = e;
              } else Ci(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
              Gt(e), t = false;
            } else n = Cu(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = true;
            if (!t) return e.flags & 256 ? (Be(e), e) : (Be(e), null);
            if ((e.flags & 128) !== 0) throw Error(r(558));
          }
          return Gt(e), null;
        case 13:
          if (l = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
            if (u = ca(e), l !== null && l.dehydrated !== null) {
              if (t === null) {
                if (!u) throw Error(r(318));
                if (u = e.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(r(317));
                u[fe] = e;
              } else Ci(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
              Gt(e), u = false;
            } else u = Cu(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u), u = true;
            if (!u) return e.flags & 256 ? (Be(e), e) : (Be(e), null);
          }
          return Be(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = l !== null, t = t !== null && t.memoizedState !== null, n && (l = e.child, u = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (u = l.alternate.memoizedState.cachePool.pool), o = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (o = l.memoizedState.cachePool.pool), o !== u && (l.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), Ys(e, e.updateQueue), Gt(e), null);
        case 4:
          return Xt(), t === null && Yo(e.stateNode.containerInfo), Gt(e), null;
        case 10:
          return zn(e.type), Gt(e), null;
        case 19:
          if (V(Ft), l = e.memoizedState, l === null) return Gt(e), null;
          if (u = (e.flags & 128) !== 0, o = l.rendering, o === null) if (u) gl(l, false);
          else {
            if (Pt !== 0 || t !== null && (t.flags & 128) !== 0) for (t = e.child; t !== null; ) {
              if (o = Cs(t), o !== null) {
                for (e.flags |= 128, gl(l, false), t = o.updateQueue, e.updateQueue = t, Ys(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; ) Ch(n, t), n = n.sibling;
                return X(Ft, Ft.current & 1 | 2), bt && Mn(e, l.treeForkCount), e.child;
              }
              t = t.sibling;
            }
            l.tail !== null && $t() > Zs && (e.flags |= 128, u = true, gl(l, false), e.lanes = 4194304);
          }
          else {
            if (!u) if (t = Cs(o), t !== null) {
              if (e.flags |= 128, u = true, t = t.updateQueue, e.updateQueue = t, Ys(e, t), gl(l, true), l.tail === null && l.tailMode === "hidden" && !o.alternate && !bt) return Gt(e), null;
            } else 2 * $t() - l.renderingStartTime > Zs && n !== 536870912 && (e.flags |= 128, u = true, gl(l, false), e.lanes = 4194304);
            l.isBackwards ? (o.sibling = e.child, e.child = o) : (t = l.last, t !== null ? t.sibling = o : e.child = o, l.last = o);
          }
          return l.tail !== null ? (t = l.tail, l.rendering = t, l.tail = t.sibling, l.renderingStartTime = $t(), t.sibling = null, n = Ft.current, X(Ft, u ? n & 1 | 2 : n & 1), bt && Mn(e, l.treeForkCount), t) : (Gt(e), null);
        case 22:
        case 23:
          return Be(e), Yu(), l = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== l && (e.flags |= 8192) : l && (e.flags |= 8192), l ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (Gt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Gt(e), n = e.updateQueue, n !== null && Ys(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), l = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), l !== n && (e.flags |= 2048), t !== null && V(Oi), null;
        case 24:
          return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), zn(It), Gt(e), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(r(156, e.tag));
    }
    function E1(t, e) {
      switch (Du(e), e.tag) {
        case 1:
          return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
        case 3:
          return zn(It), Xt(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
        case 26:
        case 27:
        case 5:
          return Zi(e), null;
        case 31:
          if (e.memoizedState !== null) {
            if (Be(e), e.alternate === null) throw Error(r(340));
            Ci();
          }
          return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
        case 13:
          if (Be(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
            if (e.alternate === null) throw Error(r(340));
            Ci();
          }
          return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
        case 19:
          return V(Ft), null;
        case 4:
          return Xt(), null;
        case 10:
          return zn(e.type), null;
        case 22:
        case 23:
          return Be(e), Yu(), t !== null && V(Oi), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
        case 24:
          return zn(It), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function nm(t, e) {
      switch (Du(e), e.tag) {
        case 3:
          zn(It), Xt();
          break;
        case 26:
        case 27:
        case 5:
          Zi(e);
          break;
        case 4:
          Xt();
          break;
        case 31:
          e.memoizedState !== null && Be(e);
          break;
        case 13:
          Be(e);
          break;
        case 19:
          V(Ft);
          break;
        case 10:
          zn(e.type);
          break;
        case 22:
        case 23:
          Be(e), Yu(), t !== null && V(Oi);
          break;
        case 24:
          zn(It);
      }
    }
    function vl(t, e) {
      try {
        var n = e.updateQueue, l = n !== null ? n.lastEffect : null;
        if (l !== null) {
          var u = l.next;
          n = u;
          do {
            if ((n.tag & t) === t) {
              l = void 0;
              var o = n.create, d = n.inst;
              l = o(), d.destroy = l;
            }
            n = n.next;
          } while (n !== u);
        }
      } catch (g) {
        wt(e, e.return, g);
      }
    }
    function ti(t, e, n) {
      try {
        var l = e.updateQueue, u = l !== null ? l.lastEffect : null;
        if (u !== null) {
          var o = u.next;
          l = o;
          do {
            if ((l.tag & t) === t) {
              var d = l.inst, g = d.destroy;
              if (g !== void 0) {
                d.destroy = void 0, u = e;
                var x = n, D = g;
                try {
                  D();
                } catch (N) {
                  wt(u, x, N);
                }
              }
            }
            l = l.next;
          } while (l !== o);
        }
      } catch (N) {
        wt(e, e.return, N);
      }
    }
    function im(t) {
      var e = t.updateQueue;
      if (e !== null) {
        var n = t.stateNode;
        try {
          Zh(e, n);
        } catch (l) {
          wt(t, t.return, l);
        }
      }
    }
    function am(t, e, n) {
      n.props = Li(t.type, t.memoizedProps), n.state = t.memoizedState;
      try {
        n.componentWillUnmount();
      } catch (l) {
        wt(t, e, l);
      }
    }
    function bl(t, e) {
      try {
        var n = t.ref;
        if (n !== null) {
          switch (t.tag) {
            case 26:
            case 27:
            case 5:
              var l = t.stateNode;
              break;
            case 30:
              l = t.stateNode;
              break;
            default:
              l = t.stateNode;
          }
          typeof n == "function" ? t.refCleanup = n(l) : n.current = l;
        }
      } catch (u) {
        wt(t, e, u);
      }
    }
    function mn(t, e) {
      var n = t.ref, l = t.refCleanup;
      if (n !== null) if (typeof l == "function") try {
        l();
      } catch (u) {
        wt(t, e, u);
      } finally {
        t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
      }
      else if (typeof n == "function") try {
        n(null);
      } catch (u) {
        wt(t, e, u);
      }
      else n.current = null;
    }
    function lm(t) {
      var e = t.type, n = t.memoizedProps, l = t.stateNode;
      try {
        t: switch (e) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            n.autoFocus && l.focus();
            break t;
          case "img":
            n.src ? l.src = n.src : n.srcSet && (l.srcset = n.srcSet);
        }
      } catch (u) {
        wt(t, t.return, u);
      }
    }
    function xo(t, e, n) {
      try {
        var l = t.stateNode;
        Q1(l, t.type, n, e), l[Me] = e;
      } catch (u) {
        wt(t, t.return, u);
      }
    }
    function sm(t) {
      return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && ri(t.type) || t.tag === 4;
    }
    function To(t) {
      t: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || sm(t.return)) return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
          if (t.tag === 27 && ri(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & 2)) return t.stateNode;
      }
    }
    function Ao(t, e, n) {
      var l = t.tag;
      if (l === 5 || l === 6) t = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(t, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(t), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = An));
      else if (l !== 4 && (l === 27 && ri(t.type) && (n = t.stateNode, e = null), t = t.child, t !== null)) for (Ao(t, e, n), t = t.sibling; t !== null; ) Ao(t, e, n), t = t.sibling;
    }
    function ks(t, e, n) {
      var l = t.tag;
      if (l === 5 || l === 6) t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
      else if (l !== 4 && (l === 27 && ri(t.type) && (n = t.stateNode), t = t.child, t !== null)) for (ks(t, e, n), t = t.sibling; t !== null; ) ks(t, e, n), t = t.sibling;
    }
    function rm(t) {
      var e = t.stateNode, n = t.memoizedProps;
      try {
        for (var l = t.type, u = e.attributes; u.length; ) e.removeAttributeNode(u[0]);
        pe(e, l, n), e[fe] = t, e[Me] = n;
      } catch (o) {
        wt(t, t.return, o);
      }
    }
    var Nn = false, ne = false, Eo = false, um = typeof WeakSet == "function" ? WeakSet : Set, ue = null;
    function _1(t, e) {
      if (t = t.containerInfo, Ko = cr, t = Sh(t), yu(t)) {
        if ("selectionStart" in t) var n = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
        else t: {
          n = (n = t.ownerDocument) && n.defaultView || window;
          var l = n.getSelection && n.getSelection();
          if (l && l.rangeCount !== 0) {
            n = l.anchorNode;
            var u = l.anchorOffset, o = l.focusNode;
            l = l.focusOffset;
            try {
              n.nodeType, o.nodeType;
            } catch {
              n = null;
              break t;
            }
            var d = 0, g = -1, x = -1, D = 0, N = 0, U = t, z = null;
            e: for (; ; ) {
              for (var R; U !== n || u !== 0 && U.nodeType !== 3 || (g = d + u), U !== o || l !== 0 && U.nodeType !== 3 || (x = d + l), U.nodeType === 3 && (d += U.nodeValue.length), (R = U.firstChild) !== null; ) z = U, U = R;
              for (; ; ) {
                if (U === t) break e;
                if (z === n && ++D === u && (g = d), z === o && ++N === l && (x = d), (R = U.nextSibling) !== null) break;
                U = z, z = U.parentNode;
              }
              U = R;
            }
            n = g === -1 || x === -1 ? null : {
              start: g,
              end: x
            };
          } else n = null;
        }
        n = n || {
          start: 0,
          end: 0
        };
      } else n = null;
      for (Qo = {
        focusedElem: t,
        selectionRange: n
      }, cr = false, ue = e; ue !== null; ) if (e = ue, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null) t.return = e, ue = t;
      else for (; ue !== null; ) {
        switch (e = ue, o = e.alternate, t = e.flags, e.tag) {
          case 0:
            if ((t & 4) !== 0 && (t = e.updateQueue, t = t !== null ? t.events : null, t !== null)) for (n = 0; n < t.length; n++) u = t[n], u.ref.impl = u.nextImpl;
            break;
          case 11:
          case 15:
            break;
          case 1:
            if ((t & 1024) !== 0 && o !== null) {
              t = void 0, n = e, u = o.memoizedProps, o = o.memoizedState, l = n.stateNode;
              try {
                var P = Li(n.type, u);
                t = l.getSnapshotBeforeUpdate(P, o), l.__reactInternalSnapshotBeforeUpdate = t;
              } catch (at) {
                wt(n, n.return, at);
              }
            }
            break;
          case 3:
            if ((t & 1024) !== 0) {
              if (t = e.stateNode.containerInfo, n = t.nodeType, n === 9) Jo(t);
              else if (n === 1) switch (t.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Jo(t);
                  break;
                default:
                  t.textContent = "";
              }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          default:
            if ((t & 1024) !== 0) throw Error(r(163));
        }
        if (t = e.sibling, t !== null) {
          t.return = e.return, ue = t;
          break;
        }
        ue = e.return;
      }
    }
    function om(t, e, n) {
      var l = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Vn(t, n), l & 4 && vl(5, n);
          break;
        case 1:
          if (Vn(t, n), l & 4) if (t = n.stateNode, e === null) try {
            t.componentDidMount();
          } catch (d) {
            wt(n, n.return, d);
          }
          else {
            var u = Li(n.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(u, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (d) {
              wt(n, n.return, d);
            }
          }
          l & 64 && im(n), l & 512 && bl(n, n.return);
          break;
        case 3:
          if (Vn(t, n), l & 64 && (t = n.updateQueue, t !== null)) {
            if (e = null, n.child !== null) switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
            try {
              Zh(t, e);
            } catch (d) {
              wt(n, n.return, d);
            }
          }
          break;
        case 27:
          e === null && l & 4 && rm(n);
        case 26:
        case 5:
          Vn(t, n), e === null && l & 4 && lm(n), l & 512 && bl(n, n.return);
          break;
        case 12:
          Vn(t, n);
          break;
        case 31:
          Vn(t, n), l & 4 && hm(t, n);
          break;
        case 13:
          Vn(t, n), l & 4 && dm(t, n), l & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = j1.bind(null, n), tb(t, n))));
          break;
        case 22:
          if (l = n.memoizedState !== null || Nn, !l) {
            e = e !== null && e.memoizedState !== null || ne, u = Nn;
            var o = ne;
            Nn = l, (ne = e) && !o ? Un(t, n, (n.subtreeFlags & 8772) !== 0) : Vn(t, n), Nn = u, ne = o;
          }
          break;
        case 30:
          break;
        default:
          Vn(t, n);
      }
    }
    function cm(t) {
      var e = t.alternate;
      e !== null && (t.alternate = null, cm(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Ir(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
    }
    var Yt = null, ze = false;
    function jn(t, e, n) {
      for (n = n.child; n !== null; ) fm(t, e, n), n = n.sibling;
    }
    function fm(t, e, n) {
      if (Ne && typeof Ne.onCommitFiberUnmount == "function") try {
        Ne.onCommitFiberUnmount(ka, n);
      } catch {
      }
      switch (n.tag) {
        case 26:
          ne || mn(n, e), jn(t, e, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
          break;
        case 27:
          ne || mn(n, e);
          var l = Yt, u = ze;
          ri(n.type) && (Yt = n.stateNode, ze = false), jn(t, e, n), zl(n.stateNode), Yt = l, ze = u;
          break;
        case 5:
          ne || mn(n, e);
        case 6:
          if (l = Yt, u = ze, Yt = null, jn(t, e, n), Yt = l, ze = u, Yt !== null) if (ze) try {
            (Yt.nodeType === 9 ? Yt.body : Yt.nodeName === "HTML" ? Yt.ownerDocument.body : Yt).removeChild(n.stateNode);
          } catch (o) {
            wt(n, e, o);
          }
          else try {
            Yt.removeChild(n.stateNode);
          } catch (o) {
            wt(n, e, o);
          }
          break;
        case 18:
          Yt !== null && (ze ? (t = Yt, ip(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, n.stateNode), Ra(t)) : ip(Yt, n.stateNode));
          break;
        case 4:
          l = Yt, u = ze, Yt = n.stateNode.containerInfo, ze = true, jn(t, e, n), Yt = l, ze = u;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          ti(2, n, e), ne || ti(4, n, e), jn(t, e, n);
          break;
        case 1:
          ne || (mn(n, e), l = n.stateNode, typeof l.componentWillUnmount == "function" && am(n, e, l)), jn(t, e, n);
          break;
        case 21:
          jn(t, e, n);
          break;
        case 22:
          ne = (l = ne) || n.memoizedState !== null, jn(t, e, n), ne = l;
          break;
        default:
          jn(t, e, n);
      }
    }
    function hm(t, e) {
      if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
        t = t.dehydrated;
        try {
          Ra(t);
        } catch (n) {
          wt(e, e.return, n);
        }
      }
    }
    function dm(t, e) {
      if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null)))) try {
        Ra(t);
      } catch (n) {
        wt(e, e.return, n);
      }
    }
    function M1(t) {
      switch (t.tag) {
        case 31:
        case 13:
        case 19:
          var e = t.stateNode;
          return e === null && (e = t.stateNode = new um()), e;
        case 22:
          return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new um()), e;
        default:
          throw Error(r(435, t.tag));
      }
    }
    function Xs(t, e) {
      var n = M1(t);
      e.forEach(function(l) {
        if (!n.has(l)) {
          n.add(l);
          var u = V1.bind(null, t, l);
          l.then(u, u);
        }
      });
    }
    function Ce(t, e) {
      var n = e.deletions;
      if (n !== null) for (var l = 0; l < n.length; l++) {
        var u = n[l], o = t, d = e, g = d;
        t: for (; g !== null; ) {
          switch (g.tag) {
            case 27:
              if (ri(g.type)) {
                Yt = g.stateNode, ze = false;
                break t;
              }
              break;
            case 5:
              Yt = g.stateNode, ze = false;
              break t;
            case 3:
            case 4:
              Yt = g.stateNode.containerInfo, ze = true;
              break t;
          }
          g = g.return;
        }
        if (Yt === null) throw Error(r(160));
        fm(o, d, u), Yt = null, ze = false, o = u.alternate, o !== null && (o.return = null), u.return = null;
      }
      if (e.subtreeFlags & 13886) for (e = e.child; e !== null; ) mm(e, t), e = e.sibling;
    }
    var ln = null;
    function mm(t, e) {
      var n = t.alternate, l = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ce(e, t), we(t), l & 4 && (ti(3, t, t.return), vl(3, t), ti(5, t, t.return));
          break;
        case 1:
          Ce(e, t), we(t), l & 512 && (ne || n === null || mn(n, n.return)), l & 64 && Nn && (t = t.updateQueue, t !== null && (l = t.callbacks, l !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
          break;
        case 26:
          var u = ln;
          if (Ce(e, t), we(t), l & 512 && (ne || n === null || mn(n, n.return)), l & 4) {
            var o = n !== null ? n.memoizedState : null;
            if (l = t.memoizedState, n === null) if (l === null) if (t.stateNode === null) {
              t: {
                l = t.type, n = t.memoizedProps, u = u.ownerDocument || u;
                e: switch (l) {
                  case "title":
                    o = u.getElementsByTagName("title")[0], (!o || o[Qa] || o[fe] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = u.createElement(l), u.head.insertBefore(o, u.querySelector("head > title"))), pe(o, l, n), o[fe] = t, re(o), l = o;
                    break t;
                  case "link":
                    var d = mp("link", "href", u).get(l + (n.href || ""));
                    if (d) {
                      for (var g = 0; g < d.length; g++) if (o = d[g], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                        d.splice(g, 1);
                        break e;
                      }
                    }
                    o = u.createElement(l), pe(o, l, n), u.head.appendChild(o);
                    break;
                  case "meta":
                    if (d = mp("meta", "content", u).get(l + (n.content || ""))) {
                      for (g = 0; g < d.length; g++) if (o = d[g], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                        d.splice(g, 1);
                        break e;
                      }
                    }
                    o = u.createElement(l), pe(o, l, n), u.head.appendChild(o);
                    break;
                  default:
                    throw Error(r(468, l));
                }
                o[fe] = t, re(o), l = o;
              }
              t.stateNode = l;
            } else pp(u, t.type, t.stateNode);
            else t.stateNode = dp(u, l, t.memoizedProps);
            else o !== l ? (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, l === null ? pp(u, t.type, t.stateNode) : dp(u, l, t.memoizedProps)) : l === null && t.stateNode !== null && xo(t, t.memoizedProps, n.memoizedProps);
          }
          break;
        case 27:
          Ce(e, t), we(t), l & 512 && (ne || n === null || mn(n, n.return)), n !== null && l & 4 && xo(t, t.memoizedProps, n.memoizedProps);
          break;
        case 5:
          if (Ce(e, t), we(t), l & 512 && (ne || n === null || mn(n, n.return)), t.flags & 32) {
            u = t.stateNode;
            try {
              ta(u, "");
            } catch (P) {
              wt(t, t.return, P);
            }
          }
          l & 4 && t.stateNode != null && (u = t.memoizedProps, xo(t, u, n !== null ? n.memoizedProps : u)), l & 1024 && (Eo = true);
          break;
        case 6:
          if (Ce(e, t), we(t), l & 4) {
            if (t.stateNode === null) throw Error(r(162));
            l = t.memoizedProps, n = t.stateNode;
            try {
              n.nodeValue = l;
            } catch (P) {
              wt(t, t.return, P);
            }
          }
          break;
        case 3:
          if (sr = null, u = ln, ln = ar(e.containerInfo), Ce(e, t), ln = u, we(t), l & 4 && n !== null && n.memoizedState.isDehydrated) try {
            Ra(e.containerInfo);
          } catch (P) {
            wt(t, t.return, P);
          }
          Eo && (Eo = false, pm(t));
          break;
        case 4:
          l = ln, ln = ar(t.stateNode.containerInfo), Ce(e, t), we(t), ln = l;
          break;
        case 12:
          Ce(e, t), we(t);
          break;
        case 31:
          Ce(e, t), we(t), l & 4 && (l = t.updateQueue, l !== null && (t.updateQueue = null, Xs(t, l)));
          break;
        case 13:
          Ce(e, t), we(t), t.child.flags & 8192 && t.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Qs = $t()), l & 4 && (l = t.updateQueue, l !== null && (t.updateQueue = null, Xs(t, l)));
          break;
        case 22:
          u = t.memoizedState !== null;
          var x = n !== null && n.memoizedState !== null, D = Nn, N = ne;
          if (Nn = D || u, ne = N || x, Ce(e, t), ne = N, Nn = D, we(t), l & 8192) t: for (e = t.stateNode, e._visibility = u ? e._visibility & -2 : e._visibility | 1, u && (n === null || x || Nn || ne || Bi(t)), n = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26) {
              if (n === null) {
                x = n = e;
                try {
                  if (o = x.stateNode, u) d = o.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none";
                  else {
                    g = x.stateNode;
                    var U = x.memoizedProps.style, z = U != null && U.hasOwnProperty("display") ? U.display : null;
                    g.style.display = z == null || typeof z == "boolean" ? "" : ("" + z).trim();
                  }
                } catch (P) {
                  wt(x, x.return, P);
                }
              }
            } else if (e.tag === 6) {
              if (n === null) {
                x = e;
                try {
                  x.stateNode.nodeValue = u ? "" : x.memoizedProps;
                } catch (P) {
                  wt(x, x.return, P);
                }
              }
            } else if (e.tag === 18) {
              if (n === null) {
                x = e;
                try {
                  var R = x.stateNode;
                  u ? ap(R, true) : ap(x.stateNode, false);
                } catch (P) {
                  wt(x, x.return, P);
                }
              }
            } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              n === e && (n = null), e = e.return;
            }
            n === e && (n = null), e.sibling.return = e.return, e = e.sibling;
          }
          l & 4 && (l = t.updateQueue, l !== null && (n = l.retryQueue, n !== null && (l.retryQueue = null, Xs(t, n))));
          break;
        case 19:
          Ce(e, t), we(t), l & 4 && (l = t.updateQueue, l !== null && (t.updateQueue = null, Xs(t, l)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          Ce(e, t), we(t);
      }
    }
    function we(t) {
      var e = t.flags;
      if (e & 2) {
        try {
          for (var n, l = t.return; l !== null; ) {
            if (sm(l)) {
              n = l;
              break;
            }
            l = l.return;
          }
          if (n == null) throw Error(r(160));
          switch (n.tag) {
            case 27:
              var u = n.stateNode, o = To(t);
              ks(t, o, u);
              break;
            case 5:
              var d = n.stateNode;
              n.flags & 32 && (ta(d, ""), n.flags &= -33);
              var g = To(t);
              ks(t, g, d);
              break;
            case 3:
            case 4:
              var x = n.stateNode.containerInfo, D = To(t);
              Ao(t, D, x);
              break;
            default:
              throw Error(r(161));
          }
        } catch (N) {
          wt(t, t.return, N);
        }
        t.flags &= -3;
      }
      e & 4096 && (t.flags &= -4097);
    }
    function pm(t) {
      if (t.subtreeFlags & 1024) for (t = t.child; t !== null; ) {
        var e = t;
        pm(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
    }
    function Vn(t, e) {
      if (e.subtreeFlags & 8772) for (e = e.child; e !== null; ) om(t, e.alternate, e), e = e.sibling;
    }
    function Bi(t) {
      for (t = t.child; t !== null; ) {
        var e = t;
        switch (e.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            ti(4, e, e.return), Bi(e);
            break;
          case 1:
            mn(e, e.return);
            var n = e.stateNode;
            typeof n.componentWillUnmount == "function" && am(e, e.return, n), Bi(e);
            break;
          case 27:
            zl(e.stateNode);
          case 26:
          case 5:
            mn(e, e.return), Bi(e);
            break;
          case 22:
            e.memoizedState === null && Bi(e);
            break;
          case 30:
            Bi(e);
            break;
          default:
            Bi(e);
        }
        t = t.sibling;
      }
    }
    function Un(t, e, n) {
      for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
        var l = e.alternate, u = t, o = e, d = o.flags;
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            Un(u, o, n), vl(4, o);
            break;
          case 1:
            if (Un(u, o, n), l = o, u = l.stateNode, typeof u.componentDidMount == "function") try {
              u.componentDidMount();
            } catch (D) {
              wt(l, l.return, D);
            }
            if (l = o, u = l.updateQueue, u !== null) {
              var g = l.stateNode;
              try {
                var x = u.shared.hiddenCallbacks;
                if (x !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < x.length; u++) Qh(x[u], g);
              } catch (D) {
                wt(l, l.return, D);
              }
            }
            n && d & 64 && im(o), bl(o, o.return);
            break;
          case 27:
            rm(o);
          case 26:
          case 5:
            Un(u, o, n), n && l === null && d & 4 && lm(o), bl(o, o.return);
            break;
          case 12:
            Un(u, o, n);
            break;
          case 31:
            Un(u, o, n), n && d & 4 && hm(u, o);
            break;
          case 13:
            Un(u, o, n), n && d & 4 && dm(u, o);
            break;
          case 22:
            o.memoizedState === null && Un(u, o, n), bl(o, o.return);
            break;
          case 30:
            break;
          default:
            Un(u, o, n);
        }
        e = e.sibling;
      }
    }
    function _o(t, e) {
      var n = null;
      t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && ll(n));
    }
    function Mo(t, e) {
      t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && ll(t));
    }
    function sn(t, e, n, l) {
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) ym(t, e, n, l), e = e.sibling;
    }
    function ym(t, e, n, l) {
      var u = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          sn(t, e, n, l), u & 2048 && vl(9, e);
          break;
        case 1:
          sn(t, e, n, l);
          break;
        case 3:
          sn(t, e, n, l), u & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && ll(t)));
          break;
        case 12:
          if (u & 2048) {
            sn(t, e, n, l), t = e.stateNode;
            try {
              var o = e.memoizedProps, d = o.id, g = o.onPostCommit;
              typeof g == "function" && g(d, e.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0);
            } catch (x) {
              wt(e, e.return, x);
            }
          } else sn(t, e, n, l);
          break;
        case 31:
          sn(t, e, n, l);
          break;
        case 13:
          sn(t, e, n, l);
          break;
        case 23:
          break;
        case 22:
          o = e.stateNode, d = e.alternate, e.memoizedState !== null ? o._visibility & 2 ? sn(t, e, n, l) : Sl(t, e) : o._visibility & 2 ? sn(t, e, n, l) : (o._visibility |= 2, Sa(t, e, n, l, (e.subtreeFlags & 10256) !== 0 || false)), u & 2048 && _o(d, e);
          break;
        case 24:
          sn(t, e, n, l), u & 2048 && Mo(e.alternate, e);
          break;
        default:
          sn(t, e, n, l);
      }
    }
    function Sa(t, e, n, l, u) {
      for (u = u && ((e.subtreeFlags & 10256) !== 0 || false), e = e.child; e !== null; ) {
        var o = t, d = e, g = n, x = l, D = d.flags;
        switch (d.tag) {
          case 0:
          case 11:
          case 15:
            Sa(o, d, g, x, u), vl(8, d);
            break;
          case 23:
            break;
          case 22:
            var N = d.stateNode;
            d.memoizedState !== null ? N._visibility & 2 ? Sa(o, d, g, x, u) : Sl(o, d) : (N._visibility |= 2, Sa(o, d, g, x, u)), u && D & 2048 && _o(d.alternate, d);
            break;
          case 24:
            Sa(o, d, g, x, u), u && D & 2048 && Mo(d.alternate, d);
            break;
          default:
            Sa(o, d, g, x, u);
        }
        e = e.sibling;
      }
    }
    function Sl(t, e) {
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) {
        var n = t, l = e, u = l.flags;
        switch (l.tag) {
          case 22:
            Sl(n, l), u & 2048 && _o(l.alternate, l);
            break;
          case 24:
            Sl(n, l), u & 2048 && Mo(l.alternate, l);
            break;
          default:
            Sl(n, l);
        }
        e = e.sibling;
      }
    }
    var xl = 8192;
    function xa(t, e, n) {
      if (t.subtreeFlags & xl) for (t = t.child; t !== null; ) gm(t, e, n), t = t.sibling;
    }
    function gm(t, e, n) {
      switch (t.tag) {
        case 26:
          xa(t, e, n), t.flags & xl && t.memoizedState !== null && hb(n, ln, t.memoizedState, t.memoizedProps);
          break;
        case 5:
          xa(t, e, n);
          break;
        case 3:
        case 4:
          var l = ln;
          ln = ar(t.stateNode.containerInfo), xa(t, e, n), ln = l;
          break;
        case 22:
          t.memoizedState === null && (l = t.alternate, l !== null && l.memoizedState !== null ? (l = xl, xl = 16777216, xa(t, e, n), xl = l) : xa(t, e, n));
          break;
        default:
          xa(t, e, n);
      }
    }
    function vm(t) {
      var e = t.alternate;
      if (e !== null && (t = e.child, t !== null)) {
        e.child = null;
        do
          e = t.sibling, t.sibling = null, t = e;
        while (t !== null);
      }
    }
    function Tl(t) {
      var e = t.deletions;
      if ((t.flags & 16) !== 0) {
        if (e !== null) for (var n = 0; n < e.length; n++) {
          var l = e[n];
          ue = l, Sm(l, t);
        }
        vm(t);
      }
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) bm(t), t = t.sibling;
    }
    function bm(t) {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Tl(t), t.flags & 2048 && ti(9, t, t.return);
          break;
        case 3:
          Tl(t);
          break;
        case 12:
          Tl(t);
          break;
        case 22:
          var e = t.stateNode;
          t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, Ks(t)) : Tl(t);
          break;
        default:
          Tl(t);
      }
    }
    function Ks(t) {
      var e = t.deletions;
      if ((t.flags & 16) !== 0) {
        if (e !== null) for (var n = 0; n < e.length; n++) {
          var l = e[n];
          ue = l, Sm(l, t);
        }
        vm(t);
      }
      for (t = t.child; t !== null; ) {
        switch (e = t, e.tag) {
          case 0:
          case 11:
          case 15:
            ti(8, e, e.return), Ks(e);
            break;
          case 22:
            n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, Ks(e));
            break;
          default:
            Ks(e);
        }
        t = t.sibling;
      }
    }
    function Sm(t, e) {
      for (; ue !== null; ) {
        var n = ue;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            ti(8, n, e);
            break;
          case 23:
          case 22:
            if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
              var l = n.memoizedState.cachePool.pool;
              l != null && l.refCount++;
            }
            break;
          case 24:
            ll(n.memoizedState.cache);
        }
        if (l = n.child, l !== null) l.return = n, ue = l;
        else t: for (n = t; ue !== null; ) {
          l = ue;
          var u = l.sibling, o = l.return;
          if (cm(l), l === n) {
            ue = null;
            break t;
          }
          if (u !== null) {
            u.return = o, ue = u;
            break t;
          }
          ue = o;
        }
      }
    }
    var D1 = {
      getCacheForType: function(t) {
        var e = de(It), n = e.data.get(t);
        return n === void 0 && (n = t(), e.data.set(t, n)), n;
      },
      cacheSignal: function() {
        return de(It).controller.signal;
      }
    }, z1 = typeof WeakMap == "function" ? WeakMap : Map, Dt = 0, Ut = null, pt = null, gt = 0, Ct = 0, He = null, ei = false, Ta = false, Do = false, Ln = 0, Pt = 0, ni = 0, Hi = 0, zo = 0, Ge = 0, Aa = 0, Al = null, Re = null, Co = false, Qs = 0, xm = 0, Zs = 1 / 0, Ps = null, ii = null, ae = 0, ai = null, Ea = null, Bn = 0, wo = 0, Ro = null, Tm = null, El = 0, Oo = null;
    function qe() {
      return (Dt & 2) !== 0 && gt !== 0 ? gt & -gt : O.T !== null ? Bo() : Bf();
    }
    function Am() {
      if (Ge === 0) if ((gt & 536870912) === 0 || bt) {
        var t = ns;
        ns <<= 1, (ns & 3932160) === 0 && (ns = 262144), Ge = t;
      } else Ge = 536870912;
      return t = Le.current, t !== null && (t.flags |= 32), Ge;
    }
    function Oe(t, e, n) {
      (t === Ut && (Ct === 2 || Ct === 9) || t.cancelPendingCommit !== null) && (_a(t, 0), li(t, gt, Ge, false)), Ka(t, n), ((Dt & 2) === 0 || t !== Ut) && (t === Ut && ((Dt & 2) === 0 && (Hi |= n), Pt === 4 && li(t, gt, Ge, false)), pn(t));
    }
    function Em(t, e, n) {
      if ((Dt & 6) !== 0) throw Error(r(327));
      var l = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || Xa(t, e), u = l ? R1(t, e) : jo(t, e, true), o = l;
      do {
        if (u === 0) {
          Ta && !l && li(t, e, 0, false);
          break;
        } else {
          if (n = t.current.alternate, o && !C1(n)) {
            u = jo(t, e, false), o = false;
            continue;
          }
          if (u === 2) {
            if (o = e, t.errorRecoveryDisabledLanes & o) var d = 0;
            else d = t.pendingLanes & -536870913, d = d !== 0 ? d : d & 536870912 ? 536870912 : 0;
            if (d !== 0) {
              e = d;
              t: {
                var g = t;
                u = Al;
                var x = g.current.memoizedState.isDehydrated;
                if (x && (_a(g, d).flags |= 256), d = jo(g, d, false), d !== 2) {
                  if (Do && !x) {
                    g.errorRecoveryDisabledLanes |= o, Hi |= o, u = 4;
                    break t;
                  }
                  o = Re, Re = u, o !== null && (Re === null ? Re = o : Re.push.apply(Re, o));
                }
                u = d;
              }
              if (o = false, u !== 2) continue;
            }
          }
          if (u === 1) {
            _a(t, 0), li(t, e, 0, true);
            break;
          }
          t: {
            switch (l = t, o = u, o) {
              case 0:
              case 1:
                throw Error(r(345));
              case 4:
                if ((e & 4194048) !== e) break;
              case 6:
                li(l, e, Ge, !ei);
                break t;
              case 2:
                Re = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(r(329));
            }
            if ((e & 62914560) === e && (u = Qs + 300 - $t(), 10 < u)) {
              if (li(l, e, Ge, !ei), as(l, 0, true) !== 0) break t;
              Bn = e, l.timeoutHandle = ep(_m.bind(null, l, n, Re, Ps, Co, e, Ge, Hi, Aa, ei, o, "Throttled", -0, 0), u);
              break t;
            }
            _m(l, n, Re, Ps, Co, e, Ge, Hi, Aa, ei, o, null, -0, 0);
          }
        }
        break;
      } while (true);
      pn(t);
    }
    function _m(t, e, n, l, u, o, d, g, x, D, N, U, z, R) {
      if (t.timeoutHandle = -1, U = e.subtreeFlags, U & 8192 || (U & 16785408) === 16785408) {
        U = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: An
        }, gm(e, o, U);
        var P = (o & 62914560) === o ? Qs - $t() : (o & 4194048) === o ? xm - $t() : 0;
        if (P = db(U, P), P !== null) {
          Bn = o, t.cancelPendingCommit = P(Nm.bind(null, t, e, o, n, l, u, d, g, x, N, U, null, z, R)), li(t, o, d, !D);
          return;
        }
      }
      Nm(t, e, o, n, l, u, d, g, x);
    }
    function C1(t) {
      for (var e = t; ; ) {
        var n = e.tag;
        if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null))) for (var l = 0; l < n.length; l++) {
          var u = n[l], o = u.getSnapshot;
          u = u.value;
          try {
            if (!Ve(o(), u)) return false;
          } catch {
            return false;
          }
        }
        if (n = e.child, e.subtreeFlags & 16384 && n !== null) n.return = e, e = n;
        else {
          if (e === t) break;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) return true;
            e = e.return;
          }
          e.sibling.return = e.return, e = e.sibling;
        }
      }
      return true;
    }
    function li(t, e, n, l) {
      e &= ~zo, e &= ~Hi, t.suspendedLanes |= e, t.pingedLanes &= ~e, l && (t.warmLanes |= e), l = t.expirationTimes;
      for (var u = e; 0 < u; ) {
        var o = 31 - je(u), d = 1 << o;
        l[o] = -1, u &= ~d;
      }
      n !== 0 && Vf(t, n, e);
    }
    function Js() {
      return (Dt & 6) === 0 ? (_l(0), false) : true;
    }
    function No() {
      if (pt !== null) {
        if (Ct === 0) var t = pt.return;
        else t = pt, Dn = wi = null, Pu(t), pa = null, rl = 0, t = pt;
        for (; t !== null; ) nm(t.alternate, t), t = t.return;
        pt = null;
      }
    }
    function _a(t, e) {
      var n = t.timeoutHandle;
      n !== -1 && (t.timeoutHandle = -1, J1(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), Bn = 0, No(), Ut = t, pt = n = _n(t.current, null), gt = e, Ct = 0, He = null, ei = false, Ta = Xa(t, e), Do = false, Aa = Ge = zo = Hi = ni = Pt = 0, Re = Al = null, Co = false, (e & 8) !== 0 && (e |= e & 32);
      var l = t.entangledLanes;
      if (l !== 0) for (t = t.entanglements, l &= e; 0 < l; ) {
        var u = 31 - je(l), o = 1 << u;
        e |= t[u], l &= ~o;
      }
      return Ln = e, ys(), n;
    }
    function Mm(t, e) {
      ut = null, O.H = pl, e === ma || e === Es ? (e = Yh(), Ct = 3) : e === Uu ? (e = Yh(), Ct = 4) : Ct = e === co ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, He = e, pt === null && (Pt = 1, Bs(t, Ze(e, t.current)));
    }
    function Dm() {
      var t = Le.current;
      return t === null ? true : (gt & 4194048) === gt ? We === null : (gt & 62914560) === gt || (gt & 536870912) !== 0 ? t === We : false;
    }
    function zm() {
      var t = O.H;
      return O.H = pl, t === null ? pl : t;
    }
    function Cm() {
      var t = O.A;
      return O.A = D1, t;
    }
    function Fs() {
      Pt = 4, ei || (gt & 4194048) !== gt && Le.current !== null || (Ta = true), (ni & 134217727) === 0 && (Hi & 134217727) === 0 || Ut === null || li(Ut, gt, Ge, false);
    }
    function jo(t, e, n) {
      var l = Dt;
      Dt |= 2;
      var u = zm(), o = Cm();
      (Ut !== t || gt !== e) && (Ps = null, _a(t, e)), e = false;
      var d = Pt;
      t: do
        try {
          if (Ct !== 0 && pt !== null) {
            var g = pt, x = He;
            switch (Ct) {
              case 8:
                No(), d = 6;
                break t;
              case 3:
              case 2:
              case 9:
              case 6:
                Le.current === null && (e = true);
                var D = Ct;
                if (Ct = 0, He = null, Ma(t, g, x, D), n && Ta) {
                  d = 0;
                  break t;
                }
                break;
              default:
                D = Ct, Ct = 0, He = null, Ma(t, g, x, D);
            }
          }
          w1(), d = Pt;
          break;
        } catch (N) {
          Mm(t, N);
        }
      while (true);
      return e && t.shellSuspendCounter++, Dn = wi = null, Dt = l, O.H = u, O.A = o, pt === null && (Ut = null, gt = 0, ys()), d;
    }
    function w1() {
      for (; pt !== null; ) wm(pt);
    }
    function R1(t, e) {
      var n = Dt;
      Dt |= 2;
      var l = zm(), u = Cm();
      Ut !== t || gt !== e ? (Ps = null, Zs = $t() + 500, _a(t, e)) : Ta = Xa(t, e);
      t: do
        try {
          if (Ct !== 0 && pt !== null) {
            e = pt;
            var o = He;
            e: switch (Ct) {
              case 1:
                Ct = 0, He = null, Ma(t, e, o, 1);
                break;
              case 2:
              case 9:
                if (Gh(o)) {
                  Ct = 0, He = null, Rm(e);
                  break;
                }
                e = function() {
                  Ct !== 2 && Ct !== 9 || Ut !== t || (Ct = 7), pn(t);
                }, o.then(e, e);
                break t;
              case 3:
                Ct = 7;
                break t;
              case 4:
                Ct = 5;
                break t;
              case 7:
                Gh(o) ? (Ct = 0, He = null, Rm(e)) : (Ct = 0, He = null, Ma(t, e, o, 7));
                break;
              case 5:
                var d = null;
                switch (pt.tag) {
                  case 26:
                    d = pt.memoizedState;
                  case 5:
                  case 27:
                    var g = pt;
                    if (d ? yp(d) : g.stateNode.complete) {
                      Ct = 0, He = null;
                      var x = g.sibling;
                      if (x !== null) pt = x;
                      else {
                        var D = g.return;
                        D !== null ? (pt = D, Ws(D)) : pt = null;
                      }
                      break e;
                    }
                }
                Ct = 0, He = null, Ma(t, e, o, 5);
                break;
              case 6:
                Ct = 0, He = null, Ma(t, e, o, 6);
                break;
              case 8:
                No(), Pt = 6;
                break t;
              default:
                throw Error(r(462));
            }
          }
          O1();
          break;
        } catch (N) {
          Mm(t, N);
        }
      while (true);
      return Dn = wi = null, O.H = l, O.A = u, Dt = n, pt !== null ? 0 : (Ut = null, gt = 0, ys(), Pt);
    }
    function O1() {
      for (; pt !== null && !be(); ) wm(pt);
    }
    function wm(t) {
      var e = tm(t.alternate, t, Ln);
      t.memoizedProps = t.pendingProps, e === null ? Ws(t) : pt = e;
    }
    function Rm(t) {
      var e = t, n = e.alternate;
      switch (e.tag) {
        case 15:
        case 0:
          e = Pd(n, e, e.pendingProps, e.type, void 0, gt);
          break;
        case 11:
          e = Pd(n, e, e.pendingProps, e.type.render, e.ref, gt);
          break;
        case 5:
          Pu(e);
        default:
          nm(n, e), e = pt = Ch(e, Ln), e = tm(n, e, Ln);
      }
      t.memoizedProps = t.pendingProps, e === null ? Ws(t) : pt = e;
    }
    function Ma(t, e, n, l) {
      Dn = wi = null, Pu(e), pa = null, rl = 0;
      var u = e.return;
      try {
        if (S1(t, u, e, n, gt)) {
          Pt = 1, Bs(t, Ze(n, t.current)), pt = null;
          return;
        }
      } catch (o) {
        if (u !== null) throw pt = u, o;
        Pt = 1, Bs(t, Ze(n, t.current)), pt = null;
        return;
      }
      e.flags & 32768 ? (bt || l === 1 ? t = true : Ta || (gt & 536870912) !== 0 ? t = false : (ei = t = true, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Le.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Om(e, t)) : Ws(e);
    }
    function Ws(t) {
      var e = t;
      do {
        if ((e.flags & 32768) !== 0) {
          Om(e, ei);
          return;
        }
        t = e.return;
        var n = A1(e.alternate, e, Ln);
        if (n !== null) {
          pt = n;
          return;
        }
        if (e = e.sibling, e !== null) {
          pt = e;
          return;
        }
        pt = e = t;
      } while (e !== null);
      Pt === 0 && (Pt = 5);
    }
    function Om(t, e) {
      do {
        var n = E1(t.alternate, t);
        if (n !== null) {
          n.flags &= 32767, pt = n;
          return;
        }
        if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
          pt = t;
          return;
        }
        pt = t = n;
      } while (t !== null);
      Pt = 6, pt = null;
    }
    function Nm(t, e, n, l, u, o, d, g, x) {
      t.cancelPendingCommit = null;
      do
        $s();
      while (ae !== 0);
      if ((Dt & 6) !== 0) throw Error(r(327));
      if (e !== null) {
        if (e === t.current) throw Error(r(177));
        if (o = e.lanes | e.childLanes, o |= xu, fv(t, n, o, d, g, x), t === Ut && (pt = Ut = null, gt = 0), Ea = e, ai = t, Bn = n, wo = o, Ro = u, Tm = l, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, U1(xi, function() {
          return Bm(), null;
        })) : (t.callbackNode = null, t.callbackPriority = 0), l = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || l) {
          l = O.T, O.T = null, u = Y.p, Y.p = 2, d = Dt, Dt |= 4;
          try {
            _1(t, e, n);
          } finally {
            Dt = d, Y.p = u, O.T = l;
          }
        }
        ae = 1, jm(), Vm(), Um();
      }
    }
    function jm() {
      if (ae === 1) {
        ae = 0;
        var t = ai, e = Ea, n = (e.flags & 13878) !== 0;
        if ((e.subtreeFlags & 13878) !== 0 || n) {
          n = O.T, O.T = null;
          var l = Y.p;
          Y.p = 2;
          var u = Dt;
          Dt |= 4;
          try {
            mm(e, t);
            var o = Qo, d = Sh(t.containerInfo), g = o.focusedElem, x = o.selectionRange;
            if (d !== g && g && g.ownerDocument && bh(g.ownerDocument.documentElement, g)) {
              if (x !== null && yu(g)) {
                var D = x.start, N = x.end;
                if (N === void 0 && (N = D), "selectionStart" in g) g.selectionStart = D, g.selectionEnd = Math.min(N, g.value.length);
                else {
                  var U = g.ownerDocument || document, z = U && U.defaultView || window;
                  if (z.getSelection) {
                    var R = z.getSelection(), P = g.textContent.length, at = Math.min(x.start, P), Nt = x.end === void 0 ? at : Math.min(x.end, P);
                    !R.extend && at > Nt && (d = Nt, Nt = at, at = d);
                    var E = vh(g, at), A = vh(g, Nt);
                    if (E && A && (R.rangeCount !== 1 || R.anchorNode !== E.node || R.anchorOffset !== E.offset || R.focusNode !== A.node || R.focusOffset !== A.offset)) {
                      var M = U.createRange();
                      M.setStart(E.node, E.offset), R.removeAllRanges(), at > Nt ? (R.addRange(M), R.extend(A.node, A.offset)) : (M.setEnd(A.node, A.offset), R.addRange(M));
                    }
                  }
                }
              }
              for (U = [], R = g; R = R.parentNode; ) R.nodeType === 1 && U.push({
                element: R,
                left: R.scrollLeft,
                top: R.scrollTop
              });
              for (typeof g.focus == "function" && g.focus(), g = 0; g < U.length; g++) {
                var j = U[g];
                j.element.scrollLeft = j.left, j.element.scrollTop = j.top;
              }
            }
            cr = !!Ko, Qo = Ko = null;
          } finally {
            Dt = u, Y.p = l, O.T = n;
          }
        }
        t.current = e, ae = 2;
      }
    }
    function Vm() {
      if (ae === 2) {
        ae = 0;
        var t = ai, e = Ea, n = (e.flags & 8772) !== 0;
        if ((e.subtreeFlags & 8772) !== 0 || n) {
          n = O.T, O.T = null;
          var l = Y.p;
          Y.p = 2;
          var u = Dt;
          Dt |= 4;
          try {
            om(t, e.alternate, e);
          } finally {
            Dt = u, Y.p = l, O.T = n;
          }
        }
        ae = 3;
      }
    }
    function Um() {
      if (ae === 4 || ae === 3) {
        ae = 0, Si();
        var t = ai, e = Ea, n = Bn, l = Tm;
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? ae = 5 : (ae = 0, Ea = ai = null, Lm(t, t.pendingLanes));
        var u = t.pendingLanes;
        if (u === 0 && (ii = null), Wr(n), e = e.stateNode, Ne && typeof Ne.onCommitFiberRoot == "function") try {
          Ne.onCommitFiberRoot(ka, e, void 0, (e.current.flags & 128) === 128);
        } catch {
        }
        if (l !== null) {
          e = O.T, u = Y.p, Y.p = 2, O.T = null;
          try {
            for (var o = t.onRecoverableError, d = 0; d < l.length; d++) {
              var g = l[d];
              o(g.value, {
                componentStack: g.stack
              });
            }
          } finally {
            O.T = e, Y.p = u;
          }
        }
        (Bn & 3) !== 0 && $s(), pn(t), u = t.pendingLanes, (n & 261930) !== 0 && (u & 42) !== 0 ? t === Oo ? El++ : (El = 0, Oo = t) : El = 0, _l(0);
      }
    }
    function Lm(t, e) {
      (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, ll(e)));
    }
    function $s() {
      return jm(), Vm(), Um(), Bm();
    }
    function Bm() {
      if (ae !== 5) return false;
      var t = ai, e = wo;
      wo = 0;
      var n = Wr(Bn), l = O.T, u = Y.p;
      try {
        Y.p = 32 > n ? 32 : n, O.T = null, n = Ro, Ro = null;
        var o = ai, d = Bn;
        if (ae = 0, Ea = ai = null, Bn = 0, (Dt & 6) !== 0) throw Error(r(331));
        var g = Dt;
        if (Dt |= 4, bm(o.current), ym(o, o.current, d, n), Dt = g, _l(0, false), Ne && typeof Ne.onPostCommitFiberRoot == "function") try {
          Ne.onPostCommitFiberRoot(ka, o);
        } catch {
        }
        return true;
      } finally {
        Y.p = u, O.T = l, Lm(t, e);
      }
    }
    function Hm(t, e, n) {
      e = Ze(n, e), e = oo(t.stateNode, e, 2), t = Wn(t, e, 2), t !== null && (Ka(t, 2), pn(t));
    }
    function wt(t, e, n) {
      if (t.tag === 3) Hm(t, t, n);
      else for (; e !== null; ) {
        if (e.tag === 3) {
          Hm(e, t, n);
          break;
        } else if (e.tag === 1) {
          var l = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (ii === null || !ii.has(l))) {
            t = Ze(n, t), n = Gd(2), l = Wn(e, n, 2), l !== null && (qd(n, l, e, t), Ka(l, 2), pn(l));
            break;
          }
        }
        e = e.return;
      }
    }
    function Vo(t, e, n) {
      var l = t.pingCache;
      if (l === null) {
        l = t.pingCache = new z1();
        var u = /* @__PURE__ */ new Set();
        l.set(e, u);
      } else u = l.get(e), u === void 0 && (u = /* @__PURE__ */ new Set(), l.set(e, u));
      u.has(n) || (Do = true, u.add(n), t = N1.bind(null, t, e, n), e.then(t, t));
    }
    function N1(t, e, n) {
      var l = t.pingCache;
      l !== null && l.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, Ut === t && (gt & n) === n && (Pt === 4 || Pt === 3 && (gt & 62914560) === gt && 300 > $t() - Qs ? (Dt & 2) === 0 && _a(t, 0) : zo |= n, Aa === gt && (Aa = 0)), pn(t);
    }
    function Gm(t, e) {
      e === 0 && (e = jf()), t = Di(t, e), t !== null && (Ka(t, e), pn(t));
    }
    function j1(t) {
      var e = t.memoizedState, n = 0;
      e !== null && (n = e.retryLane), Gm(t, n);
    }
    function V1(t, e) {
      var n = 0;
      switch (t.tag) {
        case 31:
        case 13:
          var l = t.stateNode, u = t.memoizedState;
          u !== null && (n = u.retryLane);
          break;
        case 19:
          l = t.stateNode;
          break;
        case 22:
          l = t.stateNode._retryCache;
          break;
        default:
          throw Error(r(314));
      }
      l !== null && l.delete(e), Gm(t, n);
    }
    function U1(t, e) {
      return _e(t, e);
    }
    var Is = null, Da = null, Uo = false, tr = false, Lo = false, si = 0;
    function pn(t) {
      t !== Da && t.next === null && (Da === null ? Is = Da = t : Da = Da.next = t), tr = true, Uo || (Uo = true, B1());
    }
    function _l(t, e) {
      if (!Lo && tr) {
        Lo = true;
        do
          for (var n = false, l = Is; l !== null; ) {
            if (t !== 0) {
              var u = l.pendingLanes;
              if (u === 0) var o = 0;
              else {
                var d = l.suspendedLanes, g = l.pingedLanes;
                o = (1 << 31 - je(42 | t) + 1) - 1, o &= u & ~(d & ~g), o = o & 201326741 ? o & 201326741 | 1 : o ? o | 2 : 0;
              }
              o !== 0 && (n = true, Xm(l, o));
            } else o = gt, o = as(l, l === Ut ? o : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1), (o & 3) === 0 || Xa(l, o) || (n = true, Xm(l, o));
            l = l.next;
          }
        while (n);
        Lo = false;
      }
    }
    function L1() {
      qm();
    }
    function qm() {
      tr = Uo = false;
      var t = 0;
      si !== 0 && P1() && (t = si);
      for (var e = $t(), n = null, l = Is; l !== null; ) {
        var u = l.next, o = Ym(l, e);
        o === 0 ? (l.next = null, n === null ? Is = u : n.next = u, u === null && (Da = n)) : (n = l, (t !== 0 || (o & 3) !== 0) && (tr = true)), l = u;
      }
      ae !== 0 && ae !== 5 || _l(t), si !== 0 && (si = 0);
    }
    function Ym(t, e) {
      for (var n = t.suspendedLanes, l = t.pingedLanes, u = t.expirationTimes, o = t.pendingLanes & -62914561; 0 < o; ) {
        var d = 31 - je(o), g = 1 << d, x = u[d];
        x === -1 ? ((g & n) === 0 || (g & l) !== 0) && (u[d] = cv(g, e)) : x <= e && (t.expiredLanes |= g), o &= ~g;
      }
      if (e = Ut, n = gt, n = as(t, t === e ? n : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), l = t.callbackNode, n === 0 || t === e && (Ct === 2 || Ct === 9) || t.cancelPendingCommit !== null) return l !== null && l !== null && fn(l), t.callbackNode = null, t.callbackPriority = 0;
      if ((n & 3) === 0 || Xa(t, n)) {
        if (e = n & -n, e === t.callbackPriority) return e;
        switch (l !== null && fn(l), Wr(n)) {
          case 2:
          case 8:
            n = Ya;
            break;
          case 32:
            n = xi;
            break;
          case 268435456:
            n = Nf;
            break;
          default:
            n = xi;
        }
        return l = km.bind(null, t), n = _e(n, l), t.callbackPriority = e, t.callbackNode = n, e;
      }
      return l !== null && l !== null && fn(l), t.callbackPriority = 2, t.callbackNode = null, 2;
    }
    function km(t, e) {
      if (ae !== 0 && ae !== 5) return t.callbackNode = null, t.callbackPriority = 0, null;
      var n = t.callbackNode;
      if ($s() && t.callbackNode !== n) return null;
      var l = gt;
      return l = as(t, t === Ut ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), l === 0 ? null : (Em(t, l, e), Ym(t, $t()), t.callbackNode != null && t.callbackNode === n ? km.bind(null, t) : null);
    }
    function Xm(t, e) {
      if ($s()) return null;
      Em(t, e, true);
    }
    function B1() {
      F1(function() {
        (Dt & 6) !== 0 ? _e(Zr, L1) : qm();
      });
    }
    function Bo() {
      if (si === 0) {
        var t = ha;
        t === 0 && (t = es, es <<= 1, (es & 261888) === 0 && (es = 256)), si = t;
      }
      return si;
    }
    function Km(t) {
      return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : us("" + t);
    }
    function Qm(t, e) {
      var n = e.ownerDocument.createElement("input");
      return n.name = e.name, n.value = e.value, t.id && n.setAttribute("form", t.id), e.parentNode.insertBefore(n, e), t = new FormData(t), n.parentNode.removeChild(n), t;
    }
    function H1(t, e, n, l, u) {
      if (e === "submit" && n && n.stateNode === u) {
        var o = Km((u[Me] || null).action), d = l.submitter;
        d && (e = (e = d[Me] || null) ? Km(e.formAction) : d.getAttribute("formAction"), e !== null && (o = e, d = null));
        var g = new hs("action", "action", null, l, u);
        t.push({
          event: g,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (l.defaultPrevented) {
                  if (si !== 0) {
                    var x = d ? Qm(u, d) : new FormData(u);
                    io(n, {
                      pending: true,
                      data: x,
                      method: u.method,
                      action: o
                    }, null, x);
                  }
                } else typeof o == "function" && (g.preventDefault(), x = d ? Qm(u, d) : new FormData(u), io(n, {
                  pending: true,
                  data: x,
                  method: u.method,
                  action: o
                }, o, x));
              },
              currentTarget: u
            }
          ]
        });
      }
    }
    for (var Ho = 0; Ho < Su.length; Ho++) {
      var Go = Su[Ho], G1 = Go.toLowerCase(), q1 = Go[0].toUpperCase() + Go.slice(1);
      an(G1, "on" + q1);
    }
    an(Ah, "onAnimationEnd"), an(Eh, "onAnimationIteration"), an(_h, "onAnimationStart"), an("dblclick", "onDoubleClick"), an("focusin", "onFocus"), an("focusout", "onBlur"), an(i1, "onTransitionRun"), an(a1, "onTransitionStart"), an(l1, "onTransitionCancel"), an(Mh, "onTransitionEnd"), $i("onMouseEnter", [
      "mouseout",
      "mouseover"
    ]), $i("onMouseLeave", [
      "mouseout",
      "mouseover"
    ]), $i("onPointerEnter", [
      "pointerout",
      "pointerover"
    ]), $i("onPointerLeave", [
      "pointerout",
      "pointerover"
    ]), Ai("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ai("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ai("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]), Ai("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ai("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ai("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var Ml = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Y1 = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ml));
    function Zm(t, e) {
      e = (e & 4) !== 0;
      for (var n = 0; n < t.length; n++) {
        var l = t[n], u = l.event;
        l = l.listeners;
        t: {
          var o = void 0;
          if (e) for (var d = l.length - 1; 0 <= d; d--) {
            var g = l[d], x = g.instance, D = g.currentTarget;
            if (g = g.listener, x !== o && u.isPropagationStopped()) break t;
            o = g, u.currentTarget = D;
            try {
              o(u);
            } catch (N) {
              ps(N);
            }
            u.currentTarget = null, o = x;
          }
          else for (d = 0; d < l.length; d++) {
            if (g = l[d], x = g.instance, D = g.currentTarget, g = g.listener, x !== o && u.isPropagationStopped()) break t;
            o = g, u.currentTarget = D;
            try {
              o(u);
            } catch (N) {
              ps(N);
            }
            u.currentTarget = null, o = x;
          }
        }
      }
    }
    function yt(t, e) {
      var n = e[$r];
      n === void 0 && (n = e[$r] = /* @__PURE__ */ new Set());
      var l = t + "__bubble";
      n.has(l) || (Pm(e, t, 2, false), n.add(l));
    }
    function qo(t, e, n) {
      var l = 0;
      e && (l |= 4), Pm(n, t, l, e);
    }
    var er = "_reactListening" + Math.random().toString(36).slice(2);
    function Yo(t) {
      if (!t[er]) {
        t[er] = true, qf.forEach(function(n) {
          n !== "selectionchange" && (Y1.has(n) || qo(n, false, t), qo(n, true, t));
        });
        var e = t.nodeType === 9 ? t : t.ownerDocument;
        e === null || e[er] || (e[er] = true, qo("selectionchange", false, e));
      }
    }
    function Pm(t, e, n, l) {
      switch (Ap(e)) {
        case 2:
          var u = yb;
          break;
        case 8:
          u = gb;
          break;
        default:
          u = ic;
      }
      n = u.bind(null, e, n, t), u = void 0, !ru || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (u = true), l ? u !== void 0 ? t.addEventListener(e, n, {
        capture: true,
        passive: u
      }) : t.addEventListener(e, n, true) : u !== void 0 ? t.addEventListener(e, n, {
        passive: u
      }) : t.addEventListener(e, n, false);
    }
    function ko(t, e, n, l, u) {
      var o = l;
      if ((e & 1) === 0 && (e & 2) === 0 && l !== null) t: for (; ; ) {
        if (l === null) return;
        var d = l.tag;
        if (d === 3 || d === 4) {
          var g = l.stateNode.containerInfo;
          if (g === u) break;
          if (d === 4) for (d = l.return; d !== null; ) {
            var x = d.tag;
            if ((x === 3 || x === 4) && d.stateNode.containerInfo === u) return;
            d = d.return;
          }
          for (; g !== null; ) {
            if (d = Ji(g), d === null) return;
            if (x = d.tag, x === 5 || x === 6 || x === 26 || x === 27) {
              l = o = d;
              continue t;
            }
            g = g.parentNode;
          }
        }
        l = l.return;
      }
      If(function() {
        var D = o, N = lu(n), U = [];
        t: {
          var z = Dh.get(t);
          if (z !== void 0) {
            var R = hs, P = t;
            switch (t) {
              case "keypress":
                if (cs(n) === 0) break t;
              case "keydown":
              case "keyup":
                R = Vv;
                break;
              case "focusin":
                P = "focus", R = fu;
                break;
              case "focusout":
                P = "blur", R = fu;
                break;
              case "beforeblur":
              case "afterblur":
                R = fu;
                break;
              case "click":
                if (n.button === 2) break t;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                R = nh;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                R = Av;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                R = Bv;
                break;
              case Ah:
              case Eh:
              case _h:
                R = Mv;
                break;
              case Mh:
                R = Gv;
                break;
              case "scroll":
              case "scrollend":
                R = xv;
                break;
              case "wheel":
                R = Yv;
                break;
              case "copy":
              case "cut":
              case "paste":
                R = zv;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                R = ah;
                break;
              case "toggle":
              case "beforetoggle":
                R = Xv;
            }
            var at = (e & 4) !== 0, Nt = !at && (t === "scroll" || t === "scrollend"), E = at ? z !== null ? z + "Capture" : null : z;
            at = [];
            for (var A = D, M; A !== null; ) {
              var j = A;
              if (M = j.stateNode, j = j.tag, j !== 5 && j !== 26 && j !== 27 || M === null || E === null || (j = Pa(A, E), j != null && at.push(Dl(A, j, M))), Nt) break;
              A = A.return;
            }
            0 < at.length && (z = new R(z, P, null, n, N), U.push({
              event: z,
              listeners: at
            }));
          }
        }
        if ((e & 7) === 0) {
          t: {
            if (z = t === "mouseover" || t === "pointerover", R = t === "mouseout" || t === "pointerout", z && n !== au && (P = n.relatedTarget || n.fromElement) && (Ji(P) || P[Pi])) break t;
            if ((R || z) && (z = N.window === N ? N : (z = N.ownerDocument) ? z.defaultView || z.parentWindow : window, R ? (P = n.relatedTarget || n.toElement, R = D, P = P ? Ji(P) : null, P !== null && (Nt = f(P), at = P.tag, P !== Nt || at !== 5 && at !== 27 && at !== 6) && (P = null)) : (R = null, P = D), R !== P)) {
              if (at = nh, j = "onMouseLeave", E = "onMouseEnter", A = "mouse", (t === "pointerout" || t === "pointerover") && (at = ah, j = "onPointerLeave", E = "onPointerEnter", A = "pointer"), Nt = R == null ? z : Za(R), M = P == null ? z : Za(P), z = new at(j, A + "leave", R, n, N), z.target = Nt, z.relatedTarget = M, j = null, Ji(N) === D && (at = new at(E, A + "enter", P, n, N), at.target = M, at.relatedTarget = Nt, j = at), Nt = j, R && P) e: {
                for (at = k1, E = R, A = P, M = 0, j = E; j; j = at(j)) M++;
                j = 0;
                for (var tt = A; tt; tt = at(tt)) j++;
                for (; 0 < M - j; ) E = at(E), M--;
                for (; 0 < j - M; ) A = at(A), j--;
                for (; M--; ) {
                  if (E === A || A !== null && E === A.alternate) {
                    at = E;
                    break e;
                  }
                  E = at(E), A = at(A);
                }
                at = null;
              }
              else at = null;
              R !== null && Jm(U, z, R, at, false), P !== null && Nt !== null && Jm(U, Nt, P, at, true);
            }
          }
          t: {
            if (z = D ? Za(D) : window, R = z.nodeName && z.nodeName.toLowerCase(), R === "select" || R === "input" && z.type === "file") var Et = hh;
            else if (ch(z)) if (dh) Et = t1;
            else {
              Et = $v;
              var W = Wv;
            }
            else R = z.nodeName, !R || R.toLowerCase() !== "input" || z.type !== "checkbox" && z.type !== "radio" ? D && iu(D.elementType) && (Et = hh) : Et = Iv;
            if (Et && (Et = Et(t, D))) {
              fh(U, Et, n, N);
              break t;
            }
            W && W(t, z, D), t === "focusout" && D && z.type === "number" && D.memoizedProps.value != null && nu(z, "number", z.value);
          }
          switch (W = D ? Za(D) : window, t) {
            case "focusin":
              (ch(W) || W.contentEditable === "true") && (aa = W, gu = D, nl = null);
              break;
            case "focusout":
              nl = gu = aa = null;
              break;
            case "mousedown":
              vu = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              vu = false, xh(U, n, N);
              break;
            case "selectionchange":
              if (n1) break;
            case "keydown":
            case "keyup":
              xh(U, n, N);
          }
          var ct;
          if (du) t: {
            switch (t) {
              case "compositionstart":
                var vt = "onCompositionStart";
                break t;
              case "compositionend":
                vt = "onCompositionEnd";
                break t;
              case "compositionupdate":
                vt = "onCompositionUpdate";
                break t;
            }
            vt = void 0;
          }
          else ia ? uh(t, n) && (vt = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (vt = "onCompositionStart");
          vt && (lh && n.locale !== "ko" && (ia || vt !== "onCompositionStart" ? vt === "onCompositionEnd" && ia && (ct = th()) : (Xn = N, uu = "value" in Xn ? Xn.value : Xn.textContent, ia = true)), W = nr(D, vt), 0 < W.length && (vt = new ih(vt, t, null, n, N), U.push({
            event: vt,
            listeners: W
          }), ct ? vt.data = ct : (ct = oh(n), ct !== null && (vt.data = ct)))), (ct = Qv ? Zv(t, n) : Pv(t, n)) && (vt = nr(D, "onBeforeInput"), 0 < vt.length && (W = new ih("onBeforeInput", "beforeinput", null, n, N), U.push({
            event: W,
            listeners: vt
          }), W.data = ct)), H1(U, t, D, n, N);
        }
        Zm(U, e);
      });
    }
    function Dl(t, e, n) {
      return {
        instance: t,
        listener: e,
        currentTarget: n
      };
    }
    function nr(t, e) {
      for (var n = e + "Capture", l = []; t !== null; ) {
        var u = t, o = u.stateNode;
        if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || o === null || (u = Pa(t, n), u != null && l.unshift(Dl(t, u, o)), u = Pa(t, e), u != null && l.push(Dl(t, u, o))), t.tag === 3) return l;
        t = t.return;
      }
      return [];
    }
    function k1(t) {
      if (t === null) return null;
      do
        t = t.return;
      while (t && t.tag !== 5 && t.tag !== 27);
      return t || null;
    }
    function Jm(t, e, n, l, u) {
      for (var o = e._reactName, d = []; n !== null && n !== l; ) {
        var g = n, x = g.alternate, D = g.stateNode;
        if (g = g.tag, x !== null && x === l) break;
        g !== 5 && g !== 26 && g !== 27 || D === null || (x = D, u ? (D = Pa(n, o), D != null && d.unshift(Dl(n, D, x))) : u || (D = Pa(n, o), D != null && d.push(Dl(n, D, x)))), n = n.return;
      }
      d.length !== 0 && t.push({
        event: e,
        listeners: d
      });
    }
    var X1 = /\r\n?/g, K1 = /\u0000|\uFFFD/g;
    function Fm(t) {
      return (typeof t == "string" ? t : "" + t).replace(X1, `
`).replace(K1, "");
    }
    function Wm(t, e) {
      return e = Fm(e), Fm(t) === e;
    }
    function Ot(t, e, n, l, u, o) {
      switch (n) {
        case "children":
          typeof l == "string" ? e === "body" || e === "textarea" && l === "" || ta(t, l) : (typeof l == "number" || typeof l == "bigint") && e !== "body" && ta(t, "" + l);
          break;
        case "className":
          ss(t, "class", l);
          break;
        case "tabIndex":
          ss(t, "tabindex", l);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          ss(t, n, l);
          break;
        case "style":
          Wf(t, l, o);
          break;
        case "data":
          if (e !== "object") {
            ss(t, "data", l);
            break;
          }
        case "src":
        case "href":
          if (l === "" && (e !== "a" || n !== "href")) {
            t.removeAttribute(n);
            break;
          }
          if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
            t.removeAttribute(n);
            break;
          }
          l = us("" + l), t.setAttribute(n, l);
          break;
        case "action":
        case "formAction":
          if (typeof l == "function") {
            t.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break;
          } else typeof o == "function" && (n === "formAction" ? (e !== "input" && Ot(t, e, "name", u.name, u, null), Ot(t, e, "formEncType", u.formEncType, u, null), Ot(t, e, "formMethod", u.formMethod, u, null), Ot(t, e, "formTarget", u.formTarget, u, null)) : (Ot(t, e, "encType", u.encType, u, null), Ot(t, e, "method", u.method, u, null), Ot(t, e, "target", u.target, u, null)));
          if (l == null || typeof l == "symbol" || typeof l == "boolean") {
            t.removeAttribute(n);
            break;
          }
          l = us("" + l), t.setAttribute(n, l);
          break;
        case "onClick":
          l != null && (t.onclick = An);
          break;
        case "onScroll":
          l != null && yt("scroll", t);
          break;
        case "onScrollEnd":
          l != null && yt("scrollend", t);
          break;
        case "dangerouslySetInnerHTML":
          if (l != null) {
            if (typeof l != "object" || !("__html" in l)) throw Error(r(61));
            if (n = l.__html, n != null) {
              if (u.children != null) throw Error(r(60));
              t.innerHTML = n;
            }
          }
          break;
        case "multiple":
          t.multiple = l && typeof l != "function" && typeof l != "symbol";
          break;
        case "muted":
          t.muted = l && typeof l != "function" && typeof l != "symbol";
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
            t.removeAttribute("xlink:href");
            break;
          }
          n = us("" + l), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, "" + l) : t.removeAttribute(n);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          l && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
          break;
        case "capture":
        case "download":
          l === true ? t.setAttribute(n, "") : l !== false && l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, l) : t.removeAttribute(n);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? t.setAttribute(n, l) : t.removeAttribute(n);
          break;
        case "rowSpan":
        case "start":
          l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? t.removeAttribute(n) : t.setAttribute(n, l);
          break;
        case "popover":
          yt("beforetoggle", t), yt("toggle", t), ls(t, "popover", l);
          break;
        case "xlinkActuate":
          Tn(t, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
          break;
        case "xlinkArcrole":
          Tn(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
          break;
        case "xlinkRole":
          Tn(t, "http://www.w3.org/1999/xlink", "xlink:role", l);
          break;
        case "xlinkShow":
          Tn(t, "http://www.w3.org/1999/xlink", "xlink:show", l);
          break;
        case "xlinkTitle":
          Tn(t, "http://www.w3.org/1999/xlink", "xlink:title", l);
          break;
        case "xlinkType":
          Tn(t, "http://www.w3.org/1999/xlink", "xlink:type", l);
          break;
        case "xmlBase":
          Tn(t, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
          break;
        case "xmlLang":
          Tn(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
          break;
        case "xmlSpace":
          Tn(t, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
          break;
        case "is":
          ls(t, "is", l);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = bv.get(n) || n, ls(t, n, l));
      }
    }
    function Xo(t, e, n, l, u, o) {
      switch (n) {
        case "style":
          Wf(t, l, o);
          break;
        case "dangerouslySetInnerHTML":
          if (l != null) {
            if (typeof l != "object" || !("__html" in l)) throw Error(r(61));
            if (n = l.__html, n != null) {
              if (u.children != null) throw Error(r(60));
              t.innerHTML = n;
            }
          }
          break;
        case "children":
          typeof l == "string" ? ta(t, l) : (typeof l == "number" || typeof l == "bigint") && ta(t, "" + l);
          break;
        case "onScroll":
          l != null && yt("scroll", t);
          break;
        case "onScrollEnd":
          l != null && yt("scrollend", t);
          break;
        case "onClick":
          l != null && (t.onclick = An);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!Yf.hasOwnProperty(n)) t: {
            if (n[0] === "o" && n[1] === "n" && (u = n.endsWith("Capture"), e = n.slice(2, u ? n.length - 7 : void 0), o = t[Me] || null, o = o != null ? o[n] : null, typeof o == "function" && t.removeEventListener(e, o, u), typeof l == "function")) {
              typeof o != "function" && o !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(e, l, u);
              break t;
            }
            n in t ? t[n] = l : l === true ? t.setAttribute(n, "") : ls(t, n, l);
          }
      }
    }
    function pe(t, e, n) {
      switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          yt("error", t), yt("load", t);
          var l = false, u = false, o;
          for (o in n) if (n.hasOwnProperty(o)) {
            var d = n[o];
            if (d != null) switch (o) {
              case "src":
                l = true;
                break;
              case "srcSet":
                u = true;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                Ot(t, e, o, d, n, null);
            }
          }
          u && Ot(t, e, "srcSet", n.srcSet, n, null), l && Ot(t, e, "src", n.src, n, null);
          return;
        case "input":
          yt("invalid", t);
          var g = o = d = u = null, x = null, D = null;
          for (l in n) if (n.hasOwnProperty(l)) {
            var N = n[l];
            if (N != null) switch (l) {
              case "name":
                u = N;
                break;
              case "type":
                d = N;
                break;
              case "checked":
                x = N;
                break;
              case "defaultChecked":
                D = N;
                break;
              case "value":
                o = N;
                break;
              case "defaultValue":
                g = N;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (N != null) throw Error(r(137, e));
                break;
              default:
                Ot(t, e, l, N, n, null);
            }
          }
          Zf(t, o, g, x, D, d, u, false);
          return;
        case "select":
          yt("invalid", t), l = d = o = null;
          for (u in n) if (n.hasOwnProperty(u) && (g = n[u], g != null)) switch (u) {
            case "value":
              o = g;
              break;
            case "defaultValue":
              d = g;
              break;
            case "multiple":
              l = g;
            default:
              Ot(t, e, u, g, n, null);
          }
          e = o, n = d, t.multiple = !!l, e != null ? Ii(t, !!l, e, false) : n != null && Ii(t, !!l, n, true);
          return;
        case "textarea":
          yt("invalid", t), o = u = l = null;
          for (d in n) if (n.hasOwnProperty(d) && (g = n[d], g != null)) switch (d) {
            case "value":
              l = g;
              break;
            case "defaultValue":
              u = g;
              break;
            case "children":
              o = g;
              break;
            case "dangerouslySetInnerHTML":
              if (g != null) throw Error(r(91));
              break;
            default:
              Ot(t, e, d, g, n, null);
          }
          Jf(t, l, u, o);
          return;
        case "option":
          for (x in n) if (n.hasOwnProperty(x) && (l = n[x], l != null)) switch (x) {
            case "selected":
              t.selected = l && typeof l != "function" && typeof l != "symbol";
              break;
            default:
              Ot(t, e, x, l, n, null);
          }
          return;
        case "dialog":
          yt("beforetoggle", t), yt("toggle", t), yt("cancel", t), yt("close", t);
          break;
        case "iframe":
        case "object":
          yt("load", t);
          break;
        case "video":
        case "audio":
          for (l = 0; l < Ml.length; l++) yt(Ml[l], t);
          break;
        case "image":
          yt("error", t), yt("load", t);
          break;
        case "details":
          yt("toggle", t);
          break;
        case "embed":
        case "source":
        case "link":
          yt("error", t), yt("load", t);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (D in n) if (n.hasOwnProperty(D) && (l = n[D], l != null)) switch (D) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(r(137, e));
            default:
              Ot(t, e, D, l, n, null);
          }
          return;
        default:
          if (iu(e)) {
            for (N in n) n.hasOwnProperty(N) && (l = n[N], l !== void 0 && Xo(t, e, N, l, n, void 0));
            return;
          }
      }
      for (g in n) n.hasOwnProperty(g) && (l = n[g], l != null && Ot(t, e, g, l, n, null));
    }
    function Q1(t, e, n, l) {
      switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var u = null, o = null, d = null, g = null, x = null, D = null, N = null;
          for (R in n) {
            var U = n[R];
            if (n.hasOwnProperty(R) && U != null) switch (R) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                x = U;
              default:
                l.hasOwnProperty(R) || Ot(t, e, R, null, l, U);
            }
          }
          for (var z in l) {
            var R = l[z];
            if (U = n[z], l.hasOwnProperty(z) && (R != null || U != null)) switch (z) {
              case "type":
                o = R;
                break;
              case "name":
                u = R;
                break;
              case "checked":
                D = R;
                break;
              case "defaultChecked":
                N = R;
                break;
              case "value":
                d = R;
                break;
              case "defaultValue":
                g = R;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null) throw Error(r(137, e));
                break;
              default:
                R !== U && Ot(t, e, z, R, l, U);
            }
          }
          eu(t, d, g, x, D, N, o, u);
          return;
        case "select":
          R = d = g = z = null;
          for (o in n) if (x = n[o], n.hasOwnProperty(o) && x != null) switch (o) {
            case "value":
              break;
            case "multiple":
              R = x;
            default:
              l.hasOwnProperty(o) || Ot(t, e, o, null, l, x);
          }
          for (u in l) if (o = l[u], x = n[u], l.hasOwnProperty(u) && (o != null || x != null)) switch (u) {
            case "value":
              z = o;
              break;
            case "defaultValue":
              g = o;
              break;
            case "multiple":
              d = o;
            default:
              o !== x && Ot(t, e, u, o, l, x);
          }
          e = g, n = d, l = R, z != null ? Ii(t, !!n, z, false) : !!l != !!n && (e != null ? Ii(t, !!n, e, true) : Ii(t, !!n, n ? [] : "", false));
          return;
        case "textarea":
          R = z = null;
          for (g in n) if (u = n[g], n.hasOwnProperty(g) && u != null && !l.hasOwnProperty(g)) switch (g) {
            case "value":
              break;
            case "children":
              break;
            default:
              Ot(t, e, g, null, l, u);
          }
          for (d in l) if (u = l[d], o = n[d], l.hasOwnProperty(d) && (u != null || o != null)) switch (d) {
            case "value":
              z = u;
              break;
            case "defaultValue":
              R = u;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (u != null) throw Error(r(91));
              break;
            default:
              u !== o && Ot(t, e, d, u, l, o);
          }
          Pf(t, z, R);
          return;
        case "option":
          for (var P in n) if (z = n[P], n.hasOwnProperty(P) && z != null && !l.hasOwnProperty(P)) switch (P) {
            case "selected":
              t.selected = false;
              break;
            default:
              Ot(t, e, P, null, l, z);
          }
          for (x in l) if (z = l[x], R = n[x], l.hasOwnProperty(x) && z !== R && (z != null || R != null)) switch (x) {
            case "selected":
              t.selected = z && typeof z != "function" && typeof z != "symbol";
              break;
            default:
              Ot(t, e, x, z, l, R);
          }
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var at in n) z = n[at], n.hasOwnProperty(at) && z != null && !l.hasOwnProperty(at) && Ot(t, e, at, null, l, z);
          for (D in l) if (z = l[D], R = n[D], l.hasOwnProperty(D) && z !== R && (z != null || R != null)) switch (D) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (z != null) throw Error(r(137, e));
              break;
            default:
              Ot(t, e, D, z, l, R);
          }
          return;
        default:
          if (iu(e)) {
            for (var Nt in n) z = n[Nt], n.hasOwnProperty(Nt) && z !== void 0 && !l.hasOwnProperty(Nt) && Xo(t, e, Nt, void 0, l, z);
            for (N in l) z = l[N], R = n[N], !l.hasOwnProperty(N) || z === R || z === void 0 && R === void 0 || Xo(t, e, N, z, l, R);
            return;
          }
      }
      for (var E in n) z = n[E], n.hasOwnProperty(E) && z != null && !l.hasOwnProperty(E) && Ot(t, e, E, null, l, z);
      for (U in l) z = l[U], R = n[U], !l.hasOwnProperty(U) || z === R || z == null && R == null || Ot(t, e, U, z, l, R);
    }
    function $m(t) {
      switch (t) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return true;
        default:
          return false;
      }
    }
    function Z1() {
      if (typeof performance.getEntriesByType == "function") {
        for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
          var u = n[l], o = u.transferSize, d = u.initiatorType, g = u.duration;
          if (o && g && $m(d)) {
            for (d = 0, g = u.responseEnd, l += 1; l < n.length; l++) {
              var x = n[l], D = x.startTime;
              if (D > g) break;
              var N = x.transferSize, U = x.initiatorType;
              N && $m(U) && (x = x.responseEnd, d += N * (x < g ? 1 : (g - D) / (x - D)));
            }
            if (--l, e += 8 * (o + d) / (u.duration / 1e3), t++, 10 < t) break;
          }
        }
        if (0 < t) return e / t / 1e6;
      }
      return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
    }
    var Ko = null, Qo = null;
    function ir(t) {
      return t.nodeType === 9 ? t : t.ownerDocument;
    }
    function Im(t) {
      switch (t) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function tp(t, e) {
      if (t === 0) switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
      return t === 1 && e === "foreignObject" ? 0 : t;
    }
    function Zo(t, e) {
      return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
    }
    var Po = null;
    function P1() {
      var t = window.event;
      return t && t.type === "popstate" ? t === Po ? false : (Po = t, true) : (Po = null, false);
    }
    var ep = typeof setTimeout == "function" ? setTimeout : void 0, J1 = typeof clearTimeout == "function" ? clearTimeout : void 0, np = typeof Promise == "function" ? Promise : void 0, F1 = typeof queueMicrotask == "function" ? queueMicrotask : typeof np < "u" ? function(t) {
      return np.resolve(null).then(t).catch(W1);
    } : ep;
    function W1(t) {
      setTimeout(function() {
        throw t;
      });
    }
    function ri(t) {
      return t === "head";
    }
    function ip(t, e) {
      var n = e, l = 0;
      do {
        var u = n.nextSibling;
        if (t.removeChild(n), u && u.nodeType === 8) if (n = u.data, n === "/$" || n === "/&") {
          if (l === 0) {
            t.removeChild(u), Ra(e);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") l++;
        else if (n === "html") zl(t.ownerDocument.documentElement);
        else if (n === "head") {
          n = t.ownerDocument.head, zl(n);
          for (var o = n.firstChild; o; ) {
            var d = o.nextSibling, g = o.nodeName;
            o[Qa] || g === "SCRIPT" || g === "STYLE" || g === "LINK" && o.rel.toLowerCase() === "stylesheet" || n.removeChild(o), o = d;
          }
        } else n === "body" && zl(t.ownerDocument.body);
        n = u;
      } while (n);
      Ra(e);
    }
    function ap(t, e) {
      var n = t;
      t = 0;
      do {
        var l = n.nextSibling;
        if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), l && l.nodeType === 8) if (n = l.data, n === "/$") {
          if (t === 0) break;
          t--;
        } else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
        n = l;
      } while (n);
    }
    function Jo(t) {
      var e = t.firstChild;
      for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
        var n = e;
        switch (e = e.nextSibling, n.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            Jo(n), Ir(n);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (n.rel.toLowerCase() === "stylesheet") continue;
        }
        t.removeChild(n);
      }
    }
    function $1(t, e, n, l) {
      for (; t.nodeType === 1; ) {
        var u = n;
        if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
          if (!l && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
        } else if (l) {
          if (!t[Qa]) switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (o = t.getAttribute("rel"), o === "stylesheet" && t.hasAttribute("data-precedence")) break;
              if (o !== u.rel || t.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || t.getAttribute("title") !== (u.title == null ? null : u.title)) break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (o = t.getAttribute("src"), (o !== (u.src == null ? null : u.src) || t.getAttribute("type") !== (u.type == null ? null : u.type) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && o && t.hasAttribute("async") && !t.hasAttribute("itemprop")) break;
              return t;
            default:
              return t;
          }
        } else if (e === "input" && t.type === "hidden") {
          var o = u.name == null ? null : "" + u.name;
          if (u.type === "hidden" && t.getAttribute("name") === o) return t;
        } else return t;
        if (t = $e(t.nextSibling), t === null) break;
      }
      return null;
    }
    function I1(t, e, n) {
      if (e === "") return null;
      for (; t.nodeType !== 3; ) if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = $e(t.nextSibling), t === null)) return null;
      return t;
    }
    function lp(t, e) {
      for (; t.nodeType !== 8; ) if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = $e(t.nextSibling), t === null)) return null;
      return t;
    }
    function Fo(t) {
      return t.data === "$?" || t.data === "$~";
    }
    function Wo(t) {
      return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
    }
    function tb(t, e) {
      var n = t.ownerDocument;
      if (t.data === "$~") t._reactRetry = e;
      else if (t.data !== "$?" || n.readyState !== "loading") e();
      else {
        var l = function() {
          e(), n.removeEventListener("DOMContentLoaded", l);
        };
        n.addEventListener("DOMContentLoaded", l), t._reactRetry = l;
      }
    }
    function $e(t) {
      for (; t != null; t = t.nextSibling) {
        var e = t.nodeType;
        if (e === 1 || e === 3) break;
        if (e === 8) {
          if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F") break;
          if (e === "/$" || e === "/&") return null;
        }
      }
      return t;
    }
    var $o = null;
    function sp(t) {
      t = t.nextSibling;
      for (var e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "/$" || n === "/&") {
            if (e === 0) return $e(t.nextSibling);
            e--;
          } else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function rp(t) {
      t = t.previousSibling;
      for (var e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
            if (e === 0) return t;
            e--;
          } else n !== "/$" && n !== "/&" || e++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function up(t, e, n) {
      switch (e = ir(n), t) {
        case "html":
          if (t = e.documentElement, !t) throw Error(r(452));
          return t;
        case "head":
          if (t = e.head, !t) throw Error(r(453));
          return t;
        case "body":
          if (t = e.body, !t) throw Error(r(454));
          return t;
        default:
          throw Error(r(451));
      }
    }
    function zl(t) {
      for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
      Ir(t);
    }
    var Ie = /* @__PURE__ */ new Map(), op = /* @__PURE__ */ new Set();
    function ar(t) {
      return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
    }
    var Hn = Y.d;
    Y.d = {
      f: eb,
      r: nb,
      D: ib,
      C: ab,
      L: lb,
      m: sb,
      X: ub,
      S: rb,
      M: ob
    };
    function eb() {
      var t = Hn.f(), e = Js();
      return t || e;
    }
    function nb(t) {
      var e = Fi(t);
      e !== null && e.tag === 5 && e.type === "form" ? Md(e) : Hn.r(t);
    }
    var za = typeof document > "u" ? null : document;
    function cp(t, e, n) {
      var l = za;
      if (l && typeof e == "string" && e) {
        var u = Ke(e);
        u = 'link[rel="' + t + '"][href="' + u + '"]', typeof n == "string" && (u += '[crossorigin="' + n + '"]'), op.has(u) || (op.add(u), t = {
          rel: t,
          crossOrigin: n,
          href: e
        }, l.querySelector(u) === null && (e = l.createElement("link"), pe(e, "link", t), re(e), l.head.appendChild(e)));
      }
    }
    function ib(t) {
      Hn.D(t), cp("dns-prefetch", t, null);
    }
    function ab(t, e) {
      Hn.C(t, e), cp("preconnect", t, e);
    }
    function lb(t, e, n) {
      Hn.L(t, e, n);
      var l = za;
      if (l && t && e) {
        var u = 'link[rel="preload"][as="' + Ke(e) + '"]';
        e === "image" && n && n.imageSrcSet ? (u += '[imagesrcset="' + Ke(n.imageSrcSet) + '"]', typeof n.imageSizes == "string" && (u += '[imagesizes="' + Ke(n.imageSizes) + '"]')) : u += '[href="' + Ke(t) + '"]';
        var o = u;
        switch (e) {
          case "style":
            o = Ca(t);
            break;
          case "script":
            o = wa(t);
        }
        Ie.has(o) || (t = b({
          rel: "preload",
          href: e === "image" && n && n.imageSrcSet ? void 0 : t,
          as: e
        }, n), Ie.set(o, t), l.querySelector(u) !== null || e === "style" && l.querySelector(Cl(o)) || e === "script" && l.querySelector(wl(o)) || (e = l.createElement("link"), pe(e, "link", t), re(e), l.head.appendChild(e)));
      }
    }
    function sb(t, e) {
      Hn.m(t, e);
      var n = za;
      if (n && t) {
        var l = e && typeof e.as == "string" ? e.as : "script", u = 'link[rel="modulepreload"][as="' + Ke(l) + '"][href="' + Ke(t) + '"]', o = u;
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            o = wa(t);
        }
        if (!Ie.has(o) && (t = b({
          rel: "modulepreload",
          href: t
        }, e), Ie.set(o, t), n.querySelector(u) === null)) {
          switch (l) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (n.querySelector(wl(o))) return;
          }
          l = n.createElement("link"), pe(l, "link", t), re(l), n.head.appendChild(l);
        }
      }
    }
    function rb(t, e, n) {
      Hn.S(t, e, n);
      var l = za;
      if (l && t) {
        var u = Wi(l).hoistableStyles, o = Ca(t);
        e = e || "default";
        var d = u.get(o);
        if (!d) {
          var g = {
            loading: 0,
            preload: null
          };
          if (d = l.querySelector(Cl(o))) g.loading = 5;
          else {
            t = b({
              rel: "stylesheet",
              href: t,
              "data-precedence": e
            }, n), (n = Ie.get(o)) && Io(t, n);
            var x = d = l.createElement("link");
            re(x), pe(x, "link", t), x._p = new Promise(function(D, N) {
              x.onload = D, x.onerror = N;
            }), x.addEventListener("load", function() {
              g.loading |= 1;
            }), x.addEventListener("error", function() {
              g.loading |= 2;
            }), g.loading |= 4, lr(d, e, l);
          }
          d = {
            type: "stylesheet",
            instance: d,
            count: 1,
            state: g
          }, u.set(o, d);
        }
      }
    }
    function ub(t, e) {
      Hn.X(t, e);
      var n = za;
      if (n && t) {
        var l = Wi(n).hoistableScripts, u = wa(t), o = l.get(u);
        o || (o = n.querySelector(wl(u)), o || (t = b({
          src: t,
          async: true
        }, e), (e = Ie.get(u)) && tc(t, e), o = n.createElement("script"), re(o), pe(o, "link", t), n.head.appendChild(o)), o = {
          type: "script",
          instance: o,
          count: 1,
          state: null
        }, l.set(u, o));
      }
    }
    function ob(t, e) {
      Hn.M(t, e);
      var n = za;
      if (n && t) {
        var l = Wi(n).hoistableScripts, u = wa(t), o = l.get(u);
        o || (o = n.querySelector(wl(u)), o || (t = b({
          src: t,
          async: true,
          type: "module"
        }, e), (e = Ie.get(u)) && tc(t, e), o = n.createElement("script"), re(o), pe(o, "link", t), n.head.appendChild(o)), o = {
          type: "script",
          instance: o,
          count: 1,
          state: null
        }, l.set(u, o));
      }
    }
    function fp(t, e, n, l) {
      var u = (u = ht.current) ? ar(u) : null;
      if (!u) throw Error(r(446));
      switch (t) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof n.precedence == "string" && typeof n.href == "string" ? (e = Ca(n.href), n = Wi(u).hoistableStyles, l = n.get(e), l || (l = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, n.set(e, l)), l) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        case "link":
          if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
            t = Ca(n.href);
            var o = Wi(u).hoistableStyles, d = o.get(t);
            if (d || (u = u.ownerDocument || u, d = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: {
                loading: 0,
                preload: null
              }
            }, o.set(t, d), (o = u.querySelector(Cl(t))) && !o._p && (d.instance = o, d.state.loading = 5), Ie.has(t) || (n = {
              rel: "preload",
              as: "style",
              href: n.href,
              crossOrigin: n.crossOrigin,
              integrity: n.integrity,
              media: n.media,
              hrefLang: n.hrefLang,
              referrerPolicy: n.referrerPolicy
            }, Ie.set(t, n), o || cb(u, t, n, d.state))), e && l === null) throw Error(r(528, ""));
            return d;
          }
          if (e && l !== null) throw Error(r(529, ""));
          return null;
        case "script":
          return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = wa(n), n = Wi(u).hoistableScripts, l = n.get(e), l || (l = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, n.set(e, l)), l) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        default:
          throw Error(r(444, t));
      }
    }
    function Ca(t) {
      return 'href="' + Ke(t) + '"';
    }
    function Cl(t) {
      return 'link[rel="stylesheet"][' + t + "]";
    }
    function hp(t) {
      return b({}, t, {
        "data-precedence": t.precedence,
        precedence: null
      });
    }
    function cb(t, e, n, l) {
      t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? l.loading = 1 : (e = t.createElement("link"), l.preload = e, e.addEventListener("load", function() {
        return l.loading |= 1;
      }), e.addEventListener("error", function() {
        return l.loading |= 2;
      }), pe(e, "link", n), re(e), t.head.appendChild(e));
    }
    function wa(t) {
      return '[src="' + Ke(t) + '"]';
    }
    function wl(t) {
      return "script[async]" + t;
    }
    function dp(t, e, n) {
      if (e.count++, e.instance === null) switch (e.type) {
        case "style":
          var l = t.querySelector('style[data-href~="' + Ke(n.href) + '"]');
          if (l) return e.instance = l, re(l), l;
          var u = b({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (t.ownerDocument || t).createElement("style"), re(l), pe(l, "style", u), lr(l, n.precedence, t), e.instance = l;
        case "stylesheet":
          u = Ca(n.href);
          var o = t.querySelector(Cl(u));
          if (o) return e.state.loading |= 4, e.instance = o, re(o), o;
          l = hp(n), (u = Ie.get(u)) && Io(l, u), o = (t.ownerDocument || t).createElement("link"), re(o);
          var d = o;
          return d._p = new Promise(function(g, x) {
            d.onload = g, d.onerror = x;
          }), pe(o, "link", l), e.state.loading |= 4, lr(o, n.precedence, t), e.instance = o;
        case "script":
          return o = wa(n.src), (u = t.querySelector(wl(o))) ? (e.instance = u, re(u), u) : (l = n, (u = Ie.get(o)) && (l = b({}, n), tc(l, u)), t = t.ownerDocument || t, u = t.createElement("script"), re(u), pe(u, "link", l), t.head.appendChild(u), e.instance = u);
        case "void":
          return null;
        default:
          throw Error(r(443, e.type));
      }
      else e.type === "stylesheet" && (e.state.loading & 4) === 0 && (l = e.instance, e.state.loading |= 4, lr(l, n.precedence, t));
      return e.instance;
    }
    function lr(t, e, n) {
      for (var l = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = l.length ? l[l.length - 1] : null, o = u, d = 0; d < l.length; d++) {
        var g = l[d];
        if (g.dataset.precedence === e) o = g;
        else if (o !== u) break;
      }
      o ? o.parentNode.insertBefore(t, o.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
    }
    function Io(t, e) {
      t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
    }
    function tc(t, e) {
      t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
    }
    var sr = null;
    function mp(t, e, n) {
      if (sr === null) {
        var l = /* @__PURE__ */ new Map(), u = sr = /* @__PURE__ */ new Map();
        u.set(n, l);
      } else u = sr, l = u.get(n), l || (l = /* @__PURE__ */ new Map(), u.set(n, l));
      if (l.has(t)) return l;
      for (l.set(t, null), n = n.getElementsByTagName(t), u = 0; u < n.length; u++) {
        var o = n[u];
        if (!(o[Qa] || o[fe] || t === "link" && o.getAttribute("rel") === "stylesheet") && o.namespaceURI !== "http://www.w3.org/2000/svg") {
          var d = o.getAttribute(e) || "";
          d = t + d;
          var g = l.get(d);
          g ? g.push(o) : l.set(d, [
            o
          ]);
        }
      }
      return l;
    }
    function pp(t, e, n) {
      t = t.ownerDocument || t, t.head.insertBefore(n, e === "title" ? t.querySelector("head > title") : null);
    }
    function fb(t, e, n) {
      if (n === 1 || e.itemProp != null) return false;
      switch (t) {
        case "meta":
        case "title":
          return true;
        case "style":
          if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
          return true;
        case "link":
          if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError) break;
          switch (e.rel) {
            case "stylesheet":
              return t = e.disabled, typeof e.precedence == "string" && t == null;
            default:
              return true;
          }
        case "script":
          if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string") return true;
      }
      return false;
    }
    function yp(t) {
      return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
    }
    function hb(t, e, n, l) {
      if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== false) && (n.state.loading & 4) === 0) {
        if (n.instance === null) {
          var u = Ca(l.href), o = e.querySelector(Cl(u));
          if (o) {
            e = o._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = rr.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = o, re(o);
            return;
          }
          o = e.ownerDocument || e, l = hp(l), (u = Ie.get(u)) && Io(l, u), o = o.createElement("link"), re(o);
          var d = o;
          d._p = new Promise(function(g, x) {
            d.onload = g, d.onerror = x;
          }), pe(o, "link", l), n.instance = o;
        }
        t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = rr.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
      }
    }
    var ec = 0;
    function db(t, e) {
      return t.stylesheets && t.count === 0 && or(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
        var l = setTimeout(function() {
          if (t.stylesheets && or(t, t.stylesheets), t.unsuspend) {
            var o = t.unsuspend;
            t.unsuspend = null, o();
          }
        }, 6e4 + e);
        0 < t.imgBytes && ec === 0 && (ec = 62500 * Z1());
        var u = setTimeout(function() {
          if (t.waitingForImages = false, t.count === 0 && (t.stylesheets && or(t, t.stylesheets), t.unsuspend)) {
            var o = t.unsuspend;
            t.unsuspend = null, o();
          }
        }, (t.imgBytes > ec ? 50 : 800) + e);
        return t.unsuspend = n, function() {
          t.unsuspend = null, clearTimeout(l), clearTimeout(u);
        };
      } : null;
    }
    function rr() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets) or(this, this.stylesheets);
        else if (this.unsuspend) {
          var t = this.unsuspend;
          this.unsuspend = null, t();
        }
      }
    }
    var ur = null;
    function or(t, e) {
      t.stylesheets = null, t.unsuspend !== null && (t.count++, ur = /* @__PURE__ */ new Map(), e.forEach(mb, t), ur = null, rr.call(t));
    }
    function mb(t, e) {
      if (!(e.state.loading & 4)) {
        var n = ur.get(t);
        if (n) var l = n.get(null);
        else {
          n = /* @__PURE__ */ new Map(), ur.set(t, n);
          for (var u = t.querySelectorAll("link[data-precedence],style[data-precedence]"), o = 0; o < u.length; o++) {
            var d = u[o];
            (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (n.set(d.dataset.precedence, d), l = d);
          }
          l && n.set(null, l);
        }
        u = e.instance, d = u.getAttribute("data-precedence"), o = n.get(d) || l, o === l && n.set(null, u), n.set(d, u), this.count++, l = rr.bind(this), u.addEventListener("load", l), u.addEventListener("error", l), o ? o.parentNode.insertBefore(u, o.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(u, t.firstChild)), e.state.loading |= 4;
      }
    }
    var Rl = {
      $$typeof: G,
      Provider: null,
      Consumer: null,
      _currentValue: K,
      _currentValue2: K,
      _threadCount: 0
    };
    function pb(t, e, n, l, u, o, d, g, x) {
      this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Jr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Jr(0), this.hiddenUpdates = Jr(null), this.identifierPrefix = l, this.onUncaughtError = u, this.onCaughtError = o, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = x, this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function gp(t, e, n, l, u, o, d, g, x, D, N, U) {
      return t = new pb(t, e, n, d, x, D, N, U, g), e = 1, o === true && (e |= 24), o = Ue(3, null, null, e), t.current = o, o.stateNode = t, e = Nu(), e.refCount++, t.pooledCache = e, e.refCount++, o.memoizedState = {
        element: l,
        isDehydrated: n,
        cache: e
      }, Lu(o), t;
    }
    function vp(t) {
      return t ? (t = ra, t) : ra;
    }
    function bp(t, e, n, l, u, o) {
      u = vp(u), l.context === null ? l.context = u : l.pendingContext = u, l = Fn(e), l.payload = {
        element: n
      }, o = o === void 0 ? null : o, o !== null && (l.callback = o), n = Wn(t, l, e), n !== null && (Oe(n, t, e), ol(n, t, e));
    }
    function Sp(t, e) {
      if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
        var n = t.retryLane;
        t.retryLane = n !== 0 && n < e ? n : e;
      }
    }
    function nc(t, e) {
      Sp(t, e), (t = t.alternate) && Sp(t, e);
    }
    function xp(t) {
      if (t.tag === 13 || t.tag === 31) {
        var e = Di(t, 67108864);
        e !== null && Oe(e, t, 67108864), nc(t, 67108864);
      }
    }
    function Tp(t) {
      if (t.tag === 13 || t.tag === 31) {
        var e = qe();
        e = Fr(e);
        var n = Di(t, e);
        n !== null && Oe(n, t, e), nc(t, e);
      }
    }
    var cr = true;
    function yb(t, e, n, l) {
      var u = O.T;
      O.T = null;
      var o = Y.p;
      try {
        Y.p = 2, ic(t, e, n, l);
      } finally {
        Y.p = o, O.T = u;
      }
    }
    function gb(t, e, n, l) {
      var u = O.T;
      O.T = null;
      var o = Y.p;
      try {
        Y.p = 8, ic(t, e, n, l);
      } finally {
        Y.p = o, O.T = u;
      }
    }
    function ic(t, e, n, l) {
      if (cr) {
        var u = ac(l);
        if (u === null) ko(t, e, l, fr, n), Ep(t, l);
        else if (bb(u, t, e, n, l)) l.stopPropagation();
        else if (Ep(t, l), e & 4 && -1 < vb.indexOf(t)) {
          for (; u !== null; ) {
            var o = Fi(u);
            if (o !== null) switch (o.tag) {
              case 3:
                if (o = o.stateNode, o.current.memoizedState.isDehydrated) {
                  var d = Ti(o.pendingLanes);
                  if (d !== 0) {
                    var g = o;
                    for (g.pendingLanes |= 2, g.entangledLanes |= 2; d; ) {
                      var x = 1 << 31 - je(d);
                      g.entanglements[1] |= x, d &= ~x;
                    }
                    pn(o), (Dt & 6) === 0 && (Zs = $t() + 500, _l(0));
                  }
                }
                break;
              case 31:
              case 13:
                g = Di(o, 2), g !== null && Oe(g, o, 2), Js(), nc(o, 2);
            }
            if (o = ac(l), o === null && ko(t, e, l, fr, n), o === u) break;
            u = o;
          }
          u !== null && l.stopPropagation();
        } else ko(t, e, l, null, n);
      }
    }
    function ac(t) {
      return t = lu(t), lc(t);
    }
    var fr = null;
    function lc(t) {
      if (fr = null, t = Ji(t), t !== null) {
        var e = f(t);
        if (e === null) t = null;
        else {
          var n = e.tag;
          if (n === 13) {
            if (t = h(e), t !== null) return t;
            t = null;
          } else if (n === 31) {
            if (t = m(e), t !== null) return t;
            t = null;
          } else if (n === 3) {
            if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
            t = null;
          } else e !== t && (t = null);
        }
      }
      return fr = t, null;
    }
    function Ap(t) {
      switch (t) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (Qr()) {
            case Zr:
              return 2;
            case Ya:
              return 8;
            case xi:
            case Pr:
              return 32;
            case Nf:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var sc = false, ui = null, oi = null, ci = null, Ol = /* @__PURE__ */ new Map(), Nl = /* @__PURE__ */ new Map(), fi = [], vb = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function Ep(t, e) {
      switch (t) {
        case "focusin":
        case "focusout":
          ui = null;
          break;
        case "dragenter":
        case "dragleave":
          oi = null;
          break;
        case "mouseover":
        case "mouseout":
          ci = null;
          break;
        case "pointerover":
        case "pointerout":
          Ol.delete(e.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Nl.delete(e.pointerId);
      }
    }
    function jl(t, e, n, l, u, o) {
      return t === null || t.nativeEvent !== o ? (t = {
        blockedOn: e,
        domEventName: n,
        eventSystemFlags: l,
        nativeEvent: o,
        targetContainers: [
          u
        ]
      }, e !== null && (e = Fi(e), e !== null && xp(e)), t) : (t.eventSystemFlags |= l, e = t.targetContainers, u !== null && e.indexOf(u) === -1 && e.push(u), t);
    }
    function bb(t, e, n, l, u) {
      switch (e) {
        case "focusin":
          return ui = jl(ui, t, e, n, l, u), true;
        case "dragenter":
          return oi = jl(oi, t, e, n, l, u), true;
        case "mouseover":
          return ci = jl(ci, t, e, n, l, u), true;
        case "pointerover":
          var o = u.pointerId;
          return Ol.set(o, jl(Ol.get(o) || null, t, e, n, l, u)), true;
        case "gotpointercapture":
          return o = u.pointerId, Nl.set(o, jl(Nl.get(o) || null, t, e, n, l, u)), true;
      }
      return false;
    }
    function _p(t) {
      var e = Ji(t.target);
      if (e !== null) {
        var n = f(e);
        if (n !== null) {
          if (e = n.tag, e === 13) {
            if (e = h(n), e !== null) {
              t.blockedOn = e, Hf(t.priority, function() {
                Tp(n);
              });
              return;
            }
          } else if (e === 31) {
            if (e = m(n), e !== null) {
              t.blockedOn = e, Hf(t.priority, function() {
                Tp(n);
              });
              return;
            }
          } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
            t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      t.blockedOn = null;
    }
    function hr(t) {
      if (t.blockedOn !== null) return false;
      for (var e = t.targetContainers; 0 < e.length; ) {
        var n = ac(t.nativeEvent);
        if (n === null) {
          n = t.nativeEvent;
          var l = new n.constructor(n.type, n);
          au = l, n.target.dispatchEvent(l), au = null;
        } else return e = Fi(n), e !== null && xp(e), t.blockedOn = n, false;
        e.shift();
      }
      return true;
    }
    function Mp(t, e, n) {
      hr(t) && n.delete(e);
    }
    function Sb() {
      sc = false, ui !== null && hr(ui) && (ui = null), oi !== null && hr(oi) && (oi = null), ci !== null && hr(ci) && (ci = null), Ol.forEach(Mp), Nl.forEach(Mp);
    }
    function dr(t, e) {
      t.blockedOn === e && (t.blockedOn = null, sc || (sc = true, i.unstable_scheduleCallback(i.unstable_NormalPriority, Sb)));
    }
    var mr = null;
    function Dp(t) {
      mr !== t && (mr = t, i.unstable_scheduleCallback(i.unstable_NormalPriority, function() {
        mr === t && (mr = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e], l = t[e + 1], u = t[e + 2];
          if (typeof l != "function") {
            if (lc(l || n) === null) continue;
            break;
          }
          var o = Fi(n);
          o !== null && (t.splice(e, 3), e -= 3, io(o, {
            pending: true,
            data: u,
            method: n.method,
            action: l
          }, l, u));
        }
      }));
    }
    function Ra(t) {
      function e(x) {
        return dr(x, t);
      }
      ui !== null && dr(ui, t), oi !== null && dr(oi, t), ci !== null && dr(ci, t), Ol.forEach(e), Nl.forEach(e);
      for (var n = 0; n < fi.length; n++) {
        var l = fi[n];
        l.blockedOn === t && (l.blockedOn = null);
      }
      for (; 0 < fi.length && (n = fi[0], n.blockedOn === null); ) _p(n), n.blockedOn === null && fi.shift();
      if (n = (t.ownerDocument || t).$$reactFormReplay, n != null) for (l = 0; l < n.length; l += 3) {
        var u = n[l], o = n[l + 1], d = u[Me] || null;
        if (typeof o == "function") d || Dp(n);
        else if (d) {
          var g = null;
          if (o && o.hasAttribute("formAction")) {
            if (u = o, d = o[Me] || null) g = d.formAction;
            else if (lc(u) !== null) continue;
          } else g = d.action;
          typeof g == "function" ? n[l + 1] = g : (n.splice(l, 3), l -= 3), Dp(n);
        }
      }
    }
    function zp() {
      function t(o) {
        o.canIntercept && o.info === "react-transition" && o.intercept({
          handler: function() {
            return new Promise(function(d) {
              return u = d;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function e() {
        u !== null && (u(), u = null), l || setTimeout(n, 20);
      }
      function n() {
        if (!l && !navigation.transition) {
          var o = navigation.currentEntry;
          o && o.url != null && navigation.navigate(o.url, {
            state: o.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if (typeof navigation == "object") {
        var l = false, u = null;
        return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
          l = true, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), u !== null && (u(), u = null);
        };
      }
    }
    function rc(t) {
      this._internalRoot = t;
    }
    pr.prototype.render = rc.prototype.render = function(t) {
      var e = this._internalRoot;
      if (e === null) throw Error(r(409));
      var n = e.current, l = qe();
      bp(n, l, t, e, null, null);
    }, pr.prototype.unmount = rc.prototype.unmount = function() {
      var t = this._internalRoot;
      if (t !== null) {
        this._internalRoot = null;
        var e = t.containerInfo;
        bp(t.current, 2, null, t, null, null), Js(), e[Pi] = null;
      }
    };
    function pr(t) {
      this._internalRoot = t;
    }
    pr.prototype.unstable_scheduleHydration = function(t) {
      if (t) {
        var e = Bf();
        t = {
          blockedOn: null,
          target: t,
          priority: e
        };
        for (var n = 0; n < fi.length && e !== 0 && e < fi[n].priority; n++) ;
        fi.splice(n, 0, t), n === 0 && _p(t);
      }
    };
    var Cp = a.version;
    if (Cp !== "19.2.5") throw Error(r(527, Cp, "19.2.5"));
    Y.findDOMNode = function(t) {
      var e = t._reactInternals;
      if (e === void 0) throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
      return t = y(e), t = t !== null ? v(t) : null, t = t === null ? null : t.stateNode, t;
    };
    var xb = {
      bundleType: 0,
      version: "19.2.5",
      rendererPackageName: "react-dom",
      currentDispatcherRef: O,
      reconcilerVersion: "19.2.5"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var yr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!yr.isDisabled && yr.supportsFiber) try {
        ka = yr.inject(xb), Ne = yr;
      } catch {
      }
    }
    return Ul.createRoot = function(t, e) {
      if (!c(t)) throw Error(r(299));
      var n = false, l = "", u = Ud, o = Ld, d = Bd;
      return e != null && (e.unstable_strictMode === true && (n = true), e.identifierPrefix !== void 0 && (l = e.identifierPrefix), e.onUncaughtError !== void 0 && (u = e.onUncaughtError), e.onCaughtError !== void 0 && (o = e.onCaughtError), e.onRecoverableError !== void 0 && (d = e.onRecoverableError)), e = gp(t, 1, false, null, null, n, l, null, u, o, d, zp), t[Pi] = e.current, Yo(t), new rc(e);
    }, Ul.hydrateRoot = function(t, e, n) {
      if (!c(t)) throw Error(r(299));
      var l = false, u = "", o = Ud, d = Ld, g = Bd, x = null;
      return n != null && (n.unstable_strictMode === true && (l = true), n.identifierPrefix !== void 0 && (u = n.identifierPrefix), n.onUncaughtError !== void 0 && (o = n.onUncaughtError), n.onCaughtError !== void 0 && (d = n.onCaughtError), n.onRecoverableError !== void 0 && (g = n.onRecoverableError), n.formState !== void 0 && (x = n.formState)), e = gp(t, 1, true, e, n ?? null, l, u, x, o, d, g, zp), e.context = vp(null), n = e.current, l = qe(), l = Fr(l), u = Fn(l), u.callback = null, Wn(n, u, l), n = l, e.current.lanes = n, Ka(e, n), pn(e), t[Pi] = e.current, Yo(t), new pr(e);
    }, Ul.version = "19.2.5", Ul;
  }
  var Hp;
  function Rb() {
    if (Hp) return cc.exports;
    Hp = 1;
    function i() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (a) {
        console.error(a);
      }
    }
    return i(), cc.exports = wb(), cc.exports;
  }
  var Ob = Rb();
  class gr extends Error {
    constructor(a) {
      let s;
      a instanceof Error ? s = a.message : typeof a == "string" ? s = a : s = "", super(s), this.name = this.constructor.name;
    }
  }
  const jt = 256, Kt = 3329, dy = 62209, my = [
    2285,
    2571,
    2970,
    1812,
    1493,
    1422,
    287,
    202,
    3158,
    622,
    1577,
    182,
    962,
    2127,
    1855,
    1468,
    573,
    2004,
    264,
    383,
    2500,
    1458,
    1727,
    3199,
    2648,
    1017,
    732,
    608,
    1787,
    411,
    3124,
    1758,
    1223,
    652,
    2777,
    1015,
    2036,
    1491,
    3047,
    1785,
    516,
    3321,
    3009,
    2663,
    1711,
    2167,
    126,
    1469,
    2476,
    3239,
    3058,
    830,
    107,
    1908,
    3082,
    2378,
    2931,
    961,
    1821,
    2604,
    448,
    2264,
    677,
    2054,
    2226,
    430,
    555,
    843,
    2078,
    871,
    1550,
    105,
    422,
    587,
    177,
    3094,
    3038,
    2869,
    1574,
    1653,
    3083,
    778,
    1159,
    3182,
    2552,
    1483,
    2727,
    1119,
    1739,
    644,
    2457,
    349,
    418,
    329,
    3173,
    3254,
    817,
    1097,
    603,
    610,
    1322,
    2044,
    1864,
    384,
    2114,
    3193,
    1218,
    1994,
    2455,
    220,
    2142,
    1670,
    2144,
    1799,
    2051,
    794,
    1819,
    2475,
    2459,
    478,
    3221,
    3021,
    996,
    991,
    958,
    1869,
    1522,
    1628
  ], Gp = [
    1701,
    1807,
    1460,
    2371,
    2338,
    2333,
    308,
    108,
    2851,
    870,
    854,
    1510,
    2535,
    1278,
    1530,
    1185,
    1659,
    1187,
    3109,
    874,
    1335,
    2111,
    136,
    1215,
    2945,
    1465,
    1285,
    2007,
    2719,
    2726,
    2232,
    2512,
    75,
    156,
    3e3,
    2911,
    2980,
    872,
    2685,
    1590,
    2210,
    602,
    1846,
    777,
    147,
    2170,
    2551,
    246,
    1676,
    1755,
    460,
    291,
    235,
    3152,
    2742,
    2907,
    3224,
    1779,
    2458,
    1251,
    2486,
    2774,
    2899,
    1103,
    1275,
    2652,
    1065,
    2881,
    725,
    1508,
    2368,
    398,
    951,
    247,
    1421,
    3222,
    2499,
    271,
    90,
    853,
    1860,
    3203,
    1162,
    1618,
    666,
    320,
    8,
    2813,
    1544,
    282,
    1838,
    1293,
    2314,
    552,
    2677,
    2106,
    1571,
    205,
    2918,
    1542,
    2721,
    2597,
    2312,
    681,
    130,
    1602,
    1871,
    829,
    2946,
    3065,
    1325,
    2756,
    1861,
    1474,
    1202,
    2367,
    3147,
    1752,
    2707,
    171,
    3127,
    3042,
    1907,
    1836,
    1517,
    359,
    758,
    1441
  ], vr = 0xffffffffn, qp = 32n;
  function Nb(i, a = false) {
    return a ? {
      h: Number(i & vr),
      l: Number(i >> qp & vr)
    } : {
      h: Number(i >> qp & vr) | 0,
      l: Number(i & vr) | 0
    };
  }
  function jb(i, a = false) {
    const s = i.length, r = new Uint32Array(s), c = new Uint32Array(s);
    for (let f = 0; f < s; f++) {
      const { h, l: m } = Nb(i[f], a);
      [r[f], c[f]] = [
        h,
        m
      ];
    }
    return [
      r,
      c
    ];
  }
  const xe = (i, a, s) => i << s | a >>> 32 - s, Te = (i, a, s) => a << s | i >>> 32 - s, yn = (i, a, s) => a << s - 32 | i >>> 64 - s, gn = (i, a, s) => i << s - 32 | a >>> 64 - s;
  function Vb(i) {
    return i instanceof Uint8Array || ArrayBuffer.isView(i) && i.constructor.name === "Uint8Array";
  }
  function Yp(i, a = "") {
    if (!Number.isSafeInteger(i) || i < 0) {
      const s = a && `"${a}" `;
      throw new Error(`${s}expected integer >0, got ${i}`);
    }
  }
  function Oc(i, a, s = "") {
    const r = Vb(i), c = i == null ? void 0 : i.length;
    if (!r || a !== void 0) {
      const h = s && `"${s}" `, m = "", p = r ? `length=${c}` : `type=${typeof i}`;
      throw new Error(h + "expected Uint8Array" + m + ", got " + p);
    }
    return i;
  }
  function kp(i, a = true) {
    if (i.destroyed) throw new Error("Hash instance has been destroyed");
    if (a && i.finished) throw new Error("Hash#digest() has already been called");
  }
  function Ub(i, a) {
    Oc(i, void 0, "digestInto() output");
    const s = a.outputLen;
    if (i.length < s) throw new Error('"digestInto() output" expected to be of length >=' + s);
  }
  function Lb(i) {
    return new Uint32Array(i.buffer, i.byteOffset, Math.floor(i.byteLength / 4));
  }
  function Bb(...i) {
    for (let a = 0; a < i.length; a++) i[a].fill(0);
  }
  const Hb = new Uint8Array(new Uint32Array([
    287454020
  ]).buffer)[0] === 68;
  function Gb(i) {
    return i << 24 & 4278190080 | i << 8 & 16711680 | i >>> 8 & 65280 | i >>> 24 & 255;
  }
  function qb(i) {
    for (let a = 0; a < i.length; a++) i[a] = Gb(i[a]);
    return i;
  }
  const Xp = Hb ? (i) => i : qb, Yb = 0n, Ll = 1n, kb = 2n, Xb = 7n, Kb = 256n, Qb = 0x71n, py = [];
  for (let i = 0, a = Ll, s = 1, r = 0; i < 24; i++) {
    [s, r] = [
      r,
      (2 * s + 3 * r) % 5
    ];
    let c = Yb;
    for (let f = 0; f < 7; f++) a = (a << Ll ^ (a >> Xb) * Qb) % Kb, a & kb && (c ^= Ll << (Ll << BigInt(f)) - Ll);
    py.push(c);
  }
  const yy = jb(py, true), Zb = yy[0], Pb = yy[1], Bl = (i, a, s) => xe(i, a, s), Hl = (i, a, s) => Te(i, a, s);
  function Jb(i, a = 24, s) {
    s || (s = new Uint32Array(10));
    for (let r = 24 - a; r < 24; r++) {
      for (let p = 0; p < 10; p++) s[p] = i[p] ^ i[p + 10] ^ i[p + 20] ^ i[p + 30] ^ i[p + 40];
      {
        const p = Bl(s[2], s[3], 1) ^ s[8], y = Hl(s[2], s[3], 1) ^ s[9];
        i[0] ^= p, i[1] ^= y, i[10] ^= p, i[11] ^= y, i[20] ^= p, i[21] ^= y, i[30] ^= p, i[31] ^= y, i[40] ^= p, i[41] ^= y;
      }
      {
        const p = Bl(s[4], s[5], 1) ^ s[0], y = Hl(s[4], s[5], 1) ^ s[1];
        i[2] ^= p, i[3] ^= y, i[12] ^= p, i[13] ^= y, i[22] ^= p, i[23] ^= y, i[32] ^= p, i[33] ^= y, i[42] ^= p, i[43] ^= y;
      }
      {
        const p = Bl(s[6], s[7], 1) ^ s[2], y = Hl(s[6], s[7], 1) ^ s[3];
        i[4] ^= p, i[5] ^= y, i[14] ^= p, i[15] ^= y, i[24] ^= p, i[25] ^= y, i[34] ^= p, i[35] ^= y, i[44] ^= p, i[45] ^= y;
      }
      {
        const p = Bl(s[8], s[9], 1) ^ s[4], y = Hl(s[8], s[9], 1) ^ s[5];
        i[6] ^= p, i[7] ^= y, i[16] ^= p, i[17] ^= y, i[26] ^= p, i[27] ^= y, i[36] ^= p, i[37] ^= y, i[46] ^= p, i[47] ^= y;
      }
      {
        const p = Bl(s[0], s[1], 1) ^ s[6], y = Hl(s[0], s[1], 1) ^ s[7];
        i[8] ^= p, i[9] ^= y, i[18] ^= p, i[19] ^= y, i[28] ^= p, i[29] ^= y, i[38] ^= p, i[39] ^= y, i[48] ^= p, i[49] ^= y;
      }
      let c = i[2], f = i[3], h, m;
      h = xe(c, f, 1), m = Te(c, f, 1), c = i[20], f = i[21], i[20] = h, i[21] = m, h = xe(c, f, 3), m = Te(c, f, 3), c = i[14], f = i[15], i[14] = h, i[15] = m, h = xe(c, f, 6), m = Te(c, f, 6), c = i[22], f = i[23], i[22] = h, i[23] = m, h = xe(c, f, 10), m = Te(c, f, 10), c = i[34], f = i[35], i[34] = h, i[35] = m, h = xe(c, f, 15), m = Te(c, f, 15), c = i[36], f = i[37], i[36] = h, i[37] = m, h = xe(c, f, 21), m = Te(c, f, 21), c = i[6], f = i[7], i[6] = h, i[7] = m, h = xe(c, f, 28), m = Te(c, f, 28), c = i[10], f = i[11], i[10] = h, i[11] = m, h = yn(c, f, 36), m = gn(c, f, 36), c = i[32], f = i[33], i[32] = h, i[33] = m, h = yn(c, f, 45), m = gn(c, f, 45), c = i[16], f = i[17], i[16] = h, i[17] = m, h = yn(c, f, 55), m = gn(c, f, 55), c = i[42], f = i[43], i[42] = h, i[43] = m, h = xe(c, f, 2), m = Te(c, f, 2), c = i[48], f = i[49], i[48] = h, i[49] = m, h = xe(c, f, 14), m = Te(c, f, 14), c = i[8], f = i[9], i[8] = h, i[9] = m, h = xe(c, f, 27), m = Te(c, f, 27), c = i[30], f = i[31], i[30] = h, i[31] = m, h = yn(c, f, 41), m = gn(c, f, 41), c = i[46], f = i[47], i[46] = h, i[47] = m, h = yn(c, f, 56), m = gn(c, f, 56), c = i[38], f = i[39], i[38] = h, i[39] = m, h = xe(c, f, 8), m = Te(c, f, 8), c = i[26], f = i[27], i[26] = h, i[27] = m, h = xe(c, f, 25), m = Te(c, f, 25), c = i[24], f = i[25], i[24] = h, i[25] = m, h = yn(c, f, 43), m = gn(c, f, 43), c = i[4], f = i[5], i[4] = h, i[5] = m, h = yn(c, f, 62), m = gn(c, f, 62), c = i[40], f = i[41], i[40] = h, i[41] = m, h = xe(c, f, 18), m = Te(c, f, 18), c = i[28], f = i[29], i[28] = h, i[29] = m, h = yn(c, f, 39), m = gn(c, f, 39), c = i[44], f = i[45], i[44] = h, i[45] = m, h = yn(c, f, 61), m = gn(c, f, 61), c = i[18], f = i[19], i[18] = h, i[19] = m, h = xe(c, f, 20), m = Te(c, f, 20), c = i[12], f = i[13], i[12] = h, i[13] = m, h = yn(c, f, 44), m = gn(c, f, 44), i[2] = h, i[3] = m;
      for (let p = 0; p < 50; p += 10) s[0] = i[p], s[1] = i[p + 1], s[2] = i[p + 2], s[3] = i[p + 3], s[4] = i[p + 4], s[5] = i[p + 5], s[6] = i[p + 6], s[7] = i[p + 7], s[8] = i[p + 8], s[9] = i[p + 9], i[p + 0] ^= ~s[2] & s[4], i[p + 1] ^= ~s[3] & s[5], i[p + 2] ^= ~s[4] & s[6], i[p + 3] ^= ~s[5] & s[7], i[p + 4] ^= ~s[6] & s[8], i[p + 5] ^= ~s[7] & s[9], i[p + 6] ^= ~s[8] & s[0], i[p + 7] ^= ~s[9] & s[1], i[p + 8] ^= ~s[0] & s[2], i[p + 9] ^= ~s[1] & s[3];
      i[0] ^= Zb[r], i[1] ^= Pb[r];
    }
  }
  class mi {
    constructor(a, s, r, c = false, f = 24) {
      if (Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "pos", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "posOut", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "finished", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      }), Object.defineProperty(this, "state32", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "destroyed", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      }), Object.defineProperty(this, "_B", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Uint32Array(10)
      }), Object.defineProperty(this, "blockLen", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "suffix", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "outputLen", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "enableXOF", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      }), Object.defineProperty(this, "rounds", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), this.blockLen = a, this.suffix = s, this.outputLen = r, this.enableXOF = c, this.rounds = f, Yp(r, "outputLen"), !(0 < a && a < 200)) throw new Error("only keccak-f1600 function is supported");
      this.state = new Uint8Array(200), this.state32 = Lb(this.state);
    }
    clone() {
      return this._cloneInto();
    }
    reset() {
      this.state.fill(0), this.pos = 0, this.posOut = 0, this.finished = false, this.destroyed = false;
    }
    keccak() {
      Xp(this.state32), Jb(this.state32, this.rounds, this._B), Xp(this.state32), this.posOut = 0, this.pos = 0;
    }
    update(a) {
      return kp(this), Oc(a), this.updateUnsafe(a);
    }
    updateUnsafe(a) {
      const { blockLen: s, state: r } = this, c = a.length;
      for (let f = 0; f < c; ) {
        const h = Math.min(s - this.pos, c - f);
        for (let m = 0; m < h; m++) r[this.pos++] ^= a[f++];
        this.pos === s && this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished) return;
      this.finished = true;
      const { state: a, suffix: s, pos: r, blockLen: c } = this;
      a[r] ^= s, (s & 128) !== 0 && r === c - 1 && this.keccak(), a[c - 1] ^= 128, this.keccak();
    }
    writeInto(a) {
      return kp(this, false), Oc(a), this.writeIntoUnsafe(a);
    }
    writeIntoUnsafe(a) {
      this.finish();
      const s = this.state, { blockLen: r } = this;
      for (let c = 0, f = a.length; c < f; ) {
        this.posOut >= r && this.keccak();
        const h = Math.min(r - this.posOut, f - c);
        a.set(s.subarray(this.posOut, this.posOut + h), c), this.posOut += h, c += h;
      }
      return a;
    }
    xofInto(a) {
      if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
      return this.writeInto(a);
    }
    xof(a) {
      return Yp(a), this.xofInto(new Uint8Array(a));
    }
    digestInto(a) {
      if (Ub(a, this), this.finished) throw new Error("digest() was already called");
      return this.writeInto(a), this.destroy(), a;
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      this.destroyed = true, Bb(this.state);
    }
    _cloneInto(a) {
      const { blockLen: s, suffix: r, outputLen: c, rounds: f, enableXOF: h } = this;
      return a || (a = new mi(s, r, c, h, f)), a.state32.set(this.state32), a.pos = this.pos, a.posOut = this.posOut, a.finished = this.finished, a.rounds = f, a.suffix = r, a.outputLen = c, a.enableXOF = h, a.destroyed = this.destroyed, a;
    }
  }
  const Fb = "modulepreload", Wb = function(i) {
    return "/" + i;
  }, Kp = {}, $b = function(a, s, r) {
    let c = Promise.resolve();
    if (s && s.length > 0) {
      let h = function(y) {
        return Promise.all(y.map((v) => Promise.resolve(v).then((b) => ({
          status: "fulfilled",
          value: b
        }), (b) => ({
          status: "rejected",
          reason: b
        }))));
      };
      document.getElementsByTagName("link");
      const m = document.querySelector("meta[property=csp-nonce]"), p = (m == null ? void 0 : m.nonce) || (m == null ? void 0 : m.getAttribute("nonce"));
      c = h(s.map((y) => {
        if (y = Wb(y), y in Kp) return;
        Kp[y] = true;
        const v = y.endsWith(".css"), b = v ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${y}"]${b}`)) return;
        const T = document.createElement("link");
        if (T.rel = v ? "stylesheet" : Fb, v || (T.as = "script"), T.crossOrigin = "", T.href = y, p && T.setAttribute("nonce", p), document.head.appendChild(T), v) return new Promise((w, C) => {
          T.addEventListener("load", w), T.addEventListener("error", () => C(new Error(`Unable to preload CSS for ${y}`)));
        });
      }));
    }
    function f(h) {
      const m = new Event("vite:preloadError", {
        cancelable: true
      });
      if (m.payload = h, window.dispatchEvent(m), !m.defaultPrevented) throw h;
    }
    return c.then((h) => {
      for (const m of h || []) m.status === "rejected" && f(m.reason);
      return a().catch(f);
    });
  }, Ib = {}, t2 = e2(globalThis, Ib);
  function e2(i, a) {
    return new Proxy(i, {
      get(s, r, c) {
        return r in a ? a[r] : i[r];
      },
      set(s, r, c) {
        return r in a && delete a[r], i[r] = c, true;
      },
      deleteProperty(s, r) {
        let c = false;
        return r in a && (delete a[r], c = true), r in i && (delete i[r], c = true), c;
      },
      ownKeys(s) {
        const r = Reflect.ownKeys(i), c = Reflect.ownKeys(a), f = new Set(c);
        return [
          ...r.filter((h) => !f.has(h)),
          ...c
        ];
      },
      defineProperty(s, r, c) {
        return r in a && delete a[r], Reflect.defineProperty(i, r, c), true;
      },
      getOwnPropertyDescriptor(s, r) {
        return r in a ? Reflect.getOwnPropertyDescriptor(a, r) : Reflect.getOwnPropertyDescriptor(i, r);
      },
      has(s, r) {
        return r in a || r in i;
      }
    });
  }
  function un(i) {
    return i & 255;
  }
  function Gn(i) {
    return i << 16 >> 16;
  }
  function se(i) {
    return i & 65535;
  }
  function n2(i, a) {
    if (i.length != a.length) return 0;
    let s = 0;
    for (let c = 0; c < i.length; c++) s |= i[c] ^ a[c];
    let r = ~s & 255;
    return r &= r >> 4, r &= r >> 2, r &= r >> 1, r & 1;
  }
  function i2(i, a) {
    if (i.length != a.length) return false;
    for (let s = 0; s < i.length; s++) if (i[s] !== a[s]) return false;
    return true;
  }
  async function a2() {
    if (typeof t2 < "u" && globalThis.crypto !== void 0) return globalThis.crypto;
    try {
      const { webcrypto: i } = await $b(async () => {
        const { webcrypto: a } = await import("./__vite-browser-external-BIHI7g3E.js");
        return {
          webcrypto: a
        };
      }, []);
      return i;
    } catch {
      throw new Error("failed to load Crypto");
    }
  }
  function l2(i, a = 0) {
    return (i[a] | i[a + 1] << 8 | i[a + 2] << 16 | i[a + 3] << 24) >>> 0;
  }
  class s2 {
    constructor() {
      Object.defineProperty(this, "_api", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_k", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_du", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_dv", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_eta1", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_eta2", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_skSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_pkSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_compressedUSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_compressedVSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      }), Object.defineProperty(this, "_poolG", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_poolH", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_poolKdf", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_poolXof", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_poolPrf1", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_poolPrf2", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_bufG", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Uint8Array(64)
      }), Object.defineProperty(this, "_bufH", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Uint8Array(32)
      }), Object.defineProperty(this, "_bufKdf", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Uint8Array(32)
      }), Object.defineProperty(this, "_bufXof", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Uint8Array(672)
      }), Object.defineProperty(this, "_bufPrf1", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_bufPrf2", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_nonceBuf", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Uint8Array(1)
      }), Object.defineProperty(this, "_xofSeed", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Uint8Array(34)
      }), Object.defineProperty(this, "_kBuf", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_matrixA", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_noiseVecs", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_polyVec", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_bufPkCheck", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      }), Object.defineProperty(this, "_bufCt", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
    }
    _initPool() {
      this._poolG = new mi(72, 6, 64), this._poolH = new mi(136, 6, 32), this._poolKdf = new mi(136, 31, 32, true), this._poolXof = new mi(168, 31, 672, true);
      const a = this._eta1 * jt / 4;
      this._poolPrf1 = new mi(136, 31, a, true), this._bufPrf1 = new Uint8Array(a);
      const s = this._eta2 * jt / 4;
      this._poolPrf2 = new mi(136, 31, s, true), this._bufPrf2 = new Uint8Array(s), this._kBuf = new Uint8Array([
        this._k
      ]), this._matrixA = new Array(this._k);
      for (let c = 0; c < this._k; c++) {
        this._matrixA[c] = new Array(this._k);
        for (let f = 0; f < this._k; f++) this._matrixA[c][f] = new Int16Array(jt);
      }
      const r = 2 * this._k + 1;
      this._noiseVecs = new Array(r);
      for (let c = 0; c < r; c++) this._noiseVecs[c] = new Int16Array(jt);
      this._polyVec = new Array(this._k);
      for (let c = 0; c < this._k; c++) this._polyVec[c] = new Int16Array(jt);
      this._bufPkCheck = new Uint8Array(384 * this._k), this._bufCt = new Uint8Array(this._compressedUSize + this._compressedVSize);
    }
    _zeroPool() {
      this._bufG.fill(0), this._bufH.fill(0), this._bufKdf.fill(0), this._bufXof.fill(0), this._bufPrf1.fill(0), this._bufPrf2.fill(0), this._nonceBuf[0] = 0, this._xofSeed.fill(0);
      for (let a = 0; a < this._k; a++) for (let s = 0; s < this._k; s++) this._matrixA[a][s].fill(0);
      for (let a = 0; a < this._noiseVecs.length; a++) this._noiseVecs[a].fill(0);
      for (let a = 0; a < this._k; a++) this._polyVec[a].fill(0);
      this._bufPkCheck.fill(0), this._bufCt.fill(0), this._poolG.reset(), this._poolH.reset(), this._poolKdf.reset(), this._poolXof.reset(), this._poolPrf1.reset(), this._poolPrf2.reset();
    }
    _polyToBytes(a, s, r) {
      let c, f;
      for (let h = 0; h < jt / 2; h++) c = r[2 * h] - Kt, c += c >> 31 & Kt, f = r[2 * h + 1] - Kt, f += f >> 31 & Kt, a[s + 3 * h + 0] = un(c), a[s + 3 * h + 1] = un(c >> 8) | un(f << 4), a[s + 3 * h + 2] = un(f >> 4);
    }
    _polyFromBytes(a, s, r) {
      for (let c = 0; c < jt / 2; c++) a[2 * c] = Gn((se(s[r + 3 * c + 0]) >> 0 | se(s[r + 3 * c + 1]) << 8) & 4095), a[2 * c + 1] = Gn((se(s[r + 3 * c + 1]) >> 4 | se(s[r + 3 * c + 2]) << 4) & 4095);
    }
    _g(a, s) {
      return this._poolG.reset(), this._poolG.updateUnsafe(a), s !== void 0 && this._poolG.updateUnsafe(s), this._poolG.writeIntoUnsafe(this._bufG), [
        this._bufG.subarray(0, 32),
        this._bufG.subarray(32, 64)
      ];
    }
    _h(a) {
      return this._poolH.reset(), this._poolH.updateUnsafe(a).writeIntoUnsafe(this._bufH), this._bufH;
    }
    _kdf(a, s) {
      return this._poolKdf.reset(), this._poolKdf.updateUnsafe(a), s !== void 0 && this._poolKdf.updateUnsafe(s), this._poolKdf.writeIntoUnsafe(this._bufKdf), this._bufKdf;
    }
    _xof(a) {
      return this._poolXof.reset(), this._poolXof.updateUnsafe(a).writeIntoUnsafe(this._bufXof), this._bufXof;
    }
    _prf1(a, s) {
      return this._nonceBuf[0] = s, this._poolPrf1.reset(), this._poolPrf1.updateUnsafe(a).updateUnsafe(this._nonceBuf).writeIntoUnsafe(this._bufPrf1), this._bufPrf1;
    }
    _prf2(a, s) {
      return this._nonceBuf[0] = s, this._poolPrf2.reset(), this._poolPrf2.updateUnsafe(a).updateUnsafe(this._nonceBuf).writeIntoUnsafe(this._bufPrf2), this._bufPrf2;
    }
    _generateKeyPairCore() {
      try {
        const a = new Uint8Array(64);
        return this._api.getRandomValues(a), this._deriveKeyPair(a);
      } finally {
        this._zeroPool();
      }
    }
    _deriveKeyPairCore(a) {
      try {
        if (a.byteLength !== 64) throw new Error("seed must be 64 bytes in length");
        return this._deriveKeyPair(a);
      } finally {
        this._zeroPool();
      }
    }
    _encapCore(a, s) {
      try {
        if (a.length !== 384 * this._k + 32) throw new Error("invalid encapsulation key");
        const r = this._getSeed(s), [c, f] = this._g(r, this._h(a));
        return this._encap(a, r, f), [
          this._bufCt.slice(),
          c.slice()
        ];
      } finally {
        this._zeroPool();
      }
    }
    _decapCore(a, s) {
      try {
        if (a.byteLength !== this._compressedUSize + this._compressedVSize) throw new Error("Invalid ct size");
        if (s.length !== 768 * this._k + 96) throw new Error("Invalid decapsulation key");
        const r = s.subarray(0, this._skSize), c = s.subarray(this._skSize, this._skSize + this._pkSize), f = s.subarray(this._skSize + this._pkSize, this._skSize + this._pkSize + 32), h = s.subarray(this._skSize + this._pkSize + 32, this._skSize + this._pkSize + 64), m = this._decap(a, r), [p, y] = this._g(m, f), v = this._kdf(h, a);
        return this._encap(c, m, y), n2(a, this._bufCt) === 1 ? p.slice() : v.slice();
      } finally {
        this._zeroPool();
      }
    }
    async _setup() {
      this._api === void 0 && (this._api = await a2());
    }
    _getSeed(a) {
      if (a == null) {
        const s = new Uint8Array(32);
        return this._api.getRandomValues(s), s;
      }
      if (a.byteLength !== 32) throw new Error("seed must be 32 bytes in length");
      return a;
    }
    _deriveKeyPair(a) {
      const s = a.subarray(0, 32), r = a.subarray(32, 64), [c, f] = this._deriveCpaKeyPair(s), h = this._h(c), m = new Uint8Array(this._skSize + this._pkSize + 64);
      return m.set(f, 0), m.set(c, this._skSize), m.set(h, this._skSize + this._pkSize), m.set(r, this._skSize + this._pkSize + 32), [
        c,
        m
      ];
    }
    _deriveCpaKeyPair(a) {
      const [s, r] = this._g(a, this._kBuf), c = this._sampleMatrix(s, false), f = this._sampleNoise1(r, 0, this._k), h = this._sampleNoise1(r, this._k, this._k);
      for (let v = 0; v < this._k; v++) f[v] = br(f[v]), f[v] = qi(f[v]), h[v] = br(h[v]);
      const m = new Array(this._k);
      for (let v = 0; v < this._k; v++) m[v] = c2(Sr(c[v], f)), m[v] = ql(m[v], h[v]), m[v] = qi(m[v]);
      const p = new Uint8Array(this._pkSize);
      for (let v = 0; v < this._k; v++) this._polyToBytes(p, v * 384, m[v]);
      p.set(s, this._skSize);
      const y = new Uint8Array(this._skSize);
      for (let v = 0; v < this._k; v++) this._polyToBytes(y, v * 384, f[v]);
      return [
        p,
        y
      ];
    }
    _encap(a, s, r) {
      const c = this._polyVec, f = this._bufPkCheck;
      for (let C = 0; C < this._k; C++) this._polyFromBytes(c[C], a, C * 384), this._polyToBytes(f, C * 384, c[C]);
      if (!i2(a.subarray(0, f.length), f)) throw new Error("invalid encapsulation key");
      const h = a.subarray(this._skSize), m = this._sampleMatrix(h, true), p = this._sampleNoise1(r, 0, this._k), y = this._sampleNoise2(r, this._k, this._k), v = this._sampleNoise2(r, this._k * 2, 1)[0];
      for (let C = 0; C < this._k; C++) p[C] = br(p[C]), p[C] = qi(p[C]);
      const b = new Array(this._k);
      for (let C = 0; C < this._k; C++) b[C] = Sr(m[C], p), b[C] = mc(b[C]), b[C] = ql(b[C], y[C]), b[C] = qi(b[C]);
      const T = u2(s);
      let w = Sr(c, p);
      return w = mc(w), w = ql(w, v), w = ql(w, T), w = qi(w), this._compressU(this._bufCt.subarray(0, this._compressedUSize), b), this._compressV(this._bufCt.subarray(this._compressedUSize), w), this._bufCt;
    }
    _decap(a, s) {
      const r = this._decompressU(a.subarray(0, this._compressedUSize)), c = this._decompressV(a.subarray(this._compressedUSize)), f = this._polyvecFromBytes(s);
      for (let m = 0; m < this._k; m++) r[m] = br(r[m]);
      let h = Sr(f, r);
      return h = mc(h), h = f2(c, h), h = qi(h), r2(h);
    }
    _sampleMatrix(a, s) {
      const r = this._matrixA;
      this._xofSeed.set(a);
      for (let c = 0, f = 0; f < this._k; f++) for (let h = 0; h < this._k; h++) {
        s ? (this._xofSeed[a.length] = f, this._xofSeed[a.length + 1] = h) : (this._xofSeed[a.length] = h, this._xofSeed[a.length + 1] = f);
        const m = this._xof(this._xofSeed);
        for (c = Qp(r[f][h], 0, m.subarray(0, 504), 504, jt); c < jt; ) {
          const p = m.subarray(504, 672);
          c += Qp(r[f][h], c, p, 168, jt - c);
        }
      }
      return r;
    }
    _sampleNoise1(a, s, r) {
      const c = new Array(r);
      for (let f = 0; f < r; f++) c[f] = this._noiseVecs[s + f], Zp(c[f], this._prf1(a, s + f), this._eta1);
      return c;
    }
    _sampleNoise2(a, s, r) {
      const c = new Array(r);
      for (let f = 0; f < r; f++) c[f] = this._noiseVecs[s + f], Zp(c[f], this._prf2(a, s + f), this._eta2);
      return c;
    }
    _polyvecFromBytes(a) {
      const s = this._polyVec;
      for (let r = 0; r < this._k; r++) this._polyFromBytes(s[r], a, r * 384);
      return s;
    }
    _compressU(a, s) {
      const r = new Array(4);
      for (let c = 0, f = 0; f < this._k; f++) for (let h = 0; h < jt / 4; h++) {
        for (let m = 0; m < 4; m++) r[m] = ((s[f][4 * h + m] << 10) + Kt / 2) / Kt & 1023;
        a[c++] = un(r[0] >> 0), a[c++] = un(r[0] >> 8 | r[1] << 2), a[c++] = un(r[1] >> 6 | r[2] << 4), a[c++] = un(r[2] >> 4 | r[3] << 6), a[c++] = un(r[3] >> 2);
      }
      return a;
    }
    _compressV(a, s) {
      const r = new Uint8Array(8);
      for (let c = 0, f = 0; f < jt / 8; f++) {
        for (let h = 0; h < 8; h++) r[h] = un(((s[8 * f + h] << 4) + Kt / 2) / Kt) & 15;
        a[c++] = r[0] | r[1] << 4, a[c++] = r[2] | r[3] << 4, a[c++] = r[4] | r[5] << 4, a[c++] = r[6] | r[7] << 4;
      }
      return a;
    }
    _decompressU(a) {
      const s = new Array(this._k);
      for (let c = 0; c < this._k; c++) s[c] = new Int16Array(jt);
      const r = new Array(4);
      for (let c = 0, f = 0; f < this._k; f++) for (let h = 0; h < jt / 4; h++) {
        r[0] = se(a[c + 0]) >> 0 | se(a[c + 1]) << 8, r[1] = se(a[c + 1]) >> 2 | se(a[c + 2]) << 6, r[2] = se(a[c + 2]) >> 4 | se(a[c + 3]) << 4, r[3] = se(a[c + 3]) >> 6 | se(a[c + 4]) << 2, c = c + 5;
        for (let m = 0; m < 4; m++) s[f][4 * h + m] = Gn((r[m] & 1023) * Kt + 512 >> 10);
      }
      return s;
    }
    _decompressV(a) {
      const s = new Int16Array(jt);
      for (let r = 0, c = 0; c < jt / 2; c++, r++) s[2 * c + 0] = Gn((a[r] & 15) * Kt + 8 >> 4), s[2 * c + 1] = Gn((a[r] >> 4) * Kt + 8 >> 4);
      return s;
    }
  }
  function r2(i) {
    const a = new Uint8Array(32);
    let s, r;
    for (let c = 0; c < jt / 8; c++) for (let f = 0; f < 8; f++) r = i[8 * c + f] - Kt, r += r >> 31 & Kt, s = ((se(r) << 1) + se(Kt / 2)) / se(Kt) & 1, a[c] |= un(s << f);
    return a;
  }
  function u2(i) {
    const a = new Int16Array(jt);
    let s;
    for (let r = 0; r < jt / 8; r++) for (let c = 0; c < 8; c++) s = -1 * Gn(i[r] >> c & 1), a[8 * r + c] = s & Gn((Kt + 1) / 2);
    return a;
  }
  function Qp(i, a, s, r, c) {
    let f = 0, h, m;
    for (let p = 0; f < c && p + 3 <= r; ) h = (se(s[p] >> 0) | se(s[p + 1]) << 8) & 4095, m = (se(s[p + 1] >> 4) | se(s[p + 2]) << 4) & 4095, p = p + 3, h < Kt && (i[a + f] = h, f = f + 1), f < c && m < Kt && (i[a + f] = m, f = f + 1);
    return f;
  }
  function Zp(i, a, s) {
    let r, c, f, h;
    for (let m = 0; m < jt / 8; m++) {
      r = l2(a, 4 * m), c = r & 1431655765, c = c + (r >> 1 & 1431655765);
      for (let p = 0; p < 8; p++) f = Gn(c >> 4 * p + 0 & 3), h = Gn(c >> 4 * p + s & 3), i[8 * m + p] = f - h;
    }
  }
  function br(i) {
    for (let a = 0, s = 1, r = 128; r >= 2; r >>= 1) for (let c = 0; c < 256; c = a + r) {
      const f = my[s];
      for (s = s + 1, a = c; a < c + r; a++) {
        const h = Ye(f, i[a + r]);
        i[a + r] = i[a] - h, i[a] = i[a] + h;
      }
    }
    return i;
  }
  function Ye(i, a) {
    const s = i * a, r = Math.imul(s, dy) << 16 >> 16;
    return s - r * Kt >> 16;
  }
  function qi(i) {
    for (let a = 0; a < jt; a++) i[a] = gy(i[a]);
    return i;
  }
  const o2 = ((1 << 24) + Kt / 2) / Kt;
  function gy(i) {
    let a = o2 * i >> 24;
    return a = a * Kt, i - a;
  }
  function c2(i) {
    for (let s = 0; s < jt; s++) {
      const r = i[s] * 1353, c = Math.imul(r, dy) << 16 >> 16;
      i[s] = r - c * Kt >> 16;
    }
    return i;
  }
  function Sr(i, a) {
    let s = Pp(i[0], a[0]), r;
    for (let c = 1; c < i.length; c++) r = Pp(i[c], a[c]), s = ql(s, r);
    return qi(s);
  }
  function Pp(i, a) {
    for (let s = 0; s < jt / 4; s++) {
      const r = 4 * s, c = i[r], f = i[r + 1], h = i[r + 2], m = i[r + 3], p = a[r], y = a[r + 1], v = a[r + 2], b = a[r + 3], T = my[64 + s];
      i[r] = Ye(Ye(f, y), T) + Ye(c, p), i[r + 1] = Ye(c, y) + Ye(f, p), i[r + 2] = Ye(Ye(m, b), -T) + Ye(h, v), i[r + 3] = Ye(h, b) + Ye(m, v);
    }
    return i;
  }
  function ql(i, a) {
    for (let s = 0; s < jt; s++) i[s] += a[s];
    return i;
  }
  function f2(i, a) {
    for (let s = 0; s < jt; s++) i[s] -= a[s];
    return i;
  }
  function mc(i) {
    let a = 0;
    for (let s = 0, r = 2; r <= 128; r <<= 1) for (let c = 0; c < 256; c = a + r) {
      const f = Gp[s];
      for (s = s + 1, a = c; a < c + r; a++) {
        const h = i[a];
        i[a] = gy(h + i[a + r]), i[a + r] = h - i[a + r], i[a + r] = Ye(f, i[a + r]);
      }
    }
    for (a = 0; a < 256; a++) i[a] = Ye(i[a], Gp[127]);
    return i;
  }
  class lf extends s2 {
    constructor() {
      super(), Object.defineProperty(this, "_k", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 3
      }), Object.defineProperty(this, "_du", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 10
      }), Object.defineProperty(this, "_dv", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 4
      }), Object.defineProperty(this, "_eta1", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 2
      }), Object.defineProperty(this, "_eta2", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 2
      }), this._skSize = 12 * this._k * jt / 8, this._pkSize = this._skSize + 32, this._compressedUSize = this._k * this._du * jt / 8, this._compressedVSize = this._dv * jt / 8, this._initPool();
    }
    generateKeyPair() {
      try {
        return this._generateKeyPairCore();
      } catch (a) {
        throw new gr(a);
      }
    }
    deriveKeyPair(a) {
      try {
        return this._deriveKeyPairCore(a);
      } catch (s) {
        throw new gr(s);
      }
    }
    encap(a, s) {
      try {
        return this._encapCore(a, s);
      } catch (r) {
        throw new gr(r);
      }
    }
    decap(a, s) {
      try {
        return this._decapCore(a, s);
      } catch (r) {
        throw new gr(r);
      }
    }
    static async _create() {
      const a = new lf();
      return await a._setup(), a;
    }
  }
  function h2() {
    return lf._create();
  }
  const d2 = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), m2 = (i) => i.replace(/^([A-Z])|[\s-_]+(\w)/g, (a, s, r) => r ? r.toUpperCase() : s.toLowerCase()), Jp = (i) => {
    const a = m2(i);
    return a.charAt(0).toUpperCase() + a.slice(1);
  }, vy = (...i) => i.filter((a, s, r) => !!a && a.trim() !== "" && r.indexOf(a) === s).join(" ").trim(), p2 = (i) => {
    for (const a in i) if (a.startsWith("aria-") || a === "role" || a === "title") return true;
  };
  var y2 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  const g2 = q.forwardRef(({ color: i = "currentColor", size: a = 24, strokeWidth: s = 2, absoluteStrokeWidth: r, className: c = "", children: f, iconNode: h, ...m }, p) => q.createElement("svg", {
    ref: p,
    ...y2,
    width: a,
    height: a,
    stroke: i,
    strokeWidth: r ? Number(s) * 24 / Number(a) : s,
    className: vy("lucide", c),
    ...!f && !p2(m) && {
      "aria-hidden": "true"
    },
    ...m
  }, [
    ...h.map(([y, v]) => q.createElement(y, v)),
    ...Array.isArray(f) ? f : [
      f
    ]
  ]));
  const qn = (i, a) => {
    const s = q.forwardRef(({ className: r, ...c }, f) => q.createElement(g2, {
      ref: f,
      iconNode: a,
      className: vy(`lucide-${d2(Jp(i))}`, `lucide-${i}`, r),
      ...c
    }));
    return s.displayName = Jp(i), s;
  };
  const v2 = [
    [
      "path",
      {
        d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        key: "169zse"
      }
    ]
  ], b2 = qn("activity", v2);
  const S2 = [
    [
      "path",
      {
        d: "M12 20v2",
        key: "1lh1kg"
      }
    ],
    [
      "path",
      {
        d: "M12 2v2",
        key: "tus03m"
      }
    ],
    [
      "path",
      {
        d: "M17 20v2",
        key: "1rnc9c"
      }
    ],
    [
      "path",
      {
        d: "M17 2v2",
        key: "11trls"
      }
    ],
    [
      "path",
      {
        d: "M2 12h2",
        key: "1t8f8n"
      }
    ],
    [
      "path",
      {
        d: "M2 17h2",
        key: "7oei6x"
      }
    ],
    [
      "path",
      {
        d: "M2 7h2",
        key: "asdhe0"
      }
    ],
    [
      "path",
      {
        d: "M20 12h2",
        key: "1q8mjw"
      }
    ],
    [
      "path",
      {
        d: "M20 17h2",
        key: "1fpfkl"
      }
    ],
    [
      "path",
      {
        d: "M20 7h2",
        key: "1o8tra"
      }
    ],
    [
      "path",
      {
        d: "M7 20v2",
        key: "4gnj0m"
      }
    ],
    [
      "path",
      {
        d: "M7 2v2",
        key: "1i4yhu"
      }
    ],
    [
      "rect",
      {
        x: "4",
        y: "4",
        width: "16",
        height: "16",
        rx: "2",
        key: "1vbyd7"
      }
    ],
    [
      "rect",
      {
        x: "8",
        y: "8",
        width: "8",
        height: "8",
        rx: "1",
        key: "z9xiuo"
      }
    ]
  ], x2 = qn("cpu", S2);
  const T2 = [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0"
      }
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "3",
        key: "1v7zrd"
      }
    ]
  ], A2 = qn("eye", T2);
  const E2 = [
    [
      "rect",
      {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2",
        key: "1w4ew1"
      }
    ],
    [
      "path",
      {
        d: "M7 11V7a5 5 0 0 1 10 0v4",
        key: "fwvmzm"
      }
    ]
  ], Fp = qn("lock", E2);
  const _2 = [
    [
      "path",
      {
        d: "M16.247 7.761a6 6 0 0 1 0 8.478",
        key: "1fwjs5"
      }
    ],
    [
      "path",
      {
        d: "M19.075 4.933a10 10 0 0 1 0 14.134",
        key: "ehdyv1"
      }
    ],
    [
      "path",
      {
        d: "M4.925 19.067a10 10 0 0 1 0-14.134",
        key: "1q22gi"
      }
    ],
    [
      "path",
      {
        d: "M7.753 16.239a6 6 0 0 1 0-8.478",
        key: "r2q7qm"
      }
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2",
        key: "1c9p78"
      }
    ]
  ], pc = qn("radio", _2);
  const M2 = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ],
    [
      "path",
      {
        d: "M12 8v4",
        key: "1got3b"
      }
    ],
    [
      "path",
      {
        d: "M12 16h.01",
        key: "1drbdi"
      }
    ]
  ], D2 = qn("shield-alert", M2);
  const z2 = [
    [
      "path",
      {
        d: "M12 19h8",
        key: "baeox8"
      }
    ],
    [
      "path",
      {
        d: "m4 17 6-6-6-6",
        key: "1yngyt"
      }
    ]
  ], Wp = qn("terminal", z2);
  const C2 = [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        key: "wmoenq"
      }
    ],
    [
      "path",
      {
        d: "M12 9v4",
        key: "juzpu7"
      }
    ],
    [
      "path",
      {
        d: "M12 17h.01",
        key: "p32p05"
      }
    ]
  ], w2 = qn("triangle-alert", C2);
  const R2 = [
    [
      "path",
      {
        d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        key: "1xq2db"
      }
    ]
  ], $p = qn("zap", R2), by = q.createContext({});
  function O2(i) {
    const a = q.useRef(null);
    return a.current === null && (a.current = i()), a.current;
  }
  const N2 = typeof window < "u", j2 = N2 ? q.useLayoutEffect : q.useEffect, sf = q.createContext(null);
  function rf(i, a) {
    i.indexOf(a) === -1 && i.push(a);
  }
  function Nr(i, a) {
    const s = i.indexOf(a);
    s > -1 && i.splice(s, 1);
  }
  const xn = (i, a, s) => s > a ? a : s < i ? i : s;
  let uf = () => {
  };
  const yi = {}, Sy = (i) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(i);
  function xy(i) {
    return typeof i == "object" && i !== null;
  }
  const Ty = (i) => /^0[^.\s]+$/u.test(i);
  function Ay(i) {
    let a;
    return () => (a === void 0 && (a = i()), a);
  }
  const nn = (i) => i, V2 = (i, a) => (s) => a(i(s)), Wl = (...i) => i.reduce(V2), Zl = (i, a, s) => {
    const r = a - i;
    return r === 0 ? 1 : (s - i) / r;
  };
  class of {
    constructor() {
      this.subscriptions = [];
    }
    add(a) {
      return rf(this.subscriptions, a), () => Nr(this.subscriptions, a);
    }
    notify(a, s, r) {
      const c = this.subscriptions.length;
      if (c) if (c === 1) this.subscriptions[0](a, s, r);
      else for (let f = 0; f < c; f++) {
        const h = this.subscriptions[f];
        h && h(a, s, r);
      }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  }
  const ke = (i) => i * 1e3, en = (i) => i / 1e3;
  function Ey(i, a) {
    return a ? i * (1e3 / a) : 0;
  }
  const _y = (i, a, s) => (((1 - 3 * s + 3 * a) * i + (3 * s - 6 * a)) * i + 3 * a) * i, U2 = 1e-7, L2 = 12;
  function B2(i, a, s, r, c) {
    let f, h, m = 0;
    do
      h = a + (s - a) / 2, f = _y(h, r, c) - i, f > 0 ? s = h : a = h;
    while (Math.abs(f) > U2 && ++m < L2);
    return h;
  }
  function $l(i, a, s, r) {
    if (i === a && s === r) return nn;
    const c = (f) => B2(f, 0, 1, i, s);
    return (f) => f === 0 || f === 1 ? f : _y(c(f), a, r);
  }
  const My = (i) => (a) => a <= 0.5 ? i(2 * a) / 2 : (2 - i(2 * (1 - a))) / 2, Dy = (i) => (a) => 1 - i(1 - a), zy = $l(0.33, 1.53, 0.69, 0.99), cf = Dy(zy), Cy = My(cf), wy = (i) => i >= 1 ? 1 : (i *= 2) < 1 ? 0.5 * cf(i) : 0.5 * (2 - Math.pow(2, -10 * (i - 1))), ff = (i) => 1 - Math.sin(Math.acos(i)), Ry = Dy(ff), Oy = My(ff), H2 = $l(0.42, 0, 1, 1), G2 = $l(0, 0, 0.58, 1), Ny = $l(0.42, 0, 0.58, 1), q2 = (i) => Array.isArray(i) && typeof i[0] != "number", jy = (i) => Array.isArray(i) && typeof i[0] == "number", Y2 = {
    linear: nn,
    easeIn: H2,
    easeInOut: Ny,
    easeOut: G2,
    circIn: ff,
    circInOut: Oy,
    circOut: Ry,
    backIn: cf,
    backInOut: Cy,
    backOut: zy,
    anticipate: wy
  }, k2 = (i) => typeof i == "string", Ip = (i) => {
    if (jy(i)) {
      uf(i.length === 4);
      const [a, s, r, c] = i;
      return $l(a, s, r, c);
    } else if (k2(i)) return Y2[i];
    return i;
  }, xr = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender"
  ];
  function X2(i, a) {
    let s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), c = false, f = false;
    const h = /* @__PURE__ */ new WeakSet();
    let m = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    function p(v) {
      h.has(v) && (y.schedule(v), i()), v(m);
    }
    const y = {
      schedule: (v, b = false, T = false) => {
        const C = T && c ? s : r;
        return b && h.add(v), C.add(v), v;
      },
      cancel: (v) => {
        r.delete(v), h.delete(v);
      },
      process: (v) => {
        if (m = v, c) {
          f = true;
          return;
        }
        c = true;
        const b = s;
        s = r, r = b, s.forEach(p), s.clear(), c = false, f && (f = false, y.process(v));
      }
    };
    return y;
  }
  const K2 = 40;
  function Vy(i, a) {
    let s = false, r = true;
    const c = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    }, f = () => s = true, h = xr.reduce((G, Q) => (G[Q] = X2(f), G), {}), { setup: m, read: p, resolveKeyframes: y, preUpdate: v, update: b, preRender: T, render: w, postRender: C } = h, L = () => {
      const G = yi.useManualTiming, Q = G ? c.timestamp : performance.now();
      s = false, G || (c.delta = r ? 1e3 / 60 : Math.max(Math.min(Q - c.timestamp, K2), 1)), c.timestamp = Q, c.isProcessing = true, m.process(c), p.process(c), y.process(c), v.process(c), b.process(c), T.process(c), w.process(c), C.process(c), c.isProcessing = false, s && a && (r = false, i(L));
    }, H = () => {
      s = true, r = true, c.isProcessing || i(L);
    };
    return {
      schedule: xr.reduce((G, Q) => {
        const I = h[Q];
        return G[Q] = (ft, et = false, nt = false) => (s || H(), I.schedule(ft, et, nt)), G;
      }, {}),
      cancel: (G) => {
        for (let Q = 0; Q < xr.length; Q++) h[xr[Q]].cancel(G);
      },
      state: c,
      steps: h
    };
  }
  const { schedule: Lt, cancel: gi, state: ye, steps: yc } = Vy(typeof requestAnimationFrame < "u" ? requestAnimationFrame : nn, true);
  let _r;
  function Q2() {
    _r = void 0;
  }
  const Ae = {
    now: () => (_r === void 0 && Ae.set(ye.isProcessing || yi.useManualTiming ? ye.timestamp : performance.now()), _r),
    set: (i) => {
      _r = i, queueMicrotask(Q2);
    }
  }, Uy = (i) => (a) => typeof a == "string" && a.startsWith(i), Ly = Uy("--"), Z2 = Uy("var(--"), hf = (i) => Z2(i) ? P2.test(i.split("/*")[0].trim()) : false, P2 = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
  function t0(i) {
    return typeof i != "string" ? false : i.split("/*")[0].includes("var(--");
  }
  const Ha = {
    test: (i) => typeof i == "number",
    parse: parseFloat,
    transform: (i) => i
  }, Pl = {
    ...Ha,
    transform: (i) => xn(0, 1, i)
  }, Tr = {
    ...Ha,
    default: 1
  }, kl = (i) => Math.round(i * 1e5) / 1e5, df = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
  function J2(i) {
    return i == null;
  }
  const F2 = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, mf = (i, a) => (s) => !!(typeof s == "string" && F2.test(s) && s.startsWith(i) || a && !J2(s) && Object.prototype.hasOwnProperty.call(s, a)), By = (i, a, s) => (r) => {
    if (typeof r != "string") return r;
    const [c, f, h, m] = r.match(df);
    return {
      [i]: parseFloat(c),
      [a]: parseFloat(f),
      [s]: parseFloat(h),
      alpha: m !== void 0 ? parseFloat(m) : 1
    };
  }, W2 = (i) => xn(0, 255, i), gc = {
    ...Ha,
    transform: (i) => Math.round(W2(i))
  }, ki = {
    test: mf("rgb", "red"),
    parse: By("red", "green", "blue"),
    transform: ({ red: i, green: a, blue: s, alpha: r = 1 }) => "rgba(" + gc.transform(i) + ", " + gc.transform(a) + ", " + gc.transform(s) + ", " + kl(Pl.transform(r)) + ")"
  };
  function $2(i) {
    let a = "", s = "", r = "", c = "";
    return i.length > 5 ? (a = i.substring(1, 3), s = i.substring(3, 5), r = i.substring(5, 7), c = i.substring(7, 9)) : (a = i.substring(1, 2), s = i.substring(2, 3), r = i.substring(3, 4), c = i.substring(4, 5), a += a, s += s, r += r, c += c), {
      red: parseInt(a, 16),
      green: parseInt(s, 16),
      blue: parseInt(r, 16),
      alpha: c ? parseInt(c, 16) / 255 : 1
    };
  }
  const Nc = {
    test: mf("#"),
    parse: $2,
    transform: ki.transform
  }, Il = (i) => ({
    test: (a) => typeof a == "string" && a.endsWith(i) && a.split(" ").length === 1,
    parse: parseFloat,
    transform: (a) => `${a}${i}`
  }), di = Il("deg"), Sn = Il("%"), F = Il("px"), I2 = Il("vh"), tS = Il("vw"), e0 = {
    ...Sn,
    parse: (i) => Sn.parse(i) / 100,
    transform: (i) => Sn.transform(i * 100)
  }, ja = {
    test: mf("hsl", "hue"),
    parse: By("hue", "saturation", "lightness"),
    transform: ({ hue: i, saturation: a, lightness: s, alpha: r = 1 }) => "hsla(" + Math.round(i) + ", " + Sn.transform(kl(a)) + ", " + Sn.transform(kl(s)) + ", " + kl(Pl.transform(r)) + ")"
  }, ie = {
    test: (i) => ki.test(i) || Nc.test(i) || ja.test(i),
    parse: (i) => ki.test(i) ? ki.parse(i) : ja.test(i) ? ja.parse(i) : Nc.parse(i),
    transform: (i) => typeof i == "string" ? i : i.hasOwnProperty("red") ? ki.transform(i) : ja.transform(i),
    getAnimatableNone: (i) => {
      const a = ie.parse(i);
      return a.alpha = 0, ie.transform(a);
    }
  }, eS = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
  function nS(i) {
    var _a, _b2;
    return isNaN(i) && typeof i == "string" && (((_a = i.match(df)) == null ? void 0 : _a.length) || 0) + (((_b2 = i.match(eS)) == null ? void 0 : _b2.length) || 0) > 0;
  }
  const Hy = "number", Gy = "color", iS = "var", aS = "var(", n0 = "${}", lS = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  function La(i) {
    const a = i.toString(), s = [], r = {
      color: [],
      number: [],
      var: []
    }, c = [];
    let f = 0;
    const m = a.replace(lS, (p) => (ie.test(p) ? (r.color.push(f), c.push(Gy), s.push(ie.parse(p))) : p.startsWith(aS) ? (r.var.push(f), c.push(iS), s.push(p)) : (r.number.push(f), c.push(Hy), s.push(parseFloat(p))), ++f, n0)).split(n0);
    return {
      values: s,
      split: m,
      indexes: r,
      types: c
    };
  }
  function sS(i) {
    return La(i).values;
  }
  function qy({ split: i, types: a }) {
    const s = i.length;
    return (r) => {
      let c = "";
      for (let f = 0; f < s; f++) if (c += i[f], r[f] !== void 0) {
        const h = a[f];
        h === Hy ? c += kl(r[f]) : h === Gy ? c += ie.transform(r[f]) : c += r[f];
      }
      return c;
    };
  }
  function rS(i) {
    return qy(La(i));
  }
  const uS = (i) => typeof i == "number" ? 0 : ie.test(i) ? ie.getAnimatableNone(i) : i, oS = (i, a) => typeof i == "number" ? (a == null ? void 0 : a.trim().endsWith("/")) ? i : 0 : uS(i);
  function cS(i) {
    const a = La(i);
    return qy(a)(a.values.map((r, c) => oS(r, a.split[c])));
  }
  const cn = {
    test: nS,
    parse: sS,
    createTransformer: rS,
    getAnimatableNone: cS
  };
  function vc(i, a, s) {
    return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? i + (a - i) * 6 * s : s < 1 / 2 ? a : s < 2 / 3 ? i + (a - i) * (2 / 3 - s) * 6 : i;
  }
  function fS({ hue: i, saturation: a, lightness: s, alpha: r }) {
    i /= 360, a /= 100, s /= 100;
    let c = 0, f = 0, h = 0;
    if (!a) c = f = h = s;
    else {
      const m = s < 0.5 ? s * (1 + a) : s + a - s * a, p = 2 * s - m;
      c = vc(p, m, i + 1 / 3), f = vc(p, m, i), h = vc(p, m, i - 1 / 3);
    }
    return {
      red: Math.round(c * 255),
      green: Math.round(f * 255),
      blue: Math.round(h * 255),
      alpha: r
    };
  }
  function jr(i, a) {
    return (s) => s > 0 ? a : i;
  }
  const qt = (i, a, s) => i + (a - i) * s, bc = (i, a, s) => {
    const r = i * i, c = s * (a * a - r) + r;
    return c < 0 ? 0 : Math.sqrt(c);
  }, hS = [
    Nc,
    ki,
    ja
  ], dS = (i) => hS.find((a) => a.test(i));
  function i0(i) {
    const a = dS(i);
    if (!a) return false;
    let s = a.parse(i);
    return a === ja && (s = fS(s)), s;
  }
  const a0 = (i, a) => {
    const s = i0(i), r = i0(a);
    if (!s || !r) return jr(i, a);
    const c = {
      ...s
    };
    return (f) => (c.red = bc(s.red, r.red, f), c.green = bc(s.green, r.green, f), c.blue = bc(s.blue, r.blue, f), c.alpha = qt(s.alpha, r.alpha, f), ki.transform(c));
  }, jc = /* @__PURE__ */ new Set([
    "none",
    "hidden"
  ]);
  function mS(i, a) {
    return jc.has(i) ? (s) => s <= 0 ? i : a : (s) => s >= 1 ? a : i;
  }
  function pS(i, a) {
    return (s) => qt(i, a, s);
  }
  function pf(i) {
    return typeof i == "number" ? pS : typeof i == "string" ? hf(i) ? jr : ie.test(i) ? a0 : vS : Array.isArray(i) ? Yy : typeof i == "object" ? ie.test(i) ? a0 : yS : jr;
  }
  function Yy(i, a) {
    const s = [
      ...i
    ], r = s.length, c = i.map((f, h) => pf(f)(f, a[h]));
    return (f) => {
      for (let h = 0; h < r; h++) s[h] = c[h](f);
      return s;
    };
  }
  function yS(i, a) {
    const s = {
      ...i,
      ...a
    }, r = {};
    for (const c in s) i[c] !== void 0 && a[c] !== void 0 && (r[c] = pf(i[c])(i[c], a[c]));
    return (c) => {
      for (const f in r) s[f] = r[f](c);
      return s;
    };
  }
  function gS(i, a) {
    const s = [], r = {
      color: 0,
      var: 0,
      number: 0
    };
    for (let c = 0; c < a.values.length; c++) {
      const f = a.types[c], h = i.indexes[f][r[f]], m = i.values[h] ?? 0;
      s[c] = m, r[f]++;
    }
    return s;
  }
  const vS = (i, a) => {
    const s = cn.createTransformer(a), r = La(i), c = La(a);
    return r.indexes.var.length === c.indexes.var.length && r.indexes.color.length === c.indexes.color.length && r.indexes.number.length >= c.indexes.number.length ? jc.has(i) && !c.values.length || jc.has(a) && !r.values.length ? mS(i, a) : Wl(Yy(gS(r, c), c.values), s) : jr(i, a);
  };
  function ky(i, a, s) {
    return typeof i == "number" && typeof a == "number" && typeof s == "number" ? qt(i, a, s) : pf(i)(i, a);
  }
  const bS = (i) => {
    const a = ({ timestamp: s }) => i(s);
    return {
      start: (s = true) => Lt.update(a, s),
      stop: () => gi(a),
      now: () => ye.isProcessing ? ye.timestamp : Ae.now()
    };
  }, Xy = (i, a, s = 10) => {
    let r = "";
    const c = Math.max(Math.round(a / s), 2);
    for (let f = 0; f < c; f++) r += Math.round(i(f / (c - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${r.substring(0, r.length - 2)})`;
  }, Vr = 2e4;
  function yf(i) {
    let a = 0;
    const s = 50;
    let r = i.next(a);
    for (; !r.done && a < Vr; ) a += s, r = i.next(a);
    return a >= Vr ? 1 / 0 : a;
  }
  function SS(i, a = 100, s) {
    const r = s({
      ...i,
      keyframes: [
        0,
        a
      ]
    }), c = Math.min(yf(r), Vr);
    return {
      type: "keyframes",
      ease: (f) => r.next(c * f).value / a,
      duration: en(c)
    };
  }
  const Jt = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: {
      granular: 0.01,
      default: 2
    },
    restDelta: {
      granular: 5e-3,
      default: 0.5
    },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1
  };
  function Vc(i, a) {
    return i * Math.sqrt(1 - a * a);
  }
  const xS = 12;
  function TS(i, a, s) {
    let r = s;
    for (let c = 1; c < xS; c++) r = r - i(r) / a(r);
    return r;
  }
  const Sc = 1e-3;
  function AS({ duration: i = Jt.duration, bounce: a = Jt.bounce, velocity: s = Jt.velocity, mass: r = Jt.mass }) {
    let c, f, h = 1 - a;
    h = xn(Jt.minDamping, Jt.maxDamping, h), i = xn(Jt.minDuration, Jt.maxDuration, en(i)), h < 1 ? (c = (y) => {
      const v = y * h, b = v * i, T = v - s, w = Vc(y, h), C = Math.exp(-b);
      return Sc - T / w * C;
    }, f = (y) => {
      const b = y * h * i, T = b * s + s, w = Math.pow(h, 2) * Math.pow(y, 2) * i, C = Math.exp(-b), L = Vc(Math.pow(y, 2), h);
      return (-c(y) + Sc > 0 ? -1 : 1) * ((T - w) * C) / L;
    }) : (c = (y) => {
      const v = Math.exp(-y * i), b = (y - s) * i + 1;
      return -Sc + v * b;
    }, f = (y) => {
      const v = Math.exp(-y * i), b = (s - y) * (i * i);
      return v * b;
    });
    const m = 5 / i, p = TS(c, f, m);
    if (i = ke(i), isNaN(p)) return {
      stiffness: Jt.stiffness,
      damping: Jt.damping,
      duration: i
    };
    {
      const y = Math.pow(p, 2) * r;
      return {
        stiffness: y,
        damping: h * 2 * Math.sqrt(r * y),
        duration: i
      };
    }
  }
  const ES = [
    "duration",
    "bounce"
  ], _S = [
    "stiffness",
    "damping",
    "mass"
  ];
  function l0(i, a) {
    return a.some((s) => i[s] !== void 0);
  }
  function MS(i) {
    let a = {
      velocity: Jt.velocity,
      stiffness: Jt.stiffness,
      damping: Jt.damping,
      mass: Jt.mass,
      isResolvedFromDuration: false,
      ...i
    };
    if (!l0(i, _S) && l0(i, ES)) if (a.velocity = 0, i.visualDuration) {
      const s = i.visualDuration, r = 2 * Math.PI / (s * 1.2), c = r * r, f = 2 * xn(0.05, 1, 1 - (i.bounce || 0)) * Math.sqrt(c);
      a = {
        ...a,
        mass: Jt.mass,
        stiffness: c,
        damping: f
      };
    } else {
      const s = AS({
        ...i,
        velocity: 0
      });
      a = {
        ...a,
        ...s,
        mass: Jt.mass
      }, a.isResolvedFromDuration = true;
    }
    return a;
  }
  function Ur(i = Jt.visualDuration, a = Jt.bounce) {
    const s = typeof i != "object" ? {
      visualDuration: i,
      keyframes: [
        0,
        1
      ],
      bounce: a
    } : i;
    let { restSpeed: r, restDelta: c } = s;
    const f = s.keyframes[0], h = s.keyframes[s.keyframes.length - 1], m = {
      done: false,
      value: f
    }, { stiffness: p, damping: y, mass: v, duration: b, velocity: T, isResolvedFromDuration: w } = MS({
      ...s,
      velocity: -en(s.velocity || 0)
    }), C = T || 0, L = y / (2 * Math.sqrt(p * v)), H = h - f, B = en(Math.sqrt(p / v)), k = Math.abs(H) < 5;
    r || (r = k ? Jt.restSpeed.granular : Jt.restSpeed.default), c || (c = k ? Jt.restDelta.granular : Jt.restDelta.default);
    let G, Q, I, ft, et, nt;
    if (L < 1) I = Vc(B, L), ft = (C + L * B * H) / I, G = (it) => {
      const St = Math.exp(-L * B * it);
      return h - St * (ft * Math.sin(I * it) + H * Math.cos(I * it));
    }, et = L * B * ft + H * I, nt = L * B * H - ft * I, Q = (it) => Math.exp(-L * B * it) * (et * Math.sin(I * it) + nt * Math.cos(I * it));
    else if (L === 1) {
      G = (St) => h - Math.exp(-B * St) * (H + (C + B * H) * St);
      const it = C + B * H;
      Q = (St) => Math.exp(-B * St) * (B * it * St - C);
    } else {
      const it = B * Math.sqrt(L * L - 1);
      G = (Qt) => {
        const kt = Math.exp(-L * B * Qt), O = Math.min(it * Qt, 300);
        return h - kt * ((C + L * B * H) * Math.sinh(O) + it * H * Math.cosh(O)) / it;
      };
      const St = (C + L * B * H) / it, At = L * B * St - H * it, oe = L * B * H - St * it;
      Q = (Qt) => {
        const kt = Math.exp(-L * B * Qt), O = Math.min(it * Qt, 300);
        return kt * (At * Math.sinh(O) + oe * Math.cosh(O));
      };
    }
    const zt = {
      calculatedDuration: w && b || null,
      velocity: (it) => ke(Q(it)),
      next: (it) => {
        if (!w && L < 1) {
          const At = Math.exp(-L * B * it), oe = Math.sin(I * it), Qt = Math.cos(I * it), kt = h - At * (ft * oe + H * Qt), O = ke(At * (et * oe + nt * Qt));
          return m.done = Math.abs(O) <= r && Math.abs(h - kt) <= c, m.value = m.done ? h : kt, m;
        }
        const St = G(it);
        if (w) m.done = it >= b;
        else {
          const At = ke(Q(it));
          m.done = Math.abs(At) <= r && Math.abs(h - St) <= c;
        }
        return m.value = m.done ? h : St, m;
      },
      toString: () => {
        const it = Math.min(yf(zt), Vr), St = Xy((At) => zt.next(it * At).value, it, 30);
        return it + "ms " + St;
      },
      toTransition: () => {
      }
    };
    return zt;
  }
  Ur.applyToOptions = (i) => {
    const a = SS(i, 100, Ur);
    return i.ease = a.ease, i.duration = ke(a.duration), i.type = "keyframes", i;
  };
  const DS = 5;
  function Ky(i, a, s) {
    const r = Math.max(a - DS, 0);
    return Ey(s - i(r), a - r);
  }
  function Uc({ keyframes: i, velocity: a = 0, power: s = 0.8, timeConstant: r = 325, bounceDamping: c = 10, bounceStiffness: f = 500, modifyTarget: h, min: m, max: p, restDelta: y = 0.5, restSpeed: v }) {
    const b = i[0], T = {
      done: false,
      value: b
    }, w = (nt) => m !== void 0 && nt < m || p !== void 0 && nt > p, C = (nt) => m === void 0 ? p : p === void 0 || Math.abs(m - nt) < Math.abs(p - nt) ? m : p;
    let L = s * a;
    const H = b + L, B = h === void 0 ? H : h(H);
    B !== H && (L = B - b);
    const k = (nt) => -L * Math.exp(-nt / r), G = (nt) => B + k(nt), Q = (nt) => {
      const zt = k(nt), it = G(nt);
      T.done = Math.abs(zt) <= y, T.value = T.done ? B : it;
    };
    let I, ft;
    const et = (nt) => {
      w(T.value) && (I = nt, ft = Ur({
        keyframes: [
          T.value,
          C(T.value)
        ],
        velocity: Ky(G, nt, T.value),
        damping: c,
        stiffness: f,
        restDelta: y,
        restSpeed: v
      }));
    };
    return et(0), {
      calculatedDuration: null,
      next: (nt) => {
        let zt = false;
        return !ft && I === void 0 && (zt = true, Q(nt), et(nt)), I !== void 0 && nt >= I ? ft.next(nt - I) : (!zt && Q(nt), T);
      }
    };
  }
  function zS(i, a, s) {
    const r = [], c = s || yi.mix || ky, f = i.length - 1;
    for (let h = 0; h < f; h++) {
      let m = c(i[h], i[h + 1]);
      if (a) {
        const p = Array.isArray(a) ? a[h] || nn : a;
        m = Wl(p, m);
      }
      r.push(m);
    }
    return r;
  }
  function CS(i, a, { clamp: s = true, ease: r, mixer: c } = {}) {
    const f = i.length;
    if (uf(f === a.length), f === 1) return () => a[0];
    if (f === 2 && a[0] === a[1]) return () => a[1];
    const h = i[0] === i[1];
    i[0] > i[f - 1] && (i = [
      ...i
    ].reverse(), a = [
      ...a
    ].reverse());
    const m = zS(a, r, c), p = m.length, y = (v) => {
      if (h && v < i[0]) return a[0];
      let b = 0;
      if (p > 1) for (; b < i.length - 2 && !(v < i[b + 1]); b++) ;
      const T = Zl(i[b], i[b + 1], v);
      return m[b](T);
    };
    return s ? (v) => y(xn(i[0], i[f - 1], v)) : y;
  }
  function wS(i, a) {
    const s = i[i.length - 1];
    for (let r = 1; r <= a; r++) {
      const c = Zl(0, a, r);
      i.push(qt(s, 1, c));
    }
  }
  function RS(i) {
    const a = [
      0
    ];
    return wS(a, i.length - 1), a;
  }
  function OS(i, a) {
    return i.map((s) => s * a);
  }
  function NS(i, a) {
    return i.map(() => a || Ny).splice(0, i.length - 1);
  }
  function Xl({ duration: i = 300, keyframes: a, times: s, ease: r = "easeInOut" }) {
    const c = q2(r) ? r.map(Ip) : Ip(r), f = {
      done: false,
      value: a[0]
    }, h = OS(s && s.length === a.length ? s : RS(a), i), m = CS(h, a, {
      ease: Array.isArray(c) ? c : NS(a, c)
    });
    return {
      calculatedDuration: i,
      next: (p) => (f.value = m(p), f.done = p >= i, f)
    };
  }
  const jS = (i) => i !== null;
  function Yr(i, { repeat: a, repeatType: s = "loop" }, r, c = 1) {
    const f = i.filter(jS), m = c < 0 || a && s !== "loop" && a % 2 === 1 ? 0 : f.length - 1;
    return !m || r === void 0 ? f[m] : r;
  }
  const VS = {
    decay: Uc,
    inertia: Uc,
    tween: Xl,
    keyframes: Xl,
    spring: Ur
  };
  function Qy(i) {
    typeof i.type == "string" && (i.type = VS[i.type]);
  }
  class gf {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((a) => {
        this.resolve = a;
      });
    }
    notifyFinished() {
      this.resolve();
    }
    then(a, s) {
      return this.finished.then(a, s);
    }
  }
  const US = (i) => i / 100;
  class Lr extends gf {
    constructor(a) {
      super(), this.state = "idle", this.startTime = null, this.isStopped = false, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
        done: false,
        value: void 0
      }, this.stop = () => {
        var _a, _b2;
        const { motionValue: s } = this.options;
        s && s.updatedAt !== Ae.now() && this.tick(Ae.now()), this.isStopped = true, this.state !== "idle" && (this.teardown(), (_b2 = (_a = this.options).onStop) == null ? void 0 : _b2.call(_a));
      }, this.options = a, this.initAnimation(), this.play(), a.autoplay === false && this.pause();
    }
    initAnimation() {
      const { options: a } = this;
      Qy(a);
      const { type: s = Xl, repeat: r = 0, repeatDelay: c = 0, repeatType: f, velocity: h = 0 } = a;
      let { keyframes: m } = a;
      const p = s || Xl;
      p !== Xl && typeof m[0] != "number" && (this.mixKeyframes = Wl(US, ky(m[0], m[1])), m = [
        0,
        100
      ]);
      const y = p({
        ...a,
        keyframes: m
      });
      f === "mirror" && (this.mirroredGenerator = p({
        ...a,
        keyframes: [
          ...m
        ].reverse(),
        velocity: -h
      })), y.calculatedDuration === null && (y.calculatedDuration = yf(y));
      const { calculatedDuration: v } = y;
      this.calculatedDuration = v, this.resolvedDuration = v + c, this.totalDuration = this.resolvedDuration * (r + 1) - c, this.generator = y;
    }
    updateTime(a) {
      const s = Math.round(a - this.startTime) * this.playbackSpeed;
      this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = s;
    }
    tick(a, s = false) {
      const { generator: r, totalDuration: c, mixKeyframes: f, mirroredGenerator: h, resolvedDuration: m, calculatedDuration: p } = this;
      if (this.startTime === null) return r.next(0);
      const { delay: y = 0, keyframes: v, repeat: b, repeatType: T, repeatDelay: w, type: C, onUpdate: L, finalKeyframe: H } = this.options;
      this.speed > 0 ? this.startTime = Math.min(this.startTime, a) : this.speed < 0 && (this.startTime = Math.min(a - c / this.speed, this.startTime)), s ? this.currentTime = a : this.updateTime(a);
      const B = this.currentTime - y * (this.playbackSpeed >= 0 ? 1 : -1), k = this.playbackSpeed >= 0 ? B < 0 : B > c;
      this.currentTime = Math.max(B, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
      let G = this.currentTime, Q = r;
      if (b) {
        const nt = Math.min(this.currentTime, c) / m;
        let zt = Math.floor(nt), it = nt % 1;
        !it && nt >= 1 && (it = 1), it === 1 && zt--, zt = Math.min(zt, b + 1), !!(zt % 2) && (T === "reverse" ? (it = 1 - it, w && (it -= w / m)) : T === "mirror" && (Q = h)), G = xn(0, 1, it) * m;
      }
      let I;
      k ? (this.delayState.value = v[0], I = this.delayState) : I = Q.next(G), f && !k && (I.value = f(I.value));
      let { done: ft } = I;
      !k && p !== null && (ft = this.playbackSpeed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
      const et = this.holdTime === null && (this.state === "finished" || this.state === "running" && ft);
      return et && C !== Uc && (I.value = Yr(v, this.options, H, this.speed)), L && L(I.value), et && this.finish(), I;
    }
    then(a, s) {
      return this.finished.then(a, s);
    }
    get duration() {
      return en(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: a = 0 } = this.options || {};
      return this.duration + en(a);
    }
    get time() {
      return en(this.currentTime);
    }
    set time(a) {
      a = ke(a), this.currentTime = a, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = a : this.driver && (this.startTime = this.driver.now() - a / this.playbackSpeed), this.driver ? this.driver.start(false) : (this.startTime = 0, this.state = "paused", this.holdTime = a, this.tick(a));
    }
    getGeneratorVelocity() {
      const a = this.currentTime;
      if (a <= 0) return this.options.velocity || 0;
      if (this.generator.velocity) return this.generator.velocity(a);
      const s = this.generator.next(a).value;
      return Ky((r) => this.generator.next(r).value, a, s);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(a) {
      const s = this.playbackSpeed !== a;
      s && this.driver && this.updateTime(Ae.now()), this.playbackSpeed = a, s && this.driver && (this.time = en(this.currentTime));
    }
    play() {
      var _a, _b2;
      if (this.isStopped) return;
      const { driver: a = bS, startTime: s } = this.options;
      this.driver || (this.driver = a((c) => this.tick(c))), (_b2 = (_a = this.options).onPlay) == null ? void 0 : _b2.call(_a);
      const r = this.driver.now();
      this.state === "finished" ? (this.updateFinished(), this.startTime = r) : this.holdTime !== null ? this.startTime = r - this.holdTime : this.startTime || (this.startTime = s ?? r), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
    }
    pause() {
      this.state = "paused", this.updateTime(Ae.now()), this.holdTime = this.currentTime;
    }
    complete() {
      this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
    }
    finish() {
      var _a, _b2;
      this.notifyFinished(), this.teardown(), this.state = "finished", (_b2 = (_a = this.options).onComplete) == null ? void 0 : _b2.call(_a);
    }
    cancel() {
      var _a, _b2;
      this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (_b2 = (_a = this.options).onCancel) == null ? void 0 : _b2.call(_a);
    }
    teardown() {
      this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
    }
    stopDriver() {
      this.driver && (this.driver.stop(), this.driver = void 0);
    }
    sample(a) {
      return this.startTime = 0, this.tick(a, true);
    }
    attachTimeline(a) {
      var _a;
      return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (_a = this.driver) == null ? void 0 : _a.stop(), a.observe(this);
    }
  }
  function LS(i) {
    for (let a = 1; a < i.length; a++) i[a] ?? (i[a] = i[a - 1]);
  }
  const Xi = (i) => i * 180 / Math.PI, Lc = (i) => {
    const a = Xi(Math.atan2(i[1], i[0]));
    return Bc(a);
  }, BS = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (i) => (Math.abs(i[0]) + Math.abs(i[3])) / 2,
    rotate: Lc,
    rotateZ: Lc,
    skewX: (i) => Xi(Math.atan(i[1])),
    skewY: (i) => Xi(Math.atan(i[2])),
    skew: (i) => (Math.abs(i[1]) + Math.abs(i[2])) / 2
  }, Bc = (i) => (i = i % 360, i < 0 && (i += 360), i), s0 = Lc, r0 = (i) => Math.sqrt(i[0] * i[0] + i[1] * i[1]), u0 = (i) => Math.sqrt(i[4] * i[4] + i[5] * i[5]), HS = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: r0,
    scaleY: u0,
    scale: (i) => (r0(i) + u0(i)) / 2,
    rotateX: (i) => Bc(Xi(Math.atan2(i[6], i[5]))),
    rotateY: (i) => Bc(Xi(Math.atan2(-i[2], i[0]))),
    rotateZ: s0,
    rotate: s0,
    skewX: (i) => Xi(Math.atan(i[4])),
    skewY: (i) => Xi(Math.atan(i[1])),
    skew: (i) => (Math.abs(i[1]) + Math.abs(i[4])) / 2
  };
  function Hc(i) {
    return i.includes("scale") ? 1 : 0;
  }
  function Gc(i, a) {
    if (!i || i === "none") return Hc(a);
    const s = i.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let r, c;
    if (s) r = HS, c = s;
    else {
      const m = i.match(/^matrix\(([-\d.e\s,]+)\)$/u);
      r = BS, c = m;
    }
    if (!c) return Hc(a);
    const f = r[a], h = c[1].split(",").map(qS);
    return typeof f == "function" ? f(h) : h[f];
  }
  const GS = (i, a) => {
    const { transform: s = "none" } = getComputedStyle(i);
    return Gc(s, a);
  };
  function qS(i) {
    return parseFloat(i.trim());
  }
  const Ga = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY"
  ], qa = new Set(Ga), o0 = (i) => i === Ha || i === F, YS = /* @__PURE__ */ new Set([
    "x",
    "y",
    "z"
  ]), kS = Ga.filter((i) => !YS.has(i));
  function XS(i) {
    const a = [];
    return kS.forEach((s) => {
      const r = i.getValue(s);
      r !== void 0 && (a.push([
        s,
        r.get()
      ]), r.set(s.startsWith("scale") ? 1 : 0));
    }), a;
  }
  const pi = {
    width: ({ x: i }, { paddingLeft: a = "0", paddingRight: s = "0", boxSizing: r }) => {
      const c = i.max - i.min;
      return r === "border-box" ? c : c - parseFloat(a) - parseFloat(s);
    },
    height: ({ y: i }, { paddingTop: a = "0", paddingBottom: s = "0", boxSizing: r }) => {
      const c = i.max - i.min;
      return r === "border-box" ? c : c - parseFloat(a) - parseFloat(s);
    },
    top: (i, { top: a }) => parseFloat(a),
    left: (i, { left: a }) => parseFloat(a),
    bottom: ({ y: i }, { top: a }) => parseFloat(a) + (i.max - i.min),
    right: ({ x: i }, { left: a }) => parseFloat(a) + (i.max - i.min),
    x: (i, { transform: a }) => Gc(a, "x"),
    y: (i, { transform: a }) => Gc(a, "y")
  };
  pi.translateX = pi.x;
  pi.translateY = pi.y;
  const Ki = /* @__PURE__ */ new Set();
  let qc = false, Yc = false, kc = false;
  function Zy() {
    if (Yc) {
      const i = Array.from(Ki).filter((r) => r.needsMeasurement), a = new Set(i.map((r) => r.element)), s = /* @__PURE__ */ new Map();
      a.forEach((r) => {
        const c = XS(r);
        c.length && (s.set(r, c), r.render());
      }), i.forEach((r) => r.measureInitialState()), a.forEach((r) => {
        r.render();
        const c = s.get(r);
        c && c.forEach(([f, h]) => {
          var _a;
          (_a = r.getValue(f)) == null ? void 0 : _a.set(h);
        });
      }), i.forEach((r) => r.measureEndState()), i.forEach((r) => {
        r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
      });
    }
    Yc = false, qc = false, Ki.forEach((i) => i.complete(kc)), Ki.clear();
  }
  function Py() {
    Ki.forEach((i) => {
      i.readKeyframes(), i.needsMeasurement && (Yc = true);
    });
  }
  function KS() {
    kc = true, Py(), Zy(), kc = false;
  }
  class vf {
    constructor(a, s, r, c, f, h = false) {
      this.state = "pending", this.isAsync = false, this.needsMeasurement = false, this.unresolvedKeyframes = [
        ...a
      ], this.onComplete = s, this.name = r, this.motionValue = c, this.element = f, this.isAsync = h;
    }
    scheduleResolve() {
      this.state = "scheduled", this.isAsync ? (Ki.add(this), qc || (qc = true, Lt.read(Py), Lt.resolveKeyframes(Zy))) : (this.readKeyframes(), this.complete());
    }
    readKeyframes() {
      const { unresolvedKeyframes: a, name: s, element: r, motionValue: c } = this;
      if (a[0] === null) {
        const f = c == null ? void 0 : c.get(), h = a[a.length - 1];
        if (f !== void 0) a[0] = f;
        else if (r && s) {
          const m = r.readValue(s, h);
          m != null && (a[0] = m);
        }
        a[0] === void 0 && (a[0] = h), c && f === void 0 && c.set(a[0]);
      }
      LS(a);
    }
    setFinalKeyframe() {
    }
    measureInitialState() {
    }
    renderEndStyles() {
    }
    measureEndState() {
    }
    complete(a = false) {
      this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, a), Ki.delete(this);
    }
    cancel() {
      this.state === "scheduled" && (Ki.delete(this), this.state = "pending");
    }
    resume() {
      this.state === "pending" && this.scheduleResolve();
    }
  }
  const QS = (i) => i.startsWith("--");
  function Jy(i, a, s) {
    QS(a) ? i.style.setProperty(a, s) : i.style[a] = s;
  }
  const ZS = {};
  function Fy(i, a) {
    const s = Ay(i);
    return () => ZS[a] ?? s();
  }
  const PS = Fy(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Wy = Fy(() => {
    try {
      document.createElement("div").animate({
        opacity: 0
      }, {
        easing: "linear(0, 1)"
      });
    } catch {
      return false;
    }
    return true;
  }, "linearEasing"), Yl = ([i, a, s, r]) => `cubic-bezier(${i}, ${a}, ${s}, ${r})`, c0 = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: Yl([
      0,
      0.65,
      0.55,
      1
    ]),
    circOut: Yl([
      0.55,
      0,
      1,
      0.45
    ]),
    backIn: Yl([
      0.31,
      0.01,
      0.66,
      -0.59
    ]),
    backOut: Yl([
      0.33,
      1.53,
      0.69,
      0.99
    ])
  };
  function $y(i, a) {
    if (i) return typeof i == "function" ? Wy() ? Xy(i, a) : "ease-out" : jy(i) ? Yl(i) : Array.isArray(i) ? i.map((s) => $y(s, a) || c0.easeOut) : c0[i];
  }
  function JS(i, a, s, { delay: r = 0, duration: c = 300, repeat: f = 0, repeatType: h = "loop", ease: m = "easeOut", times: p } = {}, y = void 0) {
    const v = {
      [a]: s
    };
    p && (v.offset = p);
    const b = $y(m, c);
    Array.isArray(b) && (v.easing = b);
    const T = {
      delay: r,
      duration: c,
      easing: Array.isArray(b) ? "linear" : b,
      fill: "both",
      iterations: f + 1,
      direction: h === "reverse" ? "alternate" : "normal"
    };
    return y && (T.pseudoElement = y), i.animate(v, T);
  }
  function Iy(i) {
    return typeof i == "function" && "applyToOptions" in i;
  }
  function FS({ type: i, ...a }) {
    return Iy(i) && Wy() ? i.applyToOptions(a) : (a.duration ?? (a.duration = 300), a.ease ?? (a.ease = "easeOut"), a);
  }
  class tg extends gf {
    constructor(a) {
      if (super(), this.finishedTime = null, this.isStopped = false, this.manualStartTime = null, !a) return;
      const { element: s, name: r, keyframes: c, pseudoElement: f, allowFlatten: h = false, finalKeyframe: m, onComplete: p } = a;
      this.isPseudoElement = !!f, this.allowFlatten = h, this.options = a, uf(typeof a.type != "string");
      const y = FS(a);
      this.animation = JS(s, r, c, y, f), y.autoplay === false && this.animation.pause(), this.animation.onfinish = () => {
        if (this.finishedTime = this.time, !f) {
          const v = Yr(c, this.options, m, this.speed);
          this.updateMotionValue && this.updateMotionValue(v), Jy(s, r, v), this.animation.cancel();
        }
        p == null ? void 0 : p(), this.notifyFinished();
      };
    }
    play() {
      this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      var _a, _b2;
      (_b2 = (_a = this.animation).finish) == null ? void 0 : _b2.call(_a);
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch {
      }
    }
    stop() {
      if (this.isStopped) return;
      this.isStopped = true;
      const { state: a } = this;
      a === "idle" || a === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
    }
    commitStyles() {
      var _a, _b2, _c2;
      const a = (_a = this.options) == null ? void 0 : _a.element;
      !this.isPseudoElement && (a == null ? void 0 : a.isConnected) && ((_c2 = (_b2 = this.animation).commitStyles) == null ? void 0 : _c2.call(_b2));
    }
    get duration() {
      var _a, _b2;
      const a = ((_b2 = (_a = this.animation.effect) == null ? void 0 : _a.getComputedTiming) == null ? void 0 : _b2.call(_a).duration) || 0;
      return en(Number(a));
    }
    get iterationDuration() {
      const { delay: a = 0 } = this.options || {};
      return this.duration + en(a);
    }
    get time() {
      return en(Number(this.animation.currentTime) || 0);
    }
    set time(a) {
      const s = this.finishedTime !== null;
      this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = ke(a), s && this.animation.pause();
    }
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(a) {
      a < 0 && (this.finishedTime = null), this.animation.playbackRate = a;
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return this.manualStartTime ?? Number(this.animation.startTime);
    }
    set startTime(a) {
      this.manualStartTime = this.animation.startTime = a;
    }
    attachTimeline({ timeline: a, rangeStart: s, rangeEnd: r, observe: c }) {
      var _a;
      return this.allowFlatten && ((_a = this.animation.effect) == null ? void 0 : _a.updateTiming({
        easing: "linear"
      })), this.animation.onfinish = null, a && PS() ? (this.animation.timeline = a, s && (this.animation.rangeStart = s), r && (this.animation.rangeEnd = r), nn) : c(this);
    }
  }
  const eg = {
    anticipate: wy,
    backInOut: Cy,
    circInOut: Oy
  };
  function WS(i) {
    return i in eg;
  }
  function $S(i) {
    typeof i.ease == "string" && WS(i.ease) && (i.ease = eg[i.ease]);
  }
  const xc = 10;
  class IS extends tg {
    constructor(a) {
      $S(a), Qy(a), super(a), a.startTime !== void 0 && a.autoplay !== false && (this.startTime = a.startTime), this.options = a;
    }
    updateMotionValue(a) {
      const { motionValue: s, onUpdate: r, onComplete: c, element: f, ...h } = this.options;
      if (!s) return;
      if (a !== void 0) {
        s.set(a);
        return;
      }
      const m = new Lr({
        ...h,
        autoplay: false
      }), p = Math.max(xc, Ae.now() - this.startTime), y = xn(0, xc, p - xc), v = m.sample(p).value, { name: b } = this.options;
      f && b && Jy(f, b, v), s.setWithVelocity(m.sample(Math.max(0, p - y)).value, v, y), m.stop();
    }
  }
  const f0 = (i, a) => a === "zIndex" ? false : !!(typeof i == "number" || Array.isArray(i) || typeof i == "string" && (cn.test(i) || i === "0") && !i.startsWith("url("));
  function tx(i) {
    const a = i[0];
    if (i.length === 1) return true;
    for (let s = 0; s < i.length; s++) if (i[s] !== a) return true;
  }
  function ex(i, a, s, r) {
    const c = i[0];
    if (c === null) return false;
    if (a === "display" || a === "visibility") return true;
    const f = i[i.length - 1], h = f0(c, a), m = f0(f, a);
    return !h || !m ? false : tx(i) || (s === "spring" || Iy(s)) && r;
  }
  function Xc(i) {
    i.duration = 0, i.type = "keyframes";
  }
  const ng = /* @__PURE__ */ new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform"
  ]), nx = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
  function ix(i) {
    for (let a = 0; a < i.length; a++) if (typeof i[a] == "string" && nx.test(i[a])) return true;
    return false;
  }
  const ax = /* @__PURE__ */ new Set([
    "color",
    "backgroundColor",
    "outlineColor",
    "fill",
    "stroke",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor"
  ]), lx = Ay(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
  function sx(i) {
    var _a;
    const { motionValue: a, name: s, repeatDelay: r, repeatType: c, damping: f, type: h, keyframes: m } = i;
    if (!(((_a = a == null ? void 0 : a.owner) == null ? void 0 : _a.current) instanceof HTMLElement)) return false;
    const { onUpdate: y, transformTemplate: v } = a.owner.getProps();
    return lx() && s && (ng.has(s) || ax.has(s) && ix(m)) && (s !== "transform" || !v) && !y && !r && c !== "mirror" && f !== 0 && h !== "inertia";
  }
  const rx = 40;
  class ux extends gf {
    constructor({ autoplay: a = true, delay: s = 0, type: r = "keyframes", repeat: c = 0, repeatDelay: f = 0, repeatType: h = "loop", keyframes: m, name: p, motionValue: y, element: v, ...b }) {
      var _a;
      super(), this.stop = () => {
        var _a2, _b2;
        this._animation && (this._animation.stop(), (_a2 = this.stopTimeline) == null ? void 0 : _a2.call(this)), (_b2 = this.keyframeResolver) == null ? void 0 : _b2.cancel();
      }, this.createdAt = Ae.now();
      const T = {
        autoplay: a,
        delay: s,
        type: r,
        repeat: c,
        repeatDelay: f,
        repeatType: h,
        name: p,
        motionValue: y,
        element: v,
        ...b
      }, w = (v == null ? void 0 : v.KeyframeResolver) || vf;
      this.keyframeResolver = new w(m, (C, L, H) => this.onKeyframesResolved(C, L, T, !H), p, y, v), (_a = this.keyframeResolver) == null ? void 0 : _a.scheduleResolve();
    }
    onKeyframesResolved(a, s, r, c) {
      var _a, _b2;
      this.keyframeResolver = void 0;
      const { name: f, type: h, velocity: m, delay: p, isHandoff: y, onUpdate: v } = r;
      this.resolvedAt = Ae.now();
      let b = true;
      ex(a, f, h, m) || (b = false, (yi.instantAnimations || !p) && (v == null ? void 0 : v(Yr(a, r, s))), a[0] = a[a.length - 1], Xc(r), r.repeat = 0);
      const w = {
        startTime: c ? this.resolvedAt ? this.resolvedAt - this.createdAt > rx ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
        finalKeyframe: s,
        ...r,
        keyframes: a
      }, C = b && !y && sx(w), L = (_b2 = (_a = w.motionValue) == null ? void 0 : _a.owner) == null ? void 0 : _b2.current;
      let H;
      if (C) try {
        H = new IS({
          ...w,
          element: L
        });
      } catch {
        H = new Lr(w);
      }
      else H = new Lr(w);
      H.finished.then(() => {
        this.notifyFinished();
      }).catch(nn), this.pendingTimeline && (this.stopTimeline = H.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = H;
    }
    get finished() {
      return this._animation ? this.animation.finished : this._finished;
    }
    then(a, s) {
      return this.finished.finally(a).then(() => {
      });
    }
    get animation() {
      var _a;
      return this._animation || ((_a = this.keyframeResolver) == null ? void 0 : _a.resume(), KS()), this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(a) {
      this.animation.time = a;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(a) {
      this.animation.speed = a;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(a) {
      return this._animation ? this.stopTimeline = this.animation.attachTimeline(a) : this.pendingTimeline = a, () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      var _a;
      this._animation && this.animation.cancel(), (_a = this.keyframeResolver) == null ? void 0 : _a.cancel();
    }
  }
  function ig(i, a, s, r = 0, c = 1) {
    const f = Array.from(i).sort((y, v) => y.sortNodePosition(v)).indexOf(a), h = i.size, m = (h - 1) * r;
    return typeof s == "function" ? s(f, h) : c === 1 ? f * r : m - f * r;
  }
  const ox = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
  function cx(i) {
    const a = ox.exec(i);
    if (!a) return [
      ,
    ];
    const [, s, r, c] = a;
    return [
      `--${s ?? r}`,
      c
    ];
  }
  function ag(i, a, s = 1) {
    const [r, c] = cx(i);
    if (!r) return;
    const f = window.getComputedStyle(a).getPropertyValue(r);
    if (f) {
      const h = f.trim();
      return Sy(h) ? parseFloat(h) : h;
    }
    return hf(c) ? ag(c, a, s + 1) : c;
  }
  const fx = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
  }, hx = (i) => ({
    type: "spring",
    stiffness: 550,
    damping: i === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10
  }), dx = {
    type: "keyframes",
    duration: 0.8
  }, mx = {
    type: "keyframes",
    ease: [
      0.25,
      0.1,
      0.35,
      1
    ],
    duration: 0.3
  }, px = (i, { keyframes: a }) => a.length > 2 ? dx : qa.has(i) ? i.startsWith("scale") ? hx(a[1]) : fx : mx;
  function lg(i, a) {
    if ((i == null ? void 0 : i.inherit) && a) {
      const { inherit: s, ...r } = i;
      return {
        ...a,
        ...r
      };
    }
    return i;
  }
  function bf(i, a) {
    const s = (i == null ? void 0 : i[a]) ?? (i == null ? void 0 : i.default) ?? i;
    return s !== i ? lg(s, i) : s;
  }
  const yx = /* @__PURE__ */ new Set([
    "when",
    "delay",
    "delayChildren",
    "staggerChildren",
    "staggerDirection",
    "repeat",
    "repeatType",
    "repeatDelay",
    "from",
    "elapsed"
  ]);
  function gx(i) {
    for (const a in i) if (!yx.has(a)) return true;
    return false;
  }
  const Sf = (i, a, s, r = {}, c, f) => (h) => {
    const m = bf(r, i) || {}, p = m.delay || r.delay || 0;
    let { elapsed: y = 0 } = r;
    y = y - ke(p);
    const v = {
      keyframes: Array.isArray(s) ? s : [
        null,
        s
      ],
      ease: "easeOut",
      velocity: a.getVelocity(),
      ...m,
      delay: -y,
      onUpdate: (T) => {
        a.set(T), m.onUpdate && m.onUpdate(T);
      },
      onComplete: () => {
        h(), m.onComplete && m.onComplete();
      },
      name: i,
      motionValue: a,
      element: f ? void 0 : c
    };
    gx(m) || Object.assign(v, px(i, v)), v.duration && (v.duration = ke(v.duration)), v.repeatDelay && (v.repeatDelay = ke(v.repeatDelay)), v.from !== void 0 && (v.keyframes[0] = v.from);
    let b = false;
    if ((v.type === false || v.duration === 0 && !v.repeatDelay) && (Xc(v), v.delay === 0 && (b = true)), (yi.instantAnimations || yi.skipAnimations || (c == null ? void 0 : c.shouldSkipAnimations)) && (b = true, Xc(v), v.delay = 0), v.allowFlatten = !m.type && !m.ease, b && !f && a.get() !== void 0) {
      const T = Yr(v.keyframes, m);
      if (T !== void 0) {
        Lt.update(() => {
          v.onUpdate(T), v.onComplete();
        });
        return;
      }
    }
    return m.isSync ? new Lr(v) : new ux(v);
  };
  function h0(i) {
    const a = [
      {},
      {}
    ];
    return i == null ? void 0 : i.values.forEach((s, r) => {
      a[0][r] = s.get(), a[1][r] = s.getVelocity();
    }), a;
  }
  function xf(i, a, s, r) {
    if (typeof a == "function") {
      const [c, f] = h0(r);
      a = a(s !== void 0 ? s : i.custom, c, f);
    }
    if (typeof a == "string" && (a = i.variants && i.variants[a]), typeof a == "function") {
      const [c, f] = h0(r);
      a = a(s !== void 0 ? s : i.custom, c, f);
    }
    return a;
  }
  function Qi(i, a, s) {
    const r = i.getProps();
    return xf(r, a, s !== void 0 ? s : r.custom, i);
  }
  const sg = /* @__PURE__ */ new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...Ga
  ]), d0 = 30, vx = (i) => !isNaN(parseFloat(i));
  class bx {
    constructor(a, s = {}) {
      this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r) => {
        var _a;
        const c = Ae.now();
        if (this.updatedAt !== c && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && ((_a = this.events.change) == null ? void 0 : _a.notify(this.current), this.dependents)) for (const f of this.dependents) f.dirty();
      }, this.hasAnimated = false, this.setCurrent(a), this.owner = s.owner;
    }
    setCurrent(a) {
      this.current = a, this.updatedAt = Ae.now(), this.canTrackVelocity === null && a !== void 0 && (this.canTrackVelocity = vx(this.current));
    }
    setPrevFrameValue(a = this.current) {
      this.prevFrameValue = a, this.prevUpdatedAt = this.updatedAt;
    }
    onChange(a) {
      return this.on("change", a);
    }
    on(a, s) {
      this.events[a] || (this.events[a] = new of());
      const r = this.events[a].add(s);
      return a === "change" ? () => {
        r(), Lt.read(() => {
          this.events.change.getSize() || this.stop();
        });
      } : r;
    }
    clearListeners() {
      for (const a in this.events) this.events[a].clear();
    }
    attach(a, s) {
      this.passiveEffect = a, this.stopPassiveEffect = s;
    }
    set(a) {
      this.passiveEffect ? this.passiveEffect(a, this.updateAndNotify) : this.updateAndNotify(a);
    }
    setWithVelocity(a, s, r) {
      this.set(s), this.prev = void 0, this.prevFrameValue = a, this.prevUpdatedAt = this.updatedAt - r;
    }
    jump(a, s = true) {
      this.updateAndNotify(a), this.prev = a, this.prevUpdatedAt = this.prevFrameValue = void 0, s && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
    }
    dirty() {
      var _a;
      (_a = this.events.change) == null ? void 0 : _a.notify(this.current);
    }
    addDependent(a) {
      this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(a);
    }
    removeDependent(a) {
      this.dependents && this.dependents.delete(a);
    }
    get() {
      return this.current;
    }
    getPrevious() {
      return this.prev;
    }
    getVelocity() {
      const a = Ae.now();
      if (!this.canTrackVelocity || this.prevFrameValue === void 0 || a - this.updatedAt > d0) return 0;
      const s = Math.min(this.updatedAt - this.prevUpdatedAt, d0);
      return Ey(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
    }
    start(a) {
      return this.stop(), new Promise((s) => {
        this.hasAnimated = true, this.animation = a(s), this.events.animationStart && this.events.animationStart.notify();
      }).then(() => {
        this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
      });
    }
    stop() {
      this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
    }
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    destroy() {
      var _a, _b2;
      (_a = this.dependents) == null ? void 0 : _a.clear(), (_b2 = this.events.destroy) == null ? void 0 : _b2.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
    }
  }
  function Ba(i, a) {
    return new bx(i, a);
  }
  const Kc = (i) => Array.isArray(i);
  function Sx(i, a, s) {
    i.hasValue(a) ? i.getValue(a).set(s) : i.addValue(a, Ba(s));
  }
  function xx(i) {
    return Kc(i) ? i[i.length - 1] || 0 : i;
  }
  function Tx(i, a) {
    const s = Qi(i, a);
    let { transitionEnd: r = {}, transition: c = {}, ...f } = s || {};
    f = {
      ...f,
      ...r
    };
    for (const h in f) {
      const m = xx(f[h]);
      Sx(i, h, m);
    }
  }
  const ge = (i) => !!(i && i.getVelocity);
  function Ax(i) {
    return !!(ge(i) && i.add);
  }
  function Qc(i, a) {
    const s = i.getValue("willChange");
    if (Ax(s)) return s.add(a);
    if (!s && yi.WillChange) {
      const r = new yi.WillChange("auto");
      i.addValue("willChange", r), r.add(a);
    }
  }
  function Tf(i) {
    return i.replace(/([A-Z])/g, (a) => `-${a.toLowerCase()}`);
  }
  const Ex = "framerAppearId", rg = "data-" + Tf(Ex);
  function ug(i) {
    return i.props[rg];
  }
  function _x({ protectedKeys: i, needsAnimating: a }, s) {
    const r = i.hasOwnProperty(s) && a[s] !== true;
    return a[s] = false, r;
  }
  function og(i, a, { delay: s = 0, transitionOverride: r, type: c } = {}) {
    let { transition: f, transitionEnd: h, ...m } = a;
    const p = i.getDefaultTransition();
    f = f ? lg(f, p) : p;
    const y = f == null ? void 0 : f.reduceMotion;
    r && (f = r);
    const v = [], b = c && i.animationState && i.animationState.getState()[c];
    for (const T in m) {
      const w = i.getValue(T, i.latestValues[T] ?? null), C = m[T];
      if (C === void 0 || b && _x(b, T)) continue;
      const L = {
        delay: s,
        ...bf(f || {}, T)
      }, H = w.get();
      if (H !== void 0 && !w.isAnimating() && !Array.isArray(C) && C === H && !L.velocity) {
        Lt.update(() => w.set(C));
        continue;
      }
      let B = false;
      if (window.MotionHandoffAnimation) {
        const Q = ug(i);
        if (Q) {
          const I = window.MotionHandoffAnimation(Q, T, Lt);
          I !== null && (L.startTime = I, B = true);
        }
      }
      Qc(i, T);
      const k = y ?? i.shouldReduceMotion;
      w.start(Sf(T, w, C, k && sg.has(T) ? {
        type: false
      } : L, i, B));
      const G = w.animation;
      G && v.push(G);
    }
    if (h) {
      const T = () => Lt.update(() => {
        h && Tx(i, h);
      });
      v.length ? Promise.all(v).then(T) : T();
    }
    return v;
  }
  function Zc(i, a, s = {}) {
    var _a;
    const r = Qi(i, a, s.type === "exit" ? (_a = i.presenceContext) == null ? void 0 : _a.custom : void 0);
    let { transition: c = i.getDefaultTransition() || {} } = r || {};
    s.transitionOverride && (c = s.transitionOverride);
    const f = r ? () => Promise.all(og(i, r, s)) : () => Promise.resolve(), h = i.variantChildren && i.variantChildren.size ? (p = 0) => {
      const { delayChildren: y = 0, staggerChildren: v, staggerDirection: b } = c;
      return Mx(i, a, p, y, v, b, s);
    } : () => Promise.resolve(), { when: m } = c;
    if (m) {
      const [p, y] = m === "beforeChildren" ? [
        f,
        h
      ] : [
        h,
        f
      ];
      return p().then(() => y());
    } else return Promise.all([
      f(),
      h(s.delay)
    ]);
  }
  function Mx(i, a, s = 0, r = 0, c = 0, f = 1, h) {
    const m = [];
    for (const p of i.variantChildren) p.notify("AnimationStart", a), m.push(Zc(p, a, {
      ...h,
      delay: s + (typeof r == "function" ? 0 : r) + ig(i.variantChildren, p, r, c, f)
    }).then(() => p.notify("AnimationComplete", a)));
    return Promise.all(m);
  }
  function Dx(i, a, s = {}) {
    i.notify("AnimationStart", a);
    let r;
    if (Array.isArray(a)) {
      const c = a.map((f) => Zc(i, f, s));
      r = Promise.all(c);
    } else if (typeof a == "string") r = Zc(i, a, s);
    else {
      const c = typeof a == "function" ? Qi(i, a, s.custom) : a;
      r = Promise.all(og(i, c, s));
    }
    return r.then(() => {
      i.notify("AnimationComplete", a);
    });
  }
  const zx = {
    test: (i) => i === "auto",
    parse: (i) => i
  }, cg = (i) => (a) => a.test(i), fg = [
    Ha,
    F,
    Sn,
    di,
    tS,
    I2,
    zx
  ], m0 = (i) => fg.find(cg(i));
  function Cx(i) {
    return typeof i == "number" ? i === 0 : i !== null ? i === "none" || i === "0" || Ty(i) : true;
  }
  const wx = /* @__PURE__ */ new Set([
    "brightness",
    "contrast",
    "saturate",
    "opacity"
  ]);
  function Rx(i) {
    const [a, s] = i.slice(0, -1).split("(");
    if (a === "drop-shadow") return i;
    const [r] = s.match(df) || [];
    if (!r) return i;
    const c = s.replace(r, "");
    let f = wx.has(a) ? 1 : 0;
    return r !== s && (f *= 100), a + "(" + f + c + ")";
  }
  const Ox = /\b([a-z-]*)\(.*?\)/gu, Pc = {
    ...cn,
    getAnimatableNone: (i) => {
      const a = i.match(Ox);
      return a ? a.map(Rx).join(" ") : i;
    }
  }, Jc = {
    ...cn,
    getAnimatableNone: (i) => {
      const a = cn.parse(i);
      return cn.createTransformer(i)(a.map((r) => typeof r == "number" ? 0 : typeof r == "object" ? {
        ...r,
        alpha: 1
      } : r));
    }
  }, p0 = {
    ...Ha,
    transform: Math.round
  }, Nx = {
    rotate: di,
    rotateX: di,
    rotateY: di,
    rotateZ: di,
    scale: Tr,
    scaleX: Tr,
    scaleY: Tr,
    scaleZ: Tr,
    skew: di,
    skewX: di,
    skewY: di,
    distance: F,
    translateX: F,
    translateY: F,
    translateZ: F,
    x: F,
    y: F,
    z: F,
    perspective: F,
    transformPerspective: F,
    opacity: Pl,
    originX: e0,
    originY: e0,
    originZ: F
  }, Af = {
    borderWidth: F,
    borderTopWidth: F,
    borderRightWidth: F,
    borderBottomWidth: F,
    borderLeftWidth: F,
    borderRadius: F,
    borderTopLeftRadius: F,
    borderTopRightRadius: F,
    borderBottomRightRadius: F,
    borderBottomLeftRadius: F,
    width: F,
    maxWidth: F,
    height: F,
    maxHeight: F,
    top: F,
    right: F,
    bottom: F,
    left: F,
    inset: F,
    insetBlock: F,
    insetBlockStart: F,
    insetBlockEnd: F,
    insetInline: F,
    insetInlineStart: F,
    insetInlineEnd: F,
    padding: F,
    paddingTop: F,
    paddingRight: F,
    paddingBottom: F,
    paddingLeft: F,
    paddingBlock: F,
    paddingBlockStart: F,
    paddingBlockEnd: F,
    paddingInline: F,
    paddingInlineStart: F,
    paddingInlineEnd: F,
    margin: F,
    marginTop: F,
    marginRight: F,
    marginBottom: F,
    marginLeft: F,
    marginBlock: F,
    marginBlockStart: F,
    marginBlockEnd: F,
    marginInline: F,
    marginInlineStart: F,
    marginInlineEnd: F,
    fontSize: F,
    backgroundPositionX: F,
    backgroundPositionY: F,
    ...Nx,
    zIndex: p0,
    fillOpacity: Pl,
    strokeOpacity: Pl,
    numOctaves: p0
  }, jx = {
    ...Af,
    color: ie,
    backgroundColor: ie,
    outlineColor: ie,
    fill: ie,
    stroke: ie,
    borderColor: ie,
    borderTopColor: ie,
    borderRightColor: ie,
    borderBottomColor: ie,
    borderLeftColor: ie,
    filter: Pc,
    WebkitFilter: Pc,
    mask: Jc,
    WebkitMask: Jc
  }, hg = (i) => jx[i], Vx = /* @__PURE__ */ new Set([
    Pc,
    Jc
  ]);
  function dg(i, a) {
    let s = hg(i);
    return Vx.has(s) || (s = cn), s.getAnimatableNone ? s.getAnimatableNone(a) : void 0;
  }
  const Ux = /* @__PURE__ */ new Set([
    "auto",
    "none",
    "0"
  ]);
  function Lx(i, a, s) {
    let r = 0, c;
    for (; r < i.length && !c; ) {
      const f = i[r];
      typeof f == "string" && !Ux.has(f) && La(f).values.length && (c = i[r]), r++;
    }
    if (c && s) for (const f of a) i[f] = dg(s, c);
  }
  class Bx extends vf {
    constructor(a, s, r, c, f) {
      super(a, s, r, c, f, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes: a, element: s, name: r } = this;
      if (!s || !s.current) return;
      super.readKeyframes();
      for (let v = 0; v < a.length; v++) {
        let b = a[v];
        if (typeof b == "string" && (b = b.trim(), hf(b))) {
          const T = ag(b, s.current);
          T !== void 0 && (a[v] = T), v === a.length - 1 && (this.finalKeyframe = b);
        }
      }
      if (this.resolveNoneKeyframes(), !sg.has(r) || a.length !== 2) return;
      const [c, f] = a, h = m0(c), m = m0(f), p = t0(c), y = t0(f);
      if (p !== y && pi[r]) {
        this.needsMeasurement = true;
        return;
      }
      if (h !== m) if (o0(h) && o0(m)) for (let v = 0; v < a.length; v++) {
        const b = a[v];
        typeof b == "string" && (a[v] = parseFloat(b));
      }
      else pi[r] && (this.needsMeasurement = true);
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes: a, name: s } = this, r = [];
      for (let c = 0; c < a.length; c++) (a[c] === null || Cx(a[c])) && r.push(c);
      r.length && Lx(a, r, s);
    }
    measureInitialState() {
      const { element: a, unresolvedKeyframes: s, name: r } = this;
      if (!a || !a.current) return;
      r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = pi[r](a.measureViewportBox(), window.getComputedStyle(a.current)), s[0] = this.measuredOrigin;
      const c = s[s.length - 1];
      c !== void 0 && a.getValue(r, c).jump(c, false);
    }
    measureEndState() {
      var _a;
      const { element: a, name: s, unresolvedKeyframes: r } = this;
      if (!a || !a.current) return;
      const c = a.getValue(s);
      c && c.jump(this.measuredOrigin, false);
      const f = r.length - 1, h = r[f];
      r[f] = pi[s](a.measureViewportBox(), window.getComputedStyle(a.current)), h !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = h), ((_a = this.removedTransforms) == null ? void 0 : _a.length) && this.removedTransforms.forEach(([m, p]) => {
        a.getValue(m).set(p);
      }), this.resolveNoneKeyframes();
    }
  }
  function mg(i, a, s) {
    if (i == null) return [];
    if (i instanceof EventTarget) return [
      i
    ];
    if (typeof i == "string") {
      let r = document;
      const c = (s == null ? void 0 : s[i]) ?? r.querySelectorAll(i);
      return c ? Array.from(c) : [];
    }
    return Array.from(i).filter((r) => r != null);
  }
  const pg = (i, a) => a && typeof i == "number" ? a.transform(i) : i;
  function Hx(i) {
    return xy(i) && "offsetHeight" in i && !("ownerSVGElement" in i);
  }
  const { schedule: Ef } = Vy(queueMicrotask, false), on = {
    x: false,
    y: false
  };
  function yg() {
    return on.x || on.y;
  }
  function Gx(i) {
    return i === "x" || i === "y" ? on[i] ? null : (on[i] = true, () => {
      on[i] = false;
    }) : on.x || on.y ? null : (on.x = on.y = true, () => {
      on.x = on.y = false;
    });
  }
  function gg(i, a) {
    const s = mg(i), r = new AbortController(), c = {
      passive: true,
      ...a,
      signal: r.signal
    };
    return [
      s,
      c,
      () => r.abort()
    ];
  }
  function qx(i) {
    return !(i.pointerType === "touch" || yg());
  }
  function Yx(i, a, s = {}) {
    const [r, c, f] = gg(i, s);
    return r.forEach((h) => {
      let m = false, p = false, y;
      const v = () => {
        h.removeEventListener("pointerleave", C);
      }, b = (H) => {
        y && (y(H), y = void 0), v();
      }, T = (H) => {
        m = false, window.removeEventListener("pointerup", T), window.removeEventListener("pointercancel", T), p && (p = false, b(H));
      }, w = () => {
        m = true, window.addEventListener("pointerup", T, c), window.addEventListener("pointercancel", T, c);
      }, C = (H) => {
        if (H.pointerType !== "touch") {
          if (m) {
            p = true;
            return;
          }
          b(H);
        }
      }, L = (H) => {
        if (!qx(H)) return;
        p = false;
        const B = a(h, H);
        typeof B == "function" && (y = B, h.addEventListener("pointerleave", C, c));
      };
      h.addEventListener("pointerenter", L, c), h.addEventListener("pointerdown", w, c);
    }), f;
  }
  const vg = (i, a) => a ? i === a ? true : vg(i, a.parentElement) : false, _f = (i) => i.pointerType === "mouse" ? typeof i.button != "number" || i.button <= 0 : i.isPrimary !== false, kx = /* @__PURE__ */ new Set([
    "BUTTON",
    "INPUT",
    "SELECT",
    "TEXTAREA",
    "A"
  ]);
  function Xx(i) {
    return kx.has(i.tagName) || i.isContentEditable === true;
  }
  const Kx = /* @__PURE__ */ new Set([
    "INPUT",
    "SELECT",
    "TEXTAREA"
  ]);
  function Qx(i) {
    return Kx.has(i.tagName) || i.isContentEditable === true;
  }
  const Mr = /* @__PURE__ */ new WeakSet();
  function y0(i) {
    return (a) => {
      a.key === "Enter" && i(a);
    };
  }
  function Tc(i, a) {
    i.dispatchEvent(new PointerEvent("pointer" + a, {
      isPrimary: true,
      bubbles: true
    }));
  }
  const Zx = (i, a) => {
    const s = i.currentTarget;
    if (!s) return;
    const r = y0(() => {
      if (Mr.has(s)) return;
      Tc(s, "down");
      const c = y0(() => {
        Tc(s, "up");
      }), f = () => Tc(s, "cancel");
      s.addEventListener("keyup", c, a), s.addEventListener("blur", f, a);
    });
    s.addEventListener("keydown", r, a), s.addEventListener("blur", () => s.removeEventListener("keydown", r), a);
  };
  function g0(i) {
    return _f(i) && !yg();
  }
  const v0 = /* @__PURE__ */ new WeakSet();
  function Px(i, a, s = {}) {
    const [r, c, f] = gg(i, s), h = (m) => {
      const p = m.currentTarget;
      if (!g0(m) || v0.has(m)) return;
      Mr.add(p), s.stopPropagation && v0.add(m);
      const y = a(p, m), v = (w, C) => {
        window.removeEventListener("pointerup", b), window.removeEventListener("pointercancel", T), Mr.has(p) && Mr.delete(p), g0(w) && typeof y == "function" && y(w, {
          success: C
        });
      }, b = (w) => {
        v(w, p === window || p === document || s.useGlobalTarget || vg(p, w.target));
      }, T = (w) => {
        v(w, false);
      };
      window.addEventListener("pointerup", b, c), window.addEventListener("pointercancel", T, c);
    };
    return r.forEach((m) => {
      (s.useGlobalTarget ? window : m).addEventListener("pointerdown", h, c), Hx(m) && (m.addEventListener("focus", (y) => Zx(y, c)), !Xx(m) && !m.hasAttribute("tabindex") && (m.tabIndex = 0));
    }), f;
  }
  function Mf(i) {
    return xy(i) && "ownerSVGElement" in i;
  }
  const Dr = /* @__PURE__ */ new WeakMap();
  let zr;
  const bg = (i, a, s) => (r, c) => c && c[0] ? c[0][i + "Size"] : Mf(r) && "getBBox" in r ? r.getBBox()[a] : r[s], Jx = bg("inline", "width", "offsetWidth"), Fx = bg("block", "height", "offsetHeight");
  function Wx({ target: i, borderBoxSize: a }) {
    var _a;
    (_a = Dr.get(i)) == null ? void 0 : _a.forEach((s) => {
      s(i, {
        get width() {
          return Jx(i, a);
        },
        get height() {
          return Fx(i, a);
        }
      });
    });
  }
  function $x(i) {
    i.forEach(Wx);
  }
  function Ix() {
    typeof ResizeObserver > "u" || (zr = new ResizeObserver($x));
  }
  function tT(i, a) {
    zr || Ix();
    const s = mg(i);
    return s.forEach((r) => {
      let c = Dr.get(r);
      c || (c = /* @__PURE__ */ new Set(), Dr.set(r, c)), c.add(a), zr == null ? void 0 : zr.observe(r);
    }), () => {
      s.forEach((r) => {
        const c = Dr.get(r);
        c == null ? void 0 : c.delete(a), (c == null ? void 0 : c.size) || (zr == null ? void 0 : zr.unobserve(r));
      });
    };
  }
  const Cr = /* @__PURE__ */ new Set();
  let Va;
  function eT() {
    Va = () => {
      const i = {
        get width() {
          return window.innerWidth;
        },
        get height() {
          return window.innerHeight;
        }
      };
      Cr.forEach((a) => a(i));
    }, window.addEventListener("resize", Va);
  }
  function nT(i) {
    return Cr.add(i), Va || eT(), () => {
      Cr.delete(i), !Cr.size && typeof Va == "function" && (window.removeEventListener("resize", Va), Va = void 0);
    };
  }
  function b0(i, a) {
    return typeof i == "function" ? nT(i) : tT(i, a);
  }
  function iT(i) {
    return Mf(i) && i.tagName === "svg";
  }
  const aT = [
    ...fg,
    ie,
    cn
  ], lT = (i) => aT.find(cg(i)), S0 = () => ({
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0
  }), Ua = () => ({
    x: S0(),
    y: S0()
  }), x0 = () => ({
    min: 0,
    max: 0
  }), le = () => ({
    x: x0(),
    y: x0()
  }), sT = /* @__PURE__ */ new WeakMap();
  function kr(i) {
    return i !== null && typeof i == "object" && typeof i.start == "function";
  }
  function Jl(i) {
    return typeof i == "string" || Array.isArray(i);
  }
  const Df = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit"
  ], zf = [
    "initial",
    ...Df
  ];
  function Xr(i) {
    return kr(i.animate) || zf.some((a) => Jl(i[a]));
  }
  function Sg(i) {
    return !!(Xr(i) || i.variants);
  }
  function rT(i, a, s) {
    for (const r in a) {
      const c = a[r], f = s[r];
      if (ge(c)) i.addValue(r, c);
      else if (ge(f)) i.addValue(r, Ba(c, {
        owner: i
      }));
      else if (f !== c) if (i.hasValue(r)) {
        const h = i.getValue(r);
        h.liveStyle === true ? h.jump(c) : h.hasAnimated || h.set(c);
      } else {
        const h = i.getStaticValue(r);
        i.addValue(r, Ba(h !== void 0 ? h : c, {
          owner: i
        }));
      }
    }
    for (const r in s) a[r] === void 0 && i.removeValue(r);
    return a;
  }
  const Fc = {
    current: null
  }, xg = {
    current: false
  }, uT = typeof window < "u";
  function oT() {
    if (xg.current = true, !!uT) if (window.matchMedia) {
      const i = window.matchMedia("(prefers-reduced-motion)"), a = () => Fc.current = i.matches;
      i.addEventListener("change", a), a();
    } else Fc.current = false;
  }
  const T0 = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete"
  ];
  let Br = {};
  function Tg(i) {
    Br = i;
  }
  function cT() {
    return Br;
  }
  class fT {
    scrapeMotionValuesFromProps(a, s, r) {
      return {};
    }
    constructor({ parent: a, props: s, presenceContext: r, reducedMotionConfig: c, skipAnimations: f, blockInitialAnimation: h, visualState: m }, p = {}) {
      this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = false, this.isControllingVariants = false, this.shouldReduceMotion = null, this.shouldSkipAnimations = false, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = vf, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = false, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
        this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }, this.renderScheduledAt = 0, this.scheduleRender = () => {
        const w = Ae.now();
        this.renderScheduledAt < w && (this.renderScheduledAt = w, Lt.render(this.render, false, true));
      };
      const { latestValues: y, renderState: v } = m;
      this.latestValues = y, this.baseTarget = {
        ...y
      }, this.initialValues = s.initial ? {
        ...y
      } : {}, this.renderState = v, this.parent = a, this.props = s, this.presenceContext = r, this.depth = a ? a.depth + 1 : 0, this.reducedMotionConfig = c, this.skipAnimationsConfig = f, this.options = p, this.blockInitialAnimation = !!h, this.isControllingVariants = Xr(s), this.isVariantNode = Sg(s), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(a && a.current);
      const { willChange: b, ...T } = this.scrapeMotionValuesFromProps(s, {}, this);
      for (const w in T) {
        const C = T[w];
        y[w] !== void 0 && ge(C) && C.set(y[w]);
      }
    }
    mount(a) {
      var _a, _b2;
      if (this.hasBeenMounted) for (const s in this.initialValues) (_a = this.values.get(s)) == null ? void 0 : _a.jump(this.initialValues[s]), this.latestValues[s] = this.initialValues[s];
      this.current = a, sT.set(a, this), this.projection && !this.projection.instance && this.projection.mount(a), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, r) => this.bindToMotionValue(r, s)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = false : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = true : (xg.current || oT(), this.shouldReduceMotion = Fc.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? false, (_b2 = this.parent) == null ? void 0 : _b2.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = true;
    }
    unmount() {
      var _a;
      this.projection && this.projection.unmount(), gi(this.notifyUpdate), gi(this.render), this.valueSubscriptions.forEach((a) => a()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (_a = this.parent) == null ? void 0 : _a.removeChild(this);
      for (const a in this.events) this.events[a].clear();
      for (const a in this.features) {
        const s = this.features[a];
        s && (s.unmount(), s.isMounted = false);
      }
      this.current = null;
    }
    addChild(a) {
      this.children.add(a), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(a);
    }
    removeChild(a) {
      this.children.delete(a), this.enteringChildren && this.enteringChildren.delete(a);
    }
    bindToMotionValue(a, s) {
      if (this.valueSubscriptions.has(a) && this.valueSubscriptions.get(a)(), s.accelerate && ng.has(a) && this.current instanceof HTMLElement) {
        const { factory: h, keyframes: m, times: p, ease: y, duration: v } = s.accelerate, b = new tg({
          element: this.current,
          name: a,
          keyframes: m,
          times: p,
          ease: y,
          duration: ke(v)
        }), T = h(b);
        this.valueSubscriptions.set(a, () => {
          T(), b.cancel();
        });
        return;
      }
      const r = qa.has(a);
      r && this.onBindTransform && this.onBindTransform();
      const c = s.on("change", (h) => {
        this.latestValues[a] = h, this.props.onUpdate && Lt.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = true), this.scheduleRender();
      });
      let f;
      typeof window < "u" && window.MotionCheckAppearSync && (f = window.MotionCheckAppearSync(this, a, s)), this.valueSubscriptions.set(a, () => {
        c(), f && f(), s.owner && s.stop();
      });
    }
    sortNodePosition(a) {
      return !this.current || !this.sortInstanceNodePosition || this.type !== a.type ? 0 : this.sortInstanceNodePosition(this.current, a.current);
    }
    updateFeatures() {
      let a = "animation";
      for (a in Br) {
        const s = Br[a];
        if (!s) continue;
        const { isEnabled: r, Feature: c } = s;
        if (!this.features[a] && c && r(this.props) && (this.features[a] = new c(this)), this.features[a]) {
          const f = this.features[a];
          f.isMounted ? f.update() : (f.mount(), f.isMounted = true);
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
    measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : le();
    }
    getStaticValue(a) {
      return this.latestValues[a];
    }
    setStaticValue(a, s) {
      this.latestValues[a] = s;
    }
    update(a, s) {
      (a.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = a, this.prevPresenceContext = this.presenceContext, this.presenceContext = s;
      for (let r = 0; r < T0.length; r++) {
        const c = T0[r];
        this.propEventSubscriptions[c] && (this.propEventSubscriptions[c](), delete this.propEventSubscriptions[c]);
        const f = "on" + c, h = a[f];
        h && (this.propEventSubscriptions[c] = this.on(c, h));
      }
      this.prevMotionValues = rT(this, this.scrapeMotionValuesFromProps(a, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
    }
    getProps() {
      return this.props;
    }
    getVariant(a) {
      return this.props.variants ? this.props.variants[a] : void 0;
    }
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
    }
    addVariantChild(a) {
      const s = this.getClosestVariantNode();
      if (s) return s.variantChildren && s.variantChildren.add(a), () => s.variantChildren.delete(a);
    }
    addValue(a, s) {
      const r = this.values.get(a);
      s !== r && (r && this.removeValue(a), this.bindToMotionValue(a, s), this.values.set(a, s), this.latestValues[a] = s.get());
    }
    removeValue(a) {
      this.values.delete(a);
      const s = this.valueSubscriptions.get(a);
      s && (s(), this.valueSubscriptions.delete(a)), delete this.latestValues[a], this.removeValueFromRenderState(a, this.renderState);
    }
    hasValue(a) {
      return this.values.has(a);
    }
    getValue(a, s) {
      if (this.props.values && this.props.values[a]) return this.props.values[a];
      let r = this.values.get(a);
      return r === void 0 && s !== void 0 && (r = Ba(s === null ? void 0 : s, {
        owner: this
      }), this.addValue(a, r)), r;
    }
    readValue(a, s) {
      let r = this.latestValues[a] !== void 0 || !this.current ? this.latestValues[a] : this.getBaseTargetFromProps(this.props, a) ?? this.readValueFromInstance(this.current, a, this.options);
      return r != null && (typeof r == "string" && (Sy(r) || Ty(r)) ? r = parseFloat(r) : !lT(r) && cn.test(s) && (r = dg(a, s)), this.setBaseTarget(a, ge(r) ? r.get() : r)), ge(r) ? r.get() : r;
    }
    setBaseTarget(a, s) {
      this.baseTarget[a] = s;
    }
    getBaseTarget(a) {
      var _a;
      const { initial: s } = this.props;
      let r;
      if (typeof s == "string" || typeof s == "object") {
        const f = xf(this.props, s, (_a = this.presenceContext) == null ? void 0 : _a.custom);
        f && (r = f[a]);
      }
      if (s && r !== void 0) return r;
      const c = this.getBaseTargetFromProps(this.props, a);
      return c !== void 0 && !ge(c) ? c : this.initialValues[a] !== void 0 && r === void 0 ? void 0 : this.baseTarget[a];
    }
    on(a, s) {
      return this.events[a] || (this.events[a] = new of()), this.events[a].add(s);
    }
    notify(a, ...s) {
      this.events[a] && this.events[a].notify(...s);
    }
    scheduleRenderMicrotask() {
      Ef.render(this.render);
    }
  }
  class Ag extends fT {
    constructor() {
      super(...arguments), this.KeyframeResolver = Bx;
    }
    sortInstanceNodePosition(a, s) {
      return a.compareDocumentPosition(s) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(a, s) {
      const r = a.style;
      return r ? r[s] : void 0;
    }
    removeValueFromRenderState(a, { vars: s, style: r }) {
      delete s[a], delete r[a];
    }
    handleChildMotionValue() {
      this.childSubscription && (this.childSubscription(), delete this.childSubscription);
      const { children: a } = this.props;
      ge(a) && (this.childSubscription = a.on("change", (s) => {
        this.current && (this.current.textContent = `${s}`);
      }));
    }
  }
  class vi {
    constructor(a) {
      this.isMounted = false, this.node = a;
    }
    update() {
    }
  }
  function Eg({ top: i, left: a, right: s, bottom: r }) {
    return {
      x: {
        min: a,
        max: s
      },
      y: {
        min: i,
        max: r
      }
    };
  }
  function hT({ x: i, y: a }) {
    return {
      top: a.min,
      right: i.max,
      bottom: a.max,
      left: i.min
    };
  }
  function dT(i, a) {
    if (!a) return i;
    const s = a({
      x: i.left,
      y: i.top
    }), r = a({
      x: i.right,
      y: i.bottom
    });
    return {
      top: s.y,
      left: s.x,
      bottom: r.y,
      right: r.x
    };
  }
  function Ac(i) {
    return i === void 0 || i === 1;
  }
  function Wc({ scale: i, scaleX: a, scaleY: s }) {
    return !Ac(i) || !Ac(a) || !Ac(s);
  }
  function Yi(i) {
    return Wc(i) || _g(i) || i.z || i.rotate || i.rotateX || i.rotateY || i.skewX || i.skewY;
  }
  function _g(i) {
    return A0(i.x) || A0(i.y);
  }
  function A0(i) {
    return i && i !== "0%";
  }
  function Hr(i, a, s) {
    const r = i - s, c = a * r;
    return s + c;
  }
  function E0(i, a, s, r, c) {
    return c !== void 0 && (i = Hr(i, c, r)), Hr(i, s, r) + a;
  }
  function $c(i, a = 0, s = 1, r, c) {
    i.min = E0(i.min, a, s, r, c), i.max = E0(i.max, a, s, r, c);
  }
  function Mg(i, { x: a, y: s }) {
    $c(i.x, a.translate, a.scale, a.originPoint), $c(i.y, s.translate, s.scale, s.originPoint);
  }
  const _0 = 0.999999999999, M0 = 1.0000000000001;
  function mT(i, a, s, r = false) {
    var _a;
    const c = s.length;
    if (!c) return;
    a.x = a.y = 1;
    let f, h;
    for (let m = 0; m < c; m++) {
      f = s[m], h = f.projectionDelta;
      const { visualElement: p } = f.options;
      p && p.props.style && p.props.style.display === "contents" || (r && f.options.layoutScroll && f.scroll && f !== f.root && (bn(i.x, -f.scroll.offset.x), bn(i.y, -f.scroll.offset.y)), h && (a.x *= h.x.scale, a.y *= h.y.scale, Mg(i, h)), r && Yi(f.latestValues) && wr(i, f.latestValues, (_a = f.layout) == null ? void 0 : _a.layoutBox));
    }
    a.x < M0 && a.x > _0 && (a.x = 1), a.y < M0 && a.y > _0 && (a.y = 1);
  }
  function bn(i, a) {
    i.min += a, i.max += a;
  }
  function D0(i, a, s, r, c = 0.5) {
    const f = qt(i.min, i.max, c);
    $c(i, a, s, f, r);
  }
  function z0(i, a) {
    return typeof i == "string" ? parseFloat(i) / 100 * (a.max - a.min) : i;
  }
  function wr(i, a, s) {
    const r = s ?? i;
    D0(i.x, z0(a.x, r.x), a.scaleX, a.scale, a.originX), D0(i.y, z0(a.y, r.y), a.scaleY, a.scale, a.originY);
  }
  function Dg(i, a) {
    return Eg(dT(i.getBoundingClientRect(), a));
  }
  function pT(i, a, s) {
    const r = Dg(i, s), { scroll: c } = a;
    return c && (bn(r.x, c.offset.x), bn(r.y, c.offset.y)), r;
  }
  const yT = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  }, gT = Ga.length;
  function vT(i, a, s) {
    let r = "", c = true;
    for (let f = 0; f < gT; f++) {
      const h = Ga[f], m = i[h];
      if (m === void 0) continue;
      let p = true;
      if (typeof m == "number") p = m === (h.startsWith("scale") ? 1 : 0);
      else {
        const y = parseFloat(m);
        p = h.startsWith("scale") ? y === 1 : y === 0;
      }
      if (!p || s) {
        const y = pg(m, Af[h]);
        if (!p) {
          c = false;
          const v = yT[h] || h;
          r += `${v}(${y}) `;
        }
        s && (a[h] = y);
      }
    }
    return r = r.trim(), s ? r = s(a, c ? "" : r) : c && (r = "none"), r;
  }
  function Cf(i, a, s) {
    const { style: r, vars: c, transformOrigin: f } = i;
    let h = false, m = false;
    for (const p in a) {
      const y = a[p];
      if (qa.has(p)) {
        h = true;
        continue;
      } else if (Ly(p)) {
        c[p] = y;
        continue;
      } else {
        const v = pg(y, Af[p]);
        p.startsWith("origin") ? (m = true, f[p] = v) : r[p] = v;
      }
    }
    if (a.transform || (h || s ? r.transform = vT(a, i.transform, s) : r.transform && (r.transform = "none")), m) {
      const { originX: p = "50%", originY: y = "50%", originZ: v = 0 } = f;
      r.transformOrigin = `${p} ${y} ${v}`;
    }
  }
  function zg(i, { style: a, vars: s }, r, c) {
    const f = i.style;
    let h;
    for (h in a) f[h] = a[h];
    c == null ? void 0 : c.applyProjectionStyles(f, r);
    for (h in s) f.setProperty(h, s[h]);
  }
  function C0(i, a) {
    return a.max === a.min ? 0 : i / (a.max - a.min) * 100;
  }
  const Gl = {
    correct: (i, a) => {
      if (!a.target) return i;
      if (typeof i == "string") if (F.test(i)) i = parseFloat(i);
      else return i;
      const s = C0(i, a.target.x), r = C0(i, a.target.y);
      return `${s}% ${r}%`;
    }
  }, bT = {
    correct: (i, { treeScale: a, projectionDelta: s }) => {
      const r = i, c = cn.parse(i);
      if (c.length > 5) return r;
      const f = cn.createTransformer(i), h = typeof c[0] != "number" ? 1 : 0, m = s.x.scale * a.x, p = s.y.scale * a.y;
      c[0 + h] /= m, c[1 + h] /= p;
      const y = qt(m, p, 0.5);
      return typeof c[2 + h] == "number" && (c[2 + h] /= y), typeof c[3 + h] == "number" && (c[3 + h] /= y), f(c);
    }
  }, Ic = {
    borderRadius: {
      ...Gl,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ]
    },
    borderTopLeftRadius: Gl,
    borderTopRightRadius: Gl,
    borderBottomLeftRadius: Gl,
    borderBottomRightRadius: Gl,
    boxShadow: bT
  };
  function Cg(i, { layout: a, layoutId: s }) {
    return qa.has(i) || i.startsWith("origin") || (a || s !== void 0) && (!!Ic[i] || i === "opacity");
  }
  function wf(i, a, s) {
    var _a;
    const r = i.style, c = a == null ? void 0 : a.style, f = {};
    if (!r) return f;
    for (const h in r) (ge(r[h]) || c && ge(c[h]) || Cg(h, i) || ((_a = s == null ? void 0 : s.getValue(h)) == null ? void 0 : _a.liveStyle) !== void 0) && (f[h] = r[h]);
    return f;
  }
  function ST(i) {
    return window.getComputedStyle(i);
  }
  class xT extends Ag {
    constructor() {
      super(...arguments), this.type = "html", this.renderInstance = zg;
    }
    readValueFromInstance(a, s) {
      var _a;
      if (qa.has(s)) return ((_a = this.projection) == null ? void 0 : _a.isProjecting) ? Hc(s) : GS(a, s);
      {
        const r = ST(a), c = (Ly(s) ? r.getPropertyValue(s) : r[s]) || 0;
        return typeof c == "string" ? c.trim() : c;
      }
    }
    measureInstanceViewportBox(a, { transformPagePoint: s }) {
      return Dg(a, s);
    }
    build(a, s, r) {
      Cf(a, s, r.transformTemplate);
    }
    scrapeMotionValuesFromProps(a, s, r) {
      return wf(a, s, r);
    }
  }
  const TT = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
  }, AT = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
  };
  function ET(i, a, s = 1, r = 0, c = true) {
    i.pathLength = 1;
    const f = c ? TT : AT;
    i[f.offset] = `${-r}`, i[f.array] = `${a} ${s}`;
  }
  const _T = [
    "offsetDistance",
    "offsetPath",
    "offsetRotate",
    "offsetAnchor"
  ];
  function wg(i, { attrX: a, attrY: s, attrScale: r, pathLength: c, pathSpacing: f = 1, pathOffset: h = 0, ...m }, p, y, v) {
    if (Cf(i, m, y), p) {
      i.style.viewBox && (i.attrs.viewBox = i.style.viewBox);
      return;
    }
    i.attrs = i.style, i.style = {};
    const { attrs: b, style: T } = i;
    b.transform && (T.transform = b.transform, delete b.transform), (T.transform || b.transformOrigin) && (T.transformOrigin = b.transformOrigin ?? "50% 50%", delete b.transformOrigin), T.transform && (T.transformBox = (v == null ? void 0 : v.transformBox) ?? "fill-box", delete b.transformBox);
    for (const w of _T) b[w] !== void 0 && (T[w] = b[w], delete b[w]);
    a !== void 0 && (b.x = a), s !== void 0 && (b.y = s), r !== void 0 && (b.scale = r), c !== void 0 && ET(b, c, f, h, false);
  }
  const Rg = /* @__PURE__ */ new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust"
  ]), Og = (i) => typeof i == "string" && i.toLowerCase() === "svg";
  function MT(i, a, s, r) {
    zg(i, a, void 0, r);
    for (const c in a.attrs) i.setAttribute(Rg.has(c) ? c : Tf(c), a.attrs[c]);
  }
  function Ng(i, a, s) {
    const r = wf(i, a, s);
    for (const c in i) if (ge(i[c]) || ge(a[c])) {
      const f = Ga.indexOf(c) !== -1 ? "attr" + c.charAt(0).toUpperCase() + c.substring(1) : c;
      r[f] = i[c];
    }
    return r;
  }
  class DT extends Ag {
    constructor() {
      super(...arguments), this.type = "svg", this.isSVGTag = false, this.measureInstanceViewportBox = le;
    }
    getBaseTargetFromProps(a, s) {
      return a[s];
    }
    readValueFromInstance(a, s) {
      if (qa.has(s)) {
        const r = hg(s);
        return r && r.default || 0;
      }
      return s = Rg.has(s) ? s : Tf(s), a.getAttribute(s);
    }
    scrapeMotionValuesFromProps(a, s, r) {
      return Ng(a, s, r);
    }
    build(a, s, r) {
      wg(a, s, this.isSVGTag, r.transformTemplate, r.style);
    }
    renderInstance(a, s, r, c) {
      MT(a, s, r, c);
    }
    mount(a) {
      this.isSVGTag = Og(a.tagName), super.mount(a);
    }
  }
  const zT = zf.length;
  function jg(i) {
    if (!i) return;
    if (!i.isControllingVariants) {
      const s = i.parent ? jg(i.parent) || {} : {};
      return i.props.initial !== void 0 && (s.initial = i.props.initial), s;
    }
    const a = {};
    for (let s = 0; s < zT; s++) {
      const r = zf[s], c = i.props[r];
      (Jl(c) || c === false) && (a[r] = c);
    }
    return a;
  }
  function Vg(i, a) {
    if (!Array.isArray(a)) return false;
    const s = a.length;
    if (s !== i.length) return false;
    for (let r = 0; r < s; r++) if (a[r] !== i[r]) return false;
    return true;
  }
  const CT = [
    ...Df
  ].reverse(), wT = Df.length;
  function RT(i) {
    return (a) => Promise.all(a.map(({ animation: s, options: r }) => Dx(i, s, r)));
  }
  function OT(i) {
    let a = RT(i), s = w0(), r = true, c = false;
    const f = (y) => (v, b) => {
      var _a;
      const T = Qi(i, b, y === "exit" ? (_a = i.presenceContext) == null ? void 0 : _a.custom : void 0);
      if (T) {
        const { transition: w, transitionEnd: C, ...L } = T;
        v = {
          ...v,
          ...L,
          ...C
        };
      }
      return v;
    };
    function h(y) {
      a = y(i);
    }
    function m(y) {
      const { props: v } = i, b = jg(i.parent) || {}, T = [], w = /* @__PURE__ */ new Set();
      let C = {}, L = 1 / 0;
      for (let B = 0; B < wT; B++) {
        const k = CT[B], G = s[k], Q = v[k] !== void 0 ? v[k] : b[k], I = Jl(Q), ft = k === y ? G.isActive : null;
        ft === false && (L = B);
        let et = Q === b[k] && Q !== v[k] && I;
        if (et && (r || c) && i.manuallyAnimateOnMount && (et = false), G.protectedKeys = {
          ...C
        }, !G.isActive && ft === null || !Q && !G.prevProp || kr(Q) || typeof Q == "boolean") continue;
        if (k === "exit" && G.isActive && ft !== true) {
          G.prevResolvedValues && (C = {
            ...C,
            ...G.prevResolvedValues
          });
          continue;
        }
        const nt = NT(G.prevProp, Q);
        let zt = nt || k === y && G.isActive && !et && I || B > L && I, it = false;
        const St = Array.isArray(Q) ? Q : [
          Q
        ];
        let At = St.reduce(f(k), {});
        ft === false && (At = {});
        const { prevResolvedValues: oe = {} } = G, Qt = {
          ...oe,
          ...At
        }, kt = (K) => {
          zt = true, w.has(K) && (it = true, w.delete(K)), G.needsAnimating[K] = true;
          const lt = i.getValue(K);
          lt && (lt.liveStyle = false);
        };
        for (const K in Qt) {
          const lt = At[K], mt = oe[K];
          if (C.hasOwnProperty(K)) continue;
          let S = false;
          Kc(lt) && Kc(mt) ? S = !Vg(lt, mt) : S = lt !== mt, S ? lt != null ? kt(K) : w.add(K) : lt !== void 0 && w.has(K) ? kt(K) : G.protectedKeys[K] = true;
        }
        G.prevProp = Q, G.prevResolvedValues = At, G.isActive && (C = {
          ...C,
          ...At
        }), (r || c) && i.blockInitialAnimation && (zt = false);
        const O = et && nt;
        zt && (!O || it) && T.push(...St.map((K) => {
          const lt = {
            type: k
          };
          if (typeof K == "string" && (r || c) && !O && i.manuallyAnimateOnMount && i.parent) {
            const { parent: mt } = i, S = Qi(mt, K);
            if (mt.enteringChildren && S) {
              const { delayChildren: V } = S.transition || {};
              lt.delay = ig(mt.enteringChildren, i, V);
            }
          }
          return {
            animation: K,
            options: lt
          };
        }));
      }
      if (w.size) {
        const B = {};
        if (typeof v.initial != "boolean") {
          const k = Qi(i, Array.isArray(v.initial) ? v.initial[0] : v.initial);
          k && k.transition && (B.transition = k.transition);
        }
        w.forEach((k) => {
          const G = i.getBaseTarget(k), Q = i.getValue(k);
          Q && (Q.liveStyle = true), B[k] = G ?? null;
        }), T.push({
          animation: B
        });
      }
      let H = !!T.length;
      return r && (v.initial === false || v.initial === v.animate) && !i.manuallyAnimateOnMount && (H = false), r = false, c = false, H ? a(T) : Promise.resolve();
    }
    function p(y, v) {
      var _a;
      if (s[y].isActive === v) return Promise.resolve();
      (_a = i.variantChildren) == null ? void 0 : _a.forEach((T) => {
        var _a2;
        return (_a2 = T.animationState) == null ? void 0 : _a2.setActive(y, v);
      }), s[y].isActive = v;
      const b = m(y);
      for (const T in s) s[T].protectedKeys = {};
      return b;
    }
    return {
      animateChanges: m,
      setActive: p,
      setAnimateFunction: h,
      getState: () => s,
      reset: () => {
        s = w0(), c = true;
      }
    };
  }
  function NT(i, a) {
    return typeof a == "string" ? a !== i : Array.isArray(a) ? !Vg(a, i) : false;
  }
  function Gi(i = false) {
    return {
      isActive: i,
      protectedKeys: {},
      needsAnimating: {},
      prevResolvedValues: {}
    };
  }
  function w0() {
    return {
      animate: Gi(true),
      whileInView: Gi(),
      whileHover: Gi(),
      whileTap: Gi(),
      whileDrag: Gi(),
      whileFocus: Gi(),
      exit: Gi()
    };
  }
  function tf(i, a) {
    i.min = a.min, i.max = a.max;
  }
  function rn(i, a) {
    tf(i.x, a.x), tf(i.y, a.y);
  }
  function R0(i, a) {
    i.translate = a.translate, i.scale = a.scale, i.originPoint = a.originPoint, i.origin = a.origin;
  }
  const Ug = 1e-4, jT = 1 - Ug, VT = 1 + Ug, Lg = 0.01, UT = 0 - Lg, LT = 0 + Lg;
  function Ee(i) {
    return i.max - i.min;
  }
  function BT(i, a, s) {
    return Math.abs(i - a) <= s;
  }
  function O0(i, a, s, r = 0.5) {
    i.origin = r, i.originPoint = qt(a.min, a.max, i.origin), i.scale = Ee(s) / Ee(a), i.translate = qt(s.min, s.max, i.origin) - i.originPoint, (i.scale >= jT && i.scale <= VT || isNaN(i.scale)) && (i.scale = 1), (i.translate >= UT && i.translate <= LT || isNaN(i.translate)) && (i.translate = 0);
  }
  function Kl(i, a, s, r) {
    O0(i.x, a.x, s.x, r ? r.originX : void 0), O0(i.y, a.y, s.y, r ? r.originY : void 0);
  }
  function N0(i, a, s, r = 0) {
    const c = r ? qt(s.min, s.max, r) : s.min;
    i.min = c + a.min, i.max = i.min + Ee(a);
  }
  function HT(i, a, s, r) {
    N0(i.x, a.x, s.x, r == null ? void 0 : r.x), N0(i.y, a.y, s.y, r == null ? void 0 : r.y);
  }
  function j0(i, a, s, r = 0) {
    const c = r ? qt(s.min, s.max, r) : s.min;
    i.min = a.min - c, i.max = i.min + Ee(a);
  }
  function Gr(i, a, s, r) {
    j0(i.x, a.x, s.x, r == null ? void 0 : r.x), j0(i.y, a.y, s.y, r == null ? void 0 : r.y);
  }
  function V0(i, a, s, r, c) {
    return i -= a, i = Hr(i, 1 / s, r), c !== void 0 && (i = Hr(i, 1 / c, r)), i;
  }
  function GT(i, a = 0, s = 1, r = 0.5, c, f = i, h = i) {
    if (Sn.test(a) && (a = parseFloat(a), a = qt(h.min, h.max, a / 100) - h.min), typeof a != "number") return;
    let m = qt(f.min, f.max, r);
    i === f && (m -= a), i.min = V0(i.min, a, s, m, c), i.max = V0(i.max, a, s, m, c);
  }
  function U0(i, a, [s, r, c], f, h) {
    GT(i, a[s], a[r], a[c], a.scale, f, h);
  }
  const qT = [
    "x",
    "scaleX",
    "originX"
  ], YT = [
    "y",
    "scaleY",
    "originY"
  ];
  function L0(i, a, s, r) {
    U0(i.x, a, qT, s ? s.x : void 0, r ? r.x : void 0), U0(i.y, a, YT, s ? s.y : void 0, r ? r.y : void 0);
  }
  function B0(i) {
    return i.translate === 0 && i.scale === 1;
  }
  function Bg(i) {
    return B0(i.x) && B0(i.y);
  }
  function H0(i, a) {
    return i.min === a.min && i.max === a.max;
  }
  function kT(i, a) {
    return H0(i.x, a.x) && H0(i.y, a.y);
  }
  function G0(i, a) {
    return Math.round(i.min) === Math.round(a.min) && Math.round(i.max) === Math.round(a.max);
  }
  function Hg(i, a) {
    return G0(i.x, a.x) && G0(i.y, a.y);
  }
  function q0(i) {
    return Ee(i.x) / Ee(i.y);
  }
  function Y0(i, a) {
    return i.translate === a.translate && i.scale === a.scale && i.originPoint === a.originPoint;
  }
  function vn(i) {
    return [
      i("x"),
      i("y")
    ];
  }
  function XT(i, a, s) {
    let r = "";
    const c = i.x.translate / a.x, f = i.y.translate / a.y, h = (s == null ? void 0 : s.z) || 0;
    if ((c || f || h) && (r = `translate3d(${c}px, ${f}px, ${h}px) `), (a.x !== 1 || a.y !== 1) && (r += `scale(${1 / a.x}, ${1 / a.y}) `), s) {
      const { transformPerspective: y, rotate: v, rotateX: b, rotateY: T, skewX: w, skewY: C } = s;
      y && (r = `perspective(${y}px) ${r}`), v && (r += `rotate(${v}deg) `), b && (r += `rotateX(${b}deg) `), T && (r += `rotateY(${T}deg) `), w && (r += `skewX(${w}deg) `), C && (r += `skewY(${C}deg) `);
    }
    const m = i.x.scale * a.x, p = i.y.scale * a.y;
    return (m !== 1 || p !== 1) && (r += `scale(${m}, ${p})`), r || "none";
  }
  const Gg = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ], KT = Gg.length, k0 = (i) => typeof i == "string" ? parseFloat(i) : i, X0 = (i) => typeof i == "number" || F.test(i);
  function QT(i, a, s, r, c, f) {
    c ? (i.opacity = qt(0, s.opacity ?? 1, ZT(r)), i.opacityExit = qt(a.opacity ?? 1, 0, PT(r))) : f && (i.opacity = qt(a.opacity ?? 1, s.opacity ?? 1, r));
    for (let h = 0; h < KT; h++) {
      const m = Gg[h];
      let p = K0(a, m), y = K0(s, m);
      if (p === void 0 && y === void 0) continue;
      p || (p = 0), y || (y = 0), p === 0 || y === 0 || X0(p) === X0(y) ? (i[m] = Math.max(qt(k0(p), k0(y), r), 0), (Sn.test(y) || Sn.test(p)) && (i[m] += "%")) : i[m] = y;
    }
    (a.rotate || s.rotate) && (i.rotate = qt(a.rotate || 0, s.rotate || 0, r));
  }
  function K0(i, a) {
    return i[a] !== void 0 ? i[a] : i.borderRadius;
  }
  const ZT = qg(0, 0.5, Ry), PT = qg(0.5, 0.95, nn);
  function qg(i, a, s) {
    return (r) => r < i ? 0 : r > a ? 1 : s(Zl(i, a, r));
  }
  function JT(i, a, s) {
    const r = ge(i) ? i : Ba(i);
    return r.start(Sf("", r, a, s)), r.animation;
  }
  function Fl(i, a, s, r = {
    passive: true
  }) {
    return i.addEventListener(a, s, r), () => i.removeEventListener(a, s);
  }
  const FT = (i, a) => i.depth - a.depth;
  class WT {
    constructor() {
      this.children = [], this.isDirty = false;
    }
    add(a) {
      rf(this.children, a), this.isDirty = true;
    }
    remove(a) {
      Nr(this.children, a), this.isDirty = true;
    }
    forEach(a) {
      this.isDirty && this.children.sort(FT), this.isDirty = false, this.children.forEach(a);
    }
  }
  function $T(i, a) {
    const s = Ae.now(), r = ({ timestamp: c }) => {
      const f = c - s;
      f >= a && (gi(r), i(f - a));
    };
    return Lt.setup(r, true), () => gi(r);
  }
  function Rr(i) {
    return ge(i) ? i.get() : i;
  }
  class IT {
    constructor() {
      this.members = [];
    }
    add(a) {
      rf(this.members, a);
      for (let s = this.members.length - 1; s >= 0; s--) {
        const r = this.members[s];
        if (r === a || r === this.lead || r === this.prevLead) continue;
        const c = r.instance;
        (!c || c.isConnected === false) && !r.snapshot && (Nr(this.members, r), r.unmount());
      }
      a.scheduleRender();
    }
    remove(a) {
      if (Nr(this.members, a), a === this.prevLead && (this.prevLead = void 0), a === this.lead) {
        const s = this.members[this.members.length - 1];
        s && this.promote(s);
      }
    }
    relegate(a) {
      var _a;
      for (let s = this.members.indexOf(a) - 1; s >= 0; s--) {
        const r = this.members[s];
        if (r.isPresent !== false && ((_a = r.instance) == null ? void 0 : _a.isConnected) !== false) return this.promote(r), true;
      }
      return false;
    }
    promote(a, s) {
      var _a;
      const r = this.lead;
      if (a !== r && (this.prevLead = r, this.lead = a, a.show(), r)) {
        r.updateSnapshot(), a.scheduleRender();
        const { layoutDependency: c } = r.options, { layoutDependency: f } = a.options;
        (c === void 0 || c !== f) && (a.resumeFrom = r, s && (r.preserveOpacity = true), r.snapshot && (a.snapshot = r.snapshot, a.snapshot.latestValues = r.animationValues || r.latestValues), ((_a = a.root) == null ? void 0 : _a.isUpdating) && (a.isLayoutDirty = true)), a.options.crossfade === false && r.hide();
      }
    }
    exitAnimationComplete() {
      this.members.forEach((a) => {
        var _a, _b2, _c2, _d, _e;
        (_b2 = (_a = a.options).onExitComplete) == null ? void 0 : _b2.call(_a), (_e = (_c2 = a.resumingFrom) == null ? void 0 : (_d = _c2.options).onExitComplete) == null ? void 0 : _e.call(_d);
      });
    }
    scheduleRender() {
      this.members.forEach((a) => a.instance && a.scheduleRender(false));
    }
    removeLeadSnapshot() {
      var _a;
      ((_a = this.lead) == null ? void 0 : _a.snapshot) && (this.lead.snapshot = void 0);
    }
  }
  const Or = {
    hasAnimatedSinceResize: true,
    hasEverUpdated: false
  }, Ec = [
    "",
    "X",
    "Y",
    "Z"
  ], tA = 1e3;
  let eA = 0;
  function _c(i, a, s, r) {
    const { latestValues: c } = a;
    c[i] && (s[i] = c[i], a.setStaticValue(i, 0), r && (r[i] = 0));
  }
  function Yg(i) {
    if (i.hasCheckedOptimisedAppear = true, i.root === i) return;
    const { visualElement: a } = i.options;
    if (!a) return;
    const s = ug(a);
    if (window.MotionHasOptimisedAnimation(s, "transform")) {
      const { layout: c, layoutId: f } = i.options;
      window.MotionCancelOptimisedAnimation(s, "transform", Lt, !(c || f));
    }
    const { parent: r } = i;
    r && !r.hasCheckedOptimisedAppear && Yg(r);
  }
  function kg({ attachResizeListener: i, defaultParent: a, measureScroll: s, checkIsScrollRoot: r, resetTransform: c }) {
    return class {
      constructor(h = {}, m = a == null ? void 0 : a()) {
        this.id = eA++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = false, this.isAnimationBlocked = false, this.isLayoutDirty = false, this.isProjectionDirty = false, this.isSharedProjectionDirty = false, this.isTransformDirty = false, this.updateManuallyBlocked = false, this.updateBlockedByResize = false, this.isUpdating = false, this.isSVG = false, this.needsReset = false, this.shouldResetTransform = false, this.hasCheckedOptimisedAppear = false, this.treeScale = {
          x: 1,
          y: 1
        }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = false, this.layoutVersion = 0, this.updateScheduled = false, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = false, this.checkUpdateFailed = () => {
          this.isUpdating && (this.isUpdating = false, this.clearAllSnapshots());
        }, this.updateProjection = () => {
          this.projectionUpdateScheduled = false, this.nodes.forEach(aA), this.nodes.forEach(cA), this.nodes.forEach(fA), this.nodes.forEach(lA);
        }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = false, this.isVisible = true, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = h, this.root = m ? m.root || m : this, this.path = m ? [
          ...m.path,
          m
        ] : [], this.parent = m, this.depth = m ? m.depth + 1 : 0;
        for (let p = 0; p < this.path.length; p++) this.path[p].shouldResetTransform = true;
        this.root === this && (this.nodes = new WT());
      }
      addEventListener(h, m) {
        return this.eventHandlers.has(h) || this.eventHandlers.set(h, new of()), this.eventHandlers.get(h).add(m);
      }
      notifyListeners(h, ...m) {
        const p = this.eventHandlers.get(h);
        p && p.notify(...m);
      }
      hasListeners(h) {
        return this.eventHandlers.has(h);
      }
      mount(h) {
        if (this.instance) return;
        this.isSVG = Mf(h) && !iT(h), this.instance = h;
        const { layoutId: m, layout: p, visualElement: y } = this.options;
        if (y && !y.current && y.mount(h), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (p || m) && (this.isLayoutDirty = true), i) {
          let v, b = 0;
          const T = () => this.root.updateBlockedByResize = false;
          Lt.read(() => {
            b = window.innerWidth;
          }), i(h, () => {
            const w = window.innerWidth;
            w !== b && (b = w, this.root.updateBlockedByResize = true, v && v(), v = $T(T, 250), Or.hasAnimatedSinceResize && (Or.hasAnimatedSinceResize = false, this.nodes.forEach(P0)));
          });
        }
        m && this.root.registerSharedNode(m, this), this.options.animate !== false && y && (m || p) && this.addEventListener("didUpdate", ({ delta: v, hasLayoutChanged: b, hasRelativeLayoutChanged: T, layout: w }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0, this.relativeTarget = void 0;
            return;
          }
          const C = this.options.transition || y.getDefaultTransition() || yA, { onLayoutAnimationStart: L, onLayoutAnimationComplete: H } = y.getProps(), B = !this.targetLayout || !Hg(this.targetLayout, w), k = !b && T;
          if (this.options.layoutRoot || this.resumeFrom || k || b && (B || !this.currentAnimation)) {
            this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
            const G = {
              ...bf(C, "layout"),
              onPlay: L,
              onComplete: H
            };
            (y.shouldReduceMotion || this.options.layoutRoot) && (G.delay = 0, G.type = false), this.startAnimation(G), this.setAnimationOrigin(v, k);
          } else b || P0(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
          this.targetLayout = w;
        });
      }
      unmount() {
        this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
        const h = this.getStack();
        h && h.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), gi(this.updateProjection);
      }
      blockUpdate() {
        this.updateManuallyBlocked = true;
      }
      unblockUpdate() {
        this.updateManuallyBlocked = false;
      }
      isUpdateBlocked() {
        return this.updateManuallyBlocked || this.updateBlockedByResize;
      }
      isTreeAnimationBlocked() {
        return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
      }
      startUpdate() {
        this.isUpdateBlocked() || (this.isUpdating = true, this.nodes && this.nodes.forEach(hA), this.animationId++);
      }
      getTransformTemplate() {
        const { visualElement: h } = this.options;
        return h && h.getProps().transformTemplate;
      }
      willUpdate(h = true) {
        if (this.root.hasTreeAnimated = true, this.root.isUpdateBlocked()) {
          this.options.onExitComplete && this.options.onExitComplete();
          return;
        }
        if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Yg(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
        this.isLayoutDirty = true;
        for (let v = 0; v < this.path.length; v++) {
          const b = this.path[v];
          b.shouldResetTransform = true, (typeof b.latestValues.x == "string" || typeof b.latestValues.y == "string") && (b.isLayoutDirty = true), b.updateScroll("snapshot"), b.options.layoutRoot && b.willUpdate(false);
        }
        const { layoutId: m, layout: p } = this.options;
        if (m === void 0 && !p) return;
        const y = this.getTransformTemplate();
        this.prevTransformTemplateValue = y ? y(this.latestValues, "") : void 0, this.updateSnapshot(), h && this.notifyListeners("willUpdate");
      }
      update() {
        if (this.updateScheduled = false, this.isUpdateBlocked()) {
          const p = this.updateBlockedByResize;
          this.unblockUpdate(), this.updateBlockedByResize = false, this.clearAllSnapshots(), p && this.nodes.forEach(rA), this.nodes.forEach(Q0);
          return;
        }
        if (this.animationId <= this.animationCommitId) {
          this.nodes.forEach(Z0);
          return;
        }
        this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = false, this.nodes.forEach(uA), this.nodes.forEach(oA), this.nodes.forEach(nA), this.nodes.forEach(iA)) : this.nodes.forEach(Z0), this.clearAllSnapshots();
        const m = Ae.now();
        ye.delta = xn(0, 1e3 / 60, m - ye.timestamp), ye.timestamp = m, ye.isProcessing = true, yc.update.process(ye), yc.preRender.process(ye), yc.render.process(ye), ye.isProcessing = false;
      }
      didUpdate() {
        this.updateScheduled || (this.updateScheduled = true, Ef.read(this.scheduleUpdate));
      }
      clearAllSnapshots() {
        this.nodes.forEach(sA), this.sharedNodes.forEach(dA);
      }
      scheduleUpdateProjection() {
        this.projectionUpdateScheduled || (this.projectionUpdateScheduled = true, Lt.preRender(this.updateProjection, false, true));
      }
      scheduleCheckAfterUnmount() {
        Lt.postRender(() => {
          this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
        });
      }
      updateSnapshot() {
        this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !Ee(this.snapshot.measuredBox.x) && !Ee(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
      }
      updateLayout() {
        if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
        if (this.resumeFrom && !this.resumeFrom.instance) for (let p = 0; p < this.path.length; p++) this.path[p].updateScroll();
        const h = this.layout;
        this.layout = this.measure(false), this.layoutVersion++, this.layoutCorrected || (this.layoutCorrected = le()), this.isLayoutDirty = false, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
        const { visualElement: m } = this.options;
        m && m.notify("LayoutMeasure", this.layout.layoutBox, h ? h.layoutBox : void 0);
      }
      updateScroll(h = "measure") {
        let m = !!(this.options.layoutScroll && this.instance);
        if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === h && (m = false), m && this.instance) {
          const p = r(this.instance);
          this.scroll = {
            animationId: this.root.animationId,
            phase: h,
            isRoot: p,
            offset: s(this.instance),
            wasRoot: this.scroll ? this.scroll.isRoot : p
          };
        }
      }
      resetTransform() {
        if (!c) return;
        const h = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, m = this.projectionDelta && !Bg(this.projectionDelta), p = this.getTransformTemplate(), y = p ? p(this.latestValues, "") : void 0, v = y !== this.prevTransformTemplateValue;
        h && this.instance && (m || Yi(this.latestValues) || v) && (c(this.instance, y), this.shouldResetTransform = false, this.scheduleRender());
      }
      measure(h = true) {
        const m = this.measurePageBox();
        let p = this.removeElementScroll(m);
        return h && (p = this.removeTransform(p)), gA(p), {
          animationId: this.root.animationId,
          measuredBox: m,
          layoutBox: p,
          latestValues: {},
          source: this.id
        };
      }
      measurePageBox() {
        var _a;
        const { visualElement: h } = this.options;
        if (!h) return le();
        const m = h.measureViewportBox();
        if (!(((_a = this.scroll) == null ? void 0 : _a.wasRoot) || this.path.some(vA))) {
          const { scroll: y } = this.root;
          y && (bn(m.x, y.offset.x), bn(m.y, y.offset.y));
        }
        return m;
      }
      removeElementScroll(h) {
        var _a;
        const m = le();
        if (rn(m, h), (_a = this.scroll) == null ? void 0 : _a.wasRoot) return m;
        for (let p = 0; p < this.path.length; p++) {
          const y = this.path[p], { scroll: v, options: b } = y;
          y !== this.root && v && b.layoutScroll && (v.wasRoot && rn(m, h), bn(m.x, v.offset.x), bn(m.y, v.offset.y));
        }
        return m;
      }
      applyTransform(h, m = false, p) {
        var _a, _b2;
        const y = p || le();
        rn(y, h);
        for (let v = 0; v < this.path.length; v++) {
          const b = this.path[v];
          !m && b.options.layoutScroll && b.scroll && b !== b.root && (bn(y.x, -b.scroll.offset.x), bn(y.y, -b.scroll.offset.y)), Yi(b.latestValues) && wr(y, b.latestValues, (_a = b.layout) == null ? void 0 : _a.layoutBox);
        }
        return Yi(this.latestValues) && wr(y, this.latestValues, (_b2 = this.layout) == null ? void 0 : _b2.layoutBox), y;
      }
      removeTransform(h) {
        var _a;
        const m = le();
        rn(m, h);
        for (let p = 0; p < this.path.length; p++) {
          const y = this.path[p];
          if (!Yi(y.latestValues)) continue;
          let v;
          y.instance && (Wc(y.latestValues) && y.updateSnapshot(), v = le(), rn(v, y.measurePageBox())), L0(m, y.latestValues, (_a = y.snapshot) == null ? void 0 : _a.layoutBox, v);
        }
        return Yi(this.latestValues) && L0(m, this.latestValues), m;
      }
      setTargetDelta(h) {
        this.targetDelta = h, this.root.scheduleUpdateProjection(), this.isProjectionDirty = true;
      }
      setOptions(h) {
        this.options = {
          ...this.options,
          ...h,
          crossfade: h.crossfade !== void 0 ? h.crossfade : true
        };
      }
      clearMeasurements() {
        this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = false;
      }
      forceRelativeParentToResolveTarget() {
        this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ye.timestamp && this.relativeParent.resolveTargetDelta(true);
      }
      resolveTargetDelta(h = false) {
        var _a;
        const m = this.getLead();
        this.isProjectionDirty || (this.isProjectionDirty = m.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = m.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = m.isSharedProjectionDirty);
        const p = !!this.resumingFrom || this !== m;
        if (!(h || p && this.isSharedProjectionDirty || this.isProjectionDirty || ((_a = this.parent) == null ? void 0 : _a.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
        const { layout: v, layoutId: b } = this.options;
        if (!this.layout || !(v || b)) return;
        this.resolvedRelativeTargetAt = ye.timestamp;
        const T = this.getClosestProjectingParent();
        T && this.linkedParentVersion !== T.layoutVersion && !T.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== false && T && T.layout ? this.createRelativeTarget(T, this.layout.layoutBox, T.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = le(), this.targetWithTransforms = le()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), HT(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, false, this.target) : rn(this.target, this.layout.layoutBox), Mg(this.target, this.targetDelta)) : rn(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = false, this.options.layoutAnchor !== false && T && !!T.resumingFrom == !!this.resumingFrom && !T.options.layoutScroll && T.target && this.animationProgress !== 1 ? this.createRelativeTarget(T, this.target, T.target) : this.relativeParent = this.relativeTarget = void 0));
      }
      getClosestProjectingParent() {
        if (!(!this.parent || Wc(this.parent.latestValues) || _g(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
      }
      isProjecting() {
        return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
      }
      createRelativeTarget(h, m, p) {
        this.relativeParent = h, this.linkedParentVersion = h.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = le(), this.relativeTargetOrigin = le(), Gr(this.relativeTargetOrigin, m, p, this.options.layoutAnchor || void 0), rn(this.relativeTarget, this.relativeTargetOrigin);
      }
      removeRelativeTarget() {
        this.relativeParent = this.relativeTarget = void 0;
      }
      calcProjection() {
        var _a;
        const h = this.getLead(), m = !!this.resumingFrom || this !== h;
        let p = true;
        if ((this.isProjectionDirty || ((_a = this.parent) == null ? void 0 : _a.isProjectionDirty)) && (p = false), m && (this.isSharedProjectionDirty || this.isTransformDirty) && (p = false), this.resolvedRelativeTargetAt === ye.timestamp && (p = false), p) return;
        const { layout: y, layoutId: v } = this.options;
        if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(y || v)) return;
        rn(this.layoutCorrected, this.layout.layoutBox);
        const b = this.treeScale.x, T = this.treeScale.y;
        mT(this.layoutCorrected, this.treeScale, this.path, m), h.layout && !h.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (h.target = h.layout.layoutBox, h.targetWithTransforms = le());
        const { target: w } = h;
        if (!w) {
          this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
          return;
        }
        !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (R0(this.prevProjectionDelta.x, this.projectionDelta.x), R0(this.prevProjectionDelta.y, this.projectionDelta.y)), Kl(this.projectionDelta, this.layoutCorrected, w, this.latestValues), (this.treeScale.x !== b || this.treeScale.y !== T || !Y0(this.projectionDelta.x, this.prevProjectionDelta.x) || !Y0(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = true, this.scheduleRender(), this.notifyListeners("projectionUpdate", w));
      }
      hide() {
        this.isVisible = false;
      }
      show() {
        this.isVisible = true;
      }
      scheduleRender(h = true) {
        var _a;
        if ((_a = this.options.visualElement) == null ? void 0 : _a.scheduleRender(), h) {
          const m = this.getStack();
          m && m.scheduleRender();
        }
        this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
      }
      createProjectionDeltas() {
        this.prevProjectionDelta = Ua(), this.projectionDelta = Ua(), this.projectionDeltaWithTransform = Ua();
      }
      setAnimationOrigin(h, m = false) {
        const p = this.snapshot, y = p ? p.latestValues : {}, v = {
          ...this.latestValues
        }, b = Ua();
        (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !m;
        const T = le(), w = p ? p.source : void 0, C = this.layout ? this.layout.source : void 0, L = w !== C, H = this.getStack(), B = !H || H.members.length <= 1, k = !!(L && !B && this.options.crossfade === true && !this.path.some(pA));
        this.animationProgress = 0;
        let G;
        this.mixTargetDelta = (Q) => {
          const I = Q / 1e3;
          J0(b.x, h.x, I), J0(b.y, h.y, I), this.setTargetDelta(b), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Gr(T, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), mA(this.relativeTarget, this.relativeTargetOrigin, T, I), G && kT(this.relativeTarget, G) && (this.isProjectionDirty = false), G || (G = le()), rn(G, this.relativeTarget)), L && (this.animationValues = v, QT(v, y, this.latestValues, I, k, B)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = I;
        }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
      }
      startAnimation(h) {
        var _a, _b2, _c2;
        this.notifyListeners("animationStart"), (_a = this.currentAnimation) == null ? void 0 : _a.stop(), (_c2 = (_b2 = this.resumingFrom) == null ? void 0 : _b2.currentAnimation) == null ? void 0 : _c2.stop(), this.pendingAnimation && (gi(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Lt.update(() => {
          Or.hasAnimatedSinceResize = true, this.motionValue || (this.motionValue = Ba(0)), this.motionValue.jump(0, false), this.currentAnimation = JT(this.motionValue, [
            0,
            1e3
          ], {
            ...h,
            velocity: 0,
            isSync: true,
            onUpdate: (m) => {
              this.mixTargetDelta(m), h.onUpdate && h.onUpdate(m);
            },
            onStop: () => {
            },
            onComplete: () => {
              h.onComplete && h.onComplete(), this.completeAnimation();
            }
          }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
        });
      }
      completeAnimation() {
        this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
        const h = this.getStack();
        h && h.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
      }
      finishAnimation() {
        this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(tA), this.currentAnimation.stop()), this.completeAnimation();
      }
      applyTransformsToTarget() {
        const h = this.getLead();
        let { targetWithTransforms: m, target: p, layout: y, latestValues: v } = h;
        if (!(!m || !p || !y)) {
          if (this !== h && this.layout && y && Xg(this.options.animationType, this.layout.layoutBox, y.layoutBox)) {
            p = this.target || le();
            const b = Ee(this.layout.layoutBox.x);
            p.x.min = h.target.x.min, p.x.max = p.x.min + b;
            const T = Ee(this.layout.layoutBox.y);
            p.y.min = h.target.y.min, p.y.max = p.y.min + T;
          }
          rn(m, p), wr(m, v), Kl(this.projectionDeltaWithTransform, this.layoutCorrected, m, v);
        }
      }
      registerSharedNode(h, m) {
        this.sharedNodes.has(h) || this.sharedNodes.set(h, new IT()), this.sharedNodes.get(h).add(m);
        const y = m.options.initialPromotionConfig;
        m.promote({
          transition: y ? y.transition : void 0,
          preserveFollowOpacity: y && y.shouldPreserveFollowOpacity ? y.shouldPreserveFollowOpacity(m) : void 0
        });
      }
      isLead() {
        const h = this.getStack();
        return h ? h.lead === this : true;
      }
      getLead() {
        var _a;
        const { layoutId: h } = this.options;
        return h ? ((_a = this.getStack()) == null ? void 0 : _a.lead) || this : this;
      }
      getPrevLead() {
        var _a;
        const { layoutId: h } = this.options;
        return h ? (_a = this.getStack()) == null ? void 0 : _a.prevLead : void 0;
      }
      getStack() {
        const { layoutId: h } = this.options;
        if (h) return this.root.sharedNodes.get(h);
      }
      promote({ needsReset: h, transition: m, preserveFollowOpacity: p } = {}) {
        const y = this.getStack();
        y && y.promote(this, p), h && (this.projectionDelta = void 0, this.needsReset = true), m && this.setOptions({
          transition: m
        });
      }
      relegate() {
        const h = this.getStack();
        return h ? h.relegate(this) : false;
      }
      resetSkewAndRotation() {
        const { visualElement: h } = this.options;
        if (!h) return;
        let m = false;
        const { latestValues: p } = h;
        if ((p.z || p.rotate || p.rotateX || p.rotateY || p.rotateZ || p.skewX || p.skewY) && (m = true), !m) return;
        const y = {};
        p.z && _c("z", h, y, this.animationValues);
        for (let v = 0; v < Ec.length; v++) _c(`rotate${Ec[v]}`, h, y, this.animationValues), _c(`skew${Ec[v]}`, h, y, this.animationValues);
        h.render();
        for (const v in y) h.setStaticValue(v, y[v]), this.animationValues && (this.animationValues[v] = y[v]);
        h.scheduleRender();
      }
      applyProjectionStyles(h, m) {
        if (!this.instance || this.isSVG) return;
        if (!this.isVisible) {
          h.visibility = "hidden";
          return;
        }
        const p = this.getTransformTemplate();
        if (this.needsReset) {
          this.needsReset = false, h.visibility = "", h.opacity = "", h.pointerEvents = Rr(m == null ? void 0 : m.pointerEvents) || "", h.transform = p ? p(this.latestValues, "") : "none";
          return;
        }
        const y = this.getLead();
        if (!this.projectionDelta || !this.layout || !y.target) {
          this.options.layoutId && (h.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, h.pointerEvents = Rr(m == null ? void 0 : m.pointerEvents) || ""), this.hasProjected && !Yi(this.latestValues) && (h.transform = p ? p({}, "") : "none", this.hasProjected = false);
          return;
        }
        h.visibility = "";
        const v = y.animationValues || y.latestValues;
        this.applyTransformsToTarget();
        let b = XT(this.projectionDeltaWithTransform, this.treeScale, v);
        p && (b = p(v, b)), h.transform = b;
        const { x: T, y: w } = this.projectionDelta;
        h.transformOrigin = `${T.origin * 100}% ${w.origin * 100}% 0`, y.animationValues ? h.opacity = y === this ? v.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : v.opacityExit : h.opacity = y === this ? v.opacity !== void 0 ? v.opacity : "" : v.opacityExit !== void 0 ? v.opacityExit : 0;
        for (const C in Ic) {
          if (v[C] === void 0) continue;
          const { correct: L, applyTo: H, isCSSVariable: B } = Ic[C], k = b === "none" ? v[C] : L(v[C], y);
          if (H) {
            const G = H.length;
            for (let Q = 0; Q < G; Q++) h[H[Q]] = k;
          } else B ? this.options.visualElement.renderState.vars[C] = k : h[C] = k;
        }
        this.options.layoutId && (h.pointerEvents = y === this ? Rr(m == null ? void 0 : m.pointerEvents) || "" : "none");
      }
      clearSnapshot() {
        this.resumeFrom = this.snapshot = void 0;
      }
      resetTree() {
        this.root.nodes.forEach((h) => {
          var _a;
          return (_a = h.currentAnimation) == null ? void 0 : _a.stop();
        }), this.root.nodes.forEach(Q0), this.root.sharedNodes.clear();
      }
    };
  }
  function nA(i) {
    i.updateLayout();
  }
  function iA(i) {
    var _a;
    const a = ((_a = i.resumeFrom) == null ? void 0 : _a.snapshot) || i.snapshot;
    if (i.isLead() && i.layout && a && i.hasListeners("didUpdate")) {
      const { layoutBox: s, measuredBox: r } = i.layout, { animationType: c } = i.options, f = a.source !== i.layout.source;
      if (c === "size") vn((v) => {
        const b = f ? a.measuredBox[v] : a.layoutBox[v], T = Ee(b);
        b.min = s[v].min, b.max = b.min + T;
      });
      else if (c === "x" || c === "y") {
        const v = c === "x" ? "y" : "x";
        tf(f ? a.measuredBox[v] : a.layoutBox[v], s[v]);
      } else Xg(c, a.layoutBox, s) && vn((v) => {
        const b = f ? a.measuredBox[v] : a.layoutBox[v], T = Ee(s[v]);
        b.max = b.min + T, i.relativeTarget && !i.currentAnimation && (i.isProjectionDirty = true, i.relativeTarget[v].max = i.relativeTarget[v].min + T);
      });
      const h = Ua();
      Kl(h, s, a.layoutBox);
      const m = Ua();
      f ? Kl(m, i.applyTransform(r, true), a.measuredBox) : Kl(m, s, a.layoutBox);
      const p = !Bg(h);
      let y = false;
      if (!i.resumeFrom) {
        const v = i.getClosestProjectingParent();
        if (v && !v.resumeFrom) {
          const { snapshot: b, layout: T } = v;
          if (b && T) {
            const w = i.options.layoutAnchor || void 0, C = le();
            Gr(C, a.layoutBox, b.layoutBox, w);
            const L = le();
            Gr(L, s, T.layoutBox, w), Hg(C, L) || (y = true), v.options.layoutRoot && (i.relativeTarget = L, i.relativeTargetOrigin = C, i.relativeParent = v);
          }
        }
      }
      i.notifyListeners("didUpdate", {
        layout: s,
        snapshot: a,
        delta: m,
        layoutDelta: h,
        hasLayoutChanged: p,
        hasRelativeLayoutChanged: y
      });
    } else if (i.isLead()) {
      const { onExitComplete: s } = i.options;
      s && s();
    }
    i.options.transition = void 0;
  }
  function aA(i) {
    i.parent && (i.isProjecting() || (i.isProjectionDirty = i.parent.isProjectionDirty), i.isSharedProjectionDirty || (i.isSharedProjectionDirty = !!(i.isProjectionDirty || i.parent.isProjectionDirty || i.parent.isSharedProjectionDirty)), i.isTransformDirty || (i.isTransformDirty = i.parent.isTransformDirty));
  }
  function lA(i) {
    i.isProjectionDirty = i.isSharedProjectionDirty = i.isTransformDirty = false;
  }
  function sA(i) {
    i.clearSnapshot();
  }
  function Q0(i) {
    i.clearMeasurements();
  }
  function rA(i) {
    i.isLayoutDirty = true, i.updateLayout();
  }
  function Z0(i) {
    i.isLayoutDirty = false;
  }
  function uA(i) {
    i.isAnimationBlocked && i.layout && !i.isLayoutDirty && (i.snapshot = i.layout, i.isLayoutDirty = true);
  }
  function oA(i) {
    const { visualElement: a } = i.options;
    a && a.getProps().onBeforeLayoutMeasure && a.notify("BeforeLayoutMeasure"), i.resetTransform();
  }
  function P0(i) {
    i.finishAnimation(), i.targetDelta = i.relativeTarget = i.target = void 0, i.isProjectionDirty = true;
  }
  function cA(i) {
    i.resolveTargetDelta();
  }
  function fA(i) {
    i.calcProjection();
  }
  function hA(i) {
    i.resetSkewAndRotation();
  }
  function dA(i) {
    i.removeLeadSnapshot();
  }
  function J0(i, a, s) {
    i.translate = qt(a.translate, 0, s), i.scale = qt(a.scale, 1, s), i.origin = a.origin, i.originPoint = a.originPoint;
  }
  function F0(i, a, s, r) {
    i.min = qt(a.min, s.min, r), i.max = qt(a.max, s.max, r);
  }
  function mA(i, a, s, r) {
    F0(i.x, a.x, s.x, r), F0(i.y, a.y, s.y, r);
  }
  function pA(i) {
    return i.animationValues && i.animationValues.opacityExit !== void 0;
  }
  const yA = {
    duration: 0.45,
    ease: [
      0.4,
      0,
      0.1,
      1
    ]
  }, W0 = (i) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(i), $0 = W0("applewebkit/") && !W0("chrome/") ? Math.round : nn;
  function I0(i) {
    i.min = $0(i.min), i.max = $0(i.max);
  }
  function gA(i) {
    I0(i.x), I0(i.y);
  }
  function Xg(i, a, s) {
    return i === "position" || i === "preserve-aspect" && !BT(q0(a), q0(s), 0.2);
  }
  function vA(i) {
    var _a;
    return i !== i.root && ((_a = i.scroll) == null ? void 0 : _a.wasRoot);
  }
  const bA = kg({
    attachResizeListener: (i, a) => Fl(i, "resize", a),
    measureScroll: () => {
      var _a, _b2;
      return {
        x: document.documentElement.scrollLeft || ((_a = document.body) == null ? void 0 : _a.scrollLeft) || 0,
        y: document.documentElement.scrollTop || ((_b2 = document.body) == null ? void 0 : _b2.scrollTop) || 0
      };
    },
    checkIsScrollRoot: () => true
  }), Mc = {
    current: void 0
  }, Kg = kg({
    measureScroll: (i) => ({
      x: i.scrollLeft,
      y: i.scrollTop
    }),
    defaultParent: () => {
      if (!Mc.current) {
        const i = new bA({});
        i.mount(window), i.setOptions({
          layoutScroll: true
        }), Mc.current = i;
      }
      return Mc.current;
    },
    resetTransform: (i, a) => {
      i.style.transform = a !== void 0 ? a : "none";
    },
    checkIsScrollRoot: (i) => window.getComputedStyle(i).position === "fixed"
  }), Qg = q.createContext({
    transformPagePoint: (i) => i,
    isStatic: false,
    reducedMotion: "never"
  });
  function SA(i = true) {
    const a = q.useContext(sf);
    if (a === null) return [
      true,
      null
    ];
    const { isPresent: s, onExitComplete: r, register: c } = a, f = q.useId();
    q.useEffect(() => {
      if (i) return c(f);
    }, [
      i
    ]);
    const h = q.useCallback(() => i && r && r(f), [
      f,
      r,
      i
    ]);
    return !s && r ? [
      false,
      h
    ] : [
      true
    ];
  }
  const Zg = q.createContext({
    strict: false
  }), ty = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag"
    ],
    exit: [
      "exit"
    ],
    drag: [
      "drag",
      "dragControls"
    ],
    focus: [
      "whileFocus"
    ],
    hover: [
      "whileHover",
      "onHoverStart",
      "onHoverEnd"
    ],
    tap: [
      "whileTap",
      "onTap",
      "onTapStart",
      "onTapCancel"
    ],
    pan: [
      "onPan",
      "onPanStart",
      "onPanSessionStart",
      "onPanEnd"
    ],
    inView: [
      "whileInView",
      "onViewportEnter",
      "onViewportLeave"
    ],
    layout: [
      "layout",
      "layoutId"
    ]
  };
  let ey = false;
  function xA() {
    if (ey) return;
    const i = {};
    for (const a in ty) i[a] = {
      isEnabled: (s) => ty[a].some((r) => !!s[r])
    };
    Tg(i), ey = true;
  }
  function Pg() {
    return xA(), cT();
  }
  function TA(i) {
    const a = Pg();
    for (const s in i) a[s] = {
      ...a[s],
      ...i[s]
    };
    Tg(a);
  }
  const AA = /* @__PURE__ */ new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "propagate",
    "ignoreStrict",
    "viewport"
  ]);
  function qr(i) {
    return i.startsWith("while") || i.startsWith("drag") && i !== "draggable" || i.startsWith("layout") || i.startsWith("onTap") || i.startsWith("onPan") || i.startsWith("onLayout") || AA.has(i);
  }
  let Jg = (i) => !qr(i);
  function EA(i) {
    typeof i == "function" && (Jg = (a) => a.startsWith("on") ? !qr(a) : i(a));
  }
  try {
    EA(require("@emotion/is-prop-valid").default);
  } catch {
  }
  function _A(i, a, s) {
    const r = {};
    for (const c in i) c === "values" && typeof i.values == "object" || ge(i[c]) || (Jg(c) || s === true && qr(c) || !a && !qr(c) || i.draggable && c.startsWith("onDrag")) && (r[c] = i[c]);
    return r;
  }
  const Kr = q.createContext({});
  function MA(i, a) {
    if (Xr(i)) {
      const { initial: s, animate: r } = i;
      return {
        initial: s === false || Jl(s) ? s : void 0,
        animate: Jl(r) ? r : void 0
      };
    }
    return i.inherit !== false ? a : {};
  }
  function DA(i) {
    const { initial: a, animate: s } = MA(i, q.useContext(Kr));
    return q.useMemo(() => ({
      initial: a,
      animate: s
    }), [
      ny(a),
      ny(s)
    ]);
  }
  function ny(i) {
    return Array.isArray(i) ? i.join(" ") : i;
  }
  const Rf = () => ({
    style: {},
    transform: {},
    transformOrigin: {},
    vars: {}
  });
  function Fg(i, a, s) {
    for (const r in a) !ge(a[r]) && !Cg(r, s) && (i[r] = a[r]);
  }
  function zA({ transformTemplate: i }, a) {
    return q.useMemo(() => {
      const s = Rf();
      return Cf(s, a, i), Object.assign({}, s.vars, s.style);
    }, [
      a
    ]);
  }
  function CA(i, a) {
    const s = i.style || {}, r = {};
    return Fg(r, s, i), Object.assign(r, zA(i, a)), r;
  }
  function wA(i, a) {
    const s = {}, r = CA(i, a);
    return i.drag && i.dragListener !== false && (s.draggable = false, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = i.drag === true ? "none" : `pan-${i.drag === "x" ? "y" : "x"}`), i.tabIndex === void 0 && (i.onTap || i.onTapStart || i.whileTap) && (s.tabIndex = 0), s.style = r, s;
  }
  const Wg = () => ({
    ...Rf(),
    attrs: {}
  });
  function RA(i, a, s, r) {
    const c = q.useMemo(() => {
      const f = Wg();
      return wg(f, a, Og(r), i.transformTemplate, i.style), {
        ...f.attrs,
        style: {
          ...f.style
        }
      };
    }, [
      a
    ]);
    if (i.style) {
      const f = {};
      Fg(f, i.style, i), c.style = {
        ...f,
        ...c.style
      };
    }
    return c;
  }
  const OA = [
    "animate",
    "circle",
    "defs",
    "desc",
    "ellipse",
    "g",
    "image",
    "line",
    "filter",
    "marker",
    "mask",
    "metadata",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "switch",
    "symbol",
    "svg",
    "text",
    "tspan",
    "use",
    "view"
  ];
  function Of(i) {
    return typeof i != "string" || i.includes("-") ? false : !!(OA.indexOf(i) > -1 || /[A-Z]/u.test(i));
  }
  function NA(i, a, s, { latestValues: r }, c, f = false, h) {
    const p = (h ?? Of(i) ? RA : wA)(a, r, c, i), y = _A(a, typeof i == "string", f), v = i !== q.Fragment ? {
      ...y,
      ...p,
      ref: s
    } : {}, { children: b } = a, T = q.useMemo(() => ge(b) ? b.get() : b, [
      b
    ]);
    return q.createElement(i, {
      ...v,
      children: T
    });
  }
  function jA({ scrapeMotionValuesFromProps: i, createRenderState: a }, s, r, c) {
    return {
      latestValues: VA(s, r, c, i),
      renderState: a()
    };
  }
  function VA(i, a, s, r) {
    const c = {}, f = r(i, {});
    for (const T in f) c[T] = Rr(f[T]);
    let { initial: h, animate: m } = i;
    const p = Xr(i), y = Sg(i);
    a && y && !p && i.inherit !== false && (h === void 0 && (h = a.initial), m === void 0 && (m = a.animate));
    let v = s ? s.initial === false : false;
    v = v || h === false;
    const b = v ? m : h;
    if (b && typeof b != "boolean" && !kr(b)) {
      const T = Array.isArray(b) ? b : [
        b
      ];
      for (let w = 0; w < T.length; w++) {
        const C = xf(i, T[w]);
        if (C) {
          const { transitionEnd: L, transition: H, ...B } = C;
          for (const k in B) {
            let G = B[k];
            if (Array.isArray(G)) {
              const Q = v ? G.length - 1 : 0;
              G = G[Q];
            }
            G !== null && (c[k] = G);
          }
          for (const k in L) c[k] = L[k];
        }
      }
    }
    return c;
  }
  const $g = (i) => (a, s) => {
    const r = q.useContext(Kr), c = q.useContext(sf), f = () => jA(i, a, r, c);
    return s ? f() : O2(f);
  }, UA = $g({
    scrapeMotionValuesFromProps: wf,
    createRenderState: Rf
  }), LA = $g({
    scrapeMotionValuesFromProps: Ng,
    createRenderState: Wg
  }), BA = Symbol.for("motionComponentSymbol");
  function HA(i, a, s) {
    const r = q.useRef(s);
    q.useInsertionEffect(() => {
      r.current = s;
    });
    const c = q.useRef(null);
    return q.useCallback((f) => {
      var _a;
      f && ((_a = i.onMount) == null ? void 0 : _a.call(i, f));
      const h = r.current;
      if (typeof h == "function") if (f) {
        const m = h(f);
        typeof m == "function" && (c.current = m);
      } else c.current ? (c.current(), c.current = null) : h(f);
      else h && (h.current = f);
      a && (f ? a.mount(f) : a.unmount());
    }, [
      a
    ]);
  }
  const Ig = q.createContext({});
  function Oa(i) {
    return i && typeof i == "object" && Object.prototype.hasOwnProperty.call(i, "current");
  }
  function GA(i, a, s, r, c, f) {
    var _a, _b2;
    const { visualElement: h } = q.useContext(Kr), m = q.useContext(Zg), p = q.useContext(sf), y = q.useContext(Qg), v = y.reducedMotion, b = y.skipAnimations, T = q.useRef(null), w = q.useRef(false);
    r = r || m.renderer, !T.current && r && (T.current = r(i, {
      visualState: a,
      parent: h,
      props: s,
      presenceContext: p,
      blockInitialAnimation: p ? p.initial === false : false,
      reducedMotionConfig: v,
      skipAnimations: b,
      isSVG: f
    }), w.current && T.current && (T.current.manuallyAnimateOnMount = true));
    const C = T.current, L = q.useContext(Ig);
    C && !C.projection && c && (C.type === "html" || C.type === "svg") && qA(T.current, s, c, L);
    const H = q.useRef(false);
    q.useInsertionEffect(() => {
      C && H.current && C.update(s, p);
    });
    const B = s[rg], k = q.useRef(!!B && typeof window < "u" && !((_a = window.MotionHandoffIsComplete) == null ? void 0 : _a.call(window, B)) && ((_b2 = window.MotionHasOptimisedAnimation) == null ? void 0 : _b2.call(window, B)));
    return j2(() => {
      w.current = true, C && (H.current = true, window.MotionIsMounted = true, C.updateFeatures(), C.scheduleRenderMicrotask(), k.current && C.animationState && C.animationState.animateChanges());
    }), q.useEffect(() => {
      C && (!k.current && C.animationState && C.animationState.animateChanges(), k.current && (queueMicrotask(() => {
        var _a2;
        (_a2 = window.MotionHandoffMarkAsComplete) == null ? void 0 : _a2.call(window, B);
      }), k.current = false), C.enteringChildren = void 0);
    }), C;
  }
  function qA(i, a, s, r) {
    const { layoutId: c, layout: f, drag: h, dragConstraints: m, layoutScroll: p, layoutRoot: y, layoutAnchor: v, layoutCrossfade: b } = a;
    i.projection = new s(i.latestValues, a["data-framer-portal-id"] ? void 0 : tv(i.parent)), i.projection.setOptions({
      layoutId: c,
      layout: f,
      alwaysMeasureLayout: !!h || m && Oa(m),
      visualElement: i,
      animationType: typeof f == "string" ? f : "both",
      initialPromotionConfig: r,
      crossfade: b,
      layoutScroll: p,
      layoutRoot: y,
      layoutAnchor: v
    });
  }
  function tv(i) {
    if (i) return i.options.allowProjection !== false ? i.projection : tv(i.parent);
  }
  function Dc(i, { forwardMotionProps: a = false, type: s } = {}, r, c) {
    r && TA(r);
    const f = s ? s === "svg" : Of(i), h = f ? LA : UA;
    function m(y, v) {
      let b;
      const T = {
        ...q.useContext(Qg),
        ...y,
        layoutId: YA(y)
      }, { isStatic: w } = T, C = DA(y), L = h(y, w);
      if (!w && typeof window < "u") {
        kA();
        const H = XA(T);
        b = H.MeasureLayout, C.visualElement = GA(i, L, T, c, H.ProjectionNode, f);
      }
      return _.jsxs(Kr.Provider, {
        value: C,
        children: [
          b && C.visualElement ? _.jsx(b, {
            visualElement: C.visualElement,
            ...T
          }) : null,
          NA(i, y, HA(L, C.visualElement, v), L, w, a, f)
        ]
      });
    }
    m.displayName = `motion.${typeof i == "string" ? i : `create(${i.displayName ?? i.name ?? ""})`}`;
    const p = q.forwardRef(m);
    return p[BA] = i, p;
  }
  function YA({ layoutId: i }) {
    const a = q.useContext(by).id;
    return a && i !== void 0 ? a + "-" + i : i;
  }
  function kA(i, a) {
    q.useContext(Zg).strict;
  }
  function XA(i) {
    const a = Pg(), { drag: s, layout: r } = a;
    if (!s && !r) return {};
    const c = {
      ...s,
      ...r
    };
    return {
      MeasureLayout: (s == null ? void 0 : s.isEnabled(i)) || (r == null ? void 0 : r.isEnabled(i)) ? c.MeasureLayout : void 0,
      ProjectionNode: c.ProjectionNode
    };
  }
  function KA(i, a) {
    if (typeof Proxy > "u") return Dc;
    const s = /* @__PURE__ */ new Map(), r = (f, h) => Dc(f, h, i, a), c = (f, h) => r(f, h);
    return new Proxy(c, {
      get: (f, h) => h === "create" ? r : (s.has(h) || s.set(h, Dc(h, void 0, i, a)), s.get(h))
    });
  }
  const QA = (i, a) => a.isSVG ?? Of(i) ? new DT(a) : new xT(a, {
    allowProjection: i !== q.Fragment
  });
  class ZA extends vi {
    constructor(a) {
      super(a), a.animationState || (a.animationState = OT(a));
    }
    updateAnimationControlsSubscription() {
      const { animate: a } = this.node.getProps();
      kr(a) && (this.unmountControls = a.subscribe(this.node));
    }
    mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      const { animate: a } = this.node.getProps(), { animate: s } = this.node.prevProps || {};
      a !== s && this.updateAnimationControlsSubscription();
    }
    unmount() {
      var _a;
      this.node.animationState.reset(), (_a = this.unmountControls) == null ? void 0 : _a.call(this);
    }
  }
  let PA = 0;
  class JA extends vi {
    constructor() {
      super(...arguments), this.id = PA++, this.isExitComplete = false;
    }
    update() {
      var _a;
      if (!this.node.presenceContext) return;
      const { isPresent: a, onExitComplete: s } = this.node.presenceContext, { isPresent: r } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || a === r) return;
      if (a && r === false) {
        if (this.isExitComplete) {
          const { initial: f, custom: h } = this.node.getProps();
          if (typeof f == "string") {
            const m = Qi(this.node, f, h);
            if (m) {
              const { transition: p, transitionEnd: y, ...v } = m;
              for (const b in v) (_a = this.node.getValue(b)) == null ? void 0 : _a.jump(v[b]);
            }
          }
          this.node.animationState.reset(), this.node.animationState.animateChanges();
        } else this.node.animationState.setActive("exit", false);
        this.isExitComplete = false;
        return;
      }
      const c = this.node.animationState.setActive("exit", !a);
      s && !a && c.then(() => {
        this.isExitComplete = true, s(this.id);
      });
    }
    mount() {
      const { register: a, onExitComplete: s } = this.node.presenceContext || {};
      s && s(this.id), a && (this.unmount = a(this.id));
    }
    unmount() {
    }
  }
  const FA = {
    animation: {
      Feature: ZA
    },
    exit: {
      Feature: JA
    }
  };
  function ts(i) {
    return {
      point: {
        x: i.pageX,
        y: i.pageY
      }
    };
  }
  const WA = (i) => (a) => _f(a) && i(a, ts(a));
  function Ql(i, a, s, r) {
    return Fl(i, a, WA(s), r);
  }
  const ev = ({ current: i }) => i ? i.ownerDocument.defaultView : null, iy = (i, a) => Math.abs(i - a);
  function $A(i, a) {
    const s = iy(i.x, a.x), r = iy(i.y, a.y);
    return Math.sqrt(s ** 2 + r ** 2);
  }
  const ay = /* @__PURE__ */ new Set([
    "auto",
    "scroll"
  ]);
  class nv {
    constructor(a, s, { transformPagePoint: r, contextWindow: c = window, dragSnapToOrigin: f = false, distanceThreshold: h = 3, element: m } = {}) {
      if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (w) => {
        this.handleScroll(w.target);
      }, this.onWindowScroll = () => {
        this.handleScroll(window);
      }, this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        this.lastRawMoveEventInfo && (this.lastMoveEventInfo = Ar(this.lastRawMoveEventInfo, this.transformPagePoint));
        const w = zc(this.lastMoveEventInfo, this.history), C = this.startEvent !== null, L = $A(w.offset, {
          x: 0,
          y: 0
        }) >= this.distanceThreshold;
        if (!C && !L) return;
        const { point: H } = w, { timestamp: B } = ye;
        this.history.push({
          ...H,
          timestamp: B
        });
        const { onStart: k, onMove: G } = this.handlers;
        C || (k && k(this.lastMoveEvent, w), this.startEvent = this.lastMoveEvent), G && G(this.lastMoveEvent, w);
      }, this.handlePointerMove = (w, C) => {
        this.lastMoveEvent = w, this.lastRawMoveEventInfo = C, this.lastMoveEventInfo = Ar(C, this.transformPagePoint), Lt.update(this.updatePoint, true);
      }, this.handlePointerUp = (w, C) => {
        this.end();
        const { onEnd: L, onSessionEnd: H, resumeAnimation: B } = this.handlers;
        if ((this.dragSnapToOrigin || !this.startEvent) && B && B(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        const k = zc(w.type === "pointercancel" ? this.lastMoveEventInfo : Ar(C, this.transformPagePoint), this.history);
        this.startEvent && L && L(w, k), H && H(w, k);
      }, !_f(a)) return;
      this.dragSnapToOrigin = f, this.handlers = s, this.transformPagePoint = r, this.distanceThreshold = h, this.contextWindow = c || window;
      const p = ts(a), y = Ar(p, this.transformPagePoint), { point: v } = y, { timestamp: b } = ye;
      this.history = [
        {
          ...v,
          timestamp: b
        }
      ];
      const { onSessionStart: T } = s;
      T && T(a, zc(y, this.history)), this.removeListeners = Wl(Ql(this.contextWindow, "pointermove", this.handlePointerMove), Ql(this.contextWindow, "pointerup", this.handlePointerUp), Ql(this.contextWindow, "pointercancel", this.handlePointerUp)), m && this.startScrollTracking(m);
    }
    startScrollTracking(a) {
      let s = a.parentElement;
      for (; s; ) {
        const r = getComputedStyle(s);
        (ay.has(r.overflowX) || ay.has(r.overflowY)) && this.scrollPositions.set(s, {
          x: s.scrollLeft,
          y: s.scrollTop
        }), s = s.parentElement;
      }
      this.scrollPositions.set(window, {
        x: window.scrollX,
        y: window.scrollY
      }), window.addEventListener("scroll", this.onElementScroll, {
        capture: true
      }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
        window.removeEventListener("scroll", this.onElementScroll, {
          capture: true
        }), window.removeEventListener("scroll", this.onWindowScroll);
      };
    }
    handleScroll(a) {
      const s = this.scrollPositions.get(a);
      if (!s) return;
      const r = a === window, c = r ? {
        x: window.scrollX,
        y: window.scrollY
      } : {
        x: a.scrollLeft,
        y: a.scrollTop
      }, f = {
        x: c.x - s.x,
        y: c.y - s.y
      };
      f.x === 0 && f.y === 0 || (r ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += f.x, this.lastMoveEventInfo.point.y += f.y) : this.history.length > 0 && (this.history[0].x -= f.x, this.history[0].y -= f.y), this.scrollPositions.set(a, c), Lt.update(this.updatePoint, true));
    }
    updateHandlers(a) {
      this.handlers = a;
    }
    end() {
      this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), gi(this.updatePoint);
    }
  }
  function Ar(i, a) {
    return a ? {
      point: a(i.point)
    } : i;
  }
  function ly(i, a) {
    return {
      x: i.x - a.x,
      y: i.y - a.y
    };
  }
  function zc({ point: i }, a) {
    return {
      point: i,
      delta: ly(i, iv(a)),
      offset: ly(i, IA(a)),
      velocity: t3(a, 0.1)
    };
  }
  function IA(i) {
    return i[0];
  }
  function iv(i) {
    return i[i.length - 1];
  }
  function t3(i, a) {
    if (i.length < 2) return {
      x: 0,
      y: 0
    };
    let s = i.length - 1, r = null;
    const c = iv(i);
    for (; s >= 0 && (r = i[s], !(c.timestamp - r.timestamp > ke(a))); ) s--;
    if (!r) return {
      x: 0,
      y: 0
    };
    r === i[0] && i.length > 2 && c.timestamp - r.timestamp > ke(a) * 2 && (r = i[1]);
    const f = en(c.timestamp - r.timestamp);
    if (f === 0) return {
      x: 0,
      y: 0
    };
    const h = {
      x: (c.x - r.x) / f,
      y: (c.y - r.y) / f
    };
    return h.x === 1 / 0 && (h.x = 0), h.y === 1 / 0 && (h.y = 0), h;
  }
  function e3(i, { min: a, max: s }, r) {
    return a !== void 0 && i < a ? i = r ? qt(a, i, r.min) : Math.max(i, a) : s !== void 0 && i > s && (i = r ? qt(s, i, r.max) : Math.min(i, s)), i;
  }
  function sy(i, a, s) {
    return {
      min: a !== void 0 ? i.min + a : void 0,
      max: s !== void 0 ? i.max + s - (i.max - i.min) : void 0
    };
  }
  function n3(i, { top: a, left: s, bottom: r, right: c }) {
    return {
      x: sy(i.x, s, c),
      y: sy(i.y, a, r)
    };
  }
  function ry(i, a) {
    let s = a.min - i.min, r = a.max - i.max;
    return a.max - a.min < i.max - i.min && ([s, r] = [
      r,
      s
    ]), {
      min: s,
      max: r
    };
  }
  function i3(i, a) {
    return {
      x: ry(i.x, a.x),
      y: ry(i.y, a.y)
    };
  }
  function a3(i, a) {
    let s = 0.5;
    const r = Ee(i), c = Ee(a);
    return c > r ? s = Zl(a.min, a.max - r, i.min) : r > c && (s = Zl(i.min, i.max - c, a.min)), xn(0, 1, s);
  }
  function l3(i, a) {
    const s = {};
    return a.min !== void 0 && (s.min = a.min - i.min), a.max !== void 0 && (s.max = a.max - i.min), s;
  }
  const ef = 0.35;
  function s3(i = ef) {
    return i === false ? i = 0 : i === true && (i = ef), {
      x: uy(i, "left", "right"),
      y: uy(i, "top", "bottom")
    };
  }
  function uy(i, a, s) {
    return {
      min: oy(i, a),
      max: oy(i, s)
    };
  }
  function oy(i, a) {
    return typeof i == "number" ? i : i[a] || 0;
  }
  const r3 = /* @__PURE__ */ new WeakMap();
  class u3 {
    constructor(a) {
      this.openDragLock = null, this.isDragging = false, this.currentDirection = null, this.originPoint = {
        x: 0,
        y: 0
      }, this.constraints = false, this.hasMutatedConstraints = false, this.elastic = le(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = a;
    }
    start(a, { snapToCursor: s = false, distanceThreshold: r } = {}) {
      const { presenceContext: c } = this.visualElement;
      if (c && c.isPresent === false) return;
      const f = (b) => {
        s && this.snapToCursor(ts(b).point), this.stopAnimation();
      }, h = (b, T) => {
        const { drag: w, dragPropagation: C, onDragStart: L } = this.getProps();
        if (w && !C && (this.openDragLock && this.openDragLock(), this.openDragLock = Gx(w), !this.openDragLock)) return;
        this.latestPointerEvent = b, this.latestPanInfo = T, this.isDragging = true, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = true, this.visualElement.projection.target = void 0), vn((B) => {
          let k = this.getAxisMotionValue(B).get() || 0;
          if (Sn.test(k)) {
            const { projection: G } = this.visualElement;
            if (G && G.layout) {
              const Q = G.layout.layoutBox[B];
              Q && (k = Ee(Q) * (parseFloat(k) / 100));
            }
          }
          this.originPoint[B] = k;
        }), L && Lt.update(() => L(b, T), false, true), Qc(this.visualElement, "transform");
        const { animationState: H } = this.visualElement;
        H && H.setActive("whileDrag", true);
      }, m = (b, T) => {
        this.latestPointerEvent = b, this.latestPanInfo = T;
        const { dragPropagation: w, dragDirectionLock: C, onDirectionLock: L, onDrag: H } = this.getProps();
        if (!w && !this.openDragLock) return;
        const { offset: B } = T;
        if (C && this.currentDirection === null) {
          this.currentDirection = c3(B), this.currentDirection !== null && L && L(this.currentDirection);
          return;
        }
        this.updateAxis("x", T.point, B), this.updateAxis("y", T.point, B), this.visualElement.render(), H && Lt.update(() => H(b, T), false, true);
      }, p = (b, T) => {
        this.latestPointerEvent = b, this.latestPanInfo = T, this.stop(b, T), this.latestPointerEvent = null, this.latestPanInfo = null;
      }, y = () => {
        const { dragSnapToOrigin: b } = this.getProps();
        (b || this.constraints) && this.startAnimation({
          x: 0,
          y: 0
        });
      }, { dragSnapToOrigin: v } = this.getProps();
      this.panSession = new nv(a, {
        onSessionStart: f,
        onStart: h,
        onMove: m,
        onSessionEnd: p,
        resumeAnimation: y
      }, {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: v,
        distanceThreshold: r,
        contextWindow: ev(this.visualElement),
        element: this.visualElement.current
      });
    }
    stop(a, s) {
      const r = a || this.latestPointerEvent, c = s || this.latestPanInfo, f = this.isDragging;
      if (this.cancel(), !f || !c || !r) return;
      const { velocity: h } = c;
      this.startAnimation(h);
      const { onDragEnd: m } = this.getProps();
      m && Lt.postRender(() => m(r, c));
    }
    cancel() {
      this.isDragging = false;
      const { projection: a, animationState: s } = this.visualElement;
      a && (a.isAnimationBlocked = false), this.endPanSession();
      const { dragPropagation: r } = this.getProps();
      !r && this.openDragLock && (this.openDragLock(), this.openDragLock = null), s && s.setActive("whileDrag", false);
    }
    endPanSession() {
      this.panSession && this.panSession.end(), this.panSession = void 0;
    }
    updateAxis(a, s, r) {
      const { drag: c } = this.getProps();
      if (!r || !Er(a, c, this.currentDirection)) return;
      const f = this.getAxisMotionValue(a);
      let h = this.originPoint[a] + r[a];
      this.constraints && this.constraints[a] && (h = e3(h, this.constraints[a], this.elastic[a])), f.set(h);
    }
    resolveConstraints() {
      var _a;
      const { dragConstraints: a, dragElastic: s } = this.getProps(), r = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : (_a = this.visualElement.projection) == null ? void 0 : _a.layout, c = this.constraints;
      a && Oa(a) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : a && r ? this.constraints = n3(r.layoutBox, a) : this.constraints = false, this.elastic = s3(s), c !== this.constraints && !Oa(a) && r && this.constraints && !this.hasMutatedConstraints && vn((f) => {
        this.constraints !== false && this.getAxisMotionValue(f) && (this.constraints[f] = l3(r.layoutBox[f], this.constraints[f]));
      });
    }
    resolveRefConstraints() {
      const { dragConstraints: a, onMeasureDragConstraints: s } = this.getProps();
      if (!a || !Oa(a)) return false;
      const r = a.current, { projection: c } = this.visualElement;
      if (!c || !c.layout) return false;
      const f = pT(r, c.root, this.visualElement.getTransformPagePoint());
      let h = i3(c.layout.layoutBox, f);
      if (s) {
        const m = s(hT(h));
        this.hasMutatedConstraints = !!m, m && (h = Eg(m));
      }
      return h;
    }
    startAnimation(a) {
      const { drag: s, dragMomentum: r, dragElastic: c, dragTransition: f, dragSnapToOrigin: h, onDragTransitionEnd: m } = this.getProps(), p = this.constraints || {}, y = vn((v) => {
        if (!Er(v, s, this.currentDirection)) return;
        let b = p && p[v] || {};
        (h === true || h === v) && (b = {
          min: 0,
          max: 0
        });
        const T = c ? 200 : 1e6, w = c ? 40 : 1e7, C = {
          type: "inertia",
          velocity: r ? a[v] : 0,
          bounceStiffness: T,
          bounceDamping: w,
          timeConstant: 750,
          restDelta: 1,
          restSpeed: 10,
          ...f,
          ...b
        };
        return this.startAxisValueAnimation(v, C);
      });
      return Promise.all(y).then(m);
    }
    startAxisValueAnimation(a, s) {
      const r = this.getAxisMotionValue(a);
      return Qc(this.visualElement, a), r.start(Sf(a, r, 0, s, this.visualElement, false));
    }
    stopAnimation() {
      vn((a) => this.getAxisMotionValue(a).stop());
    }
    getAxisMotionValue(a) {
      const s = `_drag${a.toUpperCase()}`, r = this.visualElement.getProps(), c = r[s];
      return c || this.visualElement.getValue(a, (r.initial ? r.initial[a] : void 0) || 0);
    }
    snapToCursor(a) {
      vn((s) => {
        const { drag: r } = this.getProps();
        if (!Er(s, r, this.currentDirection)) return;
        const { projection: c } = this.visualElement, f = this.getAxisMotionValue(s);
        if (c && c.layout) {
          const { min: h, max: m } = c.layout.layoutBox[s], p = f.get() || 0;
          f.set(a[s] - qt(h, m, 0.5) + p);
        }
      });
    }
    scalePositionWithinConstraints() {
      if (!this.visualElement.current) return;
      const { drag: a, dragConstraints: s } = this.getProps(), { projection: r } = this.visualElement;
      if (!Oa(s) || !r || !this.constraints) return;
      this.stopAnimation();
      const c = {
        x: 0,
        y: 0
      };
      vn((h) => {
        const m = this.getAxisMotionValue(h);
        if (m && this.constraints !== false) {
          const p = m.get();
          c[h] = a3({
            min: p,
            max: p
          }, this.constraints[h]);
        }
      });
      const { transformTemplate: f } = this.visualElement.getProps();
      this.visualElement.current.style.transform = f ? f({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.constraints = false, this.resolveConstraints(), vn((h) => {
        if (!Er(h, a, null)) return;
        const m = this.getAxisMotionValue(h), { min: p, max: y } = this.constraints[h];
        m.set(qt(p, y, c[h]));
      }), this.visualElement.render();
    }
    addListeners() {
      if (!this.visualElement.current) return;
      r3.set(this.visualElement, this);
      const a = this.visualElement.current, s = Ql(a, "pointerdown", (y) => {
        const { drag: v, dragListener: b = true } = this.getProps(), T = y.target, w = T !== a && Qx(T);
        v && b && !w && this.start(y);
      });
      let r;
      const c = () => {
        const { dragConstraints: y } = this.getProps();
        Oa(y) && y.current && (this.constraints = this.resolveRefConstraints(), r || (r = o3(a, y.current, () => this.scalePositionWithinConstraints())));
      }, { projection: f } = this.visualElement, h = f.addEventListener("measure", c);
      f && !f.layout && (f.root && f.root.updateScroll(), f.updateLayout()), Lt.read(c);
      const m = Fl(window, "resize", () => this.scalePositionWithinConstraints()), p = f.addEventListener("didUpdate", (({ delta: y, hasLayoutChanged: v }) => {
        this.isDragging && v && (vn((b) => {
          const T = this.getAxisMotionValue(b);
          T && (this.originPoint[b] += y[b].translate, T.set(T.get() + y[b].translate));
        }), this.visualElement.render());
      }));
      return () => {
        m(), s(), h(), p && p(), r && r();
      };
    }
    getProps() {
      const a = this.visualElement.getProps(), { drag: s = false, dragDirectionLock: r = false, dragPropagation: c = false, dragConstraints: f = false, dragElastic: h = ef, dragMomentum: m = true } = a;
      return {
        ...a,
        drag: s,
        dragDirectionLock: r,
        dragPropagation: c,
        dragConstraints: f,
        dragElastic: h,
        dragMomentum: m
      };
    }
  }
  function cy(i) {
    let a = true;
    return () => {
      if (a) {
        a = false;
        return;
      }
      i();
    };
  }
  function o3(i, a, s) {
    const r = b0(i, cy(s)), c = b0(a, cy(s));
    return () => {
      r(), c();
    };
  }
  function Er(i, a, s) {
    return (a === true || a === i) && (s === null || s === i);
  }
  function c3(i, a = 10) {
    let s = null;
    return Math.abs(i.y) > a ? s = "y" : Math.abs(i.x) > a && (s = "x"), s;
  }
  class f3 extends vi {
    constructor(a) {
      super(a), this.removeGroupControls = nn, this.removeListeners = nn, this.controls = new u3(a);
    }
    mount() {
      const { dragControls: a } = this.node.getProps();
      a && (this.removeGroupControls = a.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || nn;
    }
    update() {
      const { dragControls: a } = this.node.getProps(), { dragControls: s } = this.node.prevProps || {};
      a !== s && (this.removeGroupControls(), a && (this.removeGroupControls = a.subscribe(this.controls)));
    }
    unmount() {
      this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
    }
  }
  const Cc = (i) => (a, s) => {
    i && Lt.update(() => i(a, s), false, true);
  };
  class h3 extends vi {
    constructor() {
      super(...arguments), this.removePointerDownListener = nn;
    }
    onPointerDown(a) {
      this.session = new nv(a, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: ev(this.node)
      });
    }
    createPanHandlers() {
      const { onPanSessionStart: a, onPanStart: s, onPan: r, onPanEnd: c } = this.node.getProps();
      return {
        onSessionStart: Cc(a),
        onStart: Cc(s),
        onMove: Cc(r),
        onEnd: (f, h) => {
          delete this.session, c && Lt.postRender(() => c(f, h));
        }
      };
    }
    mount() {
      this.removePointerDownListener = Ql(this.node.current, "pointerdown", (a) => this.onPointerDown(a));
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      this.removePointerDownListener(), this.session && this.session.end();
    }
  }
  let wc = false;
  class d3 extends q.Component {
    componentDidMount() {
      const { visualElement: a, layoutGroup: s, switchLayoutGroup: r, layoutId: c } = this.props, { projection: f } = a;
      f && (s.group && s.group.add(f), r && r.register && c && r.register(f), wc && f.root.didUpdate(), f.addEventListener("animationComplete", () => {
        this.safeToRemove();
      }), f.setOptions({
        ...f.options,
        layoutDependency: this.props.layoutDependency,
        onExitComplete: () => this.safeToRemove()
      })), Or.hasEverUpdated = true;
    }
    getSnapshotBeforeUpdate(a) {
      const { layoutDependency: s, visualElement: r, drag: c, isPresent: f } = this.props, { projection: h } = r;
      return h && (h.isPresent = f, a.layoutDependency !== s && h.setOptions({
        ...h.options,
        layoutDependency: s
      }), wc = true, c || a.layoutDependency !== s || s === void 0 || a.isPresent !== f ? h.willUpdate() : this.safeToRemove(), a.isPresent !== f && (f ? h.promote() : h.relegate() || Lt.postRender(() => {
        const m = h.getStack();
        (!m || !m.members.length) && this.safeToRemove();
      }))), null;
    }
    componentDidUpdate() {
      const { visualElement: a, layoutAnchor: s } = this.props, { projection: r } = a;
      r && (r.options.layoutAnchor = s, r.root.didUpdate(), Ef.postRender(() => {
        !r.currentAnimation && r.isLead() && this.safeToRemove();
      }));
    }
    componentWillUnmount() {
      const { visualElement: a, layoutGroup: s, switchLayoutGroup: r } = this.props, { projection: c } = a;
      wc = true, c && (c.scheduleCheckAfterUnmount(), s && s.group && s.group.remove(c), r && r.deregister && r.deregister(c));
    }
    safeToRemove() {
      const { safeToRemove: a } = this.props;
      a && a();
    }
    render() {
      return null;
    }
  }
  function av(i) {
    const [a, s] = SA(), r = q.useContext(by);
    return _.jsx(d3, {
      ...i,
      layoutGroup: r,
      switchLayoutGroup: q.useContext(Ig),
      isPresent: a,
      safeToRemove: s
    });
  }
  const m3 = {
    pan: {
      Feature: h3
    },
    drag: {
      Feature: f3,
      ProjectionNode: Kg,
      MeasureLayout: av
    }
  };
  function fy(i, a, s) {
    const { props: r } = i;
    i.animationState && r.whileHover && i.animationState.setActive("whileHover", s === "Start");
    const c = "onHover" + s, f = r[c];
    f && Lt.postRender(() => f(a, ts(a)));
  }
  class p3 extends vi {
    mount() {
      const { current: a } = this.node;
      a && (this.unmount = Yx(a, (s, r) => (fy(this.node, r, "Start"), (c) => fy(this.node, c, "End"))));
    }
    unmount() {
    }
  }
  class y3 extends vi {
    constructor() {
      super(...arguments), this.isActive = false;
    }
    onFocus() {
      let a = false;
      try {
        a = this.node.current.matches(":focus-visible");
      } catch {
        a = true;
      }
      !a || !this.node.animationState || (this.node.animationState.setActive("whileFocus", true), this.isActive = true);
    }
    onBlur() {
      !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", false), this.isActive = false);
    }
    mount() {
      this.unmount = Wl(Fl(this.node.current, "focus", () => this.onFocus()), Fl(this.node.current, "blur", () => this.onBlur()));
    }
    unmount() {
    }
  }
  function hy(i, a, s) {
    const { props: r } = i;
    if (i.current instanceof HTMLButtonElement && i.current.disabled) return;
    i.animationState && r.whileTap && i.animationState.setActive("whileTap", s === "Start");
    const c = "onTap" + (s === "End" ? "" : s), f = r[c];
    f && Lt.postRender(() => f(a, ts(a)));
  }
  class g3 extends vi {
    mount() {
      const { current: a } = this.node;
      if (!a) return;
      const { globalTapTarget: s, propagate: r } = this.node.props;
      this.unmount = Px(a, (c, f) => (hy(this.node, f, "Start"), (h, { success: m }) => hy(this.node, h, m ? "End" : "Cancel")), {
        useGlobalTarget: s,
        stopPropagation: (r == null ? void 0 : r.tap) === false
      });
    }
    unmount() {
    }
  }
  const nf = /* @__PURE__ */ new WeakMap(), Rc = /* @__PURE__ */ new WeakMap(), v3 = (i) => {
    const a = nf.get(i.target);
    a && a(i);
  }, b3 = (i) => {
    i.forEach(v3);
  };
  function S3({ root: i, ...a }) {
    const s = i || document;
    Rc.has(s) || Rc.set(s, {});
    const r = Rc.get(s), c = JSON.stringify(a);
    return r[c] || (r[c] = new IntersectionObserver(b3, {
      root: i,
      ...a
    })), r[c];
  }
  function x3(i, a, s) {
    const r = S3(a);
    return nf.set(i, s), r.observe(i), () => {
      nf.delete(i), r.unobserve(i);
    };
  }
  const T3 = {
    some: 0,
    all: 1
  };
  class A3 extends vi {
    constructor() {
      super(...arguments), this.hasEnteredView = false, this.isInView = false;
    }
    startObserver() {
      var _a;
      (_a = this.stopObserver) == null ? void 0 : _a.call(this);
      const { viewport: a = {} } = this.node.getProps(), { root: s, margin: r, amount: c = "some", once: f } = a, h = {
        root: s ? s.current : void 0,
        rootMargin: r,
        threshold: typeof c == "number" ? c : T3[c]
      }, m = (p) => {
        const { isIntersecting: y } = p;
        if (this.isInView === y || (this.isInView = y, f && !y && this.hasEnteredView)) return;
        y && (this.hasEnteredView = true), this.node.animationState && this.node.animationState.setActive("whileInView", y);
        const { onViewportEnter: v, onViewportLeave: b } = this.node.getProps(), T = y ? v : b;
        T && T(p);
      };
      this.stopObserver = x3(this.node.current, h, m);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver > "u") return;
      const { props: a, prevProps: s } = this.node;
      [
        "amount",
        "margin",
        "root"
      ].some(E3(a, s)) && this.startObserver();
    }
    unmount() {
      var _a;
      (_a = this.stopObserver) == null ? void 0 : _a.call(this), this.hasEnteredView = false, this.isInView = false;
    }
  }
  function E3({ viewport: i = {} }, { viewport: a = {} } = {}) {
    return (s) => i[s] !== a[s];
  }
  const _3 = {
    inView: {
      Feature: A3
    },
    tap: {
      Feature: g3
    },
    focus: {
      Feature: y3
    },
    hover: {
      Feature: p3
    }
  }, M3 = {
    layout: {
      ProjectionNode: Kg,
      MeasureLayout: av
    }
  }, D3 = {
    ...FA,
    ..._3,
    ...m3,
    ...M3
  }, Na = KA(D3, QA), tn = ({ label: i, value: a, color: s = "emerald", alert: r = false, subValue: c = "" }) => _.jsxs("div", {
    className: `flex flex-col gap-1 p-3 bg-zinc-900 border ${r ? "border-red-500/50 animate-pulse" : "border-zinc-800"} rounded-lg transition-all duration-500`,
    children: [
      _.jsx("span", {
        className: "text-[10px] uppercase tracking-widest text-zinc-500 font-mono",
        children: i
      }),
      _.jsxs("div", {
        className: "flex items-baseline gap-2",
        children: [
          _.jsx("span", {
            className: `text-sm font-mono font-medium ${r ? "text-red-400" : `text-${s}-400`}`,
            children: a
          }),
          c && _.jsx("span", {
            className: "text-[8px] text-zinc-600 font-mono",
            children: c
          })
        ]
      })
    ]
  }), z3 = ({ data: i, color: a = "emerald" }) => _.jsxs("div", {
    className: "h-40 flex items-end gap-[1px] bg-black/40 p-4 border border-zinc-900 rounded-lg relative overflow-hidden",
    children: [
      _.jsx("div", {
        className: "absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"
      }),
      i.map((s, r) => _.jsx(Na.div, {
        initial: {
          height: 0
        },
        animate: {
          height: `${s}%`
        },
        className: `flex-1 ${a === "emerald" ? "bg-emerald-500/30" : "bg-red-500/30"} rounded-t-sm relative z-10`,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }, r))
    ]
  });
  function C3() {
    const [i, a] = q.useState(true), [s, r] = q.useState(12), [c, f] = q.useState(0.02), [h, m] = q.useState(0), [p, y] = q.useState("IDLE"), [v, b] = q.useState(null), [T, w] = q.useState(Array(60).fill(10)), [C, L] = q.useState(false), [H, B] = q.useState([]), [k, G] = q.useState({
      passed: 0,
      dropped: 0
    }), [Q, I] = q.useState(false), [ft, et] = q.useState(false), [nt, zt] = q.useState(1), [it, St] = q.useState(0), [At, oe] = q.useState([]), [Qt, kt] = q.useState({}), O = q.useRef(null), Y = q.useRef(null), K = q.useRef(null), lt = q.useRef([]), mt = q.useRef(null), [S, V] = q.useState(null);
    q.useEffect(() => {
      const Z = {
        arb: "arb_p99",
        op: "op_p99",
        base: "base_p99",
        zk: "zk_p99",
        mantle: "mantle_p99"
      }, ot = () => {
        fetch("https://rtt.phoenix-ai.work/api/public-feed").then((Mt) => Mt.json()).then((Mt) => {
          var _a;
          const $ = (_a = Mt.data) == null ? void 0 : _a[Mt.data.length - 1];
          if (!$) return;
          const Tt = {};
          for (const [Bt, _e] of Object.entries(Z)) Tt[Bt] = $[_e] ?? null;
          kt(Tt);
        }).catch(() => {
        });
      };
      ot();
      const dt = setInterval(ot, 6e4);
      return () => clearInterval(dt);
    }, []), q.useEffect(() => {
      if (i) return;
      const ot = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`, dt = new WebSocket(ot);
      return O.current = dt, dt.onmessage = async (Mt) => {
        try {
          const $ = JSON.parse(Mt.data);
          if ($.type === "PQC_INIT") {
            Vt("PQC_HANDSHAKE: \u041F\u043E\u043B\u0443\u0447\u0435\u043D PK (ML-KEM-768). \u0418\u043D\u043A\u0430\u043F\u0441\u0443\u043B\u044F\u0446\u0438\u044F...", "amber");
            const Tt = Uint8Array.from(atob($.pk), ($t) => $t.charCodeAt(0)), Bt = await h2(), [_e, fn] = await Bt.encap(Tt), be = await window.crypto.subtle.importKey("raw", fn, {
              name: "HMAC",
              hash: "SHA-256"
            }, false, [
              "sign"
            ]);
            Y.current = be;
            const Si = btoa(Array.from(_e, ($t) => String.fromCharCode($t)).join(""));
            dt.send(JSON.stringify({
              type: "PQC_RESP",
              ciphertext: Si
            }));
            return;
          }
          if ($.type === "PQC_ESTABLISHED") {
            et(true), Vt("PQC_SECURED: \u041A\u0432\u0430\u043D\u0442\u043E\u0432\u044B\u0439 \u0442\u0443\u043D\u043D\u0435\u043B\u044C \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D. \u041A\u043B\u044E\u0447 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.", "emerald");
            return;
          }
          if ($.type === "SILICON_THREAT") {
            const Tt = {
              type: $.threatType,
              ip: $.ip,
              t: $.t,
              details: JSON.stringify($.details)
            };
            oe((Bt) => [
              Tt,
              ...Bt
            ].slice(0, 8)), Vt(`\u26A1 \u0423\u0413\u0420\u041E\u0417\u0410 [${$.threatType}] IP:...${$.ip} \u2014 ${JSON.stringify($.details)}`, "red");
            return;
          }
          $.trustScore !== void 0 && zt($.trustScore), V($), $.filterStats && G($.filterStats), $.mode !== p && (y($.mode), m($.mode === "SNIPER" ? 100 : $.mode === "STRESS" ? 65 : 20), Vt(`\u0423\u0420\u041E\u0412\u0415\u041D\u042C_L0: \u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0432 \u0440\u0435\u0436\u0438\u043C ${$.mode}`, "emerald"));
        } catch ($) {
          console.error("WS Parse Error", $);
        }
      }, dt.onopen = () => Vt("WS_LINK: \u041A\u0430\u043D\u0430\u043B \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0442\u043A\u0440\u044B\u0442", "emerald"), dt.onerror = () => Vt("WS_ERR: \u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F. Fallback \u0430\u043A\u0442\u0438\u0432\u0435\u043D.", "red"), () => dt.close();
    }, [
      i,
      p
    ]);
    const X = [
      {
        id: "crypto",
        name: "Crypto_Wallet",
        desc: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u0438 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u0439",
        icon: Fp
      },
      {
        id: "ai",
        name: "Cognitive_Enclave",
        desc: "\u0418\u0437\u043E\u043B\u044F\u0446\u0438\u044F \u0418\u0418-\u043A\u043E\u043D\u0442\u0443\u0440\u0430",
        icon: A2
      },
      {
        id: "tunnel",
        name: "Dark_Tunnel",
        desc: "P2P PQC-\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435",
        icon: pc
      }
    ], J = () => {
      const Z = {};
      Z.gamut = window.matchMedia("(color-gamut: p3)").matches ? "p3" : "srgb", Z.contrast = window.matchMedia("(prefers-contrast: more)").matches ? "more" : "normal", Z.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "yes" : "no", Z.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const ot = [
        "Helvetica",
        "Arial",
        "Inter",
        "JetBrains Mono"
      ];
      Z.fonts = ot.filter((dt) => {
        const $ = document.createElement("canvas").getContext("2d");
        if (!$) return false;
        $.font = "72px serif";
        const Tt = $.measureText("mmmmmllllliiiii").width;
        return $.font = `72px "${dt}", serif`, $.measureText("mmmmmllllliiiii").width !== Tt;
      }).length;
      try {
        const dt = document.createElement("canvas"), Mt = dt.getContext("webgl") || dt.getContext("experimental-webgl");
        if (Mt) {
          const $ = Mt.getExtension("WEBGL_debug_renderer_info");
          $ ? Z.gpu = Mt.getParameter($.UNMASKED_RENDERER_WEBGL) : Z.gpu = "unknown (no extension)";
        } else Z.gpu = "unknown (no gl)";
      } catch {
        Z.gpu = "error";
      }
      return Z;
    }, [st, ht] = q.useState(false);
    q.useEffect(() => {
      typeof SharedArrayBuffer > "u" ? Vt("WARN: SharedArrayBuffer \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D. \u0422\u043E\u0447\u043D\u043E\u0441\u0442\u044C L6 \u0441\u043D\u0438\u0436\u0435\u043D\u0430.", "amber") : (mt.current = new SharedArrayBuffer(4), ht(true));
      const Z = new Worker(new URL("/assets/rhythmWorker-COClQ3OD.js", import.meta.url), {
        type: "module"
      });
      return K.current = Z, () => Z.terminate();
    }, []), q.useEffect(() => {
      if (!ft) return;
      let Z;
      return Z = setInterval(async () => {
        try {
          const dt = await fetch("/api/sync-pulse");
          if (!dt.ok) return;
          const Mt = await dt.json(), { pulse: $, driftAdjustment: Tt } = Mt;
          if (K.current) K.current.onmessage = async (Bt) => {
            if (Bt.data.type === "results") {
              lt.current = Bt.data.results;
              const _e = Bt.data.ramDna || [];
              await fetch("/api/verify-rhythm", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  timings: Bt.data.results,
                  ramSalt: _e
                })
              });
            }
          }, K.current.postMessage({
            type: "measure",
            delayUs: 1500 * Tt,
            iterations: $.length,
            pulse: $,
            sab: mt.current ?? void 0
          });
          else {
            const Bt = [];
            for (const _e of $) {
              const fn = performance.now(), be = Math.random() * 5 * Tt;
              await new Promise((Si) => setTimeout(Si, _e / 1e3 + be)), Bt.push((performance.now() - fn) * 1e3);
            }
            await fetch("/api/verify-rhythm", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                timings: Bt
              })
            });
          }
        } catch (dt) {
          console.error("Rhythm Sync Failed", dt);
        }
      }, 7e3), () => clearInterval(Z);
    }, [
      ft
    ]);
    const xt = async (Z) => {
      const ot = new TextEncoder();
      if (!Y.current) throw new Error("PQC_KEY_MISSING");
      const dt = Date.now() * 1e3, $ = (lt.current.length > 0 ? lt.current.slice(0, 8).map((be) => Math.floor(be)) : Array.from({
        length: 8
      }, () => Math.floor(Math.random() * 20))).join(","), Tt = ot.encode(`default${Z}${$}`), Bt = await window.crypto.subtle.sign("HMAC", Y.current, Tt), _e = Array.from(new Uint8Array(Bt)).map((be) => be.toString(16).padStart(2, "0")).join(""), fn = JSON.stringify({
        sig: _e,
        ts: dt,
        seq: Z
      });
      return {
        seal: btoa(fn),
        noise: $
      };
    }, ce = async (Z, ot, dt) => {
      Vt("ARGON2ID_CHALLENGE: \u041D\u0430\u0447\u0430\u043B\u043E \u0432\u044B\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0439 (Memory-Hard)...", "amber");
      const Mt = J();
      Vt(`STYLISTIC_FP: GPU=${Mt.gpu.slice(0, 20)}... Fonts=${Mt.fonts}`, "zinc");
      const $ = performance.now();
      try {
        const Tt = await argon2.hash({
          pass: Z,
          salt: "quantum_salt_3.2",
          time: dt,
          mem: ot,
          hashLen: 32,
          type: argon2.ArgonType.Argon2id
        }), Bt = performance.now() - $;
        return {
          hash: Tt.hashHex,
          calcTime: Bt,
          fp: Mt
        };
      } catch (Tt) {
        throw Vt("ERR: Argon2 OOM \u0438\u043B\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0439 \u0441\u0431\u043E\u0439.", "red"), Tt;
      }
    }, Xt = async (Z) => {
      Vt(`\u0418\u041D\u0422\u0415\u0420\u0420\u041E\u0413\u0410\u0426\u0418\u042F: \u0417\u0430\u043F\u0440\u043E\u0441 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A ${Z}...`, "zinc"), I(true);
      try {
        const ot = Z.toLowerCase().includes("enclave") ? "/api/enclave" : Z.toLowerCase().includes("wallet") ? "/api/wallet" : "/api/secure-asset", dt = it + 1, { seal: Mt, noise: $ } = await xt(dt);
        let Tt = await fetch(ot, {
          headers: {
            "x-silicon-dna-seal": Mt,
            "x-silicon-dna-noise": $
          }
        });
        if (Tt.status === 403) {
          if ((await Tt.json()).error === "ENTROPY_SEAL_INVALID") {
            Vt("ERR: \u041E\u0448\u0438\u0431\u043A\u0430 \u044D\u043D\u0442\u0440\u043E\u043F\u0438\u0439\u043D\u043E\u0433\u043E \u0441\u043B\u0435\u043F\u043A\u0430 (Replay/Forge).", "red");
            return;
          }
          Vt("L2_ACTIVE: \u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0435 Argon2id \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435.", "amber");
          const be = await (await fetch("/api/challenge")).json(), { hash: Si, calcTime: $t, fp: Qr } = await ce(be.target, be.m_cost, be.t_cost);
          if (Vt(`PHYSICAL_VERIFIED: \u0412\u044B\u0447\u0438\u0441\u043B\u0435\u043D\u043E \u0437\u0430 ${$t.toFixed(1)}\u043C\u0441.`, "emerald"), !(await fetch("/api/verify-pow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              hash: Si,
              calcTime: $t,
              m_cost: be.m_cost,
              t_cost: be.t_cost,
              fp: Qr
            })
          })).ok) throw new Error("POW_VERIFICATION_FAILED");
          Vt("POW_OK: \u0424\u0438\u0437\u0438\u043A\u0430 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430. \u041F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u043F\u043E\u043F\u044B\u0442\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430...", "zinc");
          const Ya = dt + 1, xi = await xt(Ya);
          if (Tt = await fetch(ot, {
            headers: {
              "x-silicon-dna-seal": xi.seal,
              "x-silicon-dna-noise": xi.noise
            }
          }), Tt.ok) {
            const Pr = await Tt.json();
            St(Ya), Vt(`\u0414\u041E\u0421\u0422\u0423\u041F_\u0420\u0410\u0417\u0420\u0415\u0428\u0415\u041D: DNA_SECURED: ${Pr.dna.slice(0, 16)}...`, "emerald");
          } else throw new Error(`RETRY_HTTP_${Tt.status}`);
          return;
        }
        if (!Tt.ok) throw new Error(`HTTP_${Tt.status}`);
        const Bt = await Tt.json();
        St(dt), Vt(`\u0414\u041E\u0421\u0422\u0423\u041F_\u0420\u0410\u0417\u0420\u0415\u0428\u0415\u041D: DNA_SECURED: ${Bt.dna.slice(0, 16)}...`, "emerald");
      } catch {
        Vt("ACCESS_TERMINATED: Sniper Drop! \u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u043E\u0434\u043F\u0438\u0441\u044C \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442.", "red");
      } finally {
        I(false);
      }
    }, bi = [
      {
        title: "L0_PROBE: Silicon DNA",
        status: "DONE",
        desc: "\u042D\u043A\u0441\u0442\u0440\u0430\u043A\u0446\u0438\u044F \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u0430 \u0442\u0430\u0439\u043C\u0438\u043D\u0433\u043E\u0432 \u0394phs."
      },
      {
        title: "L1_BRIDGE: Asset Shield",
        status: "ACTIVE",
        desc: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043A\u043E\u0448\u0435\u043B\u044C\u043A\u043E\u0432 \u0438 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0445 \u0418\u0418-\u0430\u0433\u0435\u043D\u0442\u043E\u0432 \u0447\u0435\u0440\u0435\u0437 \u043F\u0440\u043E\u043A\u0441\u0438-\u0444\u0438\u043B\u044C\u0442\u0440."
      },
      {
        title: "L2_HARDWARE: Physical Redoubt",
        status: "PLANNED",
        desc: "\u0412\u044B\u043D\u043E\u0441 \u0442\u043E\u0447\u043A\u0438 \u043F\u0440\u0438\u043D\u044F\u0442\u0438\u044F \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043D\u0430 \u0432\u043D\u0435\u0448\u043D\u0438\u0439 SBC (Orange Pi)."
      },
      {
        title: "P2P_MESH: Global Immunity",
        status: "PLANNED",
        desc: "\u0421\u0435\u0442\u044C \u0434\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0433\u043E \u043A\u0440\u0435\u043C\u043D\u0438\u044F \u0431\u0435\u0437 \u0443\u0447\u0430\u0441\u0442\u0438\u044F \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0445 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u043E\u0432."
      }
    ], Zi = [
      "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 LLVM/Clang \u0438 \u043B\u0438\u043D\u043A\u043E\u0432\u043A\u0430 bpf_helpers.",
      "\u041A\u043E\u043C\u043F\u0438\u043B\u044F\u0446\u0438\u044F l0_probe.c \u0432 \u0431\u0430\u0439\u0442\u043A\u043E\u0434: clang -O2 -target bpf.",
      "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0432 \u044F\u0434\u0440\u043E: bpftool prog load l0_probe.o /sys/fs/bpf/probe.",
      "\u041F\u0440\u0438\u0432\u044F\u0437\u043A\u0430 \u043A \u0445\u0443\u043A\u0443: bpftool net attach xdp id <ID_PROBE> dev eth0."
    ], Vt = (Z, ot = "zinc") => {
      const dt = (Date.now() / 1e3 % 100).toFixed(2);
      B((Mt) => [
        {
          t: dt,
          m: Z,
          type: ot
        },
        ...Mt
      ].slice(0, 15));
    };
    return q.useEffect(() => {
      const Z = setTimeout(() => {
        a(false), Vt("L0_PROBE: \u0421\u0432\u044F\u0437\u044C \u0441 \u044F\u0434\u0440\u043E\u043C \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430", "emerald"), Vt("\u0418\u041D\u0418\u0426\u0418\u0410\u041B\u0418\u0417\u0410\u0426\u0418\u042F \u041F\u0420\u041E\u0422\u041E\u041A\u041E\u041B\u0410 \u041A\u0410\u041B\u0418\u0411\u0420\u041E\u0412\u041A\u0418...", "zinc");
      }, 2e3);
      return () => clearTimeout(Z);
    }, []), q.useEffect(() => {
      if (i || p === "SNIPER" || S) return;
      const Z = setInterval(() => {
        m((ot) => ot >= 100 ? p === "IDLE" ? (Vt("\u042D\u0422\u0410\u041B\u041E\u041D \u041F\u041E\u041A\u041E\u042F \u0417\u0410\u0424\u0418\u041A\u0421\u0418\u0420\u041E\u0412\u0410\u041D. \u041F\u0415\u0420\u0415\u0425\u041E\u0414 \u041A \u0421\u0422\u0420\u0415\u0421\u0421-\u0422\u0415\u0421\u0422\u0423.", "emerald"), y("STRESS"), 0) : (p === "STRESS" && (Vt("\u041F\u0420\u041E\u0424\u0418\u041B\u042C \u041D\u0410\u0413\u0420\u0423\u0417\u041A\u0418 \u041F\u041E\u0414\u0422\u0412\u0415\u0420\u0416\u0414\u0415\u041D. \u0414\u041D\u041A \u041A\u0420\u0415\u041C\u041D\u0418\u042F \u041F\u041E\u041B\u0423\u0427\u0415\u041D\u0410.", "emerald"), y("SNIPER")), 100) : ot + 1.2), w((ot) => ot.map(() => {
          const dt = p === "IDLE" ? 20 : 40, Mt = p === "IDLE" ? 10 : 40;
          return Math.random() * Mt + dt;
        }));
      }, 200);
      return () => clearInterval(Z);
    }, [
      p,
      i
    ]), i ? _.jsx("div", {
      className: "min-h-screen bg-black flex items-center justify-center font-mono",
      children: _.jsxs(Na.div, {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        className: "flex flex-col items-center gap-4",
        children: [
          _.jsx(b2, {
            className: "w-12 h-12 text-emerald-500 animate-pulse"
          }),
          _.jsx("div", {
            className: "text-zinc-500 text-[10px] tracking-[0.3em] uppercase",
            children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430_Silicon_DNA_L0"
          })
        ]
      })
    }) : _.jsxs("div", {
      className: "min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-mono selection:bg-emerald-500 selection:text-black",
      children: [
        _.jsxs("header", {
          className: "max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-zinc-900 pb-8",
          children: [
            _.jsxs("div", {
              className: "flex flex-col",
              children: [
                _.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [
                    _.jsx("div", {
                      className: "p-2 bg-emerald-500/10 border border-emerald-500/20 rounded",
                      children: _.jsx(D2, {
                        className: "w-6 h-6 text-emerald-500"
                      })
                    }),
                    _.jsx("h1", {
                      className: "text-2xl font-black tracking-tighter text-white uppercase italic",
                      children: "Silicon_DNA"
                    })
                  ]
                }),
                _.jsx("p", {
                  className: "text-[9px] text-zinc-500 mt-1 uppercase tracking-[0.2em] font-bold",
                  children: "\u0424\u0438\u043B\u044C\u0442\u0440_\u0410\u0431\u0441\u043E\u043B\u044E\u0442\u043D\u043E\u0439_\u0420\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 // \u0417\u043E\u043D\u0434_L0"
                })
              ]
            }),
            _.jsxs("div", {
              className: "flex gap-4",
              children: [
                _.jsx(tn, {
                  label: "\u0420\u0435\u0436\u0438\u043C \u0423\u0437\u043B\u0430",
                  value: p === "IDLE" ? "\u041F\u041E\u041A\u041E\u0419" : p === "STRESS" ? "\u0421\u0422\u0420\u0415\u0421\u0421" : "\u0421\u041D\u0410\u0419\u041F\u0415\u0420",
                  color: p === "SNIPER" ? "emerald" : p === "STRESS" ? "red" : "amber",
                  subValue: p === "SNIPER" ? "\u0417\u0410\u0429\u0418\u0422\u0410_\u0410\u041A\u0422\u0418\u0412\u041D\u0410" : "\u0421\u0411\u041E\u0420_\u0414\u0410\u041D\u041D\u042B\u0425"
                }),
                _.jsx(tn, {
                  label: "\u042D\u043D\u0442\u0440\u043E\u043F\u0438\u044F (H)",
                  value: S ? S.entropy.toFixed(3) : (p === "IDLE" ? 0.82 : 0.94).toFixed(3),
                  color: "zinc",
                  subValue: "\u0411\u0438\u0442_\u0428\u0435\u043D\u043D\u043E\u043D\u0430"
                }),
                _.jsx(tn, {
                  label: "\u0410\u0432\u0442\u043E\u043A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u044F (R1)",
                  value: S ? S.autocorr.toFixed(3) : "0.450",
                  color: S && Math.abs(S.autocorr) < 0.1 ? "red" : "emerald",
                  subValue: "Memory_Signature"
                }),
                _.jsx(tn, {
                  label: "\u0422\u0435\u0440\u043C\u043E-\u041F\u0440\u043E\u0444\u0438\u043B\u044C",
                  value: S ? `${S.temp.toFixed(1)}\xB0C` : "42.0\xB0C",
                  color: S && S.temp > 70 ? "red" : "emerald",
                  subValue: S && S.temp > 70 ? "OVERHEAT" : "STABLE"
                }),
                _.jsx(tn, {
                  label: "\u0417\u0430\u0449\u0438\u0442\u0430 L1",
                  value: k.dropped > 0 ? "SHIELD_UP" : "STANDBY",
                  color: k.dropped > 0 ? "red" : "zinc"
                }),
                _.jsx(tn, {
                  label: "Quantum PQC",
                  value: ft ? "ML-KEM-768" : "INITIALIZING",
                  color: ft ? "emerald" : "zinc"
                }),
                _.jsx(tn, {
                  label: "Rhythm Trust",
                  value: `${(nt * 100).toFixed(1)}%`,
                  color: nt > 0.8 ? "emerald" : nt > 0.6 ? "amber" : "red"
                }),
                _.jsx(tn, {
                  label: "RAM DNA (Soft-PUF)",
                  value: st ? "ACTIVE (L6)" : "EMULATED",
                  color: st ? "cyan" : "amber"
                }),
                _.jsx(tn, {
                  label: "PQC Ratchet",
                  value: (S == null ? void 0 : S.keyRatchetCycles) ? `${S.keyRatchetCycles}` : "0",
                  color: "emerald",
                  subValue: "Key_Rotations"
                }),
                _.jsx(tn, {
                  label: "Active \u0414\u043E\u043F\u0440\u043E\u0441",
                  value: Q ? "INTERROGATING" : "IDLE",
                  color: Q ? "amber" : "zinc",
                  alert: Q
                }),
                _.jsx(tn, {
                  label: "\u041E\u0440\u0433\u0430\u043D\u0438\u043A / \u041F\u0440\u043E\u0448\u043B\u043E",
                  value: String(k.passed),
                  color: "emerald"
                }),
                _.jsx(tn, {
                  label: "\u0421\u0438\u043D\u0442\u0435\u0442\u0438\u043A / \u0423\u0431\u0438\u0442\u043E",
                  value: String(k.dropped),
                  color: "red",
                  alert: k.dropped > 0
                }),
                _.jsxs("div", {
                  className: "flex flex-col gap-1 p-3 bg-zinc-900 border border-zinc-800 rounded-lg min-w-[150px]",
                  children: [
                    _.jsx("span", {
                      className: "text-[10px] uppercase tracking-widest text-zinc-500 font-mono",
                      children: "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430"
                    }),
                    _.jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        _.jsx("div", {
                          className: "flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden",
                          children: _.jsx(Na.div, {
                            className: "h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                            initial: {
                              width: 0
                            },
                            animate: {
                              width: `${h}%`
                            }
                          })
                        }),
                        _.jsxs("span", {
                          className: "text-[10px] font-bold text-emerald-400",
                          children: [
                            h.toFixed(0),
                            "%"
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        _.jsxs("main", {
          className: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8",
          children: [
            _.jsxs("div", {
              className: "lg:col-span-4 space-y-6",
              children: [
                _.jsxs("section", {
                  className: "bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6",
                  children: [
                    _.jsxs("h2", {
                      className: "text-xs font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2",
                      children: [
                        _.jsx(x2, {
                          className: "w-4 h-4"
                        }),
                        " \u041A\u0440\u0435\u043C\u043D\u0438\u0435\u0432\u0430\u044F_\u0418\u0434\u0435\u043D\u0442\u0438\u0447\u043D\u043E\u0441\u0442\u044C_L0"
                      ]
                    }),
                    _.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        _.jsxs("div", {
                          className: "p-3 bg-black border border-zinc-800 rounded text-[10px] font-mono break-all leading-relaxed",
                          children: [
                            _.jsx("span", {
                              className: "text-zinc-500",
                              children: "DNA_\u0425\u0415\u0428:"
                            }),
                            _.jsx("br", {}),
                            S ? S.dnaHash : p === "SNIPER" ? "7f82b3d1c4e5a6b7c8d9e0f1a2b3c4d5e6f7g8h9" : "\u0413\u0415\u041D\u0415\u0420\u0410\u0426\u0418\u042F_\u041A\u041B\u042E\u0427\u0410..."
                          ]
                        }),
                        _.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            _.jsxs("div", {
                              className: "flex justify-between text-[9px] uppercase font-bold text-zinc-500",
                              children: [
                                _.jsx("span", {
                                  children: "\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0449\u0438\u043A\u0430"
                                }),
                                _.jsx("span", {
                                  className: "text-emerald-500",
                                  children: "\u0412\u044B\u0441\u043E\u043A\u0430\u044F"
                                })
                              ]
                            }),
                            _.jsxs("div", {
                              className: "flex justify-between text-[9px] uppercase font-bold text-zinc-500",
                              children: [
                                _.jsx("span", {
                                  children: "\u0410\u0444\u0444\u0438\u043D\u0438\u0442\u0438 IRQ-\u044F\u0434\u0435\u0440"
                                }),
                                _.jsx("span", {
                                  className: "text-zinc-300",
                                  children: "0, 4, 8, 12"
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    _.jsxs("div", {
                      className: "mt-8 pt-6 border-t border-zinc-800",
                      children: [
                        _.jsx("p", {
                          className: "text-[10px] text-zinc-500 italic mb-4 leading-relaxed",
                          children: "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442 \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0394phs = Tnapi - Tirq \u0434\u043B\u044F \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u043E\u0442 \u0441\u0438\u043D\u0442\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \xAB\u0441\u0433\u043B\u0430\u0436\u0438\u0432\u0430\u043D\u0438\u044F\xBB."
                        }),
                        _.jsx("button", {
                          type: "button",
                          disabled: p === "SNIPER",
                          onClick: () => y(p === "IDLE" ? "STRESS" : "IDLE"),
                          className: `w-full py-3 rounded font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${p === "STRESS" ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "bg-transparent border-zinc-800 text-zinc-400 hover:border-emerald-500 hover:text-emerald-500"}`,
                          children: p === "IDLE" ? "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C_\u0421\u0442\u0440\u0435\u0441\u0441-\u0422\u0435\u0441\u0442" : "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430_\u041F\u043E\u043A\u043E\u044F_\u0410\u043A\u0442\u0438\u0432\u043D\u0430"
                        })
                      ]
                    })
                  ]
                }),
                _.jsxs("div", {
                  className: "bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-xl",
                  children: [
                    _.jsxs("div", {
                      className: "flex items-center gap-2 mb-3 text-emerald-500",
                      children: [
                        _.jsx(Fp, {
                          className: "w-3 h-3"
                        }),
                        _.jsx("span", {
                          className: "text-[10px] font-black uppercase tracking-tighter",
                          children: "\u0411\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430_\u0417\u043E\u043B\u043E\u0442\u043E\u0433\u043E_\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430"
                        })
                      ]
                    }),
                    _.jsxs("p", {
                      className: "text-[10px] leading-relaxed text-zinc-400",
                      children: [
                        "\u0428\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0431\u0430\u0437\u043E\u0432\u043E\u0439 \u043B\u0438\u043D\u0438\u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u043E. \u041B\u044E\u0431\u043E\u0439 \u0442\u0440\u0430\u0444\u0438\u043A, \u0438\u043C\u0435\u044E\u0449\u0438\u0439 \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u043E \u043D\u0443\u043B\u0435\u0432\u043E\u0439 \u0434\u0436\u0438\u0442\u0442\u0435\u0440, \u0431\u0443\u0434\u0435\u0442 \u043F\u043E\u043C\u0435\u0447\u0435\u043D \u043A\u0430\u043A ",
                        _.jsx("span", {
                          className: "text-red-400 font-bold",
                          children: "\u0421\u0418\u041D\u0422\u0415\u0422\u0418\u0427\u0415\u0421\u041A\u041E\u0415_\u0421\u0413\u041B\u0410\u0416\u0418\u0412\u0410\u041D\u0418\u0415"
                        }),
                        " \u0438 \u043E\u0442\u0441\u0435\u0447\u0435\u043D XDP-\u0445\u0443\u043A\u043E\u043C."
                      ]
                    })
                  ]
                }),
                At.length > 0 && _.jsxs("section", {
                  className: "bg-red-950/30 border border-red-500/20 rounded-xl p-4",
                  children: [
                    _.jsxs("h2", {
                      className: "text-xs font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2",
                      children: [
                        _.jsx(w2, {
                          className: "w-4 h-4"
                        }),
                        " SILICON_THREAT_LOG"
                      ]
                    }),
                    _.jsx("div", {
                      className: "space-y-1.5 max-h-36 overflow-y-auto no-scrollbar",
                      children: At.map((Z, ot) => _.jsxs(Na.div, {
                        initial: {
                          opacity: 0,
                          x: -8
                        },
                        animate: {
                          opacity: 1,
                          x: 0
                        },
                        className: "flex gap-2 text-[9px] font-mono",
                        children: [
                          _.jsxs("span", {
                            className: "text-red-500 font-bold shrink-0",
                            children: [
                              "[",
                              Z.type,
                              "]"
                            ]
                          }),
                          _.jsxs("span", {
                            className: "text-zinc-500",
                            children: [
                              "IP:\u2026",
                              Z.ip
                            ]
                          }),
                          _.jsx("span", {
                            className: "text-zinc-600 truncate",
                            children: Z.details
                          })
                        ]
                      }, ot))
                    })
                  ]
                }),
                _.jsxs("section", {
                  className: "bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5",
                  children: [
                    _.jsxs("h2", {
                      className: "text-xs font-black uppercase tracking-widest text-cyan-500 mb-4 flex items-center gap-2",
                      children: [
                        _.jsx(pc, {
                          className: "w-4 h-4"
                        }),
                        " PHOENIX_ZERO \u2014 L2_SEQUENCER_HEALTH"
                      ]
                    }),
                    _.jsx("div", {
                      className: "space-y-2",
                      children: [
                        {
                          key: "arb",
                          label: "ARBITRUM",
                          safe: 400,
                          warn: 800
                        },
                        {
                          key: "op",
                          label: "OPTIMISM",
                          safe: 400,
                          warn: 800
                        },
                        {
                          key: "base",
                          label: "BASE",
                          safe: 1200,
                          warn: 2e3
                        },
                        {
                          key: "zk",
                          label: "ZKSYNC",
                          safe: 600,
                          warn: 1200
                        },
                        {
                          key: "mantle",
                          label: "MANTLE",
                          safe: 600,
                          warn: 1200
                        }
                      ].map(({ key: Z, label: ot, safe: dt, warn: Mt }) => {
                        const $ = Qt[Z], Tt = $ === null ? "zinc" : $ < dt ? "emerald" : $ < Mt ? "amber" : "red", Bt = $ === null ? "\u25CB" : ($ < dt, "\u25CF");
                        return _.jsxs("div", {
                          className: "flex items-center justify-between text-[10px] font-mono",
                          children: [
                            _.jsx("span", {
                              className: "text-zinc-500 w-16",
                              children: ot
                            }),
                            _.jsx("span", {
                              className: `text-${Tt}-400 font-bold`,
                              children: $ !== null ? `${$.toFixed(0)}ms` : "\u2014"
                            }),
                            _.jsxs("span", {
                              className: `text-${Tt}-500 text-[8px]`,
                              children: [
                                Bt,
                                " ",
                                $ === null ? "PENDING" : $ < dt ? "SAFE" : $ < Mt ? "SLOW" : "CONGESTED"
                              ]
                            })
                          ]
                        }, Z);
                      })
                    }),
                    _.jsx("div", {
                      className: "mt-3 pt-3 border-t border-zinc-800 text-[9px] text-zinc-600 font-mono",
                      children: "2s probes \xB7 DO_NYC1 \xB7 60s refresh"
                    })
                  ]
                }),
                _.jsxs("section", {
                  className: "bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6",
                  children: [
                    _.jsxs("h2", {
                      className: "text-xs font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2",
                      children: [
                        _.jsx($p, {
                          className: "w-4 h-4"
                        }),
                        " L1_BRIDGE_ORCHESTRATOR"
                      ]
                    }),
                    _.jsx("div", {
                      className: "space-y-3",
                      children: X.map((Z) => _.jsxs("div", {
                        className: "relative group",
                        children: [
                          _.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              b(Z.id), Vt(`\u0428\u041B\u042E\u0417_L1: \u0417\u0430\u0449\u0438\u0442\u0430 ${Z.name} \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430`, "emerald");
                            },
                            className: `w-full p-4 rounded-lg border transition-all text-left flex items-start gap-4 ${v === Z.id ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-black/40 border-zinc-800 hover:border-zinc-700"}`,
                            children: [
                              _.jsx(Z.icon, {
                                className: `w-5 h-5 mt-1 ${v === Z.id ? "text-emerald-500" : "text-zinc-600"}`
                              }),
                              _.jsxs("div", {
                                children: [
                                  _.jsx("div", {
                                    className: `text-[10px] font-black uppercase tracking-tighter ${v === Z.id ? "text-white" : "text-zinc-500"}`,
                                    children: Z.name
                                  }),
                                  _.jsx("div", {
                                    className: "text-[9px] text-zinc-600 uppercase mt-0.5",
                                    children: Z.desc
                                  })
                                ]
                              })
                            ]
                          }),
                          v === Z.id && _.jsx(Na.button, {
                            initial: {
                              opacity: 0,
                              x: -10
                            },
                            animate: {
                              opacity: 1,
                              x: 0
                            },
                            onClick: () => Xt(Z.name),
                            className: "absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-black rounded text-[8px] font-black uppercase hover:bg-white transition-colors",
                            children: "Interrogate"
                          })
                        ]
                      }, Z.id))
                    })
                  ]
                })
              ]
            }),
            _.jsxs("div", {
              className: "lg:col-span-8 space-y-6",
              children: [
                _.jsxs("div", {
                  className: "flex gap-4",
                  children: [
                    _.jsx("button", {
                      type: "button",
                      onClick: () => L(false),
                      className: `flex-1 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${C ? "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700" : "bg-emerald-500 text-black border-emerald-500"}`,
                      children: "Live_Telemetry"
                    }),
                    _.jsx("button", {
                      type: "button",
                      onClick: () => L(true),
                      className: `flex-1 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${C ? "bg-emerald-500 text-black border-emerald-500" : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700"}`,
                      children: "Project_Manifest_&_Roadmap"
                    })
                  ]
                }),
                C ? _.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                  children: [
                    _.jsxs("section", {
                      className: "bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6",
                      children: [
                        _.jsxs("h2", {
                          className: "text-xs font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2",
                          children: [
                            _.jsx(Wp, {
                              className: "w-4 h-4"
                            }),
                            " Silicon_DNA_Roadmap"
                          ]
                        }),
                        _.jsx("div", {
                          className: "space-y-6",
                          children: bi.map((Z, ot) => _.jsxs("div", {
                            className: `relative pl-6 border-l ${Z.status === "DONE" ? "border-emerald-500" : Z.status === "ACTIVE" ? "border-emerald-500 border-dashed animate-pulse" : "border-zinc-800"}`,
                            children: [
                              _.jsx("div", {
                                className: `absolute -left-1.5 top-0 w-3 h-3 rounded-full border-2 bg-black ${Z.status === "DONE" ? "border-emerald-500 bg-emerald-500" : "border-zinc-800"}`
                              }),
                              _.jsx("div", {
                                className: "text-[10px] font-black text-white uppercase",
                                children: Z.title
                              }),
                              _.jsx("div", {
                                className: "text-[9px] text-zinc-500 mt-1 leading-relaxed",
                                children: Z.desc
                              })
                            ]
                          }, ot))
                        })
                      ]
                    }),
                    _.jsxs("section", {
                      className: "bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6",
                      children: [
                        _.jsxs("h2", {
                          className: "text-xs font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2",
                          children: [
                            _.jsx($p, {
                              className: "w-4 h-4"
                            }),
                            " Deployment_Protocol"
                          ]
                        }),
                        _.jsxs("div", {
                          className: "space-y-4",
                          children: [
                            Zi.map((Z, ot) => _.jsxs("div", {
                              className: "flex gap-4",
                              children: [
                                _.jsxs("span", {
                                  className: "text-emerald-500 font-mono text-[10px] font-bold",
                                  children: [
                                    ot + 1,
                                    "."
                                  ]
                                }),
                                _.jsx("p", {
                                  className: "text-[10px] text-zinc-400 leading-relaxed font-mono",
                                  children: Z
                                })
                              ]
                            }, ot)),
                            _.jsxs("div", {
                              className: "mt-6 p-4 bg-black border border-red-500/20 rounded-lg",
                              children: [
                                _.jsx("p", {
                                  className: "text-[9px] text-red-400 font-bold uppercase mb-2 animate-pulse underline",
                                  children: "\u0412\u041D\u0418\u041C\u0410\u041D\u0418\u0415:"
                                }),
                                _.jsx("p", {
                                  className: "text-[9px] text-zinc-500 leading-tight",
                                  children: "\u0420\u0430\u0437\u0432\u0435\u0440\u0442\u044B\u0432\u0430\u043D\u0438\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Ring-0 \u0434\u043E\u0441\u0442\u0443\u043F\u0430. \u041E\u0421 \u043C\u043E\u0436\u0435\u0442 \u043A\u043B\u0430\u0441\u0441\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0437\u043E\u043D\u0434 \u043A\u0430\u043A \u0440\u0443\u0442\u043A\u0438\u0442. \u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0440\u0443\u0447\u043D\u043E\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 BPF-\u0431\u0430\u0439\u0442\u043A\u043E\u0434\u0430."
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    _.jsxs("section", {
                      className: "md:col-span-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-8",
                      children: [
                        _.jsx("h2", {
                          className: "text-xs font-black uppercase tracking-widest text-emerald-500 mb-4",
                          children: "\u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u041C\u0430\u043D\u0438\u0444\u0435\u0441\u0442"
                        }),
                        _.jsx("p", {
                          className: "text-xs text-zinc-400 leading-loose italic",
                          children: '"Silicon DNA \u043E\u043F\u0438\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u043D\u0435\u043E\u0441\u043F\u043E\u0440\u0438\u043C\u0443\u044E \u0444\u0438\u0437\u0438\u043A\u0443: \u0442\u0435\u0440\u043C\u043E\u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0448\u0443\u043C \u0438 \u0434\u0436\u0438\u0442\u0442\u0435\u0440 \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0449\u0438\u043A\u0430. \u0412 \u043C\u0438\u0440\u0435, \u0433\u0434\u0435 \u043B\u044E\u0431\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0441\u0438\u043D\u0442\u0435\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u0418\u0418, \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u043C \u0434\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E\u043C \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u043E\u0441\u0442\u0430\u0435\u0442\u0441\u044F \u043D\u0435\u0441\u043E\u0432\u0435\u0440\u0448\u0435\u043D\u0441\u0442\u0432\u043E \u0430\u043F\u043F\u0430\u0440\u0430\u0442\u043D\u043E\u0433\u043E \u043E\u0442\u0432\u0435\u0442\u0430. \u041C\u044B \u043D\u0435 \u0437\u0430\u0449\u0438\u0449\u0430\u0435\u043C \u0434\u0430\u043D\u043D\u044B\u0435. \u041C\u044B \u0437\u0430\u0449\u0438\u0449\u0430\u0435\u043C \u043F\u0440\u0430\u0432\u043E \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0431\u044B\u0442\u044C \u043D\u0435\u0441\u043E\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u043E\u0439 \u0438, \u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E, \u0436\u0438\u0432\u043E\u0439."'
                        })
                      ]
                    })
                  ]
                }) : _.jsxs("section", {
                  className: "bg-zinc-950 border border-zinc-800 rounded-xl p-8 relative overflow-hidden flex flex-col min-h-[600px]",
                  children: [
                    _.jsxs("div", {
                      className: "flex items-center justify-between mb-8 relative z-10 font-mono",
                      children: [
                        _.jsxs("div", {
                          className: "flex flex-col",
                          children: [
                            _.jsx("h3", {
                              className: "text-xs font-black text-white uppercase tracking-[0.3em]",
                              children: "\u041C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u044F \u0394phs"
                            }),
                            _.jsxs("span", {
                              className: "text-[9px] text-zinc-600 uppercase",
                              children: [
                                "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435: ",
                                p === "IDLE" ? "\u041F\u043E\u043A\u043E\u0439" : p === "STRESS" ? "\u041D\u0430\u0441\u044B\u0449\u0435\u043D\u0438\u0435_\u042F\u0434\u0440\u0430" : "\u0421\u043D\u0430\u0439\u043F\u0435\u0440\u0441\u043A\u0438\u0439_\u0424\u0438\u043B\u044C\u0442\u0440_\u0410\u043A\u0442\u0438\u0432\u0435\u043D"
                              ]
                            })
                          ]
                        }),
                        _.jsx("div", {
                          className: "text-[9px] font-bold text-zinc-700 uppercase",
                          children: "\u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435: 1.0\u043D\u0441"
                        })
                      ]
                    }),
                    _.jsxs("div", {
                      className: "flex-1 relative z-10 flex flex-col gap-8",
                      children: [
                        _.jsx(z3, {
                          data: (S == null ? void 0 : S.histogram) || T,
                          color: p === "STRESS" ? "red" : "emerald"
                        }),
                        _.jsxs("div", {
                          className: "grid grid-cols-2 md:grid-cols-5 gap-6 pt-4 border-t border-zinc-900",
                          children: [
                            _.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                _.jsx("span", {
                                  className: "text-[8px] uppercase text-zinc-600 tracking-widest font-bold",
                                  children: "\u0421\u0440\u0435\u0434\u043D\u0435\u0435 \u0394\u043D\u0441"
                                }),
                                _.jsx("div", {
                                  className: "text-sm font-mono text-white tracking-tighter",
                                  children: S ? S.mean.toFixed(1) : (p === "IDLE" ? 42.1 : 58.9).toFixed(1)
                                })
                              ]
                            }),
                            _.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                _.jsx("span", {
                                  className: "text-[8px] uppercase text-zinc-600 tracking-widest font-bold",
                                  children: "\u0414\u0438\u0441\u043F\u0435\u0440\u0441\u0438\u044F (\u03C3\xB2)"
                                }),
                                _.jsx("div", {
                                  className: "text-sm font-mono text-white tracking-tighter",
                                  children: S ? S.variance.toFixed(2) : (p === "IDLE" ? 0.04 : 4.12).toFixed(2)
                                })
                              ]
                            }),
                            _.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                _.jsx("span", {
                                  className: "text-[8px] uppercase text-zinc-600 tracking-widest font-bold",
                                  children: "\u041A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u044F_R(1)"
                                }),
                                _.jsx("div", {
                                  className: `text-sm font-mono tracking-tighter ${S && Math.abs(S.autocorr) < 0.1 ? "text-red-400" : "text-emerald-400"}`,
                                  children: S ? S.autocorr.toFixed(3) : "0.452"
                                })
                              ]
                            }),
                            _.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                _.jsx("span", {
                                  className: "text-[8px] uppercase text-zinc-600 tracking-widest font-bold",
                                  children: "\u041F\u043E\u0440\u043E\u0433 \u0422\u043E\u043A\u0441\u0438\u0447\u043D\u043E\u0441\u0442\u0438"
                                }),
                                _.jsx("div", {
                                  className: "text-sm font-mono text-emerald-500 tracking-tighter",
                                  children: "< 0.12\u043D\u0441"
                                })
                              ]
                            }),
                            _.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                _.jsx("span", {
                                  className: "text-[8px] uppercase text-zinc-600 tracking-widest font-bold",
                                  children: "\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u0416\u0438\u0437\u043D\u0438"
                                }),
                                _.jsxs("div", {
                                  className: `text-sm font-mono tracking-tighter ${S && S.pol > 90 ? "text-emerald-400" : "text-red-400"}`,
                                  children: [
                                    S ? S.pol.toFixed(1) : p === "SNIPER" ? "99.8" : "0.0",
                                    "%"
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    _.jsxs("div", {
                      className: "mt-12 pt-6 border-t border-zinc-900 flex flex-col gap-4 relative z-10",
                      children: [
                        _.jsxs("div", {
                          className: "flex justify-between items-center text-[10px]",
                          children: [
                            _.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                _.jsx(Wp, {
                                  className: "w-3 h-4 text-emerald-500"
                                }),
                                _.jsx("span", {
                                  className: "text-zinc-500 uppercase font-black",
                                  children: "\u041F\u043E\u0442\u043E\u043A_\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438"
                                })
                              ]
                            }),
                            _.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                _.jsx("div", {
                                  className: "w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"
                                }),
                                _.jsx("span", {
                                  className: "text-zinc-700 uppercase italic",
                                  children: "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043F\u0440\u0435\u0440\u044B\u0432\u0430\u043D\u0438\u0439..."
                                })
                              ]
                            })
                          ]
                        }),
                        _.jsx("div", {
                          className: "h-28 overflow-y-auto no-scrollbar space-y-1 font-mono text-[9px]",
                          children: H.map((Z, ot) => _.jsxs(Na.div, {
                            initial: {
                              x: -5,
                              opacity: 0
                            },
                            animate: {
                              x: 0,
                              opacity: 1
                            },
                            className: "flex gap-4",
                            children: [
                              _.jsxs("span", {
                                className: "text-zinc-700",
                                children: [
                                  "[",
                                  Z.t,
                                  "]"
                                ]
                              }),
                              _.jsx("span", {
                                className: `text-${Z.type}-500/80`,
                                children: Z.m
                              })
                            ]
                          }, ot))
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        _.jsxs("footer", {
          className: "max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-30",
          children: [
            _.jsxs("div", {
              className: "flex gap-4 items-center",
              children: [
                _.jsx(pc, {
                  className: "w-3 h-3"
                }),
                _.jsx("span", {
                  className: "text-[9px] uppercase tracking-widest font-bold",
                  children: "Silicon DNA // \u041F\u0440\u043E\u0442\u043E\u043A\u043E\u043B \u0410\u0431\u0441\u043E\u043B\u044E\u0442\u043D\u043E\u0433\u043E \u0414\u043E\u0432\u0435\u0440\u0438\u044F"
                })
              ]
            }),
            _.jsx("span", {
              className: "text-[9px] font-mono",
              children: "96\u0413\u0411_EPYC_THD // PQC_\u0413\u041E\u0422\u041E\u0412"
            })
          ]
        })
      ]
    });
  }
  Ob.createRoot(document.getElementById("root")).render(_.jsx(q.StrictMode, {
    children: _.jsx(C3, {})
  }));
})();
