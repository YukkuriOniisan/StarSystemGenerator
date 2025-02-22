let seedA;
let seedB;
let seedC;
let seedD;

const rngArray = {
    rngValues: []
};

function fnv1a_utf8(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let hash = 0x811c9dc5; // 2166136261
  const fnvPrime = 16777619;
  for (let i = 0; i < data.length; i++) {
    hash ^= data[i];
    hash = (hash * fnvPrime) >>> 0;
  }
  return hash;
}

function calculateSeed(inputText) {
	const calculatedSeed = fnv1a_utf8(inputText);
	const seedPlusOne = xorshift32(calculatedSeed);
    const seedPlusTwo = xorshift32(seedPlusOne);
    const seedPlusThree = xorshift32(seedPlusTwo);
    return [calculatedSeed, seedPlusOne, seedPlusTwo, seedPlusThree];
}

function xorshift32(seed) {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
	return seed >>> 0;
}

function xoshiro128ss(seedA, seedB, seedC, seedD) {
  return function() {
    let seedT = seedB << 9, seedR = seedB * 5;
    seedR = (seedR << 7 | seedR >>> 25) * 9;
    seedC ^= seedA;
    seedD ^= seedB;
    seedB ^= seedC;
    seedA ^= seedD;
    seedC ^= seedT;
    seedD = seedD << 11 | seedD >>> 21;
    return (seedR >>> 0) / 4294967296;
  }
}

function generateRNG() {
	const userInputText = document.getElementById("userInput").value;
	const calculatedSeedValue = calculateSeed(userInputText);

	document.getElementById("seedDisplay").textContent = "Seed: " + calculatedSeedValue;

	seedA = calculatedSeedValue[0];
	seedB = calculatedSeedValue[1];
	seedC = calculatedSeedValue[2];
	seedD = calculatedSeedValue[3];
	
	const rng = xoshiro128ss(seedA, seedB, seedC, seedD);
	rngArray.rngValues = [];
	for (let i = 0; i < 2000; i++) {
		rngArray.rngValues.push(rng());
	}

  const first10RNGs = rngArray.rngValues.slice(0, 10);

  console.log("Seed: " + calculatedSeedValue);
  console.log("First 10 RNGs:", first10RNGs);
}

function generateRandomName() {
  const rngValues = rngArray.rngValues
  
  // RNG parts
  var rngIndex = 1995;
  function getRandom() {
    var value = rngArray.rngValues[rngIndex % rngArray.rngValues.length];
    rngIndex++;
    return value;
  }

  // Vowels
   var vowels = ["a", "e", "i", "o", "u", "ai", "ea", "oi", "ou", "au"];

  // konsonan depan
  var initialConsonants = [
    "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z",
    "bl", "br", "ch", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "sc", "sh",
    "sk", "sl", "sm", "sn", "sp", "st", "sw", "th", "tr", "wh", "wr"
     ];
  // konsonan depan tunggal
  var singleInitialConsonants = initialConsonants.filter(function(c) {
      return c.length === 1;
  });
  
  // konsonan final
  var finalConsonants = [
    "b", "d", "f", "g", "k", "l", "m", "n", "p", "r", "s", "t", "z",
    "nd", "nt", "rk", "st", "mp", "sk", "ld", "rt", "ct"
  ];
  
  // acak huruf
  function randomChoice(arr) {
    var idx = Math.floor(getRandom() * arr.length);
    return arr[idx];
  }

  // generateSyllable
  function generateSyllable(prevSyllable) {
    var types = ["V", "VC", "CV", "CVC"];
    if (prevSyllable && prevSyllable.type === "V") {
      types = ["VC", "CV", "CVC"];
    }
    var type = randomChoice(types);
    var syllable = "";
    var endingConsonant = null;

    var restrictInitial = false;
    if (prevSyllable && prevSyllable.endingConsonant && prevSyllable.endingConsonant.length > 1) {
      restrictInitial = true;
    }

    if (type === "V") {
      syllable = randomChoice(vowels);
    } else if (type === "VC") {
      var chosenVowel = randomChoice(vowels);
      var chosenFinal = randomChoice(finalConsonants);
      syllable = chosenVowel + chosenFinal;
      endingConsonant = chosenFinal;
    } else if (type === "CV") {
      var initialPool = restrictInitial ? singleInitialConsonants : initialConsonants;
      var chosenInitial = randomChoice(initialPool);
      var chosenVowel = randomChoice(vowels);
      syllable = chosenInitial + chosenVowel;
    } else if (type === "CVC") {
      var initialPool = restrictInitial ? singleInitialConsonants : initialConsonants;
      var chosenInitial = randomChoice(initialPool);
      var chosenVowel = randomChoice(vowels);
      var chosenFinal = randomChoice(finalConsonants);
      syllable = chosenInitial + chosenVowel + chosenFinal;
      endingConsonant = chosenFinal;
    }
    return { syllable: syllable, type: type, endingConsonant: endingConsonant };
  }

  var syllables = [];
  var syllableData;

  syllableData = generateSyllable(null);
  syllables.push(syllableData.syllable);
  var prevSyllable = syllableData;

  syllableData = generateSyllable(prevSyllable);
  syllables.push(syllableData.syllable);
  prevSyllable = syllableData;

  if (getRandom() > 0.5) {
    syllableData = generateSyllable(prevSyllable);
    syllables.push(syllableData.syllable);
    prevSyllable = syllableData;
  }

  if (getRandom() > 0.5) {
    syllableData = generateSyllable(prevSyllable)
    syllables.push(syllableData.syllable);
  }

  //ubah jadi string
  namefull = syllables.join("")
  //kapitalisasi
  namefull = namefull.charAt(0).toUpperCase() + namefull.slice(1);

  console.log(namefull);
  document.getElementById('star-name-input').value = namefull;
  return syllables;
}

function generatePrimaryStar() {
	let classificationPrimaryStar;
	let massPrimaryStar
  let namePrimaryStar

  const checkboxManualSC = document.getElementById('manualSCGenerateCheckbox');
	
  namePrimaryStar = generateRandomName()
	classificationPrimaryStar = generatePrimaryStarClassification()
	if (checkboxManualSC.checked) {updateStarClassLabel()}
	massPrimaryStar = generatePrimaryStarMass(classificationPrimaryStar)//template
	generatePrimaryStarLuminosity()//template
	generatePrimaryStarRadius()//template
}

function generatePrimaryStarAlt() {
	let classificationPrimaryStar;
	let massPrimaryStar
  let namePrimaryStar

  const checkboxManualSC = document.getElementById('manualSCGenerateCheckbox');
	
  namePrimaryStar = generateRandomName()
  classificationPrimaryStar = generatePrimaryStarClassificationAlt()
  if (checkboxManualSC.checked) {updateStarClassLabel()}
	massPrimaryStar = generatePrimaryStarMass(classificationPrimaryStar)//template
	generatePrimaryStarLuminosity()//template
	generatePrimaryStarRadius()//template
}

function updateStarClassLabel() {
  var spectralClass = document.getElementById("spectralClass").value;
  var spectralNumber = document.getElementById("spectralNumber").value;
  var luminosityClass = document.getElementById("luminosityClass").value;
  var starSpectralClassification = spectralClass + spectralNumber + luminosityClass;
  var starSpectralLabel = document.getElementById("starSpectralLabel");
  starSpectralLabel.textContent = starSpectralClassification;
  console.log(starSpectralClassification, "Star Spectral Class Updated");
  return starSpectralClassification
}

function toggleSCInput() {
  var manualSCCheckbox = document.getElementById("manualSCGenerateCheckbox");
  var manualSCInputFieldsDiv = document.getElementById("manualSCInput");
  var manualSCInputLabel = document.getElementById("manualSCGenerateLabel");

  if (manualSCCheckbox.checked) {
    manualSCInputFieldsDiv.style.display = "block";
	manualSCInputLabel.textContent = "Manual";
  } else {
    manualSCInputFieldsDiv.style.display = "none";
	manualSCInputLabel.textContent = "Automatic";
  }
}
	
function generatePrimaryStarClassification() {
	let classificationPrimaryStar;
	
	const forceHabitableCheckbox = document.getElementById("forceHabitable");
  const isForceHabitable = forceHabitableCheckbox.checked;
	const rngValue = rngArray.rngValues[0]
	
	if (isForceHabitable) {
    classificationPrimaryStar = "Intermediate Mass Star"; // Forced classification
    } else {
	const rngPrimaryStar = Math.floor(rngValue * 100) + 1;
	const classificationRanges = [
    { range: [1, 3], classification: "Brown Dwarf" },
    { range: [4, 77], classification: "Low Mass Star" },
    { range: [78, 90], classification: "Intermediate Mass Star" },
    { range: [91, 100], classification: "High Mass Star" }
	];
	for (const rangeDef of classificationRanges) {
    if (rngPrimaryStar >= rangeDef.range[0] && rngPrimaryStar <= rangeDef.range[1]) {
    classificationPrimaryStar = rangeDef.classification;
    break;
    }
	}
	}
	document.getElementById('star-mass-input').value = classificationPrimaryStar;
  console.log(classificationPrimaryStar);
  return classificationPrimaryStar;
}

function generatePrimaryStarClassificationAlt() {
	let rngPrimaryStar;
	let stellarClassPrimaryStar = "";
	let stellarTypePrimaryStar = "";
	let stellarSubclassPrimaryStar = "";
	let stellarSubtypePrimaryStar = "";
	
  const isForceHabitable = document.getElementById("forceHabitable").checked;
	const rngValues = rngArray.rngValues
	
	if (isForceHabitable) {
	stellarClassPrimaryStar = 'Dwarf';}
	else {
	rngPrimaryStar = Math.floor(rngValues[0] * 1296) + 1;
  console.log("RNG PRIMARY STAR IS", rngPrimaryStar)
	const stellarClassRanges = [
		{ range: [1, 1], class: 'Special' },
		{ range: [2, 3], class: 'SubDwarf' },
		{ range: [4, 6], class: 'SubGiant' },
		{ range: [7, 21], class: 'BrownDwarf' },
		{ range: [22, 32], class: 'WhiteDwarf' },
		{ range: [33, 35], class: 'Giant' },
		{ range: [36, 36], class: 'SuperGiant' },
		{ range: [37, 1296], class: 'Dwarf' },
		];
		for (const stellarRange of stellarClassRanges) {
		if (rngPrimaryStar >= stellarRange.range[0] && rngPrimaryStar <= stellarRange.range[1]) {
      stellarClassPrimaryStar = stellarRange.class; 
      break;
      }
		}
  }

  const defaultStellarTypes = {
      Giant: "III",
      SubGiant: "IV",
      Dwarf: "V",
      SubDwarf: "VI"
  };

  const typeRanges = {
      "Special": [
          { range: [1, 1], type: "Black Hole" },
          { range: [2, 3], type: "Pulsar" },
          { range: [4, 6], type: "Neutron Star" },
          { range: [7, 15], type: "Nebula" },
          { range: [16, 30], type: "Protostar" },
          { range: [31, 33], type: "Star Cluster" },
          { range: [34, 36], type: "Anomaly" }
      ],
      "SuperGiant": [
          { range: [1, 26], type: "III" },
          { range: [27, 33], type: "II" },
          { range: [34, 35], type: "Ib" },
          { range: [36, 36], type: "Ia" }
      ]
  };

    if (defaultStellarTypes.hasOwnProperty(stellarClassPrimaryStar)) {
      stellarTypePrimaryStar = defaultStellarTypes[stellarClassPrimaryStar];
    }
    const selectedRanges = typeRanges[stellarClassPrimaryStar] || [];
    const rngResultTypeRange = Math.floor(rngValues[1] * 36) + 1;
    const foundRange = selectedRanges.find(({ range }) =>
      rngResultTypeRange >= range[0] && rngResultTypeRange <= range[1]
    );
  stellarTypePrimaryStar = foundRange ? foundRange.type : stellarTypePrimaryStar;
 
  const baseSubclassRanges = [
    { range: [1, 936], type: "M" },
    { range: [937, 1080], type: "K" },
    { range: [1081, 1188], type: "G" },
    { range: [1189, 1260], type: "F" },
    { range: [1261, 1290], type: "A" },
    { range: [1291, 1295], type: "B" },
    { range: [1296, 1296], type: "O" }
  ];

  let filteredRanges = baseSubclassRanges;

  if (isForceHabitable) {
      filteredRanges = filteredRanges.filter(rangeDef => ["K", "G", "F"].includes(rangeDef.type));
  } else if (stellarClassPrimaryStar === "Special" && stellarTypePrimaryStar !== "Protostar") {
      filteredRanges = [];
  } else if (stellarClassPrimaryStar === "SubDwarf") {
      filteredRanges = filteredRanges.filter(rangeDef => ["O", "B", "G", "K", "M"].includes(rangeDef.type));
  } else if (stellarClassPrimaryStar === "SubGiant") {
      filteredRanges = filteredRanges.filter(rangeDef => ["B", "A", "F", "G", "K"].includes(rangeDef.type));
  } else if (!["Dwarf", "Giant", "SuperGiant"].includes(stellarClassPrimaryStar)) {
      filteredRanges = [];
  }

  if (filteredRanges.length > 0) {
    const totalRange = filteredRanges.reduce((sum, range) => sum + (range.range[1] - range.range[0] + 1), 0);
    const rngResult = Math.floor(rngValues[2] * totalRange) + 1;
    let cumulativeRange = 0;

    for (const rangeDef of filteredRanges) {
        cumulativeRange += (rangeDef.range[1] - rangeDef.range[0] + 1);
        if (rngResult <= cumulativeRange) {
            stellarSubclassPrimaryStar = rangeDef.type;
            break;
        }
    }
}

const flatSubtypeCheckbox = document.getElementById("flatSubtype").checked;

    if (flatSubtypeCheckbox) {
        stellarSubtypePrimaryStar = Math.floor(rngValues[3] * 10);
    } else {
        const subtypeRanges = stellarSubclassPrimaryStar === "M" ? [
            { range: [1, 7], subtype: 0 },
            { range: [8, 16], subtype: 1 },
            { range: [17, 27], subtype: 2 },
            { range: [28, 49], subtype: 3 },
            { range: [50, 67], subtype: 4 },
            { range: [68, 81], subtype: 5 },
            { range: [82, 84], subtype: 6 },
            { range: [85, 87], subtype: 7 },
            { range: [88, 89], subtype: 8 },
            { range: [90, 90], subtype: 9 }
        ] : [
            { range: [1, 2], subtype: 0 },
            { range: [3, 5], subtype: 1 },
            { range: [6, 10], subtype: 2 },
            { range: [11, 16], subtype: 3 },
            { range: [17, 23], subtype: 4 },
            { range: [24, 32], subtype: 5 },
            { range: [33, 42], subtype: 6 },
            { range: [43, 54], subtype: 7 },
            { range: [55, 69], subtype: 8 },
            { range: [70, 90], subtype: 9 }
        ];

        const rngSubtypeResult = Math.floor(rngValues[3] * 90) + 1;
        const foundSubtypeRange = subtypeRanges.find(({ range }) =>
            rngSubtypeResult >= range[0] && rngSubtypeResult <= range[1]
        );
        stellarSubtypePrimaryStar = foundSubtypeRange ? foundSubtypeRange.subtype : 0;
    }

    var spectralClass = stellarSubclassPrimaryStar;
    var spectralNumber = stellarSubtypePrimaryStar;
    var luminosityClass =   stellarTypePrimaryStar;
    var starSpectralClassification = spectralClass + spectralNumber + luminosityClass;
    var starSpectralLabel = document.getElementById("starSpectralLabel");
    starSpectralLabel.textContent = starSpectralClassification;
    console.log(starSpectralClassification, "Star Spectral Class Updated");

  console.log(
      `Stellar Class: ${stellarClassPrimaryStar}, 
      Stellar Type: ${stellarTypePrimaryStar}, 
      Subclass: ${stellarSubclassPrimaryStar}, 
      Subtype: ${stellarSubtypePrimaryStar},`
  );

  return {
    stellarClassPrimaryStar,
    stellarTypePrimaryStar,
    stellarSubclassPrimaryStar,
    stellarSubtypePrimaryStar,
    starSpectralClassification
  };
}

function generatePrimaryStarMass() {
	//template for now
}


function updateStarCharacteristics(name, mass, radius, temperature, luminosity, age) {
    document.getElementById('star-name-input').value = name;
    document.getElementById('star-mass-input').value = mass;
    document.getElementById('star-radius-input').value = radius;
    document.getElementById('star-temperature-input').value = temperature;
    document.getElementById('star-luminosity-input').value = luminosity;
    document.getElementById('star-age-input').value = age;
}

//RNG ARRAYS AND WHAT IT'S USED FOR
//[0] Star Classification / Initial Stellar Class Grouping
//[1] Star Types
//[2] Stellar Subclass
//[3] Star Numbers/Subtype
