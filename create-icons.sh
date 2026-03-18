#!/bin/bash

convert -size 192x192 -background "#1a1a2e" -fill "#f59e0b" \
  -font Arial -pointsize 60 -gravity center \
  -annotate 0 "Г" \
  icon-192.png

convert -size 512x512 -background "#1a1a2e" -fill "#f59e0b" \
  -font Arial -pointsize 180 -gravity center \
  -annotate 0 "Г" \
  icon-512.png
