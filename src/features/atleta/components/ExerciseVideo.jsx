import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export const ExerciseVideo = ({ videoUrl }) => {
  const player = useVideoPlayer(videoUrl, player => {
    player.loop = true;
  });

  return (
    <View style={styles.videoContainer}>
      <VideoView
        style={styles.video}
        player={player}
        fullscreenOptions={{
          visible: true
        }}
        contentFit="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
