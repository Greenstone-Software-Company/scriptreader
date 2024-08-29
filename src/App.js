import React, { useState, useEffect } from 'react';

const ScriptReader = () => {
  const [script, setScript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

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
      const utterance = new SpeechSynthesisUtterance(line.text);

      switch (line.type) {
        case 'character':
          utterance.pitch = 1.2;
          utterance.rate = 0.9;
          break;
        case 'action':
          utterance.pitch = 0.8;
          utterance.rate = 0.8;
          break;
        case 'dialogue':
          utterance.pitch = 1;
          utterance.rate = 1;
          break;
      }

      if (index === 0) {
        utterance.onstart = () => setIsPlaying(true);
      }
      if (index === processedScript.length - 1) {
        utterance.onend = () => setIsPlaying(false);
      }

      synth.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Script Reader MVP</h1>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Paste your script here..."
        className="w-full h-64 p-2 border rounded mb-4"
      />
      <div className="flex justify-center space-x-4">
        <button
          onClick={speak}
          disabled={isPlaying || !script}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {isPlaying ? 'Playing...' : 'Play Script'}
        </button>
        <button
          onClick={stopSpeaking}
          disabled={!isPlaying}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default ScriptReader;