import moment from 'moment';

// mock data
const brinsonData = {
  columns: [
    '组合比例',
    '基准比例',
    '超配比例',
    '行业表现',
    '组合贡献',
    '基准贡献',
    '超额贡献',
    '行业配置',
    '选股+交叉',
  ],
  index: [
    '交通运输',
    '休闲服务',
    '传媒',
    '公用事业',
    '农林牧渔',
    '化工',
    '医药生物',
    '商业贸易',
    '国防军工',
    '家用电器',
    '建筑材料',
    '建筑装饰',
    '房地产',
    '有色金属',
    '机械设备',
    '汽车',
    '电子',
    '电气设备',
    '纺织服装',
    '综合',
    '计算机',
    '轻工制造',
    '通信',
    '采掘',
    '钢铁',
    '银行',
    '非银金融',
    '食品饮料',
    '合计',
  ],
  data: [
    [0.0, 0.03734, -0.03734, -0.0491362257, 0.0, -0.0018347467, 0.0019347467, 0.0017347467, 0.0],
    [0.0, 0.00611, -0.00611, -0.0728227727, 0.0, -0.0004449471, 0.0004449471, 0.0004449471, 0.0],
    [0.0, 0.04437, -0.04437, -0.0768231915, 0.0, -0.003408645, 0.003408645, 0.003408645, 0.0],
    [
      0.038350907,
      0.0408,
      -0.002449093,
      -0.024020312,
      -0.0033822653,
      -0.0009800287,
      -0.0024022366,
      0.000058828,
      -0.0024610646,
    ],
    [0.0, 0.03947, -0.03947, -0.018486955, 0.0, -0.0007296801, 0.0007296801, 0.0007296801, 0.0],
    [
      0.0394436267,
      0.08499,
      -0.0455463733,
      -0.0087050752,
      0.0006399241,
      -0.0007398443,
      0.0013797684,
      0.0003964846,
      0.0009832838,
    ],
    [
      0.2224515374,
      0.10626,
      0.1161915374,
      0.1386781713,
      0.0555590164,
      0.0147359425,
      0.0408230739,
      0.0161132299,
      0.024709844,
    ],
    [0.0, 0.03151, -0.03151, 0.0252119741, 0.0, 0.0007944293, -0.0007944293, -0.0007944293, 0.0],
    [0.0, 0.02017, -0.02017, 0.0294468642, 0.0, 0.0005939433, -0.0005939433, -0.0005939433, 0.0],
    [
      0.0378779116,
      0.02039,
      0.0174879116,
      -0.0617338885,
      -0.0064070543,
      -0.001258754,
      -0.0051483003,
      -0.0010795968,
      -0.0040687036,
    ],
    [0.0, 0.02291, -0.02291, -0.0874192029, 0.0, -0.0020027739, 0.0020027739, 0.0020027739, 0.0],
    [
      0.0365623645,
      0.01871,
      0.0178523645,
      -0.1187267805,
      -0.0034026889,
      -0.0022213781,
      -0.0011813109,
      -0.0021195538,
      0.0009382429,
    ],
    [
      0.0518308211,
      0.06141,
      -0.0095791789,
      -0.0907267004,
      -0.009519824,
      -0.0055715267,
      -0.0039482974,
      0.0008690873,
      -0.0048173847,
    ],
    [0.0, 0.05484, -0.05484, -0.0630180355, 0.0, -0.0034559091, 0.0034559091, 0.0034559091, 0.0],
    [0.0, 0.04539, -0.04539, -0.0702090068, 0.0, -0.0031867868, 0.0031867868, 0.0031867868, 0.0],
    [
      0.0785527845,
      0.0269,
      0.0516527845,
      -0.044122337,
      -0.0042755748,
      -0.0011868909,
      -0.003088684,
      -0.0022790416,
      -0.0008096424,
    ],
    [
      0.0438924267,
      0.07379,
      -0.0298975733,
      -0.0420305256,
      -0.0071355486,
      -0.0031014325,
      -0.0040341161,
      0.0012566107,
      -0.0052907268,
    ],
    [
      0.0407657674,
      0.05056,
      -0.0097942326,
      -0.0261083124,
      0.0014981912,
      -0.0013200363,
      0.0028182274,
      0.0002557109,
      0.0025625165,
    ],
    [0.0, 0.00437, -0.00437, -0.0036019682, 0.0, -0.0000157406, 0.0000157406, 0.0000157406, 0.0],
    [0.0, 0.01077, -0.01077, -0.055010355, 0.0, -0.0005924615, 0.0005924615, 0.0005924615, 0.0],
    [
      0.0202002769,
      0.07737,
      -0.0571697231,
      0.0952332583,
      0.0061060228,
      0.0073681972,
      -0.0012621744,
      -0.005444459,
      0.0041822847,
    ],
    [
      0.0200407891,
      0.02163,
      -0.0015892109,
      -0.0628422983,
      -0.000974399,
      -0.0013592789,
      0.0003848799,
      0.0000998697,
      0.0002850102,
    ],
    [0.0, 0.01567, -0.01567, -0.0159762767, 0.0, -0.0002503483, 0.0002503483, 0.0002503483, 0.0],
    [0.0, 0.01702, -0.01702, -0.1397801266, 0.0, -0.0023790578, 0.0023790578, 0.0023790578, 0.0],
    [0.0, 0.01996, -0.01996, -0.1363552823, 0.0, -0.0027216514, 0.0027216514, 0.0027216514, 0.0],
    [
      0.2523223654,
      0.00397,
      0.2483523654,
      -0.14183063,
      -0.0268854631,
      -0.0005630676,
      -0.0263223955,
      -0.0352239724,
      0.008901577,
    ],
    [
      0.0380392221,
      0.01408,
      0.0239592221,
      -0.1275518839,
      -0.0027639205,
      -0.0017959305,
      -0.00096799,
      -0.0030560439,
      0.0020880539,
    ],
    [
      0.0796691996,
      0.02914,
      0.0505291996,
      0.1729263035,
      -0.0027174851,
      0.0050390725,
      -0.0077565576,
      0.0087378277,
      -0.0164943853,
    ],
    [
      null,
      null,
      null,
      null,
      -0.0036610694,
      -0.0125893321,
      0.0089282627,
      -0.0017806429,
      0.0107089056,
    ],
  ],
};

//=========================

const barraData = {
  columns: ['组合暴露', '基准暴露', '相对暴露', '因子收益率', '组合贡献', '基准贡献', '超额贡献'],
  index: [
    'Beta',
    'BooktoPrice',
    'EarningsYield',
    'Growth',
    'Leverage',
    'Liquidity',
    'Momentum',
    'NonlinearSize',
    'ResidualVolatility',
    'Size',
    '休闲服务',
    '传媒',
    '公用事业',
    '农林牧渔',
    '化工',
    '医药生物',
    '商业贸易',
    '国防军工',
    '家用电器',
    '建筑材料',
    '建筑装饰',
    '房地产',
    '有色金属',
    '机械设备',
    '汽车',
    '电子',
    '电气设备',
    '纺织服装',
    '综合',
    '计算机',
    '轻工制造',
    '通信',
    '采掘',
    '钢铁',
    '银行',
    '非银金融',
    '食品饮料',
    '行业因子',
    '组合',
    '个股选择',
  ],
  data: [
    [
      -0.6663592789,
      0.9700872927,
      -1.6364465716,
      -0.0024128488,
      0.0016078242,
      -0.0023406739,
      0.0039484981,
    ],
    [
      -0.1252630913,
      -0.7077821926,
      0.5825191013,
      0.0039622438,
      -0.0004963229,
      -0.0028044056,
      0.0023080827,
    ],
    [
      0.7232006769,
      -0.8838204632,
      1.6070211401,
      -0.0061637782,
      -0.0044576486,
      0.0054476733,
      -0.0099053219,
    ],
    [
      0.7232006769,
      -0.8838204632,
      1.6070211401,
      -0.0061637782,
      -0.0044576486,
      0.0054476733,
      -0.0099053219,
    ],
    [
      -0.2712114155,
      0.1552424634,
      -0.426453879,
      -0.0016837332,
      0.0004566477,
      -0.0002613869,
      0.0007180346,
    ],
    [
      -0.0001197712,
      0.0866123129,
      -0.0867320841,
      -0.0098936496,
      0.000001185,
      -0.0008569119,
      0.0008580968,
    ],
    [
      0.1441780734,
      -0.2401759931,
      0.3843540665,
      -0.0075812338,
      -0.0010930477,
      0.0018208304,
      -0.002913878,
    ],
    [
      -0.4862062528,
      0.6852946285,
      -1.1715008813,
      0.0063980054,
      -0.0031107502,
      0.0043845187,
      -0.007495269,
    ],
    [
      -0.1861025153,
      -0.1445354074,
      -0.0415671079,
      -0.001674982,
      0.0003117184,
      0.0002420942,
      0.0000696242,
    ],
    [
      0.6044768005,
      -1.4044384389,
      2.0089152395,
      -0.0009784313,
      -0.000591439,
      0.0013741465,
      -0.0019655855,
    ],
    [0.0, 0.00691, -0.00691, 0.0331652248, 0.0, 0.0002291717, -0.0002291717],
    [0.0, 0.03763, -0.03763, -0.0427034207, 0.0, -0.0016069297, 0.0016069297],
    [0.0199724371, 0.03899, -0.0190175629, 0.0352994761, 0.0007050166, 0.0013763266, -0.00067131],
    [0.0, 0.03947, -0.03947, 0.0661493843, 0.0, 0.0026109162, -0.0026109162],
    [0.0578220965, 0.08468, -0.0268579035, 0.0479290379, 0.0027713575, 0.0040586309, -0.0012872735],
    [0.2224515374, 0.10621, 0.1162415374, 0.2333194106, 0.0519022616, 0.0247808546, 0.027121407],
    [0.0, 0.02702, -0.02702, 0.0693217922, 0.0, 0.0018730748, -0.0018730748],
    [0.0, 0.01191, -0.01191, 0.0234446219, 0.0, 0.0002792254, -0.0002792254],
    [
      0.0378779116,
      0.02196,
      0.0159179116,
      -0.0097696942,
      -0.0003700556,
      -0.0002145425,
      -0.0001555131,
    ],
    [0.0, 0.02291, -0.02291, -0.0172123586, 0.0, -0.0003943351, 0.0003943351],
    [
      0.0365623645,
      0.01839,
      0.0181723645,
      -0.0153194569,
      -0.0005601156,
      -0.0002817248,
      -0.0002783908,
    ],
    [
      0.0518308211,
      0.06141,
      -0.0095791789,
      -0.0366503987,
      -0.0018996203,
      -0.002250701,
      0.0003510807,
    ],
    [0.0, 0.05677, -0.05677, -0.0311072143, 0.0, -0.0017659566, 0.0017659566],
    [0.0, 0.05427, -0.05427, -0.067460318, 0.0, -0.0036610715, 0.0036610715],
    [
      0.0785527845,
      0.02437,
      0.0541827845,
      -0.004320061,
      -0.0003393528,
      -0.0001052799,
      -0.0002340729,
    ],
    [
      0.0438924267,
      0.06446,
      -0.0205675733,
      -0.0277512345,
      -0.001218069,
      -0.0017888446,
      0.0005707756,
    ],
    [0.0407657674, 0.05184, -0.0110742326, 0.011456281, 0.0004670241, 0.0005938936, -0.0001268695],
    [0.0, 0.00812, -0.00812, 0.0347416183, 0.0, 0.0002821019, -0.0002821019],
    [0.0, 0.01669, -0.01669, 0.0087980685, 0.0, 0.0001468398, -0.0001468398],
    [0.0202002769, 0.0754, -0.0551997231, 0.0885164259, 0.0017880563, 0.0066741385, -0.0048860822],
    [0.0200407891, 0.02035, -0.0003092109, 0.0106911997, 0.0002142601, 0.0002175659, -0.0000033058],
    [0.0, 0.01496, -0.01496, 0.0038970105, 0.0, 0.0000582993, -0.0000582993],
    [0.0, 0.01947, -0.01947, -0.0426707092, 0.0, -0.0008307987, 0.0008307987],
    [0.0, 0.01996, -0.01996, -0.1265695651, 0.0, -0.0025263285, 0.0025263285],
    [0.2523223654, 0.0, 0.2523223654, -0.0518566144, -0.0130845836, 0.0, -0.0130845836],
    [
      0.0380392221,
      0.00995,
      0.0280892221,
      -0.0464541369,
      -0.0017670792,
      -0.0004622187,
      -0.0013048606,
    ],
    [0.0796691996, 0.02914, 0.0505291996, 0.0685312625, 0.0054598308, 0.001997001, 0.0034628298],
    [null, null, null, null, 0.0440689308, 0.0292893088, 0.014779622],
    [null, null, null, null, -0.0036610694, -0.0125893321, 0.0089282627],
    [null, null, null, null, -0.0359005183, -0.054332199, 0.0184316806],
  ],
};

//======barraAnalysisData========
var barraAnalysisData = {
  "columns": ["绝对暴露", "基准暴露", "相对暴露", "绝对风险", "相对风险"],
  "index": ["const", "Beta", "Growth", "ResidualVolatility", "EarningsYield", "Momentum", "NonlinearSize", "BooktoPrice", "Leverage", "Liquidity", "Size", "休闲服务", "传媒", "公用事业", "农林牧渔", "化工", "医药生物", "商业贸易", "国防军工", "家用电器", "建筑材料", "建筑装饰", "房地产", "有色金属", "机械设备", "汽车", "电子", "电气设备", "纺织服装", "综合", "计算机", "轻工制造", "通信", "采掘", "钢铁", "银行", "非银金融", "食品饮料", "行业因子", "个股特质", "组合"],
  "data": [
    [null, null, null, 3891.5343737045, -0.3840874087],
    [-0.6663592789, 0.9700872927, -1.6364465716, -459.5311136777, 1520.0249865296],
    [0.7232006769, -0.8838204632, 1.6070211401, -36.1137922415, 241.6560969294],
    [-0.1861025153, -0.1445354074, -0.0415671079, -50.6408483928, 24.5164403598],
    [0.7232006769, -0.8838204632, 1.6070211401, 72.7947219428, 705.8180473725],
    [0.1441780734, -0.2401759931, 0.3843540665, -10.0125920537, 85.394913645],
    [-0.4862062528, 0.6852946285, -1.1715008813, -33.5763982357, 68.2859489036],
    [-0.1252630913, -0.7077821926, 0.5825191013, 4.6746338544, -10.1593001541],
    [-0.2712114155, 0.1552424634, -0.426453879, 6.674724349, 47.7435948771],
    [-0.0001197712, 0.0866123129, -0.0867320841, -0.0790891404, 76.7893182917],
    [0.6044768005, -1.4044384389, 2.0089152395, -342.3049453469, 2028.5672788039],
    [0.0, 0.00691, -0.00691, 0.0, -15.4657395561],
    [0.0, 0.03763, -0.03763, 0.0, -18.5346470662],
    [0.0199724371, 0.03899, -0.0190175629, -12.3879601331, -5.8700009795],
    [0.0, 0.03947, -0.03947, 0.0, 6.3584941012],
    [0.0578220965, 0.08468, -0.0268579035, 5.8025400682, 3.0044976112],
    [0.2224515374, 0.10621, 0.1162415374, 28.8803869735, 8.9152643953],
    [0.0, 0.02702, -0.02702, 0.0, 14.8926025447],
    [0.0, 0.01191, -0.01191, 0.0, 8.4377888266],
    [0.0378779116, 0.02196, 0.0159179116, 13.1195501742, 6.523536651],
    [0.0, 0.02291, -0.02291, 0.0, 17.5913534111],
    [0.0365623645, 0.01839, 0.0181723645, -17.7866369998, 8.0814403248],
    [0.0518308211, 0.06141, -0.0095791789, -22.9552225122, -6.534879354],
    [0.0, 0.05677, -0.05677, 0.0, -4.1825435033],
    [0.0, 0.05427, -0.05427, 0.0, 27.137391022],
    [0.0785527845, 0.02437, 0.0541827845, -3.5489995201, 6.0299222685],
    [0.0438924267, 0.06446, -0.0205675733, 3.9592257231, -8.5343252907],
    [0.0407657674, 0.05184, -0.0110742326, -9.0254906486, -5.7152441364],
    [0.0, 0.00812, -0.00812, 0.0, 0.8102726234],
    [0.0, 0.01669, -0.01669, 0.0, -33.2351109369],
    [0.0202002769, 0.0754, -0.0551997231, 15.7923796419, 44.0200698603],
    [0.0200407891, 0.02035, -0.0003092109, 14.501831448, 1.1831465884],
    [0.0, 0.01496, -0.01496, 0.0, 4.2688748288],
    [0.0, 0.01947, -0.01947, 0.0, 4.2522307413],
    [0.0, 0.01996, -0.01996, 0.0, -18.6730995952],
    [0.2523223654, 0.0, 0.2523223654, 175.1747549739, -283.0390439326],
    [0.0380392221, 0.00995, 0.0280892221, -23.0494795847, 38.5411962567],
    [0.0796691996, 0.02914, 0.0505291996, 60.8266172816, 19.9468851979],
    [null, null, null, 229.303496886, -179.7896670979],
    [null, null, null, 3891.5343737045, -0.3840874087],
    [null, null, null, 7164.2575453526, 4608.0794836433]
  ]
}

//==============

const strategyInfo = {
  strategy_id: 'S0000000000000000000000000000382',
  strategy_code: 'S0000162',
  strategy_name: 'PE选股策略',
  strategy_version: '1.1.1',
};

//======对外提供mock========
export const getFakeBrinson = {
  brinsonData,
  strategyInfo,
  barraData,
  barraAnalysisData,
};

export default {
  getFakeBrinson,
};
