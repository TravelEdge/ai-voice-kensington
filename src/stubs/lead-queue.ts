// Editable stub payloads for src/tools/lead-queue.ts.
//
// When USE_API_STUBS=true the tool file returns these constants instead of
// calling the LeadQueue API. Populate them below with the real fixture data
// you want returned during local development.

import type {
  Activity,
  Channel,
  DestinationContinent,
  LeadAssignmentQueueResult,
} from '../tools/lead-queue.js';

/** Bearer token returned by lead-queue authenticate() in stub mode. */
export const LEAD_QUEUE_AUTH_STUB = 'dummy';

/** Response for getAllDestinations(). Replace with your fixture. */
export const DESTINATIONS_STUB: DestinationContinent[] = [
    {
        "continent": "Africa",
        "id": 1,
        "countries": [
            {
                "name": "Kenya",
                "description": "Kenya is the regional hub for the quintessential safari experience, featuring top game parks of Masai Mara, Samburu, Amboseli, and the beaches of Mombasa and Lamu. The country has the most modern infrastructure in the region and excellent flight connections to other countries in Africa. The \"Big Five\" animals of Africa can also be found in Kenya: the lion, leopard, buffalo, rhinoceros and elephant. It is also famous for the annual migration, when millions of wildebeest head north to find fresh grass during the dry season. The migration varies yearly based on the rains, but tends to peak between mid-July to mid-September (in other months the migration moves around the Serengeti park in Tanzania.",
                "quickFilterApplicableId": 3,
                "id": 1
            },
            {
                "name": "Tanzania",
                "description": "Tanzania has a wealth of natural attractions. Mount Kilimanjaro, Africa's highest peak, is situated in the northeast, near the tourist hub of Arusha. The nearby game parks of Serengeti, Ngorongoro, and Tarangire receive most of the visitor volume. Other notable game parks are Selous Game Reserve and Mikumi National Park in the south, and Gombe National Park in the west. Further to the west are the Great Lakes, Lake Victoria (Africa's largest lake) and Lake Tanganyika (the world's deepest lake). The capitol city of Dar Es Salaam is located on the eastern shore. But the main attraction is the exotic island of Zanzibar lying just offshore, with its Swahili architecture, spice plantations and white sand beaches.",
                "quickFilterApplicableId": 3,
                "id": 2
            },
            {
                "name": "Zambia",
                "description": "Zambia is has a relatively young tourist industry, growing with the volume of people visiting Victoria Falls on its southern border. With the troubles in Zimbabwe, Livinstone is the new gateway to the falls and its unexpectedly wide array of adrenaline activities, game parks, and scenic beauty. With the attention has come the discovery of pristine parks of Lower Zambezi. For the purists, this is one of the last untouched safari experiences on the continent.",
                "quickFilterApplicableId": 3,
                "id": 3
            },
            {
                "name": "Uganda",
                "description": "Uganda is most famous for its mountain gorillas in the Bwindi Impenetrable National Park, an eight hour drive from the capitol Kampala. International flights arrive in the nearby city of Entebbe. Uganda has other attractions including; Murchison Falls, the otherworldly high altitude Ruwenzori Mountains, and whitewater rafting on the Blue Nile as it exits Lake Victoria. The Sesse Islands in Lake Victoria can be reached by boat and are a popular hangout for the budget crowd.  ",
                "quickFilterApplicableId": 3,
                "id": 4
            },
            {
                "name": "Ethiopia",
                "description": "Ethiopia should be on the Top 10 list of any traveler. It boasts a fascinating history, architecture, food, scenery, culture - and terrible infrastructure. For those willing to deal with the occasional service hiccup, Ethiopia promises rare and unique sights.  The underground carved cathedrals of Lalibela, island monasteries of Lake Tana, royal castles of Gondor, ancient stellae of Axum, and the worlds largest open air market in Addis Ababa. The food is completely unique. And it is the home of coffee, served to visitors in an elaborate ceremony that includes roasting, grinding and brewing on the spot. Ethiopian dynastic history, which began with the reign of Emperor Menelik I in 1000 BC, is the longest in human history. And, recent studies claim that Ethiopia was the point from which human beings migrated around the world.",
                "quickFilterApplicableId": 3,
                "id": 5
            },
            {
                "name": "Seychelles",
                "description": "Seychelles is famous for its pristine beaches and splendid isolation.  It is an archipelago nation of 115 islands in the Indian Ocean, some 1,500 kilometres (930 mi) east of mainland Africa. The capitol city, Victoria, is located on the main island of Mahe. The second largest island, Praslin, is serviced by flights and ferry. Other islands can be reached with local airlines. Seychelles features a range of resorts from inexpensive budget options to five star properties by Hilton, Four Seasons and Banyan Tree. ",
                "quickFilterApplicableId": 3,
                "id": 6
            },
            {
                "name": "South Africa",
                "description": "South Africa is located at the southern tip of Africa, and features one of the most beautiful cities in the world, Cape Town. A sublime location, great beaches, nearby vineyards, great food, and cheap diamonds - there is a lot of love about the city. The Garden Route is a short drive away, passing through the quaint towns of Mossel Bay, George, Knysna, Oudtshoorn, Plettenberg Bay and Nature's Valley. It is best experienced with an overnight in Knysna.  Kruger National Park is another top draw, and boasts some of the finest lodges on the continent.",
                "quickFilterApplicableId": 3,
                "id": 7
            },
            {
                "name": "Botswana",
                "description": "Botswana is most famous for its two sublime game parks, the Okavango Delta and Chobe reserve.  The Okavango is the world's largest inland delta and has no outlet to the sea - baffling early explorers. It turns out that the massive volume of waters simply disappear into the Kalahari Desert. This unexpectedly lush swamp in the midst of scorching desert is a magnet for wild game and birds.  Nearby Chobe reserve is famous for its elephants, the world's largest. Maun is the tourism hub of the country, with the capitol of Gaborone located on the southern border. Botswana is a rare country in Africa, with no civil unrest, balanced budgets, working democracy, and one of the world's fastest growing economies. Hugely impressive, it is well worth a visit.",
                "quickFilterApplicableId": 3,
                "id": 8
            },
            {
                "name": "Namibia",
                "description": "Namibia is a desert country featuring the world's tallest sand dunes at Sossussvlei, a sprawling salt pan game park at Etosha, and sand boarding or quad-biking in Swakopmund on the west coast. The barren Skeleton Coast was once the terror of Atlantic sailors who knew it was certain death if they shipwrecked. Cape Cross has one of the largest seal colonies in the world. Fish River Canyon has spectacular rock paintings. Once a colony of Germany, it still features bavarian architecture and cuisine. In short, Namibia is unexpectedly unique and rewarding. The capitol, Windhoek, is serviced by a few airlines, primarily from nearby South Africa.",
                "quickFilterApplicableId": 3,
                "id": 9
            },
            {
                "name": "Morocco",
                "description": "Morocco is located in North Africa with a population of nearly 34 million. It has a coast on the Atlantic Ocean that reaches past the Strait of Gibraltar into the Mediterranean Sea. Morocco has international borders with Algeria to the east, and Mauritania to the south. Morocco was drawn into the Mediterranean world by Phoenician trading colonies and settlements in the late Classical period. This strategic region formed part of the Roman Empire, Vandals, Visigoths, Byzantine Greeks, and Islamic empires. During this time, the high mountains of most of modern Morocco remained in control of their Berber inhabitants. The Treaty of Fez (1912) made Morocco a protectorate of France, but in 1955 the country regained its independence. The capitol city is Rabat, and main economic center is Casablanca. Tangiers is a port located very close to Spain, and receives a lot of European traffic. The cities of Marrakech and Fes are both UNESCO sites. There is a broad range of other sites, the ancient seaport of Essaouira, desert gateway of Ouarzazate, and the mountain passes of the high Atlas Mountains.",
                "quickFilterApplicableId": 3,
                "id": 10
            },
            {
                "name": "Rwanda",
                "description": "Rwanda is a small landlocked country in the Great Lakes region of east-central Africa, bordered by Uganda, Burundi, Congo and Tanzania. A verdant country of fertile and hilly terrain, the small republic bears the title \"Land of a Thousand Hills\". It features a number of national parks, most famously Parc des Volcans with its population of mountain gorillas, and Lake Kivu with its resorts and watersports. The capitol, Kigali, is serviced by international airlines. Home to approximately 10.1 million people, Rwanda supports the densest population in continental Africa. The country has received most international attention due to the Rwandan Genocide of 1994, and there are genocide memorials that are a powerful reminder of this tragic history.",
                "quickFilterApplicableId": 3,
                "id": 11
            },
            {
                "name": "Mozambique",
                "description": "Mozambique seems to have finally found peace after decades of internal conflict, and many visitors revel in the \"untouched\" beaches and pristine islands that are free from development and sprawl. The main cities of Maputo or Beira are most easily reached by flight from nearby South Africa. First colonized by the Portuguese in the early 1500s, it has an intriguing legacy of colonial forts and buildings.",
                "quickFilterApplicableId": 3,
                "id": 12
            },
            {
                "name": "Zimbabwe",
                "description": "Zimbabwe is a landlocked country in southern Africa, between Zambia to the north and South Africa to the south. The official language of Zimbabwe is English but most people speak Shona. The country has experienced a decade of challenges stemming from its dictatorship government which has resulted in hyperinflation, chronic shortages and civil unrest.  This is a great shame, because for decades Zimbabwe was \"the place to go\" in southern Africa.  It still has the majority of top resorts at Victoria Falls. And south of the capitol, Harare, is the Great Zimbabwe, a UNESCO World Heritage site. The Great Zimbabwe, or \"stone buildings\", consists of hundreds of great stone ruins spread out over a 500 km² (200 square mile) area. It is the remnant of one of the great African civilizations.",
                "quickFilterApplicableId": 3,
                "id": 13
            },
            {
                "name": "Mali",
                "description": "Mali is a landlocked nation in Western Africa, bordered by Algeria on the north, Niger on the east, Burkina Faso and the Côte d'Ivoire on the south, Guinea on the south-west, and Senegal and Mauritania on the west. Mali's northern borders reach deep into the middle of the Sahara, while the country's southern region, where the majority of inhabitants live, feature the Niger and Senegal rivers. Present-day Mali was once part of three West African empires that controlled trans-Saharan trade: the Ghana Empire, the Mali Empire (from which Mali is named), and the Songhai Empire. In the late 1800s, Mali fell under French control, becoming part of French Sudan. Mali gained independence in 1959 with Senegal, as the Mali Federation in 1959. A year later, the Mali Federation became the independent nation of Mali in 1960. After a long period of one-party rule, a 1991 coup led to the writing of a new constitution and the establishment of Mali as a democratic, multi-party state.",
                "quickFilterApplicableId": 3,
                "id": 14
            },
            {
                "name": "Ghana",
                "description": "Ghana is a country in West Africa. It borders Côte d'Ivoire (Ivory Coast) to the west, Burkina Faso to the north, Togo to the east, and the Gulf of Guinea to the south. The word \"Ghana\" means \"Warrior King\".Ghana was inhabited in pre-colonial times by a number of ancient kingdoms, including the Ga Adangbes on the eastern coast, inland Empire of Ashanti and various Fante states along the coast and inland. Trade with European states flourished after contact with the Portuguese in the 15th century, and the British established a crown colony, Gold Coast, in 1874. A significant trade in slaves originated from the country, and relics of this sordid activity remain to this day. Ghana achieved independence in 1957. The capitol city is Accra which is well served by international airlines. ",
                "quickFilterApplicableId": 3,
                "id": 15
            },
            {
                "name": "Togo",
                "description": "Togo is a narrow country in West Africa bordering Ghana to the west, Benin to the east and Burkina Faso to the north. The country extends south to the Gulf of Guinea, on which the capital Lomé is located. The official language is French; however, there are many other languages spoken in Togo as well. Togo has a population of more than 6,100,000 people, which is dependent mainly on agriculture. The weather is mild and makes for good growing seasons. Togo gained its independence from France in 1960.  ",
                "quickFilterApplicableId": 3,
                "id": 16
            },
            {
                "name": "Senegal",
                "description": "Senegal is in western Africa, bounded by the Atlantic Ocean to the west. Senegal was founded by the Tukulor in the middle valley of the Senegal River. Islam, the dominant religion, first came to the region in the 11th century. In the 13th and 14th centuries, the area came under the influence of the Mandingo empires to the east; the Jolof Empire of Senegal also was founded during this time.  Portugal, the Netherlands, and Great Britain all competed for trade in the area from the 15th century onward. In 1677 France ended up in possession of what had become an important slave trade departure point—the infamous island of Gorée next to modern Dakar. Millions of West African people were shipped from here. In 1960 Senegal achieved independence. Dakar is the capital city of Senegal, located on the Cape Verde Peninsula on the country's Atlantic coast. It is famous as the end of the Paris-Dakar rally. ",
                "quickFilterApplicableId": 3,
                "id": 17
            },
            {
                "name": "Benin",
                "description": "Benin, is a country in Western Africa. It borders Togo to the west, Nigeria to the east and Burkina Faso and Niger to the north; its short coastline to the south leads to the Bight of Benin. Its capital is the Yoruba founded city of Porto Novo, but the seat of government is the Fon city of Cotonou. Benin was known as Dahomey until 1975. The African kingdom of was formed out of a mixture of various local ethnic groups on the Abomey plain. Dahomey had a strict military culture aimed at securing and eventually expanding the borders of the small kingdom. Boys were often apprenticed to older soldiers at a young age, and learned about the kingdom's military customs until they were old enough to join the navy. Dahomey was also famous for instituting an elite female soldier corps, known by many Europeans as the Dahomean Amazons. This emphasis on military preparation and achievement earned Dahomey the nickname of \"black Sparta\" from European observers. By the middle of the nineteenth century, Dahomey started to lose its status as the regional power. This enabled the French to take over the area in 1892. In 1960 Benin achieved full independence from France.",
                "quickFilterApplicableId": 3,
                "id": 18
            },
            {
                "name": "Djibouti",
                "description": "Djibouti may be one of the tiniest, youngest and least-known nations in Africa, and stands out as a haven of stability and neutrality. It is part of the African continent, bordered to the northeast and east by the Red Sea, the southeast by Somalia, the southwest by Ethiopia and to the north by Eritrea. Much of it's coastline is white sandy beaches. Inland is semi-desert and desert and volcanic mountain ranges. This is where eerie lunar landscapes, such as Lac Abbé or the vast salt lake, Lac Assal. Djibouti offers hiking, diving, snorkelling with whale sharks and even windsurfing on wheels, or you can simply laze on a pale-sand beach in the Gulf of Tadjoura. ",
                "quickFilterApplicableId": 3,
                "id": 19
            },
            {
                "name": "Libya",
                "description": "Libya is a crossroads of history, continents and ancient empires. Home to the Mediterranean’s richest collection of Roman and Greek cities – Sabratha, Cyrene and, above all, Leptis Magna – each of which is overlaid by remnants of Byzantine splendor, it’s a place where history comes alive through the extraordinary monuments on its shores. Every corner of Tripoli resonates with a different period of history. It’s where the Sahara meets the Mediterranean. Libya is also home to Africa’s most exceptional and accessible desert scenery. The Sahara engulfs over 90% of the country, offering up vast sand seas the size of small European countries. Visit the enchanting oasis towns of Ghadames and Ghat, where the caravans once showcased the riches of Africa. Marvel at palm-fringed lakes surrounded by sand dunes in the desert’s heart. Go deeper into the desert and experience Jebel Acacus, one of the world’s finest open-air galleries of prehistoric rock art.",
                "quickFilterApplicableId": 3,
                "id": 20
            },
            {
                "name": "Eritrea",
                "description": "Eritrea is in East Africa, bordering the Red Sea, between Djibouti and Sudan, with a long disputed border with Ethiopia. Eritrea is a relatively small country (by African standards), about the same size as Pennsylvania or England, and has a varied and contrasting landscape due to its diverse topography as part of the geological feature of the Great Rift Valley which traverses all of Eastern Africa, the Red Sea and Middle East. The country's most interesting destinations are its natural attractions, beyond the towns and villages. There are six main topographical features in the country. The highlands in the center and south of Eritrea, the western lowlands, the Sahel in the north, the subtropical eastern escarpments, the northern coast and archipelago and the southern coast. ",
                "quickFilterApplicableId": 3,
                "id": 21
            },
            {
                "name": "Somalia",
                "description": "Somalia is located on the Horn of Africa, and is bordered by Ethiopia to the west, Djibouti to the north-west, and Kenya on its south-west. This is a country with a troubled past. Civil war, military coups, border disputes and warlordism are the general course of events here. General insecurity and inter- and intra-clan violence frequently occur throughout the country, and attacks and fighting between anti-government elements and TFG and Ethiopian forces take place regularly in Mogadishu and in regions outside the capital.",
                "quickFilterApplicableId": 3,
                "id": 22
            },
            {
                "name": "Burundi",
                "description": "Burundi is a small country in the Great Lakes region of Eastern Africa bordered by Rwanda to the north, Tanzania to the south and east, and the Democratic Republic of the Congo to the west. Although the country is landlocked, much of the southwestern border is adjacent to Lake Tanganyika. Burundi was ruled as a kingdom by the Tutsi for over two hundred years. It was later a colony occupied by Germany and Belgium. Political unrest occurred throughout the region because of social differences between the Tutsi and Hutu, provoking civil war in Burundi throughout the middle twentieth century. Presently, Burundi is governed as a presidential representative democratic republic. The capital city is Bujumbura. ",
                "quickFilterApplicableId": 3,
                "id": 23
            },
            {
                "name": "Comoros",
                "description": "The Comoros are an island nation off the coast of East Africa, in the Indian Ocean between northern Mozambique and northern Madagascar. Islands include Anjouan (Nzwani), Grand Comore (Ngazidja), Moheli (Mwali). The island of Mayotte is claimed by the Comoros, but is administered by France. Moroni is the country's capital. ",
                "quickFilterApplicableId": 3,
                "id": 24
            },
            {
                "name": "Madagascar",
                "description": "Madagascar is a country that occupies a large island of the same name, located in the Indian Ocean off the eastern coast of Africa. It is the fourth largest island in the world. Madagascar is famous for pepper, vanilla, and of course the lemurs. The country has six provinces (faritany) - Antananarivo, Antsiranana, Fianarantsoa, Mahajanga, Toamasina, and Toliara. ",
                "quickFilterApplicableId": 3,
                "id": 25
            },
            {
                "name": "Reunion",
                "description": "Réunion (previously Île Bourbon) is an island located in the Indian Ocean, east of Madagascar, about 200 km (130 miles) south west of Mauritius. Administratively, Réunion is one of the overseas départements of France and an integral part of the Republic with the same status as the European mainland. Réunion is an outermost region of the European Union and, as an overseas department of France, is part of the Eurozone. In fact, due to its location in a time zone to the east of Europe, Réunion was the first region in the world where the euro became legal tender.",
                "quickFilterApplicableId": 3,
                "id": 26
            },
            {
                "name": "Lesotho",
                "description": "Lesotho is a country in Southern Africa. Known as the Kingdom in the Sky because of its lofty altitude - it has the highest lowest point of any country in the world (1400m) and is the only country to be entirely above 1000m! Lesotho is totally surrounded by South Africa and is making a reputation for itself as a fantastic adventure holiday destination. The Basotho people are very friendly and welcoming, and the country is relatively safe and politically stable compared to some of its neighbours. ",
                "quickFilterApplicableId": 3,
                "id": 27
            },
            {
                "name": "Swaziland",
                "description": "The Kingdom of Swaziland is a landlocked country in Southern Africa, bordered to the north, south, and west by South Africa, and to the east by Mozambique. The nation, as well as its people, are named after the 19th century king Mswati II. Swaziland has been continuously inhabited since prehistory. Today, the population is primarily Bantu-speaking ethnic Swazis. A British protectorate following the end of the Second Boer War, it gained independence in 1968. Swaziland is a member of the Southern African Development Community, the African Union, and the Commonwealth of Nations. Major cities are Mbabane, the capital, and Lobamba the royal and legislative capital. ",
                "quickFilterApplicableId": 3,
                "id": 28
            },
            {
                "name": "Malawi",
                "description": "Malawi is a country in Africa, bordered by Mozambique to the south and east, Tanzania to the north, Zambia to the west. Lake Malawi, the third largest lake in Africa, runs along most of its eastern border. It's described as the \"Warm Heart of Africa\", referring to the friendliness of the people. ",
                "quickFilterApplicableId": 3,
                "id": 29
            },
            {
                "name": "Mauritius",
                "description": "Mauritius is an island nation off the coast of the African continent in the southwest Indian Ocean, about 900 kilometres (560 mi) east of Madagascar. In addition to the island of Mauritius, the Republic includes the islands of St. Brandon, Rodrigues and the Agalega Islands. Mauritius is part of the Mascarene Islands, with the French island of Réunion 200 km (125 mi) to the southwest and the island of Rodrigues 570 km to the northeast. Mauritius attained independence in 1968, and the country became a republic within the Commonwealth in 1992. Mauritius has been a stable democracy with regular free elections and a positive human rights record, and has attracted considerable foreign investment earning one of Africa's highest per capita incomes.",
                "quickFilterApplicableId": 3,
                "id": 30
            },
            {
                "name": "Algeria",
                "description": "Algeria is an Arabic country in North Africa. It has a Mediterranean Sea coastline in the north. It is surrounded by Morocco to the northwest, Tunisia to the northeast, Libya to the east, Niger to the southeast, Mali to the southwest, Mauritania and Western Sahara to the west. After Sudan, Algeria is the second-largest country in Africa. Much of recent Algerian history has been dominated by civil wars and subsequent warlordism. That said, the country is gradually restoring order and will prove an interesting - if difficult - destination. ",
                "quickFilterApplicableId": 3,
                "id": 31
            },
            {
                "name": "Chad",
                "description": "Chad (French: Tchad) is a country in Saharan Africa, south of Libya, east of Niger and Cameroon, north of the Central African Republic, and west of Sudan. It shares a short border with Nigeria. Part of France's African holdings until 1960, Chad endured three decades of civil warfare as well as invasions by Libya before a semblance of peace was finally restored in 1990. The government eventually drafted a democratic constitution, and held flawed presidential elections in 1996 and 2001.",
                "quickFilterApplicableId": 3,
                "id": 32
            },
            {
                "name": "Western Sahara",
                "description": "Western Sahara is an area in Saharan Africa bordering the Atlantic Ocean, between Mauritania and Morocco. Its governance is disputed, but the majority of it is occupied by Morocco. While there is a large coastline, much of it is rocky and not fit for beaches or travel. Large-scale fishing and ports are at Ad Dakhla. Much of the territory is arid desert. The area near the sand wall created by the Moroccan military (also known as \"the berm\") is surrounded by land mines and should be avoided. Administratively, the territory was divided by Spain into two regions: the northern strip, known as Saguia el-Hamra, and the southern two-thirds, named Río de Oro. ",
                "quickFilterApplicableId": 3,
                "id": 33
            },
            {
                "name": "Cape Verde",
                "description": "Cape Verde is a republic located on an archipelago in the Macaronesia ecoregion of the North Atlantic Ocean, off the western coast of Africa. The previously uninhabited islands were discovered and colonized by the Portuguese in the fifteenth century, and attained independence from Portugal in 1975. Cape Verde is a stable democracy. It is composed of ten islands (of which nine are inhabited) and eight islets. The islands have a combined size of just over 4,000 square kilometers.[8] The islands are divided into the Barlavento (windward) islands (Santo Antão, São Vicente, Santa Luzia, São Nicolau, Sal, and Boa Vista) and the Sotavento (leeward) islands (Maio, Santiago, Fogo, and Brava).",
                "quickFilterApplicableId": 3,
                "id": 34
            },
            {
                "name": "The Gambia",
                "description": "The Gambia is a country in West Africa and is the smallest country on the continent of Africa. It has a short North Atlantic Ocean coastline in the west and is surrounded by Senegal so that it is almost an enclave. The country occupies the navigable length of the Gambia River valley and surrounding hills. ",
                "quickFilterApplicableId": 3,
                "id": 35
            },
            {
                "name": "Guinea",
                "description": "Guinea is a country in West Africa formerly known as French Guinea. The country's current population is over ten million. Guinea's size is almost 246,000 square kilometres (94,981 sq mi). Its territory has a crescent shape, with its western border on the Atlantic Ocean, curving inland to the east and south. The Atlantic coast borders Guinea-Bissau to the north and Sierra Leone to the south. The inland part neighbors Senegal to the north, Mali to the north and north-east, Côte d'Ivoire to the south-east, and Liberia to the south. Its water sources include the Niger, Senegal, and Gambia rivers. Conakry is the capital, seat of the national government, and largest city. ",
                "quickFilterApplicableId": 3,
                "id": 36
            },
            {
                "name": "Guinea-Bissau",
                "description": "Guinea-Bissau is a former Portuguese colony bordered by Senegal to the north and Guinea to the south and east. Guinea-Bissau's post-independence history has been chequered. A civil war in 1998, followed by the imposition of a military junta in 1999 has been replaced with a multi-party democracy. The economy remains fragile, however hopes are high. ",
                "quickFilterApplicableId": 3,
                "id": 37
            },
            {
                "name": "Liberia",
                "description": "Liberia is a country on the west coast of Africa, bordered by Sierra Leone, Guinea, Côte d'Ivoire, and the Atlantic Ocean. It has a population of about 3.5 million, and covers  111,369 square kilometers (43,000 sq mi). Liberia has a hot equatorial climate with most rainfall arriving in summer with harsh harmattan winds in the dry season. Liberia's populated Pepper Coast is composed of mostly mangrove forests while the sparsely populated inland is forested, later opening to a plateau of drier grasslands. Founded as a colony in 1822 by freed slaves from the United States, who named the capital city Monrovia in honor of the US president, James Monroe. In 1847, the colony of freed slaves declared independence and founded the Republic of Liberia. Subsequent civil wars have displaced hundreds of thousands of people and devastated the country's economy.",
                "quickFilterApplicableId": 3,
                "id": 38
            },
            {
                "name": "Sierra Leone",
                "description": "Sierra Leone is located on the West Coast of Africa between 7 and 10 degrees N, and longitudes 10.5 and 13 degrees W. The Republic of Guinea is to the north and northeast; Liberia is to the east and southeast, and the Atlantic Ocean on the west and south. It has 402 km of coastline. From an approximate 100km coastal belt of low-lying land, the country rises to a mountain plateau near the eastern frontier rising 1200m to 2000m with a rich timber forest region. The peninsula, on which the capital and main commercial centre of Freetown stands, is 40km long and 17km wide with a mountainous interior. ",
                "quickFilterApplicableId": 3,
                "id": 39
            },
            {
                "name": "Burkina Faso",
                "description": "Burkina Faso, formerly Upper Volta, is a landlocked country in West Africa. It is surrounded by six countries: Mali to the north, Niger to the east, Benin to the south east, Togo and Ghana to the south, and Côte d'Ivoire to the south west. Formerly called the Republic of Upper Volta, it was renamed on August 4, 1984, by President Thomas Sankara to mean \"the land of upright people\" in Moré and Dioula, the major native languages of the country. Burkina Faso's capital is Ouagadougou. ",
                "quickFilterApplicableId": 3,
                "id": 40
            },
            {
                "name": "Mauritania",
                "description": "Mauritania is a country in northwest Africa. It is bordered by the Atlantic Ocean on the west, by Senegal on the southwest, by Mali on the east and southeast, by Algeria on the northeast, and by the Morocco-controlled Western Sahara on the northwest. It is named after the ancient Berber kingdom of Mauretania. The capital and largest city is Nouakchott, located on the Atlantic coast. Mauritania is generally flat, its 1,030,700 square kilometers (397,850 sq mi) forming vast, arid plains broken by occasional ridges and clifflike outcroppings. A series of scarps face southwest, longitudinally bisecting these plains in the center of the country. The scarps also separate a series of sandstone plateaus, the highest of which is the Adrar Plateau, reaching an elevation of 500 meters (1,640 ft). Spring-fed oases lie at the foot of some of the scarps.",
                "quickFilterApplicableId": 3,
                "id": 41
            },
            {
                "name": "Niger",
                "description": "Niger is an arid, landlocked West African country with a population of 11,000,000. It is bordered by Algeria, Mali, Burkina Faso, Benin, Nigeria, Chad and Libya. Niger is a former French colony which was granted independence in 1960. The land is mostly desert plains and dunes, with rolling savannah in the southeast. capital city is Niamey. Niger is one of the poorest and least developed countries in the world, with over 80% of its territory covered by the Sahara desert. ",
                "quickFilterApplicableId": 3,
                "id": 42
            },
            {
                "name": "Ivory Coast",
                "description": "Côte d'Ivoire (also referred to as \"Ivory Coast\") is a country in West Africa. It has a southerly facing North Atlantic Ocean coast, and is surrounded by Ghana to the east, Liberia to the west, Guinea to the northwest, Mali to the north, and Burkina Faso to the northeast. Three National Parks are on the UNESCO World Heritage List; Taï National Park, Comoe National Park, Mount Nimba Strict Nature Reserve.The country, through its production of coffee and cocoa, was an economic powerhouse during the 1960s and 1970s in West Africa. As a result of the economic crisis in the 1980s, the country experienced a period of political and social turmoil. It has recently returned to a stable democracy.",
                "quickFilterApplicableId": 3,
                "id": 43
            },
            {
                "name": "Cameroon",
                "description": "Cameroon is located in West Africa. It borders Nigeria to the west, Chad to the northeast, the Central African Republic to the east and Equatorial Guinea, Gabon, and the Republic of the Congo to the south. While Cameroon is not the largest country in Africa, in some ways it's as large as Africa itself. Known as \"Africa in miniature\" it features French and English speaking portions, Muslim and Christian dominated regions, the tallest mountain in West Africa and terrain that includes rain forest, desert plains, mountains and high plateau. ",
                "quickFilterApplicableId": 3,
                "id": 44
            },
            {
                "name": "Nigeria",
                "description": "Nigeria is a country in equatorial West Africa. It is the continent's most populous nation. It has a southern coastline on the Gulf of Guinea, and has Benin to the west, Cameroon to the southeast, Chad to the northeast, and Niger to the north. It is the largest oil producer and second largest economy in Africa. ",
                "quickFilterApplicableId": 3,
                "id": 45
            },
            {
                "name": "Equatorial Guinea",
                "description": "Equatorial Guinea is a small country in West Africa, divided into two parts, the mainland and the islands. A former Spanish colony, it borders Cameroon and Gabon. ",
                "quickFilterApplicableId": 3,
                "id": 46
            },
            {
                "name": "Gabon",
                "description": "Gabon is a country in Western Central Africa. It lies on the Equator, on the Atlantic Ocean coast, between the Republic of the Congo to the south and east, Equatorial Guinea to the northwest and Cameroon to the north. A small population, as well as oil and mineral reserves have helped Gabon become one of Africa's wealthier countries. The country has generally been able to maintain and conserve its pristine rain forest and rich biodiversity. ",
                "quickFilterApplicableId": 3,
                "id": 47
            },
            {
                "name": "Sao Tome and Principe",
                "description": "São Tomé and Príncipe (often called just \"São Tomé\" for short) is a small island nation off the Atlantic coast of Central Africa, located in the Gulf of Guinea, straddling the Equator, west of Gabon. Discovered and claimed by Portugal in the late 15th century, the islands' sugar-based economy gave way to coffee and cocoa in the 19th century -- all grown with plantation slave labor, a form of which lingered into the 20th century. Although independence was achieved in 1975, democratic reforms were not instituted until the late 1980s, and the first free elections were held in 1991. São Tomé Island (Ilha de São Tomé) - the larger island (and surrounding islets). Príncipe Island (Ilha do Príncipe) - the smaller island (and surrounding islets).",
                "quickFilterApplicableId": 3,
                "id": 48
            },
            {
                "name": "Angola",
                "description": "Angola is a country in Central Africa. It is bordered by Namibia in the south, Zambia in the east and the Republic of Congo, as well as the Democratic Republic of the Congo in the north. ",
                "quickFilterApplicableId": 3,
                "id": 49
            },
            {
                "name": "Central African Republic",
                "description": "The Central African Republic is in fact at the geographic center of Africa, bordered by Cameroon to the west, Chad to the north, Sudan to the east, and the Democratic Republic of the Congo and Republic of the Congo to the south. Manovo-Gounda St. Floris National Park is on the UNESCO World Heritage List. There are pygmy settlements in the rainforests surrounding Mbaiki. Due to massive political unrest in the Central African Republic and wild rebel activity over many areas, travel to this country is strongly discouraged.   ",
                "quickFilterApplicableId": 3,
                "id": 50
            },
            {
                "name": "Democratic Republic of Congo (Zaire)",
                "description": "The Democratic Republic of the Congo (Republique Democratique du Congo) is a country in Central Africa. It straddles the Equator and is surrounded by Angola to the southwest, Republic of the Congo to the northwest, Central African Republic to the north, Sudan to the northeast, Uganda, Rwanda, Burundi, and Tanzania in the east from north to south, and Zambia to the southeast. The Democratic Republic of the Congo is most emphatically NOT a tourist destination and not safe for independent travel or sightseeing. Most foreign governments warn against any unofficial travel to the country.",
                "quickFilterApplicableId": 3,
                "id": 51
            },
            {
                "name": "Republic of the Congo",
                "description": "The Republic of the Congo is in Central Africa. The country is also known as Congo-Brazzaville to distinguish it from its giant eastern neighbour, the Democratic Republic of the Congo (Congo-Kinshasa). It is bordered by Gabon, Cameroon, the Central African Republic, the Democratic Republic of the Congo and Angola (the exclave of Cabinda). ",
                "quickFilterApplicableId": 3,
                "id": 52
            },
            {
                "name": "South Luangwa National Park",
                "description": "South Luangwa National Park in eastern Zambia, the southernmost of three national parks in the valley of the Luangwa River, is a world-renowned wildlife haven. It supports large populations of Thorneycroft's Giraffe, and herds of elephant and buffalo often several hundred strong, while the Luangwa River supports abundant crocodiles and hippopotamuses. It is one of the best-known national parks in Africa for walking safaris. Founded as a game reserve in 1938, it became a national park in 1972 and now covers 9,050 km².    ",
                "quickFilterApplicableId": 3,
                "id": 53
            },
            {
                "name": "Kruger",
                "description": "Kruger National Park was established in 1898 to protect the wildlife of the South African Lowveld, and is nearly 2 million hectares. It is home to an impressive number of species: 336 trees, 49 fish, 34 amphibians, 114 reptiles, 507 birds and 147 mammals. Man's interaction with the Lowveld environment over many centuries - from bushman rock paintings to majestic archaeological sites like Masorini and Thulamela - is very evident in the Kruger National Park. ",
                "quickFilterApplicableId": 3,
                "id": 54
            },
            {
                "name": "Okavango",
                "description": "The Okavango is a labyrinth of lagoons, lakes and hidden channels covering an area of over 17,000 square km and the largest inland delta in the world. Trapped in the parched Kalahari sands it is a magnet for the wildlife who depend on the permanent waters of this unique feature. Sometimes called a 'swamp', the Okavango is anything but. Moving, mysterious, placid, gentle and beautiful, from a wide and winding channel it spreads through tiny, almost unnoticeable channels that creep away behind a wall of papyrus reed, into an ever expanding network of increasingly smaller passages. ",
                "quickFilterApplicableId": 3,
                "id": 55
            },
            {
                "name": "Etosha",
                "description": "Etosha National Park is one of Southern Africa's finest and most important Game Reserves. Etosha Game park was declared a National Park in 1907 and covering an area of 22 270 square km, it is home to 114 mammal species. It is a desert park and water is precious, so game viewing is superb at watering holes. Visitors can expect to see many buck species, elephant, giraffe, rhino and lions. More fortunate visitors will see leopard and cheetah. There is a network of roads linking the three campsites and subsidiary roads lead to various waterholes.  ",
                "quickFilterApplicableId": 3,
                "id": 56
            },
            {
                "name": "Principe",
                "description": "<P><SPAN class=geo><SPAN class=longitude title=Longitude>Príncipe is the smaller of the two major islands of São Tomé and Príncipe lying off the west coast of Africa. It has an area of 136 km² and a population of around 5,000 people. It rises in the south to 948 metres at Pico de Príncipe, in a thickly forested area forming part of the Obo National Park. The island is a heavily eroded volcano over three million years old, surrounded by other smaller islands including Ilheu Bom Bom, Ilhéu Caroço, Tinhosa Grande and Tinhosa Pequena.</SPAN></SPAN></P>",
                "quickFilterApplicableId": 3,
                "id": 57
            },
            {
                "name": "Lake Tanganyika",
                "quickFilterApplicableId": 3,
                "id": 58
            },
            {
                "name": "Kilimanjaro",
                "quickFilterApplicableId": 3,
                "id": 59
            },
            {
                "name": "Nosy Be",
                "quickFilterApplicableId": 3,
                "id": 60
            },
            {
                "name": "Eastern Cape Reserves",
                "quickFilterApplicableId": 3,
                "id": 61
            },
            {
                "name": "KwaZulu-Natal",
                "quickFilterApplicableId": 3,
                "id": 62
            },
            {
                "name": "Mayotte",
                "quickFilterApplicableId": 3,
                "id": 63
            },
            {
                "name": "Linyanti Wildlife Region",
                "quickFilterApplicableId": 3,
                "id": 64
            },
            {
                "name": "Ultraluxe Kenya",
                "quickFilterApplicableId": 3,
                "id": 65
            },
            {
                "name": "Ultraluxe South Africa",
                "quickFilterApplicableId": 3,
                "id": 66
            },
            {
                "name": "Ultraluxe Morocco",
                "quickFilterApplicableId": 3,
                "id": 67
            },
            {
                "name": "Ultraluxe Seychelles",
                "quickFilterApplicableId": 3,
                "id": 68
            },
            {
                "name": "Tunisia",
                "quickFilterApplicableId": 3,
                "id": 1114
            },
            {
                "name": "Ancestry Ghana",
                "quickFilterApplicableId": 3,
                "id": 1140
            }
        ]
    },
    {
        "continent": "Asia",
        "id": 2,
        "countries": [
            {
                "name": "China",
                "description": "China is an ancient land on a breathtaking scale. The sheer sweep of geography, history, cultures, cuisine, is enough to tempt even the most accomplished traveler to return. Beijing, Xi'an, Shanghai, and Hong Kong are on the main tourist trail. But venture further afield and you will be rewarded.  Tibet's monasteries, Chengdu pandas, Guilin's Li River cruise through karst peaks, Yunnan's alpine kingdoms, cave buddhas of Datong, preserved city of Pingyao, Yangtze river, the western desert cities of the Silk Road - all have unique appeal. A land that is particularly suited to private guide and vehicle. ",
                "quickFilterApplicableId": 3,
                "id": 69
            },
            {
                "name": "India",
                "description": "India is a country in South Asia. It is the seventh largest country by geographical area, the second most populous country in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the west, and the Bay of Bengal on the east, India has a coastline of 7,517 kilometers (4,671 mi). Home to the Indus Valley Civilization and a region of historic trade routes and vast empires, the Indian subcontinent was identified with its commercial and cultural wealth for much of its long history. Four major world religions, Hinduism, Buddhism, Jainism and Sikhism originated there, while Zoroastrianism, Judaism, Christianity and Islam arrived in the first millennium CE and shaped the region's diverse culture. Gradually annexed by the British East India Company from the early eighteenth century and colonised by the United Kingdom from the mid-nineteenth century, India became a modern nation state in 1947 after a struggle for independence that was marked by widespread nonviolent resistance. Tourism is typically centered in the Golden Triangle of Delhi, Agra and Jaipur, including nearby Udaipur, Ranthambore, Khajuraho, and Varanasi. The southern province of Kerala, accessed from Kochi, is gaining in popularity for its houseboats, plantations, and temples of Madurai.",
                "quickFilterApplicableId": 3,
                "id": 70
            },
            {
                "name": "Vietnam",
                "description": "Vietnam is the easternmost country on the Indochina Peninsula in Southeast Asia. Vietnam was under Chinese control for a thousand years before becoming a nation-state in the 10th century. Successive dynasties flourished along with geographic and political expansion deeper into Southeast Asia, until it was colonized by the French in the mid-19th century. The French were expelled in the mid-20th century, leaving a nation divided politically into two countries. Bitter fighting between the two sides continued during the Vietnam War, ending with a communist victory in 1975. In 1986, Vietnam instituted economic and political reforms and began a path towards international reintegration. By 2000, it had established diplomatic relations with most nations. Its economic growth has been among the highest in the world in the past decade. Tourism is centered on Hanoi and Ha Long Bay in the north, Hue and Da Nang in the center, and Ho Chi Minh City (Saigon) in the south. ",
                "quickFilterApplicableId": 3,
                "id": 71
            },
            {
                "name": "Cambodia",
                "description": "The Kingdom of Cambodia is a country in South East Asia with a population of over 14 million people. The kingdom's capital and largest city is Phnom Penh. Cambodia is the successor state of the once powerful Hindu and Buddhist Khmer Empire, which ruled most of the Indochinese Peninsula between the eleventh and fourteenth centuries. The country borders Thailand to its west and northwest, Laos to its northeast, and Vietnam to its east and southeast. In the south it faces the Gulf of Thailand. The geography of Cambodia is dominated by the Mekong river and the Tonle Sap Lake (\"the fresh water lake\"), an important source of fish. In 1975 the Khmer Rouge took power and attempted to rebuild the country's agriculture on the model of the 11th century. All Western education, medicine, buildings and trained people were destroyed. Estimates put the genocide between 1 to 3 million people. Vietnam invaded to stop the Khmer Rouge and civil war followed until 1991. In recent years reconstruction efforts have begun and some political stability has finally returned to Cambodia. Tourism is one of Cambodia's main industries, primarily to Siem Riep and the great temple complex of Angkor Wat. ",
                "quickFilterApplicableId": 3,
                "id": 72
            },
            {
                "name": "Myanmar",
                "description": "Burma, officially the Union of Myanmar, is the largest country by geographical area in mainland Southeast Asia. The Gulf of Martaban and Andaman Sea define its southern periphery, with 1,930 kilometers (1,199 mi), of uninterrupted coastline. Burma's diverse population has played a major role in defining its politics, history and demographics in modern times, and the country continues to struggle to mend its ethnic tensions. Its political system remains under the tight control of the SPDC, the military-led government. The military has dominated government since General Ne Win led a coup in 1962 that toppled the civilian government of U Nu. The government has encouraged tourism since 1992, however, volume of visitors is low. Top sights include Bagan, Mandalay and Yangon (Rangoon).",
                "quickFilterApplicableId": 3,
                "id": 73
            },
            {
                "name": "Laos",
                "description": "Laos is a landlocked country in southeast Asia, bordered by Burma (Myanmar) and China to the northwest, Vietnam to the east, Cambodia to the south, and Thailand to the west. Laos traces its history to the Kingdom of Lan Xang or Land of a Million Elephants, which existed from the fourteenth to the eighteenth century. After a period as a French protectorate, it gained independence in 1949. A long civil war ended officially when the communist Pathet Lao movement came to power in 1975. After taking control of the country, Pathet Lao's government gave Vietnam the right to station military forces and to appoint advisers to assist in overseeing the country. Control by Vietnam and socialization were slowly replaced by a relaxation of economic restrictions in the 1980s and admission into ASEAN in 1997. In 2005, the United States established Normal Trade Relations with Laos. Tourism in the country is centered on Luang Prabang, the ancient royal city with its dozens of temples and palaces. Vientienne, the capitol, is also picturesque and quiet. ",
                "quickFilterApplicableId": 3,
                "id": 74
            },
            {
                "name": "Thailand",
                "description": "<p>The Kingdom of Thailand is at the center of Southeast Asia. Thailand is one of the most strongly Buddhist countries in the world, the national religion is Theravada Buddhism which is practiced by more than 95% of all Thais. The region has been settled since 10,000 BC, and has been ruled by various kingdoms over the centuries, including the Tai, Mon, Khmer, Malay and Burmese. the first Thai or Siamese state is traditionally considered to be the Buddhist kingdom of Sukhothai, which was founded in 1238. current era of Thai history began in 1782 under King Rama I the Great. Due to its strong monarchy, Thailand is the only country in Southeast Asia that has never been colonized or taken over by a European power. The capital and largest city of Thailand is Bangkok. It is also the country's centre of political, commercial, industrial, cultural and tourism activities. Visitors also go north to the hill tribes around Chiang Mai, and south to the beaches near Phuket and Koh Samui.</p>",
                "quickFilterApplicableId": 3,
                "id": 75
            },
            {
                "name": "Singapore",
                "description": "Singapore is an island country located at the southern tip of the Malay Peninsula, and is the smallest nation in Southeast Asia. Singapore is one of four remaining true city-states in the world. Prior to European settlement, it was the site of a Malay fishing village at the mouth of the Singapore River. In 1819 the British East India Company established a trading post on the island, which was used thereafter as a strategic trading post along the spice route. Singapore would become one of the most important commercial and military centres of the British Empire, and the hub of British power in Southeast Asia. The city was occupied by the Japanese during World War II, which Winston Churchill called \"Britain's greatest defeat\". Singapore reverted to British rule immediately postwar, in 1945. Eighteen years later the city, having achieved independence from Britain, merged with Malaya, Sabah and Sarawak to form Malaysia. However, less than two years later it seceded from the federation and became an independent republic. Since independence, Singapore's standard of living has been on the rise. Foreign direct investment and a state-led drive to industrialisation have created a modern economy focused on electronics manufacturing, petrochemicals, tourism and financial services. Singapore is the 8th wealthiest country in the world in terms of GDP per capita. ",
                "quickFilterApplicableId": 3,
                "id": 76
            },
            {
                "name": "Malaysia",
                "description": "Malaysia is a country that consists of thirteen states and three federal territories in Southeast Asia. The capital city is Kuala Lumpur, and Putrajaya is the seat of the federal government. The country is separated into two regions, Peninsular Malaysia and Malaysian Borneo by the South China Sea. Malaysia as a unified state did not exist until 1963. Previously, a set of colonies were established by the United Kingdom from the late-18th century, and the western half of modern Malaysia was composed of several separate kingdoms. The Malays form the majority of the population. Some Malays are of Arab descent and there are sizable Chinese and Indian communities. Islam is the largest and the official religion of the federation. Malay is the official language. Tourism is centered on Kuala Lumpur. The ancient port city of Penang has fascinating temples and traditional buildings. And jungle tours of Borneo are increasing in popularity with the unique wildlife.",
                "quickFilterApplicableId": 3,
                "id": 77
            },
            {
                "name": "Sri Lanka",
                "description": "Sri Lanka (known as Ceylon before 1972) is an island nation in South Asia, located about 31 kilometres (19.3 mi) off the southern coast of India. It is home to around twenty million people. Because of its location in the path of major sea routes, Sri Lanka is a strategic naval link between West Asia and South East Asia, and has been a center of Buddhist religion and culture from ancient times. Today, the country is a multi-religious and multi-ethnic nation. The Sinhalese are the majority, with Tamils, concentrated in the north and east of the island, forming the largest ethnic minority.  Famous for the production and export of tea, coffee, coconuts and rubber, Sri Lanka boasts a progressive and modern industrial economy and the highest per capita income in South Asia. The natural beauty of Sri Lanka's tropical forests, beaches and landscape, as well as its rich cultural heritage, make it a world famous tourist destination.",
                "quickFilterApplicableId": 3,
                "id": 78
            },
            {
                "name": "Maldives",
                "description": "The Maldives is an island nation consisting of a group of atolls stretching south of India's Lakshadweep islands between the Minicoy and the Chargos archipelagoes, and about seven hundred kilometres (435 mi) south-west of Sri Lanka in the Laccadive Sea of Indian Ocean. The twenty-six atolls of Maldives encompass a territory featuring 1,192 islets, of which 250 are inhabited. The inhabitants were Hindu, then Buddhist in Ashoka's period (3rd century BC), and Islam was introduced in 1153. The Maldives  came under the influence of the Portuguese (1558) and the Dutch (1654) seaborne empires. In 1887 it became a British protectorate. In 1965, the Maldives obtained independence from Britain and in 1968 the Sultanate was replaced by a Republic. The Maldives is the smallest Asian country in terms of both population and area; it is the smallest predominantly Muslim nation in the world. It is also the country with the lowest highest point in the world. ",
                "quickFilterApplicableId": 3,
                "id": 79
            },
            {
                "name": "Nepal",
                "description": "Nepal is a landlocked country in South Asia, bordered by China to the north and India to the south, east and west. Historically, Nepal had many small kingdoms and the modern state was formed with the Unification of Nepal by Prithvi Narayan Shah on December 21, 1768. Prior to 2006, Nepal was a kingdom. Nepal is now a federal democratic republic. Its recent history has involved struggles for democratic government with periods of direct monarchic rule. The Himalaya mountain range runs across Nepal's northern and western parts, and eight of the world's ten highest mountains, including the highest, Mount Everest, are within its territory. Technically, the south-east ridge on the Nepali side of the mountain is easier to climb; so, most climbers prefer to trek to Everest through Nepal. The Annapurna circuit is another popular mountain trek, based from the city of Pokara in the south. Kathmandu is the capitol and transportation hub into the country. It has a diverse collection of temples, stupas, shops, restaurants and bars. ",
                "quickFilterApplicableId": 3,
                "id": 80
            },
            {
                "name": "Indonesia",
                "description": "Indonesia is a country in Southeast Asia. Comprising 17,508 islands, it is the world's largest archipelagic state. The five largest islands are Java, Sumatra, Kalimantan (the Indonesian part of Borneo), New Guinea (shared with Papua New Guinea), and Sulawesi. With a population of 222 million people, it is the world's fourth most populous country and the most populous Muslim-majority nation. Indonesia is a republic, with an elected legislature and president. The nation's capital city is Jakarta. Across its many islands, Indonesia consists of distinct ethnic, linguistic, and religious groups. Despite its large population and densely populated regions, Indonesia has vast areas of wilderness that support the world's second highest level of biodiversity. Indonesia's location on the edges of the Pacific, Eurasian, and Australian tectonic plates makes it the site of numerous volcanoes and frequent earthquakes. Indonesia has at least 150 active volcanoes, including Krakatoa and Tambora. Bali is an island in Indonesia and has gained popularity as an island get-away.",
                "quickFilterApplicableId": 3,
                "id": 83
            },
            {
                "name": "Bhutan",
                "description": "Kingdom of Bhutan is a landlocked nation in South Asia. It is located amid the eastern end of the Himalaya Mountains and is bordered to the south, east and west by India and to the north by Tibet. Bhutan used to be one of the most isolated nations in the world, but developments including direct international flights, internet, mobile phone networks, and cable television have increasingly opened the doors. Yet, the government takes great measures to preserve the nation's traditional culture, identity and the environment. The landscape ranges from subtropical plains in the south to the Himalayan heights in the north, with some peaks exceeding 7,000 metres (23,000 ft). The population is predominantly Buddhist, with Hinduism being the second-largest religion. The capital and largest city is Thimphu. After centuries of direct monarchic rule, Bhutan held its first democratic elections in March 2008.",
                "quickFilterApplicableId": 3,
                "id": 88
            },
            {
                "name": "Brunei",
                "description": "The Sultanate of Brunei was very powerful from the fourteenth to the sixteenth century. Its realm extended over the coastal regions of modern-day Sarawak and Sabah, the Sulu archipelago, and the islands off the northwest tip of Borneo. European influence gradually brought an end to this regional power. The decline of the Bruneian Empire culminated in the nineteenth century when Brunei lost much of its territory to the White Rajahs of Sarawak. Brunei was a British protectorate from 1888 to 1984, when it regained its independence. It is a comparatively wealthy country due to its oil exports. The main highway running across Brunei is the Pan Borneo Highway, which is a joint project with Malaysia. Brunei can also be accessed by air through Brunei International Airport. ",
                "quickFilterApplicableId": 3,
                "id": 89
            },
            {
                "name": "Japan",
                "description": "Japan is an island country in East Asia, located in the Pacific Ocean. Japan comprises over 3,000 islands making it an archipelago. The largest islands are Honshu, Hokkaido, Kyushu and Shikoku, together accounting for 97% of Japan's land area. Most of the islands are mountainous, many volcanic; for example, Japan’s highest peak, Mount Fuji, is a volcano. About 70% of the country is forested, mountainous, and unsuitable for agricultural, industrial, or residential use. This has resulted in an extremely high population density in the habitable zones that are mainly located in coastal areas. Japan is one of the most densely populated countries in the world. Japan has the world's tenth largest population, with about 128 million people. The Greater Tokyo Area is the largest metropolitan area in the world, with over 30 million residents. A major economic power, Japan has the world's second largest economy. It is a developed country with high living standards (8th highest HDI) and a world leader in technology, machinery, and robotics. ",
                "quickFilterApplicableId": 3,
                "id": 90
            },
            {
                "name": "North Korea",
                "description": "North Korea (officially Democratic People's Republic of Korea or DPRK) is a country in East Asia. It occupies the northern half of the Korean Peninsula that lies between Korea Bay and the East Sea, also called the Sea of Japan. It borders China to the north, Russia to the northeast and South Korea to the south. Tourist travel to North Korea is only possible as part of a guided tour. Independent travel is not permitted. If you are not prepared to accept limitations on your movements and behavior, you should not travel to the DPRK at the present time. On the other hand, travel in the DPRK is, if nothing else, a unique experience. ",
                "quickFilterApplicableId": 3,
                "id": 91
            },
            {
                "name": "South Korea",
                "description": "South Korea occupies the southern half of the Korean Peninsula, with North Korea to the north, China across the sea to the west and Japan a short ferry ride to the southeast. Seoul is the capital city. The country has nine regions ranging from seaside resorts to fertile plain and rocky peaks. North Gyeongsang is the largest province and richest area for historical and cultural sites. South Gyeongsang is known for its gorgeous seaside cities and most respected Busan and Haeinsa Temple. Jeju is Korea's honeymoon island, built by a volcano. Great scenery with wild flowers and horseback riding. One of the few places you may need a car. ",
                "quickFilterApplicableId": 3,
                "id": 92
            },
            {
                "name": "Taiwan",
                "description": "Economically successful Taiwan, the Republic of China, once known as \"Ilha Formosa\" - the beautiful isand, is an island nation of about 36,000 square kilometers located off the southeast coast China. Home to more than 23 million people Taiwan is known both for it's unique political situation, vibrant cities and stunning nature from steep mountains to lush forests and postcard shores.",
                "quickFilterApplicableId": 3,
                "id": 93
            },
            {
                "name": "Mongolia",
                "description": "Mongolia is a landlocked country located between China and Russia. It is a vast emptiness that links land and sky, and is one of the last few places on the planet where nomadic life is still a living tradition. Mongolia is entirely landlocked, sandwiched between China and Russia. The country is nicknamed the \"Land of Blue Skies,\" and with good reason. There is said to be about 250 sunny days throughout each year. The weather is bitterly cold during the winter, dropping down to -40º Celsius (-40º F) in some parts. With many types of terrain--from desert to verdant mountains--the weather during the summer varies from region to region, but is generally hot. ",
                "quickFilterApplicableId": 3,
                "id": 94
            },
            {
                "name": "Philippines",
                "description": "The Republic of the Philippines is an archipelago in South-East Asia consisting of 7,107 islands located between the Philippine Sea and the South China Sea, east of Vietnam, and north of Sabah and Borneo. The Philippines is an archipelago abundant in nature, rich in culture, and filled with pleasant discoveries. Experience the Philippines, its 7,107 islands, its natural wonders, colorful history and warm, engaging people. Over a hundred ethnic groups, a mixture of foreign influences and a fusion of culture and arts have enhanced the uniqueness of the Filipino race and the wonder that is the Philippines. Manila is the national capital. ",
                "quickFilterApplicableId": 3,
                "id": 95
            },
            {
                "name": "Shanghai",
                "description": "Shanghai is the symbol of \"New China\", bustling and busy with excellent shopping. With an eclectic architectural mix from Asian infused Victorian and Art Deco to 21st Century avant-garde, Shanghai is an exciting, ever-changing metropolis. Popular attractions range from the Jade Buddha Temple, Yuyuan Garden and Shanghai Museum to modern wonders like the Oriental Pearl Tower. Landmarks of the city include the French Concession and historic waterfront known as the Bund. Shanghai is an excellent base from which to explore the canal towns of the Yangtze delta as well as nearby Suzhou or Hangzhou. Shanghai will host the 2010 World's Fair.",
                "quickFilterApplicableId": 3,
                "id": 105
            },
            {
                "name": "Hue",
                "description": "Hue was the capitol of Vietnam, from 1744 until 1945, when the last emperor abdicated. The city was severely damaged in the war, but many architectural gems remain. The city features the old Imperial complex, the Citadel and the Forbidden city, pagodas, and the many tombs of the emperors that lie a few kilometers south of the city. Each tomb is a walled compound containing temples, palaces, and lakes. Hue is divided between the older fortified Citadel, containing almost everything interesting, and the new, smaller sprawl that has developed across the river. The new side contains most of the facilities, the hotels, restaurants, travel agencies, and banks. It is a quiet, relaxing city, big enough to be interesting but small enough to bicycle around. ",
                "quickFilterApplicableId": 3,
                "id": 106
            },
            {
                "name": "Mekong River",
                "description": "The Mekong is one of the world’s major rivers. It is the 12th-longest river in the world, and 7th longest in Asia. (discharging 475 km3/114 cu mi of water annually). Its estimated length is 4,350 km (2,703 mi), and it drains an area of 795,000 km2 (307,000 sq mi).   From the Tibetan Plateau it runs through China's Yunnan province, Burma, Thailand, Laos, Cambodia and Vietnam. All except China and Burma belong to the Mekong River Commission. A South Asian regional association, Mekong-Ganga Cooperation is named after this river. The extreme seasonal variations in flow and the presence of rapids and waterfalls have made navigation extremely difficult.",
                "quickFilterApplicableId": 3,
                "id": 107
            },
            {
                "name": "Mandalay",
                "description": "Mandalay is rich in palaces, stupas, temples and pagodas, and is the main center of Buddhism and Burmese arts. Taking its name from Mandalay Hill (rising about 240m/787ft to the northeast of the palace), the city was founded by King Mindon in 1857. Sights of interest include the huge Shweyattaw Buddha, close to the hill, with its outstretched finger pointing towards the city; the Eindawya Pagoda, built in 1847 and covered in gold leaf; the Shwekyimyint Pagoda, containing the original Buddha image consecrated by Prince Minshinzaw during the Pagan period; and the Mahumuni Pagoda or ‘Great Pagoda’, housing the famous and revered Mahumuni image. Covered in gold leaf over the years by devout Buddhists, this image was brought from Arakan in 1784, although it is thought to be much older.",
                "quickFilterApplicableId": 3,
                "id": 108
            },
            {
                "name": "Chiang Mai",
                "description": "Chiang Mai in the far north is Thailand's second-largest city and a center for excursions to the region's ancient and beautiful temples, the teak forests and their working elephants, caves and waterfalls, and journeys to visit the northern hill tribes. The main attractions are the Doi Suthep temple and elephant trekking. Doi Suthep is one of the most famous temples in northern Thailand. Perched high on a hilltop, it offers fine views over the city on clear days. The trip up can either be made via a funicular or a grand staircase with 400 steps. The banisters alone are worth a visit: a giant green-and-red glazed serpent winds its way down to end in a magnificent dragon's head.",
                "quickFilterApplicableId": 3,
                "id": 109
            },
            {
                "name": "Chiang Rai",
                "description": "Chiang Rai is the most northern province of Thailand. The mighty Mekong river creates a border in the north to both Laos and Myanmar (Burma). The place where all these countries touch is the famous-infamous Golden Triangle. The terrain of Chiang Rai province is mountainous and covered in large parts with tropical rain forests. The scenery is among the most  beautiful of Thailand and one of the best things about Chiang Rai province is its rich cultural diversity - various hill tribes, Thais, ancient aboriginal people like the Lawa or Khamu, Shans, Lao, Chinese, and Mon. In addition, the province offers opportunities for boat tours (on the river Kok and on the Mekong), elephant rides, hill trekking, and sightseeing. ",
                "quickFilterApplicableId": 3,
                "id": 110
            },
            {
                "name": "Krabi",
                "description": "Krabi is located on the west coast of southern Thailand at the mouth of the Krabi River into the Andaman Sea.  The town is served by the Krabi Airport west of the town. Passing through the town is Phetkasem highway (Thai highway 4). Many tourists travel through Krabi town to go to the more popular locations nearby, like Ko Phi Phi, Railay Beach, Ao Nang, Had Yau, Ko Jum, Phuket and Ko Lanta.",
                "quickFilterApplicableId": 3,
                "id": 111
            },
            {
                "name": "Surat Thani",
                "description": "Surat Thani is the largest of the southern provinces (changwat) of Thailand, on the eastern shore of the Gulf of Thailand. Surat Thani means City of Good People, the title given to the city by King Vajiravudh (Rama VI).",
                "quickFilterApplicableId": 3,
                "id": 112
            },
            {
                "name": "Ubon Ratchathani",
                "description": "Ubon Ratchathani is one of the north-eastern provinces (changwat) of Thailand, and the country's easternmost. Ubon is about 600 km away from Bangkok. Neighboring Provinces are (from west clockwise) Sisaket, Yasothon and Amnat Charoen. To the north and east it borders Salavan and Champasak of Laos, to the south Preah Vihear of Cambodia.  ",
                "quickFilterApplicableId": 3,
                "id": 113
            },
            {
                "name": "Mae Hong Son",
                "description": "Mae Hong Son is one of the northern provinces (changwat) of Thailand, and at the same time the westernmost. Neighboring provinces are (from north clockwise) Shan State of Myanmar, Chiang Mai and Tak. To the west it borders Kayin State and Kayah State of Myanmar again. It was formerly called Mae Rong Son (also Maerongson, Mae Rong Sorn or Maerongsorn).  Mae Hong Son (The City of Three Mists) is nestled in a deep valley hemmed in by high mountain ranges, Mae Hong Son has long been isolated from the outside world. It is the most mountainous province in Thailand and composed of a total of 13, 814 square kilometers. It is virtually covered with mist throughout the year, the name refers to the fact that this terrain is highly suitable for the training of elephants. Former governors of Chiang Mai used to organize the rounding up of wild elephants which were then trained before being sent to the capital for work. Today, Mae Hong Son is one of the \"dream destination\" for visitors. Daily flights into its small airport bring growing numbers of tourists, attracted by the natural scenery, numerous hill-tribe communities and soft adventure opportunities.",
                "quickFilterApplicableId": 3,
                "id": 114
            },
            {
                "name": "Sumatra",
                "description": "<P>Sumatra (also spelled Sumatera) is an island in western Indonesia, westernmost of the Sunda Islands. It is the largest island entirely in Indonesia, and the sixth largest island in the world at 473,481 km² with a population of 50,365,538. Its biggest city is Medan with a population of 1,770,000. People who spoke Austronesian languages first arrived in Sumatra around 500 BCE, as part of the Austronesian expansion from Taiwan to Southeast Asia. With its location in the India-China sea trade route, several trading towns flourished, especially in the eastern coast, and were influenced by Indian religions. It is also a geologically active area due to its location on the 'Ring of Fire'.</P>",
                "quickFilterApplicableId": 3,
                "id": 116
            },
            {
                "name": "Manila",
                "description": "Manila is the capital of the Philippines. Directly south of Intramuros lies Rizal Park, the country's most significant park. Also known as Luneta (Spanish term for \"crescent-shaped\") and previously as Bagumbayan (\"New Town\"), the 53 hectare Rizal Park sits on the site where José Rizal, the country's national hero, was executed by the Spaniards on charges of subversion. A monument stands in his honor. The big flagpole west of the Rizal Monument is the Kilometer Zero for road distances on the island of Luzon and the rest of the country. Other attractions in Rizal Park include the Chinese and Japanese Gardens, the Department of Tourism building, the National Museum of the Philippines, The National Library of the Philippines, the Planetarium, the Orchidarium and Butterfly Pavilion, an open-air auditorium for cultural performances, a relief map of the Philippines, a fountain area, a children's lagoon, a chess plaza, a light and sound presentation, the Quirino Grandstand and the Manila Ocean Park. Aside from Rizal Park, Manila has very few other open public spaces. Rajah Sulayman Park, Manila Boardwalk, Liwasang Bonifacio, Plaza Miranda, Mehan Garden, Paco Park, Remedios Circle, Manila Zoological and Botanical Garden, Plaza Balagtas and the Malacañang Garden are some of the other parks in the city. In 2005, Mayor Lito Atienza opened the Pandacan Linear Park, a strip of land that served as a buffer zone between the oil depot and the residential-commercial properties in Pandacan and could be found along the banks of the Pasig River. In the northern most part of the city lies the three cemeteries of Loyola, Chinese, and Manila North Green Park, the largest public cemetery in Metropolitan Manila. A newly opened and functioned Manila Ocean Park features a wide variety of marine animals.    ",
                "quickFilterApplicableId": 3,
                "id": 119
            },
            {
                "name": "Cebu",
                "description": "Cebu is a province in the Philippines, consisting of Cebu island, and 167 surrounding islands. It is located to the east of Negros, to the west of Leyte, and Bohol islands. It is one of the most developed provinces in the Philippines, with Cebu City as the main center of commerce, trade, education, and industry in the central, and southern islands of the Visayas. It has five-star hotels, casinos, white sand beaches, world-class golf courses, convention centers, and shopping malls. The UK-based Condé Nast Traveler Magazine named Cebu the seventh best island destination in the Indian Ocean-Asia region in 2007, eighth best Asian-Pacific island destination in 2005, and seventh in 2004.",
                "quickFilterApplicableId": 3,
                "id": 120
            },
            {
                "name": "Palawan",
                "description": "Palawan is an island province of the Philippines. It is the only Philippine island rated by National Geographic Traveler magazine as the best island destination in East and Southeast Asia region in 2007, and the 13th best island in the world having \"incredibly beautiful natural seascapes and landscapes. One of the most biodiverse (terrestrial and marine) islands in the Philippines.  It is the habitat of 232 endemic species. Some of these unique creatures are the metallic-colored peacock pheasant, the shy mousedeer, the cuddly bearcat, and the reclusive scaly anteater. In the forests and grasslands, the air resonates with the songs of more than 200 kinds of birds. Over 600 species of butterflies flutter around the mountains and fields of Palawan, attracted to some 1500 hosts plants found here. Endangered sea turtles nest on white sand beaches, and the gentle dugong feeds on the seagrass that abound in Palawan’s waters.   ",
                "quickFilterApplicableId": 3,
                "id": 121
            },
            {
                "name": "Bohol",
                "description": "Bohol is an island province of the Philippines located in the Central Visayas region, consisting of Bohol Island and 75 minor surrounding islands. The province is a popular tourist destination with its beaches and resorts.[3] The Chocolate Hills, numerous mounds of limestone formation, is the most popular attraction. The island of Panglao, located just southwest of Tagbilaran City, is famous for its diving locations and routinely listed as one of the top ten diving locations in the world. Numerous tourist resorts dot the southern beaches and cater to divers from around the world. The Philippine Tarsier, considered the second-smallest primate in the world, is indigenous to the island.",
                "quickFilterApplicableId": 3,
                "id": 122
            },
            {
                "name": "Bali",
                "description": "Bali is an Indonesian island, the westernmost of the Lesser Sunda Islands, lying between Java to the west and Lombok to the east. It is one of the country's 33 provinces with the provincial capital at Denpasar towards the south of the island. With a population recorded as 3,151,000 in 2005, the island is home to the vast majority of Indonesia's small Hindu minority. 93.18% of Bali's population adheres to Balinese Hinduism, while most of the remainder follow Islam. It is also the largest tourist destination in the country and is renowned for its highly developed arts, including dance, sculpture, painting, leather, metalworking and music.",
                "quickFilterApplicableId": 3,
                "id": 123
            },
            {
                "name": "Sulawesi",
                "description": "South Sulawesi is a <A title=\"Provinces of Indonesia\" href=\"http://en.wikipedia.org/wiki/Provinces_of_Indonesia\"><FONT color=#002bb8>province</FONT></A> of <A title=Indonesia href=\"http://en.wikipedia.org/wiki/Indonesia\"><FONT color=#002bb8>Indonesia</FONT></A>, located on the western southern peninsula of <A title=Sulawesi href=\"http://en.wikipedia.org/wiki/Sulawesi\"><FONT color=#002bb8>Sulawesi Island</FONT></A>. The province is bordered by <A title=\"Central Sulawesi\" href=\"http://en.wikipedia.org/wiki/Central_Sulawesi\"><FONT color=#002bb8>Central Sulawesi</FONT></A> province to the north, <A title=\"South East Sulawesi\" href=\"http://en.wikipedia.org/wiki/South_East_Sulawesi\"><FONT color=#002bb8>South East Sulawesi</FONT></A> province to the east and <A title=\"West Sulawesi\" href=\"http://en.wikipedia.org/wiki/West_Sulawesi\"><FONT color=#002bb8>West Sulawesi</FONT></A> province to the west (West Sulawesi province was split from South Sulawesi in 2004). The capital of South Sulawesi is <A title=Makassar href=\"http://en.wikipedia.org/wiki/Makassar\"><FONT color=#5a3696>Makassar</FONT></A>.",
                "quickFilterApplicableId": 3,
                "id": 124
            },
            {
                "name": "Sakhalin Island",
                "description": "<P><BR>Sakhalin, also called&nbsp;Saghalien, is a large elongated island in the North Pacific, lying between 45°50' and 54°24' N. It is part of Russia and is its largest island, administered as part of Sakhalin Oblast.</P>",
                "quickFilterApplicableId": 3,
                "id": 125
            },
            {
                "name": "Kuril Island",
                "description": "<p>The Kuril Islands or Kurile Islands in Russia's Sakhalin Oblast region, is a volcanic archipelago that stretches approximately 1,300 km (810 mi) northeast from Hokkaido, Japan, to Kamchatka, Russia, separating the Sea of Okhotsk from the North Pacific Ocean. There are 56 islands and many more minor rocks. All of the islands are under Russian jurisdiction, but Japan claims the four southernmost as part of its territory, which has led to the ongoing Kuril Islands dispute.</p>  <p>&nbsp;</p>",
                "quickFilterApplicableId": 3,
                "id": 126
            },
            {
                "name": "Tasmania",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 127
            },
            {
                "name": "Flores",
                "description": "Centuries ago Portuguese explorers named the island \"Cabo das Flora\" (Cape of Flowers) after the abundant coral reefs in the surrounding seas. Today Flores is dotted with small villages inhabited by people of mixed ethnic origin who rely on traditional farming and fishing for survival. This mountainous island boasts no less than 14 active volcanoes and the most breathtaking scenery can be found at the three crater lakes beneath the rim of Keli Mutu volcano. Each lake is a different colour as a result of their varying dissolving minerals and oxygen levels. When set against the surrounding rugged terrain, the view is nothing short of spectacular",
                "quickFilterApplicableId": 3,
                "id": 131
            },
            {
                "name": "Sumba Island",
                "description": "Sumba is an island in eastern Indonesia, is one of the Lesser Sunda Islands, and is in the province of East Nusa Tenggara. The island has a small population and a dry tropical climate. In total Sumba&nbsp;receives more hours of sunshine per year than any other place in Indonesia. The land resembles Southern Africa or Australia, with scattered small villages and herds of cattle and buffalo. The largest town on the island is the main port of Waingapu, with a population of about 10,700. The landscape is low, limestone hills, rather than the steep volcanoes of many Indonesian islands. There is a dry season from May to November and a rainy season from December to April. The western side of the island is more fertile and more heavily populated than the east.",
                "quickFilterApplicableId": 3,
                "id": 132
            },
            {
                "name": "Savu Island",
                "description": "About as remote as it gets in this part of the world, the tiny islands of Savu and Raijua sit beneath Sumba and above Timor in almost isolation. The Savunese people consider themselves of Indian-Aryan descent and have strong historical to other traditionally Hindu parts of the island archipelago such as Java and Bali. Barely influenced by the outside world, today the island is predominately Christian. The great naturalist explorer Alfred R Wallace once commented on meeting his first Savu Islanders in 1868 \"some chiefs of the island of Savu represented characters very distinct from either the Malay or Papuan races. They most resemble Hindus, having well formed features and straight thin noses with clear brown complexions\".&nbsp; The island is extremely dry, receiving no more than around 100mm a year, which will generally fall in one massive downpour during the monsoon season. The land is mostly covered by grasslands and tall Lontar palms, used for making palm sugar and a potent local drink.<BR>",
                "quickFilterApplicableId": 3,
                "id": 133
            },
            {
                "name": "Rote Island",
                "description": "Roti&nbsp;is one of the driest parts of Indonesia and resembles nearby Timor in both climate and plant life. Agriculture is a mainstay, but is not practiced on a large scale due to the dry climate. Fishing is an important part of daily life from both a subsistence and commercial point of view, and due to the proximity of Australian territorial waters fisherman from Roti often come in to conflict with Australian law enforcement bodies.",
                "quickFilterApplicableId": 3,
                "id": 134
            },
            {
                "name": "Suzuka",
                "quickFilterApplicableId": 3,
                "id": 135
            },
            {
                "name": "South Jeolla",
                "quickFilterApplicableId": 3,
                "id": 136
            },
            {
                "name": "Tongatapu",
                "quickFilterApplicableId": 3,
                "id": 137
            },
            {
                "name": "Xieng Khouang",
                "quickFilterApplicableId": 3,
                "id": 138
            },
            {
                "name": "Oudomxay",
                "quickFilterApplicableId": 3,
                "id": 139
            },
            {
                "name": "East Timor",
                "quickFilterApplicableId": 3,
                "id": 140
            },
            {
                "name": "Raja Ampat Islands",
                "quickFilterApplicableId": 3,
                "id": 141
            },
            {
                "name": "Banda Islands",
                "quickFilterApplicableId": 3,
                "id": 142
            },
            {
                "name": "Central Kalimantan",
                "quickFilterApplicableId": 3,
                "id": 143
            },
            {
                "name": "Marquesas Islands",
                "quickFilterApplicableId": 3,
                "id": 144
            },
            {
                "name": "Sittwe",
                "quickFilterApplicableId": 3,
                "id": 145
            },
            {
                "name": "Banyuwangi",
                "quickFilterApplicableId": 3,
                "id": 146
            },
            {
                "name": "Malé Atoll",
                "quickFilterApplicableId": 3,
                "id": 147
            },
            {
                "name": "Viti Levu",
                "quickFilterApplicableId": 3,
                "id": 148
            },
            {
                "name": "Okinawa",
                "quickFilterApplicableId": 3,
                "id": 149
            },
            {
                "name": "Java",
                "quickFilterApplicableId": 3,
                "id": 150
            },
            {
                "name": "Trat",
                "quickFilterApplicableId": 3,
                "id": 151
            },
            {
                "name": "Komodo Island",
                "quickFilterApplicableId": 3,
                "id": 152
            },
            {
                "name": "Phoenix Islands",
                "quickFilterApplicableId": 3,
                "id": 153
            },
            {
                "name": "Champasak",
                "quickFilterApplicableId": 3,
                "id": 154
            },
            {
                "name": "East Kalimantan",
                "quickFilterApplicableId": 3,
                "id": 155
            },
            {
                "name": "Angkor Ban",
                "quickFilterApplicableId": 3,
                "id": 156
            },
            {
                "name": "Hong Kong",
                "quickFilterApplicableId": 3,
                "id": 157
            },
            {
                "name": "Tibet",
                "quickFilterApplicableId": 3,
                "id": 158
            },
            {
                "name": "Southeast Asia",
                "quickFilterApplicableId": 3,
                "id": 159
            },
            {
                "name": "Phang Nga Bay",
                "quickFilterApplicableId": 3,
                "id": 160
            },
            {
                "name": "Asia River Cruise",
                "quickFilterApplicableId": 3,
                "id": 161
            },
            {
                "name": "Asia Cruise",
                "quickFilterApplicableId": 3,
                "id": 162
            },
            {
                "name": "South Pacific Cruise",
                "quickFilterApplicableId": 3,
                "id": 163
            },
            {
                "name": "Ranong",
                "quickFilterApplicableId": 3,
                "id": 164
            },
            {
                "name": "Batam",
                "quickFilterApplicableId": 3,
                "id": 165
            },
            {
                "name": "Ultraluxe Thailand",
                "quickFilterApplicableId": 3,
                "id": 168
            },
            {
                "name": "Ultraluxe Indonesia",
                "quickFilterApplicableId": 3,
                "id": 169
            },
            {
                "name": "Ultraluxe India",
                "quickFilterApplicableId": 3,
                "id": 171
            },
            {
                "name": "Ultraluxe Maldives",
                "quickFilterApplicableId": 3,
                "id": 172
            },
            {
                "name": "Afghanistan",
                "quickFilterApplicableId": 3,
                "id": 1077
            },
            {
                "name": "Bangladesh",
                "quickFilterApplicableId": 3,
                "id": 1080
            },
            {
                "name": "Pakistan",
                "quickFilterApplicableId": 3,
                "id": 1104
            },
            {
                "name": "Ski Japan",
                "quickFilterApplicableId": 3,
                "id": 1111
            },
            {
                "name": "Yemen",
                "quickFilterApplicableId": 3,
                "id": 1119
            },
            {
                "name": "Ancestry Japan",
                "quickFilterApplicableId": 3,
                "id": 1134
            }
        ]
    },
    {
        "continent": "AusPac",
        "id": 3,
        "countries": [
            {
                "name": "Australia",
                "description": "Australia is the world's smallest continent, and includes Tasmania and other islands. Prior to European settlement in the late 1700s and early 1800s, the Australian mainland was inhabited by around 250 individual nations of indigenous Australians for around 40,000 years. After sporadic visits by fishermen from the north and then European discovery by Dutch explorers in 1606, the eastern half of Australia was later claimed by the British in 1770 and initially settled through penal transportation to the colony of New South Wales. As the population grew and new areas were explored, another five largely self-governing Crown Colonies were established during the 19th century. On 1 January 1901, the six colonies became a federation, and the Commonwealth of Australia was formed. \\There are iconic sights \"down under\" that find their way on most itineraries; Sydney (Opera House, Harbour Bridge), Ayers Rock, the Great Barrier Reef, Melbourne. Other gems include the wild nature of Tasmania, vineyards of Hunter Valley, surfing on the Gold Coast, Adelaide, Darwin ... and more.",
                "quickFilterApplicableId": 3,
                "id": 81
            },
            {
                "name": "New Zealand",
                "description": "New Zealand is notable for its geographic isolation, situated about 2000 km (1250 miles) southeast of Australia across the Tasman Sea, and its closest neighbours to the north are New Caledonia, Fiji and Tonga. Auckland is the hub of the islands, and top sights include; Christchurch, Milford Sound, Mount Ruapehu, Queenstown, Rotorua, and Wellington. It is a country of extremes, mountains and ocean, volcanoes and ice, adrenaline activities and B&Bs. A perennial favourite of travelers.",
                "quickFilterApplicableId": 3,
                "id": 82
            },
            {
                "name": "Vanuatu",
                "description": "Vanuatu is an island nation located in the South Pacific Ocean, consisting of approximately 82 relatively small, geologically newer islands of volcanic origin (65 of them inhabited), with about 800 miles (1,300 km) north to south distance between the outermost islands. The archipelago is some 1,750 kilometres (1,090 mi) east of northern Australia. Port Vila is the capitol and Vanuatu's largest city, with a population of about 40,000. It is situated on the south coast of the island of Efate, in Shefa Province, and is the economic and commercial centre of Vanuatu. ",
                "quickFilterApplicableId": 3,
                "id": 84
            },
            {
                "name": "Fiji",
                "description": "Fiji is an island nation in the South Pacific Ocean east of Vanuatu, west of Tonga and south of Tuvalu. The country occupies an archipelago of about 322 islands, of which 106 are permanently inhabited, and 522 islets. The two major islands, Viti Levu and Vanua Levu, account for 87% of the population. Fiji's culture is a rich mosaic of indigenous, Indian, Chinese and European traditions, comprising social polity, language, food (based mainly from the sea, casava, dalo & other vegetables), costume, belief systems, architecture, arts, craft, music, dance and sports. The indigenous culture is very much active and living, and is a part of everyday life for the majority of the population. Tourism is a major component of the economy and the country boasts excellent island beaches, along with a fascinating cultural depth.",
                "quickFilterApplicableId": 3,
                "id": 85
            },
            {
                "name": "French Polynesia (Tahiti & Bora Bora)",
                "description": "French Polynesia is a French overseas collectivity in made up of several groups of Polynesian islands. The most populated island isTahiti in the Society Islands group, where the capital Papeete is located. Other island groups are; Marquesas Islands, Tuamotu Archipelago, Austral Islands, Bass Islands, Gambier Islands. Tahiti is the most populated island with 68.6% of the total population. Bora Bora is the second most recognized island, legendary for its luxury resorts. Other important atolls or island groups are: Ahe, Hiva `Oa, Huahine, Maiao, Maupiti, Mehetia, Moorea, Nuku Hiva, Raiatea, Tahaa, Tetiaroa, Tubuai, and Tupai.",
                "quickFilterApplicableId": 3,
                "id": 86
            },
            {
                "name": "Papua New Guinea",
                "description": "Papua New Guinea occupies the eastern half of the island of New Guinea and numerous offshore islands. It is located in the southwestern Pacific Ocean. Its capital, and one of its few major cities, is Port Moresby. It is one of the most diverse countries on Earth, with over 850 indigenous languages and at least as many traditional societies, out of a population of just under 6 million. It is also one of the most rural, with only 18 per cent of its people living in urban centres. The country is also one of the world's least explored, culturally and geographically, and many undiscovered species of plants and animals are thought to exist in the interior of Papua New Guinea. The country's geography is similarly diverse and, in places, extremely rugged. A spine of mountains runs the length of the island of New Guinea, forming a populous highlands region. Dense rainforests can be found in the lowland and coastal areas. This terrain has made it difficult for the country to develop transportation infrastructure. In some areas, planes are the only mode of transport. After being ruled by three external powers since 1884, Papua New Guinea gained its independence from Australia in 1975. It remains a Commonwealth realm.",
                "quickFilterApplicableId": 3,
                "id": 87
            },
            {
                "name": "Cook Islands",
                "description": "The Cook Islands are a self-governing parliamentary democracy in free association with New Zealand, located in Polynesia, in the middle of the South Pacific Ocean, between French Polynesia (Society Islands) to the east and Tonga to the west. It is an archipelago with 15 islands spread out over 2.2 million sq. km of ocean. Though quite far, there's nothing between the Cook Islands and Antarctica. With the same time zone and latitude (disregarding north and south) as Hawaii, the islands are sometimes thought of as \"Hawaii down under\". Though smaller, it reminds some elderly visitors of Hawaii before statehood without all the large tourist hotels and other development. ",
                "quickFilterApplicableId": 3,
                "id": 96
            },
            {
                "name": "Guam",
                "description": "Guam is an island in the western South Pacific Ocean, about three-quarters of the way from Hawaii to the Philippines. It is the largest and southernmost island in the Mariana Islands archipelago. Guam is a territory of the United States of America. It is considered to occupy a militarily strategic location, south of the Commonwealth of the Northern Mariana Islands. Guam is one of many islands that make of Micronesia, which politically consists of Belau (Palau), the Federated States of Micronesia (FSM), Kiribati (anthropologically having affinities with Polynesia and Micronesia), the Marshall Islands, and several remote islands designated as the U.S.-administered islands of the Central Pacific. All of Micronesia has close political ties to the United States of America. ",
                "quickFilterApplicableId": 3,
                "id": 97
            },
            {
                "name": "Kiribati",
                "description": "Kiribati (pronounced Kiri-bass) is an island group in Micronesia straddling the equator and, until 1995, the International Date Line. Kiribati's 33 atolls, with a total area of only 811 km², are scattered over an area of 3.5 million km². Kiribati saw some of the worst fighting of the Pacific theatre during the Second World War, including the infamous Battle of Tarawa in November 1943. Kiribati is most emphatically not another Tahiti, Hawaii, etc. where you can go to relax and have nothing to worry about. It has few visitors, and they have to be prepared to \"rough it.\" That said, there aren't many countries where the people are more friendly. ",
                "quickFilterApplicableId": 3,
                "id": 98
            },
            {
                "name": "Micronesia",
                "description": "The Federated States of Micronesia (FSM) is composed of four states spanning dozens of atolls scattered over a million square miles of the north central Pacific. The four states are Pohnpei (formerly Ponape), Kosrae (formerly Kusaie), Chuuk (formerly Truk) and Yap. The federal capital is located at Palikir, on the island of Pohnpei, close to Pohnpei’s largest town, Kolonia. The FSM is a constitutional democracy and is party to a Compact of Free Association with the United States. FSM is one of the safest places on earth. there is little violent crime. Beware, it is also one of the wettest places on earth, and rains almost everyday. ",
                "quickFilterApplicableId": 3,
                "id": 99
            },
            {
                "name": "New Caledonia",
                "description": "New Caledonia is a dependent overseas territory of France lying in the western Pacific Ocean, in the Coral Sea, to the east of Australia and west of Vanuatu. The territory consists of the main island of Grand Terre, the archipelago of the Loyalty Islands (Iles Loyaute), and numerous small, sparsely populated islands and atolls. New Caledonia offers stunning beaches, mountaintop fondue in chalets, camping, amazing snorkeling and diving, and fabulous French food. ",
                "quickFilterApplicableId": 3,
                "id": 100
            },
            {
                "name": "Palau",
                "description": "Palau (Belau) is a group of islands in the Micronesia area of Oceania, to the southeast of the Philippines. The South West islands of Palau are worth a visit if you have your own marine transport such as an ocean going yacht. The Republic of Palau is a constitutional democracy in free association with the United States.  Palau is an archipelago consisting of several hundred volcanic and limestone islands and coral atolls, few of which are inhabited, and is politically divided into 16 states.  Palau’s developing economy depends on tourism, marine resources and a small agricultural sector.  Two kinds of public transportation are available, taxi and Airai bus service.  Palau International Airport is located on Babeldaob Island, near Koror Island. ",
                "quickFilterApplicableId": 3,
                "id": 101
            },
            {
                "name": "Solomon Islands",
                "description": "The Solomon Islands are a South Pacific archipelago east of Papua New Guinea. They occupy a strategic location on sea routes between the South Pacific Ocean, the Solomon Sea, and the Coral Sea. The Solomon Islands are believed to have been inhabited by Melanesian people for thousands of years. The United Kingdom established a protectorate over the Solomon Islands in the 1890s. Some of the most bitter fighting of World War II occurred in the Solomon Islands campaign of 1942–45, including the Battle of Guadalcanal. Self-government was achieved in 1976 and independence two years later. The country is a Commonwealth realm. Since 1998 ethnic violence, government misconduct and crime have undermined stability and civil society. In June 2003 an Australian-led \"multinational\" force, the Regional Assistance Mission to the Solomon Islands (RAMSI), arrived to restore peace and disarm ethnic militias.",
                "quickFilterApplicableId": 3,
                "id": 102
            },
            {
                "name": "Tonga",
                "description": "The Kingdom of Tonga in the south Pacific Ocean comprises an archipelago of 171 islands, 48 of them inhabited, stretching over a distance of about 800 kilometres (500 miles) in a north-south line. The islands lie south of Samoa, about one-third of the way from New Zealand to Hawaii. Tonga, the only sovereign monarchy among the island nations of the Pacific Ocean, has a unique distinction as the only island nation to have avoided formal colonization. It is a member of the British commonwealth.",
                "quickFilterApplicableId": 3,
                "id": 103
            },
            {
                "name": "Samoa",
                "description": "Samoa, (formerly Western Samoa), is a country governing the western part of the Samoan Islands archipelago in the South Pacific. It was admitted to the United Nations on 15 December 1976. Samoa consists of the two large islands of Upolu and Savai’i and seven small islets.  The country has a stable parliamentary democracy with a developing economy.  Tourist facilities are accessible by bus, taxi and car and are within walking distance of access roads.  Infrastructure is adequate in Apia, the capital, but it is limited in other areas.",
                "quickFilterApplicableId": 3,
                "id": 104
            },
            {
                "name": "Queensland Islands",
                "description": "The most well know of the islands is probably the Whitsunday group of islands which lie northeast of Mackay, in the dazzling sapphire waters that are teeming with mackerel, queenfish, trevally and other species. The islands are remnants of a coastal range, which was submerged when sea levels rose at the end of the ice age and now form the largest offshore island chain on the Australian east coast. The top resorts on Hayman, Hamilton and Lindeman Islands are accustomed to guests arriving by private helicopter.  ",
                "quickFilterApplicableId": 3,
                "id": 115
            },
            {
                "name": "Mamanuca Islands",
                "description": "The Mamanuca group of islands is located just a few kilometers off the western side of Fiji's main island of Viti Levu. It is one of Fiji's most popular resort destinations with a number of beautiful islands and reefs. With names such as Treasure Island, Beachcomber Island, Tokoriki and Vomo to name a few, these islands evoke palm tree fringed beaches and pristine blue lagoons. The Mamanuca Islands are a perfect place to experience a tropical paradise in the South Pacific. ",
                "quickFilterApplicableId": 3,
                "id": 117
            },
            {
                "name": "Taha'a",
                "description": "Tahaa is an island located among the Society Islands, in French Polynesia. The islands of Tahaa and neighboring Raiatea are enclosed by the same coral reef, and may once have been a single island. Tahaa produces 70-80% of all French Polynesia's vanilla and because of the&nbsp;ubiquitous aroma of vanilla, it is known as the \"Vanilla Island\". Tahaa's pearls are of exceptional quality. Tahaa and its small motus (islets) can be reached by boat and outrigger from Raiatea. The short sail drops visitors on a motu beach with a perfect small lagoon, and in the near distance, a view of Bora Bora framed by the coconut palms and the lagoon.",
                "quickFilterApplicableId": 3,
                "id": 118
            },
            {
                "name": "Tiwi Islands",
                "description": "<P>The Tiwi Islands are part of Australia's Northern Territory, 100 km north of Darwin where the Arafura Sea joins the Timor Sea. They comprise Melville Island and Bathurst Island, with a combined area of 8,320 square kilometres (3,212 sq mi). Inhabited before European settlement by the Tiwi indigenous Australians, there are approximately 2500 people on the islands. The Tiwi Land Council is one of four in the Northern Territory. It is a representative body with statutory authority under the Aboriginal Land Rights (Northern Territory) Act 1976 and has responsibilities under the Native Title Act 1993 and the Pastoral Land Act 1992.</P>",
                "quickFilterApplicableId": 3,
                "id": 128
            },
            {
                "name": "Maluku Islands",
                "description": "The Maluku region, probably more familiar to most as \"the Moluccas\" (as the area was previously known) is truly a collection of forgotten islands located just north of Australia. Sitting between New Guinea and Timor it is part of Wallacea, the legendary deep water area that separates the Australian and Asian continental plates. The south west corner of Maluku, part of the predominately Christian area of Indonesia, is virtually inaccessible but is home to numerous stunning islands with fringing reefs and ancient cultures.<BR>",
                "quickFilterApplicableId": 3,
                "id": 129
            },
            {
                "name": "Alor Island",
                "description": "The Island of Alor is just a few nautical miles from Timor (in the district of East Nusa Tenggara), yet unlike its infamous neighbour the name of Alor will probably not be one you have heard unless you are an adventurous scuba diver. Alor has been identified by the East Nusa Tenggara Provincial authorities as having the most potential for tourism development in the future, but today apart from some eco-resorts catering for SCUBA divers there is no infrastructure to support such a development. Much of the area is free from the practice of dynamite fishing, found throughout Asia, resulting in the majority of reefs being in pristine condition. The local Christian villagers are friendly and their language and culture are strong. Although it is an often quoted line, many say Alor is just like Bali was before the onset of mass tourism.",
                "quickFilterApplicableId": 3,
                "id": 130
            },
            {
                "name": "Golf New Zealand",
                "quickFilterApplicableId": 3,
                "id": 166
            },
            {
                "name": "Ultraluxe French Polynesia",
                "quickFilterApplicableId": 3,
                "id": 167
            },
            {
                "name": "Ultraluxe New Zealand",
                "quickFilterApplicableId": 3,
                "id": 170
            },
            {
                "name": "Australia Cruise",
                "quickFilterApplicableId": 3,
                "id": 173
            },
            {
                "name": "New Zealand Cruise",
                "quickFilterApplicableId": 3,
                "id": 174
            },
            {
                "name": "Samoa",
                "description": "Samoa, (formerly Western Samoa), is a country governing the western part of the Samoan Islands archipelago in the South Pacific. It was admitted to the United Nations on 15 December 1976. Samoa consists of the two large islands of Upolu and Savai’i and seven small islets.  The country has a stable parliamentary democracy with a developing economy.  Tourist facilities are accessible by bus, taxi and car and are within walking distance of access roads.  Infrastructure is adequate in Apia, the capital, but it is limited in other areas.",
                "quickFilterApplicableId": 3,
                "id": 190
            },
            {
                "name": "Queensland Islands",
                "description": "The most well know of the islands is probably the Whitsunday group of islands which lie northeast of Mackay, in the dazzling sapphire waters that are teeming with mackerel, queenfish, trevally and other species. The islands are remnants of a coastal range, which was submerged when sea levels rose at the end of the ice age and now form the largest offshore island chain on the Australian east coast. The top resorts on Hayman, Hamilton and Lindeman Islands are accustomed to guests arriving by private helicopter.  ",
                "quickFilterApplicableId": 3,
                "id": 191
            },
            {
                "name": "Mamanuca Islands",
                "description": "The Mamanuca group of islands is located just a few kilometers off the western side of Fiji's main island of Viti Levu. It is one of Fiji's most popular resort destinations with a number of beautiful islands and reefs. With names such as Treasure Island, Beachcomber Island, Tokoriki and Vomo to name a few, these islands evoke palm tree fringed beaches and pristine blue lagoons. The Mamanuca Islands are a perfect place to experience a tropical paradise in the South Pacific. ",
                "quickFilterApplicableId": 3,
                "id": 192
            },
            {
                "name": "Taha'a",
                "description": "Tahaa is an island located among the Society Islands, in French Polynesia. The islands of Tahaa and neighboring Raiatea are enclosed by the same coral reef, and may once have been a single island. Tahaa produces 70-80% of all French Polynesia's vanilla and because of the&nbsp;ubiquitous aroma of vanilla, it is known as the \"Vanilla Island\". Tahaa's pearls are of exceptional quality. Tahaa and its small motus (islets) can be reached by boat and outrigger from Raiatea. The short sail drops visitors on a motu beach with a perfect small lagoon, and in the near distance, a view of Bora Bora framed by the coconut palms and the lagoon.",
                "quickFilterApplicableId": 3,
                "id": 193
            },
            {
                "name": "Tasmania",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 194
            },
            {
                "name": "Tiwi Islands",
                "description": "<P>The Tiwi Islands are part of Australia's Northern Territory, 100 km north of Darwin where the Arafura Sea joins the Timor Sea. They comprise Melville Island and Bathurst Island, with a combined area of 8,320 square kilometres (3,212 sq mi). Inhabited before European settlement by the Tiwi indigenous Australians, there are approximately 2500 people on the islands. The Tiwi Land Council is one of four in the Northern Territory. It is a representative body with statutory authority under the Aboriginal Land Rights (Northern Territory) Act 1976 and has responsibilities under the Native Title Act 1993 and the Pastoral Land Act 1992.</P>",
                "quickFilterApplicableId": 3,
                "id": 195
            },
            {
                "name": "Tongatapu",
                "quickFilterApplicableId": 3,
                "id": 196
            },
            {
                "name": "Marquesas Islands",
                "quickFilterApplicableId": 3,
                "id": 197
            },
            {
                "name": "Viti Levu",
                "quickFilterApplicableId": 3,
                "id": 198
            },
            {
                "name": "Phoenix Islands",
                "quickFilterApplicableId": 3,
                "id": 199
            },
            {
                "name": "South Pacific Cruise",
                "quickFilterApplicableId": 3,
                "id": 200
            },
            {
                "name": "Kimberley Cruise",
                "quickFilterApplicableId": 3,
                "id": 206
            },
            {
                "name": "American Samoa",
                "quickFilterApplicableId": 3,
                "id": 1078
            },
            {
                "name": "Australia & South Pacific Cruise",
                "quickFilterApplicableId": 3,
                "id": 1079
            },
            {
                "name": "French Polynesia Cruise",
                "quickFilterApplicableId": 3,
                "id": 1085
            },
            {
                "name": "Marshall Islands",
                "quickFilterApplicableId": 3,
                "id": 1094
            },
            {
                "name": "Northern Mariana Islands",
                "quickFilterApplicableId": 3,
                "id": 1102
            }
        ]
    },
    {
        "continent": "Cruise",
        "id": 5,
        "countries": []
    },
    {
        "continent": "Egypt & Middle East",
        "id": 6,
        "countries": [
            {
                "name": "Egypt",
                "description": "Egypt is a country in North Africa, with the Sinai Peninsula forming a land bridge to Western Asia. Egypt borders the Mediterranean Sea to the north, Israel to the northeast, the Red Sea to the east, Sudan to the south and Libya to the west. Egypt is one of the most populous countries in Africa and the Middle East. The great majority of its estimated 75.4 million live near the banks of the Nile River, where the only arable agricultural land is found. The large areas of the Sahara Desert are sparsely inhabited. About half of Egypt's residents live in Cairo, Alexandria, Luxor and Aswan.&nbsp;Egypt is famous for its ancient civilization and some of the world's most famous monuments, including the Giza pyramid complex and its Great Sphinx. Luxor contains numerous ancient artifacts, such as the Karnak Temple and the Valley of the Kings. Important temples are located on the Nile cities of Edfu and Aswan, with the temple of Abu Simbel on the shore of Lake Nasser in the south.",
                "quickFilterApplicableId": 3,
                "id": 207
            },
            {
                "name": "Jordan",
                "description": "Jordan is an Arab country in the Middle East, spanning the southern part of the Syrian Desert down to the Gulf of Aqaba. It shares control of the Dead Sea with Israel. Much of Jordan is covered by the Arabian Desert. The capitol of Amman is in the north-west. Jordan has a rich history; its location astride major trade routes has long made it a prized possession. Jordan has seen numerous civilisations, including the Sumerian, Akkadian, Israelite, Babylonian, Assyrian, Mesopotamian, and Persian empires. Jordan was for a time part of Pharaonic Egypt, and spawned the native Nabatean civilisation who left rich archaeological remains at Petra. Cultures from the west also left their mark, such as the Macedonian, Roman, and Byzantine empires. Since the seventh century the area has been under Muslim and Arab cultures. For a small country it has some superb tourist sites including the carved city of Petra, preserved Roman city of Jerash, old city Amman, Crusader castles, desert of Wadi Rum and Dead Sea resorts. ",
                "quickFilterApplicableId": 3,
                "id": 208
            },
            {
                "name": "UAE",
                "description": "Dubai is one of the seven emirates and most populous city of the United Arab Emirates (UAE). It is located along the southern coast of the Persian Gulf on the Arabian Peninsula. It is a relatively new city, and only a few hundred years ago was a simple fishing village. Dubai has the largest population and is the second largest emirate by area, after Abu Dhabi. Dubai and Abu Dhabi are the only two emirates to possess veto power over critical matters of national importance in the country's legislature. Dubai has been ruled by the Al Maktoum dynasty since 1833. The emirates' current ruler, Mohammed bin Rashid Al Maktoum, is also the Prime Minister and Vice President of the UAE. The emirate's revenues are from trade, real estate and financial services. Revenues from petroleum and natural gas contribute less than 6% of Dubai's US$ 37 billion economy (2005). Dubai has attracted worldwide attention through innovative real estate projects and sports events, and its emergence as a world business hub.",
                "quickFilterApplicableId": 3,
                "id": 210
            },
            {
                "name": "Oman",
                "description": "Officially the Sultanate of Oman, is an Arab country in southwest Asia on the southeast coast of the Arabian Peninsula. It borders the United Arab Emirates on the northwest, Saudi Arabia on the west and Yemen on the southwest. The coast is formed by the Arabian Sea on the south and east and the Gulf of Oman on the northeast.  Excellent tourist facilities are available in the major cities of Muscat, Salalah, Sohar, and Nizwa and can increasingly be found elsewhere in the country. ",
                "quickFilterApplicableId": 3,
                "id": 214
            },
            {
                "name": "Sudan",
                "description": "Sudan is the largest country in Africa, bordering Egypt, Eritrea, Central African Republic, Chad, Democratic Republic of the Congo, Ethiopia, Kenya, Libya and Uganda. Getting a visa for Sudan is an expensive hit-and-miss affair, but if you do manage to get in, and you stick to the safe areas, you will probably have a fantastic experience. The Sudanese people are very hospitable, and you can visit some awesome tourist attractions without even seeing another tourist. ",
                "quickFilterApplicableId": 3,
                "id": 215
            },
            {
                "name": "Bahrain",
                "description": "The Kingdom of Bahrain is a Middle Eastern archipelago in the Persian Gulf, tucked into a pocket of the sea flanked by Saudi Arabia and Qatar. It's an oasis of liberalism – or at least western-friendly moderation – among the Muslim countries of the region. It's popular with travelers for its authentic \"Arabness\" but without the strict application of Islamic law upon its non-Muslim minority. Case in point: alcohol is legal here. Although it has a heavily petroleum-based economy, its more relaxed culture has also made it a social and shopping mecca (so to speak), which has helped it develop a fairly cosmopolitan middle class not found in neighboring countries with just a rich elite and subsistence-level masses. ",
                "quickFilterApplicableId": 3,
                "id": 216
            },
            {
                "name": "Kuwait",
                "description": "Kuwait is a country in the Middle East. It is located at the head of the Arabian Gulf, with Iraq to the north and west, and Saudi Arabia to the southwest. Kuwait City has the majority of attractions. Many of Kuwait's sea clubs offer a wide variety of facilities and activities such as indoor and outdoor swimming pools, beaches, tennis courts, gymnasiums, bowling and even karate. Sailing and scuba diving are available. Powerboating is a Kuwaiti passion. The best beach front hotels are the Hilton Resort, Movenpick Resort, Marina Hotel and the Radisson SAS. The Radisson SAS also houses the largest wooden ship in the world the AL-Hashemi II which is a real beauty. Next to the ship is a museum for the history of ship-building in Kuwait.",
                "quickFilterApplicableId": 3,
                "id": 217
            },
            {
                "name": "Lebanon",
                "description": "The Republic of Lebanon is a small country (10,452 sq km or 4076 sq mi in area with 3.7 million inhabitants) in the Middle East region. Its capital is Beirut. It has a long coastline on the eastern shore of the Mediterranean Sea and shares a long land border with its much larger neighbour Syria to the north and the east, a much shorter (and currently \"hot\") border with Israel to the south. ",
                "quickFilterApplicableId": 3,
                "id": 218
            },
            {
                "name": "Saudi Arabia",
                "description": "Saudi Arabia is a Middle Eastern country that occupies most of the Arabian peninsula and has both Persian Gulf and Red Sea coast lines. Its surrounding countries are Jordan to the northwest, Iraq to the northeast, Kuwait and Qatar to the east, United Arab Emirates to the south east, Oman and Yemen to the south. Saudi Arabia contains the holy Muslim cities of Mecca and Medina, to which all physically and financially able Muslims are required to make a pilgrimage at least once if possible.",
                "quickFilterApplicableId": 3,
                "id": 219
            },
            {
                "name": "Syria",
                "description": "Syria is one of the larger states of the Middle East and has its capital in Damascus. Syria is bordered to the north by Turkey, to the east by Iraq, by Jordan and Israel to the south, and by Lebanon to the south-west. In addition, the country has a short coastline on the east Mediterranean Sea. Major attractions include the cities of Damascus, Aleppo with its large souk and ancient citadel, the magnificent Crusader castle of Krak des Chevaliers, and the preserved Roman city of Palmyra. Visitors who do take the time to explore this fascinating country will not be disappointed, and will remember the friendly hospitality with fondness. ",
                "quickFilterApplicableId": 3,
                "id": 220
            },
            {
                "name": "Kazakhstan",
                "description": "Kazakhstan is by far the largest of the Central Asia's states of the former USSR. It has borders with Russia, China, and the Central Asian countries of Kyrgyzstan, Uzbekistan, and Turkmenistan. It is the world's ninth biggest country by size, and it is more than twice the size of the other Central Asian states combined. Its lack of significant historical sites and endless featureless steppe have put many off Kazakhstan, while many still are captivated by the emptiness and mystery of this goliath state. It will be many travelers' first port of call on their Central Asian adventure, and there is much for the intrepid traveller to enjoy. ",
                "quickFilterApplicableId": 3,
                "id": 221
            },
            {
                "name": "Kyrgyz Republic",
                "description": "Kyrgyzstan, formally the Kyrgyz Republic, is a Central Asian country of incredible natural beauty and proud nomadic traditions. Landlocked and mountainous, it borders Kazakhstan to the north, Uzbekistan to the west, Tajikistan to the southwest and China to the southeast. Annexed by Russia in 1876, it achieved independence from the Soviet Union in 1991. ",
                "quickFilterApplicableId": 3,
                "id": 222
            },
            {
                "name": "Tajikistan",
                "description": "Tajikistan is a landlocked country in Central Asia that borders Afghanistan to the south, China to the east, Kyrgyzstan to the north, and Uzbekistan to the west and northwest. The ancient Silk Road passed through it. ",
                "quickFilterApplicableId": 3,
                "id": 223
            },
            {
                "name": "Turkmenistan",
                "description": "Turkmenistan is a country in Central Asia with a population of about 5 million, and an area around half a million square km, a bit larger than California or almost the size of Spain. It has a coast on the Caspian Sea, but is otherwise landlocked. Neighboring countries are Iran and Afghanistan to the South, and Uzbekistan and Kazakhstan to the North. Overall it is a relatively poor desert country, although billions have been spent on the capital Ashgabat in post Soviet times. The traditional life of the Turkmen is that of nomadic shepherds, though some have been settled in towns for centuries. The country has extensive oil and gas reserves undergoing exploration and development.",
                "quickFilterApplicableId": 3,
                "id": 224
            },
            {
                "name": "Uzbekistan",
                "description": "Uzbekistan has borders with Afghanistan, Kazakhstan, Kyrgyzstan, Tajikistan and Turkmenistan. It is doubly landlocked, but includes the southern shoreline of the Aral Sea. Once part of the Persian Samanid and later Timurid empires, the region was conquered in the early 16th century by Uzbek nomads, who spoke an Eastern Turkic language. Most of Uzbekistan’s population today belong to the Uzbek ethnic group and speak the Uzbek language, one of the family of Turkic languages. Uzbekistan was incorporated into the Russian Empire in the 19th century and in 1924 became a constituent republic of the Soviet Union, known as the Uzbek Soviet Socialist Republic (Uzbek SSR). It has been an independent republic since December 1991.",
                "quickFilterApplicableId": 3,
                "id": 225
            },
            {
                "name": "Abu Dhabi",
                "description": "Abu Dhabi is the capital and second most populous city in the United Arab Emirates (UAE), after Dubai. It is also the seat of government of the emirate of Abu Dhabi, which is ruled by Khalifa bin Zayed Al Nahyan – the current ruling Emir of the UAE. Abu Dhabi lies on a T-shaped island jutting into the Persian Gulf from the central western coast. Approximately 860,000 people lived in Abu Dhabi as of 2007. One of the world's largest producers of oil, Abu Dhabi has actively attempted to diversify its economy in recent years through investments in financial services and tourism.    ",
                "quickFilterApplicableId": 3,
                "id": 226
            },
            {
                "name": "Al Fayoum",
                "description": "<P>After the noise and crowds of Cairo, the Fayoum oasis, which includes Lake Qaroun, is literally a breath of fresh air. The oasis offers both Egyptian and foreign visitors a relaxing break from city life, a day at the beach and a chance to see oasis life without having to venture too far. It has ancient monuments as well. A relaxing day or two in the Fayoum Oasis is strongly recommended for those in Cairo who are beginning to feel claustrophobic. The Fayoum Oasis is a manmade oasis and also the largest oasis in Egypt. Although usually described as an oasis, Fayoum is not fed by underground water, like the western Sahara Desert oases further south west, but by water from the Nile transported to this natural triangular depression by a series of canals. Having irrigated the oasis, the water runs into Lake Qaroun which despite having dramatically shrunk over the past few thousand years, is at about 215 sq km and still Egypt's largest natural salt-water lake.</P>",
                "quickFilterApplicableId": 3,
                "id": 227
            },
            {
                "name": "Western Desert",
                "quickFilterApplicableId": 3,
                "id": 228
            },
            {
                "name": "Malé Atoll",
                "quickFilterApplicableId": 3,
                "id": 229
            },
            {
                "name": "Karakum Desert",
                "quickFilterApplicableId": 3,
                "id": 230
            },
            {
                "name": "Ultraluxe UAE",
                "quickFilterApplicableId": 3,
                "id": 231
            },
            {
                "name": "Ultraluxe Egypt",
                "quickFilterApplicableId": 3,
                "id": 232
            },
            {
                "name": "Iran",
                "quickFilterApplicableId": 3,
                "id": 1089
            },
            {
                "name": "Iraq",
                "quickFilterApplicableId": 3,
                "id": 1090
            },
            {
                "name": "Israel",
                "quickFilterApplicableId": 3,
                "id": 1091
            },
            {
                "name": "Qatar",
                "quickFilterApplicableId": 3,
                "id": 1105
            }
        ]
    },
    {
        "continent": "Europe (East)",
        "id": 7,
        "countries": [
            {
                "name": "Finland",
                "description": "Finland is a Nordic country in northern Europe. It borders Sweden to the west, Russia to the east, and Norway to the north. The capital city is Helsinki. Finland was historically part of Sweden and from 1809 an autonomous Grand Duchy within the Russian Empire. Finland's declaration of independence in 1917 from Russia was followed by a civil war, wars against the Soviet Union and Nazi Germany, and a period of official neutrality during the Cold War. Finland joined the United Nations in 1955 and the European Union in 1995.  Commercial cruises between major coastal and port cities in the Baltic region, including Helsinki, Turku, Tallinn, Stockholm and Travemünde, play a significant role in the local tourism industry. There are many churches, cathedrals, museums and castles. Olavinlinna in Savonlinna hosts the annual Savonlinna Opera Festival. The capital city of Helsinki, is famous for its Grand Duchy era architecture, which resembles that of imperial St. Petersburg.",
                "quickFilterApplicableId": 3,
                "id": 233
            },
            {
                "name": "Latvia",
                "description": "Latvia is situated in Eastern Europe. One of the three Baltic states, Latvia is bordered by Estonia to the north, Lithuania to the south, Russia to the east, Belarus on the south east, and the Baltic Sea on the west. The most famous travel spot is the capital Riga, a World Heritage Site. Other highlights include Liepaja with its unique former secret military town of Karosta and a magnificent beach. Kuldiga with Europe`s widest waterfall and Cesis with its medieval castle ruins are also interesting. Tourists can also enjoy the wild beauty of Latvia`s unspoilt sea coast, which is 500 km long and consists mainly of white, soft sandy beaches. Forests, which cover approximately a half of Latvia`s territory, offer many nature trails and nature parks. ",
                "quickFilterApplicableId": 3,
                "id": 234
            },
            {
                "name": "Poland",
                "description": "Poland is bordered by Germany to the west; the Czech Republic and Slovakia to the south; Ukraine, Belarus and Lithuania to the east; and the Baltic Sea to the north. The establishment of a Polish state is often identified with the adoption of Christianity by its ruler Mieszko I in 966 when the state covered territory similar to that of present-day Poland. Poland became a kingdom in 1025, and in 1569 it cemented a long association with the Grand Duchy of Lithuania by uniting to form the Polish-Lithuanian Commonwealth. The Commonwealth collapsed in 1795, and its territory was partitioned among Prussia, Russia, and Austria. Poland regained its independence in 1918 after World War I but lost it again in World War II, occupied by Nazi Germany and the Soviet Union. Poland lost over six million citizens in World War II, and emerged several years later as a socialist republic within the Eastern Bloc under strong Soviet influence. In 1989 communist rule was overthrown and Poland became what is constitutionally known as the \"Third Polish Republic\". Tourism is centered primarily in Warsaw and Krakow.",
                "quickFilterApplicableId": 3,
                "id": 235
            },
            {
                "name": "Austria",
                "description": "Austria is a landlocked country in Central Europe. The origins of Austria date back to the ninth century, however, it was in the 14th and 15th centuries when the Habsburg empire became one of the continent's most powerful. The country expanded to include portions of modern day Hungary, Germany, Poland, Czech Republic, Slovakia, Yugoslavia and Italy. The empire declined and was ultimately broken apart after WWI. The country was annexed by Germany, but regained its independence in 1955. Austria is a largely mountainous country due to its location in the Alps. The biggest area are the Austrian Alps, which constitute 62% of Austria's total area. The capital is the city of Vienna on the Danube River. It is home to many famous composers; Wolfgang Amadeus Mozart, Joseph Haydn, Franz Schubert, Anton Bruckner, Johann Strauss, Sr. & Jr., Gustav Mahler, Arnold Schoenberg, Anton Webern and Alban Berg. Eighteenth and nineteenth century composers were drawn to the city due to the patronage of the Habsburgs, and made Vienna the European capital of classical music. ",
                "quickFilterApplicableId": 3,
                "id": 236
            },
            {
                "name": "Hungary",
                "description": "Hungary is a landlocked country in the Carpathian Basin of Central Europe, bordered by Austria, Slovakia, Ukraine, Romania, Serbia, Croatia, and Slovenia. The foundation of Hungary was laid in the late Ninth Century by the Magyar chieftain Árpád, whose great grandson István ascended to the throne with a crown sent from Rome in 1000. The Kingdom of Hungary existed with minor interruptions for 946 years, and at various points was regarded as one of the cultural centers of the Western world. It was succeeded by a Communist era (1947–1989). In 1989 it opened its border to Austria, thus accelerating the collapse of the Eastern Bloc. The present government is parliamentary republic. Hungary was one of the 15 most popular tourist destinations in the world in the past decade. Its capitol, Budapest, is regarded as one of the most beautiful in the world. The country is home to the second largest thermal lake in the world (Lake Hévíz), the largest lake in Central Europe (Lake Balaton), and the largest natural grassland in Europe (Hortobágy).",
                "quickFilterApplicableId": 3,
                "id": 237
            },
            {
                "name": "Czech Republic",
                "description": "The Czech Republic is in Central Europe, bordered by Poland to the northeast, Germany to the west, Austria to the south, and Slovakia to the east. The Czech lands fell under the Habsburg rule from 1526, later becoming part of the Austrian Empire. The independent Republic of Czechoslovakia was formed in 1918, following the collapse of the Austro-Hungarian empire after World War I. In an 1948 coup d'état, Czechoslovakia became a communist-ruled state, until the Velvet Revolution in 1989 returned to democracy. On January 1, 1993 Czechoslovakia peacefully dissolved into its constituent states, the Czech Republic and Slovakia. Prague is the capitol and largest city. Prague is widely considered one of the most beautiful cities in Europe with preserved examples from all periods of its history and is among the most visited cities on the continent. Since 1992, the extensive historic centre of Prague has been included in the UNESCO list of World Heritage Sites. Prague Castle is the largest ancient castle in the world.",
                "quickFilterApplicableId": 3,
                "id": 238
            },
            {
                "name": "Romania",
                "description": "Romania is located in south Central Europe, bordering on the Black Sea. The Danube flows through the country and almost all of the Danube Delta is located within its territory. The territory's recorded history encompasses such eras as the Dacians, Roman Empire (origination of the Romanian language), Kingdom of Hungary, and Ottoman Empire. As a nation-state, the country was formed by the merging of Moldavia and Wallachia in 1859 and it gained recognition of its independence in 1878. Later, in 1918, the country was expanded with the inclusion of Transylvania, Bukovina and Bessarabia. At the end of World War II, Romania became a member of the Warsaw Pact. With the fall of the Iron Curtain in 1989, Romania started a series of political and economic reforms, culminating with its membership in the EU in 2007. The capitol of Bucharest is the transportation hub, but the country has a embarrasement of riches when it comes to tourism. The castles of Transylvania, mountain hiking, rural villages, untouched forests, the Danube Delta, Black Sea resorts, and more. It is on the \"hot list\" of experienced travelers.",
                "quickFilterApplicableId": 3,
                "id": 239
            },
            {
                "name": "Slovenia",
                "description": "Slovenia is a country in south-central Europe bordering Italy to the west, the Adriatic Sea and Croatia to the south, Hungary and Austria to the north. At various points in Slovenia's history, the country has been part of the Roman Empire, the Republic of Venice, the Holy Roman Empire, the Habsburg Monarchy, the Austrian Empire, the Kingdom of Yugoslavia, Italy, and the Socialist Federal Republic of Yugoslavia from 1945 to 1991 - when it gained its independence. It is a member of the EU. Although Slovenia is a small country, there is an exceptionally wide variety of habitats. In the north of Slovenia are the Alps. About 58% of the country is covered by forests. And Its climate is sub-mediterranean on the coast where there are a number of resorts. The capital of Slovenia is Ljubljana, though it is most visited for the storybook island of Bled.  ",
                "quickFilterApplicableId": 3,
                "id": 240
            },
            {
                "name": "Croatia",
                "description": "Croatia is a south-central European country with an extensive coastline down the Adriatic Sea. It borders Hungary in the north, and Montenegro to the south. The Croats settled in early 7th century, forming two principalities, Dalmatia and Pannonia. In 1102, Croatia entered into a union with the Kingdom of Hungary (the Dalmatian coast was controlled by Venice until the 18th century). The region became a part of the Habsburg Empire in 1527, and in 1918 became a part of the Kingdom of SHS, later renamed Yugoslavia. In 1991 Croatia proclaimed independence by holding its first democratic elections. The country includes seven World Heritage sites and eight national parks. Its capital is Zagreb. Tourism in Croatia is well-developed, with most of the traffic going to the well-preserved coastal Renaissance towns. Several companies run flotillas of yachts along different stretches of the coastline, which is also popular with divers. In the interior of the country highlights include the capital Zagreb, the Baroque capital Varaždin, and a plethora of medieval castles.",
                "quickFilterApplicableId": 3,
                "id": 241
            },
            {
                "name": "Bosnia and Herzegovina",
                "description": "Bosnia and Herzegovina is a country on the Balkan peninsula of Southern Europe. It is surrounded by Croatia, except for 26 kilometres of the Adriatic Sea coastline, centered around the town of Neum. The interior of the country is mountainous in the center and south, hilly in the northwest, and flat in the northeast. The state's capital and largest city is Sarajevo, host city of the 1984 Winter Olympic Games. Sarajevo was ranked in the top 50 tourism destinations, based on its historical, religious, and cultural attractions. Bosnia has also become an increasingly popular skiing and Ecotourism destination.",
                "quickFilterApplicableId": 3,
                "id": 242
            },
            {
                "name": "Bulgaria",
                "description": "Bulgaria forms part of the Balkans in south-eastern Europe. It borders Romania to the north (along the Danube River), Greece to the south, and the Black Sea to the east. The first Bulgarian kingdoms date back to the early Middle Ages, and the First Bulgarian Empire (632–1018) established the traditions, culture and language that exists to this day. Centuries later, with the decline of the Second Bulgarian Empire (1185–1422), Bulgarian kingdoms came under Ottoman rule for nearly five centuries. The Russo-Turkish War of 1878 led to the re-establishment of a Bulgarian state as a constitutional monarchy. Following the Young Turk Revolution, Bulgaria declared her independence from the Ottoman Emipre in 1908. After World War II, in 1945 Bulgaria became a communist state and part of the Eastern Bloc. In 1990 the Communist party gave up its power and Bulgaria transitioned to democracy and free-market capitalism. It joined the EU in 2007. The capitol of Sofia is a prime tourist attraction, along with the the seaside resort town of Varna.",
                "quickFilterApplicableId": 3,
                "id": 243
            },
            {
                "name": "Germany",
                "description": "Germany is a country in Central Europe, covering 357,021 square kilometres, and is the largest population among the member states of the European Union. A region named Germania inhabited by several Germanic peoples has been known and documented before 100 AD. Beginning in the 10th century, German territories formed a central part of the Holy Roman Empire that lasted until 1806. During the 16th century, northern Germany became the centre of the Protestant Reformation. As a modern nation-state, the country was first unified amidst the Franco-Prussian War in 1871. In 1949, after World War II, Germany was divided into two separate states—East Germany and West Germany—along the lines of Allied occupation. The two states were reunified in 1990. West Germany was a founding member of the European Community (EC) in 1957, which became the European Union in 1993. Germany is a federal parliamentary republic of sixteen states (Laender). The capital and largest city is Berlin. Germany is a member of the United Nations, NATO, G8 and OECD. It is a major economic power with the world's third largest economy by nominal GDP. The country has developed a high standard of living and established a comprehensive system of social security. It holds a key position in European affairs and maintains a multitude of close partnerships on a global level.",
                "quickFilterApplicableId": 3,
                "id": 244
            },
            {
                "name": "Turkey",
                "description": "Turkey stretches across the Anatolian peninsula in western Asia and Thrace in southeastern Europe, making it a multi-continental country. The Mediterranean Sea is to the south; the Aegean Sea to the west; and the Black Sea to the north. The first major empire in the area was that of the Hittites, from the 18th through the 13th century BC. All of Anatolia was conquered by the Persian Achaemenid Empire during the 6th and 5th centuries and later fell to Alexander the Great. In 324 the Roman emperor Constantine I chose Byzantium to be the new capital of the Roman Empire, renaming it Constantinople (now Istanbul). After the fall of the Western Roman Empire, it became the capital of the Byzantine Empire. This empire was defeated by the Turks, who were subsequently defeated by the Mongols in 1243 giving rise to the mightly Ottoman Empire. The Ottoman Empire interacted with both Eastern and Western cultures throughout its 623-year history. In the 16th and 17th centuries, it was among the world's most powerful political entities. Mustafa Kemal Pasha (Ataturk) led the independence movement in 1922 which produced the modern secular Turkish state. ",
                "quickFilterApplicableId": 3,
                "id": 245
            },
            {
                "name": "Greece",
                "description": "Greece is located in southeastern Europe, situated on the southern end of the Balkan Peninsula. The Aegean Sea lies to the east and south of mainland Greece, while the Ionian Sea lies to the west. Both parts of the Eastern Mediterranean basin feature a vast number of islands. Athens is the capital; Thessaloniki, Patras, Heraklion, Larissa, Volos, Ioannina, Kavala, Rhodes and Serres are some of the country's other major cities. Greece lies at the juncture of Europe, Asia and Africa. It is heir to the heritages of ancient Greece, the Roman and Byzantine Empires, and nearly four centuries of Ottoman rule. Greece is the birthplace of democracy, Western philosophy, the Olympic Games, Western literature, political science, major scientific and mathematical principles, and Western drama.",
                "quickFilterApplicableId": 3,
                "id": 246
            },
            {
                "name": "Denmark",
                "description": "Denmark is a country in the Scandinavian region of northern Europe, and includes constituent states of Greenland and the Faroe Islands. The mainland is bordered to the south by Germany, to the east by the Baltic Sea, and the west the North Sea. The country consists of a large peninsula, Jutland (Jylland) and many islands, most notably Zealand (Sjælland), Funen (Fyn), Vendsyssel-Thy, Lolland, Falster and Bornholm as well as hundreds of minor islands often referred to as the Danish Archipelago. Denmark has long controlled the approach to the Baltic Sea, and these waters are also known as the Danish straits. Denmark is the second-most visited destination in Scandinavia, after Sweden, with 4.7 million visitors in 2007. The capital is Copenhagen, a major regional center of culture, business, media, and science. ",
                "quickFilterApplicableId": 3,
                "id": 247
            },
            {
                "name": "Sweden",
                "description": "Sweden is a Nordic country on the Scandinavian Peninsula, that borders Norway to the west, Finland to the northeast, and is connected to Denmark by the Öresund Bridge. Sweden is the third largest country by area in Western Europe, and has a population of over 9.2 million. Sweden emerged as an independent and unified country during the Middle Ages. It joined the Kalmar Union formed in 1397, and received a modern centralized administration beginning with King Gustav Vasa in the 16th century. In the 17th century the country expanded its territories to form the Swedish empire. Most of the conquered territories outside the Scandinavian Peninsula were lost during the 18th and 19th centuries. The eastern half of Sweden, present-day Finland, was lost to Russia in 1809. The last war in which Sweden was directly involved was in 1814, when Sweden by military means forced Norway into a personal union with Sweden, a union which lasted until 1905. Since 1814, Sweden has been at peace, adopting a non-aligned foreign policy in peacetime and neutrality in wartime. Sweden's capital is Stockholm, which is also the largest city in the country. ",
                "quickFilterApplicableId": 3,
                "id": 248
            },
            {
                "name": "Norway",
                "description": "Norway is a constitutional monarchy in Northern Europe that occupies the western portion of the Scandinavian Peninsula. The majority of the country shares a border to the east with Sweden; its northernmost region is bordered by Finland to the south and Russia to the east. Norway's extensive coastline, facing the North Atlantic Ocean and the Barent sea, is home to its famous fjords. Norway has experienced rapid economic growth after WWII, and is now amongst the wealthiest countries in the world, with petroleum accounting for around a quarter of GDP. Norway was ranked highest of all countries in human development from 2001 to 2006.  Tourism is centered on the pretty port city of Bergen, and the beautiful fjord of Flam. The capitol is Oslo.",
                "quickFilterApplicableId": 3,
                "id": 249
            },
            {
                "name": "Slovak Republic",
                "description": "The Slovak Republic is a landlocked country in Central Europe with a population of over five million. The Slovak Republic borders the Czech Republic and Austria to the west, Poland to the north, Ukraine to the east and Hungary to the south. The largest city is its capital, Bratislava. The Slavic people arrived in the territory of present day Slovakia between the 5th and 6th centuries AD during the Migration Period. In the course of history, various parts of Slovakia belonged to Samo's Empire (the first known political unit of Slavs), Great Moravia, the Kingdom of Hungary, Habsburg (Austrian) monarchy, Austria-Hungary and Czechoslovakia. The present-day Slovak Republic became an independent state on January 1, 1993 with the peaceful division of Czechoslovakia in the Velvet Divorce; it was, with the Czech Republic, the last European country to gain independence in the 20th century. Slovakia is a member state of the European Union, NATO, UN, OECD, WTO, UNESCO and other international organizations. ",
                "quickFilterApplicableId": 3,
                "id": 250
            },
            {
                "name": "Albania",
                "description": "Albania is a country in South Eastern Europe. It is bordered by Greece to the south-east, Montenegro to the north, Kosovo to the northeast, and the Republic of Macedonia to the east. It has a coast on the Adriatic Sea to the west, and on the Ionian Sea to the southwest. It is less than 72 km (45 miles) from Italy, across the Strait of Otranto which links the Adriatic Sea to the Ionian Sea. Albania is a parliamentary democracy and a transition economy. The Albanian capital, Tirana, is home to approximately 600,000 of the country's 3.6 million people, and it is also the financial capital of the country. Free-market reforms have opened the country to foreign investment, especially in the development of energy and transportation infrastructure. The country is a member of the United Nations, the Organization for Security and Co-operation in Europe, Council of Europe, World Trade Organisation, Organisation of the Islamic Conference, and Union for the Mediterranean.",
                "quickFilterApplicableId": 3,
                "id": 251
            },
            {
                "name": "Macedonia",
                "description": "The Republic of Macedonia is a landlocked on the Balkan peninsula in southeastern Europe. It is bordered by Serbia and the territory of Kosovo to the north, Albania to the west, Greece to the south, and Bulgaria to the east. It was admitted to the United Nations in 1993 under the provisional reference the former Yugoslav Republic of Macedonia. The capital is Skopje, with 506,926 inhabitants and there are a number of smaller cities, notably Bitola, Kumanovo, Prilep, Tetovo. It has more than 50 lakes and sixteen mountains higher than 2,000 meters (6,550 ft).",
                "quickFilterApplicableId": 3,
                "id": 252
            },
            {
                "name": "Serbia",
                "description": "Serbia is a landlocked country, in Central- and Southeastern Europe, covering the southern part of the Pannonian Plain and the central part of the Balkans. Serbia is bordered by Hungary to the north; Romania and Bulgaria to the east; the Republic of Macedonia and Albaniato the south; and Croatia, Bosnia and Herzegovina and Montenegro to the west. The country's capital, Belgrade, was titled \"City of the Future of South Europe\" in 2006. For centuries, located at, and shaped by, the cultural boundaries between the East and the West, a powerful medieval kingdom – later renamed the Serbian Empire – occupied much of the Balkans. The current borders of the country were established after World War II, when Serbia became a federal unit within the Socialist Federal Republic of Yugoslavia. Following the breakup of Yugoslavia in the 1990s, Serbia once again became an independent state in 2006, after Montenegro left the Serbia and Montenegro union.",
                "quickFilterApplicableId": 3,
                "id": 253
            },
            {
                "name": "Iceland",
                "description": "Iceland is considered a European country and it is a large mountainous island in the north Atlantic Ocean, between Europe and North America. The name of the country - Iceland - may not be that appropriate: although 10% of Iceland is covered by glaciers, it has a surprisingly mild climate and countless geothermal hot-spots. The native spelling (\"Ísland\") is appropriate in English as well. There are many excursions readily available from any of the main centres such as Reykjavík and Akureyri, to the glaciers and to the big volcanoes. ",
                "quickFilterApplicableId": 3,
                "id": 254
            },
            {
                "name": "Liechtenstein",
                "description": "Liechtenstein is a small alpine country which is doubly landlocked by Switzerland and Austria. It is the last remnant of the Holy Roman Empire and an independent state with close ties to Switzerland. It enjoys a high standard of living and is home to some very beautiful mountain scenery. The principality's capital, Vaduz, is a major center of commerce and international banking. ",
                "quickFilterApplicableId": 3,
                "id": 255
            },
            {
                "name": "Armenia",
                "description": "Armenia became the world’s first Christian country 1,707 years ago in 301 AD, and has a large Diaspora all over the world. As a former Soviet republic lying in the Caucasus region, straddling Asia and Europe, Armenia has an ancient and rich culture. Landlocked, Armenia is bordered by Turkey to the west, Georgia to the north, Iran to the south, Azerbaijan to the east, and Azerbaijan's Naxcivan exclave to the southwest. Five percent of the country's surface area consists of Lake Sevan (Sevana Lich), the largest lake in the Lesser Caucasus mountain range. The many mountains and mountain valleys create a great number of micro climates, with scenery changing from arid to lush forest at the top of a mountain ridge. The country has Islamic and Christian neighbors and is one of the most homogeneous populations in the world. Armenia is very easy to experience, thanks to very hospitable people. ",
                "quickFilterApplicableId": 3,
                "id": 256
            },
            {
                "name": "Azerbaijan",
                "description": "Azerbaijan is a Turkic state in the Caucasus of Southeastern Europe and Asia. Most inhabitants are Shia Muslim, a faith it shares with neighboring Iran. It achieved independence after the collapse of the Soviet Union in 1991. It has borders with Armenia, Georgia, Iran, Russia and Turkey as well as a Caspian Sea coastline.",
                "quickFilterApplicableId": 3,
                "id": 257
            },
            {
                "name": "Belarus",
                "description": "Belarus is a landlocked country in Eastern Europe, bordered by Russia to the north and east, Ukraine to the south, Poland to the west, and Lithuania and Latvia to the north. Its capital is Minsk; other major cities include Brest, Grodno (Hrodna), Gomel (Homiel), Mahilyow (Mahilou) and Vitebsk (Viciebsk). Forty percent of the country is forested, and its strongest economic sectors are agriculture and manufacturing. Until the 20th century, the Belarusians lacked the opportunity to create a distinctive national identity because for centuries the lands of modern-day Belarus belonged to several countries, including the Duchy of Polatsk, the Grand Duchy of Lithuania, the Polish-Lithuanian Commonwealth, and the Russian Empire. After the short-lived Belarusian People's Republic (1918–19), Belarus became a constituent republic of the Soviet Union, the Byelorussian SSR. Belarus declared independence in 1991 after the collapse of the Soviet Union.",
                "quickFilterApplicableId": 3,
                "id": 258
            },
            {
                "name": "Estonia",
                "description": "Estonia is a Baltic state in Northern Europe. It has land borders with Latvia and Russia. With a coastline on the Baltic Sea and Gulf of Finland, Estonia also has seaborders with Finland and Sweden. The Estonians are a Finnic people closely related to the Finns, with the Estonian language sharing many similarities to Finnish. Estonia regained its independence in 1991. It has since embarked on a rapid program of social and economic reform. Today, the country has gained recognition for its economic freedom, its adaptation of new technologies and as one of the world's fastest growing economies.",
                "quickFilterApplicableId": 3,
                "id": 259
            },
            {
                "name": "Lithuania",
                "description": "Lithuania is a Baltic country in Central/Eastern Europe. It has a Baltic Sea coastline in the west and surrounded by Latvia to the north, Belarus to the east, Poland to the southwest, and Russia (Kaliningrad) to the west. During the 14th century, Lithuania was the largest country in Europe: present-day Belarus, Ukraine, and parts of Poland and Russia were territories of the Grand Duchy of Lithuania. With the Lublin Union of 1569 Poland and Lithuania formed a new state, the Polish–Lithuanian Commonwealth. The Commonwealth lasted more than two centuries, until neighboring countries systematically dismantled it from 1772 to 1795, with the Russian Empire annexing most of Lithuania's territory. On March 11, 1990, Lithuania became the first Soviet republic to declare its renewed independence. Present-day Lithuania has one of the fastest growing economies in the European Union.",
                "quickFilterApplicableId": 3,
                "id": 260
            },
            {
                "name": "Georgia",
                "description": "Georgia is a country in the Caucasus. It lies at the eastern end of the Black Sea, with Turkey and Armenia to the south, Azerbaijan to the east, and Russia to the north, over the Caucasus Mountains. Georgia is a land filled with magnificent history and unparalleled natural beauty. Archaeologists found the oldest traces of wine production (7000-5000 BC) in Georgia. Georgians are not Russians, Turks or Persians, nor do they have any ethnic connection with other people. Georgians have been embroiled in struggles against the world’s biggest empires (Roman, Byzantine, Mongol, Persian, Ottoman, Russian, etc) for centuries. This little country was invaded many times and destroyed as many. However, Georgians have managed to preserve their cultural and traditional identity for 5,000 years. The countryside is covered with ancient towered fortifications, many of which house ancient churches (including one of the oldest in Christendom) and monasteries. ",
                "quickFilterApplicableId": 3,
                "id": 261
            },
            {
                "name": "Moldova",
                "description": "Moldova is a small land-locked country in Eastern Europe, surrounded by Romania to the southwest, across the Prut river, and Ukraine to the northeast. The capital of Moldova is Chisinau. The local language is Romanian, based on the Latin alphabet, but Russian is widely used. Moldova is a multiethnic republic. The major religion in Moldova is Orthodox Christian. Moldova's population is occupied mainly in food production and processing.",
                "quickFilterApplicableId": 3,
                "id": 262
            },
            {
                "name": "Cyprus",
                "description": "Cyprus is an island in the Mediterranean Sea, south of Turkey. After Sicily and Sardinia, Cyprus is the third largest island in the Mediterranean Sea. Although the island lies close to the Middle East, it is considered to be a European country and is a member of the European Union. Cyprus gained its independence from the United Kingdom in 1960. Despite a constitution which guaranteed a degree of power-sharing between the Greek Cypriot majority and the Turkish Cypriot minority, the two populations clashed in 1974, resulting in the occupation of the northern and eastern 40% of the island by Turkey. The UN operates a peacekeeping force and a narrow buffer zone between the two Cypriot ethnic groups. Fortunately, open hostilities have been absent for some time, as the two sides gradually inch towards a reunification. ",
                "quickFilterApplicableId": 3,
                "id": 263
            },
            {
                "name": "Kosovo",
                "description": "Kosovo or Kosova, is a partly recognized country in southeastern Europe. After a lengthy and often violent dispute with Serbia, Kosovo declared independence in February 2008 despite heavy Serbian opposition. Kosovo is largely an Albanian speaking and Muslim area, but there are also significant numbers of minorities living within its borders, especially Serbs. At this time, some civilian institutions, including the criminal justice system, are not functioning at a level consistent with Western standards.  Kosovo is a cash economy.  The currency used throughout Kosovo is the euro. The availability of tourist facilities is very limited.",
                "quickFilterApplicableId": 3,
                "id": 264
            },
            {
                "name": "Montenegro",
                "description": "The Republic of Montenegro is a country in the Balkans, on the Adriatic Sea. It borders Croatia and Bosnia and Herzegovina to the north, Serbia to the northeast, Kosovo to the east, and Albania to the south. To the west of Montenegro is the Adriatic Sea. Montenegro's tourism suffered greatly from Yugoslavia's tragic civil war in the 1990s. In recent years, along with the stabilized situation in the region, tourism in Montenegro has began to recover, and Montenegro is being re-discovered by tourists from around the globe. In 2007 the country received peak level of tourism which almost reached pre-war volumes. As a result, in 2008 many roads and hotels are being constructed or renovated.",
                "quickFilterApplicableId": 3,
                "id": 265
            },
            {
                "name": "Baltics",
                "description": "The Baltic states, Estonia, Latvia and Lithuania, are located in Northern Europe along the Baltic Sea. Each country has its own customs and traditions, and the people have remained remarkably stable within the approximate territorial boundaries of the current Baltic states. After centuries of foreign domination the Baltic countries regained their independence in 1991. Today the three countries are liberal democracies and members of NATO and the EU.  Their capitol cities are major tourist destinations.     For more information on the Baltics, search Estonia, Latvia and Lithuania.",
                "quickFilterApplicableId": 3,
                "id": 266
            },
            {
                "name": "Budapest",
                "description": "Budapest was originally two cities on each side of one of the most beautiful stretches of the Danube river – Buda, the older, more graceful part, with cobbled streets and medieval buildings, and Pest, the commercial center. In Buda, Gellért Hill gives a wonderful view of the city, river and mountains. On the hill is the Citadella fort, the Royal Palace which houses the National Gallery, the rampart of Halászbástya (Fisherman’s Bastion), so called because it was the duty of the city’s fishermen to protect the northern side of the Palace during the Middle Ages, and the great Mátyás templon (church) with its multicolored tiled roof. On the Pest side are the Parliament; the Hungarian National Museum, containing remarkable treasures ranging from the oldest skull found in Europe to Franz Liszt’s gold baton; the Belvárosi Templom, Hungary’s oldest church, dating from the 12th century, the Museum of Fine Arts housing European paintings and the Ethnographic Museum. Margaret Island, connected to both Buda and Pest by bridges, is a park with a sports stadium, swimming pool, spas, a rose garden and fountains. Budapest has about 100 hot springs.",
                "quickFilterApplicableId": 3,
                "id": 267
            },
            {
                "name": "Berlin",
                "description": "Say Berlin and people immediately think of the Wall, even though it is over a decade since \"Die Mauer\" was broken down. But Berlin has much more to offer and is growing in popularity with tourists wanting something with a bit more grit than most European destinations. The city has been in the midst of rapid regeneration in the last few years and in the West super-modern buildings provide a backdrop for a dynamic and cosmopolitan city that is distinctly new millennium in outlook. The East meanwhile is a model of twenty-first century urban development - the grey Communist concrete has been replaced with gleaming new structures that look to the city's future rather than dwelling on the past.  ",
                "quickFilterApplicableId": 3,
                "id": 268
            },
            {
                "name": "Munich",
                "description": "Capital of Bavaria and beer capital of Europe, Munich boasts as rich a wealth of art and architecture as any of Germany's great cities. Where Berlin and Frankfurt have entered into the spirit of modernity, Munich has retained the air of a traditional German city, and has grown in fame as keeper of Germany's folk customs and identity, full of architectural treasures from the baroque and Renaissance period. Oktoberfest is the main festival in the city and it is mobbed with lederhosen clad Germans and foreigners, and the celebration of carnivalesque magnitude belies the world view of Germans as a staid and serious folk. Dancing, processions and fabulous masques turn the entire city into a playground as people celebrate uproariously. If the revels don't sound like your thing then stay away and visit the city another time, when you can appreciate the Bavarian architecture of the Frauenkirche, Marienplatz and the old town, the baroque magnificence of the Schloss Nymphenburg and the modern expanse of the Olympia Park, an icon of post-war Germany.",
                "quickFilterApplicableId": 3,
                "id": 269
            },
            {
                "name": "Rothenburg",
                "description": "Rothenburg is a town in the Franconia region of Bavaria, well known for its well-preserved medieval old town, and a popular destination for tourists from around the world.",
                "quickFilterApplicableId": 3,
                "id": 270
            },
            {
                "name": "Istanbul",
                "description": "Istanbul (Byzantium, and later Constantinople) is the world's 3rd largest city and Turkey's cultural and financial center. It is located on the Bosphorus Strait and encompasses the natural harbor known as the Golden Horn. It extends both on the European (Thrace) and on the Asian (Anatolia) side of the Bosphorus, and is therefore the only metropolis in the world which is situated on two continents. In its long history, Istanbul served as the capital city of the Roman Empire (330–395), the East Roman (Byzantine) Empire (395–1204 and 1261–1453), the Latin Empire (1204–1261), and the Ottoman Empire (1453–1922). The city was chosen as joint European Capital of Culture for 2010. The historic areas of Istanbul were added to the UNESCO World Heritage List in 1985.",
                "quickFilterApplicableId": 3,
                "id": 271
            },
            {
                "name": "Cappadocia",
                "description": "Goreme, located among the \"fairy chimney\" rock formations, is a town in Cappadocia, a historical region of Turkey. The Goreme National Park was added to the UNESCO World Heritage List in 1985. The first period of settlement within the region reaches to Roman period of Christianity era. Among historical sites are Ortahane, Durmus Kadir, Yusuf Koc and Bezirhane churches in Göreme, including Tokali Kilise, the Apple Church, houses and shafts engraved from rocks.",
                "quickFilterApplicableId": 3,
                "id": 272
            },
            {
                "name": "Ephesus",
                "description": "Ephesus was a city of ancient Anatolia. During the period known as Classical Greece it was located in Ionia, where the Cayster River flows into the Aegean Sea. Ephesus hosted one of the seven churches of Asia, addressed in the Book of Revelation of The Bible, and the Gospel of John might have been written here. The city was famed for the Temple of Artemis (completed around 550 BC), which was destroyed by the Goths in 263. It is also the site of a large gladiator graveyard.",
                "quickFilterApplicableId": 3,
                "id": 273
            },
            {
                "name": "At Sea",
                "description": "The Aegean Sea is an elongated embayment of the Mediterranean Sea located between  the mainlands of Greece and Turkey respectively. In the north, it is connected to the Marmara Sea and Black Sea by the Dardanelles and Bosporus. The Aegean Islands are within the sea and some bound it on its southern periphery, including Crete and Rhodes. The Aegean Region consists of nine provinces in southwestern Turkey, in part bordering on the Aegean sea.  ",
                "quickFilterApplicableId": 3,
                "id": 274
            },
            {
                "name": "Athens",
                "description": "Athens, the capital of Greece is named after Athena, the goddess of wisdom, who, according to legend, won the city after defeating Poseidon in a duel. The goddess' victory was celebrated by the construction of a temple on the Acropolis, the site of the city's earliest settlement in Attica. As a city state, the coastal capital of Athens reached its heyday in the fifth century BC as a centre for the arts, learning and philosophy, home of Plato’s Academy and Aristotle's Lyceum. Athens is  also the birthplace of Socrates, Pericles, Sophocles and its many other prominent philosophers, writers and politicians of the ancient world.  Nowadays, the city retains a vast variety of Roman and Byzantine monuments, as well as a smaller number of remaining Ottoman monuments projecting the city's long history across the centuries.",
                "quickFilterApplicableId": 3,
                "id": 275
            },
            {
                "name": "Rhodes",
                "description": "Rhodes is a Greek island approximately 18 kilometres (11 mi) southwest of Turkey in eastern Aegean Sea. It is the largest of the Dodecanese islands in terms of both land area and population. Historically, Rhodes was famous worldwide for the Colossus of Rhodes, one of the Seven Wonders of the World. The medieval Old Town of the City of Rhodes has been declared a World Heritage Site and continues to draw flocks of tourists. The Palace of the Grand Master is impressive, and the shopping is diverse. There are a wide variety of good restaurants. ",
                "quickFilterApplicableId": 3,
                "id": 276
            },
            {
                "name": "Kalambaka",
                "description": "Kalambaka is a small town in northeastern Greece near the famous Meteora cliffs. The nearest town to the large rock formations atop which monasteries have been built offers spectacular views of the surroundings. Kalambaka attracts a fair number of tourists and the main street in town is filled with smalls shops, bars, cafes and restaurants. ",
                "quickFilterApplicableId": 3,
                "id": 277
            },
            {
                "name": "Crete",
                "description": "<P>Crete is the largest of the Greek islands and the fifth largest island in the Mediterranean Sea and is one of the most popular holiday destinations in Greece. Crete was the center of Europe's most ancient civilization; the Minoan. Early Cretan history is replete with legends such as those of King Minos, Theseus, Minotaur, Daedalus and Icarus passed on orally via poets such as Homer. Crete provides popular modern day tourist destinations such as: the Minoan sites of Knossos and Phaistos, the classical site of Gortys, the Venetian old city and port of Chania, the Venetian castle at Rethymno, and the Samaria Gorge. The island's tourism infrastructure caters to all tastes, including a very wide range of accommodation; the island's facilities take in large luxury hotels with their complete facilities, swimming pools, sports and recreation, smaller family-owned apartments, camping facilities and others. Visitors reach the island via two international airports in Heraklion and Chania, or by boat to the main ports of Heraklion, Chania, Rethimno, and Agios Nikolaos.</P>",
                "quickFilterApplicableId": 3,
                "id": 278
            },
            {
                "name": "Corfu",
                "description": "Corfu is a Greek island in the Ionian Sea. The island's history is laden with battles and conquests, indicative of Corfu's turbulent position in a historical vortex lasting until the modern period, at which time unification with modern Greece from 1864 made the island's history one with that of the mainland, with no further foreign intervention. The old city, having grown up within fortifications, where every metre of ground was precious, is a labyrinth of narrow streets paved with cobblestones, sometimes tortuous but colourful and clean. Corfu contains a few very important remains of antiquity such as: the Halikiopoulo, the tomb of Menekrates, Poseidon, Cassiope, the Achilleion.  Corfu is mostly planted with olive groves and vineyards and has been producing olive oil and wine since antiquity. Corfiotes have a long history of hospitality to foreign residents and visitors.",
                "quickFilterApplicableId": 3,
                "id": 279
            },
            {
                "name": "Kamchatka",
                "description": "<P>The Kamchatka Peninsula is a 1,250-kilometer long peninsula in the Russian Far East, with an area of 472,300 km2 (182,400 sq mi).The Kamchatka Peninsula, the Commander Islands, and Karaginsky Island constitute the Kamchatka Krai of the Russian Federation. The majority of the 402,500 inhabitants are Russians, but there are also about 13,000 Koryaks. More than half of the population lives in Petropavlovsk-Kamchatsky (198,028 people) and nearby Yelizovo (41,533). The Kamchatka peninsula contains the Volcanoes of Kamchatka, a UNESCO World Heritage Site.<BR></P>",
                "quickFilterApplicableId": 3,
                "id": 280
            },
            {
                "name": "Sodankyla",
                "description": "Sodankyla is home to the annual 5-day Midnight Sun Festival, which usually takes place during the 2nd week of June. &nbsp;One of the main themes of the festival is to show films without a break all day and night long, while the sun keeps on shining.",
                "quickFilterApplicableId": 3,
                "id": 281
            },
            {
                "name": "Svalbard",
                "description": "Svalbard is an archipelago&nbsp; in the Arctic, constituting the northernmost part of Norway. Located north of mainland Europe, it is about midway between mainland Norway and the North Pole. Spitsbergen&nbsp; is the largest island, followed by Nordaustlandet and Edge&oslash;ya. The administrative center is Longyearbyen, and the archipelago is administrated by the Governor of Svalbard.",
                "quickFilterApplicableId": 3,
                "id": 282
            },
            {
                "name": "Danube Delta",
                "quickFilterApplicableId": 3,
                "id": 283
            },
            {
                "name": "Nurburg",
                "quickFilterApplicableId": 3,
                "id": 284
            },
            {
                "name": "Vis",
                "quickFilterApplicableId": 3,
                "id": 285
            },
            {
                "name": "Korcula",
                "quickFilterApplicableId": 3,
                "id": 286
            },
            {
                "name": "Brac",
                "quickFilterApplicableId": 3,
                "id": 287
            },
            {
                "name": "Syros",
                "quickFilterApplicableId": 3,
                "id": 288
            },
            {
                "name": "Greenland",
                "quickFilterApplicableId": 3,
                "id": 289
            },
            {
                "name": "Ammassalik Island",
                "quickFilterApplicableId": 3,
                "id": 290
            },
            {
                "name": "Verzej",
                "quickFilterApplicableId": 3,
                "id": 291
            },
            {
                "name": "Lefkada",
                "quickFilterApplicableId": 3,
                "id": 292
            },
            {
                "name": "Scandinavia",
                "quickFilterApplicableId": 3,
                "id": 293
            },
            {
                "name": "Igoumenitsa",
                "quickFilterApplicableId": 3,
                "id": 294
            },
            {
                "name": "Europe River Cruise",
                "quickFilterApplicableId": 3,
                "id": 295
            },
            {
                "name": "Mediterranean Cruise",
                "quickFilterApplicableId": 3,
                "id": 296
            },
            {
                "name": "Norway Fjords Cruise",
                "quickFilterApplicableId": 3,
                "id": 297
            },
            {
                "name": "Northern Europe Cruise",
                "quickFilterApplicableId": 3,
                "id": 298
            },
            {
                "name": "Corinth",
                "quickFilterApplicableId": 3,
                "id": 299
            },
            {
                "name": "Adriatic Cruise",
                "quickFilterApplicableId": 3,
                "id": 300
            },
            {
                "name": "Ultraluxe Turkey",
                "quickFilterApplicableId": 3,
                "id": 301
            },
            {
                "name": "Moskenes",
                "quickFilterApplicableId": 3,
                "id": 302
            },
            {
                "name": "Ultraluxe Croatia",
                "quickFilterApplicableId": 3,
                "id": 303
            },
            {
                "name": "Ultraluxe Iceland",
                "quickFilterApplicableId": 3,
                "id": 304
            },
            {
                "name": "Ultraluxe Greece",
                "quickFilterApplicableId": 3,
                "id": 305
            },
            {
                "name": "Russia",
                "quickFilterApplicableId": 3,
                "id": 1106
            },
            {
                "name": "Ski Austria",
                "quickFilterApplicableId": 3,
                "id": 1107
            },
            {
                "name": "Ski Switzerland",
                "quickFilterApplicableId": 3,
                "id": 1113
            },
            {
                "name": "Ukraine",
                "quickFilterApplicableId": 3,
                "id": 1116
            },
            {
                "name": "Ancestry Germany",
                "quickFilterApplicableId": 3,
                "id": 1136
            },
            {
                "name": "Ancestry Poland",
                "quickFilterApplicableId": 3,
                "id": 1139
            }
        ]
    },
    {
        "continent": "Europe (Italy)",
        "id": 8,
        "countries": [
            {
                "name": "Italy",
                "description": "Italy is one of the most visited destinations in the world. It's top attractions include; Rome (Colosseum, Vatican City, PIazza Navona, Forum, Pantheon, Fountains of Trevi, Spanish Steps), Florence (Duomo, Old City, Ponte Vecchio, Uffizi), and Venice (Grand Canal, Doge's Palace, St. Marks Square). But there is much more to discover outside these heavily travelled spots.  Tuscany and Umbria with its wine, food and hilltowns (Sienna, San Gimignano, Orvietto, Spoleto), the dazzling Amalfi Coast (Positano, Capri, Sorrento), Siciliy with its old words ways, the urbane Milan and nearby Lake Como, the Italian Riviera... and more.  One important piece of advice, the soul of Italy is in its small towns, so be sure to get outside the big cities and into the country. That is where you will find the magic.",
                "quickFilterApplicableId": 3,
                "id": 306
            },
            {
                "name": "Malta",
                "description": "Malta is an island country in the Mediterranean Sea that lies south of the island of Sicily, Italy. The country is an archipelago, with only the three largest islands (Malta, Ghawdex or Gozo, and Kemmuna or Comino) being inhabited. Throughout much of its history, Malta has been considered a crucial strategic location due in large part its position in the Mediterranean Sea. It was held by several ancient cultures including Phoenicians, Carthaginians, Romans, Byzantines, Sicilians, and others. The island is commonly associated with the Knights Hospitaller who ruled it. This, along with the historic Biblical shipwreck of St. Paul on the island, ingrained the strong Roman Catholic legacy which is still the official and most practiced religion in Malta today. The country's official languages are Maltese and English, although there are strong historical ties to the Italian language on the islands. Malta gained independence from the United Kingdom in 1964 and is currently a member of the European Union.",
                "quickFilterApplicableId": 3,
                "id": 307
            },
            {
                "name": "Milan",
                "description": "Milan is the social and fashion capitol of Italy. There is nowhere better in the world for people watching and picking up fashion tips, as the most famous designers on the globe have their headquarters here. Milan also has the cultural treasures you'd expect of an Italian city.  The Duomo is the world's third largest Catholic church; a fantastically ornate Gothic conception that sits in the centre of the city. Piazzas and art galleries boast sculptures and canvases from the most famous Italian artists of the Renaissance. And the reason many people flock to the city, is just a single painting - Leonardo da Vinci's The Last Supper. ",
                "quickFilterApplicableId": 3,
                "id": 308
            },
            {
                "name": "Rome",
                "description": "Rome, the 'Eternal City', is the capital of Italy. The historical center is a UNESCO World Heritage Site. Make sure to explore the sites of the Coliseum and the Roman Forum. A few blocks away, Old Rome is the center of the medieval and Renaissance periods, with beautiful plazas, cathedrals, the Pantheon, Piazza Navona, Fountains of Trevi, Campo de' Fiori, Spanish Steps, and plenty of shopping and dining. Just across the river is the Vatican, the Papal City State and its endless treasure troves of sights, relics, and museums, as well as the surrounding Italian neighborhood, Vaticano. Via Veneto leads north into modern Rome to the train station and is lined with glitzy shops and hotels for every budget.",
                "quickFilterApplicableId": 3,
                "id": 309
            },
            {
                "name": "Capri",
                "description": "Romance seems to waft through the air on Capri, accompanied by the scent of lemon blossoms and fresh sea air. The most popular way to arrive at Capri is by water, which allows wonderful views of the island as it is approached.  The luminescence of the Blue Grotto, and the striking Faraglioni rocks and Palazzo al Mare add to the magical spell.   ",
                "quickFilterApplicableId": 3,
                "id": 310
            },
            {
                "name": "Parma",
                "description": "Parma is a city in the Italian region of Emilia-Romagna famous for its architecture and the fine countryside around it. It is the home of the University of Parma, one of the oldest universities in the world. Parma is divided into two parts by the little stream with the same name. Parma's Etruscan name was adapted by Romans to describe the round shield called Parma.",
                "quickFilterApplicableId": 3,
                "id": 311
            },
            {
                "name": "Sardinia",
                "description": "<P style=\"BACKGROUND: #f8fcff\" mce_style=\"BACKGROUND: #f8fcff\"><SPAN style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN; mso-bidi-font-weight: bold\" lang=EN mce_style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN; mso-bidi-font-weight: bold\">Sardinia</SPAN><SPAN style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\" lang=EN mce_style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\"> is the second-largest island in the Mediterranean Sea (after Sicily). It is an autonomous region of Italy, and the nearest land masses are (clockwise from north) the French island of Corsica, the Italian Peninsula, Sicily, Tunisia, and the Spanish Balearic Islands.<?xml:namespace prefix = o ns = \"urn:schemas-microsoft-com:office:office\" /><o:p></o:p></SPAN></P>  <P style=\"BACKGROUND: #f8fcff\" mce_style=\"BACKGROUND: #f8fcff\"><SPAN style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\" lang=EN mce_style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\">The name Sardinia is a Latin creation, possibly based on that of the dominant indigenous ethnic group, called the Sardi/Sardini in Latin.<o:p></o:p></SPAN></P>  <P style=\"BACKGROUND: #f8fcff\" mce_style=\"BACKGROUND: #f8fcff\"><SPAN style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\" lang=EN mce_style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\">The coasts of Sardinia (1,849&nbsp;km long) are generally high and rocky, with long, relatively straight stretches of coastline, many outstanding headlands, a few wide, deep bays, many inlets, and with various smaller islands off the coast.</SPAN></P>  <P style=\"BACKGROUND: #f8fcff\" mce_style=\"BACKGROUND: #f8fcff\"><SPAN style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\" lang=EN mce_style=\"FONT-FAMILY: 'Calibri','sans-serif'; FONT-SIZE: 10pt; mso-ascii-theme-font: minor-latin; mso-hansi-theme-font: minor-latin; mso-ansi-language: EN\"><o:p>  <TABLE id=ctl00_PlaceHolderRightColumn_ctl00_tblContent class=ahInfoContentTwo border=0 cellSpacing=0 cellPadding=0>  <TBODY>  <TR>  <TD class=TravelSummary><SPAN id=ctl00_PlaceHolderRightColumn_ctl00_lblContent>  <P>This arid resort island is much beloved by wealthy Romans and Milanese, especially those keen on sailing, and is just 45 minutes by air from Rome. Although the landscape of the interior is stark and relatively flat (unlike beautiful and mountainous Corsica to the north), the beaches and limpid water are some of the best in the Mediterranean. </P></SPAN></TD></TR></TBODY></TABLE></o:p></SPAN></P>",
                "quickFilterApplicableId": 3,
                "id": 312
            },
            {
                "name": "Sicily",
                "quickFilterApplicableId": 3,
                "id": 313
            },
            {
                "name": "Monza",
                "quickFilterApplicableId": 3,
                "id": 314
            },
            {
                "name": "Cosenza",
                "quickFilterApplicableId": 3,
                "id": 315
            },
            {
                "name": "Veneto",
                "quickFilterApplicableId": 3,
                "id": 316
            },
            {
                "name": "Piedmont",
                "quickFilterApplicableId": 3,
                "id": 317
            },
            {
                "name": "Puglia",
                "quickFilterApplicableId": 3,
                "id": 318
            },
            {
                "name": "Salina",
                "quickFilterApplicableId": 3,
                "id": 320
            },
            {
                "name": "Basilicata",
                "quickFilterApplicableId": 3,
                "id": 321
            },
            {
                "name": "Ultraluxe Italy",
                "quickFilterApplicableId": 3,
                "id": 323
            },
            {
                "name": "La Dolce Vita Rail Journey",
                "quickFilterApplicableId": 3,
                "id": 324
            },
            {
                "name": "Ski Italy",
                "quickFilterApplicableId": 3,
                "id": 1110
            },
            {
                "name": "Ancestry Italy",
                "quickFilterApplicableId": 3,
                "id": 1132
            },
            {
                "name": "Ancestry Sicily",
                "quickFilterApplicableId": 3,
                "id": 1141
            },
            {
                "name": "Road Trip Italy",
                "quickFilterApplicableId": 3,
                "id": 1143
            }
        ]
    },
    {
        "continent": "Europe (West)",
        "id": 9,
        "countries": [
            {
                "name": "England",
                "description": "<P>&nbsp;England offers the perfect place for people of all tastes - whether it is cosmopolitain cities, historical and cultural sites, wild and rugged nature or world recognised sprting events, England has it all.</P>",
                "quickFilterApplicableId": 3,
                "id": 325
            },
            {
                "name": "France",
                "description": "France is ranked as the first tourist destination in the world by volume of visitors. The most popular sights are; Paris (Eiffel Tower, Louvre Museum, Musée d'Orsay, Arc de Triomphe, Centre Pompidou, Sainte-Chapelle, Musée Picasso), nearby Palace of Versailles, the Loire valley with its extravagant chateaux (Château de Chambord, Chenonceau), the Riviera or Cote d'Azur, Alsace (Château du Haut-Kœnigsbourg), Provence (Aix en Provence), Normandy (Mont-Saint-Michel, Carcassonne)... the list seems endless.  A country renowned for its history, architecture, cuisine, culture, style, weather, France's reputation is well deserved.",
                "quickFilterApplicableId": 3,
                "id": 326
            },
            {
                "name": "Ireland",
                "description": "Ireland is the third largest island in Europe, surrounded by hundreds of islands and islets. Politically, the Republic of Ireland covers five-sixths of the island, with Northern Ireland, part of the United Kingdom, covering the remainder in the north-east. To the east of Ireland, separated by the Irish Sea, is the island of Great Britain. The first settlements in Ireland date from 8000 BC. By 200 BC Celtic migration and influence had come to dominate the island. Relatively small scale settlement by both the Vikings and Normans in the Middle Ages gave way to complete English domination by the 1600s. Following a war of independence, Ireland was split into the independent Irish Free State and Northern Ireland, which remains a part of the United Kingdom. In 1973 both parts of Ireland joined the European Economic Community. Sectarian conflict in Northern Ireland led to much unrest from the late 1960s until the 1990s, which subsided following a peace deal in 1998. Dublin has been transformed in recent years as the Irish economy has taken off, and is a flourishing tourist centre.",
                "quickFilterApplicableId": 3,
                "id": 327
            },
            {
                "name": "Belgium",
                "description": "The Kingdom of Belgium is located in northwest Europe, covers an area of 30,528 km2 (11,787 square miles) and has a population of about 10.5 million. It is a founding member of the European Union and hosts its headquarters, as well as those of other major international organizations, including NATO. Straddling the cultural boundary between Germanic and Latin Europe, Belgium is home for two main linguistic groups, the Dutch speakers/Flemings and the French speakers, mostly Walloons, plus a small group of German speakers. The capitol city is Brussels which has a superb city center. The preserved medieval towns of Brugge and Ghent are also top attractions. Belgium is famous for its cuisine, chocolate, and of course its beer. Brands of Belgian chocolate and pralines, like Callebaut, Côte d'Or, Neuhaus, Leonidas, Guylian and Godiva, are world renowned and widely sold. Belgium produces over 500 varieties of beer. The Trappist beer of the Abbey of Westvleteren has consistently been rated the world's best beer.",
                "quickFilterApplicableId": 3,
                "id": 328
            },
            {
                "name": "Netherlands",
                "description": "The Netherlands is the European part of the Kingdom of the Netherlands, which consists of the Netherlands, the Netherlands Antilles and Aruba in the Caribbean. The Netherlands is a parliamentary democratic constitutional monarchy, located in Western Europe. It is bordered by the North Sea to the north and west, Belgium to the south, and Germany to the east. The Netherlands is a densely populated country. It is known for its traditional windmills, tulips, cheese, clogs (wooden shoes), delftware and gouda pottery, for its bicycles, and in addition, traditional values and civil virtues such as its classic social tolerance. ",
                "quickFilterApplicableId": 3,
                "id": 329
            },
            {
                "name": "Portugal",
                "description": "Portugal is a country on the Iberian Peninsula, located in southwestern Europe. It is the westernmost country of mainland Europe and is bordered by the Atlantic Ocean to the west and south and by Spain to the north and east. The Atlantic archipelagos of the Azores and Madeira are also part of Portugal. During the 15th and 16th centuries, with a global empire that included possessions in Africa, Asia, and South America, Portugal was one of the world's major economic, political, and cultural powers. Today it is a major tourist destination with the historic city of Lisbon, the Azores resorts, and gorgeous coastline of the Algarve. Portugal is one of the warmest European countries, the annual temperature averages in mainland Portugal are 13 °C (55 °F) in the north and 18 °C (64 °F) in the south.",
                "quickFilterApplicableId": 3,
                "id": 330
            },
            {
                "name": "Switzerland",
                "description": "Switzerland is a landlocked alpine country of roughly 7.6 million people in Western Europe, consisting of 26 states called cantons. Berne is the seat of the federal authorities, while the country's economic centres are its three global cities, Zurich, Geneva, and Basel. Switzerland is one of the richest countries in the world by per capita gross domestic product. Zürich and Geneva have respectively been ranked as having the first and second highest quality of life in the world. It is bordered by Germany to the north, France to the west, Italy to the south and Austria and Liechtenstein to the east. Switzerland has a long history of neutrality—it has not been at war since 1815—and hosts many international organizations, including the Red Cross, the World Trade Organization and one of the U.N.'s two European offices. However, it is not a member of the European Union. Switzerland is multilingual and has four national languages: German, French, Italian and Romansh. The establishment of Switzerland is traditionally dated to 1 August 1291.",
                "quickFilterApplicableId": 3,
                "id": 331
            },
            {
                "name": "Spain",
                "description": "Spain is a country located in southwestern Europe on the Iberian Peninsula. Its mainland is bordered to the south and east by the Mediterranean Sea, to the north by France, and to the west by Portugal. Spanish territory also includes the Balearic Islands in the Mediterranean, the Canary Islands in the Atlantic Ocean. Spain is the second largest country in Western Europe after France. Because of its location, Spain has had an intriguing role in global history. Archaeological and genetic evidence suggests that the Iberian Peninsula acted as one of three major refugia from which northern Europe was repopulated following the end of the last ice age. Andalusia was the furthest reach of the great Moorish empire. And it was also the seat of a global empire that discovered the New World, and left a legacy of over 400 million Spanish speakers today. Through war and peace, under different religions, and with strong regional differences - Spain continues to be a remarkable destination with intriguing cities and natural beauty. ",
                "quickFilterApplicableId": 3,
                "id": 332
            },
            {
                "name": "Monaco",
                "description": "The principality of Monaco and city of Monte Carlo lie on the southern Mediterranean Sea coast of France, near the border with Italy, in Southern Europe. It is the second smallest independent state in the world (after the Vatican) and is almost entirely urban. With no natural resources to exploit other than its location and climate, the principality has become a resort for tourists and a tax haven for businesses. Monaco is six times the size of the Vatican. Though it has lost the title of world's most densely populated city to Macau, it remains by far the world's most densely populated independent country with second place Singapore lagging some 10,000 people per square kilometer behind.",
                "quickFilterApplicableId": 3,
                "id": 334
            },
            {
                "name": "Andorra",
                "description": "Andorra is a small (pop. 73,100, size 464 km squared), mountainous country in the Pyrenees mountains in Europe, located on the border between France and Spain. Andorra is arguably a city-state and has no distinct cities as such. One thing that this charming beautifully set high mountain capital city does not have is a lot of room. Imagine a steep gorge in the mountains and now cram into it a whole capital city complete with roads, restaurants, souvenir shops, services, hotels and transport system, and you have Andorra La Vella. That's not much room for nearly 24,000 citizens plus a vast number of tourists. ",
                "quickFilterApplicableId": 3,
                "id": 335
            },
            {
                "name": "Gibraltar",
                "description": "Gibraltar, colloquially known as The Rock, is an overseas territory of the United Kingdom on the southern coast of Spain at the entrance to the Mediterranean sea. The people are British Citizens. This is a very unique place for the curious traveller. The inside of the rock is an absolute labyrinth with the secret internal roads and tunnels 4 times longer than those on the surface. Military presence and security in this otherwise deserted area is strong but almost invisible. In Greek mythology Gibraltar was Calpe, one of the Pillars of Hercules, which marked the edge of the Mediterranean and the known world. ",
                "quickFilterApplicableId": 3,
                "id": 336
            },
            {
                "name": "London",
                "description": "London is the capital and largest urban area in the United Kingdom. An important settlement for two millennia, London's history goes back to its founding by the Romans. Since its settlement, London has been part of many important movements and phenomena throughout history, such as the English Renaissance, the Industrial Revolution, and the Gothic Revival. London is one of the world's leading business, financial and cultural centres, and its influence in politics, education, entertainment, media, fashion and the arts contribute to its status as a major global city. London boasts four World Heritage Sites: The Palace of Westminster, Westminster Abbey and St. Margaret's Church; the Tower of London; the historic settlement of Greenwich; and the Royal Botanic Gardens, Kew. The city is a major tourist destination both for domestic and overseas visitors.",
                "quickFilterApplicableId": 3,
                "id": 337
            },
            {
                "name": "Devon",
                "description": "Devon is a large county in the South West of England. The county shares borders with Cornwall to the west and Dorset and Somerset to the east.  county is home to England's only natural UNESCO World Heritage Site, which is the Dorset and East Devon Coast, known as the Jurassic Coast for its geology and geographical features. Along with its neighbour, Cornwall, Devon is known as the \"Cornubian massif\". This geology gives rise to the landscapes of Dartmoor and Exmoor, which are both National Parks.   ",
                "quickFilterApplicableId": 3,
                "id": 338
            },
            {
                "name": "Liverpool",
                "description": "Liverpool is a pleasant surprise to first-time visitors. Many people come to Liverpool to follow the steps of the Beatles or their favourite soccer stars, all of whom are an undeniable part of the city's attraction, but most visitors leave impressed by the city's charming character and disarming friendliness. Liverpool has a range of museums and art galleries, far more than one might reasonably expect from a city of this size. In the older part of town the grand offices that once housed the cream of Britain's merchant shipping companies are now being rejuvenated and emerging as cafés, bars and nightclubs and a growing number of excellent restaurants. ",
                "quickFilterApplicableId": 3,
                "id": 339
            },
            {
                "name": "Manchester",
                "description": "Manchester is one of the country's most influential population centres, constantly vying with Birmingham for the title of England's second city.  It was at the heart of the industrial revolution that steam-powered Victorian Britain to the position of the number one country on earth. The city centre is a series of continental style plazas, designer developments and cutting edge architecture with structures such as The Bridgewater Hall, The Lowry Centre and the bizzarely brilliant Imperial War Museum building. The arts and culture are well represented in a series of galleries and museums. The future has never looked brighter for the city, with further development ongoing, tourists and locals alike are beginning to enjoy the city's vibrancy and famous nightlife like never before. ",
                "quickFilterApplicableId": 3,
                "id": 340
            },
            {
                "name": "Windsor",
                "description": "Windsor Castle, in Windsor in the English county of Berkshire, is the largest inhabited castle in the world and, dating back to the time of William the Conqueror, is the oldest in continuous occupation. The castle's floor area is approximately 484,000 square feet (about 45,000 square metres). Together with Buckingham Palace in London and Holyrood Palace in Edinburgh, it is one of the principal official residences of the British monarch. Queen Elizabeth II spends many weekends of the year at the castle, using it for both state and private entertaining. Her other two residences, Sandringham House and Balmoral Castle, are the Royal Family's private homes.",
                "quickFilterApplicableId": 3,
                "id": 341
            },
            {
                "name": "Cotswolds",
                "description": "The Cotswolds is a range of hills in west-central England, sometimes called the \"Heart of England\", an area 25 miles (40 km) across and 90 miles (145 km) long. The area has been designated as the Cotswold Area of Outstanding Natural Beauty. The highest point in the Cotswolds range is Cleeve Hill at 1,083 ft (330 m), 2.5 miles (4 km) to the north of Cheltenham. The Cotswold Way is a long-distance footpath, approximately 103 miles (166 km) long, running the length of the AONB, mainly on the edge of the Cotswold escarpment with views over the Severn Valley and the Vale of Evesham.",
                "quickFilterApplicableId": 3,
                "id": 342
            },
            {
                "name": "Calais",
                "description": "Calais overlooks the Strait of Dover, the narrowest point in the English Channel and is the closest French town to England, of which Calais was a territorial possession for several centuries. The white cliffs of Dover can easily be seen on a clear day. The old part of the town, Calais proper (or Calais-Nord), is situated on an artificial island surrounded by canals and harbours. The modern part of the town, St-Pierre, lies to the south and southeast.",
                "quickFilterApplicableId": 3,
                "id": 343
            },
            {
                "name": "Galway",
                "description": "Galway, called Gailimh in Irish, with a population of over 70,000, is Ireland's fourth largest city and is a major hub for visits to West Ireland. It has long since been known as \"The City of the Tribes\" and this title could not be more appropriate these days, given the multicultural vibrancy of present-day Galway. Galway is a perfect base for seeing the West Ireland, but it is also worth a visit in itself. Although it has only a few typical sightseeing spots what makes it a wonderful place to stay is the atmosphere, the culture, the people, the events. The pedestrian shopping area south of Eyre Square, is a pleasant place to walk around. And if the traditional Irish rain starts, just visit the Eyre Square shopping center, where they have put a roof above parts of the old town wall and so included them into the shopping mall, a beautiful combination of old and new. ",
                "quickFilterApplicableId": 3,
                "id": 344
            },
            {
                "name": "Bern",
                "description": "Berne is the city that time forgot. The old city center has been designated a UNESCO World Heritage Site and the architecture reads like a timeline of Western European fashions - from the medieval to the overly ornate affectations of the Renaissance.  The Great Fire of 1405 destroyed much of the predominantly wooden old city, and the rebuilding was conducted in sandstone giving the city its creamy colouring so distinctive today.  The main pleasures for visitors are derived from strolling among the arcades of the shopping streets and central squares, or admiring the amazing period architecture that still appears as fresh and clean as when first built.  Theatres, art galleries and museums fill out the rest of the attractions, as you might expect in such a refined environment. ",
                "quickFilterApplicableId": 3,
                "id": 345
            },
            {
                "name": "Barcelona",
                "description": "In Barcelona, and throughout Catalonia, there are two official languages: Catalan, the language of the Catalans, and Spanish, the official language of Spain.    Wherever you are in Barcelona, there's always something to see nearby around the neighbourhood or district: jewels of home-grown Catalan architecture, modernisme, and contemporary architecture, markets that are a treat for the senses, treasures of the ancient Roman and medieval city, parks where you can unwind … And the best thing of all is, you don't have to be a great explorer to find and discover all of Barcelona’s neighbourhoods.     Barcelona is legendary for its nightlife, but don't venture out for dinner before 11pm, the restaurants don't really get going till midnight, and the clubs start hopping from the wee hours till dawn.",
                "quickFilterApplicableId": 3,
                "id": 346
            },
            {
                "name": "Valencia",
                "description": "Valencia is home to some of the country's most extensive collections of art and modern art facilities you find anywhere in the nation. The wealth of architecture, the epitome of which is the cathedral, established over centuries, makes the city a living museum. La Lonja remains one of the finest medieval buildings found anywhere in Europe, while the modernista train station is likewise one of the finest exponents of that style. A large student population means that the bars and clubs of the city are always packed and lively. This is the birthplace of paella, the most famous Spanish dish in the world and you must try any of the seemingly hundreds of varieties on offer in the city's excellent restaurants.",
                "quickFilterApplicableId": 3,
                "id": 347
            },
            {
                "name": "Marbella",
                "description": "Marbella is the blue chip resort of Spain's Costa Del Sol. It's a holiday destination that retains much of the original charm that first brought people here in the early years of the 20th century. Modern Marbella was created by the efforts of Prince Alfonso von Hohenlohe who sought an exclusive Mediterranean retreat - in the company of his exclusive friends. The old town is changing though, as a process of \"boutiquification\" converts the old white-washed houses into galleries and chic clothing stores catering to the sophisticated tastes of international visitors. Yet there is still considerable charm to be found.",
                "quickFilterApplicableId": 3,
                "id": 348
            },
            {
                "name": "Madrid",
                "description": "As the capital of the Spanish Empire, Madrid was once the richest and most powerful city in the world. That kind of past leaves a big impression on a place and in Madrid it is easy to see. For palaces, museums and concerts it is up there with the best in the world. The museums of the \"golden triangle\" alone, namely the Prado, Reina Sofia and Thyssen-Bornemisza, feature a stunning array of paintings ranging from Old Masters to modern surrealists all housed in some of Spain's most magnificent buildings. And the rest of the city is just as rich in cultural icons and architecture. But Madrid is also a city for going out and partying. The area of Malasana is packed with bars and restaurants that stay open until dawn and rival anything Barcelona has to offer. ",
                "quickFilterApplicableId": 3,
                "id": 349
            },
            {
                "name": "Luxembourg",
                "description": "Luxembourg, officially the Grand Duchy of Luxembourg is a small, landlocked country in western Europe, bordered by Belgium, France, and Germany. Luxembourg has a population of under half a million people in an area of approximately 2,586 square kilometres (999 sq mi).&nbsp; It is the world's only remaining sovereign Grand Duchy. The country has a highly developed economy, with the highest Gross Domestic Product per capita in the world as per IMF and WB. Its historic and strategic importance dates back to its founding as a Roman era fortress site and Frankish count's castle site in the Early Middle Ages.&nbsp; Luxembourg lies on the cultural divide between Romance Europe and Germanic Europe, borrowing customs from each of the distinct traditions. Luxembourg is a trilingual country; German, French and Luxembourgish are official languages.",
                "quickFilterApplicableId": 3,
                "id": 350
            },
            {
                "name": "Girona",
                "description": "Girona is&nbsp;a part of the Catalonia region, formally known as the Autonomous Community of Catalonia. It lies on the eastern tip of Spain's land mass and is bordered by the provinces of <I>Barcelona</I> and <I>Lleida,</I> as well as the Mediterranean Sea. The capital of the province of Girona is the city of Girona.",
                "quickFilterApplicableId": 3,
                "id": 351
            },
            {
                "name": "Sligo",
                "description": "<span style=\"font-family: Calibri; font-size: small;\">  <p class=\"MsoNormal\" style=\"margin: 0cm 0cm 10pt;\">Sligo (from the Irish: Sligeach meaning \"shelly place) is the county town of County Sligo in Ireland. <br /><br />Sligo Town is a busy, atmospheric spot filled with great restaurants, shops and pubs, while the county&rsquo;s smaller villages are excellent places to escape the frenetic pace of life.<br /><br />Resounding with literary history, Sligo County is one of the&nbsp; North West&rsquo;s most scenic&nbsp;areas and was the inspiration for poet WB Yeats, whose final resting place is beneath the beautiful Benbulben Mountains.</p>  <p class=\"MsoNormal\" style=\"margin: 0cm 0cm 10pt;\">As well as some truly beautiful mountainous scenery, Sligo is also blessed with still glassy lakes, and some beautiful beaches perched right on the edge of the Atlantic.</p>  <p class=\"MsoNormal\" style=\"MARGIN: 0cm 0cm 10pt\">&nbsp;</p>  </span>",
                "quickFilterApplicableId": 3,
                "id": 352
            },
            {
                "name": "Canal du Midi",
                "description": "The peaceful Canal du Midi traverses over rivers, and through hills and on its journey from Toulouse to the Mediterranean port of S&ecirc;te uses over ninety one locks to move nearly one hundred and ninety meters of water. <br /> The Canal du Midi is a small hub of cultural activity, dotted with bistros, restaurants and art galleries that have sprung up in the old lock keepers cottages along side the canal, each offering the perfect opportunity to stop and explore this picturesque landscape.",
                "quickFilterApplicableId": 3,
                "id": 353
            },
            {
                "name": "Bordeaux",
                "description": "Founded around the third century BC, the city thrived on its port activities, and building its wealth on the commercial expansion and colonial trade with the West Indies. Sites not to be missed when visiting Bordeaux include the Grand Theatre with its 18th century architecture. It is ideally located near the shopping heaven of Rue Sainte Catherine. It is also worth visiting St Andre Cathedral, Tour Pey-Berland and the Aquitaine Museum to appreciate Bordeaux’s rich history.",
                "quickFilterApplicableId": 3,
                "id": 354
            },
            {
                "name": "Wales",
                "description": "Wales is famous for having more castles per capita than any other country in the World. It has three National Parks (including Pembrokeshire Coast National Park - the only coastal National Park in the UK), five Areas of Outstanding Natural Beauty, and only 2.9 million people. Unlike national parks in some other countries, the National Parks aren’t wildernesses, but living communities with beautiful countryside containing pretty villages and market towns. The landscape lends itself to all kinds of activities - walking, cycling, climbing, golf, water sports and paragliding to name but a few. If you prefer less active activities, why not spend time in the bustling city centres, tiny craft shops, designer outlets and galleries.",
                "quickFilterApplicableId": 3,
                "id": 355
            },
            {
                "name": "Scotland",
                "description": "Scottland is known for its expansive spaces, majestic and rugged highlands and whisky distilleries.&nbsp; The country however, has much more to offer the curious of mind. From austere castles, to bucolic landscapes and picture perfect towns and villages, bussling cities and stunning coastlines, Scotland has much to offer the traveller.",
                "quickFilterApplicableId": 3,
                "id": 356
            },
            {
                "name": "Donegal",
                "description": "Donegal town sits at the mouth of the River Eske and Donegal Bay, which is overshadowed by the Bluestack Mountains.&nbsp; The centre of the town, known locally as the Diamond, is a hub for music, poetic and cultural gatherings in the area. There is evidence for settlements around the town dating back to prehistoric times including the remains of round forts and other earth works.",
                "quickFilterApplicableId": 3,
                "id": 357
            },
            {
                "name": "Perthshire",
                "description": "Perthshire was traditionally known as the \"big county\" and had a wide variety of landscapes, from the rich agricultural straths in the east, to the high mountains of the southern Highlands.",
                "quickFilterApplicableId": 3,
                "id": 358
            },
            {
                "name": "Isle of Mull",
                "quickFilterApplicableId": 3,
                "id": 359
            },
            {
                "name": "Silverstone",
                "quickFilterApplicableId": 3,
                "id": 360
            },
            {
                "name": "Spa",
                "quickFilterApplicableId": 3,
                "id": 361
            },
            {
                "name": "Douro",
                "quickFilterApplicableId": 3,
                "id": 362
            },
            {
                "name": "Shetland Islands",
                "quickFilterApplicableId": 3,
                "id": 363
            },
            {
                "name": "Tenerife",
                "quickFilterApplicableId": 3,
                "id": 364
            },
            {
                "name": "Corsica",
                "quickFilterApplicableId": 3,
                "id": 365
            },
            {
                "name": "Azores",
                "quickFilterApplicableId": 3,
                "id": 366
            },
            {
                "name": "Sao Miguel Island",
                "quickFilterApplicableId": 3,
                "id": 367
            },
            {
                "name": "Terceira Island",
                "quickFilterApplicableId": 3,
                "id": 368
            },
            {
                "name": "Channel Islands",
                "quickFilterApplicableId": 3,
                "id": 369
            },
            {
                "name": "Ayrshire",
                "quickFilterApplicableId": 3,
                "id": 370
            },
            {
                "name": "Menorca",
                "quickFilterApplicableId": 3,
                "id": 371
            },
            {
                "name": "Alentejo",
                "quickFilterApplicableId": 3,
                "id": 372
            },
            {
                "name": "Toulon",
                "quickFilterApplicableId": 3,
                "id": 373
            },
            {
                "name": "Woodstock",
                "quickFilterApplicableId": 3,
                "id": 374
            },
            {
                "name": "Courchevel",
                "quickFilterApplicableId": 3,
                "id": 375
            },
            {
                "name": "Madeira",
                "quickFilterApplicableId": 3,
                "id": 376
            },
            {
                "name": "Westmeath",
                "quickFilterApplicableId": 3,
                "id": 377
            },
            {
                "name": "Ultraluxe England",
                "quickFilterApplicableId": 3,
                "id": 378
            },
            {
                "name": "Golf Ireland",
                "quickFilterApplicableId": 3,
                "id": 379
            },
            {
                "name": "Golf Scotland",
                "quickFilterApplicableId": 3,
                "id": 380
            },
            {
                "name": "Ultraluxe France",
                "quickFilterApplicableId": 3,
                "id": 381
            },
            {
                "name": "Ultraluxe Switzerland",
                "quickFilterApplicableId": 3,
                "id": 382
            },
            {
                "name": "Ultraluxe U.K.",
                "quickFilterApplicableId": 3,
                "id": 383
            },
            {
                "name": "Suffolk",
                "quickFilterApplicableId": 3,
                "id": 384
            },
            {
                "name": "Ski France",
                "quickFilterApplicableId": 3,
                "id": 1109
            },
            {
                "name": "Ultraluxe Spain",
                "quickFilterApplicableId": 3,
                "id": 1118
            },
            {
                "name": "Ancestry Ireland",
                "quickFilterApplicableId": 3,
                "id": 1133
            },
            {
                "name": "Ancestry England",
                "quickFilterApplicableId": 3,
                "id": 1137
            },
            {
                "name": "Ancestry Scotland",
                "quickFilterApplicableId": 3,
                "id": 1138
            }
        ]
    },
    {
        "continent": "Global",
        "id": 11,
        "countries": [
            {
                "name": "Global",
                "quickFilterApplicableId": 3,
                "id": 1086
            },
            {
                "name": "Global Country",
                "quickFilterApplicableId": 3,
                "id": 1087
            }
        ]
    },
    {
        "continent": "UltraLuxe - Tours",
        "id": 12,
        "countries": []
    },
    {
        "continent": "Latin America",
        "id": 13,
        "countries": [
            {
                "name": "Costa Rica",
                "description": "Costa Rica is the most visited nation in the Central American region, and is renowned for its rain forest reserves. While the country has only about 0.1% of the world's landmass, it contains 5% of the world's biodiversity. The most notable parks are; Corcovado National Park, Tortuguero National Park, and the Monteverde Cloud Forest Reserve. The capitol of San Jose is well serviced with international flights. Most itineraries include time at one of the country's fine ocean beaches. ",
                "quickFilterApplicableId": 3,
                "id": 385
            },
            {
                "name": "Panama",
                "description": "Panama is the southernmost country of Central America. Situated on an isthmus, it connects the north and south part of America. It is bordered by Costa Rica to the north-west and Colombia to the south-east. Panama enjoys a rich Pre-Columbian heritage of native populations whose presence stretched back over 11,000 years. The country is best known for the US-built Panama Canal that was opened in 1914, and turned over to Panama in 1999. Small and amazingly diverse, Panama makes it possible for a traveler to visit not only two different oceans in one day, but be able to combine in less than a week a diversified natural experience (white sand beaches, cloud or rain forest, mountains or valleys) with a wide range of cultural experiences (seven Indian tribes, Afroantillian and Spanish Colonial culture, several historic monuments and a 300 year old World Heritage Site called Casco Antiguo (often referred as Casco Viejo, Panama Viejo, San Felipe or Catedral).",
                "quickFilterApplicableId": 3,
                "id": 386
            },
            {
                "name": "Ecuador & Galapagos",
                "description": "Galápagos Islands are an archipelago of volcanic islands distributed around the equator in the Pacific Ocean, 972 km west of continental Ecuador. It is a UNESCO World Heritage site. The principal language on the islands is Spanish. The islands have a population of around 40,000, which is a 40-fold expansion in 50 years. The islands are geologically young and famed for their vast number of endemic species, which were studied by Charles Darwin during the voyage of the Beagle. Visitors typically fly in from Quito or Guayaquil, Ecuador, and take a 3, 4, or 7 day cruise through the islands.  There are almost no hotels, and guests live aboard their cruise ship.  Day excursions on the islands are carefully controlled in designated pathways, and accompanied by certified naturalists. There are a variety of budget options from value, premium, luxury, and super-luxury chartered yachts.     <b> For a savings of more than $500 per person on your custom Galapagos tour, ask about our free flight deal from Quito to the Galapagos (select departures only, based on availability)</b> ",
                "quickFilterApplicableId": 3,
                "id": 387
            },
            {
                "name": "Peru",
                "description": "Peru is a country in western South America. It is bordered on the north by Ecuador and Colombia, on the east by Brazil, on the southeast by Bolivia, on the south by Chile, and on the west by the Pacific Ocean. Peruvian territory was home to the Norte Chico civilization, one of the oldest in the world, and to the Inca Empire, the largest state in Pre-Columbian America. The Spanish Empire conquered the region in the 16th century and established a Viceroyalty, which included most of its South American colonies. After achieving independence in 1821, Peru became a representative democratic republic.&nbsp;The&nbsp;geography varies from the arid plains of the Pacific coast to the peaks of the Andes mountains and the tropical forests of the Amazon Basin. Tourism is centered on the famous Inca city of Machu Picchu and nearby Cusco. Lake Titicaca is the world's highest navigable lake, and features floating reed&nbsp;islands. Arequipa's white architecture&nbsp;and Colca Canyon, deepest in the world, are also attractions. Amazon cruises and jungle lodges can be found in Manu and Iquitos. And Lima, the capital, has a well preserved Old City that is worth an afternoon.",
                "quickFilterApplicableId": 3,
                "id": 388
            },
            {
                "name": "Honduras",
                "description": "Honduras is a democratic republic in Central America. It was formerly known as Spanish Honduras to differentiate it from <em>British Honduras</em> (now Belize). Archaeologists have demonstrated that Honduras had a rich, multi-ethnic prehistory. An important part of that prehistory was the Mayan presence around the city of Copán in western Honduras, near the Guatemalan border. A major Mayan city flourished during the classic period (150-900) in that area. It has many carved inscriptions and stelae. In the northeastern region of La Mosquitia lies the Río Plátano Biosphere Reserve, a lowland rainforest which is home to a great diversity of life. The reserve was added to the UNESCO World Heritage Sites List in 1982. Honduras has rain forests, cloud forests (which can rise up to nearly three thousand meters above sea level), mangroves, savannas and mountain ranges with pine and oak trees, and the Mesoamerican Barrier Reef System. In the Bay Islands there are bottlenose dolphins, manta rays, parrot fish, schools of blue tang and whale shark.",
                "quickFilterApplicableId": 3,
                "id": 389
            },
            {
                "name": "Belize",
                "description": "Belize (formerly British Honduras), is a country in Central America, bordered to the south and west by Guatemala, to the north by Mexico, and to the east by the Caribbean Sea.. It gained its independence from the British Empire in 1981. It is the only country in Central America where English is an official language. A combination of natural factors have made tourism a growing industry. Warm climate, excellent Mayan ruins, the Belize Barrier Reef (second longest in the world), 127 offshore Cayes (islands), excellent fishing, safe waters for boating, scuba diving, and snorkeling, numerous rivers for rafting, and kayaking, various jungle and wildlife reserves of fauna and flora, for hiking, bird watching, and helicopter touring, as well the largest cave system in Central America.",
                "quickFilterApplicableId": 3,
                "id": 390
            },
            {
                "name": "Guatemala",
                "description": "Guatemala is a country in Central America bordered by Mexico to the north and the Pacific Ocean to the southwest. A representative democracy, its capital is Guatemala City. It has fascinating and extensive Mayan ruins. It's importance stretches back to 800BC with recently discovered pre-Colombian ruins that were unexpectedly large. El Mirador was by far the most populated city in pre-Columbian America. Both the El Tigre and Monos pyramids encompass a volume greater than 250,000 cubic meters. Mirador was the first politically organized state in America, with 26 cities all connected by Sacbeob (highways). These roads were several kilometers long, up to 40 meters wide, and two to four meters above the ground paved with stucco - clearly visible from the air. The height of the Maya civilization is represented by countless sites throughout Guatemala, although the largest concentration is in Petén. This period is characterized by heavy city-building, and the development of independent city-states. This lasted until around 900 AD, when the Classic Maya civilization collapsed.",
                "quickFilterApplicableId": 3,
                "id": 391
            },
            {
                "name": "Brazil",
                "description": "Brazil is the largest and most populous country in South America. It is the fifth largest country by geographical area, and the fifth most populous country in the world. Its population comprises the majority of the world's Portuguese speakers. Bounded by the Atlantic Ocean on the east, Brazil has a coastline of over 7,491 kilometers (4,655 mi). It has a border with almost every other South American country. Brazil was a colony of Portugal from 1500 until its independence in 1822. Initially independent as the Empire of Brazil, the country has been a republic since 1889. Brazil is the world's tenth largest economy. Brazil is also home to a diversity of wildlife, natural environments, and extensive natural resources in a variety of protected habitats. The capitol is Brasilia, however, most international flights go into Sao Paulo, the country's largest city. Top sights include Rio de Janeiro, Salvador de Bahia, Manaus, Iguazu Falls, and the Patanal.",
                "quickFilterApplicableId": 3,
                "id": 392
            },
            {
                "name": "Argentina",
                "description": "Argentina is the second largest country in South America. located between the Andes mountain range in the west and the Atlantic Ocean in the east. European explorers arrived in 1516. Military campaigns led by General José de San Martín between 1814 and 1817 made independence increasingly a reality. A wave of foreign investment and immigration from Europe after 1870 led to the development of modern agriculture and to a near-reinvention of Argentine society and the economy. The country was neutral during World War II. Political change led to the presidency of Juan Perón in 1946, who worked to empower the working class. Perón's wife, Eva Perón (better known as \"Evita\") played an important role as first lady. Following a transitional period in 2002 when there was a sharp devaluation in the peso, the country has regained its footing.  Argentina is a focus of increasing tourism centered in cosmopolitan Buenos Aires. Notable attractions include the Iguazu Falls, Mendoza vineyards, Bariloche mountain resorts, Patagonia glaciers and hiking, and Ushuaia on the tip of the continent.",
                "quickFilterApplicableId": 3,
                "id": 393
            },
            {
                "name": "Bolivia",
                "description": "Bolivia, named after Simón Bolívar, is a landlocked country in central South America. It is bordered by Brazil on the north and east, Paraguay and Argentina on the south, and Chile and Peru on the west. The western highlands of the country are situated in the Andes Mountains. The eastern lowlands include large sections of Amazonian rainforests and Chaco. Lake Titicaca is located on the border between Bolivia and Peru. The Salar de Uyuni, the world's largest salt flat, lies in the southwest corner of the country. Bolivia was once known as the treasure chest of the world. The Spanish conquered the area by 1533. Bolivian silver was an important source of revenue for the Spanish empire. The struggle for independence started in 1809, and by 1825 Bolivia was declared a republic. Occasional regional wars over the next century caused Bolivia to lose about half of its territory. Civil unrest has always been a challenge, with a sharp divide between the rich and poor. Despite having an embarrasement of natural resources, the country has struggled to get its economy going. The capitol and regional hub is La Paz.",
                "quickFilterApplicableId": 3,
                "id": 394
            },
            {
                "name": "Chile",
                "description": "Chile is a country in South America occupying a long and narrow coastal strip wedged between the Andes mountains and the Pacific Ocean, with a coastline that stretches over 6,435 kilometres. Chilean territory extends to the Pacific Ocean which includes the overseas territories of Juan Fernández Islands, the Sala y Gómez islands, the Desventuradas Islands and Easter Island located in Polynesia. Chile's unusual, ribbon-like shape, 4,300 km (2,672 mi) long and on average 175 km (109 mi) wide, has given it a hugely varied climate. Ranging from the world's driest desert, the Atacama in the north, a Mediterranean climate in the centre, to a snow-prone Alpine climate in the south, with glaciers, fjords and lakes. The relatively small central area dominates the country in terms of population and agricultural resources. This area also is the cultural and political center from which Chile expanded in the late 19th century. Although Chile declared its independence in 1810, decisive victory over the Spanish was not achieved until 1818. Currently, Chile is one of South America's most stable and prosperous nations.",
                "quickFilterApplicableId": 3,
                "id": 395
            },
            {
                "name": "Falkland Islands",
                "description": "<p>The Falkland Islands are an archipelago in the South Atlantic Ocean, located 300 miles (480 km) from the coast of Argentina, They consist of two main islands, East Falkland and West Falkland, together with 776 smaller islands. Stanley, on East Falkland, is the capital. The islands are a self-governing Overseas Territory of the United Kingdom, but have been the subject of a claim to sovereignty by Argentina since the re-establishment of British rule in 1833. In pursuit of this claim in 1982, the islands were invaded by Argentina, precipitating the two-month-long undeclared Falklands War between Argentina and the United Kingdom, which resulted in the defeat and withdrawal of Argentine forces. Since the war there has been strong economic growth in both fisheries and tourism. The inhabitants of the islands are full British citizens (since a 1983 Act) and under Argentine Law are eligible for Argentine citizenship. Many trace their origins on the islands to early 19th-century Scottish immigration. This islands are a popular cruise ship destination.",
                "quickFilterApplicableId": 3,
                "id": 396
            },
            {
                "name": "Uruguay",
                "description": "Uruguay is a country located in the southeastern part of South America. It is home to 3.46 million people, of whom 1.7 million live in the capital Montevideo and its metropolitan area. It is bordered by Brazil to the north, by Argentina on the other side of the Uruguay River to the south, and has coastline on the Atlantic Ocean. Montevideo was founded by the Spanish in the early 18th century as a military stronghold. Uruguay won its independence in 1825-1828 following a three-way struggle between Spain, Argentina and Brazil. It is a constitutional democracy, where the president fulfills the roles of both head of state and head of government. 94.6% of the population are of, at least partial, European descent. Uruguay is South America's most secular country, where there is no official religion, and in which church and state are separate. Tourism is focused on the beach resort of Punta Del Este, the historic downtown of Montevideo, and the charming town of Colonia. All are an easy ferry ride away from Buenos Aires.",
                "quickFilterApplicableId": 3,
                "id": 397
            },
            {
                "name": "Nicaragua",
                "description": "Nicaragua is a representative democratic republic and the largest state in Central America. The name 'Nicaragua' seems to have meant 'surrounded by water' in an older, indigenous language that mixed with Spanish. This could be either because of the two large freshwater lakes, Lake Nicaragua and Lake Managua, or because the country is bounded on the east and the west by oceans. The country is bordered by Honduras to the north and by Costa Rica to the south. The Pacific Ocean lies to the west of the country, while the Caribbean Sea lies to the east. ",
                "quickFilterApplicableId": 3,
                "id": 398
            },
            {
                "name": "Paraguay",
                "description": "Paraguay is one of the only two landlocked countries in South America (along with Bolivia). It lies on both banks of the Paraguay River and is bordered by Argentina to the south and southwest, Brazil to the east and northeast, and Bolivia to the northwest. Due to its central location in South America, the country is sometimes referred to as Corazón de América — Heart of America. Paraguay is a poor and unequal society. Various poverty estimates suggest that between one half to one third of the population is below the poverty line. ",
                "quickFilterApplicableId": 3,
                "id": 399
            },
            {
                "name": "El Salvador",
                "description": "El Salvador is a country in Central America and, geographically, is part of continental North America. It is bordered on the southwest by the Pacific Ocean, and lies between Guatemala and Honduras. El Salvador is a democratic country with a developing economy. Tourism facilities are not fully developed. The capital is San Salvador, accessible by El Salvador's International Airport at Comalapa. The U.S. Dollar is the primary currency in El Salvador and the economy is fully dollarized.  ",
                "quickFilterApplicableId": 3,
                "id": 400
            },
            {
                "name": "Colombia",
                "description": "Colombia is a country in north-western South America. Colombia has an area more than twice that of France, with the second largest population in South America. Colombia is very ethnically diverse, and the interaction between descendants of the original native inhabitants, Spanish colonists, African slaves and twentieth-century immigrants from Europe and the Middle East has produced a rich cultural heritage. This has also been influenced by Colombia's incredibly varied geography. The majority of the urban centres are located in the highlands of the Andes mountains, but Colombian territory also encompasses Amazon rainforest, tropical grassland and both Caribbean and Pacific coastlines. Ecologically, Colombia is one of the world's 17 megadiverse countries.",
                "quickFilterApplicableId": 3,
                "id": 401
            },
            {
                "name": "French Guiana",
                "description": "French Guiana is an overseas department of France, located on the northern coast of South America. Like the other overseas departments, French Guiana is one of the 26 regions of France, and is an integral part of the French Republic. Like metropolitan France, its currency is the euro. The prefecture is Cayenne. ",
                "quickFilterApplicableId": 3,
                "id": 402
            },
            {
                "name": "Guyana",
                "description": "Guyana (previously known as British Guiana), is the only state of the Commonwealth of Nations on mainland South America. On the northern coast of the continent, it is bordered to the east by Suriname, to the south and southwest by Brazil, to the west by Venezuela, and on the north by the North Atlantic Ocean. At 215,000 km2, it is the third smallest state on the mainland of South America (after Suriname and French Guiana). Its estimated population is approximately 860,000. It is one of the four non-Spanish-speaking territories on the continent, along with the states of Brazil (Portuguese) and Suriname (Dutch), and the French overseas region of French Guiana (French). Culturally, Guyana associates primarily with the English-speaking Caribbean states, such as Jamaica and Trinidad and Tobago.",
                "quickFilterApplicableId": 3,
                "id": 403
            },
            {
                "name": "Suriname",
                "description": "Suriname (formerly Netherlands Guyana) is a country in northern South America. Suriname is situated between French Guiana to the east and Guyana to the west. The southern border is shared with Brazil and the northern border is the Atlantic coast. Suriname is the smallest sovereign state in terms of area and population in South America, and has an estimated population of about 470,000 people. The country is the only Dutch-speaking region in the Western Hemisphere. The capital is Paramaribo. ",
                "quickFilterApplicableId": 3,
                "id": 404
            },
            {
                "name": "Venezuela",
                "description": "Venezuela is a country on the northern coast of South America. The country comprises a continental mainland and numerous islands located off the Venezuelan coastline in the Caribbean Sea. Its size is almost 920,000 km² with an estimated population of 28 million. Its capital is Caracas. A former Spanish colony, which has been an independent republic since 1821. Venezuela is known widely for its petroleum industry, the environmental diversity of its territory, and its natural features. It is considered to be among the world's 17 most biodiverse countries. The vast majority of Venezuelans live in the cities of the north, especially in the capital Caracas which is also the largest city. Other major cities include Maracaibo, Valencia, Maracay, Barquisimeto and Ciudad Guayana. ",
                "quickFilterApplicableId": 3,
                "id": 405
            },
            {
                "name": "Patagonia",
                "description": "Patagonia is a geographic region containing the southernmost portion of South America. Located in Argentina and Chile, it comprises the southernmost portion of the Andes mountains to the west and south, and plateaux and low plains to the east. Patagonia offers all the dramatic landscape one would expect from the world's ultimate land's end. Here the South American continent falls away in a dazzling explosion of islands, glaciers, icebergs and mountains. It is truly one of mother nature's grand finales.",
                "quickFilterApplicableId": 3,
                "id": 406
            },
            {
                "name": "Arenal",
                "description": "<P>Arenal contains an active Volcano, and also the only dwarf cloudforest in Costa Rica. The crater of the volcano is 1.5km (1-mile) wide and contains a hot-water lake which changes color from turquoise to green to grey. It is also a whitewater rafting center with routes on the Rio Toro and Rio Sarapiqui.</P>",
                "quickFilterApplicableId": 3,
                "id": 407
            },
            {
                "name": "Guanacaste",
                "description": "Guanacaste province is located on the northwestern part of the country, and boasts hundreds of beautiful beaches and several national parks. Some of the top sights; Rincón de la Vieja, Palo Verde, Santa Rosa, Guanacaste Park, Arenal Volcano, Lomas Barbudal, and Tempisque River. Activities on offer include; canopy tours, horseback riding, bird watching, hikes, fishing, diving, surfing, rafting and river floating.   ",
                "quickFilterApplicableId": 3,
                "id": 408
            },
            {
                "name": "Costa Ballena",
                "description": "An overarching calm and unexploited natural beauty are what make Costa Ballena so rich. Because communication with the region has only recently become acceptable, large tracts of forests still run up to ecologically sound beaches. At the same time, towns like Dominical, Uvita, Bahía and Ojochal have developed local networks of volunteers and quality services that offer just enough infrastructure for tourists to discover the region’s warm local character.",
                "quickFilterApplicableId": 3,
                "id": 409
            },
            {
                "name": "Osa Peninsula",
                "description": "The Osa Peninsula is home to at least half of all species living in Costa Rica. The main city on the Peninsula is Puerto Jimenez, which has its own airport and provides access to Corcovado National Park as well as the coastal villages of Cabo Matapalo and Carate.",
                "quickFilterApplicableId": 3,
                "id": 410
            },
            {
                "name": "Bocas del Toro",
                "description": "The Bocas del Toro province, in the Panama Caribbean, includes an archipelago (of the same name) consisting of seven large islands and hundreds of smaller ones. Many of the islands lie in the Laguna de Chiriqui, which is particularly popular with diving enthusiasts. Parts of the province are located in two national parks: the International Friendship Park, administered jointly by Panama and Costa Rica; and the Bastimientos Island Marine Park, a marine nature reserve located on one of the islands. ",
                "quickFilterApplicableId": 3,
                "id": 411
            },
            {
                "name": "Colca Canyon",
                "description": "Colca Canyon is a canyon of the Colca River in southern Peru. It is located about 100 miles (160 kilometers) northwest of Arequipa. It is more than twice as deep as the Grand Canyon in the United States. However, the canyon's walls are not as vertical as those of the Grand Canyon. The Cotahuasi Canyon to the northwest is a deeper canyon at 11,488 ft (3,501 m). The Colca Valley is a colorful Andean valley with towns founded in Spanish Colonial times and formerly inhabited by the Collaguas and the Cabanas. The local people still maintain ancestral traditions and continue to cultivate the pre-Inca stepped terraces.",
                "quickFilterApplicableId": 3,
                "id": 412
            },
            {
                "name": "Sacred Valley",
                "description": "The Sacred Valley of the Incas is a valley in the Andes of Peru, close to Cusco. It is fed by rivers which descend through adjoining valleys and gorges, and contains numerous archaeological remains and villages. The valley was appreciated by the Incas due to its special geographical and climatic qualities. It was one of the empire's main points for the extraction of natural wealth, and the best place for maize production in Peru. The Sacred Valley is generally understood to include everything between Písac and Ollantaytambo, parallel to the Urubamba River, or Vilcanota River or Wilcamayu, as this Sacred river is called when passing through the valley.  ",
                "quickFilterApplicableId": 3,
                "id": 413
            },
            {
                "name": "Ambergris Caye",
                "description": "Ambergris Caye, with its many beaches and the fishing village of San Pedro, is the most popular tourist destination. Along with the other Cayes, it is a paradise for divers with access to one of the most unspoilt coral reefs in the world; Hoi Chan Marine Reserve is a popular dive site where southern stingray and nurse sharks can be observed in shark ray alley. Situated 58km (36 miles) north of Belize City, it is accessible by daily scheduled air flights and boat transfers. ",
                "quickFilterApplicableId": 3,
                "id": 414
            },
            {
                "name": "Cayo District",
                "description": "The Cayo District boasts several Mayan sites including El Pilar and the magnificent Xunantunich with its 1500-year-old El Castillo, the second-tallest building in Belize. The canaa of the Caracol Mayan site in Cayo is the tallest Mayan building in Belize. This site has been claimed to rival such other famous sites as Tikal in neighboring Guatemala.",
                "quickFilterApplicableId": 3,
                "id": 415
            },
            {
                "name": "Salta",
                "description": "Salta is in northwestern Argentina in the foothills of the Andes mountains. Nicknamed Salta la Linda (\"Salta the Beautiful\"), it has become popular for its old, colonial architecture and the gorgeous scenery. Attractions in the city proper include the 18th century Cabildo, the neo-classical style Cathedral, and the July 9th central square. The city's meuseums exhibit a wide range of artifacts and art work from the native civilations that flourished in the area, as well as from the 16th century Spanish conquest and the colonial and post-colonial periods. ",
                "quickFilterApplicableId": 3,
                "id": 416
            },
            {
                "name": "Cachapoal Valley",
                "description": "The Cachapoal Valley is one of Chile's popular wine regions that produces wines of exceptional quality and the character. This exclusive valley shows the powerful influence of the Andes Mountains and the magnificent richness of its terroir: the towering peaks make their presence felt as their slopes drop gracefully to the valley floor, marking temperature variations that constitute a strong factor in the unique wines: a special elegance, soft tannins, and fresh, aromatic grapes with a perfect balance between acidity and sweetness. The area is ideal for wine lovers with impressive wineries and scenic country landscapes.<BR>",
                "quickFilterApplicableId": 3,
                "id": 417
            },
            {
                "name": "Amazon",
                "description": "The Amazon Rainforest is a moist broadleaf forest in the Amazon Basin of South America that occupies some 5.5 million square kilometers (1.4 billion acres), across nine nations.  The Amazon represents over half of the planet's remaining rainforests and comprises the largest and most species-rich tract of tropical rainforest in the world.  ",
                "quickFilterApplicableId": 3,
                "id": 418
            },
            {
                "name": "Toledo Disctrict",
                "description": "Toledo District is the southernmost district in Belize, and Punta Gorda the District capital. Although the least developed region in the country, it features some of the most pristine rainforests, extensive cave networks, coastal lowland plains, and offshore cays. Toledo is home to a wide range of cultures -- from Mopan and Kekchi Maya, to Creole, the Garifuna, East Indians, Mennonites, Mestizos, and descendants of US Confederate settlers.",
                "quickFilterApplicableId": 3,
                "id": 419
            },
            {
                "name": "Orinoco Delta",
                "quickFilterApplicableId": 3,
                "id": 420
            },
            {
                "name": "Mochima National Park",
                "quickFilterApplicableId": 3,
                "id": 421
            },
            {
                "name": "Leticia, Amazonas",
                "quickFilterApplicableId": 3,
                "id": 422
            },
            {
                "name": "Belize Cayes",
                "quickFilterApplicableId": 3,
                "id": 423
            },
            {
                "name": "Stan Creek & South Coast",
                "quickFilterApplicableId": 3,
                "id": 424
            },
            {
                "name": "Outer Atolls",
                "quickFilterApplicableId": 3,
                "id": 425
            },
            {
                "name": "Santander",
                "quickFilterApplicableId": 3,
                "id": 426
            },
            {
                "name": "Guanacaste Zone 1",
                "quickFilterApplicableId": 3,
                "id": 427
            },
            {
                "name": "Guanacaste Zone 2",
                "quickFilterApplicableId": 3,
                "id": 428
            },
            {
                "name": "Guanacaste Zone 3",
                "quickFilterApplicableId": 3,
                "id": 429
            },
            {
                "name": "South America Cruise",
                "quickFilterApplicableId": 3,
                "id": 430
            },
            {
                "name": "Patagonia Cruise",
                "quickFilterApplicableId": 3,
                "id": 432
            },
            {
                "name": "Puerto Rico",
                "description": "Puerto Rico is a self-governing territory of the United States located in the northeastern Caribbean, east of the Dominican Republic and west of the Virgin Islands. Puerto Rico is composed of an archipelago that includes the main island of Puerto Rico and a number of smaller islands and keys, the largest of which are Vieques, Culebra, and Mona. The main island of Puerto Rico is the smallest by land area and second smallest by population among the four Greater Antilles (Cuba, Hispaniola, Jamaica, and Puerto Rico). The capital and largest city is San Juan.",
                "quickFilterApplicableId": 3,
                "id": 442
            },
            {
                "name": "Anguilla",
                "description": "Anguilla is a British overseas territory in the Caribbean, one of the most northerly of the Leeward Islands in the Lesser Antilles. It consists of the main island of Anguilla itself, approximately 26 km (16 miles) long by 5 km (3 miles) wide at its widest point, together with a number of much smaller islands and cays with no permanent population. The island's capital is The Valley. The total land area of the territory is 102 km² (39.4 square miles), with a population of approximately 13,500. ",
                "quickFilterApplicableId": 3,
                "id": 444
            },
            {
                "name": "Antigua",
                "description": "Antigua and Barbuda are two Caribbean islands, that form a country that lies between the Caribbean Sea and the North Atlantic Ocean, east-southeast of Puerto Rico, off the coast of South America. With few other natural resources, the islands have a pleasant climate and a multitude of white sand beaches that fosters tourism. Antigua and Barbuda is a dual-island nation known for its beaches, and is a favorite destination for yachtsmen. Tourist facilities are widely available. English is the primary language. Banking facilities and ATMs are available throughout the island. ",
                "quickFilterApplicableId": 3,
                "id": 445
            },
            {
                "name": "Aruba",
                "description": "Aruba is a Caribbean island 15 miles north of the coast of Venezuela. The island is an autonomous dependency of the Kingdom of the Netherlands. This flat, riverless island is renowned for its white sand beaches. Its tropical climate is moderated by constant trade winds from the Atlantic Ocean. The temperature is almost constant at about 27 degrees Celsius (81 degrees Fahrenheit). Since it is outside of the hurricane belt, visitors can expect predictable balmy weather. ",
                "quickFilterApplicableId": 3,
                "id": 446
            },
            {
                "name": "The Bahamas",
                "description": "The Bahamas, officially the Commonwealth of The Bahamas, is an independent, sovereign, English-speaking country consisting of two thousand cays and seven hundred islands that form an archipelago. It is located in the Atlantic Ocean southeast of the United States. The capital is Nassau. It remains a Commonwealth realm. ",
                "quickFilterApplicableId": 3,
                "id": 447
            },
            {
                "name": "Barbados",
                "description": "Barbados is an island in the Caribbean, northeast of Venezuela. Located at roughly 13° North of the equator and 59° West of the prime meridian, it is considered a part of the Lesser Antilles. Its closest island neighbours are Saint Vincent & the Grenadines and Saint Lucia to the west. To the south lies Trinidad and Tobago and the South American mainland. Barbados's total land area is about 430 square kilometres (166 square miles), and is primarily low-lying, with some higher regions in the country's interior. The highest point in Barbados is Mount Hillaby in the parish of Saint Andrew. The island's climate is tropical, with constant trade winds off the Atlantic Ocean serving to keep temperatures mild. The island is portrayed as the little England of the Caribbean because of its long association as a British colony. ",
                "quickFilterApplicableId": 3,
                "id": 448
            },
            {
                "name": "Bermuda",
                "description": "Bermuda is a self-governing British overseas territory in the Atlantic Ocean north of the Caribbean, off the coast of North America east of North Carolina. It is the oldest and most populous remaining British overseas territory, settled by England a century before the Acts of Union created the United Kingdom of Great Britain. Bermuda's first capital, St. George's, was settled in 1612 and is the oldest continuously inhabited English town in the Americas. Although commonly referred to in the singular, the territory consists of approximately 138 islands, with a total area of 53.3 square kilometres (20.6 sq mi). Bermuda has a highly affluent economy, with finance as its largest sector followed by tourism, giving it the world's highest GDP per capita in 2005. It has a subtropical climate, beaches with pink sand, and is surrounded by cerulean blue ocean waters.",
                "quickFilterApplicableId": 3,
                "id": 449
            },
            {
                "name": "Cayman Islands",
                "description": "The Cayman Islands are an island group in the Caribbean Sea, ninety miles south of Cuba. The territory comprises the islands of Grand Cayman, Cayman Brac, and Little Cayman. The territory is a major offshore financial centre in the Caribbean. The outstanding coral reefs and outstandingly clear waters have made this island group a favorite destination of divers. Great beaches and fine restaurants and resorts make it an excellent tourist destination as well. ",
                "quickFilterApplicableId": 3,
                "id": 450
            },
            {
                "name": "Cuba",
                "description": "Cuba is the largest Caribbean island, between the Caribbean Sea and the North Atlantic Ocean. It lies 145 km (90 miles) south of Key West, Florida, between the Cayman Islands and the Bahamas, to the west of Haiti, and northwest of Jamaica. Before the 1959 Revolution, Cuba was a popular tourist destination for United States citizens. Many Americans had beach homes during the summer. Since the Revolution, Cuba has been subjected to a trade and travel embargo by the United States. It remains a popular tourist destination for Canadians and Europeans. Havana is the capital city.&nbsp;We do not offer packages for Cuba.",
                "quickFilterApplicableId": 3,
                "id": 451
            },
            {
                "name": "Dominica",
                "description": "Dominica borders the Caribbean Sea and the North Atlantic Ocean, about one-half of the way from Puerto Rico to Trinidad and Tobago. It is often known as \"The Nature Island of the Caribbean\" due to its spectacular, lush, and varied flora and fauna, which are protected by an extensive natural park system. The most mountainous island of the Lesser Antilles, its volcanic peaks are cones of lava craters and include Boiling Lake, the second-largest, thermally active lake in the world. ",
                "quickFilterApplicableId": 3,
                "id": 452
            },
            {
                "name": "Dominican Republic",
                "description": "The Dominican Republic is a nation on the island of Hispaniola, part of the Greater Antilles archipelago in the Caribbean region. The western third of the island Hispaniola is occupied by the nation of Haiti. Santo Domingo, the capital of the Dominican Republic,  is the site of the first permanent European settlement in the Americas. For most of its independent history, the nation experienced political turmoil and unrest. However, since 1961 the country has moved toward a liberal economic model, which has made it the largest economy in the region.",
                "quickFilterApplicableId": 3,
                "id": 453
            },
            {
                "name": "Guadeloupe",
                "description": "Guadeloupe is an island group or archipelago located in the eastern Caribbean Sea with a land area of 1,628 square kilometres (629 sq. mi). It is an overseas department of France.  As part of France, Guadeloupe is part of the European Union; hence, as for most EU countries, its currency is the euro. Guadeloupe mixes the best of France – a fully modern infrastructure and fantastic food – with a local culture that people here are proud of and want to share. Guadeloupe’s two main islands look like the wings of a butterfly and are joined together by a mangrove swamp.",
                "quickFilterApplicableId": 3,
                "id": 454
            },
            {
                "name": "Haiti",
                "description": "Haiti is a Caribbean country that occupies the western one-third of the island of Hispaniola. The eastern two-thirds of Hispaniola is occupied by the Dominican Republic. The North Atlantic Ocean lies to the north, while the Caribbean Sea lies to the south. Haiti is a country with a troubled past, and its future still remains uncertain. Decades of poverty, environmental degradation, violence, instability and dictatorship have left it as the poorest nation in the western hemisphere. ",
                "quickFilterApplicableId": 3,
                "id": 455
            },
            {
                "name": "Jamaica",
                "description": "Jamaica is an island nation of the Greater Antilles, 234 kilometres (145 mi) in length and as much as 80 kilometres (50 mi) in width situated in the Caribbean Sea. It is about 145 kilometres (90 mi) south of Cuba, and 190 kilometres (120 mi) west of the island of Hispaniola, on which Haiti and the Dominican Republic are situated. Its indigenous Arawakan-speaking Taíno inhabitants named the island Xaymaca, meaning the \"Land of Wood and Water\", or the \"Land of Springs\". Formerly a Spanish possession known as Santiago, it later became the British Crown colony of Jamaica. It is the third most populous anglophone country in North America, after the United States and Canada. It remains a Commonwealth realm.",
                "quickFilterApplicableId": 3,
                "id": 456
            },
            {
                "name": "Martinique",
                "description": "Martinique is a Caribbean island that is an overseas department of France in the Caribbean Sea. The inhabitants of Martinique are French citizens with full political and legal rights. The island is dominated by Mount Pelee. In the South of the island, there are many beautiful beaches with a lot of tourists. In the North, the rain forests and the black sand beaches are worth seeing. The interior of the island is mountainous. ",
                "quickFilterApplicableId": 3,
                "id": 457
            },
            {
                "name": "Montserrat",
                "description": "Montserrat is British overseas territory located in the Leeward Islands, part of the chain of islands called the Lesser Antilles in the Caribbean Sea. It measures approximately 16 km (10 miles) long and 11 km (7 miles) wide, giving 40 kilometres (25 mi) of coastline. Its capital city of Plymouth was destroyed and two-thirds of the island's population forced to flee abroad by an eruption of the previously dormant Soufriere Hills volcano that began on July 18, 1995. The eruption continues today on a much reduced scale. This zone includes St. George's Hill which provided visitors with a spectacular view of the volcano and the destruction it has wrought upon the capital. A new airport at Gerald's in the northern part of the island opened in 2005. The village of Brades currently serves as the de facto centre of government.",
                "quickFilterApplicableId": 3,
                "id": 458
            },
            {
                "name": "St. Kitts & Nevis",
                "description": "The Federation of Saint Kitts and Nevis, located in the Leeward Islands, is a federal two-island nation in the West Indies. It is the smallest nation in the Americas, in both area and population. The capital city is on the larger island of Saint Kitts. The smaller state of Nevis lies about 2 miles (3 km) southeast of Saint Kitts, across a shallow channel called \"The Narrows\". Lush and luxuriant, the exotic tropical island nation of St. Kitts and Nevis is a romantic paradise. St. Kitts' wonderful beaches remain relatively crowd-free, and nature lovers delight in seeing lava formations, tropical forest and lagoons and underwater marvels while snorkeling or diving. Among more than 200 historical sites, former plantation homes now offer elegant accommodation. Eco-rambles, bio-tours and climbing are Nevis attractions. Rent cars or mopeds on-island and catch ferries between the two.",
                "quickFilterApplicableId": 3,
                "id": 459
            },
            {
                "name": "St. Lucia",
                "description": "Saint Lucia is a British Commonwealth country that is an island in the Caribbean, off the coast of Central America. It lies between the Caribbean Sea and North Atlantic Ocean, north of Trinidad and Tobago. The twin Pitons (Gros Piton and Petit Piton) are striking cone-shaped peaks south of Soufriere that are one of the scenic natural highlights of the Caribbean. St. Lucia is the sort of island that travellers to the Caribbean dream about--a small, lush tropical gem that is still relatively unknown. St. Lucia is only 27 miles long and 14 miles wide. The Atlantic Ocean kisses its eastern shore, while the beaches of the west coast owe their beauty to the calm Caribbean Sea.",
                "quickFilterApplicableId": 3,
                "id": 460
            },
            {
                "name": "Saint Vincent and the Grenadines",
                "description": "Saint Vincent and the Grenadines is an island nation in the Lesser Antilles. Its 389-square-kilometre (150 sq mi) territory consists of the main island of Saint Vincent and the northern two-thirds of the Grenadines. The country has a French and British colonial history and is now part of the Commonwealth of Nations. The recent filming of the Pirates of the Caribbean movies on the island has also helped to increase tourism and expose the country to the wider world. A further boost is expected to be provided by the new international airport which is currently under construction. ",
                "quickFilterApplicableId": 3,
                "id": 461
            },
            {
                "name": "Trinidad and Tobago",
                "description": "The Republic of Trinidad and Tobago is an archipelagic state in the southern Caribbean, lying in the Lesser Antilles. The country covers an area of 5,128 square kilometers (1,979 sq mi) and consists of two main islands, Trinidad and Tobago, and numerous smaller landforms. Trinidad is the larger and more populous of the main islands; Tobago is much smaller, comprising about 6% of the total area and 4% of the population. The nation lies outside the hurricane belt. Officially Trinidadians or Tobagonians, the people from Trinidad and Tobago are often informally referred to as Trinbagonians or Trinis (for Trinidadians). Unlike most of the English-speaking Caribbean, Trinidad and Tobago's economy is primarily industrial-based, with an emphasis on petroleum and petrochemicals. Although Tobago is often referred to as \"the jewel of the Caribbean\" and contains a few resort areas, Trinidad and Tobago as a whole does not rely heavily on tourism as a source of revenue.",
                "quickFilterApplicableId": 3,
                "id": 462
            },
            {
                "name": "U.S. Virgin Islands",
                "description": "The U.S. Virgin Islands is a territory of the United States of America between the Caribbean Sea and the North Atlantic Ocean. It was formerly known as the Danish West Indies. Together with the British Virgin Islands, to the northeast, the territory forms the Virgin Islands archipelago. The islands natural resources are sun, sand, sea, and surf. ",
                "quickFilterApplicableId": 3,
                "id": 463
            },
            {
                "name": "Saint Barts",
                "description": "St. Barth has long been considered a playground of the rich and famous and is known for its beautiful pristine beaches, gourmet dining in chic bistros and high-end designer shopping. Villa vacations are extremely popular and there are hundreds of villas terraced into the hillsides throughout the island as well as many beachfront locations. Villas here can range from one-bedroom bungalows to large luxurious homes.     ",
                "quickFilterApplicableId": 3,
                "id": 464
            },
            {
                "name": "Saint Martin",
                "description": "Saint Martin, is an overseas collectivity of France located in the Caribbean. It came into being on 22 February 2007, encompassing the northern parts of the island of Saint Martin and neighbouring islets, the largest of which is Île Tintamarre. The smallest island in the world ever to have been partitioned between two different nations, St. Martin/St. Maarten has been shared by the French and the Dutch in a spirit of neighborly cooperation and mutual friendship for almost 350 years. The border is almost imperceptible. and people cross back and forth without ever realizing they are entering a new country.",
                "quickFilterApplicableId": 3,
                "id": 465
            },
            {
                "name": "Arenal",
                "description": "<P>Arenal contains an active Volcano, and also the only dwarf cloudforest in Costa Rica. The crater of the volcano is 1.5km (1-mile) wide and contains a hot-water lake which changes color from turquoise to green to grey. It is also a whitewater rafting center with routes on the Rio Toro and Rio Sarapiqui.</P>",
                "quickFilterApplicableId": 3,
                "id": 466
            },
            {
                "name": "Guanacaste",
                "description": "Guanacaste province is located on the northwestern part of the country, and boasts hundreds of beautiful beaches and several national parks. Some of the top sights; Rincón de la Vieja, Palo Verde, Santa Rosa, Guanacaste Park, Arenal Volcano, Lomas Barbudal, and Tempisque River. Activities on offer include; canopy tours, horseback riding, bird watching, hikes, fishing, diving, surfing, rafting and river floating.   ",
                "quickFilterApplicableId": 3,
                "id": 467
            },
            {
                "name": "Costa Ballena",
                "description": "An overarching calm and unexploited natural beauty are what make Costa Ballena so rich. Because communication with the region has only recently become acceptable, large tracts of forests still run up to ecologically sound beaches. At the same time, towns like Dominical, Uvita, Bahía and Ojochal have developed local networks of volunteers and quality services that offer just enough infrastructure for tourists to discover the region’s warm local character.",
                "quickFilterApplicableId": 3,
                "id": 468
            },
            {
                "name": "Osa Peninsula",
                "description": "The Osa Peninsula is home to at least half of all species living in Costa Rica. The main city on the Peninsula is Puerto Jimenez, which has its own airport and provides access to Corcovado National Park as well as the coastal villages of Cabo Matapalo and Carate.",
                "quickFilterApplicableId": 3,
                "id": 469
            },
            {
                "name": "Bocas del Toro",
                "description": "The Bocas del Toro province, in the Panama Caribbean, includes an archipelago (of the same name) consisting of seven large islands and hundreds of smaller ones. Many of the islands lie in the Laguna de Chiriqui, which is particularly popular with diving enthusiasts. Parts of the province are located in two national parks: the International Friendship Park, administered jointly by Panama and Costa Rica; and the Bastimientos Island Marine Park, a marine nature reserve located on one of the islands. ",
                "quickFilterApplicableId": 3,
                "id": 470
            },
            {
                "name": "Ambergris Caye",
                "description": "Ambergris Caye, with its many beaches and the fishing village of San Pedro, is the most popular tourist destination. Along with the other Cayes, it is a paradise for divers with access to one of the most unspoilt coral reefs in the world; Hoi Chan Marine Reserve is a popular dive site where southern stingray and nurse sharks can be observed in shark ray alley. Situated 58km (36 miles) north of Belize City, it is accessible by daily scheduled air flights and boat transfers. ",
                "quickFilterApplicableId": 3,
                "id": 471
            },
            {
                "name": "Cayo District",
                "description": "The Cayo District boasts several Mayan sites including El Pilar and the magnificent Xunantunich with its 1500-year-old El Castillo, the second-tallest building in Belize. The canaa of the Caracol Mayan site in Cayo is the tallest Mayan building in Belize. This site has been claimed to rival such other famous sites as Tikal in neighboring Guatemala.",
                "quickFilterApplicableId": 3,
                "id": 472
            },
            {
                "name": "Abacos Islands",
                "description": "The Abaco Islands lie in the northern Bahamas and comprise the main islands of Great Abaco and Little Abaco, together with the smaller Wood Cay, Elbow Cay, Lubbers Quarters Cay, Green Turtle Cay, Great Guana Cay, Castaway Cay, Man-o-War Cay, Stranger's Cay, Umbrella Cay, Great Stirrup Cay, Walker's Cay, Moore's Island, and Sandy Point. Administratively, the Abaco Islands constitute five of the 31 Districts of the Bahamas: North Abaco, Central Abaco, South Abaco, Moore's Island, and Hope Town. Towns in the islands include Marsh Harbour, Hope Town, Treasure Cay, Coopers Town, and Cornishtown.",
                "quickFilterApplicableId": 3,
                "id": 473
            },
            {
                "name": "Curacao",
                "description": "The lively capital of Curacao, Willemstad, is a welcoming, upbeat destination with two distinct historic districts divided by the lovely St. Anna Bay. Punda, site of neat, narrow streets, is crammed with shops and museums. Otrobanda, or \"The Other Side,\" is a maze of twisting residential streets, contrasting with the organized grid across the bay. Willemstad's colorful colonial architecture has won it UNESCO Heritage site designations. Diving and swimming with dolphins are popular activities in the bay. ",
                "quickFilterApplicableId": 3,
                "id": 474
            },
            {
                "name": "Sint Maarten",
                "description": "The smallest island in the world ever to have been partitioned between two different nations, St. Martin/St. Maarten has been shared by the French and the Dutch in a spirit of neighborly cooperation and mutual friendship for almost 350 years. The border is almost imperceptible. and people cross back and forth without ever realizing they are entering a new country. There are four boundries, Belle Vue / Cole Bay, French Quarter / Dutch Quarter, Low Lands / Copecoy and Oyster Pond, testifying to centuries of peaceful cohabitation and the treaty that made the arrangement possible.    ",
                "quickFilterApplicableId": 3,
                "id": 475
            },
            {
                "name": "Bonaire",
                "description": "Bonaire is a Caribbean island east of Central America and north of Venezuela. It is a flat, riverless island renowned for its dive spots. Its tropical climate is moderated by constant trade winds from the Atlantic Ocean. The temperature is almost constant at about 27 degrees Celsius (81 degrees Fahrenheit). The island caters mainly to scuba divers and snorkelers, as there are few sandy beaches, while the surrounding reefs are easily accessible from the shore. Bonaire is world renowned for its excellent scuba diving and is consistently rated among the best diving and Caribbean diving locations in the world. ",
                "quickFilterApplicableId": 3,
                "id": 476
            },
            {
                "name": "St. George's",
                "description": "St. George's is the capital of Grenada, British West Indies. The city is surrounded by a hillside of an old volcano crater and is on a hoseshoe-shaped harbour. The city is a popular Caribbean Tourist destination that attracts thousands of tourist's, cruise ships, and even celebrity's. The city has significantly developed in recent years, while preserving its rich history, culture, and natural beauty.   ",
                "quickFilterApplicableId": 3,
                "id": 477
            },
            {
                "name": "Montego Bay",
                "description": "Montego Bay is the capital of St. James Parish and the third largest city in Jamaica. It is a tourist destination known for its duty free shopping, cruise line terminal and the sheltered Doctor's Cave beach with clear turquoise waters which is one of the most famous beaches on the island. The city is backed by picturesque low mountains. Montego Bay offers a wide variety of hotel choices ranging from 3 Stars such as Sandals and Breezes to 5 Star posh hotels like the Rose Hall, Half Moon and Round Hill. Other options include private villas, such as the famous Star Apple House, located in St James's near Round Hill.",
                "quickFilterApplicableId": 3,
                "id": 478
            },
            {
                "name": "Providenciales",
                "description": "White-sand beaches, calm clear water and a bountiful barrier reef make the Turks and Caicos island of Providenciales a hot spot for families, snorkelers and divers. Some call rock-free Grace Bay Beach the best in the world. For an unusual experience, divers can walk along the ocean floor at Smith's Reef, where underwater signs describe the reef's ecosystem. Additional destinations include Iguana Island (home of endangered rock iguanas), the country's only golf course, art galleries and a casino. ",
                "quickFilterApplicableId": 3,
                "id": 479
            },
            {
                "name": "Saint Thomas",
                "description": "When walking in St. Thomas, you will see the bustle of  Main Street, and cool emerald hills. Look also for the view from Mountain Top. The spiral of winding streets from the base of Savan. The quiet French countryside feeling on the far side of the island. Hoteliers offer accommodations to suit all tastes.   ",
                "quickFilterApplicableId": 3,
                "id": 480
            },
            {
                "name": "Saint John",
                "description": "St. John is home to the Virgin Islands National Park which protects over 7000 acres of the 12,500 acre island. It offers visitors a unique opportunity to enjoy and appreciate the beautiful natural resources of the island. You can stay in an eco-friendly cabin or at a campground. At a beautiful resort or in villas and vacation rentals that range from quaint to super luxurious.",
                "quickFilterApplicableId": 3,
                "id": 481
            },
            {
                "name": "Grand Turk",
                "description": "<P>Grand Turk Island is an island in the Turks and Caicos Islands. It is the largest island in the Turks Islands (not the Caicos) with 18 km2 (6.9 sq mi).</P>",
                "quickFilterApplicableId": 3,
                "id": 482
            },
            {
                "name": "Guanajuato",
                "description": "<p>The Camino Real Guanajuato Hotel was built from the ruins of a 17th century estate building called Hacienda de Beneficio de Metal de San Francisco Javier (Metal Extraction of San Francisco Javier Hacienda). <br />Guanajuato is a state in the central highlands of Mexico. It is named after its capital city, Guanajuato, which comes from P'urh&eacute;pecha, meaning &ldquo;Hill of Frogs. &rdquo;Las Ranas (&ldquo;the frogs&rdquo;) is a nickname for people from this state as frogs are their state animal. Guanajuato is the home state of former president Vicente Fox, muralist Diego Rivera, and singer-songwriter Jos&eacute; Alfredo Jim&eacute;nez.<br />After central Mexico and the Gulf of Mexico coast, Guanajuato was one of the first areas of Mexico colonized by the Spanish, in the 1520s, for its rich silver deposits. Guanajuato&rsquo;s colonial architecture is well preserved along with more than 35 old churches in its capital alone.</p>",
                "quickFilterApplicableId": 3,
                "id": 483
            },
            {
                "name": "Toledo Disctrict",
                "description": "Toledo District is the southernmost district in Belize, and Punta Gorda the District capital. Although the least developed region in the country, it features some of the most pristine rainforests, extensive cave networks, coastal lowland plains, and offshore cays. Toledo is home to a wide range of cultures -- from Mopan and Kekchi Maya, to Creole, the Garifuna, East Indians, Mennonites, Mestizos, and descendants of US Confederate settlers.",
                "quickFilterApplicableId": 3,
                "id": 484
            },
            {
                "name": "Saint Croix",
                "quickFilterApplicableId": 3,
                "id": 485
            },
            {
                "name": "Belize Cayes",
                "quickFilterApplicableId": 3,
                "id": 486
            },
            {
                "name": "Stan Creek & South Coast",
                "quickFilterApplicableId": 3,
                "id": 487
            },
            {
                "name": "Outer Atolls",
                "quickFilterApplicableId": 3,
                "id": 488
            },
            {
                "name": "Guanacaste Zone 1",
                "quickFilterApplicableId": 3,
                "id": 489
            },
            {
                "name": "Guanacaste Zone 2",
                "quickFilterApplicableId": 3,
                "id": 490
            },
            {
                "name": "Guanacaste Zone 3",
                "quickFilterApplicableId": 3,
                "id": 491
            },
            {
                "name": "Queretaro",
                "quickFilterApplicableId": 3,
                "id": 492
            },
            {
                "name": "Exumas",
                "quickFilterApplicableId": 3,
                "id": 493
            },
            {
                "name": "Harbour Island",
                "quickFilterApplicableId": 3,
                "id": 494
            },
            {
                "name": "Saint Vincent",
                "quickFilterApplicableId": 3,
                "id": 495
            },
            {
                "name": "Eleuthera",
                "quickFilterApplicableId": 3,
                "id": 496
            },
            {
                "name": "British Virgin Islands",
                "quickFilterApplicableId": 3,
                "id": 1081
            },
            {
                "name": "Caribbean",
                "quickFilterApplicableId": 3,
                "id": 1082
            },
            {
                "name": "Grenada",
                "quickFilterApplicableId": 3,
                "id": 1088
            },
            {
                "name": "Ski South America",
                "quickFilterApplicableId": 3,
                "id": 1112
            },
            {
                "name": "Turks and Caicos",
                "quickFilterApplicableId": 3,
                "id": 1115
            },
            {
                "name": "Ultraluxe Leeward Islands",
                "quickFilterApplicableId": 3,
                "id": 1117
            },
            {
                "name": "Caribbean Villas",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 1125
            },
            {
                "name": "Central America Cruise",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 1126
            },
            {
                "name": "Ecuador",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 1127
            },
            {
                "name": "Mexico",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 1128
            },
            {
                "name": "Galapagos Cruise",
                "description": "Cruise the same South Pacific waters of the Galapagos once sailed by the British naturalist, Charles Darwin, on an expedition which provided the foundation for Darwin's theory of evolution. Explore this biological marine reserve and revel in the discovery of such a unique place on earth. Rich with endemic species, an expedition cruise of the Galapagos offers paradise to wildlife and nature lovers.",
                "quickFilterApplicableId": 3,
                "id": 1130
            }
        ]
    },
    {
        "continent": "North America",
        "id": 15,
        "countries": [
            {
                "name": "Hawaii",
                "description": "Hawaii is the 50th state of the United States of America. Situated nearly at the center of the north Pacific Ocean, Hawaii marks the northeast corner of Polynesia. While it was once a major hub for the whaling, sugar and pineapple industries, it is now economically dependent on tourism and the U.S. military. The natural beauty of the islands continues to be one of Hawaii's greatest assets. Honolulu is the state's capital, largest city, and cultural hub, located on the island of Oahu. Nearby Waikiki Beach is most popular destination in the region. Maui and Kuai are smaller islands with gorgeous natural beauty, and a selection of tourist resorts. The Big Island of Hawaii is less developed. ",
                "quickFilterApplicableId": 3,
                "id": 497
            },
            {
                "name": "Jasper National Park",
                "description": "Jasper is a town in western Alberta, the commercial center of Jasper National Park, located in the Canadian Rockies in the Athabasca River Valley. Jasper is 362 kilometres (225 mi) west of Edmonton, 290 kilometres (180 mi) north of Banff. The Icefields Parkway connects Jasper to Lake Louise. Located near Jasper are a number of beautiful lakes.  The Jasper Tramway, which takes visitors to Whistlers Summit, and the Marmot Basin Ski Resort, are located near the town center.",
                "quickFilterApplicableId": 3,
                "id": 498
            },
            {
                "name": "Ottawa",
                "description": "Ottawa is the capital of Canada, located on the banks of the Ottawa River, on the border between Ontario and Quebec. Ottawa is home to a wealth of national museums, official residences, government buildings, memorials and heritage structures. Major attractions include: Parliament Hill, the National Library and Archives, the National Gallery as well as the Museums of Civilization, Contemporary Photography, Nature, Science & Technology, and War. Byward Market is the centre of the city's nightlife, and restaurants. ",
                "quickFilterApplicableId": 3,
                "id": 499
            },
            {
                "name": "Muskoka",
                "description": "Muskoka is a region in Ontario, about two hours north of Toronto that stretches 2,500 square miles and includes 1,600 lakes. This region is popularly referred to as \"cottage country\" and sees over 2.1 million visitors annually. Muskoka is sprinkled with picturesque villages, farming communities, lakeside hotels and resorts, golf courses, country clubs, and marinas. Muskoka's three major lakes: Lake Muskoka, Lake Rosseau, and Lake Joseph, feature large mansion-like summer estates. Various Hollywood stars have built their retreats in Muskoka, including Steven Spielberg, Tom Hanks and Kurt Russell. Port Carling is the unofficial center of the region where you will find fast boats and high cuisine on the water.",
                "quickFilterApplicableId": 3,
                "id": 500
            },
            {
                "name": "Prince Edward Island",
                "description": "Prince Edward Island is a Canadian province consisting of an island of the same name. The maritime province is the smallest in the nation in both land area and population. The island's lush landscape has had a strong bearing on its economy and its culture. Author Lucy Maud Montgomery drew inspiration from the land during the late Victorian Era for the setting of her classic novel Anne of Green Gables. Today, many of the same qualities are enjoyed by tourists who visit during all seasons. They enjoy beaches, golf courses, eco-tourism adventures, and simply touring the countryside and enjoying cultural events in local communities around the island.",
                "quickFilterApplicableId": 3,
                "id": 501
            },
            {
                "name": "Kauai",
                "description": "Kauai, the \"Garden Isle,\" is home to several natural wonders, such as the Wailua River, Waimea Canyon, and the Na Pali Coast. Mount Waialeale is known as one of the rainiest spots in the world. Po`ipu, on the south side, is the major visitor destination for the island, with abundant sun and much resort development. Most of the major hotel/resort chains, such as Hyatt, Hilton, and Sheraton, have their main Kauai resorts in Po`ipu. Lihu`e, on the island's southeast side, is the civic and commercial center of the island, host to the island's main airport, county offices, and largest shopping mall (Kukui Grove Center). Kapa`a, on the east side, about a 20 minute drive north of Lihu`e, is the largest population center on the island. It anchors what is known as the Coconut Coast.",
                "quickFilterApplicableId": 3,
                "id": 502
            },
            {
                "name": "Austin",
                "description": "Austin is in the capital of Texas and a college town. Austin's attitude is commonly emblazoned about town on T-Shirts and bumper stickers that read: \"Keep Austin Weird.\" Austin is also marketed as the \"Live Music Capital of the World\" due to the large number of venues. The downtown area is compact and easily walkable. The University of Texas, LBJ Library, and State Capitol are all worthwhile sights. Austin's Congress Avenue bridge is home to the largest Mexican free-tailed bat colony in North America (1.5 million). The bats are generally active at dusk every evening between March and November. ",
                "quickFilterApplicableId": 3,
                "id": 503
            },
            {
                "name": "New Orleans",
                "description": "New Orleans is the most celebrated city of the American South, and the largest city in Louisiana. The city has a reputation for historical roots, hot and muggy weather, great food, great music, and great times. Despite being hit hard by Hurricane Katrina in late 2005, New Orleans is still the tourist hot-spot it always has been. Jazz music still rules the city's streets and there's still a bit of Mardi Gras all year round. French Quarter is the oldest, most famous, and most visited section of the city. Many old-line restaurants are in the Quarter, along with music clubs, museums, antiques shops, and drinking establishments. Swamp tours to the bayous are also popular.",
                "quickFilterApplicableId": 3,
                "id": 504
            },
            {
                "name": "Los Angeles",
                "description": "The city of Los Angeles, also known as the \"City of Angels\" or simply L.A., is the largest city in California. Located on a broad basin in Southern California, it's surrounded by vast mountain ranges, deep valleys, forests, desert and miles of coastline on the Pacific Ocean. Los Angeles is an important center of culture, business, media, and international trade, but is most famous for being the center of the world's entertainment industry, which forms the base of its global status. Historically, the downtown fell into disrepair, however, in recent years, the area has seen a booming revival, with trendy hotels, bars, shops and restaurants opening to make it a place to be again. Hollywood is home to the film studios and entertainment theme parks.",
                "quickFilterApplicableId": 3,
                "id": 505
            },
            {
                "name": "Sonoma Valley",
                "description": "Sonoma Valley is just north of the Bay Area of California. Besides being the center of the modern wine-making industry in Sonoma County, the town of Sonoma has a rich history dating back to the early 19th century. Today, Sonoma, with a little over 9000 people, attracts thousands of visitors each year as a jumping point to the vineyards that surround the town. Sonoma's mild climate and beautiful scenery make it ideal for walking or riding a bike. There is also horseback riding, hot air balloons, cooking lessons, and much more on offer.    ",
                "quickFilterApplicableId": 3,
                "id": 506
            },
            {
                "name": "San Francisco",
                "description": "San Francisco is a major city in California, the centerpiece of the Bay Area, well-known for its liberal community, hilly terrain, Victorian architecture, scenic beauty, summer fog, and great ethnic and cultural diversity. Each district of San Francisco carries its own unique and distinct culture. The Golden Gate Bridge is the well-known symbol of the city. Fisherman's Wharf is a touristy waterfront with Pier 39, Ghirardelli Square and the ferry launch to Alcatraz. Nob Hill-Russian Hill&nbsp;is a ritzy neighborhood with upscale hotels, cable cars, panoramic views and steep inclines. Chinatown-North Beach are vibrant immigrant communities; stylish laid back 'Little Italy' next to the crowded and largest Chinatown outside of Asia.",
                "quickFilterApplicableId": 3,
                "id": 507
            },
            {
                "name": "Napa Valley",
                "description": "Napa Valley, a world famous wine area, is one of the most popular tourist attractions in California. More than five million visitors come each year, visiting the more than two hundred wineries. With wine as a focus, great dining naturally emerged to compliment it. The Culinary Institute of America at Greystone in St. Helena supplies a steady stream of well-trained chefs, supplementing the already prestigious chefs drawn by Napa Valley's reputation and locale. There are 10 golf courses, numerous spas, and a variety of other activities on offer. For many visitors, a simple picnic with good wine and great food is a highlight.",
                "quickFilterApplicableId": 3,
                "id": 508
            },
            {
                "name": "Yosemite National Park",
                "description": "Yosemite National Park is a UNESCO World Heritage Site located in the Sierra Nevada mountains in east-central California - a four hour drive from San Francisco. Yosemite is internationally recognized for its spectacular granite cliffs, waterfalls, clear streams, giant sequoia groves, and biological diversity. The 750,000-acre, 1,200 square-mile park contains thousands of lakes and ponds, 1600 miles of streams, 800 miles of hiking trails, and 350 miles of roads. Yosemite is one of the \"crown jewels\" of the US National Park System with 3.5 million visitors per year. Most tourism is centerd in 12 square miles within Yosemite Valley (about 1% of the total park land). ",
                "quickFilterApplicableId": 3,
                "id": 509
            },
            {
                "name": "Louisville",
                "description": "Louisville is the largest city in the U.S. state of Kentucky, and the county seat of Jefferson County.&nbsp; An important internal shipping port in the 19th century, Louisville is today most well known for the Kentucky Derby, the widely watched first race of the Triple Crown of Thoroughbred Racing.&nbsp; It is situated on the Ohio River in north-central Kentucky at the Falls of the Ohio. It is sometimes referred to as either the northernmost Southern city or the southernmost Northern city in the United States.",
                "quickFilterApplicableId": 3,
                "id": 510
            },
            {
                "name": "Alaska",
                "description": "Alaska is the largest state of the United States by area; it is situated in the northwest extremity of the North American continent, with Canada to the east, the Arctic Ocean to the north, and the Pacific Ocean to the west and south, with Russia further west across the Bering Strait. Approximately half of Alaska's 698,473 residents live within the Anchorage metropolitan area. As of 2009, Alaska remains the least densely populated state of the U.S.&nbsp; Alaska has a longer coastline than all the other U.S. states combined. With its myriad islands, it has almost 34,000 miles (54,720 km) of tidal shoreline. The Aleutian Islands chain extends west from the southern tip of the Alaska Peninsula. Many active volcanoes are found in the Aleutians. One of the world's largest tides occurs in Turnagain Arm, just south of Anchorage &ndash; tidal differences can be more than 35 feet (10.7 m). The state has more than three million lakes and marshlands and wetland permafrost cover 188,320 square miles (487,747 km2) (mostly in northern, western and southwest flatlands), while glacier ice covers some 16,000 square miles (41,440 km2) of land and 1,200 square miles (3,110 km2) of tidal zone. With over 100,000 glaciers, Alaska is home to half of the world's glaciers.",
                "quickFilterApplicableId": 3,
                "id": 511
            },
            {
                "name": "Arizona",
                "description": "The 48th state of Arizona is located in the southwestern region of the United States. The capital and largest city is Phoenix and the state is noted for its desert climate, exceptionally hot summers, and mild winters, however it also features pine forests and mountain ranges in the northern high country, with cooler weather than in the lower deserts.&nbsp; Mountains and plateaus are found in more than half of the state. Despite the state's aridity, 27% of Arizona is forest, a percentage comparable to modern day France or Germany.&nbsp;&nbsp; The most well known feature is arguably The Grand Canyon - a colorful, steep-sided gorge, carved by the Colorado River, in the northern part of the state. The canyon is one of the seven natural wonders of the world and is largely contained in the Grand Canyon National Park—one of the first national parks in the United States.&nbsp; Arizona is one of the Four Corners states. It borders New Mexico, Utah, Nevada, California, touches Colorado, and has a 389-mile (626 km) international border with the states of Sonora and Baja California in Mexico. It is the largest landlocked U.S. state by population. In addition to the Grand Canyon, many other national forests, parks, monuments, and Indian reservations are located in the state.",
                "quickFilterApplicableId": 3,
                "id": 512
            },
            {
                "name": "California",
                "description": "&nbsp;California is the most populous state in the United States, and the third largest by land area, after Alaska and Texas; it is also the second most populous sub-national entity in the Americas, behind only São Paulo, Brazil. California is located on the West Coast of the United States, bordered by Oregon to the north, Nevada to the northeast, Arizona to the southeast, the Mexican state of Baja California to the south, and the Pacific Ocean to the west. Its four largest cities are Los Angeles, San Diego, San Jose, and San Francisco. Much of the state has a Mediterranean climate, with cool, rainy winters and dry summers. The cool California Current offshore often creates summer fog near the coast. Further inland, one encounters colder winters and hotter summers.&nbsp; California's geography ranges from the Pacific coast to the Sierra Nevada mountain range in the east, to Mojave desert areas in the southeast and the Redwood–Douglas fir forests of the northwest. The center of the state is dominated by the Central Valley, one of the most productive agricultural areas in the world. California is the most geographically diverse state in the nation, and contains the highest (Mount Whitney) and lowest (Death Valley) points in the contiguous United States. Almost 40% of California is forested, a high amount for a relatively arid state.",
                "quickFilterApplicableId": 3,
                "id": 513
            },
            {
                "name": "Colorado",
                "description": "Colorado is a state that encompasses most of the Southern Rocky Mountains as well as the northeastern portion of the Colorado Plateau and the western edge of the Great Plains. Colorado is bordered on the north by Wyoming and Nebraska, on the east by Nebraska and Kansas, on the south by Oklahoma and New Mexico, and on the west by Utah. The four states of Colorado, New Mexico, Arizona, and Utah meet at one common point known as the Four Corners. Colorado is one of only three U.S. states with no natural borders, the others being neighboring Wyoming and Utah. The state is noted for its vivid landscape of mountains, plains, mesas, and canyons. The 30 highest major summits of the Rocky Mountains of North America all lie within the state. Colorado is home to national parks, monuments, recreation areas, historic sites and trails, and forests, as well as national grasslands, wilderness areas, conservation areas, wildlife refuges, state parks, a state forest, wildlife areas, and numerous other scenic, historic, and recreational attractions.",
                "quickFilterApplicableId": 3,
                "id": 514
            },
            {
                "name": "Maine",
                "description": "Maine is a state in the New England region of the northeastern United States, bordered by the Atlantic Ocean to the southeast, New Hampshire to the southwest, and the Canadian provinces of Quebec to the northwest and New Brunswick to the northeast. Maine is the northernmost portion of New England and is the easternmost state in the contiguous United States and the easternmost in all the United States. It is known for its scenery, jagged, mostly rocky coastline, low, rolling mountains, and heavily forested interior as well as for its seafood cuisine, especially lobsters and clams.",
                "quickFilterApplicableId": 3,
                "id": 515
            },
            {
                "name": "Montana",
                "description": "The state of Montana is located in the Western United States. The western third of the state contains numerous mountain ranges; other island ranges are found in the central third of the state, for a total of 77 named ranges of the Rocky Mountains.&nbsp; Montana has several nicknamesincluding: \"The Treasure State\" and \"Big Sky Country,\" and slogans that include \"Land of the Shining Mountains,\" and more recently, \"The Last Best Place.\" The state ranks fourth in area, but 44th in population, and therefore has the third lowest population density in the United States. The economy is primarily based on ranching, wheat farming, oil and coal in the east; lumber, tourism, and hard rock mining in the west. Millions of tourists annually visit Glacier National Park, the Battle of Little Bighorn site, and three of the five entrances to Yellowstone National Park. Montana is bordered by the Canadian provinces of British Columbia, Alberta and Saskatchewan on the north, Idaho on the west, Wyoming on the south and North Dakota and South Dakota on the east.",
                "quickFilterApplicableId": 3,
                "id": 516
            },
            {
                "name": "Nevada",
                "description": "Nevada is a state located in the western region of the United States. The capital is Carson City and the largest city is Las Vegas. The state's nickname is Silver State, due to the large number of silver deposits that were discovered and mined there. \"Sagebrush State\" and \"Battle Born State\" are its alternative nicknames. In 1864, Nevada became the 36th state to enter the union, and the phrase \"Battle Born\" on the state flag reflects the state's entry on the Union side during the American Civil War. Nevada geographically covers the Mojave Desert in the south to the Great Basin in the north. It is the most arid state in the Union. Approximately 86% of the state's land is owned by the U.S federal government under various jurisdictions both civilian and military. The state is well known for its easy marriage and divorce proceedings, entertainment and legalized gambling.",
                "quickFilterApplicableId": 3,
                "id": 517
            },
            {
                "name": "New Hampshire",
                "description": "New Hampshire is a state in the New England region of the northeastern United States of America. It borders Massachusetts to the south, Vermont to the west, Maine and the Atlantic Ocean to the east, and the Canadian province of Quebec to the north. It became the first post-colonial sovereign nation in the Americas when it broke off from Great Britain in January 1776, and was one of the original thirteen states that founded the United States of America six months later. Concord is the state capital, while Manchester is the largest city in the state.&nbsp; The state nickname is \"The Granite State\", in reference to its geology and its tradition of self-sufficiency. New Hampshire's major recreational attractions include skiing, snowmobiling and other winter sports, hiking and mountaineering, observing the fall foliage, summer cottages along many lakes and the seacoast, motor sports at the New Hampshire Motor Speedway, and Motorcycle Week, a popular motorcycle rally held in Weirs Beach near Laconia in June. The White Mountain National Forest links the Vermont and Maine portions of the Appalachian Trail, and boasts the Mount Washington Auto Road, where visitors may drive to the top of 6,288-foot (1,917 m) Mount Washington.",
                "quickFilterApplicableId": 3,
                "id": 518
            },
            {
                "name": "New Jersey",
                "description": "<P>New Jersey is a state in the Mid-Atlantic region of the United States. It is bordered on the northeast by New York, on the southeast and south by the Atlantic Ocean, on the west by Pennsylvania and on the southwest by Delaware. The state can be thought of as five regions, based on natural geography and population. Northeastern New Jersey, the Gateway Region, lies within the New York metropolitan area, and some residents commute into the city to work. Northwestern New Jersey, or the \"Skylands\", is, compared to the northeast, more wooded, rural, and mountainous, but still a popular place to live. The \"Shore\", along the Atlantic Coast in the central-east and southeast, has its own natural, residential, and lifestyle characteristics owing to its location by the ocean. The central-west and southwest are within metropolitan Philadelphia, and are included in the Delaware Valley. The fifth region is the Pine Barrens in the interior of the southern part. Covered rather extensively by mixed pine and oak forest, it has a much lower population density than much of the rest of the state. It is the most densely populated state in the United States. The area was inhabited by Native Americans for more than 2,800 years, with historical tribes such as the Lenape along the coast. New Jersey's position at the center of the Northeast megalopolis, between Boston, New York City, Philadelphia, Baltimore and Washington, D.C., fueled its rapid growth through the suburban boom of the 1950s and beyond. Today, New Jersey has the highest population density and the second highest median income of any state in the United States.</P>",
                "quickFilterApplicableId": 3,
                "id": 519
            },
            {
                "name": "New Mexico",
                "description": "New Mexico is a state located in the southwestern region of the United States. With a population density of 16 per square mile, New Mexico is the sixth- most sparsely inhabited U.S. state. Among U.S. states, New Mexico has the highest percentage of Hispanics at 44 percent (2008 estimate), being descendants of Spanish colonists and recent immigrants from Latin America. It also has the third-highest percentage of Native Americans after Alaska and Oklahoma, and the fifth-highest total number of Native Americans after California, Oklahoma, Arizona, and Texas.The tribes in the state consist of mostly Navajo and Pueblo peoples. As a result, the demographics and culture of the state are unique for their strong Hispanic, Mexican, and Native American cultural influences.The New Mexican landscape ranges from wide, rose-colored deserts to broken mesas to high, snow-capped peaks. Despite New Mexico's arid image, heavily forested mountain wildernesses cover a significant portion of the state, especially towards the north. The Sangre de Cristo Mountains, the southernmost part of the Rocky Mountains, run roughly north-south along the east side of the Rio Grande in the rugged, pastoral north. The climate of New Mexico is highly arid and its territory is mostly covered by mountains, high plains, and desert.",
                "quickFilterApplicableId": 3,
                "id": 520
            },
            {
                "name": "New York",
                "description": "New York is a state in the Mid-Atlantic and Northeastern regions of the United States and is the nation's third most populous. New York's borders touch (clockwise from the west) two Great Lakes (Erie and Ontario, which are connected by the Niagara River); the provinces of Ontario and Quebec in Canada; Lake Champlain; three New England states (Vermont, Massachusetts, and Connecticut); the Atlantic Ocean, and two Mid-Atlantic States, New Jersey and Pennsylvania. In addition, Rhode Island shares a water border with New York.&nbsp; New York City, which is geographically the largest city in the state and most populous in the United States, is known for its history as a gateway for immigration to the United States and its status as a financial, cultural, transportation, and manufacturing center. Contrasting with New York City's urban atmosphere, the vast majority of the state is dominated by farms, forests, rivers, mountains, and lakes. New York's Adirondack Park is the largest state park in the United States. It is larger than the Yellowstone, Yosemite, Grand Canyon, Glacier and Olympic National Parks combined.&nbsp; In general, New York has a humid continental climate and is heavily influenced by two continental air masses: a warm, humid one from the southwest and a cold, dry one from the northwest.",
                "quickFilterApplicableId": 3,
                "id": 521
            },
            {
                "name": "Texas",
                "description": "Texas is the second-largest U.S. state by both area and population, and the largest state in the contiguous United States. Located in the South Central United States, Texas is bordered by Mexico to the south, New Mexico to the west, Oklahoma to the north, Arkansas to the northeast, and Louisiana to the east. Texas has an area of 268,820 square miles (696,200 km2), and a growing population of 24.7 million residents.&nbsp; Houston is the largest city in Texas and the fourth-largest in the United States.&nbsp; Due to its size and geologic features such as the Balcones Fault, Texas contains diverse landscapes that resemble both the American South and Southwest. Although it is popularly associated with the Southwestern deserts, less than 10% of the land area is desert. Most of the population centers are located in areas of former prairies, grasslands, forests, and the coastline. Traveling from east to west, one can observe terrain that ranges from coastal swamps and piney woods, to rolling plains and rugged hills, and finally the desert and mountains of the Big Bend.&nbsp; Today it has more Fortune 500 companies than any other U.S. state.&nbsp; It leads the nation in export revenue since 2002 and has the second-highest gross state product.",
                "quickFilterApplicableId": 3,
                "id": 522
            },
            {
                "name": "Utah",
                "description": "Utah is a western state of the United States. Approximately 80% of Utah's 2.7 million people live along the Wasatch Front, centering on Salt Lake City. This leaves vast expanses of the state nearly uninhabited, making the population the sixth most urbanized in the U.S.&nbsp; The name \"Utah\" is derived from the name of the Ute tribe and means \"people of the mountains\" in the Ute language. Utah is bordered by Arizona on the south, Colorado on the east, Wyoming on the northeast, Idaho on the north and Nevada on the west. It also touches a corner of New Mexico.&nbsp; Utah is one of the most religiously homogeneous states; between 41% and 60% of Utahns are reported to be members of The Church of Jesus Christ of Latter-day Saints (also known as the LDS Church or Mormon Church), which greatly influences Utah culture and daily life.&nbsp; The state is a major tourist destination for outdoor recreation.",
                "quickFilterApplicableId": 3,
                "id": 523
            },
            {
                "name": "Vermont",
                "description": "Vermont is a state in the New England region of the northeastern United States of America. The state ranks 43rd by land area, 9,250 square miles (24,000 km2), and 45th by total area. It has a population of 621,270, making it the second least-populated state.The only New England state with no coastline along the Atlantic Ocean, Vermont is notable for Lake Champlain (which makes up 50% of Vermont's western border) and the Green Mountains, which run north to south. It is bordered by Massachusetts to the south, New Hampshire to the east, New York to the west, and the Canadian province of Quebec to the north.&nbsp; It is the leading producer of maple syrup in the United States. The state capital is Montpelier, and the largest city and metropolitan area is Burlington. No other state has a largest city as small as Burlington,or a capital city as small as Montpelier.",
                "quickFilterApplicableId": 3,
                "id": 524
            },
            {
                "name": "Washington",
                "description": "Washington is a state in the Pacific Northwest region of the United States and is a land of contrasts; the deep forests of the Olympic Peninsula, such as the Hoh Rain Forest, are among the only temperate rainforests in the continental United States, but the semi-desert east of the Cascade Range has few trees. Mount Rainier, the highest mountain in the state, is covered with more glacial ice than any other peak in the lower 48 states.&nbsp; Washington's position on the Pacific Ocean and the harbors of Puget Sound give the state a leading role in maritime trade with Alaska, Canada, and the Pacific Rim. Puget Sound's many islands are served by the largest ferry fleet in the United States.&nbsp; Nearly 60% of Washington's residents live in the Seattle metropolitan area, the center of transportation, business, and industry, and home to an internationally known arts community.&nbsp; The Cascade Range contains several volcanoes, which reach altitudes significantly higher than the rest of the mountains. From the north to the south these volcanoes are Mount Baker, Glacier Peak, Mount Rainier, Mount St. Helens, and Mount Adams. Mount St. Helens is currently the only Washington volcano that is actively erupting; however, all of them are considered active volcanoes.",
                "quickFilterApplicableId": 3,
                "id": 525
            },
            {
                "name": "Wyoming",
                "description": "Wyoming is a state in the Western United States. The majority of the state is dominated by the mountain ranges and rangelands of the Rocky Mountain West, while the easternmost section of the state includes part of a high elevation prairie region known as the High Plains. While the tenth largest U.S. state by area, Wyoming is the least populous.&nbsp; The capital and the most populous city of Wyoming is Cheyenne.&nbsp; Wyoming is bordered on the north by Montana, on the east by South Dakota and Nebraska, on the south by Colorado, on the southwest by Utah, and on the west by Idaho.&nbsp; The state includes both Parks Yellowstone and Grand Teton National Parks as well as wildlife refuges, historical sites and trails and the Devils Tower and Fossil Butte National Monuments.",
                "quickFilterApplicableId": 3,
                "id": 526
            },
            {
                "name": "Georgia State",
                "description": "Georgia is a state located in the southeastern United States. From 2007 to 2008, 14 of Georgia's counties ranked among the nation's 100 fastest-growing, second only to Texas.&nbsp; Georgia is known as the Peach State and the Empire State of the South. Atlanta is the capital and the most populous city.&nbsp; Georgia is bordered on the south by Florida; on the east by the Atlantic Ocean and South Carolina; on the west by Alabama; and on the north by Tennessee and North Carolina.&nbsp; Each region has its own distinctive characteristics. For instance, the Ridge and Valley, which lies in the northwest corner of the state, includes limestone, sandstone, shale and other sedimentary rocks, which have yielded construction-grade limestone, barite, ocher and small amounts of coal. Georgia has a diverse mix of flora and fauna. The State has approximately 250 tree species and 58 protected plants and the majority of Georgia is primarily a humid subtropical climate. There are 63 parks in Georgia, 48 of which are state parks and 15 that are historic sites, and numerous state wildlife preserves.",
                "quickFilterApplicableId": 3,
                "id": 527
            },
            {
                "name": "Massachusetts",
                "description": "The state of Massachusetts is in the New England region of the northeastern United States. Massachusetts has been significant throughout American history and many of Massachusetts's towns were founded by colonists from England in the 1620s and 1630s.&nbsp; It is bordered by Rhode Island and Connecticut to the south, New York to the west, and Vermont and New Hampshire to the north; at its east lies the Atlantic Ocean. Most of its population of 6.6 million lives in the Boston metropolitan area. The eastern half of the state consists of urban, suburban, and rural areas, while Western Massachusetts is mostly rural.&nbsp; Most of the state is uplands of resistant metamorphic rock that were scraped by Pleistocene glaciers that deposited moraines and outwash on a large, sandy, arm-shaped peninsula called Cape Cod and the islands Martha's Vineyard and Nantucket to the south of Cape Cod.&nbsp;&nbsp; Although much of the state had been cleared for agriculture, leaving only traces of old growth forest in isolated pockets, secondary growth has regenerated in many rural areas as farms have been abandoned.&nbsp; Currently, forests cover around 62% of Massachusetts.&nbsp; The state is located along the Atlantic Flyway, a major route for migratory waterfowl along the Atlantic coast.",
                "quickFilterApplicableId": 3,
                "id": 528
            },
            {
                "name": "South Carolina",
                "description": "South Carolina is a state in the United States that borders Georgia to the south and North Carolina to the north and the Atlantic Ocean to the east.&nbsp; It contains 46 counties and its capital is Columbia.&nbsp; The state's coastline contains many salt marshes and estuaries, as well as natural ports such as Georgetown and Charleston. An unusual feature of the coastal plain is a large number of Carolina bays, the origins of which are uncertain. Just west of the coastal plain is the Sandhills region, also known as the Midlands. This region of the state is thought to contain remnants of old coastal dunes from a time when the land was sunken or the oceans were higher.&nbsp; South Carolina has a humid subtropical climate and is occasionally affected by tropical cyclones.",
                "quickFilterApplicableId": 3,
                "id": 529
            },
            {
                "name": "Illinois",
                "description": "Illinois is the most populous and demographically diverse Midwestern state and the fifth most populous state in the nation.&nbsp; With Chicago in the northeast, small industrial cities and great agricultural productivity in central and western Illinois, and natural resources like coal, timber, and petroleum in the south, Illinois has a broad economic base. Illinois is an important transportation hub; the Port of Chicago connects the Great Lakes to the Mississippi River via the Illinois River.&nbsp; Though Illinois lies entirely in the Interior Plains, it has three major geographical divisions. The first is Northern Illinois, dominated by the Chicago metropolitan area, including the city of Chicago, its suburbs, and the adjoining exurban area into which the metropolis is expanding.&nbsp; Southward and westward, the second major division is Central Illinois, an area of mostly prairie. Known as the Heart of Illinois, it is characterized by small towns and mid-sized cities. The third division is Southern Illinois, comprising the area south of U.S. Route 50, and including Little Egypt, near the juncture of the Mississippi River and Ohio River. This region can be distinguished from the other two by its warmer climate, different variety of crops (including some cotton farming in the past), more rugged topography (the southern tip is unglaciated with the remainder glaciated during the Illinoian Stage and earlier ages), as well as small-scale oil deposits and coal mining.",
                "quickFilterApplicableId": 3,
                "id": 530
            },
            {
                "name": "Michigan",
                "description": "&nbsp;The State of Michigan is located in the Great Lakes Region of the United States of America.&nbsp; It is the eighth most populous state in the United States and has the longest freshwater shoreline of any political subdivision in the world, being bounded by four of the five Great Lakes, plus Lake Saint Clair.&nbsp; In 2005, Michigan ranked third among US states for the number of registered recreational boats, behind California and Florida.&nbsp; And there is good reason for this - the state has 64,980 inland lakes and ponds!&nbsp; A person in the state is never more than six miles (10 km) from a natural water source or more than 87.2 miles (140.3 km) from a Great Lakes shoreline.&nbsp; It is the only state to consist entirely of two peninsulas. It has more lighthouses than any other state.&nbsp; The heavily forested Upper Peninsula is relatively mountainous in the west. The Porcupine Mountains, which are part of one of the oldest mountain chains in the world, rise to an altitude of almost 2,000 feet (610 m) above sea level and form the watershed between the streams flowing into Lake Superior and Lake Michigan.&nbsp; The Lower Peninsula, shaped like a mitten, is 277 miles (446 km) long from north to south and 195 miles (314 km) from east to west and occupies nearly two-thirds of the state's land area. The surface of the peninsula is generally level, broken by conical hills and glacial moraines usually not more than a few hundred feet tall.&nbsp; Michigan is the leading auto-producing state in the U.S., although some of the industry has shifted to less-expensive labor in the Southern United States and overseas.&nbsp; With more than ten million residents, Michigan remains a large and influential state, ranking eighth in population among the fifty states.",
                "quickFilterApplicableId": 3,
                "id": 531
            },
            {
                "name": "Kentucky",
                "description": "<p>The southern state of Kentucky is located in the East Central part of the country. Kentucky is known as the \"Bluegrass State\", a nickname based on the fact that native bluegrass is present in many of the pastures throughout the state, based on the fertile soil. It made possible the breeding of high-quality livestock, especially thoroughbred racing horses. It is a land with diverse environments and abundant resources, including the world's longest cave system, Mammoth Cave National Park; the greatest length of navigable waterways and streams in the Lower 48 states; and the two largest man-made lakes east of the Mississippi River. It is also home to the highest per capita number of deer and turkey in the country, the largest free-ranging elk herd east of Montana, and the nation's most productive coalfield. Kentucky is also known for thoroughbred horses, horse racing, bourbon distilleries, bluegrass music, automobile manufacturing, tobacco, and college basketball.</p>",
                "quickFilterApplicableId": 3,
                "id": 532
            },
            {
                "name": "South Dakota",
                "description": "South Dakota is a state located in the Midwestern region of the United States. It is named after the Lakota and Dakota Sioux American Indian tribes.&nbsp; South Dakota is bordered by the states of North Dakota, Minnesota, Iowa, Nebraska, Wyoming, and Montana. The Black Hills, a group of low pine-covered mountains, is located in the southwest part of the state. The Black Hills are of great religious importance to local American Indians and also the location of Mount Rushmore, a major tourist destination. Other attractions in the southwest include Badlands and Wind Cave national parks, Custer State Park, the Crazy Horse Memorial, and historic Deadwood. South Dakota experiences a temperate continental climate, with four distinct seasons and precipitation ranging from moderate in the east to semi-arid in the west. The ecology of the state features species typical of a North American grassland biome.",
                "quickFilterApplicableId": 3,
                "id": 533
            },
            {
                "name": "Tennessee",
                "description": "The state of Tennessee is located in the Southeastern United States.&nbsp; It is bordered by Kentucky and Virginia to the north, North Carolina to the east, Georgia, Alabama, and Mississippi to the south, and Arkansas and Missouri to the west. The Appalachian Mountains dominate the eastern part of the state, and the Mississippi River forms the state's western border. Tennessee's capital and second largest city is Nashville, while Memphis is the state's largest city, with a population of 671 tousand.&nbsp; Tennessee has played a critical role in the development of rock and roll and early blues music. Beale Street in Memphis is considered by many to be the birthplace of the blues, with musicians such as W.C. Handy performing in its clubs as early as 1909.&nbsp; Memphis was also home to Sun Records, where musicians such as Elvis Presley, Johnny Cash, Carl Perkins, Jerry Lee Lewis, Roy Orbison, and Charlie Rich began their recording careers, and where rock and roll took shape in the 1950s.&nbsp; The 1927 Victor recording sessions in Bristol generally mark the beginning of the country music genre, and the rise of the Grand Ole Opry in the 1930s helped make Nashville the center of the country music recording industry.&nbsp; The Great Smoky Mountains National Park, the nation's most visited national park,is headquartered in the eastern part of the state, and a section of the Appalachian Trail roughly follows the Tennessee-North Carolina border. Other major tourist attractions include Elvis Presley's Graceland in Memphis and the Tennessee Aquarium in Chattanooga.",
                "quickFilterApplicableId": 3,
                "id": 534
            },
            {
                "name": "Rhode Island",
                "description": "The State of Rhode Island and Providence Plantations,more commonly referred to as Rhode Island.&nbsp; It is the smallest U.S. state by area. Rhode Island borders Connecticut to the west and Massachusetts to the north and east, and it shares a water boundary with New York's Fishers Island to the southwest.&nbsp; Despite the name, most of Rhode Island is on the mainland United States.&nbsp; Rhode Island's official nickname is \"The Ocean State,\" a reference to the state's geography, since Rhode Island has several large bays and inlets that amount to about 30% of its total area. Rhode Island is an example of a cold winter humid continental climate with hot, rainy summers and chilly winters.",
                "quickFilterApplicableId": 3,
                "id": 535
            },
            {
                "name": "Oregon",
                "description": "Oregon is located on the Pacific coast, with Washington to the north, California to the south, Nevada on the southeast and Idaho to the east. The Columbia and Snake rivers delineate much of Oregon's northern and eastern boundaries respectively.&nbsp; <BR>The valley of the Willamette River in western Oregon is the most densely populated and agriculturally productive region of the state, and is home to eight of the ten most populous citiesOregon enjoys a diverse landscape including a scenic and windswept Pacific coastline, the volcanoes of a rugged and glaciated Cascade Mountain Range, dense evergreen forests, and high desert across much of the eastern portion of the state. The towering Douglas firs and redwoods along the rainy Western Oregon coast provide a dramatic contrast with the lower density and fire prone pine tree and juniper forests covering portions of the Eastern half of the state. The eastern portion of the state also includes semi-arid scrublands, prairies, deserts, and meadows. These drier areas stretch east from Central Oregon. Mount Hood is the highest point in the state at 11,249 feet (3,429 m). Crater Lake National Park is the only national park in Oregon.",
                "quickFilterApplicableId": 3,
                "id": 537
            },
            {
                "name": "Missouri",
                "description": "The state of Missouri is located in the Midwestern United States bordered by Iowa, Illinois, Kentucky, Tennessee, Arkansas, Oklahoma, Kansas and Nebraska.&nbsp; Its capital is Jefferson City and the four largest urban areas are St. Louis, Kansas City, Springfield, and Columbia.&nbsp;&nbsp; It has both Midwestern and Southern cultural influences, reflecting its history as a border state. It is also a transition between the Eastern and Western United States, as St. Louis is often called the \"western-most Eastern city\" and Kansas City the \"eastern-most Western city.\" Missouri's geography is highly varied. The northern part of the state lies in dissected till plains while the southern part lies in the Ozark Mountains, with the Missouri River dividing the two.",
                "quickFilterApplicableId": 3,
                "id": 538
            },
            {
                "name": "Virginia",
                "description": "Virginia is a U.S. state on the Atlantic Coast of the Southern United States. It is nicknamed the \"Old Dominion\" and sometimes the \"Mother of Presidents\" because it is the birthplace of eight U.S. presidents. The geography and climate of the state are shaped by the Blue Ridge Mountains and the Chesapeake Bay, which are home to much of its flora and fauna.&nbsp; The climate of Virginia varies according to location, and becomes increasingly warmer and humid farther south and east.",
                "quickFilterApplicableId": 3,
                "id": 539
            },
            {
                "name": "At Sea",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 540
            },
            {
                "name": "Alberta",
                "description": "Alberta has been a tourist destination from the early days of the twentieth century, with attractions including outdoor locales for skiing, hiking and camping, shopping locales such as West Edmonton Mall, Calgary Stampede, outdoor festivals, professional athletic events, international sporting competitions such as the Commonwealth Games and Olympic Games, as well as more eclectic attractions. There are also natural attractions like Elk Island National Park, Wood Buffalo National Park, and the Columbia Icefield.&nbsp; Alberta's Rocky Mountains include well known tourist destinations Banff National Park and Jasper National Park. The two mountain parks are connected by the scenic Icefields Parkway. Five of Canada's fourteen UNESCO World heritage sites are located within the province: Canadian Rocky Mountain Parks, Waterton-Glacier International Peace Park, Wood Buffalo National Park, Dinosaur Provincial Park and Head-Smashed-In Buffalo Jump.",
                "quickFilterApplicableId": 3,
                "id": 541
            },
            {
                "name": "British Columbia",
                "description": "British Columbia is the westernmost of Canada's provinces and is known for its natural beauty.&nbsp; The Coast Mountains and the Inside Passage's many inlets provide some of British Columbia's renowned and spectacular scenery, which forms the backdrop and context for a growing outdoor adventure and ecotourism industry. Seventy-five percent of the province is mountainous (more than 1,000 metres (3,300 ft) above sea level); 60% is forested; and only about 5% is arable.&nbsp; The Okanagan area is one of three wine-growing regions in Canada and also produces excellent ciders.&nbsp; Given its varied mountainous terrain and its coasts, lakes, rivers, and forests, British Columbia has long been enjoyed for pursuits like hiking and camping, rock climbing and mountaineering, hunting and fishing and winter sprorts such as skiing, snowboarding, helihiking and telemarking.",
                "quickFilterApplicableId": 3,
                "id": 542
            },
            {
                "name": "New Brunswick",
                "description": "New Brunswick is one of Canada's three Maritime provinces and the provincial capital is Fredericton.&nbsp; New Brunswick differs from the other Maritime provinces physiographically, climatologically, and ethnoculturally. Both Nova Scotia and Prince Edward Island are either surrounded by, or are almost surrounded by water.&nbsp; On the other hand, New Brunswick, although having a significant seacoast, is sheltered from the Atlantic Ocean proper and has a large interior that is removed from oceanic influences. As a result, the climate tends to be more continental in character rather than maritime. Some of the province's tourist attractions include the&nbsp; Kings Landing Historical Settlement, Village Historique Acadien, Hopewell Rocks, La Dune de Bouctouche, Saint John Reversing Falls, Magnetic Hill, Magic Mountain Water Park, Cape Jourimain National Wildlife Preserve, Sugarloaf Provincial Park, Sackville Waterfowl Park, Fundy National Park, and the 41 km (25 mi) Fundy Hiking Trail.",
                "quickFilterApplicableId": 3,
                "id": 543
            },
            {
                "name": "Newfoundland and Labrador",
                "description": "Newfoundland and Labrador is a province of Canada on the country's Atlantic coast in northeastern North America. This easternmost Canadian province comprises two main parts: the island of Newfoundland off the country's eastern coast, and Labrador on the mainland to the northwest of the island.&nbsp; The Island of Newfoundland has its own dialects of the English, French, and Irish languages. The English dialect in Labrador shares much with that of Newfoundland. Labrador also has its own dialects of Innu-aimun and Inuktitut.",
                "quickFilterApplicableId": 3,
                "id": 544
            },
            {
                "name": "Northwest Territories",
                "description": "The Northwest Territories is a federal territory of Canada.&nbsp; Located in northern Canada, the territory borders Canada's two other territories, Yukon to the west and Nunavut to the east, and three provinces: British Columbia to the southwest, Alberta and Saskatchewan to the south.&nbsp; Geographical features include Great Bear Lake, the largest lake entirely within Canada, Keller Lake and Great Slave Lake, as well as the Mackenzie River and the canyons of the Nahanni National Park Reserve, a national park and UNESCO World Heritage Site. Territorial islands in the Canadian Arctic Archipelago include Banks Island, Borden Island, Prince Patrick Island, and parts of Victoria Island and Melville Island.&nbsp; While Nunavut is mostly Arctic tundra, the Northwest Territories has a slightly warmer climate and is mostly boreal forest.",
                "quickFilterApplicableId": 3,
                "id": 545
            },
            {
                "name": "Nova Scotia",
                "description": "Nova Scotia is a Canadian province located on Canada's southeastern coast.&nbsp; Its capital, Halifax, is the major economic centre of the region. Nova Scotia is the second-smallest province in Canada.&nbsp; The province includes several regions of the Mi'kmaq nation of Mi'kma'ki(mi'gama'gi), which covered all of the Maritimes, as well as parts of Maine, Newfoundland and the Gaspé Peninsula. It was named after Scotland, and today people of Scottish descent are still the largest ethnic group in the province.",
                "quickFilterApplicableId": 3,
                "id": 546
            },
            {
                "name": "Nunavut",
                "description": "Nunavut is the largest and newest federal territory of Canada.&nbsp; It comprises a major portion of Northern Canada, and most of the Canadian Arctic Archipelago, making it the fifth-largest country subdivision in the world. The capital is Iqaluit (formerly \"Frobisher Bay\") on Baffin Island, in the east of the territory. Nunavut is also home to the northernmost permanently inhabited place in the world.",
                "quickFilterApplicableId": 3,
                "id": 547
            },
            {
                "name": "Ontario",
                "description": "Ontario is a province located in east-central Canada, the largest by population and second largest, after Quebec, in total area.<BR>&nbsp;Ontario is bordered by the provinces of Manitoba to the west and Quebec to the east, and five U.S. states (from west to east): Minnesota, Michigan, Ohio, Pennsylvania (the latter two across Lake Erie) and New York to the south and east. Most of Ontario's&nbsp; border with the United States runs along water.&nbsp; The capital of Ontario is Toronto, Canada's most populous city and metropolitan area.&nbsp; Ottawa, the capital of Canada, is also located in Ontario.",
                "quickFilterApplicableId": 3,
                "id": 548
            },
            {
                "name": "Quebec",
                "description": "Located in east-central Canada, Quebec is the only Canadian province with a predominantly French-speaking population and the only one whose sole official language is French at the provincial level. Quebec occupies a territory nearly three times the size of France or Texas, most of which is very sparsely populated.&nbsp; More than 90% of Quebec's territory lies within the Canadian Shield, a rough, rocky terrain sculpted and scraped clean of soil by successive ice ages.",
                "quickFilterApplicableId": 3,
                "id": 549
            },
            {
                "name": "Yukon",
                "description": "Yukon is the westernmost and smallest of Canada's three federal territories. It was named after the Yukon River. The word Yukon means \"Great River\" in Gwich’in. The territory's capital is Whitehorse.&nbsp; At 5,959 metres (19,551 ft), Yukon's Mount Logan, in Kluane National Park and Reserve, is the highest mountain in Canada and the second highest of North America (after Mount McKinley in the U.S. state of Alaska). The sparsely populated Yukon abounds with snow-melt lakes and perennial snow-capped mountains&nbsp; The territory's climate is Arctic and subarctic, resulting in long cold winters, short summers, and little precipitation.&nbsp; The southern Yukon is dotted with a large number of large, long and narrow glacier-fed alpine lakes, most of which flow into the Yukon River system.",
                "quickFilterApplicableId": 3,
                "id": 550
            },
            {
                "name": "Cape Breton Island",
                "description": "Located off the Atlantic coast of Canada, Cape Breton Island, part of the province of Nova Scotia, corresponds to the French word \"Breton\", which can refer to Brittany.&nbsp; Although physically separated from the Nova Scotia peninsula by the Strait of Canso, it is artificially connected to mainland Nova Scotia by the Canso Causeway.&nbsp; The island's residents can be grouped into five main cultures; Scottish, Mi'kmaq, Acadian, Irish, and English, with respective languages Gaelic, Mi'kmaq, French, and English. English is now the primary spoken language, though Mi'kmaq, Gaelic and French are still heard.&nbsp; Cape Breton is well known for its traditional fiddle music, which was brought to North America by Scottish immigrants during the Highland Clearances. The traditional style has been well preserved and céilidhs have become a popular attraction for summer tourists.",
                "quickFilterApplicableId": 3,
                "id": 551
            },
            {
                "name": "Vancouver Island",
                "description": "Vancouver Island is a large island in British Columbia, Canada.&nbsp; In fact, it is the largest island on the western side of North America.&nbsp; The Vancouver Island Ranges run most of the length of the island, dividing it into a wet and rugged west coast and a drier, more rolling east coast.&nbsp; The climate is the mildest in Canada, with temperatures on the coast even in January being usually above 0 °C (32 °F).&nbsp; The fauna of Vancouver Island is similar to that found on the mainland coast, with some notable exceptions and additions. For example, grizzly bears, mountain goats, porcupines, moose, skunks, coyotes, and numerous species of small mammals, while plentiful on the mainland, are absent from Vancouver Island. The island does support most of Canada's Roosevelt elk, however, and one species — the Vancouver Island Marmot — is unique to the island. The island's rivers, lakes, and coastal regions are renowned for their fisheries of trout, salmon, and Steelhead. It has the most concentrated population of cougars in North America.",
                "quickFilterApplicableId": 3,
                "id": 552
            },
            {
                "name": "Devon Island",
                "description": "<P>Devon Island, the largest uninhabited island on Earth, is located in Baffin Bay, Qikiqtaaluk Region, Nunavut, Canada. It is one of the larger members of the Canadian Arctic Archipelago, the second-largest of the Queen Elizabeth Islands, Canada's sixth largest island, and the 27th largest island in the world.</P>",
                "quickFilterApplicableId": 3,
                "id": 553
            },
            {
                "name": "Saskatchewan",
                "description": "Saskatchewan is the largest city in the province of Saskatoon.",
                "quickFilterApplicableId": 3,
                "id": 554
            },
            {
                "name": "Denali National Park",
                "description": "Denali National Park and Preserve is located in Interior Alaska and contains Denali (Mount McKinley), the highest mountain in North America. The park and preserve together cover 9,492&nbsp;mi&sup2; (24,585&nbsp;km&sup2;).&lt;br/br&gt;The word \"Denali\" means \"the high one\" in the native language and refers to the mountain itself. The mountain was named after President William McKinley of Ohio in 1897 by local prospector William A. Dickey, although McKinley had no connection with the region the name is only used by those outside of Alaska. &lt;br/br&gt; Denali is home to a variety of Alaskan birds and mammals, including a healthy population of grizzly bears and black bears. Herds of caribou roam throughout the park. Dall sheep are often seen on mountainsides, and moose feed on the aquatic plants of the small lakes and swamps. Despite human impact on the area, Denali accommodates gray wolf dens, both historic and active. Smaller animals, such as hoary marmots, arctic ground squirrels, beavers, pikas, and snowshoe hares are seen in abundance. Foxes, martens, lynx, wolverines also inhabit the park, but are more rarely seen due to their elusive natures.",
                "quickFilterApplicableId": 3,
                "id": 555
            },
            {
                "name": "Indiana",
                "quickFilterApplicableId": 3,
                "id": 556
            },
            {
                "name": "Indianapolis",
                "quickFilterApplicableId": 3,
                "id": 557
            },
            {
                "name": "Idaho",
                "quickFilterApplicableId": 3,
                "id": 558
            },
            {
                "name": "Oahu",
                "quickFilterApplicableId": 3,
                "id": 559
            },
            {
                "name": "Alabama",
                "quickFilterApplicableId": 3,
                "id": 560
            },
            {
                "name": "Connecticut",
                "quickFilterApplicableId": 3,
                "id": 561
            },
            {
                "name": "Maryland",
                "quickFilterApplicableId": 3,
                "id": 562
            },
            {
                "name": "Orange County",
                "quickFilterApplicableId": 3,
                "id": 563
            },
            {
                "name": "Ohio",
                "quickFilterApplicableId": 3,
                "id": 564
            },
            {
                "name": "Cornwallis Island",
                "quickFilterApplicableId": 3,
                "id": 565
            },
            {
                "name": "Baffin Island",
                "quickFilterApplicableId": 3,
                "id": 566
            },
            {
                "name": "Ellesmere Island",
                "quickFilterApplicableId": 3,
                "id": 567
            },
            {
                "name": "Island of Hawaii (Big Island)",
                "quickFilterApplicableId": 3,
                "id": 568
            },
            {
                "name": "Arlington",
                "quickFilterApplicableId": 3,
                "id": 569
            },
            {
                "name": "National Parks of The West",
                "quickFilterApplicableId": 3,
                "id": 570
            },
            {
                "name": "Southern USA",
                "quickFilterApplicableId": 3,
                "id": 571
            },
            {
                "name": "Northeastern USA",
                "quickFilterApplicableId": 3,
                "id": 572
            },
            {
                "name": "Midwestern USA",
                "quickFilterApplicableId": 3,
                "id": 573
            },
            {
                "name": "Western Canada",
                "quickFilterApplicableId": 3,
                "id": 574
            },
            {
                "name": "Alaska Cruise",
                "quickFilterApplicableId": 3,
                "id": 575
            },
            {
                "name": "District of Columbia",
                "quickFilterApplicableId": 3,
                "id": 1083
            },
            {
                "name": "Florida",
                "quickFilterApplicableId": 3,
                "id": 1084
            },
            {
                "name": "Louisiana",
                "quickFilterApplicableId": 3,
                "id": 1092
            },
            {
                "name": "Manitoba",
                "quickFilterApplicableId": 3,
                "id": 1093
            },
            {
                "name": "Minnesota",
                "quickFilterApplicableId": 3,
                "id": 1095
            },
            {
                "name": "Mississippi",
                "quickFilterApplicableId": 3,
                "id": 1096
            },
            {
                "name": "New England",
                "quickFilterApplicableId": 3,
                "id": 1097
            },
            {
                "name": "North America Cruises",
                "quickFilterApplicableId": 3,
                "id": 1098
            },
            {
                "name": "North America River Cruises",
                "quickFilterApplicableId": 3,
                "id": 1099
            },
            {
                "name": "North Carolina",
                "quickFilterApplicableId": 3,
                "id": 1100
            },
            {
                "name": "North Dakota",
                "quickFilterApplicableId": 3,
                "id": 1101
            },
            {
                "name": "Pacific Northwest",
                "quickFilterApplicableId": 3,
                "id": 1103
            },
            {
                "name": "Ski Canada",
                "quickFilterApplicableId": 3,
                "id": 1108
            },
            {
                "name": "Pennsylvania",
                "description": "",
                "quickFilterApplicableId": 3,
                "id": 1129
            },
            {
                "name": "Canada & New England Cruise",
                "quickFilterApplicableId": 3,
                "id": 1131
            },
            {
                "name": "Ancestry US",
                "quickFilterApplicableId": 3,
                "id": 1135
            }
        ]
    },
    {
        "continent": "Polar Regions",
        "id": 16,
        "countries": [
            {
                "name": "Antarctica",
                "description": "Antarctica is Earth's southernmost continent, overlying the South Pole. It is situated in the southern hemisphere, almost entirely south of the Antarctic Circle, and is surrounded by the Southern Ocean. About 98% of Antarctica is covered by ice, which averages at least 1.6 kilometres (1.0 mi) in thickness. On average, Antarctica is the coldest, driest and windiest continent, and has the highest average elevation of all the continents. Since there is little precipitation, except at the coasts, the interior of the continent is technically the largest desert in the world. There are no permanent human residents. Only cold-adapted plants and animals survive there, including penguins, fur seals, mosses, lichen, and many types of algae. The continent remained largely neglected until the 20th century because of its hostile environment, lack of resources, and isolation. The Antarctic Treaty was signed in 1959 that prohibits military activities and mineral mining, supports scientific research, and protects the continent's ecozone.",
                "quickFilterApplicableId": 3,
                "id": 576
            },
            {
                "name": "South Georgia",
                "description": "South Georgia and the South Sandwich Islands (SGSSI) is a British overseas territory in the southern Atlantic Ocean. It is a remote and inhospitable collection of islands, consisting of South Georgia – which measures approximately 106 miles (171 km) by 18 miles (29 km) – and a chain of smaller islands known as the South Sandwich Islands lying about 400 miles (640 km) to the south-east. There is no native population on any of the islands, and the only present inhabitants are the British Government Officer, Deputy Postmaster, scientists, and support staff from the British Antarctic Survey who maintain scientific bases at Bird Island and at the capital, King Edward Point, as well as museum staff at nearby Grytviken.",
                "quickFilterApplicableId": 3,
                "id": 577
            },
            {
                "name": "Arctic",
                "description": "The Arctic<STRONG> </STRONG>is the region around the Earth's North Pole, opposite the Antarctic region around the South Pole. The Arctic includes the Arctic Ocean, and parts of Canada, Greenland, Russia,&nbsp;the United States, Iceland, Norway, Sweden and Finland. Expeditions can be staged for dogsledding or flights from Oslo, Norway.",
                "quickFilterApplicableId": 3,
                "id": 578
            }
        ]
    },
    {
        "continent": "UltraLuxe - Yachts",
        "id": 18,
        "countries": []
    }
];

/** Response for getAllActivities(). Replace with your fixture. */
export const ACTIVITIES_STUB: Activity[] = [
    {
        "name": "Tours",
        "quickFilterApplicableId": 1,
        "id": 1,
        "externalId": "1"
    },
    {
        "name": "Yacht Tours",
        "quickFilterApplicableId": 1,
        "id": 2,
        "externalId": "11"
    },
    {
        "name": "Voyages",
        "quickFilterApplicableId": 1,
        "id": 5,
        "externalId": "16"
    },
    {
        "name": "Villas",
        "quickFilterApplicableId": 1,
        "id": 6,
        "externalId": "18"
    },
    {
        "name": "Groups",
        "quickFilterApplicableId": 1,
        "id": 7,
        "externalId": "19"
    },
    {
        "name": "Ultraluxe Tours",
        "quickFilterApplicableId": 1,
        "id": 8,
        "externalId": "20"
    },
    {
        "name": "Kensington Vacations",
        "quickFilterApplicableId": 1,
        "id": 9,
        "externalId": "21"
    },
    {
        "name": "Expeditions",
        "quickFilterApplicableId": 1,
        "id": 10,
        "externalId": "22"
    },
    {
        "name": "Yacht Charters",
        "quickFilterApplicableId": 1,
        "id": 11,
        "externalId": "23"
    },
    {
        "name": "ULX Tours",
        "quickFilterApplicableId": 1,
        "id": 12,
        "externalId": "24"
    }
];

/** Response for getAllChannels(). Replace with your fixture. */
export const CHANNELS_STUB: Channel[] = [
    {
        "name": "Direct",
        "quickFilterApplicableId": 2,
        "id": 4
    },
    {
        "name": "Repeat",
        "quickFilterApplicableId": 2,
        "id": 5
    },
    {
        "name": "Agent - New",
        "quickFilterApplicableId": 2,
        "id": 6
    },
    {
        "name": "Agent - Repeat",
        "quickFilterApplicableId": 2,
        "id": 7
    }
];


/** Response for getLeadAssignmentQueue(). Replace with your fixture. */
export const LEAD_ASSIGNMENT_QUEUE_STUB: LeadAssignmentQueueResult[] = [
  {
    "distributionId": 1,
    "distributionName": "DUMMY",
    "priorityQueueAdvisors": [],
    "roundRobinAdvisors": [],
    "selectedAdvisor": {
      "id": 29,
      "firstName": "Maria",
      "lastName": "Herman",
      "email": "maria.herman@kensingtontours.com",
      "externalId": "82D57881-6D25-49E6-8F1F-570DADFF032F",
      "originId": 1,
      "timeZoneId": 18,
      "teamId": 2,
      "userType": "Advisor",
      "reportsToId": 63,
      "receiveLeads": true,
      "maxCapacity": 5,
      "maxMonthlyCapacity": 90,
      "startDate": "2017-01-23T00:00:00+00:00",
      "dateCreated": "2024-12-10T11:13:00+00:00",
      "dateModified": "2026-07-18T01:00:27.6297881+00:00"
    },
    "decisionLog": null
  }
];
