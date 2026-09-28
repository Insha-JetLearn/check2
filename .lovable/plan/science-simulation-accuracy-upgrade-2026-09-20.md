# Science Simulation Accuracy Upgrade

## Goal
Replace the simplified two-control scoring models with consistent, age-appropriate science calculations across all seven modules.

## Changes
- **Volcano Lab:** Add magma temperature, silica, and trapped-gas controls. Derive a viscosity index, pressure, lava-flow style, and eruption intensity; explain how hotter magma flows more easily while silica and gas increase explosive potential.
- **Electricity Lab:** Keep voltage and resistance as inputs and calculate current only from \(I=V/R\). Show amperes and milliamperes, LED brightness/safety bands, and explicit short-circuit or overload warnings at very low resistance/high current.
- **Gravity Chamber:** Add planet mass, orbital distance, and sideways velocity. Calculate gravitational attraction, circular-orbit speed, and escape speed, then classify falling, stable orbit, or escape from those thresholds.
- **Rocket Launch Bay:** Use thrust and mass to calculate weight with \(g=9.81\), TWR, and net upward acceleration. Classify no liftoff, slow ascent, safe launch, and excessive acceleration consistently.
- **DNA Mixing Center:** Replace percentage sliders with selectable parent genes/base choices. Enforce A–T and C–G pairing, calculate match accuracy deterministically, and derive offspring traits only from selected alleles.
- **Submarine Lab:** Model ballast water and expelled-water/air state consistently. Calculate density balance, vertical movement, estimated depth, and water pressure that rises with depth.
- **Quiz Arena:** Replace mastery sliders with a real multi-question quiz drawn from the six labs. Each question has exactly one correct answer and reveals a concise explanation after selection.
- Preserve XP, completion, sound, navigation, assistant, and visual styling while adapting the shared lab screen to support the richer controls and readouts.

## Verification
- Check known reference cases, including 5 V / 250 Ω = 0.020 A = 20 mA and rocket weight = mass × 9.81.
- Exercise every lab’s outcome states and every quiz answer.
- Verify the updated screens on desktop and mobile without overlap or console errors.
