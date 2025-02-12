let seedA;
let seedB;
let seedC;
let seedD;

const rngArray = {
    rngValues: []
};

function fnv1a_utf8(str) {
  // Create a UTF-8 byte array from the input string.
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  // 32-bit FNV offset basis
  let hash = 0x811c9dc5; // 2166136261
  // FNV prime for 32-bit
  const fnvPrime = 16777619;
  // Process each byte of the UTF-8 encoded string.
  for (let i = 0; i < data.length; i++) {
    hash ^= data[i];
    // Multiply by FNV prime and ensure 32-bit arithmetic.
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
}

function generatePrimaryStar() {
	let classificationPrimaryStar;
	let massPrimaryStar
	
	classificationPrimaryStar = generatePrimaryStarClassification()
	updateStarClassLabel()
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
	let rngPrimaryStar;
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
      break; // Exit loop once a range is found
    }
	}
	}
	document.getElementById('star-mass').textContent = classificationPrimaryStar;
	console.log(classificationPrimaryStar)
	return classificationPrimaryStar
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
		if (rngPrimaryStar >= stellarRange.range[0] && rngPrimaryStar <= stellarRange.range[1]) 
		{stellarClassPrimaryStar = stellarRange.class; break;}
		}
    } 
	
	if (["Giant", "SubGiant", "Dwarf", "SubDwarf"].includes(stellarClassPrimaryStar)) {
    stellarTypePrimaryStar = 
        stellarClassPrimaryStar === "Giant" ? "III" :
        stellarClassPrimaryStar === "SubGiant" ? "IV" :
        stellarClassPrimaryStar === "Dwarf" ? "V" :
        "VI"; // SubDwarf
	} else {
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
    const selectedRanges = typeRanges[stellarClassPrimaryStar] || [];
    const rngResult = Math.floor(rngValues[1] * 36) + 1;

    for (const rangeDef of selectedRanges) {
        if (rngResult >= rangeDef.range[0] && rngResult <= rangeDef.range[1]) {
            stellarTypePrimaryStar = rangeDef.type;
            break;
        }
    }
}

	
	const baseSubclassRanges = [
        { range: [1, 936], type: "M" },
        { range: [937, 1080], type: "K" },
        { range: [1081, 1188], type: "G" },
        { range: [1189, 1260], type: "F" },
        { range: [1261, 1290], type: "A" },
        { range: [1291, 1295], type: "B" },
        { range: [1296, 1296], type: "O" }
    ];
	
	if (["Protostar", "Dwarf", "SubDwarf", "SubGiant", "Giant", "SuperGiant"].includes(stellarClassPrimaryStar)) 
	{
	
	let filteredSubclassRanges = baseSubclassRanges;
	
	}
}
		
function generatePrimaryStarMass() {
	//template for now
}


// JavaScript to dynamically update star characteristics
function updateStarCharacteristics(name, mass, radius, temperature, luminosity, age) {
	document.getElementById('star-name').textContent = name;
	document.getElementById('star-mass').textContent = mass;
	document.getElementById('star-radius').textContent = radius;
	document.getElementById('star-temperature').textContent = temperature;
	document.getElementById('star-luminosity').textContent = luminosity;
	document.getElementById('star-age').textContent = age;
}
// Example of how to use the function:
// updateStarCharacteristics("Sun", "1.989 × 10^30 kg", "695,700 km", "5,778 K", "3.828 × 10^26 W", "4.6 billion years");


//RNG ARRAYS AND WHAT IT'S USED FOR
//[0] Star Classification / Initial Stellar Class Grouping
//[1] Star Types
//[2] Stellar Number
//[3] Star Types
