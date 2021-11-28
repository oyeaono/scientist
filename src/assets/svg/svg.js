/* 退出程序 */
!(function (e) {
  var t,
    n,
    o,
    i,
    d,
    c =
      '<svg><symbol id="icon-shut-down" viewBox="0 0 1024 1024"><path d="M237.497 192.997L831.13 786.63l-45.354 45.353-593.631-593.631z" ></path><path d="M831.92 237.58L236.732 832.767l-45.353-45.353 595.187-595.187z" ></path></symbol></svg>',
    l = (l = document.getElementsByTagName("script"))[
      l.length - 1
    ].getAttribute("data-injectcss"),
    a = function (e, t) {
      t.parentNode.insertBefore(e, t);
    };
  if (l && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  function s() {
    d || ((d = !0), o());
  }
  function r() {
    try {
      i.documentElement.doScroll("left");
    } catch (e) {
      return void setTimeout(r, 50);
    }
    s();
  }
  (t = function () {
    var e, t;
    ((t = document.createElement("div")).innerHTML = c),
      (c = null),
      (e = t.getElementsByTagName("svg")[0]) &&
        (e.setAttribute("aria-hidden", "true"),
        (e.style.position = "absolute"),
        (e.style.width = 0),
        (e.style.height = 0),
        (e.style.overflow = "hidden"),
        (t = e),
        (e = document.body).firstChild ? a(t, e.firstChild) : e.appendChild(t));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function () {
            document.removeEventListener("DOMContentLoaded", n, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", n, !1))
      : document.attachEvent &&
        ((o = t),
        (i = e.document),
        (d = !1),
        r(),
        (i.onreadystatechange = function () {
          "complete" == i.readyState && ((i.onreadystatechange = null), s());
        }));
})(window);
/* 最小化窗口 */
!(function (e) {
  var t,
    n,
    o,
    i,
    d,
    c =
      '<svg><symbol id="icon-minimize" viewBox="0 0 1024 1024"><path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z" ></path></symbol></svg>',
    l = (l = document.getElementsByTagName("script"))[
      l.length - 1
    ].getAttribute("data-injectcss"),
    a = function (e, t) {
      t.parentNode.insertBefore(e, t);
    };
  if (l && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  function s() {
    d || ((d = !0), o());
  }
  function r() {
    try {
      i.documentElement.doScroll("left");
    } catch (e) {
      return void setTimeout(r, 50);
    }
    s();
  }
  (t = function () {
    var e, t;
    ((t = document.createElement("div")).innerHTML = c),
      (c = null),
      (e = t.getElementsByTagName("svg")[0]) &&
        (e.setAttribute("aria-hidden", "true"),
        (e.style.position = "absolute"),
        (e.style.width = 0),
        (e.style.height = 0),
        (e.style.overflow = "hidden"),
        (t = e),
        (e = document.body).firstChild ? a(t, e.firstChild) : e.appendChild(t));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function () {
            document.removeEventListener("DOMContentLoaded", n, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", n, !1))
      : document.attachEvent &&
        ((o = t),
        (i = e.document),
        (d = !1),
        r(),
        (i.onreadystatechange = function () {
          "complete" == i.readyState && ((i.onreadystatechange = null), s());
        }));
})(window);
/* 最大化窗口 */
!(function (e) {
  var t,
    n,
    o,
    a,
    i,
    d =
      '<svg><symbol id="icon-maximize" viewBox="0 0 1024 1024"><path d="M862.531368 786.324211v-139.37179a53.894737 53.894737 0 1 1 107.789474 0v269.473684a53.894737 53.894737 0 0 1-53.894737 53.894737h-269.473684a53.894737 53.894737 0 1 1 0-107.789474h139.37179l-197.093053-197.093052a53.894737 53.894737 0 0 1 76.207158-76.207158l197.093052 197.093053z m0-602.327579l-197.093052 197.093052a53.894737 53.894737 0 1 1-76.207158-76.207158L786.324211 107.789474h-139.37179a53.894737 53.894737 0 1 1 0-107.789474h269.473684a53.894737 53.894737 0 0 1 53.894737 53.894737v269.473684a53.894737 53.894737 0 0 1-107.789474 0V183.996632zM107.789474 786.324211l197.093052-197.093053a53.894737 53.894737 0 1 1 76.207158 76.207158l-197.093052 197.093052H323.368421a53.894737 53.894737 0 0 1 0 107.789474H53.894737a53.894737 53.894737 0 0 1-53.894737-53.894737v-269.473684a53.894737 53.894737 0 0 1 107.789474 0v139.37179zM107.789474 183.996632V323.368421a53.894737 53.894737 0 1 1-107.789474 0V53.894737a53.894737 53.894737 0 0 1 53.894737-53.894737h269.473684a53.894737 53.894737 0 1 1 0 107.789474H183.996632l197.093052 197.093052A53.894737 53.894737 0 0 1 304.882526 381.035789L107.789474 183.996632z"  ></path></symbol></svg>',
    c = (c = document.getElementsByTagName("script"))[
      c.length - 1
    ].getAttribute("data-injectcss"),
    l = function (e, t) {
      t.parentNode.insertBefore(e, t);
    };
  if (c && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  function s() {
    i || ((i = !0), o());
  }
  function r() {
    try {
      a.documentElement.doScroll("left");
    } catch (e) {
      return void setTimeout(r, 50);
    }
    s();
  }
  (t = function () {
    var e, t;
    ((t = document.createElement("div")).innerHTML = d),
      (d = null),
      (e = t.getElementsByTagName("svg")[0]) &&
        (e.setAttribute("aria-hidden", "true"),
        (e.style.position = "absolute"),
        (e.style.width = 0),
        (e.style.height = 0),
        (e.style.overflow = "hidden"),
        (t = e),
        (e = document.body).firstChild ? l(t, e.firstChild) : e.appendChild(t));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function () {
            document.removeEventListener("DOMContentLoaded", n, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", n, !1))
      : document.attachEvent &&
        ((o = t),
        (a = e.document),
        (i = !1),
        r(),
        (a.onreadystatechange = function () {
          "complete" == a.readyState && ((a.onreadystatechange = null), s());
        }));
})(window);
/* 悬浮球开始 */
!(function (e) {
  var t,
    n,
    o,
    i,
    c,
    d =
      '<svg><symbol id="icon-stop-task" viewBox="0 0 1024 1024"><path d="M856 208.7v606.6c0 26.5-21.5 48-48 48H216c-26.5 0-48-21.5-48-48V208.7c0-26.5 21.5-48 48-48h592c26.5 0 48 21.5 48 48z"  ></path></symbol></svg>',
    l = (l = document.getElementsByTagName("script"))[
      l.length - 1
    ].getAttribute("data-injectcss"),
    s = function (e, t) {
      t.parentNode.insertBefore(e, t);
    };
  if (l && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:24px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  function a() {
    c || ((c = !0), o());
  }
  function r() {
    try {
      i.documentElement.doScroll("left");
    } catch (e) {
      return void setTimeout(r, 50);
    }
    a();
  }
  (t = function () {
    var e, t;
    ((t = document.createElement("div")).innerHTML = d),
      (d = null),
      (e = t.getElementsByTagName("svg")[0]) &&
        (e.setAttribute("aria-hidden", "true"),
        (e.style.position = "absolute"),
        (e.style.width = 0),
        (e.style.height = 0),
        (e.style.overflow = "hidden"),
        (t = e),
        (e = document.body).firstChild ? s(t, e.firstChild) : e.appendChild(t));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function () {
            document.removeEventListener("DOMContentLoaded", n, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", n, !1))
      : document.attachEvent &&
        ((o = t),
        (i = e.document),
        (c = !1),
        r(),
        (i.onreadystatechange = function () {
          "complete" == i.readyState && ((i.onreadystatechange = null), a());
        }));
})(window);
