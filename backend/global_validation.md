# Global Expansion Routing Engine Validation

## 1. Baseline Trade Corridors

### SHANGHAI → ROTTERDAM
**Distance:** 14,299 NM
**Path (29 nodes):** shanghai -> ningbo -> taiwan_strait -> xiamen -> shenzhen -> guangzhou -> hong_kong -> south_china_sea -> hochiminh -> singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### SHANGHAI → HAMBURG
**Distance:** 14,537 NM
**Path (32 nodes):** shanghai -> ningbo -> taiwan_strait -> xiamen -> shenzhen -> guangzhou -> hong_kong -> south_china_sea -> hochiminh -> singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam -> amsterdam -> bremerhaven -> hamburg

### SINGAPORE → ROTTERDAM
**Distance:** 11,805 NM
**Path (20 nodes):** singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### BUSAN → ANTWERP
**Distance:** 14,702 NM
**Path (29 nodes):** busan -> shanghai -> ningbo -> taiwan_strait -> xiamen -> shenzhen -> guangzhou -> hong_kong -> south_china_sea -> hochiminh -> singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp

### SHANGHAI → LA
**Distance:** 6,111 NM
**Path (6 nodes):** shanghai -> busan -> north_pacific -> seattle -> oakland -> la

### SHANGHAI → NEWYORK
**Distance:** 14,773 NM
**Path (27 nodes):** shanghai -> ningbo -> taiwan_strait -> xiamen -> shenzhen -> guangzhou -> hong_kong -> south_china_sea -> hochiminh -> singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> newyork

### DUBAI → ROTTERDAM
**Distance:** 8,880 NM
**Path (20 nodes):** dubai -> jebelali -> abu_dhabi -> hormuz -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### MUMBAI → ROTTERDAM
**Distance:** 8,317 NM
**Path (17 nodes):** mumbai -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### MUNDRA → HAMBURG
**Distance:** 8,846 NM
**Path (22 nodes):** mundra -> jnpt -> mumbai -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam -> amsterdam -> bremerhaven -> hamburg

### TOKYO → LA
**Distance:** 5,204 NM
**Path (5 nodes):** tokyo -> north_pacific -> seattle -> oakland -> la

### SINGAPORE → SYDNEY
**Distance:** 4,334 NM
**Path (8 nodes):** singapore -> jakarta -> surabaya -> lombok -> fremantle -> adelaide -> melbourne -> sydney

### SANTOS → ROTTERDAM
**Distance:** 5,697 NM
**Path (6 nodes):** santos -> mid_atlantic -> north_atlantic -> dover -> antwerp -> rotterdam

### DURBAN → ROTTERDAM
**Distance:** 9,263 NM
**Path (11 nodes):** durban -> port_elizabeth -> cape -> capetown -> south_atlantic -> tangier -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### VLADIVOSTOK → HAMBURG
**Distance:** 15,481 NM
**Path (34 nodes):** vladivostok -> busan -> shanghai -> ningbo -> taiwan_strait -> xiamen -> shenzhen -> guangzhou -> hong_kong -> south_china_sea -> hochiminh -> singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam -> amsterdam -> bremerhaven -> hamburg

## 2. Strategic Chokepoint Rerouting

### SHANGHAI → ROTTERDAM (SUEZ BLOCKED)
**Original Distance:** 14,299 NM
**New Distance:** 17,113 NM (+2,815 NM detour)
**Detour Path:** shanghai -> ningbo -> taiwan_strait -> xiamen -> shenzhen -> guangzhou -> hong_kong -> south_china_sea -> hochiminh -> singapore -> jakarta -> sunda -> indian_ocean_central -> indian_ocean_south -> durban -> port_elizabeth -> cape -> capetown -> south_atlantic -> tangier -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### SHANGHAI → NEWYORK (PANAMA BLOCKED)
**Original Distance:** 14,773 NM
**New Distance:** 14,773 NM (+0 NM detour)
**Detour Path:** shanghai -> ningbo -> taiwan_strait -> xiamen -> shenzhen -> guangzhou -> hong_kong -> south_china_sea -> hochiminh -> singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> newyork

### DUBAI → ROTTERDAM (HORMUZ BLOCKED)
**Original Distance:** 8,880 NM
**New Distance:** 0 NM (+-8,880 NM detour)
**Detour Path:** 

### SINGAPORE → ROTTERDAM (MALACCA BLOCKED)
**Original Distance:** 11,805 NM
**New Distance:** 11,805 NM (+0 NM detour)
**Detour Path:** singapore -> jakarta -> sunda -> indian_ocean_central -> arabian_sea -> sohar -> salalah -> babel -> jeddah -> suez -> portSaid -> alexandria -> mediterranean_east -> mediterranean_west -> algeciras -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### MUMBAI → ROTTERDAM (BABEL BLOCKED)
**Original Distance:** 8,317 NM
**New Distance:** 13,297 NM (+4,980 NM detour)
**Detour Path:** mumbai -> arabian_sea -> mombasa -> dar_es_salaam -> durban -> port_elizabeth -> cape -> capetown -> south_atlantic -> tangier -> gibraltar -> north_atlantic -> dover -> antwerp -> rotterdam

### SANTOS → ROTTERDAM (GIBRALTAR BLOCKED)
**Original Distance:** 5,697 NM
**New Distance:** 5,697 NM (+0 NM detour)
**Detour Path:** santos -> mid_atlantic -> north_atlantic -> dover -> antwerp -> rotterdam

