const PALETA_CORTE = ["#8b3a1a", "#c8943a", "#4a7c3f", "#6fa65e", "#2d5c24", "#d4843a", "#a0622b", "#e8a84c", "#5c4033", "#3a6b4a"];

const DADOS_CORTE = {
  "rebanhoCorte": [
    {
      "uf": "Brasil",
      "2012": 211279082,
      "2013": 211764292,
      "2014": 212366132,
      "2015": 215220508,
      "2016": 218190768,
      "2017": 215003578,
      "2018": 213809445,
      "2019": 214689984,
      "2020": 217836282,
      "2021": 224602112
    },
    {
      "uf": "Mato Grosso",
      "2012": 28740802,
      "2013": 28395205,
      "2014": 28592183,
      "2015": 29364042,
      "2016": 30296096,
      "2017": 29725378,
      "2018": 30199598,
      "2019": 31654882,
      "2020": 32338031,
      "2021": 32424958
    },
    {
      "uf": "Goiás",
      "2012": 22045776,
      "2013": 21580398,
      "2014": 21538072,
      "2015": 21887720,
      "2016": 22919070,
      "2017": 22835005,
      "2018": 22651910,
      "2019": 22823401,
      "2020": 23626608,
      "2021": 24293954
    },
    {
      "uf": "Pará",
      "2012": 18605051,
      "2013": 19165028,
      "2014": 19911217,
      "2015": 20271618,
      "2016": 20476783,
      "2017": 20585367,
      "2018": 20628651,
      "2019": 20953429,
      "2020": 22432348,
      "2021": 23921005
    },
    {
      "uf": "Minas Gerais",
      "2012": 23965914,
      "2013": 24201256,
      "2014": 23707042,
      "2015": 23768959,
      "2016": 23637803,
      "2017": 21971713,
      "2018": 21810311,
      "2019": 22020979,
      "2020": 22165606,
      "2021": 22856143
    },
    {
      "uf": "Mato Grosso do Sul",
      "2012": 21498382,
      "2013": 21047274,
      "2014": 21003830,
      "2015": 21357398,
      "2016": 21800990,
      "2017": 21474693,
      "2018": 20896700,
      "2019": 19407908,
      "2020": 19027086,
      "2021": 18608503
    }
  ],
  "abateBovinos": [
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2013,
      "quantidadeAbatida": 8127808,
      "pesoTotalCarcacas": 1897242050
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2013,
      "quantidadeAbatida": 1092625,
      "pesoTotalCarcacas": 260629702
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2013,
      "quantidadeAbatida": 1386736,
      "pesoTotalCarcacas": 333764517
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2013,
      "quantidadeAbatida": 767468,
      "pesoTotalCarcacas": 179605468
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2013,
      "quantidadeAbatida": 8536749,
      "pesoTotalCarcacas": 2008043072
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2013,
      "quantidadeAbatida": 1016884,
      "pesoTotalCarcacas": 242584739
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2013,
      "quantidadeAbatida": 1441812,
      "pesoTotalCarcacas": 350403439
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2013,
      "quantidadeAbatida": 923669,
      "pesoTotalCarcacas": 220888154
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2013,
      "quantidadeAbatida": 8859325,
      "pesoTotalCarcacas": 2123654691
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2013,
      "quantidadeAbatida": 1009406,
      "pesoTotalCarcacas": 247250265
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2013,
      "quantidadeAbatida": 1544496,
      "pesoTotalCarcacas": 389945602
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2013,
      "quantidadeAbatida": 927069,
      "pesoTotalCarcacas": 230643370
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2013,
      "quantidadeAbatida": 8888188,
      "pesoTotalCarcacas": 2137780394
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2013,
      "quantidadeAbatida": 1001898,
      "pesoTotalCarcacas": 244010695
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2013,
      "quantidadeAbatida": 1464813,
      "pesoTotalCarcacas": 370943101
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2013,
      "quantidadeAbatida": 848025,
      "pesoTotalCarcacas": 209495299
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2014,
      "quantidadeAbatida": 8372872,
      "pesoTotalCarcacas": 1952430785
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2014,
      "quantidadeAbatida": 1041021,
      "pesoTotalCarcacas": 249373624
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2014,
      "quantidadeAbatida": 1339992,
      "pesoTotalCarcacas": 323093898
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2014,
      "quantidadeAbatida": 870072,
      "pesoTotalCarcacas": 204710704
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2014,
      "quantidadeAbatida": 8538904,
      "pesoTotalCarcacas": 2011493075
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2014,
      "quantidadeAbatida": 997767,
      "pesoTotalCarcacas": 243142229
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2014,
      "quantidadeAbatida": 1308340,
      "pesoTotalCarcacas": 314933256
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2014,
      "quantidadeAbatida": 896220,
      "pesoTotalCarcacas": 217931607
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2014,
      "quantidadeAbatida": 8470880,
      "pesoTotalCarcacas": 2040402870
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2014,
      "quantidadeAbatida": 906484,
      "pesoTotalCarcacas": 223417734
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2014,
      "quantidadeAbatida": 1327509,
      "pesoTotalCarcacas": 335982327
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2014,
      "quantidadeAbatida": 840720,
      "pesoTotalCarcacas": 215437948
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2014,
      "quantidadeAbatida": 8525062,
      "pesoTotalCarcacas": 2058898089
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2014,
      "quantidadeAbatida": 986381,
      "pesoTotalCarcacas": 243642222
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2014,
      "quantidadeAbatida": 1376385,
      "pesoTotalCarcacas": 351772142
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2014,
      "quantidadeAbatida": 802839,
      "pesoTotalCarcacas": 206263928
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2015,
      "quantidadeAbatida": 7739650,
      "pesoTotalCarcacas": 1837935944
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2015,
      "quantidadeAbatida": 922225,
      "pesoTotalCarcacas": 225420145
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2015,
      "quantidadeAbatida": 1160732,
      "pesoTotalCarcacas": 284350423
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2015,
      "quantidadeAbatida": 764324,
      "pesoTotalCarcacas": 188445416
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2015,
      "quantidadeAbatida": 7633038,
      "pesoTotalCarcacas": 1847443418
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2015,
      "quantidadeAbatida": 840065,
      "pesoTotalCarcacas": 210102216
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2015,
      "quantidadeAbatida": 1105386,
      "pesoTotalCarcacas": 279970495
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2015,
      "quantidadeAbatida": 764927,
      "pesoTotalCarcacas": 192499877
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2015,
      "quantidadeAbatida": 7585455,
      "pesoTotalCarcacas": 1879018575
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2015,
      "quantidadeAbatida": 804833,
      "pesoTotalCarcacas": 202289945
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2015,
      "quantidadeAbatida": 1150894,
      "pesoTotalCarcacas": 304004553
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2015,
      "quantidadeAbatida": 780234,
      "pesoTotalCarcacas": 205009441
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2015,
      "quantidadeAbatida": 7693659,
      "pesoTotalCarcacas": 1929037420
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2015,
      "quantidadeAbatida": 841618,
      "pesoTotalCarcacas": 213803922
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2015,
      "quantidadeAbatida": 1123793,
      "pesoTotalCarcacas": 303196751
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2015,
      "quantidadeAbatida": 751454,
      "pesoTotalCarcacas": 200841507
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2016,
      "quantidadeAbatida": 7319737,
      "pesoTotalCarcacas": 1801222499
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2016,
      "quantidadeAbatida": 861912,
      "pesoTotalCarcacas": 216247052
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2016,
      "quantidadeAbatida": 1117319,
      "pesoTotalCarcacas": 291546922
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2016,
      "quantidadeAbatida": 649091,
      "pesoTotalCarcacas": 165346145
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2016,
      "quantidadeAbatida": 7654362,
      "pesoTotalCarcacas": 1878297539
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2016,
      "quantidadeAbatida": 879412,
      "pesoTotalCarcacas": 219928847
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2016,
      "quantidadeAbatida": 1154018,
      "pesoTotalCarcacas": 301648584
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2016,
      "quantidadeAbatida": 783500,
      "pesoTotalCarcacas": 196364905
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2016,
      "quantidadeAbatida": 7321596,
      "pesoTotalCarcacas": 1829142091
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2016,
      "quantidadeAbatida": 750930,
      "pesoTotalCarcacas": 187488401
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2016,
      "quantidadeAbatida": 1152162,
      "pesoTotalCarcacas": 309920374
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2016,
      "quantidadeAbatida": 741950,
      "pesoTotalCarcacas": 198494027
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2016,
      "quantidadeAbatida": 7406353,
      "pesoTotalCarcacas": 1850115566
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2016,
      "quantidadeAbatida": 800025,
      "pesoTotalCarcacas": 201422826
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2016,
      "quantidadeAbatida": 1153960,
      "pesoTotalCarcacas": 310674479
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2016,
      "quantidadeAbatida": 649765,
      "pesoTotalCarcacas": 171759881
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2017,
      "quantidadeAbatida": 7398120,
      "pesoTotalCarcacas": 1796564506
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2017,
      "quantidadeAbatida": 859597,
      "pesoTotalCarcacas": 214215768
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2017,
      "quantidadeAbatida": 1116752,
      "pesoTotalCarcacas": 283306885
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2017,
      "quantidadeAbatida": 748030,
      "pesoTotalCarcacas": 184686232
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2017,
      "quantidadeAbatida": 7423406,
      "pesoTotalCarcacas": 1832185134
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2017,
      "quantidadeAbatida": 831159,
      "pesoTotalCarcacas": 208100997
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2017,
      "quantidadeAbatida": 1072071,
      "pesoTotalCarcacas": 281187204
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2017,
      "quantidadeAbatida": 784354,
      "pesoTotalCarcacas": 200248529
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2017,
      "quantidadeAbatida": 7986421,
      "pesoTotalCarcacas": 2019808382
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2017,
      "quantidadeAbatida": 876838,
      "pesoTotalCarcacas": 224117249
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2017,
      "quantidadeAbatida": 1325222,
      "pesoTotalCarcacas": 363622045
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2017,
      "quantidadeAbatida": 844985,
      "pesoTotalCarcacas": 223021087
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2017,
      "quantidadeAbatida": 8058716,
      "pesoTotalCarcacas": 2032979683
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2017,
      "quantidadeAbatida": 868153,
      "pesoTotalCarcacas": 222270616
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2017,
      "quantidadeAbatida": 1290572,
      "pesoTotalCarcacas": 353588031
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2017,
      "quantidadeAbatida": 802436,
      "pesoTotalCarcacas": 210680055
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2018,
      "quantidadeAbatida": 7773005,
      "pesoTotalCarcacas": 1892512091
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2018,
      "quantidadeAbatida": 867966,
      "pesoTotalCarcacas": 215470209
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2018,
      "quantidadeAbatida": 1207016,
      "pesoTotalCarcacas": 310451954
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2018,
      "quantidadeAbatida": 787678,
      "pesoTotalCarcacas": 189969136
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2018,
      "quantidadeAbatida": 7767877,
      "pesoTotalCarcacas": 1908072206
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2018,
      "quantidadeAbatida": 814645,
      "pesoTotalCarcacas": 204207272
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2018,
      "quantidadeAbatida": 1169683,
      "pesoTotalCarcacas": 303322905
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2018,
      "quantidadeAbatida": 805458,
      "pesoTotalCarcacas": 203010515
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2018,
      "quantidadeAbatida": 8316874,
      "pesoTotalCarcacas": 2115653757
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2018,
      "quantidadeAbatida": 799041,
      "pesoTotalCarcacas": 203605907
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2018,
      "quantidadeAbatida": 1425835,
      "pesoTotalCarcacas": 392912243
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2018,
      "quantidadeAbatida": 852913,
      "pesoTotalCarcacas": 227248408
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2018,
      "quantidadeAbatida": 8184932,
      "pesoTotalCarcacas": 2073277577
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2018,
      "quantidadeAbatida": 811896,
      "pesoTotalCarcacas": 204964230
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2018,
      "quantidadeAbatida": 1416816,
      "pesoTotalCarcacas": 387099520
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2018,
      "quantidadeAbatida": 761656,
      "pesoTotalCarcacas": 200954130
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2019,
      "quantidadeAbatida": 7927343,
      "pesoTotalCarcacas": 1950324390
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2019,
      "quantidadeAbatida": 893526,
      "pesoTotalCarcacas": 221725019
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2019,
      "quantidadeAbatida": 1351418,
      "pesoTotalCarcacas": 347974432
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2019,
      "quantidadeAbatida": 775034,
      "pesoTotalCarcacas": 191123919
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2019,
      "quantidadeAbatida": 7938871,
      "pesoTotalCarcacas": 1977662002
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2019,
      "quantidadeAbatida": 913867,
      "pesoTotalCarcacas": 228219070
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2019,
      "quantidadeAbatida": 1332504,
      "pesoTotalCarcacas": 351787833
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2019,
      "quantidadeAbatida": 731679,
      "pesoTotalCarcacas": 185267139
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2019,
      "quantidadeAbatida": 8498729,
      "pesoTotalCarcacas": 2197488180
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2019,
      "quantidadeAbatida": 946116,
      "pesoTotalCarcacas": 243288793
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2019,
      "quantidadeAbatida": 1529387,
      "pesoTotalCarcacas": 423713800
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2019,
      "quantidadeAbatida": 763914,
      "pesoTotalCarcacas": 206738715
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2019,
      "quantidadeAbatida": 8080907,
      "pesoTotalCarcacas": 2093376654
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2019,
      "quantidadeAbatida": 831527,
      "pesoTotalCarcacas": 215541951
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2019,
      "quantidadeAbatida": 1436587,
      "pesoTotalCarcacas": 396489247
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2019,
      "quantidadeAbatida": 742804,
      "pesoTotalCarcacas": 200910086
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2020,
      "quantidadeAbatida": 7336730,
      "pesoTotalCarcacas": 1857227340
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2020,
      "quantidadeAbatida": 837386,
      "pesoTotalCarcacas": 212703767
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2020,
      "quantidadeAbatida": 1237026,
      "pesoTotalCarcacas": 327915262
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2020,
      "quantidadeAbatida": 617357,
      "pesoTotalCarcacas": 157292259
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2020,
      "quantidadeAbatida": 7403577,
      "pesoTotalCarcacas": 1906767702
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2020,
      "quantidadeAbatida": 881862,
      "pesoTotalCarcacas": 227735533
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2020,
      "quantidadeAbatida": 1184937,
      "pesoTotalCarcacas": 322869194
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2020,
      "quantidadeAbatida": 699385,
      "pesoTotalCarcacas": 183765914
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2020,
      "quantidadeAbatida": 7773780,
      "pesoTotalCarcacas": 2074151538
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2020,
      "quantidadeAbatida": 895124,
      "pesoTotalCarcacas": 236621695
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2020,
      "quantidadeAbatida": 1415999,
      "pesoTotalCarcacas": 406357737
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2020,
      "quantidadeAbatida": 713445,
      "pesoTotalCarcacas": 196934713
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2020,
      "quantidadeAbatida": 7372949,
      "pesoTotalCarcacas": 1986741722
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2020,
      "quantidadeAbatida": 775049,
      "pesoTotalCarcacas": 207228182
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2020,
      "quantidadeAbatida": 1252543,
      "pesoTotalCarcacas": 362227006
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2020,
      "quantidadeAbatida": 762944,
      "pesoTotalCarcacas": 212075199
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2021,
      "quantidadeAbatida": 6597323,
      "pesoTotalCarcacas": 1731900258
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2021,
      "quantidadeAbatida": 772176,
      "pesoTotalCarcacas": 203499110
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2021,
      "quantidadeAbatida": 1042867,
      "pesoTotalCarcacas": 287267642
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2021,
      "quantidadeAbatida": 644337,
      "pesoTotalCarcacas": 169388236
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2021,
      "quantidadeAbatida": 7126495,
      "pesoTotalCarcacas": 1887228796
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2021,
      "quantidadeAbatida": 796423,
      "pesoTotalCarcacas": 209517373
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2021,
      "quantidadeAbatida": 1151543,
      "pesoTotalCarcacas": 320580818
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2021,
      "quantidadeAbatida": 785881,
      "pesoTotalCarcacas": 212847504
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2021,
      "quantidadeAbatida": 7019544,
      "pesoTotalCarcacas": 1911647975
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2021,
      "quantidadeAbatida": 676508,
      "pesoTotalCarcacas": 179864021
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2021,
      "quantidadeAbatida": 1187360,
      "pesoTotalCarcacas": 345064870
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2021,
      "quantidadeAbatida": 761644,
      "pesoTotalCarcacas": 213924595
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2021,
      "quantidadeAbatida": 6961491,
      "pesoTotalCarcacas": 1925484112
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2021,
      "quantidadeAbatida": 710428,
      "pesoTotalCarcacas": 194405987
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2021,
      "quantidadeAbatida": 1235674,
      "pesoTotalCarcacas": 369106615
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2021,
      "quantidadeAbatida": 777733,
      "pesoTotalCarcacas": 220934115
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2022,
      "quantidadeAbatida": 7011231,
      "pesoTotalCarcacas": 1849443215
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2022,
      "quantidadeAbatida": 797811,
      "pesoTotalCarcacas": 207081344
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2022,
      "quantidadeAbatida": 1121577,
      "pesoTotalCarcacas": 309781721
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2022,
      "quantidadeAbatida": 695415,
      "pesoTotalCarcacas": 180929796
    },
    {
      "uf": "Brasil",
      "trimestre": "2º",
      "ano": 2022,
      "quantidadeAbatida": 7428815,
      "pesoTotalCarcacas": 1958428411
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "2º",
      "ano": 2022,
      "quantidadeAbatida": 850385,
      "pesoTotalCarcacas": 221836117
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "2º",
      "ano": 2022,
      "quantidadeAbatida": 1110558,
      "pesoTotalCarcacas": 310685433
    },
    {
      "uf": "Goiás",
      "trimestre": "2º",
      "ano": 2022,
      "quantidadeAbatida": 725826,
      "pesoTotalCarcacas": 189466559
    },
    {
      "uf": "Brasil",
      "trimestre": "3º",
      "ano": 2022,
      "quantidadeAbatida": 7963127,
      "pesoTotalCarcacas": 2164840416
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "3º",
      "ano": 2022,
      "quantidadeAbatida": 835957,
      "pesoTotalCarcacas": 223795926
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "3º",
      "ano": 2022,
      "quantidadeAbatida": 1281630,
      "pesoTotalCarcacas": 376295124
    },
    {
      "uf": "Goiás",
      "trimestre": "3º",
      "ano": 2022,
      "quantidadeAbatida": 858783,
      "pesoTotalCarcacas": 238600702
    },
    {
      "uf": "Brasil",
      "trimestre": "4º",
      "ano": 2022,
      "quantidadeAbatida": 7544411,
      "pesoTotalCarcacas": 2039607755
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "4º",
      "ano": 2022,
      "quantidadeAbatida": 857629,
      "pesoTotalCarcacas": 229524775
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "4º",
      "ano": 2022,
      "quantidadeAbatida": 1196215,
      "pesoTotalCarcacas": 353757478
    },
    {
      "uf": "Goiás",
      "trimestre": "4º",
      "ano": 2022,
      "quantidadeAbatida": 724545,
      "pesoTotalCarcacas": 198677707
    },
    {
      "uf": "Brasil",
      "trimestre": "1º",
      "ano": 2023,
      "quantidadeAbatida": 7344275,
      "pesoTotalCarcacas": 1904141401
    },
    {
      "uf": "Mato Grosso do Sul",
      "trimestre": "1º",
      "ano": 2023,
      "quantidadeAbatida": 811903,
      "pesoTotalCarcacas": 214496341
    },
    {
      "uf": "Mato Grosso",
      "trimestre": "1º",
      "ano": 2023,
      "quantidadeAbatida": 1204687,
      "pesoTotalCarcacas": 332379632
    },
    {
      "uf": "Goiás",
      "trimestre": "1º",
      "ano": 2023,
      "quantidadeAbatida": 732272,
      "pesoTotalCarcacas": 184335406
    }
  ],
  "pastagensBR": {
    "municipio": [
      {
        "cidade": "Corumbá",
        "uf": "MS",
        "ranking": "1º",
        "areaPastagemHa": 1708472.48
      },
      {
        "cidade": "São Félix Do Xingu",
        "uf": "PA",
        "ranking": "2º",
        "areaPastagemHa": 1600607.82
      },
      {
        "cidade": "Ribas Do Rio Pardo",
        "uf": "MS",
        "ranking": "3º",
        "areaPastagemHa": 1112048.29
      },
      {
        "cidade": "Porto Velho",
        "uf": "RO",
        "ranking": "4º",
        "areaPastagemHa": 818026.44
      },
      {
        "cidade": "Marabá",
        "uf": "PA",
        "ranking": "5º",
        "areaPastagemHa": 719730.83
      },
      {
        "cidade": "Altamira",
        "uf": "PA",
        "ranking": "6º",
        "areaPastagemHa": 719143.76
      },
      {
        "cidade": "Cáceres",
        "uf": "MT",
        "ranking": "7º",
        "areaPastagemHa": 716023.57
      },
      {
        "cidade": "Novo Repartimento",
        "uf": "PA",
        "ranking": "8º",
        "areaPastagemHa": 670576.12
      },
      {
        "cidade": "Cumaru Do Norte",
        "uf": "PA",
        "ranking": "9º",
        "areaPastagemHa": 635407.17
      },
      {
        "cidade": "Juara",
        "uf": "MT",
        "ranking": "10º",
        "areaPastagemHa": 622870.77
      }
    ],
    "uf": [
      {
        "uf": "MG",
        "ranking": "1º",
        "areaPastagemHa": 20109292.77
      },
      {
        "uf": "MT",
        "ranking": "2º",
        "areaPastagemHa": 19633370.92
      },
      {
        "uf": "BA",
        "ranking": "3º",
        "areaPastagemHa": 18637522.98
      },
      {
        "uf": "PA",
        "ranking": "4º",
        "areaPastagemHa": 16919162.33
      },
      {
        "uf": "MS",
        "ranking": "5º",
        "areaPastagemHa": 15254883.29
      },
      {
        "uf": "GO",
        "ranking": "6º",
        "areaPastagemHa": 13390807.13
      },
      {
        "uf": "RO",
        "ranking": "7º",
        "areaPastagemHa": 7885767.23
      },
      {
        "uf": "RS",
        "ranking": "8º",
        "areaPastagemHa": 6931323.82
      },
      {
        "uf": "TO",
        "ranking": "9º",
        "areaPastagemHa": 6586015.98
      },
      {
        "uf": "MA",
        "ranking": "10º",
        "areaPastagemHa": 6571715.24
      }
    ],
    "bioma": [
      {
        "bioma": "Cerrado",
        "ranking": "1º",
        "areaPastagemHa": 49874051.4
      },
      {
        "bioma": "Amazônia",
        "ranking": "2º",
        "areaPastagemHa": 45488575.92
      },
      {
        "bioma": "Mata Atlântica",
        "ranking": "3º",
        "areaPastagemHa": 30503234.4
      },
      {
        "bioma": "Caatinga",
        "ranking": "4º",
        "areaPastagemHa": 23149852.82
      },
      {
        "bioma": "Pampa",
        "ranking": "5º",
        "areaPastagemHa": 5940863.8
      },
      {
        "bioma": "Pantanal",
        "ranking": "6º",
        "areaPastagemHa": 4010371.89
      }
    ]
  },
  "pastagensCO": {
    "municipio": [
      {
        "cidade": "Corumbá",
        "uf": "MS",
        "ranking": "1º",
        "areaPastagemHa": 1708472.48
      },
      {
        "cidade": "Ribas Do Rio Pardo",
        "uf": "MS",
        "ranking": "2º",
        "areaPastagemHa": 1112048.29
      },
      {
        "cidade": "Cáceres",
        "uf": "MT",
        "ranking": "3º",
        "areaPastagemHa": 716023.57
      },
      {
        "cidade": "Juara",
        "uf": "MT",
        "ranking": "4º",
        "areaPastagemHa": 622870.77
      },
      {
        "cidade": "Aquidauana",
        "uf": "MS",
        "ranking": "5º",
        "areaPastagemHa": 600027.66
      },
      {
        "cidade": "Porto Murtinho",
        "uf": "MS",
        "ranking": "6º",
        "areaPastagemHa": 538029.99
      },
      {
        "cidade": "Vila Bela Da Santíssima Trindade",
        "uf": "MT",
        "ranking": "7º",
        "areaPastagemHa": 524943.37
      },
      {
        "cidade": "Três Lagoas",
        "uf": "MS",
        "ranking": "8º",
        "areaPastagemHa": 521921.65
      },
      {
        "cidade": "Rio Verde De Mato Grosso",
        "uf": "MS",
        "ranking": "9º",
        "areaPastagemHa": 484128.78
      },
      {
        "cidade": "Água Clara",
        "uf": "MS",
        "ranking": "10º",
        "areaPastagemHa": 481469.56
      }
    ],
    "uf": [
      {
        "uf": "MT",
        "ranking": "1º",
        "areaPastagemHa": 19633370.92
      },
      {
        "uf": "MS",
        "ranking": "2º",
        "areaPastagemHa": 15254883.29
      },
      {
        "uf": "GO",
        "ranking": "3º",
        "areaPastagemHa": 13390807.13
      },
      {
        "uf": "DF",
        "ranking": "4º",
        "areaPastagemHa": 83529.42
      }
    ],
    "bioma": [
      {
        "bioma": "Cerrado",
        "ranking": "1º",
        "areaPastagemHa": 31367252.77
      },
      {
        "bioma": "Amazônia",
        "ranking": "2º",
        "areaPastagemHa": 11544969.82
      },
      {
        "bioma": "Pantanal",
        "ranking": "3º",
        "areaPastagemHa": 4010371.89
      },
      {
        "bioma": "Mata Atlântica",
        "ranking": "4º",
        "areaPastagemHa": 1439996.27
      }
    ]
  },
  "qualidadePastagens": [
    {
      "ano": 2021,
      "bioma": "Centro-Oeste",
      "uf": "CO",
      "municipio": "Todos",
      "areaIbgeHa": 7.63922701591167e+16,
      "classeQualidade": "Ausente",
      "corLegenda": "rgb(0, 115, 63)",
      "areaPastagemHa": 11264087.39
    },
    {
      "ano": 2021,
      "bioma": "Centro-Oeste",
      "uf": "CO",
      "municipio": "Todos",
      "areaIbgeHa": 751063.5,
      "classeQualidade": "Intermediário",
      "corLegenda": "rgb(248, 200, 210)",
      "areaPastagemHa": 19015638.34
    },
    {
      "ano": 2021,
      "bioma": "Centro-Oeste",
      "uf": "CO",
      "municipio": "Todos",
      "areaIbgeHa": 0,
      "classeQualidade": "Severa",
      "corLegenda": "rgb(208, 44, 23)",
      "areaPastagemHa": 13441512.96
    }
  ],
  "precos": [
    {
      "ano": 2001,
      "precoBoiGordoArroba": 42.35,
      "precoAbateKg": 2.52
    },
    {
      "ano": 2002,
      "precoBoiGordoArroba": 47.94,
      "precoAbateKg": 2.74
    },
    {
      "ano": 2003,
      "precoBoiGordoArroba": 56.73,
      "precoAbateKg": 3.2
    },
    {
      "ano": 2004,
      "precoBoiGordoArroba": 59.94,
      "precoAbateKg": 3.39
    },
    {
      "ano": 2005,
      "precoBoiGordoArroba": 54.63,
      "precoAbateKg": 3.33
    },
    {
      "ano": 2006,
      "precoBoiGordoArroba": 52.76,
      "precoAbateKg": 3.2
    },
    {
      "ano": 2007,
      "precoBoiGordoArroba": 60.93,
      "precoAbateKg": 3.62
    },
    {
      "ano": 2008,
      "precoBoiGordoArroba": 84.16,
      "precoAbateKg": 5.03
    },
    {
      "ano": 2009,
      "precoBoiGordoArroba": 78.85,
      "precoAbateKg": 4.93
    },
    {
      "ano": 2010,
      "precoBoiGordoArroba": 88.52,
      "precoAbateKg": 5.55
    },
    {
      "ano": 2011,
      "precoBoiGordoArroba": 101.79,
      "precoAbateKg": 6.31
    },
    {
      "ano": 2012,
      "precoBoiGordoArroba": 94.88,
      "precoAbateKg": 6.2
    },
    {
      "ano": 2013,
      "precoBoiGordoArroba": 102.64,
      "precoAbateKg": 6.58
    },
    {
      "ano": 2014,
      "precoBoiGordoArroba": 126.35,
      "precoAbateKg": 7.98
    },
    {
      "ano": 2015,
      "precoBoiGordoArroba": 145.45,
      "precoAbateKg": 9.4
    },
    {
      "ano": 2016,
      "precoBoiGordoArroba": 152.89,
      "precoAbateKg": 9.88
    },
    {
      "ano": 2017,
      "precoBoiGordoArroba": 138.91,
      "precoAbateKg": 9.71
    },
    {
      "ano": 2018,
      "precoBoiGordoArroba": 144.99,
      "precoAbateKg": 9.88
    },
    {
      "ano": 2019,
      "precoBoiGordoArroba": 163.14,
      "precoAbateKg": 11.28
    },
    {
      "ano": 2020,
      "precoBoiGordoArroba": 226.29,
      "precoAbateKg": 15.27
    },
    {
      "ano": 2021,
      "precoBoiGordoArroba": 305.65,
      "precoAbateKg": 19.83
    },
    {
      "ano": 2022,
      "precoBoiGordoArroba": 317.74,
      "precoAbateKg": 20.49
    },
    {
      "ano": 2023,
      "precoBoiGordoArroba": 285.82,
      "precoAbateKg": 19.01
    }
  ],
  "consumo": [
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2012,
      "valor": 2861.39
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2013,
      "valor": 2513.94
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2014,
      "valor": 2461.7
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2015,
      "valor": 2232.39
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2016,
      "valor": 2080.31
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2017,
      "valor": 2046.12
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2018,
      "valor": 2081.06
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2019,
      "valor": 2098.47
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2020,
      "valor": 2091.93
    },
    {
      "pais": "RUS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2021,
      "valor": 2088.6
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2012,
      "valor": 2414.41
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2013,
      "valor": 2655.71
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2014,
      "valor": 2494.65
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2015,
      "valor": 2527.84
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2016,
      "valor": 2426.62
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2017,
      "valor": 2484.0
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2018,
      "valor": 2464.0
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2019,
      "valor": 2430.0
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2020,
      "valor": 2382.08
    },
    {
      "pais": "ARG",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2021,
      "valor": 2401.03
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2012,
      "valor": 7448.02
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2013,
      "valor": 7973.9
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2014,
      "valor": 7543.15
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2015,
      "valor": 7293.16
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2016,
      "valor": 7478.07
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2017,
      "valor": 7533.47
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2018,
      "valor": 7559.78
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2019,
      "valor": 7593.87
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2020,
      "valor": 7422.82
    },
    {
      "pais": "BRA",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2021,
      "valor": 7521.84
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2012,
      "valor": 65185.45
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2013,
      "valor": 66372.18
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2014,
      "valor": 66024.41
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2015,
      "valor": 66223.27
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2016,
      "valor": 67505.86
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2017,
      "valor": 68461.96
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2018,
      "valor": 69499.69
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2019,
      "valor": 70474.26
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2020,
      "valor": 70881.97
    },
    {
      "pais": "WLD",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2021,
      "valor": 71451.48
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2012,
      "valor": 6142.15
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2013,
      "valor": 6422.51
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2014,
      "valor": 6440.54
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2015,
      "valor": 6690.27
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2016,
      "valor": 6833.55
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2017,
      "valor": 7150.77
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2018,
      "valor": 7377.4
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2019,
      "valor": 8369.28
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2020,
      "valor": 8606.82
    },
    {
      "pais": "CHN",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2021,
      "valor": 8546.71
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2012,
      "valor": 18541.14
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2013,
      "valor": 18695.69
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2014,
      "valor": 18068.88
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2015,
      "valor": 18089.83
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2016,
      "valor": 18329.0
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2017,
      "valor": 18.52
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2018,
      "valor": 19071.02
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2019,
      "valor": 20025.16
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2020,
      "valor": 20128.41
    },
    {
      "pais": "BRICS",
      "indicador": "MEATCONSUMP",
      "produto": "BEEF",
      "medida": "THND_TONNE",
      "frequencia": "A",
      "ano": 2021,
      "valor": 20218.2
    }
  ],
  "projecaoProducaoCarne": [
    {
      "safra": "2021/22",
      "valorProjetado": 8423.1,
      "limiteInferior": null,
      "limiteSuperior": null,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2022/23",
      "valorProjetado": 8668.4,
      "limiteInferior": null,
      "limiteSuperior": null,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2023/24",
      "valorProjetado": 8791.18,
      "limiteInferior": 7792.96,
      "limiteSuperior": 9789.4,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2024/25",
      "valorProjetado": 8859.24,
      "limiteInferior": 7447.54,
      "limiteSuperior": 10270.94,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2025/26",
      "valorProjetado": 8971.79,
      "limiteInferior": 7423.54,
      "limiteSuperior": 10520.04,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2026/27",
      "valorProjetado": 9104.21,
      "limiteInferior": 7430.51,
      "limiteSuperior": 10777.91,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2027/28",
      "valorProjetado": 9220.47,
      "limiteInferior": 7379.24,
      "limiteSuperior": 11061.7,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2028/29",
      "valorProjetado": 9329.52,
      "limiteInferior": 7334.78,
      "limiteSuperior": 11324.26,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2029/30",
      "valorProjetado": 9444.44,
      "limiteInferior": 7323.87,
      "limiteSuperior": 11565.0,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2030/31",
      "valorProjetado": 9561.97,
      "limiteInferior": 7322.64,
      "limiteSuperior": 11801.3,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2031/32",
      "valorProjetado": 9677.38,
      "limiteInferior": 7319.91,
      "limiteSuperior": 12034.85,
      "unidadeMedida": "Mil t"
    }
  ],
  "projecaoConsumoCarne": [
    {
      "safra": "2021/22",
      "valorProjetado": 5508.7,
      "limiteInferior": null,
      "limiteSuperior": null,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2022/23",
      "valorProjetado": 5608.31,
      "limiteInferior": null,
      "limiteSuperior": null,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2023/24",
      "valorProjetado": 5818.19,
      "limiteInferior": 4943.19,
      "limiteSuperior": 6693.18,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2024/25",
      "valorProjetado": 5806.4,
      "limiteInferior": 4568.97,
      "limiteSuperior": 7043.83,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2025/26",
      "valorProjetado": 5746.86,
      "limiteInferior": 4413.7,
      "limiteSuperior": 7080.02,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2026/27",
      "valorProjetado": 5783.31,
      "limiteInferior": 4360.85,
      "limiteSuperior": 7205.78,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2027/28",
      "valorProjetado": 5840.45,
      "limiteInferior": 4272.25,
      "limiteSuperior": 7408.64,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2028/29",
      "valorProjetado": 5856.01,
      "limiteInferior": 4154.52,
      "limiteSuperior": 7557.5,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2029/30",
      "valorProjetado": 5862.62,
      "limiteInferior": 4062.03,
      "limiteSuperior": 7663.2,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2030/31",
      "valorProjetado": 5887.23,
      "limiteInferior": 3992.72,
      "limiteSuperior": 7781.73,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2031/32",
      "valorProjetado": 5915.72,
      "limiteInferior": 3922.38,
      "limiteSuperior": 7909.06,
      "unidadeMedida": "Mil t"
    }
  ],
  "projecaoExportacaoCarne": [
    {
      "safra": "2021/22",
      "valorProjetado": 2976.9,
      "limiteInferior": null,
      "limiteSuperior": null,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2022/23",
      "valorProjetado": 3125.72,
      "limiteInferior": null,
      "limiteSuperior": null,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2023/24",
      "valorProjetado": 3234.94,
      "limiteInferior": 2844.87,
      "limiteSuperior": 3625.01,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2024/25",
      "valorProjetado": 3333.2,
      "limiteInferior": 2700.62,
      "limiteSuperior": 3965.78,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2025/26",
      "valorProjetado": 3428.43,
      "limiteInferior": 2604.54,
      "limiteSuperior": 4252.33,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2026/27",
      "valorProjetado": 3522.82,
      "limiteInferior": 2539.85,
      "limiteSuperior": 4505.8,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2027/28",
      "valorProjetado": 3616.98,
      "limiteInferior": 2496.21,
      "limiteSuperior": 4737.75,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2028/29",
      "valorProjetado": 3711.07,
      "limiteInferior": 2467.41,
      "limiteSuperior": 4954.74,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2029/30",
      "valorProjetado": 3805.15,
      "limiteInferior": 2449.61,
      "limiteSuperior": 5160.69,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2030/31",
      "valorProjetado": 3899.22,
      "limiteInferior": 2440.35,
      "limiteSuperior": 5358.09,
      "unidadeMedida": "Mil t"
    },
    {
      "safra": "2031/32",
      "valorProjetado": 3993.29,
      "limiteInferior": 2437.94,
      "limiteSuperior": 5548.65,
      "unidadeMedida": "Mil t"
    }
  ]
};

// Atributo adaptado: na aba "qualidade_pastagens", "area_past_ha" existe, mas os valores
// vieram como inteiros com 8 casas decimais embutidas. O dado hardcoded acima usa /100000000
// para representar areaPastagemHa em hectares. O gráfico agrega por classeQualidade, por isso
// bioma, uf e municipio foram consolidados como Centro-Oeste, CO e Todos.

const rootsGraficosCorte = new Map();

const filtrosCorte = {
  indicador: "all",
  anoInicio: null,
  anoFim: null,
  ufs: new Set(),
  municipios: new Set(),
  paises: new Set(),
  trimestre: "all",
  areaMin: 0,
  metricaAbate: "quantidade",
  topPastagens: 10
};

const nomesPaisesCorte = {
  WLD: "Mundo",
  BRICS: "BRICS",
  CHN: "China",
  BRA: "Brasil",
  ARG: "Argentina",
  RUS: "Rússia"
};

const ufCanonicaCorte = {
  Brasil: "Brasil",
  Goiás: "GO",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  Pará: "PA"
};

const indicadorParaAbaCorte = {
  rebanho: "ct-rebanho",
  abate: "ct-rebanho",
  precos: "ct-precos",
  consumo: "ct-mundial",
  projecoes: "ct-projecoes",
  pastagens: "ct-pastagens"
};

function existe(id) { return !!document.getElementById(id); }
function porId(id) { return document.getElementById(id); }
function anoSafra(safra) { return Number(String(safra).slice(0, 4)); }
function formatarMilhoes(valor) { return Math.round((valor / 1000000) * 100) / 100; }
function periodoLabel() { return `${filtrosCorte.anoInicio}-${filtrosCorte.anoFim}`; }
function dentroPeriodo(ano) { return Number(ano) >= filtrosCorte.anoInicio && Number(ano) <= filtrosCorte.anoFim; }
function nomePais(codigo) { return nomesPaisesCorte[codigo] || codigo; }
function canonUf(uf) { return ufCanonicaCorte[uf] || uf; }
function atualizarTexto(id, texto) { const el = porId(id); if (el) el.textContent = texto; }

function criarRoot(id) {
  limparGrafico(id);
  const root = am5.Root.new(id);
  root.setThemes([am5themes_Animated.new(root)]);
  rootsGraficosCorte.set(id, root);
  return root;
}

function limparGrafico(id) {
  const root = rootsGraficosCorte.get(id);
  if (root) root.dispose();
  rootsGraficosCorte.delete(id);
  const el = porId(id);
  if (el) el.innerHTML = "";
}

function mostrarSemDadosChart(id, mensagem = "Sem dados para os filtros selecionados.") {
  limparGrafico(id);
  const el = porId(id);
  if (!el) return;
  el.innerHTML = `<div class="filter-empty d-block h-100 d-flex align-items-center justify-content-center text-center">${mensagem}</div>`;
}

function configurarEixo(axis) {
  axis.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif", fill: am5.color("#5a5a5a") });
}

function criarLegenda(chart, root) {
  const legend = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  legend.labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif" });
  return legend;
}

function anosDeObjetoSerie(dados) {
  return [...new Set(dados.flatMap(item => Object.keys(item).filter(chave => /^\d{4}$/.test(chave)).map(Number)))].sort((a, b) => a - b);
}

function anosDisponiveisCorte() {
  const anos = new Set();
  anosDeObjetoSerie(DADOS_CORTE.rebanhoCorte).forEach(ano => anos.add(ano));
  DADOS_CORTE.abateBovinos.forEach(item => anos.add(item.ano));
  DADOS_CORTE.precos.forEach(item => anos.add(item.ano));
  DADOS_CORTE.consumo.forEach(item => anos.add(item.ano));
  DADOS_CORTE.projecaoProducaoCarne.forEach(item => anos.add(anoSafra(item.safra)));
  return [...anos].sort((a, b) => a - b);
}

function dadosSeriePorAno(dados, campoNome, anos, transformador = valor => valor) {
  return anos.map(ano => {
    const linha = { ano: String(ano) };
    dados.forEach(item => { linha[item[campoNome]] = transformador(item[String(ano)]); });
    return linha;
  });
}

function criarLinhas(id, dados, campoCategoria, series, sufixo = "") {
  const seriesValidas = series.filter(nome => dados.some(item => item[nome] !== null && item[nome] !== undefined));
  if (!dados.length || !seriesValidas.length) return mostrarSemDadosChart(id);
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: campoCategoria, renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 35 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY); eixoX.data.setAll(dados);
  seriesValidas.forEach((nome, idx) => {
    const serie = chart.series.push(am5xy.LineSeries.new(root, { name: nome, xAxis: eixoX, yAxis: eixoY, valueYField: nome, categoryXField: campoCategoria, connect: false, stroke: am5.color(PALETA_CORTE[idx % PALETA_CORTE.length]), fill: am5.color(PALETA_CORTE[idx % PALETA_CORTE.length]), tooltip: am5.Tooltip.new(root, { labelText: `{name}: {valueY}${sufixo}` }) }));
    serie.strokes.template.setAll({ strokeWidth: 2 });
    serie.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: serie.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    serie.data.setAll(dados);
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(600, 60);
}

function criarBarrasHorizontais(id, dados, categoria, valor, sufixo = "") {
  const filtrados = dados.filter(item => Number(item[valor]) >= filtrosCorte.areaMin);
  if (!filtrados.length) return mostrarSemDadosChart(id);
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
  const eixoY = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: categoria, renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 16, inversed: true }) }));
  const eixoX = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoY.get("renderer").labels.template.setAll({ oversizedBehavior: "truncate", maxWidth: 135 });
  eixoY.data.setAll(filtrados);
  const serie = chart.series.push(am5xy.ColumnSeries.new(root, { xAxis: eixoX, yAxis: eixoY, valueXField: valor, categoryYField: categoria, tooltip: am5.Tooltip.new(root, { labelText: `{categoryY}: {valueX}${sufixo}` }) }));
  serie.columns.template.setAll({ cornerRadiusTR: 3, cornerRadiusBR: 3, height: am5.percent(62) });
  serie.columns.template.adapters.add("fill", (_fill, target) => am5.color(PALETA_CORTE[(target.dataItem?.get("index") || 0) % PALETA_CORTE.length]));
  serie.columns.template.adapters.add("stroke", (_stroke, target) => am5.color(PALETA_CORTE[(target.dataItem?.get("index") || 0) % PALETA_CORTE.length]));
  serie.data.setAll(filtrados);
  chart.appear(600, 60);
}

function criarPizza(id, dados, categoria, valor) {
  const filtrados = dados.filter(item => Number(item[valor]) > 0);
  if (!filtrados.length) return mostrarSemDadosChart(id);
  const root = criarRoot(id);
  const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
  const serie = chart.series.push(am5percent.PieSeries.new(root, { valueField: valor, categoryField: categoria }));
  serie.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
  serie.get("colors").set("colors", PALETA_CORTE.map(cor => am5.color(cor)));
  serie.data.setAll(filtrados);
  const legend = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
  legend.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
  legend.data.setAll(serie.dataItems);
  chart.appear(600, 60);
}

function criarBarrasAgrupadas(id, dados, categoria, series, sufixo = "") {
  if (!dados.length) return mostrarSemDadosChart(id);
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: categoria, renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 12 }) }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoX.get("renderer").labels.template.setAll({ oversizedBehavior: "truncate", maxWidth: 100 });
  eixoX.data.setAll(dados);
  series.forEach((cfg, idx) => {
    const serie = chart.series.push(am5xy.ColumnSeries.new(root, { name: cfg.nome, xAxis: eixoX, yAxis: eixoY, valueYField: cfg.campo, categoryXField: categoria, clustered: true, tooltip: am5.Tooltip.new(root, { labelText: `${cfg.nome}: {valueY}${sufixo}` }) }));
    serie.columns.template.setAll({ width: am5.percent(45), cornerRadiusTL: 3, cornerRadiusTR: 3, fill: am5.color(PALETA_CORTE[idx % PALETA_CORTE.length]), stroke: am5.color(PALETA_CORTE[idx % PALETA_CORTE.length]) });
    serie.data.setAll(dados);
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(600, 60);
}

function criarGraficoRebanho() {
  const anos = anosDeObjetoSerie(DADOS_CORTE.rebanhoCorte).filter(dentroPeriodo);
  const dadosBase = filtrosCorte.ufs.size ? DADOS_CORTE.rebanhoCorte.filter(item => filtrosCorte.ufs.has(canonUf(item.uf))) : DADOS_CORTE.rebanhoCorte;
  const estados = dadosBase.map(item => item.uf);
  atualizarTexto("subRebanhoCorte", `Milhões de cabeças (${periodoLabel()})`);
  if (!anos.length) {
    atualizarTexto("tituloRebanhoPartic", "Participação no Rebanho Nacional");
    mostrarSemDadosChart("chartRebanhoCorte");
    mostrarSemDadosChart("chartRebanhoPartic");
    return;
  }
  criarLinhas("chartRebanhoCorte", dadosSeriePorAno(dadosBase, "uf", anos, formatarMilhoes), "ano", estados, " mi cab.");

  const anoFinal = Math.max(...anos);
  atualizarTexto("tituloRebanhoPartic", `Participação no Rebanho Nacional (${anoFinal || filtrosCorte.anoFim})`);
  criarPizza("chartRebanhoPartic", dadosBase.filter(item => item.uf !== "Brasil" && item[String(anoFinal)]).map(item => ({ uf: item.uf, quantidadeCabecas: item[String(anoFinal)] })), "uf", "quantidadeCabecas");
}

function criarGraficoAbate() {
  const ufsPadrao = ["Brasil", "Goiás", "Mato Grosso", "Mato Grosso do Sul"];
  const ufs = filtrosCorte.ufs.size ? ufsPadrao.filter(uf => filtrosCorte.ufs.has(canonUf(uf))) : ufsPadrao;
  const registrosFiltrados = DADOS_CORTE.abateBovinos.filter(item => dentroPeriodo(item.ano) && ufs.includes(item.uf) && (filtrosCorte.trimestre === "all" || item.trimestre === filtrosCorte.trimestre));
  const anos = [...new Set(registrosFiltrados.map(item => item.ano))].sort((a, b) => a - b);
  const acumulado = anos.map(ano => {
    const linha = { ano: String(ano) };
    ufs.forEach(uf => {
      const registros = registrosFiltrados.filter(item => item.uf === uf && item.ano === ano);
      linha[uf] = filtrosCorte.metricaAbate === "peso"
        ? Math.round(registros.reduce((total, item) => total + item.pesoTotalCarcacas, 0) / 1000000)
        : formatarMilhoes(registros.reduce((total, item) => total + item.quantidadeAbatida, 0));
    });
    return linha;
  });
  const sufixo = filtrosCorte.metricaAbate === "peso" ? " mil t" : " mi cab.";
  const trimestre = filtrosCorte.trimestre === "all" ? "todos os trimestres" : `${filtrosCorte.trimestre} trimestre`;
  atualizarTexto("subAbateBovinos", `${filtrosCorte.metricaAbate === "peso" ? "Peso total das carcaças" : "Cabeças abatidas"} · ${trimestre} · ${periodoLabel()}`);
  criarLinhas("chartAbateBovinos", acumulado, "ano", ufs, sufixo);
}

function criarGraficoPrecos() {
  const data = DADOS_CORTE.precos.filter(item => dentroPeriodo(item.ano)).map(item => ({ ...item, ano: String(item.ano) }));
  atualizarTexto("subPrecosCorte", `Série anual filtrada (${periodoLabel()})`);
  if (!data.length) return mostrarSemDadosChart("chartPrecos");
  const root = criarRoot("chartPrecos");
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 35 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  const eixoY2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
  configurarEixo(eixoX); configurarEixo(eixoY); configurarEixo(eixoY2); eixoX.data.setAll(data);
  const barras = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Boi gordo (R$/@)", xAxis: eixoX, yAxis: eixoY, valueYField: "precoBoiGordoArroba", categoryXField: "ano", tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/@" }) }));
  barras.columns.template.setAll({ width: am5.percent(60), cornerRadiusTL: 3, cornerRadiusTR: 3, fill: am5.color(PALETA_CORTE[0]), stroke: am5.color(PALETA_CORTE[0]) });
  barras.data.setAll(data);
  const linha = chart.series.push(am5xy.LineSeries.new(root, { name: "Abate bovinos (R$/kg)", xAxis: eixoX, yAxis: eixoY2, valueYField: "precoAbateKg", categoryXField: "ano", stroke: am5.color(PALETA_CORTE[1]), fill: am5.color(PALETA_CORTE[1]), tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/kg" }) }));
  linha.strokes.template.setAll({ strokeWidth: 2.5 });
  linha.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: linha.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
  linha.data.setAll(data);
  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(600, 60);
}

function criarGraficoConsumo() {
  const paises = filtrosCorte.paises.size ? [...filtrosCorte.paises] : [...new Set(DADOS_CORTE.consumo.map(item => item.pais))];
  const dados = [...new Set(DADOS_CORTE.consumo.map(item => item.ano))].filter(dentroPeriodo).sort((a, b) => a - b).map(ano => {
    const linha = { ano: String(ano) };
    paises.forEach(pais => {
      const item = DADOS_CORTE.consumo.find(d => d.pais === pais && d.ano === ano);
      linha[nomePais(pais)] = item ? item.valor : null;
    });
    return linha;
  });
  atualizarTexto("subConsumoCarne", `Mil toneladas — OECD (${periodoLabel()})`);
  criarLinhas("chartConsumoCarne", dados, "ano", paises.map(nomePais), " mil t");
}

function dadosProjecaoFiltrados(dados) {
  return dados.filter(item => dentroPeriodo(anoSafra(item.safra)));
}

function criarGraficoProjecao(id, dados, subtituloId) {
  const data = dadosProjecaoFiltrados(dados);
  atualizarTexto(subtituloId, `Mil toneladas — cenário central, inferior e superior (${periodoLabel()})`);
  if (!data.length) return mostrarSemDadosChart(id);
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "safra", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 24 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY); eixoX.data.setAll(data);
  [
    { campo: "limiteSuperior", nome: "Limite superior", cor: PALETA_CORTE[3], tracejado: true },
    { campo: "valorProjetado", nome: "Valor projetado", cor: PALETA_CORTE[0], tracejado: false },
    { campo: "limiteInferior", nome: "Limite inferior", cor: PALETA_CORTE[1], tracejado: true }
  ].forEach(cfg => {
    const serie = chart.series.push(am5xy.LineSeries.new(root, { name: cfg.nome, xAxis: eixoX, yAxis: eixoY, valueYField: cfg.campo, categoryXField: "safra", connect: false, stroke: am5.color(cfg.cor), fill: am5.color(cfg.cor), tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY} mil t" }) }));
    serie.strokes.template.setAll({ strokeWidth: cfg.tracejado ? 1.5 : 2.5, strokeDasharray: cfg.tracejado ? [4, 3] : [] });
    serie.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: serie.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    serie.data.setAll(data);
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(600, 60);
}

function filtrarPastagemItens(dados, tipo) {
  let itens = [...dados];
  if (tipo === "municipio" && filtrosCorte.municipios.size) itens = itens.filter(item => filtrosCorte.municipios.has(item.cidade));
  if (tipo === "municipio" && filtrosCorte.ufs.size) itens = itens.filter(item => filtrosCorte.ufs.has(canonUf(item.uf)));
  if (tipo === "uf" && filtrosCorte.ufs.size) itens = itens.filter(item => filtrosCorte.ufs.has(canonUf(item.uf)));
  return itens.filter(item => Number(item.areaPastagemHa) >= filtrosCorte.areaMin).slice(0, filtrosCorte.topPastagens);
}

function criarGraficosPastagens() {
  criarBarrasHorizontais("chartPastagemUfBr", filtrarPastagemItens(DADOS_CORTE.pastagensBR.uf, "uf"), "uf", "areaPastagemHa", " ha");
  criarBarrasHorizontais("chartPastagemMunicipioBr", filtrarPastagemItens(DADOS_CORTE.pastagensBR.municipio, "municipio").map(item => ({ ...item, cidadeUf: `${item.cidade}/${item.uf}` })), "cidadeUf", "areaPastagemHa", " ha");
  criarPizza("chartPastagemBiomaBr", DADOS_CORTE.pastagensBR.bioma.filter(item => Number(item.areaPastagemHa) >= filtrosCorte.areaMin), "bioma", "areaPastagemHa");
  criarBarrasHorizontais("chartPastagemUfCo", filtrarPastagemItens(DADOS_CORTE.pastagensCO.uf, "uf"), "uf", "areaPastagemHa", " ha");
  criarBarrasHorizontais("chartPastagemMunicipioCo", filtrarPastagemItens(DADOS_CORTE.pastagensCO.municipio, "municipio").map(item => ({ ...item, cidadeUf: `${item.cidade}/${item.uf}` })), "cidadeUf", "areaPastagemHa", " ha");
  criarPizza("chartPastagemBiomaCo", DADOS_CORTE.pastagensCO.bioma.filter(item => Number(item.areaPastagemHa) >= filtrosCorte.areaMin), "bioma", "areaPastagemHa");
  criarPizza("chartQualidadePastagens", DADOS_CORTE.qualidadePastagens.filter(item => Number(item.areaPastagemHa) >= filtrosCorte.areaMin), "classeQualidade", "areaPastagemHa");
}

function criarGraficoCustoPastagens() {
  criarBarrasAgrupadas("chartCustoPastagens", [
    { nivel: "Manutenção (Baixa)", custoAtual: 272.86, custoProjetado: 317.77 },
    { nivel: "Moderada", custoAtual: 1159.62, custoProjetado: 1351.66 },
    { nivel: "Severa", custoAtual: 1727.99, custoProjetado: 2019.13 }
  ], "nivel", [
    { nome: "Custo atual", campo: "custoAtual" },
    { nome: "Projeção 2033", campo: "custoProjetado" }
  ], " R$/ha");
}

function valoresUfsCorte() {
  const ufs = new Set();
  DADOS_CORTE.rebanhoCorte.forEach(item => ufs.add(canonUf(item.uf)));
  DADOS_CORTE.abateBovinos.forEach(item => ufs.add(canonUf(item.uf)));
  DADOS_CORTE.pastagensBR.uf.forEach(item => ufs.add(canonUf(item.uf)));
  DADOS_CORTE.pastagensCO.uf.forEach(item => ufs.add(canonUf(item.uf)));
  DADOS_CORTE.pastagensBR.municipio.forEach(item => ufs.add(canonUf(item.uf)));
  DADOS_CORTE.pastagensCO.municipio.forEach(item => ufs.add(canonUf(item.uf)));
  return [...ufs].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function valoresMunicipiosCorte() {
  const municipios = [...DADOS_CORTE.pastagensBR.municipio, ...DADOS_CORTE.pastagensCO.municipio]
    .filter(item => !filtrosCorte.ufs.size || filtrosCorte.ufs.has(canonUf(item.uf)))
    .map(item => item.cidade);
  return [...new Set(municipios)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function valoresPaisesCorte() {
  return [...new Set(DADOS_CORTE.consumo.map(item => item.pais))].sort((a, b) => nomePais(a).localeCompare(nomePais(b), "pt-BR"));
}

function labelSelecao(set, total, todosLabel) {
  if (!set.size || set.size === total) return todosLabel;
  if (set.size === 1) return [...set][0];
  return `${set.size} selecionados`;
}

function renderizarMultiselect({ menuId, buscaId, botaoId, valores, selecionados, todosLabel, label = v => v, onChange }) {
  const menu = porId(menuId);
  const busca = porId(buscaId);
  const botao = porId(botaoId);
  if (!menu || !botao) return;
  const termo = (busca?.value || "").toLocaleLowerCase("pt-BR");
  const visiveis = valores.filter(valor => label(valor).toLocaleLowerCase("pt-BR").includes(termo));
  botao.textContent = labelSelecao(selecionados, valores.length, todosLabel);
  menu.innerHTML = visiveis.map(valor => `
    <label class="filter-option">
      <input type="checkbox" value="${valor}" ${selecionados.has(valor) ? "checked" : ""} />
      <span>${label(valor)}</span>
    </label>
  `).join("") || '<div class="filter-chip">Nenhum resultado</div>';
  menu.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) selecionados.add(input.value); else selecionados.delete(input.value);
      onChange?.();
      atualizarDashboardCorte();
    });
  });
}

function renderizarFiltrosMultiselect() {
  renderizarMultiselect({
    menuId: "filtroUfCorteMenu",
    buscaId: "buscaUfCorte",
    botaoId: "filtroUfCorteBtn",
    valores: valoresUfsCorte(),
    selecionados: filtrosCorte.ufs,
    todosLabel: "Todas",
    onChange: () => {
      const municipiosValidos = new Set(valoresMunicipiosCorte());
      filtrosCorte.municipios.forEach(municipio => { if (!municipiosValidos.has(municipio)) filtrosCorte.municipios.delete(municipio); });
      renderizarFiltrosMultiselect();
    }
  });
  renderizarMultiselect({
    menuId: "filtroMunicipioCorteMenu",
    buscaId: "buscaMunicipioCorte",
    botaoId: "filtroMunicipioCorteBtn",
    valores: valoresMunicipiosCorte(),
    selecionados: filtrosCorte.municipios,
    todosLabel: "Todos"
  });
  renderizarMultiselect({
    menuId: "filtroPaisCorteMenu",
    buscaId: "buscaPaisCorte",
    botaoId: "filtroPaisCorteBtn",
    valores: valoresPaisesCorte(),
    selecionados: filtrosCorte.paises,
    todosLabel: "Todos",
    label: nomePais
  });
}

function popularSelectAnos() {
  const anos = anosDisponiveisCorte();
  filtrosCorte.anoInicio = anos[0];
  filtrosCorte.anoFim = anos[anos.length - 1];
  ["filtroAnoInicioCorte", "filtroAnoFimCorte"].forEach(id => {
    const select = porId(id);
    if (!select) return;
    select.innerHTML = anos.map(ano => `<option value="${ano}">${ano}</option>`).join("");
  });
  porId("filtroAnoInicioCorte").value = filtrosCorte.anoInicio;
  porId("filtroAnoFimCorte").value = filtrosCorte.anoFim;
}

function atualizarChipsFiltros() {
  const el = porId("filtrosAtivosCorte");
  if (!el) return;
  const chips = [];
  chips.push(`Período: ${periodoLabel()}`);
  if (filtrosCorte.indicador !== "all") chips.push(`Indicador: ${filtrosCorte.indicador}`);
  if (filtrosCorte.ufs.size) chips.push(`UF: ${[...filtrosCorte.ufs].join(", ")}`);
  if (filtrosCorte.municipios.size) chips.push(`Municípios: ${[...filtrosCorte.municipios].join(", ")}`);
  if (filtrosCorte.paises.size) chips.push(`Países: ${[...filtrosCorte.paises].map(nomePais).join(", ")}`);
  if (filtrosCorte.trimestre !== "all") chips.push(`Trimestre: ${filtrosCorte.trimestre}`);
  if (filtrosCorte.areaMin > 0) chips.push(`Área mínima: ${Math.round(filtrosCorte.areaMin / 1000000)} mi ha`);
  el.innerHTML = chips.map(chip => `<span class="filter-chip">${chip}</span>`).join("");
}

function atualizarVisibilidadeIndicador() {
  document.querySelectorAll('[data-filter-group="indicador"] .filter-btn').forEach(btn => btn.classList.toggle("active", btn.dataset.filter === filtrosCorte.indicador));
  document.querySelectorAll("[data-category]").forEach(el => {
    el.style.display = filtrosCorte.indicador === "all" || el.dataset.category === filtrosCorte.indicador ? "" : "none";
  });
}

function switchTabCorte(id) {
  const btn = document.querySelector(`[data-tab="${id}"]`);
  if (btn) btn.click();
}

function mostrarMensagemGeralSemDados() {
  const el = porId("semDadosCorte");
  if (!el) return;
  const activeTab = document.querySelector("[data-tab-content].active");
  const algumGraficoComDados = [...(activeTab?.querySelectorAll(".chart-area") || [])].some(area => !area.textContent.includes("Sem dados"));
  el.style.display = algumGraficoComDados ? "none" : "block";
}

function renderizarAbaAtivaCorte() {
  const activeTab = document.querySelector("[data-tab-content].active");
  const tabId = activeTab?.id || "ct-rebanho";
  if (tabId === "ct-rebanho") {
    criarGraficoRebanho();
    criarGraficoAbate();
  } else if (tabId === "ct-precos") {
    criarGraficoPrecos();
  } else if (tabId === "ct-mundial") {
    criarGraficoConsumo();
  } else if (tabId === "ct-projecoes") {
    criarGraficoProjecao("chartProjecaoProducaoCarne", DADOS_CORTE.projecaoProducaoCarne, "subProjecaoProducao");
    criarGraficoProjecao("chartProjecaoConsumoCarne", DADOS_CORTE.projecaoConsumoCarne, "subProjecaoConsumo");
    criarGraficoProjecao("chartProjecaoExportacaoCarne", DADOS_CORTE.projecaoExportacaoCarne, "subProjecaoExportacao");
  } else if (tabId === "ct-pastagens") {
    criarGraficosPastagens();
  } else if (tabId === "ct-plano") {
    criarGraficoCustoPastagens();
  }
}

function atualizarDashboardCorte() {
  if (filtrosCorte.anoInicio > filtrosCorte.anoFim) {
    [filtrosCorte.anoInicio, filtrosCorte.anoFim] = [filtrosCorte.anoFim, filtrosCorte.anoInicio];
    porId("filtroAnoInicioCorte").value = filtrosCorte.anoInicio;
    porId("filtroAnoFimCorte").value = filtrosCorte.anoFim;
  }
  renderizarAbaAtivaCorte();
  renderizarFiltrosMultiselect();
  atualizarChipsFiltros();
  atualizarVisibilidadeIndicador();
  mostrarMensagemGeralSemDados();
}

function limparFiltrosCorte() {
  const anos = anosDisponiveisCorte();
  filtrosCorte.indicador = "all";
  filtrosCorte.anoInicio = anos[0];
  filtrosCorte.anoFim = anos[anos.length - 1];
  filtrosCorte.ufs.clear();
  filtrosCorte.municipios.clear();
  filtrosCorte.paises.clear();
  filtrosCorte.trimestre = "all";
  filtrosCorte.areaMin = 0;
  filtrosCorte.metricaAbate = "quantidade";
  filtrosCorte.topPastagens = 10;
  porId("filtroAnoInicioCorte").value = filtrosCorte.anoInicio;
  porId("filtroAnoFimCorte").value = filtrosCorte.anoFim;
  porId("filtroTrimestreCorte").value = "all";
  porId("filtroAreaMinCorte").value = "0";
  porId("filtroMetricaAbate").value = "quantidade";
  porId("filtroTopPastagens").value = "10";
  ["buscaUfCorte", "buscaMunicipioCorte", "buscaPaisCorte"].forEach(id => { const el = porId(id); if (el) el.value = ""; });
  atualizarDashboardCorte();
}

function configurarEventosFiltrosCorte() {
  document.querySelectorAll('[data-filter-group="indicador"] .filter-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      filtrosCorte.indicador = btn.dataset.filter;
      if (filtrosCorte.indicador !== "all") switchTabCorte(indicadorParaAbaCorte[filtrosCorte.indicador]);
      atualizarDashboardCorte();
    });
  });
  porId("filtroAnoInicioCorte")?.addEventListener("change", event => { filtrosCorte.anoInicio = Number(event.target.value); atualizarDashboardCorte(); });
  porId("filtroAnoFimCorte")?.addEventListener("change", event => { filtrosCorte.anoFim = Number(event.target.value); atualizarDashboardCorte(); });
  porId("filtroTrimestreCorte")?.addEventListener("change", event => { filtrosCorte.trimestre = event.target.value; atualizarDashboardCorte(); });
  porId("filtroAreaMinCorte")?.addEventListener("change", event => { filtrosCorte.areaMin = Number(event.target.value); atualizarDashboardCorte(); });
  porId("filtroMetricaAbate")?.addEventListener("change", event => { filtrosCorte.metricaAbate = event.target.value; atualizarDashboardCorte(); });
  porId("filtroTopPastagens")?.addEventListener("change", event => { filtrosCorte.topPastagens = Number(event.target.value); atualizarDashboardCorte(); });
  porId("btnLimparFiltrosCorte")?.addEventListener("click", limparFiltrosCorte);
  ["buscaUfCorte", "buscaMunicipioCorte", "buscaPaisCorte"].forEach(id => porId(id)?.addEventListener("input", renderizarFiltrosMultiselect));
}

function inicializarGraficosCorte() {
  popularSelectAnos();
  configurarEventosFiltrosCorte();
  renderizarFiltrosMultiselect();
  atualizarDashboardCorte();
}

window.onFilterChange = function (filterId, group) {
  if (group === "indicador" || group === "ind") {
    filtrosCorte.indicador = filterId;
    atualizarDashboardCorte();
  }
};

window.onTabChange = function () {
  requestAnimationFrame(() => {
    renderizarAbaAtivaCorte();
    mostrarMensagemGeralSemDados();
  });
};

am5.ready(inicializarGraficosCorte);
