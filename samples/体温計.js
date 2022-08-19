const 形状 = [
  [4, 4.6, 4.6],
  [69, 7.2, 6.5],
  [205, 30, 20],
  [362, 30, 20],
  [377, 15.6, 0],
];

const coordinates = {};
const surfaces = {};

const 支点 = 形状[形状.length - 1][0] / 2;
coordinates.点_ = { X: 0, Y: 0, Z: 支点 * -1 };

形状.forEach(([Z0, R, A], i) => {
  ['L', `R`].forEach((D, d) => {
    surfaces[`環${i}${D}`] = [];
    coordinates[`点${i}${D}_端`] = { X: R * [1, -1][d], Y: 0, Z: Z0 - 支点 };
    surfaces[`環${i}${D}`].push(`点${i}${D}_端`);
    ['U', `D`].forEach((M, m) => {
      if (A) {
        Array(2).fill(null).forEach((_, j) => {
          const T = Math.PI / 4 * (j + 1);
          const X1 = (Math.cos(T) * A + R - A) * [1, -1][d];
          const Y1 = Math.sin(T) * A * [1, -1][m];
          coordinates[`点${i}${D}${M}_${j}`] = { X: X1, Y: Y1, Z: Z0 - 支点 };
          if (m) {
            surfaces[`環${i}${D}`].push(`点${i}${D}${M}_${j}`);
          } else {
            surfaces[`環${i}${D}`].unshift(`点${i}${D}${M}_${j}`);
          }
        });
      }
      coordinates[`点${i}${D}${M}_芯`] = { X: 0, Y: A * [1, -1][m], Z: Z0 - 支点 };
      if (m) {
        surfaces[`環${i}${D}`].push(`点${i}${D}${M}_芯`);
      } else {
        surfaces[`環${i}${D}`].unshift(`点${i}${D}${M}_芯`);
      }
    });
    if (!i) {
      surfaces[`環_${D}`] = ['点_', `点${i}${D}_端`];
    }
  });
});
