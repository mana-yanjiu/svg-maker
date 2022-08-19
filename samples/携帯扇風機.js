const 枠RO = 100;
const 枠RI = 95;
const 枠A = 60;
const 面R = 33;
const 柵S = 32;
const 柵A = 8;
const 柵Z = 3;
const 柱R = 25;
const 柱W = 180;

const coordinates = {};
const surfaces = { MFO: [], MFI: [], MBO: [], MBI: [] };

const 柵ZT = Math.PI * 2 / 柵S * 柵Z / 9;
['F', 'B'].forEach((M) => {
  surfaces[`W${M}O`] = [`柵${柵S - 1}_9${M}O`];
  surfaces[`W${M}I`] = [`柵${柵S - 1}_9${M}I`];
});

Array(柵S).fill(null).forEach((_1, i) => {
  const TB = Math.PI * 2 / 柵S * i;
  surfaces[`S${i}F`] = [];
  surfaces[`S${i}B`] = [];
  Array(10).fill(null).forEach((_2, j) => {
    ['F', 'B'].forEach((M, m) => {
      const T = TB + 柵ZT * j * [1, -1][m];
      const R = 面R + (枠RI - 面R) / 9 * j;
      const X = Math.sin(T) * R;
      const Y = Math.cos(T) * R;
      coordinates[`柵${i}_${j}${M}O`] = { X, Y, Z: 枠A / 2 * [1, -1][m] };
      coordinates[`柵${i}_${j}${M}I`] = { X, Y, Z: (枠A / 2 - 柵A) * [1, -1][m] };
      surfaces[`S${i}${M}`].push(`柵${i}_${j}${M}O`);
      surfaces[`S${i}${M}`].unshift(`柵${i}_${j}${M}I`);
      if (j === 0) {
        surfaces[`M${M}O`].push(`柵${i}_${j}${M}O`);
        surfaces[`M${M}I`].push(`柵${i}_${j}${M}I`);
        surfaces[`W${M}O`].push(`柵${i}_9${M}O`);
        surfaces[`W${M}I`].push(`柵${i}_9${M}I`);
      } else if (j === 9) {
        const WX = Math.sin(T) * 枠RO;
        const WY = Math.cos(T) * 枠RO;
        coordinates[`W${i}${M}`] = { X: WX, Y: WY, Z: 枠A / 2 * [1, -1][m] };
      }
    });
    surfaces[`W${i}`] = [`W${i}F`, `W${(i + 柵Z * 2) % 柵S}B`, `W${(i + 柵Z * 2 + 1) % 柵S}B`, `W${(i + 1) % 柵S}F`];
  });
});

Array(16).fill(null).forEach((_1, i) => {
  const T = Math.PI * 2 / 16 * i;
  const X = Math.sin(T) * 柱R;
  const Z = Math.cos(T) * 柱R;
  coordinates[`T${i}U`] = { X, Y: 枠RO * -1, Z };
  coordinates[`T${i}D`] = { X, Y: 枠RO * -1 - 柱W, Z };
  surfaces[`T${i}`] = [`T${i}U`, `T${i}D`, `T${(i + 1) % 16}D`, `T${(i + 1) % 16}U`];
});

const colors = {
  default: '#ffffff',
  WF: 'none',
  WB: 'none',
};

const strokeColors = {
  default: '#000000',
};
