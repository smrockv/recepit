import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ImageAnalysisSectionProps {
  selectedFile: File | null;
}

export default function ImageAnalysisSection({selectedFile}: ImageAnalysisSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const processReceipt = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      setError('Gemini API key not found in local storage.');
      setIsLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = (reader.result as string).split(',')[1];

        const prompt = "Extract the following information from this receipt: Store name, purchase date, a list of purchased items (item name, quantity, unit price, tax rate if available, sub total for the item), subtotal, total amount (including tax), and payment method (cash or credit card). Provide the output in a structured JSON format with keys like 'storeName', 'purchaseDate', 'items', 'subtotal', 'total', 'paymentMethod'. The 'items' should be an array of objects, each with 'itemName', 'quantity', 'unitPrice', 'taxRate', and 'itemSubtotal'.";

        const result = await model.generateContent([prompt, { inlineData: { mimeType: file.type, data: base64Image } }]);
        const response = await result.response;
        const text = response.text().replace('```json', '').replace('```', '')
        console.log("Raw API Response:", text);

        try {
          const parsedResult = JSON.parse(text);
          setResult(parsedResult);

          // Send data to Google Sheets
          const scriptUrl = 'https://script.google.com/macros/s/AKfycbznoA3AjHeGUntu8y1fAfF4bI0motkJi8KXmMNOY4ir5cZ2CGdQD6bVueWmmFbMftzHKA/exec';
          try {
            const postResponse = await fetch(scriptUrl, {
              method: 'POST',
              mode: "no-cors",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(parsedResult),
            });
            console.log('Data sent to Google Sheets:', postResponse.ok);
          } catch (postError) {
            console.error('Error sending data to Google Sheets:', postError);
          }
        } catch (parseError) {
          setError('Failed to parse API response.');
          console.error('Parsing error:', parseError);
        }
      };
    } catch (apiError) {
      setError('Error processing receipt with Gemini API.');
      console.error('API error:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      processReceipt(selectedFile);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Button type="submit" variant="contained" fullWidth disabled={!selectedFile || isLoading}>
        解析
      </Button>
      {isLoading && <Typography variant="body1" sx={{ mt: 2 }}>処理中...</Typography>}
      {error && <Typography variant="body1" color="error" sx={{ mt: 2 }}>エラー: {error}</Typography>}
      {result && (
        <Box sx={{ mt: 2, border: '1px solid #ccc', p: 2 }}>
          <Typography variant="h6">抽出結果:</Typography>
          <Typography><strong>購入日:</strong> {result.purchaseDate}</Typography>
          <Typography><strong>店舗名:</strong> {result.storeName}</Typography>
          <Typography><strong>小計:</strong> {result.subtotal}</Typography>
          <Typography><strong>合計:</strong> {result.total}</Typography>
          <Typography><strong>支払い方法:</strong> {result.paymentMethod}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>購入アイテム:</Typography>
          <ul>
            {result.items.map((item: any, index: number) => (
              <li key={index}>
                <Typography>
                  {item.itemName} (数量: {item.quantity}, 単価: {item.unitPrice}, 税率: {item.taxRate}, 小計: {item.itemSubtotal})
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};

