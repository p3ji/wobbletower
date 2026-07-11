const MATS = {
  straw:  {m:0.4, fric:0.3},
  wood:   {m:1.0, fric:0.5},
  glass:  {m:1.2, fric:0.2},
  brick:  {m:2.5, fric:0.8},
  stone:  {m:4.0, fric:0.9}
};

function gripOf(mat) {
  // Ground support is 1.0 (meadow). So +0.2
  return mat.m * mat.fric * 1.2;
}

function simulateWind(matName, intensity) {
  const mat = MATS[matName];
  let grip = gripOf(mat);
  let maxGust = 1.0; 
  let push = intensity * maxGust; // at gy=0
  return push <= grip * 0.95;
}

function runEconomy() {
  console.log("=== MATERIAL SURVIVABILITY ===");
  for(const name in MATS) {
    const mat = MATS[name];
    console.log(`${name.padEnd(8)} | Grip: ${gripOf(mat).toFixed(2)} | Survives I=1.0: ${simulateWind(name, 1.0)} | Survives I=1.6: ${simulateWind(name, 1.6)}`);
  }

  // Desired Costs and Rewards
  // If a player starts with $100.
  // Straw shelter (4 blocks) = $20. Survives nothing.
  // Wood shelter (4 blocks) = $60. Survives mild storms.
  // Brick shelter (4 blocks) = $160. Survives strong storms.
  
  const RECOMMENDED_COSTS = {
    straw: 5,
    wood: 15,
    glass: 20,
    brick: 40,
    stone: 80
  };

  console.log("\n=== RECOMMENDED ECONOMY ===");
  console.log("Starting Money: $100");
  console.log("Reward per Villager survived: $30");
  console.log("Block Costs:");
  console.table(RECOMMENDED_COSTS);
}

runEconomy();
