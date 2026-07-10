# Wobbleton — Tower Workshop

A cozy 3D tower simulator built with three.js. Stack blocks from different materials, then subject your creation to earthquakes, windstorms, tornadoes, and meteors. Watch your tower wobble, crumble, or stand proud against the elements.

## Play

Open `index.html` in a modern web browser. No build step, no install—just a single `.html` file.

## Features

- **Five building materials**: Straw (light, weak grip), Wood (balanced), Brick (sturdy), Stone (heaviest, best grip), Glass (fragile, shatters on impact)
- **Lightweight physics**: Sleeping/waking rigid bodies, material-based friction, realistic collapse chains
- **Four disasters**: Earthquake (ground shake), Windstorm (directional push), Tornado (spinning vortex), Meteor (falling impacts)
- **Three preset towers**: Little Lighthouse, Wobbly Wizard Spire, Castle Keep—load and test or use as reference
- **Procedural music**: Ambient lo-fi loop with chord pads and wandering melody (tap 🎵 to start)
- **Boxy villagers**: Three stylized characters who panic during disasters and stroll the meadow otherwise
- **Ferocity slider**: Scale disaster intensity from gentle to catastrophic
- **Floating island**: Drifting clouds, trees, flowers—a cozy sandbox aesthetic

## How to Build

1. Click the meadow to place blocks (default: wood)
2. Switch materials at the bottom toolbar
3. Drag to rotate the camera; scroll to zoom
4. Use Undo, Clear, or Eraser to modify

## How to Test

Pull a weather charm (🫨 🌬️ 🌪️ ☄️) and watch your tower respond. Adjust the Ferocity slider first if you want something gentler (or more dramatic).

## Architecture Notes

**Physics**: A "sleep/wake" model. Blocks you place are locked to the grid (sleeping) until a force beats their grip (material stickiness × weight pressing down). Only woken blocks simulate gravity, velocity, and rotation.

**Collision**: Soft sphere push—cheap but convincing. O(n²) awake-vs-all checks, fine for ~150 blocks.

**Rendering**: Three.js with Lambert shading, soft shadows, and a sky fog. Single `.html` file; all code is vanilla JavaScript.

**Audio**: Web Audio API. Procedural brown noise for rumble/wind, triangle/sine plucks for the music loop. No external sound files.

## Roadmap

- Flood disaster (rising water)
- Save/load towers to browser localStorage
- Challenge mode (survive n disasters)
- Mobile touch gestures
- Themed material packs (ice, magma, etc.)

## Credits

Built with [three.js](https://threejs.org/) and inspired by cozy building games and physics sandboxes. Designed for curiosity and play, not punishment.
