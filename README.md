# 🎮 FF1 Slider Puzzle Solver

A powerful web application to solve the challenging slider puzzle mini-game in Final Fantasy 1. Enter your puzzle configuration and get the optimal solution instantly!

🌐 **Live Demo**: [https://madramdesign.github.io/ff1-slider-puzzle/](https://madramdesign.github.io/ff1-slider-puzzle/)

---

## ✨ Features

- 🎯 **Optimal Solutions**: Uses advanced A* and IDA* algorithms to find the minimum number of moves
- ⚡ **Lightning Fast**: Solves even complex puzzles in seconds
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- ✅ **Solvability Validation**: Automatically checks if your puzzle is solvable
- 📋 **Simple Instructions**: Clear, compact display showing exactly which tiles to slide
- 🎬 **Step-by-Step Visualization**: Watch the solution play out automatically
- 🔄 **Interactive Navigation**: Click on any move to jump to that step

---

## 🚀 Quick Start

### Using the Web App

1. **Visit the live site** or open `index.html` in your browser
2. **Enter your puzzle**: Click cells or use Tab to navigate, then type numbers directly
   - Use `0` for the blank/empty space
   - Numbers 1-15 should each appear exactly once
3. **Solve**: Click "Solve Puzzle" to get the optimal solution
4. **Follow the solution**: See which tiles to slide in the compact instruction display

### Keyboard Navigation

- **Tab** / **Shift+Tab**: Move between cells
- **Arrow Keys**: Navigate in any direction
- **Enter**: Move to next cell
- **Numbers**: Type directly into cells (supports double digits like 10, 11, etc.)

---

## 📖 How It Works

### Puzzle Input
Enter the numbers exactly as they appear in your Final Fantasy 1 game. The solver will:
1. Validate that all numbers 1-15 are present
2. Check if the puzzle configuration is solvable
3. Calculate the optimal solution using advanced algorithms

### Solution Display
The solution appears as a compact row of tile buttons showing which tiles to slide, in order. The current step is highlighted, and you can:
- Click any tile to jump to that move
- Use "Play Solution" to animate through all steps
- See the puzzle state at each step in the visualization

---

## 🧠 Algorithm Details

This solver uses state-of-the-art search algorithms optimized for the 15-puzzle:

### **A* Search Algorithm**
- **Heuristic**: Manhattan Distance + Linear Conflict
- **Manhattan Distance**: Calculates the minimum distance each tile must travel
- **Linear Conflict**: Detects when tiles are in correct row/column but reversed (adds +2 moves per conflict)
- **Best for**: Medium complexity puzzles (< 40 estimated moves)

### **IDA* Algorithm** (Iterative Deepening A*)
- **Memory Efficient**: Uses depth-first search with iterative deepening
- **Automatic Selection**: Used automatically for complex puzzles (> 40 estimated moves)
- **Best for**: Hard puzzles that require many moves

Both algorithms guarantee finding the **optimal solution** (minimum number of moves) when one exists.

---

## 📁 Project Structure

```
ff1-slider-puzzle/
├── index.html          # Main HTML structure
├── styles.css          # Modern styling and responsive design
├── solver.js           # Core solving algorithms (A*, IDA*)
├── app.js              # User interface and interaction logic
├── slider.py           # Original Python solver (reference)
└── README.md           # This file
```

---

## 🛠️ Technical Stack

- **Pure JavaScript**: No dependencies, runs entirely client-side
- **Vanilla HTML/CSS**: Modern, responsive design
- **Advanced Algorithms**: A* and IDA* with optimized heuristics

---

## 🎯 Use Cases

- **Final Fantasy 1 Players**: Quickly solve the ship mini-game puzzle
- **Puzzle Enthusiasts**: Test and solve 15-puzzle configurations
- **Students**: Learn about search algorithms and heuristics
- **Developers**: Reference implementation of A* and IDA* algorithms

---

## 🌐 Deployment

This app is designed to work on any static hosting service:

- ✅ **GitHub Pages** (currently deployed)
- ✅ **Netlify**
- ✅ **Vercel**
- ✅ **Firebase Hosting**
- ✅ **Any static file server**

No backend required - everything runs in the browser!

---

## 📝 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/madramdesign/ff1-slider-puzzle.git
   cd ff1-slider-puzzle
   ```

2. **Open in browser**:
   ```bash
   # Simply open index.html in your web browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **That's it!** No build process or dependencies needed.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📄 License

This project is open source and available for educational and personal use.

---

## 🙏 Acknowledgments

- Final Fantasy 1 by Square Enix
- A* and IDA* algorithms for optimal pathfinding
- Manhattan Distance and Linear Conflict heuristics

---

## 💡 Tips

- **Double-digit numbers**: Type `10`, `11`, `12`, `13`, `14`, or `15` directly
- **Quick input**: Use Tab to move between cells quickly
- **Random puzzles**: Click "Random Puzzle" to test with a solvable configuration
- **Visualization**: Use "Play Solution" to see each step animated

---

**Made with ❤️ for Final Fantasy 1 players**
