# Maritime Routing Engine Validation Report

This report validates the new Weighted Dijkstra Haversine engine across 9 major global trade corridors.

### SHANGHAI → ROTTERDAM
**Distance:** 12,534 NM
**Path (26 nodes):** shanghai -> ningbo -> taiwan_strait -> shenzhen -> hong_kong -> south_china_sea -> hochiminh -> singapore -> tanjungpelepas -> malacca -> bay_of_bengal -> colombo -> arabian_sea -> salalah -> babel -> jeddah -> suez -> portSaid -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### SHANGHAI → HAMBURG
**Distance:** 12,771 NM
**Path (28 nodes):** shanghai -> ningbo -> taiwan_strait -> shenzhen -> hong_kong -> south_china_sea -> hochiminh -> singapore -> tanjungpelepas -> malacca -> bay_of_bengal -> colombo -> arabian_sea -> salalah -> babel -> jeddah -> suez -> portSaid -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam -> bremerhaven -> hamburg

### SINGAPORE → ROTTERDAM
**Distance:** 10,169 NM
**Path (19 nodes):** singapore -> tanjungpelepas -> malacca -> bay_of_bengal -> colombo -> arabian_sea -> salalah -> babel -> jeddah -> suez -> portSaid -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### BUSAN → ANTWERP
**Distance:** 12,937 NM
**Path (26 nodes):** busan -> shanghai -> ningbo -> taiwan_strait -> shenzhen -> hong_kong -> south_china_sea -> hochiminh -> singapore -> tanjungpelepas -> malacca -> bay_of_bengal -> colombo -> arabian_sea -> salalah -> babel -> jeddah -> suez -> portSaid -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp

### SHANGHAI → LA
**Distance:** 6,129 NM
**Path (6 nodes):** shanghai -> busan -> tsugaru -> north_pacific -> vancouver -> la

### SHANGHAI → NEWYORK
**Distance:** 11,217 NM
**Path (15 nodes):** shanghai -> busan -> tsugaru -> north_pacific -> vancouver -> la -> manzanillo -> balboa -> panama -> colon -> cartagena -> miami -> charleston -> savannah -> newyork

### DUBAI → ROTTERDAM
**Distance:** 8,201 NM
**Path (17 nodes):** dubai -> jebelali -> hormuz -> arabian_sea -> salalah -> babel -> jeddah -> suez -> portSaid -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### SANTOS → ROTTERDAM
**Distance:** 5,697 NM
**Path (6 nodes):** santos -> mid_atlantic -> north_atlantic -> dover -> antwerp -> rotterdam

### DURBAN → ROTTERDAM
**Distance:** 8,789 NM
**Path (9 nodes):** durban -> cape -> capetown -> south_atlantic -> mid_atlantic -> north_atlantic -> dover -> antwerp -> rotterdam

## Blockade Rerouting Validation (Suez vs Panama)
### SHANGHAI → ROTTERDAM (Suez Blocked)
**New Distance:** 14,570 NM (+2,036 NM detour)
**Path:** shanghai -> busan -> tsugaru -> north_pacific -> vancouver -> la -> manzanillo -> balboa -> panama -> colon -> mid_atlantic -> north_atlantic -> dover -> antwerp -> rotterdam

### SHANGHAI → ROTTERDAM (Panama Blocked)
**New Distance:** 12,534 NM (+0 NM detour)
**Path:** shanghai -> ningbo -> taiwan_strait -> shenzhen -> hong_kong -> south_china_sea -> hochiminh -> singapore -> tanjungpelepas -> malacca -> bay_of_bengal -> colombo -> arabian_sea -> salalah -> babel -> jeddah -> suez -> portSaid -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

