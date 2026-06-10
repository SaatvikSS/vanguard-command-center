// VANGUARD SCRI: Complete Global Maritime Database
// 100+ ports, all chokepoints, organized geographically with real lat/lon

// [id, name, country, lat, lon, throughput_M_TEU, congestion%, vessels, waitHrs]
export const PORT_DATA: [string,string,string,number,number,number,number,number,number][] = [
  // === EAST ASIA ===
  ['shanghai','Port of Shanghai','CHN',31.23,121.47,47.3,62,842,18],
  ['ningbo','Port of Ningbo-Zhoushan','CHN',29.87,121.55,33.3,71,634,22],
  ['shenzhen','Port of Shenzhen','CHN',22.54,114.06,30.0,58,412,14],
  ['qingdao','Port of Qingdao','CHN',36.07,120.38,25.0,55,287,16],
  ['guangzhou','Port of Guangzhou','CHN',23.10,113.26,24.2,64,356,20],
  ['tianjin','Port of Tianjin','CHN',38.97,117.73,21.0,48,234,12],
  ['dalian','Port of Dalian','CHN',38.91,121.60,8.5,49,198,10],
  ['xiamen','Port of Xiamen','CHN',24.47,118.08,12.0,52,189,14],
  ['hong_kong','Port of Hong Kong','HKG',22.29,114.15,14.8,41,312,8],
  ['kaohsiung','Port of Kaohsiung','TWN',22.62,120.27,9.8,88,267,20],
  ['keelung','Port of Keelung','TWN',25.13,121.74,2.4,35,78,6],
  ['tokyo','Port of Tokyo','JPN',35.65,139.77,4.5,42,156,4],
  ['yokohama','Port of Yokohama','JPN',35.44,139.64,2.9,36,112,4],
  ['kobe','Port of Kobe','JPN',34.68,135.20,2.8,32,98,4],
  ['nagoya','Port of Nagoya','JPN',35.08,136.88,2.7,38,87,6],
  ['busan','Port of Busan','KOR',35.10,129.04,22.7,39,318,6],
  ['incheon','Port of Incheon','KOR',37.45,126.58,3.4,44,112,8],
  // === SOUTHEAST ASIA ===
  ['singapore','Port of Singapore','SGP',1.26,103.84,39.0,45,1204,8],
  ['portklang','Port Klang','MYS',2.99,101.39,13.2,52,378,12],
  ['tanjungpelepas','Tanjung Pelepas','MYS',1.36,103.55,11.2,38,289,6],
  ['laemchabang','Laem Chabang','THA',13.08,100.88,8.1,46,201,8],
  ['hochiminh','Ho Chi Minh City Port','VNM',10.76,106.66,7.5,63,187,16],
  ['haiphong','Hai Phong Port','VNM',20.86,106.68,5.8,55,134,12],
  ['manila','Port of Manila','PHL',14.58,120.97,5.2,72,156,24],
  ['jakarta','Tanjung Priok','IDN',-6.10,106.88,7.6,68,198,18],
  ['surabaya','Tanjung Perak','IDN',-7.20,112.73,3.8,54,112,14],
  // === SOUTH ASIA ===
  ['mumbai','JNPT Mumbai','IND',18.95,72.95,6.3,85,189,32],
  ['mundra','Mundra Port','IND',22.74,69.72,7.0,42,167,10],
  ['chennai','Port of Chennai','IND',13.10,80.29,4.2,54,112,14],
  ['colombo','Port of Colombo','LKA',6.94,79.84,7.2,61,198,10],
  ['chittagong','Port of Chittagong','BGD',22.32,91.81,3.1,78,87,28],
  ['karachi','Port of Karachi','PAK',24.85,67.00,2.1,65,76,22],
  // === MIDDLE EAST ===
  ['jebelali','Jebel Ali Port','UAE',25.01,55.06,14.0,38,445,6],
  ['salalah','Port of Salalah','OMN',16.94,54.00,4.6,32,134,6],
  ['jeddah','Jeddah Islamic Port','SAU',21.48,39.17,4.8,48,156,12],
  ['hamad','Hamad Port','QAT',25.02,51.58,2.8,28,89,4],
  ['bandarabbas','Bandar Abbas','IRN',27.18,56.27,2.4,58,78,18],
  // === EUROPE ===
  ['rotterdam','Port of Rotterdam','NLD',51.95,4.14,14.4,51,492,12],
  ['antwerp','Port of Antwerp-Bruges','BEL',51.26,4.40,13.5,48,389,10],
  ['hamburg','Port of Hamburg','DEU',53.54,9.99,8.7,44,198,8],
  ['bremerhaven','Port of Bremerhaven','DEU',53.54,8.58,4.8,39,134,6],
  ['piraeus','Port of Piraeus','GRC',37.94,23.64,5.4,41,156,6],
  ['algeciras','Port of Algeciras','ESP',36.13,-5.45,5.1,35,134,4],
  ['barcelona','Port of Barcelona','ESP',41.35,2.17,3.6,42,112,8],
  ['valencia','Port of Valencia','ESP',39.45,-0.32,5.6,46,145,8],
  ['felixstowe','Port of Felixstowe','GBR',51.96,1.35,3.8,52,98,14],
  ['southampton','Port of Southampton','GBR',50.89,-1.40,2.0,38,67,8],
  ['lehavre','Le Havre','FRA',49.48,0.11,3.0,41,89,8],
  ['genoa','Port of Genoa','ITA',44.41,8.93,2.6,48,78,10],
  ['gioia_tauro','Gioia Tauro','ITA',38.43,15.90,3.1,34,98,4],
  ['gdansk','Port of Gdansk','POL',54.37,18.67,2.4,36,67,6],
  ['gothenburg','Port of Gothenburg','SWE',57.71,11.95,0.8,28,45,4],
  ['stpetersburg','Port of St Petersburg','RUS',59.93,30.30,2.2,62,56,18],
  // === AFRICA ===
  ['tangier','Tanger Med','MAR',35.87,-5.50,7.2,38,198,6],
  ['portSaid','Port Said','EGY',31.26,32.31,3.8,56,145,12],
  ['durban','Port of Durban','ZAF',-29.87,31.03,2.8,72,89,36],
  ['capetown','Port of Cape Town','ZAF',-33.90,18.43,0.8,48,45,12],
  ['mombasa','Port of Mombasa','KEN',-4.04,39.67,1.4,64,56,24],
  ['lagos','Apapa Port Lagos','NGA',6.44,3.38,1.2,82,67,42],
  ['djibouti','Port of Djibouti','DJI',11.59,43.15,1.0,42,45,8],
  // === AMERICAS ===
  ['la','Port of Los Angeles','USA',33.74,-118.27,9.9,74,312,28],
  ['longbeach','Port of Long Beach','USA',33.75,-118.19,9.0,69,278,24],
  ['newyork','Port of NY/NJ','USA',40.67,-74.04,8.4,62,234,18],
  ['savannah','Port of Savannah','USA',32.08,-81.09,5.6,67,178,18],
  ['houston','Port of Houston','USA',29.76,-95.27,3.4,52,134,14],
  ['charleston','Port of Charleston','USA',32.78,-79.93,2.8,48,98,12],
  ['vancouver','Port of Vancouver','CAN',49.28,-123.11,3.5,56,134,16],
  ['montreal','Port of Montreal','CAN',45.50,-73.55,1.7,42,67,10],
  ['santos','Port of Santos','BRA',-23.96,-46.30,4.2,58,145,20],
  ['cartagena','Port of Cartagena','COL',10.39,-75.51,3.2,44,98,8],
  ['manzanillo','Port of Manzanillo','MEX',19.05,-104.32,3.4,52,112,14],
  ['balboa','Port of Balboa','PAN',8.95,-79.56,2.8,48,98,8],
  ['colon','Port of Colon','PAN',9.35,-79.90,4.3,44,134,6],
  ['callao','Port of Callao','PER',-12.05,-77.15,2.6,56,78,16],
  ['buenosaires','Port of Buenos Aires','ARG',-34.60,-58.38,1.4,62,56,22],
  // === OCEANIA ===
  ['melbourne','Port of Melbourne','AUS',-37.82,144.92,2.8,42,89,10],
  ['sydney','Port Botany Sydney','AUS',-33.96,151.21,2.6,48,78,12],
  ['brisbane','Port of Brisbane','AUS',-27.38,153.17,1.4,34,56,6],
  ['auckland','Port of Auckland','NZL',-36.84,174.77,0.9,32,34,4],
  ['tauranga','Port of Tauranga','NZL',-37.65,176.17,1.2,28,45,4],
];

export const CHOKEPOINTS: [string,string,number,number,number,string][] = [
  // [id, name, lat, lon, dailyTraffic, riskLevel]
  ['malacca','Strait of Malacca',2.5,101.5,250,'ELEVATED'],
  ['suez','Suez Canal',30.0,32.5,55,'HIGH'],
  ['panama','Panama Canal',9.1,-79.7,40,'MODERATE'],
  ['hormuz','Strait of Hormuz',26.5,56.2,80,'CRITICAL'],
  ['babel','Bab el-Mandeb',12.6,43.3,45,'CRITICAL'],
  ['gibraltar','Strait of Gibraltar',35.9,-5.6,65,'LOW'],
  ['dover','Strait of Dover',51.0,1.5,120,'LOW'],
  ['taiwan_strait','Taiwan Strait',24.0,119.5,180,'ELEVATED'],
  ['cape','Cape of Good Hope',-34.4,18.5,30,'MODERATE'],
  ['sunda','Sunda Strait',-6.1,105.8,50,'LOW'],
  ['lombok','Lombok Strait',-8.4,115.7,35,'LOW'],
  ['tsugaru','Tsugaru Strait',41.6,140.7,40,'LOW'],
  ['mozambique','Mozambique Channel',-16.0,41.0,25,'LOW'],
  ['danish','Danish Straits',55.7,12.6,90,'LOW'],
];

// Geographic waypoints for routing only (not rendered as UI cards)
export const WAYPOINTS: [string,string,number,number][] = [
  ['west_africa','West Africa Coast',10.0,-20.0],
  ['namibia_coast','Namibia Coast',-22.0,10.0],
  ['madagascar_east','East Madagascar',-20.0,55.0],
  ['cape_horn','Cape Horn',-56.0,-67.0],
  ['canary_islands','Canary Islands',28.0,-18.0],
  ['cape_st_vincent','Cape St. Vincent',36.5,-9.5],
];

// Routes: [path_array, cargo, monthlyValue]
export const GLOBAL_ROUTES: [string[],string,string][] = [
  // Mega Route: Asia to Europe (The Main Artery)
  [['shanghai','taiwan_strait','singapore','malacca','colombo','babel','suez','piraeus','gibraltar','cape_st_vincent','rotterdam'], 'Electronics', '$2.4B'],
  [['ningbo','taiwan_strait','singapore','malacca','colombo','babel','suez','genoa','barcelona'], 'Furniture', '$1.8B'],
  [['singapore','malacca','colombo','babel','suez','gibraltar','cape_st_vincent','felixstowe'], 'Mixed Freight', '$8.1B'],
  
  // Transpacific
  [['shanghai','tsugaru','la'], 'Transpacific Direct', '$5.4B'],
  [['busan','tsugaru','la','manzanillo','panama','newyork'], 'Semiconductors', '$1.6B'],
  [['houston','panama','manzanillo','la','tsugaru','yokohama','tokyo'], 'Gulf-Pacific', '$1.8B'],
  [['dalian','busan','tsugaru','la'], 'Steel', '$870M'],
  
  // Middle East & Energy
  [['jebelali','hormuz','mumbai','colombo','malacca','singapore','shanghai'], 'Crude Oil', '$12.4B'],
  [['hamad','hormuz','mumbai','colombo'], 'Qatar-Gulf', '$1.8B'],
  [['jeddah','babel','suez','piraeus','genoa'], 'Red Sea Trade', '$1.4B'],

  // Africa & South America
  [['kaohsiung','taiwan_strait','singapore','malacca','sunda','cape','west_africa','santos'], 'TSMC to SA', '$1.8B'],
  [['santos','canary_islands','gibraltar','algeciras','genoa'], 'Commodities', '$540M'],
  [['santos','savannah','newyork'], 'Soybeans', '$1.1B'],
  [['tangier','gibraltar','suez','babel','djibouti','mombasa','durban','capetown'], 'Africa-Med', '$420M'],
  [['jakarta','sunda','cape','santos','buenosaires'], 'Indonesia-SA', '$1.6B'],
  
  // Europe & Transatlantic
  [['rotterdam','cape_st_vincent','gibraltar','suez','babel','colombo','singapore','hochiminh','shenzhen'], 'Components', '$620M'],
  [['bremerhaven','hamburg','danish','gothenburg'], 'North Sea', '$340M'],
  [['lehavre','dover','rotterdam','danish','stpetersburg'], 'EU-Baltic', '$560M'],
  
  // Oceania
  [['melbourne','sydney','brisbane','lombok','manila','kaohsiung','xiamen'], 'AU-Asia', '$680M'],
  [['brisbane','auckland','tauranga'], 'Trans-Tasman', '$210M']
];

export const STATIC_NEWS = [
  { title: "Houthi missile strikes near commercial vessel in Bab el-Mandeb; insurance premiums surge 340%", domain: "reuters.com", severity: "CRITICAL", time: "2m" },
  { title: "Panama Canal restricts daily transits to 24 vessels amid worst drought in 114 years", domain: "ft.com", severity: "HIGH", time: "8m" },
  { title: "US Navy deploys carrier strike group to South China Sea following Taiwan Strait incident", domain: "bbc.com", severity: "CRITICAL", time: "12m" },
  { title: "Port of Shanghai reports 18-hour average wait time; congestion index hits 6-month high", domain: "splash247.com", severity: "ELEVATED", time: "15m" },
  { title: "Suez Canal Authority raises transit fees by 15% effective immediately for northbound vessels", domain: "lloydslist.com", severity: "HIGH", time: "22m" },
  { title: "TSMC halts shipment of advanced 3nm chips to China amid new US export controls", domain: "nikkei.com", severity: "CRITICAL", time: "28m" },
  { title: "Red Sea crisis forces Maersk to reroute all Asia-Europe vessels via Cape of Good Hope", domain: "maersk.com", severity: "HIGH", time: "35m" },
  { title: "India-Japan bilateral summit announces $42B supply chain resilience fund", domain: "economictimes.com", severity: "INFO", time: "41m" },
  { title: "Port of Rotterdam workers announce 48-hour strike over automation disputes", domain: "dutchnews.nl", severity: "ELEVATED", time: "47m" },
  { title: "Typhoon Gaemi forces closure of Port of Kaohsiung; 267 vessels diverted to Busan", domain: "tradewindsnews.com", severity: "HIGH", time: "52m" },
  { title: "Iran threatens to close Strait of Hormuz in response to new EU sanctions package", domain: "aljazeera.com", severity: "CRITICAL", time: "58m" },
  { title: "NVIDIA H100 GPU shipment valued at $4.1B currently transiting Strait of Malacca", domain: "bloomberg.com", severity: "INFO", time: "1h" },
  { title: "Global container freight index surges to $4,200/TEU as peak season begins early", domain: "freightwaves.com", severity: "ELEVATED", time: "1h" },
  { title: "Australian coal exports to China resume after 3-year unofficial ban lifted", domain: "smh.com.au", severity: "INFO", time: "1h" },
  { title: "Port of Durban reports 36-hour vessel turnaround delays due to crane failures", domain: "defenceweb.co.za", severity: "ELEVATED", time: "2h" },
  { title: "EU approves Critical Raw Materials Act; reshoring semiconductor supply chains", domain: "ec.europa.eu", severity: "INFO", time: "2h" },
  { title: "Chinese naval exercises near Taiwan Strait raise insurance costs by $180K per transit", domain: "wsj.com", severity: "HIGH", time: "3h" },
  { title: "Port of Santos breaks monthly record with 14.2M tonnes of soybean exports", domain: "agrinews.com", severity: "INFO", time: "3h" },
  { title: "Myanmar junta seizes foreign-flagged cargo vessel in Andaman Sea", domain: "irrawaddy.com", severity: "ELEVATED", time: "4h" },
  { title: "IMO sulfur cap compliance check reveals 12% of vessels non-compliant in Malacca", domain: "imo.org", severity: "LOW", time: "5h" },
  { title: "Severe congestion at Port of Lagos; average dwell time exceeds 21 days", domain: "seatrade-maritime.com", severity: "HIGH", time: "5h" },
  { title: "Japan approves $8.2B semiconductor reshoring package; TSMC Kumamoto fab on schedule", domain: "japantimes.co.jp", severity: "INFO", time: "6h" },
  { title: "Piracy incident reported off coast of Somalia; IMB issues advisory for Gulf of Aden", domain: "icc-ccs.org", severity: "ELEVATED", time: "6h" },
  { title: "Bangladesh port workers strike enters third day; Chittagong operations at 30%", domain: "thedailystar.net", severity: "HIGH", time: "7h" },
  { title: "CMA CGM announces new direct Asia-Mexico service bypassing US West Coast", domain: "joc.com", severity: "INFO", time: "8h" },
];

export const COMMODITIES = [
  { name: 'NVIDIA H100 Fleet', value: '$4.1B', exposure: 82, route: 'Malacca → Suez', color: '#f59e0b' },
  { name: 'TSMC 3nm Wafers', value: '$2.8B', exposure: 64, route: 'Kaohsiung → LA', color: '#3b82f6' },
  { name: 'Pfizer Critical APIs', value: '$950M', exposure: 24, route: 'Mumbai → Rotterdam', color: '#10b981' },
  { name: 'LNG (Qatar → Japan)', value: '$3.2B', exposure: 91, route: 'Hormuz → Malacca', color: '#ef4444' },
  { name: 'Samsung DRAM Chips', value: '$1.6B', exposure: 58, route: 'Busan → LA', color: '#8b5cf6' },
  { name: 'German Auto Parts', value: '$1.1B', exposure: 45, route: 'Hamburg → Savannah', color: '#06b6d4' },
  { name: 'Brazilian Iron Ore', value: '$2.1B', exposure: 33, route: 'Santos → Rotterdam', color: '#ec4899' },
  { name: 'Australian Coal', value: '$890M', exposure: 71, route: 'Melbourne → Shanghai', color: '#78716c' },
];

export const SPOT_RATES = [
  { time: 'W-12', shanghai_eu: 2800, shanghai_us: 3200, asia_india: 1100 },
  { time: 'W-11', shanghai_eu: 2900, shanghai_us: 3100, asia_india: 1050 },
  { time: 'W-10', shanghai_eu: 3100, shanghai_us: 3400, asia_india: 1200 },
  { time: 'W-9', shanghai_eu: 3300, shanghai_us: 3500, asia_india: 1150 },
  { time: 'W-8', shanghai_eu: 3200, shanghai_us: 3600, asia_india: 1250 },
  { time: 'W-7', shanghai_eu: 3500, shanghai_us: 3800, asia_india: 1300 },
  { time: 'W-6', shanghai_eu: 3800, shanghai_us: 4100, asia_india: 1400 },
  { time: 'W-5', shanghai_eu: 4200, shanghai_us: 4300, asia_india: 1500 },
  { time: 'W-4', shanghai_eu: 4100, shanghai_us: 4500, asia_india: 1450 },
  { time: 'W-3', shanghai_eu: 4400, shanghai_us: 4200, asia_india: 1600 },
  { time: 'W-2', shanghai_eu: 4600, shanghai_us: 4800, asia_india: 1700 },
  { time: 'W-1', shanghai_eu: 4900, shanghai_us: 5100, asia_india: 1800 },
  { time: 'NOW', shanghai_eu: 5200, shanghai_us: 5400, asia_india: 1950 },
];
