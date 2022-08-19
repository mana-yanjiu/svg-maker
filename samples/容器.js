const 周分割 = 32;
const 輪郭 = [
  // [ 60, -100],
  // [ 60,  -74],
  // [ 88,  -58.5],
  // [108,  -43],
  // [128,  -22.5],
  // [140,   -2],
  // [151,   18.5],
  // [160,   39],
  // [168,   59.5],
  // [176,   80],
  // [186,  100],
  // [182,  102],
  // [175,   94],
  // [161,   64],
  // [153,   42],
  // [136,    4],
  // [105,  -36],
  // [ 48,  -70],
  [ 80, -100],
  [ 80,  -70],
  [ 90,  -70],
  [230,   80],
  [244,   95],
  [240,   99],
  [ 86,  -66],
];
const coordinates = {};
const surfaces = {};

const [R1, Y1] = 輪郭[輪郭.length - 1];
const [R2, Y2] = 輪郭[輪郭.length - 2];
const L1 = Math.pow(Math.pow(R2 - R1, 2) + Math.pow(Y2 - Y1, 2), 1 / 2);
const TB = Math.acos((R2 - R1) / L1);
const RB = R1 + Math.cos(TB) * (L1 - 15);
const YB = Y1 + Math.sin(TB) * (L1 - 15);
const MHW = 29;
const MHH = 26;
const MUT = Math.PI * 2 / 周分割 / 5.5;
const MUW = RB * 2 * Math.PI / 周分割 / 5.5 * MHH / MHW;
const MUR = Math.cos(TB) * MUW;
const MUH = Math.sin(TB) * MUW;

Array(周分割).fill(null).forEach((_1, i) => {
  const T = Math.PI * 2 / 周分割 * i;
  輪郭.forEach(([R, Y], j) => {
    const X = Math.sin(T) * R;
    const Z = Math.cos(T) * R;
    coordinates[`W${i}.${j}`] = { X, Y, Z };
    if (j > 0) {
      surfaces[`W${i}.${j}`] = [`W${i}.${j - 1}`, `W${(i + 1) % 周分割}.${j - 1}`, `W${(i + 1) % 周分割}.${j}`, `W${i}.${j}`];
    }
  });
  if (!(i % 2)) {
    surfaces[`M${i}`] = [];
    [[-2, 1], [-4, 1], [-4, 2], [-1, 2], [-1, 0], [-5, 0], [-5, 3], [ 0, 3], [ 0, 0], [ 5, 0], [ 5, 3], [ 1, 3], [ 1, 1], [ 4, 1], [ 4, 2], [ 2, 2]].forEach(([SH, ST], j) => {
      const MX = Math.sin(T + MUT * SH) * (RB - MUR * ST);
      const MZ = Math.cos(T + MUT * SH) * (RB - MUR * ST);
      const MY = YB - MUH * ST;
      coordinates[`M${i}_${j}`] = { X: MX, Y: MY, Z: MZ };
      surfaces[`M${i}`].push(`M${i}_${j}`);
    });
  }
});

const colors = {
  default: '#ffffff',
  WS: 'none',
  M: 'none',
};
