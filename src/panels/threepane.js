// A three-pane system of page interaction. The left 33% turns backwards, the
// right 33% turns forwards, and contact on the middle third causes the
// system to go into "control mode". In this mode, show additional control
// such as scrubber
//
Monocle.Panels.ThreePane = function (flipper, evtCallbacks) {

  var API = { constructor: Monocle.Panels.IMode }
  var k = API.constants = API.constructor;
  var p = API.properties = {}


  function initialize() {
    p.showControl = false;
    p.flipper = flipper;
    p.reader = flipper.properties.reader;
    p.panels = {
      forwards: new Monocle.Controls.Panel(),
      backwards: new Monocle.Controls.Panel()
    }
    p.divs = {}

    for (dir in p.panels) {
      p.reader.addControl(p.panels[dir]);
      p.divs[dir] = p.panels[dir].properties.div;
      p.panels[dir].listenTo(evtCallbacks);
      p.panels[dir].properties.direction = flipper.constants[dir.toUpperCase()];
      p.divs[dir].style.width = "33%";
      p.divs[dir].style[dir == "forwards" ? "right" : "left"] = 0;
    }

    p.panels.central = new Monocle.Controls.Panel();
    p.reader.addControl(p.panels.central);
    p.divs.central = p.panels.central.properties.div;
    p.divs.central.dom.setStyles({ left: "33%", width: "34%" });
    menuCallbacks({ end: toggle });

    p.scrubber = new Monocle.Controls.Scrubber(p.reader);
    p.reader.addControl(p.scrubber, null, { hidden: true });
  }


  function menuCallbacks(callbacks) {
    p.menuCallbacks = callbacks;
    p.panels.central.listenTo(p.menuCallbacks);
  }

  function toggle() {
    p.showControl ? modeOff() : modeOn();
    p.showControl = !p.showControl;
  }

  function modeOn() {
    p.reader.showControl(p.scrubber);
    p.scrubber.updateNeedles();
    p.reader.dispatchEvent("monocle:toggle-control-on");
  }

  function modeOff() {
    p.reader.hideControl(p.scrubber);
    p.reader.dispatchEvent("monocle:toggle-control-off");
  }

  API.menuCallbacks = menuCallbacks;

  initialize();

  return API;
}

Monocle.pieceLoaded('panels/threepane');
