# Parameter-Driven Lab Simulations

## Build
- Replace the shared rotating core in each science module with a distinct live 3D simulation.
- Keep the dashboard hologram as the only generic science visual.
- Make every simulation update immediately when its experiment controls change.

## Lab visuals
- **Volcano:** volcano cone, lava flow, rising gas, and an eruption plume whose speed and size follow temperature, viscosity, silica, gas pressure, and eruption intensity.
- **Electricity:** battery, connected wires, resistor, and LED bulb; current controls bulb brightness, while overload and short-circuit settings create a clear warning state.
- **Gravity:** selectable-looking planet body and orbiting object; mass changes planet scale, distance changes orbital radius, and velocity visibly produces falling, orbiting, elliptical, or escaping motion.
- **Rocket:** launch pad and rocket; thrust-to-weight and acceleration determine whether it stays grounded, rises slowly, launches safely, or accelerates rapidly.
- **DNA:** animated DNA/base pairing plus a generated offspring creature whose visible traits come deterministically from the selected parent alleles; mismatched bases remain visibly invalid.
- **Submarine:** underwater scene with a recognizable submarine, ballast tanks, bubbles, and vertical motion; ballast water, air, depth, and buoyancy determine rising, hovering, or sinking.

## Interaction and verification
- Pass each lab’s actual parameter values and calculated outcome into its visual instead of a generic power score.
- Restart each visible experiment animation when “Run experiment” is pressed, while retaining immediate live parameter feedback.
- Preserve formulas, XP, challenges, quizzes, navigation, sound, and mobile layout.
- Verify all six simulation states and parameter reactions on desktop and mobile, including clean console output.

## Technical details
- Use lightweight React Three Fiber procedural models and delta-time animation within the existing performance budget.
- Keep simulation state deterministic and derive motion from the same calculations shown in each lab’s metrics.
