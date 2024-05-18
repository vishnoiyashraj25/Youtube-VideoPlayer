import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

const VideoPlayer = ({ videoId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [timestamp, setTimestamp] = useState(0);
  const [editingNote, setEditingNote] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const playerRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem(`notes-${videoId}`)) || [];
    setNotes(storedNotes);

    // Fetch video data when videoId changes
    if (videoId) {
      fetchVideoData(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    localStorage.setItem(`notes-${videoId}`, JSON.stringify(notes));
  }, [notes, videoId]);

  const YOUR_API_KEY = 'AIzaSyDYqByZmqe53wSVazlR2Ac09hIrPCcbWqo';

  const fetchVideoData = async (videoId) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUR_API_KEY}&part=snippet`);
      setVideoData(response.data.items[0].snippet);
    } catch (error) {
      console.error('Error fetching video data:', error);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, { note: newNote, timestamp, date: new Date().toLocaleString() }]);
      setNewNote('');
      setShowInput(false);
    }
  };

  const handleEditNote = (noteIndex) => {
    setEditingNote(noteIndex);
    setNewNote(notes[noteIndex].note);
    setShowInput(true);
  };

  const handleUpdateNote = (noteIndex) => {
    const updatedNotes = [...notes];
    updatedNotes[noteIndex].note = newNote;
    setNotes(updatedNotes);
    setEditingNote(null);
    setNewNote('');
    setShowInput(false);
  };

  const handleDeleteNote = (noteIndex) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(noteIndex, 1);
    setNotes(updatedNotes);
  };

  const handleSeekToTimestamp = (timestamp) => {
    window.scrollTo({
      top: playerRef.current.offsetTop,
      behavior: 'smooth',
    });
    playerRef.current.seekTo(timestamp);
  };

  const toggleShowFullDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-gray-100 rounded-xl shadow-xl p-6">
        <div className="relative aspect-video mb-4">
          {videoId ? (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${videoId}`}
              controls
              width="100%"
              height="100%"
              onProgress={(progress) => setTimestamp(progress.playedSeconds)}
              ref={playerRef}
              className="absolute inset-0 rounded-lg"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">No video selected</p>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{videoData?.title || 'Loading...'}</h3>
          <div className="text-gray-600 mb-4">
            {videoData?.description ? (
              <>
                {showFullDescription ? (
                  videoData.description
                ) : (
                  `${videoData.description.split(' ').slice(0, 30).join(' ')}...`
                )}
                <button
                  className="text-blue-500 hover:text-blue-700 ml-2"
                  onClick={toggleShowFullDescription}
                >
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              </>
            ) : (
              'Loading...'
            )}
          </div>
        
        </div>

        {showInput ? (
          <div className="mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note"
              className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={editingNote === null ? handleAddNote : () => handleUpdateNote(editingNote)}
              className="w-full px-4 py-2 bg-sky-300 text-black rounded-lg hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {editingNote === null ? 'Add Note' : 'Update Note'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="w-full px-4 py-2 mb-2 bg-sky-300 text-black rounded-lg hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add your note
          </button>
        )}
        <div className="bg-gray-300 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold text-black">My notes</h3>
            <p className="text-m text-black mb-2">
              All your notes at a single place. Click on any note to go to the specific timestamp in the video.
            </p>
          </div>
          {notes.map((note, index) => (
            <div key={index} className="bg-gray-600 p-4 rounded-lg mb-2 shadow-sm flex justify-between items-start">
              <div
                className="cursor-pointer hover:text-indigo-400"
                onClick={() => handleSeekToTimestamp(note.timestamp)}
              >
                <p className="text-gray-200">Timestamp: {new Date(note.timestamp * 1000).toISOString().substr(11, 8)}</p>
                <p className="text-gray-200">Date: {note.date}</p>
                <p className="text-gray-200 mt-2">Note: {note.note}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => handleEditNote(index)}
                  className="px-3 py-1 bg-back text-black rounded-lg mr-2 hover:bg-effect focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;