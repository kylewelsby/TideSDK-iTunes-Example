tell application "System Events"
	set plyr to "{}"
	set loc to ""
	set trk to "{}"
	set rning to count (every process whose displayed name is "iTunes")
	if rning > 0 then
		tell application "iTunes"
			if player position is missing value then
				set pp to -1
			else
				set pp to player position
			end if
			set plyr to "{\"state\":\"" & (player state as text) & "\",\"position\":" & pp & "}"
			if player state is not stopped then
				if (get duration of current track) is not missing value then
					set loc to POSIX path of (get location of current track)
				end if
				set ct to current track
				set trk to "{"
				set trk to trk & "\"id\":\"" & (get id of ct) & "\","
				set trk to trk & "\"name\":\"" & (get name of ct) & "\","
				set trk to trk & "\"artist\":\"" & (get artist of ct) & "\","
				set trk to trk & "\"album\":\"" & (get album of ct) & "\","
				set trk to trk & "\"kind\":\"" & (get kind of ct) & "\","
				set trk to trk & "\"duration\":" & (get duration of ct) & ","
				set trk to trk & "\"bit_rate\":" & (get bit rate of ct) & ","
				set trk to trk & "\"sample_rate\":" & (get sample rate of ct) & ","
				set trk to trk & "\"track_number\":" & (get track number of ct) & ","
				set trk to trk & "\"year\":" & (get year of ct) & ","
				set trk to trk & "\"disc_number\":" & (get disc number of ct) & ","
				set trk to trk & "\"disc_count\":" & (get disc count of ct) & ","
				set trk to trk & "\"track_count\":" & (get track count of ct) & ","
				set trk to trk & "\"genre\":\"" & (get genre of ct) & "\","
				set trk to trk & "\"played_date\":\"" & (get played date of ct) & "\","
				set trk to trk & "\"rating\":" & (get rating of ct) & ","
				set trk to trk & "\"release_date\":\"" & (get release date of ct) & "\","
				set trk to trk & "\"size\":" & (get size of ct) & ""
				set trk to trk & "}"
			end if
		end tell
	end if
	
	return "{\"is_running\":" & rning & ",\"player\":" & plyr & ",\"location\":\"" & loc & "\",\"track\":" & trk & "}"
end tell