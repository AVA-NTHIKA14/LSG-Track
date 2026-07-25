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
    "code": "G14001",
    "name": "Vorkady Grama Panchayat",
    "nameMl": "വോര്‍ക്കാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14002",
    "name": "Manjeswaram Grama Panchayat",
    "nameMl": "മഞ്ചേശ്വരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14003",
    "name": "Paivalike Grama Panchayat",
    "nameMl": "പൈവെളിഗെ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14004",
    "name": "Meenja Grama Panchayat",
    "nameMl": "മീഞ്ച ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14005",
    "name": "Mangalpaddy Grama Panchayat",
    "nameMl": "മംഗൽപ്പാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14006",
    "name": "Puthige Grama Panchayat",
    "nameMl": "പുത്തിഗെ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14007",
    "name": "Kumbala Grama Panchayat",
    "nameMl": "കുമ്പള ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14008",
    "name": "Enmakaje Grama Panchayat",
    "nameMl": "എന്‍മകജെ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14009",
    "name": "Madhur Grama Panchayat",
    "nameMl": "മധൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14010",
    "name": "Mogral-Puthur Grama Panchayat",
    "nameMl": "മൊഗ്രാല്‍ പുത്തൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14011",
    "name": "Badiadka Grama Panchayat",
    "nameMl": "Badiadka Grama Panchayat",
    "district": "Kasaragod"
  },
  {
    "code": "G14012",
    "name": "Kumbadaje Grama Panchayat",
    "nameMl": "കുംബടജെ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14013",
    "name": "Beloor Grama Panchayat",
    "nameMl": "ബേലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14014",
    "name": "Chengala Grama Panchayat",
    "nameMl": "ചെങ്കള ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14015",
    "name": "Karaduka Grama Panchayat",
    "nameMl": "കാറഡുക്ക ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14016",
    "name": "Kasaragod Grama Panchayat",
    "nameMl": "കാസർഗോഡ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14017",
    "name": "Chemnad Grama Panchayat",
    "nameMl": "ചെമ്മനാടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14018",
    "name": "Muliyar Grama Panchayat",
    "nameMl": "മൂളിയാര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14019",
    "name": "Bedadka Grama Panchayat",
    "nameMl": "ബേടഡുക്ക ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14020",
    "name": "Delampadi Grama Panchayat",
    "nameMl": "ദേലമ്പാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14021",
    "name": "Kuttikol Grama Panchayat",
    "nameMl": "കുറ്റിക്കോല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14022",
    "name": "Kallar Grama Panchayat",
    "nameMl": "കള്ളാര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14023",
    "name": "Pananthadi Grama Panchayat",
    "nameMl": "പനത്തടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14024",
    "name": "Kodom-Belur Grama Panchayat",
    "nameMl": "കോടോം ബേളൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14025",
    "name": "Balal Grama Panchayat",
    "nameMl": "ബളാല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14026",
    "name": "Kinanur-Karindalam Grama Panchayat",
    "nameMl": "കിനാനീര്‍ കരിന്തളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14027",
    "name": "East Eleri Grama Panchayat",
    "nameMl": "ഈസ്റ്റ് എളേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14028",
    "name": "West Eleri Grama Panchayat",
    "nameMl": "വെസ്റ്റ് എളേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14029",
    "name": "Uduma Grama Panchayat",
    "nameMl": "ഉദുമ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14030",
    "name": "Pallikkara Grama Panchayat",
    "nameMl": "പള്ളിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14031",
    "name": "Ajanur Grama Panchayat",
    "nameMl": "അജാനൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14032",
    "name": "Pullur-Periya Grama Panchayat",
    "nameMl": "പുല്ലൂര്‍ പെരിയ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14033",
    "name": "Kanhangad Grama Panchayat",
    "nameMl": "കാഞ്ഞങ്ങാടു് നഗരസഭ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14034",
    "name": "Madikai Grama Panchayat",
    "nameMl": "മടിക്കൈ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14035",
    "name": "Nileswaram Grama Panchayat",
    "nameMl": "നീലേശ്വരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14036",
    "name": "Kayyur-Chimeni Grama Panchayat",
    "nameMl": "കയ്യൂര്‍ ചീമേനി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14037",
    "name": "Cheruvathur Grama Panchayat",
    "nameMl": "ചെറുവത്തൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14038",
    "name": "Pilicode Grama Panchayat",
    "nameMl": "Pilicode Grama Panchayat",
    "district": "Kasaragod"
  },
  {
    "code": "G13001",
    "name": "Valiyaparampa Grama Panchayat",
    "nameMl": "വലിയപറമ്പ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13002",
    "name": "Padanna Grama Panchayat",
    "nameMl": "പടന്ന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13003",
    "name": "Thrikkarippur Grama Panchayat",
    "nameMl": "തൃക്കരിപ്പൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13004",
    "name": "Ramanthali Grama Panchayat",
    "nameMl": "Ramanthali Grama Panchayat",
    "district": "Kannur"
  },
  {
    "code": "G13005",
    "name": "Payyannur Grama Panchayat",
    "nameMl": "പയ്യന്നൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13006",
    "name": "Karvellur-Peralam Grama Panchayat",
    "nameMl": "കരിവെള്ളൂര്‍ പെരളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13007",
    "name": "Kankol-Alappadamba Grama Panchayat",
    "nameMl": "Kankol-Alappadamba Grama Panchayat",
    "district": "Kannur"
  },
  {
    "code": "G14039",
    "name": "Perongome Vayakkara Grama Panchayat",
    "nameMl": "പെരിങ്ങോം വയക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14040",
    "name": "Cherupuzha Grama Panchayat",
    "nameMl": "ಚೆರುಪುಝ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G13008",
    "name": "Eramam Kuttur Grama Panchayat",
    "nameMl": "എരമം കുറ്റൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13009",
    "name": "Kadannappally Panapuzha Grama Panchayat",
    "nameMl": "കടന്നപ്പള്ളി പാണപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13010",
    "name": "Cheruthazham Grama Panchayat",
    "nameMl": "ചെറുതാഴം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13011",
    "name": "Kunhimangalam Grama Panchayat",
    "nameMl": "കുഞ്ഞിമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13012",
    "name": "Madayi Grama Panchayat",
    "nameMl": "മാടായി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13013",
    "name": "Ezhome Grama Panchayat",
    "nameMl": "ഏഴോം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G14041",
    "name": "Udayagiri Grama Panchayat",
    "nameMl": "ഉദയഗിരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G14042",
    "name": "Alakode Grama Panchayat",
    "nameMl": "ആലക്കോടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kasaragod"
  },
  {
    "code": "G13014",
    "name": "Chapparapadavu Grama Panchayat",
    "nameMl": "ചപ്പാരപ്പടവു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13015",
    "name": "Thaliparambu Grama Panchayat",
    "nameMl": "തളിപ്പറമ്പു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13016",
    "name": "Pariyaram Grama Panchayat",
    "nameMl": "പരിയാരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13017",
    "name": "Pattuvam Grama Panchayat",
    "nameMl": "പട്ടുവം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13018",
    "name": "Cherukunnu Grama Panchayat",
    "nameMl": "Cherukunnu Grama Panchayat",
    "district": "Kannur"
  },
  {
    "code": "G13019",
    "name": "Mattool Grama Panchayat",
    "nameMl": "Mattool Grama Panchayat",
    "district": "Kannur"
  },
  {
    "code": "G13020",
    "name": "Kurumathur Grama Panchayat",
    "nameMl": "കുറുമാത്തൂര് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13021",
    "name": "Chengalayi Grama Panchayat",
    "nameMl": "ചെങ്ങളായി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13022",
    "name": "Naduvil Grama Panchayat",
    "nameMl": "നടുവില്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13023",
    "name": "Eruvessy Grama Panchayat",
    "nameMl": "എരുവട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13024",
    "name": "Payyavoor Grama Panchayat",
    "nameMl": "പയ്യാവൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13025",
    "name": "Sreekandapuram Grama Panchayat",
    "nameMl": "ശ്രീകണ്ഠാപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13026",
    "name": "Irikkur Grama Panchayat",
    "nameMl": "ഇരിക്കൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13027",
    "name": "Malappattam Grama Panchayat",
    "nameMl": "മലപ്പട്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13028",
    "name": "Kuttiatoor Grama Panchayat",
    "nameMl": "കുറ്റ്യാട്ടൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13029",
    "name": "Mayyil Grama Panchayat",
    "nameMl": "മയ്യില്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13030",
    "name": "Kolacherry Grama Panchayat",
    "nameMl": "കൊളച്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13031",
    "name": "Anthoor Grama Panchayat",
    "nameMl": "Anthoor Grama Panchayat",
    "district": "Kannur"
  },
  {
    "code": "G13032",
    "name": "Kannapuram Grama Panchayat",
    "nameMl": "കണ്ണപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13033",
    "name": "Kalliasseri Grama Panchayat",
    "nameMl": "കല്യാശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13034",
    "name": "Azhikode Grama Panchayat",
    "nameMl": "അഴിക്കോടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13035",
    "name": "Valapattanam Grama Panchayat",
    "nameMl": "വളപട്ടണം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13036",
    "name": "Pappinisseri Grama Panchayat",
    "nameMl": "പാപ്പിനിശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13037",
    "name": "Chirakkal Grama Panchayat",
    "nameMl": "ചിറക്കല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13038",
    "name": "Narath Grama Panchayat",
    "nameMl": "നാറാത്തു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13039",
    "name": "Munderi Grama Panchayat",
    "nameMl": "മുണ്ടേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13040",
    "name": "Anjarakandy Grama Panchayat",
    "nameMl": "അഞ്ചരക്കണ്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13041",
    "name": "Peralassery Grama Panchayat",
    "nameMl": "പെരളശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13042",
    "name": "Chembilode Grama Panchayat",
    "nameMl": "ചെമ്പിലോട്ടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13043",
    "name": "Kadambur Grama Panchayat",
    "nameMl": "കടമ്പൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13044",
    "name": "Muzhappilangad Grama Panchayat",
    "nameMl": "മുഴപ്പിലങ്ങാടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13045",
    "name": "Kannur Grama Panchayat",
    "nameMl": "കണ്ണൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13046",
    "name": "Ulikkal Grama Panchayat",
    "nameMl": "ഉള്ളിക്കല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13047",
    "name": "Padiyoor Grama Panchayat",
    "nameMl": "പടിയൂർ-കല്യാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13048",
    "name": "Payam Grama Panchayat",
    "nameMl": "പായം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13049",
    "name": "Iritty Grama Panchayat",
    "nameMl": "ഇരിട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13050",
    "name": "Thillankery Grama Panchayat",
    "nameMl": "തില്ലങ്കേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13051",
    "name": "Muzhakkunnu Grama Panchayat",
    "nameMl": "മുഴക്കുന്നു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13052",
    "name": "Peravoor Grama Panchayat",
    "nameMl": "പേരാവൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13053",
    "name": "Kanichar Grama Panchayat",
    "nameMl": "കണിച്ചാര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13054",
    "name": "Ayyankunnu Grama Panchayat",
    "nameMl": "അയ്യന്‍കുന്നു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13055",
    "name": "Aralam Grama Panchayat",
    "nameMl": "ആറളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G12001",
    "name": "Kottiyoor Grama Panchayat",
    "nameMl": "കൊട്ടിയൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G13056",
    "name": "Kelakam Grama Panchayat",
    "nameMl": "കേളകം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13057",
    "name": "Koodali Grama Panchayat",
    "nameMl": "കൂടാളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13058",
    "name": "Keezhallur Grama Panchayat",
    "nameMl": "കീഴാല്ലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13059",
    "name": "Mattannur Grama Panchayat",
    "nameMl": "മട്ടന്നൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13060",
    "name": "Malur Grama Panchayat",
    "nameMl": "മാലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13061",
    "name": "Kolayad Grama Panchayat",
    "nameMl": "കോളയാടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13062",
    "name": "Triprangottoor Grama Panchayat",
    "nameMl": "തൃപ്പങ്ങോട്ടൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13063",
    "name": "Kunnothuparamba Grama Panchayat",
    "nameMl": "കുന്നോത്തുപറമ്പു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13064",
    "name": "Pattiam Grama Panchayat",
    "nameMl": "പാട്യം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13065",
    "name": "Chittariparamba Grama Panchayat",
    "nameMl": "ചിറ്റാരിപറമ്പു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13066",
    "name": "Koothuparamba Grama Panchayat",
    "nameMl": "കൂത്തുപറമ്പ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13067",
    "name": "Mangattidam Grama Panchayat",
    "nameMl": "മാങ്ങാട്ടിടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13068",
    "name": "Vengad Grama Panchayat",
    "nameMl": "വേങ്ങാടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13069",
    "name": "Pinarayi Grama Panchayat",
    "nameMl": "പിണറായി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13070",
    "name": "Kottayam Grama Panchayat",
    "nameMl": "കോട്ടയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13071",
    "name": "Mokeri Grama Panchayat",
    "nameMl": "മൊകേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13072",
    "name": "Kadirur Grama Panchayat",
    "nameMl": "കതിരൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13073",
    "name": "Eranholi Grama Panchayat",
    "nameMl": "എരിഞ്ഞോളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G13074",
    "name": "Dharmadam Grama Panchayat",
    "nameMl": "ധര്‍മ്മടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G11001",
    "name": "Thalassery Grama Panchayat",
    "nameMl": "തലശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G13075",
    "name": "Panniyannur Grama Panchayat",
    "nameMl": "പന്യന്നൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G11002",
    "name": "Chokli Grama Panchayat",
    "nameMl": "ചൊക്ലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11003",
    "name": "Panoor Grama Panchayat",
    "nameMl": "പാനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11004",
    "name": "New Mahe Grama Panchayat",
    "nameMl": "ന്യൂമാഹി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G12002",
    "name": "Thondernad Grama Panchayat",
    "nameMl": "തൊണ്ടര്‍നാടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12003",
    "name": "Thavinhal Grama Panchayat",
    "nameMl": "തവിഞ്ഞാല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12004",
    "name": "Thirunelly Grama Panchayat",
    "nameMl": "തിരുനെല്ലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12005",
    "name": "Mananthavady Grama Panchayat",
    "nameMl": "മാനന്തവാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12006",
    "name": "Edavaka Grama Panchayat",
    "nameMl": "എടവക ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12007",
    "name": "Vellamunda Grama Panchayat",
    "nameMl": "വെള്ളമുണ്ട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12008",
    "name": "Panamaram Grama Panchayat",
    "nameMl": "പനമരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12009",
    "name": "Padinharathara Grama Panchayat",
    "nameMl": "പടിഞ്ഞാറത്തറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12010",
    "name": "Thariode Grama Panchayat",
    "nameMl": "തരിയോട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12011",
    "name": "Pozhuthana Grama Panchayat",
    "nameMl": "പൊഴുതന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12012",
    "name": "Kottathara Grama Panchayat",
    "nameMl": "കോട്ടത്തറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12013",
    "name": "Vengappally Grama Panchayat",
    "nameMl": "വേങ്ങപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12014",
    "name": "Kaniyambetta Grama Panchayat",
    "nameMl": "കണിയാമ്പറ്റ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12015",
    "name": "Poothadi Grama Panchayat",
    "nameMl": "പൂതാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12016",
    "name": "Pulpally Grama Panchayat",
    "nameMl": "പുല്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12017",
    "name": "Mullankolly Grama Panchayat",
    "nameMl": "മുള്ളന്‍കൊല്ലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12018",
    "name": "Sulthan Bathery Grama Panchayat",
    "nameMl": "സുൽത്താൻ ബത്തേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12019",
    "name": "Meenangadi Grama Panchayat",
    "nameMl": "മീനങ്ങാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12020",
    "name": "Ambalavayal Grama Panchayat",
    "nameMl": "അമ്പലവയല് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12021",
    "name": "Nenmeni Grama Panchayat",
    "nameMl": "നെന്മേനി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12022",
    "name": "Noolpuzha Grama Panchayat",
    "nameMl": "നൂല്‍പ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12023",
    "name": "Vythiri Grama Panchayat",
    "nameMl": "വൈത്തിരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12024",
    "name": "Kalpetta Grama Panchayat",
    "nameMl": "കല്‍പ്പറ്റ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12025",
    "name": "Meppadi Grama Panchayat",
    "nameMl": "മേപ്പാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12026",
    "name": "Muttil Grama Panchayat",
    "nameMl": "മുട്ടില് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G12027",
    "name": "Mupainad Grama Panchayat",
    "nameMl": "മൂപ്പനാടു് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Wayanad"
  },
  {
    "code": "G11005",
    "name": "Kozhikode Grama Panchayat",
    "nameMl": "കോഴിക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11006",
    "name": "Azhiyur Grama Panchayat",
    "nameMl": "അഴിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11007",
    "name": "Eramala Grama Panchayat",
    "nameMl": "ഏറാമല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11008",
    "name": "Onchiyam Grama Panchayat",
    "nameMl": "ഒഞ്ചിയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11009",
    "name": "Chorode Grama Panchayat",
    "nameMl": "ചോറോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11010",
    "name": "Edacheri Grama Panchayat",
    "nameMl": "എടച്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11011",
    "name": "Tuneri Grama Panchayat",
    "nameMl": "തൂണേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11012",
    "name": "Nadapuram Grama Panchayat",
    "nameMl": "നാദാപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11013",
    "name": "Chekkiad Grama Panchayat",
    "nameMl": "ചെക്യാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11014",
    "name": "Valayam Grama Panchayat",
    "nameMl": "വളയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G13076",
    "name": "Vanimal Grama Panchayat",
    "nameMl": "വാണിമൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kannur"
  },
  {
    "code": "G11015",
    "name": "Narippatta Grama Panchayat",
    "nameMl": "നരിപ്പറ്റ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11016",
    "name": "Kavilumpara Grama Panchayat",
    "nameMl": "കാവിലുമ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11017",
    "name": "Maruthonkara Grama Panchayat",
    "nameMl": "മരുതോങ്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11018",
    "name": "Kayakkody Grama Panchayat",
    "nameMl": "കായക്കൊടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11019",
    "name": "Kuttiadi Grama Panchayat",
    "nameMl": "കുറ്റ്യാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11020",
    "name": "Kunnummal Grama Panchayat",
    "nameMl": "കുന്നുമ്മൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11021",
    "name": "Purameri Grama Panchayat",
    "nameMl": "പുറമേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11022",
    "name": "Velom Grama Panchayat",
    "nameMl": "വേളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11023",
    "name": "Ayancheri Grama Panchayat",
    "nameMl": "ആയഞ്ചരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11024",
    "name": "Thiruvallur Grama Panchayat",
    "nameMl": "തിരുവള്ളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11025",
    "name": "Maniyur Grama Panchayat",
    "nameMl": "മണിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11026",
    "name": "Villiappally Grama Panchayat",
    "nameMl": "വില്യാപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11027",
    "name": "Vatakara Grama Panchayat",
    "nameMl": "വടകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11028",
    "name": "Payyoli Grama Panchayat",
    "nameMl": "പയ്യോളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11029",
    "name": "Thikkodi Grama Panchayat",
    "nameMl": "തിക്കോടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11030",
    "name": "Moodadi Grama Panchayat",
    "nameMl": "മൂടാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11031",
    "name": "Thurayur Grama Panchayat",
    "nameMl": "തുറയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11032",
    "name": "Keezhariyur Grama Panchayat",
    "nameMl": "കീഴരിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11033",
    "name": "Cheruvannur Grama Panchayat",
    "nameMl": "ചെറുവണ്ണൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11034",
    "name": "Meppayur Grama Panchayat",
    "nameMl": "മേപ്പയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11035",
    "name": "Arikkulam Grama Panchayat",
    "nameMl": "അരിക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11036",
    "name": "Nochad Grama Panchayat",
    "nameMl": "നൊച്ചാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11037",
    "name": "Perambra Grama Panchayat",
    "nameMl": "പേരാമ്പ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11038",
    "name": "Changaroth Grama Panchayat",
    "nameMl": "ചങ്ങരോത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11039",
    "name": "Koothali Grama Panchayat",
    "nameMl": "കൂത്താളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "204902",
    "name": "Chakkittapara Grama Panchayat",
    "nameMl": "ചക്കിട്ടപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11041",
    "name": "Koorachundu Grama Panchayat",
    "nameMl": "കൂരാച്ചുണ്ട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11042",
    "name": "Kayanna Grama Panchayat",
    "nameMl": "കായണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G110706",
    "name": "Panangad Grama Panchayat",
    "nameMl": "പനങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11044",
    "name": "Kottur Grama Panchayat",
    "nameMl": "കോട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11045",
    "name": "Naduvannur Grama Panchayat",
    "nameMl": "നടുവണ്ണൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11046",
    "name": "Balussery Grama Panchayat",
    "nameMl": "ബാലുശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11047",
    "name": "Ulliyeri Grama Panchayat",
    "nameMl": "ഉള്ളിയേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11048",
    "name": "Atholi Grama Panchayat",
    "nameMl": "അത്തോളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11049",
    "name": "Chemanchery Grama Panchayat",
    "nameMl": "ചേമഞ്ചരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11050",
    "name": "Chengottukavu Grama Panchayat",
    "nameMl": "ചേങ്ങോട്ടുകാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11051",
    "name": "Koyilandy Grama Panchayat",
    "nameMl": "കൊയിലാണ്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11052",
    "name": "Thalakulathur Grama Panchayat",
    "nameMl": "തലക്കുളത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11053",
    "name": "Nanminda Grama Panchayat",
    "nameMl": "നന്മണ്ട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11054",
    "name": "Kakkur Grama Panchayat",
    "nameMl": "കാക്കൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11055",
    "name": "Chelannur Grama Panchayat",
    "nameMl": "ചേളന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11056",
    "name": "Kakkodi Grama Panchayat",
    "nameMl": "കക്കോടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11057",
    "name": "Kuruvattoor Grama Panchayat",
    "nameMl": "കുരുവട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11058",
    "name": "Madavoor Grama Panchayat",
    "nameMl": "മടവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11059",
    "name": "Kunnamangalam Grama Panchayat",
    "nameMl": "കുന്ദമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11060",
    "name": "Peruvayal Grama Panchayat",
    "nameMl": "പെരുവയൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11061",
    "name": "Perumanna Grama Panchayat",
    "nameMl": "പെരുമണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G110504",
    "name": "Mavoor Grama Panchayat",
    "nameMl": "മാവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11063",
    "name": "Chathamangalam Grama Panchayat",
    "nameMl": "ചാത്തമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11064",
    "name": "Mukkam Grama Panchayat",
    "nameMl": "മുക്കം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11065",
    "name": "Karassery Grama Panchayat",
    "nameMl": "കാരശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11066",
    "name": "Kodiyathur Grama Panchayat",
    "nameMl": "കൊടിയത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11067",
    "name": "Olavanna Grama Panchayat",
    "nameMl": "ഒളവണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11068",
    "name": "Ramanattukara Grama Panchayat",
    "nameMl": "രാമനാട്ടുകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11069",
    "name": "Feroke Grama Panchayat",
    "nameMl": "ഫറോക്ക് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11070",
    "name": "Kadalundi Grama Panchayat",
    "nameMl": "കടലുണ്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11071",
    "name": "Unnikulam Grama Panchayat",
    "nameMl": "ഉണിക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11072",
    "name": "Kattippara Grama Panchayat",
    "nameMl": "കട്ടിപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11073",
    "name": "Puthuppadi Grama Panchayat",
    "nameMl": "പുതുപ്പാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11074",
    "name": "Kodanchery Grama Panchayat",
    "nameMl": "കോടഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11075",
    "name": "Thiruvambadi Grama Panchayat",
    "nameMl": "തിരുവമ്പാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11076",
    "name": "Koodaranhi Grama Panchayat",
    "nameMl": "കൂടരഞ്ഞി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11077",
    "name": "Omassery Grama Panchayat",
    "nameMl": "ഓമശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11078",
    "name": "Koduvally Grama Panchayat",
    "nameMl": "കൊടുവള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11079",
    "name": "Kizhakkoth Grama Panchayat",
    "nameMl": "കിഴക്കോത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11080",
    "name": "Narikunni Grama Panchayat",
    "nameMl": "നരിക്കുനി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11081",
    "name": "Thamarassery Grama Panchayat",
    "nameMl": "താമരശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G10001",
    "name": "Pothukal Grama Panchayat",
    "nameMl": "പോത്തുകല്ല് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10002",
    "name": "Chungathara Grama Panchayat",
    "nameMl": "ചുങ്കത്തറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10003",
    "name": "Chaliyar Grama Panchayat",
    "nameMl": "ചാലിയാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10004",
    "name": "Mampad Grama Panchayat",
    "nameMl": "മമ്പാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10005",
    "name": "Nilambur Grama Panchayat",
    "nameMl": "നിലമ്പൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G02001",
    "name": "Kollam Grama Panchayat",
    "nameMl": "കൊല്ലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G07001",
    "name": "Kochi Grama Panchayat",
    "nameMl": "കൊച്ചി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G08001",
    "name": "Thrissur Grama Panchayat",
    "nameMl": "തൃശ്ശൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G01001",
    "name": "Thiruvananthapuram Grama Panchayat",
    "nameMl": "തിരുവനന്തപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G10006",
    "name": "Edakkara Grama Panchayat",
    "nameMl": "എടക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10007",
    "name": "Vazhikkadavu Grama Panchayat",
    "nameMl": "വഴിക്കടവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10008",
    "name": "Karulai Grama Panchayat",
    "nameMl": "കരുളായി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10009",
    "name": "Moothedam Grama Panchayat",
    "nameMl": "മൂത്തേടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10010",
    "name": "Amarambalam Grama Panchayat",
    "nameMl": "അമരമ്പലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10011",
    "name": "Chokkad Grama Panchayat",
    "nameMl": "ചോക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10012",
    "name": "Wandoor Grama Panchayat",
    "nameMl": "വണ്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10013",
    "name": "Thiruvali Grama Panchayat",
    "nameMl": "തിരുവാലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10014",
    "name": "Porur Grama Panchayat",
    "nameMl": "പോരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10015",
    "name": "Kalikavu Grama Panchayat",
    "nameMl": "കാളികാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G09001",
    "name": "Thuvoor Grama Panchayat",
    "nameMl": "തുവ്വൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09002",
    "name": "Karuvarakundu Grama Panchayat",
    "nameMl": "കരുവാരക്കുണ്ട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G11082",
    "name": "Urangattiri Grama Panchayat",
    "nameMl": "ഊർങ്ങാട്ടിരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G10016",
    "name": "Edavanna Grama Panchayat",
    "nameMl": "എടവണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10017",
    "name": "Thrikkalangode Grama Panchayat",
    "nameMl": "തൃക്കലങ്ങോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G09003",
    "name": "Pandikkad Grama Panchayat",
    "nameMl": "പാണ്ടിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G10018",
    "name": "Anakayam Grama Panchayat",
    "nameMl": "ആനക്കയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10019",
    "name": "Manjeri Grama Panchayat",
    "nameMl": "മഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10020",
    "name": "Malappuram Grama Panchayat",
    "nameMl": "മലപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10021",
    "name": "Pookkottur Grama Panchayat",
    "nameMl": "പൂക്കോട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G11083",
    "name": "Pulpatta Grama Panchayat",
    "nameMl": "പുൽപ്പറ്റ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11084",
    "name": "Kavanur Grama Panchayat",
    "nameMl": "കാവനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11085",
    "name": "Areacode Grama Panchayat",
    "nameMl": "അരീക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11086",
    "name": "Keezhuparamba Grama Panchayat",
    "nameMl": "കീഴുപറമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11087",
    "name": "Vazhakkad Grama Panchayat",
    "nameMl": "വാഴക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11088",
    "name": "Cheekkode Grama Panchayat",
    "nameMl": "ചീക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11089",
    "name": "Kuzhimanna Grama Panchayat",
    "nameMl": "കുഴിമണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11090",
    "name": "Muthuvallur Grama Panchayat",
    "nameMl": "മുതുവല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11091",
    "name": "Pulikkal Grama Panchayat",
    "nameMl": "പുളിക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11092",
    "name": "Vazhayoor Grama Panchayat",
    "nameMl": "വാഴയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11093",
    "name": "Cherukavu Grama Panchayat",
    "nameMl": "ചെറുകാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G11094",
    "name": "Chelembra Grama Panchayat",
    "nameMl": "ചേലേമ്പ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kozhikode"
  },
  {
    "code": "G10022",
    "name": "Pallikkal Grama Panchayat",
    "nameMl": "പള്ളിക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10023",
    "name": "Kondotty Grama Panchayat",
    "nameMl": "കൊണ്ടോട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10024",
    "name": "Morayur Grama Panchayat",
    "nameMl": "മൊറയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10025",
    "name": "Vallikkunnu Grama Panchayat",
    "nameMl": "വള്ളിക്കുന്ന് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10026",
    "name": "Thenhippalam Grama Panchayat",
    "nameMl": "തേഞ്ഞിപ്പാലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10027",
    "name": "Peruvalloor Grama Panchayat",
    "nameMl": "പെരുവള്ളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10028",
    "name": "Moonniyur Grama Panchayat",
    "nameMl": "മൂന്നിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10029",
    "name": "Parappanangadi Grama Panchayat",
    "nameMl": "പരപ്പനങ്ങാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10030",
    "name": "Tirurangadi Grama Panchayat",
    "nameMl": "തിരൂരങ്ങാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10031",
    "name": "Abdurahiman Nagar Grama Panchayat",
    "nameMl": "അബ്ദുറഹിമാൻ നഗർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10032",
    "name": "Kannamangalam Grama Panchayat",
    "nameMl": "കണ്ണമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10033",
    "name": "Oorakam Grama Panchayat",
    "nameMl": "ഊരകം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10034",
    "name": "Othukkungal Grama Panchayat",
    "nameMl": "ഒതുക്കുങ്ങൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10035",
    "name": "Parappoor Grama Panchayat",
    "nameMl": "പറപ്പൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10036",
    "name": "Vengara Grama Panchayat",
    "nameMl": "വേങ്ങര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10037",
    "name": "Edarikkode Grama Panchayat",
    "nameMl": "എടരിക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10038",
    "name": "Thennela Grama Panchayat",
    "nameMl": "തെന്നല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10039",
    "name": "Nannambra Grama Panchayat",
    "nameMl": "നന്നമ്പ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10040",
    "name": "Tanur Grama Panchayat",
    "nameMl": "താനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10041",
    "name": "Ozhoor Grama Panchayat",
    "nameMl": "ഒഴൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10042",
    "name": "Perumanna Klari Grama Panchayat",
    "nameMl": "പെരുമണ്ണ ക്ലാരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10043",
    "name": "Ponmundam Grama Panchayat",
    "nameMl": "പൊന്മുണ്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10044",
    "name": "Thanalur Grama Panchayat",
    "nameMl": "താനാളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10045",
    "name": "Niramarutur Grama Panchayat",
    "nameMl": "നിറമരുതൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10046",
    "name": "Tirur Grama Panchayat",
    "nameMl": "തിരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10047",
    "name": "Cheriyamundam Grama Panchayat",
    "nameMl": "ചെറിയമുണ്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10048",
    "name": "Valavannur Grama Panchayat",
    "nameMl": "വളവന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10049",
    "name": "Kalpakancheri Grama Panchayat",
    "nameMl": "കൽപ്പകഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10050",
    "name": "Kottakkal Grama Panchayat",
    "nameMl": "കോട്ടക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10051",
    "name": "Ponmala Grama Panchayat",
    "nameMl": "പൊന്മള ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10052",
    "name": "Marakkara Grama Panchayat",
    "nameMl": "മാറാക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10053",
    "name": "Edayur Grama Panchayat",
    "nameMl": "എടയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10054",
    "name": "Irumbiliyum Grama Panchayat",
    "nameMl": "ഇരിമ്പിളിയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10055",
    "name": "Valanchery Grama Panchayat",
    "nameMl": "വളാഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10056",
    "name": "Kuttippuram Grama Panchayat",
    "nameMl": "കുറ്റിപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10057",
    "name": "Athavanad Grama Panchayat",
    "nameMl": "ആതവനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10058",
    "name": "Thirunavaya Grama Panchayat",
    "nameMl": "തിരുനാവായ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10059",
    "name": "Thrippengode Grama Panchayat",
    "nameMl": "തൃപ്രങ്ങോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10060",
    "name": "Thalakkad Grama Panchayat",
    "nameMl": "തലക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10061",
    "name": "Vettom Grama Panchayat",
    "nameMl": "വെട്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10062",
    "name": "Mangalam Grama Panchayat",
    "nameMl": "മംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10063",
    "name": "Purathoor Grama Panchayat",
    "nameMl": "പുറത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10064",
    "name": "Tavanur Grama Panchayat",
    "nameMl": "തവനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10065",
    "name": "Kaladi Grama Panchayat",
    "nameMl": "കാലടി ഗ്രാമപഞ്ചായത്ത്, മലപ്പുറം ജില്ല",
    "district": "Malappuram"
  },
  {
    "code": "G10066",
    "name": "Vattamkulam Grama Panchayat",
    "nameMl": "വട്ടംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10067",
    "name": "Edappal Grama Panchayat",
    "nameMl": "എടപ്പാൾ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10068",
    "name": "Maranchery Grama Panchayat",
    "nameMl": "മാറഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10069",
    "name": "Ponnani Grama Panchayat",
    "nameMl": "പൊന്നാനി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G08002",
    "name": "Veliyancode Grama Panchayat",
    "nameMl": "വെളിയംകോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08003",
    "name": "Perumbadappu Grama Panchayat",
    "nameMl": "പെരുമ്പടപ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08004",
    "name": "Nannamukku Grama Panchayat",
    "nameMl": "നന്നംമുക്ക് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08005",
    "name": "Alamkode Grama Panchayat",
    "nameMl": "ആലംകോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G10070",
    "name": "Kodur Grama Panchayat",
    "nameMl": "കോഡൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10071",
    "name": "Kuruva Grama Panchayat",
    "nameMl": "കുറുവ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10072",
    "name": "Koottilangadi Grama Panchayat",
    "nameMl": "കൂട്ടിലങ്ങാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10073",
    "name": "Makkaraparamba Grama Panchayat",
    "nameMl": "മക്കരപ്പറമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10074",
    "name": "Mankada Grama Panchayat",
    "nameMl": "മങ്കട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G09004",
    "name": "Keezhattur Grama Panchayat",
    "nameMl": "കീഴാറ്റൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09005",
    "name": "Melattur Grama Panchayat",
    "nameMl": "മേലാറ്റൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09006",
    "name": "Edapatta Grama Panchayat",
    "nameMl": "എടപ്പറ്റ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09007",
    "name": "Vettattur Grama Panchayat",
    "nameMl": "വെട്ടത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09008",
    "name": "Tazhekkod Grama Panchayat",
    "nameMl": "താഴേക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09009",
    "name": "Aliparamba Grama Panchayat",
    "nameMl": "ആലിപ്പറമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09010",
    "name": "Elamkulam Grama Panchayat",
    "nameMl": "ഏലംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09011",
    "name": "Perinthalmanna Grama Panchayat",
    "nameMl": "പെരിന്തല്‍മണ്ണ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G10075",
    "name": "Angadippuram Grama Panchayat",
    "nameMl": "അങ്ങാടിപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10076",
    "name": "Puzhakkatiri Grama Panchayat",
    "nameMl": "പുഴക്കാട്ടിരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10077",
    "name": "Pulamanthole Grama Panchayat",
    "nameMl": "പുലാമന്തോൾ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10078",
    "name": "Moorkanade Grama Panchayat",
    "nameMl": "മൂർക്കനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G08006",
    "name": "Punnayoorkulam Grama Panchayat",
    "nameMl": "പൂന്നയൂര്‍ക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08007",
    "name": "Vadakkekkad Grama Panchayat",
    "nameMl": "വടക്കേക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08008",
    "name": "Punnayoor Grama Panchayat",
    "nameMl": "പുന്നയൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08009",
    "name": "Guruvayoor Grama Panchayat",
    "nameMl": "ഗുരുവായൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08010",
    "name": "Chavakkad Grama Panchayat",
    "nameMl": "ചാവക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08011",
    "name": "Kadappuram Grama Panchayat",
    "nameMl": "കടപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08012",
    "name": "Orumanayoor Grama Panchayat",
    "nameMl": "ഒരുമനയൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08013",
    "name": "Pavaratty Grama Panchayat",
    "nameMl": "പാവറട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08014",
    "name": "Elavally Grama Panchayat",
    "nameMl": "എളവള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08015",
    "name": "Mullassery Grama Panchayat",
    "nameMl": "മുല്ലശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08016",
    "name": "Venkitangu Grama Panchayat",
    "nameMl": "വെങ്കിടങ്ങ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08017",
    "name": "Engandiyoor Grama Panchayat",
    "nameMl": "ഏങ്ങണ്ടിയൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08018",
    "name": "Vadanappilly Grama Panchayat",
    "nameMl": "വാടാനപ്പിള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08019",
    "name": "Thalikulam Grama Panchayat",
    "nameMl": "തളിക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08020",
    "name": "Nattika Grama Panchayat",
    "nameMl": "നാട്ടിക ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08021",
    "name": "Valappad Grama Panchayat",
    "nameMl": "വലപ്പാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08022",
    "name": "Kattakampal Grama Panchayat",
    "nameMl": "കാട്ടകാമ്പാല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08023",
    "name": "Kadavalloor Grama Panchayat",
    "nameMl": "കടവല്ലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08024",
    "name": "Kadangode Grama Panchayat",
    "nameMl": "കടങ്ങോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08025",
    "name": "Porkulam Grama Panchayat",
    "nameMl": "പോര്‍ക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08026",
    "name": "Chowannur Grama Panchayat",
    "nameMl": "ചൊവ്വന്നൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08027",
    "name": "Kunnamkulam Grama Panchayat",
    "nameMl": "കുന്നംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08028",
    "name": "Kandanassery Grama Panchayat",
    "nameMl": "കണ്ടാണശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08029",
    "name": "Choondal Grama Panchayat",
    "nameMl": "ചൂണ്ടല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08030",
    "name": "Velur Grama Panchayat",
    "nameMl": "വേലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08031",
    "name": "Varavoor Grama Panchayat",
    "nameMl": "വരവൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08032",
    "name": "Desamangalam Grama Panchayat",
    "nameMl": "ദേശമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08033",
    "name": "Vallathole Nagar Grama Panchayat",
    "nameMl": "വള്ളത്തോള്‍നഗര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08034",
    "name": "Panjal Grama Panchayat",
    "nameMl": "പാഞ്ഞാള്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G09012",
    "name": "Chelakkara Grama Panchayat",
    "nameMl": "ചേലക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09013",
    "name": "Kondazhy Grama Panchayat",
    "nameMl": "കൊണ്ടാഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09014",
    "name": "Thiruvilwamala Grama Panchayat",
    "nameMl": "തിരുവില്ല്വാമല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09015",
    "name": "Pazhayannur Grama Panchayat",
    "nameMl": "പഴയന്നൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G08035",
    "name": "Thekkumkara Grama Panchayat",
    "nameMl": "തെക്കുംകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08036",
    "name": "Mullurkkara Grama Panchayat",
    "nameMl": "മുള്ളൂര്‍ക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08037",
    "name": "Erumapetty Grama Panchayat",
    "nameMl": "എരുമപ്പെട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08038",
    "name": "Wadakanchery Grama Panchayat",
    "nameMl": "വടക്കാഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08039",
    "name": "Tholur Grama Panchayat",
    "nameMl": "തോളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08040",
    "name": "Kaiparambu Grama Panchayat",
    "nameMl": "കയ്പറമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08041",
    "name": "Avanur Grama Panchayat",
    "nameMl": "അവണൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08042",
    "name": "Mulamkunnathukavu Grama Panchayat",
    "nameMl": "മുളങ്കുന്നത്തുകാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08043",
    "name": "Madakkathara Grama Panchayat",
    "nameMl": "മാടക്കത്തറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G09016",
    "name": "Pananchery Grama Panchayat",
    "nameMl": "പാണഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G08044",
    "name": "Puthur Grama Panchayat",
    "nameMl": "പൂത്തൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08045",
    "name": "Kolazhy Grama Panchayat",
    "nameMl": "കോലഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08046",
    "name": "Adat Grama Panchayat",
    "nameMl": "അടാട്ട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08047",
    "name": "Nadathara Grama Panchayat",
    "nameMl": "നടത്തറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08048",
    "name": "Manalur Grama Panchayat",
    "nameMl": "മണലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08049",
    "name": "Arimbur Grama Panchayat",
    "nameMl": "അരി‍മ്പൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08050",
    "name": "Anthikkad Grama Panchayat",
    "nameMl": "അന്തിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08051",
    "name": "Thanniam Grama Panchayat",
    "nameMl": "താന്ന്യം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08052",
    "name": "Chazhur Grama Panchayat",
    "nameMl": "ചാഴൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08053",
    "name": "Paralam Grama Panchayat",
    "nameMl": "പാറളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08054",
    "name": "Avinissery Grama Panchayat",
    "nameMl": "അവിണിശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08055",
    "name": "Cherpu Grama Panchayat",
    "nameMl": "ചേര്‍പ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08056",
    "name": "Vallachira Grama Panchayat",
    "nameMl": "വല്ലച്ചിറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G09017",
    "name": "Varantharappilly Grama Panchayat",
    "nameMl": "വരന്തരപ്പിള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09018",
    "name": "Mattathur Grama Panchayat",
    "nameMl": "മറ്റത്തൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09019",
    "name": "Athirappilly Grama Panchayat",
    "nameMl": "അതിരപ്പിള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09020",
    "name": "Kodassery Grama Panchayat",
    "nameMl": "കോടശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09021",
    "name": "Pariyaram Grama Panchayat",
    "nameMl": "പരിയാരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09022",
    "name": "Meloor Grama Panchayat",
    "nameMl": "മേലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09023",
    "name": "Koratty Grama Panchayat",
    "nameMl": "കൊരട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G08057",
    "name": "Kodakara Grama Panchayat",
    "nameMl": "കൊടകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08058",
    "name": "Aloor Grama Panchayat",
    "nameMl": "ആളൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08059",
    "name": "Chalakudy Grama Panchayat",
    "nameMl": "ചാലക്കുടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08060",
    "name": "Kadukutty Grama Panchayat",
    "nameMl": "കാടുകുറ്റി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G07002",
    "name": "Annamanada Grama Panchayat",
    "nameMl": "അന്നമനട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07003",
    "name": "Kuzhur Grama Panchayat",
    "nameMl": "കുഴൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G08061",
    "name": "Mala Grama Panchayat",
    "nameMl": "മാള ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G07004",
    "name": "Poyya Grama Panchayat",
    "nameMl": "പൊയ്യ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07005",
    "name": "Kodungallur Grama Panchayat",
    "nameMl": "കൊടുങ്ങല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07006",
    "name": "Eriyad Grama Panchayat",
    "nameMl": "എറിയാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07007",
    "name": "Edavilangu Grama Panchayat",
    "nameMl": "എടവിലങ്ങ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G08062",
    "name": "Sree Narayanapuram Grama Panchayat",
    "nameMl": "ശ്രീനാരായണപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08063",
    "name": "Mathilakam Grama Panchayat",
    "nameMl": "മതിലകം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08064",
    "name": "Perinjanam Grama Panchayat",
    "nameMl": "പെരിഞ്ഞനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08065",
    "name": "Kaipamangalam Grama Panchayat",
    "nameMl": "കയ്പമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08066",
    "name": "Edathiruthy Grama Panchayat",
    "nameMl": "എടത്തിരുത്തി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08067",
    "name": "Kattoor Grama Panchayat",
    "nameMl": "കാട്ടൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08068",
    "name": "Padiyoor Grama Panchayat",
    "nameMl": "പടിയൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08069",
    "name": "Vellangalur Grama Panchayat",
    "nameMl": "വെള്ളാങ്കല്ലൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08070",
    "name": "Puthenchira Grama Panchayat",
    "nameMl": "പുത്തന്‍ചിറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08071",
    "name": "Velookkara Grama Panchayat",
    "nameMl": "വേളൂക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08072",
    "name": "Muriyad Grama Panchayat",
    "nameMl": "മുരിയാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08073",
    "name": "Irinjalakuda Grama Panchayat",
    "nameMl": "ഇരിങ്ങാലക്കുട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08074",
    "name": "Parappookkara Grama Panchayat",
    "nameMl": "പറപ്പൂക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08075",
    "name": "Pudukkad Grama Panchayat",
    "nameMl": "പൂതുക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08076",
    "name": "Nenmanikkara Grama Panchayat",
    "nameMl": "നെന്മണിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08077",
    "name": "Alagappanagar Grama Panchayat",
    "nameMl": "അളഗപ്പനഗര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08078",
    "name": "Thrikkur Grama Panchayat",
    "nameMl": "ത്യക്കൂര്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08079",
    "name": "Karalam Grama Panchayat",
    "nameMl": "കാറളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G08080",
    "name": "Poomangalam Grama Panchayat",
    "nameMl": "പൂമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G09024",
    "name": "Puthur Gramapanchayat",
    "nameMl": "പുതൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09025",
    "name": "Agali Gramapanchayath",
    "nameMl": "അഗളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09026",
    "name": "Sholayar gram panchayat",
    "nameMl": "ഷോളയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09027",
    "name": "Karimba Gramapanchayath",
    "nameMl": "കരിമ്പ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09028",
    "name": "Thachampara Gramapanchayath",
    "nameMl": "തച്ചമ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09029",
    "name": "Kanhirapuzha Grama Panchayat",
    "nameMl": "കാഞ്ഞിരപുഴ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09030",
    "name": "Thenkara Gramapanchayath",
    "nameMl": "തെങ്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09031",
    "name": "Kumaramputhur gram panchayat",
    "nameMl": "കുമരംപുത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09032",
    "name": "Mannarkad Grama Panchayat",
    "nameMl": "മണ്ണാർക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09033",
    "name": "Kottappadam Gramapanchayath",
    "nameMl": "കോട്ടോപ്പാടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09034",
    "name": "Alanallur Gramapanchayath",
    "nameMl": "അലനല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09035",
    "name": "Thachanattukara Gramapanchayath",
    "nameMl": "തച്ചനാട്ടുകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09036",
    "name": "Karakurussi Gramapanchayath",
    "nameMl": "കാരാകുറുശ്ശി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09037",
    "name": "Puduppariyaram Gramapanchayath",
    "nameMl": "പുതുപ്പരിയാരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09038",
    "name": "Malampuzha Gramapanchayath",
    "nameMl": "മലമ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09039",
    "name": "Pudusserri Gramapanchayath",
    "nameMl": "പുതുശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09040",
    "name": "Elappully Gramapanchayath",
    "nameMl": "എലപ്പുള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09041",
    "name": "Polppulli Grampanchayat",
    "nameMl": "പൊൽപ്പുള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09042",
    "name": "Peruvemba Gramapanchayath",
    "nameMl": "പെരുവെമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09043",
    "name": "Kodumbu Gramapanchayath",
    "nameMl": "കൊടുമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09044",
    "name": "Kannadi Gramapanchayath",
    "nameMl": "കണ്ണാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09045",
    "name": "Palakkad Grama Panchayat",
    "nameMl": "പാലക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09046",
    "name": "Marutharode Gramapanchayath",
    "nameMl": "മരുതറോഡ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09047",
    "name": "Pirayiri Gramapanchayath",
    "nameMl": "പിരായിരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09048",
    "name": "Akathethara Gramapanchayath",
    "nameMl": "അകത്തേത്തറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09049",
    "name": "Mundur Gramapanchayath",
    "nameMl": "മുണ്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09050",
    "name": "Nelliyampathy Gramapanchayath",
    "nameMl": "നെല്ലിയാമ്പതി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09051",
    "name": "Muthalamada Gramapanchayath",
    "nameMl": "മുതലമട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09052",
    "name": "Kollengode Gramapanchayat",
    "nameMl": "കൊല്ലങ്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09053",
    "name": "Elavanchery Gramapanchayath",
    "nameMl": "എലവഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09054",
    "name": "Nemmara Grampanchayat",
    "nameMl": "നെന്മാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09055",
    "name": "Ayiloor Gramapanchayath",
    "nameMl": "അയിലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09056",
    "name": "Pallassena Grampanchayat",
    "nameMl": "പല്ലശ്ശന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09057",
    "name": "Vadavannur gramapanchayat",
    "nameMl": "വടവന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09058",
    "name": "Pattanchery Gramapanchayath",
    "nameMl": "പട്ടഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09059",
    "name": "Perumatty Gramapanchayath",
    "nameMl": "പെരുമാട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09060",
    "name": "Pudunagaram Gramapanchayath",
    "nameMl": "പുതുനഗരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09061",
    "name": "Koduvayur Gramapanchayath",
    "nameMl": "കൊടുവായൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09062",
    "name": "ChitturThathamangalam Grama Panchayat",
    "nameMl": "ചിറ്റൂർ-തത്തമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09063",
    "name": "Nalleppilly Gramapanchayath",
    "nameMl": "നല്ലേപ്പിള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09064",
    "name": "Kozhinjampara Gramapanchayath",
    "nameMl": "കൊഴിഞ്ഞാമ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09065",
    "name": "Eruthampathy Gramapanchayath",
    "nameMl": "എരുത്തേമ്പതി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09066",
    "name": "Vadakarapathy Grampanchayat",
    "nameMl": "വടകരപ്പതി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09067",
    "name": "Kizhakkanchery Gramapanchayath",
    "nameMl": "കിഴക്കഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09068",
    "name": "Vandazhy Gramapanchayath",
    "nameMl": "വണ്ടാഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09069",
    "name": "Melarcode Grampanchayat",
    "nameMl": "മേലാർകോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09070",
    "name": "Vadakkenchery Gramapanchayath",
    "nameMl": "വടക്കഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09071",
    "name": "Kannambra Gramapanchayath",
    "nameMl": "കണ്ണമ്പ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09072",
    "name": "Puthukode Gramapanchayath",
    "nameMl": "പുതുക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09073",
    "name": "Kavassery Gramapanchayath",
    "nameMl": "കാവശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09074",
    "name": "Alathur Gramapanchayath",
    "nameMl": "ആലത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09075",
    "name": "Erimayur Gramapanchayat",
    "nameMl": "എരിമയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09076",
    "name": "Thenkurissi Grampanchayat",
    "nameMl": "തേങ്കുറിശ്ശി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09077",
    "name": "Kuzhalmannam Gramapanchayath",
    "nameMl": "കുഴൽമന്ദം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09078",
    "name": "Kuthanur Grampanchayat",
    "nameMl": "കുത്തന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09079",
    "name": "Tarur Grampanchayat",
    "nameMl": "തരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09080",
    "name": "Peringottukurissi Gramapanchayath",
    "nameMl": "പെരിങ്ങോട്ടുകുറിശ്ശി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09081",
    "name": "Kottayi Gramapanchayath",
    "nameMl": "കോട്ടായി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09082",
    "name": "Mathoor Grampanchayat",
    "nameMl": "മാത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09083",
    "name": "Lakkidi Peroor Gram Panchayat",
    "nameMl": "ലക്കിടിപേരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09084",
    "name": "Ottappalam Grama Panchayat",
    "nameMl": "ഒറ്റപ്പാലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09085",
    "name": "Vaniyamkulam Gramapanchayath",
    "nameMl": "വാണിയംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09086",
    "name": "Shoranur Grama Panchayat",
    "nameMl": "ഷൊർണ്ണൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09087",
    "name": "Chalavara Gramapanchayath",
    "nameMl": "ചളവറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09088",
    "name": "Ananganadi Gramapanchayath",
    "nameMl": "അനങ്ങനടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09089",
    "name": "Ambalapara Gramapanchayath",
    "nameMl": "അമ്പലപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09090",
    "name": "Kadampazhipuram Gramapanchayath",
    "nameMl": "കടമ്പഴിപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09091",
    "name": "Karimpuzha Gramapanchayath",
    "nameMl": "കരിമ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09092",
    "name": "Vellinezhi Gramapanchayath",
    "nameMl": "വെള്ളിനേഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09093",
    "name": "Sreekrishnapuram Grampanchayat",
    "nameMl": "ശ്രീകൃഷ്ണപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09094",
    "name": "Pookottukavu Gramapanchayath",
    "nameMl": "പൂക്കോട്ടുകാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09095",
    "name": "Thrikkadeeri Grampanchayat",
    "nameMl": "തൃക്കടീരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09096",
    "name": "Cherpulassery Grama Panchayat",
    "nameMl": "ചെർപ്പുളശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09097",
    "name": "Nellaya Gramapanchayath",
    "nameMl": "നെല്ലായ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09098",
    "name": "Parli Gramapanchayath",
    "nameMl": "പറളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09099",
    "name": "Mankara Gramapanchayath",
    "nameMl": "മങ്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09100",
    "name": "Keralasseri Gramapanchayath",
    "nameMl": "കേരളശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09101",
    "name": "Mannoor Grampanchayat",
    "nameMl": "മണ്ണൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09102",
    "name": "Kongad Gramapanchayath",
    "nameMl": "കോങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09103",
    "name": "Ongallur Gramapanchayath",
    "nameMl": "ഓങ്ങല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09104",
    "name": "Vallapuzha Gramapanchayat",
    "nameMl": "വല്ലപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09105",
    "name": "Kulukkallur Gramapanchayath",
    "nameMl": "കുലുക്കല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G10079",
    "name": "Vilayur Gramapanchayath",
    "nameMl": "വിളയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10080",
    "name": "Koppam Gramapanchayath",
    "nameMl": "കൊപ്പം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10081",
    "name": "Pattambi Grama Panchayat",
    "nameMl": "പട്ടാമ്പി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10082",
    "name": "Thiruvegappura Gramapanchayath",
    "nameMl": "തിരുവേഗപ്പുറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10083",
    "name": "Muthuthala Gramapanchayath",
    "nameMl": "മുതുതല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10084",
    "name": "Parathur Gramapanchayath",
    "nameMl": "പരുതൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10085",
    "name": "Thrithala Grampanchayat",
    "nameMl": "തൃത്താല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10086",
    "name": "Thirumittacode Gramapanchayath",
    "nameMl": "തിരുമിറ്റക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10087",
    "name": "Nagalassery Grampanchayat",
    "nameMl": "നാഗലശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G08081",
    "name": "Chalissery Gramapanchayath",
    "nameMl": "ചാലിശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thrissur"
  },
  {
    "code": "G10088",
    "name": "Kappoor Gramapanchayath",
    "nameMl": "കപ്പൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10089",
    "name": "Pattithara Gramapanchayath",
    "nameMl": "പട്ടിത്തറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G10090",
    "name": "Anakkara Gramapanchayath",
    "nameMl": "ആനക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Malappuram"
  },
  {
    "code": "G06001",
    "name": "Edamalakkudi Grama Panchayat",
    "nameMl": "Edamalakkudi Grama Panchayat",
    "district": "Idukki"
  },
  {
    "code": "G06002",
    "name": "Kuttampuzha Gramapanchayath",
    "nameMl": "കുട്ടമ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G07008",
    "name": "Ayyampuzha Gramapanchayath",
    "nameMl": "അയ്യമ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G06003",
    "name": "Kavalangad Gramapanchayath",
    "nameMl": "കവളങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G07009",
    "name": "Keerampaara Gramapanchayath",
    "nameMl": "കീരംപാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07010",
    "name": "Pindimana Gramapanchayath",
    "nameMl": "പിണ്ടിമന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07011",
    "name": "Kottappady Grama Panchayath",
    "nameMl": "കോട്ടപ്പടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07012",
    "name": "Vengoor Gramapanchayath",
    "nameMl": "വേങ്ങൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07013",
    "name": "Koovappady Gramapanchayath",
    "nameMl": "കൂവപ്പടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07014",
    "name": "Mudakkuzha Gramapanchayath",
    "nameMl": "മുടക്കുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07015",
    "name": "Malayattoor-Neeleswaram Gramapanchayath",
    "nameMl": "മലയാറ്റൂർ-നീലീശ്വരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07016",
    "name": "Kalady Gramapanchayath",
    "nameMl": "കാലടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07017",
    "name": "Manjapra Gramapanchayath",
    "nameMl": "മഞ്ഞപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07018",
    "name": "Thuravoor Gramapanchayat",
    "nameMl": "തുറവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07019",
    "name": "Mookkannoor Gramapanchayath",
    "nameMl": "മൂക്കന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07020",
    "name": "Karukutty Gramapanchayath",
    "nameMl": "കറുകുറ്റി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07021",
    "name": "Parakkadavu Gramapanchayath",
    "nameMl": "പാറക്കടവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07022",
    "name": "Angamaly Grama Panchayat",
    "nameMl": "അങ്കമാലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07023",
    "name": "Nedumbassery Gramapanchayath",
    "nameMl": "നെടുമ്പാശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07024",
    "name": "Sreemoolanagaram Gramapanchayath",
    "nameMl": "ശ്രീമൂലനഗരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07025",
    "name": "Chengamanadu Gramapanchayath",
    "nameMl": "ചെങ്ങമനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07026",
    "name": "Okkal Gramapanchayath",
    "nameMl": "ഒക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07027",
    "name": "Perumbavoor Grama Panchayat",
    "nameMl": "പെരുമ്പാവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07028",
    "name": "Rayamangalam Gramapanchayath",
    "nameMl": "രായമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07029",
    "name": "Asamannur Gramapanchayath",
    "nameMl": "അശമന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07030",
    "name": "Nellikuzhy Gramapanchayath",
    "nameMl": "നെല്ലിക്കുഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07031",
    "name": "Kothamangalam Grama Panchayat",
    "nameMl": "കോതമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07032",
    "name": "Varapetty Gramapanchayath",
    "nameMl": "വാരപ്പെട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07033",
    "name": "Pallarimangalam Gramapanchayath",
    "nameMl": "പല്ലാരിമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07034",
    "name": "Pothanikkad Gramapanchayath",
    "nameMl": "പോത്താനിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G06004",
    "name": "Paingottoor Gramapanchayath",
    "nameMl": "പൈങ്ങോട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G07035",
    "name": "Kalloorkaad Gramapanchayath",
    "nameMl": "കല്ലൂർക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07036",
    "name": "Ayavana Gramapanchayath",
    "nameMl": "ആയവന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07037",
    "name": "Manjalloor Gramapanchayath",
    "nameMl": "മഞ്ഞള്ളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07038",
    "name": "Avoly Gramapanchayath",
    "nameMl": "ആവോലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07039",
    "name": "Muvattupuzha Grama Panchayat",
    "nameMl": "മൂവാറ്റുപുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07040",
    "name": "Paipra Gramapanchayath",
    "nameMl": "പായിപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07041",
    "name": "Valakom Gramapanchayath",
    "nameMl": "വാളകം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07042",
    "name": "Mazhuvanoor Gramapanchayath",
    "nameMl": "മഴുവന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G070702",
    "name": "Kizhakkambalam Grama Panchayat",
    "nameMl": "കിഴക്കമ്പലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07044",
    "name": "Vengola Gramapanchayath",
    "nameMl": "വെങ്ങോല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07045",
    "name": "Vazhakkulam Gramapanchayath",
    "nameMl": "വാഴക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07046",
    "name": "Kanjoor Gramapanchayath",
    "nameMl": "കാഞ്ഞൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07047",
    "name": "Keezhmadu Gramapanchayath",
    "nameMl": "കീഴ്മാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07048",
    "name": "Aluva Grama Panchayat",
    "nameMl": "ആലുവ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07049",
    "name": "Kunnukara Gramapanchayath",
    "nameMl": "കുന്നുകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07050",
    "name": "Karumalloor Gramapanchayath",
    "nameMl": "കരുമാല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07051",
    "name": "Puthenvelikkara Gramapanchayath",
    "nameMl": "പുത്തൻവേലിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07052",
    "name": "Chendamangalam Gramapanchayath",
    "nameMl": "ചേന്ദമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07053",
    "name": "Paravur Grama Panchayat",
    "nameMl": "വടക്കൻ പറവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07054",
    "name": "Chittattukara Gramapanchayath",
    "nameMl": "ചിറ്റാട്ടുകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07055",
    "name": "Pallippuram Gramapanchayath",
    "nameMl": "പള്ളിപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07056",
    "name": "Kottuvally Gramapanchayath",
    "nameMl": "കോട്ടുവള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07057",
    "name": "Kuzhuppilly Gramapanchayath",
    "nameMl": "കുഴുപ്പിള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07058",
    "name": "Edavanakad Gramapanchayath",
    "nameMl": "എടവനക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07059",
    "name": "Nayarambalam Gramapanchayath",
    "nameMl": "നായരമ്പലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07060",
    "name": "Ezhikkara Gramapanchayath",
    "nameMl": "ഏഴിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07061",
    "name": "Alangad Gramapanchayath",
    "nameMl": "ആലങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07062",
    "name": "Kadungalloor Gramapanchayath",
    "nameMl": "കടുങ്ങല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07063",
    "name": "Njarackal Gramapanchayath",
    "nameMl": "ഞാറക്കല് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07064",
    "name": "Elamkunnapuzha Gramapanchayath",
    "nameMl": "എളങ്കുന്നപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07065",
    "name": "Mulavukadu Gramapanchayath",
    "nameMl": "മുളവുകാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07066",
    "name": "Kadamakkudy Gramapanchayath",
    "nameMl": "കടമക്കുടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07067",
    "name": "Cherannalloor Gramapanchayat",
    "nameMl": "ചേരാനല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07068",
    "name": "Varapuzha Gramapanchayath",
    "nameMl": "വരാപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07069",
    "name": "Vadakkekkara Gramapanchayath",
    "nameMl": "വടക്കേക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07070",
    "name": "Eloor Grama Panchayat",
    "nameMl": "ഏലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07071",
    "name": "Choornikkara Gramapanchayath",
    "nameMl": "ചൂർണ്ണിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07072",
    "name": "Kalamassery Grama Panchayat",
    "nameMl": "കളമശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07073",
    "name": "Thrikkakara Grama Panchayat",
    "nameMl": "തൃക്കാക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07074",
    "name": "Edathala Gramapanchayath",
    "nameMl": "എടത്തല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07075",
    "name": "Kunnathunad Gramapanchayath",
    "nameMl": "കുന്നത്തുനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07076",
    "name": "Vadavukode-Puthencruz Gramapanachayath Grama Panchayat",
    "nameMl": "വടവുകോട്-പുത്തൻകുരിശ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07077",
    "name": "Maradu Grama Panchayat",
    "nameMl": "മരട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07078",
    "name": "Thrippunithura Grama Panchayat",
    "nameMl": "തൃപ്പൂണിത്തുറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07079",
    "name": "Kumbalam Gramapanchayath",
    "nameMl": "കുമ്പളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07080",
    "name": "Chellanam Gramapanchayath",
    "nameMl": "ചെല്ലാനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07081",
    "name": "Kumbalanghy Gramapanchayath",
    "nameMl": "കുമ്പളങ്ങി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07082",
    "name": "Udayamperoor Gramapanchayath",
    "nameMl": "ഉദയംപേരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07083",
    "name": "Chottanikara Gramapanchayath",
    "nameMl": "ചോറ്റാനിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07084",
    "name": "Mulamthuruthy Gramapanchayath",
    "nameMl": "മുളന്തുരുത്തി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07085",
    "name": "Amballur Gramapanchayath",
    "nameMl": "ആമ്പല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07086",
    "name": "Edakkattuvayal Gramapanchayath",
    "nameMl": "എടക്കാട്ടുവയൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07087",
    "name": "Piravom Grama Panchayat",
    "nameMl": "പിറവം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07088",
    "name": "Maneedu Gramapanchayath",
    "nameMl": "മണീട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07089",
    "name": "Thiruvaniyoor Gramapanchayath",
    "nameMl": "തിരുവാണിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07090",
    "name": "Poothrika Gramapanchayath",
    "nameMl": "പൂതൃക്ക ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07091",
    "name": "Aikkaranadu Gramapanchayath",
    "nameMl": "ഐക്കരനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07092",
    "name": "Ramamangalam Gramapanchayath",
    "nameMl": "രാമമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07093",
    "name": "Pampakuda Gramapanchayath",
    "nameMl": "പാമ്പാക്കുട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07094",
    "name": "Thirumaradi Gramapanchayath",
    "nameMl": "തിരുമാറാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07095",
    "name": "Koothattukulam Grama Panchayat",
    "nameMl": "കൂത്താട്ടുകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07096",
    "name": "Palakuzha Gramapanchayath",
    "nameMl": "പാലക്കുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07097",
    "name": "Arakkuzha Gramapanchayath",
    "nameMl": "ആരക്കുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07098",
    "name": "Marady Gramapanchayath",
    "nameMl": "മാറാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G05001",
    "name": "Elanji Gramapanchayath",
    "nameMl": "ഇലഞ്ഞി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G09106",
    "name": "Marayoor Gramapanchayat",
    "nameMl": "മറയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G09107",
    "name": "Kanthalloor Gramapanchayath",
    "nameMl": "കാന്തല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Palakkad"
  },
  {
    "code": "G06005",
    "name": "Vattavada Gramapanchayath",
    "nameMl": "വട്ടവട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06006",
    "name": "Devikulam Gramapanchayath",
    "nameMl": "ദേവികുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06007",
    "name": "Munnar Grampanchayat",
    "nameMl": "മൂന്നാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06008",
    "name": "Mankulam Gramapanchayath",
    "nameMl": "മാങ്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06009",
    "name": "Adimali Gramapanchayath",
    "nameMl": "അടിമാലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06010",
    "name": "Pallivasal Gramapanchayat",
    "nameMl": "പള്ളിവാസൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06011",
    "name": "Vellathooval Gramapanchayat",
    "nameMl": "വെള്ളത്തൂവൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06012",
    "name": "Baisonvalley Gramapanchayat",
    "nameMl": "ബൈസൺ വാലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06013",
    "name": "Chinnakkanal Grampanchayat",
    "nameMl": "ചിന്നക്കനാൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06014",
    "name": "Santhanpara Gramapanchayat",
    "nameMl": "ശാന്തൻപാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06015",
    "name": "Rajakumary Gramapanchayat",
    "nameMl": "രാജകുമാരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06016",
    "name": "Rajakkad Gramapanchayath",
    "nameMl": "രാജാക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06017",
    "name": "Konnathady Gramapanchayath",
    "nameMl": "കൊന്നത്തടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06018",
    "name": "Senapathy Gramapanchayath",
    "nameMl": "സേനാപതി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06019",
    "name": "Udumbanchola Gramapanchayath",
    "nameMl": "ഉടുമ്പൻചോല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06020",
    "name": "Nedumkandom Gramapanchayath",
    "nameMl": "നെടുങ്കണ്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06021",
    "name": "Vathikudy Gramapanchayath",
    "nameMl": "വാത്തിക്കുടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06022",
    "name": "Kanjikkuzhy Gramapanchayath",
    "nameMl": "കഞ്ഞിക്കുഴി ഗ്രാമപഞ്ചായത്ത്, ഇടുക്കി ജില്ല",
    "district": "Idukki"
  },
  {
    "code": "G06023",
    "name": "Vannappuram Gramapanchayath",
    "nameMl": "വണ്ണപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06024",
    "name": "Karimannoor Gramapanchayath",
    "nameMl": "കരിമണ്ണൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06025",
    "name": "Kodikulam Gramapanchayath",
    "nameMl": "കോടിക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06026",
    "name": "Vazhathope Gramapanchayath",
    "nameMl": "വാഴത്തോപ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06027",
    "name": "Udumbannoor Gramapanchayath",
    "nameMl": "ഉടുമ്പന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06028",
    "name": "Mariyapuram Gramapanchayath",
    "nameMl": "മരിയാപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06029",
    "name": "Kamakshy Gramapanchayath",
    "nameMl": "കാമാക്ഷി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06030",
    "name": "Erattayar Gramapanchayath",
    "nameMl": "ഇരട്ടയാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06031",
    "name": "Pampadumpara Gramapanchayath",
    "nameMl": "പാമ്പാടുംപാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06032",
    "name": "Karunapuram Gramapanchayath",
    "nameMl": "കരുണാപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06033",
    "name": "Vandanmedu Gramapanchayat",
    "nameMl": "വണ്ടൻമേട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06034",
    "name": "Chakkupallam Gramapanchayath",
    "nameMl": "ചക്കുപള്ളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06035",
    "name": "Ayyappankovil Grampanchayat",
    "nameMl": "അയ്യപ്പൻ കോവിൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06036",
    "name": "Kattappana Grama Panchayat",
    "nameMl": "കട്ടപ്പന നഗരസഭ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06037",
    "name": "Kanchiyar Gramapanchayath",
    "nameMl": "കാഞ്ചിയാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06038",
    "name": "Upputhara Gramapanchayath",
    "nameMl": "ഉപ്പുതറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06039",
    "name": "Kumily Gramapanchayath",
    "nameMl": "കുമിളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06040",
    "name": "Vandiperiyar Grampanchayat",
    "nameMl": "വണ്ടിപ്പെരിയാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06041",
    "name": "Peruvanthanam Gramapanchayath",
    "nameMl": "പെരുവന്താനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06042",
    "name": "Kokkayar Gramapanchayath",
    "nameMl": "കൊക്കയാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06043",
    "name": "Peermade Gramapanchayath",
    "nameMl": "പീരുമേട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06044",
    "name": "Elappara Gramapanchayath",
    "nameMl": "ഏലപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06045",
    "name": "Arakulam Gramapanchayath",
    "nameMl": "അറക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06046",
    "name": "Velliyamattom Gramapanchayat",
    "nameMl": "വെളളിയാമറ്റം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06047",
    "name": "Kudayathoor Grampanchayat",
    "nameMl": "കുടയത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06048",
    "name": "Alakode Gramapanchayat",
    "nameMl": "ആലക്കോട് ഗ്രാമപഞ്ചായത്ത്, ഇടുക്കി ജില്ല",
    "district": "Idukki"
  },
  {
    "code": "G06049",
    "name": "Muttom Gramapanchayath",
    "nameMl": "മുട്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G07099",
    "name": "Karimkunnam Gramapanchayath",
    "nameMl": "കരിങ്കുന്നം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07100",
    "name": "Purapuzha Gramapanchayath",
    "nameMl": "പുറപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G07101",
    "name": "Manakkad Gramapanchayath",
    "nameMl": "മണക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G06050",
    "name": "Edavetty Gramapanchayath",
    "nameMl": "ഇടവെട്ടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06051",
    "name": "Kumaramangalam Gramapanchayath",
    "nameMl": "കുമാരമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06052",
    "name": "Thodupuzha Grama Panchayat",
    "nameMl": "തൊടുപുഴ നഗരസഭ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G04001",
    "name": "Chempu Gramapanchayath",
    "nameMl": "ചെമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G07102",
    "name": "Aroor Grama Panchayath",
    "nameMl": "അരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G04002",
    "name": "Arukutty Grama Panchayath",
    "nameMl": "അരൂകുറ്റി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G07103",
    "name": "Perumbalam Grama Panchayat",
    "nameMl": "പെരുമ്പളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Ernakulam"
  },
  {
    "code": "G04003",
    "name": "Panavalli grama panchayat",
    "nameMl": "പാണാവള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04004",
    "name": "Ezhupunna gram panchayat",
    "nameMl": "എഴുപുന്ന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04005",
    "name": "Kodamthuruthu gram panchayat",
    "nameMl": "കോടംതുരുത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04006",
    "name": "Thaikkattussery Grama Panchayath",
    "nameMl": "തൈക്കാട്ടുശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04007",
    "name": "Kuthiyathodu grama panchayat",
    "nameMl": "കുത്തിയോടോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04008",
    "name": "Thuravoor grama panchayat",
    "nameMl": "തുറവൂർ ഗ്രാമപഞ്ചായത്ത് (ആലപ്പുഴ ജില്ല)",
    "district": "Alappuzha"
  },
  {
    "code": "G04009",
    "name": "Chennam Pallipuram grama panchayat",
    "nameMl": "ചേന്നംപള്ളിപ്പുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04010",
    "name": "Vayalar Grama Panchayath",
    "nameMl": "വയലാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04011",
    "name": "Pattanakkad Grama Panchayat",
    "nameMl": "പട്ടണക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04012",
    "name": "Kadakarappally Grama Panchayat",
    "nameMl": "കടക്കരപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04013",
    "name": "Cherthala south Grama Panchayat",
    "nameMl": "ചേർത്തല തെക്ക് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04014",
    "name": "Cherthala Grama Panchayat",
    "nameMl": "ചേർത്തല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04015",
    "name": "Thanneermukkam grama panchayat",
    "nameMl": "തണ്ണീർമുക്കം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04016",
    "name": "Muhamma gram panchayat",
    "nameMl": "മുഹമ്മ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04017",
    "name": "Kanjikuzhi grama panchayat",
    "nameMl": "കഞ്ഞിക്കുഴി ഗ്രാമപഞ്ചായത്ത്, ആലപ്പുഴ ജില്ല",
    "district": "Alappuzha"
  },
  {
    "code": "G04018",
    "name": "Mararikulam North Grama Panchayat",
    "nameMl": "മാരാരിക്കുളം വടക്ക് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04019",
    "name": "Mararikulam South Grama Panchayat",
    "nameMl": "മാരാരിക്കുളം തെക്ക് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04020",
    "name": "Mannancherry Grama Panchayat",
    "nameMl": "മണ്ണഞ്ചരി ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04021",
    "name": "Aryad gram panchayat",
    "nameMl": "ആര്യാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04022",
    "name": "Alappuzha Grama Panchayat",
    "nameMl": "ആലപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04023",
    "name": "Punnapra North grama panchayat",
    "nameMl": "പുന്നപ്ര വടക്ക് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04024",
    "name": "Punnapra South grama panchayat",
    "nameMl": "പുന്നപ്ര തെക്ക് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04025",
    "name": "Ambalapuzha North Grama Panchayat",
    "nameMl": "അമ്പലപ്പുഴ വടക്ക് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04026",
    "name": "Ambalapuzha South Grama Panchayat",
    "nameMl": "അമ്പലപ്പുഴ തെക്ക് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04027",
    "name": "Purakkad Grama Panchayat",
    "nameMl": "പുറക്കാട് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04028",
    "name": "Kainakari gram panchayat",
    "nameMl": "കൈനകരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04029",
    "name": "Pulinkunnu grama panchayat",
    "nameMl": "പുളിങ്കുന്ന് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G05002",
    "name": "Kavalam gram panchayat",
    "nameMl": "കാവാലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05003",
    "name": "Neelamperoor gram panchayat",
    "nameMl": "നീലംപേരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G04030",
    "name": "Nedumudi village panchayat",
    "nameMl": "നെടുമുടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04031",
    "name": "Champakulam Grama Panchayath",
    "nameMl": "ചമ്പക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G05004",
    "name": "Ramankari Grama Panchayat",
    "nameMl": "രാമങ്കരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05005",
    "name": "Veliyanadu grama panchayat",
    "nameMl": "വെളിയനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05006",
    "name": "Muttar Grama Panchayat",
    "nameMl": "മുട്ടാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G04032",
    "name": "Thakazhy Grama Panchayat",
    "nameMl": "തകഴി ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G02002",
    "name": "Edathwa grama panchayat",
    "nameMl": "എടത്വ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02003",
    "name": "Thalavady Grama Panchayat",
    "nameMl": "തലവടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02004",
    "name": "Veeyapuram Grama Panchayath",
    "nameMl": "വീയപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G04033",
    "name": "Cheruthana Grama Panchayath",
    "nameMl": "ചെറുതന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04034",
    "name": "Karuvatta Grama Panchayath",
    "nameMl": "കരുവാറ്റ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04035",
    "name": "Trikkunnappuzha grama panchayath",
    "nameMl": "തൃക്കുന്നപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04036",
    "name": "Kumarapuram gram panchayat",
    "nameMl": "കുമാരപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G02005",
    "name": "Haripad Grama Panchayat",
    "nameMl": "ഹരിപ്പാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02006",
    "name": "Pallippadu panchayat",
    "nameMl": "പള്ളിപ്പാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G04037",
    "name": "Karthikapally gram panchayat",
    "nameMl": "കാർത്തികപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04038",
    "name": "Arattupuzha grama panchayath",
    "nameMl": "ആറാട്ടുപുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G02007",
    "name": "Chingoli gram panchayat",
    "nameMl": "ചിങ്ങോലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02008",
    "name": "Muthukulam gram panchayat",
    "nameMl": "മുതുകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02009",
    "name": "Kandalloor Grama Panchayat",
    "nameMl": "കണ്ടല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02010",
    "name": "Cheppad Grama Panchayat",
    "nameMl": "ചേപ്പാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02011",
    "name": "Pathiyoor gram panchayat",
    "nameMl": "പത്തിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03001",
    "name": "Kayamkulam Grama Panchayat",
    "nameMl": "കായംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02012",
    "name": "Devikulangara Grama Panchayat",
    "nameMl": "ദേവികുളങ്ങര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03002",
    "name": "Krishnapuram Gram panchayat",
    "nameMl": "കൃഷ്ണപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03003",
    "name": "Mannar grama panchayat",
    "nameMl": "മാന്നാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03004",
    "name": "Budhanoor Grama Panchayat",
    "nameMl": "ബുധനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03005",
    "name": "Thiruvnavandoor Grama Panchayat",
    "nameMl": "തിരുവൻവണ്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03006",
    "name": "Pandanad grama panchayat",
    "nameMl": "പാണ്ടനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03007",
    "name": "Chengannur Grama Panchayat",
    "nameMl": "ചെങ്ങന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03008",
    "name": "Mulakkuzha grama panchayat",
    "nameMl": "മുളക്കുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03009",
    "name": "Ala Grama Panchayat",
    "nameMl": "ആല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03010",
    "name": "Puliyoor panchayath",
    "nameMl": "പുലിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03011",
    "name": "Cheriyanadu panchayat",
    "nameMl": "ചെറിയനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03012",
    "name": "Venmony gram panchayat",
    "nameMl": "വെണ്മണി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03013",
    "name": "Chennithala Thripperumthura gram panchayat",
    "nameMl": "ചെന്നിത്തല-തൃപ്പെരുന്തുറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03014",
    "name": "Chettikulangara Grama Panchayat",
    "nameMl": "ചെട്ടികുളങ്ങര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03015",
    "name": "Mavelikkara Grama Panchayat",
    "nameMl": "മാവേലിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03016",
    "name": "Thazhakkara grama panchayat",
    "nameMl": "തഴക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03017",
    "name": "Mavelikkara Thekkakkara Grama Panchayat",
    "nameMl": "മാവേലിക്കര തെക്കേക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03018",
    "name": "Bharanikkavu Gram Panchayat",
    "nameMl": "ഭരണിക്കാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03019",
    "name": "Vallikkunnam grama panchayat",
    "nameMl": "വള്ളിക്കുന്നം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03020",
    "name": "Thamarakkulam Grama Panchayath",
    "nameMl": "താമരക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03021",
    "name": "Palamel gram panchayat",
    "nameMl": "പാലമേൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03022",
    "name": "Nooranadu grama panchayat",
    "nameMl": "നൂറനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03023",
    "name": "Chunakkara grama panchayat",
    "nameMl": "ചുനക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G05007",
    "name": "Velloor Grama Panchayat",
    "nameMl": "വെള്ളൂര്‍ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05008",
    "name": "Mulakkulam Gramapanchayath",
    "nameMl": "മുളക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05009",
    "name": "Njeezhoor Gramapanchayat",
    "nameMl": "ഞീഴൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G04039",
    "name": "Maravanthuruthu Grama Panchayat",
    "nameMl": "മറവൻതുരുത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04040",
    "name": "Udayanapuram Gramapanchayath",
    "nameMl": "ഉദയനാപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04041",
    "name": "Vaikom Grama Panchayat",
    "nameMl": "വൈക്കം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04042",
    "name": "Thalayolaparambu Gramapanchayath",
    "nameMl": "തലയോലപ്പറമ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G05010",
    "name": "Kaduthuruthy Gramapanchayath",
    "nameMl": "കടുത്തുരുത്തി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05011",
    "name": "Manjoor Gramapanchayath",
    "nameMl": "മാഞ്ഞൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05012",
    "name": "Kallara Grampanchayat",
    "nameMl": "കല്ലറ ഗ്രാമപഞ്ചായത്ത് (കോട്ടയം)",
    "district": "Kottayam"
  },
  {
    "code": "G04043",
    "name": "TV Puram Grama Panchayat",
    "nameMl": "ടി.വി. പുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04044",
    "name": "Thalayazham Gramapanchayath",
    "nameMl": "തലയാഴം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G04045",
    "name": "Vechoor Grampanchayat",
    "nameMl": "വെച്ചൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G05013",
    "name": "Veliyannoor Grampanchayath",
    "nameMl": "വെളിയന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05014",
    "name": "Uzhavoor Gramapanchayath",
    "nameMl": "ഉഴവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05015",
    "name": "Ramapuram Gramapanchayath",
    "nameMl": "രാമപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G06053",
    "name": "Kadanadu Gramapanchayath",
    "nameMl": "കടനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06054",
    "name": "Melukavu Gramapanchayath",
    "nameMl": "മേലുകാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06055",
    "name": "Moonnilavu Gramapanchayath",
    "nameMl": "മൂന്നിലവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06056",
    "name": "Thalappalam Gramapanchayath",
    "nameMl": "തലപ്പലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06057",
    "name": "Bharananganam Gramapanchayath",
    "nameMl": "ഭരണങ്ങാനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G05016",
    "name": "Pala Grama Panchayat",
    "nameMl": "പാല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05017",
    "name": "Karoor Grampanchayath",
    "nameMl": "കരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05018",
    "name": "Marangattupally Gramapanchayath",
    "nameMl": "മരങ്ങാട്ടുപിള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05019",
    "name": "Kuravilangadu Gramapanchayath",
    "nameMl": "കുറവിലങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05020",
    "name": "Kanakkary Gramapanchayath",
    "nameMl": "കാണക്കാരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05021",
    "name": "Kadaplamattom Gramapanchayath",
    "nameMl": "കടപ്ലാമറ്റം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05022",
    "name": "Kidangoor Gramapanchayath",
    "nameMl": "കിടങ്ങൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05023",
    "name": "Mutholy Gramapanchayath",
    "nameMl": "മുത്തോലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05024",
    "name": "Kozhuvanal Gramapanchayath",
    "nameMl": "കൊഴുവനാൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G06058",
    "name": "Meenachil gramapanchayath",
    "nameMl": "മീനച്ചിൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06059",
    "name": "Thidanadu Gramapanchayath",
    "nameMl": "തിടനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06060",
    "name": "Poonjar Grampanchayath",
    "nameMl": "പൂഞ്ഞാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06061",
    "name": "Poonjar Thekkekara Grama Panchayat",
    "nameMl": "പൂഞ്ഞാർ തെക്കേക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06062",
    "name": "Erattupetta Grama Panchayat",
    "nameMl": "ഈരാറ്റുപേട്ട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06063",
    "name": "Teekoy Gramapanchayath",
    "nameMl": "തീക്കോയി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06064",
    "name": "Thalanadu Gramapanchayath",
    "nameMl": "തലനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G05025",
    "name": "Arpookkara Gramapanchayath",
    "nameMl": "ആർപ്പൂക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05026",
    "name": "Neendoor Gramapanchayat",
    "nameMl": "നീണ്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05027",
    "name": "Athirampuzha Gramapanchayath",
    "nameMl": "അതിരമ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05028",
    "name": "Ettumanoor Grama Panchayat",
    "nameMl": "ഏറ്റുമാനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05029",
    "name": "Ayarkunnam Gramapanchayath",
    "nameMl": "അയർക്കുന്നം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05030",
    "name": "Akalakkunnam Gramapanchayath",
    "nameMl": "അകലക്കുന്നം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05031",
    "name": "Pallickathodu Gramapanchayath",
    "nameMl": "പള്ളിക്കത്തോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05032",
    "name": "Kooroppada Gramapanchayath",
    "nameMl": "കൂരോപ്പട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05033",
    "name": "Manarcadu Gramapanchayath",
    "nameMl": "മണര്‍കാട് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05034",
    "name": "Pampady Gramapanchayath",
    "nameMl": "പാമ്പാടി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05035",
    "name": "Meenadom Gramapanchayath",
    "nameMl": "മീനടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05036",
    "name": "Puthuppally Gramapanchayath",
    "nameMl": "പുതുപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05037",
    "name": "Panachikadu Gramapanchayath",
    "nameMl": "പനച്ചിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05038",
    "name": "Vijayapuram Gramapanchayath",
    "nameMl": "വിജയപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05039",
    "name": "Aymanam Gramapanchayath",
    "nameMl": "അയ്മനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G04046",
    "name": "Kumarakom Gramapanchayath",
    "nameMl": "കുമരകം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Alappuzha"
  },
  {
    "code": "G05040",
    "name": "Kottayam Grama Panchayat",
    "nameMl": "കോട്ടയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05041",
    "name": "Kurichy Gramapanchayath",
    "nameMl": "കുറിച്ചി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05042",
    "name": "Vazhapally gram panchayat",
    "nameMl": "വാഴപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05043",
    "name": "Changanassery Grama Panchayat",
    "nameMl": "ചങ്ങനാശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05044",
    "name": "Paippadu Gramapanchayath",
    "nameMl": "പായിപ്പാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05045",
    "name": "Thrikkodithanam Gramapanchayath",
    "nameMl": "തൃക്കൊടിത്താനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05046",
    "name": "Madappally Gramapanchayath",
    "nameMl": "മാടപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05047",
    "name": "Vakathanam Gramapanchayath",
    "nameMl": "വാകത്താനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05048",
    "name": "Karukachal Gramapanchayath",
    "nameMl": "കറുകച്ചാൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05049",
    "name": "Nedumkunnam Grampanchayath",
    "nameMl": "നെടുംകുന്നം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G06065",
    "name": "Kangazha Gramapanchayath",
    "nameMl": "കങ്ങഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06066",
    "name": "Vellavoor Gramapanchayat",
    "nameMl": "വെള്ളാവൂര്‍ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06067",
    "name": "Manimala Gramapanchayath",
    "nameMl": "മണിമല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06068",
    "name": "Erumely Gramapanchayath",
    "nameMl": "എരുമേലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06069",
    "name": "Koruthode Gramapanchayath",
    "nameMl": "കോരുത്തോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06070",
    "name": "Mundakayam Gramapanchayath",
    "nameMl": "മുണ്ടക്കയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06071",
    "name": "Kanjirappally Grampanchayath",
    "nameMl": "കാഞ്ഞിരപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06072",
    "name": "Parathodu Gramapanchayath",
    "nameMl": "പാറത്തോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06073",
    "name": "Koottickal Gramapanchayath",
    "nameMl": "കൂട്ടിക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06074",
    "name": "Chirakkadavu Gramapanchayath",
    "nameMl": "ചിറക്കടവ് ഗ്രാമപഞ്ചായത്ത് ടൗൺ ഹാൾ",
    "district": "Idukki"
  },
  {
    "code": "G06075",
    "name": "Elikkulam Gramapanchayath",
    "nameMl": "എലിക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06076",
    "name": "Vazhoor Grampanchayat",
    "nameMl": "വാഴൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G05050",
    "name": "Thiruvarppu Gramapanchayat",
    "nameMl": "തിരുവാർപ്പ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G02013",
    "name": "Alappad Grama Panchayat",
    "nameMl": "ആലപ്പാട് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03024",
    "name": "Kulasekharapuram Grama Panchayat",
    "nameMl": "കുലശേഖരപുരം ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03025",
    "name": "Oachira Gramapanchayath",
    "nameMl": "ഓച്ചിറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02014",
    "name": "Clappana Gramapanchayat",
    "nameMl": "ക്ലാപ്പന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02015",
    "name": "Karunagappally Grama Panchayat",
    "nameMl": "Karunagappally Grama Panchayat",
    "district": "Kollam"
  },
  {
    "code": "G03026",
    "name": "Thodiyoor Grama Panchayat",
    "nameMl": "തൊടിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03027",
    "name": "Thazhava Grama Panchayat",
    "nameMl": "തഴവ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02016",
    "name": "Panmana Gramapanchayath",
    "nameMl": "പന്‍മന ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02017",
    "name": "Thevalakkara Gramapanchayat",
    "nameMl": "തേവലക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02018",
    "name": "Chavara Gramapanchayath",
    "nameMl": "ചവറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02019",
    "name": "Thekkumbhagam Gramapanchayath",
    "nameMl": "തെക്കുംഭാഗം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02020",
    "name": "Neendakara Gramapanchayat",
    "nameMl": "നീണ്ടകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03028",
    "name": "Sooranad North Grama Panchayat",
    "nameMl": "ശൂരനാട് നോര്‍ത്ത് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03029",
    "name": "Sooranad South Grama Panchayat",
    "nameMl": "ശൂരനാട് സൌത്ത് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02021",
    "name": "Sasthamcotta Gramapanchayath",
    "nameMl": "ശാസ്താംകോട്ട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02022",
    "name": "Mynagappally Grama Panchayat",
    "nameMl": "മൈനാഗപ്പള്ളി ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02023",
    "name": "West Kallada Gramapanchayat",
    "nameMl": "പടിഞ്ഞാറെ കല്ലട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02024",
    "name": "East Kallada Gramapanchayat",
    "nameMl": "കിഴക്കേ കല്ലട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02025",
    "name": "Munroethuruth Grama Panchayat",
    "nameMl": "മണ്‍റോതുരുത്ത് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02026",
    "name": "Perayam Gramapanchayath",
    "nameMl": "പേരയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02027",
    "name": "Kundara Gramapanchayath",
    "nameMl": "കുണ്ടറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02028",
    "name": "Thrikkaruva Gramapanchayath",
    "nameMl": "തൃക്കരുവ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02029",
    "name": "Panayam Gramapanchayath",
    "nameMl": "പനയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02030",
    "name": "Perinad Gramapanchayath",
    "nameMl": "പെരിനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02031",
    "name": "Elampalloor Grama Panchayat",
    "nameMl": "ഇളംപള്ളൂര്‍ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02032",
    "name": "Kottamkara Grama Panchayat",
    "nameMl": "കൊറ്റങ്കര ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02033",
    "name": "Thrikkovilvattom Gramapanchayat",
    "nameMl": "തൃക്കോവിൽവട്ടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02034",
    "name": "Nedumbana Gramapanchayath",
    "nameMl": "നെടുമ്പന ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02035",
    "name": "Adichanalloor Gramapanchayat",
    "nameMl": "ആദിച്ചനല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02036",
    "name": "Mayyanad Grama Panchayat",
    "nameMl": "മയ്യനാട് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02037",
    "name": "Paravoor Grama Panchayat",
    "nameMl": "പരവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02038",
    "name": "Poothakkulam Gramapanchayath",
    "nameMl": "പൂതക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02039",
    "name": "Chirakkara Gramapanchayath",
    "nameMl": "ചിറക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02040",
    "name": "Chathanoor Grampanchayat",
    "nameMl": "ചാത്തന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02041",
    "name": "Kalluvaathukkal Grama Panchayath",
    "nameMl": "കല്ലുവാതുക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03030",
    "name": "Kulakkada Gramapanchayath",
    "nameMl": "കുളക്കട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02042",
    "name": "Mylom Gramapanchayath",
    "nameMl": "മൈലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02043",
    "name": "Neduvathoor Grama Panchayat",
    "nameMl": "നെടുവത്തൂര്‍ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02044",
    "name": "Pavithreswaram Gramapanchayath",
    "nameMl": "പവിത്രേശ്വരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02045",
    "name": "Ezhukone Gramapanchayath",
    "nameMl": "എഴുകോൺ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02046",
    "name": "Kottarakara Grama Panchayat",
    "nameMl": "Kottarakara Grama Panchayat",
    "district": "Kollam"
  },
  {
    "code": "G02047",
    "name": "Melila Gramapanchayath",
    "nameMl": "മേലില ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02048",
    "name": "Vettikavala Gramapanchayath",
    "nameMl": "വെട്ടിക്കവല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02049",
    "name": "Ummannoor Gramapanchayath",
    "nameMl": "ഉമ്മന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02050",
    "name": "Kareepra Gramapanchayath",
    "nameMl": "കരീപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02051",
    "name": "Veliyam Gramapanchayath",
    "nameMl": "വെളിയം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02052",
    "name": "Elamadu Grama Panchayat",
    "nameMl": "എലമാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02053",
    "name": "Pooyappally Grama Panchayath",
    "nameMl": "പൂയപ്പള്ളി ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02054",
    "name": "Velinalloor Grama Panchayat",
    "nameMl": "വെളിനല്ലൂര്‍ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02055",
    "name": "Chadayamangalam Gramapanchayath",
    "nameMl": "ചടയമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02056",
    "name": "Nilamel Gramapanchayat",
    "nameMl": "നിലമേൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02057",
    "name": "Ittiva Gramapanchayath",
    "nameMl": "ഇട്ടിവ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02058",
    "name": "Kadakkal Gramapanchayath",
    "nameMl": "കടയ്ക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02059",
    "name": "Kummil Gramapanchayath",
    "nameMl": "കുമ്മിൾ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02060",
    "name": "Chithara Gramapanchayath",
    "nameMl": "ചിതറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03031",
    "name": "Pattazhi Gramapanchayath",
    "nameMl": "പട്ടാഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03032",
    "name": "Talavoor Gramapanchayat",
    "nameMl": "തലവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02061",
    "name": "Vilakkudy Grama Panchayat",
    "nameMl": "വിളക്കുടി ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03033",
    "name": "Pathanapuram Gramapanchayath",
    "nameMl": "പത്തനാപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03034",
    "name": "Piravanthur Gramapanchayat",
    "nameMl": "പിറവന്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02062",
    "name": "Punalur Grama Panchayat",
    "nameMl": "പുനലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02063",
    "name": "Karavaloor Gramapanchayath",
    "nameMl": "കരവാളൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02064",
    "name": "Edamulakkal Gramapanchayath",
    "nameMl": "ഇടമുളയ്ക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02065",
    "name": "Anchal Gramapanchayath",
    "nameMl": "അഞ്ചൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02066",
    "name": "Yeroor Gramapanchayath",
    "nameMl": "ഏരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02067",
    "name": "Alayaman Gramapanchayath",
    "nameMl": "അലയമൺ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02068",
    "name": "Kulathupuzha Gramapanchayath",
    "nameMl": "കുളത്തുപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02069",
    "name": "Thenmala Gramapanchayath",
    "nameMl": "തെന്മല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02070",
    "name": "Aryankavu Gramapanchayat",
    "nameMl": "ആര്യങ്കാവ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G03035",
    "name": "Poruvazhi Gramapanchayath",
    "nameMl": "പോരുവഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03036",
    "name": "Pattazhi Vadakkekara Gramapanchayath",
    "nameMl": "പട്ടാഴി വടക്കേക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03037",
    "name": "Kunnathoor Gramapanchayat",
    "nameMl": "കുന്നത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G02071",
    "name": "Pallikkal Grampanchayat",
    "nameMl": "പള്ളിയ്ക്കൽ ഗ്രാമപഞ്ചായത്ത്, തിരുവനന്തപുരം ജില്ല",
    "district": "Kollam"
  },
  {
    "code": "G02072",
    "name": "Madavoor Grampanchayat",
    "nameMl": "മടവൂർ ഗ്രാമപഞ്ചായത്ത് (തിരുവനന്തപുരം)",
    "district": "Kollam"
  },
  {
    "code": "G02073",
    "name": "Navaikulam Gramapanchayath",
    "nameMl": "നാവായിക്കുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G01002",
    "name": "Karavaram Gramapanchayath",
    "nameMl": "കരവാരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G02074",
    "name": "Chemmaruthy Gramapanchayath",
    "nameMl": "ചെമ്മരുതി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02075",
    "name": "Elakamon Gramapanchayath",
    "nameMl": "ഇലകമൺ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02076",
    "name": "Edava Gramapanchayath",
    "nameMl": "ഇടവ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G01003",
    "name": "Varkala Grama Panchayat",
    "nameMl": "വർക്കല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01004",
    "name": "Vettoor Gramapanchayath",
    "nameMl": "വെട്ടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01005",
    "name": "Cherunniyoor Grampanchayat",
    "nameMl": "ചെറുന്നിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01006",
    "name": "Ottoor Grampachayat Grama Panchayat",
    "nameMl": "ഒറ്റൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01007",
    "name": "Manampoor Gramapanchayat",
    "nameMl": "മണമ്പൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G02077",
    "name": "Kilimanoor Grama Panchayath",
    "nameMl": "കിളിമാനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G02078",
    "name": "Pazhayakunnummel Gramapanchayath",
    "nameMl": "പഴയകുന്നുമ്മേൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G01008",
    "name": "Pulimath Gramapanchayath",
    "nameMl": "പുളിമാത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G02079",
    "name": "Nagaroor Grampanchayat",
    "nameMl": "നഗരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G01009",
    "name": "Mudakkal Gramapanchayath",
    "nameMl": "മുദാക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01010",
    "name": "Attingal Grama Panchayat",
    "nameMl": "ആറ്റിങ്ങൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01011",
    "name": "Kizhuvilam Gramapanchayat",
    "nameMl": "കീഴുവിലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01012",
    "name": "Vakkom Gramapanchayath",
    "nameMl": "വക്കം ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01013",
    "name": "Chirayinkeezhu Gramapanchayath",
    "nameMl": "ചിറയിൻകീഴ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01014",
    "name": "Azhoor Grampanchayat",
    "nameMl": "അഴൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01015",
    "name": "Kadakkavoor Gramapanchayath",
    "nameMl": "കടയ്ക്കാവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01016",
    "name": "Anjuthengu Grampanchayat",
    "nameMl": "അഞ്ചുതെങ്ങ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01017",
    "name": "Mangalapuram Gramapanchayath",
    "nameMl": "മംഗലപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01018",
    "name": "Pothencode Gramapanchayath",
    "nameMl": "പോത്തൻകോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01019",
    "name": "Andoorkonam Grampanchayat",
    "nameMl": "അണ്ടൂർക്കോണം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01020",
    "name": "Kadinamkulam Gramapanchayath",
    "nameMl": "കഠിനംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G02080",
    "name": "Pangode Gramapanchayath",
    "nameMl": "പാങ്ങോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kollam"
  },
  {
    "code": "G01021",
    "name": "Peringamala Gramapanchayath",
    "nameMl": "പെരിങ്ങമ്മല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01022",
    "name": "Vithura Gramapanchayath",
    "nameMl": "വിതുര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01023",
    "name": "Aryanad Gramapanchayath",
    "nameMl": "ആര്യനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01024",
    "name": "Vellanad Gramapanchayat",
    "nameMl": "വെള്ളനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01025",
    "name": "Uzhamalakkal Gramapanchayath",
    "nameMl": "ഉഴമലയ്ക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01026",
    "name": "Tholicode Gramapanchayath",
    "nameMl": "തൊളിക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01027",
    "name": "Nanniyode Gramapanchayath",
    "nameMl": "നന്ദിയോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01028",
    "name": "Kallara Grampanchayat",
    "nameMl": "കല്ലറ ഗ്രാമപഞ്ചായത്ത് (തിരുവനന്തപുരം)",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01029",
    "name": "Vamanapuram Gramapanchayath",
    "nameMl": "വാമനപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01030",
    "name": "Nellanad Gramapanchayath",
    "nameMl": "നെല്ലനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01031",
    "name": "Pullampara Gramapanchayath",
    "nameMl": "പുല്ലമ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01032",
    "name": "Manickal Gramapanchayath",
    "nameMl": "മാണിക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01033",
    "name": "Vembayam Gramapanchayat",
    "nameMl": "വെമ്പായം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01034",
    "name": "Panavoor Gramapanchayat",
    "nameMl": "പനവൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01035",
    "name": "Anad Gramapanchayath",
    "nameMl": "ആനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01036",
    "name": "Nedumangad Grama Panchayat",
    "nameMl": "നെടുമങ്ങാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01037",
    "name": "Karakulam Gramapanchayath",
    "nameMl": "കരകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01038",
    "name": "Aruvikkara Gramapanchayath",
    "nameMl": "Aruvikkara Gramapanchayath ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01039",
    "name": "Kuttichal Grampanchayat",
    "nameMl": "കുറ്റിച്ചല്‍ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01040",
    "name": "Kallikkadu Gramapanchayath",
    "nameMl": "കള്ളിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01041",
    "name": "Amboori Gramapanchayath",
    "nameMl": "അമ്പൂരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01042",
    "name": "Ottasekaramangalam Gramapanchayath",
    "nameMl": "ഒറ്റശേഖരമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01043",
    "name": "Vellarada Gramapanchayath",
    "nameMl": "വെള്ളറട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01044",
    "name": "Aryancode Gramapanchayath",
    "nameMl": "ആര്യങ്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01045",
    "name": "Kattakada Gramapanchayath",
    "nameMl": "കാട്ടാക്കട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01046",
    "name": "Poovachal Gramapanchayath",
    "nameMl": "പൂവച്ചൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01047",
    "name": "Vilappil Gramapanchayat",
    "nameMl": "വിളപ്പിൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01048",
    "name": "Vilavoorkkal Gramapanchayat",
    "nameMl": "വിളവൂർക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01049",
    "name": "Maranalloor Gramapanchayat",
    "nameMl": "മാറനെല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01050",
    "name": "Malayinkeezhu Grampanchayat",
    "nameMl": "മലയിൻകീഴ് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01051",
    "name": "Pallichal Gramapanchayat",
    "nameMl": "പള്ളിച്ചൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01052",
    "name": "Kalliyoor Gramapanchayath",
    "nameMl": "കല്ലിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01053",
    "name": "Venganoor Gramapanchayat",
    "nameMl": "വെങ്ങാനൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01054",
    "name": "Kottukal Gramapanchayat",
    "nameMl": "കോട്ടുക്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01055",
    "name": "Balaramapuram Gramapanchayath",
    "nameMl": "ബാലരാമപുരം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01056",
    "name": "Neyyattinkara Grama Panchayat",
    "nameMl": "നെയ്യാറ്റിൻകര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01057",
    "name": "Athiyannur, Thiruvananthapuram Grama Panchayat",
    "nameMl": "അതിയന്നൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01058",
    "name": "Kanjiramkulam Gramapanchayath",
    "nameMl": "കാഞ്ഞിരംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01059",
    "name": "Thirupuram Gramapanchayath",
    "nameMl": "തിരുപുറം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01060",
    "name": "Poovar Grampanchayat",
    "nameMl": "പൂവാർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01061",
    "name": "Karumkulam Gramapanchayath",
    "nameMl": "കരുംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01062",
    "name": "Kulathoor Grampanchayat",
    "nameMl": "കുളത്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01063",
    "name": "Karode Gramapanchayath",
    "nameMl": "കാരോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01064",
    "name": "Parassala Gramapanchayath",
    "nameMl": "പാറശാല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01065",
    "name": "Chenkal Gramapanchayat",
    "nameMl": "ചെങ്കൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01066",
    "name": "Kollayil Gramapanchayath",
    "nameMl": "കൊല്ലയിൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01067",
    "name": "Kunnathukal Gramapanchayat",
    "nameMl": "കുന്നത്തുകാൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G01068",
    "name": "Perumkadavila Gramapanchayath",
    "nameMl": "പെരുങ്കടവിള ഗ്രാമപഞ്ചായത്ത്",
    "district": "Thiruvananthapuram"
  },
  {
    "code": "G03038",
    "name": "Niranam Gramapanchayath",
    "nameMl": "നിരണം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03039",
    "name": "Kadapra Gramapanchayath",
    "nameMl": "കടപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03040",
    "name": "Nedumpram Gramapanchayath",
    "nameMl": "നെടുമ്പ്രം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03041",
    "name": "Peringara Gramapanchayath",
    "nameMl": "പെരിങ്ങര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03042",
    "name": "Thiruvalla Grama Panchayat",
    "nameMl": "തിരുവല്ല ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03043",
    "name": "Kuttoor Gramapanchayath",
    "nameMl": "കുറ്റൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03044",
    "name": "Eraviperoor Gramapanchayath",
    "nameMl": "ഇരവിപേരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G05051",
    "name": "Kaviyoor Gramapanchayath",
    "nameMl": "കവിയൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05052",
    "name": "Kunnanthanam Gramapanchayath",
    "nameMl": "കുന്നന്താനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05053",
    "name": "Kallooppara Gramapanchayath",
    "nameMl": "കല്ലൂപ്പാറ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05054",
    "name": "Anikkadu Gramapanchayath",
    "nameMl": "ആനിക്കാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G05055",
    "name": "Mallappally Gramapanchayath",
    "nameMl": "മല്ലപ്പള്ളി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G03045",
    "name": "Puramattam Gramapanchayath",
    "nameMl": "പുറമറ്റം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G05056",
    "name": "Ezhumattoor Gramapanchayath",
    "nameMl": "എഴുമറ്റൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Kottayam"
  },
  {
    "code": "G06077",
    "name": "Kottangal Gramapanchayath",
    "nameMl": "കോട്ടാങ്ങൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06078",
    "name": "Kottanad Gramapanchayath",
    "nameMl": "കൊറ്റനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G03046",
    "name": "Koipram Gramapanchayath",
    "nameMl": "കോയിപ്രം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03047",
    "name": "Thottappuzhassery Gramapanchayath",
    "nameMl": "തോട്ടപ്പുഴശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03048",
    "name": "Ayiroor Gramapanchayath",
    "nameMl": "അയിരൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03049",
    "name": "Cherukole Gramapanchayath",
    "nameMl": "ചെറുകോൽ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03050",
    "name": "Ranni Gramapanchayath",
    "nameMl": "റാന്നി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G06079",
    "name": "Ranni Angadi Gramapanchayath",
    "nameMl": "റാന്നി അങ്ങാടി ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06080",
    "name": "Ranni Pazhavangadi Gramapanchayath",
    "nameMl": "റാന്നി പഴവങ്ങാടി ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06081",
    "name": "Naranammuzhi Gramapanchayath",
    "nameMl": "നാറാണംമൂഴി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Idukki"
  },
  {
    "code": "G06082",
    "name": "Vechoochira Gramapanchayath",
    "nameMl": "വെച്ചൂച്ചിറ ഗ്രാമപഞ്ചായത്ത് ഓഫീസ്",
    "district": "Idukki"
  },
  {
    "code": "G03051",
    "name": "Chittar Gramapanchayath",
    "nameMl": "ചിറ്റാര്‍ ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03052",
    "name": "Ranni Perunadu Grama Panchayat",
    "nameMl": "റാന്നി പെരുനാട് ഗ്രാമ പഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03053",
    "name": "Vadasserikkara Gramapanchayath",
    "nameMl": "വടശ്ശേരിക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03054",
    "name": "Mylapra Gramapanchayath",
    "nameMl": "മൈലപ്ര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03055",
    "name": "Malayalapuzha Gramapanchayath",
    "nameMl": "മലയാലപ്പുഴ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03056",
    "name": "Seethathodu Gramapanchayath",
    "nameMl": "സീതത്തോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03057",
    "name": "Aruvappulam Gramapanchayath",
    "nameMl": "അരുവാപ്പുലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03058",
    "name": "Thannithodu Gramapanchayath",
    "nameMl": "തണ്ണിത്തോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03059",
    "name": "Kalanjoor Gramapanchayath",
    "nameMl": "കലഞ്ഞൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03060",
    "name": "Pramadam Gramapanchayath",
    "nameMl": "പ്രമാടം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03061",
    "name": "Konni Gramapanchayath",
    "nameMl": "കോന്നി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03062",
    "name": "Vallikkodu Gramapanchayath",
    "nameMl": "വള്ളിക്കോട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03063",
    "name": "Omalloor Gramapanchayath",
    "nameMl": "ഓമല്ലൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03064",
    "name": "Pathanamthitta Grama Panchayat",
    "nameMl": "പത്തനംതിട്ട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03065",
    "name": "Naranganam Gramapanchayath",
    "nameMl": "നാരങ്ങാനം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03066",
    "name": "Elanthoor Gramapanchayath",
    "nameMl": "ഇലന്തൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03067",
    "name": "Chenneerkara Gramapanchayath",
    "nameMl": "ചെന്നീർക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03068",
    "name": "Kulanada Gramapanchayath",
    "nameMl": "കുളനട ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03069",
    "name": "Mezhuvely Gramapanchayath",
    "nameMl": "മെഴുവേലി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03070",
    "name": "Mallappuzhassery Gramapanchayath",
    "nameMl": "മല്ലപ്പുഴശ്ശേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03071",
    "name": "Kozhanchery Gramapanchayath",
    "nameMl": "കോഴഞ്ചേരി ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03072",
    "name": "Aranmula Gramapanchayath",
    "nameMl": "ആറന്മുള ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03073",
    "name": "Pandalam Grama Panchayat",
    "nameMl": "പന്തളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03074",
    "name": "Thumpamon Grampanchayat",
    "nameMl": "തുമ്പമൺ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03075",
    "name": "Panthalam Thekkekkara Grampanchayat",
    "nameMl": "പന്തളം തെക്കേക്കര ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03076",
    "name": "Kodumon Gramapanchayath",
    "nameMl": "കൊടുമൺ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03077",
    "name": "Adoor Grama Panchayat",
    "nameMl": "അടൂർ ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03078",
    "name": "Pallikkal Grampanchayat",
    "nameMl": "പള്ളിയ്ക്കൽ ഗ്രാമപഞ്ചായത്ത്, പത്തനംതിട്ട ജില്ല",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03079",
    "name": "Kadambanad Gramapanchayath",
    "nameMl": "കടമ്പനാട് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03080",
    "name": "Earathu Gramapanchayath",
    "nameMl": "ഏറത്ത് ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03081",
    "name": "Ezhamkulam Gramapanchayath",
    "nameMl": "ഏഴംകുളം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  },
  {
    "code": "G03082",
    "name": "Enadimangalam Gramapanchayath",
    "nameMl": "ഏനാദിമംഗലം ഗ്രാമപഞ്ചായത്ത്",
    "district": "Pathanamthitta"
  }
];

export function getPanchayathsByDistrict(district: string): PanchayathOption[] {
  return KERALA_PANCHAYATHS.filter(p => p.district.toLowerCase() === district.toLowerCase());
}

export function getPanchayathByCode(code: string): PanchayathOption | undefined {
  return KERALA_PANCHAYATHS.find(p => p.code.toLowerCase() === code.trim().toLowerCase());
}

export function getPanchayathCenterCoordinates(code: string): [number, number] {
  const specificCoords: Record<string, [number, number]> = {
    'G110504': [11.2618, 75.9082],
    'G110706': [11.4580, 75.8850],
    '204902': [11.5750, 75.8160],
    'G070702': [10.0261, 76.3625]
  };
  if (specificCoords[code]) return specificCoords[code];

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
