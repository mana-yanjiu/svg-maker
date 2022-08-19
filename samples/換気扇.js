const coordinates = {};
const surfaces = { ZI: [], SF: [] };
const params = {
  羽根枚数: 5,
  羽根径: [
    [48, 72],
    [48, 78],
    [48, 81],
    [48, 82],
    [48, 83],
    [48, 84],
    [48, 85],
    [48, 86],
    [48, 86.7],
    [48, 87.3],
    [48, 88],
    [48, 88.3],
    [48, 88.6],
    [48, 89],
  ],
  羽根幅: [
    [  0 / 3000, 540 / 3000],
    [ -5 / 3000, 543 / 3000],
    [ -9 / 3000, 546 / 3000],
    [-12 / 3000, 548 / 3000],
    [-12 / 3000, 549 / 3000],
    [ -9 / 3000, 550 / 3000],
    [ -7 / 3000, 550 / 3000],
    [ -4 / 3000, 550 / 3000],
    [  0 / 3000, 550 / 3000],
    [  5 / 3000, 550 / 3000],
    [ 11 / 3000, 550 / 3000],
    [ 18 / 3000, 550 / 3000],
    [ 26 / 3000, 551 / 3000],
    [ 34 / 3000, 552 / 3000],
    [ 41 / 3000, 558 / 3000],
    [ 50 / 3000, 565 / 3000],
    [ 57 / 3000, 560 / 3000],
    [ 75 / 3000, 510 / 3000],
  ],
  羽根傾斜: [20, 35],
  柵数: 24,
  風洞形状: [
    [140, -30],
    [140,  12],
    [142,  20],
    [145,  24],
    [148,  28],
    [152,  31],
    [154,  33],
  ],
  風洞粒度: 32,
  枠半幅: 185,
};
// params.羽根幅.forEach(([R, W], i, A) => {
//   if (i > 0) {
// console.log(`(${i + 1}) ${Math.round(R * 3000) - Math.round(A[i - 1][0] * 3000)} ||| ${Math.round(W * 3000) - Math.round(A[i - 1][1] * 3000)}`);
//   }
// });

Array(params.羽根枚数).fill(null).forEach((_, i) => {
  surfaces[`HW${i}`] = [];
  params.羽根幅.forEach(([TS, TW], j) => {
    const T1 = i / params.羽根枚数 + TS;
    const Z1 = (params.羽根傾斜[1] - params.羽根傾斜[0]) / params.羽根幅.length * j + params.羽根傾斜[0];
    params.羽根径.forEach(([RS, RW], k) => {
      const T2 = Math.PI * 2 * (T1 + TW * k / params.羽根径.length);
      const R2 = RS + RW * j / params.羽根幅.length;
      const X2 = Math.sin(T2) * R2;
      const Y2 = Math.cos(T2) * R2;
      const Z2 = Z1 * Math.pow(1 - k / params.羽根径.length, 2);
      coordinates[`羽根${i}.${j}.${k}`] = { X: X2, Y: Y2, Z: Z2 };
      if (j > 0 && k > 0) {
        surfaces[`H${i}.${j}.${k}`] = [`羽根${i}.${j - 1}.${k - 1}`, `羽根${i}.${j - 1}.${k}`, `羽根${i}.${j}.${k}`, , `羽根${i}.${j}.${k - 1}`];
      }
      if (k === 0) {
        surfaces[`HW${i}`].unshift(`羽根${i}.${j}.${k}`);
      } else if (j === params.羽根幅.length - 1) {
        surfaces[`HW${i}`].unshift(`羽根${i}.${j}.${k}`);
      }
      if (j === 0) {
        surfaces[`HW${i}`].push(`羽根${i}.${j}.${k}`);
      } else if (k === params.羽根径.length - 1) {
        surfaces[`HW${i}`].push(`羽根${i}.${j}.${k}`);
      }
    });
  });
});

Array(params.柵数).fill(null).forEach((_, i) => {
  const T1 = Math.PI * 2 / params.柵数 * i;
  const ZXO = Math.sin(T1) * 48;
  const ZYO = Math.cos(T1) * 48;
  const ZXI = Math.sin(T1) * 37;
  const ZYI = Math.cos(T1) * 37;
  coordinates[`軸${i}OF`] = { X: ZXO, Y: ZYO, Z:  30 };
  coordinates[`軸${i}OB`] = { X: ZXO, Y: ZYO, Z: -20 };
  coordinates[`軸${i}I`]  = { X: ZXI, Y: ZYI, Z:  34 };
  surfaces[`Z${i}O`] = [`軸${i}OF`, `軸${i}OB`, `軸${(i + 1) % params.柵数}OB`, `軸${(i + 1) % params.柵数}OF`];
  surfaces[`Z${i}I`] = [`軸${i}OF`, `軸${i}I`, `軸${(i + 1) % params.柵数}I`, `軸${(i + 1) % params.柵数}OF`];
  surfaces.ZI.push(`軸${i}I`);
});

params.風洞形状.forEach(([R, Z], i) => {
  Array(params.風洞粒度).fill(null).forEach((_, j) => {
    const X = Math.cos(Math.PI * 2 / params.風洞粒度 * j) * R;
    const Y = Math.sin(Math.PI * 2 / params.風洞粒度 * j) * R;
    coordinates[`風洞${i}.${j}`] = { X, Y, Z };
    if (i > 0) {
      surfaces[`S${i}.${j}`] = [`風洞${i - 1}.${j}`, `風洞${i - 1}.${(j + 1) % params.風洞粒度}`, `風洞${i}.${(j + 1) % params.風洞粒度}`, `風洞${i}.${j}`];
      if (i === params.風洞形状.length - 1) {
        surfaces.SF.push(`風洞${i}.${j}`);
      }
    }
  });
});
surfaces.SF.push(`風洞${params.風洞形状.length - 1}.${0}`);

const 枠径 = params.枠半幅 / Math.cos(Math.PI / 4 - 5 / 180 * Math.PI);
const 枠差分 = params.枠半幅 - 枠径 * Math.sin(Math.PI / 4 - 5 / 180 * Math.PI);
const 枠角径 = Math.pow(Math.pow(params.枠半幅 - 枠差分, 2) * 2, 1 / 2) + 枠差分;
const ZF = Math.max(...params.風洞形状.map(([_R, _Z]) => _Z));
const ZB = Math.min(...params.風洞形状.map(([_R, _Z]) => _Z));
Array(4).fill(null).forEach((_1, i) => {
  const 座標群 = ['O', 'I'].reduce((群D, D, d) => ({
    ...群D,
    ...([1, 3].reduce((群N, N, n) => ({
      ...群N,
      [`${D}${N}`]: {
        X: Math.sin(Math.PI * (1 / 2 * i + 1 / 4) + (5 / 180 * Math.PI) * (n ? 1 : -1)) * (枠径 - (d ? 5 : 0)),
        Y: Math.cos(Math.PI * (1 / 2 * i + 1 / 4) + (5 / 180 * Math.PI) * (n ? 1 : -1)) * (枠径 - (d ? 5 : 0)),
      },
    }), {})),
    [`${D}2`]: {
      X: Math.sin(Math.PI * (1 / 2 * i + 1 / 4)) * (枠角径 - (d ? 5 : 0)),
      Y: Math.cos(Math.PI * (1 / 2 * i + 1 / 4)) * (枠角径 - (d ? 5 : 0)),
    },
  }), {});
  Array(3).fill(null).forEach((_2, j) => {
    coordinates[`枠${i}FO${j + 1}`] = { X: 座標群[`O${j + 1}`].X, Y: 座標群[`O${j + 1}`].Y, Z: ZF - 6 };
    coordinates[`枠${i}FI${j + 1}`] = { X: 座標群[`I${j + 1}`].X, Y: 座標群[`I${j + 1}`].Y, Z: ZF };
    coordinates[`枠${i}BO${j + 1}`] = { X: 座標群[`O${j + 1}`].X, Y: 座標群[`O${j + 1}`].Y, Z: ZB };
  });
  surfaces[`W${i}F1`] = [`枠${i}FO1`, `枠${i}FO2`, `枠${i}FI2`, `枠${i}FI1`];
  surfaces[`W${i}F2`] = [`枠${i}FO2`, `枠${i}FO3`, `枠${i}FI3`, `枠${i}FI2`];
  surfaces[`W${i}F3`] = [`枠${i}FO3`, `枠${i}FI3`, `枠${(i + 1) % 4}FI1`, `枠${(i + 1) % 4}FO1`];
  surfaces[`W${i}B1`] = [`枠${i}FO1`, `枠${i}FO2`, `枠${i}BO2`, `枠${i}BO1`];
  surfaces[`W${i}B2`] = [`枠${i}FO2`, `枠${i}FO3`, `枠${i}BO3`, `枠${i}BO2`];
  surfaces[`W${i}B3`] = [`枠${i}FO3`, `枠${i}BO3`, `枠${(i + 1) % 4}BO1`, `枠${(i + 1) % 4}FO1`];
  surfaces.SF.push(`枠${i}FI1`, `枠${i}FI2`, `枠${i}FI3`);
});
surfaces.SF.push(`枠0FI1`);

const colors = {
  default: '#ffffff',
  H: '#0088aa88',
  // HW: 'none',
  HW: '#0088aa88',
  // Z: '#0088aaee',
  R: '#000000',
  SH: '#ccccff',
  SH0: '#ffaaaa',
  KY: '#000000',
  SK: 'none',
};
const strokeColors = {
  default: '#000000',
  // H: 'none',
  H: '#00558888',
  HW: '#00558888',
  // Z: '#005588ee',
  SF: 'none',
};
