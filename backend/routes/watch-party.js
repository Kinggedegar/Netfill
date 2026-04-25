import express from 'express';
import { db, runQuery, runInsert, runUpdate } from '../db/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Generate room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a watch party
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { movieId, title } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({ error: 'Movie ID and title required' });
    }

    const roomCode = generateRoomCode();

    // Create party
    const partyResult = await runInsert(
      `INSERT INTO watch_parties (room_code, creator_id, movie_id, title, status, is_playing)
       VALUES (?, ?, ?, ?, 'active', 0)`,
      [roomCode, req.userId, movieId, title]
    );

    // Add creator as participant
    await runInsert(
      `INSERT INTO watch_party_participants (party_id, user_id)
       VALUES (?, ?)`,
      [partyResult.id, req.userId]
    );

    res.status(201).json({
      partyId: partyResult.id,
      roomCode,
      creatorId: req.userId,
      title,
      status: 'active'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join a watch party
router.post('/join', verifyToken, async (req, res) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ error: 'Room code required' });
    }

    // Find party
    const parties = await runQuery(
      'SELECT * FROM watch_parties WHERE room_code = ? AND status = "active"',
      [roomCode]
    );

    if (parties.length === 0) {
      return res.status(404).json({ error: 'Room not found or inactive' });
    }

    const party = parties[0];

    // Check if already a participant
    const existing = await runQuery(
      'SELECT id FROM watch_party_participants WHERE party_id = ? AND user_id = ?',
      [party.id, req.userId]
    );

    if (existing.length === 0) {
      // Add as participant
      await runInsert(
        `INSERT INTO watch_party_participants (party_id, user_id)
         VALUES (?, ?)`,
        [party.id, req.userId]
      );
    }

    res.json({
      partyId: party.id,
      roomCode: party.room_code,
      title: party.title,
      movieId: party.movie_id,
      creatorId: party.creator_id,
      currentTime: party.current_time,
      isPlaying: party.is_playing === 1,
      participants: await getParticipantCount(party.id)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get party details
router.get('/party/:partyId', verifyToken, async (req, res) => {
  try {
    const parties = await runQuery(
      'SELECT * FROM watch_parties WHERE id = ?',
      [req.params.partyId]
    );

    if (parties.length === 0) {
      return res.status(404).json({ error: 'Party not found' });
    }

    const party = parties[0];
    const participants = await runQuery(
      `SELECT u.id, u.username, u.avatar FROM watch_party_participants wp
       JOIN users u ON wp.user_id = u.id
       WHERE wp.party_id = ? AND wp.left_at IS NULL`,
      [party.id]
    );

    res.json({
      ...party,
      isPlaying: party.is_playing === 1,
      participants: participants || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update sync state (play/pause/seek)
router.post('/party/:partyId/sync', verifyToken, async (req, res) => {
  try {
    const { currentTime, isPlaying } = req.body;

    // Only creator can update sync state
    const parties = await runQuery(
      'SELECT creator_id FROM watch_parties WHERE id = ?',
      [req.params.partyId]
    );

    if (parties.length === 0) {
      return res.status(404).json({ error: 'Party not found' });
    }

    if (parties[0].creator_id !== req.userId) {
      return res.status(403).json({ error: 'Only creator can control playback' });
    }

    // Update sync state
    await runUpdate(
      'UPDATE watch_parties SET current_time = ?, is_playing = ? WHERE id = ?',
      [currentTime || 0, isPlaying ? 1 : 0, req.params.partyId]
    );

    res.json({ message: 'Sync updated', currentTime, isPlaying });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message/reaction
router.post('/party/:partyId/message', verifyToken, async (req, res) => {
  try {
    const { content, messageType, timestamp } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    const result = await runInsert(
      `INSERT INTO watch_party_messages (party_id, user_id, message_type, content, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.partyId, req.userId, messageType || 'chat', content, timestamp || 0]
    );

    res.status(201).json({
      messageId: result.id,
      userId: req.userId,
      content,
      messageType: messageType || 'chat',
      timestamp: timestamp || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages/reactions
router.get('/party/:partyId/messages', verifyToken, async (req, res) => {
  try {
    const messages = await runQuery(
      `SELECT wpm.*, u.username, u.avatar FROM watch_party_messages wpm
       JOIN users u ON wpm.user_id = u.id
       WHERE wpm.party_id = ?
       ORDER BY wpm.created_at DESC
       LIMIT 100`,
      [req.params.partyId]
    );

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave party
router.post('/party/:partyId/leave', verifyToken, async (req, res) => {
  try {
    await runUpdate(
      `UPDATE watch_party_participants SET left_at = CURRENT_TIMESTAMP
       WHERE party_id = ? AND user_id = ?`,
      [req.params.partyId, req.userId]
    );

    res.json({ message: 'Left party' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End party (creator only)
router.post('/party/:partyId/end', verifyToken, async (req, res) => {
  try {
    const parties = await runQuery(
      'SELECT creator_id FROM watch_parties WHERE id = ?',
      [req.params.partyId]
    );

    if (parties.length === 0) {
      return res.status(404).json({ error: 'Party not found' });
    }

    if (parties[0].creator_id !== req.userId) {
      return res.status(403).json({ error: 'Only creator can end party' });
    }

    await runUpdate(
      'UPDATE watch_parties SET status = "ended", ended_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.params.partyId]
    );

    res.json({ message: 'Party ended' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function
const getParticipantCount = async (partyId) => {
  const result = await runQuery(
    'SELECT COUNT(*) as count FROM watch_party_participants WHERE party_id = ? AND left_at IS NULL',
    [partyId]
  );
  return result[0]?.count || 0;
};

export default router;
