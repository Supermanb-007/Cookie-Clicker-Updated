var GameLoaded = false;

var Game = {
  Init: function Init() {
    //console.log("Hey You! You Naughty Naughty..");

    // Game Default Settings
    let defaultSettings = {
      autosave: true,
      connectVia: "none",
      isGuest: true,
      sound: false,
      volume: 1,
      bakersName: localStorage.getItem("bakersName")
        ? localStorage.getItem("bakersName")
        : this.GetBakersName(),
      cookie: {
        count: localStorage.getItem("cookiesCount")
          ? parseInt(localStorage.getItem("cookiesCount"))
          : 0,
        cps: 0,
      },
      cursors: {
        count: localStorage.getItem("cursorCount")
          ? parseInt(localStorage.getItem("cursorCount"))
          : 0,
        basePrice: 15,
        currentPrice: 15,
        difference: 3,
        cps: 0,
      },
      bakers: {
        count: localStorage.getItem("bakerCount")
          ? parseInt(localStorage.getItem("bakerCount"))
          : 0,
        basePrice: 100,
        currentPrice: 100,
        difference: 33,
        cps: 0,
      },
      shops: {
        count: localStorage.getItem("cookieShopCount")
          ? parseInt(localStorage.getItem("cookieShopCount"))
          : 0,
        basePrice: 1100,
        currentPrice: 1100,
        difference: 165,
        cps: 0,
      },
      trucks: {
        count: localStorage.getItem("truckCount")
          ? parseInt(localStorage.getItem("truckCount"))
          : 0,
        basePrice: 12000,
        currentPrice: 12000,
        difference: 1800,
        cps: 0,
      },
      yards: {
        count: localStorage.getItem("yardCount")
          ? parseInt(localStorage.getItem("yardCount"))
          : 0,
        basePrice: 130000,
        currentPrice: 130000,
        difference: 19500,
        cps: 0,
      },
      sounds: {
        crunchSound: "../assets/sounds/cookie_crunch.mp3",
        otherSound: "../assets/sounds/buy_click.mp3",
      },
    };
    this.GameSettings = localStorage.getItem("settings")
      ? JSON.parse(localStorage.getItem("settings"))
      : defaultSettings;

    // Selectors
    this.nameChanger = document.querySelector(".name-changer");
    this.cookie = document.querySelector(".cookie");
    this.cookieCount = document.querySelector("#cookieCount");
    this.upgradeCounter = document.querySelectorAll(".upgradable-tile");
    this.saveGameButton = document.getElementById("saveGame");
    this.exportGameButton = document.getElementById("exportGame");
    this.importGameButton = document.getElementById("importGame");
    this.wipeGameButton = document.getElementById("wipeGame");
    this.importFile = document.getElementById("importFile");
    this.toggleOption = document.querySelectorAll("[data-option]");
    this.closeOption = document.querySelectorAll("[data-close-option]");
    // Event Listeners
    this.cookie.addEventListener(
      "click",
      this.HandleCookieClicks.bind(this),
      false
    );
    this.upgradeCounter.forEach((tileInstance) =>
      tileInstance.addEventListener(
        "click",
        this.HandleUpgrades.bind(this),
        false
      )
    );
    this.saveGameButton.addEventListener(
      "click",
      this.SaveGame.bind(this),
      false
    );
    this.exportGameButton.addEventListener(
      "click",
      this.ExportGame.bind(this),
      false
    );
    this.importGameButton.addEventListener(
      "click",
      this.ImportGame.bind(this),
      false
    );
    this.wipeGameButton.addEventListener(
      "click",
      this.WipeGame.bind(this),
      false
    );
    this.importFile.addEventListener(
      "change",
      this.ImportGameViaReader.bind(this),
      false
    );
    this.toggleOption.forEach((optionInstance) => {
      optionInstance.addEventListener(
        "click",
        this.ToggleOptions.bind(this),
        false
      );
    });
    this.closeOption.forEach((closeInstance) => {
      closeInstance.addEventListener(
        "click",
        this.CloseOptionPane.bind(this),
        false
      );
    });
    this.Load();
    //console.log(this.GameSettings.cookie);
    GameLoaded = true;
  },
  HandleAudio: function HandleAudio(forWhat) {
    if (!this.GameSettings.sound) {
      return;
    }
    switch (forWhat) {
      case "cookie":
        this.crunchSound = new Audio(this.GameSettings.sounds.crunchSound);
        this.crunchSound.currentTime = 0;
        this.crunchSound.play();
        break;
      case "other":
        this.otherSound = new Audio(this.GameSettings.sounds.otherSound);
        this.otherSound.currentTime = 0;
        this.otherSound.play();
        break;
    }
  },
  HandleCookieClicks: function HandleCookieClicks() {
    //console.log(this.GameSettings.cookie.count);
    this.GameSettings.cookie.count = ++this.GameSettings.cookie.count;
    this.cookieCount.innerText = this.GameSettings.cookie.count;
    this.totalCps = 0;
    this.HandleAudio("cookie");
    this.HandleUpdates();
    this.CheckUpdates();
  },
  HandleUpgrades: function HandleUpgrades(event) {
    let typeOfUpgrade = event.currentTarget.getAttribute("data-tile");
    let countOfWhat = "";
    switch (typeOfUpgrade) {
      case "cursors":
        if (
          this.GameSettings.cookie.count <
          this.GameSettings.cursors.currentPrice
        ) {
          return;
        } else {
          this.GameSettings.cookie.count =
            this.GameSettings.cookie.count -
            this.GameSettings.cursors.currentPrice;
          this.GameSettings.cursors.count = ++this.GameSettings.cursors.count;
          this.GameSettings.cursors.count % 2 == 0
            ? (this.GameSettings.cursors.difference =
                this.GameSettings.cursors.difference + 1)
            : false;
          this.GameSettings.cursors.currentPrice =
            this.GameSettings.cursors.currentPrice +
            this.GameSettings.cursors.difference;
          this.GameSettings.cursors.cps = parseFloat(
            this.GameSettings.cursors.count / 10
          ).toFixed(2);
        }
        countOfWhat = "cursors";
        break;
      case "bakers":
        if (
          this.GameSettings.cookie.count < this.GameSettings.bakers.currentPrice
        ) {
          return;
        } else {
          this.GameSettings.cookie.count =
            this.GameSettings.cookie.count -
            this.GameSettings.bakers.currentPrice;
          this.GameSettings.bakers.count = ++this.GameSettings.bakers.count;
          this.GameSettings.bakers.difference =
            this.GameSettings.bakers.difference + 1;
          this.GameSettings.bakers.currentPrice =
            this.GameSettings.bakers.currentPrice +
            this.GameSettings.bakers.difference;

          this.GameSettings.bakers.cps = parseFloat(
            this.GameSettings.bakers.count
          ).toFixed(2);
          countOfWhat = "bakers";
        }
        break;
      case "shops":
        if (
          this.GameSettings.cookie.count < this.GameSettings.shops.currentPrice
        ) {
          return;
        } else {
          this.GameSettings.cookie.count =
            this.GameSettings.cookie.count -
            this.GameSettings.shops.currentPrice;
          this.GameSettings.shops.count = ++this.GameSettings.shops.count;
          this.GameSettings.shops.count % 2 == 0
            ? (this.GameSettings.shops.difference =
                this.GameSettings.shops.difference + 1)
            : false;
          this.GameSettings.shops.currentPrice =
            this.GameSettings.shops.currentPrice +
            this.GameSettings.shops.difference;
          this.GameSettings.shops.cps = parseFloat(
            this.GameSettings.shops.count + 8
          ).toFixed(2);

          countOfWhat = "shops";
        }
        break;
      case "trucks":
        if (
          this.GameSettings.cookie.count < this.GameSettings.trucks.currentPrice
        ) {
          return;
        } else {
          this.GameSettings.cookie.count =
            this.GameSettings.cookie.count -
            this.GameSettings.trucks.currentPrice;
          this.GameSettings.trucks.count = ++this.GameSettings.trucks.count;
          this.GameSettings.trucks.count % 2 == 0
            ? (this.GameSettings.trucks.difference =
                this.GameSettings.trucks.difference + 1)
            : false;
          this.GameSettings.trucks.currentPrice =
            this.GameSettings.trucks.currentPrice +
            this.GameSettings.trucks.difference;
          this.GameSettings.trucks.cps = parseFloat(
            this.GameSettings.trucks.count + 47
          ).toFixed(2);
          countOfWhat = "trucks";
        }
        break;
      case "yards":
        if (
          this.GameSettings.cookie.count < this.GameSettings.yards.currentPrice
        ) {
          return;
        } else {
          this.GameSettings.cookie.count =
            this.GameSettings.cookie.count -
            this.GameSettings.yards.currentPrice;
          this.GameSettings.yards.count = ++this.GameSettings.yards.count;
          this.GameSettings.yards.count % 2 == 0
            ? (this.GameSettings.yards.difference =
                this.GameSettings.yards.difference + 1)
            : false;
          this.GameSettings.yards.currentPrice =
            this.GameSettings.yards.currentPrice +
            this.GameSettings.yards.difference;
          this.GameSettings.yards.cps = parseFloat(
            this.GameSettings.yards.count + 260
          ).toFixed(2);
          countOfWhat = "yards";
        }
        break;
    }
    this.HandleUpdates(event.currentTarget, countOfWhat);
    this.HandleAudio("other");
  },
  HandleUpdates: function HandleUpdates(selector, which) {
    if (selector && which) {
      selector.querySelector(".buy-money").innerText =
        this.GameSettings[which].currentPrice;
      selector.querySelector(".tile-count").innerText =
        this.GameSettings[which].count;
      selector.querySelector(
        ".cps"
      ).innerText = `${this.GameSettings[which].cps} cookies`;
    }
    this.cookieCount.innerText = this.GameSettings.cookie.count;
    localStorage.setItem("settings", JSON.stringify(this.GameSettings));
    this.CheckUpdates();
    //console.log("Updated..");
  },
  CheckUpdates: function CheckUpdates() {
    //console.log("Checking prices..");
    /*- Enable / Disable Upgrades -*/
    this.GameSettings.cookie.count >= this.GameSettings.cursors.currentPrice
      ? document
          .querySelector("[data-tile='cursors']")
          .classList.remove("is-disabled")
      : document
          .querySelector("[data-tile='cursors']")
          .classList.add("is-disabled");
    this.GameSettings.cookie.count >= this.GameSettings.bakers.currentPrice
      ? document
          .querySelector("[data-tile='bakers']")
          .classList.remove("is-disabled")
      : document
          .querySelector("[data-tile='bakers']")
          .classList.add("is-disabled");
    this.GameSettings.cookie.count >= this.GameSettings.shops.currentPrice
      ? document
          .querySelector("[data-tile='shops']")
          .classList.remove("is-disabled")
      : document
          .querySelector("[data-tile='shops']")
          .classList.add("is-disabled");
    this.GameSettings.cookie.count >= this.GameSettings.trucks.currentPrice
      ? document
          .querySelector("[data-tile='trucks']")
          .classList.remove("is-disabled")
      : document
          .querySelector("[data-tile='trucks']")
          .classList.add("is-disabled");
    this.GameSettings.cookie.count >= this.GameSettings.yards.currentPrice
      ? document
          .querySelector("[data-tile='yards']")
          .classList.remove("is-disabled")
      : document
          .querySelector("[data-tile='yards']")
          .classList.add("is-disabled");
  },
  Load: function Load() {
    //console.log("Game loading...");
    // Loading Game Values
    //console.log(this);
    this.cookieCount.innerText = this.GameSettings.cookie.count;
    this.nameChanger.querySelector("span").innerText =
      this.nameChanger.querySelector("span").innerText = this.GameSettings
        .isGuest
        ? this.GetBakersName()
        : this.GameSettings.bakersName;
    this.upgradeCounter.forEach((tileInstance) =>
      this.HandleUpdates(tileInstance, tileInstance.getAttribute("data-tile"))
    );
    //console.log(this.GameSettings.bakersName);
  },
  GetBakersName: function GetBakersName() {
    let bakerArrayName = [
      "Mechanized",
      "Rock & Scissor",
      "Light",
      "Voilet",
      "Fabric",
      "Brick",
      "Brownie",
      "Red",
      "Olympus",
      "Queens",
      "Indian",
      "Maxi",
      "Mia",
      "Apple",
      "FM",
      "Randy",
    ];
    let bakerArraySymbols = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "_",
      "+",
      "!!",
      "@@",
      "##",
      "$$",
      "%%",
      "^^",
      "&&",
      "**",
      "__",
      "++",
      "!!!",
      "@@@",
      "###",
      "$$$",
      "%%%",
      "^^^",
      "&&&",
      "***",
      "___",
      "+++",
    ];
    let bakerArrayNumber = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
      "60",
      "61",
      "62",
      "63",
      "64",
      "65",
      "66",
      "67",
      "68",
      "69",
      "70",
      "71",
      "72",
      "73",
      "74",
      "75",
      "76",
      "77",
      "78",
      "79",
      "80",
      "81",
      "82",
      "83",
      "84",
      "85",
      "86",
      "87",
      "88",
      "89",
      "90",
      "91",
      "92",
      "93",
      "94",
      "95",
      "96",
      "97",
      "98",
      "99",
      "100",
      "101",
      "102",
      "103",
      "104",
      "105",
      "106",
      "107",
      "108",
      "109",
      "110",
      "111",
      "112",
      "113",
      "114",
      "115",
      "116",
      "117",
      "118",
      "119",
      "120",
      "121",
      "122",
      "123",
      "124",
      "125",
      "126",
      "127",
      "128",
      "129",
      "130",
      "131",
      "132",
      "133",
      "134",
      "135",
      "136",
      "137",
      "138",
      "139",
      "140",
      "141",
      "142",
      "143",
      "144",
      "145",
      "146",
      "147",
      "148",
      "149",
      "150",
      "151",
      "152",
      "153",
      "154",
      "155",
      "156",
      "157",
      "158",
      "159",
      "160",
      "161",
      "162",
      "163",
      "164",
      "165",
      "166",
      "167",
      "168",
      "169",
      "170",
      "171",
      "172",
      "173",
      "174",
      "175",
      "176",
      "177",
      "178",
      "179",
      "180",
      "181",
      "182",
      "183",
      "184",
      "185",
      "186",
      "187",
      "188",
      "189",
      "190",
      "191",
      "192",
      "193",
      "194",
      "195",
      "196",
      "197",
      "198",
      "199",
      "200",
      "201",
      "202",
      "203",
      "204",
      "205",
      "206",
      "207",
      "208",
      "209",
      "210",
      "211",
      "212",
      "213",
      "214",
      "215",
      "216",
      "217",
      "218",
      "219",
      "220",
      "221",
      "222",
      "223",
      "224",
      "225",
      "226",
      "227",
      "228",
      "229",
      "230",
      "231",
      "232",
      "233",
      "234",
      "235",
      "236",
      "237",
      "238",
      "239",
      "240",
      "241",
      "242",
      "243",
      "244",
      "245",
      "246",
      "247",
      "248",
      "249",
      "250",
      "251",
      "252",
      "253",
      "254",
      "255",
      "256",
      "257",
      "258",
      "259",
      "260",
      "261",
      "262",
      "263",
      "264",
      "265",
      "266",
      "267",
      "268",
      "269",
      "270",
      "271",
      "272",
      "273",
      "274",
      "275",
      "276",
      "277",
      "278",
      "279",
      "280",
      "281",
      "282",
      "283",
      "284",
      "285",
      "286",
      "287",
      "288",
      "289",
      "290",
      "291",
      "292",
      "293",
      "294",
      "295",
      "296",
      "297",
      "298",
      "299",
      "300",
      "301",
      "302",
      "303",
      "304",
      "305",
      "306",
      "307",
      "308",
      "309",
      "310",
      "311",
      "312",
      "313",
      "314",
      "315",
      "316",
      "317",
      "318",
      "319",
      "320",
      "321",
      "322",
      "323",
      "324",
      "325",
      "326",
      "327",
      "328",
      "329",
      "330",
      "331",
      "332",
      "333",
      "334",
      "335",
      "336",
      "337",
      "338",
      "339",
      "340",
      "341",
      "342",
      "343",
      "344",
      "345",
      "346",
      "347",
      "348",
      "349",
      "350",
      "351",
      "352",
      "353",
      "354",
      "355",
      "356",
      "357",
      "358",
      "359",
      "360",
      "361",
      "362",
      "363",
      "364",
      "365",
      "366",
      "367",
      "368",
      "369",
      "370",
      "371",
      "372",
      "373",
      "374",
      "375",
      "376",
      "377",
      "378",
      "379",
      "380",
      "381",
      "382",
      "383",
      "384",
      "385",
      "386",
      "387",
      "388",
      "389",
      "390",
      "391",
      "392",
      "393",
      "394",
      "395",
      "396",
      "397",
      "398",
      "399",
      "400",
      "401",
      "402",
      "403",
      "404",
      "405",
      "406",
      "407",
      "408",
      "409",
      "410",
      "411",
      "412",
      "413",
      "414",
      "415",
      "416",
      "417",
      "418",
      "419",
      "420",
      "421",
      "422",
      "423",
      "424",
      "425",
      "426",
      "427",
      "428",
      "429",
      "430",
      "431",
      "432",
      "433",
      "434",
      "435",
      "436",
      "437",
      "438",
      "439",
      "440",
      "441",
      "442",
      "443",
      "444",
      "445",
      "446",
      "447",
      "448",
      "449",
      "450",
      "451",
      "452",
      "453",
      "454",
      "455",
      "456",
      "457",
      "458",
      "459",
      "460",
      "461",
      "462",
      "463",
      "464",
      "465",
      "466",
      "467",
      "468",
      "469",
      "470",
      "471",
      "472",
      "473",
      "474",
      "475",
      "476",
      "477",
      "478",
      "479",
      "480",
      "481",
      "482",
      "483",
      "484",
      "485",
      "486",
      "487",
      "488",
      "489",
      "490",
      "491",
      "492",
      "493",
      "494",
      "495",
      "496",
      "497",
      "498",
      "499",
      "500",
      "501",
      "502",
      "503",
      "504",
      "505",
      "506",
      "507",
      "508",
      "509",
      "510",
      "511",
      "512",
      "513",
      "514",
      "515",
      "516",
      "517",
      "518",
      "519",
      "520",
      "521",
      "522",
      "523",
      "524",
      "525",
      "526",
      "527",
      "528",
      "529",
      "530",
      "531",
      "532",
      "533",
      "534",
      "535",
      "536",
      "537",
      "538",
      "539",
      "540",
      "541",
      "542",
      "543",
      "544",
      "545",
      "546",
      "547",
      "548",
      "549",
      "550",
      "551",
      "552",
      "553",
      "554",
      "555",
      "556",
      "557",
      "558",
      "559",
      "560",
      "561",
      "562",
      "563",
      "564",
      "565",
      "566",
      "567",
      "568",
      "569",
      "570",
      "571",
      "572",
      "573",
      "574",
      "575",
      "576",
      "577",
      "578",
      "579",
      "580",
      "581",
      "582",
      "583",
      "584",
      "585",
      "586",
      "587",
      "588",
      "589",
      "590",
      "591",
      "592",
      "593",
      "594",
      "595",
      "596",
      "597",
      "598",
      "599",
      "600",
      "601",
      "602",
      "603",
      "604",
      "605",
      "606",
      "607",
      "608",
      "609",
      "610",
      "611",
      "612",
      "613",
      "614",
      "615",
      "616",
      "617",
      "618",
      "619",
      "620",
      "621",
      "622",
      "623",
      "624",
      "625",
      "626",
      "627",
      "628",
      "629",
      "630",
      "631",
      "632",
      "633",
      "634",
      "635",
      "636",
      "637",
      "638",
      "639",
      "640",
      "641",
      "642",
      "643",
      "644",
      "645",
      "646",
      "647",
      "648",
      "649",
      "650",
      "651",
      "652",
      "653",
      "654",
      "655",
      "656",
      "657",
      "658",
      "659",
      "660",
      "661",
      "662",
      "663",
      "664",
      "665",
      "666",
      "667",
      "668",
      "669",
      "670",
      "671",
      "672",
      "673",
      "674",
      "675",
      "676",
      "677",
      "678",
      "679",
      "680",
      "681",
      "682",
      "683",
      "684",
      "685",
      "686",
      "687",
      "688",
      "689",
      "690",
      "691",
      "692",
      "693",
      "694",
      "695",
      "696",
      "697",
      "698",
      "699",
      "700",
      "701",
      "702",
      "703",
      "704",
      "705",
      "706",
      "707",
      "708",
      "709",
      "710",
      "711",
      "712",
      "713",
      "714",
      "715",
      "716",
      "717",
      "718",
      "719",
      "720",
      "721",
      "722",
      "723",
      "724",
      "725",
      "726",
      "727",
      "728",
      "729",
      "730",
      "731",
      "732",
      "733",
      "734",
      "735",
      "736",
      "737",
      "738",
      "739",
      "740",
      "741",
      "742",
      "743",
      "744",
      "745",
      "746",
      "747",
      "748",
      "749",
      "750",
      "751",
      "752",
      "753",
      "754",
      "755",
      "756",
      "757",
      "758",
      "759",
      "760",
      "761",
      "762",
      "763",
      "764",
      "765",
      "766",
      "767",
      "768",
      "769",
      "770",
      "771",
      "772",
      "773",
      "774",
      "775",
      "776",
      "777",
      "778",
      "779",
      "780",
      "781",
      "782",
      "783",
      "784",
      "785",
      "786",
      "787",
      "788",
      "789",
      "790",
      "791",
      "792",
      "793",
      "794",
      "795",
      "796",
      "797",
      "798",
      "799",
      "800",
      "801",
      "802",
      "803",
      "804",
      "805",
      "806",
      "807",
      "808",
      "809",
      "810",
      "811",
      "812",
      "813",
      "814",
      "815",
      "816",
      "817",
      "818",
      "819",
      "820",
      "821",
      "822",
      "823",
      "824",
      "825",
      "826",
      "827",
      "828",
      "829",
      "830",
      "831",
      "832",
      "833",
      "834",
      "835",
      "836",
      "837",
      "838",
      "839",
      "840",
      "841",
      "842",
      "843",
      "844",
      "845",
      "846",
      "847",
      "848",
      "849",
      "850",
      "851",
      "852",
      "853",
      "854",
      "855",
      "856",
      "857",
      "858",
      "859",
      "860",
      "861",
      "862",
      "863",
      "864",
      "865",
      "866",
      "867",
      "868",
      "869",
      "870",
      "871",
      "872",
      "873",
      "874",
      "875",
      "876",
      "877",
      "878",
      "879",
      "880",
      "881",
      "882",
      "883",
      "884",
      "885",
      "886",
      "887",
      "888",
      "889",
      "890",
      "891",
      "892",
      "893",
      "894",
      "895",
      "896",
      "897",
      "898",
      "899",
      "900",
      "901",
      "902",
      "903",
      "904",
      "905",
      "906",
      "907",
      "908",
      "909",
      "910",
      "911",
      "912",
      "913",
      "914",
      "915",
      "916",
      "917",
      "918",
      "919",
      "920",
      "921",
      "922",
      "923",
      "924",
      "925",
      "926",
      "927",
      "928",
      "929",
      "930",
      "931",
      "932",
      "933",
      "934",
      "935",
      "936",
      "937",
      "938",
      "939",
      "940",
      "941",
      "942",
      "943",
      "944",
      "945",
      "946",
      "947",
      "948",
      "949",
      "950",
      "951",
      "952",
      "953",
      "954",
      "955",
      "956",
      "957",
      "958",
      "959",
      "960",
      "961",
      "962",
      "963",
      "964",
      "965",
      "966",
      "967",
      "968",
      "969",
      "970",
      "971",
      "972",
      "973",
      "974",
      "975",
      "976",
      "977",
      "978",
      "979",
      "980",
      "981",
      "982",
      "983",
      "984",
      "985",
      "986",
      "987",
      "988",
      "989",
      "990",
      "991",
      "992",
      "993",
      "994",
      "995",
      "996",
      "997",
      "998",
      "999",
      "1000",
    ];
    let bakersname = `${
      bakerArrayName[Math.floor(Math.random() * bakerArrayName.length)]
    }${
      bakerArraySymbols[Math.floor(Math.random() * bakerArraySymbols.length)]
    }${bakerArrayNumber[Math.floor(Math.random() * bakerArrayNumber.length)]}`;
    //console.log(bakersname);
    return bakersname;
  },
  HandleCursorAutoClicks: function HandleAutoClicks() {
    if (!this.GameSettings.cursors.count) {
      return;
    }
    //console.log("cursor counted.");
    this.GameSettings.cookie.count =
      this.GameSettings.cookie.count + this.GameSettings.cursors.count;
    this.HandleUpdates();
  },
  HandleOtherUpgradesClicks: function HandleOtherUpgradesClicks() {
    //console.log("Other Upgrades..");
    if (this.GameSettings.bakers.count) {
      //console.log("Bakers..");
      this.GameSettings.cookie.count =
        this.GameSettings.cookie.count + this.GameSettings.bakers.count;
    }
    if (this.GameSettings.shops.count) {
      this.GameSettings.cookie.count =
        this.GameSettings.cookie.count + this.GameSettings.shops.count + 8;
    }
    if (this.GameSettings.trucks.count) {
      this.GameSettings.cookie.count =
        this.GameSettings.cookie.count + this.GameSettings.trucks.count + 47;
    }
    if (this.GameSettings.yards.count) {
      this.GameSettings.cookie.count =
        this.GameSettings.cookie.count + this.GameSettings.yards.count + 260;
    }
    this.HandleUpdates();
  },
  SaveGame: function SaveGame() {
    //console.log("SaveGame");
    this.HandleUpdates();
  },
  ExportGame: function ExportGame() {
    //console.log("ExportGame");
    //SaveAsFile(JSON.stringify(this.GameSettings), `${this.GameSettings.bakersName}.txt`, "text/plain;charset=utf-8");
    var blob = new Blob([JSON.stringify(this.GameSettings)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${this.GameSettings.bakersName}.txt`);
  },
  ImportGame: function ImportGame() {
    document.getElementById("importFile").click();
  },
  WipeGame: function WipeGame() {
    //console.log("WipeGame");
    if (window.confirm("Do you really want to wipe the game ?")) {
      this.GameSettings = {
        autosave: true,
        connectVia: "none",
        isGuest: true,
        sound: false,
        volume: 1,
        bakersName: localStorage.getItem("bakersName")
          ? localStorage.getItem("bakersName")
          : this.GetBakersName(),
        cookie: {
          count: localStorage.getItem("cookiesCount")
            ? parseInt(localStorage.getItem("cookiesCount"))
            : 0,
          cps: 0,
        },
        cursors: {
          count: localStorage.getItem("cursorCount")
            ? parseInt(localStorage.getItem("cursorCount"))
            : 0,
          basePrice: 15,
          currentPrice: 15,
          difference: 3,
          cps: 0,
        },
        bakers: {
          count: localStorage.getItem("bakerCount")
            ? parseInt(localStorage.getItem("bakerCount"))
            : 0,
          basePrice: 100,
          currentPrice: 100,
          difference: 33,
          cps: 0,
        },
        shops: {
          count: localStorage.getItem("cookieShopCount")
            ? parseInt(localStorage.getItem("cookieShopCount"))
            : 0,
          basePrice: 1100,
          currentPrice: 1100,
          difference: 165,
          cps: 0,
        },
        trucks: {
          count: localStorage.getItem("truckCount")
            ? parseInt(localStorage.getItem("truckCount"))
            : 0,
          basePrice: 12000,
          currentPrice: 12000,
          difference: 1800,
          cps: 0,
        },
        yards: {
          count: localStorage.getItem("yardCount")
            ? parseInt(localStorage.getItem("yardCount"))
            : 0,
          basePrice: 130000,
          currentPrice: 130000,
          difference: 19500,
          cps: 0,
        },
        sounds: {
          crunchSound: "../assets/sounds/cookie_crunch.mp3",
          otherSound: "../assets/sounds/buy_click.mp3",
        },
      };
      this.Load();
    }
  },
  ImportGameViaReader: function ImportGameViaReader(event) {
    let reader = new FileReader();
    let output = "";
    const loadGameContents = (output) => {
      this.GameSettings = JSON.parse(output);
      this.Load();
    };
    if (event.target.files && event.target.files[0]) {
      reader.onload = function (e) {
        output = e.target.result;
        loadGameContents(output);
      };
      reader.readAsText(event.target.files[0]);
    }
  },
  ToggleOptions: function ToggleOptions(event) {
    let optionName = event.target.getAttribute("data-option");
    document.querySelectorAll("[data-option-pane]").forEach((instance) => {
      instance.style.display = "none";
    });
    document.querySelector(`[data-option-pane='${optionName}']`).style.display =
      "block";
  },
  CloseOptionPane: function CloseOptionPane() {
    document.querySelectorAll("[data-option-pane]").forEach((instance) => {
      instance.style.display = "none";
    });
  },
};
Game.Init();

GameLoaded
  ? window.setInterval(() => Game.HandleCursorAutoClicks(), 10000)
  : console.log("Game is loading.."); // Cursor clicks every 10secs.
GameLoaded
  ? window.setInterval(() => Game.HandleOtherUpgradesClicks(), 1000)
  : console.log("Game is loading.."); // Cursor clicks every 1secs.
