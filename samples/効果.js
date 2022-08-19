// const coordinates = {};
// const surfaces = {};

// Array(3).fill(null).forEach((_1, i) => {
//   surfaces[`K${i}`] = [];
//   const R = 60 + 40 * i;
//   Array(8).fill(null).forEach((_2, j) => {
//     const T = Math.PI / 4 * (1 / 2 + j);
//     const X = Math.cos(T) * R;
//     const Y = Math.sin(T) * R;
//     coordinates[`K${i}_${j}`] = { X, Y, Z: 0};
//     surfaces[`K${i}`].push(`K${i}_${j}`);
//   });
//   surfaces[`K${i}`].push(`K${i}_0`);
// });

// const colors = {
//   K: 'none',
// };
const 床H = 100;
const 床W = 640;
const 床P = 45;
const 柱R = 10;
const 柱H = 250;
const 紐M = 40;
const coordinates = { };
const surfaces = { 床面: [] };
Array(4).fill(null).forEach((_1, i) => {
  const 床X = 床W / (i < 2 ? 2 : -2);
  const 床Z = 床W / (i % 3 ? 2 : -2);
  const 紐X = 床X - 床P * (i < 2 ? 1 : -1);
  const 紐Z = 床Z - 床P * (i % 3 ? 1 : -1);
  coordinates[`床${i}D`] = { X: 床X, Z: 床Z, Y: 0 };
  coordinates[`床${i}U`] = { X: 床X, Z: 床Z, Y: 床H };
  surfaces.床面.push(`床${i}U`);
  surfaces[`床側${i}`] = [`床${i}U`, `床${i}D`, `床${(i + 1) % 4}D`, `床${(i + 1) % 4}U`];
  Array(8).fill(null).forEach((_2, j) => {
    const T = Math.PI / 4 * j;
    const X = 床X + Math.cos(T) * 柱R;
    const Z = 床Z + Math.sin(T) * 柱R;
    coordinates[`柱${i}_${j}D`] = { X, Z, Y: 0 };
    coordinates[`柱${i}_${j}M`] = { X, Z, Y: 床H };
    coordinates[`柱${i}_${j}U`] = { X, Z, Y: 柱H };
    surfaces[`柱${i}_${j}D`] = [`柱${i}_${j}D`, `柱${i}_${j}M`, `柱${i}_${(j + 1) % 8}M`, `柱${i}_${(j + 1) % 8}D`];
    surfaces[`柱${i}_${j}U`] = [`柱${i}_${j}U`, `柱${i}_${j}M`, `柱${i}_${(j + 1) % 8}M`, `柱${i}_${(j + 1) % 8}U`];
  });
  Array(3).fill(null).forEach((_3, k) => {
    coordinates[`紐${i}_${k}`] = { X: 紐X, Z: 紐Z, Y: 床H + 紐M * (k + 1) };
    surfaces[`紐${i}_${k}`] = [`紐${i}_${k}`, `紐${(i + 1) % 4}_${k}`];
  });
});

Object.keys(coordinates).forEach((code) => {
  ['X', 'Y', 'Z'].forEach((K) => {
    coordinates[code][K] = coordinates[code][K] / 2;
  });
});
