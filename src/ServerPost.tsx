import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useBackdrop } from './context/BackdropContext';

interface Props {
  jsonData: any; // Define a more specific type if possible
}

function ServerPost({ jsonData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showBackdrop, hideBackdrop } = useBackdrop(); // BackdropContextから状態を取得

  const scriptUrl = localStorage.getItem('postUrl');
  if (!scriptUrl) {
    setError('POST URL not found in local storage.');
    return;
  }

  const sendDataToGoogleSheets = async () => {
    if (!jsonData) {
      setError('No data to send.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Using no-cors mode means we won't get a detailed response status,
      // but it can avoid CORS preflight issues with some Google Scripts configurations.
      const postResponse = await fetch(scriptUrl, {
        method: 'POST',
        mode: "no-cors",
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      console.log('Data sent to Google Sheets request initiated.', postResponse);

      // In no-cors mode, response.ok is always true for successful requests.
      // You'll need to rely on the Google Apps Script to handle errors and potentially signal success differently.
      // For this example, we'll assume the fetch request itself completing without a network error means success.
      setIsSuccess(true);

    } catch (postError) {
      console.error('Error sending data to Google Sheets:', postError);
      setError('An error occurred while sending data to the spreadsheet.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      showBackdrop();
    } else {
      hideBackdrop();
    }
  }, [isLoading])


  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        fullWidth
        onClick={sendDataToGoogleSheets}
      >
        スプレッドシートへ登録
      </Button>
      {/* isLoading && <Typography variant="body2" sx={{ mt: 1 }}>Registering...</Typography >*/}
      {/* error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>Error: {error}</Typography> */}
      {/* isSuccess && <Typography variant="body2" color="success" sx={{ mt: 1 }}>Successfully registered!</Typography> */}
    </Box>
  );
};

export default ServerPost;

