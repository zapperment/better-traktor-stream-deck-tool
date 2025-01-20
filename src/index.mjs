const colours = {
  licorice: "0.000000, 0.000000, 0.000000, 255.000000",
  banana: "254.881188, 252.030672, 120.527085, 255.000000",
  snow: "255.000000, 255.000000, 255.000000, 255.000000",
};

const ct = {
  on: {
    foreground: colours.licorice,
    background: colours.banana,
  },
  off: {
    foreground: colours.snow,
    background: colours.licorice,
  },
};

const payloads = {
  play: {
    on: {
      BTTTriggerConfig: {
        BTTStreamDeckIconColor1: ct.on.foreground,
        BTTStreamDeckBackgroundColor: ct.on.background,
      },
    },
    off: {
      BTTTriggerConfig: {
        BTTStreamDeckIconColor1: ct.off.foreground,
        BTTStreamDeckBackgroundColor: ct.off.background,
      },
    },
  },
};
