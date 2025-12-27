# FF1 Slider Puzzle Solver

A web application to help solve the slider puzzle mini-game in Final Fantasy 1. Simply enter your puzzle configuration and get the optimal solution!

## Features

- **Easy Input**: Click on cells to enter puzzle values
- **Visual Feedback**: See the puzzle state and solution steps
- **Step-by-Step Solution**: Watch the solution play out automatically
- **Solvability Check**: Validates if your puzzle is solvable before attempting to solve
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Click on cells in the 4x4 grid to enter the puzzle values as they appear in your game
   - Use `0` for the blank/empty space
   - Each number 1-15 should appear exactly once
3. Click "Solve Puzzle" to get the solution
4. Use "Play Solution" to watch the solution step-by-step
5. Click "Reset" to clear the puzzle and start over
6. Click "Random Puzzle" to generate a random solvable puzzle for testing

## Files

- `index.html` - Main HTML file
- `styles.css` - Styling and layout
- `solver.js` - Puzzle solving algorithm (A* with Manhattan distance heuristic)
- `app.js` - User interface logic
- `slider.py` - Original Python solver (reference)

## Hosting Online

To make this accessible online, you can:

1. **GitHub Pages**: Push to a GitHub repository and enable GitHub Pages
2. **Firebase Hosting**: Use Firebase Hosting (as per your project preferences)
3. **Any Static Host**: Upload the HTML, CSS, and JS files to any static hosting service

The app runs entirely client-side - no backend server required!

## Algorithm

The solver uses A* search with Manhattan distance and linear conflict heuristics, plus IDA* for complex puzzles. This guarantees finding the optimal solution (minimum number of moves) when one exists.

## GitHub Pages Setup

To host this on GitHub Pages:

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FF1 Slider Puzzle Solver"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages** (in the left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Choose branch: **main** (or **master**)
   - Choose folder: **/ (root)**
   - Click **Save**

3. **Access your site**:
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - It may take a few minutes to deploy initially

That's it! Your puzzle solver will be live on GitHub Pages. 🎉


