import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings, SkipForward } from "lucide-react";
import { toast } from "sonner";

type TimerState = "idle" | "work" | "rest";

export const IntervalTimer = () => {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [rounds, setRounds] = useState(8);
  const [infinite, setInfinite] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);
  
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play beep sound
  const playBeep = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Transition to next state
          if (timerState === "work") {
            playBeep(800, 0.3); // Higher pitch for rest
            toast.success("Rest Time!");
            setTimerState("rest");
            return restTime;
          } else if (timerState === "rest") {
            if (!infinite && currentRound >= rounds) {
              // Workout complete
              playBeep(1000, 0.5);
              toast.success("Workout Complete! 🎉");
              handleReset();
              return 0;
            } else {
              // Next round
              playBeep(600, 0.3); // Lower pitch for work
              toast.success(`Round ${currentRound + 1} - Work!`);
              setCurrentRound((r) => r + 1);
              setTimerState("work");
              return workTime;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerState, currentRound, rounds, workTime, restTime, infinite]);

  const handleStart = () => {
    if (isConfiguring) {
      if (workTime < 1 || restTime < 1 || (!infinite && rounds < 1)) {
        toast.error("Please enter valid timer values");
        return;
      }
      setIsConfiguring(false);
      setTimerState("work");
      setTimeRemaining(workTime);
      setCurrentRound(1);
      playBeep(600, 0.3);
      toast.success("Let's go! 💪");
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleSkip = () => {
    if (timerState === "work") {
      playBeep(800, 0.3);
      toast.success("Rest Time!");
      setTimerState("rest");
      setTimeRemaining(restTime);
    } else if (timerState === "rest") {
      if (!infinite && currentRound >= rounds) {
        playBeep(1000, 0.5);
        toast.success("Workout Complete! 🎉");
        handleReset();
      } else {
        playBeep(600, 0.3);
        toast.success(`Round ${currentRound + 1} - Work!`);
        setCurrentRound((r) => r + 1);
        setTimerState("work");
        setTimeRemaining(workTime);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimerState("idle");
    setTimeRemaining(0);
    setCurrentRound(1);
    setIsConfiguring(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = timerState === "work" 
    ? ((workTime - timeRemaining) / workTime) * 100
    : ((restTime - timeRemaining) / restTime) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl p-8">
        {isConfiguring ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Interval Timer</h1>
              <p className="text-muted-foreground">Configure your workout</p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="work-time" className="text-lg">Work Period (seconds)</Label>
                <Input
                  id="work-time"
                  type="number"
                  min="1"
                  value={workTime}
                  onChange={(e) => setWorkTime(parseInt(e.target.value) || 0)}
                  className="text-xl h-14"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rest-time" className="text-lg">Rest Period (seconds)</Label>
                <Input
                  id="rest-time"
                  type="number"
                  min="1"
                  value={restTime}
                  onChange={(e) => setRestTime(parseInt(e.target.value) || 0)}
                  className="text-xl h-14"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rounds" className="text-lg">Number of Rounds</Label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={infinite}
                      onChange={(e) => setInfinite(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-muted-foreground">Infinite</span>
                  </label>
                </div>
                <Input
                  id="rounds"
                  type="number"
                  min="1"
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value) || 0)}
                  disabled={infinite}
                  className="text-xl h-14"
                />
              </div>
            </div>

            <Button 
              onClick={handleStart} 
              size="lg" 
              className="w-full h-16 text-xl"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Workout
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div 
              className={`text-center transition-all duration-500 rounded-2xl p-8 ${
                timerState === "work" 
                  ? "bg-work text-work-foreground shadow-[0_0_50px_rgba(34,197,94,0.3)]" 
                  : "bg-rest text-rest-foreground shadow-[0_0_50px_rgba(251,191,36,0.3)]"
              }`}
            >
              <div className="text-2xl font-semibold mb-2 uppercase tracking-wider">
                {timerState === "work" ? "WORK" : "REST"}
              </div>
              <div className="text-8xl md:text-9xl font-bold mb-4 tabular-nums">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xl">
                Round {currentRound}{!infinite && ` / ${rounds}`}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${
                  timerState === "work" ? "bg-work-glow" : "bg-rest-glow"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex gap-4">
              {isRunning ? (
                <Button 
                  onClick={handlePause} 
                  size="lg" 
                  variant="secondary"
                  className="flex-1 h-16 text-xl"
                >
                  <Pause className="mr-2 h-6 w-6" />
                  Pause
                </Button>
              ) : (
                <Button 
                  onClick={handleStart} 
                  size="lg" 
                  className="flex-1 h-16 text-xl"
                >
                  <Play className="mr-2 h-6 w-6" />
                  Resume
                </Button>
              )}
              <Button 
                onClick={handleSkip} 
                size="lg" 
                variant="outline"
                className="flex-1 h-16 text-xl"
              >
                <SkipForward className="mr-2 h-6 w-6" />
                Skip
              </Button>
              <Button 
                onClick={handleReset} 
                size="lg" 
                variant="outline"
                className="flex-1 h-16 text-xl"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
