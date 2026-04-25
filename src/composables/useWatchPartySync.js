import { ref, reactive } from 'vue'

/**
 * Watch Party Sync Manager Composable
 * Handles playback synchronization across participants
 */
export function useWatchPartySync() {
  // Party state
  const party = reactive({
    id: null,
    roomCode: null,
    movieId: null,
    isHost: false,
    currentTime: 0,
    isPlaying: false,
    participants: []
  })

  // Sync state
  const syncState = reactive({
    lastSyncTime: 0,
    syncInterval: 5000, // Sync every 5 seconds (host only)
    timeDrift: 0, // Difference between host time and local time
    isSyncing: false
  })

  // Control state
  const controls = reactive({
    play: false,
    pause: false,
    seek: false
  })

  let syncTimer = null
  let hostCheckTimer = null

  /**
   * Initialize watch party
   */
  const initializeParty = (partyData) => {
    party.id = partyData.id
    party.roomCode = partyData.roomCode
    party.movieId = partyData.movieId
    party.isHost = partyData.isHost
    party.currentTime = partyData.currentTime || 0
    party.isPlaying = partyData.isPlaying || false
    party.participants = partyData.participants || []
  }

  /**
   * Sync playback state with server
   * Only the host should call this
   */
  const syncPlaybackState = async (currentTime, isPlaying) => {
    if (!party.isHost || !party.id) return

    try {
      syncState.isSyncing = true
      const response = await fetch(
        `http://localhost:5000/api/watch-party/party/${party.id}/sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            currentTime: Math.round(currentTime),
            isPlaying: isPlaying
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        syncState.lastSyncTime = Date.now()
        return data
      }
    } catch (err) {
      console.error('Failed to sync playback state:', err)
    } finally {
      syncState.isSyncing = false
    }
  }

  /**
   * Fetch latest party state from server
   * Non-hosts call this to stay synced with host
   */
  const fetchPartyState = async () => {
    if (!party.id) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/watch-party/party/${party.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        // Update party state
        party.currentTime = data.currentTime
        party.isPlaying = data.isPlaying
        party.participants = data.participants || []

        // Calculate time drift (how much we differ from host)
        syncState.timeDrift = Math.abs(data.currentTime - party.currentTime)

        return data
      }
    } catch (err) {
      console.error('Failed to fetch party state:', err)
    }
  }

  /**
   * Handle local play event - update host
   */
  const handlePlay = async (currentTime) => {
    controls.play = true
    party.isPlaying = true
    party.currentTime = currentTime

    if (party.isHost) {
      await syncPlaybackState(currentTime, true)
    }
  }

  /**
   * Handle local pause event - update host
   */
  const handlePause = async (currentTime) => {
    controls.pause = true
    party.isPlaying = false
    party.currentTime = currentTime

    if (party.isHost) {
      await syncPlaybackState(currentTime, false)
    }
  }

  /**
   * Handle local seek event - update host
   */
  const handleSeek = async (newTime) => {
    controls.seek = true
    party.currentTime = newTime

    if (party.isHost) {
      await syncPlaybackState(newTime, party.isPlaying)
    }
  }

  /**
   * Start continuous sync
   * Host syncs periodically, non-hosts fetch state periodically
   */
  const startSync = () => {
    // Clear existing timers
    stopSync()

    if (party.isHost) {
      // Host pushes state periodically
      syncTimer = setInterval(() => {
        if (!syncState.isSyncing) {
          syncPlaybackState(party.currentTime, party.isPlaying)
        }
      }, syncState.syncInterval)
    } else {
      // Non-host pulls state from host
      syncTimer = setInterval(() => {
        fetchPartyState()
      }, 3000) // More frequent for non-hosts (3s vs 5s for host)
    }
  }

  /**
   * Stop continuous sync
   */
  const stopSync = () => {
    if (syncTimer) {
      clearInterval(syncTimer)
      syncTimer = null
    }
  }

  /**
   * Leave party
   */
  const leaveParty = async () => {
    if (!party.id) return

    try {
      await fetch(`http://localhost:5000/api/watch-party/party/${party.id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (err) {
      console.error('Failed to leave party:', err)
    } finally {
      stopSync()
      resetParty()
    }
  }

  /**
   * End party (host only)
   */
  const endParty = async () => {
    if (!party.isHost || !party.id) return

    try {
      await fetch(`http://localhost:5000/api/watch-party/party/${party.id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (err) {
      console.error('Failed to end party:', err)
    } finally {
      stopSync()
      resetParty()
    }
  }

  /**
   * Reset party state
   */
  const resetParty = () => {
    party.id = null
    party.roomCode = null
    party.movieId = null
    party.isHost = false
    party.currentTime = 0
    party.isPlaying = false
    party.participants = []
    
    syncState.lastSyncTime = 0
    syncState.timeDrift = 0
    syncState.isSyncing = false
    
    controls.play = false
    controls.pause = false
    controls.seek = false
  }

  /**
   * Get current sync status
   */
  const getSyncStatus = () => {
    return {
      isSync: syncState.timeDrift < 1, // Within 1 second = synced
      timeDrift: syncState.timeDrift,
      isSyncing: syncState.isSyncing,
      isHost: party.isHost,
      participantCount: party.participants.length
    }
  }

  return {
    party,
    syncState,
    controls,
    initializeParty,
    syncPlaybackState,
    fetchPartyState,
    handlePlay,
    handlePause,
    handleSeek,
    startSync,
    stopSync,
    leaveParty,
    endParty,
    getSyncStatus
  }
}
