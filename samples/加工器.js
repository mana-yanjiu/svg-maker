const coordinates = {};
const surfaces = {};
const 溝角度 = 24 / 180 * Math.PI;
const 溝幅 = 10;
const 溝数 = 7;
const 溝間隔 = 8;
const 箱幅 = 100;
const 箱長 = 220;
const 箱余白 = 12;

const 溝Z間隔 = (溝間隔 + 溝幅) / Math.cos(溝角度);
const 溝Z差 = Math.tan(溝角度) * (箱幅 - (箱余白 + 溝幅) * 2);
Array(溝数).fill(null).forEach((_1, i) => {
  surfaces[`溝${i}`] = [];
  const BX = 箱幅 / 2 - 箱余白 - 溝幅 / 2;
  const BZ = 箱長 / 2 - 箱余白 - 溝幅 / 2 - 溝Z間隔 * i;
  Array(9).fill(null).forEach((_2, j) => {
    Array(2).fill(null).forEach((_3, k) => {
      const T = 溝角度 + Math.PI / 8 * j * [1, -1][k];
      const X = BX * [1, -1][k] + Math.sin(T) * 溝幅 / 2;
      const Z = BZ - [0, 溝Z差][k] - Math.cos(T) * 溝幅 / 2;
      coordinates[`溝${i}_${j}_${k}`] = { X, Z, Y: 10 };
      if (k) {
        surfaces[`溝${i}`].push(`溝${i}_${j}_${k}`);
      } else {
        surfaces[`溝${i}`].unshift(`溝${i}_${j}_${k}`);
      }
    });
  });
});

coordinates.箱FL = { X: 箱幅 / 2, Z: 箱長 / 2, Y: 10 };
coordinates.箱FR = { X: 箱幅 / -2, Z: 箱長 / 2, Y: 10 };
coordinates.箱BL = { X: 箱幅 / 2, Z: 箱長 / -2, Y: 10 };
coordinates.箱BR = { X: 箱幅 / -2, Z: 箱長 / -2, Y: 10 };
surfaces.箱 = ['箱FR', '箱BR', '箱BL', '箱FL'];

Array(7).fill(null).forEach((_1, i) => {
  const T = Math.PI / 8 * (i + 1);
  const X = Math.cos(T) * 箱幅 / 2;
  const Z = Math.sin(T) * 10 + 箱長 / 2;
  coordinates[`箱F${i}`] = { X, Z, Y: 10 };
  surfaces.箱.push(`箱F${i}`);
});

Object.keys(coordinates).forEach((code) => {
  coordinates[`${code}D`] = { ...coordinates[code], Y: 5 };
});

Object.keys(surfaces).forEach((code) => {
  surfaces[`${code}D`] = surfaces[code].map((ccode) => `${ccode}D`);
});
