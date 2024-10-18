const coordinates = {};
const surfaces = {};

const 展開角度 = 110 / 180 * Math.PI;
const 上下位置 = 10;
const 寸法 = {
  外横: 322,
  外縦: 217,
  面横: 294,
  面縦: 156,
  上厚: 6,
  下厚: 12,
  下傾斜: 1.32 / 180 * Math.PI,
  径: 6,
  解像度: 8,
  盤前: 80,
  盤後: 20,
  盤深: 1,
  盤遊: 3,
  盤隙: 20,
  鍵基本横幅: 15,
  鍵基本縦幅: 14,
  鍵隙: 4,
  視径: 8,
  視解像度: 24,
  指幅: 100,
  指隙: 10,
};

const 上前Z1 = Math.cos(展開角度) * 寸法.外縦;
const 上前Z2 = Math.sin(展開角度) * 寸法.上厚;
const 上前Y1 = Math.sin(展開角度) * 寸法.外縦;
const 上前Y2 = Math.cos(展開角度) * 寸法.上厚;
const 面Z1 = Math.cos(展開角度) * (寸法.外縦 / 2 - 寸法.面縦 / 2);
const 面Z2 = Math.cos(展開角度) * (寸法.外縦 / 2 + 寸法.面縦 / 2);
const 面Y1 = Math.sin(展開角度) * (寸法.外縦 / 2 - 寸法.面縦 / 2);
const 面Y2 = Math.sin(展開角度) * (寸法.外縦 / 2 + 寸法.面縦 / 2);
const 体下外縦 = 寸法.外縦 * Math.cos(寸法.下傾斜);
const 体下前厚 = 寸法.外縦 * Math.sin(寸法.下傾斜);
const 盤幅 = 寸法.外縦 - 寸法.盤前 - 寸法.盤後;
const 盤縦心 = 盤幅 / 2 + 寸法.盤後;
const 体暫定上座標群 = { '01': [], '00': [], '11': [], '10': [] };
const 体暫定下座標群 = { '01': [], '00': [], '11': [], '10': [] };
[1, -1].forEach((左右係数, 左右) => {
  [1, 0].forEach((上下) => {
    [1, 0].forEach((前後) => {
      coordinates[`体下${左右}${上下}${前後}`] = {
        X: 寸法.外横 / 2 * 左右係数,
        Y: 上下位置 + [寸法.下厚, 体下前厚][前後] * 上下,
        Z: [0, 体下外縦][前後] - 寸法.外縦 / 2,
      };
      coordinates[`体上${左右}${上下}${前後}`] = {
        X: 寸法.外横 / 2 * 左右係数,
        Z: 上前Z1 * 前後 - 上前Z2 * 上下 - 寸法.外縦 / 2,
        Y: 上前Y1 * 前後 + 上前Y2 * 上下 + 寸法.下厚 + 上下位置,
      };
    });
    coordinates[`面${左右}${上下}`] = {
      X: 寸法.面横 / 2 * 左右係数,
      Z: [面Z1, 面Z2][上下] - 寸法.外縦 / 2,
      Y: [面Y1, 面Y2][上下] + 寸法.下厚 + 上下位置,
    };
  });

  [-1, 1].forEach((前後係数, 前後) => {
    const 盤距離上Z = 盤縦心 + 盤幅 / 2 * 前後係数;
    const 盤座標上Z = Math.cos(寸法.下傾斜) * 盤距離上Z - 寸法.外縦 / 2;
    const 盤座標上Y = 寸法.下厚 + 上下位置 - Math.sin(寸法.下傾斜) * 盤距離上Z;
    const 盤座標下Z = 盤座標上Z - Math.cos(寸法.下傾斜) * 寸法.盤遊 * 前後係数 - Math.sin(寸法.下傾斜) * 寸法.盤深;
    const 盤座標下Y = 盤座標上Y - Math.cos(寸法.下傾斜) * 寸法.盤深 + Math.sin(寸法.下傾斜) * 寸法.盤遊 * 前後係数;
    coordinates[`盤${左右}1${前後}`] = { X: 寸法.外横 / 2 * 左右係数, Y: 盤座標上Y, Z: 盤座標上Z };
    coordinates[`盤${左右}0${前後}`] = { X: 寸法.外横 / 2 * 左右係数, Y: 盤座標下Y, Z: 盤座標下Z };
  });
});

Array(寸法.解像度 + 1).fill(null).forEach((_, 進捗) => {
  const 角度 = Math.PI / 2 / 寸法.解像度 * 進捗;
  const 幅X = Math.sin(角度);
  const 幅Z = Math.cos(角度);
  const 座標X0 = 寸法.外横 / 2 + 寸法.径 * (幅X - 1);
  [1, -1].forEach((左右係数, 左右) => {
    [-1, 1].forEach((前後係数, 前後) => {
      [1, 0].forEach((上下) => {
        const 距離Z = 寸法.外縦 / 2 + (寸法.外縦 / 2 + 寸法.径 * (幅Z - 1)) * 前後係数;
        const 座標上Z = Math.cos(展開角度) * 距離Z - 寸法.外縦 / 2 - (上下 ? 0 : Math.sin(展開角度) * 寸法.上厚);
        const 座標上Y = Math.sin(展開角度) * 距離Z + (上下 ? 0 : Math.cos(展開角度) * 寸法.上厚) + 寸法.下厚 + 上下位置;
        const 座標下Z = (上下 ? Math.cos(寸法.下傾斜) : 1) * 距離Z - 寸法.外縦 / 2;
        const 座標下Y = (上下 ? 寸法.下厚 - Math.sin(寸法.下傾斜) * 距離Z : 0) + 上下位置;
        coordinates[`体上${左右}${上下}${前後}${進捗}`] = { X: 座標X0 * 左右係数, Y: 座標上Y, Z: 座標上Z };
        coordinates[`体下${左右}${上下}${前後}${進捗}`] = { X: 座標X0 * 左右係数, Y: 座標下Y, Z: 座標下Z };
        左右 === 前後 ? 体暫定上座標群[`${上下}${前後}`].push(`体上${左右}${上下}${前後}${進捗}`) : 体暫定上座標群[`${上下}${前後}`].unshift(`体上${左右}${上下}${前後}${進捗}`);
        左右 === 前後 ? 体暫定下座標群[`${上下}${前後}`].push(`体下${左右}${上下}${前後}${進捗}`) : 体暫定下座標群[`${上下}${前後}`].unshift(`体下${左右}${上下}${前後}${進捗}`);
      });
      if (進捗) {
        surfaces[`HT上${左右}K${前後}.${進捗}`] = [`体上${左右}1${前後}${進捗}`, `体上${左右}1${前後}${進捗 - 1}`, `体上${左右}0${前後}${進捗 - 1}`, `体上${左右}0${前後}${進捗}`];
        surfaces[`HT下${左右}K${前後}.${進捗}`] = [`体下${左右}1${前後}${進捗}`, `体下${左右}1${前後}${進捗 - 1}`, `体下${左右}0${前後}${進捗 - 1}`, `体下${左右}0${前後}${進捗}`];
      }
    });
  });
});

const 面距離Z = (寸法.外縦 + 寸法.面縦) / 2;
const 視距離Z = 面距離Z + (寸法.外縦 - 面距離Z) / 2;
surfaces.SI = [];
Array(寸法.視解像度).fill(null).forEach((_, 進捗) => {
  const 角度 = Math.PI * 2 / 寸法.視解像度 * 進捗;
  const 座標X = Math.sin(角度) * 寸法.視径;
  const 距離Z = Math.cos(角度) * 寸法.視径 + 視距離Z;
  const 座標Z = Math.cos(展開角度) * 距離Z - 寸法.外縦 / 2;
  const 座標Y = Math.sin(展開角度) * 距離Z + 寸法.下厚 + 上下位置;
  coordinates[`視${進捗}`] = { X: 座標X, Y: 座標Y, Z: 座標Z };
  surfaces.SI.push(`視${進捗}`);
});

surfaces.HT上上 = [...体暫定上座標群['11'], ...体暫定上座標群['10']];
surfaces.HT上下 = [...体暫定上座標群['01'], ...体暫定上座標群['00']];
surfaces.HT下上前 = [...体暫定下座標群['11'], '盤111', '盤011'];
surfaces.HT下上後 = [...体暫定下座標群['10'], '盤010', '盤110'];
surfaces.HT下下 = [...体暫定下座標群['01'], ...体暫定下座標群['00']];
surfaces.HT下左 = [`体下011${寸法.解像度}`, `体下001${寸法.解像度}`, `体下000${寸法.解像度}`, `体下010${寸法.解像度}`, '盤010', '盤000', '盤001', '盤011'];
surfaces.HT下右 = [`体下111${寸法.解像度}`, `体下101${寸法.解像度}`, `体下100${寸法.解像度}`, `体下110${寸法.解像度}`, '盤110', '盤100', '盤101', '盤111'];
surfaces.BN前遊 = ['盤011', '盤111', '盤101', '盤001'];
surfaces.BN後遊 = ['盤010', '盤110', '盤100', '盤000'];
surfaces.BN = ['盤001', '盤101', '盤100', '盤000'];
surfaces.MN = ['面01', '面11', '面10', '面00'];

const 鍵特殊幅1 = 寸法.外横 - 寸法.盤隙 * 2 - (寸法.鍵基本横幅 + 寸法.鍵隙) * 13;
const 鍵特殊幅2 = (寸法.外横 - 寸法.盤隙 * 2 - 寸法.鍵基本横幅 * 12 - 寸法.鍵隙 * 13) / 2;
const 鍵特殊幅3 = (寸法.外横 - 寸法.盤隙 * 2 - 寸法.鍵基本横幅 * 11 - 寸法.鍵隙 * 12) / 2;

const 鍵配列 = [
  [1, 13, 0],
  [2, 12, 2],
  [0, 13, 0],
  [2, 12, 0],
  [3, 11, 3],
  [2, 3, 0],
];

const 鍵定義 = (座標X, 座標Y1, 座標Y2, 座標Z1, 座標Z2, 幅X, 接頭記号) => {
  coordinates[`鍵${接頭記号}.11`] = { X: 座標X, Y: 座標Y1, Z: 座標Z1 };
  coordinates[`鍵${接頭記号}.12`] = { X: 座標X, Y: 座標Y2, Z: 座標Z2 };
  coordinates[`鍵${接頭記号}.21`] = { X: 座標X - 幅X, Y: 座標Y1, Z: 座標Z1 };
  coordinates[`鍵${接頭記号}.22`] = { X: 座標X - 幅X, Y: 座標Y2, Z: 座標Z2 };
  surfaces[`KN${接頭記号}`] = [
    `鍵${接頭記号}.11`,
    `鍵${接頭記号}.12`,
    `鍵${接頭記号}.22`,
    `鍵${接頭記号}.21`,
  ];
};

鍵配列.forEach(([特殊番号1, 鍵数, 特殊番号2], 鍵進捗) => {
  const 座標Z0 = 寸法.鍵基本縦幅 * (鍵進捗 - 3) + 寸法.鍵隙 * (鍵進捗 - 2) + 盤縦心 - 寸法.鍵隙 / 2;
  const 座標Z1 = Math.cos(寸法.下傾斜) * 座標Z0 - 寸法.外縦 / 2;
  const 座標Z2 = Math.cos(寸法.下傾斜) * (座標Z0 + 寸法.鍵基本縦幅) - 寸法.外縦 / 2;
  const 座標Y1 = 上下位置 + 寸法.下厚 - Math.sin(寸法.下傾斜) * 座標Z0;
  const 座標Y2 = 上下位置 + 寸法.下厚 - Math.sin(寸法.下傾斜) * (座標Z0 + 寸法.鍵基本縦幅);
  const 特殊幅1 = [0, 鍵特殊幅1, 鍵特殊幅2, 鍵特殊幅3][特殊番号1];
  const 特殊幅2 = [0, 鍵特殊幅1, 鍵特殊幅2, 鍵特殊幅3][特殊番号2];
  const 特殊隙1 = 特殊幅1 ? 寸法.鍵隙 : 0;
  Array(鍵数).fill(null).forEach((_, 進捗) => {
    const 座標X1 = 寸法.外横 / 2 - (寸法.鍵基本横幅 + 寸法.鍵隙) * 進捗 - 寸法.盤隙 - 特殊幅1 - 特殊隙1;
    鍵定義(座標X1, 座標Y1, 座標Y2, 座標Z1, 座標Z2, 寸法.鍵基本横幅, `${鍵進捗}.${進捗}`);
  });
  [特殊幅1, 特殊幅2].forEach((特殊幅, 特殊係数) => {
    if (特殊幅) {
      const 座標X1 = 特殊係数 ? coordinates[`鍵${鍵進捗}.${鍵数 - 1}.21`].X - 寸法.鍵隙 : (寸法.外横 / 2 - 寸法.盤隙);
      鍵定義(座標X1, 座標Y1, 座標Y2, 座標Z1, 座標Z2, 特殊幅, `${鍵進捗}.T${特殊係数}`);
    }
  });
  if (鍵進捗 === 5) {
    const 座標X1 = 寸法.盤隙 - 寸法.外横 / 2 + 鍵特殊幅2 + (寸法.鍵基本横幅 + 寸法.鍵隙) * 3;
    const 座標X2 = 寸法.盤隙 - 寸法.外横 / 2 + 鍵特殊幅2 + 寸法.鍵基本横幅 * 5 + 寸法.鍵隙 * 6;
    const 座標X3 = 寸法.外横 / 2 - 寸法.盤隙 - 鍵特殊幅2 - 寸法.鍵基本横幅 * 3 - 寸法.鍵隙 * 4;
    鍵定義(座標X1, 座標Y1, 座標Y2, 座標Z1, 座標Z2, 鍵特殊幅2, 'Z1');
    鍵定義(座標X3, 座標Y1, 座標Y2, 座標Z1, 座標Z2, 座標X3 - 座標X2, 'S');
    Array(2).fill(null).forEach((_, 進捗) => {
      鍵定義(座標X1 + (寸法.鍵基本横幅 + 寸法.鍵隙) * (進捗 + 1), 座標Y1, 座標Y2, 座標Z1, 座標Z2, 寸法.鍵基本横幅, `5.H${進捗}`);
    });
    Array(3).fill(null).forEach((_, 進捗) => {
      const 座標X1 = 寸法.盤隙 - 寸法.外横 / 2 + 寸法.鍵基本横幅 * (進捗 + 1) + 寸法.鍵隙 * 進捗;
      鍵定義(座標X1, (座標Y1 + 座標Y2) / 2, 座標Y2, (座標Z1 + 座標Z2) / 2, 座標Z2, 寸法.鍵基本横幅, `H${進捗}0`);
      if (進捗 === 1) {
        鍵定義(座標X1, 座標Y1, (座標Y1 + 座標Y2) / 2, 座標Z1, (座標Z1 + 座標Z2) / 2, 寸法.鍵基本横幅, 'H11');
      }
    });
  }
});
coordinates.鍵E1 = { ...coordinates['鍵2.0.11'], X: 寸法.盤隙 - 寸法.外横 / 2 };
coordinates.鍵E2 = { ...coordinates['鍵2.0.11'], X: 寸法.盤隙 - 寸法.外横 / 2 + 鍵特殊幅1 };
coordinates.鍵E3 = { ...coordinates['鍵2.0.12'], X: 寸法.盤隙 - 寸法.外横 / 2 + 鍵特殊幅1 };
coordinates.鍵E4 = { ...coordinates['鍵2.0.12'], X: 寸法.盤隙 - 寸法.外横 / 2 + 鍵特殊幅2 };
coordinates.鍵E5 = { ...coordinates['鍵3.0.12'], X: 寸法.盤隙 - 寸法.外横 / 2 + 鍵特殊幅2 };
coordinates.鍵E6 = { ...coordinates['鍵3.0.12'], X: 寸法.盤隙 - 寸法.外横 / 2 };
surfaces.KNE = ['鍵E1', '鍵E2', '鍵E3', '鍵E4', '鍵E5', '鍵E6'];

const 指縦心 = 寸法.外縦 - 寸法.盤前 + 寸法.盤前 / 2;
[1, -1].forEach((左右係数, 左右) => {
  [-1, 1].forEach((前後係数, 前後) => {
    const 距離Z = 指縦心 + (寸法.盤前 / 2 - 寸法.指隙) * 前後係数;
    const 座標Z = Math.cos(寸法.下傾斜) * 距離Z - 寸法.外縦 / 2;
    const 座標Y = 上下位置 + 寸法.下厚 - Math.sin(寸法.下傾斜) * 距離Z;
    coordinates[`指${左右}${前後}`] = { X: 寸法.指幅 / 2 * 左右係数, Y: 座標Y, Z: 座標Z };
  });
});
surfaces.YB = ['指01', '指11', '指10', '指00'];

// const colors = {
//   HT: '#506077',
//   BN: '#333344',
//   KN: '#333344',
//   MN: '#aaaaaa',
//   SI: '#222222',
//   YB: '#333344',
// }
// const strokeColors = {
//   default: '#000000',
// };
