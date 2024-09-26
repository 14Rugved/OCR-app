import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import Tesseract from 'tesseract.js';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
// Get a reference to the storage service


const OcrApp = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets) {
        const selectedImage: Asset = response.assets[0];
        const selectedImageUri = selectedImage.uri;
        if (selectedImageUri) {
          setImageUri(selectedImageUri);
          extractText(selectedImageUri);
        }
      }
    });
  };

  const extractText = (imagePath: string) => {
    Tesseract.recognize(
      imagePath,
      'eng',
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      setExtractedText(text);
      extractDueDate(text);
    }).catch(error => {
      console.log('OCR error:', error);
    });
  };

  const extractDueDate = (text: string) => {
    const datePatterns = [
      /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/, // DD/MM/YYYY or DD-MM-YYYY
      /\b\d{4}[\/\-]\d{2}[\/\-]\d{2}\b/ // YYYY/MM/DD or YYYY-MM-DD
    ];

    for (const pattern of datePatterns) {
      const foundDueDate = text.match(pattern);
      if (foundDueDate) {
        setDueDate(foundDueDate[0]);
        return;
      }
    }

    setDueDate('No Due Date Found');
  };

  return (
    <View>
      <Button title="Select Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <Text>{extractedText}</Text>
      <Text>{dueDate ? `Extracted Due Date: ${dueDate}` : 'No Due Date Found'}</Text>
    </View>
  );
};

export default OcrApp;