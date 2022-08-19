const coordinates = {};
const surfaces = {};

const 金属板H = 170;
const 金属板K = 127;
const 金属板W = 63;
const 金属板A = 15;
const 金属板穴Y = 117;
const 金属板穴R外 = 17.5;
const 金属板穴R内 = 15;
const 保護面形状群 = [
  [
    [  0, 460, 270, 16],
    [ 30, 500, 310, 16],
    [420, 440, 305, 16],
    [450, 400, 265, 16],
  ],
  [
    [  0, 205, 120, 24],
    [ 30, 205, 120, 24],
    [ 30, 180, 105, 24],
    [ 90, 180, 105, 24],
    [150, 160, 105, 24],
    [210, 120,  80, 24],
    [270,  90,  80, 24],
    [460,  70,  70, 24],
  ],
  [
    [  0, 220, 150, 24],
    [ 40, 220, 150, 24],
    [ 40, 180, 120, 24],
    [190, 160, 105, 24],
    [210, 120,  70, 24],
    [270,  90,  65, 22],
    [400,  70,  50, 16],
  ],
];
const 穴W = 22;
const 穴H1 = 70;
const 穴H2 = 87;
const 穴群間隔 = 300;
const 供給器W = 380;
const 供給器A = 200;
const 供給器角R = 20;

保護面形状群.forEach((保護面形状, h) => {
  保護面形状.forEach(([Y, W, A, K], i) => {
    const XBO = W / 2;
    const XBI = XBO - K;
    const ZBI = A / 2;
    const ZBO = ZBI - K;
    ['L', 'R'].forEach((D, d) => {
      ['F', 'B'].forEach((M, m) => {
        coordinates[`S${h}${D}${M}${i}O`] = { X: XBO * (d === 0 ? 1 : -1), Z: ZBO * (m === 0 ? 1 : -1) + 穴群間隔 * (h - 1) - ((h === 0 && m) ? 300 : 0), Y };
        coordinates[`S${h}${D}${M}${i}I`] = { X: XBI * (d === 0 ? 1 : -1), Z: ZBI * (m === 0 ? 1 : -1) + 穴群間隔 * (h - 1) - ((h === 0 && m) ? 300 : 0), Y };
        // coordinates[`S${h}${D}${M}${i}O`] = { X: XBO * (d === 0 ? 1 : -1), Z: ZBO * (m === 0 ? 1 : -1) + 穴群間隔 * (h - 1), Y };
        // coordinates[`S${h}${D}${M}${i}I`] = { X: XBI * (d === 0 ? 1 : -1), Z: ZBI * (m === 0 ? 1 : -1) + 穴群間隔 * (h - 1), Y };
        if (i > 0) {
          surfaces[`S${h}${D}${M}${i}`] = [`S${h}${D}${M}${i - 1}O`, `S${h}${D}${M}${i - 1}I`, `S${h}${D}${M}${i}I`, `S${h}${D}${M}${i}O`];
        }
      });
    });
    if (i > 0) {
      surfaces[`S${h}MF${i}`] = [`S${h}LF${i - 1}I`, `S${h}RF${i - 1}I`, `S${h}RF${i}I`, `S${h}LF${i}I`];
      surfaces[`S${h}MB${i}`] = [`S${h}LB${i - 1}I`, `S${h}RB${i - 1}I`, `S${h}RB${i}I`, `S${h}LB${i}I`];
      surfaces[`S${h}LM${i}`] = [`S${h}LF${i - 1}O`, `S${h}LB${i - 1}O`, `S${h}LB${i}O`, `S${h}LF${i}O`];
      surfaces[`S${h}RM${i}`] = [`S${h}RF${i - 1}O`, `S${h}RB${i - 1}O`, `S${h}RB${i}O`, `S${h}RF${i}O`];
    }
  });

  ['L', 'R'].forEach((D, d) => {
    ['O', 'I'].forEach((G, g) => {
      const X = 金属板K / (d === 0 ? 2 : -2) + 金属板A / (g === 0 ? 2 : -2);
      ['F', 'B'].forEach((M, m) => {
        const ZO = 金属板W / (m === 0 ? 2 : -2) + 穴群間隔 * (h - 1);
        const ZI = ZO - 20 * (m === 0 ? 1 : -1);
        coordinates[`金属板${h}${D}${M}${G}UO`] = { X, Z: ZO, Y: 金属板H * -1 + 2 };
        coordinates[`金属板${h}${D}${M}${G}UI`] = { X, Z: ZI, Y: 金属板H * -1 };
        coordinates[`金属板${h}${D}${M}${G}D`] = { X, Z: ZO, Y: 0 };
      });
      surfaces[`金属板${h}${D}${G}`] = [`金属板${h}${D}F${G}UI`, `金属板${h}${D}F${G}UO`, `金属板${h}${D}F${G}D`, `金属板${h}${D}B${G}D`, `金属板${h}${D}B${G}UO`, `金属板${h}${D}B${G}UI`];

      surfaces[`金属板穴${h}${D}${G}O`] = [];
      surfaces[`金属板穴${h}${D}${G}I`] = [];
      Array(8).fill(null).forEach((_, i) => {
        const AYO = 金属板穴R外 * Math.cos(Math.PI / 4 * i) + 金属板穴Y * -1;
        const AZO = 金属板穴R外 * Math.sin(Math.PI / 4 * i) + 穴群間隔 * (h - 1);
        const AYI = 金属板穴R内 * Math.cos(Math.PI / 4 * i) + 金属板穴Y * -1;
        const AZI = 金属板穴R内 * Math.sin(Math.PI / 4 * i) + 穴群間隔 * (h - 1);
        coordinates[`金属板穴${h}${D}${G}O${i}`] = { X, Y: AYO, Z: AZO };
        coordinates[`金属板穴${h}${D}${G}I${i}`] = { X, Y: AYI, Z: AZI };
        surfaces[`金属板穴${h}${D}${G}O`].push(`金属板穴${h}${D}${G}O${i}`);
        surfaces[`金属板穴${h}${D}${G}I`].push(`金属板穴${h}${D}${G}I${i}`);
      });
    });
  });
});

const 正負 = (数, 信号) => 数 * [1, -1][信号 ? 1 : 0];

['U', 'D'].forEach((E, e) => {
  ['L', 'R'].forEach((D, d) => {
    coordinates[`供給器FO${D}I${E}I`] = { X: 正負(供給器W / 2 - 供給器角R, d), Y: 供給器A / -2 + 正負(供給器A / 2 - 供給器角R, e), Z: 穴群間隔 * 1.8 };
    coordinates[`供給器FI${D}O${E}I`] = { X: 正負(供給器W / 2, d), Y: 供給器A / -2 + 正負(供給器A / 2 - 供給器角R, e), Z: 穴群間隔 * 1.8 - 供給器角R };
    coordinates[`供給器FI${D}I${E}O`] = { X: 正負(供給器W / 2 - 供給器角R, d), Y: 供給器A / -2 + 正負(供給器A / 2, e), Z: 穴群間隔 * 1.8 - 供給器角R };
    coordinates[`供給器BI${D}O${E}I`] = { X: 正負(供給器W / 2, d), Y: 供給器A / -2 + 正負(供給器A / 2 - 供給器角R, e), Z: 穴群間隔 * -2 };
    coordinates[`供給器BI${D}I${E}O`] = { X: 正負(供給器W / 2 - 供給器角R, d), Y: 供給器A / -2 + 正負(供給器A / 2, e), Z: 穴群間隔 * -2 };
  });
  Array(7).fill(null).forEach((_, i) => {
    const T = Math.PI / 8 * (i + 1);
    const XO = Math.cos(T) * 供給器W / 2;
    const ZO = Math.sin(T) * 供給器W / -2 - 穴群間隔 * 2;
    const XI = Math.cos(T) * (供給器W / 2 - 供給器角R);
    const ZI = Math.sin(T) * (供給器W / -2 + 供給器角R) - 穴群間隔 * 2;
    coordinates[`供給器BOK${i}${E}I`] = { X: XO, Y: 供給器A / -2 + 正負(供給器A / 2 - 供給器角R, e), Z: ZO };
    coordinates[`供給器BIK${i}${E}O`] = { X: XI, Y: 供給器A / -2 + 正負(供給器A / 2, e), Z: ZI };
    if (i) {
      surfaces[`供給器BK${i}${E}`] = [`供給器BOK${i - 1}${E}I`, `供給器BIK${i - 1}${E}O`, `供給器BIK${i}${E}O`, `供給器BOK${i}${E}I`];
    }
    if (i && e) {
      surfaces[`供給器BK${i}`] = [`供給器BOK${i - 1}UI`, `供給器BOK${i - 1}DI`, `供給器BOK${i}DI`, `供給器BOK${i}UI`];
    }
  });
  surfaces[`供給器BK0${E}`] = [`供給器BILO${E}I`, `供給器BOK0${E}I`, `供給器BIK0${E}O`, `供給器BILI${E}O`];
  surfaces[`供給器BK8${E}`] = [`供給器BIRO${E}I`, `供給器BOK6${E}I`, `供給器BIK6${E}O`, `供給器BIRI${E}O`];
});
['L', 'R'].forEach((D, d) => {
  Array(3).fill(null).forEach((_, i) => {
    const XO = (金属板K / 2 + 穴W) * 正負(1, d);
    const XI = 金属板K / 正負(2, d);
    const Z1 = 穴群間隔 * (i - 1) - [穴H1, 穴H2][d] / 2;
    const Z2 = Z1 + [穴H1, 穴H2][d];
    const Z3 = 穴群間隔 * (i - 1) - 穴H2 / 2;
    const Z4 = Z3 + 穴H2;
    coordinates[`供給器穴${i}${D}O1`] = { X: XO, Y: -4, Z: Z1 };
    coordinates[`供給器穴${i}${D}O2`] = { X: XO, Y: -4, Z: Z2 };
    coordinates[`供給器穴${i}${D}I1`] = { X: XI, Y: -4, Z: Z1 };
    coordinates[`供給器穴${i}${D}I2`] = { X: XI, Y: -4, Z: Z2 };
    coordinates[`供給器穴${i}${D}O1S`] = { X: XO + 正負(10, d), Y: 0, Z: Z3 - 10 };
    coordinates[`供給器穴${i}${D}O2S`] = { X: XO + 正負(10, d), Y: 0, Z: Z4 + 10 };
    coordinates[`供給器穴${i}${D}I1S`] = { X: XI - 正負(10, d), Y: 0, Z: Z3 - 10 };
    coordinates[`供給器穴${i}${D}I2S`] = { X: XI - 正負(10, d), Y: 0, Z: Z4 + 10 };
    coordinates[`供給器穴枠${i}${D}I1O`] = { X: XO + 正負(28, d), Y: 0, Z: Z3 - 26 };
    coordinates[`供給器穴枠${i}${D}O1I`] = { X: XO + 正負(38, d), Y: 0, Z: Z3 - 16 };
    coordinates[`供給器穴枠${i}${D}I2O`] = { X: XO + 正負(28, d), Y: 0, Z: Z4 + 26 };
    coordinates[`供給器穴枠${i}${D}O2I`] = { X: XO + 正負(38, d), Y: 0, Z: Z4 + 16 };
    surfaces[`供給器穴${i}${D}`] = [`供給器穴${i}${D}O1`, `供給器穴${i}${D}I1`, `供給器穴${i}${D}I2`, `供給器穴${i}${D}O2`];
    surfaces[`供給器穴${i}${D}S`] = [`供給器穴${i}${D}O1S`, `供給器穴${i}${D}I1S`, `供給器穴${i}${D}I2S`, `供給器穴${i}${D}O2S`];
    if (d) {
      surfaces[`供給器穴枠${i}`] = [`供給器穴枠${i}LI1O`, `供給器穴枠${i}RI1O`, `供給器穴枠${i}RO1I`, `供給器穴枠${i}RO2I`, `供給器穴枠${i}RI2O`, `供給器穴枠${i}LI2O`, `供給器穴枠${i}LO2I`, `供給器穴枠${i}LO1I`];
    }
  });
});
surfaces.供給器F = ['供給器FOLIUI', '供給器FORIUI', '供給器FORIDI', '供給器FOLIDI'];
surfaces.供給器U = ['供給器FILIUO', '供給器FIRIUO', '供給器BIRIUO', '供給器BILIUO'];
surfaces.供給器D = ['供給器FILIDO', '供給器FIRIDO', '供給器BIRIDO', '供給器BILIDO'];
surfaces.供給器L = ['供給器FILOUI', '供給器FILODI', '供給器BILODI', '供給器BILOUI'];
surfaces.供給器R = ['供給器FIROUI', '供給器FIRODI', '供給器BIRODI', '供給器BIROUI'];

Object.keys(coordinates).forEach((code) => {
  coordinates[code].X = coordinates[code].X / 4;
  coordinates[code].Y = coordinates[code].Y / 4;
  coordinates[code].Z = coordinates[code].Z / 4;
});