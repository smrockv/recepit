import { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useBackdrop } from './context/BackdropContext';
import ServerPost from './ServerPost';

interface ImageAnalysisSectionProps {
  selectedFile: File | null;
}

export default function ImageAnalys({ selectedFile }: ImageAnalysisSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [postData, setPostData] = useState<any>();
  const { showBackdrop, hideBackdrop } = useBackdrop(); // BackdropContextから状態を取得

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

        const prompt = "Extract the following information from this receipt: Store name, purchase date, a list of purchased items (item name, quantity, unit price, tax rate if available, sub total for the item), subtotal, total amount (including tax), and payment method (cash or credit card). If the store is OK Store, also extract the amount next to '食料品3/103割引'. Provide the output in a structured JSON format with keys like 'storeName', 'purchaseDate', 'items', 'subtotal', 'total', 'paymentMethod'. The 'items' should be an array of objects, each with 'itemName', 'quantity', 'unitPrice', 'taxRate', and 'itemSubtotal'. If the store is OK Store, add a key 'okStoreDiscount' with the extracted discount amount.";

        const result = await model.generateContent([prompt, { inlineData: { mimeType: file.type, data: base64Image } }]);
        const response = await result.response;
        const jsonText = response.text().replace('```json', '').replace('```', '')
        console.log("Raw API Response:", jsonText);
        
        const parsedResult = JSON.parse(jsonText);
        setResult(parsedResult);
        setPostData(JSON.stringify(parsedResult));
        setIsLoading(false);
      };
    } catch (e) {
      setError('Error processing receipt');
      console.error('error:', e);
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

  useEffect(() => {
    setResult(null);
  }, [selectedFile]);
  
  // const handleClick = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (selectedFile) {
  //     processReceipt(selectedFile);
  //   }
  // };
  const handleClick = () => {
    if (selectedFile) {
      processReceipt(selectedFile);
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      {selectedFile &&
        <Button type="button" onClick={handleClick} variant="contained" fullWidth>
          解析
        </Button>
      }
      {isLoading && <Typography variant="body1" sx={{ mt: 2 }}>処理中...</Typography> }
      {error && <Typography variant="body1" color="error" sx={{ mt: 2 }}>エラー: {error}</Typography> }
      {result && (
        <div>
          <Box sx={{ mt: 2, border: '1px solid #ccc', p: 2 }}>
            <Typography variant="h4" align={'center'} sx={{ mb: 2 }}>解析結果</Typography>
            <Typography><strong>購入日:</strong> {result.purchaseDate}</Typography>
            <Typography><strong>店舗名:</strong> {result.storeName}</Typography>
            <Typography><strong>小計:</strong> {result.subtotal}</Typography>
            <Typography><strong>合計:</strong> {result.total}</Typography>
            <Typography><strong>支払い方法:</strong> {result.paymentMethod}</Typography>
            {result.okStoreDiscount && <Typography><strong>食料品3/103割引:</strong> {result.okStoreDiscount}</Typography>}
            <Typography variant="h5" align={'center'} sx={{ mt: 2 }}>購入アイテム</Typography>
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
          <ServerPost jsonData={postData} />
        </div>
      )}
    </Box>
  );
};

