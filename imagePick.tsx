import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { storage } from '@react-native-firebase/storage';

const MyComponent = () => {
  const [imageUri, setImageUri] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleSelectImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        const selectedImage = response.assets[0].uri;
        setImageUri(selectedImage);

        // Upload the image to Firebase Storage
        const reference = storage().ref('images/' + new Date().getTime() + '.jpg');
        reference.putFile(selectedImage)
          .then(() => {
            // Get the download URL
            reference.getDownloadURL()
              .then(url => setImageUrl(url))
              .catch(error => console.error('Error getting download URL:', error));
          })
          .catch(error => console.error('Error uploading image:', error));
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={handleSelectImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default MyComponent;