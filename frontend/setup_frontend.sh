#!/usr/bin/env bash
set -e

# Step 0: Ensure we are at repo root
git_root=$(git rev-parse --show-toplevel)
cd "$git_root"

# Remove nested .git inside frontend if it exists
if [ -d "frontend/.git" ]; then
  rm -rf frontend/.git
  echo "Removed nested .git in frontend"
  git rm -r --cached frontend/.git 2>/dev/null || true
  git commit -m "chore: remove stray .git from frontend" || true
fi

# Step 1: Create package.json
cat > frontend/package.json <<'EOF'
{
  "name": "frontend",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
EOF

git add frontend/package.json
git commit -m "feat: add fresh package.json for Vite + React" || true

# Step 2: Add vite.config.js
cat > frontend/vite.config.js <<'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
EOF

git add frontend/vite.config.js
git commit -m "feat: add Vite config for JSX" || true

# Step 3: Add index.html at PROJECT ROOT (Vite requires this, not in public/)
# FIX: original script put this in frontend/public/index.html, which Vite
# does NOT use as an entry point. It must be at frontend/index.html.
mkdir -p frontend/public
cat > frontend/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kanban App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

git add frontend/index.html
git commit -m "chore: add index.html at Vite project root" || true

# Step 4: Add src/App.jsx
cat > frontend/src/App.jsx <<'EOF'
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  return <Outlet />;
}
EOF

git add frontend/src/App.jsx
git commit -m "feat: create App.jsx with Outlet" || true

# Step 5: Confirm frontend/.gitignore properly excludes node_modules
# FIX: check the frontend-local .gitignore first instead of blindly
# appending a differently-scoped entry to the root .gitignore.
if [ -f "frontend/.gitignore" ] && grep -q "node_modules" frontend/.gitignore; then
  echo "frontend/.gitignore already excludes node_modules — OK"
else
  echo "node_modules" >> frontend/.gitignore
  echo "dist" >> frontend/.gitignore
  git add frontend/.gitignore
  git commit -m "chore: ensure frontend/.gitignore excludes node_modules and dist" || true
fi

# Step 6: Install dependencies
cd frontend
npm install
cd ..

# FIX: do NOT stage node_modules at all. Only stage the lock file.
# Verify gitignore is actually working before committing.
if git check-ignore -q frontend/node_modules; then
  echo "node_modules correctly ignored — safe to proceed"
else
  echo "WARNING: node_modules is NOT ignored by git. Aborting before committing."
  echo "Fix frontend/.gitignore manually, then re-run from Step 6."
  exit 1
fi

git add frontend/package-lock.json
git commit -m "chore: add package-lock.json after npm install" || true

# Step 7: Verify build actually succeeds (no masking failures)
cd frontend
npm run build
build_status=$?
cd ..

if [ $build_status -ne 0 ]; then
  echo "BUILD FAILED — see output above. Not committing further."
  exit 1
fi

echo "Vite + React build succeeded"

# Step 8: Final sanity check — confirm node_modules never got committed
if git ls-files frontend/node_modules | grep -q .; then
  echo "WARNING: node_modules files are tracked in git! Run:"
  echo "  git rm -r --cached frontend/node_modules"
  echo "  git commit -m 'fix: remove accidentally tracked node_modules'"
  exit 1
else
  echo "Confirmed: node_modules is not tracked in git. Clean."
fi

echo ""
echo "=== Setup complete ==="
echo "Next: cd frontend && npm run dev"
echo "Then separately start the Laravel backend (see README.md)"