#!/bin/bash

echo "Installing KFA CLI..."

# Make kfa.js executable
chmod +x bin/kfa.js

# Link globally (requires npm)
npm link

echo ""
echo "KFA CLI installed successfully!"
echo ""
echo "Try running:"
echo "  kfa --version"
echo "  kfa --help"
echo "  kfa db status"
echo ""
