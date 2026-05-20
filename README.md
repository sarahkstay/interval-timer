# Interval Timer

A browser-based interval timer for HIIT workouts, physiotherapy exercises, or
anything else that follows a work/rest pattern.

In Oct 2025, I pulled a muscle in my back and had to do physiotherapy 3-5 times a week. Every interval timer app I tried either couldn't loop infinitely, or required me to look at my phone/watch instead of maintaining my form during an exercise. Instead of trying endless apps trying to find the Goldilocks solution, I built it myself. 

This interval timer is simple. It lets you define your work/rest periods, how many cycles you want (or an infinite option too) and plays an audio chime at each transition so I don't have to turn my head to look at a phone to know when to switch between exercises. It doesn't have to only be used for PT - it also functions well for HIIT workouts, or any other timer-based workouts (interval running also happens to be my favourite!)

## What it does

- Set custom **work** and **rest** durations (in seconds)
- Run for a fixed number of rounds or toggle **infinite mode** to cycle
  until you stop it
- **Audio cues** at each transition — different tones for work vs. rest so
  you know which phase is starting without looking
- Pause, resume, skip to the next interval, or reset at any time
- Progress bar shows how far through the current interval you are

## Live demo

**[sarahkstay.github.io/interval-timer](https://sarahkstay.github.io/interval-timer/)**

## Tech stack

React, TypeScript, Vite, Tailwind CSS, shadcn/ui

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:8080`.
