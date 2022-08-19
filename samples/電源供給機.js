const 口幅 = 1250;
const 口厚 = 512;
const 口数 = 5;
const 口間隔 = 1024;
const 機器内幅 = 256;
const 機器内長01 = 1600;
const 機器内長02 = 3200;
const 機器厚 = 1600;

const coordinates = {};
const surfaces = {};

const 機器長 = 機器内長01 + 機器内長02 + 口数 * 口厚 + (口数 - 1) * 口間隔;
coordinates.FLU = { X: (口幅 + 機器内幅) / 2, Y: 機器厚 / 2, Z: 機器長 /  2 };
coordinates.FLU = { X: (口幅 + 機器内幅) / 2, Y: 機器厚 / 2, Z: 機器長 /  2 };
coordinates.BLU = { X: (口幅 + 機器内幅) / 2, Y: 機器厚 / 2, Z: 機器長 / -2 };
coordinates.BLU = { X: (口幅 + 機器内幅) / 2, Y: 機器厚 / 2, Z: 機器長 / -2 };

const 正負 = (数, 信号) => 数 * [1, -1][信号 ? 1 : 0];

['L', 'R'].forEach((A, a) => {
  const X = (口幅 / 2 + 機器内幅) * 正負(1, a);
  ['F', 'B'].forEach((B, b) => {
    const Z = 機器長 / 正負(2, b);
    ['U', 'D'].forEach((C, c) => {
      const Y = 機器厚 / 正負(2, c);
      coordinates[`機器${A}${B}${C}`] = { X, Y, Z };
    });
  });
  Array(口数).fill(null).forEach((_, i) => {
    const KX = 口幅 / 正負(2, a);
    const KZ1 = 機器長 / 2 - 機器内長01 - (口厚 + 口間隔) * i;
    const KZ2 = KZ1 - 口厚;
    coordinates[`口${i}${A}1`] = { X: KX, Y: 機器厚 / 2, Z: KZ1 };
    coordinates[`口${i}${A}2`] = { X: KX, Y: 機器厚 / 2, Z: KZ2 };
    if (a) {
      surfaces[`KT${i}`] = [`口${i}L1`, `口${i}R1`, `口${i}R2`, `口${i}L2`];
    }
  });
});

surfaces.KKF = ['機器LFU', '機器RFU', '機器RFD', '機器LFD'];
surfaces.KKB = ['機器LBU', '機器RBU', '機器RBD', '機器LBD'];
surfaces.KKL = ['機器LFU', '機器LBU', '機器LBD', '機器LFD'];
surfaces.KKR = ['機器RFU', '機器RBU', '機器RBD', '機器RFD'];

Object.keys(coordinates).forEach((code) => {
  coordinates[code].X = coordinates[code].X / 40;
  coordinates[code].Y = coordinates[code].Y / 40;
  coordinates[code].Z = coordinates[code].Z / 40;
});
