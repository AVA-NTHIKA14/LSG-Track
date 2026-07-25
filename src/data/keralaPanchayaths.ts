export interface PanchayathOption {
  code: string;
  name: string;
  nameMl: string;
  district: string;
}

export const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
] as const;

export type KeralaDistrict = typeof KERALA_DISTRICTS[number];

export const KERALA_PANCHAYATHS: PanchayathOption[] = [
  {
    "code": "G01001",
    "name": "Venganoor Grama Panchayat",
    "nameMl": "വെങ്ങാനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01002",
    "name": "Kalliyoor Grama Panchayat",
    "nameMl": "കല്ലിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01003",
    "name": "Balaramapuram Grama Panchayat",
    "nameMl": "ബാലരാമപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01004",
    "name": "Kottukal Grama Panchayat",
    "nameMl": "കോട്ടുകാൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01005",
    "name": "Kanjiramkulam Grama Panchayat",
    "nameMl": "കഞ്ചിരംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01006",
    "name": "Karumkulam Grama Panchayat",
    "nameMl": "കരുങ്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01007",
    "name": "Poovar Grama Panchayat",
    "nameMl": "പൂവാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01008",
    "name": "Thirupuram Grama Panchayat",
    "nameMl": "തിരുപുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01009",
    "name": "Chenkal Grama Panchayat",
    "nameMl": "ചെങ്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01010",
    "name": "Kulathoor Grama Panchayat",
    "nameMl": "കുളത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01011",
    "name": "Karode Grama Panchayat",
    "nameMl": "കാരോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01012",
    "name": "Parassala Grama Panchayat",
    "nameMl": "പാറശ്ശാല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01013",
    "name": "Perumkadavila Grama Panchayat",
    "nameMl": "പെരുങ്കടവിള ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01014",
    "name": "Kunnathukal Grama Panchayat",
    "nameMl": "കുന്നത്ത്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01015",
    "name": "Vellarada Grama Panchayat",
    "nameMl": "വെള്ളറട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01016",
    "name": "Amboori Grama Panchayat",
    "nameMl": "അമ്പൂരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01017",
    "name": "Aryancode Grama Panchayat",
    "nameMl": "ആര്യൻകോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01018",
    "name": "Ottasekharamangalam Grama Panchayat",
    "nameMl": "ഒറ്റശേഖരമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01019",
    "name": "Kallikkad Grama Panchayat",
    "nameMl": "കള്ളിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01020",
    "name": "Malayinkeezhu Grama Panchayat",
    "nameMl": "മലയിൻകീഴ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01021",
    "name": "Maranalloor Grama Panchayat",
    "nameMl": "മാറനല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01022",
    "name": "Vilavoorkal Grama Panchayat",
    "nameMl": "വിളവൂർക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01023",
    "name": "Vilappil Grama Panchayat",
    "nameMl": "വിളപ്പിൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01024",
    "name": "Kattakada Grama Panchayat",
    "nameMl": "കാട്ടാക്കട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01025",
    "name": "Vellanad Grama Panchayat",
    "nameMl": "വെള്ളനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01026",
    "name": "Aruvikkara Grama Panchayat",
    "nameMl": "അരുവിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01027",
    "name": "Karakulam Grama Panchayat",
    "nameMl": "കാരകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01028",
    "name": "Poovachal Grama Panchayat",
    "nameMl": "പൂവച്ചൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01029",
    "name": "Vithura Grama Panchayat",
    "nameMl": "വിതുര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01030",
    "name": "Tholicode Grama Panchayat",
    "nameMl": "തൊളിക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01031",
    "name": "Aryanad Grama Panchayat",
    "nameMl": "ആര്യനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01032",
    "name": "Kuttichal Grama Panchayat",
    "nameMl": "കുറ്റിച്ചൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01033",
    "name": "Manickal Grama Panchayat",
    "nameMl": "മാണിക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01034",
    "name": "Nellanad Grama Panchayat",
    "nameMl": "നെല്ലനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01035",
    "name": "Pullampara Grama Panchayat",
    "nameMl": "പുള്ളമ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01036",
    "name": "Vamanapuram Grama Panchayat",
    "nameMl": "വാമനപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01037",
    "name": "Kallara Grama Panchayat",
    "nameMl": "കല്ലറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01038",
    "name": "Pangode Grama Panchayat",
    "nameMl": "പാങ്ങോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01039",
    "name": "Nanniyode Grama Panchayat",
    "nameMl": "നന്നിയോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01040",
    "name": "Peringamala Grama Panchayat",
    "nameMl": "പെരിങ്ങമല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01041",
    "name": "Andoorkonam Grama Panchayat",
    "nameMl": "അന്തൂർക്കോണം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01042",
    "name": "Kadinamkulam Grama Panchayat",
    "nameMl": "കഠിനംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01043",
    "name": "Mangalapuram Grama Panchayat",
    "nameMl": "മംഗലപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01044",
    "name": "Pothencode Grama Panchayat",
    "nameMl": "പോത്തൻകോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01045",
    "name": "Azhoor Grama Panchayat",
    "nameMl": "അഴൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01046",
    "name": "Chirayinkeezhu Grama Panchayat",
    "nameMl": "ചിറയിൻകീഴ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01047",
    "name": "Mudakkal Grama Panchayat",
    "nameMl": "മുദാക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01048",
    "name": "Kizhuvilam Grama Panchayat",
    "nameMl": "കിഴുവിലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01049",
    "name": "Kadakkavoor Grama Panchayat",
    "nameMl": "കടയ്ക്കാവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01050",
    "name": "Vakkom Grama Panchayat",
    "nameMl": "വക്കം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01051",
    "name": "Anad Grama Panchayat",
    "nameMl": "ആനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01052",
    "name": "Panavoor Grama Panchayat",
    "nameMl": "പനവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01053",
    "name": "Vembayam Grama Panchayat",
    "nameMl": "വെമ്പായം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01054",
    "name": "Karavaram Grama Panchayat",
    "nameMl": "കരവാരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01055",
    "name": "Nagaroor Grama Panchayat",
    "nameMl": "നഗരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01056",
    "name": "Kilimanoor Grama Panchayat",
    "nameMl": "കിളിമാനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01057",
    "name": "Pazhayakunnummel Grama Panchayat",
    "nameMl": "പഴയകുന്നുമ്മൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01058",
    "name": "Madavoor Grama Panchayat",
    "nameMl": "മടവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01059",
    "name": "Pallickal Grama Panchayat",
    "nameMl": "പള്ളിക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01060",
    "name": "Navayikulam Grama Panchayat",
    "nameMl": "നാവായിക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01061",
    "name": "Chemmaruthy Grama Panchayat",
    "nameMl": "ചെമ്മരുതി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01062",
    "name": "Edava Grama Panchayat",
    "nameMl": "ഇടവ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01063",
    "name": "Elakamon Grama Panchayat",
    "nameMl": "ഇലകമൺ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01064",
    "name": "Manamboor Grama Panchayat",
    "nameMl": "മണമ്പൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01065",
    "name": "Ottoor Grama Panchayat",
    "nameMl": "ഒറ്റൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01066",
    "name": "Vettoor Grama Panchayat",
    "nameMl": "വെട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01067",
    "name": "Cherunniyoor Grama Panchayat",
    "nameMl": "ചെറുന്നിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G02001",
    "name": "Kundara Grama Panchayat",
    "nameMl": "കുണ്ടറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02002",
    "name": "East Kallada Grama Panchayat",
    "nameMl": "കിഴക്കേ കല്ലട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02003",
    "name": "West Kallada Grama Panchayat",
    "nameMl": "പടിഞ്ഞാറേ കല്ലട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02004",
    "name": "Munroethuruthu Grama Panchayat",
    "nameMl": "മൺറോത്തുരുത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02005",
    "name": "Perinad Grama Panchayat",
    "nameMl": "പെരിനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02006",
    "name": "Panmana Grama Panchayat",
    "nameMl": "പന്മന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02007",
    "name": "Thevalakkara Grama Panchayat",
    "nameMl": "തേവലക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02008",
    "name": "Neendakara Grama Panchayat",
    "nameMl": "നീണ്ടകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02009",
    "name": "Chavara Grama Panchayat",
    "nameMl": "ചവറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02010",
    "name": "Thekkumbhagam Grama Panchayat",
    "nameMl": "തെക്കുംഭാഗം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02011",
    "name": "Clappana Grama Panchayat",
    "nameMl": "ക്ലാപ്പന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02012",
    "name": "Kulasekharapuram Grama Panchayat",
    "nameMl": "കുലശേഖരപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02013",
    "name": "Oachira Grama Panchayat",
    "nameMl": "ഓച്ചിറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02014",
    "name": "Thazhava Grama Panchayat",
    "nameMl": "തഴവ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02015",
    "name": "Alappad Grama Panchayat",
    "nameMl": "അളപ്പാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02016",
    "name": "Sooranad North Grama Panchayat",
    "nameMl": "ശൂരനാട് നോർത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02017",
    "name": "Sooranad South Grama Panchayat",
    "nameMl": "ശൂരനാട് സൗത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02018",
    "name": "Sasthamkotta Grama Panchayat",
    "nameMl": "ശാസ്താംകോട്ട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02019",
    "name": "Kunnathoor Grama Panchayat",
    "nameMl": "കുന്നത്ത്ൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02020",
    "name": "Poruvazhy Grama Panchayat",
    "nameMl": "പോരുവഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02021",
    "name": "Pavithreswaram Grama Panchayat",
    "nameMl": "പവിത്രേശ്വരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02022",
    "name": "Puthoor Grama Panchayat",
    "nameMl": "പുത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02023",
    "name": "Neduvathoor Grama Panchayat",
    "nameMl": "നെടുവത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02024",
    "name": "Kulakkada Grama Panchayat",
    "nameMl": "കുളക്കട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02025",
    "name": "Mylom Grama Panchayat",
    "nameMl": "മൈലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02026",
    "name": "Melila Grama Panchayat",
    "nameMl": "മേലില ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02027",
    "name": "Vettikavala Grama Panchayat",
    "nameMl": "വെട്ടിക്കവല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02028",
    "name": "Ummannoor Grama Panchayat",
    "nameMl": "ഉമ്മന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02029",
    "name": "Ezhukone Grama Panchayat",
    "nameMl": "എഴുകോൺ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02030",
    "name": "Kareepra Grama Panchayat",
    "nameMl": "കരീപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02031",
    "name": "Veliyam Grama Panchayat",
    "nameMl": "വെളിയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02032",
    "name": "Pooyappally Grama Panchayat",
    "nameMl": "പൂയപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02033",
    "name": "Elamad Grama Panchayat",
    "nameMl": "ഇളമാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02034",
    "name": "Chadayamangalam Grama Panchayat",
    "nameMl": "ചടയമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02035",
    "name": "Itthikkara Grama Panchayat",
    "nameMl": "ഇത്തിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02036",
    "name": "Chathannoor Grama Panchayat",
    "nameMl": "ചാത്തന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02037",
    "name": "Kalluvathukkal Grama Panchayat",
    "nameMl": "കല്ലുവാതുക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02038",
    "name": "Parippally Grama Panchayat",
    "nameMl": "പാരിപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02039",
    "name": "Adichanalloor Grama Panchayat",
    "nameMl": "ആദിച്ചനല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02040",
    "name": "Poothakkulam Grama Panchayat",
    "nameMl": "പൂതക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02041",
    "name": "Elampalloor Grama Panchayat",
    "nameMl": "ഇളമ്പള്ളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02042",
    "name": "Kottamkara Grama Panchayat",
    "nameMl": "കൊറ്റങ്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02043",
    "name": "Nedumpana Grama Panchayat",
    "nameMl": "നെടുമ്പന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02044",
    "name": "Mayyanad Grama Panchayat",
    "nameMl": "മയ്യനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02045",
    "name": "Trikkovilvattom Grama Panchayat",
    "nameMl": "തൃക്കോവിൽവട്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02046",
    "name": "Chithara Grama Panchayat",
    "nameMl": "ചിതറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02047",
    "name": "Kadakkal Grama Panchayat",
    "nameMl": "കടയ്ക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02048",
    "name": "Kummil Grama Panchayat",
    "nameMl": "കുമ്മിൾ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02049",
    "name": "Nilamel Grama Panchayat",
    "nameMl": "നിലമേൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02050",
    "name": "Anchal Grama Panchayat",
    "nameMl": "അഞ്ചൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02051",
    "name": "Ayoor Grama Panchayat",
    "nameMl": "ആയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02052",
    "name": "Edamulakkal Grama Panchayat",
    "nameMl": "ഇടമുളയ്ക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02053",
    "name": "Eroor Grama Panchayat",
    "nameMl": "ഏരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02054",
    "name": "Karavaloor Grama Panchayat",
    "nameMl": "കരവാളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02055",
    "name": "Kulathupuzha Grama Panchayat",
    "nameMl": "കുളത്തൂപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02056",
    "name": "Aryankavu Grama Panchayat",
    "nameMl": "ആര്യൻകാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02057",
    "name": "Thenmala Grama Panchayat",
    "nameMl": "തെന്മല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02058",
    "name": "Piravanthoor Grama Panchayat",
    "nameMl": "പിറവന്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02059",
    "name": "Vilakkudy Grama Panchayat",
    "nameMl": "വിളക്കുടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02060",
    "name": "Pathanapuram Grama Panchayat",
    "nameMl": "പത്തനാപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02061",
    "name": "Pattazhy Grama Panchayat",
    "nameMl": "പട്ടാഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02062",
    "name": "Pattazhy Vadakkekara Grama Panchayat",
    "nameMl": "പട്ടാഴി വടക്കേക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02063",
    "name": "Thalavoor Grama Panchayat",
    "nameMl": "തലവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G11001",
    "name": "Azhiyur Grama Panchayat",
    "nameMl": "അഴിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11002",
    "name": "Chorode Grama Panchayat",
    "nameMl": "ചോറോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11003",
    "name": "Eramala Grama Panchayat",
    "nameMl": "ഏറാമല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11004",
    "name": "Onchiyam Grama Panchayat",
    "nameMl": "ഒഞ്ചിയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11005",
    "name": "Chekkiad Grama Panchayat",
    "nameMl": "ചെക്യാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11006",
    "name": "Purameri Grama Panchayat",
    "nameMl": "പുറമേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11007",
    "name": "Thuneri Grama Panchayat",
    "nameMl": "തൂണേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11008",
    "name": "Edacheri Grama Panchayat",
    "nameMl": "എടച്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11009",
    "name": "Valayam Grama Panchayat",
    "nameMl": "വളയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11010",
    "name": "Vanimel Grama Panchayat",
    "nameMl": "വാണിമേൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11011",
    "name": "Kayakkody Grama Panchayat",
    "nameMl": "കായക്കൊടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11012",
    "name": "Narippatta Grama Panchayat",
    "nameMl": "നരിപ്പറ്റ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11013",
    "name": "Kavilumpara Grama Panchayat",
    "nameMl": "കാവിലുംപാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11014",
    "name": "Maruthonkara Grama Panchayat",
    "nameMl": "മരുതോങ്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11015",
    "name": "Kuttiady Grama Panchayat",
    "nameMl": "കുറ്റ്യാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11016",
    "name": "Velom Grama Panchayat",
    "nameMl": "വേളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11017",
    "name": "Kunnummal Grama Panchayat",
    "nameMl": "കുന്നുമ്മൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11018",
    "name": "Ayancheri Grama Panchayat",
    "nameMl": "ആയഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11019",
    "name": "Villiappally Grama Panchayat",
    "nameMl": "വില്യാപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11020",
    "name": "Thiruvallur Grama Panchayat",
    "nameMl": "തിരുവള്ളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11021",
    "name": "Maniyoor Grama Panchayat",
    "nameMl": "മണിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11022",
    "name": "Payyoli Grama Panchayat",
    "nameMl": "പയ്യോളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11023",
    "name": "Thikkodi Grama Panchayat",
    "nameMl": "തിക്കോടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11024",
    "name": "Moodadi Grama Panchayat",
    "nameMl": "മൂടാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11025",
    "name": "Chengottukavu Grama Panchayat",
    "nameMl": "ചെങ്ങോട്ടുകാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11026",
    "name": "Arikkulam Grama Panchayat",
    "nameMl": "അരീക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11027",
    "name": "Meppayur Grama Panchayat",
    "nameMl": "മേപ്പയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11028",
    "name": "Cheruvannur Grama Panchayat",
    "nameMl": "ചെറുവണ്ണൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11029",
    "name": "Nochad Grama Panchayat",
    "nameMl": "നൊച്ചാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11030",
    "name": "Keezhariyur Grama Panchayat",
    "nameMl": "കീഴരിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11031",
    "name": "Balussery Grama Panchayat",
    "nameMl": "ബാലുശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11032",
    "name": "Kottur Grama Panchayat",
    "nameMl": "കൊട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11033",
    "name": "Unnikulam Grama Panchayat",
    "nameMl": "ഉണ്ണികുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11034",
    "name": "Panangad Grama Panchayat",
    "nameMl": "പനങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11035",
    "name": "Koorachundu Grama Panchayat",
    "nameMl": "കൂരാച്ചുണ്ട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11036",
    "name": "Chakkittapara Grama Panchayat",
    "nameMl": "ചക്കിട്ടപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11037",
    "name": "Kayanna Grama Panchayat",
    "nameMl": "കായണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11038",
    "name": "Ulliyeri Grama Panchayat",
    "nameMl": "ഉള്ള്യേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11039",
    "name": "Atholi Grama Panchayat",
    "nameMl": "അത്തോളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11040",
    "name": "Nanmanda Grama Panchayat",
    "nameMl": "നന്മണ്ട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11041",
    "name": "Narikkuni Grama Panchayat",
    "nameMl": "നരിക്കുനി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11042",
    "name": "Kattippara Grama Panchayat",
    "nameMl": "കാട്ടിപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11043",
    "name": "Koduvally Grama Panchayat",
    "nameMl": "കൊടുവള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11044",
    "name": "Kizhakkoth Grama Panchayat",
    "nameMl": "കിഴക്കോത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11045",
    "name": "Madavoor Grama Panchayat",
    "nameMl": "മടവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11046",
    "name": "Thamarassery Grama Panchayat",
    "nameMl": "താമരശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11047",
    "name": "Omassery Grama Panchayat",
    "nameMl": "ഓമശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11048",
    "name": "Koodaranji Grama Panchayat",
    "nameMl": "കൂടരഞ്ഞി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11049",
    "name": "Thiruvambady Grama Panchayat",
    "nameMl": "തിരുവമ്പാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11050",
    "name": "Kodiyathur Grama Panchayat",
    "nameMl": "കൊടിയത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11051",
    "name": "Karassery Grama Panchayat",
    "nameMl": "കാരശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11052",
    "name": "Kunnamangalam Grama Panchayat",
    "nameMl": "കുന്ദമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11053",
    "name": "Chathamangalam Grama Panchayat",
    "nameMl": "ചാത്തമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11054",
    "name": "Mavoor Grama Panchayat",
    "nameMl": "മാവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11055",
    "name": "Peruvayal Grama Panchayat",
    "nameMl": "പെരുവയൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11056",
    "name": "Perumanna Grama Panchayat",
    "nameMl": "പെരുമണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11057",
    "name": "Olavanna Grama Panchayat",
    "nameMl": "ഒളവണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11058",
    "name": "Kadalundi Grama Panchayat",
    "nameMl": "കടലുണ്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11059",
    "name": "Kakkodi Grama Panchayat",
    "nameMl": "കക്കോടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11060",
    "name": "Chelannur Grama Panchayat",
    "nameMl": "ചേളന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11061",
    "name": "Kakkur Grama Panchayat",
    "nameMl": "കാക്കൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11062",
    "name": "Thalakulathur Grama Panchayat",
    "nameMl": "തലക്കുളത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G07001",
    "name": "Alangad Grama Panchayat",
    "nameMl": "ആലങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07002",
    "name": "Kizhakkambalam Grama Panchayat",
    "nameMl": "കിഴക്കമ്പലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07003",
    "name": "Vazhakulam Grama Panchayat",
    "nameMl": "വാഴക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07004",
    "name": "Choornikkara Grama Panchayat",
    "nameMl": "ചൂർണ്ണിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07005",
    "name": "Edathala Grama Panchayat",
    "nameMl": "എടത്തല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07006",
    "name": "Keezhmad Grama Panchayat",
    "nameMl": "കീഴ്മാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07007",
    "name": "Kadamakkudy Grama Panchayat",
    "nameMl": "കടമക്കുടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07008",
    "name": "Cheranalloor Grama Panchayat",
    "nameMl": "ചേരാനല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07009",
    "name": "Mulavukad Grama Panchayat",
    "nameMl": "മുളവുകാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07010",
    "name": "Elamkunnapuzha Grama Panchayat",
    "nameMl": "എളങ്കുന്നപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07011",
    "name": "Njarakal Grama Panchayat",
    "nameMl": "ഞാറക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07012",
    "name": "Nayarambalam Grama Panchayat",
    "nameMl": "നായരമ്പലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07013",
    "name": "Edavanakkad Grama Panchayat",
    "nameMl": "എടവനക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07014",
    "name": "Kuzhuppilly Grama Panchayat",
    "nameMl": "കുഴുപ്പിള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07015",
    "name": "Pallippuram Grama Panchayat",
    "nameMl": "പള്ളിപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07016",
    "name": "Moothakunnam Grama Panchayat",
    "nameMl": "മൂത്തകുന്നം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07017",
    "name": "Vadapally Grama Panchayat",
    "nameMl": "വടക്കേക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07018",
    "name": "Chendamangalam Grama Panchayat",
    "nameMl": "ചേന്ദമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07019",
    "name": "Puthenvelikkara Grama Panchayat",
    "nameMl": "പുത്തൻവേലിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07020",
    "name": "Kunnukara Grama Panchayat",
    "nameMl": "കുന്നുക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07021",
    "name": "Karumalloor Grama Panchayat",
    "nameMl": "കടുങ്ങല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07022",
    "name": "Kadungalloor Grama Panchayat",
    "nameMl": "കടുങ്ങല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07023",
    "name": "Varapuzha Grama Panchayat",
    "nameMl": "വരാപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07024",
    "name": "Kottuvally Grama Panchayat",
    "nameMl": "കോട്ടുവള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07025",
    "name": "Ezhikkara Grama Panchayat",
    "nameMl": "ഏഴിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07026",
    "name": "Kumbalangi Grama Panchayat",
    "nameMl": "കുമ്പളങ്ങി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07027",
    "name": "Chellanam Grama Panchayat",
    "nameMl": "ചെല്ലാനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07028",
    "name": "Kumbalam Grama Panchayat",
    "nameMl": "കുമ്പളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07029",
    "name": "Udayamperoor Grama Panchayat",
    "nameMl": "ഉദയംപേരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07030",
    "name": "Amballoor Grama Panchayat",
    "nameMl": "ആമ്പല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07031",
    "name": "Edakkattuvayal Grama Panchayat",
    "nameMl": "എടക്കാട്ടുവയൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07032",
    "name": "Maneed Grama Panchayat",
    "nameMl": "മണീട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07033",
    "name": "Ramamangalam Grama Panchayat",
    "nameMl": "രാമമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07034",
    "name": "Pambakuda Grama Panchayat",
    "nameMl": "പാമ്പാക്കുട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07035",
    "name": "Elanji Grama Panchayat",
    "nameMl": "ഇലഞ്ഞി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07036",
    "name": "Thiruvaniyoor Grama Panchayat",
    "nameMl": "തിരുവാണിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07037",
    "name": "Vadavucode-Puthencruz Grama Panchayat",
    "nameMl": "വടവുകോട് പുത്തൻകുരിശ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07038",
    "name": "Aikaranad Grama Panchayat",
    "nameMl": "ഐക്കരനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07039",
    "name": "Poothrikka Grama Panchayat",
    "nameMl": "പൂതൃക്ക ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07040",
    "name": "Mazhuvannoor Grama Panchayat",
    "nameMl": "മഴുവന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07041",
    "name": "Kunnathunad Grama Panchayat",
    "nameMl": "കുന്നത്തുനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07042",
    "name": "Vengola Grama Panchayat",
    "nameMl": "വെങ്ങോല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07043",
    "name": "Rayamangalam Grama Panchayat",
    "nameMl": "രായമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07044",
    "name": "Asamannoor Grama Panchayat",
    "nameMl": "അസമന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07045",
    "name": "Koovappady Grama Panchayat",
    "nameMl": "കൂവപ്പടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07046",
    "name": "Mudakuzha Grama Panchayat",
    "nameMl": "മുതക്കുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07047",
    "name": "Vengoor Grama Panchayat",
    "nameMl": "വെങ്ങൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07048",
    "name": "Okkal Grama Panchayat",
    "nameMl": "ഒക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07049",
    "name": "Kalady Grama Panchayat",
    "nameMl": "കാലടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07050",
    "name": "Kanjoor Grama Panchayat",
    "nameMl": "കഞ്ഞൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07051",
    "name": "Sreemoolanagaram Grama Panchayat",
    "nameMl": "ശ്രീമൂലനഗരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07052",
    "name": "Malayattoor-Neeleeswaram Grama Panchayat",
    "nameMl": "മലയാറ്റൂർ നീലീശ്വരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07053",
    "name": "Manjapra Grama Panchayat",
    "nameMl": "മഞ്ഞപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07054",
    "name": "Karukutty Grama Panchayat",
    "nameMl": "കറുകുറ്റി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07055",
    "name": "Mookkannoor Grama Panchayat",
    "nameMl": "മൂക്കന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07056",
    "name": "Thuravoor Grama Panchayat",
    "nameMl": "തുറവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07057",
    "name": "Ayyampuzha Grama Panchayat",
    "nameMl": "അയ്യമ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07058",
    "name": "Kavalangad Grama Panchayat",
    "nameMl": "കവളങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07059",
    "name": "Keerampara Grama Panchayat",
    "nameMl": "കീരംപാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07060",
    "name": "Kottappady Grama Panchayat",
    "nameMl": "കോട്ടപ്പടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07061",
    "name": "Pindimana Grama Panchayat",
    "nameMl": "പിണ്ടിമന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07062",
    "name": "Kuttampuzha Grama Panchayat",
    "nameMl": "കുട്ടമ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07063",
    "name": "Varappetty Grama Panchayat",
    "nameMl": "വാരപ്പെട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07064",
    "name": "Pothanicad Grama Panchayat",
    "nameMl": "പോത്താനിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07065",
    "name": "Paingottoor Grama Panchayat",
    "nameMl": "പൈങ്ങോട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07066",
    "name": "Kallorkkad Grama Panchayat",
    "nameMl": "കല്ലൂർക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07067",
    "name": "Manjalloor Grama Panchayat",
    "nameMl": "മഞ്ഞള്ളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07068",
    "name": "Arakuzha Grama Panchayat",
    "nameMl": "അറക്കുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07069",
    "name": "Avoly Grama Panchayat",
    "nameMl": "ആവോലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07070",
    "name": "Ayavana Grama Panchayat",
    "nameMl": "ആയവന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07071",
    "name": "Valakom Grama Panchayat",
    "nameMl": "വളകം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07072",
    "name": "Marady Grama Panchayat",
    "nameMl": "മാറാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07073",
    "name": "Paipra Grama Panchayat",
    "nameMl": "പൈപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07074",
    "name": "Palakuzha Grama Panchayat",
    "nameMl": "പാലക്കുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07075",
    "name": "Thirumarady Grama Panchayat",
    "nameMl": "തിരുമാറാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G110706",
    "name": "Panangad Grama Panchayat",
    "nameMl": "പനങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "204902",
    "name": "Chakkittapara Grama Panchayat",
    "nameMl": "ചക്കിട്ടപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G070702",
    "name": "Kizhakkambalam Grama Panchayat",
    "nameMl": "കിഴക്കമ്പലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  }
];

export function getPanchayathsByDistrict(district: string): PanchayathOption[] {
  return KERALA_PANCHAYATHS.filter(p => p.district.toLowerCase() === district.toLowerCase());
}

export function getPanchayathByCode(code: string): PanchayathOption | undefined {
  return KERALA_PANCHAYATHS.find(p => p.code.toLowerCase() === code.trim().toLowerCase());
}

export function getPanchayathCenterCoordinates(code: string): [number, number] {
  const panchayath = getPanchayathByCode(code);
  const districtCoords: Record<string, [number, number]> = {
    'Thiruvananthapuram': [8.5241, 76.9366],
    'Kollam': [8.8932, 76.6141],
    'Pathanamthitta': [9.2648, 76.7870],
    'Alappuzha': [9.4981, 76.3388],
    'Kottayam': [9.5916, 76.5222],
    'Idukki': [9.8497, 76.9806],
    'Ernakulam': [10.0261, 76.3125],
    'Thrissur': [10.5276, 76.2144],
    'Palakkad': [10.7867, 76.6548],
    'Malappuram': [11.0730, 76.0740],
    'Kozhikode': [11.4580, 75.8850],
    'Wayanad': [11.6854, 76.1320],
    'Kannur': [11.8745, 75.3704],
    'Kasaragod': [12.5102, 74.9852]
  };
  if (panchayath && districtCoords[panchayath.district]) {
    return districtCoords[panchayath.district];
  }
  return [11.4580, 75.8850];
}
