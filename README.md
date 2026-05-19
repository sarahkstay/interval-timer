# Interval Timer

A browser-based interval timer for HIIT workouts, physiotherapy exercises, or
anything else that follows a work/rest pattern.

I built this because every interval timer app I tried either couldn't loop
infinitely or required me to watch my phone screen to know when to switch
exercises. This one plays an audio chime at each transition so I can leave my
phone across the room and just listen for the bell.

## What it does

- Set custom **work** and **rest** durations (in seconds)
- Run for a fixed number of rounds or toggle **infinite mode** to cycle
  until you stop it
- **Audio cues** at each transition — different tones for work vs. rest so
  you know which phase is starting without looking
- Pause, resume, skip to the next interval, or reset at any time
- Progress bar shows how far through the current interval you are

## Live demo

**[rah711.github.io/interval-timer](https://rah711.github.io/interval-timer/)**

## Tech stack

React, TypeScript, Vite, Tailwind CSS, shadcn/ui

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:8080`.
