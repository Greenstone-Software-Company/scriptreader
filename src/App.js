import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ScriptReader = () => {
  const [script, setScript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, []);

  const processScript = (text) => {
    const lines = text.split('\n');
    return lines.map(line => {
      if (line.trim().toUpperCase() === line.trim()) {
        return { type: 'character', text: line };
      } else if (line.startsWith('(') && line.endsWith(')')) {
        return { type: 'action', text: line };
      } else {
        return { type: 'dialogue', text: line };
      }
    });
  };

  const speak = () => {
    const synth = window.speechSynthesis;
    const processedScript = processScript(script);

    processedScript.forEach((line, index) => {
      const u = new SpeechSynthesisUtterance(line.text);

      switch (line.type) {
        case 'character':
          u.pitch = 1.2;
          u.rate = 0.9;
          break;
        case 'action':
          u.pitch = 0.8;
          u.rate = 0.8;
          break;
        case 'dialogue':
          u.pitch = 1;
          u.rate = 1;
          break;
      }

      if (index === 0) {
        u.onstart = () => setIsPlaying(true);
      }
      if (index === processedScript.length - 1) {
        u.onend = () => setIsPlaying(false);
      }

      synth.speak(u);
    });
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Script Reader MVP</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your script here..."
          className="w-full h-64 mb-4"
        />
        <div className="flex justify-center space-x-4">
          <Button onClick={speak} disabled={isPlaying || !script}>
            {isPlaying ? 'Playing...' : 'Play Script'}
          </Button>
          <Button onClick={stopSpeaking} disabled={!isPlaying}>
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptReader;