import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

function App() {
  const [videoId, setVideoId] = useState('VIDEO_ID');

  const handleChangeVideoId = (event) => {
    setVideoId(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6">
        <div className="mb-6">
          <label htmlFor="videoId" className="block text-gray-800 font-bold mb-2">
            Enter the Video ID
          </label>
          <input
            type="text"
            id="videoId"
            value={videoId}
            onChange={handleChangeVideoId}
            placeholder="Enter YouTube video ID"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
          />
        </div>
        <VideoPlayer videoId={videoId} />
      </div>
    </div>
  );
}

export default App;